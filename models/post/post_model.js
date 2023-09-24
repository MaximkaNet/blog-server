const sequelize = require('../init')
const { DataTypes } = require('sequelize')
const Tag = require('../tag/tag_model')
const Topic = require('../topic/topic_model')
const { User } = require('../user/user_model')
// const Comment = require('../comment/comment_model')

const STATUS = {
    DRAFT: 'draft',
    PUBLISH: 'publish',
    TRASH: 'trash'
}

const Post = sequelize.define('post', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    datetimePublish: { type: DataTypes.DATE, allowNull: true },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    title: { type: DataTypes.TEXT, allowNull: false },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    status: { type: DataTypes.ENUM(STATUS.DRAFT, STATUS.PUBLISH, STATUS.TRASH), defaultValue: STATUS.DRAFT }
})

Tag.belongsToMany(Post, { through: 'PostTag', uniqueKey: true, timestamps: false })
Post.belongsToMany(Tag, { through: 'PostTag', uniqueKey: true, timestamps: false })

Post.belongsTo(Topic)
Topic.hasMany(Post)

Post.belongsTo(User, { onDelete: 'CASCADE' })
User.hasMany(Post)

// Comment.belongsTo(Post)
// Post.hasMany(Comment)

module.exports = {
    Post: Post,
    STATUS: STATUS
}