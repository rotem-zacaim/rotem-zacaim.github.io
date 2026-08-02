const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const { pathToFileURL } = require("node:url");

const repoRoot = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(repoRoot, file), "utf8");
const readIfExists = (file) => {
    const absolutePath = path.join(repoRoot, file);

    return fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, "utf8") : "";
};

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

function assertSourceMatches(source, pattern, message) {
    assert.equal(pattern.test(source), true, message);
}

function assertSourceDoesNotMatch(source, pattern, message) {
    assert.equal(pattern.test(source), false, message);
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

function stripJsComments(source) {
    let output = "";
    let quote = "";
    let escaped = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        const nextChar = source[index + 1];

        if (quote) {
            output += char;
            if (escaped) {
                escaped = false;
            } else if (char === "\\") {
                escaped = true;
            } else if (char === quote) {
                quote = "";
            }
            continue;
        }

        if (char === "\"" || char === "'" || char === "`") {
            quote = char;
            output += char;
            continue;
        }

        if (char === "/" && nextChar === "/") {
            const newlineIndex = source.indexOf("\n", index + 2);
            if (newlineIndex === -1) {
                break;
            }
            output += "\n";
            index = newlineIndex;
            continue;
        }

        if (char === "/" && nextChar === "*") {
            const closeIndex = source.indexOf("*/", index + 2);
            const comment = source.slice(index + 2, closeIndex === -1 ? source.length : closeIndex);
            output += comment.replace(/[^\n]/g, " ");
            index = closeIndex === -1 ? source.length : closeIndex + 1;
            continue;
        }

        output += char;
    }

    return output;
}

function isInsideJavaScriptString(source, targetIndex) {
    let quote = "";
    let escaped = false;

    for (let index = 0; index < targetIndex; index += 1) {
        const char = source[index];

        if (quote) {
            if (escaped) {
                escaped = false;
            } else if (char === "\\") {
                escaped = true;
            } else if (char === quote) {
                quote = "";
            }
            continue;
        }

        if (char === "\"" || char === "'" || char === "`") {
            quote = char;
        }
    }

    return Boolean(quote);
}

function codePatternMatches(source, pattern) {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const regex = new RegExp(pattern.source, flags);

    for (const match of source.matchAll(regex)) {
        if (!isInsideJavaScriptString(source, match.index)) {
            return true;
        }
    }

    return false;
}

