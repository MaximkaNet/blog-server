const ApiError = require("../../exceptions/api_error");
const ApiMessage = require("../../exceptions/api_message");
const Comment = require("../comment/comment_model");
const { Post } = require("../post/post_model");
const { User } = require("../user/user_model");

class CommentService {
    /**
     * Create a comment
     * @param {number} postId 
     * @param {number} userId 
     * @param {string} text 
     * @returns {Promise<Model>}
     */
    async create(postId, userId, text) {
        const postData = await Post.findOne({ where: { id: postId } })
        if (!postData)
            throw ApiError.BadRequest(`Post ${postId} is not found`)
        const userData = await User.findOne({ where: { id: userId } })
        if (!userData)
            throw ApiError.BadRequest(`User ${userId} is not found`)

        const commentData = await Comment.create({ text })
        await commentData.setUser(userData)
        await postData.addComment(commentData)

        return commentData
    }
    /**
     * Reply to comment
     * @param {number} commentId 
     * @param {number} userId 
     * @param {string} text 
     * @returns {Promise<Model>}
     */
    async reply(commentId, userId, text) {
        const commentData = await Comment.findOne({ where: { id: commentId } })
        if (!commentData)
            throw ApiError.BadRequest(`Comment ${commentId} is not found`)
        const userData = await User.findOne({ where: { id: userId } })
        if (!userData)
            throw ApiError.BadRequest(`User ${userId} is not found`)

        const replyData = await Comment.create({ postId: commentData.post_id, userId, reply_id: commentData.id, text })

        return replyData
    }

    /**
     * Edit comment by id
     * @param {number} commentId 
     * @param {string} text 
     * @returns {Promise<Model>}
     */
    async edit(commentId, text) {
        const commentData = await Comment.findOne({ where: { id: commentId } })
        if (!commentData)
            throw ApiError.BadRequest(`Comment ${commentId} is not found.`)

        commentData.text = text
        await commentData.save()

        return commentData
    }

    /**
     * Delete comment by id
     * @param {number} commentId 
     * @returns {Promise<Model>}
     */
    async delete(commentId) {
        const commentData = await Comment.destroy({ where: { id: commentId } })

        return commentData === 0 ? ApiError.BadRequest('Comment is not found') : ApiMessage.OK('Comment deleted', { rowsAffected: commentData })
    }

    /**
     * Get all comments for the post
     * @param {number} postId 
     * @returns {Promise<Model>}
     */
    async getComments(postId) {
        const comments = await Comment.findAll({ where: { postId }, include: Comment })
        return comments
    }
}

module.exports = new CommentService()