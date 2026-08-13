const ENDPOINT = "https://llm.rotem-dev.org/api/public-llm/register";
const SUCCESS_MESSAGE = "הבקשה התקבלה. רותם יבדוק אותה, ואם תאושר מאיה תשלח לך הודעת WhatsApp עם קישור הגישה.";
const ERROR_MESSAGE = "משהו השתבש בשליחת הבקשה. נסו שוב בעוד רגע.";
const PHONE_PATTERN = /^(?:05\d{8}|\+?9725\d{8})$/;

function valueFor(form, name) {
    return String(new FormData(form).get(name) || "").trim();
}

function isChecked(form, name) {
    return Boolean(form.elements[name]?.checked);
}

function buildPayload(form) {
    return {
        username: valueFor(form, "username"),
        fullName: valueFor(form, "fullName"),
        phone: valueFor(form, "phone"),
        email: valueFor(form, "email"),
        reason: valueFor(form, "reason"),
        consents: {
            privacy: isChecked(form, "privacy"),
            terms: isChecked(form, "terms"),
            whatsapp: isChecked(form, "whatsapp"),
            legalWarning: isChecked(form, "legalWarning"),
        },
    };
}

function invalidate(field, message) {
    if (!field) return false;

    field.setCustomValidity(message);
    field.reportValidity();
    field.focus();
    return false;
}

function validateRegistration(form, statusElement) {
    const username = form.elements.username;
    const fullName = form.elements.fullName;
    const phone = form.elements.phone;
    const reason = form.elements.reason;
    const trimmedUsername = valueFor(form, "username");
    const trimmedFullName = valueFor(form, "fullName");
    const trimmedPhone = valueFor(form, "phone").replace(/[\s-]/g, "");
    const trimmedReason = valueFor(form, "reason");

    username?.setCustomValidity("");
    fullName?.setCustomValidity("");
    phone?.setCustomValidity("");
    reason?.setCustomValidity("");

    if (!form.reportValidity()) {
        return false;
    }
    if (!trimmedUsername) {
        setStatus(statusElement, "יש להזין שם משתמש תקין.", "error");
        return invalidate(username, "Username is required.");
    }
    if (!trimmedFullName) {
        setStatus(statusElement, "יש להזין שם מלא.", "error");
        return invalidate(fullName, "Full name is required.");
    }
    if (!PHONE_PATTERN.test(trimmedPhone)) {
        setStatus(statusElement, "יש להזין מספר WhatsApp ישראלי תקין.", "error");
        return invalidate(phone, "Use 0501234567 or +972501234567.");
    }
    if (trimmedReason && trimmedReason.length < 3) {
        setStatus(statusElement, "סיבת השימוש צריכה לכלול לפחות 3 תווים או להישאר ריקה.", "error");
        return invalidate(reason, "Use at least 3 characters or leave empty.");
    }

    return true;
}

function setStatus(statusElement, message, state = "") {
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.dataset.state = state;
}

async function submitRegistration(form, statusElement, submitButton) {
    if (!validateRegistration(form, statusElement)) {
        return;
    }

    if (submitButton) submitButton.disabled = true;
    setStatus(statusElement, "שולח את הבקשה...", "pending");

    try {
        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(buildPayload(form)),
        });

        if (!response.ok) {
            throw new Error("Registration request failed");
        }

        form.reset();
        setStatus(statusElement, SUCCESS_MESSAGE, "success");
    } catch (error) {
        setStatus(statusElement, ERROR_MESSAGE, "error");
    } finally {
        if (submitButton) submitButton.disabled = false;
    }
}

function initLlmAccessRegistration() {
    const form = document.querySelector("[data-llm-access-form]");

    if (!form) return;

    const statusElement = form.querySelector("[data-llm-access-status]");
    const submitButton = form.querySelector("button[type='submit']");

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        submitRegistration(form, statusElement, submitButton);
    });
}

initLlmAccessRegistration();
