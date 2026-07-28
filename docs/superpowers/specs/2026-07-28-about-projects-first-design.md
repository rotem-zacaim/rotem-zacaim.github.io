# About Projects-First Redesign

Date: 2026-07-28
Status: Approved design, pending implementation plan
Target site: `about.rotem-dev.org`
Implementation repo: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d`

## Goal

Rebuild the About site around Rotem Zacaim's real projects first.

The top of the site should stop reading like a generic profile and should immediately expose the things Rotem built: AI agents, home automation, local model work, security labs, monitoring/control systems, and browser/mobile game labs. The resume then supports the projects with a year-by-year professional timeline, courses, certifications, and skills.

The approved direction is **A: Projects First**.

## Audience

The site should serve:

1. Recruiters and managers who need to understand Rotem's security, infrastructure, and AI automation experience quickly.
2. Technical visitors from LinkedIn who want proof that the projects are real.
3. Potential collaborators who care about practical AI, homelab systems, and authorized security research.

The first viewport must show Rotem's name and immediately reveal the projects section. The site should not make visitors scroll through a long biography before seeing the work.

## Language

Default language: Hebrew.

Keep the current bilingual pattern:

- Hebrew loads by default with `lang="he"` and `dir="rtl"`.
- English remains available through the existing language toggle.
- The navigation starts with `Projects`.
- Project names may stay in English when they are product/tool names: Maya, RoteMGPT, RedLab, Home Assistant, Android Lab.

## Content Sources

Use these sources as the authoritative content pool:

- Resume PDF: `C:\Users\rotem\Desktop\קורות חיים רותם זכאים 2026.pdf`
- Active About site repo: `C:\Users\rotem\Documents\codex\WEB\rotem-zacaim-about-3d`
- Maya/local mon source repo: `C:\Users\rotem\Documents\codex\WEB\maya`
- LinkedIn activity page, read after user sign-in on 2026-07-28:
  - `https://www.linkedin.com/in/rotem-zacaim-b4a709223/recent-activity/all/`

LinkedIn loaded 12 posts. Local extracted working copies were saved under the brainstorm session:

- Text: `.superpowers/brainstorm/18176-1785252923/state/linkedin-posts.json`
- Media: `.superpowers/brainstorm/18176-1785252923/linkedin-media/`

Do not hotlink LinkedIn images in production because signed URLs can expire. During implementation, copy selected images into a stable public assets folder, rename them by project, optimize them, and use local paths.

The live `mon.rotem-dev.org` page is protected by Google/Cloudflare Access. Public site content for mon/Maya must therefore come from the local Maya repository and be phrased as public-safe, high-level system descriptions.

## Approved Page Structure

### 1. Compact Hero

Purpose: identify Rotem and immediately lead visitors into the project portfolio.

Content:

- Name: `רותם זכאים` / `Rotem Zacaim`.
- One-line positioning:
  - Hebrew: `אנליסט אבטחת מידע ותשתיות שבונה מערכות AI, אוטומציה ומעבדות סייבר מעשיות.`
  - English: `Security and infrastructure analyst building practical AI, automation, and cyber lab systems.`
- Primary CTA: `לראות פרויקטים` / `View Projects`.
- Secondary CTA: `ציר זמן מקצועי` / `Professional Timeline`.

Layout:

- Keep the hero compact so the first row of project cards is visible on desktop and close on mobile.
- The site must not rely on the current 3D rabbit as the main message.
- The rabbit is not removed in this phase. It should be visually de-emphasized or kept as a background/supporting element until a replacement visual is chosen later.

### 2. Projects Section

Purpose: become the main content surface of the site.

Navigation label: `Projects`.

Display:

- A responsive project grid.
- Each card includes: title, short summary, category chips, source/proof label, year/status, image when available, and a clear `הרחבה` / `More` button.
- The button opens an accessible inline detail panel below the project grid.
- The active detail button uses `aria-expanded`, the panel has a stable heading, and the page hash updates to the project slug.
- Closing a detail panel returns focus to the card button that opened it.

Primary project cards:

1. **Home Assistant + Maya**
   - Source: LinkedIn post `urn:li:activity:7486080918772924417`, Maya Home Assistant docs.
   - Image: `linkedin-7486080918772924417-1.jpg`.
   - Summary: Debian/Docker Home Assistant setup, smart-home devices, wall dashboard, REST API, and Maya orchestration through WhatsApp.
   - Detail should cover: layered architecture, Dashboard as Code, API boundary, secure token handling at a high level, and the separation between natural-language requests and physical device actions.

