# Cinematic 3D Rotem About Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** לבנות מחדש את אתר `about.rotem-dev.org` כחוויית About פרימיום שממוקדת ברותם זכאים: מי הוא, מה הוא יודע לפתור, מה הוא בונה, ואיך יוצרים איתו קשר. הדמות התלת־ממדית היא שכבת אופי ותנועה שמלווה את הסיפור, לא מוקד האתר.

**Architecture:** אתר סטטי קיים על GitHub Pages נשאר הבסיס. משמרים את `index.html`, `styles.css`, `script.js`, `CNAME` והבדיקות הקיימות, ומוסיפים שכבת Three.js עצמאית לדמות. התוכן נשאר קריא גם כש־WebGL לא זמין, כשהמשתמש מפעיל reduced motion, או כשקובץ GLB חיצוני עדיין לא הוכנס.

**Tech Stack:** HTML/CSS/JavaScript סטטי, Three.js עם GLTFLoader, Node.js built-in test runner, Playwright או בדיקת דפדפן מקומית לצילומי מסך ובדיקות Canvas, Git worktree לבידוד.

---

## החלטת מוצר

האתר לא הופך לאתר של Maya Agent. Maya מופיעה כפרויקט / מעבדת AI בתוך הסיפור של רותם. ה־hero, הניווט, הכותרות וה־CTA מציגים את רותם ואת היכולת המקצועית שלו.

הדמות:

- ארנב תלת־ממדי אפור בסגנון התמונה שסופקה.
- משקפי שמש כהים.
- חולצה שחורה עם הכיתוב `rotem.z`.
- מכנס לבן ונעליים בהירות.
- תנועה עדינה, מבט חי, ותגובה לגלילה / עכבר.
- בדסקטופ: עומדת במרכז בתחילת הכניסה, ואז זזה לצד כאשר גוללים או מזיזים עכבר.
- במובייל: מופיעה בצורה מבוקרת בפתיחה, ואז מפנה מקום לתוכן ולא חוסמת קריאה.

הסגנון:

- כהה, קולנועי, חד, טכנולוגי ובוגר.
- נגיעות Cyber / Command Center: קווי גריד עדינים, מסגרות מדויקות, מדדי סטטוס, typography טכני.
- בלי אתר תבניתי, בלי כרטיסים דקורטיביים ענקיים, בלי גרדיאנט־אורבים, בלי mascot שמנהל את כל העמוד.

## Visual References

קבצי הקונספטים שאושרו ככיוון יישומי:

- `docs/superpowers/concepts/hero-desktop-reference.png`
- `docs/superpowers/concepts/middle-sections-reference.png`
- `docs/superpowers/concepts/lower-sections-reference.png`
- `docs/superpowers/concepts/mobile-reference.png`

החלטות extraction מהקונספטים:

- ה־H1 הראשון הוא `Rotem Zacaim` ללא eyebrow, kicker, badge או pill מעליו.
- הלוגו במובייל לא מועתק מהקונספט אם הוא מזכיר Maya; משתמשים בסימן `RZ` / `rotem.z` נקי.
- הדמות היא stage תלת־ממדי בצד ימין / מרכז־ימין, והיא מפנה מקום לתוכן בגלילה.
- סקשני האמצע משתמשים ב־operator profile, AI Lab ו־systems map בריתמוס משתנה: rail, list, map, לא grid תבניתי.
- סקשני התחתית משתמשים ב־deep dive, timeline, credential rows ו־contact band.

## מבנה קבצים

- `index.html` - עדכון מבנה ה־hero, הוספת stage לדמות, ושימור כל אזורי התוכן המרכזיים.
- `styles.css` - מערכת עיצוב חדשה, responsive layout, מצב character docked, reduced motion, fallback.
- `script.js` - i18n קיים, ניווט, ו־`RotemCharacterScene` עבור Three.js.
- `test/about-page.test.js` - חוזה בדיקות חדש שמוודא שהאתר ממוקד ברותם ושהדמות היא שכבת 3D תקינה.
- `assets/3d/README.md` - הנחיות לדמות GLB הסופית.
- `assets/3d/rotem-z-rabbit.glb` - קובץ הדמות הסופי אחרי Meshy/Tripo + Blender. לא נדרש לשלב הראשון כי יש דמות פרוצדורלית ב־Three.js.

