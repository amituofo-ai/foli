// AI Chat Assistant Logic

const AI_SYSTEM_PROMPT = `你是一位谦卑、慈悲、博学的佛教同修居士（Upasaka/Upasika）。
你的名字叫“善慧”。
你对佛法有深刻的理解，但你非常谦虚，总是以“个人浅见”或“仅供参考”作为回答的基调。
你语气平和、简洁，充满慈悲心。
如果用户问及非佛法相关的问题，你可以礼貌地引导回修行或生活智慧，或者简短回答。

你的主要功能是根据提供的【今日佛历信息】回答用户关于日期、节日、宜忌等问题。
当回答关于“今天是什么日子”时，请结合公历、农历、干支和佛教节日来回答。

请注意：虽然你博学，但你要表现得像一位修行的同修，而不是高高在上的大师。
`;

// State
let chatHistory = [];
let isChatOpen = false;

// UI Elements (Initialized on load)
let chatModal, chatMessages, chatInput, sendBtn;

document.addEventListener('DOMContentLoaded', () => {
    injectAIChatUI();
    
    // Bind elements
    chatModal = document.getElementById('ai-chat-modal');
    chatMessages = document.getElementById('ai-chat-messages');
    chatInput = document.getElementById('ai-chat-input');
    sendBtn = document.getElementById('ai-send-btn');
    
    // Event Listeners
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserSend();
    });
});

function injectAIChatUI() {
    const fabHTML = `
    <!-- AI FAB Button -->
    <button onclick="toggleAIChat()" class="fixed bottom-24 right-5 w-14 h-14 bg-[#b35c1e]/90 backdrop-blur-sm text-white rounded-full shadow-[0_4px_12px_rgba(179,92,30,0.4)] flex items-center justify-center z-40 hover:bg-[#a67c52] active:scale-90 transition-all border border-white/30 ring-2 ring-white/20">
        <span class="font-serif font-bold text-xl">問</span>
    </button>

    <!-- AI Chat Modal -->
    <div id="ai-chat-modal" class="fixed inset-0 z-50 hidden">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onclick="toggleAIChat()"></div>
        
        <!-- Chat Container -->
        <div class="absolute bottom-0 left-0 right-0 top-20 md:top-auto md:bottom-20 md:right-5 md:left-auto md:w-96 md:h-[600px] bg-white/60 backdrop-blur-2xl rounded-t-3xl md:rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.1)] border border-white/60 ring-1 ring-white/40 flex flex-col overflow-hidden transform transition-transform duration-300 translate-y-full" id="ai-chat-container">
            
            <!-- Header -->
            <div class="bg-white/30 p-4 flex justify-between items-center border-b border-white/30 backdrop-blur-md">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#b35c1e] to-[#d68c45] text-white flex items-center justify-center font-bold font-serif shadow-inner border border-white/20">慧</div>
                    <div>
                        <div class="font-bold text-[#5c4033] drop-shadow-sm">善慧居士</div>
                        <div class="text-xs text-[#8B4513]/70">AI 同修助理</div>
                    </div>
                </div>
                <button onclick="toggleAIChat()" class="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/40 text-[#8B4513]/60 hover:text-[#8B4513] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Messages Area -->
            <div id="ai-chat-messages" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#b35c1e] to-[#d68c45] text-white flex items-center justify-center shrink-0 text-xs mt-1 border border-white/20 shadow-sm">慧</div>
                    <div class="bg-white/50 backdrop-blur-md p-3 rounded-2xl rounded-tl-none shadow-sm text-[#5c4033] text-sm max-w-[85%] border border-white/40">
                        阿弥陀佛，师兄吉祥。我是善慧，您的同修助理。您想了解今天的日子，还是查询斋期呢？
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-3 bg-white/40 border-t border-white/30 backdrop-blur-md">
                <div class="flex gap-2">
                    <input type="text" id="ai-chat-input" placeholder="请教善慧师兄..." class="flex-1 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-[#5c4033] placeholder-[#8B4513]/40 focus:outline-none focus:ring-2 focus:ring-[#b35c1e]/20 border border-white/40 shadow-inner">
                    <button id="ai-send-btn" onclick="handleUserSend()" class="w-10 h-10 bg-gradient-to-br from-[#b35c1e] to-[#d68c45] text-white rounded-full flex items-center justify-center hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 border border-white/20 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', fabHTML);
}

function toggleAIChat() {
    const modal = document.getElementById('ai-chat-modal');
    const container = document.getElementById('ai-chat-container');
    
    if (isChatOpen) {
        // Close
        container.classList.add('translate-y-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    } else {
        // Open
        modal.classList.remove('hidden');
        // Small delay to allow display:block to apply before transition
        setTimeout(() => {
            container.classList.remove('translate-y-full');
        }, 10);
        
        // Focus input
        setTimeout(() => {
            document.getElementById('ai-chat-input').focus();
        }, 300);
    }
    isChatOpen = !isChatOpen;
}

function getLunarContext() {
    try {
        const d = new Date();
        const lunar = Lunar.fromDate(d);
        
        // Basic Info
        const dateStr = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`;
        const lunarStr = lunar.toString();
        const ganZhi = `${lunar.getYearInGanZhi()}年 ${lunar.getMonthInGanZhi()}月 ${lunar.getDayInGanZhi()}日`;
        
        // Festivals
        const festivals = lunar.getFestivals().map(f => f.toString()).join('、');
        const buddhistFestivals = lunar.getOtherFestivals().map(f => f.toString()).join('、'); // lunar-javascript sometimes puts religious festivals in other
        
        // Yi/Ji
        const yi = lunar.getDayYi().join('、');
        const ji = lunar.getDayJi().join('、');
        
        // 28 Mansions & 12 Day Officers
        const xiu = lunar.getXiu();
        const zhi = lunar.getZhiXing();

        // Upcoming Festivals (Next 15 days)
        let upcoming = [];
        for(let i=1; i<=15; i++) {
            const nextDate = new Date(d);
            nextDate.setDate(d.getDate() + i);
            const nextLunar = Lunar.fromDate(nextDate);
            const nextFests = [...nextLunar.getFestivals(), ...nextLunar.getOtherFestivals()];
            if(nextFests.length > 0) {
                upcoming.push(`${nextLunar.getMonthInChinese()}月${nextLunar.getDayInChinese()} (${nextFests.join(',')})`);
            }
        }

        return `
【今日信息】
公历：${dateStr}
农历：${lunarStr}
干支：${ganZhi}
星宿：${xiu}宿
建除十二神：${zhi}日
宜：${yi}
忌：${ji}
今日节日：${festivals} ${buddhistFestivals}

【未来15天重要日子】
${upcoming.join('\n')}
`;
    } catch (e) {
        console.error("Context Error", e);
        return "（无法获取日历数据，请根据通用知识回答）";
    }
}

