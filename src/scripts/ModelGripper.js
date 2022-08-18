
import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_Model from "../libgptjs/GPT_Model";
import CoordsGripper from "./CoordsGripper";
import Common from "./Common"

/**
 * Creates a Robot model by computing its triangles and normals
 * Inherits from GPT_Model and overrides get_geometry and get_material
 */
function ModelGripper() {
    // instance coordinates only once
    this.coords = new CoordsGripper();

    // 1. Call parent object
    GPT_Model.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
ModelGripper.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelGripper.prototype.constructor = ModelGripper;

/**
 * Overriding it
 */
ModelGripper.prototype.get_geometry = function () {
    const _geom = new THREE.BufferGeometry();

    // itemSize 3 because there are 3 components per vertex
    _geom.setAttribute(
        "position",
        new THREE.BufferAttribute(this.coords.vertices_coordinates, 3)
    );

    // itemSize 3 ebcause there are 3 components per normal vector
    _geom.setAttribute(
        "normal",
        new THREE.BufferAttribute(this.coords.normals, 3)
    );

    // itemSize 1 because there are 1 component per vertex-index
    _geom.setIndex(new THREE.BufferAttribute(this.coords.edges_indices, 1));

    // setting up the UV coordinates
    const uvs = this.coords.getUVs(_geom);

    // itemSize 2 because each UV has 2 coordinates. uvs.lenght must be equalt to this.coords.edges_indices
    _geom.setAttribute(
        "uv",
        new THREE.BufferAttribute(uvs, 2)
    );

    _geom.needsUpdate = true;
    return _geom;
    // at this points geom will be assigned into this.geometry
}

/**
 * Overriding it
 */
ModelGripper.prototype.get_material = function () {

    const _texLoader = new THREE.CubeTextureLoader();
    _texLoader.setPath(Common.SKYBOX_TEXTURE_PATH);
    const _cubeTex = _texLoader.load(Common.SKYBOX_TEXTURE_IMAGES_NAMES);
    _cubeTex.repeat.x = -1;

    const _mat = new THREE.MeshPhongMaterial({
        color: 0xffffe5,
        emissive: 0xff9999,
        flatShading: true, // per face normals
        specular: 0xb3ffb3,
        shininess: 70,
        side: THREE.FrontSide,
        envMap: _cubeTex
    });

    _mat.needsUpdate = true;
    return _mat;
}

export default ModelGripper