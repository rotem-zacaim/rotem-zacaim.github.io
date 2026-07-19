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

function findTagsByName(markup, tagName) {
    return Array.from(
        markup.matchAll(new RegExp(`<${escapeRegExp(tagName)}(?=\\s|[>/])[^>]*>`, "gi")),
        ([tag]) => tag
    );
}

function getAttributePattern(attributeName) {
    return new RegExp(
        `(?:^|\\s)${escapeRegExp(attributeName)}(?=\\s*=|[\\s>/]|$)`,
        "i"
    );
}

function findTagsWithAttribute(markup, attributeName) {
    const attributePattern = getAttributePattern(attributeName);

    return Array.from(markup.matchAll(/<[a-z][^>]*>/gi), ([tag]) => tag).filter((tag) =>
        attributePattern.test(tag)
    );
}

function getAttributeValue(tag, attributeName) {
    const match = tag.match(
        new RegExp(`(?:^|\\s)${escapeRegExp(attributeName)}\\s*=\\s*(["'])(.*?)\\1`, "is")
    );

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
            findTagsWithAttribute(markup, "data-i18n")
                .map((tag) => getAttributeValue(tag, "data-i18n").trim())
                .filter(Boolean)
        ),
    ];
}

test("attribute helpers ignore names that only end with the requested attribute", () => {
    const markup = `
        <html data-lang="he" data-dir="rtl">
        <button data-aria-label="Language" data-data-language-toggle></button>
        <section data-id="profile"></section>
    `;

    assert.deepEqual(findTagsWithAttribute(markup, "lang"), []);
    assert.deepEqual(findTagsWithAttribute(markup, "dir"), []);
    assert.deepEqual(findTagsWithAttribute(markup, "aria-label"), []);
    assert.deepEqual(findTagsWithAttribute(markup, "data-language-toggle"), []);
    assert.equal(getAttributeValue('<button data-aria-label="Language">', "aria-label"), "");
    assert.equal(getAttributeValue('<section data-id="profile">', "id"), "");
    assert.deepEqual(findTagsByName("<section-widget id=\"profile\"></section-widget>", "section"), []);
});

test("page defaults to accessible Hebrew RTL", () => {
    const htmlTags = findTagsByName(indexHtml, "html");

    assert.ok(
        htmlTags.some(
            (tag) => getAttributeValue(tag, "lang") === "he" && getAttributeValue(tag, "dir") === "rtl"
        ),
        'Expected <html> to include lang="he" and dir="rtl".'
    );
    assert.ok(
        findTagsByName(indexHtml, "a").some(
            (tag) =>
                getAttributeValue(tag, "class") === "skip-link" &&
                getAttributeValue(tag, "href") === "#main-content" &&
                getAttributeValue(tag, "data-i18n") === "skipLink"
        ),
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
        assert.ok(
            findTagsByName(indexHtml, "section").some(
                (tag) => getAttributeValue(tag, "id") === sectionId
            ),
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
