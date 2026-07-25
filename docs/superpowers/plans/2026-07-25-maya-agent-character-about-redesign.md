# Maya Agent Character About Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `about.rotem-dev.org` with a static, character-led Maya Agent page where the supplied rabbit character starts centered, moves aside on scroll/hover, and gives the page a living brand moment.

**Architecture:** Keep the existing GitHub Pages static architecture: `index.html`, `styles.css`, `script.js`, `CNAME`, and Node built-in tests. Add optimized character assets under `assets/`, update tests to lock the new content/motion contract, then replace the current command-profile UI with the approved fuchsia Maya Agent experience.

**Tech Stack:** Plain HTML, CSS, JavaScript, Node.js built-in test runner, static image assets, GitHub Pages.

---

## File Structure

- Create: `assets/maya-agent-source.png`  
  Stable copy of the user-provided character image.

- Create: `assets/maya-agent-cutout.png`  
  Transparent or best-effort transparent PNG used by the hero.

- Create: `assets/maya-agent-cutout.webp`  
  Optimized WebP for browsers that support it.

- Modify: `index.html`  
  Replace the visible page content with the Maya Agent sections and add character image markup.

- Modify: `styles.css`  
  Replace the old command-profile visual system with the fuchsia character-led layout and motion states.

- Modify: `script.js`  
  Keep bilingual support and add scroll/mouse character motion.

- Modify: `test/about-page.test.js`  
  Update static contracts for the new page structure, assets, motion hooks, safety checks, and bilingual keys.

## Task 1: Character Assets

**Files:**
- Create: `assets/maya-agent-source.png`
- Create: `assets/maya-agent-cutout.png`
- Create: `assets/maya-agent-cutout.webp`

- [ ] **Step 1: Create the asset directory and copy source**

Run:

```powershell
New-Item -ItemType Directory -Force -Path assets
Copy-Item -LiteralPath 'C:\Users\rotem\Downloads\Gemini_Generated_Image_tlh11vtlh11vtlh1 (1).png' -Destination 'assets\maya-agent-source.png' -Force
```

Expected: `assets/maya-agent-source.png` exists.

- [ ] **Step 2: Create a best-effort transparent cutout**

Run this PowerShell command. It uses Python/Pillow to remove the light background with a soft edge and keeps the original source untouched:

```powershell
@'
from pathlib import Path
from PIL import Image, ImageFilter

src = Path("assets/maya-agent-source.png")
out = Path("assets/maya-agent-cutout.png")

img = Image.open(src).convert("RGBA")
w, h = img.size
pixels = img.load()

border_samples = []
for x in range(0, w, max(1, w // 80)):
    border_samples.append(pixels[x, 0][:3])
    border_samples.append(pixels[x, h - 1][:3])
for y in range(0, h, max(1, h // 80)):
    border_samples.append(pixels[0, y][:3])
    border_samples.append(pixels[w - 1, y][:3])

bg = tuple(sum(channel) / len(border_samples) for channel in zip(*border_samples))

alpha = Image.new("L", (w, h), 255)
alpha_pixels = alpha.load()

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        dist = ((r - bg[0]) ** 2 + (g - bg[1]) ** 2 + (b - bg[2]) ** 2) ** 0.5
        light = (r + g + b) / 3
        edge_factor = 0
        if x < w * 0.08 or x > w * 0.92 or y < h * 0.08 or y > h * 0.92:
            edge_factor = 35
        if dist < 18 + edge_factor and light > 150:
            alpha_pixels[x, y] = 0
        elif dist < 42 + edge_factor and light > 145:
            alpha_pixels[x, y] = int((dist - 18) / 24 * 255)

alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))

img.putalpha(alpha)
img.save(out)
print(out)
'@ | python -
```

Expected: `assets/maya-agent-cutout.png` is written. Inspect visually during QA; if the cutout is not good enough, keep the source as a framed fallback and mark the asset as needing a manual/AI cutout pass.

- [ ] **Step 3: Create optimized WebP**

