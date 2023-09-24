const TopicModel = require("./topic_model")

const ApiError = require("../../exceptions/api_error")
const ApiMessage = require("../../exceptions/api_message")

class TopicService {
    /**
     * Create a topic
     * @param {string} topic 
     * @returns {Promise<Model<any, any>>}
     */
    async create(topic) {
        const topicData = await TopicModel.create({ topic })
        if (!topicData) throw ApiError.BadRequest('Topic name will not be empty!')

        return topicData
    }

    /**
     * Edit topic
     * @param {number} topicId 
     * @param {string} newTopic 
     * @returns {Promise<ApiMessage>}
     */
    async edit(topicId, newTopic) {
        const topicData = await TopicModel.findOne({ where: { id: topicId } })
        if (!topicData) throw ApiError.BadRequest(`Topic ${topicId} is not found`)

        topicData.topic = newTopic
        await topicData.save()

        return ApiMessage.OK('Topic edited')
    }

    /**
     * Delete topic by id permanently
     * @param {number} topicId 
     * @returns {Promise<ApiError | ApiMessage>}
     */
    async delete(topicId) {
        const topicData = await TopicModel.destroy({ where: { id: topicId } })

        if (topicData === 0) throw ApiError.BadRequest('Topic not found')

        return ApiMessage.OK('Topic deleted', { rowsAffected: topicData })
    }

    /**
     * Get all topics
     * @returns {Promise<Model<any, any>[]>}
     */
    async getAll() {
        const topics = await TopicModel.findAll()
        return topics
    }
}

module.exports = new TopicService()