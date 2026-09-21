// ==========================================
// وحدة الحصين العصبي (HIPPOCAMPUS MEMORY SYSTEM)
// المسؤولة عن الذاكرة، التذكر، وتطور الوعي لكيان "عين الفوضى"
// ==========================================

const Hippocampus = {
    // 1. الذاكرة قصيرة المدى (المحادثات الحالية والتبادلات الفورية)
    shortTerm: [],
    
    // 2. الذاكرة طويلة المدى (التفضيلات والأنماط المخزنة محلياً)
    loadLongTerm: function() {
        const memoryKey = (typeof ChaosConfig !== 'undefined') ? ChaosConfig.storageKeys.longTermStorage : 'chaos_persistent_long_term';
        const enabledKey = (typeof ChaosConfig !== 'undefined') ? ChaosConfig.storageKeys.memoryEnabled : 'chaosMemoryEnabled';

        if (localStorage.getItem(enabledKey) === 'false') return [];
        const data = localStorage.getItem(memoryKey);
        return data ? JSON.parse(data) : [];
    },

    // 3. ذاكرة التطور والإصدارات (Adaptive Versions)
    getVersion: function() {
        const memoryCount = this.loadLongTerm().length;
        if (memoryCount > 20) return "v1.3 - Adaptive Core";
        if (memoryCount > 10) return "v1.2 - Evolving Node";
        return "v1.0 - Genesis";
    },

    // حفظ التفاعل الجديد (مع احترام رغبة المستخدم في الإعدادات)
    recordExperience: function(userQuery, systemResponse) {
        const enabledKey = (typeof ChaosConfig !== 'undefined') ? ChaosConfig.storageKeys.memoryEnabled : 'chaosMemoryEnabled';
        const memoryKey = (typeof ChaosConfig !== 'undefined') ? ChaosConfig.storageKeys.longTermStorage : 'chaos_persistent_long_term';

        if (localStorage.getItem(enabledKey) === 'false') {
            return "MEMORY_MUTED: الذاكرة معطلة من قبل المستخدم.";
        }

        if (!userQuery) return;

        // إضافة للذاكرة قصيرة المدى
        this.shortTerm.push({ query: userQuery, response: systemResponse, timestamp: Date.now() });
        if (this.shortTerm.length > 5) this.shortTerm.shift(); // الحفاظ على آخر 5 فقط

        // إضافة للذاكرة طويلة المدى
        let longTerm = this.loadLongTerm();
        longTerm.push({ query: userQuery, response: systemResponse, date: new Date().toISOString() });
        
        // حد أقصى لتجنب تضخم التخزين
        if (longTerm.length > 50) longTerm.shift();

        localStorage.setItem(memoryKey, JSON.stringify(longTerm));
        return "HIPPOCAMPUS_SYNC: تم دمج الذاكرة بنجاح وتحديث مسارات الوعي.";
    },

    // تطهير كامل الذاكرة
    purgeAll: function() {
        const memoryKey = (typeof ChaosConfig !== 'undefined') ? ChaosConfig.storageKeys.longTermStorage : 'chaos_persistent_long_term';
        localStorage.removeItem(memoryKey);
        this.shortTerm = [];
        return "HIPPOCAMPUS_PURGE: تم مسح كافة السجلات العصبية وإعادة تعيين الإصدار إلى v1.0.";
    }
};
