const { Post, STATUS: POST_STATUS } = require('./post_model')
const { User } = require('../user/user_model')
const Topic = require('../topic/topic_model')
const Tag = require('../tag/tag_model')

const ApiError = require('../../exceptions/api_error')
const ApiMessage = require('../../exceptions/api_message')

class PostService {
    /**
     * Create a new post
     * @param {number} userId 
     * @param {number} topicId 
     * @param {string} title 
     * @param {string} content 
     * @returns {Promise<{id: number}>}
     */
    async create(userId, topicId, title, content) {
        if (!title || !content) throw ApiError.BadRequest("Title or content is empty.")

        const userData = await User.findOne({ where: { id: userId } })
        // if the user does not want to attach a post to a topic, it will not be attached to it
        const topicData = topicId ? await Topic.findOne({ where: { id: topicId } }) : null

        if (!userData) throw ApiError.BadRequest("User not found.")
        if (!topicData && topicId) throw ApiError.BadRequest("Topic not found.")

        const postData = await Post.create({ title, content })

        await postData.setUser(userData)
        if (topicData) await postData.setTopic(topicData)

        return { id: postData.id }
    }

    /**
     * Get the post by id
     * @param {number} postId 
     */
    async get(postId) {
        const postData = await Post.findOne({ where: { id: postId }, include: [Tag, Topic] })
        return postData
    }

    /**
     * Edit values of post
     * @param {number} postId 
     * @param {{
     *  title: string;
     *  content: string;
     *  status: string;
     *  topicId: number;
     *  tags: [{
     *      method?: string;
     *      id: number;
     *  }]
     * }} values 
     */
    async edit(postId, values) {
        const { title, content, status, topicId, tags } = values

        const postData = await Post.findOne({ where: { id: postId } })
        if (!postData) throw ApiError.BadRequest(`Post ${postId} not found.`)

        if (title) postData.title = title

        if (content) postData.content = content

        if (status) {
            const {
                DRAFT,
                PUBLISH,
                TRASH
            } = POST_STATUS

            // Set status actions
            const statusActions = {
                [DRAFT]: { status: DRAFT },
                [PUBLISH]: { status: PUBLISH, datetimePublish: new Date(Date.now()) },
                [TRASH]: { status: TRASH, datetimePublish: null },
            }

            // Set status
            if (statusActions.hasOwnProperty(status)) Object.assign(postData, statusActions[status])
            else throw ApiError.BadRequest("Unknown status")
        }

        if (topicId) {
            // Check topic id
            const topicData = await Topic.findOne({ where: { id: topicId } })
            if (!topicData) throw ApiError.BadRequest(`Topic '${values.topicId}' is not found!`)
            postData.topicId = topicData.id
        }

        if (tags) {
            // Find tags
            const tagsData = await Tag.findAll({
                where: {
                    id: tags.map(el => el.id)
                }
            })

            // Sorting tag models
            const addTags = []
            const removeTags = []

            tagsData.forEach(tag => {
                // Find items
                const item = tags.find(_tag => _tag.id === tag.id)
                // Get method from item. If not exist set default method - add
                const method = item.method ? item.method : "add"
                if (method === "add") addTags.push(tag)
                else removeTags.push(tag)
            })

            // Add tags to post
            if (addTags.length > 0) await postData.addTags(addTags)
            // Remove tags
            if (removeTags.length > 0) await postData.removeTags(removeTags)
        }

        // Save post
        await postData.save()

        return ApiMessage.OK(`Post ${postData.id} was updated`, postData)
    }

    /**
     * Delete the post by id permanently
     * @param {number} postId 
     * @returns {Promise<ApiError | ApiMessage>}
     */
    async delete(postId) {
        const postData = await Post.destroy({ where: { id: postId } })
        if (postData === 0) throw ApiError.BadRequest('Post is not found')
        return ApiMessage.OK('Post deleted', { rowsAffected: postData })
    }

    /**
     * Get last records
     * @default count = 10, page = 0
     * @param {{
     * tagId?: number;
     * topicId?: number;
     * page?: number,
     * count?: number
     * }} options
     * @returns {Promise<Model[]>}
     */
    async getLast({ count, page, tagId, topicId }) {
        const limit = count ? count : 10
        const offset = limit * (page ? page : 0)

        const posts = await Post.findAll({
            limit: limit,
            offset: offset,
            include: [{
                model: Tag,
                where: tagId ? { id: tagId } : {} // TODO: Pull all tags to the post
            }, {
                model: Topic,
                where: topicId ? { id: topicId } : {}
            }]
        })
        return posts
    }
}

module.exports = new PostService()