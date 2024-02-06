const mongoose = require("mongoose");
const Account = require("./account");

let conversationSchema = mongoose.Schema({
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      validate: {
        validator: async function (value) {
          const isExist = await Account.exists({ _id: value });
          return isExist;
        },
        message: "Account does not exist",
      },
    },
  ],
  messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      validate: {
        validator: async function (value) {
          const isExist = await Message.exists({ _id: value });
          return isExist;
        },
        message: "Message does not exist",
      },
    },
  ],
});

let Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
