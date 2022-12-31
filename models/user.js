/* eslint-disable no-undef */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    phone: {type: String,required: true},
    email: {type: String, required: true,unique: true},
    birth_year: {type:Date, required: true},
    role: {type: String, required: true, enum: ["Admin", 'User']},
    gender:  { type: String, enum: ['m', 'f', 'others']},
    friends: [{type: Schema.Types.ObjectId, ref: 'User'}],  
    sent_friend_req:  [{type: Schema.Types.ObjectId, ref: 'User'}],  
    received_friend_req:  [{type: Schema.Types.ObjectId, ref: 'User'}],  
    posts: [{type: Schema.Types.ObjectId, ref: 'Post'}],  
    password: {type: String, required: true},
      
}, {timestamp: true}) 

userSchema.pre('save', async function(next) {

    if (!this.isModified('password')) return next();

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})



const User = mongoose.model('User', userSchema);

module.exports = User;