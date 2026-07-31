# Home Lab 3D Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rabbit hero with a living Home Lab / server rack scene that starts as the front hero visual and becomes a blurred background while scrolling.

**Architecture:** Use the generated Home Lab concept image as the stable visual base, then layer CSS and lightweight JavaScript animation on top for LEDs, fog, data lines, labels, and scroll-driven foreground-to-background behavior. Keep the static site structure intact and update the existing Three.js character tests to validate the new hero scene instead.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, Node built-in test runner, browser verification through a local static server.

---

## File Structure

- Modify `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\index.html`
  - Replace the rabbit guide markup with a Home Lab hero scene wrapper.
  - Keep hero copy, navigation, bilingual toggle, and project anchors intact.
- Modify `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\styles.css`
  - Replace rabbit/character layout styles with Home Lab scene styles.
  - Add fog, data glow, LED overlay, floating project labels, scroll blur, and mobile/reduced-motion rules.
- Modify `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\script.js`
  - Remove the rabbit GLB/procedural scene runtime.
  - Add `initHomeLabScene()` to drive CSS custom properties from scroll progress.
  - Preserve project interactions, i18n, and reveal initialization.
- Modify `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\test\about-page.test.js`
  - Replace rabbit-specific assertions with Home Lab hero assertions.
  - Keep unrelated project/content/security assertions intact.
- Copy generated concept image to `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\assets\3d\home-lab-hero-concept.png`
  - Source: `C:\Users\rotem\.codex\generated_images\019fa950-c18b-7dd0-8b6a-07a2c4055a20\ig_09f2e2945d877058016a6d227668708191929dcd4164c5bce6.png`
- Modify `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\assets\3d\README.md`
  - Document that the live hero is now Home Lab, and the old rabbit GLB is retained but not used.

### Task 1: Asset And Markup

**Files:**
- Copy: `C:\Users\rotem\.codex\generated_images\019fa950-c18b-7dd0-8b6a-07a2c4055a20\ig_09f2e2945d877058016a6d227668708191929dcd4164c5bce6.png` -> `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\assets\3d\home-lab-hero-concept.png`
- Modify: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\index.html:113-117`
- Modify: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\assets\3d\README.md`

- [ ] **Step 1: Copy the concept image into the project**

Run:

```powershell
Copy-Item -LiteralPath "C:\Users\rotem\.codex\generated_images\019fa950-c18b-7dd0-8b6a-07a2c4055a20\ig_09f2e2945d877058016a6d227668708191929dcd4164c5bce6.png" -Destination "C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\assets\3d\home-lab-hero-concept.png"
```

Expected: destination file exists and is larger than 100 KB.

- [ ] **Step 2: Replace the hero visual markup**

Replace the old block:

```html
<div class="character-guide" data-character-guide aria-hidden="true">
    <canvas class="character-canvas" data-three-character-stage></canvas>
    <div class="character-static-fallback">rotem.z</div>
    <div class="stage-ring"></div>
</div>
```

With:

```html
<div class="home-lab-scene" data-home-lab-scene aria-hidden="true">
    <div class="home-lab-visual">
        <img
            src="assets/3d/home-lab-hero-concept.png"
            alt=""
            class="home-lab-image"
            decoding="async"
            fetchpriority="high"
        >
        <div class="home-lab-fog"></div>
        <div class="home-lab-data-lines"></div>
        <div class="home-lab-leds">
            <span style="--x: 55%; --y: 28%; --delay: 0ms"></span>
            <span style="--x: 57%; --y: 39%; --delay: 320ms"></span>
            <span style="--x: 63%; --y: 44%; --delay: 780ms"></span>
            <span style="--x: 75%; --y: 34%; --delay: 1120ms"></span>
            <span style="--x: 82%; --y: 52%; --delay: 1560ms"></span>
        </div>
    </div>
    <div class="home-lab-modules" aria-hidden="true">
        <span class="home-lab-module module-maya">Maya</span>
        <span class="home-lab-module module-ha">HA</span>
        <span class="home-lab-module module-ai">Local AI</span>
        <span class="home-lab-module module-pt">PT</span>
        <span class="home-lab-module module-games">Games</span>
    </div>
</div>
```

