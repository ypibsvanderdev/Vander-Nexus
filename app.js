// VANDER-TALK | Dynamic Intelligence

const contacts = [
    { id: 1, name: "Vander Dumper", status: "ONLINE", avatar: "https://ui-avatars.com/api/?name=VD&background=02b3e4&color=fff", lastMsg: "Encryption handshake complete." },
    { id: 2, name: "Delta Executor", status: "AWAY", avatar: "https://ui-avatars.com/api/?name=DE&background=7e3ff2&color=fff", lastMsg: "Did the kernel update fix the crash?" },
    { id: 3, name: "Shadow Admin", status: "BUSY", avatar: "https://ui-avatars.com/api/?name=SA&background=ff3b3b&color=fff", lastMsg: "We need more burner lines for the leak." },
    { id: 4, name: "Crypto Ghost", status: "ONLINE", avatar: "https://ui-avatars.com/api/?name=CG&background=00ff88&color=000", lastMsg: "Payment received. Tracking disabled." }
];

let activeChat = null;
let ghostMode = false;

// DOM Elements
const contactList = document.getElementById('contact-list');
const messageContainer = document.getElementById('message-container');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const activeAvatar = document.querySelector('#active-avatar img');
const activeName = document.getElementById('active-name');
const activeStatus = document.getElementById('active-status');
const ghostBtn = document.getElementById('ghost-mode-btn');
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
    activeChat = contact;
    renderContacts();
    
    activeAvatar.src = contact.avatar;
    activeName.innerText = contact.name;
    activeStatus.innerText = contact.status === 'ONLINE' ? 'Secured Line • Online' : 'Standard Loop • Offline';
    
    // Clear & Show history placeholder
    messageContainer.innerHTML = `
        <div class="encryption-banner">
            <i class="fas fa-lock"></i>
            <span>Session Key: ${Math.random().toString(36).substring(7).toUpperCase()}-VDR</span>
        </div>
        <div class="msg received">Establishing peer-to-peer connection...</div>
        <div class="msg received">${contact.lastMsg}</div>
    `;
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'sent');
    chatInput.value = '';

    // Auto-reply simulation
    setTimeout(() => {
        const responses = [
            "Link verified. Proceed with handshake.",
            "Copy that. Initiating stealth protocol.",
            "The dumper is blocked on my end. You safe?",
            "Sending the raw source now. Do not leak."
        ];
        const randomReply = responses[Math.floor(Math.random() * responses.length)];
        appendMessage(randomReply, 'received');
    }, 1500);
}

function appendMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;
    msg.innerText = text;
    messageContainer.appendChild(msg);
    messageContainer.scrollTop = messageContainer.scrollHeight;

    if (ghostMode && type === 'sent') {
        setTimeout(() => {
            msg.style.transition = '0.5s';
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 500);
        }, 5000); // Burn after 5 seconds in Ghost Mode
    }
}

function setupListeners() {
    sendBtn.onclick = sendMessage;
    chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

    ghostBtn.onclick = () => {
        ghostMode = !ghostMode;
        ghostBtn.classList.toggle('active');
        if (ghostMode) {
            logNotification("GHOST MODE ENABLED: Messages will self-destruct in 5s.");
        }
    };

    audioCallBtn.onclick = triggerCall;
    endCallBtn.onclick = () => {
        callOverlay.classList.add('hidden');
    };
}

function triggerCall() {
    if (!activeChat) return;
    document.getElementById('overlay-avatar').src = activeChat.avatar;
    document.getElementById('overlay-name').innerText = activeChat.name;
    callOverlay.classList.remove('hidden');
    
    // Simulate connection
    setTimeout(() => {
        document.getElementById('call-status').innerText = "00:01 • SECURE LINE";
    }, 3000);
}

function logNotification(text) {
    const banner = document.createElement('div');
    banner.className = 'encryption-banner';
    banner.style.border = '1px solid var(--danger)';
    banner.style.color = var(--danger);
    banner.innerHTML = `<i class="fas fa-shield-alt"></i> <span>${text}</span>`;
    messageContainer.appendChild(banner);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

init();
