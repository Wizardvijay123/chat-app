import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Store users and messages
const users = {};
const messages = [];

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send existing messages to new user
  socket.emit('get-messages', messages);

  // Handle user joining
  socket.on('user-join', (username) => {
    users[socket.id] = username;
    console.log(`${username} joined the chat`);
    
    // Notify all users about the new user
    io.emit('user-joined', { 
      id: socket.id, 
      username, 
      message: `${username} joined the chat`,
      timestamp: new Date().toISOString()
    });
  });

  // Handle new messages
  socket.on('send-message', (messageData) => {
    const message = {
      id: socket.id,
      username: users[socket.id],
      text: messageData.text,
      timestamp: new Date().toISOString()
    };
    
    messages.push(message);
    // Keep only the last 100 messages
    if (messages.length > 100) {
      messages.shift();
    }
    
    // Broadcast message to all users
    io.emit('new-message', message);
  });

  // Handle typing indicator
  socket.on('typing', (isTyping) => {
    socket.broadcast.emit('user-typing', {
      id: socket.id,
      username: users[socket.id],
      isTyping
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (users[socket.id]) {
      const username = users[socket.id];
      console.log(`${username} disconnected`);
      
      // Notify all users about the disconnection
      io.emit('user-left', {
        id: socket.id,
        username,
        message: `${username} left the chat`,
        timestamp: new Date().toISOString()
      });
      
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});