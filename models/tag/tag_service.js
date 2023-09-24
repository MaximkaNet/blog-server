const ApiError = require("../../exceptions/api_error")
const ApiMessage = require("../../exceptions/api_message")
const Tag = require("./tag_model")

class TagService {
    /**
     * Create a new tag
     * @param {string} tag 
     * @returns {Promise<Model>}
     */
    async create(tag) {
        const tagData = await Tag.create({ tag })
        if (!tagData) throw ApiError.BadRequest('Title will not be empty.')
        return tagData
    }

    /**
     * Edit a tag by id
     * @param {number} tagId 
     * @param {string} newTag 
     * @returns {Promise<ApiMessage>}
     */
    async edit(tagId, newTag) {
        const tagData = await Tag.findOne({ where: { id: tagId } })
        if (!tagData) throw ApiError.BadRequest('Tag not found')
        tagData.tag = newTag
        await tagData.save()

        return ApiMessage.OK('Tag renamed')
    }

    /**
     * Delete tag by id permanenlty
     * @param {number} tagId 
     * @returns {Promise<ApiError | ApiMessage>}
     */
    async delete(tagId) {
        const tagData = await Tag.destroy({ where: { id: tagId } })
        if (tagData === 0) throw ApiError.BadRequest('Tag not found')
        return ApiMessage.OK('Tag deleted', { rowsAffected: tagData })
    }

    /**
     * Get all tags
     * @returns {Promise<Model[]>}
     */
    async getAll() {
        const tags = await Tag.findAll()

        return tags
    }
}

module.exports = new TagService()