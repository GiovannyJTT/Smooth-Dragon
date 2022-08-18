import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_LinkedModel from "../libgptjs/GPT_LinkedModel";
import ModelGripper from "./ModelGripper";
import Common from "./Common";

/**
 * Class that groups all parts of the robot arm
 * Inherits from GPT_LinkedModel
 * @return {THREE.Object3D} root
 */
function ModelRobot() {
    // 1. Call parent object constructors
    GPT_LinkedModel.call(this);

    return this.getRobot();
}

// 2. Extend from parent object prototype (keep proto clean)
ModelRobot.prototype = Object.create(GPT_LinkedModel.prototype);

// 3. Repair the inherited constructor
ModelRobot.prototype.constructor = ModelRobot;

/**
 * @returns {GPT_LinkedModel} this instance 
 */
ModelRobot.prototype.getRobot = function () {

    // gripper
    const _gripper_o = new THREE.Object3D();

    const _gripper_R = this.getGripperMesh();
    _gripper_R.position.set(10, -10, -9);
    _gripper_o.add(_gripper_R)

    const _gripper_L = this.getGripperMesh();
    _gripper_L.position.set(10, 10, 9);
    _gripper_L.rotation.set(-Math.PI, 0.0, 0.0);
    _gripper_o.add(_gripper_L);

    _gripper_o.rotation.set(0, 0, Math.PI / 2);

    // hand
    const _hand_o = new THREE.Object3D();

    const _wrist = this.getWristMesh();
    // _wrist.rotation.x = Math.PI / 2.0;
    _hand_o.add(_wrist);

    _hand_o.position.set(0, 80, 0);

    // forearm
    const _forearm_o = new THREE.Object3D();

    const _nerve1 = this.getNerveMesh();
    _nerve1.position.set(8, 40, 8);
    _forearm_o.add(_nerve1);

    const _nerve2 = this.getNerveMesh();
    _nerve2.position.set(8, 40, -8);
    _forearm_o.add(_nerve2);

    const _nerve3 = this.getNerveMesh();
    _nerve3.position.set(-8, 40, 8);
    _forearm_o.add(_nerve3);

    const _nerve4 = this.getNerveMesh();
    _nerve4.position.set(-8, 40, -8);
    _forearm_o.add(_nerve4);

    const _disc = this.getDiscMesh();
    _forearm_o.add(_disc);

    _forearm_o.position.set(0, 110, 0);
    _forearm_o.rotation.set(0.0, 0.0, -Math.PI / 2.0);

    // arm
    const _arm_o = new THREE.Object3D();

    const _axis = this.getAxisMesh();
    _axis.rotation.set(Math.PI / 2.0, 0, 0);
    _arm_o.add(_axis);

    const _humerus = this.getHumerusMesh();
    _humerus.position.set(0, 50, 0);
    _arm_o.add(_humerus);

    const _balljoint = this.getBallJointMesh();
    _balljoint.position.set(0, 110, 0);
    _arm_o.add(_balljoint);

    // root
    const _base_o = new THREE.Object3D();

    const _base_m = this.getBaseMesh();
    _base_o.add(_base_m);

    _base_o.position.set(-50, 0, 50);

    // build hierarchy
    this.pushLink("root", _base_o);
    this.pushLink("arm", _arm_o); // attach arm to root
    this.pushLink("forearm", _forearm_o); // attach forearm to arm
    this.pushLink("hand", _hand_o); // attach hand to forearm
    this.pushLink("gripper", _gripper_o); // attach gripper to hand

    this.createLinksHierarchy();
    // return GPT_LinkedModel instance
    return this;
}

ModelRobot.prototype.getBaseMesh = function () {

    const _geom = new THREE.CylinderGeometry(50, 50, 15, 18, 1);

    const _tex = new THREE.TextureLoader().load(Common.BASE_TEXTURE_PATH);
    _tex.wrapS = _tex.wrapT = THREE.RepeatWrapping;
    _tex.magFilter = _tex.minFilter = THREE.LinearFilter;
    _tex.repeat.set(5, 1);

    const _mat = new THREE.MeshPhongMaterial({
        color: 0x404040,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111111,
        shininess: 0,
        map: _tex,
        side: THREE.FrontSide
    });

    const _mesh = new THREE.Mesh(_geom, _mat);
    _mesh.castShadow = true;
    _mesh.receiveShadow = true;

    return _mesh;
}

