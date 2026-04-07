const revealItems = Array.from(document.querySelectorAll("[data-reveal]"));
const yearNode = document.querySelector("[data-year]");
const cards = Array.from(document.querySelectorAll(".card"));
const ambientCanvas = document.querySelector(".ambient-canvas");
const bootScreenElement = document.querySelector("[data-boot-screen]");
const bootCopyElement = document.querySelector("[data-boot-copy]");
const bootStampElement = document.querySelector("[data-boot-stamp]");
const bootSteps = Array.from(document.querySelectorAll("[data-boot-step]"));
const assistantBotElement = document.querySelector("[data-assistant-bot]");
const assistantBubble = document.querySelector("[data-assistant-bubble]");
const assistantMessage = document.querySelector("[data-assistant-message]");
const assistantPupils = Array.from(document.querySelectorAll("[data-pupil]"));
const messageSections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".topnav a[href^='#']"));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const sectionLinkMap = new Map(
    navLinks.map((link) => [link.getAttribute("href").slice(1), link])
);

if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

if (revealItems.length > 0) {
    revealItems.forEach((item) => item.classList.add("reveal-ready"));

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    } else {
        const observer = new IntersectionObserver(
            (entries, activeObserver) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");
                    activeObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.18,
                rootMargin: "0px 0px -32px 0px",
            }
        );

        revealItems.forEach((item) => observer.observe(item));
    }
}