Run:

```powershell
@'
from PIL import Image
img = Image.open("assets/maya-agent-cutout.png").convert("RGBA")
img.save("assets/maya-agent-cutout.webp", "WEBP", quality=88, method=6)
print("assets/maya-agent-cutout.webp")
'@ | python -
```

Expected: `assets/maya-agent-cutout.webp` exists.

- [ ] **Step 4: Commit assets**

Run:

```powershell
git add assets/maya-agent-source.png assets/maya-agent-cutout.png assets/maya-agent-cutout.webp
git commit -m "feat: add maya agent character assets"
```

Expected: commit succeeds.

## Task 2: Static Contract Tests

**Files:**
- Modify: `test/about-page.test.js`

- [ ] **Step 1: Replace test contracts**

Update `test/about-page.test.js` so it verifies:

- Hebrew RTL default.
- `CNAME` remains `about.rotem-dev.org`.
- Sections: `story`, `abilities`, `projects`, `contact`.
- Character asset references: `assets/maya-agent-cutout.webp` and `assets/maya-agent-cutout.png`.
- Motion hooks: `data-character-hero`, `data-maya-character`, `MayaCharacterMotion`.
- Reduced motion support.
- I18N has Hebrew and English translations for every `data-i18n`.
- Public page does not expose secrets or private operational IDs.

Use this complete replacement:

```javascript
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
const stylesCss = fs.readFileSync(path.join(repoRoot, "styles.css"), "utf8");
const scriptJs = fs.readFileSync(path.join(repoRoot, "script.js"), "utf8");
const cname = fs.readFileSync(path.join(repoRoot, "CNAME"), "utf8").trim();
const publicSource = `${indexHtml}\n${stylesCss}\n${scriptJs}`;

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tags(markup, tagName) {
  return Array.from(markup.matchAll(new RegExp(`<${escapeRegExp(tagName)}(?=\\s|[>/])[^>]*>`, "gi")), (match) => match[0]);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`(?:^|\\s)${escapeRegExp(name)}\\s*=\\s*(["'])(.*?)\\1`, "is"));
  return match ? match[2] : "";
}

function hasAttr(markup, name) {
  return new RegExp(`\\s${escapeRegExp(name)}(?:[\\s=>]|$)`, "i").test(markup);
}

function getObjectBlock(source, openingBraceIndex) {
  let depth = 0;
  for (let index = openingBraceIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(openingBraceIndex, index + 1);
    }
  }
  return "";
}

function i18nBlock() {
  const marker = /\bconst\s+I18N\s*=\s*{/.exec(scriptJs);
  assert.ok(marker, "script.js must declare const I18N.");
  return getObjectBlock(scriptJs, marker.index + marker[0].lastIndexOf("{"));
}

function languageBlock(language) {
  const block = i18nBlock();
  const marker = new RegExp(`\\b${language}\\s*:\\s*{`).exec(block);
  assert.ok(marker, `I18N must include ${language}.`);
  return getObjectBlock(block, marker.index + marker[0].lastIndexOf("{"));
}

function i18nKeys() {
  const textKeys = Array.from(indexHtml.matchAll(/data-i18n="([^"]+)"/g), (match) => match[1]);
  const attrKeys = Array.from(indexHtml.matchAll(/data-i18n-attr="([^"]+)"/g)).flatMap((match) =>
    Array.from(match[1].matchAll(/(?:^|[\s,;])[^:\s,;]+\s*:\s*([^\s,;]+)/g), (item) => item[1])
  );
  return [...new Set([...textKeys, ...attrKeys])];
}

test("page defaults to Hebrew RTL and the approved custom domain", () => {
  assert.ok(tags(indexHtml, "html").some((tag) => attr(tag, "lang") === "he" && attr(tag, "dir") === "rtl"));
  assert.equal(cname, "about.rotem-dev.org");
  assert.ok(indexHtml.includes('href="#main-content"'));
  assert.ok(hasAttr(indexHtml, "data-language-toggle"));
});