## שלב 1: בידוד עבודה ובסיס בדיקות

- [ ] לפתוח מה־repo הנוכחי:

```powershell
Set-Location C:\Users\rotem\Documents\codex\WEB\rotem-zacaim.github.io
git status --short
git branch --show-current
```

- [ ] לוודא שלא נוגעים ב־`SITE_SPEC_HE.md`, כי הוא שינוי לא קשור שקיים אצל המשתמש.

- [ ] ליצור worktree מבודד לעבודה:

```powershell
Set-Location C:\Users\rotem\Documents\codex\WEB\rotem-zacaim.github.io
git worktree add ..\rotem-zacaim-about-3d -b feature/cinematic-3d-about main
Set-Location C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d
```

- [ ] להריץ בסיס בדיקות לפני שינוי:

```powershell
node --test test\about-page.test.js
```

תוצאה רצויה: כל הבדיקות הקיימות עוברות לפני שמתחילים לשנות.

## שלב 2: חוזה בדיקות חדש לפני עיצוב

- [ ] לעדכן את `test/about-page.test.js` כך שיבדוק את הכיוון החדש. הבדיקה צריכה לכסות:

- האתר נשאר About של Rotem.
- `Maya` קיימת רק כחלק מפרויקט / מעבדה, לא ככותרת ראשית.
- `CNAME` נשאר `about.rotem-dev.org`.
- קיימים hooks לדמות: `data-character-guide`, `data-three-character-stage`, `RotemCharacterScene`.
- קיימת תמיכה ב־`prefers-reduced-motion`.
- קיימת בדיקת WebGL fallback.
- אין סודות, מספרי טלפון, מזהים אישיים, API keys או hostnames פנימיים.

- [ ] להחליף בדיקות שתלויות ב־assistant widget הישן, כי האתר החדש משתמש בדמות 3D אחת בלבד.

תבנית הבדיקות הרצויה:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("custom domain stays mapped to about.rotem-dev.org", () => {
  assert.equal(read("CNAME").trim(), "about.rotem-dev.org");
});

test("site remains focused on Rotem, not Maya as the product", () => {
  const html = read("index.html");

  assert.match(html, /Rotem|רותם|Zacaim|זכאים/i);
  assert.match(html, /Security Operations|Cyber|SOC|Automation|AI/i);
  assert.match(html, /Maya/i);
  assert.doesNotMatch(html, /<h1[^>]*>\s*Maya Agent/i);
  assert.doesNotMatch(html, /MAYA AGENT/i);
});

test("core about sections are still present", () => {
  const html = read("index.html");
  [
    "overview",
    "profile",
    "maya-lab",
    "systems",
    "deep-dive",
    "experience",
    "certifications",
    "contact",
  ].forEach((id) => {
    assert.match(html, new RegExp(`id="${id}"`));
  });
});

test("3d character stage and fallback hooks exist", () => {
  const html = read("index.html");
  const js = read("script.js");

  assert.match(html, /data-character-guide/);
  assert.match(html, /data-three-character-stage/);
  assert.match(html, /rotem\.z/);
  assert.match(js, /class\s+RotemCharacterScene/);
  assert.match(js, /GLTFLoader/);
  assert.match(js, /WebGL/);
});

test("motion and mobile safety are explicitly handled", () => {
  const css = read("styles.css");
  const js = read("script.js");

  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /max-width:\s*720px/);
  assert.match(css, /overflow-x:\s*hidden/);
  assert.match(js, /matchMedia\("\(prefers-reduced-motion:\s*reduce\)"\)/);
  assert.match(js, /IntersectionObserver/);
});

