// ==========================================
// CHAOS SYSTEM - Main Application Core (app.js)
// النواة الرئيسية وربط الوحدات والواجهة
// ==========================================

// قاموس النصوص الشامل للغتين (الصفحة الرئيسية + الترمينال)
const i18n = {
  ar: {
    langBtn: "🌐 English",
    navHome: "الرئيسية",
    navLore: "الأسطورة",
    navChars: "الشخصيات",
    navChapters: "الفصول",
    heroTitle: "تبحث عن الحقيقة.. الحقائق تبحث عنك",
    heroDesc: "بوابة إلى عالم تتداخل فيه الذاكرة والهوية والفوضى والفراغ.",
    btnEnter: "ادخل الأسطورة",
    btnFiles: "الملفات",
    historyBtn: "📜 السجل",
    sidebarTitle: "سجل المحادثات",
    newChatBtn: "+ محادثة جديدة",
    backBtn: "← العودة للموقع الرئيسي",
    inputPlaceholder: "اكتب أمرك هنا..."
  },
  en: {
    langBtn: "🌐 العربية",
    navHome: "Home",
    navLore: "Lore",
    navChars: "Characters",
    navChapters: "Chapters",
    heroTitle: "Looking for truth.. Truth is looking for you",
    heroDesc: "A gateway to a realm where memory, identity, and chaos intertwine.",
    btnEnter: "Enter Lore",
    btnFiles: "Archive Files",
    historyBtn: "📜 History",
    sidebarTitle: "Chat History",
    newChatBtn: "+ New Chat",
    backBtn: "← Back to Main Site",
    inputPlaceholder: "Type your command here..."
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // 0. تهيئة النظام والتحقق من وضع التطوير عبر config.js
  if (typeof ChaosConfig !== 'undefined' && ChaosConfig.debugMode) {
    console.log(`[CHAOS APP] جاري تهيئة النظام - الإصدار: ${ChaosConfig.version}`);
  }

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

  // 3. نظام إدارة اللغتين للواجهة
  const langToggle = document.getElementById('langToggle');
  let currentLang = localStorage.getItem('chaos_lang') || (typeof ChaosConfig !== 'undefined' ? ChaosConfig.language : 'ar');

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('chaos_lang', lang);
    
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (i18n[lang] && i18n[lang][key]) {
        el.textContent = i18n[lang][key];
      }
    });

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

  // 5. معالجة الأوامر والمدخلات مع ربط الوحدات المركزية (Security & Commands & Memory)
  if (input && out) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        const inputVal = this.value;
        const cleanCmd = inputVal.toLowerCase().trim();

        if (!cleanCmd) return;

        // أ. التعامل الفوري مع أمر المسح
        if (cleanCmd === 'clear') {
          out.textContent = '';
          this.value = '';
          return;
        }

        let response = '';

        // ب. فحص الأمان عبر security.js أولاً
        if (typeof ChaosSecurity !== 'undefined') {
          const securityCheck = ChaosSecurity.inspectQuery(inputVal);
          if (!securityCheck.safe) {
            ChaosSecurity.logSecurityEvent(`محاولة محظورة: ${inputVal}`);
            response = "SECURITY_BLOCK: تم رفض الطلب لأسباب أمنية.";
            out.textContent += `\n> ${inputVal}\n${response}`;
            this.value = '';
            out.scrollTop = out.scrollHeight;
            return;
          }
        }

        // ج. توجيه الأمر عبر commands.js (ChaosCommands)
        if (typeof ChaosCommands !== 'undefined' && typeof ChaosCommands.getCommandResponse === 'function') {
          const cmdResult = ChaosCommands.getCommandResponse(inputVal);
          
          if (cmdResult) {
            if (typeof cmdResult === "object" && cmdResult.type === "action") {
              response = cmdResult.message;
              if (cmdResult.action === "trigger_clear") {
                out.textContent = '';
                this.value = '';
                return;
              }
            } else {
              response = cmdResult;
            }
          }
        }

        // د. إذا لم يتم التعرف على الأمر عبر موجه الأوامر، يتم توجيهه لوحدات الذكاء أو الذاكرة
        if (!response) {
          if (typeof ChaosAI !== 'undefined' && typeof ChaosAI.processQuery === 'function') {
            response = ChaosAI.processQuery(cleanCmd);
          } else {
            response = '[استجابة النظام]: تم تلقي الاستعلام بنجاح. (قيد معالجة الوعي والعالم)';
          }
        }

        // هـ. حفظ التفاعل في الذاكرة طويلة/قصيرة المدى (Hippocampus) إذا كانت مفعلة
        if (typeof LongTermMemory !== 'undefined' && typeof LongTermMemory.saveExperience === 'function') {
          LongTermMemory.saveExperience(inputVal, response);
        }

        // و. عرض النتائج وتحديث السجل
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
