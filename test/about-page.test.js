const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const repoRoot = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(repoRoot, "index.html"), "utf8");
const stylesCss = fs.readFileSync(path.join(repoRoot, "styles.css"), "utf8");
const scriptJs = fs.readFileSync(path.join(repoRoot, "script.js"), "utf8");
const cname = fs.readFileSync(path.join(repoRoot, "CNAME"), "utf8").trim();
const publicSource = `${indexHtml}\n${stylesCss}\n${scriptJs}`;

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function tags(markup, tagName) {
  return Array.from(markup.matchAll(new RegExp(`<${escapeRegExp(tagName)}(?=\\s|[>/])[^>]*>`, "gi")), (match) => match[0]);
}

function attr(tag, name) {
  const match = tag.match(new RegExp(`(?:^|\\s)${escapeRegExp(name)}\\s*=\\s*(["'])(.*?)\\1`, "is"));
  return match ? match[2] : "";
}

function hasAttr(markup, name) {
  return new RegExp(`\\s${escapeRegExp(name)}(?:[\\s=>]|$)`, "i").test(markup);
}

function getObjectBlock(source, openingBraceIndex) {
  let depth = 0;
  for (let index = openingBraceIndex; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(openingBraceIndex, index + 1);
    }
  }
  return "";
}

function i18nBlock() {
  const marker = /\bconst\s+I18N\s*=\s*{/.exec(scriptJs);
  assert.ok(marker, "script.js must declare const I18N.");
  return getObjectBlock(scriptJs, marker.index + marker[0].lastIndexOf("{"));
}

function languageBlock(language) {
  const block = i18nBlock();
  const marker = new RegExp(`\\b${language}\\s*:\\s*{`).exec(block);
  assert.ok(marker, `I18N must include ${language}.`);
  return getObjectBlock(block, marker.index + marker[0].lastIndexOf("{"));
}

function i18nKeys() {
  const textKeys = Array.from(indexHtml.matchAll(/data-i18n="([^"]+)"/g), (match) => match[1]);
  const attrKeys = Array.from(indexHtml.matchAll(/data-i18n-attr="([^"]+)"/g)).flatMap((match) =>
    Array.from(match[1].matchAll(/(?:^|[\s,;])[^:\s,;]+\s*:\s*([^\s,;]+)/g), (item) => item[1])
  );
  return [...new Set([...textKeys, ...attrKeys])];
}

test("page defaults to Hebrew RTL and the approved custom domain", () => {
  assert.ok(tags(indexHtml, "html").some((tag) => attr(tag, "lang") === "he" && attr(tag, "dir") === "rtl"));
  assert.equal(cname, "about.rotem-dev.org");
  assert.ok(indexHtml.includes('href="#main-content"'));
  assert.ok(hasAttr(indexHtml, "data-language-toggle"));
});

test("approved Maya Agent sections and hero assets exist", () => {
  for (const id of ["story", "abilities", "projects", "contact"]) {
    assert.ok(indexHtml.includes(`id="${id}"`), `missing section ${id}`);
  }
  assert.ok(indexHtml.includes("assets/maya-agent-cutout.webp"));
  assert.ok(indexHtml.includes("assets/maya-agent-cutout.png"));
  assert.ok(indexHtml.includes("MAYA AGENT") || publicSource.includes("Maya Agent"));
});

test("character motion hooks are present", () => {
  assert.ok(hasAttr(indexHtml, "data-character-hero"));
  assert.ok(hasAttr(indexHtml, "data-maya-character"));
  assert.match(scriptJs, /\bclass\s+MayaCharacterMotion\b/);
  assert.match(scriptJs, /requestAnimationFrame/);
  assert.match(stylesCss, /\.hero-stage\.is-character-shifted/);
  assert.match(stylesCss, /prefers-reduced-motion/);
});

test("core public-safe Maya content is represented", () => {
  for (const phrase of [
    "WhatsApp AI Agent",
    "Memory + Calendar",
    "Voice, Vision, Automation",
    "RoteMGPT",
    "Home Assistant",
    "Android Lab",
    "RedLab",
    "Cloudflare",
  ]) {
    assert.ok(publicSource.includes(phrase), `missing phrase: ${phrase}`);
  }
});

test("all HTML i18n keys have Hebrew and English translations", () => {
  const keys = i18nKeys();
  assert.ok(keys.length >= 20, `expected at least 20 i18n keys, found ${keys.length}`);
  for (const language of ["he", "en"]) {
    const block = languageBlock(language);
    for (const key of keys) {
      assert.match(block, new RegExp(`(?:^|[,{\\s])(?:${escapeRegExp(key)}|["']${escapeRegExp(key)}["'])\\s*:`), `${language} missing ${key}`);
    }
  }
});

test("public page avoids secrets and private operational identifiers", () => {
  for (const pattern of [
    /OPENAI_API_KEY/i,
    /HOME_ASSISTANT_TOKEN/i,
    /GOOGLE_MAPS_API_KEY/i,
    /credentials\.google\.json/i,
    /token\.google\.json/i,
    /\b120363\d+@g\.us\b/i,
    /\b972\d+@c\.us\b/i,
    /PRIVATE KEY/i,
  ]) {
    assert.doesNotMatch(publicSource, pattern);
  }
});
