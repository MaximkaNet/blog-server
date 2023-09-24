const sequelize = require('../init')
const { DataTypes } = require('sequelize')

const Tag = sequelize.define('tag', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    tag: { type: DataTypes.TEXT, allowNull: false }
}, { timestamps: false })

module.exports = Tag