// VANDER-TALK | Universal Intelligence Core
const socket = io();
let myData = null;
let activePeer = null;
let currentChat = null;
let peer;

// DOM Elements
const authPortal = document.getElementById('auth-portal');
const appContainer = document.querySelector('.app-container');
const authUsername = document.getElementById('auth-username');
const authEnter = document.getElementById('auth-enter');
const contactList = document.getElementById('contact-list');
const messageContainer = document.getElementById('message-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const activeAvatar = document.querySelector('#active-avatar img');
const activeName = document.getElementById('active-name');
const activeStatus = document.getElementById('active-status');
const myAvatar = document.getElementById('my-avatar');
const myUsernameLabel = document.getElementById('my-username');
const logoutBtn = document.getElementById('logout-btn');
const browserView = document.getElementById('browser-view');
const chatView = document.getElementById('chat-view');
const openBrowserBtn = document.getElementById('open-browser-btn');
const browserUrl = document.getElementById('browser-url');
const browserIframe = document.getElementById('browser-iframe');

// 🔐 AUTH SYSTEM
authEnter.onclick = () => {
    const user = authUsername.value.trim();
    if (!user) return alert('Identity Required');

    // Initialize PeerJS for Calls
    peer = new Peer(user + '-' + Math.floor(Math.random() * 1000), {
        host: window.location.hostname,
        port: 9000,
        path: '/vander-calls'
    });

    peer.on('open', (id) => {
        socket.emit('join', { username: user, peerId: id });
    });

    peer.on('call', (call) => {
        if (confirm(`Incoming Encrypted Call from ${call.peer.split('-')[0]}. Accept?`)) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                call.answer(stream);
                handleCallStream(call);
            });
        }
    });
};

socket.on('joined', (data) => {
    myData = data;
    authPortal.classList.add('hidden');
    appContainer.classList.remove('hidden');
    myUsernameLabel.innerText = data.username;
    myAvatar.src = `https://ui-avatars.com/api/?name=${data.username}&background=00FF88&color=000`;
});

socket.on('error', (msg) => alert(msg));

// 📡 REAL-TIME NETWORK
socket.on('user-update', (users) => {
    renderUsers(users.filter(u => u.username !== myData.username));
});

function renderUsers(users) {
    contactList.innerHTML = '';
    if (users.length === 0) {
        contactList.innerHTML = '<div class="placeholder-text">No other terminals online.</div>';
        return;
    }

    users.forEach(u => {
        const item = document.createElement('div');
        item.className = `chat-item ${currentChat === u.username ? 'active' : ''}`;
        item.innerHTML = `
            <img src="https://ui-avatars.com/api/?name=${u.username}&background=333&color=fff" class="avatar">
            <div class="info">
                <span class="name">${u.username}</span>
                <span class="preview">Ready for handshake</span>
            </div>
        `;
        item.onclick = () => selectChat(u);
        contactList.appendChild(item);
    });
}

function selectChat(user) {
    currentChat = user.username;
    activePeer = user.peerId;
    
    renderUsers([]); // refresh active state
    socket.emit('user-update-request'); // get fresh list

    activeAvatar.src = `https://ui-avatars.com/api/?name=${user.username}&background=333&color=fff`;
    activeName.innerText = user.username;
    activeStatus.innerText = 'Secured Line • Online';

    messageContainer.innerHTML = `<div class="encryption-banner"><i class="fas fa-lock"></i> <span>Channel XOR-Encrypted with ${user.username}</span></div>`;
}

// 💬 MESSAGING
sendBtn.onclick = sendMessage;
chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentChat) return;

    socket.emit('send-message', { to: currentChat, text });
    appendMessage(myData.username, text, 'sent');
    chatInput.value = '';
}

socket.on('receive-message', ({ from, text, isImage, isFile, time }) => {
    if (currentChat === from) {
        appendMessage(from, text, 'received', time);
    } else {
        // Notification logic could go here
        console.log(`New msg from ${from}: ${text}`);
    }
});

function appendMessage(from, text, type, time = null) {
    const t = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;
    msg.innerHTML = `
        <div class="msg-content">${text}</div>
        <div class="msg-meta">
            <span class="msg-time">${t}</span>
            ${type === 'sent' ? '<i class="fas fa-check-double read-receipt"></i>' : ''}
        </div>
    `;
    messageContainer.appendChild(msg);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

// 📞 CALLING SYSTEM
document.getElementById('btn-audio-call').onclick = () => {
    if (!activePeer) return alert('Select a terminal first');
    
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const call = peer.call(activePeer, stream);
        handleCallStream(call);
    });
};

function handleCallStream(call) {
    const overlay = document.getElementById('call-overlay');
    overlay.classList.remove('hidden');
    document.getElementById('call-status').innerText = "CONNECTING...";

    call.on('stream', (remoteStream) => {
        const audio = new Audio();
        audio.srcObject = remoteStream;
        audio.play();
        document.getElementById('call-status').innerText = "LIVE • ENCRYPTED";
    });

    document.getElementById('btn-end-call').onclick = () => {
        call.close();
        overlay.classList.add('hidden');
    };
}

// 🌐 DISCORD BROWSER
openBrowserBtn.onclick = () => {
    chatView.classList.remove('active');
    browserView.classList.add('active');
    openBrowserBtn.classList.add('active');
    document.querySelector('.node-btn:first-child').classList.remove('active');
};

document.querySelector('.node-btn:first-child').onclick = () => {
    browserView.classList.remove('active');
    chatView.classList.add('active');
    openBrowserBtn.classList.remove('active');
    document.querySelector('.node-btn:first-child').classList.add('active');
};

browserUrl.onkeypress = (e) => {
    if (e.key === 'Enter') {
        let url = browserUrl.value;
        if (!url.startsWith('http')) url = 'https://' + url;
        browserIframe.src = url;
    }
};

// 🏁 LOGOUT
logoutBtn.onclick = () => window.location.reload();