test("approved Maya Agent sections and hero assets exist", () => {
  for (const id of ["story", "abilities", "projects", "contact"]) {
    assert.ok(indexHtml.includes(`id="${id}"`), `missing section ${id}`);
  }
  assert.ok(indexHtml.includes("assets/maya-agent-cutout.webp"));
  assert.ok(indexHtml.includes("assets/maya-agent-cutout.png"));
  assert.ok(indexHtml.includes("MAYA AGENT") || publicSource.includes("Maya Agent"));
});

test("character motion hooks are present", () => {
  assert.ok(hasAttr(indexHtml, "data-character-hero"));
  assert.ok(hasAttr(indexHtml, "data-maya-character"));
  assert.match(scriptJs, /\bclass\s+MayaCharacterMotion\b/);
  assert.match(scriptJs, /requestAnimationFrame/);
  assert.match(stylesCss, /\.hero-stage\.is-character-shifted/);
  assert.match(stylesCss, /prefers-reduced-motion/);
});

test("core public-safe Maya content is represented", () => {
  for (const phrase of [
    "WhatsApp AI Agent",
    "Memory + Calendar",
    "Voice, Vision, Automation",
    "RoteMGPT",
    "Home Assistant",
    "Android Lab",
    "RedLab",
    "Cloudflare",
  ]) {
    assert.ok(publicSource.includes(phrase), `missing phrase: ${phrase}`);
  }
});

test("all HTML i18n keys have Hebrew and English translations", () => {
  const keys = i18nKeys();
  assert.ok(keys.length >= 20, `expected at least 20 i18n keys, found ${keys.length}`);
  for (const language of ["he", "en"]) {
    const block = languageBlock(language);
    for (const key of keys) {
      assert.match(block, new RegExp(`(?:^|[,{\\s])(?:${escapeRegExp(key)}|["']${escapeRegExp(key)}["'])\\s*:`), `${language} missing ${key}`);
    }
  }
});

