# About Rotem Page Design

Date: 2026-07-19
Status: Approved design, pending implementation plan
Target site: `about.rotem-dev.org`
Implementation repo: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim.github.io`

## Goal

Build a modern, accessible, bilingual personal business-card page for Rotem Zacaim.

The page should present Rotem as a cyber security and infrastructure operator who also builds practical AI systems. It should lead with professional credibility for recruiters and managers, then reveal the Maya project as the unusual proof of independent AI, automation, infrastructure, and lab-building ability.

Primary positioning:

> אנליסט אבטחת מידע ותשתיות שבונה כלי AI אופרטיביים.

English equivalent:

> Security and infrastructure analyst building operational AI tooling.

## Audience Priority

The page should serve a mixed audience, in this order:

1. Recruiters and managers for Cyber, SOC, Security Operations, Infrastructure, and AI-adjacent security roles.
2. Potential partners or clients interested in AI automation, secure lab work, and infrastructure tooling.
3. Technical LinkedIn/community visitors who want a quick proof of real independent building.

The page must not feel like a generic resume. It should feel like a polished, credible operator profile with a strong AI lab signal.

## Language

Default language: Hebrew.

The page must include a clear language toggle:

```text
עברית / English
```

Behavior:

- Hebrew is RTL and loads by default.
- English is LTR and available by one click.
- The toggle swaps all visible copy without page reload.
- The active language should persist in `localStorage`.
- Metadata should remain useful in both languages where practical.
- Contact links, external links, and project labels stay stable across languages.

## Domain

Target public subdomain:

```text
about.rotem-dev.org
```

The design should also remain compatible with the existing GitHub Pages site at:

```text
https://rotem-zacaim.github.io/
```

## Content Sources

Use these sources as the authoritative input:

- Resume PDF: `C:\Users\rotem\Desktop\קורות חיים רותם זכאים 2026.pdf`
- Current profile site: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim.github.io`
- Maya project docs:
  - `C:\Users\rotem\Documents\codex\WEB\maya\PROJECT-OVERVIEW.md`
  - `C:\Users\rotem\Documents\codex\WEB\maya\README.md`
  - `C:\Users\rotem\Documents\codex\WEB\maya\docs\HOME_ASSISTANT_PROJECT.md`
  - Maya design specs under `C:\Users\rotem\Documents\codex\WEB\maya\docs\superpowers\specs\`
- LinkedIn public profile:
  - `https://www.linkedin.com/in/rotem-zacaim-b4a709223/`

Public search confirmed the LinkedIn headline as:

```text
Cyber Security Analyst | Threat Hunting | Incident Response | SIEM | Penetration Testing | Adversary Mindset
```

Do not rely on private LinkedIn content unless it is explicitly accessible in the browser during implementation.

## Approved Approach

Use approach 1: **Security First, AI Lab Second**.

Rationale:

- Recruiters understand the value quickly.
- The page opens with trustworthy professional context.
- Maya becomes the memorable differentiator, not a confusing opening claim.
- The page remains a business card, not a long product brochure.

Rejected alternatives:

- Maya-first case study: technically impressive but less immediately clear for role-fit.
- Pure project portfolio: useful for LinkedIn/community, but weaker as a first-contact profile.

## Page Structure

### 1. Hero

Purpose: establish who Rotem is in one screen.

Content:

- Name: Rotem Zacaim / רותם זכאים.
- Main headline in Hebrew:
  - `אנליסט אבטחת מידע ותשתיות שבונה כלי AI אופרטיביים`
- Supporting copy should mention:
  - Security operations.
  - Infrastructure troubleshooting.
  - SIEM and incident investigation.
  - Independent AI lab work.
- Primary CTA:
  - Hebrew: `לראות את מעבדת מאיה`
  - English: `Explore Maya AI Lab`
- Secondary CTA:
  - Hebrew: `LinkedIn / יצירת קשר`
  - English: `LinkedIn / Contact`
- Language toggle visible in the header.

Visual:

- Professional command-center feel, but restrained.
- Strong first-viewport signal that this is Rotem's profile, not only a project page.
- Use a concise visual motif such as an operator console, lab map, or system graph.

