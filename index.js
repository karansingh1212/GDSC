const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");
const user = require("./Schemas/schema");
const app = express();
const server = http.createServer(app);
const cSchema = require("./Schemas/cSchema");
const cPlusSchema = require("./Schemas/cPlusSchema");
const javaSchema = require("./Schemas/javaSchema");
const pythonSchema = require("./Schemas/pythonSchema");
require("dotenv").config();

const PORT = process.env.PORT || 8000;
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("Connected", socket.id);

  //join room
  socket.on("Join-room", (language) => {
    language = language.replace(/['"]+/g, "");
    socket.join(language);
    console.log(`${socket.id} joined ${language}`);
  });

  //send message
  socket.on("send", async (msg) => {
    try {
      console.log(msg);
      let { username, language, message } = msg;
      username = username.replace(/['"]+/g, "");
      language = language.replace(/['"]+/g, "");
      let newMessage;
      if (language == "python") {
        newMessage = new pythonSchema({
          username,
          message,
          timestamp: new Date(),
        });
      } else if (language == "java") {
        newMessage = new javaSchema({
          username,
          message,
          timestamp: new Date(),
        });
      } else if (language == "cpp") {
        newMessage = new cSchema({
          username,
          message,
          timestamp: new Date(),
        });
      } else {
        newMessage = new cPlusSchema({
          username,
          message,
          timestamp: new Date(),
        });
      }
      await newMessage.save();
      // socket.broadcast.emit("receive", { message, username });
      //recieve msg
      socket.to(language).emit("receive", { message, username });
      console.log("Message saved :", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB CONNECTED!!!"));

app.post("/api/register", async (req, res) => {
  try {
    console.log(req.body);
    const { email, username, password, language, identity } = req.body;
    const newUser = new user({ email, username, password, language, identity });
    await newUser.save();
    res.send("Successful");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return res.status(400).send("Email Is Required!!");
    if (!password) return res.status(400).send("Password Is Required!!");
    const info = await user.findOne({ email });
    if (!info) return res.status(400).send("NO USER FOUND!!");
    const match = password == info.password;
    if (!match) return res.status(400).send("Incorrect Password!!");

    res.send({ language: info.language, username: info.username });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/GroupMSg", async (req, res) => {
  let { language } = req.query;
  language = language.replace(/['"]+/g, "");
  console.log(language);

  let data;
  if (language === "python") data = await pythonSchema.find();
  else if (language === "cpp") data = await cPlusSchema.find();
  else if (language === "c") data = await cSchema.find();
  else if (language === "java") data = await javaSchema.find();
  // const data = user.find();
  // console.log(data);
  res.send(data);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