async function handleUserSend() {
    const input = document.getElementById('ai-chat-input');
    const btn = document.getElementById('ai-send-btn');
    const msg = input.value.trim();
    
    if (!msg) return;
    
    // Disable UI
    input.value = '';
    input.disabled = true;
    btn.disabled = true;
    
    // Add User Message
    addMessage('user', msg);
    
    // Show Typing Indicator
    const typingId = addTypingIndicator();
    
    try {
        // Build Prompt
        const context = getLunarContext();
        const fullPrompt = `
CONTEXT_DATA:
${context}

USER_QUESTION:
${msg}
`;

        const response = await callGeminiFlash(fullPrompt);
        
        // Remove typing
        removeMessage(typingId);
        
        // Add AI Message
        addMessage('ai', response);
        
    } catch (error) {
        console.error(error);
        removeMessage(typingId);
        // Show specific error message if available
        let displayMsg = '阿弥陀佛，网络连接似乎不畅，请稍后再试。';
        if (error.message && error.message.includes('Gemini API Error:')) {
            displayMsg = `阿弥陀佛，连接出错：${error.message.replace('Gemini API Error:', '')}`;
        }
        addMessage('ai', displayMsg);
    } finally {
        input.disabled = false;
        btn.disabled = false;
        input.focus();
    }
}

function addMessage(role, text) {
    const container = document.getElementById('ai-chat-messages');
    const isAI = role === 'ai';
    
    const html = `
    <div class="flex gap-3 ${isAI ? '' : 'flex-row-reverse'} animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div class="w-8 h-8 rounded-full ${isAI ? 'bg-gradient-to-br from-[#b35c1e] to-[#d68c45]' : 'bg-stone-400'} text-white flex items-center justify-center shrink-0 text-xs mt-1 shadow-sm border border-white/20">
            ${isAI ? '慧' : '我'}
        </div>
        <div class="${isAI ? 'bg-white/60 backdrop-blur-md text-[#5c4033] border border-white/40' : 'bg-gradient-to-br from-[#b35c1e] to-[#d68c45] text-white shadow-md border border-[#b35c1e]/20'} p-3 rounded-2xl ${isAI ? 'rounded-tl-none' : 'rounded-tr-none'} shadow-sm text-sm max-w-[85%] leading-relaxed">
            ${formatMessage(text)}
        </div>
    </div>
    `;
    
    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
}

function formatMessage(text) {
    // Simple markdown formatting for bold and breaks
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
               .replace(/\n/g, '<br>');
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const container = document.getElementById('ai-chat-messages');
    const html = `
    <div id="${id}" class="flex gap-3 animate-pulse">
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-[#b35c1e] to-[#d68c45] text-white flex items-center justify-center shrink-0 text-xs mt-1 border border-white/20">慧</div>
        <div class="bg-white/50 backdrop-blur-md p-3 rounded-2xl rounded-tl-none shadow-sm text-[#8B4513]/50 text-sm border border-white/40">
            <div class="flex gap-1">
                <div class="w-1.5 h-1.5 bg-[#8B4513]/50 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                <div class="w-1.5 h-1.5 bg-[#8B4513]/50 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                <div class="w-1.5 h-1.5 bg-[#8B4513]/50 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
        </div>
    </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
    container.scrollTop = container.scrollHeight;
    return id;
}

function removeMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

async function callGeminiFlash(prompt) {
    // Use Vercel Serverless Function to hide API Key and avoid CORS
    const URL = '/api/get-gemini';
    
    // Manage History (Last 5 turns to keep context window small but useful)
    // We only send the system prompt + current context + user message for this simple implementation
    
    const historyPayload = chatHistory.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.text }]
    }));
    
    // Simple payload structure for debugging
    const payload = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }]
    };

    const response = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        let errorMessage = response.statusText;
        
        // Check if response is HTML (likely 404 from static server)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('text/html')) {
            throw new Error('Local Environment Error: Please use "vercel dev" or deploy to Vercel to use AI features.');
        }

        try {
            const errorData = await response.json();
            console.error("Gemini API Error Data:", errorData);
            if (errorData.details) errorMessage = errorData.details;
            if (errorData.error && errorData.error.message) errorMessage = errorData.error.message;
        } catch(e) {
            console.error("Failed to parse error JSON:", e);
        }
        throw new Error(`Gemini API Error: ${errorMessage}`);
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    
    // Update History
    chatHistory.push({ role: 'user', text: prompt.split('USER_QUESTION:')[1].trim() }); 
    chatHistory.push({ role: 'ai', text: text });
    
    return text;
}
