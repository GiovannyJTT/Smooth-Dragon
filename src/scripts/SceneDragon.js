/**
 * Using library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content:
 *  configScene     creation of models and lights and methods for updating them
 */

import THREE from '../external-libs/threejs-0.118.3/three-global'
import GPT_Scene from '../libgptjs/GPT_Scene'
import ModelDragon from './ModelDragon'
import Common from './Common'
import ModelSkybox from './ModelSkybox'
import ModelRobot from './ModelRobot'

/**
 * Creating a child object (kind of child class) by Inheriting from GPT_Scene (Follow steps 1 to 3)
 * This child object adds functions for specfically configuring and updating the "dragon scene"
 */
function SceneDragon() {
    // 1. Call parent object
    GPT_Scene.call(this);
}

// 2. Extend from parent object prototype (keeps the proto clean)
SceneDragon.prototype = Object.create(GPT_Scene.prototype);

// 3. Repair the inherited constructor
SceneDragon.prototype.constructor = SceneDragon;

/**
 * Overrides createObjects funtion in child object
 */
SceneDragon.prototype.createObjects = function () {
    this.createAxes();
    this.createFloor();
    this.createDragon();
    this.createSkybox();
    this.createRobot();
}

SceneDragon.prototype.createAxes = function () {
    const axisH = new THREE.AxesHelper(200);
    axisH.position.set(0.0, 0.0, 0.0);
    axisH.setColors(new THREE.Color(0xff0000), new THREE.Color(0x00ff00), new THREE.Color(0x0000ff));

    // add to set of gpt_objects to be added into the rendering graph
    this.gpt_models.set("AxesHelper", axisH);
}

SceneDragon.prototype.createFloor = function () {
    // geometry
    const floor_geom = new THREE.PlaneGeometry(Common.FLOOR_WIDTH, Common.FLOOR_WIDTH, 2, 2);

    // material
    const floor_tex = new THREE.TextureLoader().load(Common.FLOOR_TEXTURE_PATH);
    floor_tex.wrapS = THREE.RepeatWrapping;
    floor_tex.wrapT = THREE.RepeatWrapping;
    floor_tex.repeat.set(2, 2);

    const floor_mat = new THREE.MeshPhongMaterial({
        color: 0xb35900,
        emissive: 0x101010,
        flatShading: false,
        specular: 0x111A11,
        shininess: 50,
        map: floor_tex,
        side: THREE.FrontSide
    });

    // Mesh = Geometry + Material
    const floor = new THREE.Mesh(floor_geom, floor_mat);
    floor.rotation.set(- 1.57079632679, 0, 0);

    // shadows
    floor.castShadow = false;
    floor.receiveShadow = true;

    this.gpt_models.set("floor", floor);
}

SceneDragon.prototype.createDragon = function () {
    // model = contains geometry, material and mesh
    const m_dragon = new ModelDragon();

    m_dragon.mesh.scale.set(1000, 1000, 1000);
    m_dragon.mesh.position.set(120, -50, -100);
    m_dragon.mesh.castShadow = true;
    m_dragon.mesh.receiveShadow = true;

    // for surface smoothing: flatShading false and computeVertexNormals
    // m_dragon.geometry.computeVertexNormals();
    // m_dragon.material.flatShading = false;

    this.gpt_models.set("dragon", m_dragon.mesh);
}

SceneDragon.prototype.createSkybox = function () {
    const m_skybox = new ModelSkybox();

    m_skybox.mesh.castShadow = false;
    m_skybox.mesh.receiveShadow = false;

    this.gpt_models.set("skybox", m_skybox.mesh);
}

SceneDragon.prototype.createRobot = function () {
    // THREE.Object3D
    const _robot = new ModelRobot();
    this.gpt_models.set("robot", _robot);
}

/**
 * Overrides updateObjects function in child object
 * @param {float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.updateObjects = function (ms) {
    this.updateDragon();
}

SceneDragon.prototype.updateDragon = function () {
    // console.log("update dragonModel here! (elapsed " + ms + " ms)");
    let _dragon = this.gpt_models.get("dragon");

    // 0.5 degrees per frame
    _dragon.rotation.y += 0.00872665;
    _dragon.rotation.y = (_dragon.rotation.y >= 2 * 3.141592) ? 0.0 : _dragon.rotation.y;
}

/**
 * Overrides createLights function in child object
 * This function creates a light of each type (ambient, point, directional, focal) and adds helpers (wireframe representations)
 * for better understanding of where are located the light sources.
 */
SceneDragon.prototype.createLights = function () {
    // 5% white light (almost black), doesnt need position. Ambient-Light: is added when shading the models surfaces
    const lAmbient = new THREE.AmbientLight(new THREE.Color(0x0d0d0d), 1.0);
    this.gpt_lights.set("lAmbient", lAmbient);

    // 75% white light. Point-Light: emits in all directions
    const lPoint = new THREE.PointLight(new THREE.Color(0xbfbfbf), 1.0);
    lPoint.position.set(0, 100, 50);
    this.gpt_lights.set("lPoint", lPoint);

    const lPointHelper = new THREE.PointLightHelper(lPoint, 10);
    this.gpt_lights.set("lPointHelper", lPointHelper);

    // 75% white light. Directional-Light: emits only in the configured direction vector
    const lDirectional = new THREE.DirectionalLight(new THREE.Color(0xbfbfbf), 1.0);

    // direction of the lighting vector
    lDirectional.position.set(-200, 200, 0);
    this.gpt_lights.set("lDirectional", lDirectional);

    const lDirectionalHelper = new THREE.DirectionalLightHelper(lDirectional, 10);
    this.gpt_lights.set("lDirectionalHelper", lDirectionalHelper);

    // 75% white light. Focal-Light: emits light with "cone" volume
    const lFocal = new THREE.SpotLight(new THREE.Color(0xbfbfbf));
    lFocal.position.set(50, 330, -150);

    // direction of the central lighting vector
    lFocal.target.position.set(0, 0, 0);

    lFocal.angle = Math.PI / 8; // radians
    lFocal.distance = 1000;

    lFocal.castShadow = true;
    lFocal.shadow.camera.near = 5;
    lFocal.shadow.camera.far = 1000;
    lFocal.shadow.camera.fov = 45; // degrees
    lFocal.shadow.camera.visible = true;

    // intensity 10 is ok for distance 1000
    lFocal.intensity = 10;

    // atenuation from the central vector to the borders of the cone
    lFocal.decay = 7.5;

    this.gpt_lights.set("lFocal", lFocal);

    const lFocalHelper = new THREE.SpotLightHelper(lFocal);
    this.gpt_lights.set("lFocalHelper", lFocalHelper);
}

/**
 * Overrides updateLights function in child object
 * @param {float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.updateLights = function (ms) {
    // console.log("update dragonLights here! (elapsed " + ms + " ms)");
}

export default SceneDragon;