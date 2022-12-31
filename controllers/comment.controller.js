const Post = require('../models/post');
const Comment = require('../models/comment');
const isOwner = require('../utils/isOwner').isOwner;

const createComment = async (req, res) => {
    const { _id } = req.user;
    const { postId } = req.params;
    const { content } = req.body;
    try {
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({message: "post does not exist"})

    const comment = await Comment.create({
        author:  _id,
        content: content,
    })
    await comment.populate('author', 'first_name');

    post.comments.push(comment)
    await post.save();
    return res.status(200).json({message: 'Comment created successfully'})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const getComments = async (req, res) => {
    const { postId } = req.params;
   
    try {
    const post = await Post.findById(postId)
        .populate('author', 'first_name');

    if (!post) return res.status(404).json({message: "post does not exist"});
   
    return res.status(200).json({message: 'success', comments: post.comments})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const likeComment = async (req, res) => {
    try {
        const user = req.user;
        const { commentId } = req.params;
    
        const comment = await Comment.findById(commentId);
    
        if (!comment ) return res.status(404).json({message: "comment does not exist"});
    
        comment.likes.includes(user._id) ? await comment.updateOne({  $pull: {likes: user._id}}) : comment.likes.push(user._id);
    
        await comment.save();
        return res.status(200).json({message: "Success", comment: comment})
        } catch (err) {
            return res.status(500).json({error: err.message});
        }
}
const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;

        if (!content) return res.status(400).json({message: "please provide a comment"})

        const comment = await Comment.findById(commentId);

        if (!comment) return res.status(404).json({message: "Comment does not exist"});
        let { _id } = comment.author;
         
        let allowed = isOwner(req.user._id, _id);
        if (!allowed) {
            return res.status(400).json({message: "You are not the owner of this resource"})
        }
        comment.content = content;
        await comment.save();
        
        return res.status(201).json({message: "Comment updated succesfully", comment: comment})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;

        const comment = await Comment.findById(commentId)

        if (!comment ) return res.status(404).json({message: "comment does not exist"});

        let allowed = isOwner(req.user._id, comment.author._id);
        if (!allowed) {
            return res.status(400).json({message: "you are not the owner of this resource"})
        }
        await Post.findByIdAndUpdate(postId, {
            $pull: {
              comments: commentId,
            },
          });
        await Comment.findByIdAndRemove(commentId);
        
       
        return res.status(200).json({message: "comment deleted succesfully"})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

module.exports = {createComment, getComments, likeComment, updateComment, deleteComment }