const { param, body } = require('express-validator');
const commentController = require('../controllers/comment_controller');

const Router = require('express').Router
const comment_router = new Router();

// Create new comment
comment_router.post('/create',
    body('postId')
        .exists()
        .isInt(),
    body('userId')
        .exists()
        .isInt(),
    body('text')
        .exists()
        .isString(),
    commentController.create)

// Reply to comment
comment_router.post('/:commentId/reply',
    param('commentId')
        .isInt(),
    body('userId')
        .exists()
        .isInt(),
    body('text')
        .exists()
        .isString(),
    commentController.replyTo)

// Edit comment
comment_router.put('/:commentId',
    param('commentId')
        .isInt(),
    body('text')
        .exists()
        .isString(),
    commentController.edit)

// Delete comment
comment_router.delete('/:commentId',
    param('commentId')
        .isInt(),
    commentController.delete)

// Get all comments
comment_router.get('/:postId',
    param('postId')
        .isInt(),
    commentController.getComments)

module.exports = comment_router