ModelRobot.prototype.getAxisMesh = function () {

    const _geom = new THREE.CylinderGeometry(20, 20, 18, 18, 1);

    const _tex = new THREE.TextureLoader().load(Common.AXIS_TEXTURE_PATH);
    _tex.wrapS = _tex.wrapT = THREE.RepeatWrapping;
    _tex.magFilter = _tex.minFilter = THREE.LinearFilter;
    _tex.repeat.set(2, 0.5);

    const _mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: false,
        specular: 0x111111,
        shininess: 70,
        map: _tex,
        side: THREE.FrontSide
    });

    const _mesh = new THREE.Mesh(_geom, _mat);
    _mesh.castShadow = true;
    _mesh.receiveShadow = true;

    return _mesh;
}

ModelRobot.prototype.getHumerusMesh = function () {

    const _geom = new THREE.BoxGeometry(18, 120, 12);

    const _tex = new THREE.TextureLoader().load(Common.HUMERUS_TEXTURE_PATH);
    _tex.wrapS = _tex.wrapT = THREE.RepeatWrapping;
    _tex.magFilter = _tex.minFilter = THREE.LinearFilter;
    _tex.repeat.set(0.1, 1);

    const _mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111111,
        shininess: 50,
        map: _tex,
        side: THREE.FrontSide,
        bumpMap: _tex
    });

    const _mesh = new THREE.Mesh(_geom, _mat);
    _mesh.castShadow = true;
    _mesh.receiveShadow = true;

    return _mesh;
}

ModelRobot.prototype.getBallJointMesh = function () {

    const _geom = new THREE.SphereGeometry(20, 10, 10);
    // per vertex normals instead per face
    _geom.computeVertexNormals();

    const _mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0xff9999,
        flatShading: false, // per vertex normals instead per face
        envMap: Common.SKYBOX_CUBE_TEXTURE,
        side: THREE.FrontSide
    });

    const _mesh = new THREE.Mesh(_geom, _mat);
    _mesh.castShadow = true;
    _mesh.receiveShadow = true;

    return _mesh;
}

ModelRobot.prototype.getDiscMesh = function () {

    const _geom = new THREE.CylinderGeometry(22, 22, 6, 18, 1);

    // smooth in the curvature
    _geom.computeVertexNormals();

    const _tex = new THREE.TextureLoader().load(Common.DISC_TEXTURE_PATH);
    _tex.wrapS = _tex.wrapT = THREE.RepeatWrapping;
    _tex.magFilter = _tex.minFilter = THREE.LinearFilter;
    _tex.repeat.set(5, 0.25);

    const _mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: false, // smooth in curvature
        specular: 0x111111,
        shininess: 90,
        map: _tex,
        side: THREE.FrontSide,
        bumpMap: _tex
    });

    const _mesh = new THREE.Mesh(_geom, _mat);
    _mesh.castShadow = true;
    _mesh.receiveShadow = true;

    return _mesh;
}

ModelRobot.prototype.getNerveMesh = function () {

    const _geom = new THREE.BoxGeometry(4, 80, 4);

    const _tex = new THREE.TextureLoader().load(Common.NERVE_TEXTURE_PATH);
    _tex.wrapS = _tex.wrapT = THREE.RepeatWrapping;
    _tex.magFilter = _tex.minFilter = THREE.LinearFilter;
    _tex.repeat.set(0.1, 5);

    const _mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x881010,
        flatShading: true,
        specular: 0x111111,
        shininess: 80,
        map: _tex,
        side: THREE.FrontSide,
        bumpMap: _tex
    });

    const _mesh = new THREE.Mesh(_geom, _mat);
    _mesh.castShadow = true;
    _mesh.receiveShadow = true;

    return _mesh;
}

ModelRobot.prototype.getWristMesh = function () {

    const _geom = new THREE.CylinderGeometry(15, 15, 40, 18, 1);
    // smooth transition in curvature
    _geom.computeVertexNormals()

    const _tex = new THREE.TextureLoader().load(Common.WRIST_TEXTURE_PATH);
    _tex.wrapS = _tex.wrapT = THREE.RepeatWrapping;
    _tex.magFilter = _tex.minFilter = THREE.LinearFilter;
    _tex.repeat.set(5, 1);

    const _mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x111010,
        flatShading: false, // smooth transition in curvature
        specular: 0xff1111,
        shininess: 50,
        map: _tex,
        side: THREE.FrontSide,
        bumpMap: _tex
    });

    const _mesh = new THREE.Mesh(_geom, _mat);
    _mesh.castShadow = true;
    _mesh.receiveShadow = true;

    return _mesh;
}

ModelRobot.prototype.getGripperMesh = function () {

    const _gripper = new ModelGripper();

    _gripper.mesh.castShadow = true;
    _gripper.mesh.receiveShadow = true;

    return _gripper.mesh;
}

export default ModelRobot