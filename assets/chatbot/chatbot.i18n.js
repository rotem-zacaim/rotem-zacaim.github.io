export const CHATBOT_DEFAULT_LANGUAGE = "he";

export const CHATBOT_I18N = {
    he: {
        launcherTitle: "דברו עם Maya",
        launcherSubtitle: "שאלו אותי על רותם והפרויקטים",
        assistantName: "Maya",
        assistantSubtitle: "העוזרת של האתר",
        minimizeLabel: "מזעור הצ'אט",
        closeLabel: "סגירת הצ'אט",
        panelLabel: "צ'אט עם Maya",
        inputLabel: "הודעה ל-Maya",
        inputPlaceholder: "שאלו על רותם, Maya או פרויקט...",
        sendLabel: "שליחה",
        thinking: "Maya חושבת...",
        openingMessage: "היי, אני Maya. אפשר לשאול אותי על רותם, הניסיון שלו והפרויקטים שבנה.",
        suggestionsLabel: "שאלות מהירות",
        suggestions: [
            "מה רותם בנה?",
            "ספרי לי על פרויקט Maya",
            "איזה ניסיון יש לרותם בסייבר?",
        ],
        emptyMessage: "כתבו שאלה קצרה ואענה עליה.",
        errorMessage: "משהו השתבש בתשובה. אפשר לנסות שוב.",
        responses: {
            built: "רותם בנה פורטפוליו של מערכות סביב AI, תשתיות, סייבר ואוטומציה: Maya ב-WhatsApp, Home Assistant עם Maya, מודלים מקומיים, RedLab, כלי WiFi, דשבורדים, משחקי דפדפן וכלי ניטור.",
            maya: "Maya היא סוכנת AI אישית בעברית שהתחילה ב-WhatsApp והתרחבה לזיכרון, יומן, קול, תמונות, URL intelligence, Home Assistant, Android Lab, ניטור מוגן ומודלים מקומיים.",
            cyber: "הניסיון של רותם בסייבר מגיע מתפעול אבטחת מידע ותשתיות, SIEM, WAF, Proxy, Load Balancer, SSL, API Gateway, ניטור, חקירת תעבורה, ופרויקטי מעבדה מורשים בלבד.",
            homeAssistant: "בפרויקט Home Assistant + Maya רותם חיבר בית חכם, דשבורד קיר וסוכן AI כדי לאפשר שליטה, תצפית ואוטומציה סביב תרחישים אמיתיים בבית.",
            contact: "אפשר ליצור קשר עם רותם דרך המייל Rotemvnkll@gmail.com או דרך LinkedIn שמופיע באזור הקשר באתר.",
            fallback: "אפשר לשאול אותי על הפרויקטים, על Maya, על Home Assistant, על ניסיון הסייבר של רותם או על קורסים וכישורים.",
        },
    },
    en: {
        launcherTitle: "Chat with Maya",
        launcherSubtitle: "Ask about Rotem and his projects",
        assistantName: "Maya",
        assistantSubtitle: "Site assistant",
        minimizeLabel: "Minimize chat",
        closeLabel: "Close chat",
        panelLabel: "Chat with Maya",
        inputLabel: "Message Maya",
        inputPlaceholder: "Ask about Rotem, Maya, or a project...",
        sendLabel: "Send",
        thinking: "Maya is thinking...",
        openingMessage: "Hi, I'm Maya. Ask me about Rotem, his experience, and the systems he has built.",
        suggestionsLabel: "Suggested questions",
        suggestions: [
            "What has Rotem built?",
            "Tell me about the Maya project",
            "What cybersecurity experience does Rotem have?",
        ],
        emptyMessage: "Write a short question and I will answer it.",
        errorMessage: "Something went wrong with the reply. Please try again.",
        responses: {
            built: "Rotem built a portfolio of systems around AI, infrastructure, cyber security, and automation: Maya on WhatsApp, Home Assistant with Maya, local models, RedLab, WiFi tooling, dashboards, browser games, and monitoring tools.",
            maya: "Maya is a Hebrew-first personal AI agent that started on WhatsApp and grew into memory, calendar, voice, images, URL intelligence, Home Assistant, Android Lab, protected monitoring, and local model experiments.",
            cyber: "Rotem's cyber experience comes from security and infrastructure operations, SIEM, WAF, proxy, load balancing, SSL, API gateways, monitoring, traffic investigation, and authorized lab projects only.",
            homeAssistant: "In Home Assistant + Maya, Rotem connected smart-home control, a wall dashboard, and an AI agent so real home scenarios could be observed, controlled, and automated.",
            contact: "You can contact Rotem by email at Rotemvnkll@gmail.com or through the LinkedIn link in the contact section.",
            fallback: "You can ask me about the projects, Maya, Home Assistant, Rotem's cyber experience, courses, or skills.",
        },
    },
};

export function normalizeChatbotLanguage(language) {
    return language === "en" ? "en" : CHATBOT_DEFAULT_LANGUAGE;
}

export function getChatbotDirection(language) {
    return normalizeChatbotLanguage(language) === "he" ? "rtl" : "ltr";
}

export function getChatbotCopy(language) {
    return CHATBOT_I18N[normalizeChatbotLanguage(language)] || CHATBOT_I18N[CHATBOT_DEFAULT_LANGUAGE];
}
