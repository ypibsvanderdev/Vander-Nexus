// Vander-Nexus Core Logic

document.addEventListener('mousemove', (e) => {
    const glow = document.getElementById('glow-cursor');
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// Particle Engine
function createParticles() {
    const container = document.getElementById('particles');
    const count = 50;
    
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        
        const size = Math.random() * 3 + 1;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        
        container.appendChild(p);
        
        animateParticle(p);
    }
}

function animateParticle(p) {
    const duration = Math.random() * 10000 + 5000;
    const startY = parseFloat(p.style.top);
    
    p.animate([
        { transform: 'translateY(0) opacity(0.3)', opacity: 0.3 },
        { transform: `translateY(-${Math.random() * 200 + 100}px)`, opacity: 0 }
    ], {
        duration: duration,
        iterations: Infinity,
        easing: 'ease-out'
    });
}

createParticles();

// Viral Engine Logic
const VIRAL_FORMULAS = [
    { tag: "CONTROVERSIAL", template: "Stop using [TOPIC] for your business. Here is why it's killing your growth." },
    { tag: "RESULT-DRIVEN", template: "I used AI to automate [TOPIC] and reached $10k/month in 30 days. Here's exactly how." },
    { tag: "THE 'SECRET' HOOK", template: "The world's most successful [TOPIC] experts don't want you to know this 1 secret." },
    { tag: "LISTICLE", template: "5 tools for [TOPIC] that feel illegal to know. Number 4 will change your life." }
];

function generateViral() {
    const topic = document.getElementById('viral-input').value || "AI Automation";
    const output = document.getElementById('viral-output');
    const terminal = document.getElementById('terminal');
    
    output.innerHTML = "";
    logTerminal(`> Initiating Viral Matrix for: ${topic}`);
    
    setTimeout(() => {
        VIRAL_FORMULAS.forEach((formula, index) => {
            setTimeout(() => {
                const card = document.createElement('div');
                card.className = 'viral-card';
                card.innerHTML = `
                    <span class="tag">${formula.tag}</span>
                    <p>${formula.template.replace('[TOPIC]', topic)}</p>
                `;
                output.appendChild(card);
                logTerminal(`> Outputting Neural Hook #${index + 1}... [DONE]`);
            }, index * 400);
        });
    }, 800);
}

function logTerminal(msg) {
    const term = document.getElementById('terminal');
    const p = document.createElement('p');
    p.textContent = msg;
    term.appendChild(p);
    term.scrollTop = term.scrollHeight;
}

// Initial Stats Animation
let rev = 0;
setInterval(() => {
    if (Math.random() > 0.95) {
        rev += Math.random() * 10;
        document.querySelector('.stat-card.glow-green .value').textContent = `$${rev.toFixed(2)}`;
        logTerminal(`> REVENUE UPDATE: +$${rev.toFixed(2)} [INCOMING]`);
    }
}, 2000);
