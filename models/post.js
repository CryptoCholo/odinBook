/* eslint-disable no-undef */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    author:  { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: {type: String, required: true},
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
  
}, {timestamp: true})


const Post = mongoose.model('Post', postSchema)

module.exports = Post;