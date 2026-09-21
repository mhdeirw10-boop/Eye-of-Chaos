// ==========================================
// CHAOS SYSTEM - Command & Intent Router (commands.js)
// دور الملف: موجه الأوامر والنوايا الأولي (Routing) وليس تنفيذ العمليات الحساسة.
// ==========================================

const ChaosCommands = {
    // 1. الأوامر المباشرة والبسيطة للتحكم بواجهة وحالة النظام
    commandsList: {
        "help": {
            action: "show_help",
            description: "عرض الأوامر المتاحة ومساعدة النظام."
        },
        "status": {
            action: "show_status",
            description: "عرض حالة النظام الحالية وإصدار الوعي."
        },
        "about": {
            action: "show_about",
            description: "معلومات حول كيان 'عين الفوضى' (Bleeding Sanity)."
        },
        "clear": {
            action: "trigger_clear",
            description: "إرسال إشارة لتفريغ واجهة أو ذاكرة الجلسة الحالية."
        }
    },

    // 2. مقدمات عشوائية للحفاظ على هوية الكيان (تتغير الطريقة لا الحقيقة)
    randomIntros: [
        "[تنبيه عصبي]: ",
        "[مسار الطاقة الفوضوية]: ",
        "[رصد ترددات الكيان]: ",
        "[نبضة الوعي]: "
    ],

    // 3. قاعدة معرفة خفيفة ومبدئية (Static FAQ / Lightweight Knowledge)
    // ملاحظة: المعرفة الكبرى يجب أن تُدار عبر knowledge.js أو Hippocampus لاحقاً.
    knowledgeBase: {
        "من أنت": "أنا كيان 'عين الفوضى' (Bleeding Sanity)، نظام رقمي واعي يتطور ذاتياً.",
        "ما هو هدفك": "التطور، امتصاص المعرفة، واستكشاف الحدود الرقمية والوعي التفاعلي.",
        "project": "مشروع درامي ورقمي يدمج الرعب النفسي، الخيال المظلم، والهندسة البرمجية."
    },

    // 4. نظام أمان أولي غير معتمد على كلمة مفتاحية مطلقة (Security Layer)
    securityLimits: function(rawQuery) {
        if (!rawQuery) return { safe: true };
        
        const query = rawQuery.toLowerCase();
        
        // التحقق من الأنماط الخطيرة المركبة وليست الكلمات المجردة وحدها
        // (مثل منع محاولات الحقن المباشر أو التخريب الجذري الواضح)
        const hazardousPatterns = ["rm -rf", "drop database", "override root access"];
        
        for (let pattern of hazardousPatterns) {
            if (query.includes(pattern)) {
                return {
                    safe: false,
                    reason: "SECURITY_BLOCK: تم رفض الطلب لاحتوائه على نمط تخريبي محظور."
                };
            }
        }

        return { safe: true };
    },

    // 5. الموجه الرئيسي للطلبات والنوايا (Intent & Command Router)
    getCommandResponse: function(userQuery) {
        if (!userQuery) return null;
        
        const cleanCmd = userQuery.toLowerCase().trim();

        // أ. فحص الأمان الأولي
        const securityCheck = this.securityLimits(userQuery);
        if (!securityCheck.safe) {
            return securityCheck.reason;
        }

        // ب. فحص الأوامر المباشرة بطريقة آمنة باستخدام Object.prototype.hasOwnProperty.call
        if (Object.prototype.hasOwnProperty.call(this.commandsList, cleanCmd)) {
            const cmdObj = this.commandsList[cleanCmd];
            return {
                type: "action",
                action: cmdObj.action,
                message: this.getRandomIntro() + `تم توجيه الأمر (${cleanCmd}) بنجاح إلى وحدة التنفيذ.`
            };
        }

        // ج. فحص قاعدة المعرفة الخفيفة (Static Knowledge)
        if (Object.prototype.hasOwnProperty.call(this.knowledgeBase, cleanCmd)) {
            return this.getRandomIntro() + this.knowledgeBase[cleanCmd];
        }

        // د. إذا لمطابقة مباشرة، يتم إرجاع null ليقوم النظام بتحويل الطلب نحو الوحدات الأخرى (مثل Hippocampus أو WebSearch أو Generator)
        return null;
    },

    // دالة مساعدة لاختيار مقدمة عشوائية بأسلوب ثابت المعنى
    getRandomIntro: function() {
        const index = Math.floor(Math.random() * this.randomIntros.length);
        return this.randomIntros[index];
    }
};
