const CHARACTER_GLB_URL = "assets/3d/rotem-z-rabbit.glb";
const CHARACTER_MANIFEST_URL = "assets/3d/character-manifest.json";
const EXTERNAL_CHARACTER_MODEL_NAME = "rotem-z-rabbit-glb";
const CHARACTER_ANIMATION_NAMES = {
    idle: ["Idle", "idle", "Breathing", "Stand"],
    walk: ["WalkToSide", "Walk", "walk", "SideStep"],
    pointLeft: ["PointLeft"],
    pointRight: ["PointRight"],
    point: ["Point", "point"],
};
const CHARACTER_STATE_THRESHOLDS = {
    dock: 0.04,
    walkEnd: 0.3,
};
const EXTERNAL_SCROLL_MOTION = {
    desktopTravel: 0.34,
    mobileTravel: 0.3,
    desktopSideBias: 0.28,
    mobileSideBias: 0.16,
    pointSettle: 0.08,
    yaw: 0.22,
    lean: 0.1,
    bounce: 0.08,
};
const RIGGED_BONE_NAMES = {
    head: "Head",
    neck: "Neck",
    spine: "Spine",
    spine1: "Spine1",
    spine2: "Spine2",
    leftHand: "LeftHand",
    leftForeArm: "LeftForeArm",
    leftArm: "LeftArm",
    leftLeg: "LeftLeg",
    rightHand: "RightHand",
    rightForeArm: "RightForeArm",
    rightArm: "RightArm",
    rightLeg: "RightLeg",
};
let THREE;
let GLTFLoader;

const DEFAULT_LANGUAGE = "he";

const I18N = {
    en: {
        skipLink: "Skip to content",
        brandLabel: "Rotem Zacaim - Home",
        primaryNavLabel: "Primary navigation",
        navProjects: "Projects",
        navLabGallery: "Lab Gallery",
        navTimeline: "Timeline",
        navSkills: "Courses & Skills",
        navProfile: "Profile",
        navLab: "Tool Lab",
        navSystems: "Systems",
        navExperience: "Experience",
        navContact: "Contact",
        languageToggleLabel: "Switch to Hebrew",
        topbarContact: "Email",
        heroEyebrow: "Projects-first portfolio",
        heroTitle: "Rotem Zacaim",
        heroLede: "Security and infrastructure analyst building AI systems, automation, and practical cyber labs around real operational workflows.",
        heroActionsLabel: "Primary actions",
        heroPrimary: "View projects",
        heroSecondary: "Professional timeline",
        heroFocusLabel: "Focus areas",
        heroFocus: "Maya, Home Assistant, RedLab, local models, Android Lab, games.",
        previewLabel: "Project preview",
        previewTitle: "This portfolio now leads with real projects that were built, tested, and operated.",
        previewCopy: "Every card opens a deeper read: what was built, how it works, what it proves, and which technologies are involved.",
        projectsTitle: "Projects",
        projectsIntro: "Projects I built around AI, infrastructure, cyber security, smart-home systems, local models, and automation.",
        labGalleryTitle: "Lab Gallery",
        labGalleryIntro: "Secondary builds and lab experiments showing range: dashboards, games, automations, AI research, and product tools.",
        timelineTitle: "Year by year",
        timelineIntro: "What I did each year, where I worked, and which projects grew alongside the professional experience.",
        skillsTitle: "Courses & Skills",
        skillsIntro: "Courses, certifications, and tool knowledge from my CV and independent research.",
        projectDetailCloseLabel: "Close project detail",
        profileTitle: "Security operator. Infrastructure builder. AI experimenter.",
        profileIntro: "I work where alerts, infrastructure, code, and people meet.",
        profileCopyOne: "I bring hands-on experience from government-scale environments: SIEM, WAF, proxy, load balancing, SSL, API gateways, monitoring, Windows/Linux servers, and incident response workflows.",
        profileCopyTwo: "Outside the formal role, I build my own systems: AI agents, local models, protected dashboards, security workbenches, Android labs, smart-home integrations, and automation flows that connect real tools.",
        operatorRailLabel: "Operator principles",
        operateTitle: "Investigate",
        operateCopy: "Read logs, traffic, alerts, and infrastructure signals until the real fault is visible.",
        automateTitle: "Automate",
        automateCopy: "Turn repeated checks and actions into workflows with context, permissions, and guardrails.",
        ownTitle: "Operate",
        ownCopy: "Deploy carefully, monitor what changed, and keep the system understandable after it ships.",
        labTitle: "AI & Tool Lab",
        labIntro: "A private build lab for practical agents, protected dashboards, local inference, security tooling, and automation experiments.",
        projectLabel: "Project",
        mayaCopy: "Maya started as a Hebrew-first WhatsApp AI agent and became a wider operator platform: memory, calendar, voice, images, URL intelligence, Home Assistant, Android Lab, protected monitoring, RedLab, and local GGUF models through RoteMGPT.",
        labSignalOne: "Conversation input",
        labOutcomeOne: "Tool-backed action",
        labSignalTwo: "Local + cloud models",
        labOutcomeTwo: "Flexible inference",
        labSignalThree: "Protected dashboard",
        labOutcomeThree: "Visible operations",
        systemsTitle: "Systems & tools",
        systemsIntro: "The public version of what I build: practical systems that connect security, infrastructure, AI, and operations without exposing private internals.",
        systemsMapLabel: "Systems map",
        mapStart: "Signals",
        mapEnd: "Reliable systems",
        systemSocTitle: "Security operations",
        systemSocCopy: "SIEM/Splunk work, WAF, proxy, load balancers, SSL, API gateways, logs, monitoring, and incident triage.",
        systemAlertTitle: "Maya AI agent",
        systemAlertCopy: "A WhatsApp-based personal agent with memory, calendar, voice, image understanding, URL intelligence, and tool plugins.",
        systemAiTitle: "Private control center",
        systemAiCopy: "A protected admin and observability layer with Cloudflare Access/Tunnel, systemd service state, logs, metrics, and usage visibility.",
        systemDeployTitle: "Security workbenches",
        systemDeployCopy: "ZACAIM, RedLab, and web recon/reporting tools for authorized discovery, evidence capture, and structured operator reports.",
        deepTitle: "Architecture",
        deepIntro: "The pattern behind the tools: keep the public edge protected, keep the runtime observable, and make every automation explainable.",
        workflowUnderstandTitle: "Secure access",
        workflowUnderstandCopy: "Cloudflare Access and tunnels protect admin surfaces while services stay isolated behind the edge.",
        workflowArchitectTitle: "Message runtime",
        workflowArchitectCopy: "WhatsApp adapter, event bus, message router, and orchestrator separate input, decision, tool use, and response.",
        workflowBuildTitle: "Tool layer",
        workflowBuildCopy: "Plugins connect memory, calendar, weather, maps, vouchers, Home Assistant, Android Lab, URL intelligence, and security workflows.",
        workflowDeployTitle: "Model layer",
        workflowDeployCopy: "OpenAI models handle the main reasoning path, with local GGUF inference exposed through RoteMGPT for controlled experiments.",
        workflowEvolveTitle: "Observability",
        workflowEvolveCopy: "Dashboards, JSON logs, metrics, systemd service state, and usage tracking keep the system debuggable after deployment.",
        experienceTitle: "Experience",
        experienceIntro: "Hands-on work across government-scale security operations, technical support, infrastructure, automation, and field operations.",
        roleOneTitle: "Information Security & Infrastructure Operations Analyst",
        roleOneCopy: "Operational response for government systems: security products, infrastructure issues, log analysis, traffic investigation, availability, certificates, and API gateway flows.",
        roleTwoTitle: "Control & Monitoring Center",
        roleTwoCopy: "Remote diagnosis, endpoint and application support, Active Directory user/group work, smart card handling, Web AD automations, and support across health-sector systems.",
        roleThreeTitle: "Israel Police",
        roleThreeCopy: "Basic patrol training and exposure to structured operational discipline, reporting, field awareness, and incident handling.",
        roleFourTitle: "Operations, logistics, and team management",
        roleFourCopy: "Branch operations, staff management, suppliers, inventory, service targets, plus IDF ERP/SAP inventory and logistics work completed with excellence.",
        certTitle: "Education & certifications",
        certIntro: "Formal cyber training, QA foundations, networking, ethical hacking, and field experience that connect technical depth with practical execution.",
        certOneLabel: "Cyber",
        certOneTitle: "Cyber Defender",
        certOneCopy: "John Bryce · 650 academic hours",
        certTwoLabel: "QA",
        certTwoTitle: "Software QA",
        certTwoCopy: "Technion · SQL, web, mobile, Jira, automation basics",
        certThreeLabel: "CCNA",
        certThreeTitle: "Cisco CCNA 200-301",
        certThreeCopy: "Routing, switching, protocols, Packet Tracer labs",
        certFourLabel: "THM",
        certFourTitle: "Jr Penetration Tester",
        certFourCopy: "TryHackMe · practical security learning path",
        certFiveLabel: "Ethics",
        certFiveTitle: "Applied Ethical Hacking",
        certFiveCopy: "Udemy · rules of engagement and scoped testing",
        certSixLabel: "Field",
        certSixTitle: "Emergency & volunteer operations",
        certSixCopy: "MDA, United Hatzalah, police intelligence volunteering",
        contactTitle: "Bring me the system nobody wants to untangle",
        contactCopy: "I like problems where the answer needs both operations and code: understand the flow, expose the signal, connect the tools, automate responsibly, and keep ownership visible.",
        contactEmail: "Email Rotem",
        mobileDockLabel: "Quick actions",
        mobileProjects: "Projects",
        mobileTimeline: "Timeline",
        mobileStart: "Start",
        mobileSystems: "Systems",
        metaDescription: "Rotem Zacaim builds security operations, infrastructure workflows, AI agents, and practical tools for real operational teams.",
        metaTitle: "Rotem Zacaim | Cyber Security, Infrastructure & AI Automation",
        pageTitle: "Rotem Zacaim | Cyber Security, Infrastructure & AI Automation",
    },
    he: {
        skipLink: "דלג לתוכן",
        brandLabel: "רותם זכאים - בית",
        primaryNavLabel: "ניווט ראשי",
        navProjects: "פרויקטים",
        navLabGallery: "גלריית מעבדה",
        navTimeline: "ציר זמן",
        navSkills: "קורסים וכישורים",
        navProfile: "פרופיל",
        navLab: "מעבדת כלים",
        navSystems: "מערכות",
        navExperience: "ניסיון",
        navContact: "קשר",
        languageToggleLabel: "Switch to English",
        topbarContact: "אימייל",
        heroEyebrow: "פורטפוליו Projects-first",
        heroTitle: "רותם זכאים",
        heroLede: "אנליסט אבטחת מידע ותשתיות שבונה מערכות AI, אוטומציה ומעבדות סייבר פרקטיות סביב זרימות עבודה אמיתיות.",
        heroActionsLabel: "פעולות ראשיות",
        heroPrimary: "לראות פרויקטים",
        heroSecondary: "ציר זמן מקצועי",
        heroFocusLabel: "מוקדי עבודה",
        heroFocus: "Maya, Home Assistant, RedLab, local models, Android Lab, games.",
        previewLabel: "תצוגת פרויקטים",
        previewTitle: "האתר הזה מוביל עכשיו עם פרויקטים אמיתיים שנבנו והופעלו בפועל.",
        previewCopy: "כל כרטיס פותח הסבר עמוק יותר: מה נבנה, איך זה עובד, מה זה מוכיח, ואילו טכנולוגיות מעורבות.",
        projectsTitle: "פרויקטים",
        projectsIntro: "פרויקטים שבניתי סביב AI, תשתיות, אבטחת מידע, מערכות בית חכם, local models ואוטומציה.",
        labGalleryTitle: "גלריית מעבדה",
        labGalleryIntro: "פרויקטים משניים וניסויי מעבדה שמראים רוחב: דשבורדים, games, אוטומציות, מחקר AI וכלי מוצר.",
        timelineTitle: "שנה אחרי שנה",
        timelineIntro: "מה עשיתי בכל שנה, איפה עבדתי, ואילו פרויקטים גדלו לצד הניסיון המקצועי.",
        skillsTitle: "קורסים וכישורים",
        skillsIntro: "קורסים, הסמכות וקבוצות ידע מתוך קורות החיים ומחקר עצמאי.",
        projectDetailCloseLabel: "סגירת פרטי פרויקט",
        profileTitle: "אופרייטור אבטחה. בונה תשתיות. מתנסה ב־AI.",
        profileIntro: "אני עובד בדיוק במקום שבו התרעות, תשתיות, קוד ואנשים נפגשים.",
        profileCopyOne: "אני מביא ניסיון מעשי מסביבות ממשלתיות רחבות: SIEM, WAF, Proxy, Load Balancer, SSL, API Gateway, ניטור, שרתי Windows/Linux ותהליכי Incident Response.",
        profileCopyTwo: "מחוץ לתפקיד הפורמלי אני בונה מערכות משלי: סוכני AI, מודלים מקומיים, דשבורדים מוגנים, כלי אבטחה, Android Lab, חיבורי בית חכם וזרימות אוטומציה שמחברות כלים אמיתיים.",
        operatorRailLabel: "עקרונות עבודה",
        operateTitle: "Investigate",
        operateCopy: "לקרוא לוגים, תעבורה, התרעות וסימני תשתית עד שהתקלה האמיתית נראית.",
        automateTitle: "Automate",
        automateCopy: "להפוך בדיקות ופעולות שחוזרות על עצמן ל־workflows עם קונטקסט, הרשאות ו־guardrails.",
        ownTitle: "Operate",
        ownCopy: "להעלות בזהירות, לנטר מה השתנה, ולשמור שהמערכת נשארת מובנת גם אחרי שהיא באוויר.",
        labTitle: "מעבדת AI וכלים",
        labIntro: "מעבדת בנייה פרטית לסוכנים מעשיים, דשבורדים מוגנים, inference מקומי, כלי אבטחה וניסויי אוטומציה.",
        projectLabel: "פרויקט",
        mayaCopy: "Maya התחילה כסוכן WhatsApp בעברית והפכה לפלטפורמת תפעול רחבה יותר: זיכרון, יומן, קול, תמונות, URL intelligence, Home Assistant, Android Lab, ניטור מוגן, RedLab ומודלי GGUF מקומיים דרך RoteMGPT.",
        labSignalOne: "קלט משיחה",
        labOutcomeOne: "פעולה דרך כלים",
        labSignalTwo: "מודלים מקומיים וענן",
        labOutcomeTwo: "Inference גמיש",
        labSignalThree: "דשבורד מוגן",
        labOutcomeThree: "תפעול גלוי",
        systemsTitle: "מערכות וכלים",
        systemsIntro: "הגרסה הציבורית של מה שאני בונה: מערכות פרקטיות שמחברות אבטחה, תשתיות, AI ותפעול בלי לחשוף פרטים פנימיים.",
        systemsMapLabel: "מפת מערכות",
        mapStart: "סיגנלים",
        mapEnd: "מערכות אמינות",
        systemSocTitle: "תפעול אבטחת מידע",
        systemSocCopy: "עבודה עם SIEM/Splunk, WAF, Proxy, Load Balancer, SSL, API Gateway, לוגים, ניטור ו־incident triage.",
        systemAlertTitle: "סוכן Maya",
        systemAlertCopy: "סוכן אישי מבוסס WhatsApp עם זיכרון, יומן, קול, הבנת תמונות, URL intelligence ו־tool plugins.",
        systemAiTitle: "Control center פרטי",
        systemAiCopy: "שכבת אדמין וניטור מוגנת עם Cloudflare Access/Tunnel, מצב שירותי systemd, לוגים, מטריקות ונראות שימוש.",
        systemDeployTitle: "Security workbenches",
        systemDeployCopy: "ZACAIM, RedLab וכלי web recon/reporting לגילוי מורשה, איסוף ראיות ודוחות אופרייטור מובנים.",
        deepTitle: "ארכיטקטורה",
        deepIntro: "הדפוס מאחורי הכלים: להשאיר את הקצה הציבורי מוגן, את ה־runtime ניתן לניטור, ואת האוטומציה מוסברת.",
        workflowUnderstandTitle: "גישה מאובטחת",
        workflowUnderstandCopy: "Cloudflare Access וטאנלים מגנים על משטחי האדמין בזמן שהשירותים נשארים מבודדים מאחורי ה־edge.",
        workflowArchitectTitle: "Message runtime",
        workflowArchitectCopy: "WhatsApp adapter, event bus, message router ו־orchestrator מפרידים בין קלט, החלטה, שימוש בכלים ותגובה.",
        workflowBuildTitle: "שכבת כלים",
        workflowBuildCopy: "Plugins מחברים זיכרון, יומן, מזג אוויר, מפות, שוברים, Home Assistant, Android Lab, URL intelligence ו־security workflows.",
        workflowDeployTitle: "שכבת מודלים",
        workflowDeployCopy: "מודלי OpenAI מטפלים במסלול החשיבה הראשי, לצד inference מקומי במודלי GGUF דרך RoteMGPT לניסויים מבוקרים.",
        workflowEvolveTitle: "Observability",
        workflowEvolveCopy: "דשבורדים, JSON logs, מטריקות, מצב שירותי systemd וניטור שימוש שומרים שהמערכת נשארת ניתנת לדיבוג אחרי העלייה.",
        experienceTitle: "ניסיון",
        experienceIntro: "עבודה מעשית בתפעול אבטחת מידע בהיקף ממשלתי, תמיכה טכנית, תשתיות, אוטומציה ותפעול שטח.",
        roleOneTitle: "אנליסט אבטחת מידע ותפעול תשתיות",
        roleOneCopy: "מענה תפעולי למערכות ממשלתיות: מוצרי אבטחה, תקלות תשתית, ניתוח לוגים, תחקור תעבורה, זמינות, תעודות וזרימות API Gateway.",
        roleTwoTitle: "מרכז שליטה ובקרה",
        roleTwoCopy: "אבחון מרחוק, תמיכת קצה ואפליקציות, עבודה עם Active Directory, משתמשים וקבוצות, כרטיסים חכמים, אוטומציות Web AD ותמיכה במערכות בריאות.",
        roleThreeTitle: "משטרת ישראל",
        roleThreeCopy: "הכשרת יסוד סיור וחשיפה למשמעת תפעולית מובנית, דיווח, מודעות שטח וטיפול באירועים.",
        roleFourTitle: "תפעול, לוגיסטיקה וניהול צוותים",
        roleFourCopy: "ניהול סניף, עובדים, ספקים, מלאי ויעדי שירות, לצד עבודה צבאית עם ERP/SAP לניהול מלאי ולוגיסטיקה שהסתיימה בהצטיינות.",
        certTitle: "השכלה והסמכות",
        certIntro: "הכשרה פורמלית בסייבר, יסודות QA, תקשורת, ethical hacking וניסיון שטח שמחברים עומק טכני לביצוע מעשי.",
        certOneLabel: "Cyber",
        certOneTitle: "מגן סייבר",
        certOneCopy: "ג׳ון ברייס · 650 שעות אקדמיות",
        certTwoLabel: "QA",
        certTwoTitle: "בודק תוכנה QA",
        certTwoCopy: "טכניון · SQL, Web, Mobile, Jira ויסודות אוטומציה",
        certThreeLabel: "CCNA",
        certThreeTitle: "Cisco CCNA 200-301",
        certThreeCopy: "Routing, Switching, פרוטוקולים ו־Packet Tracer Labs",
        certFourLabel: "THM",
        certFourTitle: "Jr Penetration Tester",
        certFourCopy: "TryHackMe · מסלול למידה מעשי באבטחת מידע",
        certFiveLabel: "Ethics",
        certFiveTitle: "Applied Ethical Hacking",
        certFiveCopy: "Udemy · כללי התקשרות ובדיקות בהיקף מורשה",
        certSixLabel: "Field",
        certSixTitle: "חירום והתנדבות מבצעית",
        certSixCopy: "מד״א, איחוד הצלה והתנדבות ביחידת מודיעין משטרתית",
        contactTitle: "תביאו לי את המערכת שאף אחד לא רוצה לפרק",
        contactCopy: "אני אוהב בעיות שבהן הפתרון צריך גם תפעול וגם קוד: להבין את הזרימה, לחשוף את הסיגנל, לחבר את הכלים, לאוטמט באחריות ולהשאיר בעלות ברורה.",
        contactEmail: "אימייל לרותם",
        mobileDockLabel: "פעולות מהירות",
        mobileProjects: "פרויקטים",
        mobileTimeline: "ציר זמן",
        mobileStart: "התחלה",
        mobileSystems: "מערכות",
        metaDescription: "רותם זכאים בונה תפעול אבטחת מידע, זרימות תשתית, סוכני AI וכלים פרקטיים לצוותים ומערכות אמיתיות.",
        metaTitle: "רותם זכאים | אבטחת מידע, תשתיות ואוטומציות AI",
        pageTitle: "רותם זכאים | אבטחת מידע, תשתיות ואוטומציות AI",
    },
};

