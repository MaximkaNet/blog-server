class ApiMessage {
    /**
     * Constructor of ApiMessage class
     * @param {string} message 
     * @param {{} | null} data 
     */
    constructor(message, data = null) {
        this.message = message
        this.data = data
    }
    /**
     * Api message with data
     * @param {string} message 
     * @param {{rowsAffected?: number}} data 
     * @returns {ApiMessage}
     */
    static OK(message, data = null) {

        return new ApiMessage(message, data)
    }
}

module.exports = ApiMessage