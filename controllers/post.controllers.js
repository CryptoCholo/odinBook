const postServices = require('../services/post.service');
const User = require('../models/user');
const Post = require('../models/post');
const Comment = require('../models/comment');
const isOwner = require('../utils/isOwner').isOwner;


const newPost = async (req, res) => {
    try{
    const postData = req.body;

    const post = await (await postServices.createPost({...postData, author: req.user._id})).populate('author', 'first_name');

    return res.status(201).json({message: 'You successfully created a post ', post: post})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const getPosts = async (req, res) => {
    try {
    const {page, limit} = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user._id;
        
    const user  = await User.findById(userId);
    if (!user) return res.status(404).json({message: 'user does not exist'})


    const posts = await Post.find({ author: { $in : [...user.friends, userId]}})
        .sort({timestamp: "desc" })
        .populate('author', 'first_name')
        .populate("comments")
        .populate({
            path: 'comments',
            populate: {
                path: 'author',
            },
            options: {
                sort: {
                    timestamp: "desc"
                }
            }
        })
        .skip(skip)
        .limit(limit)

        return res.status(200).json({posts: posts});
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const getPost = async (req, res) => {
    try {
    const { postId } = req.params;

    const post = await postServices.getPostByPostId(postId)
    return res.status(200).json({message: "success", post})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const toggleLike = async (req, res) => {
    try {
    const user = req.user;
    const { postId } = req.params;

    const post = await postServices.getPostByPostId(postId);

    if (!post ) return res.status(404).json({message: "post does not exist"});

    post.likes.includes(user._id) ? await post.updateOne({  $pull: {likes: user._id}}) : post.likes.push(user);

    await post.save();
    return res.status(200).json({message: "Success"})
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
}


const updatePost = async  (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;

        if (!content) return res.status(400).json({message: "please provide a post content"})

        const post = await postServices.getPostByPostId(postId)

        if (!post ) return res.status(404).json({message: "post does not exist"});
        let { _id } = post.author;
         
        let allowed = isOwner(req.user._id, _id);
        if (!allowed) {
            return res.status(400).json({message: "unauthorized"})
        }
        post.content = content;
        await post.save();
        
        return res.status(200).json({message: "Post updated succesfully", post})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await postServices.getPostByPostId(postId)

        if (!post ) return res.status(404).json({message: "post does not exist"});

        let allowed = isOwner(req.user._id, post.author._id);
        if (!allowed) {
            return res.status(400).json({message: "unauthorized"})
        }

        post.comments.forEach(async (commentId) => {
            await Comment.findByIdAndRemove(commentId);
        });
        
        await post.remove();
        return res.status(200).json({message: "Post deleted succesfully"})
    } catch (err) {
        return res.status(500).json({error: err.message})
    }
}
module.exports = {newPost, getPosts, getPost, updatePost, toggleLike, deletePost }