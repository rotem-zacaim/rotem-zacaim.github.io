# About Rotem Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing static profile site into a bilingual Hebrew-first `about.rotem-dev.org` business-card page that leads with security/infrastructure credibility and presents Maya as Rotem's AI lab proof.

**Architecture:** Keep the current static site architecture (`index.html`, `styles.css`, `script.js`) and replace the content system inside it. Add a small Node test file that verifies required sections, bilingual keys, Hebrew default metadata, safety constraints, and responsive/accessibility hooks before browser QA.

**Tech Stack:** Plain HTML, CSS, JavaScript, Node.js built-in test runner, GitHub Pages compatible static hosting.

---

## File Structure

- Modify `index.html`
  - Set Hebrew default `lang="he"` and `dir="rtl"`.
  - Update SEO/open graph metadata for `about.rotem-dev.org`.
  - Replace the English-only nav and page sections with approved Hebrew-first content.
  - Add `data-i18n` keys for all visible translatable text.
  - Add a keyboard-accessible language toggle.
  - Keep the existing assistant SVG/widget unless testing shows it harms accessibility or mobile layout.

- Modify `styles.css`
  - Add RTL/LTR-aware layout rules.
  - Restyle the page into a restrained operator profile, not a noisy cyber poster.
  - Add language toggle styling.
  - Add compact cards/rows for capabilities, Maya lab systems, experience, certifications, and contact.
  - Preserve existing mobile-safe and reduced-motion concepts.

- Modify `script.js`
  - Add an `I18N` dictionary for Hebrew and English.
  - Add `applyLanguage(language)` to update text, document language/direction, metadata, nav labels, assistant copy, and local storage.
  - Make reveal/nav/assistant behavior re-run safely after the language state is applied.
  - Keep the existing canvas/assistant code unless it conflicts with mobile or reduced-motion behavior.

- Create `test/about-page.test.js`
  - Static checks over `index.html`, `styles.css`, and `script.js`.
  - Verify content contract from the design spec.
  - Verify no obvious secrets or private operational values were published.

- Do not modify or commit `SITE_SPEC_HE.md` unless the user explicitly asks. It was already untracked before this plan.

---

### Task 1: Add Static Contract Tests

**Files:**
- Create: `test/about-page.test.js`

- [ ] **Step 1: Create the test directory**

Run:

```powershell
New-Item -ItemType Directory -Force -Path test
```

Expected: `test` exists.

- [ ] **Step 2: Write the failing test file**

Create `test/about-page.test.js` with this complete content:

