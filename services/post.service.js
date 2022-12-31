const Post = require('../models/post');
const Types = require('mongoose').Types;


exports.createPost =  async (post) => {
    const newPost = await Post.create(post);
    return newPost;
}



exports.updatePost = async (postId, body) => {
    const post = await Post.findById(postId);
    post.content = body
    await post.save();
    return post
}

exports.getPostsByUserId = async (userId) => {
    const posts = await Post.find({ author : new Types.ObjectId(userId)})
    .populate("author comments")
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
    });
    return posts;
}

exports.getPostByPostId = async (postId) => {
    const post = await Post.findById(postId).populate('author');
    return post;
}

exports.incViewCount = async (postId) => {
    const post = await Post.findOneAndUpdate({_id: Types.ObjectId(postId)}, {$inc: {views : 1}}, {new : true});
    return post;
}