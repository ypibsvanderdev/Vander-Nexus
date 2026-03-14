// VANDER-TALK | Dynamic Intelligence

const contacts = [
    { id: 1, name: "Vander Dumper", status: "ONLINE", avatar: "https://ui-avatars.com/api/?name=VD&background=02b3e4&color=fff", lastMsg: "Encryption handshake complete.", history: [], pinned: true },
    { id: 2, name: "Delta Executor", status: "AWAY", avatar: "https://ui-avatars.com/api/?name=DE&background=7e3ff2&color=fff", lastMsg: "Did the kernel update fix the crash?", history: [], pinned: false },
    { id: 3, name: "Shadow Admin", status: "BUSY", avatar: "https://ui-avatars.com/api/?name=SA&background=ff3b3b&color=fff", lastMsg: "We need more burner lines for the leak.", history: [], pinned: false },
    { id: 4, name: "Crypto Ghost", status: "ONLINE", avatar: "https://ui-avatars.com/api/?name=CG&background=00ff88&color=000", lastMsg: "Payment received. Tracking disabled.", history: [], pinned: false }
];

let activeChat = null;
let ghostMode = false;
let isDarkMode = true;
let ghostTimeout = 5000;

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
const fileInput = document.getElementById('file-input');
const plusBtn = document.querySelector('.attach-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const profileModal = document.getElementById('profile-modal');
const closeBtns = document.querySelectorAll('.close-modal');

// Initialize
function init() {
    renderContacts();
    setupListeners();
    selectChat(contacts[0]);
}

function renderContacts() {
    contactList.innerHTML = '';
    const sorted = [...contacts].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    
    sorted.forEach(c => {
        const item = document.createElement('div');
        item.className = `chat-item ${activeChat && activeChat.id === c.id ? 'active' : ''} ${c.pinned ? 'pinned' : ''}`;
        item.innerHTML = `
            <img src="${c.avatar}" class="avatar">
            <div class="info">
                <span class="name">${c.name}</span>
                <span class="preview">${c.lastMsg}</span>
            </div>
        `;
        item.onclick = () => selectChat(c);
        
        // Context menu for pinning (Right click)
        item.oncontextmenu = (e) => {
            e.preventDefault();
            c.pinned = !c.pinned;
            renderContacts();
        };
        
        contactList.appendChild(item);
    });
}

function selectChat(contact) {
    if (activeChat && activeChat.id === contact.id && messageContainer.innerHTML !== '') return;
    
    activeChat = contact;
    renderContacts();
    
    activeAvatar.src = contact.avatar;
    activeName.innerText = contact.name;
    activeStatus.innerText = contact.status === 'ONLINE' ? 'Secured Line • Online' : 'Standard Loop • Offline';
    
    messageContainer.innerHTML = `
        <div class="encryption-banner">
            <i class="fas fa-lock"></i>
            <span>Session Key: ${Math.random().toString(36).substring(7).toUpperCase()}-VDR</span>
        </div>
    `;
    
    contact.history.forEach(m => appendMessageToDOM(m.text, m.type, m.isImage));
    
    if (contact.history.length === 0) {
        appendMessage("Establishing peer-to-peer connection...", 'received', false);
        appendMessage(contact.lastMsg, 'received', false);
    }
}

function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage(text, 'sent');
    chatInput.value = '';
    simulateReply();
}

function simulateReply() {
    setTimeout(() => {
        activeStatus.innerText = 'Typing...';
        activeStatus.style.color = 'var(--primary)';
        setTimeout(() => {
            const responses = ["Link verified.", "Proceed with handshake.", "The dumper is blocked.", "Source locked."];
            appendMessage(responses[Math.floor(Math.random() * responses.length)], 'received');
            activeStatus.innerText = 'Secured Line • Online';
            activeStatus.style.color = '';
        }, 1500);
    }, 500);
}

