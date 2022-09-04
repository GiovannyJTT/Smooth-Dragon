/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class SceneDragon
 */

import THREE from '../external-libs/threejs-0.118.3/three-global'
import GPT_Scene from '../libgptjs/GPT_Scene'
import ModelDragon from './ModelDragon'
import Common from './Common'
import ModelSkybox from './ModelSkybox'
import ModelRobot from './ModelRobot'
import ModelTrajectory from './ModelTrajectory'
import InputManager from './InputManager'
import FSM_Robot, { R_States, R_Events } from './FSM_Robot'
import ModelBullet from './ModelBullet'

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
    this.createInputManager();
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
    const _start_pos = new THREE.Vector3(200, -75, -250);
    this.dragon_model = new ModelDragon(_start_pos);

    this.dragon_model.mesh.scale.set(1500, 1500, 1500);
    this.dragon_model.mesh.castShadow = true;
    this.dragon_model.mesh.receiveShadow = true;

    this.gpt_models.set("dragon", this.dragon_model.mesh);
    this.gpt_models.set("dragon_collider", this.dragon_model.collider.aabb_helper);

    // initialization state of variables used periodically
    this.dragon_rot_angle_rads = 0.0;

    // pre-calculated for surface smoothing
    this.dragon_model.geometry.computeVertexNormals();
}

SceneDragon.prototype.createSkybox = function () {
    const m_skybox = new ModelSkybox();

    m_skybox.mesh.castShadow = false;
    m_skybox.mesh.receiveShadow = false;

    this.gpt_models.set("skybox", m_skybox.mesh);
}

SceneDragon.prototype.createRobot = function () {
    // GPT_LinkedModel instance
    this.robotLinked = new ModelRobot();

    // prepare callbacks to be used inside the state machine
    const _cbs = {
        bullet_collided: () => {
            return this.bullet_model.collider.is_colliding_with(this.dragon_model.collider.aabb);
        }
    };
    this.fsm_r = new FSM_Robot.FSM_Robot(_cbs);

    // TRHEE.Object3D
    const _root = this.robotLinked.links.get("root");
    this.gpt_models.set("robot", _root);
}

/**
 * Prepares "on_change" callbacks and an instance of InputManager
 */
SceneDragon.prototype.createInputManager = function () {
    const _cbs = {};

    _cbs.on_change_dragon_rot_angle = (new_val_) => {
        // new_val_ is degrees
        this.dragon_rot_angle_rads = new_val_ * Math.PI / 180.0;
    };

    _cbs.on_change_dragon_smoothing = (new_val_) => {
        const _dragon = this.gpt_models.get("dragon");

        // boolean
        if (new_val_) {
            // for surface smoothing: flatShading false and computeVertexNormals
            _dragon.material.flatShading = false;
        }
        else {
            _dragon.material.flatShading = true;
        }
        _dragon.material.needsUpdate = true;
    };

    _cbs.on_change_robot_aim_rotation = (new_val_) => {
        // float degrees
        const _base = this.robotLinked.links.get("root");
        const _new_angle_rads = new_val_ * Math.PI / 180;
        _base.rotation.y = _new_angle_rads;
    }

    _cbs.on_change_robot_shoot = () => {
        if (this.fsm_r.current_is_idle()) {

            // trigger fsm transit so timers starts running
            this.fsm_r.transit(FSM_Robot.R_Events.SHOOT_STARTED);
            const _c = this.im.controllers.get("robot_status");
            _c.setValue(this.fsm_r.state.description);
        }
        else if (this.fsm_r.current_is_loading_bullet()) {

            // increase robot_power with successive clicks (UI it will auto-clamp to max value)
            const _c = this.im.controllers.get("robot_power");
            const _rp = _c.getValue() + Common.TRAJECTORY_DIST_STEP;
            _c.setValue(_rp);

            // bullet and trajectory will be built at `on_fsmr_changed`

            // increase robot wrist emissive
            const _wrist = this.robotLinked.links.get("hand").getObjectByName("wrist");
            const _new_emissive = new THREE.Color(
                _wrist.material.emissive.r + 0.25,
                _wrist.material.emissive.g,
                _wrist.material.emissive.b);
            _wrist.material.emissive.set(_new_emissive);
        }
    }

    this.im = new InputManager(_cbs);
}

/**
 * Per-frame update
 * Overrides updateObjects function in child object
 * @param {float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.updateObjects = function (ms) {
    this.updateDragon(ms);
    this.updateRobot(ms);
    this.updateBullet();

    this.on_fsmr_changed();

    this.im.controllers.get("stats").update();
}

/**
 * Per-frame update of dragon
 * @param {Float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.updateDragon = function (ms) {

    // stop robot animation while it is on 'hit'
    if (!this.fsm_r.current_is_hit()) {

        // 0.5 degrees per frame
        this.dragon_model.mesh.rotation.y += this.dragon_rot_angle_rads;
        this.dragon_model.mesh.rotation.y =
            (this.dragon_model.mesh.rotation.y >= 2 * Math.PI) ? 0.0 : this.dragon_model.mesh.rotation.y;

        this.dragon_model.update_collider();
    }
}

/**
 * Per-frame update of robot
 * @param {Float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.updateRobot = function (ms) {

    if (this.fsm_r.current_is_loading_bullet()) {
        const _forearm = this.robotLinked.links.get("forearm");

        // 10 degrees per frame
        _forearm.rotation.x += 0.174533;
        _forearm.rotation.x = (_forearm.rotation.x >= 2 * Math.PI) ? 0.0 : _forearm.rotation.x;
    }
}

/**
 * Perform operations only once when there is a state-transition of the robot-state-machine
 */
