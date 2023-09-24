const sequelize = require('../init')
const { DataTypes } = require('sequelize')

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    // userId: { type: DataTypes.BIGINT, allowNull: false },
    // replyId: { type: DataTypes.BIGINT, allowNull: true },
    // text: { type: DataTypes.TEXT, allowNull: false }
})

// Comment.belongsTo(Comment)
// Comment.hasOne(Comment)

module.exports = Comment