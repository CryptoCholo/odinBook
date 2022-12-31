const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, required: true, ref: "User"},
    content: { type: String, required: true },
    likes: [{ type: Schema.Types.ObjectId,  ref: "User"}],
}, { timestamp: true})

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;