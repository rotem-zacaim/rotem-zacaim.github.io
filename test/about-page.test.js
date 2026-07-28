const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(repoRoot, file), "utf8");

const indexHtml = read("index.html");
const stylesCss = read("styles.css");
const scriptJs = read("script.js");
const publicSiteSource = [indexHtml, stylesCss, scriptJs].join("\n");

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findTagsByName(markup, tagName) {
    return Array.from(
        markup.matchAll(new RegExp(`<${escapeRegExp(tagName)}(?=\\s|[>/])[^>]*>`, "gi")),
        ([tag]) => tag
    );
}

function getAttributeValue(tag, attributeName) {
    const match = tag.match(
        new RegExp(`(?:^|\\s)${escapeRegExp(attributeName)}\\s*=\\s*(["'])(.*?)\\1`, "is")
    );

    return match ? match[2] : "";
}

function findTagsWithAttribute(markup, attributeName) {
    const pattern = new RegExp(`(?:^|\\s)${escapeRegExp(attributeName)}(?=\\s*=|[\\s>/]|$)`, "i");

    return Array.from(markup.matchAll(/<[a-z][^>]*>/gi), ([tag]) => tag).filter((tag) =>
        pattern.test(tag)
    );
}

function getObjectBlock(source, openingBraceIndex) {
    let depth = 0;
    let quote = "";
    let escaped = false;

    for (let index = openingBraceIndex; index < source.length; index += 1) {
        const char = source[index];

        if (quote) {
            escaped = char === "\\" && !escaped;
            if (char === quote && !escaped) {
                quote = "";
            } else if (char !== "\\") {
                escaped = false;
            }
            continue;
        }

        if (char === "\"" || char === "'" || char === "`") {
            quote = char;
            continue;
        }

        if (char === "{") {
            depth += 1;
        } else if (char === "}") {
            depth -= 1;

            if (depth === 0) {
                return source.slice(openingBraceIndex, index + 1);
            }
        }
    }

    return "";
}

function getI18nBlock() {
    const marker = /\bconst\s+I18N\s*=\s*{/.exec(scriptJs);

    if (!marker) {
        return "";
    }

    return getObjectBlock(scriptJs, marker.index + marker[0].lastIndexOf("{"));
}

function getLanguageBlock(language) {
    const i18nBlock = getI18nBlock();
    const marker = new RegExp(`\\b${escapeRegExp(language)}\\s*:\\s*{`).exec(i18nBlock);

    if (!marker) {
        return "";
    }

    return getObjectBlock(i18nBlock, marker.index + marker[0].lastIndexOf("{"));
}

function extractDataI18nKeys(markup) {
    const textKeys = findTagsWithAttribute(markup, "data-i18n").map((tag) =>
        getAttributeValue(tag, "data-i18n").trim()
    );
    const attributeKeys = findTagsWithAttribute(markup, "data-i18n-attr").flatMap((tag) =>
        Array.from(
            getAttributeValue(tag, "data-i18n-attr").matchAll(
                /(?:^|[\s,;])[^:\s,;]+\s*:\s*([^\s,;]+)/g
            ),
            ([, key]) => key.trim()
        )
    );

    return [...new Set([...textKeys, ...attributeKeys].filter(Boolean))];
}

function getFirstH1Text() {
    const match = indexHtml.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);

    return match ? match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : "";
}

test("custom domain stays mapped to about.rotem-dev.org", () => {
    assert.equal(read("CNAME").trim(), "about.rotem-dev.org");
});

test("first viewport is Rotem-first with approved nav and hero copy", () => {
    assert.equal(getFirstH1Text(), "Rotem Zacaim");
    assert.match(indexHtml, />\s*Profile\s*</);
    assert.match(indexHtml, />\s*Tool Lab\s*</);
    assert.match(indexHtml, />\s*Systems\s*</);
    assert.match(indexHtml, />\s*Experience\s*</);
    assert.match(indexHtml, />\s*Contact\s*</);
    assert.match(
        indexHtml,
        /Cyber security operations,\s*infrastructure troubleshooting,\s*AI agents/
    );
    assert.match(indexHtml, /Start a conversation/);
    assert.match(indexHtml, /View systems/);
});

