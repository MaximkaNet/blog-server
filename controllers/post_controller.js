const { validationResult } = require("express-validator")
const ApiError = require("../exceptions/api_error")
const postService = require("../models/post/post_service")

class PostController {
    /**
     * Create a new post
     * @example
     * body {
     *  "userId": number,
     *  "topicId": number | null | undefined,
     *  "title": string,
     *  "content": string
     * }
     * 
     * exampleUrl = '<host>/post/create'
     */
    async create(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { userId, topicId, title, content } = req.body

            // create record
            const postData = await postService.create(userId, topicId, title, content)

            return res.json(postData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Get post by id
     * @example 
     * exampleUrl = '<host>/post/:postId'
     */
    async get(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { postId } = req.params

            const postData = await postService.get(Number(postId))

            return res.json(postData)

        } catch (error) {
            next(error)
        }
    }

    /**
     * Delete post by id
     * @example
     * exampleUrl = '<host>/post/:postId'
     */
    async delete(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { postId } = req.params

            const postData = await postService.delete(Number(postId))

            return res.json(postData)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Edit fields of the post
     * @example
     * URL: '<host>/post/:postId'
     * Method: 'POST'
     * Body: {
     *  "title": string;
     *  "content": string;
     *  "status": string;
     *  "topicId": number;
     *  "tags": [{
     *      "method": string; // 'add', 'remove'
     *      "id": number
     *  }]
     * }
     */
    async edit(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { postId } = req.params
            const { title, content, status, topicId, tags } = req.body

            const postData = await postService.edit(Number(postId), { title, content, status, topicId, tags })

            return res.json(postData)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Get last posted articles
     * @example
     * req.query = count: number(0, 1, 2, ...), page: number(0, 1, 2, ...)
     * exampleUrl = '<host>/post/last?count=10&page=0'
     */
    async last(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { count, page } = req.query

            const lastPosts = await postService.getLast({
                page: page ? Number(page) : undefined,
                count: count ? Number(count) : undefined
            })

            return res.json(lastPosts)
        } catch (error) {
            next(error)
        }
    }


    /**
     * Get last posted articles related with topic
     * @example
     * req.query = count: number(0, 1, 2, ...), page: number(0, 1, 2, ...)
     * exampleUrl = '<host>/post/last/byTopic/1?count=10&page=0'
     */
    async lastByTopic(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { topicId } = req.params
            const { count, page } = req.query

            const options = {
                topicId: Number(topicId),
                count: count ? Number(count) : undefined,
                page: page ? Number(page) : undefined
            }

            const lastPosts = await postService.getLast(options)

            return res.json(lastPosts)
        } catch (error) {
            next(error)
        }
    }

    /**
     * Get last posted articles related with tag
     * @example
     * req.query = count: number(0, 1, 2, ...), page: number(0, 1, 2, ...)
     * exampleUrl = '<host>/post/last/byTag/1?count=10&page=0'
     */
    async lastByTag(req, res, next) {
        try {
            // body validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { tagId } = req.params
            const { count, page } = req.query

            const options = {
                tagId: Number(tagId),
                count: count ? Number(count) : undefined,
                page: page ? Number(page) : undefined
            }

            const lastPosts = await postService.getLast(options)

            return res.json(lastPosts)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new PostController()