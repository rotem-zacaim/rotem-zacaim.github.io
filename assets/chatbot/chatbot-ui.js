import { getChatbotCopy, getChatbotDirection, normalizeChatbotLanguage } from "./chatbot.i18n.js?v=20260802-maya-chatbot-depth";
import { useChatbot } from "./chatbot.state.js?v=20260802-maya-chatbot-depth";
import { createMayaOrb } from "./maya-orb.js?v=20260802-maya-chatbot-depth";

const FOCUSABLE_SELECTOR = [
    "button:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
].join(",");

function createElement(name, className, text) {
    const element = document.createElement(name);

    if (className) element.className = className;
    if (text) element.textContent = text;

    return element;
}

function setButtonLabel(button, label) {
    button.setAttribute("aria-label", label);
    button.title = label;
}

function getCurrentLanguage() {
    return normalizeChatbotLanguage(document.documentElement.lang || document.documentElement.getAttribute("lang"));
}

function scrollMessagesToEnd(messagesEl) {
    window.requestAnimationFrame(() => {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    });
}

function createOrbCanvas(label) {
    const shell = createElement("span", "maya-orb-shell");
    const canvas = document.createElement("canvas");

    canvas.width = 96;
    canvas.height = 96;
    canvas.setAttribute("aria-label", label);
    canvas.setAttribute("role", "img");
    shell.appendChild(canvas);

    return { shell, canvas };
}

