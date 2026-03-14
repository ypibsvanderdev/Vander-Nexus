const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { PeerServer } = require('peer');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = process.env.PORT || 3000;

// Local Memory DB for "One-time use usernames" (Volatile & Anonymous)
// In a production app, this would be Firebase, but for "One-time use", 
// keeping it in memory makes it truly ephemeral and fast.
const users = new Map(); // socketId -> { username, peerId }
const usernames = new Map(); // username -> socketId

app.use(cors());
app.use(express.static(path.join(__dirname)));

io.on('connection', (socket) => {
    console.log('[VANDER-TALK] New Handshake established.');

    socket.on('join', ({ username, peerId }) => {
        if (usernames.has(username)) {
            socket.emit('error', 'Username Taken. Pick a new identity.');
            return;
        }
        
        const userData = { username, peerId, id: socket.id };
        users.set(socket.id, userData);
        usernames.set(username, socket.id);
        
        console.log(`[AUTH] User '${username}' initialized with PeerID: ${peerId}`);
        socket.emit('joined', userData);
        
        // Broadcast online status
        io.emit('user-update', Array.from(users.values()));
    });

    socket.on('send-message', ({ to, text, isImage, isFile }) => {
        const targetSocketId = usernames.get(to);
        const sender = users.get(socket.id);
        
        if (targetSocketId && sender) {
            io.to(targetSocketId).emit('receive-message', {
                from: sender.username,
                text,
                isImage,
                isFile,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
        }
    });

    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            usernames.delete(user.username);
            users.delete(socket.id);
            io.emit('user-update', Array.from(users.values()));
            console.log(`[AUTH] User '${user.username}' disconnected.`);
        }
    });
});

// Start PeerJS Server for Calls
const peerServer = PeerServer({ port: 9000, path: '/vander-calls' });

server.listen(PORT, () => {
    console.log(`\n📟 [VANDER-TALK CORE] ONLINE`);
    console.log(`🚀 SIGNAL SERVER: http://localhost:${PORT}`);
    console.log(`📞 CALL SERVER: http://localhost:9000/vander-calls\n`);
});
