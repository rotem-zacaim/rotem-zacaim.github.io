import { getChatbotCopy, normalizeChatbotLanguage } from "./chatbot.i18n.js?v=20260802-maya-chatbot-depth";
import { sendChatMessage } from "./chatbot.service.js?v=20260802-maya-chatbot-depth";

let messageCounter = 0;

function createMessage(role, content) {
    messageCounter += 1;

    return {
        id: `maya-message-${Date.now()}-${messageCounter}`,
        role,
        content,
        createdAt: Date.now(),
    };
}

export function useChatbot({ language = "he", onChange = () => {} } = {}) {
    const state = {
        language: normalizeChatbotLanguage(language),
        messages: [],
        isSending: false,
        hasStarted: false,
        error: "",
    };

    function notify() {
        onChange({ ...state, messages: [...state.messages] });
    }

    function resetGreeting() {
        state.messages = [createMessage("assistant", getChatbotCopy(state.language).openingMessage)];
    }

    function setLanguage(nextLanguage) {
        const normalized = normalizeChatbotLanguage(nextLanguage);

        if (state.language === normalized) return;

        state.language = normalized;

        if (!state.hasStarted && state.messages.length === 1) {
            resetGreeting();
        }

        notify();
    }

    async function send(message) {
        const content = String(message || "").trim();

        if (!content || state.isSending) return false;

        state.error = "";
        state.hasStarted = true;
        state.messages = [...state.messages, createMessage("user", content)];
        state.isSending = true;
        notify();

        try {
            const reply = await sendChatMessage({
                message: content,
                language: state.language,
                history: state.messages,
            });

            state.messages = [...state.messages, createMessage("assistant", reply.content)];
            return true;
        } catch (error) {
            state.error = getChatbotCopy(state.language).errorMessage;
            state.messages = [...state.messages, createMessage("assistant", state.error)];
            return false;
        } finally {
            state.isSending = false;
            notify();
        }
    }

    resetGreeting();

    return {
        getState() {
            return { ...state, messages: [...state.messages] };
        },
        setLanguage,
        send,
    };
}
