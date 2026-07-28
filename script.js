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

const I18N = {
    en: {
        skipLink: "Skip to content",
        primaryNavLabel: "Primary navigation",
        navProfile: "Profile",
        navLab: "AI Lab",
        navSystems: "Systems",
        navExperience: "Experience",
        navContact: "Contact",
        languageToggleLabel: "Switch to Hebrew",
        topbarContact: "Email",
        heroTitle: "Rotem Zacaim",
        heroLede: "Security operations, AI automation, and production-minded systems for teams that need clarity under pressure.",
        heroActionsLabel: "Primary actions",
        heroPrimary: "Start a conversation",
        heroSecondary: "View systems",
        heroFocusLabel: "Focus areas",
        heroFocus: "Detect. Automate. Operate.",
        previewLabel: "Profile preview",
        previewTitle: "I turn noisy operations into reliable response systems.",
        previewCopy: "From SOC workflows to AI-powered automations, I design and ship tools that reduce noise, speed up response, and keep control visible.",
        profileTitle: "Security operator. Builder. Owner.",
        profileIntro: "I work where alerts, infrastructure, code, and people meet.",
        profileCopyOne: "My strength is turning messy operational reality into systems a team can actually use: clear triage, useful context, repeatable response, and automation that earns trust.",
        profileCopyTwo: "I care about the handoff from first signal to final action. Tools are useful only when they reduce noise, explain decisions, and keep ownership visible.",
        operatorRailLabel: "Operator principles",
        operateTitle: "Investigate",
        operateCopy: "Follow the signal until the team knows what matters and why.",
        automateTitle: "Automate",
        automateCopy: "Turn repeated work into workflows with context, guardrails, and clean handoffs.",
        ownTitle: "Own",
        ownCopy: "Stay close to the result: what changed, what improved, and what still needs attention.",
        labTitle: "AI Lab",
        labIntro: "A focused lab for building AI workflows that support real operators instead of becoming another dashboard to watch.",
        projectLabel: "Project",
        mayaCopy: "Maya is one case study from my AI lab: a Hebrew-first personal agent that connects conversation to useful tools like memory, calendar, voice, images, monitoring, Cloudflare, and local models.",
        labSignalOne: "Research assistance",
        labOutcomeOne: "Faster understanding",
        labSignalTwo: "Context enrichment",
        labOutcomeTwo: "Better decisions",
        labSignalThree: "Response support",
        labOutcomeThree: "More operator leverage",
        systemsTitle: "Systems map",
        systemsIntro: "The way I build: detect the signal, enrich the context, automate the repeatable part, and deploy carefully.",
        systemsMapLabel: "Systems map",
        systemSocTitle: "SOC workflow",
        systemSocCopy: "Structure triage, investigation, and response so every alert has a path.",
        systemAlertTitle: "Alert enrichment",
        systemAlertCopy: "Add useful context so the team can separate noise from work that matters.",
        systemAiTitle: "AI automations",
        systemAiCopy: "Use AI where it helps operators move faster without hiding the reasoning.",
        systemDeployTitle: "Deployment discipline",
        systemDeployCopy: "Ship with checks, rollback thinking, monitoring, and clear ownership.",
        deepTitle: "Deep dive",
        deepIntro: "Every project starts with the same question: what needs to become calmer, clearer, and easier to operate?",
        workflowUnderstandTitle: "Understand",
        workflowUnderstandCopy: "Find the real workflow, the friction, the constraints, and the owner.",
        workflowArchitectTitle: "Architect",
        workflowArchitectCopy: "Map structure, data flow, permissions, failure modes, and handoffs.",
        workflowBuildTitle: "Build",
        workflowBuildCopy: "Build the smallest useful system with clean code and tested integrations.",
        workflowDeployTitle: "Deploy",
        workflowDeployCopy: "Release with environments, checks, monitoring, and measured rollout.",
        workflowEvolveTitle: "Evolve",
        workflowEvolveCopy: "Measure the result, remove friction, and make the system sharper.",
        experienceTitle: "Experience",
        experienceIntro: "Hands-on building across automation, backend systems, AI workflows, and security-minded delivery.",
        roleOneTitle: "Freelance Automation & AI Engineer",
        roleOneCopy: "Building automations, AI agents, internal tools, and workflow systems for real operational needs.",
        roleTwoTitle: "Lead Developer & Automation Engineer",
        roleTwoCopy: "Led end-to-end delivery of web platforms, backend services, integrations, and deployment flows.",
        roleThreeTitle: "Full Stack Developer",
        roleThreeCopy: "Delivered product features, APIs, integrations, and maintainable application logic.",
        roleFourTitle: "Software Developer",
        roleFourCopy: "Built and maintained production systems, internal tools, and the everyday glue teams rely on.",
        certTitle: "Certifications",
        certIntro: "Continuous learning, practical execution, and tools that survive real use.",
        contactTitle: "Bring me the messy workflow",
        contactCopy: "I like projects where the goal is clear: reduce noise, connect tools, automate responsibly, and give people a system they can trust.",
        contactEmail: "Email Rotem",
        mobileDockLabel: "Quick actions",
        mobileStart: "Start",
        mobileSystems: "Systems",
        metaDescription: "Rotem Zacaim turns security operations, AI automation, and messy workflows into reliable response systems.",
        pageTitle: "Rotem Zacaim | Security Operations, AI Automation & Systems",
    },
    he: {
        skipLink: "דלג לתוכן",
        primaryNavLabel: "ניווט ראשי",
        navProfile: "פרופיל",
        navLab: "מעבדת AI",
        navSystems: "מערכות",
        navExperience: "ניסיון",
        navContact: "קשר",
        languageToggleLabel: "Switch to English",
        topbarContact: "אימייל",
        heroTitle: "Rotem Zacaim",
        heroLede: "Security operations, אוטומציות AI ומערכות production-minded לצוותים שצריכים בהירות תחת לחץ.",
        heroActionsLabel: "פעולות ראשיות",
        heroPrimary: "נתחיל שיחה",
        heroSecondary: "לראות מערכות",
        heroFocusLabel: "מוקדי עבודה",
        heroFocus: "Detect. Automate. Operate.",
        previewLabel: "תצוגת פרופיל",
        previewTitle: "אני הופך רעש תפעולי למערכות תגובה אמינות.",
        previewCopy: "מ־SOC workflows ועד אוטומציות AI, אני מתכנן ובונה כלים שמורידים רעש, מקצרים תגובה ושומרים שליטה גלויה.",
        profileTitle: "Security operator. Builder. Owner.",
        profileIntro: "אני עובד בדיוק במקום שבו התרעות, תשתיות, קוד ואנשים נפגשים.",
        profileCopyOne: "החוזקה שלי היא להפוך מציאות תפעולית מבולגנת למערכות שצוות באמת יכול להשתמש בהן: triage ברור, קונטקסט שימושי, תגובה שחוזרת על עצמה ואוטומציה שאפשר לסמוך עליה.",
        profileCopyTwo: "אני מסתכל על כל המעבר מהסיגנל הראשון לפעולה האחרונה. כלי טוב הוא כלי שמוריד רעש, מסביר החלטות ומשאיר אחריות ברורה.",
        operatorRailLabel: "עקרונות עבודה",
        operateTitle: "Investigate",
        operateCopy: "לעקוב אחרי הסיגנל עד שהצוות יודע מה חשוב ולמה.",
        automateTitle: "Automate",
        automateCopy: "להפוך עבודה חוזרת ל־workflows עם קונטקסט, guardrails ו־handoffs נקיים.",
        ownTitle: "Own",
        ownCopy: "להישאר קרוב לתוצאה: מה השתנה, מה השתפר ומה עדיין דורש תשומת לב.",
        labTitle: "AI Lab",
        labIntro: "מעבדה ממוקדת לבניית workflows של AI שתומכים באנשים שמפעילים מערכות, לא בעוד דשבורד שצריך להשגיח עליו.",
        projectLabel: "Project",
        mayaCopy: "Maya היא case study אחד מתוך מעבדת ה־AI שלי: סוכן אישי בעברית שמחבר שיחה לכלים שימושיים כמו זיכרון, יומן, קול, תמונות, ניטור, Cloudflare ומודלים מקומיים.",
        labSignalOne: "סיוע במחקר",
        labOutcomeOne: "הבנה מהירה יותר",
        labSignalTwo: "העשרת קונטקסט",
        labOutcomeTwo: "החלטות טובות יותר",
        labSignalThree: "תמיכה בתגובה",
        labOutcomeThree: "יותר מינוף לאופרייטור",
        systemsTitle: "Systems map",
        systemsIntro: "כך אני בונה: מזהה את הסיגנל, מעשיר את הקונטקסט, מאוטמט את החלק שחוזר על עצמו ומשחרר בזהירות.",
        systemsMapLabel: "מפת מערכות",
        systemSocTitle: "SOC workflow",
        systemSocCopy: "לבנות triage, חקירה ותגובה כך שלכל התרעה יש מסלול ברור.",
        systemAlertTitle: "Alert enrichment",
        systemAlertCopy: "להוסיף קונטקסט שימושי כדי שהצוות יפריד בין רעש לבין עבודה שבאמת חשובה.",
        systemAiTitle: "AI automations",
        systemAiCopy: "להשתמש ב־AI איפה שהוא עוזר לאנשים לזוז מהר יותר בלי להסתיר את ההיגיון.",
        systemDeployTitle: "Deployment discipline",
        systemDeployCopy: "לשחרר עם בדיקות, מחשבת rollback, ניטור ובעלות ברורה.",
        deepTitle: "Deep dive",
        deepIntro: "כל פרויקט מתחיל באותה שאלה: מה צריך להפוך רגוע יותר, ברור יותר וקל יותר לתפעול?",
        workflowUnderstandTitle: "Understand",
        workflowUnderstandCopy: "למצוא את ה־workflow האמיתי, החיכוך, המגבלות והבעלים.",
        workflowArchitectTitle: "Architect",
        workflowArchitectCopy: "למפות מבנה, data flow, הרשאות, נקודות כשל ו־handoffs.",
        workflowBuildTitle: "Build",
        workflowBuildCopy: "לבנות את המערכת השימושית הכי קטנה עם קוד נקי ואינטגרציות בדוקות.",
        workflowDeployTitle: "Deploy",
        workflowDeployCopy: "לשחרר עם environments, בדיקות, ניטור והשקה מדודה.",
        workflowEvolveTitle: "Evolve",
        workflowEvolveCopy: "למדוד את התוצאה, להוריד חיכוך ולחדד את המערכת.",
        experienceTitle: "Experience",
        experienceIntro: "בנייה מעשית של אוטומציה, מערכות backend, workflows של AI ו־delivery עם חשיבה אבטחתית.",
        roleOneTitle: "Freelance Automation & AI Engineer",
        roleOneCopy: "בניית אוטומציות, AI agents, כלים פנימיים ומערכות workflow לצרכים תפעוליים אמיתיים.",
        roleTwoTitle: "Lead Developer & Automation Engineer",
        roleTwoCopy: "הובלת delivery מקצה לקצה של פלטפורמות web, שירותי backend, אינטגרציות ותהליכי deployment.",
        roleThreeTitle: "Full Stack Developer",
        roleThreeCopy: "פיתוח פיצ'רים, APIs, אינטגרציות ולוגיקה אפליקטיבית שאפשר לתחזק.",
        roleFourTitle: "Software Developer",
        roleFourCopy: "בנייה ותחזוקה של מערכות production, כלים פנימיים והחיבורים היומיומיים שצוותים נשענים עליהם.",
        certTitle: "Certifications",
        certIntro: "למידה מתמשכת, ביצוע מעשי וכלים ששורדים שימוש אמיתי.",
        contactTitle: "תביאו לי את ה־workflow המבולגן",
        contactCopy: "אני אוהב פרויקטים שבהם המטרה ברורה: להוריד רעש, לחבר כלים, לאוטמט באחריות ולתת לאנשים מערכת שאפשר לסמוך עליה.",
        contactEmail: "אימייל לרותם",
        mobileDockLabel: "פעולות מהירות",
        mobileStart: "התחלה",
        mobileSystems: "מערכות",
        metaDescription: "רותם זכאים הופך Security Operations, אוטומציות AI ו־workflows מבולגנים למערכות תגובה אמינות.",
        pageTitle: "רותם זכאים | אבטחת מידע, אוטומציות AI ומערכות",
    },
};

function normalizeLanguage(language) {
    return Object.prototype.hasOwnProperty.call(I18N, language) ? language : "en";
}

function getText(language, key) {
    const normalized = normalizeLanguage(language);
    return I18N[normalized][key] || I18N.en[key] || "";
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

    if (description) description.setAttribute("content", getText(normalized, "metaDescription"));
    if (title) title.textContent = getText(normalized, "pageTitle");
    if (ogTitle) ogTitle.setAttribute("content", getText(normalized, "pageTitle"));
    if (ogDescription) ogDescription.setAttribute("content", getText(normalized, "metaDescription"));
    if (twitterTitle) twitterTitle.setAttribute("content", getText(normalized, "pageTitle"));
    if (twitterDescription) twitterDescription.setAttribute("content", getText(normalized, "metaDescription"));

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
        return normalizeLanguage(window.localStorage.getItem("rotem-about-language") || "en");
    } catch (error) {
        return "en";
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
initLanguageToggle();
initReveals();
initCharacter();
