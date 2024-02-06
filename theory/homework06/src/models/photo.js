const mongoose = require("mongoose");

let photoSchema = mongoose.Schema({
  filename: mongoose.SchemaTypes.String,
  album: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Album",
  },
});

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