function appendMessage(text, type, isImage = false) {
    if (!activeChat) return;
    activeChat.history.push({ text, type, isImage });
    activeChat.lastMsg = isImage ? "📷 Image Transmitted" : text;
    renderContacts();
    appendMessageToDOM(text, type, isImage);
    
    if (ghostMode && type === 'sent') {
        const msgText = text;
        setTimeout(() => {
            const index = activeChat.history.findIndex(m => m.text === msgText);
            if (index > -1) activeChat.history.splice(index, 1);
            const lastMsgElement = messageContainer.lastElementChild;
            if (lastMsgElement && lastMsgElement.querySelector('.msg-content').innerText === msgText) {
                lastMsgElement.classList.add('fading');
                setTimeout(() => lastMsgElement.remove(), 500);
            }
        }, ghostTimeout);
    }
}

function appendMessageToDOM(text, type, isImage = false) {
    const now = new Date();
    const time = now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
    const msg = document.createElement('div');
    msg.className = `msg ${type}`;
    
    let content = isImage ? `<img src="${text}" class="shared-img">` : text;
    
    msg.innerHTML = `
        <div class="reaction-bar">
            <span>👍</span><span>❤️</span><span>🔥</span><span>🔒</span>
        </div>
        <div class="msg-content">${content}</div>
        <div class="msg-meta">
            <span class="msg-time">${time}</span>
            ${type === 'sent' ? '<i class="fas fa-check-double read-receipt"></i>' : ''}
        </div>
    `;
    
    // Reaction Logic
    msg.querySelectorAll('.reaction-bar span').forEach(s => {
        s.onclick = () => {
            const react = document.createElement('div');
            react.className = 'msg-reaction';
            react.innerText = s.innerText;
            react.style.fontSize = '12px';
            react.style.marginTop = '4px';
            msg.appendChild(react);
            msg.querySelector('.reaction-bar').remove();
        };
    });

    messageContainer.appendChild(msg);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function setupListeners() {
    sendBtn.onclick = sendMessage;
    chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

    // Search
    const searchInput = document.querySelector('.search-bar input');
    searchInput.oninput = () => {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll('.chat-item').forEach(item => {
            item.style.display = item.innerText.toLowerCase().includes(query) ? 'flex' : 'none';
        });
    };

    // Modals
    settingsBtn.onclick = () => settingsModal.classList.remove('hidden');
    activeAvatar.onclick = () => {
        if (!activeChat) return;
        document.getElementById('prof-avatar').src = activeChat.avatar;
        document.getElementById('prof-name').innerText = activeChat.name;
        profileModal.classList.remove('hidden');
    };
    closeBtns.forEach(b => b.onclick = () => {
        settingsModal.classList.add('hidden');
        profileModal.classList.add('hidden');
    });

    // Theme
    themeToggle.onclick = () => {
        isDarkMode = !isDarkMode;
        document.body.classList.toggle('light-mode');
        themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    };

    // Ghost Mode
    ghostBtn.onclick = () => {
        ghostMode = !ghostMode;
        ghostBtn.classList.toggle('active');
        logNotification(ghostMode ? "GHOST MODE ON: 5s TTL" : "GHOST MODE OFF");
    };

    // File Upload Simulation
    plusBtn.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => appendMessage(ev.target.result, 'sent', true);
            reader.readAsDataURL(file);
        }
    };

    audioCallBtn.onclick = triggerCall;
    endCallBtn.onclick = () => callOverlay.classList.add('hidden');
}

function triggerCall() {
    if (!activeChat) return;
    document.getElementById('overlay-avatar').src = activeChat.avatar;
    document.getElementById('overlay-name').innerText = activeChat.name;
    callOverlay.classList.remove('hidden');
}

function logNotification(text) {
    const banner = document.createElement('div');
    banner.className = 'encryption-banner';
    banner.style.color = 'var(--danger)';
    banner.innerHTML = `<i class="fas fa-shield-alt"></i> <span>${text}</span>`;
    messageContainer.appendChild(banner);
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

init();