test("content speaks about Rotem's practical operating style", () => {
    assert.match(publicSiteSource, /turn noisy infrastructure and security work into clear operating systems/i);
    assert.match(publicSiteSource, /where alerts,\s*infrastructure,\s*code,\s*and people meet/i);
    assert.match(publicSiteSource, /government-scale environments/i);
    assert.match(publicSiteSource, /Bring me the system nobody wants to untangle/i);
    assert.doesNotMatch(publicSiteSource, /Full Workflow Automation/i);
});

test("site remains focused on Rotem and does not present Maya as the product", () => {
    assert.match(indexHtml, /Rotem Zacaim/i);
    assert.match(indexHtml, /Security operations|SOC|automation|systems/i);
    assert.match(indexHtml, /Maya/i);
    assert.doesNotMatch(indexHtml, /<h1[^>]*>\s*Maya Agent\s*<\/h1>/i);
    assert.doesNotMatch(publicSiteSource, /MAYA AGENT/);
});

test("public content includes the approved tools and architecture without exposing internals", () => {
    const expectedSignals = [
        /Maya/i,
        /RoteMGPT/i,
        /RedLab/i,
        /ZACAIM/i,
        /Cloudflare Access/i,
        /Cloudflare Access\/Tunnel/i,
        /Home Assistant/i,
        /Android Lab/i,
        /URL Intelligence/i,
        /SQLite Memory/i,
        /WhatsApp adapter/i,
        /event bus/i,
        /systemd service state/i,
        /local GGUF/i,
    ];

    for (const pattern of expectedSignals) {
        assert.match(publicSiteSource, pattern);
    }
});

test("experience and education reflect Rotem's CV rather than generic developer roles", () => {
    assert.match(publicSiteSource, /Information Security & Infrastructure Operations Analyst/i);
    assert.match(publicSiteSource, /Control & Monitoring Center/i);
    assert.match(publicSiteSource, /Israel Police/i);
    assert.match(publicSiteSource, /Cyber Defender/i);
    assert.match(publicSiteSource, /Software QA/i);
    assert.match(publicSiteSource, /Jr Penetration Tester/i);
    assert.doesNotMatch(publicSiteSource, /AWS Certified Developer/i);
    assert.doesNotMatch(publicSiteSource, /Meta Front-End Developer/i);
});

test("required about sections are present", () => {
    const sectionIds = [
        "overview",
        "profile",
        "maya-lab",
        "systems",
        "deep-dive",
        "experience",
        "certifications",
        "contact",
    ];

    for (const id of sectionIds) {
        assert.ok(
            findTagsByName(indexHtml, "section").some((tag) => getAttributeValue(tag, "id") === id),
            `Expected section #${id} to exist.`
        );
    }
});