test("no sensitive operational details are exposed", () => {
  const combined = ["index.html", "styles.css", "script.js"].map(read).join("\n");
  [
    /sk-[a-zA-Z0-9]/,
    /xox[baprs]-/i,
    /OPENAI_API_KEY/i,
    /AIza[0-9A-Za-z\-_]{35}/,
    /\b\d{2,3}-\d{6,8}\b/,
    /localhost:\d{2,5}/i,
  ].forEach((pattern) => {
    assert.doesNotMatch(combined, pattern);
  });
});
```

- [ ] להריץ את הבדיקות ולוודא שהן נכשלות בגלל פיצ'רים שעדיין לא מומשו:

```powershell
node --test test\about-page.test.js
```

תוצאה רצויה: כישלון ממוקד שמצביע על חסר ב־3D hooks / עיצוב חדש. כישלון אחר דורש תיקון הבדיקה לפני המשך.

## שלב 3: HTML ממוקד Rotem

- [ ] לעדכן את `<head>`:

- title ממוקד רותם: `Rotem Zacaim | Security Operations, AI Automation & Systems`.
- description בעברית/אנגלית שמדברת על רותם, אבטחת מידע, אוטומציה ו־AI systems.
- להשאיר canonical / metadata קיימים שמשרתים את הדומיין.
- להוסיף import map עבור Three.js ו־GLTFLoader בגרסה נעולה:

```html
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.166.1/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.166.1/examples/jsm/"
    }
  }
</script>
```

- [ ] לעדכן את ה־hero כך שהדמות היא שכבה חיה ולא תמונה:

```html
<section class="hero cinematic-hero" id="overview" aria-labelledby="hero-title">
  <div class="hero-copy">
    <h1 id="hero-title" data-i18n="heroTitle">Rotem Zacaim</h1>
    <p class="hero-lede" data-i18n="heroLede">
      Building practical security operations, automation, and AI workflows that turn messy processes into reliable systems.
    </p>
    <div class="hero-actions" aria-label="Primary actions">
      <a class="button primary" href="#contact" data-i18n="heroPrimary">Start a conversation</a>
      <a class="button secondary" href="#systems" data-i18n="heroSecondary">View systems</a>
    </div>
  </div>

  <div class="character-guide" data-character-guide aria-hidden="true">
    <canvas class="character-canvas" data-three-character-stage></canvas>
    <div class="character-static-fallback">rotem.z</div>
  </div>
</section>
```

- [ ] לשמר את אזורי התוכן:

- `profile` - מי רותם, Security Operations, automation, ownership.
- `maya-lab` - Maya כמעבדה אישית / פרויקט AI, לא זהות האתר.
- `systems` - מפה של מערכות, יכולות, ופרויקטים.
- `deep-dive` - מקרה עומק או workflow שמראה חשיבה.
- `experience` - ניסיון, אחריות, הישגים.
- `certifications` - תעודות והכשרות.
- `contact` - יצירת קשר.

- [ ] להסיר או לנטרל את ה־assistant widget הישן אם הוא קיים, כדי שלא יהיו שתי דמויות מתחרות.

- [ ] לשמור על language toggle קיים. כל טקסט חדש מקבל מפתח i18n ב־`script.js`.

## שלב 4: מערכת עיצוב CSS

- [ ] להגדיר בסיס עיצוב חדש ב־`:root`:

```css
:root {
  color-scheme: dark;
  --bg: #07080b;
  --panel: #101319;
  --panel-2: #151923;
  --text: #f4f6f8;
  --muted: #9aa4b2;
  --line: rgba(255, 255, 255, 0.12);
  --accent: #f0526b;
  --accent-2: #66e3ff;
  --good: #7ddc9a;
  --radius: 8px;
  --shadow: 0 24px 80px rgba(0, 0, 0, 0.42);
}
```

- [ ] להגדיר רקע קולנועי בלי orbs:

```css
body {
  margin: 0;
  min-width: 320px;
  overflow-x: hidden;
  color: var(--text);
  background:
    linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px),
    radial-gradient(circle at 65% 20%, rgba(240,82,107,0.18), transparent 34rem),
    #07080b;
  background-size: 44px 44px, 44px 44px, auto, auto;
}
```

- [ ] לעצב את ה־hero כ־viewport ראשון שמראה גם רמז לסקשן הבא:

```css
.cinematic-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(320px, 0.8fr);
  align-items: center;
  min-height: min(860px, 92svh);
  padding: clamp(7rem, 11vw, 10rem) clamp(1.25rem, 5vw, 5rem) clamp(3rem, 6vw, 5rem);
}

