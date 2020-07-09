/**
 * Library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content: class GPT_App
 * Groups all high level functionalities of the application: init, run, pause
 */


 /**
  * Creates Our app object. The app will finish when "done = true", and the animation will stop while "paused = true" (that means
  * all the transformations are ignored until "paused = false")
  * It is important to pass the gpt_r GPT_Renderer object. It will be used in the animation loop
  * @param {GPT_Renderer} gpt_r
  */
function GPT_App(gpt_r)
{
    this.done = false;
    this.paused = false;
    this.currentFrameNumber = 0;

    this.lastTS = undefined;
    this.elapsedMS = 0;
    this.requestAF = undefined;

    this.gpt_render = gpt_r;
    if(this.gpt_render === undefined)
    {
        console.error("GPT_Renderer is undefined. You must pass one valid")
    }
}

/**
 * Calls all setup methods for generating geometry (loading models and textures) and attaches events for resizing the window.
 * Using arrow function because it does not have it's own "this" value. It's "this" is lexically bound to the enclosing scope.
 */
GPT_App.prototype.init = function()
{
    this.gpt_render.setup("container");
    window.addEventListener("resize", () => { this.gpt_render.reshape(); } );
}

/**
 * Performs all the steps needed for drawing a frame (animate and render). Continously running until "done = true". When "paused = true" models won't be animated (transformed)
 * Using arrow function because it does not have it's own "this" value. It's "this" is lexically bound to the enclosing scope.
 * @param {Number} timestamp DOMHighResTimeStamp which indicates the current time (based on the number of milliseconds since time origin)
 */
GPT_App.prototype.drawFrame = function(timestamp)
{
    let nowTS = performance.now();
    if(!this.paused)
    {
        this.elapsedMS = nowTS - this.lastTS;
        this.gpt_render.update(this.elapsedMS);
    }
    this.lastTS = nowTS;

    this.gpt_render.render();
    this.currentFrameNumber++;

    if(!this.done)
    {
        this.requestAF = window.requestAnimationFrame( (ts) => { this.drawFrame(ts); } );
    }
    else
    {
        window.cancelAnimationFrame(this.requestAF)
        console.log("Cancelling Animation Frame")
    }
}

/**
 * Initialization and First call to the main loop "drawFrame"
 */
GPT_App.prototype.run = function()
{
    this.currentFrameNumber = 0;
    this.lastTS = performance.now();
    this.elapsedMS = 0;

    this.drawFrame(performance.now());
}