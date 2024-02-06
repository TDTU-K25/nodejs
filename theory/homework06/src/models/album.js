const mongoose = require("mongoose");

let albumSchema = mongoose.Schema({
  name: {
    type: mongoose.SchemaTypes.String,
    unique: true,
  },
  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
