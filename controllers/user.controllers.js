const jwt = require('jsonwebtoken');
const { userExist, create, getUserByEmail, getUserById, isPasswordValid } = require('../services/user.service');
const User = require('../models/user');

const jwtSecret = process.env.JWTSECRET;


exports.signUp = async (req, res) => {
  
    const userReq = req.body;

    const exists =  await userExist(userReq.email);
    
    if (!exists) {
        const newUser = await create({...userReq, role: 'User'});
        newUser.password = undefined;

        res.status(201).json(newUser,);
    } else {
        res.status(400).json({message: "User exists already"});
    }
}

exports.login =  async (req, res) => {
  
    const loginReq = req.body;
    
    const user =  await getUserByEmail(loginReq.email);
    
    if(!user) {
        res.status(401).json({message: "User Does not Exist"});
        return
    }

    const password = await isPasswordValid(loginReq.password, user.password);
    if (!password) {
        res.status(401).json({message: "Incorrect Password"});
        return
    }

    user.password = undefined;

    JSON.stringify(user)

    const token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 60), user
        }, jwtSecret);

    res.status(200).json({message: 'Login Successful', token});
};

exports.getProfile = async (req, res,) => {
   
    try {
        if (!req.user) return res.status(404).json({message: 'user does not exist'});
        
        const user = await getUserById(req.user._id);
        user.password = undefined;
        return res.status(200).json(user)
    } catch (err) {
        console.error(err);
        res.status(500).send('server error')
    }
};

exports.getUserProfile = async (req, res) => { 
    try {
        if (!req.params) return res.status(401);
        const user = await getUserById(req.params.userId);

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
    res.status(500).send('server error')
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const updatedInfo = req.body;

        const user = await getUserById(userId);
        user.first_name = updatedInfo.first_name;
        user.last_name = updatedInfo.last_name;
        user.phone = updatedInfo.phone
        user.email = updatedInfo.email;
        user.birth_year = updatedInfo.birth_year;
       
        await user.save();
        return res.json({ message: "Successfully updated user", user });
    } catch (err) {
        return res.status(500).json(err.message);
    }
}



exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        if (userId === req.params.userId) return res.status(401).Json({message: 'you can only delete your account'})

        const deletedUser = await User.findByIdAndDelete(userId);
        const otherUsers = await User.find({ _id: { $ne: req.params.userId } });

        if(!deletedUser) return res.status(404).json({message: 'user does not exist'})

        for (let user of otherUsers) {
            user.friends = user.friends.filter(
                (id) => id !== req.params.userId
              );
              user.friendRequests= user.friendRequests.filter(
                (id) => id !== req.params.userId
              );
              await user.save();
        }

        return res.json({ message: "Successfully deleted user", deletedUser });
    } catch (err) {
        return res.status(500).json(err.message);
    }
}