const PROJECT_CATEGORY_LABELS = {
    ai: { he: "AI", en: "AI" },
    automation: { he: "אוטומציה", en: "Automation" },
    home: { he: "בית חכם", en: "Smart Home" },
    infrastructure: { he: "תשתיות", en: "Infrastructure" },
    lab: { he: "מעבדה", en: "Lab" },
    product: { he: "מוצר", en: "Product" },
    research: { he: "מחקר", en: "Research" },
    security: { he: "אבטחת מידע", en: "Security" },
    tools: { he: "כלים", en: "Tools" },
};

function localized(value, language) {
    const normalized = normalizeLanguage(language);

    if (typeof value === "string") return value;
    if (!value || typeof value !== "object") return "";

    return value[normalized] || value[DEFAULT_LANGUAGE] || value.en || "";
}

function createTag(name, className, text) {
    const element = document.createElement(name);

    if (className) element.className = className;
    if (text !== undefined && text !== null) element.textContent = text;

    return element;
}

function clearChildren(element) {
    if (!element) return;

    if (typeof element.replaceChildren === "function") {
        element.replaceChildren();
        return;
    }

    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

const PRIMARY_PROJECTS = [
    {
        id: "home-assistant-maya",
        title: { he: "Home Assistant + Maya", en: "Home Assistant + Maya" },
        category: "home",
        categories: ["home", "ai", "automation"],
        year: "2026",
        status: { he: "פעיל במעבדה פרטית", en: "Active private lab" },
        proofLabel: { he: "הוכחת AI לבית חכם", en: "Smart-home AI proof" },
        source: {
            he: "מקור: תיעוד פורטפוליו ציבורי ממעבדה פרטית, ללא מזהי התקנה או פרטים פנימיים.",
            en: "Source: public portfolio notes from a private lab, with setup identifiers and internal details omitted.",
        },
        media: [
            {
                src: "assets/projects/home-assistant-maya.jpg",
                alt: {
                    he: "מסך Home Assistant המחובר ל-Maya",
                    en: "Home Assistant screen connected to Maya",
                },
            },
            {
                src: "assets/projects/home-assistant-wall-panel.png",
                alt: {
                    he: "פאנל קיר של Home Assistant",
                    en: "Home Assistant wall panel",
                },
            },
        ],
        summary: {
            he: "חיבור בין Maya לבין Home Assistant כדי להפוך שיחה בעברית לפעולה מבוקרת בבית חכם, בלי לחשוף פרטי התקנה פרטיים.",
            en: "A connection between Maya and Home Assistant that turns Hebrew conversation into controlled smart-home action without exposing private setup details.",
        },
        challenge: {
            he: "לשמור על חוויית שיחה טבעית ועדיין להשאיר הרשאות, אישורים ותצפית תפעולית ברורים.",
            en: "Keep the conversation natural while leaving permissions, approvals, and operational visibility clear.",
        },
        built: {
            he: "שכבת כלים ל-Maya, תרחישי אישור, תגובות סטטוס, ודשבורד תפעולי שמציג רק מידע ציבורי בטוח.",
            en: "A Maya tool layer, approval flows, status responses, and an operator dashboard that only shows safe public information.",
        },
        howItWorks: {
            he: "Maya מפרשת בקשה בשיחה, בודקת האם נדרש אישור, מפעילה כלי בית חכם דרך שכבת ביניים, ואז מחזירה סטטוס ברור למשתמש.",
            en: "Maya interprets a chat request, checks whether approval is needed, calls a smart-home tool through an intermediate layer, then returns a clear status to the user.",
        },
        proof: {
            he: "מוכיח חיבור בין AI, אוטומציה ותפעול בית חכם בצורה שמעדיפה שליטה והסבר על פני קסם שחור.",
            en: "Proves an AI, automation, and smart-home bridge that favors control and explanation over opaque behavior.",
        },
        tools: ["Home Assistant", "Maya WhatsApp AI Agent", "OpenAI", "Cloudflare Access", "automation workflows"],
        technologies: ["Home Assistant", "Maya WhatsApp AI Agent", "OpenAI", "Cloudflare Access", "Cloudflare Tunnel", "automation workflows", "Hebrew UX"],
        works: {
            he: ["שכבת כלים בין Maya לבית חכם", "בקשות פעולה עם אישור מפורש", "מסכי סטטוס ותפעול ללא חשיפת מידע פרטי"],
            en: ["Tool layer between Maya and smart-home controls", "Action requests with explicit approval", "Status and operations views without private data exposure"],
        },
        outcomes: {
            he: ["שיחה הופכת לבקשת פעולה", "סטטוס חוזר למשתמש", "מידע פרטי נשאר מחוץ לפורטפוליו"],
            en: ["Conversation becomes an action request", "Status returns to the user", "Private details stay out of the portfolio"],
        },
    },
    {
        id: "maya-whatsapp-agent",
        title: { he: "Maya WhatsApp AI Agent", en: "Maya WhatsApp AI Agent" },
        category: "ai",
        categories: ["ai", "automation", "product"],
        year: "2026",
        status: { he: "פעיל ומתפתח", en: "Active and evolving" },
        proofLabel: { he: "מוצר AI אישי", en: "Personal AI product" },
        source: {
            he: "מקור: מערכת אישית ותיעוד ציבורי בטוח, ללא מספרים, קבוצות, כתובות או מזהים פרטיים.",
            en: "Source: personal system and safe public documentation, without numbers, groups, addresses, or private identifiers.",
        },
        media: [
            {
                src: "assets/projects/maya-whatsapp-agent-1.jpg",
                alt: {
                    he: "ממשק שיחה של Maya",
                    en: "Maya conversation interface",
                },
            },
            {
                src: "assets/projects/maya-whatsapp-agent-2.jpg",
                alt: {
                    he: "זרימת כלים של Maya",
                    en: "Maya tool workflow",
                },
            },
        ],
        summary: {
            he: "סוכן WhatsApp בעברית שמחבר זיכרון, יומן, קול, תמונות, ניתוח קישורים וכלים שימושיים לשגרת עבודה אישית.",
            en: "A Hebrew-first WhatsApp agent connecting memory, calendar, voice, images, link analysis, and practical tools for personal operations.",
        },
        challenge: {
            he: "לבנות סוכן אישי שנשאר שימושי ביום יום, מגיב בקונטקסט, ולא מחייב מעבר לכלי עבודה נפרד.",
            en: "Build a personal agent that stays useful day to day, responds with context, and does not require switching to a separate tool.",
        },
        built: {
            he: "נתב הודעות, שכבת זיכרון, חיבורי כלים, עיבוד קבצים ותמונות, ושילוב OpenAI למסלול החשיבה הראשי.",
            en: "A message router, memory layer, tool connectors, file and image handling, and OpenAI on the main reasoning path.",
        },
        howItWorks: {
            he: "הודעות נכנסות עוברות דרך adapter, ניתוח שפה וקונטקסט, בחירת כלי מתאים, בקרת פעולה, וחזרה למשתמש עם תשובה או סטטוס.",
            en: "Incoming messages pass through an adapter, language and context analysis, tool selection, action control, and a user-facing reply or status update.",
        },
        proof: {
            he: "הפרויקט מציג מוצר AI אישי שמחבר שיחה, נתונים ופעולה בצורה שימושית ולא דמו בלבד.",
            en: "The project shows a personal AI product that connects conversation, data, and action as a useful system rather than a demo.",
        },
        tools: ["WhatsApp", "OpenAI", "Home Assistant", "URL intelligence", "Android Lab", "Cloudflare Tunnel"],
        technologies: ["WhatsApp", "OpenAI", "Home Assistant", "URL intelligence", "Android Lab", "Cloudflare Tunnel", "Cloudflare Access", "RoteMGPT"],
        works: {
            he: ["runtime לשיחות WhatsApp בעברית", "זיכרון וקונטקסט לשימוש יומיומי", "חיבורי כלים לקול, תמונות, קישורים ואוטומציה"],
            en: ["Hebrew-first WhatsApp conversation runtime", "Memory and context for daily use", "Tool connectors for voice, images, links, and automation"],
        },
        outcomes: {
            he: ["עברית כנקודת מוצא", "חיבור כלים אמיתי", "תפעול עם זיכרון וקונטקסט"],
            en: ["Hebrew as the starting point", "Real tool integration", "Operations with memory and context"],
        },
    },
    {
        id: "maya-local-llm-cyber-agent",
        title: { he: "Maya Local LLM / Cyber Agent", en: "Maya Local LLM / Cyber Agent" },
        category: "research",
        categories: ["ai", "research", "security"],
        year: "2025",
        status: { he: "מעבדת מחקר מורשית", en: "Authorized research lab" },
        proofLabel: { he: "מחקר AI הגנתי", en: "Defensive AI research" },
        source: {
            he: "מקור: ניסויי מעבדה מורשים ותיעוד בטוח לפרסום, ללא יעדים או צעדי ניצול.",
            en: "Source: authorized lab experiments and public-safe notes, without targets or exploitation steps.",
        },
        media: [
            {
                src: "assets/projects/local-llm-cyber-agent.jpg",
                alt: {
                    he: "מעבדת local LLM למחקר סייבר מורשה",
                    en: "Local LLM lab for authorized cyber research",
                },
            },
        ],
        summary: {
            he: "מעבדת local LLM שמאפשרת ניסויים מבוקרים במודלים מקומיים, ניתוח סיכוני AI וסיוע תיעודי למחקר אבטחה מורשה בלבד.",
            en: "A local LLM lab for controlled model experiments, AI risk analysis, and documentation support for authorized security research only.",
        },
        challenge: {
            he: "לבדוק מה מודל מקומי יודע לעשות בלי להפוך את המחקר להוראות תקיפה או לחשיפת סודות.",
            en: "Explore what a local model can do without turning research into attack instructions or secret exposure.",
        },
        built: {
            he: "Workbench מקומי עם מודלי local LLM, סיכומי ראיות, ניסוח דוחות, וגבולות תוכן שמעדיפים הסבר, תיעוד והגנה.",
            en: "A local workbench with local LLM models, evidence summaries, report drafting, and content boundaries that favor explanation, documentation, and defense.",
        },
        howItWorks: {
            he: "המודל המקומי משמש לסיכום ראיות, ניסוח הערות והצלבת מושגים בתוך סביבת לימוד מבוקרת, בלי לפרסם הוראות פעולה מזיקות.",
            en: "The local model supports evidence summaries, note drafting, and concept review inside a controlled learning environment without publishing harmful how-to steps.",
        },
        proof: {
            he: "מוכיח שאפשר להשתמש במודלים מקומיים למחקר אחראי, למידה ודיווח בלי לפרסם מתכוני תקיפה.",
            en: "Shows local models can support responsible research, learning, and reporting without publishing attack recipes.",
        },
        safety: {
            he: "מוצג כמעבדת מחקר מורשית בלבד, ללא מטרות, payloads, צעדי ניצול או פרטי סודות.",
            en: "Presented as an authorized research lab only, with no targets, payloads, exploit steps, or secret details.",
        },
        tools: ["local LLM", "OpenAI", "MISP", "ELK", "TryHackMe", "Jr Penetration Tester"],
        technologies: ["local LLM", "OpenAI", "MISP", "ELK", "TryHackMe", "Jr Penetration Tester", "Rules of Engagement", "report drafting"],
        works: {
            he: ["Workbench מקומי למודלים", "סיכום ראיות ודוחות", "גבולות תוכן למחקר מורשה בלבד"],
            en: ["Local model workbench", "Evidence and report summaries", "Content boundaries for authorized research only"],
        },
        outcomes: {
            he: ["מחקר AI בטוח לפרסום", "עזרה בכתיבת דוחות", "גבולות ברורים סביב אבטחת מידע"],
            en: ["AI research safe to publish", "Report-writing assistance", "Clear security boundaries"],
        },
    },
    {
        id: "rotemz-redlab",
        title: { he: "ROTEMZ Web Security Scanner", en: "ROTEMZ Web Security Scanner" },
        category: "security",
        categories: ["security", "lab", "tools"],
        year: "2025",
        status: { he: "Workbench מעבדה מורשה", en: "Authorized lab workbench" },
        proofLabel: { he: "דוחות אבטחה מבוקרים", en: "Controlled security reporting" },
        source: {
            he: "מקור: מעבדת לימוד ודוחות לדוגמה, ללא שמות יעדים, payloads או נתיבי תקיפה.",
            en: "Source: learning lab and sample reports, without target names, payloads, or attack paths.",
        },
        media: [
            {
                src: "assets/projects/rotemz-redlab.jpg",
                alt: {
                    he: "מסך RedLab למחקר אבטחה מורשה",
                    en: "RedLab screen for authorized security research",
                },
            },
        ],
        summary: {
            he: "Workbench לדוחות אבטחת web מורשים: איסוף ראיות, סידור ממצאים, ניסוח סיכום מפעיל, וחיבור לתפיסת SIEM/Splunk.",
            en: "A workbench for authorized web security reports: evidence capture, finding organization, operator summaries, and SIEM/Splunk thinking.",
        },
        challenge: {
            he: "להראות יכולת מחקר ותיעוד בלי לפרסם יעדים, שלבי תקיפה או טכניקות שעלולות להזיק.",
            en: "Show research and documentation ability without publishing targets, attack steps, or harmful techniques.",
        },
        built: {
            he: "ממשק דוחות, מבנה ראיות, קטגוריות סיכון, ומסלול עבודה שמתאים למחקר מורשה וללמידה במעבדה.",
            en: "A reporting interface, evidence structure, risk categories, and workflow suited to authorized research and lab learning.",
        },
        howItWorks: {
            he: "המשתמש מארגן ראיות וממצאים מתוך תרחיש מורשה, מסמן רמת סיכון, ומנסח דוח קריא שמיועד להסבר ותיקוף.",
            en: "The user organizes evidence and findings from an authorized scenario, marks risk level, and drafts a readable report for explanation and validation.",
        },
        proof: {
            he: "מחבר חשיבה של SOC, כתיבת דוחות וכלי מוצר בצורה אחראית וניתנת להצגה.",
            en: "Connects SOC thinking, report writing, and product tooling in a responsible, presentable way.",
        },
        safety: {
            he: "הפרויקט מתואר כמעבדה מורשית בלבד, ללא exploit steps, target names או payloads.",
            en: "The project is described as an authorized lab only, with no exploit steps, target names, or payloads.",
        },
        tools: ["Splunk", "SIEM", "Imperva", "F5", "Check Point", "Radware", "MISP"],
        technologies: ["Splunk", "SIEM", "Imperva", "F5", "Check Point", "Radware", "MISP", "ELK", "Rules of Engagement"],
        works: {
            he: ["ממשק לדוחות אבטחת web", "מבנה ראיות וממצאים", "סיכום אופרייטור בטוח לפרסום"],
            en: ["Web security reporting interface", "Evidence and finding structure", "Public-safe operator summary"],
        },
        outcomes: {
            he: ["דיווח מובנה", "איסוף ראיות בטוח", "שפה משותפת בין אבטחה למוצר"],
            en: ["Structured reporting", "Safe evidence capture", "Shared language between security and product"],
        },
    },
    {
        id: "zacaim-wifi-tool",
        title: { he: "Zacaim-WiFi-Tool", en: "Zacaim-WiFi-Tool" },
        category: "infrastructure",
        categories: ["infrastructure", "security", "lab"],
        year: "2025",
        status: { he: "מעבדת רשת מורשית", en: "Authorized network lab" },
        proofLabel: { he: "למידת רשתות מעשית", en: "Practical network learning" },
        source: {
            he: "מקור: Raspberry Pi וסביבת בדיקה מורשית, ללא שמות רשת, מפתחות או מזהים.",
            en: "Source: Raspberry Pi and an authorized test environment, without network names, keys, or identifiers.",
        },
        media: [
            {
                src: "assets/projects/zacaim-wifi-pi-lab-1.jpg",
                alt: {
                    he: "מעבדת Raspberry Pi ל-Wi-Fi",
                    en: "Raspberry Pi Wi-Fi lab",
                },
            },
            {
                src: "assets/projects/zacaim-wifi-pi-lab-2.jpg",
                alt: {
                    he: "ציוד מעבדה לבדיקות רשת מורשות",
                    en: "Lab equipment for authorized network testing",
                },
            },
        ],
        summary: {
            he: "כלי מעבדה על Raspberry Pi לבדיקות Wi-Fi מורשות, תיעוד סביבת בדיקה והבנת תשתיות אלחוטיות בלי לפרסם הוראות תקיפה.",
            en: "A Raspberry Pi lab tool for authorized Wi-Fi testing, test-environment documentation, and wireless infrastructure learning without publishing attack instructions.",
        },
        challenge: {
            he: "להציג למידה מעשית בתקשורת ואבטחה בלי לחשוף שמות רשתות, מפתחות, כתובות או מתכוני ניצול.",
            en: "Present practical networking and security learning without exposing network names, keys, addresses, or exploitation recipes.",
        },
        built: {
            he: "Workbench מקומי לתיעוד בדיקות, ניהול תרחישים מורשים, וצילום ממצאים ברמת מעבדה.",
            en: "A local workbench for documenting tests, managing authorized scenarios, and capturing lab-level findings.",
        },
        howItWorks: {
            he: "הכלי מרכז תרחישי בדיקה מורשים, הערות מעבדה וצילומי ממצא, ומפריד בין לימוד רשתות לבין מידע רגיש.",
            en: "The tool organizes authorized test scenarios, lab notes, and finding captures while separating network learning from sensitive information.",
        },
        proof: {
            he: "מראה יכולת לחבר חומרה, Linux, רשתות, QA ותיעוד אבטחתי במסגרת בטוחה.",
            en: "Shows the ability to connect hardware, Linux, networking, QA, and security documentation in a safe scope.",
        },
        safety: {
            he: "מוצג כמעבדת למידה מורשית בלבד, ללא פרטי רשת פרטיים או הוראות פריצה.",
            en: "Presented as an authorized learning lab only, with no private network details or break-in instructions.",
        },
        tools: ["Raspberry Pi", "Linux", "CCNA 200-301", "QA", "authorized lab notes"],
        technologies: ["Raspberry Pi", "Linux", "CCNA 200-301", "QA", "wireless infrastructure", "test documentation"],
        works: {
            he: ["כלי מעבדה על Raspberry Pi", "ניהול תרחישי בדיקה מורשים", "תיעוד ממצאים ללא פרטי רשת פרטיים"],
            en: ["Raspberry Pi lab tool", "Authorized test-scenario management", "Finding notes without private network details"],
        },
        outcomes: {
            he: ["למידת רשתות מעשית", "תיעוד בדיקות נקי", "הפרדה בין מחקר לבין מידע רגיש"],
            en: ["Practical networking learning", "Clean test documentation", "Separation between research and sensitive data"],
        },
    },
    {
        id: "private-control-center-labs",
        title: { he: "Private Control Center Labs", en: "Private Control Center Labs" },
        category: "infrastructure",
        categories: ["infrastructure", "automation", "tools"],
        year: "2026",
        status: { he: "שכבת תפעול פרטית", en: "Private operations layer" },
        proofLabel: { he: "Observability ותפעול", en: "Observability and operations" },
        source: {
            he: "מקור: תצוגת פורטפוליו מסוננת ממעבדות פרטיות, ללא hostnames, כתובות או מזהים פנימיים.",
            en: "Source: filtered portfolio view from private labs, without hostnames, addresses, or internal identifiers.",
        },
        media: [
            {
                src: "assets/projects/ai-risk-local-model.jpg",
                alt: {
                    he: "דשבורד מעבדה למעקב שימוש וסיכוני AI",
                    en: "Lab dashboard for AI usage and risk tracking",
                },
            },
        ],
        summary: {
            he: "שכבת ניהול פרטית למעבדות: ניטור, סטטוס שירותים, שימוש ב-OpenAI Usage, וגישה מוגנת דרך Cloudflare.",
            en: "A private management layer for labs: monitoring, service status, OpenAI Usage visibility, and protected access through Cloudflare.",
        },
        challenge: {
            he: "להשאיר סביבת ניסוי ניתנת לתפעול בלי לפרסם hostnames, כתובות, ports או מזהים פנימיים.",
            en: "Keep the lab environment operable without publishing hostnames, addresses, ports, or internal identifiers.",
        },
        built: {
            he: "דשבורדים מוגנים, צפייה בלוגים, מדדי זמינות, מסכי usage, וחיבורי Cloudflare Workers, Tunnels, Access, D1 ו-R2.",
            en: "Protected dashboards, log views, availability metrics, usage screens, and Cloudflare Workers, Tunnels, Access, D1, and R2 integrations.",
        },
        howItWorks: {
            he: "המערכת מרכזת סטטוס, לוגים, שימוש ועלויות מאחורי גישה מוגנת, ואז מציגה בפורטפוליו רק תיאור ציבורי של היכולות.",
            en: "The system centralizes status, logs, usage, and cost visibility behind protected access, while the portfolio shows only a public description of the capabilities.",
        },
        proof: {
            he: "מחבר תפעול תשתיות, observability ואוטומציה לתצוגה ציבורית שמסבירה יכולת בלי לחשוף פנים מערכת.",
            en: "Connects infrastructure operations, observability, and automation into a public-safe view that explains capability without exposing internals.",
        },
        tools: ["Cloudflare Workers", "Cloudflare Tunnels", "Cloudflare Access", "D1", "R2", "OpenAI Usage", "Dynatrace", "SCOM", "PRTG", "CyberArk", "ELK"],
        technologies: ["Cloudflare Workers", "Cloudflare Tunnels", "Cloudflare Access", "D1", "R2", "OpenAI Usage", "Dynatrace", "SCOM", "PRTG", "CyberArk", "ELK", "AWS/GCP basics"],
        works: {
            he: ["דשבורדים מוגנים", "נראות שימוש ועלויות AI", "שכבת תפעול ציבורית מסוננת"],
            en: ["Protected dashboards", "AI usage and cost visibility", "Filtered public operations layer"],
        },
        outcomes: {
            he: ["תצפית תפעולית", "גישה מוגנת", "הסבר ציבורי ללא פרטים פנימיים"],
            en: ["Operational visibility", "Protected access", "Public explanation without internal details"],
        },
    },
];

const SECONDARY_PROJECTS = [
    {
        title: { he: "RoteMGPT", en: "RoteMGPT" },
        category: "ai",
        media: "assets/projects/ai-risk-local-model.jpg",
        summary: {
            he: "מעבדת inference מקומית למודלי GGUF וניסויי AI מבוקרים, עם דגש על פרטיות, השוואת תשובות ותיעוד בטוח.",
            en: "A local inference lab for GGUF models and controlled AI experiments, focused on privacy, response comparison, and safe documentation.",
        },
        tools: ["local LLM", "GGUF", "OpenAI", "privacy review"],
    },
    {
        title: { he: "Android Lab / Companion App", en: "Android Lab / Companion App" },
        category: "automation",
        media: "assets/projects/maya-whatsapp-agent-2.jpg",
        summary: {
            he: "אפליקציית companion לניסויי Android Lab, חיבורי כלי עזר וזרימות בדיקה סביב Maya בלי לחשוף מכשירים או מזהים פרטיים.",
            en: "A companion app for Android Lab experiments, helper-tool connections, and Maya-adjacent test flows without exposing devices or private identifiers.",
        },
        tools: ["Android Lab", "companion app", "mobile testing", "Maya"],
    },
    {
        title: { he: "Clash Royale automation", en: "Clash Royale automation" },
        category: "lab",
        media: "assets/projects/about-framer-prototype.jpg",
        summary: {
            he: "ניסוי מעבדה באוטומציית UI, זיהוי מצבים ובדיקת זרימות משחק בסביבה אישית ומורשית בלבד.",
            en: "A lab experiment in UI automation, state detection, and game-flow testing inside a personal authorized environment only.",
        },
        tools: ["UI automation", "computer vision", "QA", "game lab"],
    },
    {
        title: { he: "FortySevenMS GUI / Vision Farmer", en: "FortySevenMS GUI / Vision Farmer" },
        category: "tools",
        media: "assets/projects/about-framer-prototype.jpg",
        summary: {
            he: "כלי GUI למעבדת vision ואוטומציה שמתרגם תצפית חזותית לפעולות בדיקה מבוקרות ומדידות.",
            en: "A GUI tool for a vision and automation lab that turns visual observation into controlled, measurable test actions.",
        },
        tools: ["GUI", "vision", "automation", "QA"],
    },
    {
        title: { he: "Sale-ים MVP", en: "Sale-im MVP" },
        category: "product",
        media: "assets/projects/apartment-plan-app.png",
        summary: {
            he: "MVP מוצרי לזרימת מבצעים ורכישה קבוצתית, עם מסכי החלטה מהירים, בדיקות שימושיות ומחשבה על mobile-first.",
            en: "A product MVP for deals and group-buying flow, with fast decision screens, usability checks, and mobile-first thinking.",
        },
        tools: ["MVP", "mobile UX", "product QA", "PWA"],
    },
    {
        title: { he: "Apartment Plan App", en: "Apartment Plan App" },
        category: "product",
        media: "assets/projects/apartment-plan-app.png",
        summary: {
            he: "כלי תכנון דירה שמתרגם רעיון חזותי למסך שימושי, מדידות והחלטות מוצר.",
            en: "An apartment planning tool that turns a visual idea into a usable screen, measurements, and product decisions.",
        },
        tools: ["product UI", "layout planning", "QA"],
    },
    {
        title: { he: "AI Super-Analyst Dashboard", en: "AI Super-Analyst Dashboard" },
        category: "ai",
        media: "assets/projects/ai-risk-local-model.jpg",
        summary: {
            he: "דשבורד מחקר שמציג איך AI יכול לעזור בסיכום סיגנלים, סיכונים והחלטות ללא חשיפת מידע פרטי.",
            en: "A research dashboard showing how AI can summarize signals, risks, and decisions without exposing private information.",
        },
        tools: ["OpenAI", "local LLM", "risk review"],
    },
    {
        title: { he: "Group-Buying PWA", en: "Group-Buying PWA" },
        category: "product",
        media: "assets/projects/about-framer-prototype.jpg",
        summary: {
            he: "ניסוי מוצר לזרימת רכישה קבוצתית, מסכי החלטה מהירים וחוויית mobile-first.",
            en: "A product experiment for group-buying flow, fast decision screens, and a mobile-first experience.",
        },
        tools: ["PWA", "mobile UX", "product systems"],
    },
    {
        title: { he: "Quake/Qwasm browser games", en: "Quake/Qwasm browser games" },
        category: "lab",
        media: "assets/projects/about-framer-prototype.jpg",
        summary: {
            he: "ניסויי games בדפדפן, WebAssembly ואריזת חוויות מורכבות לתוך סביבת web.",
            en: "Browser games experiments with WebAssembly and packaging complex experiences into the web.",
        },
        tools: ["games", "browser runtime", "performance checks"],
    },
    {
        title: { he: "OpenAI Usage Dashboard", en: "OpenAI Usage Dashboard" },
        category: "automation",
        media: "assets/projects/ai-risk-local-model.jpg",
        summary: {
            he: "דשבורד שימוש שעוזר לראות עלויות, מגמות ובקרת צריכה במערכות AI.",
            en: "A usage dashboard for costs, trends, and consumption control in AI systems.",
        },
        tools: ["OpenAI Usage", "Cloudflare D1", "Cloudflare R2"],
    },
    {
        title: { he: "ChatGPT Agent Workflow", en: "ChatGPT Agent Workflow" },
        category: "ai",
        media: "assets/projects/chatgpt-agent-job-search.jpg",
        summary: {
            he: "זרימת agent שמסדרת מחקר, משימות ותוצאה שימושית סביב עבודה אמיתית.",
            en: "An agent workflow that organizes research, tasks, and useful output around real work.",
        },
        tools: ["ChatGPT", "OpenAI", "workflow design"],
    },
    {
        title: { he: "ChatGPT Shared Links Risk Research", en: "ChatGPT Shared Links Risk Research" },
        category: "research",
        media: "assets/projects/chatgpt-shared-links-risk.jpg",
        summary: {
            he: "מחקר סיכונים על שיתוף קישורים ותוכן AI, מנוסח כהסבר הגנתי וללא הוראות ניצול.",
            en: "Risk research on shared links and AI content, framed defensively without exploitation instructions.",
        },
        tools: ["AI risk", "privacy review", "Rules of Engagement"],
    },
    {
        title: { he: "About / Framer Prototype", en: "About / Framer Prototype" },
        category: "product",
        media: "assets/projects/about-framer-prototype.jpg",
        summary: {
            he: "אב טיפוס חזותי לפורטפוליו שמוביל עם פרויקטים, סיפור אישי וממשק קריא.",
            en: "A visual portfolio prototype leading with projects, personal story, and readable interaction.",
        },
        tools: ["Framer", "portfolio design", "visual systems"],
    },
];

const CAREER_TIMELINE = [
    {
        period: "2026",
        title: {
            he: "Project year - Maya, Home Assistant ו-Control Center",
            en: "Project year - Maya, Home Assistant, and Control Center",
        },
        summary: {
            he: "העמקת Maya WhatsApp AI Agent, חיבור Home Assistant, Android Lab / Companion App, RoteMGPT ושכבת Private Control Center. כל התצוגה הציבורית מסוננת מפרטים פנימיים.",
            en: "Deepened Maya WhatsApp AI Agent, the Home Assistant bridge, Android Lab / Companion App, RoteMGPT, and the Private Control Center layer. Public presentation is filtered away from internal details.",
        },
        signal: "AI / Automation / Product",
        tools: ["Maya", "Home Assistant", "RoteMGPT", "Android Lab", "OpenAI", "Cloudflare Access", "OpenAI Usage", "product QA"],
    },
    {
        period: "2025",
        title: {
            he: "Project year - authorized labs ו-MVPs",
            en: "Project year - authorized labs and MVPs",
        },
        summary: {
            he: "בניית מעבדות וכלי מוצר: ROTEMZ Web Security Scanner, Zacaim-WiFi-Tool, Maya Local LLM / Cyber Agent, Clash Royale automation, FortySevenMS GUI / Vision Farmer ו-Sale-ים MVP.",
            en: "Built lab and product tools: ROTEMZ Web Security Scanner, Zacaim-WiFi-Tool, Maya Local LLM / Cyber Agent, Clash Royale automation, FortySevenMS GUI / Vision Farmer, and Sale-im MVP.",
        },
        signal: "Lab builds / Research / MVP",
        tools: ["ROTEMZ", "Zacaim-WiFi-Tool", "local LLM", "Raspberry Pi", "Linux", "QA", "mobile UX", "authorized lab notes"],
    },
    {
        period: "2023-Today",
        title: {
            he: "Israel National Digital Agency (NDI) - אבטחת מידע ותפעול תשתיות",
            en: "Israel National Digital Agency (NDI) - security and infrastructure operations",
        },
        summary: {
            he: "תפעול אבטחת מידע ותשתיות בסביבה ממשלתית, כולל עבודה עם מוצרי הגנה, ניטור, זמינות, תקלות תשתית ותיאום בין צוותים. הניסיון מתואר ברמת כלי ותפקיד בלבד.",
            en: "Security and infrastructure operations in a government-scale environment, including defensive products, monitoring, availability, infrastructure issues, and cross-team coordination. Experience is described only at tool and role level.",
        },
        signal: "Security / Infrastructure / Operations",
        tools: ["IPS/IDS", "IronPort", "Blue-AV", "FireGlass", "Nimsoft", "Montier", "VMware", "AWS/GCP basics", "Splunk/SIEM", "Imperva", "F5", "Check Point", "CyberArk", "Dynatrace", "SCOM", "PRTG", "ELK", "MISP", "Radware"],
    },
    {
        period: "2021-2023",
        title: {
            he: "Ministry of Health - ניטור, שליטה ובקרה ותמיכה",
            en: "Ministry of Health - monitoring, control center, and support",
        },
        summary: {
            he: "ניטור ותמיכה במערכות ארגוניות, אבחון מרחוק, משתמשים והרשאות, יישומים, כרטיסים חכמים ואוטומציות Web AD.",
            en: "Monitoring and support for organizational systems, remote diagnosis, users and permissions, applications, smart cards, and Web AD automations.",
        },
        signal: "Monitoring / Support / Service",
        tools: ["Active Directory", "monitoring", "support workflows", "QA discipline"],
    },
    {
        period: "2020-2021",
        title: {
            he: "Israel Police - הכשרת סיור ותפעול שטח",
            en: "Israel Police - patrol training and field operations",
        },
        summary: {
            he: "הכשרת patrol, דיווח, משמעת תפעולית, מודעות שטח וטיפול באירועים תחת נהלים ברורים.",
            en: "Patrol training, reporting, operational discipline, field awareness, and incident handling under clear procedures.",
        },
        signal: "Patrol / Training / Field",
        tools: ["reporting", "field operations", "structured response"],
    },
    {
        period: "2014-2017",
        title: {
            he: "IDF - SAP logistics and inventory",
            en: "IDF - SAP logistics and inventory",
        },
        summary: {
            he: "ניהול מלאי ולוגיסטיקה במערכות ERP/SAP, עבודה מסודרת עם תהליכים, אחריות ודיוק תפעולי.",
            en: "Logistics and inventory work in ERP/SAP systems, with process discipline, ownership, and operational accuracy.",
        },
        signal: "SAP / Logistics / Inventory",
        tools: ["SAP inventory", "ERP", "logistics", "inventory"],
    },
    {
        period: "2013-2017",
        title: {
            he: "Branch manager - food retail",
            en: "Branch manager - food retail",
        },
        summary: {
            he: "ניהול סניף בתחום food retail, עובדים, ספקים, מלאי, שירות לקוחות ועמידה ביעדים יומיומיים.",
            en: "Food retail branch manager responsible for staff, suppliers, inventory, customer service, and daily targets.",
        },
        signal: "Branch manager / Food retail",
        tools: ["team management", "inventory", "service operations"],
    },
];

const SKILL_GROUPS = [
    {
        label: "Cyber",
        title: { he: "אבטחת מידע ותפעול SOC", en: "Security operations and SOC tooling" },
        summary: {
            he: "John Bryce Cyber Defender, 650 academic hours, לצד ניסיון עבודה עם SOC, SIEM ומוצרי אבטחה ארגוניים.",
            en: "John Bryce Cyber Defender, 650 academic hours, alongside hands-on SOC, SIEM, and enterprise security product work.",
        },
        items: ["John Bryce Cyber Defender", "650 academic hours", "Splunk/SIEM", "IPS/IDS", "IronPort", "Blue-AV", "FireGlass", "Imperva", "F5", "Check Point", "CyberArk", "Radware", "MISP", "ELK"],
    },
    {
        label: "QA",
        title: { he: "QA Technion ובדיקות תוכנה", en: "QA Technion and software testing" },
        summary: {
            he: "יסודות QA מהטכניון: SQL, בדיקות web, JavaScript/HTML5, מסמכי STR/STP/STD, בדיקות mobile ועבודה עם Jira.",
            en: "QA foundations from Technion: SQL, web testing, JavaScript/HTML5, STR/STP/STD documents, mobile testing, and Jira.",
        },
        items: ["QA Technion", "SQL", "web testing", "JavaScript", "HTML5", "STR", "STP", "STD", "mobile testing", "Jira", "test documentation"],
    },
    {
        label: "Courses",
        title: { he: "קורסים והסמכות", en: "Courses and certifications" },
        summary: {
            he: "QA Technion, John Bryce Cyber Defender 650 academic hours, CCNA 200-301, Applied Ethical Hacking and Rules of Engagement, TryHackMe Jr Penetration Tester, SAP inventory, MDA medic/ambulance driver.",
            en: "QA Technion, John Bryce Cyber Defender 650 academic hours, CCNA 200-301, Applied Ethical Hacking and Rules of Engagement, TryHackMe Jr Penetration Tester, SAP inventory, MDA medic/ambulance driver.",
        },
        items: ["QA Technion", "John Bryce Cyber Defender", "650 academic hours", "CCNA 200-301", "Applied Ethical Hacking", "Rules of Engagement", "TryHackMe", "Jr Penetration Tester", "SAP inventory", "MDA", "medic", "ambulance driver"],
    },
    {
        label: "Infra",
        title: { he: "תשתיות, ניטור ו-observability", en: "Infrastructure, monitoring, and observability" },
        summary: {
            he: "עבודה עם Dynatrace, SCOM, PRTG, ELK, Nimsoft, Montier, VMware, AWS/GCP basics, תחקור לוגים וזמינות סביב מערכות אמיתיות.",
            en: "Work with Dynatrace, SCOM, PRTG, ELK, Nimsoft, Montier, VMware, AWS/GCP basics, log investigation, and availability around real systems.",
        },
        items: ["Dynatrace", "SCOM", "PRTG", "ELK", "Nimsoft", "Montier", "VMware", "AWS/GCP basics", "logs", "availability", "infrastructure operations"],
    },
    {
        label: "AI",
        title: { he: "AI, אוטומציה ומעבדות", en: "AI, automation, and lab builds" },
        summary: {
            he: "OpenAI, Home Assistant, WhatsApp, local LLM, Raspberry Pi, Android Lab, games ו-OpenAI Usage, יחד עם Cloudflare Worker/Tunnel/Access/D1/R2.",
            en: "OpenAI, Home Assistant, WhatsApp, local LLM, Raspberry Pi, Android Lab, games, and OpenAI Usage, plus Cloudflare Worker/Tunnel/Access/D1/R2.",
        },
        items: ["OpenAI", "Home Assistant", "WhatsApp", "local LLM", "Raspberry Pi", "Android Lab", "games", "OpenAI Usage", "Cloudflare Worker", "Cloudflare Tunnel", "Cloudflare Access", "D1", "R2"],
    },
    {
        label: "Research",
        title: { he: "מחקר אבטחה מורשה", en: "Authorized security research" },
        summary: {
            he: "מחקר במעבדות ובמסגרות מורשות בלבד: כללי התקשרות, תיעוד ראיות, ניסוח דוחות, MISP/ELK וחשיבה הגנתית סביב סיכונים.",
            en: "Research only in labs and authorized scopes: rules of engagement, evidence notes, report writing, MISP/ELK, and defensive risk thinking.",
        },
        items: ["Applied Ethical Hacking", "Rules of Engagement", "TryHackMe Jr Penetration Tester", "authorized lab scope", "evidence notes", "report writing", "MISP", "ELK"],
    },
    {
        label: "Product",
        title: { he: "בניית מוצר ו-UX", en: "Product and UX building" },
        summary: {
            he: "בניית MVPs, דשבורדים, PWA, mobile-first flows, Framer prototypes וממשקים בעברית/אנגלית שמחברים תפעול, QA ואוטומציה.",
            en: "Building MVPs, dashboards, PWAs, mobile-first flows, Framer prototypes, and Hebrew/English interfaces that connect operations, QA, and automation.",
        },
        items: ["MVP", "Product UX", "Framer", "PWA", "mobile-first", "dashboards", "Android Lab", "accessibility", "Hebrew/English UX"],
    },
];

let activeProjectId = "";
let lastPortfolioLanguage = DEFAULT_LANGUAGE;
let projectInteractionsInitialized = false;

function localizedList(values, language) {
    const list = Array.isArray(values) ? values : localized(values, language);

    return (Array.isArray(list) ? list : []).map((value) => localized(value, language)).filter(Boolean);
}

function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;",
    })[character]);
}

