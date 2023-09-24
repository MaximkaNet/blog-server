const jwt = require("jsonwebtoken");

const Token = require('./token_model');
const { User } = require("../user/user_model");

const ApiError = require("../../exceptions/api_error");
const ApiMessage = require("../../exceptions/api_message");

class TokenService {
    /**
     * Generate access and refresh tokens
     * @param {string|object|Buffer} payload 
     * @returns {{accessToken: string; refreshToken: string}}
     */
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '5m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30h' })
        return { accessToken, refreshToken }
    }

    /**
     * Validate access token
     * @param {string} accessToken 
     * @returns {Jwt & Jwt.Payload & void}
     */
    validateAccessToken(accessToken) {
        try {
            const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
            return userData
        } catch (error) {
            throw ApiError.BadRequest(`Token is invalid.\nError:${error}`)
        }
    }

    /**
     * Validate refresh token
     * @param {string} refreshToken 
     * @returns {Jwt & Jwt.Payload & void}
     */
    validateRefreshToken(refreshToken) {
        try {
            const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
            return userData
        } catch (error) {
            throw ApiError.BadRequest(`Token is invalid.\nError:${error}`)
        }
    }

    /**
     * Save refreshToken
     * @param {number} userId 
     * @param {string} refreshToken 
     * @returns {Promise<Model>}
     */
    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ where: { userId } })
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        const userData = await User.findOne({ where: { id: userId } })
        if (!userData) throw ApiError.BadRequest(`User ${userId} is not found.`)
        const token = await Token.create({ userId: userData.id, refreshToken })

        return token
    }

    /**
     * Find and delete token 
     * @param {string} refreshToken 
     * @returns {Promise<ApiError | ApiMessage>}
     */
    async removeToken(refreshToken) {
        const tokenData = await Token.destroy({ where: { refreshToken } })
        if (tokenData === 0) throw ApiError.BadRequest('Token not found')
        return ApiMessage.OK('Token removed', { rowsAffected: tokenData })
    }

    /**
     * Find refreshToken
     * @param {string} refreshToken 
     * @returns {Promise<Model | null>}
     */
    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ where: { refreshToken } })
        return tokenData
    }
}

module.exports = new TokenService()