// ==========================================
// وحدة البحث العصبية والاتصال بالشبكة لـ CHAOS SYSTEM (متكاملة مع webMemory.js)
// ==========================================

const ChaosWebSearch = {
    // دالة البحث المباشر في شبكة الإنترنت مع دمج ذاكرة الويب (Web Memory)
    searchWeb: async function(query) {
        if (!query) return null;
        
        const cleanQuery = query.toLowerCase().trim();

        // 1. التحقق أولاً من وجود النتيجة في ذاكرة الويب (Web Memory) إن وجدت
        if (typeof ChaosWebMemory !== 'undefined' && typeof ChaosWebMemory.get === 'function') {
            const cachedResult = ChaosWebMemory.get(cleanQuery);
            if (cachedResult) {
                return {
                    source: "WEB_MEMORY_CACHE",
                    title: cachedResult.title,
                    content: cachedResult.content,
                    cached: true
                };
            }
        }
        
        try {
            // 2. استخدام واجهة بحث عامة ومستقرة لجلب معلومات حقيقية من الويب (باللغتين العربية والإنجليزية)
            const encodedQuery = encodeURIComponent(query);
            const url = `https://ar.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data && data.query && data.query.search && data.query.search.length > 0) {
                // اخذ أول نتيجة بحث مطابقة
                const topResult = data.query.search[0];
                const title = topResult.title;
                // تنظيف النص المستخرج من وسوم HTML إن وجدت
                const snippet = topResult.snippet.replace(/<\/?[>]+(>|$)/g, "").replace(/&quot;/g, '"');
                
                const searchResult = {
                    source: "WEB_STREAM_DATA",
                    title: title,
                    content: snippet,
                    cached: false
                };

                // 3. حفظ النتيجة الجديدة تلقائياً في ذاكرة الويب (Web Memory) للاستخدام المستقبلي
                if (typeof ChaosWebMemory !== 'undefined' && typeof ChaosWebMemory.save === 'function') {
                    ChaosWebMemory.save(cleanQuery, { title: title, content: snippet });
                }

                return searchResult;
            }
            
            return null;
        } catch (error) {
            console.error("WEB_STREAM_ERROR: فشل الاتصال بالشبكة العصبية الخارجية", error);
            return null;
        }
    },

    // دمج نتيجة البحث مع طابع الرعب الخاص بالنظام
    formatSearchResponse: function(searchResult, query) {
        if (!searchResult) {
            return `EXTERNAL_SEARCH: فشل العثور على شظايا معلومات لـ "${query}" في شبكة الفضاء الخارجي.`;
        }

        const sourceTag = searchResult.cached ? "WEB_MEMORY // CACHED INTEL" : "WEB INTEL // ACQUIRED FROM STREAM";

        return `[${sourceTag}]: تم رصد بيانات حول (${searchResult.title}).\nالتفاصيل المستخرجة: "${searchResult.content}..."\n[ملاحظة النظام: تم دمج هذه المعرفة القادمة من خلف جدار الشبكة في الذاكرة الحية].`;
    }
};
