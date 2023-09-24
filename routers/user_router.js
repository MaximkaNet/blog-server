const Router = require('express').Router
const user_router = new Router();

const { body, param } = require('express-validator');
const userController = require('../controllers/user_controller')

// Create new user
user_router.post('/create',
    body("firstName")
        .exists()
        .withMessage('firstName is required')
        .isString(),
    body("lastName")
        .exists()
        .withMessage('lastName is required')
        .isString(),
    body("email")
        .exists()
        .withMessage('email is required')
        .isEmail(),
    body("password")
        .exists()
        .withMessage('password is required')
        .isString(),
    body('role')
        .optional()
        .isString(),
    userController.create)

// Login user
user_router.post('/login',
    body("email")
        .exists()
        .withMessage('email is required')
        .isEmail(),
    body("password")
        .exists()
        .withMessage('password is required')
        .isString(),
    userController.login)

// Logout user
user_router.post('/logout', userController.logout)

// Delete user permanently
user_router.delete('/:userId',
    param("userId").isInt(),
    userController.delete)

// Get new refresh and access tokens
user_router.get('/refresh', userController.refresh)

// user_router.delete('/:userId/avatar', () => { })
// user_router.put('/:userId/avatar', () => { })
// user_router.put('/:userId', () => { })

module.exports = user_router