2. **Maya WhatsApp AI Agent**
   - Source: LinkedIn post `urn:li:activity:7447689751286927362`, Maya docs.
   - Images: `linkedin-7447689751286927362-1.jpg`, `linkedin-7447689751286927362-2.jpg`.
   - Summary: Hebrew-first personal WhatsApp AI agent with calendar, memory, vouchers, voice, images, URL intelligence, weather, maps, daily digest, and infrastructure monitoring.
   - Detail should cover: WhatsApp message router, OpenAI tool orchestration, Google Calendar OAuth, SQLite/semantic memory, voice input/output, and allowlisted access.

3. **Local LLM / Cyber Agent**
   - Source: LinkedIn post `urn:li:activity:7456387164772167680`, Maya local model docs.
   - Image: `linkedin-7456387164772167680-1.jpg`.
   - Summary: Maya can route selected security-lab questions to a local model running in a controlled private environment.
   - Detail should cover: local inference, RoteMGPT, OpenAI-compatible endpoint pattern, Cloudflare Access/Tunnel at a high level, and responsible use for authorized labs, learning, and AI risk understanding.

4. **ROTEMZ Scanner / RedLab**
   - Source: LinkedIn post `urn:li:activity:7405652741395496960`, `ROTEMZ-Web-Security-Scanner`, Maya RedLab docs.
   - Image: `linkedin-7405652741395496960-1.jpg`.
   - Summary: Authorized security workbench for recon, asset mapping, TLS/header checks, evidence collection, and Hebrew PT-style reports.
   - Detail should cover: deterministic recon, report generation, finding evidence, retest checklist, and guardrails. Do not publish operational attack instructions.

5. **Zacaim WiFi / Raspberry Pi Lab**
   - Source: LinkedIn post `urn:li:activity:7435595214980898817`, `Zacaim-WiFi-Tool`.
   - Images: `linkedin-7435595214980898817-1.jpg`, `linkedin-7435595214980898817-2.jpg`.
   - Summary: Portable cyber lab built with Raspberry Pi, Kali, wireless hardware, and a Python CLI for authorized wireless learning and testing.
   - Detail should cover: hardware/software setup, CLI workflow at a non-actionable level, evidence mindset, and ethical/authorized boundaries.

6. **mon / Private Control Center Labs**
   - Source: local Maya admin/dashboard code and docs.
   - Image: use a safe local screenshot from docs or a designed abstract UI preview. Do not expose protected production URLs or internal hostnames.
   - Summary: Private control center for RoteMGPT, OpenAI usage, RedLab, Android Lab, games, monitoring, docs, logs, and admin controls.
   - Detail should cover: what the dashboard organizes, how access is protected, and which systems it proves Rotem can operate.

Secondary project/lab cards:

- RoteMGPT local chat dashboard.
- OpenAI Usage & Costs dashboard.
- Android Lab and Android Companion App.
- Clash Royale automation lab, described as screen-based automation with safety policies.
- FortySevenMS GUI/Vision Farmer, described as visible-screen GUI automation, not memory or packet manipulation.
- Quake 2 Demo and QuakeJS Arena private browser games.
- Apartment Plan App from `C:\Users\rotem\Documents\codex\WEB\OR`.
- AI Super-Analyst Dashboard from `C:\Users\rotem\Documents\codex\WEB\AI`.
- Sale-ים MVP from `C:\Users\rotem\Documents\codex\WEB\saleim`.
- AI-created Framer/About prototype from LinkedIn post `urn:li:activity:7365070927916625920`.
- ChatGPT Agent Mode job-search workflow from LinkedIn post `urn:li:activity:7362224081213059072`.
- ChatGPT shared-link exposure awareness/research note from LinkedIn post `urn:li:activity:7356624275149094912`.

Secondary projects should appear in a compact `Lab Gallery` section after the six primary projects. They should be visible by default as smaller rows/cards, not hidden behind a required extra click.

### 3. Project Details

Purpose: give each important project room without making the top grid unreadable.

Each expanded project should include:

- `מה בניתי` / `What I built`.
- `איך זה עובד` / `How it works`.
- `מה זה מוכיח` / `What it proves`.
- `טכנולוגיות` / `Technologies`.
- `מקור` / `Source`: LinkedIn post, local project, or CV.
- One public-safe screenshot or image where available.

The detail copy should be concise, professional, and specific. Avoid long pasted LinkedIn text. Summarize posts into portfolio copy.

### 4. Year-By-Year Timeline

Purpose: satisfy the resume requirement after the projects have created interest.

Use the resume as the source of truth for work history.

Timeline entries:

- **2026**
  - Active project year for Maya, Home Assistant integration, local LLM/Cyber Agent, Android Lab, RoteMGPT, and mon labs.
  - Cyber training and independent R&D continue.

