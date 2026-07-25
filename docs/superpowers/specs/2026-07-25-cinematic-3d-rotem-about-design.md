# Cinematic 3D Rotem About Site Design

Date: 2026-07-25
Status: Approved design direction, pending implementation plan
Target site: `about.rotem-dev.org`
Implementation repo: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim.github.io`

## Goal

Redesign the existing About site into a premium personal site for Rotem Zacaim.

The site must stay focused on Rotem: information security, infrastructure operations, AI tooling, practical lab work, experience, and credibility. It must not become a Maya product page and must not let the character take over the story.

The approved creative direction is:

> Dark cinematic personal brand with Cyber / Command Center touches and a living 3D rabbit character as a supporting signature element.

The current site feels too template-like. The new version should feel more custom, intentional, cinematic, technical, and memorable.

## Approved Decisions

- Main direction: cinematic and dark, with restrained Command Center details.
- Site focus: Rotem first, Maya and AI Lab second.
- Character style: 3D rabbit mascot similar to the provided reference image.
- Character role: living side guide, not page subject.
- Character production path: Meshy or Tripo to generate GLB candidates, Blender cleanup, Three.js integration.
- Initial character budget: about 20 USD for first model-generation experiments.
- Hosting target: keep the existing static GitHub Pages architecture unless a concrete blocker is found.
- Current content should remain, but be reorganized and elevated visually.

## Audience

Primary audience:

- Recruiters and managers in cyber security, SOC, security operations, infrastructure, and AI-adjacent technical roles.
- Technical people who want proof that Rotem builds real systems.
- Potential collaborators or clients interested in AI automation, secure labs, and infrastructure tooling.

The first impression should be:

> This is a capable security and infrastructure operator who also builds serious AI systems.

It should not feel like:

- A generic resume template.
- A product page for Maya.
- A mascot showcase.
- A fake hacker poster.
- A dashboard mockup with decorative data.

## Visual Direction

The site should feel:

- Dark and cinematic.
- Premium, controlled, and sharp.
- Technical without being noisy.
- Personal and credible.
- More like an operator profile than a portfolio template.

Visual language:

- Near-black cinematic background.
- Controlled light sources and depth.
- Subtle grid, signal, terminal, or system-map details.
- Small polished panels, not oversized generic cards.
- Strong Hebrew typography and careful RTL spacing.
- Selective accent colors, likely one cool cyan or green signal accent plus one restrained warm/fuchsia accent from the character environment.
- No decorative blobs or generic gradient orbs.
- No huge hero section that hides all following content; first viewport should hint at the next section.

The site should include enough visual assets to feel real. The 3D character is the main custom asset. Other technical visuals should be code-native or light procedural UI, not stock-like filler.

## Content Strategy

The existing content remains the source of truth:

- Rotem's cyber and infrastructure experience.
- Security Operations and infrastructure tooling.
- Maya AI Lab as proof of serious independent AI work.
- RoteMGPT.
- Home Assistant.
- Android Lab.
- RedLab.
- Cloudflare and server operations.
- Experience and certifications.
- Contact links.

Content should be reorganized around Rotem's story:

1. Who Rotem is.
2. What Rotem solves professionally.
3. What Rotem builds independently.
4. What systems prove those claims.
5. Experience, certifications, and contact.

Maya should be presented as one strong proof point in the AI Lab, not as the whole identity of the page.

## Page Structure

### 1. Cinematic Hero

Purpose: establish Rotem immediately.

The hero should include:

- Name: Rotem Zacaim / רותם זכאים.
- Main professional positioning around cyber security, infrastructure, and operational AI tooling.
- Short supporting copy in Hebrew by default.
- Primary CTA to the AI Lab or project section.
- Secondary CTA to LinkedIn or contact.
- Language toggle.
- 3D rabbit character as a hero signature, visually connected to the composition.

The character starts as part of the hero scene, not as a floating image.

### 2. Operator Profile

Purpose: show practical professional capability.

Include compact groups for:

- Security operations.
- SIEM and Splunk.
- WAF, Proxy, Load Balancer, SSL, API Gateway.
- Windows/Linux troubleshooting.
- Cloudflare and remote access patterns.
- Monitoring and observability.
- Incident response and investigation.

This section should answer:

> What problems can Rotem solve in the real world?

### 3. AI Lab / Maya

Purpose: provide the memorable wow moment while keeping Rotem as the subject.

Include:

- Maya WhatsApp AI Agent.
- Memory and semantic retrieval.
- Google Calendar and OAuth integrations.
- Voice, vision, tools, daily digest, reminders.
- RoteMGPT and local model experiments.
- Home Assistant smart-home integration.
- Android Lab.
- RedLab as an authorized and bounded security workbench.
- Cloudflare infrastructure and protected access.

Tone:

- Impressive, but responsible.
- Use "closed lab", "authorized", "allowlisted", "guarded", and "operator-controlled" where relevant.
- Do not expose internal IDs, tokens, secrets, or operational access details.

### 4. Project / Systems Map

Purpose: turn the current long content into a memorable system view.

Recommended pattern:

- A cinematic Command Center style map.
- Each node represents a system: Maya, RoteMGPT, Home Assistant, Android Lab, RedLab, Cloudflare, Observability.
- User can scan quickly, then open or read compact details.

The section should not become a dense dashboard. It should feel like a polished technical map.

### 5. Experience And Certifications

Purpose: provide resume depth after the story is established.

Include:

- Current National Digital Agency role.
- Ministry of Health command/control role.
- Military SAP/logistics experience.
- Relevant cyber, QA, CCNA, ethical hacking, TryHackMe, MDA, and volunteer experience.

This section should be compact and readable, not a CV dump.

### 6. Contact

Purpose: clear next step.

Include:

- Email.
- LinkedIn.
- Optional GitHub link if verified.
- Short call to action for cyber, infrastructure, AI tooling, and automation conversations.

## 3D Character Specification

The character should be similar to the supplied rabbit image, but branded for Rotem.

Character requirements:

- 3D grey rabbit.
- Soft fur feeling.
- Dark sunglasses.
- Black shirt.
- Text on shirt: `rotem.z`.
- White pants.
- Light or white shoes.
- Cool, confident pose.
- A pointing hand or subtle gesture is preferred.
- Not childish.
- Not a generic cute mascot.
- Should feel like a premium brand companion.

The text `MAYA AGENT` should not appear on the character. This avoids making the site feel like a Maya product page.

## 3D Production Pipeline

Approved pipeline:

1. Use Meshy or Tripo to generate several GLB candidates from the reference character and prompt.
2. Select the best model candidate.
3. Clean and optimize in Blender.
4. Export web-ready GLB.
5. Integrate with Three.js.
6. QA desktop and mobile performance.

Budget:

- Initial experiment budget is around 20 USD.
- Use the budget to generate multiple candidates, not to chase a perfect first result.
- The expected first milestone is a usable prototype-quality character, not a guaranteed final AAA mascot.

Official tool references:

- Meshy pricing: `https://www.meshy.ai/pricing`
- Tripo pricing: `https://developers.tripo3d.ai/en/pricing`
- Three.js: `https://threejs.org/`
- Spline pricing, if needed for comparison: `https://spline.design/pricing`

