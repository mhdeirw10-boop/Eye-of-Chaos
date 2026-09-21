// ==========================================
// HIPPOCAMPUS: Long-Term Memory Engine (longTerm.js)
// مسؤول عن الحفظ الدائم، تجميع التفاعلات، وتعلم شخصية وتفضيلات المستخدم
// ==========================================

const LongTermMemory = {
    // تخزين البيانات بشكل دائم مع استرجاعها من ذاكرة المتصفح
    load: function() {
        if (localStorage.getItem('chaosMemoryEnabled') === 'false') return { profile: {}, history: [] };
        const data = localStorage.getItem('chaos_persistent_long_term');
        return data ? JSON.parse(data) : { profile: {}, history: [] };
    },

    // حفظ وتجميع الخبرات لتحليل شخصية وتفضيلات المستخدم
    saveExperience: function(userQuery, aiResponse) {
        if (localStorage.getItem('chaosMemoryEnabled') === 'false') return;
        if (!userQuery) return;

        let db = this.load();
        
        // إضافة التفاعل إلى التاريخ الطويل
        db.history.push({
            query: userQuery,
            response: aiResponse,
            timestamp: Date.now()
        });

        // رصد واستخراج التفضيلات أو الأنماط البارزة (التعلم التلقائي)
        // يمكن للكيان هنا تسجيل اهتمامات المستخدم أو أسلوب كلامه
        db.profile.lastInteraction = Date.now();
        db.profile.totalInteractions = (db.profile.totalInteractions || 0) + 1;

        // الحفظ الدائم في الذاكرة غير القابلة للمسح العشوائي
        localStorage.setItem('chaos_persistent_long_term', JSON.stringify(db));
    },

    // استرجاع ملف شخصية المستخدم والتفضيلات المكتسبة
    getProfile: function() {
        return this.load().profile;
    },

    // لا يتم مسح هذا الملف أبداً إلا بأمر صريح من المستخدم
    forcePurge: function() {
        localStorage.removeItem('chaos_persistent_long_term');
        return "LONG_TERM_PURGE: تم إتلاف الذاكرة طويلة الأمد بناءً على أمر مباشر.";
    }
};
