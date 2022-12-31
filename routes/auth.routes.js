const express = require('express');
const  router = express.Router();
const { signUpValidator, loginValidator } = require('../validators/user.validator');
const { signUp, login} = require('../controllers/user.controllers');


router.post('/register', signUpValidator, signUp);
router.post('/login', loginValidator, login)

module.exports = router;