### 2. Core Profile

Purpose: show practical professional capability before the AI lab.

Content themes from the resume:

- Information Security and Infrastructure Operations Analyst at the National Digital Agency, 2023-present.
- SIEM and Splunk log analysis.
- WAF, Proxy, Load Balancer, firewall, SSL, API Gateway, IBM DataPower.
- Security products: Imperva, F5, Check Point, IPS/IDS, CyberArk, IronPort, Blue-AV, FireGlass, Cloudflare.
- Windows/Linux server troubleshooting.
- Monitoring tools: Dynatrace, SCOM, Nimsoft, Montier, PRTG, ELK.
- Networking fundamentals: HTTP/S, DNS, TCP/IP, Wireshark.
- Incident Response basics, investigation, classification, and permissions.

Display:

- Use compact capability groups.
- Avoid a long CV list.
- Show this as "what I solve" rather than "everything I touched".

### 3. Maya AI Lab

Purpose: deliver the wow moment.

Position Maya as:

```text
מעבדת AI אישית שמחברת WhatsApp, תשתיות, מודלים מקומיים, ניטור, בית חכם ואוטומציה למערכת אחת.
```

Must include:

- Hebrew-first personal WhatsApp AI agent.
- OpenAI orchestration and tool calling.
- Google Calendar read/create/update/delete and Google OAuth.
- Voice input/output and image understanding.
- Long-term memory with SQLite and semantic retrieval.
- URL intelligence, weather, maps, vouchers, finance, daily digest, proactive reminders.
- Admin dashboard / Maya Command OS.
- RoteMGPT chat with local OpenAI-compatible model.
- Local model work with GGUF / llama.cpp style runtime.
- Closed lab local models without external provider filtering, phrased responsibly:
  - Hebrew: `הרצת מודלים מקומיים בסביבת מעבדה סגורה, ללא תלות בסינון של ספק חיצוני, לצורכי מחקר, בדיקה והבנת סיכוני AI.`
  - English: `Running local models inside a closed lab environment, without dependency on external provider filtering, for research, testing, and AI risk understanding.`
- RedLab as an authorized, bounded PT workbench with allowlisted tools and evidence-based Hebrew reports.
- Android Lab and Companion App.
- Home Assistant smart home integration.
- Cloudflare Tunnel and Cloudflare Access for secure remote access.
- Server monitoring and observability.

Safety and credibility:

- Do not present unsafe offensive details as instructions.
- Mention "authorized", "closed lab", "allowlisted", "guarded", and "operator-controlled" where relevant.
- Show that the server enforces policy, not that the model gets raw shell power.

### 4. Selected Systems

Purpose: show breadth without overwhelming.

Use compact cards or rows for:

- Maya WhatsApp Agent: natural Hebrew conversation, memory, tools, voice, vision.
- RoteMGPT / Local Models: local inference, raw-mode lab option, file fallback for long answers.
- Home Assistant Wall Panel: smart home control, vacuum, AC, cameras, Tuya shutter, OpenRGB server lighting.
- Server Observability: metrics dashboard, logs, service status, Cloudflare Access user context.
- RedLab: authorized security workbench with deterministic recon, local LLM planning, evidence, reports.
- Android Lab: ADB, scrcpy, screen control, WhatsApp compose, realtime actions, device allowlist.
- Browser/Game Lab: private browser games, Quake/arena hosting, Clash Royale agent, FortySevenMS GUI control through visible screen only.
- Cloudflare Remote Ops: private SSH/VNC-style access behind tunnels, Access, and systemd services, without publishing operational hostnames.
- Google Integrations: Calendar OAuth, maps, gateway/API style integration experience.

Each card should answer:

- What it is.
- What it proves.
- Which technologies are involved.

### 5. Experience And Certifications

Purpose: provide resume depth after the page has already established the story.

Use distilled timeline:

- 2023-present: Information Security and Infrastructure Operations Analyst, National Digital Agency.
- 2021-2023: Command and Control Center, Ministry of Health.
- 2020-2021: Israel Police, patrol foundation training.
- 2013-2017: Branch manager, food chain.
- 2014-2017: ERP SAP inventory/logistics operator, IDF, completed inventory management course with excellence.

