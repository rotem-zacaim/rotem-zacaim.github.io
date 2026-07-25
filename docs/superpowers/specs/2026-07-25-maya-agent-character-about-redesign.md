# Maya Agent Character About Redesign - Design

Date: 2026-07-25
Status: User-approved direction, pending implementation plan
Target site: `about.rotem-dev.org`
Implementation repo: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim.github.io`

## Goal

Replace the current `about.rotem-dev.org` visual direction with a vivid, character-led Maya Agent page inspired by the approved reference direction "A: Bold Character Hero".

The site remains a static GitHub Pages-compatible site by default. It should only move to the Debian server if implementation proves GitHub Pages cannot handle the final asset weight, animation performance, or hosting needs. The first implementation target is the existing `rotem-zacaim.github.io` repo, which already contains `CNAME` for `about.rotem-dev.org`.

## Approved Visual Direction

Use the bold fuchsia character-hero direction:

- High-saturation pink/fuchsia first viewport.
- Large Maya Agent character as the first visual signal.
- White rounded feature panels that slide into the composition.
- Subtle embossed or layered background typography/textures.
- Clean top navigation with a compact brand mark and anchors.
- A strong, polished brand moment rather than a dark SOC dashboard.

The current profile site's professional credibility still matters, but the first impression should now be "Maya Agent is alive and memorable" rather than "operator console".

## Character Source

Use the user-provided Maya Agent rabbit image as the character identity source:

```text
C:\Users\rotem\Downloads\Gemini_Generated_Image_tlh11vtlh11vtlh1 (1).png
```

Character traits to preserve:

- Gray rabbit character with long ears.
- Sunglasses.
- Black shirt with `MAYA AGENT`.
- Pink shorts and light shoes.
- Pointing pose.
- Premium 3D toy/mascot render quality.
- Slightly playful, confident personality.

The final site should not copy the older reference rabbit as a separate design. The supplied Maya Agent image is the brand character.

## Character Production Approach

Use a hybrid of:

1. Image cutout asset.
2. A small set of pose/state assets.
3. Code-driven motion.

Do not start with a full realtime 3D model. A live GLB/Three.js character is a later upgrade path if the static asset approach cannot create enough life.

Required first-pass assets:

- Transparent PNG/WebP cutout of the provided Maya Agent character.
- Optimized desktop asset, ideally WebP with PNG fallback if needed.
- Optimized mobile asset, smaller but visually crisp.
- Separate soft shadow asset or CSS shadow layer.

Preferred second-pass assets if generation/editing can keep identity consistent:

- `intro` pose: centered, confident, neutral/pointing.
- `side` pose: shifted to the right side of the hero.
- `pointing` pose: points toward the white feature panels.

If identity consistency is not reliable, use one high-quality cutout and create life through transform, parallax, masks, and shadow motion instead of shipping inconsistent alternate characters.

## Character Motion

The character must feel alive without becoming heavy or distracting.

Desktop behavior:

- Initial load: character starts centered and dominant.
- Idle: subtle vertical float, tiny rotate/tilt, and soft shadow breathing.
- Mouse move over hero: character responds with low-amplitude parallax.
- Hover over the hero or primary panel area: character shifts to the right, making space for copy and feature panels.
- Scroll past the hero threshold: character shifts to the right and scales down slightly, staying visible as the page begins.
- White feature panels slide in from the left/center while the character moves aside.

Mobile behavior:

- Initial load: character starts near the center/top of the hero, large enough to read but not blocking the headline.
- Scroll threshold: character moves upward/right and scales down, leaving vertical space for copy and panels.
- No mouse-only dependency. Scroll and touch-safe triggers must drive the state.
- Avoid fixed-position behavior that covers content on small screens.

Reduced motion behavior:

- Respect `prefers-reduced-motion`.
- Disable idle float and parallax.
- Use one simple non-animated shifted composition after load or on scroll.

Implementation constraints:

- Use CSS transforms and opacity for animation.
- Use `requestAnimationFrame` for scroll/mouse state updates if JavaScript is needed.
- Avoid layout-affecting animation.
- Avoid canvas or WebGL for this first implementation.

## Page Structure

### 1. Hero

Purpose: deliver the brand moment.

Elements:

- Top navigation: `Maya Agent`, `Story`, `Abilities`, `Projects`, `Contact`.
- Large character centered on first paint.
- Main copy anchored around the character after shift.
- White feature panels:
  - `WhatsApp AI Agent`
  - `Memory + Calendar`
  - `Voice, Vision, Automation`
- Primary CTA: `Explore Maya`
- Secondary CTA: `Contact Rotem`
- A hint of the next section must be visible on desktop and mobile.

Hero copy direction:

```text
Maya Agent
AI אישי שמנהל שיחה, זיכרון, יומן, קול, תמונות ואוטומציות סביב החיים האמיתיים.
```

Implementation may adjust line breaks and wording polish, but the visible story must stay short, punchy, and equivalent in meaning.

### 2. Story

Purpose: explain what Maya is without turning the page into a dashboard.

Content:

- Maya is a Hebrew-first personal WhatsApp AI agent.
- It connects conversation to real tools: calendar, memory, weather, maps, vouchers, voice, images, daily digest, reminders, and Home Assistant.
- It is built by Rotem as a personal AI lab and operational proof.

### 3. Abilities

Purpose: show concrete capability in scannable modules.

Use non-nested cards or full-width bands, not a dense dashboard grid.

Core abilities:

- WhatsApp conversation.
- Long-term memory.
- Calendar and reminders.
- Voice and vision.
- Home Assistant and smart home.
- Local model/RoteMGPT lab.
- RedLab and authorized security workbench, phrased safely.
- Server observability and Cloudflare access.

### 4. Projects / Proof

Purpose: preserve Rotem's credibility and connect the mascot site to real work.

Include compact proof rows for:

- Maya Command OS.
- RoteMGPT.
- Android Lab.
- Home Assistant wall panel.
- RedLab.
- Browser/game lab.

Do not publish secrets, private identifiers, live tokens, internal group IDs, or unsafe operational steps.

### 5. Contact

Purpose: make the next action obvious.

Links:

- Email: `Rotemvnkll@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/rotem-zacaim-b4a709223/`
- Optional links to public labs only when they are already intended for public viewing.

## Relationship To Existing Site

The current site is a bilingual professional profile with a command-deck aesthetic. This redesign is allowed to replace the first impression and visual system, but should preserve useful existing infrastructure:

- Static `index.html`, `styles.css`, `script.js`.
- `CNAME`.
- SEO metadata for `about.rotem-dev.org`.
- Hebrew default and English toggle.
- Existing tests can be updated rather than discarded.

The old "Security First, AI Lab Second" positioning is no longer the hero composition. Security credibility should move into proof sections, while Maya Agent becomes the opening visual story.

## Technical Target

Primary target:

- GitHub Pages static hosting.
- No backend.
- No React/Vite unless implementation proves the existing static architecture is a blocker.
- Store final assets under an `assets/` folder in the about repo.

Asset performance budget:

- Keep initial character assets optimized.
- Use `loading`, `fetchpriority`, and responsive image sources where appropriate.
- Prefer WebP for large character imagery with fallback if needed.
- Keep first-load JavaScript small.

## Accessibility And UX

Requirements:

- Semantic HTML.
- Hebrew default remains accessible.
- English toggle remains part of scope.
- Keyboard-accessible navigation and CTAs.
- Visible focus states.
- Skip link.
- Strong contrast on fuchsia backgrounds and white cards.
- No text overlap with the character on mobile or desktop.
- Motion respects reduced-motion preferences.
- Character is decorative unless it conveys necessary content; use appropriate `alt` text or `aria-hidden` based on final composition.

## Testing And Verification

Before handoff:

- Run existing static tests and update them for the new approved direction.
- Verify desktop in browser.
- Verify mobile viewport in browser.
- Verify scroll state moves the character aside on desktop and mobile.
- Verify hover/mouse parallax on desktop.
- Verify reduced-motion fallback.
- Verify no horizontal overflow.
- Verify no text is clipped or hidden behind the character.
- Verify asset loading and first viewport appearance.

## Non-Goals

- Do not build a full realtime 3D model in this pass.
- Do not add a backend.
- Do not add a contact form.
- Do not turn the page into a dark cyber dashboard.
- Do not expose private Maya infrastructure or secrets.
- Do not over-optimize for the old resume-like page at the expense of the character-led brand.

## Approved Decisions

- Target: replace `about.rotem-dev.org`.
- Keep GitHub Pages/static hosting unless a concrete limitation appears.
- Visual direction: A, bold fuchsia character hero.
- Character: user-provided Maya Agent rabbit.
- Character approach: transparent cutout plus code-driven motion, with optional extra poses.
- Behavior: centered on entry; moves aside on scroll and hover; subtle idle motion so the site feels alive.
