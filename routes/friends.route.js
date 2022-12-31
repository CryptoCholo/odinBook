const express = require('express');
const  Router = express.Router();

const { friendsList, sendFriendRequest, acceptFriendRequest, getReceivedRequests, declineFriendRequest, unfriendUser} = require('../controllers/friends.controllers')

Router.get('/', friendsList);
// Router.get('/:friendId', getFriendProfile)
Router.get('/requests/received',  getReceivedRequests);
Router.put('/requests/decline/:senderId', declineFriendRequest);
Router.put('/requests/:senderId', acceptFriendRequest)
Router.post('/requests/:receiverId', sendFriendRequest);
Router.delete('/:receiverId', unfriendUser)

module.exports = Router;