Expected: no visible text is introduced into the accessibility tree because the scene is decorative.

- [ ] **Step 3: Update asset notes**

Change `assets/3d/README.md` to state:

```markdown
# Rotem 3D Hero Assets

Current live hero concept path: `assets/3d/home-lab-hero-concept.png`

The production hero now uses a Home Lab / server rack visual as the foreground scene and scroll background. The old purchased rabbit GLB remains in the repository as a retained asset, but it is not referenced by the live hero.
```

Expected: README no longer describes the rabbit as the live visual.

- [ ] **Step 4: Commit task 1**

Run:

```powershell
git add -- index.html assets/3d/README.md assets/3d/home-lab-hero-concept.png
git commit -m "feat: replace hero markup with home lab scene"
```

Expected: commit succeeds.

### Task 2: Home Lab Hero Styling

**Files:**
- Modify: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\styles.css`

- [ ] **Step 1: Replace character rail variables**

Use these root variables:

```css
:root {
    --scene-rail-width: clamp(25rem, 42vw, 48rem);
    --content-width: min(var(--content-max), calc(100% - var(--scene-rail-width) - var(--page-gutter)));
    --scene-scroll-progress: 0;
    --scene-blur: 0px;
    --scene-opacity: 0.94;
    --scene-scale: 1;
    --scene-parallax-y: 0px;
}
```

Expected: content remains reserved away from the visual rail on desktop.

- [ ] **Step 2: Replace old character CSS with Home Lab CSS**

Add focused styles for:

```css
.home-lab-scene { position: fixed; inset: 0; z-index: 1; pointer-events: none; opacity: var(--scene-opacity); transform: translate3d(0, var(--scene-parallax-y), 0) scale(var(--scene-scale)); transition: opacity 180ms ease; }
.home-lab-visual { position: absolute; inset-block-end: -3svh; inset-inline-end: 0; width: min(58vw, 960px); height: min(86svh, 860px); filter: blur(var(--scene-blur)) saturate(1.12) contrast(1.04); transform-origin: center bottom; }
.home-lab-image { width: 100%; height: 100%; object-fit: contain; object-position: center bottom; }
.home-lab-fog { position: absolute; inset: 5% -8% 0; background: radial-gradient(circle at 55% 60%, rgba(124, 255, 218, 0.16), transparent 34%), radial-gradient(circle at 82% 42%, rgba(255, 200, 112, 0.10), transparent 24%); mix-blend-mode: screen; opacity: calc(0.35 + (var(--scene-scroll-progress) * 0.22)); animation: labFogDrift 9s ease-in-out infinite alternate; }
.home-lab-leds span { position: absolute; left: var(--x); top: var(--y); width: 0.42rem; height: 0.42rem; border-radius: 999px; background: #80ffdb; box-shadow: 0 0 16px #80ffdb; animation: labLedBlink 1.85s ease-in-out infinite; animation-delay: var(--delay); }
.home-lab-module { position: absolute; border: 1px solid rgba(128, 255, 219, 0.26); border-radius: 0.5rem; padding: 0.5rem 0.65rem; background: rgba(5, 14, 18, 0.58); backdrop-filter: blur(10px); color: rgba(244, 246, 248, 0.86); font: 700 0.72rem/1 "IBM Plex Mono", monospace; }
```

Expected: the hero image is foreground at top, alive with fog and blinking LEDs.

- [ ] **Step 3: Add scroll and section readability styles**

Add:

```css
body.is-home-lab-background .home-lab-scene { z-index: 0; }
body.is-home-lab-background .projects-section,
body.is-home-lab-background .lab-gallery-section,
body.is-home-lab-background .timeline-section,
body.is-home-lab-background .skills-section,
body.is-home-lab-background .contact-section { backdrop-filter: blur(2px); }
```

Expected: content stays above the blurred visual background.

- [ ] **Step 4: Add mobile and reduced-motion safety**

Add:

```css
@media (max-width: 760px) {
    :root { --scene-rail-width: 0rem; }
    .home-lab-scene { opacity: 0.32; }
    .home-lab-visual { inset-block-start: 4.8rem; inset-block-end: auto; inset-inline-end: -20vw; width: min(118vw, 620px); height: 46svh; }
    .home-lab-modules { display: none; }
}

@media (prefers-reduced-motion: reduce) {
    .home-lab-fog,
    .home-lab-data-lines,
    .home-lab-leds span { animation: none !important; }
}
```

Expected: mobile has no overlap-heavy module labels, and reduced-motion users see a stable scene.

- [ ] **Step 5: Commit task 2**

Run:

```powershell
git add -- styles.css
git commit -m "feat: style living home lab hero"
```

Expected: commit succeeds.

### Task 3: Scroll Controller

**Files:**
- Modify: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\script.js`

- [ ] **Step 1: Remove the rabbit runtime**

Remove constants and class code that exist only for the old rabbit:

```js
CHARACTER_GLB_URL
CHARACTER_MANIFEST_URL
EXTERNAL_CHARACTER_MODEL_NAME
CHARACTER_ANIMATION_NAMES
CHARACTER_STATE_THRESHOLDS
EXTERNAL_SCROLL_MOTION
RIGGED_BONE_NAMES
class RotemCharacterScene
initCharacter()
```

Expected: `script.js` no longer imports `three`, `GLTFLoader`, or references `rotem-z-rabbit.glb`.

- [ ] **Step 2: Add `initHomeLabScene()`**

Add:

```js
function initHomeLabScene() {
    const scene = document.querySelector("[data-home-lab-scene]");
    if (!scene) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const applyScrollState = () => {
        const max = Math.max(1, window.innerHeight * 0.92);
        const progress = Math.min(1, Math.max(0, window.scrollY / max));
        const blur = reducedMotion ? 2.5 : progress * 5.5;
        const opacity = 0.94 - progress * 0.52;
        const scale = reducedMotion ? 1 : 1 + progress * 0.08;
        const y = reducedMotion ? 0 : progress * -34;

        document.documentElement.style.setProperty("--scene-scroll-progress", progress.toFixed(3));
        document.documentElement.style.setProperty("--scene-blur", `${blur.toFixed(2)}px`);
        document.documentElement.style.setProperty("--scene-opacity", Math.max(0.34, opacity).toFixed(3));
        document.documentElement.style.setProperty("--scene-scale", scale.toFixed(3));
        document.documentElement.style.setProperty("--scene-parallax-y", `${y.toFixed(1)}px`);
        document.body.classList.toggle("is-home-lab-background", progress > 0.08);
    };

    let frame = 0;
    const schedule = () => {
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
            frame = 0;
            applyScrollState();
        });
    };

    applyScrollState();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
}
```

Expected: scroll changes CSS properties, and the scene becomes a blurred background after early scrolling.

- [ ] **Step 3: Initialize the Home Lab scene**

Replace:

```js
initCharacter();
```

With:

```js
initHomeLabScene();
```

Expected: project interactions, language toggle, and reveal setup still run before or alongside the scene.

- [ ] **Step 4: Commit task 3**

Run:

```powershell
git add -- script.js
git commit -m "feat: animate home lab scene on scroll"
```

Expected: commit succeeds.

### Task 4: Tests

**Files:**
- Modify: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\test\about-page.test.js`

- [ ] **Step 1: Replace rabbit tests with Home Lab tests**

Replace the old tests named:

```js
"Three.js character stage and GLB/procedural fallback hooks exist"
"3d character manifest enables the live rabbit mascot asset"
"live rabbit mascot asset ships as a deployable GLB"
"motion, visibility, fallback, and mobile safety are explicitly handled"
"character motion is scroll-driven and ready for real GLB animation clips"
"purchased GLB is rendered without runtime-added shirt text or fake limbs"
"rigged GLB has visible scroll choreography and real-bone gestures"
"character lane reserves space and mirrors direction between English and Hebrew"
```

With tests that assert:

```js
test("home lab hero replaces the old rabbit stage", () => {
    assert.match(indexHtml, /data-home-lab-scene/);
    assert.match(indexHtml, /home-lab-hero-concept\.png/);
    assert.match(indexHtml, /home-lab-leds/);
    assert.match(indexHtml, /home-lab-fog/);
    assert.match(indexHtml, /Maya/);
    assert.match(indexHtml, /Local AI/);
    assert.doesNotMatch(`${indexHtml}\n${stylesCss}\n${scriptJs}`, /data-three-character-stage/);
    assert.doesNotMatch(`${indexHtml}\n${stylesCss}\n${scriptJs}`, /rotem-z-rabbit\.glb/);
    assert.doesNotMatch(`${indexHtml}\n${stylesCss}\n${scriptJs}`, /procedural-rabbit/i);
});

test("home lab scene becomes a blurred scroll background", () => {
    assert.match(stylesCss, /--scene-scroll-progress/);
    assert.match(stylesCss, /--scene-blur/);
    assert.match(stylesCss, /--scene-opacity/);
    assert.match(stylesCss, /--scene-scale/);
    assert.match(stylesCss, /\.home-lab-scene/);
    assert.match(stylesCss, /\.home-lab-fog/);
    assert.match(stylesCss, /@keyframes\s+labLedBlink/);
    assert.match(stylesCss, /@keyframes\s+labFogDrift/);
    assert.match(scriptJs, /function\s+initHomeLabScene/);
    assert.match(scriptJs, /requestAnimationFrame/);
    assert.match(scriptJs, /is-home-lab-background/);
    assert.match(scriptJs, /setProperty\("--scene-blur"/);
});

test("home lab hero asset ships locally", () => {
    const assetPath = path.join(repoRoot, "assets/3d/home-lab-hero-concept.png");
    assert.equal(fs.existsSync(assetPath), true);
    assert.ok(fs.statSync(assetPath).size > 100_000);
    assertSourceMatches(publicSiteSource, /assets\/3d\/home-lab-hero-concept\.png/, "Expected site to reference Home Lab concept image.");
});

test("home lab scene keeps mobile and reduced-motion safety", () => {
    assert.match(stylesCss, /@media\s*\(\s*max-width\s*:\s*760px\s*\)/);
    assert.match(stylesCss, /\.home-lab-modules\s*{[\s\S]*display:\s*none/);
    assert.match(stylesCss, /prefers-reduced-motion/);
    assert.match(scriptJs, /matchMedia\("\(prefers-reduced-motion:\s*reduce\)"\)/);
    assert.doesNotMatch(scriptJs, /import\("three"\)/);
    assert.doesNotMatch(scriptJs, /GLTFLoader/);
});
```

Expected: tests encode the new desired behavior rather than preserving the old rabbit implementation.

- [ ] **Step 2: Run tests**

Run:

```powershell
node --test test/about-page.test.js
```

Expected: all tests pass.

- [ ] **Step 3: Commit task 4**

Run:

```powershell
git add -- test/about-page.test.js
git commit -m "test: cover home lab hero replacement"
```

Expected: commit succeeds.

### Task 5: Browser Verification And Polish

**Files:**
- Modify only if verification shows layout or readability problems:
  - `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\styles.css`
  - `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d\script.js`

- [ ] **Step 1: Start a local static server**

Run:

```powershell
python -m http.server 57500
```

Expected: site is available at `http://localhost:57500/`.

- [ ] **Step 2: Verify desktop**

Open:

```text
http://localhost:57500/?qa=home-lab
```

Expected:

- no rabbit is visible
- Home Lab image is visible in the first viewport
- hero title and CTAs are readable
- early project content is hinted below the fold
- scrolling blurs/dims the scene into the background

- [ ] **Step 3: Verify mobile**

Use a mobile viewport around `390x844`.

Expected:

- title and buttons do not overlap the visual
- module labels do not crowd the screen
- the background layer is subdued while reading

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`.

Expected:

- no parallax movement
- no LED/fog animation
- static visual remains readable

- [ ] **Step 5: Commit polish if needed**

Run only if Step 2-4 required code changes:

```powershell
git add -- styles.css script.js
git commit -m "fix: polish home lab hero responsiveness"
```

Expected: commit succeeds if changes were made.
