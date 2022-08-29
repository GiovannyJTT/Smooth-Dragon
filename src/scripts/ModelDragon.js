import THREE from "../external-libs/threejs-0.118.3/three-global"
import GPT_Model from "../libgptjs/GPT_Model"
import CoordsDragon from "./CoordsDragon"
import Common from "./Common"
import ModelCollider from "./ModelCollider"

/**
 * Creates a dragon model by computing the triangles and normals from its vertices
 * coordinates and edges array.
 * Inherits from GPT_model so we keep references to geometry and material
 */
function ModelDragon (start_pos_) {
    
    if (undefined === start_pos_) {
        console.error("ModelDragon: 'start_pos' is undefined");
        return;
    }

    // instance coordinates only once
    this.coords = new CoordsDragon();

    // 1. Call parent object constructor
    GPT_Model.call(this);
    this.mesh.position.set(start_pos_.x, start_pos_.y, start_pos_.z);

    // Attach collider once mesh is built and set in intial postion
    this.collider = new ModelCollider(false, this.mesh);
}

// 2. Extend from parent object prototype (keep proto clean)
ModelDragon.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelDragon.prototype.constructor = ModelDragon;

/**
 * Overriding in child object
 */
ModelDragon.prototype.get_geometry = function () {
    const _geom = new THREE.BufferGeometry();

    // itemSize = 3 because there are 3 components per vertex
    _geom.setAttribute(
        "position",
        new THREE.BufferAttribute(this.coords.vertices_coordinates, 3)
    );

    // itemSize = 3 because there are 3 components per normal
    _geom.setAttribute(
        "normal",
        new THREE.BufferAttribute(this.coords.normals, 3)
    );

    // intemSize = 1 because there are 1 component per vertex-index
    _geom.setIndex(new THREE.BufferAttribute(this.coords.edges_indices, 1));

    // setting up the UV coordinates
    const uvs = this.coords.getUVs(_geom);

    // itemSize = 2 because each UV has 2 coordinates. uvs.lenght must be equalt to this.coords.edges_indices
    _geom.setAttribute(
        "uv",
        new THREE.BufferAttribute(uvs, 2)
    );

    _geom.needsUpdate = true;
    return _geom;
    // at this points geom will be assigned into this.geometry
}

/**
 * Overriding in child object. It assumes `get_geometry` has been completed
 * We are using a TextureCube as skybox, computing the reflections-uv and mapping them on the dragon surface
 */
ModelDragon.prototype.get_material = function () {
    // loading TextureCube as skybox
    // creating material with all config
    const _mat = new THREE.MeshPhongMaterial(
        {
            color: 0xe5ffe5,
            emissive: 0xb4ef3e,
            flatShading: true, // initially per-triangle normals
            specular: 0x003300,
            shininess: 70,
            side: THREE.FrontSide,
            transparent: true,
            opacity: 0.75,
            envMap: Common.SKYBOX_CUBE_TEXTURE
        }
    );

    _mat.needsUpdate = true;
    return _mat;
}

ModelDragon.prototype.update_collider = function () {
    this.collider.update_aabb();
}

export default ModelDragon;