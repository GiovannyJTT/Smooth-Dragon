# Smooth-Dragon

WebGL project using ThreeJS, HTML5 and OOJS (object oriented javasctipt) for exploring several computer-graphics techniques:

* Mesh creation
* Texture UVs mapping in complex object
* Lighting and shadows
* Bump mapping
* Surface smoothing by using vertex normals
* User Interface (widgets, buttons)
* Finite State Machine to handle "shooting robot"
* Collision detection using AABB

This WebGL app can be visualized in github pages because is a "front-end" only (all models have been converted to data structures and stored in JS files for fast loading).

---

## LIBGPT

* [three-global.js](./src/external-libs/threejs-0.118.3/three-global.js)
    * It is used to create a global object `THREE` and add functionalities to it
        1. Imports `three.js` library as module from npm
        2. Names it `THREE` (following the nomenclature used in other modules)
        3. Exports the object `THREE` from this script / module to be imported into the rest (ex: in OrbitControls.js)
        4. In [OrbitControls.js](./src/external-libs/threejs-0.118.3/OrbitControls.js), or other scripts, new functionality is added to `THREE` object
* Graphical Programming with Threejs [libgptjs](./src/libgptjs/)
    * The classes at `libgptjs/` import `three-global.js`
    * Wrapper / Library to facilitate re-use of code and organize the graphics pipeline
    * It contains several objects (classes) for wrapping all the logic required for creating an scene with threejs
        * This allows modularity and we can reuse code creating instances of those clases
* [GPT_Coords](./src/libgptjs/GPT_Coords.js)
    * Gets vertices (Float32Array) and edges array (Uint32Array)
    * Calculates the normal vector for each triangle
    * Provides a method for calculating the UV coordinates for each triangle
* [GPT_Model](./src/libgptjs/GPT_Model.js)
    * Simple class to integrate mesh + geometry + material
    * Provides method for cleaning gl buffers that were reserved
* [GPT_LinkedModel](./src/libgptjs/GPT_LinkedModel.js)
    * Model formed of joining several `THREE.Object3D` in order to create articulated models like robot arms
    * Provides method for adding a new link between two Object3D and finally linking all of them in sequence
* [GPT_ModelCollider](./src/libgptjs/GPT_ModelCollider.js)
    * Attaches an AABB (axis aligned bounding box) to an existign Mesh
    * Provides a method for detecting collision with another AABB
* [GPT_Scene](./src/libgptjs/GPT_Scene.js)
    * List of `GPT_Model`s and `GPT_Light`
    * Provides abstract methods for initial configuration and updates in every frame
        * These methods have to be overriden when creating the instance of the `GPT_Scene`
    * Provides methods for adding and removing models at runtime
* [GPT_Render](./src/libgptjs/GPT_Renderer.js)
    * It initializes the camera and camera-handler
    * This is the main object that creates a `webgl-renderer` and invokes methods of `GPT_Scene`
* [GPT_App](./src/libgptjs/GPT_App.js)
    * Top-level object that configures the `window` and uses `GPT_Render`
    * It contains the main loop for animation in which the `update` and `render` are being invoked

## App scripts

* [main.js](./src/scripts/main.js)
    * It is the entry point. It checks webgl compatibility and instanciates `GPT_Renderer`, `GPT_App`, and `SceneDragon`
    * Then invokes init and run loop
* [Common.js](./src/scripts/Common.js)
    * Contains all constants to be re-used in several points in the code
* [CoordsDragon.js](./src/scripts/CoordsDragon.js)
    * Stores arrays of dragon model (vertices and edges)
    * Since it inherits from `GPT_Coords` it provides methods for computing normals and UVs coordinates
* [CoordsGripper.js](./src/scripts/CoordsGripper.js)
    * Stores arrays of gripper model (vertices and edges)
    * Since it inherits from `GPT_Coords` it provides methods for computing normals and UVs coordinates
* [ModelSkybox.js](./src/scripts/ModelSkybox.js)
    * Creates a big cube and maps the texture to simulate environment
    * These skybox images will be reflected on the Dragon surface and Gripper surface
* [ModelDragon.js](./src/scripts/ModelDragon.js)
    * Inherits from `GPT_Model` and overrides `get_geometry` and `get_material` methods
    * Creates and initializes `geometry` and `material` objects to be inserted into a `mesh`
    * Computes `UV` coordinates per face (triangle) in order to simulate reflections of the skybox onto the dragon surface
    * Contains a `GPT_ModelCollider`
* [ModelGripper.js](./src/scripts/ModelGripper.js)
    * Idem to ModelDragon
* [ModelRobot.js](./src/scripts/ModelRobot.js)
    * Inherits from `GPT_LinkedModel`
    * Creates separately the parts of the robot (base, arm, forearm, hand and gripper). Then links them all in sequence
