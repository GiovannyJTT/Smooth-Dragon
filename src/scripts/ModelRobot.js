import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_LinkedModel from "../libgptjs/GPT_LinkedModel";

/**
 * Class that groups all parts of the robot arm
 * Inherits from GPT_LinkedModel
 * @return {THREE.Object3D} root
 */
function ModelRobot () {
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

    // arm
    const _axis = this.getAxis();
    _axis.rotation.set( Math.PI / 2.0, 0, 0)
    
    const _arm = new THREE.Object3D();
    _arm.add( _axis );

    // root
    const _base = this.getBase();
    
    const _root = new THREE.Object3D();
    _root.add( _base );
    _root.add( _arm );
    _root.position.set(0, 8, 0);

    // build hierarchy
    this.pushLink("root", _root);
    this.pushLink("arm", _arm );

    // return root Object3D
    return this.createLinksHierarchy();
}

ModelRobot.prototype.getBase = function () {

    const _base_geom = new THREE.CylinderGeometry(50, 50, 15, 18, 1);

    const _base_mat = new THREE.MeshPhongMaterial({
        color : 0xb35900,
        emissive : 0x101010,
        flatShading: true,
        specular : 0x111A11,
        shininess : 50,        
        // map : tSuelo,
        side : THREE.FrontSide
    });

    const _base_mesh = new THREE.Mesh(_base_geom, _base_mat);
    _base_mesh.castShadow = true;
    _base_mesh.receiveShadow = true;

    return _base_mesh;
}

ModelRobot.prototype.getAxis = function () {

    const _axis_geom = new THREE.CylinderGeometry(20, 20, 18, 18, 1);

    const _axis_mat = new THREE.MeshPhongMaterial({
		color : 0xffe5e5,
        emissive : 0x101010,
        flatShading: false,
        specular : 0x111111,
        shininess : 70,
        // map : tEje,
        side : THREE.FrontSide
    });

    const _axis_mesh = new THREE.Mesh(_axis_geom, _axis_mat);

    return _axis_mesh;
}

export default ModelRobot