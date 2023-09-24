class UserDTO {
    constructor(model) {
        this.email = model.email
        this.id = model.id
        this.firstName = model.firstName
        this.lastName = model.lastName
    }
}

module.exports = UserDTO