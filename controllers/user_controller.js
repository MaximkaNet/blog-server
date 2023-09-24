const userService = require("../models/user/user_service")
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api_error')

class UserController {
    /**
     * Create a new user
     * @example
     * body {
     *  "firstName": string,
     *  "lastName": string,
     *  "email": string,
     *  "password": string
     * }
     * 
     * exampleUrl = '<host>/user/create'
     */
    async create(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { firstName, lastName, email, password, role } = req.body

            // create record
            const userData = await userService.create({ firstName, lastName, email, password, role })

            // set refreshToken to http only cookie
            const maxAge = 30 * 24 * 60 * 60 * 1000 // one month
            res.cookie('refreshToken', userData.refreshToken, { maxAge: maxAge, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    /**
     * Login user
     * @example
     * body {
     *  "email": string,
     *  "password": string
     * }
     * 
     * exampleUrl = '<host>/user/login'
     */
    async login(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { email, password } = req.body

            const userData = await userService.login(email, password)

            // set http only cookie
            const maxAge = 30 * 24 * 60 * 60 * 1000
            res.cookie('refreshToken', userData.refreshToken, { maxAge: maxAge, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    /**
     * Logout user
     * @description Refresh token is obtained from cookies
     * @example 
     * exampleUrl = '<host>/user/logout'
     */
    async logout(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)


            const { refreshToken } = req.cookies
            const token = await userService.logout(refreshToken)

            // remove cookie 
            res.clearCookie('refreshToken')

            return res.json(token)
        } catch (err) {
            next(err)
        }
    }

    /**
     * Refresh user refreshToken
     * @description Refresh token is obtained from cookies
     * @example 
     * exampleUrl = '<host>/user/refresh'
     */
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);

            // set new refresh token
            const maxAge = 30 * 24 * 60 * 60 * 1000
            res.cookie('refreshToken', userData.refreshToken, { maxAge: maxAge, httpOnly: true })

            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }

    /**
     * Delete user permanently
     * @example 
     * exampleUrl = '<host>/user/:userId'
     */
    async delete(req, res, next) {
        try {
            // Validation result from router
            const errors = validationResult(req)
            if (!errors.isEmpty()) throw ApiError.BadRequest('Validation error', errors)

            const { userId } = req.params

            const userData = await userService.delete(Number(userId))

            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

}

module.exports = new UserController()