if (navLinks.length > 0) {
    const setActiveNavLink = (sectionId) => {
        navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${sectionId}`;
            link.classList.toggle("is-active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    const initialSection = window.location.hash.slice(1) || "overview";

    if (sectionLinkMap.has(initialSection)) {
        setActiveNavLink(initialSection);
    }

    window.addEventListener("hashchange", () => {
        const hashSection = window.location.hash.slice(1);

        if (sectionLinkMap.has(hashSection)) {
            setActiveNavLink(hashSection);
        }
    });

    const observedNavSections = messageSections.filter((section) => sectionLinkMap.has(section.id));

    if (observedNavSections.length > 0 && "IntersectionObserver" in window) {
        const visibleSections = new Map();
        const navObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visibleSections.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visibleSections.delete(entry.target.id);
                    }
                });

                let nextSection = initialSection;
                let bestRatio = -1;

                visibleSections.forEach((ratio, id) => {
                    if (ratio > bestRatio) {
                        bestRatio = ratio;
                        nextSection = id;
                    }
                });

                if (sectionLinkMap.has(nextSection)) {
                    setActiveNavLink(nextSection);
                }
            },
            {
                threshold: [0.18, 0.4, 0.65],
                rootMargin: "-16% 0px -58% 0px",
            }
        );

        observedNavSections.forEach((section) => navObserver.observe(section));
    }
}

if (!prefersReducedMotion.matches && cards.length > 0) {
    cards.forEach((card) => {
        const resetSpotlight = () => {
            card.classList.remove("is-active");
        };

        card.addEventListener("pointermove", (event) => {
            const bounds = card.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            card.style.setProperty("--pointer-x", `${x}px`);
            card.style.setProperty("--pointer-y", `${y}px`);
            card.classList.add("is-active");
        });

        card.addEventListener("pointerleave", resetSpotlight);
        card.addEventListener("pointercancel", resetSpotlight);
    });
}

class BootLoader {
    constructor(screen, copyNode, stampNode, steps, canvas, reducedMotion) {
        this.screen = screen;
        this.copyNode = copyNode;
        this.stampNode = stampNode;
        this.steps = steps;
        this.canvas = canvas;
        this.reducedMotion = reducedMotion;
        this.stepMap = new Map(
            steps.map((step) => [step.dataset.bootStep, step])
        );
        this.sessionKey = "rz-loader-seen";
        this.minDuration = 3500;
        this.isSkipped = document.documentElement.classList.contains("loader-skip");
    }

    async start() {
        if (!this.screen) {
            return;
        }

        if (this.isSkipped) {
            this.teardown({ immediate: true });
            return;
        }

        document.body.classList.add("is-booting");
        this.updateStamp();
        this.setProgress(0.04);

        try {
            const minDelay = this.wait(this.minDuration);

            await this.advanceStep(
                "shell",
                "Checking shell integrity and interface boundaries.",
                0.22,
                this.wait(this.reducedMotion ? 70 : 160)
            );

            await this.advanceStep(
                "fonts",
                "Syncing the type system and command labels.",
                0.5,
                this.waitForFonts()
            );

            await this.advanceStep(
                "ambient",
                "Calibrating the ambient field and interface depth.",
                0.78,
                this.waitForCanvasReady()
            );

            await Promise.all([minDelay, this.waitForStableFrame()]);

            await this.advanceStep(
                "profile",
                "Operator profile ready. Opening the deck.",
                1,
                this.wait(this.reducedMotion ? 70 : 180)
            );
        } catch (error) {
            this.setCopy("Fallback handoff engaged. Opening the deck.");
            this.setProgress(1);
        }

        this.complete();
    }

    setProgress(value) {
        const clamped = Math.max(0, Math.min(1, value));
        this.screen.style.setProperty("--boot-progress", clamped.toFixed(3));
    }

    setCopy(text) {
        if (this.copyNode) {
            this.copyNode.textContent = text;
        }
    }

    updateStamp() {
        if (!this.stampNode) {
            return;
        }

        const stamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });

        this.stampNode.textContent = stamp;
    }

    setStepState(stepName, state, label) {
        const row = this.stepMap.get(stepName);

        if (!row) {
            return;
        }

        row.dataset.state = state;

        const labelNode = row.querySelector("strong");

        if (labelNode) {
            labelNode.textContent = label;
        }
    }

    async advanceStep(stepName, copy, progress, task) {
        this.setCopy(copy);
        this.setStepState(stepName, "active", "active");
        await task;
        this.setStepState(stepName, "done", "ready");
        this.setProgress(progress);
    }

    waitForFonts() {
        if (!("fonts" in document) || !document.fonts.ready) {
            return this.wait(120);
        }

        return Promise.race([
            document.fonts.ready.catch(() => undefined),
            this.wait(this.reducedMotion ? 220 : 1400),
        ]);
    }

    waitForCanvasReady() {
        if (!this.canvas) {
            return this.wait(120);
        }

        if (this.canvas.classList.contains("is-ready")) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            let resolved = false;
            let fallbackId = 0;

            const finish = () => {
                if (resolved) {
                    return;
                }

                resolved = true;
                observer.disconnect();
                window.clearTimeout(fallbackId);
                resolve();
            };

            const observer = new MutationObserver(() => {
                if (this.canvas.classList.contains("is-ready")) {
                    finish();
                }
            });

            observer.observe(this.canvas, {
                attributes: true,
                attributeFilter: ["class"],
            });

            fallbackId = window.setTimeout(finish, this.reducedMotion ? 220 : 1800);
        });
    }

    waitForStableFrame() {
        return new Promise((resolve) => {
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(resolve);
            });
        });
    }

    wait(duration) {
        return new Promise((resolve) => {
            window.setTimeout(resolve, duration);
        });
    }

    complete() {
        this.setCopy("Command deck online.");

        try {
            window.sessionStorage.setItem(this.sessionKey, "1");
        } catch (error) {
            // Session storage can be unavailable in restricted contexts.
        }

        this.teardown();
    }

    teardown({ immediate = false } = {}) {
        document.body.classList.remove("is-booting");
        this.screen.setAttribute("aria-hidden", "true");

        if (immediate) {
            this.screen.hidden = true;
            return;
        }

        this.screen.classList.add("is-ready");

        window.setTimeout(() => {
            this.screen.hidden = true;
        }, this.reducedMotion ? 40 : 680);
    }
}

class AmbientBackground {
    constructor(canvas, sections, reducedMotion) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { alpha: true });
        this.sections = sections;
        this.reducedMotion = reducedMotion;
        this.width = 0;
        this.height = 0;
        this.dpr = 1;
        this.time = 0;
        this.visibleSections = new Map();
        this.sectionObserver = null;
        this.currentProfileId = "overview";
        this.sectionProfiles = {
            overview: {
                hue: 220,
                spread: 280,
                arms: 4,
                spiralTwist: 2.8,
                flatness: 0.34,
                coreConcentration: 0.56,
                cloudSize: 190,
                cloudOpacity: 0.035,
                depth: 0.14
            },
            expertise: {
                hue: 188,
                spread: 250,
                arms: 4,
                spiralTwist: 3.3,
                flatness: 0.4,
                coreConcentration: 0.6,
                cloudSize: 170,
                cloudOpacity: 0.03,
                depth: 0.2
            },
            workflow: {
                hue: 258,
                spread: 326,
                arms: 7,
                spiralTwist: 0.7,
                flatness: 0.88,
                coreConcentration: 0.42,
                cloudSize: 250,
                cloudOpacity: 0.05,
                depth: 0.4
            },
            builds: {
                hue: 204,
                spread: 312,
                arms: 5,
                spiralTwist: 4.1,
                flatness: 0.24,
                coreConcentration: 0.52,
                cloudSize: 205,
                cloudOpacity: 0.028,
                depth: 0.54
            },
            experience: {
                hue: 228,
                spread: 266,
                arms: 3,
                spiralTwist: 1.9,
                flatness: 0.46,
                coreConcentration: 0.66,
                cloudSize: 170,
                cloudOpacity: 0.028,
                depth: 0.3
            },
            toolkit: {
                hue: 176,
                spread: 336,
                arms: 6,
                spiralTwist: 1.7,
                flatness: 0.64,
                coreConcentration: 0.48,
                cloudSize: 220,
                cloudOpacity: 0.04,
                depth: 0.24
            },
            contact: {
                hue: 284,
                spread: 236,
                arms: 2,
                spiralTwist: 0.28,
                flatness: 1.45,
                coreConcentration: 0.78,
                cloudSize: 155,
                cloudOpacity: 0.024,
                depth: 0.48
            }
        };
        this.currentProfile = this.sectionProfiles.overview;
        this.targetHue = this.currentProfile.hue;
        this.currentHue = this.currentProfile.hue;
        this.targetDepth = this.currentProfile.depth;
        this.currentDepth = this.currentProfile.depth;
        this.maxFocal = 470;
        this.minFocal = 120;
        this.focalLength = this.maxFocal;
        this.pointer = {
            x: 0.5,
            y: 0.42,
            targetX: 0.5,
            targetY: 0.42
        };
        this.camera = {
            rotX: 0.22,
            rotY: 0
        };
        this.morphProgress = 1;
        this.morphSpeed = 0.017;
        this.starCount = 520;
        this.nebulaCount = 920;
        this.glowCount = 42;
        this.maxSparks = 140;
        this.stars = Array.from({ length: this.starCount }, () => this.createStar());
        this.nebula = Array.from({ length: this.nebulaCount }, () =>
            this.createNebulaParticle(this.currentProfile)
        );
        this.glowClouds = Array.from({ length: this.glowCount }, () =>
            this.createGlowCloud(this.currentProfile)
        );
        this.sparks = [];
        this.rafId = null;
        this.resize = this.resize.bind(this);
        this.loop = this.loop.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.resetPointer = this.resetPointer.bind(this);
        this.onSectionIntersect = this.onSectionIntersect.bind(this);
    }

    createStar() {
        return {
            x: Math.random() * 2 - 0.5,
            y: Math.random() * 2 - 0.5,
            z: Math.random(),
            size: Math.random() * 1.7 + 0.25,
            twinkleSpeed: Math.random() * 2 + 0.8,
            twinkleOffset: Math.random() * Math.PI * 2
        };
    }

    createNebulaParticle(profile) {
        const target = this.generateNebulaTarget(profile);

        return {
            x: target.x,
            y: target.y,
            z: target.z,
            tx: target.x,
            ty: target.y,
            tz: target.z,
            size: target.size,
            targetSize: target.size,
            opacity: target.opacity,
            targetOpacity: target.opacity,
            hueShift: Math.random() * 58 - 29,
            saturation: Math.random() * 30 + 52,
            lightness: Math.random() * 28 + 40,
            rotSpeed: (Math.random() - 0.5) * 0.28,
            wobbleAmp: Math.random() * 16 + 4,
            wobbleSpeed: Math.random() * 1.3 + 0.55,
            wobbleOffset: Math.random() * Math.PI * 2,
            pulseSpeed: Math.random() * 2 + 0.5,
            pulseOffset: Math.random() * Math.PI * 2
        };
    }

    generateNebulaTarget(profile) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const armAngle =
            Math.floor(Math.random() * profile.arms) * ((Math.PI * 2) / Math.max(profile.arms, 1));
        const radius = Math.pow(Math.random(), profile.coreConcentration) * profile.spread;
        const spiralOffset = radius * profile.spiralTwist * 0.01;

        return {
            x: Math.cos(theta + armAngle + spiralOffset) * radius * Math.sin(phi),
            y: (Math.random() - 0.5) * radius * profile.flatness,
            z: Math.sin(theta + armAngle + spiralOffset) * radius * Math.sin(phi),
            size: Math.random() * 3.2 + 0.45,
            opacity: Math.random() * 0.58 + 0.12
        };
    }

    createGlowCloud(profile) {
        const target = this.generateGlowTarget(profile);

        return {
            x: target.x,
            y: target.y,
            z: target.z,
            tx: target.x,
            ty: target.y,
            tz: target.z,
            size: target.size,
            targetSize: target.size,
            opacity: target.opacity,
            targetOpacity: target.opacity,
            hueShift: Math.random() * 46 - 23,
            rotSpeed: (Math.random() - 0.5) * 0.08
        };
    }

    generateGlowTarget(profile) {
        const theta = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.52) * profile.spread;

        return {
            x: Math.cos(theta) * radius,
            y: (Math.random() - 0.5) * radius * profile.flatness,
            z: Math.sin(theta) * radius,
            size: Math.random() * profile.cloudSize + 80,
            opacity: Math.random() * profile.cloudOpacity + 0.01
        };
    }

    start() {
        if (!this.ctx) {
            return;
        }

        this.resize();
        this.setupSectionTracking();
        window.addEventListener("resize", this.resize);

        if (!this.reducedMotion) {
            window.addEventListener("pointermove", this.onPointerMove, { passive: true });
            window.addEventListener("blur", this.resetPointer);
            document.addEventListener("mouseleave", this.resetPointer);
            this.rafId = window.requestAnimationFrame(this.loop);
        } else {
            this.render(0);
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.dpr = Math.min(window.devicePixelRatio || 1, 1.75);

        this.canvas.width = Math.round(this.width * this.dpr);
        this.canvas.height = Math.round(this.height * this.dpr);
        this.canvas.style.width = `${this.width}px`;
        this.canvas.style.height = `${this.height}px`;
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

        if (this.reducedMotion) {
            this.render(0);
        }
    }

    setupSectionTracking() {
        if (this.sections.length === 0 || !("IntersectionObserver" in window)) {
            return;
        }

        this.sectionObserver = new IntersectionObserver(this.onSectionIntersect, {
            threshold: [0.22, 0.45, 0.72],
            rootMargin: "-10% 0px -34% 0px"
        });

        this.sections.forEach((section) => this.sectionObserver.observe(section));
    }

    onSectionIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.visibleSections.set(entry.target.id, entry.intersectionRatio);
            } else {
                this.visibleSections.delete(entry.target.id);
            }
        });

        let nextSection = this.currentProfileId;
        let bestRatio = -1;

        this.visibleSections.forEach((ratio, id) => {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                nextSection = id;
            }
        });

        this.setProfile(nextSection);
    }

    setProfile(id) {
        const profile = this.sectionProfiles[id] || this.sectionProfiles.overview;

        if (id === this.currentProfileId) {
            return;
        }

        this.currentProfileId = id;
        this.currentProfile = profile;
        this.targetHue = profile.hue;
        this.targetDepth = profile.depth;
        this.assignNebulaTargets(profile, this.reducedMotion);
        this.assignGlowTargets(profile, this.reducedMotion);

        if (!this.reducedMotion) {
            this.emitSparks(24);
        } else {
            this.currentHue = profile.hue;
            this.currentDepth = profile.depth;
            this.render(this.time);
        }
    }

    assignNebulaTargets(profile, immediate) {
        this.nebula.forEach((particle) => {
            const target = this.generateNebulaTarget(profile);
            particle.tx = target.x;
            particle.ty = target.y;
            particle.tz = target.z;
            particle.targetSize = target.size;
            particle.targetOpacity = target.opacity;

            if (immediate) {
                particle.x = target.x;
                particle.y = target.y;
                particle.z = target.z;
                particle.size = target.size;
                particle.opacity = target.opacity;
            }
        });

        this.morphProgress = immediate ? 1 : 0;
    }

    assignGlowTargets(profile, immediate) {
        this.glowClouds.forEach((cloud) => {
            const target = this.generateGlowTarget(profile);
            cloud.tx = target.x;
            cloud.ty = target.y;
            cloud.tz = target.z;
            cloud.targetSize = target.size;
            cloud.targetOpacity = target.opacity;

            if (immediate) {
                cloud.x = target.x;
                cloud.y = target.y;
                cloud.z = target.z;
                cloud.size = target.size;
                cloud.opacity = target.opacity;
            }
        });
    }

    emitSparks(count) {
        for (let index = 0; index < count; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const speed = Math.random() * 6 + 2.6;

            this.sparks.push({
                x: 0,
                y: 0,
                z: 0,
                vx: Math.cos(angle) * Math.sin(phi) * speed,
                vy: (Math.random() - 0.5) * speed * 0.8,
                vz: Math.sin(angle) * Math.sin(phi) * speed,
                life: 1,
                decay: Math.random() * 0.014 + 0.008,
                size: Math.random() * 2.4 + 1.3,
                hueShift: Math.random() * 80 - 40,
                trail: []
            });
        }

        while (this.sparks.length > this.maxSparks) {
            this.sparks.shift();
        }
    }

    onPointerMove(event) {
        if (this.width === 0 || this.height === 0) {
            return;
        }

        this.pointer.targetX = event.clientX / this.width;
        this.pointer.targetY = event.clientY / this.height;
    }

    resetPointer() {
        this.pointer.targetX = 0.5;
        this.pointer.targetY = 0.42;
    }

    loop(timestamp) {
        this.time = timestamp * 0.001;
        this.render(this.time);
        this.rafId = window.requestAnimationFrame(this.loop);
    }

    render(time) {
        const ctx = this.ctx;

        if (!ctx) {
            return;
        }

        this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.04;
        this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.04;
        this.currentHue += (this.targetHue - this.currentHue) * 0.02;
        this.currentDepth += (this.targetDepth - this.currentDepth) * 0.03;
        this.focalLength =
            this.maxFocal - (this.maxFocal - this.minFocal) * this.currentDepth;

        if (this.morphProgress < 1) {
            this.morphProgress = Math.min(1, this.morphProgress + this.morphSpeed);
        }

        ctx.clearRect(0, 0, this.width, this.height);
        this.drawBackdrop(time);
        this.drawStars(time);
        this.drawNebula(time);
        this.drawSparks(time);
        this.canvas.classList.add("is-ready");
    }

    drawBackdrop(time) {
        const ctx = this.ctx;
        const centerX = this.width * (0.48 + (this.pointer.x - 0.5) * 0.06);
        const centerY = this.height * (0.5 + (this.pointer.y - 0.5) * 0.04);
        const radius = Math.max(this.width, this.height) * (0.42 + this.currentDepth * 0.25);
        const hue = this.currentHue;

        const core = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
        core.addColorStop(0, `hsla(${hue + 20}, 72%, 76%, 0.13)`);
        core.addColorStop(0.2, `hsla(${hue}, 64%, 48%, 0.08)`);
        core.addColorStop(0.6, `hsla(${hue - 24}, 52%, 22%, 0.03)`);
        core.addColorStop(1, "transparent");
        ctx.fillStyle = core;
        ctx.fillRect(0, 0, this.width, this.height);

        const sideGlow = ctx.createRadialGradient(
            this.width * 0.78,
            this.height * 0.18,
            0,
            this.width * 0.78,
            this.height * 0.18,
            this.width * 0.3
        );
        sideGlow.addColorStop(0, `hsla(${hue + 44}, 80%, 72%, 0.06)`);
        sideGlow.addColorStop(1, "transparent");
        ctx.fillStyle = sideGlow;
        ctx.fillRect(0, 0, this.width, this.height);

        const bloom = ctx.createLinearGradient(0, 0, this.width, this.height);
        bloom.addColorStop(0, "rgba(255, 255, 255, 0)");
        bloom.addColorStop(0.5, `hsla(${hue + 8}, 70%, 70%, ${0.015 + this.currentDepth * 0.03})`);
        bloom.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = bloom;
        ctx.fillRect(0, 0, this.width, this.height);

        const pulseRadius = 50 + ((time * 56) % 100);

        for (let ring = 0; ring < 3; ring += 1) {
            const radiusStep = pulseRadius + ring * 44;
            const alpha = Math.max(0, 0.16 - ring * 0.035 - (pulseRadius % 100) / 680);
            ctx.beginPath();
            ctx.arc(this.width * 0.82, this.height * 0.18, radiusStep, 0, Math.PI * 2);
            ctx.strokeStyle = `hsla(${hue + 18}, 78%, 72%, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    drawStars(time) {
        const ctx = this.ctx;
        const parallaxX = (this.pointer.x - 0.5) * 120;
        const parallaxY = (this.pointer.y - 0.5) * 120;

        this.stars.forEach((star) => {
            const px = star.x * this.width + parallaxX * star.z;
            const py = star.y * this.height + parallaxY * star.z;

            if (px < -20 || px > this.width + 20 || py < -20 || py > this.height + 20) {
                return;
            }

            const twinkle =
                0.35 + 0.65 * Math.abs(Math.sin(time * star.twinkleSpeed + star.twinkleOffset));
            const alpha = twinkle * (0.24 + star.z * 0.7);
            const size = star.size * (0.45 + star.z * 0.55);

            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(222, 232, 255, ${alpha})`;
            ctx.fill();

            if (size > 1.1 && twinkle > 0.72) {
                ctx.beginPath();
                ctx.arc(px, py, size * 3.2, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.currentHue + 24}, 54%, 78%, ${alpha * 0.08})`;
                ctx.fill();
            }
        });
    }

    drawNebula(time) {
        const ctx = this.ctx;
        const centerX = this.width * 0.5;
        const centerY = this.height * 0.52;
        const lookSensitivity = 1.1 + this.currentDepth * 1.4;

        this.camera.rotY +=
            ((this.pointer.x - 0.5) * lookSensitivity - this.camera.rotY) * 0.028;
        this.camera.rotX +=
            ((this.pointer.y - 0.5) * lookSensitivity * 0.45 + 0.14 - this.camera.rotX) * 0.028;

        const autoRotation = time * (0.08 * (1 - this.currentDepth * 0.55));

        this.drawGlowClouds(time, autoRotation, centerX, centerY);

        const projected = [];

        this.nebula.forEach((particle) => {
            const ease = this.morphProgress * this.morphProgress * (3 - 2 * this.morphProgress);
            particle.x += (particle.tx - particle.x) * ease * 0.06;
            particle.y += (particle.ty - particle.y) * ease * 0.06;
            particle.z += (particle.tz - particle.z) * ease * 0.06;
            particle.size += (particle.targetSize - particle.size) * ease * 0.06;
            particle.opacity += (particle.targetOpacity - particle.opacity) * ease * 0.06;

            const wobbleX =
                Math.sin(time * particle.wobbleSpeed + particle.wobbleOffset) * particle.wobbleAmp;
            const wobbleY =
                Math.cos(time * particle.wobbleSpeed * 0.7 + particle.wobbleOffset) *
                particle.wobbleAmp *
                0.52;
            const wobbleZ =
                Math.sin(time * particle.wobbleSpeed * 0.45 + particle.wobbleOffset + 1.4) *
                particle.wobbleAmp *
                0.82;

            let point = this.rotateY(
                particle.x + wobbleX,
                particle.y + wobbleY,
                particle.z + wobbleZ,
                autoRotation + this.camera.rotY + particle.rotSpeed * time * 0.1
            );
            point = this.rotateX(point.x, point.y, point.z, this.camera.rotX);

            const projection = this.project3D(point.x, point.y, point.z, centerX, centerY);

            if (projection.scale <= 0.045) {
                return;
            }

            const pulse =
                0.72 + 0.28 * Math.sin(time * particle.pulseSpeed + particle.pulseOffset);

            projected.push({
                sx: projection.sx,
                sy: projection.sy,
                scale: projection.scale,
                z: point.z,
                size: particle.size,
                opacity: particle.opacity * pulse,
                hueShift: particle.hueShift,
                saturation: particle.saturation,
                lightness: particle.lightness
            });
        });

        projected.sort((a, b) => b.z - a.z);

        projected.forEach((point) => {
            const screenSize = point.size * point.scale;
            const hue = this.currentHue + point.hueShift;
            const alpha = point.opacity * Math.min(1, point.scale * 1.5);

            if (alpha < 0.008) {
                return;
            }

            if (screenSize > 2.4) {
                const glow = ctx.createRadialGradient(
                    point.sx,
                    point.sy,
                    0,
                    point.sx,
                    point.sy,
                    screenSize * 2.8
                );
                glow.addColorStop(
                    0,
                    `hsla(${hue}, ${point.saturation}%, ${point.lightness + 22}%, ${alpha * 0.86})`
                );
                glow.addColorStop(
                    0.34,
                    `hsla(${hue + 16}, ${point.saturation - 12}%, ${point.lightness}%, ${
                        alpha * 0.34
                    })`
                );
                glow.addColorStop(1, "transparent");
                ctx.fillStyle = glow;
                ctx.fillRect(
                    point.sx - screenSize * 2.8,
                    point.sy - screenSize * 2.8,
                    screenSize * 5.6,
                    screenSize * 5.6
                );
            }

            ctx.beginPath();
            ctx.arc(point.sx, point.sy, Math.max(0.28, screenSize * 0.52), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue + 22}, ${point.saturation + 14}%, ${Math.min(
                96,
                point.lightness + 34
            )}%, ${Math.min(1, alpha * 1.75)})`;
            ctx.fill();
        });
    }

    drawGlowClouds(time, autoRotation, centerX, centerY) {
        const ctx = this.ctx;

        this.glowClouds.forEach((cloud, index) => {
            const ease = this.morphProgress * this.morphProgress * (3 - 2 * this.morphProgress);
            cloud.x += (cloud.tx - cloud.x) * ease * 0.055;
            cloud.y += (cloud.ty - cloud.y) * ease * 0.055;
            cloud.z += (cloud.tz - cloud.z) * ease * 0.055;
            cloud.size += (cloud.targetSize - cloud.size) * ease * 0.055;
            cloud.opacity += (cloud.targetOpacity - cloud.opacity) * ease * 0.055;

            let point = this.rotateY(
                cloud.x,
                cloud.y,
                cloud.z,
                autoRotation + this.camera.rotY + cloud.rotSpeed * time
            );
            point = this.rotateX(point.x, point.y, point.z, this.camera.rotX);

            const projection = this.project3D(point.x, point.y, point.z, centerX, centerY);

            if (projection.scale <= 0.04) {
                return;
            }

            const size = cloud.size * projection.scale;
            const hue = this.currentHue + cloud.hueShift;
            const alpha =
                cloud.opacity * projection.scale * (0.72 + 0.28 * Math.sin(time * 0.45 + index));
            const gradient = ctx.createRadialGradient(
                projection.sx,
                projection.sy,
                0,
                projection.sx,
                projection.sy,
                size
            );

            gradient.addColorStop(0, `hsla(${hue}, 68%, 56%, ${alpha})`);
            gradient.addColorStop(0.45, `hsla(${hue + 18}, 54%, 42%, ${alpha * 0.45})`);
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fillRect(projection.sx - size, projection.sy - size, size * 2, size * 2);
        });
    }

    drawSparks(time) {
        const ctx = this.ctx;
        const centerX = this.width * 0.5;
        const centerY = this.height * 0.52;
        const autoRotation = time * (0.08 * (1 - this.currentDepth * 0.55));

        for (let index = this.sparks.length - 1; index >= 0; index -= 1) {
            const spark = this.sparks[index];

            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.z += spark.vz;
            spark.vx *= 0.97;
            spark.vy *= 0.97;
            spark.vz *= 0.97;
            spark.life -= spark.decay;
            spark.trail.push({ x: spark.x, y: spark.y, z: spark.z });

            if (spark.trail.length > 6) {
                spark.trail.shift();
            }

            if (spark.life <= 0) {
                this.sparks.splice(index, 1);
                continue;
            }

            let point = this.rotateY(
                spark.x,
                spark.y,
                spark.z,
                autoRotation + this.camera.rotY
            );
            point = this.rotateX(point.x, point.y, point.z, this.camera.rotX);

            const projection = this.project3D(point.x, point.y, point.z, centerX, centerY);

            if (projection.scale <= 0.045) {
                continue;
            }

            const hue = this.currentHue + spark.hueShift + 34;
            const alpha = spark.life * spark.life;
            const size = spark.size * projection.scale * spark.life;
            const glow = ctx.createRadialGradient(
                projection.sx,
                projection.sy,
                0,
                projection.sx,
                projection.sy,
                size * 4
            );

            glow.addColorStop(0, `hsla(${hue}, 86%, 88%, ${alpha * 0.56})`);
            glow.addColorStop(0.35, `hsla(${hue + 10}, 74%, 70%, ${alpha * 0.2})`);
            glow.addColorStop(1, "transparent");
            ctx.fillStyle = glow;
            ctx.fillRect(
                projection.sx - size * 4,
                projection.sy - size * 4,
                size * 8,
                size * 8
            );

            ctx.beginPath();
            ctx.arc(projection.sx, projection.sy, Math.max(0.38, size * 0.62), 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue + 30}, 94%, 96%, ${alpha})`;
            ctx.fill();

            if (spark.trail.length > 1) {
                ctx.beginPath();

                spark.trail.forEach((trailPoint, trailIndex) => {
                    let rotated = this.rotateY(
                        trailPoint.x,
                        trailPoint.y,
                        trailPoint.z,
                        autoRotation + this.camera.rotY
                    );
                    rotated = this.rotateX(rotated.x, rotated.y, rotated.z, this.camera.rotX);
                    const trailProjection = this.project3D(
                        rotated.x,
                        rotated.y,
                        rotated.z,
                        centerX,
                        centerY
                    );

                    if (trailIndex === 0) {
                        ctx.moveTo(trailProjection.sx, trailProjection.sy);
                    } else {
                        ctx.lineTo(trailProjection.sx, trailProjection.sy);
                    }
                });

                ctx.strokeStyle = `hsla(${hue}, 76%, 82%, ${alpha * 0.26})`;
                ctx.lineWidth = size * 0.4;
                ctx.stroke();
            }
        }
    }

    project3D(x, y, z, centerX, centerY) {
        const perspective = Math.max(56, this.focalLength + z);
        const scale = this.focalLength / perspective;

        return {
            sx: centerX + x * scale,
            sy: centerY + y * scale,
            scale
        };
    }

    rotateY(x, y, z, angle) {
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);

        return {
            x: x * cosine - z * sine,
            y,
            z: x * sine + z * cosine
        };
    }

    rotateX(x, y, z, angle) {
        const cosine = Math.cos(angle);
        const sine = Math.sin(angle);

        return {
            x,
            y: y * cosine - z * sine,
            z: y * sine + z * cosine
        };
    }
}

