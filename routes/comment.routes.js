const express = require('express');
const router = express.Router({mergeParams: true});

const { getComments, createComment, likeComment, updateComment, deleteComment } = require('../controllers/comment.controller');

const commentValidator = require('../validators/comment.validator')


router.get('/', getComments)
router.post('/', commentValidator, createComment);
router.put('/:commentId/like', likeComment)
router.put('/:commentId', commentValidator, updateComment);
router.delete('/:commentId', deleteComment);

module.exports = router;