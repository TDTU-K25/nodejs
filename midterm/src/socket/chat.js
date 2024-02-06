
const jwt = require("jsonwebtoken");

const Conversation = require("../models/conversation");
const Message = require("../models/message");
const Account = require("../models/account");

exports.logout =  (io, token) => {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;
    Account.findByIdAndUpdate(userID, {isOnline: false})
    .then(() => {
      console.log("user " + userID + " is offline");
    })

    io.emit("notifi-offline", token);
}

exports.login =  (io, token) => {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;

    Account.findByIdAndUpdate(userID, { isOnline: true })
    .then(() => {
      console.log("user " + userID + " is online");
    })
    .catch((err) => {
      console.log(err);
    });

    io.emit("notifi-online", token);
  }

exports.createConversation = async (io, token, socketSenderID, receiverID) => {
    try {
      const payLoad = jwt.verify(token, process.env.JWT_SECRET);
      const userID = payLoad.accountId;

      if(typeof receiverID == 'string'){
        let conversation = await Conversation.findOne({members: { $all: [userID, receiverID], $size: 2 }})
      
        const socketIDs = await io.allSockets();
        let socketSender = io.sockets.sockets.get(socketSenderID);
        let socketReceiver

        socketIDs.forEach(element => {
          if(element != socketSender.id){
            const payLoadReceiver = jwt.verify(io.sockets.sockets.get(element).handshake.auth.token, process.env.JWT_SECRET);
            const userIDReceiver = payLoadReceiver.accountId;
            if(receiverID == userIDReceiver){
              socketReceiver = io.sockets.sockets.get(element)
            }
          }
        });

        if(conversation){
          conversation = await conversation.populate("members");
          conversation.members = conversation.members.filter(member => member._id != userID)
          data = {
            isExist: true,
            conversation,
            message: "Conversation already exists"
          }
          io.emit("response-create-conversation", data);
        }
        else{
          conversation = await Conversation.create({
            members: [userID, receiverID],
          });
          conversation = await conversation.populate("members");

          const clontConversation = JSON.parse(JSON.stringify(conversation));
          
          clontConversation.members = clontConversation.members.filter(member => member._id != receiverID)
          conversation.members = conversation.members.filter(member => member._id != userID)

          
          console.log(clontConversation)
          
          dataSender = {
            isExist: false,
            conversation: clontConversation,
            message: "Create conversation successfully"
          }

          dataReceiver = {
            isExist: false,
            conversation,
            message: "Create conversation successfully"
          }
          socketSender.emit("response-create-conversation", dataReceiver);
          if(socketReceiver){
            socketReceiver.emit("response-create-conversation", dataSender);
          }
        }
      }
      else{
        conversation = await Conversation.create({
          members: [userID, ...receiverID],
        });

        conversation = await conversation.populate("members");
        conversation.members = conversation.members.filter(member => member._id != userID)
        data = {
          isExist: false,
          conversation,
          message: "Create conversation successfully"
        }
        io.emit("response-create-conversation", data);
      }
    } catch (error) {
      console.log(error);
    }
  }

exports.joinRoom = async (socket, roomID, token) => {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;
    let user = await Account.findOne({ _id: userID });
    
    socket.join(roomID);
  }

exports.sendMessage = async (io, conversationID, message, token, socketID) => {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const accountId = payLoad.accountId;

    const msg = await Message.create({
      content: message,
      accountId: accountId,
    });

    await Conversation.findByIdAndUpdate(
      conversationID,
      { $push: { messages: msg._id } },
      { new: true, upsert: true },
    );

    const account = await Account.findById(accountId);
    const img = account.avatar;
    
    io.to(conversationID).emit("message", msg, socketID, img, conversationID);
  }

exports.typingMessage = async (io, conversationID, socketID, token) => {
  const payLoad = jwt.verify(token, process.env.JWT_SECRET);
  const userID = payLoad.accountId;

  const name =  await Account.findById(userID);

  data = {
    name: name.name,
    conversationID: conversationID,
    socketID: socketID
  }
  io.to(conversationID).emit("response-typing", data);
}

exports.sendFile = async (io, conversationID, file, token, socketID, fileName) => {
  const payLoad = jwt.verify(token, process.env.JWT_SECRET);
  const accountId = payLoad.accountId;
  console.log(file)
  const fileType = getFileType(file);
  file = file.toString('base64');
  const msg = await Message.create({
    content: file,
    accountId: accountId,
    fileType: fileType,
    fileName: fileName,
  });

  await Conversation.findByIdAndUpdate(
    conversationID,
    { $push: { messages: msg._id } },
    { new: true, upsert: true },
  );
  const account = await Account.findById(accountId);
  const img = account.avatar;
  io.to(conversationID).emit("message", msg, socketID, img, conversationID);
}

function getFileType(buffer) {
  const uint = new Uint8Array(buffer);
  
  if (uint[0] === 0xFF && uint[1] === 0xD8 && uint[2] === 0xFF) {
    return 'image';
  }

  // PNG
  if (uint[0] === 0x89 && uint[1] === 0x50 && uint[2] === 0x4E && uint[3] === 0x47) {
    return 'image';
  }

  return 'file';
}