.hero-copy {
  z-index: 2;
  max-width: 720px;
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(3.4rem, 8vw, 7.4rem);
  line-height: 0.9;
  letter-spacing: 0;
}
```

- [ ] לעצב את stage של הדמות:

```css
.character-guide {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transition: transform 720ms cubic-bezier(.2,.8,.2,1), opacity 320ms ease;
}

.character-canvas {
  position: absolute;
  right: 2vw;
  bottom: 0;
  width: min(46vw, 620px);
  height: min(82svh, 780px);
}

body.is-character-docked .character-guide {
  transform: translateX(12vw) scale(0.92);
}
```

- [ ] להגן על מובייל:

```css
@media (max-width: 720px) {
  .cinematic-hero {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-height: auto;
    padding-top: 6.5rem;
  }

  .character-guide {
    position: absolute;
    inset: 5rem 0 auto;
    height: 38svh;
    opacity: 0.86;
  }

  .character-canvas {
    right: 50%;
    bottom: auto;
    transform: translateX(50%);
    width: min(92vw, 430px);
    height: 38svh;
  }

  body.is-character-docked .character-guide {
    transform: translateX(18vw) scale(0.82);
    opacity: 0.32;
  }
}
```

- [ ] להוסיף reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }

  .character-guide {
    opacity: 0.72;
    transform: none !important;
  }
}
```

- [ ] לוודא שכל cards חוזרים משתמשים ב־`border-radius: 8px` ולא נהיים כרטיסים בתוך כרטיסים.

## שלב 5: Three.js Character Scene

- [ ] להפוך את `script.js` ל־module:

```html
<script type="module" src="script.js"></script>
```

- [ ] לשמור את כל פונקציות השפה והניווט הקיימות, ולהוסיף imports בתחילת `script.js`:

```js
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
```

- [ ] להוסיף `RotemCharacterScene` שמנהל את הדמות:

