const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
  username: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = mongoose.model("JavaChat", chatSchema);

module.exports = Chat;