if (ambientCanvas) {
    const background = new AmbientBackground(
        ambientCanvas,
        messageSections,
        prefersReducedMotion.matches
    );
    background.start();
}

const bootLoader = bootScreenElement
    ? new BootLoader(
          bootScreenElement,
          bootCopyElement,
          bootStampElement,
          bootSteps,
          ambientCanvas,
          prefersReducedMotion.matches
      )
    : null;

class AssistantBot {
    constructor(bot, pupils, bubble, messageNode, sections, reducedMotion) {
        this.bot = bot;
        this.pupils = pupils;
        this.bubble = bubble;
        this.messageNode = messageNode;
        this.sections = sections;
        this.reducedMotion = reducedMotion;
        this.widget = bot.closest("[data-assistant-widget]");
        this.stage = bot.closest("[data-assistant-stage]");
        this.mouth = bot.querySelector("[data-assistant-mouth]");
        this.mouthShadow = bot.querySelector("[data-assistant-mouth-shadow]");
        this.compactQuery = window.matchMedia("(max-width: 760px)");
        this.sectionStates = {
            overview: "greet",
            expertise: "focus",
            workflow: "explain",
            builds: "build",
            experience: "steady",
            toolkit: "scan",
            contact: "cta",
        };
        this.expressions = {
            greet: {
                mouth: "M102 99C106 103.5 115 103.5 118 99",
                shadow: "M100 98C105 103.2 116 103.2 120 98",
                mouthTransform: "translateY(-0.25px) scaleY(1.04)",
                shadowTransform: "translateY(-0.2px) scaleY(1.02)",
            },
            focus: {
                mouth: "M103 99.5C107 101.2 113 101.2 117 99.5",
                shadow: "M101 99C106 101.2 114 101.2 119 99",
                mouthTransform: "translateY(0.45px) scaleY(0.84)",
                shadowTransform: "translateY(0.4px) scaleY(0.82)",
            },
            explain: {
                mouth: "M102 99C106 101.8 114 101.8 118 99",
                shadow: "M100 98.2C105 101.8 115 101.8 120 98.2",
                mouthTransform: "translateY(0.05px) scaleY(1)",
                shadowTransform: "translateY(0.1px) scaleY(1)",
            },
            build: {
                mouth: "M102 98.5C107 104 114 104 118 98.5",
                shadow: "M100 97.8C106 103.7 116 103.7 120 97.8",
                mouthTransform: "translateY(-0.35px) scaleY(1.12)",
                shadowTransform: "translateY(-0.3px) scaleY(1.08)",
            },
            steady: {
                mouth: "M103 99C106 102 114 102 117 99",
                shadow: "M101 98.2C105 102.6 115 102.6 119 98.2",
                mouthTransform: "translateY(0.15px)",
                shadowTransform: "translateY(0.1px)",
            },
            scan: {
                mouth: "M102 100.5C107 98.8 113 98.8 118 100.5",
                shadow: "M100 100C106 98.2 114 98.2 120 100",
                mouthTransform: "translateY(0.2px) scaleY(0.9)",
                shadowTransform: "translateY(0.15px) scaleY(0.88)",
            },
            cta: {
                mouth: "M102 98.8C107 103.2 114 103.2 118 98.8",
                shadow: "M100 98.1C105.5 103 115.5 103 120 98.1",
                mouthTransform: "translateY(-0.22px) scaleY(1.06)",
                shadowTransform: "translateY(-0.15px) scaleY(1.04)",
            },
        };
        this.messageSets = {
            overview: [
                "Tracking security, stability, and production signal from one deck.",
                "This robot mirrors the site: calm, technical, and a little alive.",
                "Start with the builds if you want the fastest proof of work."
            ],
            expertise: [
                "This is the operational core: visibility, edge controls, and troubleshooting.",
                "The strongest part of the stack is where investigations meet infrastructure.",
                "These lanes are less about buzzwords and more about daily production work."
            ],
            workflow: [
                "Good workflows turn noisy systems into clear next actions.",
                "Collect. Validate. Stabilize. Package. That loop matters more than tools alone.",
                "The process here is meant to feel steady under production pressure."
            ],
            builds: [
                "These projects are operator-first builds, not just concepts.",
                "The goal in both repos is guided workflow, evidence, and usable output.",
                "Open a repo and you'll see the same structure-first thinking as the site."
            ],
            experience: [
                "This section is the production context behind the tooling work.",
                "Real environments shape the instincts behind good incident handling.",
                "Security is stronger when troubleshooting stays calm and service-aware."
            ],
            toolkit: [
                "The toolkit is broad because most incidents cross layers.",
                "This stack is less about collecting logos and more about practical coverage.",
                "Different systems, one steady operating model."
            ],
            contact: [
                "If you need ops-minded security help, this is the right place to reach out.",
                "Happy to connect about investigations, infrastructure-facing security, or tooling.",
                "Thanks for visiting the command deck."
            ],
            fallback: [
                "Stay curious.",
                "Keep exploring.",
                "Steady systems come from steady thinking."
            ]
        };
        this.messageIndexes = new Map();
        this.currentSection = "overview";
        this.currentState = "greet";
        this.isCompact = false;
        this.isExpanded = true;
        this.visibleSections = new Map();
        this.messageTimer = null;
        this.swapTimer = null;
        this.autoCollapseTimer = null;
        this.sectionObserver = null;
        this.pointer = { x: window.innerWidth * 0.7, y: window.innerHeight * 0.65 };
        this.viewBox = { width: 220, height: 220 };
        this.motionOffsets = {
            headX: 0,
            headY: 0,
            faceX: 0,
            faceY: 0,
        };
        this.eyeCenters = {
            left: { x: 95, y: 80 },
            right: { x: 123, y: 80 },
        };
        this.maxOffset = 4.1;
        this.onStageActivate = this.onStageActivate.bind(this);
        this.onStageKeyDown = this.onStageKeyDown.bind(this);
        this.onCompactModeChange = this.onCompactModeChange.bind(this);
        this.onPointerMove = this.onPointerMove.bind(this);
        this.resetEyes = this.resetEyes.bind(this);
        this.onSectionIntersect = this.onSectionIntersect.bind(this);
    }