function renderCategoryChips(categories, language) {
    const list = createTag("ul", "inline-list project-category-chips");

    (categories || []).forEach((category) => {
        const label = PROJECT_CATEGORY_LABELS[category] || category;
        list.appendChild(createTag("li", "", localized(label, language)));
    });

    return list;
}

function findProjectById(projectId) {
    return PRIMARY_PROJECTS.find((project) => project.id === projectId) || null;
}

function decodeProjectHash() {
    const prefix = "#project-";

    if (!window.location.hash.startsWith(prefix)) return "";

    try {
        return decodeURIComponent(window.location.hash.slice(prefix.length));
    } catch (error) {
        return "";
    }
}

function renderProjects(language) {
    const grid = document.querySelector("[data-project-grid]");
    const detailPanel = document.querySelector("[data-project-detail-panel]");
    const detailPanelId = detailPanel?.id || "project-detail-panel";

    if (!grid) return;

    clearChildren(grid);

    PRIMARY_PROJECTS.forEach((project) => {
        const article = createTag("article", "project-card panel");
        const media = project.media?.[0];
        const figure = createTag("figure", "project-card-media");
        const image = createTag("img", "", null);
        const categoryLabel = PROJECT_CATEGORY_LABELS[project.category] || project.category;
        const selected = activeProjectId === project.id;
        const projectTitle = localized(project.title, language);
        const button = createTag("button", "button button-secondary project-detail-toggle", getText(language, "projectOpenLabel") || localized({ he: "לפתוח פרטים", en: "Open details" }, language));
        const metaParts = [
            localized(project.proofLabel, language),
            project.year,
            localized(project.status, language),
        ].filter(Boolean);
        const source = localized(project.source, language);

        if (media) {
            image.src = media.src;
            image.alt = localized(media.alt, language);
            image.loading = "lazy";
            figure.appendChild(image);
            article.appendChild(figure);
        }

        article.appendChild(createTag("span", "project-label", localized(categoryLabel, language)));
        article.appendChild(createTag("h3", "", projectTitle));
        if (metaParts.length) article.appendChild(createTag("p", "project-meta", metaParts.join(" · ")));
        article.appendChild(createTag("p", "", localized(project.summary, language)));
        if (source) article.appendChild(createTag("p", "project-source", source));
        article.appendChild(renderCategoryChips(project.categories, language));

        button.type = "button";
        button.dataset.projectToggle = project.id;
        button.dataset.projectId = project.id;
        button.setAttribute("aria-controls", detailPanelId);
        button["setAttribute"]("aria-label", `${button["textContent"]}: ${projectTitle}`);
        button.setAttribute("aria-expanded", selected ? "true" : "false");
        article.appendChild(button);

        grid.appendChild(article);
    });
}