```js
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
  }

  init() {
    if (!this.hasWebGL()) {
      document.documentElement.classList.add("no-webgl-character");
      return;
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    this.camera.position.set(0, 1.3, 6.2);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.addLighting();
    this.model = this.createProceduralRabbit();
    this.scene.add(this.model);

    this.loadExternalModel("assets/3d/rotem-z-rabbit.glb");
    this.bindEvents();
    this.resize();
    this.animate();
  }

  hasWebGL() {
    const probe = document.createElement("canvas");
    return Boolean(probe.getContext("webgl") || probe.getContext("experimental-webgl"));
  }

  addLighting() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x151823, 2.8));

    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(3, 5, 5);
    this.scene.add(key);

    const rim = new THREE.DirectionalLight(0x66e3ff, 1.6);
    rim.position.set(-4, 2, 3);
    this.scene.add(rim);
  }

  createProceduralRabbit() {
    const group = new THREE.Group();
    group.name = "rotem-z-procedural-rabbit";

    const fur = new THREE.MeshStandardMaterial({ color: 0x6e727b, roughness: 0.82 });
    const innerEar = new THREE.MeshStandardMaterial({ color: 0xa5797e, roughness: 0.72 });
    const black = new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.55 });
    const white = new THREE.MeshStandardMaterial({ color: 0xf3eee8, roughness: 0.62 });
    const lens = new THREE.MeshPhysicalMaterial({
      color: 0x070707,
      roughness: 0.18,
      transmission: 0.1,
      transparent: true,
      opacity: 0.82,
    });

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.74, 1.18, 8, 18), black);
    body.position.y = 0.15;
    group.add(body);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.86, 36, 24), fur);
    head.scale.set(1.08, 0.88, 0.95);
    head.position.y = 1.35;
    group.add(head);

    const earGeometry = new THREE.CapsuleGeometry(0.18, 1.1, 8, 18);
    const leftEar = new THREE.Mesh(earGeometry, fur);
    leftEar.position.set(-0.36, 2.25, -0.03);
    leftEar.rotation.z = -0.12;
    group.add(leftEar);

    const rightEar = leftEar.clone();
    rightEar.position.x = 0.36;
    rightEar.rotation.z = 0.12;
    group.add(rightEar);

    const innerGeometry = new THREE.CapsuleGeometry(0.08, 0.82, 8, 14);
    const innerLeft = new THREE.Mesh(innerGeometry, innerEar);
    innerLeft.position.set(-0.36, 2.26, 0.05);
    innerLeft.rotation.z = -0.12;
    group.add(innerLeft);

    const innerRight = innerLeft.clone();
    innerRight.position.x = 0.36;
    innerRight.rotation.z = 0.12;
    group.add(innerRight);

    const glassesFrame = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.08, 0.05), black);
    glassesFrame.position.set(0, 1.43, 0.82);
    group.add(glassesFrame);

    [-0.32, 0.32].forEach((x) => {
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.24, 0.045), lens);
      glass.position.set(x, 1.43, 0.86);
      group.add(glass);
    });

    const pants = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.72, 0.72), white);
    pants.position.y = -0.58;
    group.add(pants);

    const shirtText = this.createTextPlane("rotem.z");
    shirtText.position.set(0, 0.18, 0.75);
    group.add(shirtText);

    const armGeometry = new THREE.CapsuleGeometry(0.11, 0.86, 8, 12);
    const pointingArm = new THREE.Mesh(armGeometry, fur);
    pointingArm.position.set(-0.88, 0.48, 0.2);
    pointingArm.rotation.z = Math.PI / 2.25;
    pointingArm.rotation.y = -0.3;
    group.add(pointingArm);

    const relaxedArm = new THREE.Mesh(armGeometry, fur);
    relaxedArm.position.set(0.78, 0.26, 0.08);
    relaxedArm.rotation.z = -0.35;
    group.add(relaxedArm);

    group.scale.setScalar(0.98);
    group.position.y = -0.76;
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
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.32), material);
    plane.name = "rotem-z-shirt-label";
    return plane;
  }

  loadExternalModel(url) {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const incoming = gltf.scene;
        incoming.name = "rotem-z-rabbit-glb";
        incoming.scale.setScalar(1.7);
        incoming.position.set(0, -1.15, 0);

        this.scene.remove(this.model);
        this.model = incoming;
        this.scene.add(this.model);

        if (gltf.animations.length) {
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
    window.addEventListener("resize", () => this.resize(), { passive: true });
    window.addEventListener("pointermove", (event) => {
      this.pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      this.pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
      document.body.classList.add("is-character-docked");
    }, { passive: true });

    window.addEventListener("scroll", () => {
      const max = Math.max(1, window.innerHeight * 0.85);
      this.scrollProgress = Math.min(1, window.scrollY / max);
      document.body.classList.toggle("is-character-docked", this.scrollProgress > 0.04);
    }, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      this.visible = entry.isIntersecting;
      if (this.visible && !this.frame) this.animate();
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
  }

  animate() {
    if (!this.visible) {
      this.frame = 0;
      return;
    }

    this.frame = window.requestAnimationFrame(() => this.animate());
    const elapsed = this.clock.getElapsedTime();
    const delta = this.clock.getDelta();

    if (this.mixer && !this.reducedMotion) this.mixer.update(delta);

    if (this.model) {
      const idle = this.reducedMotion ? 0 : Math.sin(elapsed * 1.8) * 0.035;
      this.model.rotation.y = THREE.MathUtils.lerp(this.model.rotation.y, this.pointer.x * 0.16 - this.scrollProgress * 0.28, 0.08);
      this.model.rotation.x = THREE.MathUtils.lerp(this.model.rotation.x, -this.pointer.y * 0.055, 0.06);
      this.model.position.y = -0.76 + idle;
      this.model.position.x = THREE.MathUtils.lerp(this.model.position.x, this.scrollProgress * 0.58, 0.07);
    }

    this.renderer.render(this.scene, this.camera);
  }
}
```

