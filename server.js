const express = require('express');
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

// 채팅 메시지 저장 배열
const chatMessages = [];

// 연결된 클라이언트들
const connectedClients = new Set();

io.on('connection', (socket) => {
  console.log('A user connected');

  // 클라이언트가 채팅 메시지를 보낼 때
  socket.on('chatMessage', (message) => {
    chatMessages.push(message);
    // 모든 클라이언트에게 채팅 메시지 전송
    io.emit('chatMessage', message);
  });

  // 클라이언트가 연결 종료할 때
  socket.on('disconnect', () => {
    console.log('User disconnected');
    connectedClients.delete(socket.id);
  });
});

// 정적 파일 제공 (클라이언트 파일들)
app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