MCP role:

- MCP can help with Figma, GitHub, browser testing, and process coordination.
- MCP does not replace the 3D model production pipeline.
- A dedicated 3D asset tool or manual Blender cleanup is still required.

## Character Behavior

Approved role: living side guide.

Desktop behavior:

- Character appears in the hero as part of the cinematic scene.
- On scroll, it moves to the side and becomes a smaller guide.
- It has a subtle idle animation.
- It can look or turn slightly toward the pointer.
- It can react gently when entering key sections.
- It should never cover important text or buttons.

Mobile behavior:

- Character appears in the opening in a controlled way.
- It should not remain as a persistent side guide on small screens.
- It may reappear in selected sections if it does not block content.
- It must not cause horizontal overflow.
- It must respect limited GPU and battery performance.

Accessibility:

- Respect `prefers-reduced-motion`.
- Provide a static or simplified fallback.
- Keep content usable if the 3D asset fails to load.
- Do not rely on the character to communicate essential information.

## Technical Direction

Preferred implementation:

- Keep static site architecture.
- Use existing `index.html`, `styles.css`, `script.js` unless the implementation plan finds a real reason to change.
- Add Three.js only for the 3D character scene.
- Use GLTFLoader for GLB.
- Use lazy loading or delayed initialization if needed.
- Use responsive canvas sizing.
- Use fallback static image or hidden character state if WebGL is unavailable.

Performance requirements:

- Optimize GLB size.
- Avoid huge textures.
- Avoid heavy realtime shadows.
- Keep mobile GPU work modest.
- Verify with browser screenshots and canvas checks.

## What Went Wrong Before

The reverted Maya Agent attempt failed because:

- It shifted the site focus from Rotem to Maya.
- The character was a floating raster image, not a living 3D asset.
- The hero composition blocked or competed with the actual content.
- The page became too much like a character product page.
- Mobile composition was fragile.

This redesign must avoid those mistakes.

## Non-Goals

- Do not build a Maya-first site.
- Do not make the 3D character the main content.
- Do not ship a static cutout as the final character solution.
- Do not use a heavy 3D scene that breaks mobile.
- Do not expose private operational details, secrets, tokens, group IDs, phone IDs, keys, credentials, or remote access internals.
- Do not publish offensive security instructions.
- Do not rebuild the whole repo into React unless there is a concrete implementation need.
- Do not add a backend or contact form for this phase.

## Verification Requirements

Before any final handoff, verify:

- Existing page content still exists in upgraded form.
- Site remains about Rotem.
- Hebrew default works.
- English toggle works if preserved in scope.
- Desktop layout.
- Mobile layout.
- No horizontal overflow.
- No clipped or overlapping text.
- Character does not block content.
- Three.js scene loads.
- GLB loads.
- Canvas is not blank.
- Character moves on desktop.
- Scroll transition works.
- Mobile fallback is acceptable.
- Reduced motion fallback works.
- Existing tests pass.
- New tests cover character hooks and public safety.

## Implementation Phasing

Phase 1: Design and content implementation without final 3D dependency.

- Build the dark cinematic / command-center site structure.
- Keep content focused on Rotem.
- Add a temporary 3D placeholder only if needed for layout testing.

Phase 2: 3D asset production.

- Generate candidates in Meshy or Tripo.
- Select model.
- Clean in Blender.
- Export web-ready GLB.

Phase 3: Three.js integration.

- Add real character.
- Implement idle, pointer, and scroll behavior.
- Add reduced-motion and fallback states.

Phase 4: Browser QA and polish.

- Desktop and mobile screenshots.
- Canvas checks.
- Performance checks.
- Final copy and layout pass.