- [ ] לאתחל בסוף `script.js`:

```js
const characterCanvas = document.querySelector("[data-three-character-stage]");
if (characterCanvas) {
  const characterScene = new RotemCharacterScene(characterCanvas);
  characterScene.init();
}
```

- [ ] לוודא שהקוד לא נשען על הדמות כדי להציג תוכן. כל התוכן חייב להופיע גם כשה־canvas לא נטען.

## שלב 6: דמות GLB אמיתית

- [ ] ליצור `assets/3d/README.md` עם ההנחיות הבאות:

```md
# Rotem.z 3D Character

Final asset path: `assets/3d/rotem-z-rabbit.glb`

Visual brief:
- stylized premium grey rabbit mascot
- dark sunglasses
- black shirt with readable `rotem.z`
- white pants
- light sneakers
- confident, cool, slightly pointing pose
- not childish, not toy-like, not branded as Maya

Web constraints:
- GLB under 4 MB after compression
- centered origin at feet
- neutral forward-facing pose
- one short idle animation when available
- baked or optimized materials
- no external texture paths
```

- [ ] להשתמש ב־Meshy או Tripo ליצירת 3-5 מועמדים בתקציב של עד $20.

Prompt מומלץ באנגלית:

```text
Stylized premium 3D grey rabbit mascot for a personal cybersecurity and AI portfolio website. The rabbit wears dark sunglasses, a clean black t-shirt with the exact text "rotem.z", white pants, and light sneakers. Confident cool posture, one arm slightly pointing to the side, high-end product mascot quality, soft realistic fur detail, web-ready character, neutral front pose, no background, no logos except "rotem.z", not childish, not cartoon toy, not Maya branding.
```

Negative prompt:

```text
No text other than "rotem.z", no MAYA AGENT, no childish toy style, no giant head, no scary horror style, no weapons, no background, no extra characters, no unreadable shirt text.
```

- [ ] לבחור מועמד אחד ולנקות ב־Blender:

- origin בכפות הרגליים.
- scale אחיד.
- למחוק geometry נסתרת.
- לשפר או להחליף את טקסט החולצה אם הוא לא קריא.
- להוסיף idle animation קצר אם הכלי סיפק rig בסיסי.
- לייצא `GLB`.

- [ ] לשים את הקובץ ב־`assets/3d/rotem-z-rabbit.glb`.

- [ ] להריץ בדיקת משקל:

```powershell
Get-Item assets\3d\rotem-z-rabbit.glb | Select-Object Name,Length
```

תוצאה רצויה: פחות מ־4,194,304 bytes. אם הקובץ גדול יותר, לדחוס textures, להקטין mesh density, או להריץ אופטימיזציה לפני שילוב.

## שלב 7: אינטראקציה, גלילה ומובייל

- [ ] להוסיף ל־CSS מצבים ברורים:

- `body.is-character-docked` אחרי גלילה / pointermove.
- `.no-webgl-character` להצגת fallback.
- `.using-procedural-character` כדי שאפשר יהיה לזהות שה־GLB עדיין לא נטען.

- [ ] בדסקטופ לבדוק:

- בכניסה הדמות קרובה למרכז ה־hero.
- בגלילה ראשונה הדמות מפנה מקום וזזה ימינה.
- בעכבר יש תנועת ראש/גוף עדינה.
- הדמות לא מכסה כותרת, CTA, ניווט או cards.

- [ ] במובייל לבדוק:

- אין horizontal scroll.
- הדמות לא חוסמת את ה־hero text.
- אחרי גלילה הדמות יורדת בחשיבות חזותית.
- אזורי contact ו־certifications קריאים בלי overlay.

## שלב 8: בדיקות אוטומטיות

- [ ] להריץ:

```powershell
node --test test\about-page.test.js
```

תוצאה רצויה: כל הבדיקות עוברות.

- [ ] להריץ בדיקת whitespace:

```powershell
git diff --check
```

תוצאה רצויה: אין שורות בעייתיות.

- [ ] לפתוח שרת מקומי:

```powershell
python -m http.server 52915
```

אם הפורט תפוס:

