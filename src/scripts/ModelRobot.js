import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_LinkedModel from "../libgptjs/GPT_LinkedModel";

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
 * @returns {THREE.Object3D} root
 */
ModelRobot.prototype.getRobot = function () {

    // hand
    const _hand_o = new THREE.Object3D();

    const _wrist = this.getWristMesh();
    _wrist.rotation.x = Math.PI / 2.0;

    _hand_o.add(_wrist);

    _hand_o.position.set(0, 80, 0);

    // forearm
    const _forearm_o = new THREE.Object3D();

    const _nerve1 = this.getNerveMesh();
    const _nerve2 = this.getNerveMesh();
    const _nerve3 = this.getNerveMesh();
    const _nerve4 = this.getNerveMesh();

    _nerve1.position.set(8, 40, 8);
    _nerve2.position.set(8, 40, -8);
    _nerve3.position.set(-8, 40, 8);
    _nerve4.position.set(-8, 40, -8);

    const _disc = this.getDiscMesh();

    _forearm_o.add(_disc);
    _forearm_o.add(_nerve1);
    _forearm_o.add(_nerve2);
    _forearm_o.add(_nerve3);
    _forearm_o.add(_nerve4);

    _forearm_o.position.set(0, 110, 0);

    // arm
    const _arm_o = new THREE.Object3D();

    const _axis = this.getAxisMesh();
    _axis.rotation.set(Math.PI / 2.0, 0, 0);

    const _humerus = this.getHumerusMesh();
    _humerus.position.set(0, 50, 0);

    const _balljoint = this.getBallJointMesh();
    _balljoint.position.set(0, 110, 0);

    _arm_o.add(_axis);
    _arm_o.add(_humerus);
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

    // return root Object3D
    const _r = this.createLinksHierarchy();
    return _r;
}

ModelRobot.prototype.getBaseMesh = function () {

    const _base_geom = new THREE.CylinderGeometry(50, 50, 15, 18, 1);

    const _base_mat = new THREE.MeshPhongMaterial({
        color: 0xb35900,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111A11,
        shininess: 50,
        // map : tSuelo,
        side: THREE.FrontSide
    });

    const _base_mesh = new THREE.Mesh(_base_geom, _base_mat);
    _base_mesh.castShadow = true;
    _base_mesh.receiveShadow = true;

    return _base_mesh;
}

ModelRobot.prototype.getAxisMesh = function () {

    const _axis_geom = new THREE.CylinderGeometry(20, 20, 18, 18, 1);

    const _axis_mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111111,
        shininess: 70,
        // map : tEje,
        side: THREE.FrontSide
    });

    const _axis_mesh = new THREE.Mesh(_axis_geom, _axis_mat);
    _axis_mesh.castShadow = true;
    _axis_mesh.receiveShadow = true;

    return _axis_mesh;
}

ModelRobot.prototype.getHumerusMesh = function () {

    const _humerus_geom = new THREE.BoxGeometry(18, 120, 12);

    const _humerus_mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111111,
        shininess: 50,
        // map : tEsparrago,
        side: THREE.FrontSide,
        // bumpMap : tEsparragoBumpMap
    });

    const _humerus_mesh = new THREE.Mesh(_humerus_geom, _humerus_mat);
    _humerus_mesh.castShadow = true;
    _humerus_mesh.receiveShadow = true;

    return _humerus_mesh;
}

ModelRobot.prototype.getDiscMesh = function () {

    const _disc_geom = new THREE.CylinderGeometry(22, 22, 6, 18, 1);

    const _disc_mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111111,
        shininess: 90,
        // map : tDisco,
        side: THREE.FrontSide,
        // bumpMap : tDiscoBumpMap    
    });

    const _disc_mesh = new THREE.Mesh(_disc_geom, _disc_mat);
    _disc_mesh.castShadow = true;
    _disc_mesh.receiveShadow = true;

    return _disc_mesh;
}

ModelRobot.prototype.getBallJointMesh = function () {

    const _balljoint_geom = new THREE.SphereGeometry(20, 10, 10);

    const _balljoint_mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0xff9999,
        flatShading: true,
        // envMap : tRotula,
        side: THREE.FrontSide
    });

    const _balljoint_mesh = new THREE.Mesh(_balljoint_geom, _balljoint_mat);
    _balljoint_mesh.castShadow = true;
    _balljoint_mesh.receiveShadow = true;

    return _balljoint_mesh;
}

ModelRobot.prototype.getNerveMesh = function () {

    const _nerve_geom = new THREE.BoxGeometry(4, 80, 4);

    const _nerve_mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111111,
        shininess: 80,
        // map : tNervio,
        side: THREE.FrontSide,
        // bumpMap : tNervioBumpMap
    });

    const _nerve_mesh = new THREE.Mesh(_nerve_geom, _nerve_mat);
    _nerve_mesh.castShadow = true;
    _nerve_mesh.receiveShadow = true;

    return _nerve_mesh;
}

ModelRobot.prototype.getWristMesh = function () {

    const _wrist_geom = new THREE.CylinderGeometry(15, 15, 40, 18, 1);

    const _wrist_mat = new THREE.MeshPhongMaterial({
        color: 0xffe5e5,
        emissive: 0x101010,
        flatShading: true,
        specular: 0x111111,
        shininess: 50,
        // map : tMunyeca,
        side: THREE.FrontSide,
        // bumpMap : tDiscoBumpMap
    });

    const _wrist_mesh = new THREE.Mesh(_wrist_geom, _wrist_mat);
    _wrist_mesh.castShadow = true;
    _wrist_mesh.receiveShadow = true;

    return _wrist_mesh;
}

export default ModelRobot