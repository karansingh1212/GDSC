const mongoose = require("mongoose");
const { Schema } = mongoose;

const user = Schema({
  email: { type: String },
  username: { type: String },
  password: { type: String },
  language: { type: String },
  identity: { type: String },
});

module.exports = mongoose.model("Project", user);
