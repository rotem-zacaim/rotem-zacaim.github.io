export const MAYA_RIVE_CONFIG = {
    src: "assets/rive/maya-orb.riv",
    artboard: "Artboard",
    stateMachine: "State Machine 1",
    inputs: [],
    animations: {
        idle: "Idle",
        listening: "Typing",
        responding: "Typing",
        success: "Correct",
        error: "Wrong",
        hover: "Jump",
        opening: "Reveal",
        thinking: "Lading",
    },
};

const RIVE_RUNTIME_TIMEOUT_MS = 5000;

function prefersReducedMotion() {
    return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitForRiveRuntime() {
    return new Promise((resolve, reject) => {
        const startedAt = Date.now();

        function checkRuntime() {
            if (window.rive?.Rive && window.rive?.RuntimeLoader) {
                window.rive.RuntimeLoader.setWasmUrl("assets/vendor/rive/rive.wasm");
                window.rive.RuntimeLoader.setWasmFallbackUrl("assets/vendor/rive/rive_fallback.wasm");
                resolve(window.rive);
                return;
            }

            if (Date.now() - startedAt > RIVE_RUNTIME_TIMEOUT_MS) {
                reject(new Error("Rive runtime did not load in time."));
                return;
            }

            window.setTimeout(checkRuntime, 40);
        }

        checkRuntime();
    });
}

export class MayaOrb {
    constructor(canvas, { onLoad = () => {}, onError = () => {} } = {}) {
        this.canvas = canvas;
        this.onLoad = onLoad;
        this.onError = onError;
        this.riveInstance = null;
        this.currentState = "idle";
        this.isLoaded = false;
        this.isReducedMotion = prefersReducedMotion();
    }

    async init() {
        if (!this.canvas || this.isReducedMotion) {
            this.canvas?.setAttribute("data-rive-reduced-motion", "true");
            this.onLoad();
            return;
        }

        try {
            const runtime = await waitForRiveRuntime();

            this.riveInstance = new runtime.Rive({
                src: MAYA_RIVE_CONFIG.src,
                canvas: this.canvas,
                artboard: MAYA_RIVE_CONFIG.artboard,
                animations: MAYA_RIVE_CONFIG.animations.idle,
                autoplay: true,
                onLoad: () => {
                    this.isLoaded = true;
                    this.riveInstance.resizeDrawingSurfaceToCanvas?.();
                    this.onLoad();
                },
                onLoadError: (error) => {
                    this.canvas.setAttribute("data-rive-error", "true");
                    this.onError(error);
                },
            });
        } catch (error) {
            this.canvas.setAttribute("data-rive-error", "true");
            this.onError(error);
        }
    }

    setState(nextState) {
        const animationName = MAYA_RIVE_CONFIG.animations[nextState] || MAYA_RIVE_CONFIG.animations.idle;

        this.currentState = nextState;
        this.canvas?.parentElement?.setAttribute("data-orb-state", nextState);

        if (!this.riveInstance || this.isReducedMotion) return;

        try {
            this.riveInstance.stop();
            this.riveInstance.reset({
                artboard: MAYA_RIVE_CONFIG.artboard,
                animations: animationName,
                autoplay: true,
            });
            this.riveInstance.play(animationName, true);
        } catch (error) {
            this.canvas.setAttribute("data-rive-error", "true");
            this.onError(error);
        }
    }

    cleanup() {
        this.riveInstance?.cleanup?.();
        this.riveInstance = null;
    }
}

export function createMayaOrb(canvas, options) {
    const orb = new MayaOrb(canvas, options);
    orb.init();
    return orb;
}
