# Projects-First About Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `about.rotem-dev.org` so the site opens with Rotem's project portfolio, then supports it with year-by-year CV history, courses, and public-safe contact details.

**Architecture:** Keep the existing static GitHub Pages architecture: `index.html`, `styles.css`, and `script.js`. Replace the current profile-first content with a projects-first shell, render portfolio/timeline/skills data from structured JavaScript objects, and keep the existing Three.js rabbit runtime as a de-emphasized supporting visual until a replacement asset is chosen later.

**Tech Stack:** Plain HTML, CSS, JavaScript, Three.js import map already in the page, Node.js built-in test runner, static GitHub Pages hosting.

---

## File Structure

- Modify `test/about-page.test.js`
  - Update static contract tests from the older profile/tool-lab structure to the approved projects-first contract.
  - Keep the existing helper functions and 3D/rabbit safety tests.
  - Add checks for primary project IDs, inline detail controls, local project assets, Hebrew default, timeline years, skill groups, and no LinkedIn hotlinks.

- Create `assets/projects/`
  - Copy selected LinkedIn media from `.superpowers/brainstorm/18176-1785252923/linkedin-media/`.
  - Copy safe local project imagery from the Maya/OR docs where useful.
  - Use stable filenames that describe the project.

- Modify `index.html`
  - Set Hebrew default shell text and make `Projects` the first nav item.
  - Replace the current `profile`, `maya-lab`, `systems`, and `deep-dive` sections with project portfolio containers.
  - Add containers for primary projects, inline project details, secondary lab gallery, year-by-year timeline, courses/skills, and contact.
  - Keep the existing character stage markup, but visually subordinate it.

- Modify `script.js`
  - Change initial language fallback from English to Hebrew.
  - Replace old content translations with a smaller shell translation set.
  - Add structured data arrays: `PRIMARY_PROJECTS`, `SECONDARY_PROJECTS`, `CAREER_TIMELINE`, and `SKILL_GROUPS`.
  - Add render functions for projects, project details, lab gallery, timeline, and skills.
  - Add accessible inline project detail behavior with `aria-expanded`, `hidden`, focus return, and hash support.
  - Keep the existing `RotemCharacterScene` code unless a test fails because of layout changes.

- Modify `styles.css`
  - Add projects-first layout styles: compact hero, project grid, media cards, inline detail panel, lab gallery, timeline, skills, chips, and icon buttons.
  - Preserve RTL/LTR, reduced-motion, mobile, and character-lane safety.
  - De-emphasize the character stage enough that project content owns the page.

- Modify `PROJECT_GUIDANCE.md`
  - Update the content/source section to reflect the 2026-07-28 LinkedIn extraction and projects-first direction.
  - Keep the safety/privacy rules.

- Do not add or modify `assets/3d/night-city-resident.glb`.
- Do not commit `.superpowers/` brainstorm files.

---

### Task 1: Update Projects-First Contract Tests

**Files:**
- Modify: `test/about-page.test.js`

- [ ] **Step 1: Replace the old first-viewport test**

Find the test named:

```javascript
test("first viewport is Rotem-first with approved nav and hero copy", () => {
```

Replace the entire test with:

```javascript
test("first viewport is projects-first with Hebrew default and approved nav", () => {
    assert.match(indexHtml, /<html[^>]+lang="he"[^>]+dir="rtl"/);
    assert.equal(getFirstH1Text(), "רותם זכאים");
    assert.match(indexHtml, /href="#projects"[^>]*>\s*Projects\s*</);
    assert.match(indexHtml, /href="#timeline"[^>]*>\s*Timeline\s*</);
    assert.match(indexHtml, /href="#skills"[^>]*>\s*Courses & Skills\s*</);
    assert.match(indexHtml, /href="#contact"[^>]*>\s*Contact\s*</);
    assert.match(publicSiteSource, /אנליסט אבטחת מידע ותשתיות שבונה מערכות AI/);
    assert.match(publicSiteSource, /data-i18n="heroPrimary"[\s\S]*#projects/);
    assert.match(publicSiteSource, /data-i18n="heroSecondary"[\s\S]*#timeline/);
    assert.match(scriptJs, /return normalizeLanguage\(window\.localStorage\.getItem\("rotem-about-language"\) \|\| "he"\)/);
});
```

- [ ] **Step 2: Replace the old operating-style test**

Find the test named:

```javascript
test("content speaks about Rotem's practical operating style", () => {
```

Replace the entire test with:

```javascript
test("content leads with concrete project portfolio signals", () => {
    const requiredProjectSignals = [
        /Home Assistant \+ Maya/,
        /Maya WhatsApp AI Agent/,
        /Local LLM \/ Cyber Agent/,
        /ROTEMZ Scanner \/ RedLab/,
        /Zacaim WiFi \/ Raspberry Pi Lab/,
        /mon \/ Private Control Center Labs/,
    ];

    for (const pattern of requiredProjectSignals) {
        assert.match(publicSiteSource, pattern);
    }

    assert.doesNotMatch(publicSiteSource, /Full Workflow Automation/i);
    assert.doesNotMatch(indexHtml, /<h1[^>]*>\s*Maya Agent\s*<\/h1>/i);
});
```

- [ ] **Step 3: Replace the required sections test**

Find the test named:

```javascript
test("required about sections are present", () => {
```

Replace the entire test with:

