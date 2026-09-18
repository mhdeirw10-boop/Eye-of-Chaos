// قاموس النصوص الشامل للغتين (الصفحة الرئيسية + الترمينال)
const i18n = {
  ar: {
    langBtn: "🌐 English",

    // نصوص الصفحة الرئيسية
    navHome: "الرئيسية",
    navLore: "الأسطورة",
    navChars: "الشخصيات",
    navChapters: "الفصول",
    heroTitle: "تبحث عن الحقيقة.. الحقائق تبحث عنك",
    heroDesc: "بوابة إلى عالم تتداخل فيه الذاكرة والهوية والفوضى والفراغ.",
    btnEnter: "ادخل الأسطورة",
    btnFiles: "الملفات",

    // نصوص صفحة الترمينال
    historyBtn: "📜 السجل",
    sidebarTitle: "سجل المحادثات",
    newChatBtn: "+ محادثة جديدة",
    backBtn: "← العودة للموقع الرئيسي",
    inputPlaceholder: "اكتب أمرك هنا..."
  },
  en: {
    langBtn: "🌐 العربية",

    // Main Page Texts
    navHome: "Home",
    navLore: "Lore",
    navChars: "Characters",
    navChapters: "Chapters",
    heroTitle: "Looking for truth.. Truth is looking for you",
    heroDesc: "A gateway to a realm where memory, identity, and chaos intertwine.",
    btnEnter: "Enter Lore",
    btnFiles: "Archive Files",

    // Terminal Page Texts
    historyBtn: "📜 History",
    sidebarTitle: "Chat History",
    newChatBtn: "+ New Chat",
    backBtn: "← Back to Main Site",
    inputPlaceholder: "Type your command here..."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. القائمة الجانبية في الهيدر (للموبايل)
  const header = document.querySelector('header');
  const menuBtn = document.getElementById('menu');
  if (menuBtn && header) {
    menuBtn.onclick = () => header.classList.toggle('active');
  }

  // 2. تحديث السنة تلقائياً
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 3. نظام إدار اللغتين للواجهة
  const langToggle = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('chaos_lang') || 'ar';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('chaos_lang', lang);
    
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // تحديث كل عنصر يحتوي على data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });

    // تحديث الـ Placeholder لخانة الإدخال
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (i18n[lang] && i18n[lang][key]) {
        el.placeholder = i18n[lang][key];
      }
    });
  }

  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const newLang = currentLang === 'ar' ? 'en' : 'ar';
      applyLanguage(newLang);
    });
  }

  applyLanguage(currentLang);

  // 4. عناصر وقوانين الترمينال والشريط الجانبي
  const input = document.getElementById('cmd');
  const out = document.getElementById('out');
  const sidebar = document.getElementById('sidebar');
  const openSidebar = document.getElementById('openSidebar');
  const closeSidebar = document.getElementById('closeSidebar');
  const historyList = document.getElementById('historyList');
  const newChatBtn = document.getElementById('newChatBtn');

  if (openSidebar && sidebar) {
    openSidebar.addEventListener('click', () => sidebar.classList.add('active'));
  }
  if (closeSidebar && sidebar) {
    closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));
  }

  // زر بدء محادثة جديدة
  if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
      if (out) {
        out.textContent = '> SYSTEM READY...\n';
      }
      if (sidebar) sidebar.classList.remove('active');
    });
  }

  let chatHistory = JSON.parse(localStorage.getItem('chaos_chat_history')) || [];

  function updateSidebarUI() {
    if (!historyList) return;
    historyList.innerHTML = '';
    
    chatHistory.slice().reverse().forEach((item) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      li.textContent = item.query;
      li.title = item.query;
      
      li.addEventListener('click', () => {
        if (out) {
          out.textContent += `\n> [History] ${item.query}\n${item.response}`;
          out.scrollTop = out.scrollHeight;
        }
        if (sidebar) sidebar.classList.remove('active');
      });

      historyList.appendChild(li);
    });
  }

  updateSidebarUI();

  if (input && out) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const inputVal = this.value;
        const cleanCmd = inputVal.toLowerCase().trim();

        if (!cleanCmd) return;

        if (cleanCmd === 'clear') {
          out.textContent = '';
          this.value = '';
          return;
        }

        let response = '';
        if (typeof ChaosAI !== 'undefined' && typeof ChaosAI.processQuery === 'function') {
          response = ChaosAI.processQuery(cleanCmd);
        } else if (typeof getCommandResponse === 'function') {
          response = getCommandResponse(cleanCmd);
        } else {
          response = 'ERROR: SYSTEM BRAIN NOT LOADED';
        }

        out.textContent += `\n> ${inputVal}\n${response}`;
        this.value = '';
        out.scrollTop = out.scrollHeight;

        chatHistory.push({ query: inputVal, response: response });
        if (chatHistory.length > 30) chatHistory.shift();
        localStorage.setItem('chaos_chat_history', JSON.stringify(chatHistory));
        
        updateSidebarUI();
      }
    });
  }
});
