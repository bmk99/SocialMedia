const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config();
const userRoutes = require("./routes/user");
const userfiles = require("./routes/upload");
const userpost = require("./routes/post");
const userReact = require("./routes/react");
const messages = require("./routes/messages");
const conversation = require("./routes/conversation");
const comments = require("./routes/comments");

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const options = {
  "Access-Control-Allow-Origin": "https://sage-selkie-3d14fc.netlify.app",
  useSucessStatus: 200,
  credentials:true

};
app.use(cors(options));

app.use(express.json());
mongoose
  .connect(process.env.DATABASE_STRING, {
    useNewUrlParser: true,
  })
  .then(() => console.log("sucessfully connected"))
  .catch((err) => console.log("not connected", err));
const PORT = process.env.PORT || 8000;

app.use(
  "/api1",
  userRoutes,
  userfiles,
  userpost,
  userReact,
  comments,
  messages,
  conversation
);

const server = app.listen(PORT, () => {
  console.log(`sever is running at ${PORT}....`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    
    "Access-Control-Allow-Origin": "https://sage-selkie-3d14fc.netlify.app",
    credentials: true,
  },
});

let users = [];

const addUser = (userId, socketId) => {
  console.log(!users.some((user) => user.userId === userId));
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (receiverId) => {
  return users.find((user) => user.userId === receiverId);
};

io.on("connection", (socket) => {
  console.log("user connected ");
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  socket.on("sendMessage", ({ senderUser, receiverId, text }) => {
    const user = getUser(receiverId);

    if (user) {
      io.to(user.socketId).emit("getMessage", {
        senderUser,
        text,
      });
    } else {
      console.log(`User with ID ${receiverId} not found`);
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected.");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

io.on("error", (err) => {
  console.error("Socket.IO error:", err.message);
});
