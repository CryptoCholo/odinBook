const { getUserById } = require('../services/user.service');
const { StatusCodes } = require('http-status-codes');



const sendFriendRequest = async (req, res) => {
    //Get user id from auth middleware
    const senderId = req.user._id;
    const  { receiverId } = req.params;

    try {    
        //query db for sender and receiver
    const receiver = await getUserById(receiverId);
    const sender =  await getUserById(senderId);

    const { sent_friend_req, friends, received_friend_req } = sender;

    //check if receiver exists
    if (!receiver) {
        res.status(StatusCodes.NOT_FOUND).json({message: 'User does not exist'});
    }

    //confirm that receiver and sender have no prior relationship
    if (sent_friend_req.includes(receiverId)) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'Friend request already sent to this user'});
    } else if (friends.includes(receiverId)) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'You are already friends with this user'})
    } else if (received_friend_req.includes(receiverId)) {
        res.status(StatusCodes.BAD_REQUEST).json({message: 'You already received a request from  this user'})
    }

    //update senders sent requests
    const sender_Reqs = [...sent_friend_req, receiverId];
    sender.sent_friend_req = sender_Reqs;
    await sender.save();

    //update receivers received requests
    const receiver_Reqs = [...receiver.received_friend_req, senderId];
    receiver.received_friend_req = receiver_Reqs;
    await receiver.save();
    
    return res.status(StatusCodes.CREATED).json({message: 'Friend request sent successfully'})
    } catch (err) {
        return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
    }
}


const acceptFriendRequest = async (req, res) => {
    const receiverId = req.user._id;
    const  { senderId } = req.params;

    try {
        const receiver = await getUserById(receiverId);
        const sender = await getUserById(senderId);

        if (!receiver.received_friend_req.includes(senderId)) {
            return res.status(StatusCodes).json({message: 'Request does not exist'})
        }

        receiver.received_friend_req = receiver.received_friend_req.filter(user => {
            user._id !== senderId
        });
        const updatedReceiverFriends = [...receiver.friends, senderId];
        receiver.friends = updatedReceiverFriends;
        await receiver.save();


        sender.sent_friend_req = sender.sent_friend_req.filter(user => {
            user._id !== receiverId;
        })
        const updatedSenderFriends = [...sender.friends, receiverId];
        sender.friends = updatedSenderFriends;
        await sender.save();

        return res.status(StatusCodes.CREATED).json({message: `You are now friends with ${sender}`})
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({error: err.message})
    }
}


const declineFriendRequest = async (req, res) => {
    //Get user id from auth middleware
    const receiverId = req.user._id;
    const  { senderId } = req.params;

    try {    
    //query db for sender and receiver
    const receiver = await getUserById(receiverId);
    const sender =  await getUserById(senderId);

    //check if receiver exists
    if (!sender) {
    res.status(StatusCodes.NOT_FOUND).json({message: 'User does not exist'});
    }

   let { received_friend_req } = receiver;
  
    //update receivers received requests
    if (received_friend_req.includes(senderId)) {
        received_friend_req = received_friend_req.filter(user => {
            user._id !== senderId;
        })
    }
    await receiver.save();
  
    //update senders sent requests
    sender.sent_friend_req = sender.sent_friend_req.filter(user => {
        user._id !== receiverId;
    });
    await sender.save(); 
      
    return res.status(StatusCodes.CREATED).json({message: ' You declined the friend request successfully'})
      } catch (err) {
          return  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: err.message})
      }

}

const unfriendUser = async (req, res) => {
    const senderId = req.user._id;
    const  { receiverId } = req.params;

    try {
        const receiver = await getUserById(receiverId);
        const sender = await getUserById(senderId);

        if (!sender.friends.includes(receiverId)) {
            return res.status(StatusCodes.BAD_REQUEST).json({message: 'You are not friends'})
        }

        receiver.friends = receiver.friends.filter(user => {
            user._id !== senderId
        });
        await receiver.save();


        sender.friends = sender.friends.filter(user => {
            user._id !== receiverId;
        })
        await sender.save();

        return res.status(StatusCodes.OK).json({message: `You are no longer friends with ${receiver}`})
    } catch (err) {
        res.status(StatusCodes.BAD_REQUEST).json({error: err.message})
    }
}

module.exports = {sendFriendRequest, acceptFriendRequest, declineFriendRequest, unfriendUser}

