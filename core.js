/**
 * ==========================================
 * CHAOS SYSTEM - Core Engine
 * core.js
 *
 * المحرك المركزي لمعالجة الاستعلامات
 * وربط وحدات CHAOS SYSTEM ببعضها.
 * ==========================================
 */

const ChaosAI = {

    // ------------------------------------------
    // معالجة الاستعلام
    // ------------------------------------------

    processQuery: function(input) {

        if (!input || typeof input !== "string") {
            return "";
        }

        const query = input.trim();

        if (!query) {
            return "";
        }


        // ------------------------------------------
        // تحديث السياق
        // ------------------------------------------

        if (
            typeof ChaosContext !== "undefined" &&
            typeof ChaosContext.setLastQuery === "function"
        ) {
            ChaosContext.setLastQuery(query);
        }


        // ------------------------------------------
        // فحص الأمان
        // ------------------------------------------

        if (
            typeof ChaosSecurity !== "undefined" &&
            typeof ChaosSecurity.inspectQuery === "function"
        ) {

            const security = ChaosSecurity.inspectQuery(query);

            if (!security.safe) {

                const response =
                    "SECURITY_BLOCK: تم رفض الاستعلام.";

                this.saveResponse(response);

                return this.formatResponse(response);
            }
        }


        // ------------------------------------------
        // معالجة الأوامر
        // ------------------------------------------

        if (
            typeof ChaosCommands !== "undefined" &&
            typeof ChaosCommands.getCommandResponse === "function"
        ) {

            const commandResult =
                ChaosCommands.getCommandResponse(query);

            if (commandResult !== null) {

                let response = commandResult;

                // إذا أعاد الأمر كائنًا يحتوي على رسالة
                if (
                    typeof commandResult === "object" &&
                    commandResult.message
                ) {
                    response = commandResult.message;
                }

                this.saveResponse(response);

                return this.formatResponse(response);
            }
        }


        // ------------------------------------------
        // قاعدة المعرفة القديمة
        // ------------------------------------------

        if (typeof knowledgeBase !== "undefined") {

            const cleanQuery = query.toLowerCase();

            for (const key in knowledgeBase) {

                const item = knowledgeBase[key];

                if (!item || !item.keywords) {
                    continue;
                }

                for (const word of item.keywords) {

                    if (
                        cleanQuery.includes(
                            word.toLowerCase()
                        )
                    ) {

                        const responses =
                            item.responses || [];

                        if (responses.length === 0) {
                            continue;
                        }

                        const response =
                            responses[
                                Math.floor(
                                    Math.random() *
                                    responses.length
                                )
                            ];

                        this.saveResponse(response);

                        return this.formatResponse(response);
                    }
                }
            }
        }


        // ------------------------------------------
        // الرد عند عدم العثور على معرفة
        // ------------------------------------------

        if (
            typeof unknownResponses !== "undefined" &&
            Array.isArray(unknownResponses) &&
            unknownResponses.length > 0
        ) {

            const response =
                unknownResponses[
                    Math.floor(
                        Math.random() *
                        unknownResponses.length
                    )
                ];

            this.saveResponse(response);

            return this.formatResponse(response);
        }


        // ------------------------------------------
        // الرد الافتراضي
        // ------------------------------------------

        const fallback =
            "لا توجد بيانات كافية في السجلات المتاحة حاليًا.";

        this.saveResponse(fallback);

        return this.formatResponse(fallback);
    },


    // ------------------------------------------
    // تطبيق شخصية CHAOS SYSTEM
    // ------------------------------------------

    formatResponse: function(response) {

        if (!response) {
            return "";
        }

        if (
            typeof AIPersona !== "undefined" &&
            typeof AIPersona.formulateResponse === "function"
        ) {

            return AIPersona.formulateResponse(response);
        }

        return response;
    },


    // ------------------------------------------
    // حفظ آخر رد في السياق
    // ------------------------------------------

    saveResponse: function(response) {

        if (
            typeof ChaosContext !== "undefined" &&
            typeof ChaosContext.setLastResponse === "function"
        ) {
            ChaosContext.setLastResponse(response);
        }
    },


    // ------------------------------------------
    // الحصول على هوية CHAOS SYSTEM
    // ------------------------------------------

    getIdentity: function() {

        if (
            typeof PersonaMemory !== "undefined" &&
            typeof PersonaMemory.getProfile === "function"
        ) {
            return PersonaMemory.getProfile();
        }

        return null;
    }
};