Education and certifications:

- Cyber Defender course, John Bryce, 650 academic hours.
- QA software testing, Technion.
- Cisco CCNA 200-301 Complete Course: Packet Tracer Labs, Udemy.
- Applied Ethical Hacking and Rules of Engagement, Udemy.
- Jr Penetration Tester Certificate, TryHackMe.
- SAP inventory management course, IDF, completed with excellence.
- MDA medic and ambulance driver course.

Volunteering:

- MDA medic and ambulance driver, resuscitation systems implementer.
- United Hatzalah team leader and North Jerusalem ambulance coordinator.
- Lectures for different populations, including youth at risk and medics.
- Israel Police intelligence unit.

### 6. Contact

Purpose: clear next action.

Content:

- Email: `Rotemvnkll@gmail.com`
- LinkedIn: `https://www.linkedin.com/in/rotem-zacaim-b4a709223/`
- Existing GitHub Pages: `https://rotem-zacaim.github.io`
- Optional GitHub profile link if verified during implementation.

Use accessible links and clear labels.

## Visual Direction

The page should feel:

- Modern.
- Accessible.
- Professional.
- Technical, but not noisy.
- More "operator profile" than "cyber hacker poster".

Preferred design language:

- Clean dark or near-dark command surface with enough contrast.
- Avoid one-note dark blue/slate dominance by adding restrained accent colors.
- Use compact, polished panels rather than huge marketing cards.
- Avoid decorative blobs, neon overload, or fake dashboards.
- Use real content and credible labels.
- Strong typography, readable Hebrew, careful RTL layout.
- Cards should have small radii, 8px or less, unless inherited existing site style requires otherwise.

The existing site already has a command-deck aesthetic and assistant robot. The redesign may reuse the best parts, but should simplify anything that hurts mobile performance, readability, or credibility.

## Accessibility

Requirements:

- Semantic HTML.
- Hebrew `lang="he"` and `dir="rtl"` by default.
- English mode should switch to `lang="en"` and `dir="ltr"`.
- Keyboard-accessible language toggle and navigation.
- Visible focus states.
- Skip link.
- Strong contrast.
- No text overlap on mobile or desktop.
- Motion should respect `prefers-reduced-motion`.
- Content should remain usable with JavaScript disabled where feasible, or at minimum show Hebrew default content.
- Header navigation must be usable on mobile.

## Implementation Target

Use the existing static site unless implementation planning finds a strong reason to replace it:

- `index.html`
- `styles.css`
- `script.js`
- `favicon.svg`

No React/Vite is required for this deliverable unless the implementation plan proves the existing static architecture is a blocker. A static implementation is better for GitHub Pages and simple hosting.

## Data And State

Only local UI state is needed:

- Active language in `localStorage`.
- Optional reduced motion / loader state if preserving existing behavior.

No backend, forms, analytics, or external API calls are required.

## Non-Goals

- Do not build a full multi-page portfolio.
- Do not expose private secrets, tokens, internal group IDs, credentials, or live operational details that are not appropriate for a public profile.
- Do not publish raw offensive instructions, evasion techniques, or exploitation steps.
- Do not overclaim production-grade AI safety or enterprise product status.
- Do not turn the page into a long resume PDF clone.
- Do not add a contact form that needs backend handling.

## Testing And Verification

Before handoff, verify:

- HTML validity at a practical level.
- Language toggle changes all visible text and direction.
- Hebrew default load.
- Links work.
- Mobile layout at narrow width.
- Desktop layout.
- No horizontal overflow.
- No clipped text.
- Focus navigation works.
- `prefers-reduced-motion` behavior is respected.
- Existing static site still opens locally.

If a local dev server is used, provide the URL. If the site remains plain static HTML/CSS/JS, opening the file directly is acceptable, but browser testing is still required.

## Approved Decisions

- Direction: Security First, AI Lab Second.
- Default language: Hebrew.
- English toggle: required.
- Audience priority: mixed, with recruiters/managers first.
- Subdomain: `about.rotem-dev.org`.
- Maya should be central, but not the first credibility claim.