export function createChatbotUi(root) {
    let language = getCurrentLanguage();
    let copy = getChatbotCopy(language);
    let isOpen = false;
    let lastFocusedElement = null;
    let launcherOrb = null;
    let panelOrb = null;
    let idleTimer = 0;

    const store = useChatbot({
        language,
        onChange: renderState,
    });

    root.className = "maya-chatbot";
    root.dir = getChatbotDirection(language);

    const launcher = createElement("button", "maya-chatbot-launcher");
    launcher.type = "button";
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-controls", "maya-chatbot-panel");

    const launcherOrbParts = createOrbCanvas("Maya AI Orb");
    const launcherText = createElement("span", "maya-chatbot-launcher-copy");
    const launcherTitle = createElement("span", "maya-chatbot-launcher-title");
    const launcherSubtitle = createElement("span", "maya-chatbot-launcher-subtitle");
    launcherText.append(launcherTitle, launcherSubtitle);
    launcher.append(launcherOrbParts.shell, launcherText);

    const panel = createElement("section", "maya-chatbot-panel");
    panel.id = "maya-chatbot-panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-labelledby", "maya-chatbot-title");
    panel.setAttribute("aria-describedby", "maya-chatbot-subtitle");

    const header = createElement("header", "maya-chatbot-header");
    const panelOrbParts = createOrbCanvas("Maya AI Orb");
    const titleGroup = createElement("div", "maya-chatbot-title-group");
    const title = createElement("h2", "", copy.assistantName);
    const subtitle = createElement("p", "", copy.assistantSubtitle);
    title.id = "maya-chatbot-title";
    subtitle.id = "maya-chatbot-subtitle";
    titleGroup.append(title, subtitle);

    const headerActions = createElement("div", "maya-chatbot-header-actions");
    const minimizeButton = createElement("button", "maya-chatbot-icon-button", "−");
    const closeButton = createElement("button", "maya-chatbot-icon-button", "×");
    minimizeButton.type = "button";
    closeButton.type = "button";
    headerActions.append(minimizeButton, closeButton);
    header.append(panelOrbParts.shell, titleGroup, headerActions);

    const messages = createElement("div", "maya-chatbot-messages");
    messages.setAttribute("role", "log");
    messages.setAttribute("aria-live", "polite");
    messages.setAttribute("aria-relevant", "additions text");

    const suggestions = createElement("div", "maya-chatbot-suggestions");
    const suggestionsLabel = createElement("p", "maya-chatbot-suggestions-label");
    const suggestionsList = createElement("div", "maya-chatbot-suggestion-list");
    suggestions.append(suggestionsLabel, suggestionsList);

    const status = createElement("p", "maya-chatbot-status");
    status.setAttribute("aria-live", "polite");

    const form = createElement("form", "maya-chatbot-form");
    const input = document.createElement("textarea");
    const sendButton = createElement("button", "maya-chatbot-send", "↵");
    input.rows = 1;
    input.maxLength = 420;
    input.autocomplete = "off";
    input.spellcheck = true;
    sendButton.type = "submit";
    form.append(input, sendButton);

    panel.append(header, messages, suggestions, status, form);
    root.append(launcher, panel);

    function setOrbState(state) {
        window.clearTimeout(idleTimer);
        root.dataset.chatState = state;
        launcherOrb?.setState(state);
        panelOrb?.setState(state);

        if (["hover", "opening", "success", "error"].includes(state)) {
            idleTimer = window.setTimeout(() => {
                launcherOrb?.setState("idle");
                panelOrb?.setState(isOpen ? "listening" : "idle");
                root.dataset.chatState = isOpen ? "listening" : "idle";
            }, 900);
        }
    }

    function renderTexts() {
        copy = getChatbotCopy(language);
        root.dir = getChatbotDirection(language);
        panel.dir = getChatbotDirection(language);
        launcherTitle.textContent = copy.launcherTitle;
        launcherSubtitle.textContent = copy.launcherSubtitle;
        title.textContent = copy.assistantName;
        subtitle.textContent = copy.assistantSubtitle;
        suggestionsLabel.textContent = copy.suggestionsLabel;
        input.placeholder = copy.inputPlaceholder;
        input.setAttribute("aria-label", copy.inputLabel);
        sendButton.setAttribute("aria-label", copy.sendLabel);
        panel.setAttribute("aria-label", copy.panelLabel);
        setButtonLabel(launcher, copy.launcherTitle);
        setButtonLabel(minimizeButton, copy.minimizeLabel);
        setButtonLabel(closeButton, copy.closeLabel);
    }

    function renderMessages(state) {
        messages.replaceChildren();

        state.messages.forEach((message) => {
            const item = createElement("article", `maya-chatbot-message maya-chatbot-message--${message.role}`);
            const bubble = createElement("p", "maya-chatbot-bubble");

            bubble.textContent = message.content;
            item.appendChild(bubble);
            messages.appendChild(item);
        });

        scrollMessagesToEnd(messages);
    }

    function renderSuggestions(state) {
        suggestions.hidden = state.hasStarted;
        suggestionsList.replaceChildren();

        if (state.hasStarted) return;

        copy.suggestions.forEach((question) => {
            const button = createElement("button", "maya-chatbot-suggestion", question);

            button.type = "button";
            button.addEventListener("click", () => submitMessage(question));
            suggestionsList.appendChild(button);
        });
    }

    function renderState(state = store.getState()) {
        renderTexts();
        renderMessages(state);
        renderSuggestions(state);

        status.textContent = state.isSending ? copy.thinking : "";
        input.disabled = state.isSending;
        sendButton.disabled = state.isSending || !input.value.trim();
        root.classList.toggle("is-sending", state.isSending);

        if (state.isSending) {
            setOrbState("thinking");
        }
    }

    function resizeInput() {
        input.style.height = "auto";
        input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
        sendButton.disabled = store.getState().isSending || !input.value.trim();
    }

    async function submitMessage(value = input.value) {
        const text = String(value || "").trim();

        if (!text || store.getState().isSending) return;

        input.value = "";
        resizeInput();
        setOrbState("thinking");
        await store.send(text);
        setOrbState("success");
        input.focus({ preventScroll: true });
    }

    function openPanel() {
        if (isOpen) return;

        isOpen = true;
        lastFocusedElement = document.activeElement;
        panel.hidden = false;
        launcher.setAttribute("aria-expanded", "true");
        root.classList.add("is-open");
        document.body.classList.add("is-maya-chatbot-open");
        setOrbState("opening");

        window.setTimeout(() => {
            input.focus({ preventScroll: true });
        }, 80);
    }

    function closePanel({ returnFocus = true } = {}) {
        if (!isOpen) return;

        isOpen = false;
        panel.hidden = true;
        launcher.setAttribute("aria-expanded", "false");
        root.classList.remove("is-open");
        document.body.classList.remove("is-maya-chatbot-open");
        setOrbState("idle");

        if (returnFocus) {
            (lastFocusedElement instanceof HTMLElement ? lastFocusedElement : launcher).focus({ preventScroll: true });
        }
    }

    function handleFocusTrap(event) {
        if (!isOpen) return;

        if (event.key === "Escape") {
            event.preventDefault();
            closePanel();
            return;
        }

        if (event.key !== "Tab") return;

        const focusable = Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR));
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    launcher.addEventListener("click", () => {
        if (isOpen) {
            closePanel();
        } else {
            openPanel();
        }
    });

    launcher.addEventListener("pointerenter", () => setOrbState("hover"));
    launcher.addEventListener("focus", () => setOrbState("hover"));
    launcher.addEventListener("pointerleave", () => setOrbState(isOpen ? "listening" : "idle"));
    launcher.addEventListener("blur", () => setOrbState(isOpen ? "listening" : "idle"));
    minimizeButton.addEventListener("click", () => closePanel());
    closeButton.addEventListener("click", () => closePanel());
    document.addEventListener("keydown", handleFocusTrap);

    input.addEventListener("input", resizeInput);
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitMessage();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitMessage();
    });

    window.addEventListener("site-language-change", (event) => {
        language = normalizeChatbotLanguage(event.detail?.language);
        store.setLanguage(language);
        renderState(store.getState());
    });

    launcherOrb = createMayaOrb(launcherOrbParts.canvas);
    panelOrb = createMayaOrb(panelOrbParts.canvas);

    renderState(store.getState());
    resizeInput();

    return {
        open: openPanel,
        close: closePanel,
        destroy() {
            document.removeEventListener("keydown", handleFocusTrap);
            launcherOrb?.cleanup();
            panelOrb?.cleanup();
            root.replaceChildren();
        },
    };
}
