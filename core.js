// ChaosAI Core Engine - المحرك الرئيسي لمعالجة الأوامر والربط مع commands.js
const ChaosAI = {
    processQuery: function(input) {
        let query = input.trim().toLowerCase();
        
        // 1. فحص الأوامر الثابتة من commandsList
        if (typeof commandsList !== 'undefined' && commandsList[query] !== undefined) {
            return commandsList[query];
        }

        // 2. البحث في قاعدة المعرفة (knowledgeBase)
        if (typeof knowledgeBase !== 'undefined') {
            for (let key in knowledgeBase) {
                let item = knowledgeBase[key];
                if (item.keywords) {
                    for (let word of item.keywords) {
                        if (query.includes(word.toLowerCase())) {
                            let randomRes = item.responses[Math.floor(Math.random() * item.responses.length)];
                            return randomRes;
                        }
                    }
                }
            }
        }

        // 3. إذا لم يتم العثور على مطابقة، إرجاع رد عشوائي من unknownResponses
        if (typeof unknownResponses !== 'undefined' && unknownResponses.length > 0) {
            let randomUnknown = unknownResponses[Math.floor(Math.random() * unknownResponses.length)];
            return randomUnknown;
        }

        return "SYSTEM: استعلام غير معروف.";
    }
};
