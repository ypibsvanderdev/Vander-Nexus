// VANDER-TALK | Dynamic Intelligence

const contacts = [
    { id: 1, name: "Vander Dumper", status: "ONLINE", avatar: "https://ui-avatars.com/api/?name=VD&background=02b3e4&color=fff", lastMsg: "Encryption handshake complete.", history: [] },
    { id: 2, name: "Delta Executor", status: "AWAY", avatar: "https://ui-avatars.com/api/?name=DE&background=7e3ff2&color=fff", lastMsg: "Did the kernel update fix the crash?", history: [] },
    { id: 3, name: "Shadow Admin", status: "BUSY", avatar: "https://ui-avatars.com/api/?name=SA&background=ff3b3b&color=fff", lastMsg: "We need more burner lines for the leak.", history: [] },
    { id: 4, name: "Crypto Ghost", status: "ONLINE", avatar: "https://ui-avatars.com/api/?name=CG&background=00ff88&color=000", lastMsg: "Payment received. Tracking disabled.", history: [] }
];

let activeChat = null;
let ghostMode = false;
let isDarkMode = true;

// DOM Elements
const contactList = document.getElementById('contact-list');
const messageContainer = document.getElementById('message-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const activeAvatar = document.querySelector('#active-avatar img');
const activeName = document.getElementById('active-name');
const activeStatus = document.getElementById('active-status');
const ghostBtn = document.getElementById('ghost-mode-btn');
const themeToggle = document.getElementById('theme-toggle');
const callOverlay = document.getElementById('call-overlay');
const audioCallBtn = document.getElementById('btn-audio-call');
const endCallBtn = document.getElementById('btn-end-call');

// Initialize
function init() {
    renderContacts();
    setupListeners();
    selectChat(contacts[0]);
}

function renderContacts() {
    contactList.innerHTML = '';
    contacts.forEach(c => {
        const item = document.createElement('div');
        item.className = `chat-item ${activeChat && activeChat.id === c.id ? 'active' : ''}`;
        item.innerHTML = `
            <img src="${c.avatar}" class="avatar">
            <div class="info">
                <span class="name">${c.name}</span>
                <span class="preview">${c.lastMsg}</span>
            </div>
        `;
        item.onclick = () => selectChat(c);
        contactList.appendChild(item);
    });
}

function selectChat(contact) {
    if (activeChat && activeChat.id === contact.id) return;
    
    activeChat = contact;
    renderContacts();
    
    activeAvatar.src = contact.avatar;
    activeName.innerText = contact.name;
    activeStatus.innerText = contact.status === 'ONLINE' ? 'Secured Line • Online' : 'Standard Loop • Offline';
    
    // Clear & Show history
    messageContainer.innerHTML = `
        <div class="encryption-banner">
            <i class="fas fa-lock"></i>
            <span>Session Key: ${Math.random().toString(36).substring(7).toUpperCase()}-VDR</span>
        </div>
    `;
    
    contact.history.forEach(m => appendMessageToDOM(m.text, m.type));
    
    if (contact.history.length === 0) {
        appendMessage("Establishing peer-to-peer connection...", 'received', true);
        appendMessage(contact.lastMsg, 'received', true);
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'sent');
    chatInput.value = '';

    // Simulate "Typing..."
    setTimeout(() => {
        activeStatus.innerText = 'Typing...';
        activeStatus.style.color = 'var(--primary)';
        
        setTimeout(() => {
            const responses = [
                "Link verified. Proceed with handshake.",
                "Copy that. Initiating stealth protocol.",
                "The dumper is blocked on my end. You safe?",
                "Sending the raw source now. Do not leak."
            ];
            const randomReply = responses[Math.floor(Math.random() * responses.length)];
            appendMessage(randomReply, 'received');
            activeStatus.innerText = 'Secured Line • Online';
            activeStatus.style.color = '';
        }, 1500);
    }, 500);
}

function appendMessage(text, type, silent = false) {
    if (!activeChat) return;
    
    activeChat.history.push({ text, type });
    activeChat.lastMsg = text;
    renderContacts();
    
    appendMessageToDOM(text, type);
    
    if (ghostMode && type === 'sent') {
        const historyCopy = [...activeChat.history];
        setTimeout(() => {
            const index = activeChat.history.findIndex(m => m.text === text && m.type === 'sent');
            if (index > -1) activeChat.history.splice(index, 1);
            // Re-render if looking at the same chat
            const lastMsgElement = document.querySelector(`.msg:last-child`);
            if (lastMsgElement && lastMsgElement.innerText === text) {
                lastMsgElement.style.transition = '0.5s';
                lastMsgElement.style.opacity = '0';
                setTimeout(() => lastMsgElement.remove(), 500);
            }
        }, 5000);
    }
}

function appendMessageToDOM(text, type) {
    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
    
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;
    msg.innerHTML = `
        <div class="msg-content">${text}</div>
        <div class="msg-meta">
            <span class="msg-time">${time}</span>
            ${type === 'sent' ? '<i class="fas fa-check-double read-receipt"></i>' : ''}
        </div>
    `;
    messageContainer.appendChild(msg);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

const searchInput = document.querySelector('.search-bar input');

function setupListeners() {
    sendBtn.onclick = sendMessage;
    chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

    // Real-time Search Logic
    searchInput.oninput = () => {
        const query = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('.chat-item');
        items.forEach((item, index) => {
            const name = contacts[index].name.toLowerCase();
            item.style.display = name.includes(query) ? 'flex' : 'none';
        });
    };

    ghostBtn.onclick = () => {
        ghostMode = !ghostMode;
        ghostBtn.classList.toggle('active');
        if (ghostMode) {
            logNotification("GHOST MODE ENABLED: Messages will self-destruct in 5s.");
        }
    };

    themeToggle.onclick = () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('light-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };

    audioCallBtn.onclick = triggerCall;
    endCallBtn.onclick = () => {
        callOverlay.classList.add('hidden');
    };

    // Voice Memo Simulation
    const plusBtn = document.querySelector('.attach-btn');
    let isRecording = false;
    plusBtn.onclick = () => {
        isRecording = !isRecording;
        if (isRecording) {
            plusBtn.style.color = 'var(--danger)';
            plusBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            logNotification("RECORDING VOICE MEMO...");
        } else {
            plusBtn.style.color = '';
            plusBtn.innerHTML = '<i class="fas fa-plus"></i>';
            appendMessage("🎤 Voice Message (0:04)", 'sent');
        }
    };
}

function triggerCall() {
    if (!activeChat) return;
    document.getElementById('overlay-avatar').src = activeChat.avatar;
    document.getElementById('overlay-name').innerText = activeChat.name;
    callOverlay.classList.remove('hidden');
    
    setTimeout(() => {
        document.getElementById('call-status').innerText = "00:01 • SECURE LINE";
    }, 3000);
}

function logNotification(text) {
    const banner = document.createElement('div');
    banner.className = 'encryption-banner';
    banner.style.border = '1px solid var(--danger)';
    banner.style.color = 'var(--danger)'; 
    banner.innerHTML = `<i class="fas fa-shield-alt"></i> <span>${text}</span>`;
    messageContainer.appendChild(banner);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

init();
