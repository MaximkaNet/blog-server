const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/api_error")
const tagService = require('../models/tag/tag_service')

class TagController {
    /**
     * Create a new tag
     * @example 
     * body {
     *  "tag": string
     * }
     */
    async create(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { tag } = req.body

            const tagData = await tagService.create(tag)

            return res.json(tagData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Edit tag
     * @example
     * body {
     *  "tag": string
     * }
     * params {
     *  "tagId": number
     * }
     */
    async editTag(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { tagId } = req.params
            const { tag } = req.body

            const tagData = await tagService.edit(Number(tagId), tag)

            return res.json(tagData)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Delete tag
     * @example
     * params {
     *  "tagId": number
     * }
     */
    async delete(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { tagId } = req.params

            const tagData = await tagService.delete(Number(tagId))

            return res.json(tagData)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Get all tags
     */
    async getAll(req, res, next) {
        try {
            const tags = await tagService.getAll()
            return res.json(tags)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new TagController()