/**
 * Description: WebGL app using ThreeJS, Html5 and OOJS for exploring surface smoothing technique
 * Using library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 */


var sce = new GPT_Scene();
sce.createObjects = function()
{
    console.log("Implementing: setup dragonModel.js here!")
}

sce.updateObjects = function(ms)
{
    console.log("Implementing: update dragon here! (elapsed " + ms + " ms)")
}

var ren = new GPT_Renderer(window.innerWidth, window.innerHeight, sce);
var app = new GPT_App(ren);

app.init();
app.run();