* [ModelTrajectory.js](./src/scripts/ModelTrajectory.js)
    * Given 2 initial points to be used as direction vector
        * It computes the control points (`p1, p2, p3, peak and end`) to be used later into the spline points calculation
        * Control points form a triangle with one of the edges following the `p1` and `p2` direction
            * `Peak` point is in the middle of triangle and is the highest point
            * `End` point is on the floor
        * Spline points are calculated using catmullrom and N (30) segments
        * Final spline points are used to create line geometry to be rendered
* [ModelBullet.js](./src/scripts/ModelBullet.js)
    * Creates the geometry, material, mesh, and GPT_ModelCollider
    * Needs a trajectory and a starting point3D
    * Provides a method for moving the bullet between 2 consecutive points3D of the trajectory based on time passed since last frame
* [InputManager.js](./src/scripts/InputManager.js)
    * Checks if it is running on mobile device or desktop
    * Creates the UI (sliders, toggles, etc.) and installs the "onChange event" callbacks to be executed when a value is updated by the user
    * Creates html button for "shoot" and attaches the corresponding callback
* [FSM_Robot.js](./src/scripts/FSM_Robot.js)
    * Defines a finite state machine for robot shooter
    * Defines States, Events and Transitions
    * Defines Transitions as a dictionary of allowed state-event pairs
    * Provides methods for transiting from one state to other depending on the "Event"
    * Provides method for updating the current state based on timers expiration
* [SceneDragon.js](./src/scripts/SceneDragon.js)
    * Contains the handling of main interactions: InputManager, animation (update) of objects, etc.
    * Inherits from `GPT_Scene` and overrides `createObjects`, `createLights`, `updateObjects` and `updateLights` methods
    * Performs all setting up of models and lights: floor, dragon, skybox, robot, trajectory, etc.
    * Performs periodic updates of models and lights: translate, rotate, destroy and create new trajectory, etc.
    * Contains a method where actions are triggered depending on the change of state of `FSM_Robot`
        * Any change of state is reflected into the UI
        * `Idle`
            * Rotate Dragon, update AABB
        * `loading_bullet`
            * Rotate shooting arm
            * Increase power while user keeps clicking and update UI slider
            * When power increased set shooting arm to red color
        * `bullet_traveling`
            * Draw the trajectory
            * Move the bullet along the trajectory
            * Rotate while traveling
        * `hit`
            * Blink dragon to red
            * Stop bullet at collision point
    * Limits the reaction to the incoming "shoot events" by checking if current robot state is `idle`

## Computer Graphics Techniques

### Geometry Creation

### Texture UVs mapping

### Lighting and Shadows

### Update and Animate

### Game Manager

### Bump Mapping

### Surface Smoothing

### User Interface (widgets) 

## This repository

### NodeJS configuration

This project is buildt with NodeJS. The dependencies packages and configuration are locate at `package.json`

1. Install all dependencies
    * `npm install`
2. Two modes of "compiling" the code: `dev` and `build`
    * Running in development mode with a local webpack-dev-server
        * `npm run dev`
    * Building compressed / production code for deployment in a remote server
        * `npm run build`
        * Assets (images, index, etc.) and code will be placed at `./dist/`
        * You can use vs-code-plugin [live-server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to simulate a remote server and view the result

### Webpack configuration

This project uses webpack-5 for building the final js code. Webpack configuration is done at `./config`

* `paths.js`
    * `src`
        * Directory path for source files path (libgptjs, main scripts)
    * `build`
        * Directory path for production built files (compressed, images, html, etc.)
    * `static`
        * Directory path from which the assets will be to the build folder
* `webpack.common.js`
    * Uses webpack-plugins to integrate all resources (js scripts, html, images, etc.)
    * `entry`
        * Defines the point as `./src/index.js`, which also loads `./src/styles/index.scss` and `./src/scripts/main.js`
    * `output`
        * Defines the final js code bundle `[name].bundle.js` which will be placed at `build`
    * `HtmlWebpackPlugin`
        * Plugint that loads `./src/html/init_template.html`, replaces some headers and __defines the div where our project will be embedded into__:
            * `div id="container"></div>`
* `webpack.dev.js`
    * Includes `webpack.common.js` and adds configuraiton for development server
* `webpack.prod.js`
    * Includes `webpack.common.js` and adds configuration for building production bundle (split in chunks, minify code, etc.)

### Compiling smooth-dragon project

* The project has been updated to be a NodeJS package
    * In that way we can use threejs as package (from npm) and use it as module in our application
* We are also using webpack for building an optimized website (javascript code compression)


#### Compile instructions:

```bash
git clone https://github.com/GiovannyJTT/Smooth-Dragon.git
cd Smooth-Dragon
npm install     # install all nodejs packages needed for this project (in node_modules/ folder)
npm run dev     # compile and run a development version
npm run build   # build an optimized website (html + javscript + images) in dist/ folder
```

---

#### Building Threejs.min manually

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
