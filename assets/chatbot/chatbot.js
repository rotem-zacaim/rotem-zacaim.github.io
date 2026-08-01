import { createChatbotUi } from "./chatbot-ui.js?v=20260802-maya-chatbot-depth";

function initMayaChatbot() {
    if (document.querySelector("[data-maya-chatbot-root]")) return;

    const root = document.createElement("div");
    root.setAttribute("data-maya-chatbot-root", "");
    document.body.appendChild(root);
    createChatbotUi(root);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMayaChatbot, { once: true });
} else {
    initMayaChatbot();
}
