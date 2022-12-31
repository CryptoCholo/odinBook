const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/auth.middleware');
const userValidator = require('../validators/user.validator').signUpValidator;
const userController = require('../controllers/user.controllers')

const friendsRouter = require('./friends.route');

router.use(authMiddleware)

router.use('/friends', friendsRouter);

router.get('/profile', userController.getProfile)
router.get('/:userId',userController.getUserProfile);
router.put('/:userId', userValidator, userController.updateProfile);
router.delete('/:userId', userController.deleteProfile);


module.exports = router;