    start() {
        if (!this.bot) {
            return;
        }

        this.applyState(this.getStateForSection(this.currentSection));
        this.syncCompactMode({ initial: true });

        if (this.messageNode) {
            this.messageNode.textContent = this.getNextMessage(this.currentSection);
        }

        if (this.bubble) {
            window.setTimeout(() => {
                this.bubble.classList.add("is-visible");
            }, 420);
            this.startMessageLoop();
        }

        if (this.stage) {
            this.stage.addEventListener("click", this.onStageActivate);
            this.stage.addEventListener("keydown", this.onStageKeyDown);
        }

        if (typeof this.compactQuery.addEventListener === "function") {
            this.compactQuery.addEventListener("change", this.onCompactModeChange);
        } else if (typeof this.compactQuery.addListener === "function") {
            this.compactQuery.addListener(this.onCompactModeChange);
        }

        this.setupSectionTracking();

        this.updateEyes();
        window.addEventListener("pointermove", this.onPointerMove, { passive: true });
        window.addEventListener("blur", this.resetEyes);
        document.addEventListener("mouseleave", this.resetEyes);
    }

    getStateForSection(sectionId) {
        return this.sectionStates[sectionId] || "steady";
    }

    applyState(state) {
        const nextState = state || "steady";
        this.currentState = nextState;
        this.bot.dataset.state = nextState;

        if (this.stage) {
            this.stage.dataset.state = nextState;
        }

        if (this.widget) {
            this.widget.dataset.state = nextState;
        }

        this.updateExpression(nextState);
    }

