import THREE from "../external-libs/threejs-0.118.3/three-global"
import GPT_Model from "../libgptjs/GPT_Model"
import DragonCoords from "./DragonCoords"

/**
 * Creates a dragon model by computing the triangles and normals from its vertices
 * coordinates and edges array.
 * Inherits from GPT_model so we keep references to geometry and material
 */
function ModelDragon() {
    // instance coordinates only once
    this.coords = new DragonCoords();

    // 1. Call paren object
    GPT_Model.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
ModelDragon.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelDragon.prototype.constructor = ModelDragon;

/**
 * Overriding in child object
 */
ModelDragon.prototype.get_geometry = function () {
    const geom = new THREE.BufferGeometry();

    // itemSize = 3 because there are 3 components per vertex
    geom.setAttribute(
        "position",
        new THREE.BufferAttribute(this.coords.vertices_coordinates, 3)
    );

    // itemSize = 3 because there are 3 components per normal
    geom.setAttribute(
        "normal",
        new THREE.BufferAttribute(this.coords.normals, 3)
    );

    // intemSize = 1 because there are 1 component per vertex-index
    geom.setIndex(new THREE.BufferAttribute(this.coords.edges_indices, 1));

    return geom;
}

/**
 * Overriding in child object
 */
ModelDragon.prototype.get_material = function () {
    const mat = new THREE.MeshPhongMaterial(
        {
            color: 0xe5ffe5, emissive: 0xb4ef3e, flatShading: false,
            specular: 0x003300, shininess: 70,
            side: THREE.FrontSide, transparent: true, opacity: 0.8,
            // envMap: mapaEntorno
        }
    );

    return mat;
}

export default ModelDragon;