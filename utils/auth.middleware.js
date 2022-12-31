const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWTSECRET;

 const authMiddleware = async (req, res, next) => {
     try {
    const  auth = req.headers.authorization;

    const [_, token] = auth.split(' ');

    if (!token) {
        res.status(401).json({message: "Unauthorized"});
        return
    }

    if (!jwt.verify(token, jwtSecret)) {
        res.status(401).json({message: "Token is invalid or expired"});
        return;
    }
   
    //Attach the user  to the request object;
    req.user = jwt.decode(token).user;
  
    next()
    }  catch (err) {
        return res.status(400).json({message: err.message})
    }
}

module.exports = authMiddleware;