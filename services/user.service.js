const User = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose').Types;

const userExist = async ( email ) => {

    const user = await User.findOne({email: email});

    return ! !user;
}

const create = async ( user ) => {
    const newUser = await User.create( user );

    return newUser;

}

const getUserByEmail = async ( email ) => {
    const user = await User.findOne( {email: email });

    return user;
}

const getUserById = async (id) => {

    const user = await User.findById(id);

    return user;
}

const isPasswordValid = async function(password, userPassword) {
    const compare = await bcrypt.compare(password, userPassword);

    return compare;
}




module.exports = { userExist, create, getUserByEmail, isPasswordValid, getUserById };
