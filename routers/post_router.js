const { query, param, body } = require('express-validator');
const postController = require('../controllers/post_controller');
const tagsValidator = require('../validators/post_validator');

const Router = require('express').Router
const post_router = new Router();

// Create a new post
post_router.post('/create',
    body("userId")
        .exists()
        .withMessage("userId is required")
        .isInt(),
    body("topicId")
        .optional()
        .isInt(),
    body("title")
        .exists()
        .withMessage('title is required')
        .isString(),
    body("content")
        .exists()
        .withMessage('content is required')
        .isString(),
    postController.create)

// Get post by id
post_router.get('/:postId',
    param('postId').isInt(),
    postController.get)

// Delete post by id
post_router.delete('/:postId',
    param('postId').isInt(),
    postController.delete)

// Edit post by id
post_router.put('/:postId',
    param('postId').isInt()
        .withMessage('The "postId" will be "number"'),
    body('title').optional().isString()
        .withMessage('The "title" will be "string"'),
    body('content').optional().isString()
        .withMessage('The "content" will be "string"'),
    body('status').optional().isString()
        .withMessage('The "status" will be "string"'),
    body('topicId').optional().isInt()
        .withMessage('The "topicId" will be "number"'),
    body('tags').optional().isArray()
        .custom(tagsValidator),
    postController.edit
)

// Get last posts
post_router.get('/last/posts',
    query('count').optional().isInt(),
    query('page').optional().isInt(),
    // query('topicId').optional().isInt(),
    postController.last)

// // Get last posts by topic id
// post_router.get('/last/byTopic/:topicId',
//     query('count').optional().isInt(),
//     query('page').optional().isInt(),
//     param('topicId').isInt(),
//     postController.lastByTopic)

// // Get last posts by tag id
// post_router.get('/last/byTag/:tagId',
//     query('count').optional().isInt(),
//     query('page').optional().isInt(),
//     param('tagId').isInt(),
//     postController.lastByTag)

module.exports = post_router