function detailListMarkup(items) {
    return (items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function detailTextMarkup(value, language) {
    const text = localized(value, language);

    return text ? `<p>${escapeHtml(text)}</p>` : "";
}

function detailBulletMarkup(values, language) {
    const items = localizedList(values, language);

    return items.length ? `<ul class="inline-list">${detailListMarkup(items)}</ul>` : "";
}

function detailSectionMarkup(title, bodyMarkup, language) {
    if (!bodyMarkup) return "";

    return `
        <section>
            <h4>${escapeHtml(localized(title, language))}</h4>
            ${bodyMarkup}
        </section>
    `;
}

function projectDetailMarkup(project, language = lastPortfolioLanguage) {
    const mediaMarkup = (project.media || []).map((item) => `
        <figure class="project-detail-media-item">
            <img src="${escapeHtml(item.src)}" alt="${escapeHtml(localized(item.alt, language))}" loading="lazy">
        </figure>
    `).join("");
    const outcomes = detailListMarkup(localizedList(project.outcomes, language));
    const technologies = detailListMarkup(project.technologies || project.tools);
    const safety = localized(project.safety, language);
    const builtMarkup = [
        detailTextMarkup(project.built, language),
        detailBulletMarkup(project.works, language),
    ].filter(Boolean).join("");
    const howItWorksMarkup = detailTextMarkup(project.howItWorks, language);
    const proofMarkup = detailTextMarkup(project.proof, language);
    const sourceContextLines = [
        [project.year, localized(project.status, language)].filter(Boolean).join(" / "),
        localized(project.source, language),
        safety,
    ].filter(Boolean);
    const sourceContextMarkup = sourceContextLines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");

    return `
        <div class="project-detail-inner">
            <div class="project-detail-media">${mediaMarkup}</div>
            <div class="project-detail-copy">
                <p class="project-label">${escapeHtml(localized(PROJECT_CATEGORY_LABELS[project.category], language))}</p>
                <h3>${escapeHtml(localized(project.title, language))}</h3>
                <p>${escapeHtml(localized(project.summary, language))}</p>
                <div class="project-detail-lists">
                    ${detailSectionMarkup({ he: "מה נבנה", en: "What was built" }, builtMarkup, language)}
                    ${detailSectionMarkup({ he: "איך זה עובד", en: "How it works" }, howItWorksMarkup, language)}
                    ${detailSectionMarkup({ he: "מה זה מוכיח", en: "What it proves" }, proofMarkup, language)}
                    ${detailSectionMarkup({ he: "טכנולוגיות", en: "Technologies" }, `<ul class="inline-list">${technologies}</ul>`, language)}
                    ${detailSectionMarkup({ he: "מקור והקשר", en: "Source/context" }, sourceContextMarkup, language)}
                    <section>
                        <h4>${escapeHtml(localized({ he: "תוצאות", en: "Outcomes" }, language))}</h4>
                        <ul class="inline-list">${outcomes}</ul>
                    </section>
                </div>
            </div>
        </div>
    `;
}

function openProjectDetail(projectOrId, options = {}) {
    const project = typeof projectOrId === "string" ? findProjectById(projectOrId) : projectOrId;
    const panel = document.querySelector("[data-project-detail-panel]");
    const content = document.querySelector("[data-project-detail-content]");
    const { updateHash = true, focusPanel = true } = options;

    if (!project || !panel || !content) return false;

    content.innerHTML = projectDetailMarkup(project, lastPortfolioLanguage);
    panel.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    panel.dataset.activeProject = project.id;
    panel.classList.add("is-open");
    activeProjectId = project.id;

    document.querySelectorAll("[data-project-toggle]").forEach((control) => {
        const selected = control.dataset.projectToggle === project.id;
        if (selected) {
            control.setAttribute("aria-expanded", "true");
        } else {
            control.setAttribute("aria-expanded", "false");
        }
        control.classList.toggle("is-active", selected);
    });

    if (updateHash) {
        const projectHash = `#project-${project.id}`;
        if (window.location.hash !== projectHash) {
            window.history.replaceState(null, "", projectHash);
        }
    }

    if (focusPanel) panel.focus({ preventScroll: true });

    return true;
}

function closeProjectDetail(options = {}) {
    const panel = document.querySelector("[data-project-detail-panel]");
    const content = document.querySelector("[data-project-detail-content]");
    const previousProjectId = activeProjectId;
    const { updateHash = true, focusReturn = true } = options;

    document.querySelectorAll("[data-project-toggle]").forEach((control) => {
        control.setAttribute("aria-expanded", "false");
        control.classList.remove("is-active");
    });

    activeProjectId = "";

    if (content) clearChildren(content);
    if (panel) {
        panel.hidden = true;
        panel.setAttribute("aria-hidden", "true");
        panel.removeAttribute("data-active-project");
        panel.classList.remove("is-open");
    }

    if (updateHash && window.location.hash.startsWith("#project-")) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    if (focusReturn && previousProjectId) {
        document.querySelector(`[data-project-toggle="${previousProjectId}"]`)?.focus({ preventScroll: true });
    }
}

function renderLabGallery(language) {
    const gallery = document.querySelector("[data-lab-gallery]");

    if (!gallery) return;

    clearChildren(gallery);

    SECONDARY_PROJECTS.forEach((project) => {
        const article = createTag("article", "lab-project panel");
        const figure = createTag("figure", "project-card-media");
        const image = createTag("img", "", null);
        const categoryLabel = PROJECT_CATEGORY_LABELS[project.category] || project.category;

        image.src = project.media;
        image.alt = localized(project.title, language);
        image.loading = "lazy";
        figure.appendChild(image);

        article.appendChild(figure);
        article.appendChild(createTag("span", "project-label", localized(categoryLabel, language)));
        article.appendChild(createTag("h3", "", localized(project.title, language)));
        article.appendChild(createTag("p", "", localized(project.summary, language)));
        article.appendChild(renderCategoryChips(project.tools, language));

        gallery.appendChild(article);
    });
}

function renderTimeline(language) {
    const timeline = document.querySelector("[data-career-timeline]");

    if (!timeline) return;

    clearChildren(timeline);

    CAREER_TIMELINE.forEach((entry) => {
        const article = createTag("article", "", null);
        const time = createTag("time", "", entry.period);

        time.dateTime = entry.period.slice(0, 4);
        article.appendChild(time);
        article.appendChild(createTag("h3", "", localized(entry.title, language)));
        article.appendChild(createTag("p", "", localized(entry.summary, language)));
        article.appendChild(createTag("strong", "", entry.signal));

        timeline.appendChild(article);
    });
}

function renderSkills(language) {
    const grid = document.querySelector("[data-skills-grid]");

    if (!grid) return;

    grid.classList.add("credential-grid");
    clearChildren(grid);

    SKILL_GROUPS.forEach((group) => {
        const article = createTag("article", "", null);

        article.appendChild(createTag("span", "", group.label));
        article.appendChild(createTag("h3", "", localized(group.title, language)));
        article.appendChild(createTag("p", "", localized(group.summary, language)));
        article.appendChild(renderCategoryChips(group.items, language));

        grid.appendChild(article);
    });
}

function openProjectFromHash(language = lastPortfolioLanguage) {
    if (!window.location.hash.startsWith("#project-")) return false;

    lastPortfolioLanguage = normalizeLanguage(language);
    const projectId = decodeProjectHash();

    if (!projectId) return false;

    return openProjectDetail(projectId, { updateHash: false, focusPanel: true });
}

function syncProjectDetailFromHash(language = lastPortfolioLanguage) {
    lastPortfolioLanguage = normalizeLanguage(language);

    if (window.location.hash.startsWith("#project-")) {
        const opened = openProjectFromHash(lastPortfolioLanguage);
        if (!opened) closeProjectDetail({ updateHash: false, focusReturn: false });
        return opened;
    }

    if (activeProjectId) {
        openProjectDetail(activeProjectId, { updateHash: false, focusPanel: false });
    }

    return false;
}

function handleProjectHashChange() {
    if (!syncProjectDetailFromHash(lastPortfolioLanguage) && !window.location.hash.startsWith("#project-")) {
        closeProjectDetail({ updateHash: false, focusReturn: false });
    }
}

function renderPortfolio(language) {
    const normalized = normalizeLanguage(language);

    lastPortfolioLanguage = normalized;
    renderProjects(normalized);
    renderLabGallery(normalized);
    renderTimeline(normalized);
    renderSkills(normalized);
    syncProjectDetailFromHash(normalized);
}

function initProjectInteractions() {
    if (projectInteractionsInitialized) return;

    projectInteractionsInitialized = true;

    document.querySelector("[data-project-grid]")?.addEventListener("click", (event) => {
        const control = event.target.closest("[data-project-toggle]");

        if (!control) return;

        event.preventDefault();
        openProjectDetail(control.dataset.projectToggle);
    });

    document.querySelector("[data-project-detail-close]")?.addEventListener("click", () => {
        closeProjectDetail();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && activeProjectId) closeProjectDetail();
    });

    window.addEventListener("hashchange", handleProjectHashChange);
}

function normalizeLanguage(language) {
    return Object.prototype.hasOwnProperty.call(I18N, language) ? language : DEFAULT_LANGUAGE;
}

function getText(language, key) {
    const normalized = normalizeLanguage(language);
    return I18N[normalized][key] || I18N[DEFAULT_LANGUAGE][key] || I18N.en[key] || "";
}

function applyLanguage(language) {
    const normalized = normalizeLanguage(language);
    const direction = normalized === "he" ? "rtl" : "ltr";

    document.documentElement.lang = normalized;
    document.documentElement.dir = direction;
    document.body.dir = direction;

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = getText(normalized, element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
        element.dataset.i18nAttr.split(",").forEach((item) => {
            const [attribute, key] = item.split(":").map((part) => part.trim());

            if (attribute && key) {
                element.setAttribute(attribute, getText(normalized, key));
            }
        });
    });

    const current = document.querySelector("[data-language-current]");
    const next = document.querySelector("[data-language-next]");

    if (current && next) {
        current.textContent = normalized === "he" ? "עברית" : "English";
        next.textContent = normalized === "he" ? "English" : "עברית";
    }

    const description = document.querySelector("[data-meta-description]");
    const title = document.querySelector("[data-page-title]");
    const ogTitle = document.querySelector("[data-og-title]");
    const ogDescription = document.querySelector("[data-og-description]");
    const twitterTitle = document.querySelector("[data-twitter-title]");
    const twitterDescription = document.querySelector("[data-twitter-description]");
    const pageTitle = getText(normalized, "pageTitle") || getText(normalized, "metaTitle");

    if (description) description.setAttribute("content", getText(normalized, "metaDescription"));
    if (title) title.textContent = pageTitle;
    if (ogTitle) ogTitle.setAttribute("content", pageTitle);
    if (ogDescription) ogDescription.setAttribute("content", getText(normalized, "metaDescription"));
    if (twitterTitle) twitterTitle.setAttribute("content", pageTitle);
    if (twitterDescription) twitterDescription.setAttribute("content", getText(normalized, "metaDescription"));

    renderPortfolio(normalized);

    try {
        window.localStorage.setItem("rotem-about-language", normalized);
    } catch (error) {
        // Local storage can be blocked in privacy-focused contexts.
    }

    window.dispatchEvent(new CustomEvent("site-language-change", {
        detail: { language: normalized },
    }));
}

