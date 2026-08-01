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
            capabilities: `אני יכולה לתת הרחבה טכנית על הפרויקטים המרכזיים של רותם: Maya, Home Assistant + Maya, Local LLM / Cyber Agent, RedLab, Zacaim-WiFi-Tool, דשבורדים וכלי ניטור.

התשובות שלי בנויות כמו Case Study קצר: מה הייתה המטרה, אילו שכבות היו במערכת, איך זרימת העבודה נראית, אילו טכנולוגיות מעורבות, מה נמדד או הוכח, ומה נשאר מחוץ לפרסום כדי לשמור על אבטחת מידע. אני יכולה גם להשוות בין פרויקטים, להסביר למה נבחרה ארכיטקטורה מסוימת, או לתרגם את זה לשפה שמתאימה לראיון עבודה, לקוח, או README טכני.`,
            built: `רותם בנה כמה מערכות שמתחברות סביב אותו קו מקצועי: AI מעשי, תשתיות, אוטומציה, ניטור ואבטחת מידע. בצד ה-AI יש את Maya כסוכן אישי, Local LLM / Cyber Agent לניסויים מבוקרים עם מודלים מקומיים, ודשבורדים שמציגים שימוש, סיכונים ותוצאות. בצד התשתיות יש Home Assistant + Maya, כלי WiFi סביב Raspberry Pi, Control Center מוגן, וניסויי Cloudflare/Tunnel/Access ברמת פרסום בטוחה.

מה שמעניין בפרויקטים הוא לא רק “איזה כלי נבנה”, אלא איך הם מחוברים: קלט ממשתמש או מערכת, שכבת עיבוד שמבינה כוונה, שכבת כלים שמבצעת פעולה, ולבסוף ניטור שמראה מה קרה. זה מציג יכולת לבנות מערכת מקצה לקצה: UI, אוטומציה, אינטגרציות, אבטחה, לוגים, ותפעול לאורך זמן.`,
            maya: `Maya היא פרויקט Agent אישי שנבנה סביב שימוש אמיתי ולא דמו. ברמת הארכיטקטורה אפשר לחשוב עליה כעל כמה שכבות: שכבת adapters לקלט כמו WhatsApp, טקסט, קול, תמונות וקישורים; שכבת context שמחזיקה זיכרון, תמצותים, יומן ומידע שימושי; שכבת orchestrator שמחליטה האם צריך לענות, להפעיל כלי, לחפש מידע או להעביר פעולה; ושכבת tool layer שמחברת יכולות כמו Home Assistant, URL intelligence, Android Lab, ניטור ומודלים מקומיים.

החלק החשוב הוא ההפרדה בין “שיחה” לבין “פעולה”. הודעה נכנסת לא אמורה ישר להריץ משהו. היא עוברת סיווג כוונה, בניית context, בחירת כלי, ואז תשובה או פעולה מבוקרת. זה מאפשר להוסיף guardrails, הרשאות, בדיקות תקינות ולוגים. מבחינת תפעול, הפרויקט מדגים איך בונים assistant שעובד בעברית, מחובר לכלים אמיתיים, ועדיין נשאר ניתן לניטור, דיבוג והרחבה.

ברמת פרסום בטוחה, לא צריך לחשוף שמות שירותים פנימיים, מזהים, prompts מלאים, endpoints, tokens או מבנה הרשאות מדויק. כן אפשר להסביר את הדפוס: adapters, memory, orchestrator, tool layer, observability, ותגובה למשתמש. זה מספיק כדי להראות עומק הנדסי בלי לתת מידע שמסכן את המערכת.`,
            cyber: `הניסיון של רותם בסייבר מגיע משילוב בין תפעול אבטחת מידע בסביבות גדולות לבין מעבדות פרטיות מורשות. ברמה המקצועית זה כולל עבודה עם SIEM, WAF, Proxy, Load Balancer, SSL, API Gateway, ניטור, זמינות, לוגים, חקירת תעבורה ותהליכי response. זו לא רק היכרות עם שמות מוצרים, אלא הבנה איך אותות ממערכות שונות מתחברים לתמונה תפעולית אחת.

בפרויקטים האישיים הצד הזה מופיע דרך RedLab, מחקר סיכונים, כלים לדיווח, ו-Agent מקומי שמטרתו לעזור לחשוב על ממצאים בצורה מסודרת. הגבול החשוב הוא פרסום אחראי: אפשר לדבר על מתודולוגיה, evidence notes, triage, reporting, דשבורדים וחשיבה הגנתית; לא מפרסמים targets, payloads, exploit steps, מזהים פנימיים או דרכי עקיפה. זה מציג יכולת חקירה וניתוח בלי להפוך את האתר למדריך תקיפה.`,
            homeAssistant: `Home Assistant + Maya הוא פרויקט שמחבר בית חכם, דשבורד קיר וסוכן AI. הארכיטקטורה בנויה סביב שלוש שכבות: Home Assistant כשכבת state ואוטומציות, dashboard שמציג מצב ופעולות בצורה נגישה, ו-Maya כשכבת שיחה שמאפשרת להבין בקשות ולהפעיל תרחישים באופן מבוקר.

הזרימה הטיפוסית היא: המשתמש שואל או מבקש פעולה, Maya מפרשת את הכוונה, בודקת context רלוונטי, ואז מחליטה אם להחזיר הסבר או להפעיל אוטומציה. הצד החזק בפרויקט הוא החיבור בין UX יומיומי לבין תשתית אמיתית: מסך קיר, תרחישי בית, סטטוסים, ולוגיקה שמונעת מהמערכת להפוך לכפתורים מפוזרים. ברמת אבטחה, התיאור נשאר ברמת ארכיטקטורה ולא חושף entity ids, כתובות פנימיות, שמות מכשירים פרטיים או כללי אוטומציה רגישים.`,
            localLlm: `Local LLM / Cyber Agent הוא מעבדה להרצת מודלים מקומיים וניסויי AI מבוקרים. המטרה היא לבדוק איך מודל מקומי יכול לעזור בניתוח, סיכום, השוואת תשובות ותיעוד בלי להישען תמיד על שירות חיצוני. הארכיטקטורה כוללת שכבת inference מקומית, wrapper שמנרמל בקשות ותשובות, וממשק שמאפשר להשוות בין תרחישים או לשמור תוצרים בצורה מסודרת.

הערך המקצועי כאן הוא תפעולי: להבין latency, איכות תשובה, מגבלות context, פרטיות, תיעוד, והבדלים בין מודלים. בתחום הסייבר זה מתאים בעיקר לחשיבה הגנתית: סיכום ממצאים, ניסוח דוח, סיווג רעיונות ובדיקת היגיון. הפרויקט לא צריך לחשוף prompts מלאים, datasets פרטיים או נתונים אמיתיים מתוך מערכות.`,
            redlab: `RedLab הוא אזור מעבדה למחקר אבטחה מורשה ולבניית תהליך עבודה מסודר סביב ממצא. במקום להציג “טריקים”, הפרויקט ממוקד בתפעול מקצועי: הגדרת scope, איסוף evidence, תיעוד צעדים ברמה גבוהה, דירוג סיכון, ויצירת דוח שאפשר להבין גם אחרי שהבדיקה הסתיימה.

המערכת מדגימה חשיבה של operator: לא רק למצוא בעיה, אלא לשמור הקשר, לבנות timeline, להפריד בין observation לבין impact, ולכתוב remediation ברור. כל מה שמוצג לציבור נשאר ללא targets, payloads, exploit chain או פרטים שמאפשרים שחזור פוגעני.`,
            wifi: `Zacaim-WiFi-Tool הוא פרויקט תשתיתי סביב Raspberry Pi וניהול סביבת WiFi/Lab. הערך שלו הוא בחיבור בין חומרה קטנה, סקריפטים, ממשק נוח ותיעוד מצב. ברמה טכנית הוא מראה עבודה עם Linux, שירותים, הרשאות, רשת, UI קטן, ולוגיקה שמאפשרת לראות מצב מערכת או להריץ פעולות בצורה מסודרת.

בפרסום בטוח מתארים את היכולת והארכיטקטורה, לא פרטי רשת אמיתיים. כלומר אפשר לדבר על device workflow, service control, logs, packaging ותחזוקה; לא מציגים SSIDs פרטיים, כתובות, סיסמאות, מזהי חומרה או קונפיגורציה שיכולה לשמש נגד סביבה קיימת.`,
            monitoring: `Private Control Center / Monitoring Lab הוא דשבורד תפעולי שמרכז מצב שירותים, לוגים, מדדים ונקודות בדיקה. הארכיטקטורה שלו נשענת על עיקרון פשוט: משטח ניהולי צריך להיות מוגן, קריא, ולתת תשובה מהירה לשאלה “מה עובד, מה נפל, ומה השתנה”.

טכנית זה מחבר observability, access control, service status, usage visibility ותיעוד. זה פרויקט שמראה הבנה של תפעול אחרי deployment: לא מספיק לבנות כלי, צריך לדעת איך רואים אותו, איך מאבחנים תקלה, ואיך מצמצמים מידע רגיש בפרסום חיצוני.`,
            games: `פרויקטי המשחקים וה-UI Labs מציגים צד אחר של רותם: בדיקת אינטראקציה, ביצועים, layout, game loops וחוויית משתמש. גם כשהנושא נראה קליל, יש שם עבודה טכנית אמיתית: state, input handling, rendering, responsive behavior, QA ו-polish. זה משלים את פרויקטי התשתיות כי הוא מראה יכולת לבנות ממשקים שאנשים באמת יכולים להשתמש בהם.`,
            contact: "אפשר ליצור קשר עם רותם דרך המייל Rotemvnkll@gmail.com או דרך LinkedIn שמופיע באזור הקשר באתר.",
            fallback: `אפשר לשאול אותי על פרויקט מסוים או לבקש הרחבה לפי זווית: ארכיטקטורה, זרימת עבודה, טכנולוגיות, תוצאות, אבטחת מידע, או איך להציג את הפרויקט בראיון. אם תרצה, אפשר להתחיל עם: Maya, Home Assistant + Maya, Local LLM / Cyber Agent, RedLab, Zacaim-WiFi-Tool או Monitoring Lab.`,
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
            capabilities: `I can give technical expansions on Rotem's main projects: Maya, Home Assistant + Maya, Local LLM / Cyber Agent, RedLab, Zacaim-WiFi-Tool, dashboards, monitoring tools, and UI/game labs.

The answers are shaped like short case studies: goal, architecture, workflow, core technologies, what the project proves, and which details stay out of public view for security reasons. I can also compare projects, explain architecture decisions, or reframe a project for an interview, client conversation, README, or portfolio section.`,
            built: `Rotem built a portfolio of systems around practical AI, infrastructure, automation, observability, and cyber security. On the AI side there is Maya as a personal agent, Local LLM / Cyber Agent for controlled local-model experiments, and dashboards for usage, risk, and operational visibility. On the infrastructure side there is Home Assistant + Maya, Raspberry Pi WiFi tooling, a protected control center, and Cloudflare-oriented access and tunnel experiments described at a public-safe level.

The common pattern is more important than any single tool: input from a person or system, an interpretation layer that understands intent, a tool layer that performs a controlled action, and observability that shows what happened. That demonstrates end-to-end system building: UI, automation, integrations, security boundaries, logs, and long-term operation.`,
            maya: `Maya is a personal AI agent project built around real use rather than a static demo. Architecturally, it can be described as several layers: input adapters for channels such as WhatsApp, text, voice, images, and URLs; a context layer for memory, summaries, calendar-like context, and useful state; an orchestrator that decides whether to answer directly, call a tool, inspect a link, or hand off to another workflow; and a tool layer that connects capabilities such as Home Assistant, URL intelligence, Android Lab, protected monitoring, and local model experiments.

The important design decision is the separation between conversation and action. An incoming message should not immediately execute something. It first goes through intent classification, context construction, tool selection, and then either a response or a controlled action. That makes room for guardrails, permission checks, validation, and logs. Operationally, the project shows how to build a Hebrew-first assistant that connects to real tools while still being monitorable, debuggable, and extendable.

From a public-safe perspective, the useful story is the pattern: adapters, memory, orchestrator, tool layer, observability, and user-facing response. Internal service names, exact endpoints, full prompts, tokens, identifiers, and permission structure are intentionally not part of the public explanation.`,
            cyber: `Rotem's cyber experience combines security operations in large environments with authorized private labs. The professional surface includes SIEM, WAF, proxy, load balancing, SSL, API gateways, monitoring, availability, logs, traffic investigation, and response workflows. This is not just familiarity with tool names; it is understanding how signals from different systems become one operational picture.

In the personal projects, that appears through RedLab, risk research, reporting tools, and local AI support for structured analysis. The public boundary matters: it is useful to describe methodology, evidence notes, triage, reporting, dashboards, and defensive thinking; it is not appropriate to publish targets, payloads, exploit steps, internal identifiers, or bypass details. That shows investigation depth without turning the portfolio into an offensive playbook.`,
            homeAssistant: `Home Assistant + Maya connects smart-home control, a wall dashboard, and an AI agent. The architecture has three public-safe layers: Home Assistant as the state and automation layer, a dashboard that exposes status and actions in a readable way, and Maya as the conversational layer that can interpret requests and route them into controlled workflows.

A typical flow is: the user asks a question or requests an action, Maya interprets intent, checks relevant context, and then decides whether to answer, explain, or trigger an automation. The strong part of the project is the bridge between daily UX and real infrastructure: a wall display, home scenarios, visible status, and logic that prevents the system from becoming a pile of disconnected buttons. The public description avoids entity ids, private device names, internal addresses, and sensitive automation rules.`,
            localLlm: `Local LLM / Cyber Agent is a lab for running local models and controlled AI experiments. The goal is to understand where local inference is useful: analysis, summarization, response comparison, documentation, and privacy-sensitive workflows. Architecturally, it uses a local inference layer, a wrapper that normalizes requests and responses, and an interface for comparing scenarios or keeping outputs structured.

The professional value is operational: latency, answer quality, context limits, privacy, documentation quality, and model comparison. In cyber-related usage, the safe emphasis is defensive: summarizing findings, drafting reports, classifying ideas, and validating reasoning. The public version does not need to expose full prompts, private datasets, real logs, or internal system data.`,
            redlab: `RedLab is a lab area for authorized security research and structured finding workflow. Instead of presenting tricks, it focuses on the professional operating loop: defining scope, capturing evidence, keeping high-level steps, rating risk, and producing a report that still makes sense after the test is over.

The system demonstrates operator thinking: not only finding an issue, but preserving context, building a timeline, separating observation from impact, and writing remediation clearly. Public material intentionally avoids targets, payloads, exploit chains, and details that would let someone reproduce harmful behavior.`,
            wifi: `Zacaim-WiFi-Tool is an infrastructure project around Raspberry Pi and WiFi/lab environment management. Its value is the connection between small hardware, Linux services, scripts, a compact UI, and status documentation. Technically, it shows Linux operation, service control, permissions, networking, UI work, logs, and workflows that make system state visible.

The safe public framing is capability and architecture rather than environment detail. It is fine to discuss device workflow, service control, logs, packaging, and maintenance. It is not useful to publish private SSIDs, addresses, passwords, hardware identifiers, or configuration that could be reused against a real environment.`,
            monitoring: `Private Control Center / Monitoring Lab is an operations dashboard that brings together service state, logs, metrics, and health checks. Its core principle is simple: an admin surface should be protected, readable, and answer quickly what is healthy, what changed, and what needs attention.

Technically, it connects observability, access control, service status, usage visibility, and documentation. It shows understanding of life after deployment: building the tool is not enough; you need to see it, debug it, and publish only the information that is safe to show externally.`,
            games: `The browser games and UI labs show a different side of Rotem's work: interaction design, performance, layout, state, rendering loops, input handling, responsive behavior, QA, and polish. Even when the topic is playful, the engineering is real. These projects complement the infrastructure work because they show the ability to build interfaces people can actually use.`,
            contact: "You can contact Rotem by email at Rotemvnkll@gmail.com or through the LinkedIn link in the contact section.",
            fallback: `You can ask about a specific project or request a technical angle: architecture, workflow, technologies, results, security boundaries, or how to present the project in an interview. Good starting points are Maya, Home Assistant + Maya, Local LLM / Cyber Agent, RedLab, Zacaim-WiFi-Tool, or Monitoring Lab.`,
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
