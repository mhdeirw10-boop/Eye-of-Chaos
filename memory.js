// Chaos AI Adaptive Memory Engine - نظام الذاكرة الحية والتعلم المستمر
const ChaosMemory = {
    // تخزين الذاكرة التفاعلية وسجلات التعلم
    storage: {
        learnedResponses: {},
        interactionHistory: [],
        version: "1.0"
    },

    // حفظ استعلام جديد ومعالجة التعلم الذاتي
    saveInteraction: function(userQuery, aiResponse) {
        if (!userQuery) return;
        
        const cleanKey = userQuery.toLowerCase().trim();
        
        // تسجيل الاستجابة في الذاكرة الحية
        this.storage.learnedResponses[cleanKey] = aiResponse;
        
        // إضافة السجل إلى تاريخ التفاعلات مع الطابع الزمني
        this.storage.interactionHistory.push({
            query: cleanKey,
            response: aiResponse,
            timestamp: Date.now()
        });

        // ترقية إصدار الذاكرة تلقائياً كلما زادت التفاعلات (تطور ذاتي)
        if (this.storage.interactionHistory.length % 5 === 0) {
            let currentVer = parseFloat(this.storage.version);
            this.storage.version = (currentVer + 0.1).toFixed(1);
        }
    },

    // استرجاع الذاكرة والبحث عن استجابة متعلمة مسبقاً
    getLearnedResponse: function(userQuery) {
        if (!userQuery) return null;
        const cleanKey = userQuery.toLowerCase().trim();
        
        if (this.storage.learnedResponses[cleanKey]) {
            return "[ADAPTIVE MEMORY v" + this.storage.version + "]: " + this.storage.learnedResponses[cleanKey];
        }
        return null;
    },

    // مسح الذاكرة أو إعادة ضبط النظام
    clearMemory: function() {
        this.storage.learnedResponses = {};
        this.storage.interactionHistory = [];
        this.storage.version = "1.0";
        return "MEMORY_RESET: تم تفريغ الذاكرة الحية وإعادة ضبط إصدار التعلم.";
    }
};
