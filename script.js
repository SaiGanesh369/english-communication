const micBtn = document.getElementById('micBtn');
const chatBox = document.getElementById('chatBox');
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

// 1. Get or set API Key
function getApiKey() {
    let key = localStorage.getItem('GEMINI_KEY');
    if (!key) {
        key = prompt("Enter your Gemini API Key:");
        localStorage.setItem('GEMINI_KEY', key);
    }
    return key;
}

// 2. Add message to UI
function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = `bubble ${sender}`;
    div.innerText = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 3. Speech Recognition
micBtn.onclick = () => {
    micBtn.classList.add('active');
    recognition.start();
};

recognition.onresult = async (event) => {
    micBtn.classList.remove('active');
    const text = event.results[0][0].transcript;
    addMessage(text, 'user');
    
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${getApiKey()}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text }] }] })
    });
    const data = await response.json();
    addMessage(data.candidates[0].content.parts[0].text, 'ai');
};
