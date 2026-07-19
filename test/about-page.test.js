const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
const stylesCss = fs.readFileSync(path.join(repoRoot, "styles.css"), "utf8");
const scriptJs = fs.readFileSync(path.join(repoRoot, "script.js"), "utf8");
const publicSiteSource = [indexHtml, stylesCss, scriptJs].join("\n");

function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function assertMatches(source, pattern, message) {
    assert.ok(pattern.test(source), message);
}

function findTagsWithAttribute(markup, attributeName) {
    const attributePattern = new RegExp(`\\b${escapeRegExp(attributeName)}(?:\\s*=|[\\s>/]|$)`, "i");

    return Array.from(markup.matchAll(/<[a-z][^>]*>/gi), ([tag]) => tag).filter((tag) =>
        attributePattern.test(tag)
    );
}

function getAttributeValue(tag, attributeName) {
    const match = tag.match(new RegExp(`\\b${escapeRegExp(attributeName)}\\s*=\\s*(["'])(.*?)\\1`, "is"));

    return match ? match[2] : "";
}

function getObjectBlock(source, openingBraceIndex) {
    let depth = 0;

    for (let index = openingBraceIndex; index < source.length; index += 1) {
        if (source[index] === "{") {
            depth += 1;
        }

        if (source[index] === "}") {
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
    return [
        ...new Set(
            Array.from(markup.matchAll(/\bdata-i18n\s*=\s*(["'])(.*?)\1/gi), (match) =>
                match[2].trim()
            ).filter(Boolean)
        ),
    ];
}

test("page defaults to accessible Hebrew RTL", () => {
    assertMatches(
        indexHtml,
        /<html\b(?=[^>]*\blang=["']he["'])(?=[^>]*\bdir=["']rtl["'])/i,
        'Expected <html> to include lang="he" and dir="rtl".'
    );
    assertMatches(
        indexHtml,
        /<a\s+class=["']skip-link["']\s+href=["']#main-content["']\s+data-i18n=["']skipLink["'][^>]*>/i,
        'Expected skip link: <a class="skip-link" href="#main-content" data-i18n="skipLink">.'
    );

    const languageToggleTags = findTagsWithAttribute(indexHtml, "data-language-toggle");

    assert.ok(languageToggleTags.length > 0, "Expected a language control marked with data-language-toggle.");
    assert.ok(
        languageToggleTags.some((tag) => /שפה|Language/.test(getAttributeValue(tag, "aria-label"))),
        'Expected the language control aria-label to contain "שפה" or "Language".'
    );
});

test("approved sections exist in the page", () => {
    const approvedSectionIds = [
        "overview",
        "profile",
        "maya-lab",
        "systems",
        "experience",
        "certifications",
        "contact",
    ];

    for (const sectionId of approvedSectionIds) {
        assertMatches(
            indexHtml,
            new RegExp(`<section\\b(?=[^>]*\\bid=["']${escapeRegExp(sectionId)}["'])`, "i"),
            `Expected section #${sectionId} to exist.`
        );
    }
});

test("Maya lab public-safe content is represented", () => {
    const requiredPublicContent = [
        "Maya AI Lab",
        "WhatsApp",
        "RoteMGPT",
        "Home Assistant",
        "Android Lab",
        "RedLab",
        "Cloudflare",
        "מודלים מקומיים",
        "מעבדה סגורה",
    ];

    for (const phrase of requiredPublicContent) {
        assert.ok(publicSiteSource.includes(phrase), `Expected public-safe content phrase: ${phrase}`);
    }
});

test("all data-i18n keys in HTML have Hebrew and English translations", () => {
    const keys = extractDataI18nKeys(indexHtml);

    assert.ok(keys.length > 30, `Expected more than 30 unique data-i18n keys, found ${keys.length}.`);
    assertMatches(scriptJs, /\bconst\s+I18N\s*=\s*{/, "Expected script.js to declare const I18N.");
    assertMatches(getI18nBlock(), /\bhe\s*:\s*{/, "Expected I18N to include he translations.");
    assertMatches(getI18nBlock(), /\ben\s*:\s*{/, "Expected I18N to include en translations.");
    assertMatches(scriptJs, /\bfunction\s+applyLanguage\s*\(/, "Expected script.js to declare applyLanguage.");

    const languageBlocks = {
        he: getLanguageBlock("he"),
        en: getLanguageBlock("en"),
    };

    for (const [language, block] of Object.entries(languageBlocks)) {
        for (const key of keys) {
            assertMatches(
                block,
                new RegExp(`(?:^|[,{\\s])(?:${escapeRegExp(key)}|["']${escapeRegExp(key)}["'])\\s*:\\s*(["'\`])`, "m"),
                `Missing ${language} string translation for data-i18n key "${key}".`
            );
        }
    }
});

test("page avoids publishing secrets or sensitive operational internals", () => {
    const forbiddenPatterns = [
        ["OPENAI_API_KEY", /OPENAI_API_KEY/i],
        ["HOME_ASSISTANT_TOKEN", /HOME_ASSISTANT_TOKEN/i],
        ["GOOGLE_MAPS_API_KEY", /GOOGLE_MAPS_API_KEY/i],
        ["credentials.google.json", /credentials\.google\.json/i],
        ["token.google.json", /token\.google\.json/i],
        ["ALLOWED_PHONE_NUMBERS", /ALLOWED_PHONE_NUMBERS/i],
        ["WhatsApp group ID", /\b120363\d+@g\.us\b/i],
        ["WhatsApp contact ID", /\b972\d+@c\.us\b/i],
        ["PRIVATE KEY", /PRIVATE KEY/i],
    ];

    for (const [label, pattern] of forbiddenPatterns) {
        assert.doesNotMatch(publicSiteSource, pattern, `Public page must not expose ${label}.`);
    }
});

test("styles include responsive, RTL, and reduced-motion support", () => {
    assertMatches(stylesCss, /\[dir=["']rtl["']\]/, 'Expected styles for [dir="rtl"].');
    assertMatches(stylesCss, /\[dir=["']ltr["']\]/, 'Expected styles for [dir="ltr"].');
    assertMatches(stylesCss, /@media\s*\(\s*max-width\s*:\s*760px\s*\)/, "Expected mobile breakpoint at 760px.");
    assertMatches(stylesCss, /prefers-reduced-motion/, "Expected reduced-motion support.");
    assertMatches(stylesCss, /\.language-toggle\b/, "Expected .language-toggle styles.");
});
