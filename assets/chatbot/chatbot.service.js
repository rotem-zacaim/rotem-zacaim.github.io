import { getChatbotCopy, normalizeChatbotLanguage } from "./chatbot.i18n.js";

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

    if (includesAny(text, ["בנה", "פרויקטים", "פרויקט", "built", "projects", "portfolio"])) {
        return copy.responses.built;
    }

    if (includesAny(text, ["maya", "מאיה", "וואטסאפ", "whatsapp", "agent", "סוכנת"])) {
        return copy.responses.maya;
    }

    if (includesAny(text, ["סייבר", "אבטחה", "security", "cyber", "siem", "waf"])) {
        return copy.responses.cyber;
    }

    if (includesAny(text, ["home assistant", "בית חכם", "ha", "smart home"])) {
        return copy.responses.homeAssistant;
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
