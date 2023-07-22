/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class GPT_App
 * @summary
 *      Groups all high level functionalities of the application: init, run, pause
 */

/**
 * Importing object THREE from our costumized global script
 */
import THREE from './external-libs/three-global'
import GPT_Renderer from './GPT_Renderer'

/**
 * Creates Our app object. The app will finish when "done = true", and the animation will stop while "paused = true" (that means
 * all the transformations are ignored until "paused = false")
 * It is important to pass the gpt_r GPT_Renderer object. It will be used in the animation loop
 * @param {GPT_Renderer} gpt_r
 */
function GPT_App(gpt_r) {
    this.done = false;
    this.paused = false;
    this.currentFrameNumber = 0;

    this.lastTS = undefined;  // used with frame period commonly 16 ms
    this.frameElapsedMS = 0;
    this.requestAF = undefined;

    this.lastPeriodTS = undefined;  // used with long period commonly 2000 ms
    this.MAX_PERIOD_MS = 5000;

    this.gpt_render = gpt_r;
    if (this.gpt_render === undefined) {
        console.error("GPT_Renderer is undefined. You must pass one valid")
    }
}

/**
 * Calls all setup methods for generating geometry (loading models and textures) and attaches events for resizing the window.
 * Using arrow function because it does not have it's own "this" value. It's "this" is lexically bound to the enclosing scope.
 */
GPT_App.prototype.init = function (_container_name) {
    console.debug("GPT_App.init")

    this.gpt_render.setup(_container_name);
    window.addEventListener("resize", () => { this.gpt_render.reshape(); });
}

/**
 * Performs all the steps needed for drawing a frame (animate and render). Continously running until "done = true". When "paused = true" models won't be animated (transformed)
 * Using arrow function because it does not have it's own "this" value. It's "this" is lexically bound to the enclosing scope.
 * @param {Number} timestamp DOMHighResTimeStamp which indicates the current time (based on the number of milliseconds since time origin)
 */
GPT_App.prototype.drawFrame = function (timestamp) {
    let nowTS = timestamp;
    if (!this.paused) {
        this.frameElapsedMS = nowTS - this.lastTS;

        // 1. update (transform, translate) models
        this.gpt_render.update(this.frameElapsedMS);
    }
    this.lastTS = nowTS;

    // 2. render scene into a webGL frame
    this.gpt_render.renderFrame();
    this.currentFrameNumber++;

    // Trigger actions periodically (with periods higher than 1 second)
    let periodElapsedMS = nowTS - this.lastPeriodTS;
    if (periodElapsedMS > this.MAX_PERIOD_MS) {
        this.lastPeriodTS = nowTS;
        console.log("GPT_App: Rendered Frames: " + this.currentFrameNumber + " TS: " + timestamp);
    }

    if (!this.done) {
        // 3. Trigger callback for next frame as fast as webbrowser allows (commonly 16 ms)
        this.requestAF = window.requestAnimationFrame((ts) => { this.drawFrame(ts); });
    }
    else {
        window.cancelAnimationFrame(this.requestAF)
        console.log("GPT_App: uninstalled animation frame callback")
    }
}

/**
 * Initialization and First call to the main loop "drawFrame"
 */
GPT_App.prototype.run = function () {
    console.debug("GPT_APP.run")

    this.currentFrameNumber = 0;
    this.lastTS = performance.now();
    this.frameElapsedMS = 0;

    this.lastPeriodTS = performance.now();

    // trigger the first periodic call
    this.drawFrame(performance.now());
}

export default GPT_App;