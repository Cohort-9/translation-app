const express = require('express');
const { ChatRoom } = require('../models/chatRoom');
const router = express.Router();
const jsonParser = require('body-parser').json();


// this endpoint gets all the chatrooms that a user is a participant in
// array.indexOf to find if req.params.userId is in the participants array for each item in the rooms array
//build out new array with all of the chats and send to frontend.
router.get('/:userId', (req, res) => {
    return ChatRoom
        .find()
        .exec()
        .then(rooms => {
            const filteredRooms = rooms.filter(room => {
                const condition = room.participants.indexOf(req.params.userId) > -1;
                return condition;
            });
            return res.status(200).json(filteredRooms)
        })
        .catch(err => console.error(err))
});

router.get('/chatRoom/:chatRoomId', (req, res) => {
    return ChatRoom
        .findById(req.params.chatRoomId)
        .exec()
        .then(room => {
            console.log('hey there its yogi bear');
            return res.status(200).json(room)
        })
        .catch(err => console.error(err));
});

router.post('/', jsonParser, (req, res) => {
    return ChatRoom.create({
        participants: req.body.participantsIds,
        messages: []
    })
    .then(newChatRoom => {
        console.log(newChatRoom);
        return res.status(200).json(newChatRoom);
    })
    .catch(err => console.error(err))
});

router.post('/chatRoom/:chatRoomId', jsonParser, (req, res) => {
    const { newMessage } = req.body;
    const { createdBy } = req.body;
    return ChatRoom
        .findByIdAndUpdate(
            req.params.chatRoomId,
            { $push: { messages: { createdBy, body: newMessage } } },
            { safe: true, upsert: true, new: true }
        )
        .exec()
        .then(room => {
            return res.status(200).json(room.messages); // send back all msgs for the room
        })
        .catch(err => console.error(err));
});

module.exports = { chatRoomRouter: router };
