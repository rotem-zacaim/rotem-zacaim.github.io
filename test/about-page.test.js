const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
const stylesCss = fs.readFileSync(path.join(repoRoot, "styles.css"), "utf8");
const scriptJs = fs.readFileSync(path.join(repoRoot, "script.js"), "utf8");
const cname = fs.readFileSync(path.join(repoRoot, "CNAME"), "utf8").trim();
const publicContentSource = [indexHtml, scriptJs].join("\n");
const publicSiteSource = [indexHtml, stylesCss, scriptJs].join("\n");
const acceptedLanguageToggleLabelPhrases = [
    "\u05e9\u05e4\u05d4",
    "Language",
    "Switch to English",
    "\u05e2\u05d1\u05e8\u05d9\u05ea",
];

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

function findTagEntriesByName(markup, tagName) {
    return Array.from(
        markup.matchAll(new RegExp(`<${escapeRegExp(tagName)}(?=\\s|[>/])[^>]*>`, "gi")),
        (match) => ({ tag: match[0], index: match.index })
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

function hasClassToken(tag, className) {
    return getAttributeValue(tag, "class").split(/\s+/).includes(className);
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
    const dataI18nKeys = findTagsWithAttribute(markup, "data-i18n").map((tag) =>
        getAttributeValue(tag, "data-i18n").trim()
    );
    const dataI18nAttrKeys = findTagsWithAttribute(markup, "data-i18n-attr").flatMap((tag) =>
        Array.from(
            getAttributeValue(tag, "data-i18n-attr").matchAll(
                /(?:^|[\s,;])[^:\s,;]+\s*:\s*([^\s,;]+)/g
            ),
            ([, key]) => key.trim()
        )
    );

    return [
        ...new Set([...dataI18nKeys, ...dataI18nAttrKeys].filter(Boolean)),
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

test("i18n key extraction includes translated attribute references", () => {
    const markup = `
        <nav data-i18n-attr="aria-label:primaryNavLabel"></nav>
        <a data-i18n="contactCta" data-i18n-attr="title:contactTitle, aria-label:contactAria"></a>
        <button data-i18n-attr="aria-label:primaryNavLabel"></button>
    `;

    assert.deepEqual(extractDataI18nKeys(markup), [
        "contactCta",
        "primaryNavLabel",
        "contactTitle",
        "contactAria",
    ]);
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
                hasClassToken(tag, "skip-link") &&
                getAttributeValue(tag, "href") === "#main-content" &&
                getAttributeValue(tag, "data-i18n") === "skipLink"
        ),
        'Expected skip link: <a class="skip-link" href="#main-content" data-i18n="skipLink">.'
    );

    const languageToggleTags = findTagsWithAttribute(indexHtml, "data-language-toggle");

    assert.ok(languageToggleTags.length > 0, "Expected a language control marked with data-language-toggle.");
    assert.ok(
        languageToggleTags.some((tag) => {
            const ariaLabel = getAttributeValue(tag, "aria-label").trim();

            return (
                ariaLabel.length > 0 &&
                acceptedLanguageToggleLabelPhrases.some((phrase) => ariaLabel.includes(phrase))
            );
        }),
        `Expected the language control aria-label to be non-empty and include one of: ${acceptedLanguageToggleLabelPhrases.join(", ")}.`
    );
});

test("skip link is first and becomes visible on keyboard focus", () => {
    const skipLink = findTagEntriesByName(indexHtml, "a").find(
        ({ tag }) => hasClassToken(tag, "skip-link")
    );
    const shell = findTagEntriesByName(indexHtml, "div").find(
        ({ tag }) => hasClassToken(tag, "site-shell")
    );

    assert.ok(skipLink, "Expected a skip link in the document.");
    assert.ok(shell, "Expected the page shell after the skip link.");
    assert.ok(skipLink.index < shell.index, "Expected skip link before the main page shell.");
    assertMatches(
        stylesCss,
        /\.skip-link\s*{[^}]*transform\s*:\s*translateY\(-140%\)/s,
        "Expected skip link to start off-screen."
    );
    assertMatches(
        stylesCss,
        /\.skip-link:focus-visible\s*{[^}]*transform\s*:\s*translateY\(0\)/s,
        "Expected skip link to become visible on focus."
    );
    assertMatches(
        stylesCss,
        /\.skip-link\s*{[^}]*z-index\s*:\s*(?:9\d|[1-9]\d{2,})/s,
        "Expected skip link to sit above the boot overlay while focused."
    );
    assertMatches(
        stylesCss,
        /\.boot-screen\s*{[^}]*z-index\s*:\s*80/s,
        "Expected the boot overlay z-index contract to stay explicit."
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

test("GitHub Pages custom domain is configured for the approved subdomain", () => {
    assert.equal(cname, "about.rotem-dev.org");
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
        "Google Calendar",
        "OAuth",
        "SQLite",
        "semantic retrieval",
        "URL tools",
        "weather",
        "maps",
        "voucher",
        "finance",
        "daily digest",
        "Maya Command OS",
        "admin dashboard",
        "GGUF",
        "Browser Lab",
        "Game Lab",
        "server observability",
        "מודלים מקומיים",
        "מעבדה סגורה",
    ];

    for (const phrase of requiredPublicContent) {
        assert.ok(publicContentSource.includes(phrase), `Expected public-safe content phrase: ${phrase}`);
    }
});

test("all referenced i18n keys in HTML have Hebrew and English translations", () => {
    const keys = extractDataI18nKeys(indexHtml);

    assert.ok(keys.length > 30, `Expected more than 30 unique i18n keys, found ${keys.length}.`);
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
                `Missing ${language} string translation for i18n key "${key}".`
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
        ["remote admin surface details", /Browser SSH|VNC|systemd/i],
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
    assertMatches(
        stylesCss,
        /\.assistant-widget\s*{[^}]*display\s*:\s*grid/s,
        "Expected assistant widget to remain visible by default on roomy screens."
    );
    assertMatches(
        stylesCss,
        /@media\s*\(\s*max-width\s*:\s*1320px\s*\)\s*,\s*\(\s*max-height\s*:\s*780px\s*\)\s*{[^}]*\.assistant-widget\s*{[^}]*display\s*:\s*none/s,
        "Expected assistant widget to hide only on cramped viewports."
    );
});
