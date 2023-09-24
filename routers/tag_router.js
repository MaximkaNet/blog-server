const { body, param } = require('express-validator');
const tagController = require('../controllers/tag_controller');

const Router = require('express').Router
const tag_router = new Router();

// Create a new tag
tag_router.post('/create',
    body("tag")
        .exists()
        .isString(),
    tagController.create)

// Edit existed tag
tag_router.put('/:tagId',
    param('tagId')
        .isInt(),
    tagController.editTag)

// Delete existed tag
tag_router.delete('/:tagId',
    param('tagId')
        .isInt(),
    tagController.delete)

// Get all tags
tag_router.get('/all', tagController.getAll)

module.exports = tag_router