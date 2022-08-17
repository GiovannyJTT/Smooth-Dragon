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
    // forearm
    const _forearm = new THREE.Object3D();
    
    const _disc = this.getDisc();
    
    _forearm.add( _disc );
    _forearm.position.set(0, 110, 0);

    // arm
    const _arm = new THREE.Object3D();
    
    const _axis = this.getAxis();
    _axis.rotation.set( Math.PI / 2.0, 0, 0);

    const _humerus = this.getHumerus();
    _humerus.position.set(0, 50, 0);
    
    _arm.add( _axis );
    _arm.add( _humerus );
    _arm.add( _forearm );

    // root
    const _root = new THREE.Object3D();
    
    const _base = this.getBase();

    _root.add( _base );
    _root.add( _arm );

    _root.position.set(-50, 0, 50);

    // build hierarchy
    this.pushLink("root", _root);
    this.pushLink("arm", _arm ); // attach arm to root
    this.pushLink("forearm", _forearm); // attach forearm to arm

    // return root Object3D
    const _r = this.createLinksHierarchy();
    return _r;
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
        flatShading: true,
        specular : 0x111111,
        shininess : 70,
        // map : tEje,
        side : THREE.FrontSide
    });

    const _axis_mesh = new THREE.Mesh(_axis_geom, _axis_mat);
    _axis_mesh.castShadow = true;
    _axis_mesh.receiveShadow = true;

    return _axis_mesh;
}

ModelRobot.prototype.getHumerus = function () {
    
    const _humerus_geom = new THREE.BoxGeometry(18, 120, 12);
    
    const _humerus_mat = new THREE.MeshPhongMaterial({
        color : 0xffe5e5,
        emissive : 0x101010,
        flatShading: true,
        specular : 0x111111,
        shininess : 50,
        // map : tEsparrago,
        side : THREE.FrontSide,
        // bumpMap : tEsparragoBumpMap
    });

    const _humerus_mesh = new THREE.Mesh(_humerus_geom, _humerus_mat);
    _humerus_mesh.castShadow = true;
    _humerus_mesh.receiveShadow = true;

    return _humerus_mesh;
}

ModelRobot.prototype.getDisc = function () {

    const _disc_geom = new THREE.CylinderGeometry(22, 22, 6, 18, 1);

    const _disc_mat = new THREE.MeshPhongMaterial({
        color : 0xffe5e5,
        emissive : 0x101010,
        flatShading: true,
        specular : 0x111111,
        shininess : 90,
        // map : tDisco,
        side : THREE.FrontSide,
        // bumpMap : tDiscoBumpMap    
    });

    const _disc_mesh = new THREE.Mesh(_disc_geom, _disc_mat);
    _disc_mesh.castShadow = true;
    _disc_mesh.receiveShadow = true;

    return _disc_mesh;
}

export default ModelRobot