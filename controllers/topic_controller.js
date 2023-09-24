const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/api_error")
const topicService = require("../models/topic/topic_service")

class TopicController {
    /**
     * Create a new topic
     * @example
     * body {
     *  "topic": string
     * }
     */
    async create(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { topic } = req.body

            const topicData = await topicService.create(topic)

            return res.json(topicData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Edit topic
     * @example
     * body {
     *  "topic": string
     * }
     * 
     * exampleUrl = '<host>/topic/:topicId'
     */
    async edit(req, res, next) {
        try {
            // Validation result from router 
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { topicId } = req.params
            const { topic } = req.body

            const topicData = await topicService.edit(Number(topicId), topic)

            return res.json(topicData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Delete topic
     * @example exampleUrl = '<host>/topic/:topicId'
     */
    async delete(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { topicId } = req.params

            const topicData = await topicService.delete(Number(topicId))

            return res.json(topicData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Get all topics
     */
    async getAll(req, res, next) {
        try {
            const topics = await topicService.getAll()
            return res.json(topics)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new TopicController()