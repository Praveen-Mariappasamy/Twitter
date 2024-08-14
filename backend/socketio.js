const socket = require("socket.io");

let io;

const initializeSocketIO = (server) => {
  io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected (socket)");

    socket.on("disconnect", () => {
      console.log("User disconnected (socket)");
    });
  });
};

const getIO = () => io;

module.exports = { initializeSocketIO, getIO };
