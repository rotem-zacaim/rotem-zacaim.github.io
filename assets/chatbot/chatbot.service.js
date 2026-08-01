import { getChatbotCopy, normalizeChatbotLanguage } from "./chatbot.i18n.js?v=20260802-maya-chatbot-depth";

export const FUTURE_CHAT_ENDPOINT = "/api/chat";

const RESPONSE_DELAY_MS = 560;

function includesAny(text, keywords) {
    return keywords.some((keyword) => text.includes(keyword));
}

function delay(ms) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms);
    });
}

function resolveReply(message, language) {
    const normalized = normalizeChatbotLanguage(language);
    const copy = getChatbotCopy(normalized);
    const text = message.toLowerCase();

    if (includesAny(text, ["מה את יכולה", "מה אתה יכול", "מה אפשר לשאול", "מה אפשר לעשות", "יכולה לעשות", "יכול לעשות", "help", "what can you do", "what can i ask"])) {
        return copy.responses.capabilities;
    }

    if (includesAny(text, ["maya", "מאיה", "וואטסאפ", "whatsapp", "agent", "סוכנת"])) {
        return copy.responses.maya;
    }

    if (includesAny(text, ["home assistant", "בית חכם", "ha", "smart home"])) {
        return copy.responses.homeAssistant;
    }

    if (includesAny(text, ["local llm", "llm", "מודל מקומי", "מודלים מקומיים", "gguf", "inference", "local model"])) {
        return copy.responses.localLlm;
    }

    if (includesAny(text, ["redlab", "red lab", "מעבדת אבטחה", "מחקר אבטחה", "authorized research"])) {
        return copy.responses.redlab;
    }

    if (includesAny(text, ["wifi", "wi-fi", "raspberry", "pi", "זכאים wifi", "zacaim-wifi", "רשת"])) {
        return copy.responses.wifi;
    }

    if (includesAny(text, ["monitoring", "control center", "ניטור", "דשבורד", "dashboard", "observability"])) {
        return copy.responses.monitoring;
    }

    if (includesAny(text, ["game", "games", "משחק", "משחקים", "ui lab", "browser games"])) {
        return copy.responses.games;
    }

    if (includesAny(text, ["סייבר", "אבטחה", "security", "cyber", "siem", "waf"])) {
        return copy.responses.cyber;
    }

    if (includesAny(text, ["בנה", "פרויקטים", "פרויקט", "built", "projects", "portfolio"])) {
        return copy.responses.built;
    }

    if (includesAny(text, ["צור קשר", "קשר", "מייל", "email", "linkedin", "contact"])) {
        return copy.responses.contact;
    }

    return copy.responses.fallback;
}

export async function sendChatMessage({ message, language, history = [] } = {}) {
    const normalized = normalizeChatbotLanguage(language);
    const trimmedMessage = String(message || "").trim();

    if (!trimmedMessage) {
        return {
            role: "assistant",
            content: getChatbotCopy(normalized).emptyMessage,
            source: "local-mock",
            historyLength: history.length,
        };
    }

    await delay(RESPONSE_DELAY_MS + Math.min(trimmedMessage.length * 4, 380));

    return {
        role: "assistant",
        content: resolveReply(trimmedMessage, normalized),
        source: "local-mock",
        historyLength: history.length,
    };
}