    updateExpression(state) {
        const expression = this.expressions[state] || this.expressions.steady;

        if (this.mouth) {
            this.mouth.setAttribute("d", expression.mouth);
            this.mouth.style.transform = expression.mouthTransform || "";
        }

        if (this.mouthShadow) {
            this.mouthShadow.setAttribute("d", expression.shadow);
            this.mouthShadow.style.transform = expression.shadowTransform || "";
        }
    }

    syncCompactMode({ initial = false } = {}) {
        this.isCompact = this.compactQuery.matches;

        if (this.widget) {
            this.widget.dataset.compact = this.isCompact ? "true" : "false";
        }

        if (this.isCompact) {
            if (initial) {
                this.setExpanded(true);
                this.scheduleAutoCollapse(4600);
            } else {
                this.setExpanded(false, { scheduleCollapse: false });
            }
        } else {
            this.setExpanded(true, { scheduleCollapse: false });
        }
    }

    setExpanded(expanded, { scheduleCollapse = true } = {}) {
        this.isExpanded = expanded;
        window.clearTimeout(this.autoCollapseTimer);

        if (this.widget) {
            this.widget.dataset.expanded = expanded ? "true" : "false";
        }

        if (this.stage) {
            this.stage.setAttribute("aria-expanded", String(expanded));
        }

        if (expanded && scheduleCollapse && this.isCompact) {
            this.scheduleAutoCollapse();
        }
    }