```javascript
test("required projects-first sections are present", () => {
    const sectionIds = [
        "overview",
        "projects",
        "lab-gallery",
        "timeline",
        "skills",
        "contact",
    ];

    for (const id of sectionIds) {
        assert.ok(
            findTagsByName(indexHtml, "section").some((tag) => getAttributeValue(tag, "id") === id),
            `Expected section #${id} to exist.`
        );
    }

    assert.doesNotMatch(indexHtml, /id="maya-lab"/);
    assert.doesNotMatch(indexHtml, /id="systems"/);
    assert.doesNotMatch(indexHtml, /id="deep-dive"/);
});
```

- [ ] **Step 4: Add a primary-project accessibility test**

Add this test after the required sections test:

```javascript
test("primary project cards and inline detail controls are data-driven and accessible", () => {
    const requiredIds = [
        "home-assistant-maya",
        "maya-whatsapp-agent",
        "local-llm-cyber-agent",
        "rotemz-redlab",
        "zacaim-wifi-pi-lab",
        "mon-private-control-center",
    ];

    assert.match(indexHtml, /data-project-grid/);
    assert.match(indexHtml, /data-project-detail-panel/);
    assert.match(indexHtml, /data-project-detail-close/);
    assert.match(scriptJs, /\bconst\s+PRIMARY_PROJECTS\s*=\s*\[/);
    assert.match(scriptJs, /\bfunction\s+renderProjects\s*\(/);
    assert.match(scriptJs, /\bfunction\s+openProjectDetail\s*\(/);
    assert.match(scriptJs, /\bfunction\s+closeProjectDetail\s*\(/);
    assert.match(scriptJs, /aria-expanded/);
    assert.match(scriptJs, /aria-controls/);
    assert.match(scriptJs, /window\.history\.replaceState/);
    assert.match(scriptJs, /window\.location\.hash/);

    for (const id of requiredIds) {
        assert.match(scriptJs, new RegExp(`id:\\s*"${escapeRegExp(id)}"`));
        assert.match(scriptJs, new RegExp(`project-detail-${escapeRegExp(id)}`));
    }
});
```

- [ ] **Step 5: Add a local media contract test**

Add this test after the project accessibility test:

```javascript
test("project media uses stable local assets instead of expiring LinkedIn URLs", () => {
    const projectAssetPaths = [
        "assets/projects/home-assistant-maya.jpg",
        "assets/projects/maya-whatsapp-agent-1.jpg",
        "assets/projects/maya-whatsapp-agent-2.jpg",
        "assets/projects/local-llm-cyber-agent.jpg",
        "assets/projects/rotemz-redlab.jpg",
        "assets/projects/zacaim-wifi-pi-lab-1.jpg",
        "assets/projects/zacaim-wifi-pi-lab-2.jpg",
        "assets/projects/ai-risk-local-model.jpg",
        "assets/projects/about-framer-prototype.jpg",
        "assets/projects/chatgpt-agent-job-search.jpg",
        "assets/projects/chatgpt-shared-links-risk.jpg",
        "assets/projects/apartment-plan-app.png",
        "assets/projects/home-assistant-wall-panel.png",
    ];

    for (const assetPath of projectAssetPaths) {
        const absolutePath = path.join(repoRoot, assetPath);
        assert.equal(fs.existsSync(absolutePath), true, `${assetPath} should exist`);
        assert.ok(fs.statSync(absolutePath).size > 10_000, `${assetPath} should not be an empty placeholder`);
        assert.match(scriptJs, new RegExp(escapeRegExp(assetPath)));
    }

    assert.doesNotMatch(publicSiteSource, /media\.licdn\.com/);
    assert.doesNotMatch(publicSiteSource, /\.superpowers[\\/]/);
});
```

- [ ] **Step 6: Replace the public-content tools test**

Find the test named:

```javascript
test("public content includes the approved tools and architecture without exposing internals", () => {
```

Replace its `expectedSignals` array with:

```javascript
const expectedSignals = [
    /Maya/i,
    /RoteMGPT/i,
    /RedLab/i,
    /ZACAIM/i,
    /Home Assistant/i,
    /Android Lab/i,
    /OpenAI Usage/i,
    /Raspberry Pi/i,
    /Local LLM/i,
    /Cloudflare Access/i,
    /Dashboard as Code/i,
    /SQLite/i,
    /Google Calendar/i,
    /authorized/i,
    /closed lab/i,
];
```

Keep the `for` loop unchanged.

- [ ] **Step 7: Replace the experience and education test**

Find the test named:

```javascript
test("experience and education reflect Rotem's CV rather than generic developer roles", () => {
```

Replace it with:

```javascript
test("timeline and courses reflect the CV year by year", () => {
    const expectedTimelineSignals = [
        /2026/,
        /2025/,
        /2023-present/,
        /2021-2023/,
        /2020-2021/,
        /2014-2017/,
        /2013-2017/,
        /Israel National Digital Agency/i,
        /Ministry of Health/i,
        /Israel Police/i,
        /SAP ERP/i,
        /Branch manager/i,
    ];

    for (const pattern of expectedTimelineSignals) {
        assert.match(publicSiteSource, pattern);
    }

    assert.match(publicSiteSource, /Cyber Defender/i);
    assert.match(publicSiteSource, /650 academic hours/i);
    assert.match(publicSiteSource, /Software QA/i);
    assert.match(publicSiteSource, /Cisco CCNA 200-301/i);
    assert.match(publicSiteSource, /Jr Penetration Tester/i);
    assert.match(publicSiteSource, /Applied Ethical Hacking/i);
    assert.doesNotMatch(publicSiteSource, /AWS Certified Developer/i);
    assert.doesNotMatch(publicSiteSource, /Meta Front-End Developer/i);
});
```

- [ ] **Step 8: Tighten sensitive-detail patterns**

In the `no sensitive operational details are exposed` test, add these forbidden patterns:

```javascript
["Cloudflare tunnel hostname", /\b[a-z0-9-]+\.trycloudflare\.com\b/i],
["private mon hostname", /\bmon\.rotem-dev\.org\b/i],
["Home Assistant entity id", /\b(?:sensor|switch|cover|vacuum|camera|climate)\.[a-z0-9_]+\b/i],
["private filesystem path", /C:\\Users\\rotem\\Documents\\codex\\WEB\\maya/i],
```

Do not forbid `about.rotem-dev.org`; it is the public target site.

- [ ] **Step 9: Run tests and verify they fail**

Run:

```powershell
node --test test\about-page.test.js
```

Expected: FAIL because the site has not been updated yet, with failures about missing project sections, assets, and data objects.

- [ ] **Step 10: Commit the failing tests**

Run:

```powershell
git add test/about-page.test.js
git commit -m "test: define projects-first about contract"
```

Expected: commit succeeds and does not include `.superpowers/` or `assets/3d/night-city-resident.glb`.

---

### Task 2: Promote Project Images Into Public Assets

**Files:**
- Create: `assets/projects/home-assistant-maya.jpg`
- Create: `assets/projects/maya-whatsapp-agent-1.jpg`
- Create: `assets/projects/maya-whatsapp-agent-2.jpg`
- Create: `assets/projects/local-llm-cyber-agent.jpg`
- Create: `assets/projects/rotemz-redlab.jpg`
- Create: `assets/projects/zacaim-wifi-pi-lab-1.jpg`
- Create: `assets/projects/zacaim-wifi-pi-lab-2.jpg`
- Create: `assets/projects/ai-risk-local-model.jpg`
- Create: `assets/projects/about-framer-prototype.jpg`
- Create: `assets/projects/chatgpt-agent-job-search.jpg`
- Create: `assets/projects/chatgpt-shared-links-risk.jpg`
- Create: `assets/projects/apartment-plan-app.png`
- Create: `assets/projects/home-assistant-wall-panel.png`

- [ ] **Step 1: Create the assets directory**

Run:

```powershell
New-Item -ItemType Directory -Force -Path assets\projects
```

Expected: `assets\projects` exists.

- [ ] **Step 2: Copy selected LinkedIn images to stable names**

Run:

```powershell
$source = ".superpowers\brainstorm\18176-1785252923\linkedin-media"
Copy-Item "$source\linkedin-7486080918772924417-1.jpg" "assets\projects\home-assistant-maya.jpg" -Force
Copy-Item "$source\linkedin-7447689751286927362-1.jpg" "assets\projects\maya-whatsapp-agent-1.jpg" -Force
Copy-Item "$source\linkedin-7447689751286927362-2.jpg" "assets\projects\maya-whatsapp-agent-2.jpg" -Force
Copy-Item "$source\linkedin-7456387164772167680-1.jpg" "assets\projects\local-llm-cyber-agent.jpg" -Force
Copy-Item "$source\linkedin-7405652741395496960-1.jpg" "assets\projects\rotemz-redlab.jpg" -Force
Copy-Item "$source\linkedin-7435595214980898817-1.jpg" "assets\projects\zacaim-wifi-pi-lab-1.jpg" -Force
Copy-Item "$source\linkedin-7435595214980898817-2.jpg" "assets\projects\zacaim-wifi-pi-lab-2.jpg" -Force
Copy-Item "$source\linkedin-7412181118281728000-1.jpg" "assets\projects\ai-risk-local-model.jpg" -Force
Copy-Item "$source\linkedin-7365070927916625920-1.jpg" "assets\projects\about-framer-prototype.jpg" -Force
Copy-Item "$source\linkedin-7362224081213059072-1.jpg" "assets\projects\chatgpt-agent-job-search.jpg" -Force
Copy-Item "$source\linkedin-7356624275149094912-1.jpg" "assets\projects\chatgpt-shared-links-risk.jpg" -Force
```

Expected: eleven JPG files exist under `assets\projects`.

- [ ] **Step 3: Copy safe local project images**

Run:

```powershell
Copy-Item "C:\Users\rotem\Documents\codex\WEB\OR\docs\design-concepts\dark-cad-studio-editor.png" "assets\projects\apartment-plan-app.png" -Force
Copy-Item "C:\Users\rotem\Documents\codex\WEB\maya\docs\assets\home-assistant-wall-panel-glass-concept.png" "assets\projects\home-assistant-wall-panel.png" -Force
```

Expected: two PNG files exist under `assets\projects`.

- [ ] **Step 4: Inspect images for obvious sensitive content**

Run:

```powershell
Get-ChildItem assets\projects | Select-Object Name,Length
```

Expected:

- All listed files are present.
- Each file is larger than 10 KB.
- No filename exposes internal hostnames, ports, phone numbers, or private paths.

Manually review the visible images during browser QA in Task 7. If an image exposes a secret or personal content, replace it with a safer local screenshot from `docs/assets` or omit the image from that project card.

- [ ] **Step 5: Commit public assets**

Run:

```powershell
git add assets/projects
git commit -m "feat: add project portfolio media"
```

Expected: commit includes only `assets/projects/*`.

---

### Task 3: Replace HTML Shell With Projects-First Sections

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Set Hebrew default document attributes**

Change the opening HTML tag to:

```html
<html lang="he" dir="rtl">
```

Expected: the document starts in Hebrew/RTL before JavaScript runs.

- [ ] **Step 2: Replace the top navigation links**

Replace the current `.topnav` contents with:

```html
<a href="#projects" data-i18n="navProjects">Projects</a>
<a href="#lab-gallery" data-i18n="navLabGallery">Lab Gallery</a>
<a href="#timeline" data-i18n="navTimeline">Timeline</a>
<a href="#skills" data-i18n="navSkills">Courses & Skills</a>
<a href="#contact" data-i18n="navContact">Contact</a>
```

Expected: `Projects` is the first visible navigation item.

- [ ] **Step 3: Replace the hero copy**

Inside `section#overview`, keep the `character-guide` markup but replace the `.hero-copy` content with:

```html
<div class="hero-copy" data-reveal>
    <p class="eyebrow" data-i18n="heroEyebrow">Projects-first portfolio</p>
    <h1 id="hero-title" data-i18n="heroTitle">רותם זכאים</h1>
    <p class="hero-lede" data-i18n="heroLede">
        אנליסט אבטחת מידע ותשתיות שבונה מערכות AI, אוטומציה ומעבדות סייבר מעשיות.
    </p>
    <div class="hero-actions" aria-label="Primary actions" data-i18n-attr="aria-label:heroActionsLabel">
        <a class="button button-primary" href="#projects">
            <span class="desktop-label" data-i18n="heroPrimary">לראות פרויקטים</span>
            <span class="mobile-label" data-i18n="mobileProjects">פרויקטים</span>
            <span class="button-icon" aria-hidden="true">↘</span>
        </a>
        <a class="button button-secondary" href="#timeline">
            <span class="desktop-label" data-i18n="heroSecondary">ציר זמן מקצועי</span>
            <span class="mobile-label" data-i18n="mobileTimeline">ציר זמן</span>
            <span class="button-icon" aria-hidden="true">↘</span>
        </a>
    </div>
    <div class="hero-command" aria-label="Focus areas" data-i18n-attr="aria-label:heroFocusLabel">
        <p class="mono-line">&gt; project_index</p>
        <p class="command-value">AI · Cyber · Infra · Automation</p>
        <p data-i18n="heroFocus">Maya, Home Assistant, RedLab, local models, Android Lab, games.</p>
    </div>
</div>
```

Expected: first viewport gives Rotem identity and project direction, not a generic profile paragraph.

- [ ] **Step 4: Replace `next-signal` with project preview copy**

Replace the `section.next-signal` text with:

```html
<p data-i18n="previewTitle">האתר הזה נבנה מחדש סביב פרויקטים שבאמת נבנו ופועלים.</p>
<p data-i18n="previewCopy">כל כרטיס מוביל להסבר רחב: מה נבנה, איך זה עובד, מה זה מוכיח, ואילו טכנולוגיות מעורבות.</p>
```

Expected: preview reinforces project-first direction.

- [ ] **Step 5: Replace old content sections with new section containers**

Remove the old sections with these IDs:

```text
profile
maya-lab
systems
deep-dive
experience
certifications
```

Insert these sections before `section#contact`:

```html
<section class="section projects-section" id="projects" aria-labelledby="projects-title">
    <div class="section-index">01</div>
    <div class="section-heading">
        <h2 id="projects-title" data-i18n="projectsTitle">Projects</h2>
        <p data-i18n="projectsIntro">
            פרויקטים שבניתי סביב AI, תשתיות, אבטחת מידע, בית חכם, מודלים מקומיים ואוטומציה.
        </p>
    </div>
    <div class="project-surface">
        <div class="project-grid" data-project-grid></div>
        <article
            class="project-detail-panel"
            id="project-detail-panel"
            data-project-detail-panel
            tabindex="-1"
            hidden
        >
            <button class="icon-button project-detail-close" type="button" data-project-detail-close aria-label="Close project details">
                ×
            </button>
            <div data-project-detail-content></div>
        </article>
    </div>
</section>

<section class="section lab-gallery-section" id="lab-gallery" aria-labelledby="lab-gallery-title">
    <div class="section-index">02</div>
    <div class="section-heading row-heading">
        <h2 id="lab-gallery-title" data-i18n="labGalleryTitle">Lab Gallery</h2>
        <p data-i18n="labGalleryIntro">
            פרויקטים משניים וניסויי Lab שמראים רוחב: דשבורדים, משחקים, אוטומציות, מחקר AI וכלי מוצר.
        </p>
    </div>
    <div class="lab-gallery" data-lab-gallery></div>
</section>

<section class="section timeline-section" id="timeline" aria-labelledby="timeline-title">
    <div class="section-index">03</div>
    <div class="section-heading row-heading">
        <h2 id="timeline-title" data-i18n="timelineTitle">Year by year</h2>
        <p data-i18n="timelineIntro">
            מה עשיתי משנה לשנה, איפה עבדתי, ואילו פרויקטים נבנו לצד הניסיון המקצועי.
        </p>
    </div>
    <div class="timeline" data-career-timeline></div>
</section>

<section class="section skills-section" id="skills" aria-labelledby="skills-title">
    <div class="section-index">04</div>
    <div class="section-heading row-heading">
        <h2 id="skills-title" data-i18n="skillsTitle">Courses & Skills</h2>
        <p data-i18n="skillsIntro">
            קורסים, הסמכות וקבוצות ידע מה־CV ומהמחקר העצמאי.
        </p>
    </div>
    <div class="skills-grid" data-skills-grid></div>
</section>
```

Expected: static containers exist and content will be rendered by `script.js`.

- [ ] **Step 6: Update contact section index and CTA**

Change the contact section index from `07` to:

```html
<div class="section-index">05</div>
```

Keep the email and LinkedIn links unchanged.

- [ ] **Step 7: Update mobile action dock**

Replace the dock links with:

```html
<a href="#projects" data-i18n="mobileProjects">פרויקטים</a>
<a href="#timeline" data-i18n="mobileTimeline">ציר זמן</a>
```

Expected: mobile quick actions match the new site priority.

- [ ] **Step 8: Run tests and confirm HTML-related failures shrink**

Run:

```powershell
node --test test\about-page.test.js
```

Expected: still FAIL because `script.js`, assets references, and styles are not complete yet. HTML section failures should be resolved.

---

### Task 4: Add Portfolio Data And Interactions

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Change initial language fallback**

In `getInitialLanguage()`, change:

```javascript
return normalizeLanguage(window.localStorage.getItem("rotem-about-language") || "en");
```

to:

```javascript
return normalizeLanguage(window.localStorage.getItem("rotem-about-language") || "he");
```

Expected: Hebrew is the default runtime language.

- [ ] **Step 2: Replace shell translation keys**

Update the `I18N` object so it includes these shell keys in both `en` and `he`:

```javascript
const I18N = {
    en: {
        skipLink: "Skip to content",
        primaryNavLabel: "Primary navigation",
        navProjects: "Projects",
        navLabGallery: "Lab Gallery",
        navTimeline: "Timeline",
        navSkills: "Courses & Skills",
        navContact: "Contact",
        languageToggleLabel: "Switch to Hebrew",
        topbarContact: "Email",
        heroEyebrow: "Projects-first portfolio",
        heroTitle: "Rotem Zacaim",
        heroLede: "Security and infrastructure analyst building practical AI, automation, and cyber lab systems.",
        heroActionsLabel: "Primary actions",
        heroPrimary: "View Projects",
        heroSecondary: "Professional Timeline",
        heroFocusLabel: "Focus areas",
        heroFocus: "Maya, Home Assistant, RedLab, local models, Android Lab, games.",
        previewLabel: "Project preview",
        previewTitle: "This site is rebuilt around real projects that were built and operated.",
        previewCopy: "Each card expands into what was built, how it works, what it proves, and which technologies are involved.",
        projectsTitle: "Projects",
        projectsIntro: "Projects I built across AI, infrastructure, security, smart home, local models, and automation.",
        labGalleryTitle: "Lab Gallery",
        labGalleryIntro: "Secondary lab builds that show breadth: dashboards, games, automations, AI research, and product tools.",
        timelineTitle: "Year by year",
        timelineIntro: "What I did year by year, where I worked, and which projects were built alongside the professional path.",
        skillsTitle: "Courses & Skills",
        skillsIntro: "Courses, certifications, and knowledge groups from the CV and independent R&D.",
        contactTitle: "Bring me the system nobody wants to untangle",
        contactCopy: "I like problems where the answer needs both operations and code: understand the flow, expose the signal, connect the tools, automate responsibly, and keep ownership visible.",
        contactEmail: "Email Rotem",
        mobileDockLabel: "Quick actions",
        mobileProjects: "Projects",
        mobileTimeline: "Timeline",
        metaTitle: "Rotem Zacaim | Cyber Security, AI Automation & Infrastructure Projects",
        metaDescription: "Projects-first portfolio for Rotem Zacaim: Maya AI agent, Home Assistant automation, local LLM lab, RedLab, WiFi lab, monitoring, games, and cyber/infrastructure experience.",
    },
    he: {
        skipLink: "דלג לתוכן",
        primaryNavLabel: "ניווט ראשי",
        navProjects: "Projects",
        navLabGallery: "Lab Gallery",
        navTimeline: "ציר זמן",
        navSkills: "קורסים וידע",
        navContact: "יצירת קשר",
        languageToggleLabel: "Switch to English",
        topbarContact: "אימייל",
        heroEyebrow: "פורטפוליו פרויקטים",
        heroTitle: "רותם זכאים",
        heroLede: "אנליסט אבטחת מידע ותשתיות שבונה מערכות AI, אוטומציה ומעבדות סייבר מעשיות.",
        heroActionsLabel: "פעולות ראשיות",
        heroPrimary: "לראות פרויקטים",
        heroSecondary: "ציר זמן מקצועי",
        heroFocusLabel: "מוקדי עבודה",
        heroFocus: "Maya, Home Assistant, RedLab, מודלים מקומיים, Android Lab ומשחקים.",
        previewLabel: "תצוגת פרויקטים",
        previewTitle: "האתר הזה נבנה מחדש סביב פרויקטים שבאמת נבנו ופועלים.",
        previewCopy: "כל כרטיס מוביל להסבר רחב: מה נבנה, איך זה עובד, מה זה מוכיח, ואילו טכנולוגיות מעורבות.",
        projectsTitle: "Projects",
        projectsIntro: "פרויקטים שבניתי סביב AI, תשתיות, אבטחת מידע, בית חכם, מודלים מקומיים ואוטומציה.",
        labGalleryTitle: "Lab Gallery",
        labGalleryIntro: "פרויקטים משניים וניסויי Lab שמראים רוחב: דשבורדים, משחקים, אוטומציות, מחקר AI וכלי מוצר.",
        timelineTitle: "מה עשיתי משנה לשנה",
        timelineIntro: "מה עשיתי משנה לשנה, איפה עבדתי, ואילו פרויקטים נבנו לצד הניסיון המקצועי.",
        skillsTitle: "קורסים וידע",
        skillsIntro: "קורסים, הסמכות וקבוצות ידע מה־CV ומהמחקר העצמאי.",
        contactTitle: "תביאו לי את המערכת שאף אחד לא רוצה לפרק",
        contactCopy: "אני אוהב בעיות שבהן הפתרון צריך גם תפעול וגם קוד: להבין את הזרימה, לחשוף את הסיגנל, לחבר את הכלים, לאוטמט באחריות ולהשאיר בעלות ברורה.",
        contactEmail: "Email Rotem",
        mobileDockLabel: "פעולות מהירות",
        mobileProjects: "פרויקטים",
        mobileTimeline: "ציר זמן",
        metaTitle: "רותם זכאים | פרויקטים בסייבר, AI, אוטומציה ותשתיות",
        metaDescription: "פורטפוליו פרויקטים של רותם זכאים: Maya AI Agent, Home Assistant, מודלים מקומיים, RedLab, מעבדת WiFi, ניטור, משחקים וניסיון באבטחת מידע ותשתיות.",
    },
};
```

Expected: all HTML `data-i18n` keys have Hebrew and English translations.

- [ ] **Step 3: Add shared helpers before `applyLanguage()`**

Add:

```javascript
const PROJECT_CATEGORY_LABELS = {
    ai: { he: "AI", en: "AI" },
    cyber: { he: "Cyber", en: "Cyber" },
    infra: { he: "תשתיות", en: "Infrastructure" },
    automation: { he: "אוטומציה", en: "Automation" },
    smartHome: { he: "בית חכם", en: "Smart Home" },
    games: { he: "משחקים", en: "Games" },
    product: { he: "מוצר", en: "Product" },
};

function localized(value, language) {
    if (typeof value === "string") return value;
    return value?.[language] || value?.en || value?.he || "";
}

function createTag(name, className, text) {
    const element = document.createElement(name);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
}

function clearChildren(element) {
    if (!element) return;
    while (element.firstChild) element.removeChild(element.firstChild);
}
```

Expected: render functions can reuse small safe DOM helpers.

- [ ] **Step 4: Add `PRIMARY_PROJECTS` data**

Add this array after the helpers:

```javascript
const PRIMARY_PROJECTS = [
    {
        id: "home-assistant-maya",
        title: "Home Assistant + Maya",
        image: "assets/projects/home-assistant-maya.jpg",
        categories: ["smartHome", "infra", "ai", "automation"],
        source: "LinkedIn 7486080918772924417 + Maya docs",
        year: "2026",
        summary: {
            he: "בית חכם על Debian/Docker עם Home Assistant, דשבורד קיר, REST API ותזמור דרך Maya ב־WhatsApp.",
            en: "A Debian/Docker smart-home stack with Home Assistant, a wall dashboard, REST API boundaries, and Maya orchestration through WhatsApp.",
        },
        details: {
            built: {
                he: "בניית שכבת אוטומציה לבית שמחברת Home Assistant, מכשירי IoT, דשבורד קיר, API פנימי וסוכנת Maya.",
                en: "A home automation layer connecting Home Assistant, IoT devices, a wall dashboard, an internal API boundary, and the Maya agent.",
            },
            works: {
                he: "המשתמש מבקש פעולה בשפה טבעית ב־WhatsApp. Maya מנתבת את הבקשה לכלי Home Assistant, הכלי קורא מצב או מפעיל שירות מוגדר, והתגובה חוזרת בצורה מובנית.",
                en: "A user sends a natural-language WhatsApp request. Maya routes it to the Home Assistant tool, which reads state or calls a predefined service and returns a structured response.",
            },
            proves: {
                he: "יכולת לחבר תשתית לינוקס, קונטיינרים, API, UI, אוטומציה ואבטחת גישה למערכת אחת עובדת.",
                en: "Ability to combine Linux infrastructure, containers, APIs, UI, automation, and access controls into one working system.",
            },
        },
        technologies: ["Debian", "Docker", "Home Assistant", "JavaScript", "REST API", "WhatsApp", "Maya"],
    },
    {
        id: "maya-whatsapp-agent",
        title: "Maya WhatsApp AI Agent",
        image: "assets/projects/maya-whatsapp-agent-1.jpg",
        secondaryImage: "assets/projects/maya-whatsapp-agent-2.jpg",
        categories: ["ai", "automation", "infra"],
        source: "LinkedIn 7447689751286927362 + Maya docs",
        year: "2026",
        summary: {
            he: "סוכנת AI בעברית שמנהלת יומן, זיכרון, שוברים, קול, תמונות, URL intelligence וניטור תשתיות.",
            en: "A Hebrew-first AI agent handling calendar, memory, vouchers, voice, images, URL intelligence, and infrastructure monitoring.",
        },
        details: {
            built: {
                he: "סוכן אישי על גבי WhatsApp עם חיבור לכלים אמיתיים: Google Calendar, זיכרון מקומי, קלט/פלט קולי, תמונות, מזג אוויר, מפות ודוחות יומיים.",
                en: "A personal WhatsApp agent connected to real tools: Google Calendar, local memory, voice input/output, images, weather, maps, and daily digests.",
            },
            works: {
                he: "נתב הודעות מפריד בין קלט, החלטה, שימוש בכלים ותגובה. שכבת allowlist מגבילה מי יכול להפעיל את Maya.",
                en: "A message router separates input, decisioning, tool execution, and response. An allowlist limits who can operate Maya.",
            },
            proves: {
                he: "יכולת לבנות agent תפעולי, לא רק צ'אטבוט: כזה שמחזיק state, מפעיל כלים ומחזיר תשובות שימושיות.",
                en: "Ability to build an operational agent, not just a chatbot: stateful, tool-backed, and useful in daily workflows.",
            },
        },
        technologies: ["Node.js", "whatsapp-web.js", "OpenAI", "SQLite", "Google Calendar", "STT", "TTS"],
    },
    {
        id: "local-llm-cyber-agent",
        title: "Local LLM / Cyber Agent",
        image: "assets/projects/local-llm-cyber-agent.jpg",
        categories: ["ai", "cyber", "infra"],
        source: "LinkedIn 7456387164772167680 + Maya local model docs",
        year: "2026",
        summary: {
            he: "חיבור Maya למודל מקומי למחקר מורשה, PT labs, ניתוח טכני והבנת סיכוני AI בסביבה סגורה.",
            en: "Maya routed to a local model for authorized research, PT labs, technical analysis, and AI risk understanding in a closed environment.",
        },
        details: {
            built: {
                he: "שכבת הפעלה למודל מקומי מאחורי גישה מוגנת, עם שימוש מפורש בלבד וללא חשיפת סודות לאתר הציבורי.",
                en: "A local-model execution layer behind protected access, invoked explicitly and described publicly without exposing secrets.",
            },
            works: {
                he: "RoteMGPT מספק ממשק צ'אט למודל מקומי דרך endpoint בסגנון OpenAI-compatible. Maya יכולה לנתב אליו משימות מעבדה מוגדרות.",
                en: "RoteMGPT provides a chat interface to a local model through an OpenAI-compatible endpoint pattern. Maya can route bounded lab tasks to it.",
            },
            proves: {
                he: "יכולת להפעיל inference מקומי, להבין גבולות מודלים, ולבנות הפרדה בין מחקר AI לבין תפעול ציבורי בטוח.",
                en: "Ability to operate local inference, understand model boundaries, and separate AI research from safe public presentation.",
            },
        },
        technologies: ["Local LLM", "GGUF", "llama.cpp", "RoteMGPT", "Cloudflare Access", "Node.js"],
    },
    {
        id: "rotemz-redlab",
        title: "ROTEMZ Scanner / RedLab",
        image: "assets/projects/rotemz-redlab.jpg",
        categories: ["cyber", "automation", "product"],
        source: "LinkedIn 7405652741395496960 + ROTEMZ/RedLab docs",
        year: "2025-2026",
        summary: {
            he: "Workbench למחקר אבטחה מורשה: recon, מיפוי נכסים, בדיקות TLS/headers, ראיות ודוחות PT בעברית.",
            en: "An authorized security workbench for recon, asset mapping, TLS/header checks, evidence capture, and Hebrew PT-style reports.",
        },
        details: {
            built: {
                he: "כלים שמרכזים איסוף מידע, בדיקות תצורה, דוחות ותהליך ראיות במקום להריץ הכול ידנית ולפזר תוצרים.",
                en: "Tools that centralize discovery, configuration checks, reporting, and evidence instead of scattering manual outputs.",
            },
            works: {
                he: "המערכת מריצה בדיקות מורשות ומחזירה ממצאים, ראיות, המלצות ותוכנית retest. האתר הציבורי יתאר תהליך ותוצרים בלבד.",
                en: "The system runs authorized checks and returns findings, evidence, recommendations, and a retest plan. The public site describes process and outputs only.",
            },
            proves: {
                he: "יכולת לחשוב כמו אופרייטור: scope, איסוף, אימות, תיעוד, תיקון ובדיקה חוזרת.",
                en: "Operator thinking: scope, discovery, validation, documentation, remediation, and retesting.",
            },
        },
        technologies: ["Python", "Kali Linux", "Nmap", "TLS", "Headers", "Reports", "Evidence"],
    },
    {
        id: "zacaim-wifi-pi-lab",
        title: "Zacaim WiFi / Raspberry Pi Lab",
        image: "assets/projects/zacaim-wifi-pi-lab-1.jpg",
        secondaryImage: "assets/projects/zacaim-wifi-pi-lab-2.jpg",
        categories: ["cyber", "infra"],
        source: "LinkedIn 7435595214980898817 + Zacaim-WiFi-Tool",
        year: "2025",
        summary: {
            he: "מעבדת סייבר ניידת עם Raspberry Pi, Kali, חומרת WiFi וכלי CLI לתרגול ובדיקה בסביבה מורשית.",
            en: "A portable cyber lab using Raspberry Pi, Kali, WiFi hardware, and a CLI tool for authorized learning and testing.",
        },
        details: {
            built: {
                he: "סביבת חומרה ותוכנה ניידת שמאפשרת להבין רשתות אלחוטיות, לאסוף ראיות ולתרגל מתודולוגיה אתית.",
                en: "A portable hardware/software setup for understanding wireless networks, collecting evidence, and practicing ethical methodology.",
            },
            works: {
                he: "CLI מרכז את זרימת העבודה, בודק מוכנות כלים, מנהל תוצרים ומייצר תמונת מצב למעבדה. לא יוצגו באתר פקודות תקיפה.",
                en: "The CLI centralizes workflow, checks tool readiness, manages outputs, and creates a lab status picture. No attack commands are published.",
            },
            proves: {
                he: "יכולת לבנות מעבדה מקצה לקצה: חומרה, OS, כלים, תיעוד וגבולות שימוש.",
                en: "Ability to build an end-to-end lab: hardware, OS, tools, documentation, and use boundaries.",
            },
        },
        technologies: ["Raspberry Pi", "Kali Linux", "Python", "CLI", "WiFi", "Evidence"],
    },
    {
        id: "mon-private-control-center",
        title: "mon / Private Control Center Labs",
        image: "assets/projects/home-assistant-wall-panel.png",
        categories: ["infra", "ai", "automation", "games"],
        source: "Local Maya admin/dashboard source",
        year: "2026",
        summary: {
            he: "מרכז שליטה פרטי ל־RoteMGPT, OpenAI usage, RedLab, Android Lab, משחקים, ניטור, docs ולוגים.",
            en: "A private control center for RoteMGPT, OpenAI usage, RedLab, Android Lab, games, monitoring, docs, and logs.",
        },
        details: {
            built: {
                he: "דשבורד פרטי שמרכז מערכות תפעול, מודלים, מעבדות, משחקים, סטטוס שירותים ונתוני usage.",
                en: "A private dashboard that organizes operations systems, models, labs, games, service status, and usage data.",
            },
            works: {
                he: "הגישה מוגנת, והתצוגה הציבורית באתר תישאר ברמת יכולות וארכיטקטורה בלי hostnames או פרטי גישה.",
                en: "Access is protected, and the public site stays at capability and architecture level without hostnames or access details.",
            },
            proves: {
                he: "יכולת לבנות control center שמחבר תפעול, אבטחה, AI, observability וחוויית משתמש.",
                en: "Ability to build a control center that connects operations, security, AI, observability, and user experience.",
            },
        },
        technologies: ["Node.js", "Dashboard", "Cloudflare Access", "Monitoring", "OpenAI Usage", "Android Lab"],
    },
];
```

Expected: six primary project records exist with public-safe summaries and details.

- [ ] **Step 5: Add secondary projects, timeline, and skills data**

Add:

```javascript
const SECONDARY_PROJECTS = [
    { title: "RoteMGPT", image: "assets/projects/local-llm-cyber-agent.jpg", text: { he: "צ'אט מקומי עם מודל OpenAI-compatible, streaming, זיכרון session ותצוגת Markdown/code.", en: "Local chat with an OpenAI-compatible model, streaming, session memory, and Markdown/code display." } },
    { title: "OpenAI Usage Dashboard", image: "assets/projects/home-assistant-wall-panel.png", text: { he: "דשבורד usage/costs שמרכז צריכה לפי פרויקטים, מפתחות ומודלים.", en: "Usage/costs dashboard grouped by projects, keys, and models." } },
    { title: "Android Lab", image: "assets/projects/home-assistant-wall-panel.png", text: { he: "שליטה במכשיר Android ייעודי דרך ADB/scrcpy, פעולות בטוחות וסטטוס בזמן אמת.", en: "Dedicated Android device control through ADB/scrcpy, safe actions, and realtime status." } },
    { title: "Game Labs", image: "assets/projects/home-assistant-wall-panel.png", text: { he: "Quake 2 Demo, QuakeJS Arena ואוטומציות משחק מבוססות מסך ו־policy.", en: "Quake 2 Demo, QuakeJS Arena, and screen-based game automation with policy boundaries." } },
    { title: "Apartment Plan App", image: "assets/projects/apartment-plan-app.png", text: { he: "כלי תכנון דירה: העלאת תוכנית, זיהוי שלד, ריהוט בגודל אמיתי ותצוגת 3D.", en: "Apartment planning tool: upload a plan, detect structure, place real-size furniture, and view in 3D." } },
    { title: "AI Super-Analyst Dashboard", image: "assets/projects/chatgpt-agent-job-search.jpg", text: { he: "דשבורד FastAPI לניתוח מניות, watchlist, cache מקומי וציון AI.", en: "FastAPI stock-analysis dashboard with watchlist, local cache, and AI scoring." } },
    { title: "Sale-ים MVP", image: "assets/projects/about-framer-prototype.jpg", text: { he: "MVP עברי לקופונים וקנייה קבוצתית עם Supabase ותהליכי admin.", en: "Hebrew-first coupons and group-buying MVP with Supabase and admin workflows." } },
    { title: "AI Risk Notes", image: "assets/projects/ai-risk-local-model.jpg", text: { he: "מחקר מודלים מקומיים, סיכוני AI והצגה אחראית של גבולות שימוש.", en: "Local-model research, AI risk exploration, and responsible boundary framing." } },
    { title: "ChatGPT Shared Links Research", image: "assets/projects/chatgpt-shared-links-risk.jpg", text: { he: "העלאת מודעות לדליפות מידע דרך קישורי שיתוף AI וניהול מדיניות ארגונית.", en: "Awareness work around AI shared-link exposure and organizational policy." } },
    { title: "Agent Job Search Workflow", image: "assets/projects/chatgpt-agent-job-search.jpg", text: { he: "Workflow שמייצר קובץ Excel מסודר לחיפוש משרות Cyber לפי אזור וקריטריונים.", en: "Workflow that creates a structured Excel job-search file for cyber roles by region and criteria." } },
];

const CAREER_TIMELINE = [
    { period: "2026", title: { he: "מעבדת AI, בית חכם ומודלים מקומיים", en: "AI lab, smart home, and local models" }, place: { he: "מחקר ופיתוח עצמאי", en: "Independent R&D" }, text: { he: "Maya, Home Assistant, Local LLM, RoteMGPT, Android Lab, mon ופרויקטי automation פעילים.", en: "Maya, Home Assistant, Local LLM, RoteMGPT, Android Lab, mon, and active automation projects." } },
    { period: "2025", title: { he: "Security labs ופרויקטי AI ציבוריים", en: "Security labs and public AI projects" }, place: { he: "מחקר ופיתוח עצמאי", en: "Independent R&D" }, text: { he: "ROTEMZ Scanner, RedLab, Raspberry Pi WiFi Lab, Agent job search workflow ומחקר חשיפות ChatGPT shared links.", en: "ROTEMZ Scanner, RedLab, Raspberry Pi WiFi Lab, Agent job-search workflow, and ChatGPT shared-link exposure research." } },
    { period: "2023-present", title: { he: "אנליסט אבטחת מידע ותפעול תשתיות", en: "Information Security & Infrastructure Operations Analyst" }, place: { he: "מערך הדיגיטל הלאומי", en: "Israel National Digital Agency" }, text: { he: "טיפול בתקלות ואירועים, Splunk/SIEM, WAF, Proxy, Load Balancer, SSL, DataPower, Windows/Linux, ניטור ותחקור תעבורה.", en: "Incident and fault handling, Splunk/SIEM, WAF, proxy, load balancer, SSL, DataPower, Windows/Linux, monitoring, and traffic investigation." } },
    { period: "2021-2023", title: { he: "מרכז שליטה ובקרה", en: "Command and Control Center" }, place: { he: "משרד הבריאות", en: "Ministry of Health" }, text: { he: "תמיכה טכנית, Active Directory, הרשאות, כרטיסים חכמים, Web AD ותמיכה במערכות בריאות ענניות.", en: "Technical support, Active Directory, permissions, smart cards, Web AD, and cloud healthcare-system support." } },
    { period: "2020-2021", title: { he: "הכשרת יסוד סיור", en: "Patrol foundation training" }, place: { he: "משטרת ישראל", en: "Israel Police" }, text: { he: "היכרות עם משמעת מבצעית, דיווח, עבודת שטח ותגובה לאירועים.", en: "Operational discipline, reporting, field awareness, and incident response exposure." } },
    { period: "2014-2017", title: { he: "מפעיל SAP ERP מלאי ולוגיסטיקה", en: "SAP ERP inventory and logistics operator" }, place: { he: "חיל החימוש / שירות צבאי", en: "IDF Ordnance Corps" }, text: { he: "SAP, ניהול מלאי, חלקי חילוף, העברות מלאי, דוחות וקורס ניהול מלאי בהצטיינות.", en: "SAP, inventory management, parts issue, stock transfers, reports, and inventory course completed with excellence." } },
    { period: "2013-2017", title: { he: "מנהל סניף", en: "Branch manager" }, place: { he: "רשת מזון", en: "Food retail chain" }, text: { he: "ניהול סניף, עובדים, ספקים, מלאי, שירות ויעדי מכירות.", en: "Branch operations, employees, suppliers, inventory, service, and sales targets." } },
];

const SKILL_GROUPS = [
    { title: { he: "Cyber Defender", en: "Cyber Defender" }, meta: { he: "ג׳ון ברייס · 650 שעות אקדמיות", en: "John Bryce · 650 academic hours" }, items: ["Networking", "SIEM/ELK", "Incident Response", "Threat Hunting", "Pen Testing", "Forensics", "AI Risk"] },
    { title: { he: "QA וטסטים", en: "QA and testing" }, meta: { he: "טכניון", en: "Technion" }, items: ["SQL", "Web testing", "JavaScript/HTML5", "STR/STP/STD", "Mobile testing", "Jira"] },
    { title: { he: "Networking & Ethical Hacking", en: "Networking & Ethical Hacking" }, meta: { he: "Udemy / TryHackMe", en: "Udemy / TryHackMe" }, items: ["Cisco CCNA 200-301", "Applied Ethical Hacking", "Jr Penetration Tester", "Rules of Engagement"] },
    { title: { he: "תשתיות ואופרציה", en: "Infrastructure and operations" }, meta: { he: "ניסיון מעשי", en: "Hands-on experience" }, items: ["Windows/Linux", "F5", "Cloudflare", "Check Point", "Imperva", "DataPower", "Dynatrace", "PRTG"] },
    { title: { he: "AI ואוטומציה", en: "AI and automation" }, meta: { he: "מחקר ופיתוח עצמאי", en: "Independent R&D" }, items: ["OpenAI tools", "Local LLM", "Agents", "Prompt engineering", "Node.js", "Python/Bash"] },
    { title: { he: "שטח והתנדבות", en: "Field and volunteering" }, meta: { he: "מד״א / איחוד הצלה / משטרה", en: "MDA / United Hatzalah / Police" }, items: ["Medic", "Ambulance driver", "Team lead", "Operational coordination"] },
];
```

Expected: secondary projects, CV timeline, and skills content exist in structured data.

- [ ] **Step 6: Add rendering functions**

Add these functions before the `DOMContentLoaded` handler:

```javascript
let lastProjectTrigger = null;

function renderCategoryChips(categories, language) {
    return categories.map((category) => {
        const label = localized(PROJECT_CATEGORY_LABELS[category], language);
        return `<span class="project-chip project-chip-${category}">${label}</span>`;
    }).join("");
}

function renderProjects(language) {
    const grid = document.querySelector("[data-project-grid]");
    if (!grid) return;
    clearChildren(grid);

    PRIMARY_PROJECTS.forEach((project, index) => {
        const article = document.createElement("article");
        article.className = "project-card";
        article.dataset.projectCard = project.id;
        article.style.setProperty("--project-index", String(index));
        article.innerHTML = `
            <div class="project-media">
                <img src="${project.image}" alt="" loading="lazy">
            </div>
            <div class="project-card-body">
                <div class="project-card-meta">
                    <span>${project.year}</span>
                    <span>${localized({ he: "מקור", en: "Source" }, language)}: ${project.source}</span>
                </div>
                <h3>${project.title}</h3>
                <p>${localized(project.summary, language)}</p>
                <div class="project-chips">${renderCategoryChips(project.categories, language)}</div>
                <button
                    class="button button-secondary project-more"
                    type="button"
                    data-project-toggle="${project.id}"
                    aria-expanded="false"
                    aria-controls="project-detail-panel"
                >
                    <span>${localized({ he: "הרחבה", en: "More" }, language)}</span>
                    <span class="button-icon" aria-hidden="true">↘</span>
                </button>
            </div>
        `;
        grid.appendChild(article);
    });
}

function projectDetailMarkup(project, language) {
    const labels = {
        built: localized({ he: "מה בניתי", en: "What I built" }, language),
        works: localized({ he: "איך זה עובד", en: "How it works" }, language),
        proves: localized({ he: "מה זה מוכיח", en: "What it proves" }, language),
        tech: localized({ he: "טכנולוגיות", en: "Technologies" }, language),
        source: localized({ he: "מקור", en: "Source" }, language),
    };
    const secondaryImage = project.secondaryImage
        ? `<img src="${project.secondaryImage}" alt="" loading="lazy">`
        : "";

    return `
        <div class="project-detail-media">
            <img src="${project.image}" alt="" loading="lazy">
            ${secondaryImage}
        </div>
        <div class="project-detail-copy">
            <p class="project-detail-kicker">${project.year} · ${labels.source}: ${project.source}</p>
            <h3 id="project-detail-${project.id}">${project.title}</h3>
            <dl>
                <div><dt>${labels.built}</dt><dd>${localized(project.details.built, language)}</dd></div>
                <div><dt>${labels.works}</dt><dd>${localized(project.details.works, language)}</dd></div>
                <div><dt>${labels.proves}</dt><dd>${localized(project.details.proves, language)}</dd></div>
            </dl>
            <div class="project-tech" aria-label="${labels.tech}">
                ${project.technologies.map((technology) => `<span>${technology}</span>`).join("")}
            </div>
        </div>
    `;
}

function closeProjectDetail({ restoreFocus = true, updateHash = true } = {}) {
    const panel = document.querySelector("[data-project-detail-panel]");
    if (!panel || panel.hidden) return;

    panel.hidden = true;
    panel.removeAttribute("data-active-project");
    clearChildren(document.querySelector("[data-project-detail-content]"));
    document.querySelectorAll("[data-project-toggle]").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
    });

    if (updateHash && window.location.hash.startsWith("#project-")) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }

    if (restoreFocus && lastProjectTrigger) {
        lastProjectTrigger.focus({ preventScroll: true });
    }
}

function openProjectDetail(projectId, { updateHash = true, focusPanel = true } = {}) {
    const language = normalizeLanguage(document.documentElement.lang);
    const project = PRIMARY_PROJECTS.find((item) => item.id === projectId);
    const panel = document.querySelector("[data-project-detail-panel]");
    const content = document.querySelector("[data-project-detail-content]");
    if (!project || !panel || !content) return;

    clearChildren(content);
    content.innerHTML = projectDetailMarkup(project, language);
    panel.hidden = false;
    panel.dataset.activeProject = project.id;

    document.querySelectorAll("[data-project-toggle]").forEach((button) => {
        const isActive = button.dataset.projectToggle === project.id;
        button.setAttribute("aria-expanded", String(isActive));
        if (isActive) lastProjectTrigger = button;
    });

    if (updateHash) {
        window.history.replaceState(null, "", `#project-${project.id}`);
    }

    if (focusPanel) {
        panel.focus({ preventScroll: true });
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
}

function renderLabGallery(language) {
    const gallery = document.querySelector("[data-lab-gallery]");
    if (!gallery) return;
    clearChildren(gallery);

    SECONDARY_PROJECTS.forEach((project) => {
        const article = document.createElement("article");
        article.className = "lab-card";
        article.innerHTML = `
            <img src="${project.image}" alt="" loading="lazy">
            <div>
                <h3>${project.title}</h3>
                <p>${localized(project.text, language)}</p>
            </div>
        `;
        gallery.appendChild(article);
    });
}

function renderTimeline(language) {
    const timeline = document.querySelector("[data-career-timeline]");
    if (!timeline) return;
    clearChildren(timeline);

    CAREER_TIMELINE.forEach((entry) => {
        const article = document.createElement("article");
        article.innerHTML = `
            <time>${entry.period}</time>
            <h3>${localized(entry.title, language)}</h3>
            <p>${localized(entry.text, language)}</p>
            <strong>${localized(entry.place, language)}</strong>
        `;
        timeline.appendChild(article);
    });
}

function renderSkills(language) {
    const grid = document.querySelector("[data-skills-grid]");
    if (!grid) return;
    clearChildren(grid);

    SKILL_GROUPS.forEach((group) => {
        const article = document.createElement("article");
        article.innerHTML = `
            <span>${localized(group.meta, language)}</span>
            <h3>${localized(group.title, language)}</h3>
            <ul>${group.items.map((item) => `<li>${item}</li>`).join("")}</ul>
        `;
        grid.appendChild(article);
    });
}

function renderPortfolio(language) {
    renderProjects(language);
    renderLabGallery(language);
    renderTimeline(language);
    renderSkills(language);

    const activeProject = document.querySelector("[data-project-detail-panel]")?.dataset.activeProject;
    if (activeProject) {
        openProjectDetail(activeProject, { updateHash: false, focusPanel: false });
    }
}

function initProjectInteractions() {
    document.addEventListener("click", (event) => {
        const toggle = event.target.closest("[data-project-toggle]");
        if (toggle) {
            const isOpen = toggle.getAttribute("aria-expanded") === "true";
            if (isOpen) {
                closeProjectDetail();
            } else {
                openProjectDetail(toggle.dataset.projectToggle);
            }
        }

        if (event.target.closest("[data-project-detail-close]")) {
            closeProjectDetail();
        }
    });

    window.addEventListener("hashchange", () => {
        const match = window.location.hash.match(/^#project-(.+)$/);
        if (match) {
            openProjectDetail(match[1], { updateHash: false });
        }
    });
}
```

Expected: all portfolio sections can render without string concatenation outside controlled templates.

- [ ] **Step 7: Call rendering from language application**

At the end of `applyLanguage(language)`, before `window.localStorage.setItem(...)`, add:

```javascript
renderPortfolio(normalized);
```

Expected: switching language updates static shell text and rendered data-driven content.

- [ ] **Step 8: Initialize project interactions**

In the `DOMContentLoaded` block, after language initialization, add:

```javascript
initProjectInteractions();

const initialProjectMatch = window.location.hash.match(/^#project-(.+)$/);
if (initialProjectMatch) {
    window.requestAnimationFrame(() => {
        openProjectDetail(initialProjectMatch[1], { updateHash: false });
    });
}
```

Expected: project detail buttons and direct `#project-...` links work.

- [ ] **Step 9: Run tests and confirm script-related failures shrink**

Run:

```powershell
node --test test\about-page.test.js
```

Expected: still FAIL until CSS and guidance updates are complete, but project data and interaction tests should pass.

---

### Task 5: Style The Projects-First Layout

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Add project layout variables**

Inside `:root`, add:

```css
--project-card-bg: rgba(11, 18, 32, 0.82);
--project-card-border: rgba(255, 255, 255, 0.12);
--project-radius: 0.5rem;
--accent-home: #66e3ff;
--accent-ai: #ffd166;
--accent-cyber: #ff4f5f;
--accent-infra: #8fe388;
--accent-product: #c9b8ff;
```

Expected: project accents are varied and not a single blue/purple palette.

- [ ] **Step 2: Add project section styles**

Add:

```css
.project-surface {
    grid-column: 1 / -1;
    display: grid;
    gap: clamp(1rem, 2vw, 1.5rem);
}

.project-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: clamp(1rem, 2vw, 1.35rem);
}

.project-card,
.lab-card,
.skills-grid article {
    border: 1px solid var(--project-card-border);
    border-radius: var(--project-radius);
    background: var(--project-card-bg);
    overflow: hidden;
    min-width: 0;
}

.project-card {
    display: grid;
    grid-template-rows: minmax(13rem, 15rem) 1fr;
}

.project-media {
    position: relative;
    min-height: 13rem;
    background: rgba(255, 255, 255, 0.04);
}

.project-media img,
.lab-card img,
.project-detail-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.project-card-body {
    display: grid;
    align-content: start;
    gap: 0.85rem;
    padding: clamp(1rem, 2vw, 1.3rem);
}

.project-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    color: var(--muted);
    font-size: 0.78rem;
}

.project-card h3,
.lab-card h3 {
    margin: 0;
    font-size: clamp(1.15rem, 1.7vw, 1.45rem);
    letter-spacing: 0;
}

.project-card p,
.lab-card p {
    margin: 0;
    color: var(--muted);
    line-height: 1.65;
}

.project-chips,
.project-tech {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
}

.project-chip,
.project-tech span {
    display: inline-flex;
    align-items: center;
    min-height: 1.75rem;
    padding: 0.25rem 0.55rem;
    border: 1px solid rgba(255, 255, 255, 0.13);
    border-radius: 999px;
    color: var(--text);
    background: rgba(255, 255, 255, 0.05);
    font-size: 0.76rem;
}

.project-chip-smartHome { border-color: color-mix(in srgb, var(--accent-home), transparent 55%); }
.project-chip-ai { border-color: color-mix(in srgb, var(--accent-ai), transparent 50%); }
.project-chip-cyber { border-color: color-mix(in srgb, var(--accent-cyber), transparent 50%); }
.project-chip-infra { border-color: color-mix(in srgb, var(--accent-infra), transparent 55%); }
.project-chip-product { border-color: color-mix(in srgb, var(--accent-product), transparent 55%); }

.project-more {
    justify-self: start;
    margin-top: 0.2rem;
}

[dir="rtl"] .project-more {
    justify-self: end;
}
```

Expected: project cards render as compact, stable, readable cards.

- [ ] **Step 3: Add inline detail panel styles**

Add:

```css
.project-detail-panel {
    position: relative;
    display: grid;
    grid-template-columns: minmax(15rem, 0.8fr) minmax(0, 1.2fr);
    gap: clamp(1rem, 3vw, 2rem);
    padding: clamp(1rem, 3vw, 2rem);
    border: 1px solid rgba(102, 227, 255, 0.22);
    border-radius: var(--project-radius);
    background: rgba(6, 12, 24, 0.94);
    box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.28);
}

.project-detail-panel[hidden] {
    display: none;
}

.project-detail-close {
    position: absolute;
    inset-block-start: 0.85rem;
    inset-inline-end: 0.85rem;
    z-index: 2;
}

.icon-button {
    width: 2.35rem;
    height: 2.35rem;
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
    color: var(--text);
    cursor: pointer;
}

.project-detail-media {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.75rem;
    align-content: start;
}

.project-detail-media img {
    aspect-ratio: 4 / 3;
    border-radius: 0.45rem;
}

.project-detail-copy {
    display: grid;
    gap: 1rem;
}

.project-detail-copy h3 {
    margin: 0;
    font-size: clamp(1.6rem, 3vw, 2.35rem);
    letter-spacing: 0;
}

.project-detail-kicker {
    color: var(--accent-2);
    margin: 0;
    font-size: 0.85rem;
}

.project-detail-copy dl {
    display: grid;
    gap: 0.9rem;
    margin: 0;
}

.project-detail-copy dt {
    color: var(--text);
    font-weight: 700;
    margin-bottom: 0.25rem;
}

.project-detail-copy dd {
    color: var(--muted);
    margin: 0;
    line-height: 1.7;
}
```

Expected: expanded project details are visible, focused, and not nested inside card UI.

- [ ] **Step 4: Add lab gallery and skills styles**

Add:

```css
.lab-gallery,
.skills-grid {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.85rem;
}

.lab-card {
    display: grid;
    grid-template-columns: 7rem minmax(0, 1fr);
    min-height: 7rem;
}

.lab-card img {
    min-height: 100%;
}

.lab-card div,
.skills-grid article {
    padding: 1rem;
}

.skills-grid article {
    display: grid;
    gap: 0.65rem;
}

.skills-grid span {
    color: var(--accent-2);
    font-size: 0.82rem;
}

.skills-grid ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    list-style: none;
    margin: 0;
    padding: 0;
}

.skills-grid li {
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 999px;
    padding: 0.25rem 0.55rem;
    color: var(--muted);
    font-size: 0.78rem;
}
```

Expected: secondary labs and skills are compact and scannable.

- [ ] **Step 5: Make hero and character less dominant**

Adjust existing character/hero CSS:

```css
.cinematic-hero {
    min-height: min(74svh, 44rem);
    padding-block: clamp(6rem, 12vh, 8rem) clamp(2rem, 5vh, 3.5rem);
}

.character-guide {
    opacity: 0.55;
    pointer-events: none;
}

body.is-character-docked .character-guide {
    opacity: 0.34;
}
```

Expected: the first project section becomes the main visual signal, while the rabbit remains present but secondary.

- [ ] **Step 6: Add responsive rules**

Inside the existing `@media (max-width: 1180px)` block, add:

```css
.project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.project-detail-panel {
    grid-template-columns: 1fr;
}
```

Inside the existing `@media (max-width: 720px)` block, add:

```css
.project-grid,
.lab-gallery,
.skills-grid {
    grid-template-columns: 1fr;
}

.project-card {
    grid-template-rows: minmax(11rem, 13rem) 1fr;
}

.lab-card {
    grid-template-columns: 5.5rem minmax(0, 1fr);
}

.project-detail-panel {
    padding: 1rem;
}

.project-detail-media {
    grid-template-columns: 1fr;
}

.project-card h3,
.lab-card h3,
.skills-grid h3 {
    overflow-wrap: anywhere;
}
```

Expected: no card text or controls overflow on mobile.

- [ ] **Step 7: Run tests**

Run:

```powershell
node --test test\about-page.test.js
```

Expected: mostly PASS. Remaining failures should point to `PROJECT_GUIDANCE.md` not being updated or small string/test mismatches.

---

### Task 6: Update Project Guidance

**Files:**
- Modify: `PROJECT_GUIDANCE.md`

- [ ] **Step 1: Update the content structure section**

Replace the existing `## תוכן ומבנה` bullet list with:

```markdown
## תוכן ומבנה

הכיוון המאושר מ-2026-07-28 הוא Projects First.

האתר בנוי סביב:

- Hero קצר שמזהה את רותם ומוביל מיד ל-Projects.
- `Projects`: שישה פרויקטים ראשיים עם כפתור הרחבה לכל פרויקט:
  - Home Assistant + Maya
  - Maya WhatsApp AI Agent
  - Local LLM / Cyber Agent
  - ROTEMZ Scanner / RedLab
  - Zacaim WiFi / Raspberry Pi Lab
  - mon / Private Control Center Labs
- `Lab Gallery`: פרויקטים משניים כמו RoteMGPT, OpenAI Usage, Android Lab, משחקים, Apartment Plan App, AI Super-Analyst, Sale-ים וכלי Agent.
- `Timeline`: מה רותם עשה משנה לשנה ואיפה, לפי קורות החיים.
- `Courses & Skills`: קורסים, הסמכות וקבוצות ידע.
- `Contact`: אימייל ו-LinkedIn בלבד.
```

- [ ] **Step 2: Update the sources section**

In `## מקורות מידע`, replace the LinkedIn bullet with:

```markdown
- LinkedIn נגיש לאחר התחברות המשתמש בדפדפן הפנימי ב-2026-07-28. נאספו 12 פוסטים ו-13 תמונות לתיקיית brainstorm מקומית. בפרודקשן משתמשים רק בעותקים מקומיים תחת `assets/projects/`, לא ב-hotlinks ל-`media.licdn.com`.
```

Expected: future agents know LinkedIn was available and extracted for this redesign.

- [ ] **Step 3: Add a short implementation note**

Before `## פיתוח ופרסום`, add:

```markdown
## הערת יישום

התוכן של הפרויקטים, ציר הזמן והכישורים מנוהל ב-`script.js` כמבני נתונים ציבוריים ובטוחים לפרסום. `index.html` מספק shell סטטי ו-containers, ו-`script.js` מרנדר את הכרטיסים לפי השפה הפעילה.
```

Expected: guidance matches the chosen architecture.

- [ ] **Step 4: Commit content implementation**

Run:

```powershell
node --test test\about-page.test.js
git diff --check
git add index.html script.js styles.css PROJECT_GUIDANCE.md
git commit -m "feat: rebuild about site around projects"
```

Expected:

- `node --test` PASS.
- `git diff --check` has no output.
- Commit excludes `.superpowers/` and `assets/3d/night-city-resident.glb`.

---

### Task 7: Browser QA And Polish

**Files:**
- Modify only if QA finds issues: `index.html`, `styles.css`, `script.js`

- [ ] **Step 1: Start a local static server**

Run:

```powershell
python -m http.server 4173
```

Expected: the site is available at `http://localhost:4173/`.

If port 4173 is busy, use:

```powershell
python -m http.server 4174
```

- [ ] **Step 2: Check desktop layout**

Open:

```text
http://localhost:4173/
```

Expected at desktop width:

- Hero is compact.
- The Projects section is visible quickly.
- Project cards do not overlap the character stage.
- Project images render.
- Project titles and buttons fit.
- The rabbit is present but not the main subject.

- [ ] **Step 3: Check project detail interaction**

Click each `הרחבה` button.

Expected:

- Detail panel opens below the grid.
- Button `aria-expanded` becomes `true`.
- URL hash becomes `#project-<project-id>`.
- Close button hides the panel and returns focus.
- Switching language while a detail is open rerenders the same detail in the new language.

- [ ] **Step 4: Check mobile layout**

Resize to a mobile viewport around `390x844`.

Expected:

- One-column project cards.
- No text overlap.
- Mobile dock links to Projects and Timeline.
- Hero text remains readable.
- Character stage does not cover buttons or card text.

- [ ] **Step 5: Fix any QA issues**

If text or media overlaps, prefer CSS constraints:

```css
overflow-wrap: anywhere;
min-width: 0;
max-width: 100%;
aspect-ratio: 4 / 3;
```

If a LinkedIn image exposes private information, remove that image from the project data and replace it with:

```javascript
image: "assets/projects/home-assistant-wall-panel.png"
```

Expected: layout is stable and public-safe.

- [ ] **Step 6: Run final verification**

Run:

```powershell
node --test test\about-page.test.js
git diff --check
git status --short
```

Expected:

- Tests pass.
- Diff check has no output.
- Status shows only intentional files.
- `assets/3d/night-city-resident.glb` may still appear untracked; do not add it.

- [ ] **Step 7: Commit QA polish if needed**

If Task 7 changed files, run:

```powershell
git add index.html script.js styles.css
git commit -m "fix: polish projects-first about layout"
```

Expected: commit succeeds with only QA-related files.

---

## Self-Review

Spec coverage:

- Projects-first hero and navigation: Task 3.
- Six primary project cards and inline detail panels: Tasks 3 and 4.
- LinkedIn images copied locally: Task 2.
- Secondary lab projects: Task 4.
- Year-by-year CV timeline: Task 4.
- Courses and knowledge groups: Task 4.
- Safety and redaction: Tasks 1, 4, 6, and 7.
- Overlap/mobile layout: Tasks 5 and 7.

Placeholder scan:

- No `TBD`, `TODO`, or empty implementation slots are intentionally left in this plan.
- Deferred rabbit replacement is out of scope and is not required for this implementation.

Type consistency:

- Project IDs in tests match `PRIMARY_PROJECTS`.
- `data-project-grid`, `data-project-detail-panel`, `data-project-detail-content`, and `data-project-detail-close` are created in `index.html` and used in `script.js`.
- `renderPortfolio(normalized)` is called from `applyLanguage()`, so language changes update generated content.
