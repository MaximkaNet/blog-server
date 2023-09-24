const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/api_error")
const commentService = require('../models/comment/comment_service')

class CommentContoroller {
    /**
     * Create new comment
     * @example
     * body {
     *  "userId": number,
     *  "postId": number,
     *  "text": number
     * }
     */
    async create(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { postId, userId, text } = req.body

            const commentData = await commentService.create(postId, userId, text)

            return res.json(commentData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Reply to existed comment
     * @example
     * body {
     *  "userId": number,
     *  "text": string
     * }
     * params {
     *  "commentId": number
     * }
     */
    async replyTo(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { commentId } = req.params
            const { userId, text } = req.body

            const commentData = await commentService.reply(Number(commentId), userId, text)

            return res.json(commentData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Edit comment
     * @example
     * body {
     *  "text": string
     * }
     * params {
     *  "commentId": number
     * }
     */
    async edit(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { commentId } = req.params
            const { text } = req.body

            const commentData = await commentService.edit(Number(commentId), text)

            return res.json(commentData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Delete comment
     * @example
     * params {
     *  "commentId": number
     * }
     */
    async delete(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { commentId } = req.params

            const commentData = await commentService.delete(Number(commentId))

            return res.json(commentData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Get all comments for post
     * @example
     * params {
     *  "postId": number
     * }
     */
    async getComments(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { postId } = req.params

            const comments = await commentService.getComments(Number(postId))

            return res.json(comments)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = new CommentContoroller()