```powershell
python -m http.server 50259
```

## שלב 9: QA חזותי בדפדפן

- [ ] לבדוק בדסקטופ `1440x900`:

- ה־hero נראה פרימיום ולא תבניתי.
- Rotem הוא הסיגנל הראשי.
- Maya מופיעה רק כסקשן פרויקט.
- הדמות נראית חיה, לא כתמונה צפה.
- אין overlap בין טקסט, כפתורים, canvas וניווט.
- Canvas אינו ריק.

- [ ] לבדוק במובייל `390x844`:

- אין horizontal scroll.
- הטקסט לא נשבר בתוך כפתורים.
- הדמות לא חוסמת CTA.
- כל הסקשנים ניתנים לקריאה.
- ביצועים נשארים חלקים.

- [ ] לבצע בדיקת Canvas pixel:

```js
const canvas = document.querySelector("[data-three-character-stage]");
const gl = canvas.getContext("webgl") || canvas.getContext("webgl2");
Boolean(canvas && gl && canvas.width > 0 && canvas.height > 0);
```

תוצאה רצויה: `true`. בנוסף יש לוודא ויזואלית שה־canvas לא שקוף לגמרי.

## שלב 10: סקירה מול הספציפיקציה

- [ ] להשוות מול `docs/superpowers/specs/2026-07-25-cinematic-3d-rotem-about-design.md`.

- [ ] לוודא:

- האתר מדבר קודם על רותם.
- אין חזרה לאתר Maya-first.
- אין שימוש בתמונה הצפה הישנה כדמות הסופית.
- הדמות זזה בכניסה, בגלילה ובעכבר.
- reduced motion עובד.
- fallback עובד.
- דסקטופ ומובייל נבדקו בפועל.

## שלב 11: Commit ו־Push לאחר אישור

- [ ] לבדוק diff:

```powershell
git status --short
git diff -- index.html styles.css script.js test\about-page.test.js assets\3d\README.md
```

- [ ] להכין commit:

```powershell
git add index.html styles.css script.js test\about-page.test.js assets\3d\README.md
git commit -m "Build cinematic 3D Rotem about experience"
```

- [ ] לא להוסיף את `assets/3d/rotem-z-rabbit.glb` לאותו commit אם הקובץ לא עבר בדיקת משקל ו־QA.

- [ ] לאחר אישור משתמש, לדחוף:

```powershell
git push -u origin feature/cinematic-3d-about
```

- [ ] מיזוג ל־`main` ופרסום ל־GitHub Pages מתבצע רק אחרי שהמשתמש רואה את התוצאה המקומית ומאשר.

## נקודות בקרה

- [ ] אחרי שלב 3: האתר עדיין קריא בלי CSS/JS מורכב.
- [ ] אחרי שלב 5: יש דמות תלת־ממדית פרוצדורלית חיה גם בלי GLB.
- [ ] אחרי שלב 6: הדמות האמיתית מחליפה את הפרוצדורלית אוטומטית כשה־GLB קיים.
- [ ] אחרי שלב 9: יש אישור חזותי דסקטופ + מובייל.
- [ ] אחרי שלב 11: הקוד מוכן לפרסום מבוקר.

## Self-Review

Spec coverage:

- מכסה מיקוד ברותם, לא במאיה.
- מכסה דמות 3D חיה, תנועה בגלילה ובעכבר, mobile safety ו־reduced motion.
- מכסה תהליך Meshy/Tripo + Blender בתקציב ראשוני.
- מכסה בדיקות, QA, commit ופרסום מבוקר.

Open-item scan:

- אין סימוני עבודה פתוחים או ניסוחים שמשאירים חלקים לא מוגדרים.
- יש נתיב מפורש לדמות פרוצדורלית בשלב ראשון ונתיב מפורש ל־GLB אמיתי.
- כל משימה כוללת קבצים, פקודות או תנאי הצלחה.

Type consistency:

- האתר נשאר סטטי.
- Three.js נטען כ־ES module דרך import map.
- GLB נטען דרך GLTFLoader.
- בדיקות Node נשארות CommonJS כמו בקובץ הקיים.