- **2025**
  - ROTEMZ Scanner / RedLab direction.
  - Raspberry Pi / Zacaim WiFi lab.
  - AI Agent job-search workflow.
  - ChatGPT shared-link exposure research note.
  - AI-created About/Framer prototype.

- **2023-present**
  - Information Security and Infrastructure Operations Analyst, Israel National Digital Agency.
  - Include: Splunk/SIEM, incident/fault handling, Imperva, F5, Check Point FW, IPS/IDS, CyberArk, IronPort, Blue-AV, FireGlass, Cloudflare, WAF/Proxy/Load Balancer, SSL certificates, API Gateway/DataPower, Windows/Linux troubleshooting, Dynatrace, SCOM, Nimsoft, Montier, PRTG, ELK, MISP, Radware, VMware, AWS/GCP basics.

- **2021-2023**
  - Command and Control Center, Ministry of Health.
  - Include: end-user support, remote troubleshooting, Office and health-system support, Active Directory users/groups/permissions, smart-card work with National Digital Agency systems, Web AD automations, support across cloud-based healthcare systems.

- **2020-2021**
  - Israel Police, patrol foundation training.

- **2014-2017**
  - IDF Ordnance Corps, SAP ERP inventory/logistics operator.
  - Include: SAP operation, warehouse/inventory, parts issue, stock transfers, reports, course completed with excellence.

- **2013-2017**
  - Branch manager in a food retail chain.
  - Include: operations, employees, inventory, suppliers, service and sales targets.

### 5. Courses, Certifications, Skills

Purpose: organize CV learning into scannable groups.

Course/certification groups:

- Cyber Defender, John Bryce: use `650 academic hours` from the CV as authoritative.
- QA / Technion: SQL, web testing, JavaScript/HTML5, STR/STP/STD, mobile testing, Jira.
- Cisco CCNA 200-301 / Udemy.
- Applied Ethical Hacking and Rules of Engagement / Udemy.
- Jr Penetration Tester / TryHackMe.
- SAP inventory management / IDF, completed with excellence.
- MDA medic/ambulance driver.

Skill groups:

- Security Operations: SIEM, IR basics, log analysis, WAF, proxies, firewalls, certificates.
- Infrastructure: Windows/Linux, virtualization, monitoring, DNS, HTTP/S, TCP/IP.
- AI and Automation: OpenAI tools, local models, agents, prompt engineering, Node.js, Python/Bash workflows.
- Authorized Security Research: recon, OSINT, vulnerability assessment, reporting, evidence handling.
- Product/UX Building: dashboards, control panels, Hebrew-first interfaces, static sites.

### 6. Contact

Show only public-safe contact methods:

- Email from CV.
- LinkedIn profile URL.
- Public site/domain links.

Do not publish phone number, address, group IDs, personal IDs, tokens, keys, private paths, or private hostnames.

## Visual Direction

The site should feel like a polished portfolio/control-room, not a mascot page and not a generic resume.

Requirements:

- Projects appear visually above the resume material.
- Use real project images where safe.
- Keep cards compact and readable.
- Avoid text overlap on desktop and mobile.
- Avoid nested cards and decorative clutter.
- Do not create a one-note blue/purple cyber palette. Use a restrained dark base with varied accent colors per project category.
- Use icons for categories/actions when implementing buttons and chips.
- The current rabbit should not be the conceptual center of the page. Removing/replacing it is a later visual task, not part of this content redesign unless the user explicitly reopens that scope.

## Safety And Redaction Rules

Never publish:

- Phone number, home address, private identifiers, WhatsApp group IDs, phone IDs, tokens, API keys, OAuth files, environment variable values, private service names, private paths, hostnames, ports, or tunnel details.
- Operational offensive instructions, exploit chains, command sequences, bypass steps, malware/ransomware code, or WiFi attack procedures.
- Screenshots that reveal secrets, internal URLs, device identifiers, personal calendars, private conversations, or access-control details.

Allowed:

- High-level architecture.
- Public-safe technology names.
- Authorized lab framing.
- Evidence/reporting/process descriptions.
- Screenshots after visual review and redaction.

## Testing And Acceptance Criteria

The implementation is acceptable when:

- Navigation starts with Projects.
- First viewport shows Rotem's identity and project content quickly.
- At least six primary project cards exist.
- Each primary project has a More/הרחבה interaction.
- LinkedIn images used in production are local project assets, not external expiring LinkedIn URLs.
- The timeline clearly shows what Rotem did year by year and where.
- Courses and knowledge are grouped into readable categories.
- Phone/address/private operational details are absent.
- The current overlapping layout issues are fixed on desktop and mobile.
- Existing `node --test test\about-page.test.js` passes after tests are updated to the new content contract.
- `git diff --check` passes.

## Deferred Decisions

These are intentionally outside this redesign scope:

- What should replace the rabbit later.
