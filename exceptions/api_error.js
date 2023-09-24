class ApiError extends Error {
    /**
     * Constructor of ApiError class
     * @param {number} status 
     * @param {string} message 
     * @param {Array<{}>} errors 
     */
    constructor(status, message, errors = []) {
        super(message)
        this.status = status
        this.errors = errors
    }

    /**
     * Unauthorized error (401)
     * @returns {ApiError}
     */
    static UnauthorizedError() {
        return new ApiError(401, 'User is not authorized.')
    }

    /**
     * Bad request error (400)
     * @param {string} message 
     * @param {Array<{}>} errors 
     * @returns {ApiError}
     */
    static BadRequest(message, errors = []) {
        return new ApiError(400, message, errors)
    }
}

module.exports = ApiError