SceneDragon.prototype.on_fsmr_changed = function () {

    this.fsm_r.update_state();

    if (this.fsm_r.state_has_changed()) {

        const _c = this.im.controllers.get("robot_status");
        _c.setValue(this.fsm_r.state.description);

        // 'loading_bullet' to 'bullet_traveling'
        if (this.fsm_r.current_is_bullet_traveling()) {
            this.createTrajectory();
            this.createBullet();
        }
        // 'bullet_traveling' to 'hit'
        else if (this.fsm_r.current_is_hit()) {
            // blink dragon to red
            this.dragon_model.mesh.material.color.set(0xff0000);
            this.dragon_model.mesh.material.emissive.set(0xff0000);
            this.dragon_model.mesh.material.specular.set(0xff0000);
        }
        // 'hit', 'no_hit' to 'idle'
        else if (this.fsm_r.current_is_idle()) {
            // restore initial values

            this.removeTrajectory();
            this.removeBullet();

            this.dragon_model.mesh.material.color.set(0xe5ffe5);
            this.dragon_model.mesh.material.emissive.set(0xb4ef3e);
            this.dragon_model.mesh.material.specular.set(0x003300);

            const _c = this.im.controllers.get("robot_power");
            _c.setValue(Common.TRAJECTORY_DIST_MIN);

            const _wrist = this.robotLinked.links.get("hand").getObjectByName("wrist");
            _wrist.material.emissive.set(0x000000);
        }
    }
}

/**
 * We only create a trajectory while robot is shooting and remove it after shoot end
 * This method is cpu expensive
 * @param {Float} ms milliseconds passed since last frame
 */
SceneDragon.prototype.createTrajectory = function (ms) {

    this.removeTrajectory();

    // create new
    const _forearm = this.robotLinked.links.get("forearm");
    const _p1 = new THREE.Vector3();
    _forearm.getWorldPosition(_p1);

    const _hand = this.robotLinked.links.get("hand");
    const _p2 = new THREE.Vector3();
    _hand.getWorldPosition(_p2)

    const _r_power = this.im.controllers.get("robot_power").getValue();

    this.tra_model = new ModelTrajectory(_p1, _p2, _r_power);
    this.tra_model.mesh.castShadow = false;
    this.tra_model.mesh.receiveShadow = false;

    // add new model at runtime to THREE.Scene (also to gpt_models)
    this.AddModelToScene("trajectory", this.tra_model.mesh);
}

/**
 * if trajectory previously created then disposes gl buffers and removes object
 */
SceneDragon.prototype.removeTrajectory = function () {
    if (undefined !== this.tra_model) {
        // destroy geom and mat buffers
        this.tra_model.dispose_buffers();
        this.tra_model = undefined;

        // remove it at runtime from THREE.Scene (also from gpt_models)
        this.removeModelFromScene("trajectory");
    }
}

/**
 * Bullet needs `this.tra_model.spline_points3D`
 */
SceneDragon.prototype.createBullet = function () {
    this.removeBullet();

    const _tp = this.tra_model.spline_points3D;
    const _start_pos = _tp[0];
    this.bullet_model = new ModelBullet(_tp, _start_pos);
    this.bullet_model.mesh.castShadow = true;
    this.bullet_model.mesh.receiveShadow = false;

    this.AddModelToScene("bullet", this.bullet_model.mesh);
    this.AddModelToScene("bullet_collider", this.bullet_model.collider.aabb_helper)
}

SceneDragon.prototype.removeBullet = function () {
    if (undefined !== this.bullet_model) {
        // destroy geo and mat buffers
        this.bullet_model.dispose_buffers();
        this.bullet_model = undefined;

        // remove it at runtime from THREE.Scene (also from gpt_models)
        this.removeModelFromScene("bullet");
        this.removeModelFromScene("bullet_collider");
    }
}

/**
 * Per-frame update of bullet
 */
SceneDragon.prototype.updateBullet = function () {
    if (this.fsm_r.current_is_bullet_traveling()) {
        this.bullet_model.move_to_next_point_interpolated();

        // 10 degrees per frame
        this.bullet_model.mesh.rotation.x -= 0.174533;
    }
    else if (this.fsm_r.current_is_hit()) {
        // 10 degrees per frame
        this.bullet_model.mesh.rotation.x -= 0.174533;
    }
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
    lFocal.position.set(200, 330, -300);

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