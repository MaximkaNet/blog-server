const sequelize = require('../init')
const { DataTypes } = require('sequelize')
const Token = require('../token/token_model')
// const Comment = require('../comment/comment_model')

const ROLE = {
    ROOT: 'root',
    ADMIN: 'admin',
    USER: 'user'
}

const STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
}

const User = sequelize.define('user', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, allowNull: true },
    role: { type: DataTypes.ENUM(ROLE.ROOT, ROLE.ADMIN, ROLE.USER), defaultValue: ROLE.USER },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    theme: { type: DataTypes.JSON, allowNull: false, defaultValue: { name: "default" } },
    status: { type: DataTypes.ENUM(STATUS.ACTIVE, STATUS.INACTIVE), defaultValue: STATUS.ACTIVE }
})

Token.belongsTo(User, { onDelete: 'CASCADE' })
User.hasMany(Token)

// User.hasMany(Comment)
// Comment.belongsTo(User)

module.exports = {
    User: User,
    STATUS: STATUS,
    ROLE: ROLE
}