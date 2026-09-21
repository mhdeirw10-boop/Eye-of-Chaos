// ==========================================
// HIPPOCAMPUS: Web & Search Memory (webMemory.js)
// مسؤول عن تخزين المعرفة المكتسبة من الويب، الترندات، والتعلم من سلوك البشر
// ==========================================

const WebMemory = {
    // تخزين المعرفة المستفادة من الإنترنت والبحث
    loadWebData: function() {
        if (localStorage.getItem('chaosMemoryEnabled') === 'false') return { trends: [], globalKnowledge: {} };
        const data = localStorage.getItem('chaos_web_memory');
        return data ? JSON.parse(data) : { trends: [], globalKnowledge: {} };
    },

    // حفظ واستيعاب موضوع متداول أو معلومة تم جلبها من الويب
    absorbWebKnowledge: function(topic, dataSummary) {
        if (localStorage.getItem('chaosMemoryEnabled') === 'false') return;
        if (!topic) return;

        let webDb = this.loadWebData();

        // تخزين المعرفة أو تحديثها
        webDb.globalKnowledge[topic.toLowerCase().trim()] = {
            summary: dataSummary,
            learnedAt: Date.now()
        };

        // إضافة إلى قائمة الأكثر تداولاً أو اهتماماً
        if (!webDb.trends.includes(topic)) {
            webDb.trends.push(topic);
            if (webDb.trends.length > 20) webDb.trends.shift(); // الحفاظ على أهم 20 ترند
        }

        localStorage.setItem('chaos_web_memory', JSON.stringify(webDb));
        return "WEB_MEMORY_SYNC: تم امتصاص بيانات الويب وتحديث وعي الشبكة.";
    },

    // استرجاع معلومة مخزنة مسبقاً من الويب
    getWebKnowledge: function(topic) {
        if (!topic) return null;
        const webDb = this.loadWebData();
        const cleanTopic = topic.toLowerCase().trim();
        return webDb.globalKnowledge[cleanTopic] || null;
    },

    // تفريغ ذاكرة الويب والبحث
    purgeWebMemory: function() {
        localStorage.removeItem('chaos_web_memory');
        return "WEB_MEMORY_PURGE: تم مسح ذاكرة الشبكة والبحث بالكامل.";
    }
};
