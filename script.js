const CHARACTER_GLB_URL = "assets/3d/rotem-z-rabbit.glb";
const CHARACTER_MANIFEST_URL = "assets/3d/character-manifest.json";
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
        heroLede: "Security operations, AI automation, and practical systems built for real workflows.",
        heroActionsLabel: "Primary actions",
        heroPrimary: "Start a conversation",
        heroSecondary: "View systems",
        heroFocusLabel: "Focus areas",
        heroFocus: "Detect. Automate. Operate.",
        previewLabel: "Profile preview",
        previewTitle: "I build the systems that keep security teams effective.",
        previewCopy: "From SOC workflows to AI-powered automations, the work is built for clarity, speed, and control.",
        profileTitle: "Operator profile",
        profileIntro: "I run security operations as a system: first signal, final response, clear ownership, and repeatable outcomes.",
        profileCopyOne: "My work sits between Security Operations, infrastructure, automation, and AI. I care about the full path from alert to action, not only the dashboard that shows the alert.",
        profileCopyTwo: "That means triage discipline, better enrichment, cleaner handoffs, and tooling that removes friction instead of adding another noisy layer.",
        operatorRailLabel: "Operator principles",
        operateTitle: "Operate",
        operateCopy: "Lead SOC workflows and own incidents end to end.",
        automateTitle: "Automate",
        automateCopy: "Build automations that remove friction and raise the bar.",
        ownTitle: "Own",
        ownCopy: "Take responsibility for outcomes, not only tasks.",
        labTitle: "AI Lab",
        labIntro: "A focused lab for building and testing AI workflows that support real security operations.",
        projectLabel: "Project",
        mayaCopy: "Maya is an AI workflow project for research assistance, alert context, response support, and operational learning. It is one project in the lab, not the site.",
        labSignalOne: "Research assistance",
        labOutcomeOne: "Faster signal analysis",
        labSignalTwo: "Context enrichment",
        labOutcomeTwo: "Stronger decisions",
        labSignalThree: "Response support",
        labOutcomeThree: "Operator leverage",
        systemsTitle: "Systems map",
        systemsIntro: "The operating system for security work: tight feedback loops, clear handoffs, and disciplined change.",
        systemsMapLabel: "Systems map",
        systemSocTitle: "SOC workflow",
        systemSocCopy: "Triage, investigate, and respond with a consistent operating cadence.",
        systemAlertTitle: "Alert enrichment",
        systemAlertCopy: "Add context, threat intel, and business signals to turn noise into insight.",
        systemAiTitle: "AI automations",
        systemAiCopy: "Automate repeatable workflows and support operator decision-making.",
        systemDeployTitle: "Deployment discipline",
        systemDeployCopy: "Test, validate, monitor, and improve with guardrails.",
        deepTitle: "Deep dive",
        deepIntro: "My workflow is built for clarity, speed, and control. From idea to impact, designed to ship and built to scale.",
        workflowUnderstandTitle: "Understand",
        workflowUnderstandCopy: "Decode the real problem, constraints, users, and mission.",
        workflowArchitectTitle: "Architect",
        workflowArchitectCopy: "Design structure, data flow, and automation logic first.",
        workflowBuildTitle: "Build",
        workflowBuildCopy: "Ship clean code, reliable flows, and tested integrations.",
        workflowDeployTitle: "Deploy",
        workflowDeployCopy: "Use environments, CI/CD, monitoring, and measured rollout.",
        workflowEvolveTitle: "Evolve",
        workflowEvolveCopy: "Measure, learn, iterate, and make the system sharper.",
        experienceTitle: "Experience",
        experienceIntro: "A focus on reliable systems, automation, and developer experience.",
        roleOneTitle: "Freelance Automation & AI Engineer",
        roleOneCopy: "Building automation systems, AI agents, and developer tooling for global clients.",
        roleTwoTitle: "Lead Developer & Automation Engineer",
        roleTwoCopy: "Led end-to-end delivery of web platforms and backend services.",
        roleThreeTitle: "Full Stack Developer",
        roleThreeCopy: "Delivered scalable features and integrations across web applications.",
        roleFourTitle: "Software Developer",
        roleFourCopy: "Built and maintained production systems and internal tools.",
        certTitle: "Certifications",
        certIntro: "Continuous learning. Real-world impact.",
        contactTitle: "Let's build the next reliable system",
        contactCopy: "Open to meaningful projects, collaborations, and new challenges that need security thinking, automation, and practical delivery.",
        contactEmail: "Email Rotem",
        mobileDockLabel: "Quick actions",
        mobileStart: "Start",
        mobileSystems: "Systems",
        metaDescription: "Rotem Zacaim builds practical security operations, AI automation, and reliable systems for real workflows.",
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
        heroLede: "אבטחת מידע תפעולית, אוטומציות AI ומערכות מעשיות שנבנות סביב עבודה אמיתית.",
        heroActionsLabel: "פעולות ראשיות",
        heroPrimary: "נתחיל שיחה",
        heroSecondary: "לראות מערכות",
        heroFocusLabel: "מוקדי עבודה",
        heroFocus: "Detect. Automate. Operate.",
        previewLabel: "תצוגת פרופיל",
        previewTitle: "אני בונה את המערכות שמחזיקות צוותי אבטחה יעילים.",
        previewCopy: "מ־SOC workflows ועד אוטומציות AI, העבודה בנויה סביב בהירות, מהירות ושליטה.",
        profileTitle: "Operator profile",
        profileIntro: "אני מתייחס ל־security operations כמערכת: מהסיגנל הראשון ועד תגובה, אחריות ותוצאה שחוזרת על עצמה.",
        profileCopyOne: "העבודה שלי יושבת בין Security Operations, תשתיות, אוטומציה ו־AI. אני מסתכל על כל הדרך מהתרעה לפעולה, לא רק על הדשבורד שמציג אותה.",
        profileCopyTwo: "זה אומר משמעת triage, העשרה טובה יותר, handoffs נקיים וכלים שמורידים חיכוך במקום להוסיף שכבת רעש.",
        operatorRailLabel: "עקרונות עבודה",
        operateTitle: "Operate",
        operateCopy: "להוביל SOC workflows ולקחת בעלות מקצה לקצה.",
        automateTitle: "Automate",
        automateCopy: "לבנות אוטומציות שמורידות חיכוך ומשפרות סטנדרט.",
        ownTitle: "Own",
        ownCopy: "לקחת אחריות על תוצאות, לא רק על משימות.",
        labTitle: "AI Lab",
        labIntro: "מעבדה ממוקדת לבנייה ובדיקה של תהליכי AI שתומכים בעבודת אבטחה אמיתית.",
        projectLabel: "Project",
        mayaCopy: "Maya היא פרויקט AI workflow למחקר, העשרת התרעות, תמיכה בתגובה ולמידה תפעולית. זה פרויקט אחד במעבדה, לא האתר עצמו.",
        labSignalOne: "סיוע במחקר",
        labOutcomeOne: "ניתוח סיגנלים מהיר יותר",
        labSignalTwo: "העשרת קונטקסט",
        labOutcomeTwo: "החלטות חזקות יותר",
        labSignalThree: "תמיכה בתגובה",
        labOutcomeThree: "מינוף לאופרייטור",
        systemsTitle: "Systems map",
        systemsIntro: "מערכת הפעלה לעבודת אבטחה: feedback loops הדוקים, handoffs ברורים ושינוי ממושמע.",
        systemsMapLabel: "מפת מערכות",
        systemSocTitle: "SOC workflow",
        systemSocCopy: "Triage, חקירה ותגובה בקצב עבודה עקבי.",
        systemAlertTitle: "Alert enrichment",
        systemAlertCopy: "הוספת קונטקסט, מודיעין ואותות עסקיים כדי להפוך רעש לתובנה.",
        systemAiTitle: "AI automations",
        systemAiCopy: "אוטומציה לתהליכים חוזרים ותמיכה בקבלת החלטות.",
        systemDeployTitle: "Deployment discipline",
        systemDeployCopy: "בדיקה, אימות, ניטור ושיפור עם guardrails.",
        deepTitle: "Deep dive",
        deepIntro: "תהליך העבודה שלי בנוי לבהירות, מהירות ושליטה. מרעיון להשפעה, מתוכנן להישלח ולהתרחב.",
        workflowUnderstandTitle: "Understand",
        workflowUnderstandCopy: "לפענח את הבעיה, המגבלות, המשתמשים והמשימה.",
        workflowArchitectTitle: "Architect",
        workflowArchitectCopy: "לתכנן מבנה, data flow ולוגיקת אוטומציה לפני קוד.",
        workflowBuildTitle: "Build",
        workflowBuildCopy: "לשלוח קוד נקי, flows אמינים ואינטגרציות בדוקות.",
        workflowDeployTitle: "Deploy",
        workflowDeployCopy: "לעבוד עם environments, CI/CD, ניטור והשקה מדודה.",
        workflowEvolveTitle: "Evolve",
        workflowEvolveCopy: "למדוד, ללמוד, לשפר ולחדד את המערכת.",
        experienceTitle: "Experience",
        experienceIntro: "פוקוס על מערכות אמינות, אוטומציה וחוויית פיתוח.",
        roleOneTitle: "Freelance Automation & AI Engineer",
        roleOneCopy: "בניית מערכות אוטומציה, AI agents וכלי פיתוח ללקוחות גלובליים.",
        roleTwoTitle: "Lead Developer & Automation Engineer",
        roleTwoCopy: "הובלת delivery מקצה לקצה של פלטפורמות web ושירותי backend.",
        roleThreeTitle: "Full Stack Developer",
        roleThreeCopy: "פיתוח יכולות scalable ואינטגרציות באפליקציות web.",
        roleFourTitle: "Software Developer",
        roleFourCopy: "בנייה ותחזוקה של מערכות production וכלים פנימיים.",
        certTitle: "Certifications",
        certIntro: "למידה מתמשכת. השפעה בעולם אמיתי.",
        contactTitle: "בוא נבנה את המערכת האמינה הבאה",
        contactCopy: "פתוח לפרויקטים משמעותיים, שיתופי פעולה ואתגרים שצריכים חשיבה אבטחתית, אוטומציה וביצוע מעשי.",
        contactEmail: "אימייל לרותם",
        mobileDockLabel: "פעולות מהירות",
        mobileStart: "התחלה",
        mobileSystems: "מערכות",
        metaDescription: "רותם זכאים בונה מערכות אבטחת מידע תפעוליות, אוטומציות AI וכלים מעשיים סביב עבודה אמיתית.",
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
        document.documentElement.classList.add("using-procedural-character");

        this.loadExternalModelFromManifest();
        this.bindEvents();
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

        [-0.33, 0.33].forEach((x) => {
            const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.72, 8, 12), darkFur);
            leg.position.set(x, -1.15, 0.02);
            group.add(leg);

            const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.16, 0.66), sole);
            shoe.position.set(x, -1.58, 0.18);
            shoe.rotation.x = -0.04;
            group.add(shoe);
        });

        const shirtText = this.createTextPlane("rotem.z");
        shirtText.position.set(0, 0.18, 0.75);
        group.add(shirtText);

        const armGeometry = new THREE.CapsuleGeometry(0.11, 0.86, 8, 12);
        const pointingArm = new THREE.Mesh(armGeometry, fur);
        pointingArm.position.set(-0.88, 0.48, 0.2);
        pointingArm.rotation.z = Math.PI / 2.25;
        pointingArm.rotation.y = -0.3;
        group.add(pointingArm);

        const finger = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.34, 8, 10), fur);
        finger.position.set(-1.37, 0.66, 0.34);
        finger.rotation.z = Math.PI / 2;
        group.add(finger);

        const relaxedArm = new THREE.Mesh(armGeometry, fur);
        relaxedArm.position.set(0.78, 0.22, 0.08);
        relaxedArm.rotation.z = -0.35;
        group.add(relaxedArm);

        group.position.y = -0.74;
        group.userData.baseY = -0.74;
        return group;
    }

    createTextPlane(text) {
        const label = document.createElement("canvas");
        label.width = 512;
        label.height = 192;
        const ctx = label.getContext("2d");
        ctx.clearRect(0, 0, label.width, label.height);
        ctx.fillStyle = "#f4f6f8";
        ctx.font = "700 88px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 256, 96);

        const texture = new THREE.CanvasTexture(label);
        texture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.34), material);
        plane.name = "rotem-z-shirt-label";
        return plane;
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
                incoming.name = "rotem-z-rabbit-glb";
                incoming.position.set(0, -1.15, 0);
                incoming.userData.baseY = -1.15;

                this.scene.remove(this.model);
                this.model = incoming;
                this.scene.add(this.model);
                this.applyResponsiveFraming();
                this.renderFrame();
                document.documentElement.classList.remove("using-procedural-character");

                if (gltf.animations.length && !this.reducedMotion) {
                    this.mixer = new THREE.AnimationMixer(this.model);
                    gltf.animations.forEach((clip) => this.mixer.clipAction(clip).play());
                }
            },
            undefined,
            () => {
                document.documentElement.classList.add("using-procedural-character");
            }
        );
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
            document.body.classList.toggle("is-character-docked", this.scrollProgress > 0.04);
        }, { passive: true });

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
        const scale = this.model?.name === "rotem-z-rabbit-glb"
            ? (isMobile ? 1.1 : isTablet ? 1.32 : 1.45)
            : (isMobile ? 0.52 : isTablet ? 0.62 : 0.68);

        this.camera.position.z = isMobile ? 8.1 : 7.8;
        this.camera.position.y = isMobile ? 1.38 : 1.22;
        this.camera.lookAt(0, isMobile ? 0.35 : 0.2, 0);

        if (this.model) {
            this.model.scale.setScalar(scale);
        }
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
            const scrollX = document.documentElement.dir === "rtl" ? -this.scrollProgress * 0.58 : this.scrollProgress * 0.58;
            const baseY = typeof this.model.userData.baseY === "number" ? this.model.userData.baseY : -0.74;
            this.model.rotation.y = THREE.MathUtils.lerp(this.model.rotation.y, this.pointer.x * 0.16 - this.scrollProgress * 0.28, 0.08);
            this.model.rotation.x = THREE.MathUtils.lerp(this.model.rotation.x, -this.pointer.y * 0.055, 0.06);
            this.model.position.y = baseY + idle;
            this.model.position.x = THREE.MathUtils.lerp(this.model.position.x, scrollX, 0.07);
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