function getInitialLanguage() {
    try {
        return normalizeLanguage(window.localStorage.getItem("rotem-about-language") || DEFAULT_LANGUAGE);
    } catch (error) {
        return DEFAULT_LANGUAGE;
    }
}

class RotemCharacterScene {
    constructor(canvas) {
        this.canvas = canvas;
        this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        this.clock = new THREE.Clock();
        this.pointer = { x: 0, y: 0 };
        this.scrollProgress = 0;
        this.visible = true;
        this.model = null;
        this.mixer = null;
        this.actions = new Map();
        this.activeAction = null;
        this.characterState = "idle";
        this.frame = 0;
        this.resize = this.resize.bind(this);
        this.animate = this.animate.bind(this);
    }

    init() {
        if (!this.hasWebGL()) {
            document.documentElement.classList.add("no-webgl-character");
            return;
        }

        try {
            this.scene = new THREE.Scene();
            this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
            this.camera.position.set(0, 1.28, 6.1);

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                alpha: true,
                antialias: true,
                powerPreference: "high-performance",
                preserveDrawingBuffer: new URLSearchParams(window.location.search).has("canvas-proof"),
            });
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
            this.renderer.outputColorSpace = THREE.SRGBColorSpace;
            this.renderer.setClearColor(0x000000, 0);
            document.documentElement.classList.add("webgl-character-ready");
        } catch (error) {
            document.documentElement.classList.add("no-webgl-character");
            return;
        }

        this.addLighting();
        this.model = this.createProceduralRabbit();
        this.scene.add(this.model);
        if (new URLSearchParams(window.location.search).has("qa")) {
            window.__rotemCharacterScene = this;
        }
        document.body.dataset.characterState = this.characterState;
        document.body.dataset.characterSide = this.getCharacterDirection().side;
        document.documentElement.classList.add("using-procedural-character");

        this.loadExternalModelFromManifest();
        this.bindEvents();
        this.updateCharacterState();
        this.resize();
        this.renderFrame();

        if (!this.reducedMotion) {
            this.animate();
        }
    }

    hasWebGL() {
        const probe = document.createElement("canvas");
        return Boolean(probe.getContext("webgl") || probe.getContext("experimental-webgl"));
    }

    addLighting() {
        this.scene.add(new THREE.HemisphereLight(0xffffff, 0x151823, 2.7));

        const key = new THREE.DirectionalLight(0xffffff, 3.2);
        key.position.set(3, 5, 5);
        this.scene.add(key);

        const rim = new THREE.DirectionalLight(0x66e3ff, 1.65);
        rim.position.set(-4, 2, 3);
        this.scene.add(rim);

        const warm = new THREE.DirectionalLight(0xff5262, 0.9);
        warm.position.set(4, 0.8, 2.2);
        this.scene.add(warm);
    }

    createProceduralRabbit() {
        const group = new THREE.Group();
        group.name = "rotem-z-procedural-rabbit";

        const fur = new THREE.MeshStandardMaterial({ color: 0x6e727b, roughness: 0.82, metalness: 0.02 });
        const darkFur = new THREE.MeshStandardMaterial({ color: 0x3b3e45, roughness: 0.86 });
        const innerEar = new THREE.MeshStandardMaterial({ color: 0xa5797e, roughness: 0.72 });
        const black = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.55 });
        const white = new THREE.MeshStandardMaterial({ color: 0xf3eee8, roughness: 0.62 });
        const sole = new THREE.MeshStandardMaterial({ color: 0xd9d2cc, roughness: 0.5 });
        const lens = new THREE.MeshPhysicalMaterial({
            color: 0x080808,
            roughness: 0.18,
            transmission: 0.08,
            transparent: true,
            opacity: 0.84,
        });

        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.74, 1.18, 10, 20), black);
        body.position.y = 0.08;
        body.rotation.x = 0.02;
        group.add(body);

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.86, 40, 26), fur);
        head.scale.set(1.08, 0.88, 0.95);
        head.position.y = 1.34;
        group.add(head);

        const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 14), darkFur);
        muzzle.scale.set(1.7, 0.82, 0.72);
        muzzle.position.set(0, 1.2, 0.76);
        group.add(muzzle);

        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 10), new THREE.MeshStandardMaterial({ color: 0xf0a9ad, roughness: 0.45 }));
        nose.scale.set(1.2, 0.7, 0.8);
        nose.position.set(0, 1.26, 0.91);
        group.add(nose);

        const earGeometry = new THREE.CapsuleGeometry(0.18, 1.1, 10, 20);
        const leftEar = new THREE.Mesh(earGeometry, fur);
        leftEar.position.set(-0.36, 2.22, -0.03);
        leftEar.rotation.z = -0.12;
        group.add(leftEar);

        const rightEar = leftEar.clone();
        rightEar.position.x = 0.36;
        rightEar.rotation.z = 0.12;
        group.add(rightEar);

        const innerGeometry = new THREE.CapsuleGeometry(0.075, 0.82, 8, 14);
        const innerLeft = new THREE.Mesh(innerGeometry, innerEar);
        innerLeft.position.set(-0.36, 2.24, 0.055);
        innerLeft.rotation.z = -0.12;
        group.add(innerLeft);

        const innerRight = innerLeft.clone();
        innerRight.position.x = 0.36;
        innerRight.rotation.z = 0.12;
        group.add(innerRight);

        const frame = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.08, 0.055), black);
        frame.position.set(0, 1.42, 0.83);
        group.add(frame);

        [-0.32, 0.32].forEach((x) => {
            const glass = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.25, 0.05), lens);
            glass.position.set(x, 1.42, 0.86);
            glass.rotation.z = x < 0 ? 0.06 : -0.06;
            group.add(glass);
        });

        const pants = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.72, 0.72), white);
        pants.position.y = -0.58;
        group.add(pants);

        const legs = [];

        [-0.33, 0.33].forEach((x, index) => {
            const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.72, 8, 12), darkFur);
            leg.name = index === 0 ? "left-leg" : "right-leg";
            leg.position.set(x, -1.15, 0.02);
            group.add(leg);
            legs.push(leg);

            const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.66), sole);
            shoe.position.set(x, -1.58, 0.18);
            shoe.rotation.x = -0.04;
            group.add(shoe);
        });

        const armGeometry = new THREE.CapsuleGeometry(0.11, 0.86, 8, 12);
        const pointingArm = new THREE.Mesh(armGeometry, fur);
        pointingArm.name = "pointing-arm";
        pointingArm.position.set(-0.72, 0.1, 0.08);
        pointingArm.rotation.z = 0.18;
        pointingArm.rotation.y = -0.08;
        group.add(pointingArm);

        const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.34, 8, 10), fur);
        finger.name = "pointing-finger";
        finger.position.set(-0.95, 0.06, 0.2);
        finger.rotation.z = 0.28;
        finger.scale.setScalar(0.52);
        group.add(finger);

        const relaxedArm = new THREE.Mesh(armGeometry, fur);
        relaxedArm.name = "relaxed-arm";
        relaxedArm.position.set(0.78, 0.22, 0.08);
        relaxedArm.rotation.z = -0.35;
        group.add(relaxedArm);

        group.position.y = -0.74;
        group.userData.baseY = -0.74;
        group.userData.parts = {
            finger,
            head,
            leftEar,
            leftLeg: legs[0],
            pointingArm,
            relaxedArm,
            rightEar,
            rightLeg: legs[1],
        };
        group.userData.motionTargets = {
            finger: {
                position: new THREE.Vector3(-1.37, 0.66, 0.34),
                rotation: new THREE.Euler(0, 0, Math.PI / 2),
                scale: 1,
            },
            pointingArm: {
                position: new THREE.Vector3(-0.88, 0.48, 0.2),
                rotation: new THREE.Euler(0, -0.3, Math.PI / 2.25),
            },
        };

        Object.values(group.userData.parts).forEach((part) => {
            if (!part) return;
            part.userData.restPosition = part.position.clone();
            part.userData.restRotation = part.rotation.clone();
            part.userData.restScale = part.scale.clone();
        });

        return group;
    }

    prepareExternalModel(model) {
        model.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        model.userData.unscaledHeight = Math.max(size.x, size.y, size.z, 0.001);
        model.userData.unscaledMinY = box.min.y;
        model.userData.unscaledMaxY = box.max.y;

        model.traverse((object) => {
            if (!object.isMesh) return;
            object.frustumCulled = false;

            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.filter(Boolean).forEach((material) => {
                material.side = THREE.DoubleSide;
                material.needsUpdate = true;
            });
        });

        this.cacheRiggedCharacterBones(model);
    }

    cacheRiggedCharacterBones(model) {
        const bones = {};

        Object.entries(RIGGED_BONE_NAMES).forEach(([key, name]) => {
            bones[key] = model.getObjectByName(name) || null;
        });

        const riggedBoneList = Object.values(bones).filter(Boolean);
        riggedBoneList.forEach((bone) => {
            bone.userData.restQuaternion = bone.quaternion.clone();
            bone.userData.restPosition = bone.position.clone();
        });

        model.userData.rigBones = bones;
        model.userData.riggedBoneList = riggedBoneList;
        model.userData.isRiggedCharacter = riggedBoneList.length > 0;
    }

    loadExternalModelFromManifest() {
        fetch(CHARACTER_MANIFEST_URL, { cache: "no-store" })
            .then((response) => (response.ok ? response.json() : null))
            .then((manifest) => {
                if (!manifest?.ready) return;
                this.loadExternalModel(manifest.model || CHARACTER_GLB_URL);
            })
            .catch(() => {
                document.documentElement.classList.add("using-procedural-character");
            });
    }

    loadExternalModel(url) {
        const loader = new GLTFLoader();

        loader.load(
            url,
            (gltf) => {
                const incoming = gltf.scene;
                incoming.name = EXTERNAL_CHARACTER_MODEL_NAME;
                incoming.position.set(0, -0.8, 0);
                incoming.userData.baseY = -0.8;
                this.prepareExternalModel(incoming);

                this.scene.remove(this.model);
                this.model = incoming;
                this.scene.add(this.model);
                this.applyResponsiveFraming();
                this.renderFrame();
                document.documentElement.classList.remove("using-procedural-character");

                if (gltf.animations.length && !this.reducedMotion) {
                    this.mixer = new THREE.AnimationMixer(this.model);
                    this.configureAnimationActions(gltf.animations);
                    this.playCharacterAnimation(this.characterState, 0);
                }
            },
            undefined,
            () => {
                document.documentElement.classList.add("using-procedural-character");
            }
        );
    }

    configureAnimationActions(clips) {
        this.actions.clear();

        clips.forEach((clip) => {
            const clipName = clip.name.toLowerCase();
            const state = Object.entries(CHARACTER_ANIMATION_NAMES).find(([, names]) =>
                names.some((name) => clipName.includes(name.toLowerCase()))
            )?.[0];

            if (!state || this.actions.has(state)) return;

            const action = this.mixer.clipAction(clip);
            action.enabled = true;
            action.clampWhenFinished = false;
            action.timeScale = state === "walk" ? 0.92 : 1;
            this.actions.set(state, action);
        });
    }

    playCharacterAnimation(state, fadeDuration = 0.35) {
        const directedState = state === "point"
            ? this.getCharacterDirection().pointDirection === -1
                ? "pointLeft"
                : "pointRight"
            : state;
        const action = this.actions.get(directedState) || this.actions.get(state) || this.actions.get("idle");

        if (!action || action === this.activeAction) return;

        action.reset().fadeIn(fadeDuration).play();

        if (this.activeAction) {
            this.activeAction.fadeOut(fadeDuration);
        }

        this.activeAction = action;
    }

    setCharacterState(nextState) {
        if (this.characterState === nextState) return;

        this.characterState = nextState;
        document.body.dataset.characterState = nextState;
        document.body.dataset.characterSide = this.getCharacterDirection().side;
        document.body.classList.toggle("is-character-walking", nextState === "walk");
        document.body.classList.toggle("is-character-pointing", nextState === "point");

        if (!this.reducedMotion) {
            this.playCharacterAnimation(nextState);
        }
    }

    updateCharacterState() {
        document.body.dataset.characterSide = this.getCharacterDirection().side;

        const isDocked = this.scrollProgress > CHARACTER_STATE_THRESHOLDS.dock;
        const nextState = this.scrollProgress <= CHARACTER_STATE_THRESHOLDS.dock
            ? "idle"
            : this.scrollProgress < CHARACTER_STATE_THRESHOLDS.walkEnd
                ? "walk"
                : "point";

        document.body.classList.toggle("is-character-docked", isDocked);
        if (nextState === this.characterState && nextState === "point" && !this.reducedMotion) {
            this.playCharacterAnimation(nextState);
        }
        this.setCharacterState(nextState);
    }

    getCharacterDirection() {
        const isRtl = document.documentElement.dir === "rtl";
        const walkDirection = document.documentElement.dir === "rtl" ? -1 : 1;
        const pointDirection = document.documentElement.dir === "rtl" ? 1 : -1;

        return {
            side: isRtl ? "left" : "right",
            walkDirection,
            pointDirection,
        };
    }

    restoreProceduralPart(part) {
        if (!part?.userData?.restPosition || !part.userData.restRotation || !part.userData.restScale) return;

        part.position.copy(part.userData.restPosition);
        part.rotation.copy(part.userData.restRotation);
        part.scale.copy(part.userData.restScale);
    }

    applyProceduralCharacterMotion(elapsed, walkProgress, pointProgress, pointDirection = -1) {
        const parts = this.model?.userData?.parts;
        const targets = this.model?.userData?.motionTargets;

        if (!parts || !targets) return;

        const step = Math.sin(elapsed * 10.5) * walkProgress * (1 - pointProgress * 0.72);
        const shoulder = Math.sin(elapsed * 5.2) * walkProgress * 0.04;
        const earDrift = Math.sin(elapsed * 1.4) * 0.025;

        Object.values(parts).forEach((part) => this.restoreProceduralPart(part));

        if (parts.leftLeg) parts.leftLeg.rotation.x += step * 0.34;
        if (parts.rightLeg) parts.rightLeg.rotation.x -= step * 0.34;
        if (parts.relaxedArm) parts.relaxedArm.rotation.z += step * 0.18 + shoulder;
        if (parts.leftEar) parts.leftEar.rotation.z += earDrift;
        if (parts.rightEar) parts.rightEar.rotation.z -= earDrift;
        if (parts.head) parts.head.rotation.y += this.pointer.x * 0.025;

        if (parts.pointingArm && targets.pointingArm) {
            const pointingArmTargetPosition = targets.pointingArm.position.clone();
            pointingArmTargetPosition.x = Math.abs(pointingArmTargetPosition.x) * pointDirection;
            const pointingArmTargetRotationZ = Math.abs(targets.pointingArm.rotation.z) * -pointDirection;

            parts.pointingArm.position.lerpVectors(
                parts.pointingArm.userData.restPosition,
                pointingArmTargetPosition,
                pointProgress
            );
            parts.pointingArm.rotation.x = THREE.MathUtils.lerp(
                parts.pointingArm.userData.restRotation.x,
                targets.pointingArm.rotation.x,
                pointProgress
            );
            parts.pointingArm.rotation.y = THREE.MathUtils.lerp(
                parts.pointingArm.userData.restRotation.y,
                targets.pointingArm.rotation.y,
                pointProgress
            );
            parts.pointingArm.rotation.z = THREE.MathUtils.lerp(
                parts.pointingArm.userData.restRotation.z,
                pointingArmTargetRotationZ,
                pointProgress
            );
        }

        if (parts.finger && targets.finger) {
            const fingerTargetPosition = targets.finger.position.clone();
            fingerTargetPosition.x = Math.abs(fingerTargetPosition.x) * pointDirection;
            const fingerTargetRotationZ = Math.abs(targets.finger.rotation.z) * -pointDirection;

            parts.finger.position.lerpVectors(parts.finger.userData.restPosition, fingerTargetPosition, pointProgress);
            parts.finger.rotation.x = THREE.MathUtils.lerp(parts.finger.userData.restRotation.x, targets.finger.rotation.x, pointProgress);
            parts.finger.rotation.y = THREE.MathUtils.lerp(parts.finger.userData.restRotation.y, targets.finger.rotation.y, pointProgress);
            parts.finger.rotation.z = THREE.MathUtils.lerp(parts.finger.userData.restRotation.z, fingerTargetRotationZ, pointProgress);
            parts.finger.scale.setScalar(THREE.MathUtils.lerp(parts.finger.userData.restScale.x, targets.finger.scale, pointProgress));
        }
    }

    resetRiggedCharacterBones() {
        this.model?.userData?.riggedBoneList?.forEach((bone) => {
            if (bone.userData.restQuaternion) bone.quaternion.copy(bone.userData.restQuaternion);
            if (bone.userData.restPosition) bone.position.copy(bone.userData.restPosition);
        });
    }

    rotateRiggedBone(bone, x, y, z, influence = 1, compose = "local") {
        if (!bone?.userData?.restQuaternion) return;

        const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(
            x * influence,
            y * influence,
            z * influence,
            "XYZ"
        ));

        bone.quaternion.copy(bone.userData.restQuaternion);
        if (compose === "skeleton") {
            bone.quaternion.premultiply(rotation);
            return;
        }

        bone.quaternion.multiply(rotation);
    }

    applyRiggedCharacterMotion(elapsed, walkProgress, pointProgress, pointDirection = -1) {
        const bones = this.model?.userData?.rigBones;
        if (!bones) return;

        this.resetRiggedCharacterBones();

        const stepPulse = Math.sin(elapsed * 9.8) * walkProgress * (1 - pointProgress * 0.75);
        const idlePulse = Math.sin(elapsed * 1.7);
        const useLeftSide = pointDirection > 0;
        const pointSide = useLeftSide ? 1 : -1;

        bones.pointHand = useLeftSide ? bones.leftHand : bones.rightHand;
        bones.pointForeArm = useLeftSide ? bones.leftForeArm : bones.rightForeArm;
        bones.pointArm = useLeftSide ? bones.leftArm : bones.rightArm;

        this.rotateRiggedBone(bones.head, 0.02 * idlePulse - this.pointer.y * 0.025, this.pointer.x * 0.04 + pointDirection * pointProgress * 0.18, 0, 1);
        this.rotateRiggedBone(bones.neck, 0, pointDirection * pointProgress * 0.08, 0, 1);
        this.rotateRiggedBone(bones.spine2, 0.02 * idlePulse, pointDirection * pointProgress * 0.08, -pointDirection * walkProgress * 0.05, 1);
        this.rotateRiggedBone(bones.spine1, 0, 0, -pointDirection * walkProgress * 0.035, 1);

        this.rotateRiggedBone(bones.leftArm, stepPulse * 0.28, 0, -0.08 + stepPulse * 0.12, 1 - pointProgress);
        this.rotateRiggedBone(bones.rightArm, -stepPulse * 0.28, 0, 0.08 - stepPulse * 0.12, 1 - pointProgress);
        this.rotateRiggedBone(bones.leftForeArm, stepPulse * 0.12, 0, -0.04, 1 - pointProgress);
        this.rotateRiggedBone(bones.rightForeArm, -stepPulse * 0.12, 0, 0.04, 1 - pointProgress);
        this.rotateRiggedBone(bones.leftLeg, -stepPulse * 0.22, 0, 0, 1);
        this.rotateRiggedBone(bones.rightLeg, stepPulse * 0.22, 0, 0, 1);

        this.rotateRiggedBone(bones.pointArm, 0.05, 0.05 * pointSide, 1.45 * pointSide, pointProgress, "skeleton");
        this.rotateRiggedBone(bones.pointForeArm, 0.05, 0.05 * pointSide, 1.02 * pointSide, pointProgress, "skeleton");
        this.rotateRiggedBone(bones.pointHand, 0, 0.08 * pointSide, 0.28 * pointSide, pointProgress, "skeleton");
    }

    bindEvents() {
        window.addEventListener("resize", this.resize, { passive: true });

        window.addEventListener("pointermove", (event) => {
            if (this.reducedMotion) return;

            this.pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
            this.pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });

        window.addEventListener("scroll", () => {
            const max = Math.max(1, window.innerHeight * 0.85);
            this.scrollProgress = Math.min(1, window.scrollY / max);
            this.updateCharacterState();
        }, { passive: true });

        window.addEventListener("site-language-change", () => {
            this.updateCharacterState();
            this.applyResponsiveFraming();
            if (this.reducedMotion) this.renderFrame();
        });

        if (typeof window.IntersectionObserver !== "function") {
            this.visible = true;
            return;
        }

        const observer = new IntersectionObserver(([entry]) => {
            this.visible = entry.isIntersecting;
            if (this.visible && this.reducedMotion) this.renderFrame();
            if (this.visible && !this.frame && !this.reducedMotion) this.animate();
        }, { threshold: 0.01 });
        observer.observe(this.canvas);
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.applyResponsiveFraming();
        if (this.reducedMotion) this.renderFrame();
    }

    applyResponsiveFraming() {
        const isMobile = window.matchMedia("(max-width: 720px)").matches;
        const isTablet = window.matchMedia("(max-width: 1180px)").matches;
        const isExternalModel = this.model?.name === EXTERNAL_CHARACTER_MODEL_NAME;
        const externalTargetHeight = isMobile ? 2.12 : isTablet ? 2.9 : 3.72;
        const scale = isExternalModel
            ? externalTargetHeight / Math.max(this.model.userData.unscaledHeight || 1, 0.001)
            : (isMobile ? 0.52 : isTablet ? 0.62 : 0.68);
        const mirror = isExternalModel && document.documentElement.dir === "rtl" ? -1 : 1;

        this.camera.position.z = isMobile ? 8.1 : 7.8;
        this.camera.position.y = isMobile ? 1.38 : 1.22;
        this.camera.lookAt(0, isMobile ? 0.35 : 0.2, 0);

        if (this.model) {
            this.model.scale.set(scale * mirror, scale, scale);

            if (isExternalModel) {
                const topY = isMobile ? 0.95 : isTablet ? 0.38 : 0.08;
                this.model.userData.baseY = topY - (this.model.userData.unscaledMaxY || 0) * scale;
                this.model.position.y = this.model.userData.baseY;
            }

        }
    }

    getExternalScrollTransform(elapsed, walkProgress, pointProgress, walkDirection, pointDirection) {
        const isMobile = window.matchMedia("(max-width: 720px)").matches;
        const travel = isMobile ? EXTERNAL_SCROLL_MOTION.mobileTravel : EXTERNAL_SCROLL_MOTION.desktopTravel;
        const sideBias = isMobile ? EXTERNAL_SCROLL_MOTION.mobileSideBias : EXTERNAL_SCROLL_MOTION.desktopSideBias;
        const stepPulse = Math.sin(elapsed * 11.5) * walkProgress * (1 - pointProgress * 0.55);
        const stepLift = Math.max(0, stepPulse) * EXTERNAL_SCROLL_MOTION.bounce;

        return {
            x: walkDirection * (-sideBias + walkProgress * travel - pointProgress * EXTERNAL_SCROLL_MOTION.pointSettle),
            yOffset: stepLift,
            rotationX: Math.sin(elapsed * 6.2) * walkProgress * (1 - pointProgress) * 0.026,
            rotationY: pointDirection * (pointProgress * EXTERNAL_SCROLL_MOTION.yaw + walkProgress * 0.08),
            rotationZ: -walkDirection * walkProgress * (1 - pointProgress * 0.35) * EXTERNAL_SCROLL_MOTION.lean,
        };
    }

    renderFrame() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    animate() {
        if (this.reducedMotion) {
            this.renderFrame();
            this.frame = 0;
            return;
        }

        if (!this.visible) {
            this.frame = 0;
            return;
        }

        this.frame = window.requestAnimationFrame(this.animate);
        const elapsed = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        if (this.mixer && !this.reducedMotion) this.mixer.update(delta);

        if (this.model) {
            const idle = this.reducedMotion ? 0 : Math.sin(elapsed * 1.8) * 0.035;
            const walkProgress = THREE.MathUtils.smoothstep(this.scrollProgress, CHARACTER_STATE_THRESHOLDS.dock, CHARACTER_STATE_THRESHOLDS.walkEnd);
            const pointProgress = THREE.MathUtils.smoothstep(this.scrollProgress, CHARACTER_STATE_THRESHOLDS.walkEnd, 0.52);
            const { walkDirection, pointDirection } = this.getCharacterDirection();
            const isExternalModel = this.model.name === EXTERNAL_CHARACTER_MODEL_NAME;
            const externalMotion = isExternalModel
                ? this.getExternalScrollTransform(elapsed, walkProgress, pointProgress, walkDirection, pointDirection)
                : null;
            const motionDistance = window.matchMedia("(max-width: 720px)").matches ? 0.18 : 0.34;
            const scrollX = externalMotion?.x ?? walkDirection * walkProgress * motionDistance;
            const baseY = typeof this.model.userData.baseY === "number" ? this.model.userData.baseY : -0.74;
            const targetRotationY = isExternalModel
                ? this.pointer.x * 0.035 + externalMotion.rotationY
                : this.pointer.x * 0.07 + pointDirection * pointProgress * 0.32;
            this.model.rotation.y = THREE.MathUtils.lerp(this.model.rotation.y, targetRotationY, 0.08);
            this.model.rotation.x = THREE.MathUtils.lerp(this.model.rotation.x, -this.pointer.y * 0.055 + (externalMotion?.rotationX ?? 0), 0.06);
            this.model.rotation.z = THREE.MathUtils.lerp(this.model.rotation.z, externalMotion?.rotationZ ?? 0, 0.08);
            this.model.position.y = baseY + idle + (externalMotion?.yOffset ?? Math.sin(elapsed * 10.5) * walkProgress * (1 - pointProgress) * 0.018);
            this.model.position.x = THREE.MathUtils.lerp(this.model.position.x, scrollX, 0.06);
            if (isExternalModel) this.applyRiggedCharacterMotion(elapsed, walkProgress, pointProgress, pointDirection);
            this.applyProceduralCharacterMotion(elapsed, walkProgress, pointProgress, pointDirection);
        }

        this.renderFrame();
    }
}

