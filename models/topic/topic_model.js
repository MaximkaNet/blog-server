const sequelize = require('../init')
const { DataTypes } = require('sequelize')

const Topic = sequelize.define('topic', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    topic: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: false })

module.exports = Topic