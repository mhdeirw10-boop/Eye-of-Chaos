// ==========================================
// CHAOS SYSTEM - Security Core
// security.js
// وظائف الأمان والتحقق الأساسية
// ==========================================

const ChaosSecurity = {

    // ------------------------------------------
    // فحص الاستعلام
    // ------------------------------------------

    inspectQuery: function(query) {

        if (!query) {
            return {
                safe: true,
                reason: null
            };
        }

        const cleanQuery = query.toLowerCase().trim();

        const blockedPatterns = [
            "rm -rf",
            "drop database",
            "override root access"
        ];

        for (const pattern of blockedPatterns) {

            if (cleanQuery.includes(pattern)) {

                return {
                    safe: false,
                    reason: "SECURITY_BLOCK"
                };
            }
        }

        return {
            safe: true,
            reason: null
        };
    },


    // ------------------------------------------
    // التحقق من صلاحية الأرشيف
    // ------------------------------------------

    canAccessArchive: function(archiveName, accessLevel) {

        if (!archiveName) {
            return false;
        }

        // الأرشيف الغامض متاح للمؤسس فقط.

        if (archiveName === "الأرشيف الغامض") {
            return accessLevel === "FOUNDER";
        }

        // بقية الأرشيفات لا يتم تحديد محتواها
        // أو طريقة اكتشافها من هنا.
        // هذه المعلومات موجودة في canon.js.

        return true;
    },


    // ------------------------------------------
    // تسجيل حدث أمني
    // ------------------------------------------

    logSecurityEvent: function(event) {

        if (!event) {
            return;
        }

        if (ChaosConfig.debugMode) {

            console.warn(
                "[CHAOS SECURITY]",
                event
            );
        }
    }
};