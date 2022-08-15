# Smooth-Dragon

WebGL project using ThreeJS, HTML5 and OOJS (object oriented javasctipt) for exploring several computer-graphics techniques:

* Mesh creation
* Texture UVs mapping in complex object
* Lighting and shadows
* Bump mapping
* Surface smoothing by using vertex normals
* User Interface (widgets)

This WebGL app can be visualized in github pages because is a "front-end" only (all models have been converted to data structures and stored in JS files for fast loading).

## Geometry Creation

## Texture UVs mapping, 

## Lighting and Shadows

## Bump Mapping

## Surface Smoothing

## User Interface (widgets) 

---

## LIBGPT

We created a library to act as wrapper: Graphical Programming with Threejs (libgpt).

It contains several objects (classes) for wrapping all the logic required for creating an scene with threejs.

This allows modularity and we can reuse code creating instances of those clases.

* `GPT_Model`
    * mesh + geometry + material
    * It contains methods for configuring the models with their corresponding group-node (joints), textures, initial position, etc.
* `GPT_Scene`
    * List of `GPT_Model`s and `GPT_Light`
    * It contains abstract methods for initial configuration and updates in every frame
        * These methods have to be overriden when creating the instance of the `GPT_Scene`
* `GPT_Render`
    * It initializes the camera and camera-handler
    * This is the main object that creates a `webgl-renderer` and invokes methods of `GPT_Scene`
* `GPT_App`
    * Top-level object that configures the `window` and uses `GPT_Render`
    * It contains the main loop for animation in which the `update` and `render` are being invoked

## Objects and scripts

* `main.js`
    * It is the entry point. It checks webgl compatibility and instanciates `GPT_Renderer`, `GPT_App`, and `SceneDragon`
    * Then invokes init and run loop
* `Common.js`
    * Contains all constants to be re-used in several points in the code
* `CoordsDragon.js`
    * Contains methods for computing normals from vertices and edges
    * Stores arrays of dragon model for vertices and edgess
* `ModelDragon.js`
    * Inherits from `GPT_Model` and overrides `get_geometry` and `get_material` methods
    * Creates and initializes `geometry` and `material` objects to be inserted into a `mesh`
    * Computes `UV` coordinates per face (triangle) in order to simulate reflections of the skybox onto the dragon surface
* `ModelSkybox.js`
    * Creates a big cube and maps the texture to simulate environment
    * This skybox images will be reflected on the dragon surface
* `SceneDragon.js`
    * Inherits from `GPT_Scene` and overrides `createObjects`, `createLights`, `updateObjects` and `updateLights` methods
    * Performs all setting of models and lights: floor, dragon, skybox, etc.
    * Performs periodic updates of models and lights: translate, rotate, etc.

## Compiling smooth-dragon project

* The project has been updated to be a NodeJS package
    * In that way we can use threejs as package (from npm) and use it as module in our application
* We are also using webpack for building an optimized website (javascript code compression)


### Compile instructions:

```bash
git clone https://github.com/GiovannyJTT/Smooth-Dragon.git
cd Smooth-Dragon
npm install     # install all nodejs packages needed for this project (in node_modules/ folder)
npm run dev     # compile and run a development version
npm run build   # build an optimized website (html + javscript + images) in dist/ folder
```

---

## Building Threejs.min manually

For reducing the transmision of data when loading our webgl app in the client web browser we can build a minified version of ThreeJS. This will compress and unify all the ThreeJS scripts in one.

* Tutorial for building Threejs.min using google closure compiler: [Link](https://github.com/mrdoob/three.js/wiki/Build-instructions)

* Using an online (unofficial) builder: [Link](http://marcinwieprzkowicz.github.io/three.js-builder/)

Summary (building Threejs.min using google closure compiler):

```bash
git clone --depth=30 https://github.com/mrdoob/three.js.git
cd ./three.js
npm install  # This will install google closure compiler dependencies (Youy need to install NodeJS for npm)
npm run build-closure
# "created build/three.module.js in 2.3s"

:"
ls -lh build/
total 3,0M
-rw-r--r-- 1 Gio 197121 1,2M jul.  8 16:01 three.js
-rw-r--r-- 1 Gio 197121 614K jul.  8 16:01 three.min.js
-rw-r--r-- 1 Gio 197121 1,2M jul.  8 16:01 three.module.js
"
```
