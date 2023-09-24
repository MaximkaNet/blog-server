const comment_router = require('./comment_router');
const post_router = require('./post_router');
const tag_router = require('./tag_router');
const topic_router = require('./topic_router');
const user_router = require('./user_router');

const Router = require('express').Router
const router = new Router();

router.use('/user', user_router)
router.use('/post', post_router)
router.use('/comment', comment_router)
router.use('/topic', topic_router)
router.use('/tag', tag_router)

module.exports = router