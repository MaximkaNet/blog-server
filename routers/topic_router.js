const { body, param } = require('express-validator');
const topicController = require('../controllers/topic_controller');

const Router = require('express').Router
const topic_router = new Router();

// Create a new topic
topic_router.post('/create',
    body('topic')
        .exists()
        .isString(),
    topicController.create)

// Edit topic by id
topic_router.put('/:topicId',
    param('topicId')
        .isInt(),
    body('topic')
        .exists()
        .isString(),
    topicController.edit)

// Delete topic by id
topic_router.delete('/:topicId',
    param('topicId')
        .isInt(),
    topicController.delete)

// Get all topics
topic_router.get('/all', topicController.getAll)

module.exports = topic_router