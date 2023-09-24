const { User, ROLE } = require("./user_model")
const bcrypt = require('bcrypt')

const tokenService = require('../token/token_service')

const UserDTO = require('../../dtos/user_dto')
const ApiError = require("../../exceptions/api_error")
const ApiMessage = require("../../exceptions/api_message")

class UserService {
    /**
     * Create a new user
     * @param {string} firstName 
     * @param {string} lastName 
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{accessToken: string; refreshToken: string; user: {id: number}}>}
     */
    async create(values) {
        const { firstName, lastName, email, password, role } = values
        // find user
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            throw ApiError.BadRequest(`Candidate ${email} already exist.`)
        }
        // create password hash
        const hashPassword = await bcrypt.hash(password, 3)

        // add user to database
        const user = await User.create({ firstName, lastName, email, password: hashPassword, role: role ? role : ROLE.USER })
        const userDto = new UserDTO(user)

        // generate tokens
        const tokens = tokenService.generateTokens({ ...userDto })

        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: { id: userDto.id } }
    }

    /**
     * Login a user
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<{accessToken: string; refreshToken: string; user: {id: number}}>}
     */
    async login(email, password) {
        // find user
        const user = await User.findOne({ where: { email } })
        if (!user) throw ApiError.BadRequest('User not found.')

        // compare passwords
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) throw ApiError.BadRequest('Incorrect password')

        // generate tokens
        const userDto = new UserDTO(user)
        const tokens = tokenService.generateTokens({ ...userDto })

        // save refresh token to database
        await tokenService.saveToken(userDto.id, tokens.refreshToken)

        return { ...tokens, user: { id: userDto.id } }
    }

    /**
     * Logout user by refreshToken
     * @param {string} refreshToken 
     * @returns {Promise<ApiMessage>}
     */
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return ApiMessage.OK('User logouted')
    }

    /**
     * Get new accessToken using refreshToken
     * @param {string} refreshToken 
     * @returns {Promise<{accessToken: string; refreshToken: string; user: {id: number}}>}
     */
    async refresh(refreshToken) {
        if (!refreshToken) throw ApiError.UnauthorizedError()

        // verify refresh token and get user data
        const userData = tokenService.validateRefreshToken(refreshToken)
        // verify token into database
        const tokenFromDB = await tokenService.findToken(refreshToken)

        if (!userData || !tokenFromDB) throw ApiError.UnauthorizedError()

        // update user data
        const user = User.findOne({ where: { id: userData.id } })
        const userDTO = new UserDTO(user)

        const tokens = tokenService.generateTokens({ ...userDTO })

        // save a new refresh token
        await tokenService.saveToken(userDTO.id, tokens.refreshToken)

        return { ...tokens, user: { id: userDTO.id } }
    }

    /**
     * Delete user by id permanently
     * @param {number} userId 
     * @returns {Promise<ApiError | ApiMessage>}
     */
    async delete(userId) {
        const userData = await User.destroy({ where: { id: userId } })

        if (userData === 0) throw ApiError.BadRequest('User not found')

        return ApiMessage.OK('User deleted', { rowsAffected: userData })
    }

    // async getAll() {
    //     const users = await User.findAll()
    //     return users
    // }
}

module.exports = new UserService()