test("Three.js character stage and GLB/procedural fallback hooks exist", () => {
    assert.match(indexHtml, /type=["']importmap["']/);
    assert.match(indexHtml, /type=["']module["'][^>]+src=["']script\.js/);
    assert.match(indexHtml, /data-character-guide/);
    assert.match(indexHtml, /data-three-character-stage/);
    assert.match(indexHtml, /rotem\.z/);
    assert.match(indexHtml, /character-static-fallback/);
    assert.match(scriptJs, /class\s+RotemCharacterScene/);
    assert.match(scriptJs, /GLTFLoader/);
    assert.match(scriptJs, /import\("three"\)/);
    assert.match(scriptJs, /import\("three\/addons\/loaders\/GLTFLoader\.js"\)/);
    assert.doesNotMatch(scriptJs, /^import\s+.*from\s+["']three/m);
    assert.match(scriptJs, /assets\/3d\/rotem-z-rabbit\.glb/);
    assert.doesNotMatch(`${indexHtml}\n${scriptJs}\n${read("assets/3d/character-manifest.json")}`, /night-city-resident\.glb/);
    assert.match(scriptJs, /createProceduralRabbit/);
    assert.match(scriptJs, /WebGL/);
    assert.match(scriptJs, /no-webgl-character/);
});

test("3d character manifest enables the live rabbit mascot asset", () => {
    const manifest = JSON.parse(read("assets/3d/character-manifest.json"));
    const modelUrl = manifest.model;
    const modelPath = path.join(repoRoot, modelUrl.split("?")[0]);

    assert.equal(manifest.ready, true);
    assert.match(modelUrl, /^assets\/3d\/rotem-z-rabbit\.glb\?v=20260728-rabbit-live$/);
    assert.equal(fs.existsSync(modelPath), true);
    assert.ok(fs.statSync(modelPath).size > 1_000_000);
});

test("live rabbit mascot asset ships as a deployable GLB", () => {
    const manifest = JSON.parse(read("assets/3d/character-manifest.json"));
    const modelPath = path.join(repoRoot, manifest.model.split("?")[0]);
    const buffer = fs.readFileSync(modelPath);
    const jsonLength = buffer.readUInt32LE(12);
    const gltf = JSON.parse(buffer.toString("utf8", 20, 20 + jsonLength));

    assert.equal(buffer.toString("utf8", 0, 4), "glTF");
    assert.ok((gltf.meshes || []).length >= 1);
    assert.ok((gltf.nodes || []).length >= 1);
    assert.equal((gltf.skins || []).length, 0);
});

test("motion, visibility, fallback, and mobile safety are explicitly handled", () => {
    assert.match(stylesCss, /overflow-x:\s*hidden/);
    assert.match(stylesCss, /@media\s*\(\s*max-width\s*:\s*720px\s*\)/);
    assert.match(stylesCss, /max-width:\s*100%/);
    assert.match(stylesCss, /prefers-reduced-motion/);
    assert.match(stylesCss, /\.no-webgl-character/);
    assert.match(stylesCss, /\.using-procedural-character/);
    assert.match(scriptJs, /matchMedia\("\(prefers-reduced-motion:\s*reduce\)"\)/);
    assert.match(scriptJs, /IntersectionObserver/);
    assert.match(scriptJs, /typeof\s+window\.IntersectionObserver\s*!==\s*"function"/);
    assert.match(scriptJs, /is-character-docked/);
    assert.match(scriptJs, /if\s*\(!this\.reducedMotion\)\s*{\s*this\.animate\(\);/);
    assert.match(scriptJs, /if\s*\(this\.reducedMotion\)\s*{[\s\S]*this\.renderFrame\(\);/);
    assert.match(scriptJs, /userData\.baseY/);
    assert.doesNotMatch(scriptJs, /pointermove[\s\S]{0,240}classList\.add\("is-character-docked"\)/);
});

test("character motion is scroll-driven and ready for real GLB animation clips", () => {
    assert.match(scriptJs, /CHARACTER_ANIMATION_NAMES/);
    assert.match(scriptJs, /\bIdle\b/);
    assert.match(scriptJs, /\bWalkToSide\b/);
    assert.match(scriptJs, /\bPoint\b/);
    assert.match(scriptJs, /setCharacterState/);
    assert.match(scriptJs, /playCharacterAnimation/);
    assert.match(scriptJs, /applyProceduralCharacterMotion/);
    assert.match(scriptJs, /document\.body\.dataset\.characterState/);
    assert.match(scriptJs, /walkProgress/);
    assert.match(scriptJs, /pointProgress/);
    assert.match(scriptJs, /getCharacterDirection/);
    assert.match(scriptJs, /pointDirection/);
    assert.match(scriptJs, /prepareExternalModel/);
    assert.match(scriptJs, /cacheRiggedCharacterBones/);
    assert.match(scriptJs, /applyRiggedCharacterMotion/);
    assert.match(scriptJs, /RIGGED_BONE_NAMES/);
    assert.match(scriptJs, /EXTERNAL_CHARACTER_MODEL_NAME/);
    assert.match(scriptJs, /THREE\.DoubleSide/);
    assert.match(scriptJs, /scale\s*\*\s*mirror/);
    assert.doesNotMatch(scriptJs, /pointermove[\s\S]{0,320}is-character-docked/);
});

test("purchased GLB is rendered without runtime-added shirt text or fake limbs", () => {
    assert.doesNotMatch(scriptJs, /createTextPlane\("rotem\.z"\)/);
    assert.doesNotMatch(scriptJs, /rotem-z-external-shirt-label/);
    assert.doesNotMatch(scriptJs, /createExternalPointerArm/);
    assert.doesNotMatch(scriptJs, /rotem-z-external-pointer-arm/);
    assert.doesNotMatch(scriptJs, /applyExternalPointerMotion/);
    assert.doesNotMatch(scriptJs, /external-pointer-(sleeve|forearm|palm|finger)/);
    assert.doesNotMatch(read("assets/3d/character-manifest.json"), /shirt label overlay/i);
});

test("rigged GLB has visible scroll choreography and real-bone gestures", () => {
    assert.match(scriptJs, /EXTERNAL_SCROLL_MOTION/);
    assert.match(scriptJs, /desktopTravel:\s*0\.34/);
    assert.match(scriptJs, /mobileTravel:\s*0\.3/);
    assert.match(scriptJs, /getExternalScrollTransform/);
    assert.match(scriptJs, /stepPulse/);
    assert.match(scriptJs, /rotationZ/);
    assert.match(scriptJs, /externalMotion/);
    assert.match(scriptJs, /this\.model\.rotation\.z/);
    assert.match(scriptJs, /bones\.pointHand/);
    assert.match(scriptJs, /bones\.pointForeArm/);
    assert.match(scriptJs, /bones\.head/);
    assert.match(scriptJs, /restQuaternion/);
    assert.match(scriptJs, /setFromEuler/);
    assert.match(scriptJs, /premultiply/);
    assert.doesNotMatch(scriptJs, /isExternalModel[\s\S]{0,140}\?\s*window\.matchMedia\("\(max-width:\s*720px\)"\)\.matches\s*\?\s*0\.04\s*:\s*0\.08/);
});

test("character lane reserves space and mirrors direction between English and Hebrew", () => {
    assert.match(stylesCss, /--character-rail-width/);
    assert.match(stylesCss, /--content-max/);
    assert.match(stylesCss, /calc\(100%\s*-\s*var\(--character-rail-width\)/);
    assert.match(stylesCss, /margin-inline-start/);
    assert.match(stylesCss, /\[dir="rtl"\]\s+\.character-canvas/);
    assert.match(stylesCss, /inset-inline-end/);
    assert.match(stylesCss, /body\.is-character-docked\s+\.character-guide\s*{[\s\S]*opacity:\s*1/);
    assert.match(scriptJs, /document\.documentElement\.dir\s*===\s*"rtl"\s*\?\s*-1\s*:\s*1/);
    assert.match(scriptJs, /document\.documentElement\.dir\s*===\s*"rtl"\s*\?\s*1\s*:\s*-1/);
});

test("preserves approved contact targets", () => {
    assert.match(indexHtml, /mailto:Rotemvnkll@gmail\.com/);
    assert.match(indexHtml, /https:\/\/www\.linkedin\.com\/in\/rotem-zacaim-b4a709223\//);
});

test("no sensitive operational details are exposed", () => {
    const forbiddenPatterns = [
        ["OpenAI API key", /OPENAI_API_KEY|sk-[a-zA-Z0-9]{16,}/i],
        ["Google API key", /AIza[0-9A-Za-z\-_]{35}/],
        ["Slack token", /xox[baprs]-/i],
        ["private key", /PRIVATE KEY/i],
        ["phone-like contact id", /\b\d{2,3}-\d{6,8}\b/],
        ["WhatsApp group id", /\b120363\d+@g\.us\b/i],
        ["WhatsApp contact id", /\b972\d+@c\.us\b/i],
        ["localhost hostname", /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0):\d{2,5}\b/i],
    ];

    for (const [label, pattern] of forbiddenPatterns) {
        assert.doesNotMatch(publicSiteSource, pattern, `Public page must not expose ${label}.`);
    }
});

test("all referenced i18n keys in HTML have Hebrew and English translations", () => {
    const keys = extractDataI18nKeys(indexHtml);

    assert.ok(keys.length > 20, `Expected more than 20 unique i18n keys, found ${keys.length}.`);
    assert.match(scriptJs, /\bconst\s+I18N\s*=\s*{/, "Expected script.js to declare const I18N.");
    assert.match(getI18nBlock(), /\bhe\s*:\s*{/, "Expected I18N to include he translations.");
    assert.match(getI18nBlock(), /\ben\s*:\s*{/, "Expected I18N to include en translations.");
    assert.match(scriptJs, /\bfunction\s+applyLanguage\s*\(/, "Expected applyLanguage to exist.");

    for (const [language, block] of Object.entries({ he: getLanguageBlock("he"), en: getLanguageBlock("en") })) {
        for (const key of keys) {
            assert.match(
                block,
                new RegExp(`(?:^|[,{\\s])(?:${escapeRegExp(key)}|["']${escapeRegExp(key)}["'])\\s*:\\s*(["'\`])`, "m"),
                `Missing ${language} string translation for i18n key "${key}".`
            );
        }
    }
});
