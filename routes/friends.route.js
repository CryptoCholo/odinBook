const express = require('express');
const  Router = express.Router();

const {  sendFriendRequest, acceptFriendRequest, declineFriendRequest, unfriendUser} = require('../controllers/friends.controllers')

// Router.get('/', friendsList);
// Router.get('/:friendId', getFriendProfile)
// Router.get('/requests/sent',  sentFriendRequests);
Router.put('/requests/decline/:senderId', declineFriendRequest);
Router.put('/requests/:senderId', acceptFriendRequest)
Router.post('/requests/:receiverId', sendFriendRequest);
Router.delete('/:receiverId', unfriendUser)

module.exports = Router;