```javascript
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");
const js = fs.readFileSync(path.join(root, "script.js"), "utf8");

function dataI18nKeys(markup) {
  return Array.from(markup.matchAll(/data-i18n="([^"]+)"/g)).map((match) => match[1]);
}

test("page defaults to accessible Hebrew RTL", () => {
  assert.match(html, /<html[^>]+lang="he"[^>]+dir="rtl"/);
  assert.match(html, /<a class="skip-link" href="#main-content"[^>]*data-i18n="skipLink"/);
  assert.match(html, /aria-label="[^"]*שפה|aria-label="Language"/);
  assert.match(html, /data-language-toggle/);
});

test("approved sections exist in the page", () => {
  for (const sectionId of [
    "overview",
    "profile",
    "maya-lab",
    "systems",
    "experience",
    "certifications",
    "contact",
  ]) {
    assert.match(html, new RegExp(`id="${sectionId}"`), `missing section ${sectionId}`);
  }
});

test("Maya lab public-safe content is represented", () => {
  for (const phrase of [
    "Maya AI Lab",
    "WhatsApp",
    "RoteMGPT",
    "Home Assistant",
    "Android Lab",
    "RedLab",
    "Cloudflare",
    "מודלים מקומיים",
    "מעבדה סגורה",
  ]) {
    assert.match(html + js, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});

test("all data-i18n keys have Hebrew and English translations", () => {
  const keys = [...new Set(dataI18nKeys(html))];
  assert.ok(keys.length > 30, "expected a real translation surface");

  for (const key of keys) {
    assert.match(js, new RegExp(`${key}:\\s*"`), `missing translation key ${key}`);
  }

  assert.match(js, /const I18N = \{/);
  assert.match(js, /he:\s*\{/);
  assert.match(js, /en:\s*\{/);
  assert.match(js, /function applyLanguage/);
});

test("page avoids publishing secrets or sensitive operational internals", () => {
  const combined = `${html}\n${js}`;
  const forbidden = [
    /OPENAI_API_KEY/i,
    /HOME_ASSISTANT_TOKEN/i,
    /GOOGLE_MAPS_API_KEY/i,
    /credentials\.google\.json/i,
    /token\.google\.json/i,
    /ALLOWED_PHONE_NUMBERS/i,
    /120363\d+@g\.us/i,
    /972\d{8,}@c\.us/i,
    /PRIVATE KEY/i,
  ];

  for (const pattern of forbidden) {
    assert.doesNotMatch(combined, pattern);
  }
});

test("styles include responsive, RTL, and reduced-motion support", () => {
  assert.match(css, /\[dir="rtl"\]/);
  assert.match(css, /\[dir="ltr"\]/);
  assert.match(css, /@media\s*\(max-width:\s*760px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.language-toggle/);
});
```

- [ ] **Step 3: Run the test and verify it fails for the current site**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: FAIL. The current site defaults to English and does not yet contain the approved bilingual contract.

- [ ] **Step 4: Commit the failing contract test**

Run:

```powershell
git add test/about-page.test.js
git commit -m "test: add about page contract checks"
```

Expected: commit succeeds. Do not add `SITE_SPEC_HE.md`.

---

### Task 2: Update Document Metadata And Header Contract

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update the document element and metadata**

Replace the opening `<html>` and the main SEO metadata in `index.html` with:

```html
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
        name="description"
        content="רותם זכאים הוא אנליסט אבטחת מידע ותשתיות שבונה כלי AI אופרטיביים, כולל מעבדת Maya המחברת WhatsApp, מודלים מקומיים, ניטור, בית חכם ו-Cloudflare."
        data-meta-description
    >
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#07101d">
    <meta name="color-scheme" content="dark">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://about.rotem-dev.org/">
    <meta property="og:title" content="רותם זכאים | אבטחת מידע, תשתיות ו-AI אופרטיבי" data-og-title>
    <meta
        property="og:description"
        content="פרופיל מקצועי בעברית: Security Operations, תשתיות, SIEM, Cloudflare, ומעבדת AI אישית בשם Maya."
        data-og-description
    >
    <meta property="og:site_name" content="Rotem Zacaim">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:title" content="רותם זכאים | אבטחת מידע, תשתיות ו-AI אופרטיבי" data-twitter-title>
    <meta
        name="twitter:description"
        content="Security and infrastructure analyst building operational AI tooling."
        data-twitter-description
    >
    <title data-page-title>רותם זכאים | אבטחת מידע, תשתיות ו-AI אופרטיבי</title>
    <link rel="canonical" href="https://about.rotem-dev.org/">
```

Keep the existing favicon, font links, startup script, stylesheet link, and script link after this block.

- [ ] **Step 2: Update the boot screen copy with translatable labels**

In the boot screen, replace visible English text with Hebrew defaults and `data-i18n` keys:

```html
<p class="boot-screen-kicker" data-i18n="bootKicker">טעינת מערכת</p>
<p class="boot-screen-stamp" data-boot-stamp>INIT</p>
<p class="boot-screen-label" data-i18n="bootLabel">רותם זכאים / about</p>
<h2 data-i18n="bootTitle">מכין פרופיל, מעבדה וקישורי קשר.</h2>
<p class="boot-screen-copy" data-boot-copy data-i18n="bootCopy">מסדר את תמונת המצב לפני פתיחה.</p>
```

Update boot rows:

```html
<span data-i18n="bootStepShell">בדיקת ממשק</span>
<span data-i18n="bootStepFonts">טעינת טיפוגרפיה</span>
<span data-i18n="bootStepAmbient">כיול רקע</span>
<span data-i18n="bootStepProfile">פרופיל מוכן</span>
```

- [ ] **Step 3: Run the contract test**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: still FAIL because the sections and translation dictionary are not implemented yet.

---

### Task 3: Replace Header Navigation And Language Toggle

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`

- [ ] **Step 1: Replace the topbar HTML**

Replace the current `<header class="topbar" id="home">...</header>` with:

```html
<header class="topbar" id="home">
    <a class="brand" href="#home" data-i18n="brand">רותם זכאים</a>
    <nav class="topnav" aria-label="ניווט ראשי" data-i18n-attr="aria-label:primaryNavLabel">
        <a href="#overview" data-i18n="navOverview">פתיחה</a>
        <a href="#profile" data-i18n="navProfile">יכולות</a>
        <a href="#maya-lab" data-i18n="navMaya">Maya AI Lab</a>
        <a href="#systems" data-i18n="navSystems">מערכות</a>
        <a href="#experience" data-i18n="navExperience">ניסיון</a>
        <a href="#contact" data-i18n="navContact">קשר</a>
    </nav>
    <div class="topbar-actions">
        <button
            class="language-toggle"
            type="button"
            data-language-toggle
            aria-label="Switch to English"
            data-i18n-attr="aria-label:languageToggleLabel"
        >
            <span data-language-current>עברית</span>
            <span aria-hidden="true">/</span>
            <span data-language-next>English</span>
        </button>
        <a class="topbar-link" href="mailto:Rotemvnkll@gmail.com" data-i18n="topbarContact">יצירת קשר</a>
    </div>
</header>
```

- [ ] **Step 2: Add language toggle CSS**

Add this near the existing `.topbar` and `.topnav` rules in `styles.css`:

```css
.topbar-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.language-toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 2.5rem;
    padding: 0 0.85rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(11, 21, 33, 0.76);
    color: var(--text);
    font: inherit;
    font-size: 0.82rem;
    cursor: pointer;
}

.language-toggle:hover,
.language-toggle:focus-visible {
    border-color: var(--accent);
    outline: none;
    box-shadow: 0 0 0 3px rgba(99, 237, 216, 0.14);
}

[dir="rtl"] .topnav,
[dir="rtl"] .topbar-actions {
    direction: rtl;
}

[dir="ltr"] .topnav,
[dir="ltr"] .topbar-actions {
    direction: ltr;
}
```

- [ ] **Step 3: Add language query selectors to script**

Near the top of `script.js`, add:

```javascript
const languageToggle = document.querySelector("[data-language-toggle]");
const languageCurrent = document.querySelector("[data-language-current]");
const languageNext = document.querySelector("[data-language-next]");
const translatedNodes = Array.from(document.querySelectorAll("[data-i18n]"));
const translatedAttributeNodes = Array.from(document.querySelectorAll("[data-i18n-attr]"));
```

- [ ] **Step 4: Run the contract test**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: still FAIL because `I18N` and final sections are not complete.

---

### Task 4: Replace Main Sections With Approved Content

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `<main id="main-content">...</main>` section content**

Keep the `<main id="main-content">` wrapper. Replace everything inside it with this structure:

```html
<section class="hero section" id="overview">
    <div class="hero-copy" data-reveal>
        <p class="eyebrow" data-i18n="heroEyebrow">Security Operations + AI Lab</p>
        <h1 data-i18n="heroTitle">אנליסט אבטחת מידע ותשתיות שבונה כלי AI אופרטיביים</h1>
        <p class="lead" data-i18n="heroLead">
            אני רותם זכאים, עובד בעולמות אבטחת מידע, תפעול תשתיות וחקירת תקלות בארגונים גדולים, ובמקביל בונה מעבדת AI אישית שמחברת WhatsApp, מודלים מקומיים, ניטור, בית חכם ו-Cloudflare למערכת אחת.
        </p>

        <ul class="hero-proof" aria-label="מוקדי התמחות" data-i18n-attr="aria-label:heroProofLabel">
            <li data-i18n="heroProofSecurity">Security Operations</li>
            <li data-i18n="heroProofInfra">תשתיות, WAF, SSL ו-Cloudflare</li>
            <li data-i18n="heroProofAi">AI agents ומודלים מקומיים</li>
        </ul>

        <div class="hero-actions">
            <a class="button button-primary" href="#maya-lab" data-i18n="heroPrimaryCta">לראות את מעבדת מאיה</a>
            <a
                class="button button-secondary"
                href="https://www.linkedin.com/in/rotem-zacaim-b4a709223/"
                target="_blank"
                rel="noopener noreferrer"
                data-i18n="heroSecondaryCta"
            >
                LinkedIn / יצירת קשר
            </a>
        </div>

        <ul class="hero-tags" aria-label="טכנולוגיות מרכזיות" data-i18n-attr="aria-label:heroTagsLabel">
            <li>Splunk</li>
            <li>Check Point</li>
            <li>Imperva</li>
            <li>F5</li>
            <li>CyberArk</li>
            <li>Cloudflare</li>
            <li>Node.js</li>
            <li>llama.cpp</li>
        </ul>
    </div>

    <aside class="hero-panel">
        <div class="command-card card" data-reveal>
            <div class="panel-topline">
                <span class="status-pill" data-i18n="heroPanelStatus">Operator profile</span>
                <span class="panel-label">about.rotem-dev.org</span>
            </div>
            <div class="console-shell" aria-label="תמונת פרופיל" data-i18n-attr="aria-label:consoleLabel">
                <div class="console-chrome">
                    <div class="console-dots" aria-hidden="true"><span></span><span></span><span></span></div>
                    <p class="console-path">ops://rotem/about</p>
                </div>
                <div class="console-body">
                    <p class="console-line"><span class="console-prompt">&gt;</span> profile.focus()</p>
                    <p class="console-output" data-i18n="consoleOne">אבטחת מידע, תשתיות, ניטור ותגובה בסביבות אמיתיות.</p>
                    <p class="console-line"><span class="console-prompt">&gt;</span> lab.proof()</p>
                    <p class="console-output" data-i18n="consoleTwo">Maya: סוכן WhatsApp עם כלים, זיכרון, מודלים מקומיים ושליטה בתשתיות.</p>
                    <p class="console-line"><span class="console-prompt">&gt;</span> mode</p>
                    <p class="console-output accent-output" data-i18n="consoleThree">observe / validate / automate / report</p>
                </div>
            </div>
        </div>
    </aside>
</section>

<section class="signal-strip" aria-label="זרם יכולות מרכזי" data-i18n-attr="aria-label:signalLabel" data-reveal>
    <div class="signal-track">
        <div class="signal-group">
            <span>Splunk</span><span>SIEM</span><span>WAF</span><span>SSL / TLS</span><span>Cloudflare</span><span>Linux</span><span>Windows</span><span>Node.js</span><span>Home Assistant</span><span>RoteMGPT</span><span>RedLab</span>
        </div>
        <div class="signal-group" aria-hidden="true">
            <span>Splunk</span><span>SIEM</span><span>WAF</span><span>SSL / TLS</span><span>Cloudflare</span><span>Linux</span><span>Windows</span><span>Node.js</span><span>Home Assistant</span><span>RoteMGPT</span><span>RedLab</span>
        </div>
    </div>
</section>

<section class="section" id="profile">
    <div class="section-heading" data-reveal>
        <p class="eyebrow" data-i18n="profileEyebrow">Core profile</p>
        <h2 data-i18n="profileTitle">מה אני יודע לפתור בפועל</h2>
        <p class="section-copy" data-i18n="profileCopy">החוזקה שלי יושבת בחיבור בין אבטחת מידע, תשתיות, ניטור, לוגים, תעבורה וכלים שמקצרים עבודה.</p>
    </div>
    <div class="feature-grid capability-grid">
        <article class="feature-card card" data-reveal>
            <p class="feature-index">01</p>
            <h3 data-i18n="capabilityOneTitle">חקירת אירועים ולוגים</h3>
            <p data-i18n="capabilityOneCopy">עבודה יומיומית עם Splunk, ניתוח לוגים, תעבורת רשת, תקלות שירות וזיהוי חריגות.</p>
        </article>
        <article class="feature-card card" data-reveal>
            <p class="feature-index">02</p>
            <h3 data-i18n="capabilityTwoTitle">Edge security ותשתיות</h3>
            <p data-i18n="capabilityTwoCopy">ניסיון עם WAF, Proxy, Load Balancer, Check Point, Imperva, F5, CyberArk, FireGlass ו-Cloudflare.</p>
        </article>
        <article class="feature-card card" data-reveal>
            <p class="feature-index">03</p>
            <h3 data-i18n="capabilityThreeTitle">SSL, Gateway ושרתים</h3>
            <p data-i18n="capabilityThreeCopy">תחקור תקלות ב-Windows/Linux, תעודות SSL, IIS, API Gateway, IBM DataPower וזמינות אתרים.</p>
        </article>
    </div>
</section>

<section class="section maya-lab-section" id="maya-lab">
    <div class="section-heading" data-reveal>
        <p class="eyebrow" data-i18n="mayaEyebrow">Maya AI Lab</p>
        <h2 data-i18n="mayaTitle">מעבדת AI אישית שמחברת מודלים, WhatsApp ותשתיות</h2>
        <p class="section-copy" data-i18n="mayaCopy">מאיה היא סוכן אישי בעברית שמחבר שיחה טבעית לכלים אמיתיים: זיכרון, יומן, קול, תמונות, בית חכם, ניטור, Cloudflare ומודלים מקומיים.</p>
    </div>
    <div class="lab-shell card" data-reveal>
        <div class="lab-map" aria-hidden="true">
            <span>WhatsApp</span><span>Memory</span><span>RoteMGPT</span><span>Home Assistant</span><span>RedLab</span><span>Cloudflare</span>
        </div>
        <div class="lab-copy">
            <h3 data-i18n="mayaClosedLabTitle">מודלים מקומיים במסגרת מעבדה סגורה</h3>
            <p data-i18n="mayaClosedLabCopy">הרצת מודלים מקומיים בסביבת מעבדה סגורה, ללא תלות בסינון של ספק חיצוני, לצורכי מחקר, בדיקה והבנת סיכוני AI.</p>
        </div>
    </div>
</section>

<section class="section" id="systems">
    <div class="section-heading" data-reveal>
        <p class="eyebrow" data-i18n="systemsEyebrow">Selected systems</p>
        <h2 data-i18n="systemsTitle">פרויקטים שמראים בנייה מקצה לקצה</h2>
    </div>
    <div class="systems-grid">
        <article class="system-tile card" data-reveal><h3>Maya WhatsApp Agent</h3><p data-i18n="systemWhatsapp">שיחה בעברית, tool-calling, זיכרון ארוך טווח, קול, תמונות ותזכורות.</p></article>
        <article class="system-tile card" data-reveal><h3>RoteMGPT</h3><p data-i18n="systemRoteMgpt">ממשק שיחה מול מודל מקומי OpenAI-compatible עם Markdown, copy ו-session חי.</p></article>
        <article class="system-tile card" data-reveal><h3>Home Assistant</h3><p data-i18n="systemHome">פאנל בית חכם לטאבלט, מזגן, שואב, מצלמות, תריס ותאורת שרת OpenRGB.</p></article>
        <article class="system-tile card" data-reveal><h3>RedLab</h3><p data-i18n="systemRedLab">סביבת PT מורשית עם recon, כלים allowlisted, ראיות ודוחות טכניים בעברית.</p></article>
        <article class="system-tile card" data-reveal><h3>Android Lab</h3><p data-i18n="systemAndroid">שליטה במכשיר Android מעבדה דרך ADB, scrcpy, מסך, הקלדה ופעולות מוגבלות ל-serial מאושר.</p></article>
        <article class="system-tile card" data-reveal><h3>Cloudflare Ops</h3><p data-i18n="systemCloudflare">Tunnel, Access, Browser SSH, VNC, systemd וניטור שרת מאחורי שכבת גישה מאובטחת.</p></article>
    </div>
</section>

<section class="section experience-section" id="experience">
    <div class="section-heading" data-reveal>
        <p class="eyebrow" data-i18n="experienceEyebrow">Experience</p>
        <h2 data-i18n="experienceTitle">ניסיון מקצועי ותפעולי</h2>
    </div>
    <div class="experience-layout">
        <article class="experience-card card" data-reveal>
            <div class="timeline-item"><p class="timeline-label">2023 - היום</p><h3 data-i18n="expOneTitle">אנליסט אבטחת מידע ותפעול תשתיות / מערך הדיגיטל הלאומי</h3><p data-i18n="expOneCopy">SIEM, מוצרי אבטחה, תשתיות, Cloudflare, WAF, SSL, ניטור ותחקור תקלות מקצה לקצה.</p></div>
            <div class="timeline-item"><p class="timeline-label">2021 - 2023</p><h3 data-i18n="expTwoTitle">מרכז שליטה ובקרה / משרד הבריאות</h3><p data-i18n="expTwoCopy">תמיכה טכנית ואפליקטיבית, Active Directory, הרשאות, אוטומציות ותמיכה במערכות בריאות.</p></div>
            <div class="timeline-item"><p class="timeline-label">2014 - 2017</p><h3 data-i18n="expThreeTitle">ERP SAP וניהול מלאי / צה"ל</h3><p data-i18n="expThreeCopy">תפעול SAP, ניהול מלאי ולוגיסטיקה, סיום קורס ניהול מלאי בהצטיינות.</p></div>
        </article>
        <aside class="principles-card card" id="certifications" data-reveal>
            <p class="eyebrow" data-i18n="certEyebrow">Certifications</p>
            <h3 data-i18n="certTitle">הכשרות והסמכות</h3>
            <ul class="principles-list">
                <li data-i18n="certOne">קורס מגן סייבר / ג'ון ברייס, 650 שעות</li>
                <li data-i18n="certTwo">QA תוכנה / טכניון</li>
                <li data-i18n="certThree">Cisco CCNA 200-301 Packet Tracer Labs</li>
                <li data-i18n="certFour">Applied Ethical Hacking and Rules of Engagement</li>
                <li data-i18n="certFive">Jr Penetration Tester Certificate / TryHackMe</li>
            </ul>
        </aside>
    </div>
</section>

<section class="contact-banner card" id="contact" data-reveal>
    <div>
        <p class="eyebrow" data-i18n="contactEyebrow">Contact</p>
        <h2 data-i18n="contactTitle">מחפשים אדם שמבין אבטחה, תשתיות ו-AI מעשי?</h2>
        <p class="contact-copy" data-i18n="contactCopy">אפשר לפנות אליי לשיחות על Security Operations, תשתיות, אוטומציה, AI tooling ומעבדות מחקר סגורות.</p>
    </div>
    <div class="contact-actions">
        <a class="button button-primary" href="mailto:Rotemvnkll@gmail.com" data-i18n="contactEmail">Email</a>
        <a class="button button-secondary" href="https://www.linkedin.com/in/rotem-zacaim-b4a709223/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
</section>
```

- [ ] **Step 2: Keep the existing footer and assistant widget**

Do not remove the existing `<footer>` or `<div class="assistant-widget">` yet. Update footer text in a later step if needed.

- [ ] **Step 3: Run the test**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: still FAIL because JavaScript translations are not complete.

---

### Task 5: Add Bilingual Translation System

**Files:**
- Modify: `script.js`
- Modify: `index.html`

- [ ] **Step 1: Add the `I18N` dictionary near the top of `script.js`**

Insert this after the top-level query selectors:

```javascript
const I18N = {
    he: {
        pageTitle: "רותם זכאים | אבטחת מידע, תשתיות ו-AI אופרטיבי",
        metaDescription: "רותם זכאים הוא אנליסט אבטחת מידע ותשתיות שבונה כלי AI אופרטיביים, כולל מעבדת Maya המחברת WhatsApp, מודלים מקומיים, ניטור, בית חכם ו-Cloudflare.",
        brand: "רותם זכאים",
        primaryNavLabel: "ניווט ראשי",
        languageToggleLabel: "Switch to English",
        skipLink: "דלג לתוכן",
        bootKicker: "טעינת מערכת",
        bootLabel: "רותם זכאים / about",
        bootTitle: "מכין פרופיל, מעבדה וקישורי קשר.",
        bootCopy: "מסדר את תמונת המצב לפני פתיחה.",
        bootStepShell: "בדיקת ממשק",
        bootStepFonts: "טעינת טיפוגרפיה",
        bootStepAmbient: "כיול רקע",
        bootStepProfile: "פרופיל מוכן",
        navOverview: "פתיחה",
        navProfile: "יכולות",
        navMaya: "Maya AI Lab",
        navSystems: "מערכות",
        navExperience: "ניסיון",
        navContact: "קשר",
        topbarContact: "יצירת קשר",
        heroEyebrow: "Security Operations + AI Lab",
        heroTitle: "אנליסט אבטחת מידע ותשתיות שבונה כלי AI אופרטיביים",
        heroLead: "אני רותם זכאים, עובד בעולמות אבטחת מידע, תפעול תשתיות וחקירת תקלות בארגונים גדולים, ובמקביל בונה מעבדת AI אישית שמחברת WhatsApp, מודלים מקומיים, ניטור, בית חכם ו-Cloudflare למערכת אחת.",
        heroProofLabel: "מוקדי התמחות",
        heroProofSecurity: "Security Operations",
        heroProofInfra: "תשתיות, WAF, SSL ו-Cloudflare",
        heroProofAi: "AI agents ומודלים מקומיים",
        heroPrimaryCta: "לראות את מעבדת מאיה",
        heroSecondaryCta: "LinkedIn / יצירת קשר",
        heroTagsLabel: "טכנולוגיות מרכזיות",
        heroPanelStatus: "Operator profile",
        consoleLabel: "תמונת פרופיל",
        consoleOne: "אבטחת מידע, תשתיות, ניטור ותגובה בסביבות אמיתיות.",
        consoleTwo: "Maya: סוכן WhatsApp עם כלים, זיכרון, מודלים מקומיים ושליטה בתשתיות.",
        consoleThree: "observe / validate / automate / report",
        signalLabel: "זרם יכולות מרכזי",
        profileEyebrow: "Core profile",
        profileTitle: "מה אני יודע לפתור בפועל",
        profileCopy: "החוזקה שלי יושבת בחיבור בין אבטחת מידע, תשתיות, ניטור, לוגים, תעבורה וכלים שמקצרים עבודה.",
        capabilityOneTitle: "חקירת אירועים ולוגים",
        capabilityOneCopy: "עבודה יומיומית עם Splunk, ניתוח לוגים, תעבורת רשת, תקלות שירות וזיהוי חריגות.",
        capabilityTwoTitle: "Edge security ותשתיות",
        capabilityTwoCopy: "ניסיון עם WAF, Proxy, Load Balancer, Check Point, Imperva, F5, CyberArk, FireGlass ו-Cloudflare.",
        capabilityThreeTitle: "SSL, Gateway ושרתים",
        capabilityThreeCopy: "תחקור תקלות ב-Windows/Linux, תעודות SSL, IIS, API Gateway, IBM DataPower וזמינות אתרים.",
        mayaEyebrow: "Maya AI Lab",
        mayaTitle: "מעבדת AI אישית שמחברת מודלים, WhatsApp ותשתיות",
        mayaCopy: "מאיה היא סוכן אישי בעברית שמחבר שיחה טבעית לכלים אמיתיים: זיכרון, יומן, קול, תמונות, בית חכם, ניטור, Cloudflare ומודלים מקומיים.",
        mayaClosedLabTitle: "מודלים מקומיים במסגרת מעבדה סגורה",
        mayaClosedLabCopy: "הרצת מודלים מקומיים בסביבת מעבדה סגורה, ללא תלות בסינון של ספק חיצוני, לצורכי מחקר, בדיקה והבנת סיכוני AI.",
        systemsEyebrow: "Selected systems",
        systemsTitle: "פרויקטים שמראים בנייה מקצה לקצה",
        systemWhatsapp: "שיחה בעברית, tool-calling, זיכרון ארוך טווח, קול, תמונות ותזכורות.",
        systemRoteMgpt: "ממשק שיחה מול מודל מקומי OpenAI-compatible עם Markdown, copy ו-session חי.",
        systemHome: "פאנל בית חכם לטאבלט, מזגן, שואב, מצלמות, תריס ותאורת שרת OpenRGB.",
        systemRedLab: "סביבת PT מורשית עם recon, כלים allowlisted, ראיות ודוחות טכניים בעברית.",
        systemAndroid: "שליטה במכשיר Android מעבדה דרך ADB, scrcpy, מסך, הקלדה ופעולות מוגבלות ל-serial מאושר.",
        systemCloudflare: "Tunnel, Access, Browser SSH, VNC, systemd וניטור שרת מאחורי שכבת גישה מאובטחת.",
        experienceEyebrow: "Experience",
        experienceTitle: "ניסיון מקצועי ותפעולי",
        expOneTitle: "אנליסט אבטחת מידע ותפעול תשתיות / מערך הדיגיטל הלאומי",
        expOneCopy: "SIEM, מוצרי אבטחה, תשתיות, Cloudflare, WAF, SSL, ניטור ותחקור תקלות מקצה לקצה.",
        expTwoTitle: "מרכז שליטה ובקרה / משרד הבריאות",
        expTwoCopy: "תמיכה טכנית ואפליקטיבית, Active Directory, הרשאות, אוטומציות ותמיכה במערכות בריאות.",
        expThreeTitle: "ERP SAP וניהול מלאי / צה\"ל",
        expThreeCopy: "תפעול SAP, ניהול מלאי ולוגיסטיקה, סיום קורס ניהול מלאי בהצטיינות.",
        certEyebrow: "Certifications",
        certTitle: "הכשרות והסמכות",
        certOne: "קורס מגן סייבר / ג'ון ברייס, 650 שעות",
        certTwo: "QA תוכנה / טכניון",
        certThree: "Cisco CCNA 200-301 Packet Tracer Labs",
        certFour: "Applied Ethical Hacking and Rules of Engagement",
        certFive: "Jr Penetration Tester Certificate / TryHackMe",
        contactEyebrow: "Contact",
        contactTitle: "מחפשים אדם שמבין אבטחה, תשתיות ו-AI מעשי?",
        contactCopy: "אפשר לפנות אליי לשיחות על Security Operations, תשתיות, אוטומציה, AI tooling ומעבדות מחקר סגורות.",
        contactEmail: "Email",
    },
    en: {
        pageTitle: "Rotem Zacaim | Security, Infrastructure and Operational AI",
        metaDescription: "Rotem Zacaim is a security and infrastructure analyst building operational AI tooling, including the Maya lab across WhatsApp, local models, monitoring, smart home systems and Cloudflare.",
        brand: "Rotem Zacaim",
        primaryNavLabel: "Primary navigation",
        languageToggleLabel: "מעבר לעברית",
        skipLink: "Skip to content",
        bootKicker: "System loading",
        bootLabel: "Rotem Zacaim / about",
        bootTitle: "Preparing profile, lab and contact paths.",
        bootCopy: "Staging the profile before first contact.",
        bootStepShell: "Interface check",
        bootStepFonts: "Type system",
        bootStepAmbient: "Ambient field",
        bootStepProfile: "Profile ready",
        navOverview: "Overview",
        navProfile: "Capabilities",
        navMaya: "Maya AI Lab",
        navSystems: "Systems",
        navExperience: "Experience",
        navContact: "Contact",
        topbarContact: "Contact",
        heroEyebrow: "Security Operations + AI Lab",
        heroTitle: "Security and infrastructure analyst building operational AI tooling",
        heroLead: "I am Rotem Zacaim, working across information security, infrastructure operations and real-world troubleshooting, while building a personal AI lab that connects WhatsApp, local models, monitoring, smart home systems and Cloudflare into one operating layer.",
        heroProofLabel: "Focus areas",
        heroProofSecurity: "Security Operations",
        heroProofInfra: "Infrastructure, WAF, SSL and Cloudflare",
        heroProofAi: "AI agents and local models",
        heroPrimaryCta: "Explore Maya AI Lab",
        heroSecondaryCta: "LinkedIn / Contact",
        heroTagsLabel: "Core technologies",
        heroPanelStatus: "Operator profile",
        consoleLabel: "Profile snapshot",
        consoleOne: "Security, infrastructure, monitoring and response in real environments.",
        consoleTwo: "Maya: a WhatsApp agent with tools, memory, local models and infrastructure control.",
        consoleThree: "observe / validate / automate / report",
        signalLabel: "Core capability stream",
        profileEyebrow: "Core profile",
        profileTitle: "What I solve in practice",
        profileCopy: "My strength sits where security operations, infrastructure, monitoring, logs, traffic and practical tooling meet.",
        capabilityOneTitle: "Event and log investigation",
        capabilityOneCopy: "Daily work with Splunk, log analysis, network traffic, service issues and anomaly discovery.",
        capabilityTwoTitle: "Edge security and infrastructure",
        capabilityTwoCopy: "Hands-on experience with WAF, Proxy, Load Balancer, Check Point, Imperva, F5, CyberArk, FireGlass and Cloudflare.",
        capabilityThreeTitle: "SSL, gateways and servers",
        capabilityThreeCopy: "Troubleshooting Windows/Linux, SSL certificates, IIS, API Gateway, IBM DataPower and website availability.",
        mayaEyebrow: "Maya AI Lab",
        mayaTitle: "A personal AI lab connecting models, WhatsApp and infrastructure",
        mayaCopy: "Maya is a Hebrew-first personal agent that connects natural conversation to real tools: memory, calendar, voice, images, smart home, monitoring, Cloudflare and local models.",
        mayaClosedLabTitle: "Local models inside a closed lab",
        mayaClosedLabCopy: "Running local models inside a closed lab environment, without dependency on external provider filtering, for research, testing and AI risk understanding.",
        systemsEyebrow: "Selected systems",
        systemsTitle: "Projects that prove end-to-end building",
        systemWhatsapp: "Hebrew conversation, tool calling, long-term memory, voice, images and proactive reminders.",
        systemRoteMgpt: "A chat interface for a local OpenAI-compatible model with Markdown, copy actions and live sessions.",
        systemHome: "A smart home tablet panel for AC, vacuum, cameras, shutter control and OpenRGB server lighting.",
        systemRedLab: "An authorized PT workspace with recon, allowlisted tools, evidence and Hebrew technical reports.",
        systemAndroid: "Android lab control through ADB, scrcpy, screen actions, typing and serial allowlisting.",
        systemCloudflare: "Tunnel, Access, Browser SSH, VNC, systemd and server monitoring behind a protected access layer.",
        experienceEyebrow: "Experience",
        experienceTitle: "Professional and operational experience",
        expOneTitle: "Information Security and Infrastructure Operations Analyst / National Digital Agency",
        expOneCopy: "SIEM, security products, infrastructure, Cloudflare, WAF, SSL, monitoring and end-to-end troubleshooting.",
        expTwoTitle: "Command and Control Center / Ministry of Health",
        expTwoCopy: "Technical and application support, Active Directory, permissions, automation and health-system support.",
        expThreeTitle: "ERP SAP and inventory operations / IDF",
        expThreeCopy: "SAP operations, inventory and logistics, completed inventory management training with excellence.",
        certEyebrow: "Certifications",
        certTitle: "Training and certifications",
        certOne: "Cyber Defender course / John Bryce, 650 hours",
        certTwo: "Software QA / Technion",
        certThree: "Cisco CCNA 200-301 Packet Tracer Labs",
        certFour: "Applied Ethical Hacking and Rules of Engagement",
        certFive: "Jr Penetration Tester Certificate / TryHackMe",
        contactEyebrow: "Contact",
        contactTitle: "Looking for someone who understands security, infrastructure and practical AI?",
        contactCopy: "Reach out for conversations about Security Operations, infrastructure, automation, AI tooling and closed research labs.",
        contactEmail: "Email",
    },
};
```

- [ ] **Step 2: Add language application functions**

Add this after the dictionary:

```javascript
const LANGUAGE_STORAGE_KEY = "rz-about-language";

function resolveInitialLanguage() {
    try {
        const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored === "he" || stored === "en") {
            return stored;
        }
    } catch (error) {
        // localStorage can be unavailable in restricted contexts.
    }

    return "he";
}

function setTranslatedAttributes(languagePack) {
    translatedAttributeNodes.forEach((node) => {
        const pairs = node.dataset.i18nAttr.split(",");

        pairs.forEach((pair) => {
            const [attribute, key] = pair.split(":").map((part) => part.trim());
            if (attribute && key && languagePack[key]) {
                node.setAttribute(attribute, languagePack[key]);
            }
        });
    });
}

function applyLanguage(language) {
    const nextLanguage = language === "en" ? "en" : "he";
    const languagePack = I18N[nextLanguage];
    const nextDirection = nextLanguage === "he" ? "rtl" : "ltr";

    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = nextDirection;
    document.title = languagePack.pageTitle;

    const pageTitle = document.querySelector("[data-page-title]");
    const metaDescription = document.querySelector("[data-meta-description]");
    const ogTitle = document.querySelector("[data-og-title]");
    const ogDescription = document.querySelector("[data-og-description]");
    const twitterTitle = document.querySelector("[data-twitter-title]");
    const twitterDescription = document.querySelector("[data-twitter-description]");

    if (pageTitle) pageTitle.textContent = languagePack.pageTitle;
    if (metaDescription) metaDescription.setAttribute("content", languagePack.metaDescription);
    if (ogTitle) ogTitle.setAttribute("content", languagePack.pageTitle);
    if (ogDescription) ogDescription.setAttribute("content", languagePack.metaDescription);
    if (twitterTitle) twitterTitle.setAttribute("content", languagePack.pageTitle);
    if (twitterDescription) twitterDescription.setAttribute("content", languagePack.metaDescription);

    translatedNodes.forEach((node) => {
        const key = node.dataset.i18n;
        if (languagePack[key]) {
            node.textContent = languagePack[key];
        }
    });

    setTranslatedAttributes(languagePack);

    if (languageCurrent && languageNext && languageToggle) {
        languageCurrent.textContent = nextLanguage === "he" ? "עברית" : "English";
        languageNext.textContent = nextLanguage === "he" ? "English" : "עברית";
        languageToggle.dataset.language = nextLanguage;
    }

    try {
        window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch (error) {
        // localStorage can be unavailable in restricted contexts.
    }
}

const initialLanguage = resolveInitialLanguage();
applyLanguage(initialLanguage);

if (languageToggle) {
    languageToggle.addEventListener("click", () => {
        const currentLanguage = languageToggle.dataset.language === "en" ? "en" : "he";
        applyLanguage(currentLanguage === "he" ? "en" : "he");
    });
}
```

- [ ] **Step 3: Update the skip link in HTML**

Change the skip link to:

```html
<a class="skip-link" href="#main-content" data-i18n="skipLink">דלג לתוכן</a>
```

- [ ] **Step 4: Run the contract test**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: PASS or only CSS-related FAIL if styling support is not finished.

- [ ] **Step 5: Commit the bilingual content and language system**

Run:

```powershell
git add index.html script.js
git commit -m "feat: add bilingual about page content"
```

Expected: commit succeeds.

---

### Task 6: Add Layout And Visual Polish

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Reduce overly rounded card geometry**

At `:root`, update radius tokens:

```css
--radius-xl: 8px;
--radius-lg: 8px;
--radius-md: 8px;
```

Expected: repeated cards and panels become sharper and more professional.

- [ ] **Step 2: Add profile/lab/system layout CSS**

Add this near the existing grid/card section styles:

```css
.capability-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.maya-lab-section {
    position: relative;
}

.lab-shell {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.8fr);
    gap: 1.25rem;
    align-items: center;
    padding: 1.25rem;
}

.lab-map {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
}

.lab-map span,
.system-tile {
    min-height: 5.25rem;
}

.lab-map span {
    display: grid;
    place-items: center;
    padding: 0.85rem;
    border: 1px solid var(--line);
    border-radius: 8px;
    background: rgba(99, 237, 216, 0.08);
    color: var(--text);
    text-align: center;
    font-family: "IBM Plex Mono", monospace;
    font-size: 0.82rem;
}

.lab-copy h3,
.system-tile h3 {
    margin: 0 0 0.65rem;
}

.systems-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
}

.system-tile {
    padding: 1rem;
}

.experience-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
    gap: 1rem;
    align-items: start;
}

[dir="rtl"] .console-line,
[dir="rtl"] .console-output,
[dir="rtl"] .console-path {
    direction: ltr;
    text-align: left;
}

[dir="rtl"] .section-heading,
[dir="rtl"] .hero-copy,
[dir="rtl"] .contact-banner {
    text-align: right;
}

[dir="ltr"] .section-heading,
[dir="ltr"] .hero-copy,
[dir="ltr"] .contact-banner {
    text-align: left;
}
```

- [ ] **Step 3: Add mobile layout rules**

Inside the existing `@media (max-width: 760px)` block, add:

```css
.topbar {
    align-items: stretch;
}

.topbar-actions {
    width: 100%;
    justify-content: space-between;
}

.language-toggle,
.topbar-link {
    flex: 1 1 auto;
    justify-content: center;
}

.capability-grid,
.systems-grid,
.lab-shell,
.experience-layout {
    grid-template-columns: 1fr;
}

.lab-map {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}
```

- [ ] **Step 4: Add reduced-motion support if missing**

If not already present, add:

```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

- [ ] **Step 5: Run the contract test**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: PASS.

- [ ] **Step 6: Commit styling**

Run:

```powershell
git add styles.css
git commit -m "style: polish bilingual about page layout"
```

Expected: commit succeeds.

---

### Task 7: Manual Browser QA And Fixes

**Files:**
- Modify as needed: `index.html`, `styles.css`, `script.js`

- [ ] **Step 1: Start a local static server**

Run:

```powershell
python -m http.server 4173
```

Expected: site is available at `http://localhost:4173/`.

- [ ] **Step 2: Verify Hebrew default**

Open:

```text
http://localhost:4173/
```

Expected:

- Page opens in Hebrew.
- `document.documentElement.lang` is `he`.
- `document.documentElement.dir` is `rtl`.
- No text overlaps in the hero.
- `לראות את מעבדת מאיה` scrolls to `#maya-lab`.

- [ ] **Step 3: Verify English toggle**

Click the language toggle.

Expected:

- Text switches to English.
- Page direction switches to LTR.
- Navigation remains usable.
- Console snippets remain readable.
- Refresh keeps English because of `localStorage`.

- [ ] **Step 4: Verify mobile**

Resize to about 390px width.

Expected:

- Header wraps cleanly.
- Language toggle and contact button fit.
- Hero CTA buttons fit.
- Systems cards stack.
- No horizontal scrollbar.

- [ ] **Step 5: Verify keyboard accessibility**

Use Tab from the top of the page.

Expected:

- Skip link appears.
- Language toggle receives visible focus.
- Nav links and CTAs receive visible focus.
- No keyboard trap in the assistant widget.

- [ ] **Step 6: Fix visible QA issues**

If text overlaps, add specific CSS rules. Examples:

```css
.button,
.language-toggle,
.chip-group span,
.hero-proof li {
    min-width: 0;
    overflow-wrap: anywhere;
}
```

If the assistant covers contact controls on mobile, disable it in mobile-safe mode:

```css
html.mobile-safe .assistant-widget {
    display: none;
}
```

- [ ] **Step 7: Re-run tests**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: PASS.

- [ ] **Step 8: Commit QA fixes**

Run:

```powershell
git add index.html styles.css script.js test/about-page.test.js
git commit -m "fix: complete about page browser qa"
```

Expected: commit succeeds if there were fixes. If there were no changes, skip this commit.

---

### Task 8: Final Verification And Handoff

**Files:**
- Inspect: `index.html`, `styles.css`, `script.js`, `test/about-page.test.js`

- [ ] **Step 1: Run final static tests**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: PASS.

- [ ] **Step 2: Check git status**

Run:

```powershell
git status --short
```

Expected:

- Only known pre-existing untracked `SITE_SPEC_HE.md` may remain.
- No accidental `.superpowers`, screenshots, temporary QA artifacts, or generated files are staged.

- [ ] **Step 3: Summarize deployment notes**

Final handoff should include:

- Local URL used for QA.
- Test command and result.
- Reminder that target public subdomain is `about.rotem-dev.org`.
- Files changed.
- Mention that `SITE_SPEC_HE.md` was left untouched if still untracked.

---

## Self-Review Notes

Spec coverage:

- Hebrew default and English toggle: Tasks 2, 3, 5, 7.
- Security-first positioning: Tasks 2, 4, 5.
- Maya AI Lab content: Tasks 4, 5.
- Closed local model lab wording: Tasks 4, 5.
- Experience/certification summary: Tasks 4, 5.
- Accessibility and responsive behavior: Tasks 1, 3, 6, 7.
- Public safety and no secrets: Task 1.

Placeholder scan:

- Execution steps use concrete snippets and exact commands.
- The plan avoids deferred implementation language and does not rely on vague follow-up work.

Type/name consistency:

- `data-i18n` keys in the HTML snippets match keys in the `I18N` dictionary.
- `data-language-toggle`, `data-language-current`, and `data-language-next` match the script selectors.
- Test section IDs match planned HTML section IDs.
