const express = require('express');
const  router = express.Router();
const authMiddleware = require('../utils/auth.middleware')

const {getPosts, getPost, newPost, toggleLike, updatePost, deletePost} = require('../controllers/post.controllers');
const {  postValidator } = require('../validators/post.validator');

router.use(authMiddleware);

router.get('/', getPosts);
router.post('/', postValidator, newPost );
router.get('/:postId', getPost);
router.put('/:postId/like', toggleLike);
router.put('/:postId', postValidator, updatePost);
router.delete('/:postId', deletePost);

// router.use('/:postId/comments' commentsRouter);

module.exports = router;