test("public page avoids secrets and private operational identifiers", () => {
  for (const pattern of [
    /OPENAI_API_KEY/i,
    /HOME_ASSISTANT_TOKEN/i,
    /GOOGLE_MAPS_API_KEY/i,
    /credentials\.google\.json/i,
    /token\.google\.json/i,
    /\b120363\d+@g\.us\b/i,
    /\b972\d+@c\.us\b/i,
    /PRIVATE KEY/i,
  ]) {
    assert.doesNotMatch(publicSource, pattern);
  }
});
```

- [ ] **Step 2: Run tests and confirm they fail before implementation**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: failures for missing character assets/motion hooks or old sections.

- [ ] **Step 3: Commit failing tests**

Run:

```powershell
git add test/about-page.test.js
git commit -m "test: update about page character contracts"
```

Expected: commit succeeds with failing tests intentionally documenting the target.

## Task 3: Replace Static Markup

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Replace `index.html` with the Maya Agent page**

Write a static HTML page with:

- Metadata for `about.rotem-dev.org`.
- Hebrew default.
- Top navigation.
- Character hero using `<picture>` with WebP and PNG fallback.
- Sections `story`, `abilities`, `projects`, `contact`.
- Language toggle.
- Data attributes required by tests.

Use these visible sections and strings:

- Hero headline: `Maya Agent`
- Hero lead: `AI אישי שמנהל שיחה, זיכרון, יומן, קול, תמונות ואוטומציות סביב החיים האמיתיים.`
- Feature panels: `WhatsApp AI Agent`, `Memory + Calendar`, `Voice, Vision, Automation`
- CTAs: `Explore Maya`, `Contact Rotem`
- Story heading: `מאיה היא AI אישי שמחובר לכלים אמיתיים`
- Abilities heading: `מה מאיה יודעת לעשות`
- Projects heading: `הוכחות מהמעבדה`
- Contact heading: `רוצה לדבר על Maya, AI או תשתיות?`

Every visible string must be covered by `data-i18n`.

- [ ] **Step 2: Run tests**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: tests still fail until CSS and JS motion hooks are implemented.

- [ ] **Step 3: Commit markup**

Run:

```powershell
git add index.html
git commit -m "feat: add maya agent about markup"
```

Expected: commit succeeds.

## Task 4: Replace Visual System

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Implement the fuchsia character-led design**

Replace the old command-deck CSS with:

- Fuchsia first viewport.
- White rounded feature panels.
- Character centered by default.
- `.hero-stage.is-character-shifted` state.
- Desktop and mobile responsive layouts.
- Reduced-motion fallback.
- Strong focus states and skip link.

- [ ] **Step 2: Run tests**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: the CSS assertions pass, and the remaining failures are limited to missing `MayaCharacterMotion` behavior in `script.js`.

- [ ] **Step 3: Commit CSS**

Run:

```powershell
git add styles.css
git commit -m "style: add maya agent character visual system"
```

Expected: commit succeeds.

## Task 5: Implement Language And Character Motion

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Implement `I18N` and `applyLanguage`**

Keep Hebrew and English dictionaries, update `lang`, `dir`, metadata, visible text, translated attributes, and `localStorage`.

- [ ] **Step 2: Implement `MayaCharacterMotion`**

Create a small class that:

- Reads `data-character-hero` and `data-maya-character`.
- Adds `.is-character-shifted` after a scroll threshold.
- Adds hover shift on pointer-capable devices.
- Writes CSS variables for mouse parallax.
- Uses `requestAnimationFrame`.
- Disables parallax for `prefers-reduced-motion`.

- [ ] **Step 3: Run tests**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: all tests pass.

- [ ] **Step 4: Commit JavaScript**

Run:

```powershell
git add script.js
git commit -m "feat: animate maya agent hero"
```

Expected: commit succeeds.

## Task 6: Browser QA And Polish

**Files:**
- Modify: `index.html` when browser QA exposes copy, structure, or accessibility drift.
- Modify: `styles.css` when browser QA exposes layout, motion, responsive, or contrast drift.
- Modify: `script.js` when browser QA exposes language or character-motion drift.
- Modify: `assets/maya-agent-cutout.png` when browser QA exposes unacceptable cutout artifacts.
- Modify: `assets/maya-agent-cutout.webp` after any PNG cutout update.

- [ ] **Step 1: Start a local static server**

Run:

```powershell
python -m http.server 8000
```

Expected: site is available at `http://localhost:8000`.

- [ ] **Step 2: Verify desktop**

Open `http://localhost:8000`. Confirm:

- Character starts centered.
- Hover/mouse movement subtly shifts the character.
- Scroll moves the character aside.
- White cards do not overlap the character or text.
- First viewport shows a hint of the next section.

- [ ] **Step 3: Verify mobile**

Use a mobile viewport around `390x844`. Confirm:

- Character does not block headline or CTAs.
- Scroll moves/scales the character aside.
- No horizontal overflow.
- Feature panels remain readable.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`. Confirm:

- No idle float or mouse parallax.
- Page remains visually composed.

- [ ] **Step 5: Final tests**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: all tests pass.

- [ ] **Step 6: Commit QA fixes**

Run:

```powershell
git add index.html styles.css script.js assets/maya-agent-source.png assets/maya-agent-cutout.png assets/maya-agent-cutout.webp test/about-page.test.js
git commit -m "fix: complete maya agent about qa"
```

Expected: commit succeeds when QA produced changes. When QA produced no changes, `git status --short` shows only pre-existing unrelated untracked files.

## Self-Review Checklist

- Spec coverage: character-led A direction, user character, static GitHub Pages target, center-to-side motion, mobile scroll behavior, hover/parallax, reduced motion, public-safe content.
- Red-flag scan: no unresolved markers or undefined follow-up work remains in this plan.
- Type/name consistency: tests, markup, CSS, and JS all use `data-character-hero`, `data-maya-character`, `.hero-stage.is-character-shifted`, and `MayaCharacterMotion`.
