const sequelize = require('../init')
const { DataTypes } = require('sequelize')

const Token = sequelize.define('token', {
    userId: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false })

module.exports = Token