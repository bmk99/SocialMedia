// const io = require("socket.io")(8001, {
//   cors: {
//         origin: "http://localhost:3000",
        
//   },
// });

// let users = [];

// const addUser = (userId, socketId) => {
//   console.log(!users.some((user) => user.userId === userId))
//   if (!users.some((user) => user.userId === userId)) {
//     users.push({ userId, socketId });
//   }
// };

// const removeUser = (socketId) => {
//   users = users.filter((user) => user.socketId !== socketId);
// };

// const getUser = (receiverId) => {
//   return users.find((user) => user.userId === receiverId);
// };

// io.on("connection", (socket) => {
//   console.log("user connected ");

//   // io.emit("start", "Hello world");
// // 
//   socket.on("addUser", (userId) => {
//     addUser(userId, socket.id);
//     io.emit("getUsers", users);
//   });

//   socket.on("sendMessage", ({ senderUser, receiverId, text }) => {
//     const user = getUser(receiverId);
    
//     if (user) {
//       io.to(user.socketId).emit("getMessage", {
//         senderUser,
//         text,
//       });
//     } else {
//       console.log(`User with ID ${receiverId} not found`);
//     }
//     // ----
   
      
//     }
//   );

//   socket.on("disconnect", () => {
//     console.log("A user disconnected.");
//     removeUser(socket.id);
//     io.emit("getUsers", users);
//   });
// });

// // You might want to handle errors here as well
// io.on("error", (err) => {
//   console.error("Socket.IO error:", err.message);
// });