function assertCodeMatches(source, pattern, message) {
    assert.equal(codePatternMatches(source, pattern), true, message);
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

function getArrayBlock(source, constantName) {
    const marker = new RegExp(`\\bconst\\s+${escapeRegExp(constantName)}\\s*=\\s*\\[`).exec(source);

    if (!marker) {
        return "";
    }

    const openingBracketIndex = marker.index + marker[0].lastIndexOf("[");
    let depth = 0;
    let quote = "";
    let escaped = false;

    for (let index = openingBracketIndex; index < source.length; index += 1) {
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

        if (char === "[") {
            depth += 1;
        } else if (char === "]") {
            depth -= 1;

            if (depth === 0) {
                return source.slice(openingBracketIndex, index + 1);
            }
        }
    }

    return "";
}

function getFunctionBlock(source, functionName) {
    const executableSource = stripJsComments(source);
    const escapedFunctionName = escapeRegExp(functionName);
    const patterns = [
        new RegExp(`\\bfunction\\s+${escapedFunctionName}\\s*\\([^)]*\\)\\s*{`),
        new RegExp(`\\b(?:const|let|var)\\s+${escapedFunctionName}\\s*=\\s*(?:async\\s+)?function(?:\\s+[A-Za-z_$][\\w$]*)?\\s*\\([^)]*\\)\\s*{`),
        new RegExp(`\\b(?:const|let|var)\\s+${escapedFunctionName}\\s*=\\s*(?:async\\s*)?(?:\\([^)]*\\)|[A-Za-z_$][\\w$]*)\\s*=>\\s*{`),
    ];
    const marker = patterns
        .map((pattern) => pattern.exec(executableSource))
        .filter(Boolean)
        .sort((left, right) => left.index - right.index)[0];

    if (!marker) {
        return "";
    }

    return getObjectBlock(executableSource, marker.index + marker[0].lastIndexOf("{"));
}

function getArrayObjectBlocks(source, constantName) {
    const arrayBlock = getArrayBlock(source, constantName);

    if (!arrayBlock) {
        return [];
    }

    const blocks = [];
    let arrayDepth = 0;
    let quote = "";
    let escaped = false;

    for (let index = 0; index < arrayBlock.length; index += 1) {
        const char = arrayBlock[index];

        if (quote) {
            escaped = char === "\\" && !escaped;
            if (char === quote && !escaped) {
                quote = "";
            } else if (char !== "\\") {
                escaped = false;
            }
            continue;
        }

        if (char === "[") {
            arrayDepth += 1;
            continue;
        }

        if (char === "]") {
            arrayDepth -= 1;
            continue;
        }

        if (char === "\"" || char === "'" || char === "`") {
            quote = char;
            continue;
        }

        if (char === "{" && arrayDepth === 1) {
            const block = getObjectBlock(arrayBlock, index);

            if (block) {
                blocks.push(block);
                index += block.length - 1;
            }
        }
    }

    return blocks;
}

function getTopLevelStringProperty(objectBlock, propertyName) {
    const propertyPattern = new RegExp(
        `^(?:\\s|,)*(?:${escapeRegExp(propertyName)}|["']${escapeRegExp(propertyName)}["'])\\s*:\\s*(["'])(.*?)\\1`,
        "s"
    );
    let objectDepth = 0;
    let arrayDepth = 0;
    let quote = "";
    let escaped = false;

    for (let index = 0; index < objectBlock.length; index += 1) {
        const char = objectBlock[index];

        if (quote) {
            escaped = char === "\\" && !escaped;
            if (char === quote && !escaped) {
                quote = "";
            } else if (char !== "\\") {
                escaped = false;
            }
            continue;
        }

        if (objectDepth === 1 && arrayDepth === 0) {
            const match = propertyPattern.exec(objectBlock.slice(index));

            if (match) {
                return match[2];
            }
        }

        if (char === "\"" || char === "'" || char === "`") {
            quote = char;
            continue;
        }

        if (char === "{") {
            objectDepth += 1;
        } else if (char === "}") {
            objectDepth -= 1;
        } else if (char === "[") {
            arrayDepth += 1;
        } else if (char === "]") {
            arrayDepth -= 1;
        }
    }

    return "";
}

function getFunctionNamesReturningHebrew(source) {
    return Array.from(
        source.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*{[\s\S]{0,240}?return[\s\S]{0,120}?["']he["']/g),
        ([, functionName]) => functionName
    );
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

function getI18nStringValue(language, key) {
    const languageBlock = getLanguageBlock(language);
    const keyPattern = `(?:\\b${escapeRegExp(key)}\\b|["']${escapeRegExp(key)}["'])`;
    const match = new RegExp(`${keyPattern}\\s*:\\s*(["'])(.*?)\\1`, "s").exec(languageBlock);

    return match ? match[2] : "";
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

function getTextContent(markup) {
    return markup.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

function sectionExists(markup, id) {
    return findTagsByName(markup, "section").some((tag) => getAttributeValue(tag, "id") === id);
}

function elementWithIdExists(markup, id) {
    return findTagsWithAttribute(markup, "id").some((tag) => getAttributeValue(tag, "id") === id);
}

function getTopNavLinks(markup) {
    const topNav = Array.from(markup.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi), ([navMarkup]) => navMarkup)
        .find((navMarkup) => {
            const openingTag = /^<nav\b[^>]*>/i.exec(navMarkup)?.[0] || "";
            return getAttributeValue(openingTag, "class").split(/\s+/).includes("topnav");
        });

    if (!topNav) {
        return [];
    }

    return Array.from(topNav.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi), ([anchorMarkup]) => {
        const openingTag = /^<a\b[^>]*>/i.exec(anchorMarkup)?.[0] || "";
        const i18nTag = findTagsWithAttribute(anchorMarkup, "data-i18n")[0] || "";

        return {
            href: getAttributeValue(openingTag, "href"),
            i18nKey: getAttributeValue(i18nTag, "data-i18n"),
            text: getTextContent(anchorMarkup),
        };
    });
}

function getAnchorOpeningTagContainingI18n(markup, i18nKey) {
    const i18nAttribute = new RegExp(
        `\\bdata-i18n\\s*=\\s*(["'])${escapeRegExp(i18nKey)}\\1`,
        "i"
    );

    for (const match of markup.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)) {
        const anchorMarkup = match[0];

        if (i18nAttribute.test(anchorMarkup)) {
            const openingTag = /^<a\b[^>]*>/i.exec(anchorMarkup);
            return openingTag ? openingTag[0] : "";
        }
    }

    return "";
}

function assertI18nAnchorTarget(i18nKey, expectedHref) {
    const anchorTag = getAnchorOpeningTagContainingI18n(indexHtml, i18nKey);

    assert.ok(anchorTag, `Expected data-i18n="${i18nKey}" to be inside an anchor.`);
    assert.equal(
        getAttributeValue(anchorTag, "href"),
        expectedHref,
        `Expected data-i18n="${i18nKey}" anchor to link to ${expectedHref}.`
    );
}

function assertHebrewDefaultLanguage(source) {
    const executableSource = stripJsComments(source);
    const initialLanguageBlock = getFunctionBlock(executableSource, "getInitialLanguage");
    const normalizeLanguageBlock = getFunctionBlock(executableSource, "normalizeLanguage");
    const initLanguageToggleBlock = getFunctionBlock(executableSource, "initLanguageToggle");
    const languageBootSource = [
        initialLanguageBlock,
        normalizeLanguageBlock,
        initLanguageToggleBlock,
    ].filter(Boolean).join("\n") || source;
    const hasStoredLanguagePreference = /(?:window\.)?localStorage\.getItem\([\s\S]{0,160}["']rotem-about-language["']/.test(executableSource);
    const hasDefaultLanguageConstant = /\b(?:const|let|var)\s+DEFAULT_LANGUAGE\s*=\s*["']he["']/.test(executableSource);
    const defaultLanguageReferenceCount = (executableSource.match(/\bDEFAULT_LANGUAGE\b/g) || []).length;
    const hasDirectHebrewFallback =
        /(?:\|\||\?\?)\s*["']he["']/.test(languageBootSource) ||
        /return[\s\S]{0,180}["']he["']/.test(initialLanguageBlock) ||
        /return[\s\S]{0,180}["']he["']/.test(normalizeLanguageBlock);
    const hasConstantHebrewFallback = hasDefaultLanguageConstant && defaultLanguageReferenceCount > 1;
    const hasHelperHebrewFallback = getFunctionNamesReturningHebrew(executableSource).some((functionName) =>
        new RegExp(`\\b${escapeRegExp(functionName)}\\s*\\(`).test(languageBootSource)
    );

    assert.ok(
        hasStoredLanguagePreference,
        "Expected script to read the stored language preference."
    );

    assert.ok(
        hasDirectHebrewFallback || hasConstantHebrewFallback || hasHelperHebrewFallback,
        "Expected the initial language fallback to resolve to Hebrew."
    );
}

function extractHtmlPublicCopy(markup) {
    const withoutExecutableBlocks = markup.replace(/<script\b[\s\S]*?<\/script>/gi, " ");
    const publicAttributeValues = Array.from(
        withoutExecutableBlocks.matchAll(
            /\s(?:alt|aria-label|content|data-i18n|data-i18n-attr|title)\s*=\s*(["'])(.*?)\1/gi
        ),
        ([, , value]) => value
    );
    const visibleText = withoutExecutableBlocks.replace(/<[^>]+>/g, " ");

    return [visibleText, ...publicAttributeValues].join("\n");
}

function extractJavaScriptStringLiterals(source) {
    const literals = [];
    let quote = "";
    let value = "";
    let escaped = false;

    for (let index = 0; index < source.length; index += 1) {
        const char = source[index];
        const nextChar = source[index + 1];

        if (!quote) {
            if (char === "/" && nextChar === "/") {
                const newlineIndex = source.indexOf("\n", index + 2);
                index = newlineIndex === -1 ? source.length : newlineIndex;
                continue;
            }

            if (char === "/" && nextChar === "*") {
                const closeIndex = source.indexOf("*/", index + 2);
                index = closeIndex === -1 ? source.length : closeIndex + 1;
                continue;
            }

            if (char === "\"" || char === "'" || char === "`") {
                quote = char;
                value = "";
                escaped = false;
            }

            continue;
        }

        if (escaped) {
            value += char;
            escaped = false;
            continue;
        }

        if (char === "\\") {
            value += char;
            escaped = true;
            continue;
        }

        if (char === quote) {
            literals.push(value);
            quote = "";
            value = "";
            continue;
        }

        value += char;
    }

    return literals.join("\n");
}

const executableScriptJs = stripJsComments(scriptJs);
const publicCopyAndDataSource = [
    extractHtmlPublicCopy(indexHtml),
    extractJavaScriptStringLiterals(scriptJs),
].join("\n");
const portfolioDataSource = [
    extractHtmlPublicCopy(indexHtml),
    ...["PRIMARY_PROJECTS", "SECONDARY_PROJECTS", "CAREER_TIMELINE", "SKILL_GROUPS"]
        .map((constantName) => extractJavaScriptStringLiterals(getArrayBlock(executableScriptJs, constantName))),
].join("\n");

test("custom domain stays mapped to about.rotem-dev.org", () => {
    assert.equal(read("CNAME").trim(), "about.rotem-dev.org");
});

test("first viewport is projects-first with Hebrew default and approved nav", () => {
    const htmlTag = findTagsByName(indexHtml, "html")[0] || "";
    const topNavLinks = getTopNavLinks(indexHtml);
    const expectedTopNavHrefs = ["#projects", "#lab-gallery", "#timeline", "#skills", "#contact"];
    const expectedEnglishNavLabels = ["Projects", "Lab Gallery", "Timeline", "Courses & Skills", "Contact"];

    assert.equal(getAttributeValue(htmlTag, "lang"), "he", "Expected document to default to Hebrew.");
    assert.equal(getAttributeValue(htmlTag, "dir"), "rtl", "Expected document to default to RTL.");
    assert.equal(getFirstH1Text(), "רותם זכאים");
    assert.deepEqual(
        topNavLinks.map(({ href }) => href),
        expectedTopNavHrefs,
        "Expected top nav hrefs to appear in projects-first order."
    );
    assert.deepEqual(
        topNavLinks.map(({ i18nKey }) => getI18nStringValue("en", i18nKey)),
        expectedEnglishNavLabels,
        "Expected English i18n labels for the approved top nav links."
    );
    assertSourceMatches(publicSiteSource, /אנליסט אבטחת מידע ותשתיות שבונה מערכות AI/, "Expected Hebrew hero lede.");
    assertI18nAnchorTarget("heroPrimary", "#projects");
    assertI18nAnchorTarget("heroSecondary", "#timeline");
    assertHebrewDefaultLanguage(scriptJs);
});

test("content leads with concrete project portfolio signals", () => {
    const requiredProjectSignals = [
        /Home Assistant \+ Maya/,
        /Maya WhatsApp AI Agent/,
        /Maya Local LLM \/ Cyber Agent/,
        /ROTEMZ Web Security Scanner/,
        /Zacaim-WiFi-Tool/,
        /Private Control Center Labs/,
        /Apartment Plan App/,
        /AI Super-Analyst Dashboard/,
        /Group-Buying PWA/,
        /Quake\/Qwasm browser games/,
        /OpenAI Usage Dashboard/,
        /ChatGPT Agent Workflow/,
        /ChatGPT Shared Links Risk Research/,
        /About \/ Framer Prototype/,
    ];

    for (const pattern of requiredProjectSignals) {
        assertSourceMatches(portfolioDataSource, pattern, `Expected portfolio copy/data to include ${pattern}.`);
    }

    assertSourceDoesNotMatch(publicSiteSource, /Full Workflow Automation/i, "Public source should not keep the old automation signal.");
    assertSourceDoesNotMatch(indexHtml, /<h1[^>]*>\s*Maya Agent\s*<\/h1>/i, "Hero should not present Maya Agent as the H1.");
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
        /Home Assistant/i,
        /WhatsApp/i,
        /Cloudflare/i,
        /\bWorkers?\b/i,
        /\bTunnels?\b/i,
        /\bAccess\b/i,
        /\bD1\b/i,
        /\bR2\b/i,
        /OpenAI/i,
        /OpenAI Usage/i,
        /local LLM/i,
        /Splunk/i,
        /SIEM/i,
        /Imperva/i,
        /\bF5\b/i,
        /Check Point/i,
        /CyberArk/i,
        /Dynatrace/i,
        /SCOM/i,
        /PRTG/i,
        /ELK/i,
        /MISP/i,
        /Radware/i,
        /Raspberry Pi/i,
        /TryHackMe/i,
        /\bQA\b/i,
        /CCNA/i,
        /Cyber Defender/i,
    ];

    for (const pattern of expectedSignals) {
        assertSourceMatches(portfolioDataSource, pattern, `Expected portfolio copy/data to include ${pattern}.`);
    }
});

test("timeline and courses reflect the CV year by year", () => {
    const timelineBlock = getArrayBlock(executableScriptJs, "CAREER_TIMELINE");
    const skillsBlock = getArrayBlock(executableScriptJs, "SKILL_GROUPS");
    const timelineEntries = getArrayObjectBlocks(executableScriptJs, "CAREER_TIMELINE");
    const periodSeparator = String.raw`\s*(?:-|\u2013|&ndash;)\s*`;
    const expectedTimelineEntries = [
        {
            period: new RegExp(String.raw`2023${periodSeparator}(?:Today|Present)`, "i"),
            label: "2023-Today NDI security and infrastructure operations",
            signals: [/(?:\bNDI\b|Israel National Digital Agency)/i, /security/i, /infrastructure/i, /operations/i],
        },
        {
            period: new RegExp(String.raw`2021${periodSeparator}2023`),
            label: "2021-2023 Ministry of Health monitoring and support",
            signals: [/Ministry of Health/i, /monitoring/i, /support/i],
        },
        {
            period: new RegExp(String.raw`2020${periodSeparator}2021`),
            label: "2020-2021 Israel Police Intelligence Unit",
            signals: [/Israel Police/i, /Intelligence Unit/i, /reporting/i],
        },
        {
            period: new RegExp(String.raw`2014${periodSeparator}2017`),
            label: "2014-2017 IDF SAP logistics and inventory",
            signals: [/\bIDF\b/i, /\bSAP\b/i, /logistics/i, /inventory/i],
        },
    ];
    const expectedCourseSignals = [
        /John Bryce/i,
        /Cyber Defender/i,
        /650 academic hours/i,
        /\bQA\b/i,
        /Technion/i,
        /CCNA 200-301/i,
        /Applied Ethical Hacking/i,
        /Rules of Engagement/i,
        /TryHackMe/i,
        /Jr Penetration Tester/i,
        /SAP inventory/i,
        /\bMDA\b/i,
        /medic/i,
        /ambulance driver/i,
    ];

    assert.ok(timelineBlock, "Expected script.js to declare const CAREER_TIMELINE.");
    assert.ok(skillsBlock, "Expected script.js to declare const SKILL_GROUPS.");

    for (const { period, label, signals } of expectedTimelineEntries) {
        const entry = timelineEntries.find((block) => period.test(block));

        assert.ok(entry, `Expected CAREER_TIMELINE to include an entry for ${label}.`);

        for (const pattern of signals) {
            assert.match(entry, pattern, `Expected CAREER_TIMELINE entry for ${label} to include ${pattern}.`);
        }
    }

    for (const pattern of expectedCourseSignals) {
        assert.match(skillsBlock, pattern, `Expected SKILL_GROUPS to include ${pattern}.`);
    }

    assert.doesNotMatch(timelineBlock, /Branch manager|food retail|Burger Ranch/i);
    assert.doesNotMatch(timelineBlock, /patrol training|field operations|סיור/i);
    assert.doesNotMatch(skillsBlock, /AWS Certified Developer/i);
    assert.doesNotMatch(skillsBlock, /Meta Front-End Developer/i);
});

test("required projects-first sections are present", () => {
    const sectionIds = [
        "overview",
        "projects",
        "lab-gallery",
        "timeline",
        "skills",
        "contact",
    ];

    for (const id of sectionIds) {
        assert.ok(
            sectionExists(indexHtml, id),
            `Expected section #${id} to exist.`
        );
    }

    for (const oldId of ["profile", "maya-lab", "systems", "deep-dive", "experience", "certifications"]) {
        assert.equal(elementWithIdExists(indexHtml, oldId), false, `Expected old id #${oldId} to be removed from all elements.`);
    }
});

test("primary project cards and inline detail controls are data-driven and accessible", () => {
    const primaryProjectsBlock = getArrayBlock(executableScriptJs, "PRIMARY_PROJECTS");
    const primaryProjectEntries = getArrayObjectBlocks(executableScriptJs, "PRIMARY_PROJECTS");
    const openProjectDetailBlock = getFunctionBlock(executableScriptJs, "openProjectDetail");
    const closeProjectDetailBlock = getFunctionBlock(executableScriptJs, "closeProjectDetail");
    const projectHashSupportBlock = [
        "initProjectDetails",
        "syncProjectDetailFromHash",
        "handleProjectHashChange",
        "openProjectFromHash",
    ].map((functionName) => getFunctionBlock(executableScriptJs, functionName)).find(Boolean) || "";
    const projectControlSource = [indexHtml, executableScriptJs].join("\n");
    const projectDetailBehaviorSource = [openProjectDetailBlock, closeProjectDetailBlock, projectHashSupportBlock].join("\n");
    const activeProjectPattern = /(?:active|selected|current|projectId|project\.id|data-project-toggle|dataset\.project)/i;
    const projectHashAnchorPattern = /(?:\b(?:const|let|var)\s+[A-Za-z_$][\w$]*hash[A-Za-z_$\w]*\s*=\s*["'`]#project-|(?:window\.)?history\.replaceState\s*\([\s\S]{0,260}["'`]#project-)/i;
    const hashReadPattern = /\b(?:window\.)?location\.hash\b(?:\s*(?:[!=]=|=)|\s*\.\s*(?:startsWith|slice|replace|match|includes)\s*\(|\s*(?:\|\||&&|\?|\)|;|,))/i;
    const hashReplaceStatePattern = /\b(?:window\.)?history\.replaceState\s*\(/i;
    const focusCallPattern = /(?:\?\.|\.)focus\s*\(/i;
    const expandedTruePattern = /\.(?:setAttribute)\s*\(\s*["']aria-expanded["']\s*,\s*(?:["']true["']|true|String\s*\([^)]*(?:active|selected|current|open|expanded|project|match)[^)]*\)|[^)]*\?[\s\S]{0,100}["']true["'][\s\S]{0,100}["']false["'])|\.ariaExpanded\s*=\s*(?:["']true["']|true|String\s*\([^\n;]*(?:active|selected|current|open|expanded|project|match)[^\n;]*\)|[^\n;]*\?[^\n;]*["']true["'][^\n;]*["']false["'])/i;
    const expandedFalsePattern = /\.(?:setAttribute)\s*\(\s*["']aria-expanded["']\s*,\s*(?:["']false["']|false|String\s*\([^)]*(?:active|selected|current|open|expanded|project|match)[^)]*\)|[^)]*\?[\s\S]{0,100}["']false["'][\s\S]{0,100}["']true["'])|\.ariaExpanded\s*=\s*(?:["']false["']|false|String\s*\([^\n;]*(?:active|selected|current|open|expanded|project|match)[^\n;]*\)|[^\n;]*\?[^\n;]*["']false["'][^\n;]*["']true["'])/i;
    const openPanelPattern = /\.(?:removeAttribute)\s*\(\s*["']hidden["']\s*\)|\.hidden\s*=\s*false|\.(?:setAttribute)\s*\(\s*["']aria-hidden["']\s*,\s*(?:["']false["']|false)\s*\)|\.classList\.(?:add|toggle)\s*\([\s\S]{0,120}(?:active|open|selected)/i;
    const closedStatePattern = /\.hidden\s*=\s*true|\.(?:setAttribute)\s*\(\s*["'](?:hidden|aria-hidden)["'](?:\s*,\s*(?:["']true["']|true|["']["']))?|\.(?:removeAttribute)\s*\(\s*["']data-active-project["']\s*\)|\.dataset\.activeProject\s*=\s*["']["']|\.classList\.(?:remove|toggle)\s*\([\s\S]{0,120}(?:active|open|selected)/i;
    const projectDetailPanels = findTagsWithAttribute(indexHtml, "data-project-detail-panel");
    const requiredIds = [
        "home-assistant-maya",
        "maya-whatsapp-agent",
        "maya-local-llm-cyber-agent",
        "rotemz-redlab",
        "zacaim-wifi-tool",
        "private-control-center-labs",
    ];

    assertSourceMatches(indexHtml, /data-project-grid/, "Expected a project grid container in index.html.");
    assert.equal(projectDetailPanels.length, 1, "Expected exactly one inline project detail panel in index.html.");
    assert.ok(getAttributeValue(projectDetailPanels[0], "id"), "Expected the project detail panel to have an id for aria-controls.");
    assertSourceMatches(indexHtml, /data-project-detail-close/, "Expected a project detail close control in index.html.");
    assert.ok(primaryProjectsBlock, "Expected script.js to declare const PRIMARY_PROJECTS.");
    assert.ok(openProjectDetailBlock, "Expected script.js to define openProjectDetail as a function declaration, function expression, or block arrow function.");
    assert.ok(closeProjectDetailBlock, "Expected script.js to define closeProjectDetail as a function declaration, function expression, or block arrow function.");
    assertSourceMatches(projectControlSource, /data-project-toggle/, "Expected project detail buttons to be identifiable.");
    assertSourceMatches(projectControlSource, /\baria-controls\b/, "Expected project detail buttons to expose aria-controls.");
    assertSourceMatches(projectControlSource, /\baria-expanded\b/, "Expected project detail buttons to expose aria-expanded.");
    assertCodeMatches(projectDetailBehaviorSource, projectHashAnchorPattern, "Expected project detail implementation to build #project- hash anchors.");
    assertCodeMatches(projectDetailBehaviorSource, hashReadPattern, "Expected project detail implementation to read or check location.hash.");
    assertCodeMatches(projectDetailBehaviorSource, hashReplaceStatePattern, "Expected project detail implementation to call history.replaceState().");
    assertCodeMatches(projectDetailBehaviorSource, focusCallPattern, "Expected project detail open/close path to call focus().");
    assert.ok(
        codePatternMatches(openProjectDetailBlock, activeProjectPattern) && codePatternMatches(openProjectDetailBlock, expandedTruePattern),
        "Expected opening a project detail to mark the active control aria-expanded=true."
    );
    assert.ok(
        codePatternMatches(openProjectDetailBlock, expandedFalsePattern),
        "Expected opening a project detail to reset inactive controls to aria-expanded=false."
    );
    assertCodeMatches(openProjectDetailBlock, openPanelPattern, "Expected opening a project detail to show the inline detail panel.");
    assert.ok(
        codePatternMatches(closeProjectDetailBlock, expandedFalsePattern) && codePatternMatches(closeProjectDetailBlock, closedStatePattern),
        "Expected closing a project detail to reset expanded controls and clear the open panel state."
    );

    const primaryProjectIds = primaryProjectEntries.map((entry) => getTopLevelStringProperty(entry, "id"));

    assert.deepEqual(
        [...primaryProjectIds].sort(),
        [...requiredIds].sort(),
        "Expected PRIMARY_PROJECTS to contain exactly the approved primary project IDs."
    );
});

test("project media uses stable local assets instead of expiring LinkedIn URLs", () => {
    const projectAssetPaths = [
        "assets/projects/home-assistant-maya.jpg",
        "assets/projects/maya-whatsapp-agent-1.jpg",
        "assets/projects/maya-whatsapp-agent-2.jpg",
        "assets/projects/local-llm-cyber-agent.jpg",
        "assets/projects/rotemz-redlab.jpg",
        "assets/projects/zacaim-wifi-pi-lab-1.jpg",
        "assets/projects/zacaim-wifi-pi-lab-2.jpg",
        "assets/projects/ai-risk-local-model.jpg",
        "assets/projects/about-framer-prototype.jpg",
        "assets/projects/chatgpt-agent-job-search.jpg",
        "assets/projects/chatgpt-shared-links-risk.jpg",
        "assets/projects/apartment-plan-app.png",
        "assets/projects/home-assistant-wall-panel.png",
        "assets/projects/android-companion-app.jpg",
        "assets/projects/game-ui-qa-lab.jpg",
        "assets/projects/fortysevenms-vision-farmer.jpg",
        "assets/projects/sale-im-mvp.jpg",
        "assets/projects/group-buying-pwa.jpg",
        "assets/projects/quake-qwasm-browser-games.jpg",
        "assets/projects/openai-usage-dashboard.jpg",
        "assets/projects/ai-super-analyst-dashboard.jpg",
        "assets/projects/private-control-center-labs.jpg",
    ];

    for (const assetPath of projectAssetPaths) {
        const absolutePath = path.join(repoRoot, assetPath);
        assert.equal(fs.existsSync(absolutePath), true, `${assetPath} should exist`);
        assert.ok(fs.statSync(absolutePath).size > 10_000, `${assetPath} should not be an empty placeholder`);
        assertSourceMatches(scriptJs, new RegExp(escapeRegExp(assetPath)), `Expected script.js to reference ${assetPath}.`);
    }

    assertSourceDoesNotMatch(publicSiteSource, /media\.licdn\.com/, "Public source should not hotlink LinkedIn media.");
    assertSourceDoesNotMatch(publicSiteSource, /\.superpowers[\\/]/, "Public source should not reference .superpowers files.");
});

test("project cards use project-specific media instead of recycled placeholders", () => {
    const primaryProjectsBlock = getArrayBlock(executableScriptJs, "PRIMARY_PROJECTS");
    const secondaryProjectsBlock = getArrayBlock(executableScriptJs, "SECONDARY_PROJECTS");
    const renderProjectsBlock = getFunctionBlock(executableScriptJs, "renderProjects");
    const renderLabGalleryBlock = getFunctionBlock(executableScriptJs, "renderLabGallery");
    const projectDetailMarkupBlock = getFunctionBlock(executableScriptJs, "projectDetailMarkup");

    assertSourceMatches(
        primaryProjectsBlock,
        /id:\s*"home-assistant-maya"[\s\S]*?media:\s*\[[\s\S]*?src:\s*"assets\/projects\/home-assistant-maya\.jpg"/,
        "Home Assistant + Maya should lead with the real dashboard image sourced from the LinkedIn post."
    );

    for (const assetPath of [
        "assets/projects/android-companion-app.jpg",
        "assets/projects/game-ui-qa-lab.jpg",
        "assets/projects/fortysevenms-vision-farmer.jpg",
        "assets/projects/sale-im-mvp.jpg",
        "assets/projects/group-buying-pwa.jpg",
        "assets/projects/quake-qwasm-browser-games.jpg",
        "assets/projects/openai-usage-dashboard.jpg",
        "assets/projects/ai-super-analyst-dashboard.jpg",
    ]) {
        assertSourceMatches(
            secondaryProjectsBlock,
            new RegExp(escapeRegExp(`media: "${assetPath}"`)),
            `Expected SECONDARY_PROJECTS to use project-specific media ${assetPath}.`
        );
    }

    assertSourceDoesNotMatch(
        secondaryProjectsBlock,
        /title:\s*\{[^}]*?(?:Android Lab|Clash Royale|FortySevenMS|Sale-im|Group-Buying|Quake\/Qwasm|OpenAI Usage|AI Super-Analyst)[\s\S]{0,420}?media:\s*"assets\/projects\/(?:about-framer-prototype|maya-whatsapp-agent-2|apartment-plan-app)\.(?:jpg|png)"/,
        "Secondary projects should not reuse unrelated placeholder images."
    );
    assertSourceMatches(scriptJs, /\bconst\s+PROJECT_MEDIA_VERSION\s*=/, "Expected project media URLs to have a cache-busting version.");
    assertSourceMatches(scriptJs, /\bfunction\s+projectMediaSrc\s*\(/, "Expected a helper for stable project media cache-busting.");
    assertSourceMatches(renderProjectsBlock, /projectMediaSrc\s*\(\s*media\.src\s*\)/, "Expected primary project cards to use cache-busted media URLs.");
    assertSourceMatches(projectDetailMarkupBlock, /projectMediaSrc\s*\(\s*primaryMedia\.src\s*\)/, "Expected project detail hero image to use cache-busted media URLs.");
    assertSourceMatches(renderLabGalleryBlock, /projectMediaSrc\s*\(\s*project\.media\s*\)/, "Expected secondary project cards to use cache-busted media URLs.");
});

test("project cards are concise single-accent glass previews", () => {
    const renderProjectsBlock = getFunctionBlock(executableScriptJs, "renderProjects");
    const renderLabGalleryBlock = getFunctionBlock(executableScriptJs, "renderLabGallery");
    const renderCategoryChipsBlock = getFunctionBlock(executableScriptJs, "renderCategoryChips");

    assertSourceDoesNotMatch(renderProjectsBlock, /project-meta|project-source|metaParts|project\.source/, "Primary cards should not render metadata or source paragraphs.");
    assertSourceMatches(renderCategoryChipsBlock, /\.slice\s*\(\s*0\s*,\s*limit\s*\)/, "Category chip rendering should support an explicit visible tag limit.");
    assertSourceMatches(renderProjectsBlock, /renderCategoryChips\s*\(\s*project\.categories\s*,\s*language\s*,\s*3\s*\)/, "Primary cards should show at most three tags.");
    assertSourceMatches(renderLabGalleryBlock, /renderCategoryChips\s*\(\s*project\.tools\s*,\s*language\s*,\s*3\s*\)/, "Lab cards should show at most three tags.");
    assertSourceMatches(stylesCss, /--project-accent:\s*#[0-9a-f]{6}/i, "Project cards should share one ice-blue accent variable.");
    assertSourceDoesNotMatch(stylesCss, /\.project-card:nth-child|\.lab-project:nth-child|\.lab-card:nth-child/, "Project cards should not rotate accent colors by card position.");
    assertSourceDoesNotMatch(stylesCss, /\.project-category-chips li:nth-child/, "Project tags should not rotate accent colors by tag position.");
    assertSourceMatches(stylesCss, /-webkit-line-clamp:\s*2/, "Project descriptions should be clamped to two lines.");
    assertSourceMatches(stylesCss, /\.project-card[\s\S]{0,900}backdrop-filter:\s*blur\((?:1[6-9]|2[0-9])px\)/, "Project cards should use a subtle glass blur instead of an opaque panel.");
    assertSourceMatches(stylesCss, /\.project-card[\s\S]{0,900}min-height:\s*[\w(]/, "Project cards should keep a stable uniform height.");
});

test("mobile lab gallery cards keep visible project context", () => {
    const mobileCss = /@media\s*\(max-width:\s*640px\)\s*\{[\s\S]*?\.maya-chatbot\s*\{/.exec(stylesCss)?.[0] || "";

    assert.ok(mobileCss, "Expected mobile CSS rules for 640px.");
    assertSourceMatches(mobileCss, /\.project-card\s+\.project-card-summary\s*,\s*\.project-card\s+\.project-card-body\s*>\s*\.project-category-chips\s*\{[\s\S]{0,80}display:\s*none/, "Primary project card summary hiding should be scoped to .project-card only.");
    assertSourceDoesNotMatch(mobileCss, /(?:^|\n)\s*\.project-card-summary\s*,\s*\.project-card-body\s*>\s*\.project-category-chips\s*\{[\s\S]{0,80}display:\s*none/, "Global mobile summary hiding must not remove lab gallery context.");
    assertSourceMatches(mobileCss, /\.lab-project[\s\S]{0,260}min-height:\s*auto/, "Mobile lab cards should not reserve a large empty body.");
    assertSourceMatches(mobileCss, /\.lab-project\s+\.project-card-summary[\s\S]{0,220}display:\s*-webkit-box/, "Mobile lab cards should keep a clamped summary visible.");
    assertSourceMatches(mobileCss, /\.lab-project\s+\.project-card-body\s*>\s*\.project-category-chips[\s\S]{0,160}display:\s*flex/, "Mobile lab cards should keep concise technology chips visible.");
});

test("project detail opens as a premium case study with tabs and mobile accordion", () => {
    const projectDetailMarkupBlock = getFunctionBlock(executableScriptJs, "projectDetailMarkup");
    const detailTechnologyMarkupBlock = getFunctionBlock(executableScriptJs, "detailTechnologyMarkup");
    const openProjectDetailBlock = getFunctionBlock(executableScriptJs, "openProjectDetail");
    const closeProjectDetailBlock = getFunctionBlock(executableScriptJs, "closeProjectDetail");
    const initProjectInteractionsBlock = getFunctionBlock(executableScriptJs, "initProjectInteractions");

    for (const requiredClass of [
        "project-detail-case-study",
        "project-detail-hero",
        "project-detail-tabs",
        "project-tab-panel",
        "project-detail-accordion",
    ]) {
        assertSourceMatches(projectDetailMarkupBlock, new RegExp(requiredClass), `Expected project detail markup to include .${requiredClass}.`);
    }

    for (const tabName of ["overview", "architecture", "technologies", "results"]) {
        assertSourceMatches(projectDetailMarkupBlock, new RegExp(`id:\\s*["']${tabName}["']`), `Expected ${tabName} tab configuration.`);
        assertSourceMatches(projectDetailMarkupBlock, /data-project-tab="\$\{escapeHtml\(tab\.id\)\}"/, "Expected tab buttons to bind data-project-tab from tab data.");
        assertSourceMatches(projectDetailMarkupBlock, /data-project-tab-panel="\$\{escapeHtml\(tab\.id\)\}"/, "Expected tab panels to bind data-project-tab-panel from tab data.");
    }

    assertSourceMatches(detailTechnologyMarkupBlock, /\.slice\s*\(\s*0\s*,\s*5\s*\)/, "Project detail should limit visible technologies to five central items.");
    assertSourceMatches(scriptJs, /function\s+setProjectDetailTab\s*\(/, "Expected a tab switching helper for project detail.");
    assertSourceMatches(initProjectInteractionsBlock, /closest\s*\(\s*["']\[data-project-tab\]["']\s*\)/, "Project detail tabs should be handled by delegated click events.");
    assertSourceMatches(initProjectInteractionsBlock, /closest\s*\(\s*["']\[data-project-accordion\]["']\s*\)/, "Project detail accordions should keep mobile sections tidy.");
    assertSourceMatches(openProjectDetailBlock, /document\.body\.classList\.add\s*\(\s*["']is-project-detail-open["']\s*\)/, "Opening project detail should darken and blur the page backdrop.");
    assertSourceMatches(closeProjectDetailBlock, /document\.body\.classList\.remove\s*\(\s*["']is-project-detail-open["']\s*\)/, "Closing project detail should restore the page backdrop.");
    assertSourceMatches(stylesCss, /body\.is-project-detail-open::before/, "Expected a single page backdrop overlay behind the case study.");
    assertSourceMatches(stylesCss, /\.project-detail-panel[\s\S]{0,700}position:\s*fixed/, "Project detail should behave like a focused modal surface.");
    assertSourceMatches(stylesCss, /\.project-detail-panel[\s\S]{0,900}backdrop-filter:\s*blur\((?:2[4-9]|30)px\)/, "Project detail should use 24-30px backdrop blur.");
    assertSourceMatches(stylesCss, /\.project-detail-panel[\s\S]{0,900}border-radius:\s*(?:2[6-9]|30)px/, "Project detail should use a 26-30px radius.");
    assertSourceMatches(stylesCss, /\.project-detail-hero[\s\S]{0,500}grid-template-columns:\s*minmax\(0,\s*3fr\)\s+minmax\([^)]*,\s*2fr\)/, "Desktop project detail hero should use a 60/40 two-column layout.");
    assertSourceMatches(stylesCss, /@media\s*\(max-width:\s*760px\)[\s\S]*\.project-detail-panel[\s\S]{0,520}inset:\s*0/, "Mobile project detail should become full screen.");
    assertSourceMatches(stylesCss, /@media\s*\(max-width:\s*760px\)[\s\S]*\.project-detail-tabs[\s\S]{0,160}display:\s*none/, "Mobile project detail should hide tabs.");
    assertSourceMatches(stylesCss, /@media\s*\(max-width:\s*760px\)[\s\S]*\.project-detail-accordion[\s\S]{0,160}display:\s*grid/, "Mobile project detail should show accordion sections.");
});

test("home lab hero replaces the old rabbit stage", () => {
    assert.match(indexHtml, /type=["']importmap["']/);
    assert.match(indexHtml, /type=["']module["'][^>]+src=["']script\.js/);
    assert.match(indexHtml, /data-home-lab-scene/);
    assert.match(indexHtml, /home-lab-hero-concept\.png/);
    assert.match(indexHtml, /home-lab-leds/);
    assert.match(indexHtml, /home-lab-fog/);
    assert.match(indexHtml, /Maya/);
    assert.match(indexHtml, /Local AI/);
    assert.doesNotMatch(`${indexHtml}\n${stylesCss}\n${scriptJs}`, /data-three-character-stage/);
    assert.doesNotMatch(`${indexHtml}\n${stylesCss}\n${scriptJs}`, /rotem-z-rabbit\.glb/);
    assert.doesNotMatch(`${indexHtml}\n${stylesCss}\n${scriptJs}`, /procedural-rabbit/i);
});

test("home lab scene becomes a blurred scroll background", () => {
    assert.match(stylesCss, /--scene-scroll-progress/);
    assert.match(stylesCss, /--scene-blur/);
    assert.match(stylesCss, /--scene-opacity/);
    assert.match(stylesCss, /--scene-scale/);
    assert.match(stylesCss, /\.home-lab-scene/);
    assert.match(stylesCss, /\.home-lab-scene::before[\s\S]*home-lab-hero-concept\.png[\s\S]*background-size:\s*cover/);
    assert.match(stylesCss, /\.home-lab-fog/);
    assert.match(stylesCss, /@keyframes\s+labLedBlink/);
    assert.match(stylesCss, /@keyframes\s+labFogDrift/);
    assert.match(scriptJs, /function\s+initHomeLabScene/);
    assert.match(scriptJs, /requestAnimationFrame/);
    assert.match(scriptJs, /is-home-lab-background/);
    assert.match(scriptJs, /setProperty\("--scene-blur"/);
});

test("home lab LEDs are anchored to rack hardware instead of floating", () => {
    const ledContainer = /<div class="home-lab-leds">([\s\S]*?)<\/div>/.exec(indexHtml)?.[1] || "";
    const ledTags = findTagsByName(ledContainer, "span");

    assert.ok(ledTags.length >= 10, "Expected a dense rack LED cluster, not a few floating markers.");
    ledTags.forEach((tag) => {
        assert.match(tag, /class="home-lab-rack-led/, "Each LED marker should use the rack LED class.");
        assert.match(tag, /--rack-led-x:/, "Each LED marker should use rack-local x positioning.");
        assert.match(tag, /--rack-led-y:/, "Each LED marker should use rack-local y positioning.");
    });
    assertSourceDoesNotMatch(ledContainer, /--x:/, "Old floating LED x coordinates should be removed.");
    assertSourceDoesNotMatch(ledContainer, /--y:/, "Old floating LED y coordinates should be removed.");
    assert.match(stylesCss, /\.home-lab-rack-led/);
    assert.match(stylesCss, /left:\s*var\(--rack-led-x\)/);
    assert.match(stylesCss, /top:\s*var\(--rack-led-y\)/);
});

test("home lab hero asset ships locally", () => {
    const assetPath = path.join(repoRoot, "assets/3d/home-lab-hero-concept.png");

    assert.equal(fs.existsSync(assetPath), true);
    assert.ok(fs.statSync(assetPath).size > 100_000);
    assertSourceMatches(publicSiteSource, /assets\/3d\/home-lab-hero-concept\.png/, "Expected site to reference Home Lab concept image.");
});

test("home lab scene keeps mobile and reduced-motion safety", () => {
    assert.match(stylesCss, /overflow-x:\s*hidden/);
    assert.match(stylesCss, /@media\s*\(\s*max-width\s*:\s*760px\s*\)/);
    assert.match(stylesCss, /max-width:\s*100%/);
    assert.match(stylesCss, /prefers-reduced-motion/);
    assert.match(stylesCss, /\.home-lab-modules\s*{[\s\S]*display:\s*none/);
    assert.match(scriptJs, /matchMedia\("\(prefers-reduced-motion:\s*reduce\)"\)/);
    assert.doesNotMatch(scriptJs, /import\("three"\)/);
    assert.doesNotMatch(scriptJs, /GLTFLoader/);
});

test("preserves approved contact targets", () => {
    assert.match(indexHtml, /mailto:Rotemvnkll@gmail\.com/);
    assert.match(indexHtml, /https:\/\/www\.linkedin\.com\/in\/rotem-zacaim-b4a709223\//);
});

test("Maya chatbot ships as a local accessible mock assistant without frontend secrets", () => {
    const expectedFiles = [
        "assets/rive/maya-orb.riv",
        "assets/vendor/rive/rive.js",
        "assets/vendor/rive/rive.wasm",
        "assets/vendor/rive/rive_fallback.wasm",
        "assets/chatbot/chatbot.i18n.js",
        "assets/chatbot/chatbot.service.js",
        "assets/chatbot/maya-orb.js",
        "assets/chatbot/chatbot-ui.js",
        "assets/chatbot/chatbot.js",
    ];

    for (const file of expectedFiles) {
        const absolutePath = path.join(repoRoot, file);

        assert.equal(fs.existsSync(absolutePath), true, `${file} should be shipped as a local static asset.`);
        assert.ok(fs.statSync(absolutePath).size > 100, `${file} should not be an empty placeholder.`);
    }

    const chatbotSources = [
        readIfExists("assets/chatbot/chatbot.i18n.js"),
        readIfExists("assets/chatbot/chatbot.service.js"),
        readIfExists("assets/chatbot/maya-orb.js"),
        readIfExists("assets/chatbot/chatbot-ui.js"),
        readIfExists("assets/chatbot/chatbot.js"),
    ].join("\n");

    assertSourceMatches(indexHtml, /assets\/vendor\/rive\/rive\.js\?v=2\.39\.1/, "Expected Rive runtime to be pinned and served locally.");
    assertSourceMatches(indexHtml, /assets\/chatbot\/chatbot\.js\?v=/, "Expected the chatbot to load as a separate module.");
    assertSourceDoesNotMatch(indexHtml, /unpkg\.com\/@rive-app\/canvas-lite@2(?!\.39\.1)/, "Chatbot must not load a floating Rive major version from a CDN.");
    assertSourceDoesNotMatch(indexHtml, /cdn\.jsdelivr\.net\/npm\/@rive-app\/canvas-lite@2(?!\.39\.1)/, "Chatbot must not load a floating Rive fallback from a CDN.");
    assertSourceMatches(chatbotSources, /RuntimeLoader\.setWasmUrl\(["']assets\/vendor\/rive\/rive\.wasm["']\)/, "Expected Rive WASM URL to point to the local primary WASM file.");
    assertSourceMatches(chatbotSources, /RuntimeLoader\.setWasmFallbackUrl\(["']assets\/vendor\/rive\/rive_fallback\.wasm["']\)/, "Expected Rive fallback WASM URL to point to the local fallback file.");
    assertSourceMatches(chatbotSources, /artboard:\s*["']Artboard["']/, "Expected the real Rive artboard name to be used.");
    assertSourceMatches(chatbotSources, /stateMachine:\s*["']State Machine 1["']/, "Expected the real Rive state machine name to be recorded.");
    assertSourceMatches(chatbotSources, /Idle[\s\S]*Typing[\s\S]*Correct[\s\S]*Wrong[\s\S]*Jump[\s\S]*Reveal/, "Expected chat states to map to real animation names found in the Rive file.");
    assertSourceMatches(chatbotSources, /site-language-change/, "Expected the chatbot to follow the existing Hebrew/English language event.");
    assertSourceMatches(chatbotSources, /דברו עם Maya/, "Expected Hebrew launcher copy.");
    assertSourceMatches(chatbotSources, /Chat with Maya/, "Expected English launcher copy.");
    assertSourceMatches(chatbotSources, /role["']?\s*,\s*["']dialog["']|role:\s*["']dialog["']/, "Expected the panel to expose dialog semantics.");
    assertSourceMatches(chatbotSources, /aria-live/, "Expected new assistant messages to be announced accessibly.");
    assertSourceMatches(chatbotSources, /Escape/, "Expected Escape to close the chatbot.");
    assertSourceMatches(chatbotSources, /trapFocus|focusTrap|handleFocusTrap/, "Expected a focus trap while the chatbot is open.");
    assertSourceMatches(chatbotSources, /textarea/, "Expected the chat input to use a textarea.");
    assertSourceMatches(chatbotSources, /\.textContent\s*=|createTextNode\(/, "Expected message rendering to use text nodes instead of HTML injection.");
    assertSourceMatches(chatbotSources, /export\s+async\s+function\s+sendChatMessage/, "Expected a service boundary for future backend integration.");
    assertSourceMatches(chatbotSources, /\/api\/chat/, "Expected the future backend endpoint to be documented in the service layer.");
    assertSourceDoesNotMatch(chatbotSources, /\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource/, "The first version should not call an external or backend service.");
    assertSourceDoesNotMatch(chatbotSources, /OPENAI_API_KEY|apiKey|Authorization|Bearer|dangerouslySetInnerHTML|\.innerHTML\s*=|insertAdjacentHTML|eval\s*\(|new Function/, "Chatbot frontend must not expose secrets or inject user-controlled HTML.");
});

test("Maya chatbot public answers do not expose implementation details", () => {
    const chatbotCopySource = readIfExists("assets/chatbot/chatbot.i18n.js");

    assertSourceDoesNotMatch(chatbotCopySource, /גרסת mock|mock מקומית|בלי לשלוח מידע לשרת|local mock and does not send/i, "Maya answers should not mention mock mode or server behavior to site visitors.");
});

test("Maya chatbot module graph is cache-busted for content updates", () => {
    const chatbotEntrySource = readIfExists("assets/chatbot/chatbot.js");
    const chatbotUiSource = readIfExists("assets/chatbot/chatbot-ui.js");
    const chatbotStateSource = readIfExists("assets/chatbot/chatbot.state.js");
    const chatbotServiceSource = readIfExists("assets/chatbot/chatbot.service.js");

    assertSourceMatches(indexHtml, /assets\/chatbot\/chatbot\.js\?v=20260802-maya-chatbot-depth/, "Expected the chatbot entry script to use the current content cache key.");
    assertSourceMatches(chatbotEntrySource, /chatbot-ui\.js\?v=20260802-maya-chatbot-depth/, "Expected chatbot entry to cache-bust the UI module.");
    assertSourceMatches(chatbotUiSource, /chatbot\.i18n\.js\?v=20260802-maya-chatbot-depth/, "Expected chatbot UI to cache-bust translated copy.");
    assertSourceMatches(chatbotStateSource, /chatbot\.service\.js\?v=20260802-maya-chatbot-depth/, "Expected chatbot state to cache-bust service responses.");
    assertSourceMatches(chatbotServiceSource, /chatbot\.i18n\.js\?v=20260802-maya-chatbot-depth/, "Expected chatbot service to cache-bust response copy.");
});

test("Maya chatbot project answers are technical, comprehensive, and public-safe", async () => {
    const chatbotI18nUrl = `${pathToFileURL(path.join(repoRoot, "assets/chatbot/chatbot.i18n.js")).href}?v=${Date.now()}`;
    const { CHATBOT_I18N } = await import(chatbotI18nUrl);
    const hebrewMayaAnswer = CHATBOT_I18N.he.responses.maya;
    const englishMayaAnswer = CHATBOT_I18N.en.responses.maya;
    const publicAnswerText = [
        ...Object.values(CHATBOT_I18N.he.responses),
        ...Object.values(CHATBOT_I18N.en.responses),
    ].join("\n");

    assert.ok(hebrewMayaAnswer.length > 650, "Expected the Hebrew Maya answer to be a technical case-study response, not a short summary.");
    assert.ok(englishMayaAnswer.length > 800, "Expected the English Maya answer to be a technical case-study response, not a short summary.");

    for (const pattern of [/ארכיטקטורה|שכבות/, /WhatsApp/i, /orchestrator|אורקסטרציה/i, /tool layer|שכבת כלים/i, /observability|ניטור/i]) {
        assert.match(publicAnswerText, pattern, `Expected technical chatbot answers to include ${pattern}.`);
    }

    const forbiddenPublicAnswerSignals = [
        /\b(?:localhost|127\.0\.0\.1|0\.0\.0\.0):\d{2,5}\b/i,
        /\b[a-z0-9-]+\.trycloudflare\.com\b/i,
        /\b(?:\d{1,3}\.){3}\d{1,3}\b/,
        /\b(?:sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|xox[baprs]-[A-Za-z0-9-]{20,})\b/,
        /-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/,
        /\b120363\d+@g\.us\b/i,
        /\b972\d+@c\.us\b/i,
        /\b(?:sensor|switch|camera|light|automation|script|device_tracker|person|lock|calendar)\.[a-z0-9_]+\b/i,
    ];

    for (const pattern of forbiddenPublicAnswerSignals) {
        assert.doesNotMatch(publicAnswerText, pattern, `Maya public answers must not expose sensitive operational detail matching ${pattern}.`);
    }
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
        ["Cloudflare tunnel hostname", /\b[a-z0-9-]+\.trycloudflare\.com\b/i],
        ["private mon hostname", /\bmon\.rotem-dev\.org\b/i],
        [
            "Home Assistant entity id",
            /\b(?:alarm_control_panel|binary_sensor|sensor|switch|cover|vacuum|camera|climate|light|automation|script|media_player|device_tracker|person|lock|input_boolean|calendar|scene|fan|button|number|select|input_number|input_select)\.[a-z0-9_]+\b/i,
            publicCopyAndDataSource,
        ],
        ["private filesystem path", /C:\\Users\\rotem\\Documents\\codex\\WEB\\maya/i],
    ];

    for (const [label, pattern, source = publicSiteSource] of forbiddenPatterns) {
        assertSourceDoesNotMatch(source, pattern, `Public page must not expose ${label}.`);
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
