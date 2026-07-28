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
            label: "2020-2021 Israel Police patrol training",
            signals: [/Israel Police/i, /patrol/i, /training/i],
        },
        {
            period: new RegExp(String.raw`2014${periodSeparator}2017`),
            label: "2014-2017 IDF SAP logistics and inventory",
            signals: [/\bIDF\b/i, /\bSAP\b/i, /logistics/i, /inventory/i],
        },
        {
            period: new RegExp(String.raw`2013${periodSeparator}2017`),
            label: "2013-2017 branch manager food retail",
            signals: [/Branch manager/i, /food retail/i],
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
    assert.match(
        stylesCss,
        /body\.is-character-docked\s+\.character-guide\s*{[^}]*opacity\s*:/,
        "Expected docked character styles to keep an explicit opacity state."
    );
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