function initReveals() {
    const revealItems = document.querySelectorAll("[data-reveal]");
    document.documentElement.classList.add("reveal-ready");

    if (typeof window.IntersectionObserver !== "function") {
        revealItems.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.16 });

    revealItems.forEach((item) => observer.observe(item));
}

function initLanguageToggle() {
    let currentLanguage = getInitialLanguage();
    applyLanguage(currentLanguage);

    document.querySelector("[data-language-toggle]")?.addEventListener("click", () => {
        currentLanguage = currentLanguage === "he" ? "en" : "he";
        applyLanguage(currentLanguage);
    });
}

async function initCharacter() {
    const characterCanvas = document.querySelector("[data-three-character-stage]");

    if (!characterCanvas) return;

    try {
        const [threeModule, loaderModule] = await Promise.all([
            import("three"),
            import("three/addons/loaders/GLTFLoader.js"),
        ]);

        THREE = threeModule;
        GLTFLoader = loaderModule.GLTFLoader;

        const characterScene = new RotemCharacterScene(characterCanvas);
        characterScene.init();
    } catch (error) {
        document.documentElement.classList.add("no-webgl-character");
    }
}

document.documentElement.classList.remove("no-js");
initProjectInteractions();
initLanguageToggle();
initReveals();
initCharacter();
