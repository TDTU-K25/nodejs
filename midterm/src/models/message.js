const mongoose = require("mongoose");

let messageSchema = mongoose.Schema({
  content: {
    type: String,
    require: [true, "A message must have content"],
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    require: [true, "A message must have account id"],
  },
  time: {
    type: Date,
    default: Date.now,
  },
  fileType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  fileName: {
    type: String,
  },
});

let Message = mongoose.model("Message", messageSchema);

module.exports = Message;