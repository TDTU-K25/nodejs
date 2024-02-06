const jwt = require("jsonwebtoken");
const Message = require("../models/message");

exports.getMessageFile = async (req, res, next) => {
  try {
    const {token, messageID} = req.body
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;

    // CHECK PERMISSION TO DOWNLOAD FILE
    // HOW? CHECK CONVERSATION OF MESSAGE AND CHECK USERID IN CONVERSATION ??
    const message = await Message.findById(messageID)
    // if(userID == message.accountId){
        res.json({
        status: "success",
        data: message,
        });
    // }
    // else{
    //     res.json({
    //     status: "fail",
    //     data: "You don't have permission to download this file",
    //     });
    // }
  } catch (error) {
    
  }
}