    scheduleAutoCollapse(delay = 4200) {
        window.clearTimeout(this.autoCollapseTimer);

        if (!this.isCompact) {
            return;
        }

        this.autoCollapseTimer = window.setTimeout(() => {
            this.setExpanded(false, { scheduleCollapse: false });
        }, delay);
    }

    startMessageLoop() {
        if (!this.bubble || !this.messageNode) {
            return;
        }

        const runSwap = (delay) => {
            this.messageTimer = window.setTimeout(() => {
                this.swapMessage(this.getNextMessage());
                runSwap(5000);
            }, delay);
        };

        runSwap(4200);
    }

    setupSectionTracking() {
        if (this.sections.length === 0 || !("IntersectionObserver" in window)) {
            return;
        }

        this.sectionObserver = new IntersectionObserver(this.onSectionIntersect, {
            threshold: [0.25, 0.45, 0.7],
            rootMargin: "-12% 0px -40% 0px"
        });

        this.sections.forEach((section) => this.sectionObserver.observe(section));
    }

    onSectionIntersect(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                this.visibleSections.set(entry.target.id, entry.intersectionRatio);
            } else {
                this.visibleSections.delete(entry.target.id);
            }
        });

        let nextSection = this.currentSection;
        let bestRatio = -1;

        this.visibleSections.forEach((ratio, id) => {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                nextSection = id;
            }
        });

        if (nextSection === this.currentSection) {
            return;
        }

        this.currentSection = nextSection;
        this.applyState(this.getStateForSection(nextSection));

        if (this.messageNode && this.bubble) {
            this.swapMessage(this.getNextMessage(nextSection));
        }

    }

    getNextMessage(sectionId = this.currentSection) {
        const set = this.messageSets[sectionId] || this.messageSets.fallback;
        const currentIndex = this.messageIndexes.get(sectionId) ?? -1;
        const nextIndex = (currentIndex + 1) % set.length;
        this.messageIndexes.set(sectionId, nextIndex);
        return set[nextIndex];
    }

    swapMessage(nextMessage) {
        if (!this.bubble || !this.messageNode) {
            return;
        }

        this.bubble.classList.add("is-swapping");
        window.clearTimeout(this.swapTimer);

        this.swapTimer = window.setTimeout(() => {
            this.messageNode.textContent = nextMessage;
            this.bubble.classList.remove("is-swapping");
        }, 220);
    }

    onStageActivate() {
        if (this.isCompact) {
            const shouldExpand = !this.isExpanded;

            if (shouldExpand && this.messageNode) {
                this.swapMessage(this.getNextMessage(this.currentSection));
            }

            this.setExpanded(shouldExpand);
        } else if (this.messageNode) {
            this.swapMessage(this.getNextMessage(this.currentSection));
        }

    }

    onStageKeyDown(event) {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        this.onStageActivate();
    }

    onCompactModeChange() {
        this.syncCompactMode();
    }

    onPointerMove(event) {
        this.pointer.x = event.clientX;
        this.pointer.y = event.clientY;
        this.bot.dataset.looking = "active";
        if (this.stage) {
            this.stage.dataset.looking = "active";
        }
        this.updateEyes();
    }

    resetEyes() {
        this.pointer.x = window.innerWidth * 0.7;
        this.pointer.y = window.innerHeight * 0.65;
        delete this.bot.dataset.looking;
        if (this.stage) {
            delete this.stage.dataset.looking;
        }
        this.updateEyes();
    }

    updateMotion(bounds) {
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height * 0.58;
        const normalizedX = Math.max(
            -1,
            Math.min(1, (this.pointer.x - centerX) / Math.max(window.innerWidth * 0.32, 1))
        );
        const normalizedY = Math.max(
            -1,
            Math.min(1, (this.pointer.y - centerY) / Math.max(window.innerHeight * 0.28, 1))
        );
        const tiltScale = this.reducedMotion ? 0.45 : 1;
        const shiftScale = this.reducedMotion ? 0.5 : 1;

        this.bot.style.setProperty(
            "--assistant-tilt-x",
            `${(-normalizedY * 5.8 * tiltScale).toFixed(2)}deg`
        );
        this.bot.style.setProperty(
            "--assistant-tilt-y",
            `${(normalizedX * 7.2 * tiltScale).toFixed(2)}deg`
        );
        this.bot.style.setProperty(
            "--assistant-shift-x",
            `${(normalizedX * 7 * shiftScale).toFixed(2)}px`
        );
        this.bot.style.setProperty(
            "--assistant-shift-y",
            `${(normalizedY * 5 * shiftScale).toFixed(2)}px`
        );

        const headX = normalizedX * 2.4 * shiftScale;
        const headY = normalizedY * 1.8 * shiftScale;
        const faceX = normalizedX * 3.6 * shiftScale;
        const faceY = normalizedY * 2.7 * shiftScale;
        const bodyY = normalizedY * 1.4 * shiftScale;

        this.motionOffsets.headX = headX;
        this.motionOffsets.headY = headY;
        this.motionOffsets.faceX = faceX;
        this.motionOffsets.faceY = faceY;

        this.bot.style.setProperty("--assistant-head-x", `${headX.toFixed(2)}px`);
        this.bot.style.setProperty("--assistant-head-y", `${headY.toFixed(2)}px`);
        this.bot.style.setProperty("--assistant-face-x", `${faceX.toFixed(2)}px`);
        this.bot.style.setProperty("--assistant-face-y", `${faceY.toFixed(2)}px`);
        this.bot.style.setProperty("--assistant-body-y", `${bodyY.toFixed(2)}px`);

        if (this.stage) {
            this.stage.style.setProperty(
                "--assistant-stage-x",
                `${(normalizedX * 10 * shiftScale).toFixed(2)}px`
            );
            this.stage.style.setProperty(
                "--assistant-stage-y",
                `${(normalizedY * 8 * shiftScale).toFixed(2)}px`
            );
        }
    }

    updateEyes() {
        const bounds = this.bot.getBoundingClientRect();

        this.updateMotion(bounds);

        this.pupils.forEach((pupil) => {
            const side = pupil.dataset.pupil;
            const eye = this.eyeCenters[side];

            if (!eye) {
                return;
            }

            const eyeX =
                bounds.left +
                (eye.x / this.viewBox.width) * bounds.width +
                this.motionOffsets.headX +
                this.motionOffsets.faceX;
            const eyeY =
                bounds.top +
                (eye.y / this.viewBox.height) * bounds.height +
                this.motionOffsets.headY +
                this.motionOffsets.faceY;
            const dx = this.pointer.x - eyeX;
            const dy = this.pointer.y - eyeY;
            const distance = Math.hypot(dx, dy) || 1;
            const force = this.reducedMotion ? this.maxOffset * 0.45 : this.maxOffset;
            const offset = Math.min(force, distance / 32);
            const translateX = (dx / distance) * offset;
            const translateY = (dy / distance) * offset;

            pupil.setAttribute("transform", `translate(${translateX.toFixed(2)} ${translateY.toFixed(2)})`);
        });
    }
}

if (assistantBotElement) {
    const assistantBot = new AssistantBot(
        assistantBotElement,
        assistantPupils,
        assistantBubble,
        assistantMessage,
        messageSections,
        prefersReducedMotion.matches
    );
    assistantBot.start();
}

if (bootLoader) {
    bootLoader.start();
}
