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
    assert.match(indexHtml, />\s*AI Lab\s*</);
    assert.match(indexHtml, />\s*Systems\s*</);
    assert.match(indexHtml, />\s*Experience\s*</);
    assert.match(indexHtml, />\s*Contact\s*</);
    assert.match(
        indexHtml,
        /Security operations,\s*AI automation,\s*and practical systems built for real workflows\./
    );
    assert.match(indexHtml, /Start a conversation/);
    assert.match(indexHtml, /View systems/);
});

test("site remains focused on Rotem and does not present Maya as the product", () => {
    assert.match(indexHtml, /Rotem Zacaim/i);
    assert.match(indexHtml, /Security operations|SOC|automation|systems/i);
    assert.match(indexHtml, /Maya/i);
    assert.doesNotMatch(indexHtml, /<h1[^>]*>\s*Maya Agent\s*<\/h1>/i);
    assert.doesNotMatch(publicSiteSource, /MAYA AGENT/);
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
    assert.match(scriptJs, /createProceduralRabbit/);
    assert.match(scriptJs, /WebGL/);
    assert.match(scriptJs, /no-webgl-character/);
});

test("3d character manifest is committed with procedural mode disabled by default", () => {
    const manifest = JSON.parse(read("assets/3d/character-manifest.json"));

    assert.equal(manifest.ready, false);
    assert.equal(manifest.model, "assets/3d/rotem-z-rabbit.glb");
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
