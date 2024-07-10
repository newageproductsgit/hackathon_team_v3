import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3001;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://hackathon-team-v3-9y6k.vercel.app/",
      "https://hackathon-team-v3-lyd9.vercel.app/",
      "https://hackathon-team-v3-3xcv.vercel.app/",
    ],
    methods: ["GET", "POST"],
    transports: ["websocket"],
    credentials: true,
  },
});

app.use(cors());

const rooms = {}; // Object to store room information

app.get("/check-room/:room", (req, res) => {
  const room = req.params.room;
  if (rooms[room]) {
    res.status(200).json({ exists: true, data: rooms[room] });
  } else {
    res.status(200).json({ exists: false, data: null });
  }
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  socket.on("join-room", ({ room, username }) => {
    socket.join(room);
    if (!rooms[room]) {
      rooms[room] = [];
      // First user to join is the admin
      rooms[room].push({ id: socket.id, username, role: "admin" });
    } else {
      const userExists = rooms[room].some((user) => user.username === username);

      if (!userExists) {
        // Add new user as joiner
        rooms[room].push({ id: socket.id, username, role: "joinee" });
      } else {
        // User already exists, do nothing
        console.log(`User ${username} already present in room ${room}`);
      }
    }
    console.log(`User ${username} joined room ${room}`);

    // Emit updated user list to all clients in the room
    io.to(room).emit("room-users", rooms[room]);
  });

  socket.on("message", ({ room, message, username }) => {
    console.log({ room, message, username });
    io.to(room).emit("receive-message", { message, username });
  });

  socket.on("fastest-finger-winner", ({ room, username }) => {
    console.log({ room, username });
    io.to(room).emit("receive-ff-winner", { room, username });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    for (const room in rooms) {
      rooms[room] = rooms[room].filter((user) => user.id !== socket.id);
      if (rooms[room].length === 0) {
        delete rooms[room];
      } else {
        // If admin left, promote the next user to admin
        if (!rooms[room].some((user) => user.role === "admin")) {
          rooms[room][0].role = "admin";
        }
        io.to(room).emit("room-users", rooms[room]);
      }
    }
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
