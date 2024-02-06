const Conversation = require("../models/conversation");
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
const expires = process.env.JWT_EXPIRES;

exports.getConversation = async (req, res, next) => {
  try {
    
    const conversation = await Conversation.findById(req.params.id);
    // console.log(conversation)
    res.status(200).json({
      status: "success",
      data: conversation,
    });
  } catch (err) {
    console.log(err)
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const {token, conversationId} = req.body
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;

    const conversation = await Conversation.findById(conversationId).populate('messages')
    // console.log(conversation)
    const arr_messages = conversation.messages.map(msg => {
      if(msg.accountId == userID) {
        return {
          ...msg._doc,
          type: 'sent'
        }
      }
      else {
        return{
          ...msg._doc,
          type: 'received'
        }
      }
    });
    res.json({
      status: "success",
      data: arr_messages,
    });

  } catch (error) {
    
  }
}

exports.getAllConversationOfUser = async (req, res, next) => {
  try {
    const {token} = req.body
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;
    const conversations = await Conversation.find({members: { $in: [userID]}}).populate('members')
    res.status(200).json({
      status: "success",
      senderID: userID,
      data: conversations,
    });
  } catch (err) {
    console.log(err)
  }
}

exports.createConversation = async (req, res, next) => {
  try {
    const {token, receiverId} = req.body
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;
    const receiverIds = []

    if(typeof receiverId == 'string') {
      receiverIds.push(receiverId)
    }
    else{
      receiverIds.push(...receiverId)
    }
    const conversation = await Conversation.create({
      members: [userID, ...receiverIds]
    }).then((document) => {
      return Conversation.populate(document, { path: "members" });
    });

    conversation.members = conversation.members.filter(member => member._id != userID)
    // console.log(conversation)
    res.status(200).json({
      status: "success",
      data: conversation,
    });
  } catch (err) {
    console.log(err)
  }
}