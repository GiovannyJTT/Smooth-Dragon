import THREE from "../external-libs/threejs-0.118.3/three-global"
import GPT_Model from "../libgptjs/GPT_Model"
import DragonCoords from "./DragonCoords"
import Common from "./Common"

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
    const uvs = this.getUVs(_geom);

    // itemSize = 2 because each UV has 2 coordinates. uvs.lenght must be equalt to this.coords.edges_indices
    _geom.setAttribute(
        "uv",
        new THREE.BufferAttribute(uvs, 2)
    );

    // geom.computeVertexNormals();

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
    const _texLoader = new THREE.CubeTextureLoader();
    _texLoader.setPath(Common.SKYBOX_TEXTURE_PATH);
    const _cubeTex = _texLoader.load(Common.SKYBOX_TEXTURE_IMAGES_NAMES);

    // creating material with all config
    const _mat = new THREE.MeshPhongMaterial(
        {
            color: 0xe5ffe5, emissive: 0xb4ef3e, flatShading: false,
            specular: 0x003300, shininess: 70,
            side: THREE.FrontSide, transparent: true, opacity: 0.5,
            envMap: _cubeTex
        }
    );

    _mat.needsUpdate = true;
    return _mat;
}

/**
 * Calculates UV for planar surface (x, y, z) where z = 0.
 * Computes the UV values for each face (triangle)
 * Assumes `get_geometry()` is finished so input param `_geom` is used
 * 
 * @param {THREE.BufferGeometry} this.geometry already set
 * @param {Array} this.coords.points3d reusing to compute uvs
 * @param {Array} this.coords.triangles_indices reusing to compute uvs
 * @return {Float32Array} Array containing all UVs for all faces
 */
 ModelDragon.prototype.getUVs = function(geom_){
    if (geom_ === undefined){
        console.error("_geom undefined when getUvs()");
        return;
    }

    geom_.computeBoundingBox();

    const max = geom_.boundingBox.max;
    const min = geom_.boundingBox.min;
    const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    const range = new THREE.Vector2(max.x - min.x, max.y - min.y);

    // each UV has 2 coordinates, each face (triangle) has 3 vertice, one UV per face
    const _uvs = new Float32Array(6 * this.coords.triangles_indices.length);

    for (let i = 0, n = 0; i < this.coords.triangles_indices.length; i++, n += 6){
        const p1 = this.coords.points3d[ this.coords.triangles_indices[i].a ];
        const p2 = this.coords.points3d[ this.coords.triangles_indices[i].b ];
        const p3 = this.coords.points3d[ this.coords.triangles_indices[i].c ];

        // pack all UV together for bufferAtrribute
        _uvs[n] = (p1.x + offset.x) / range.x;
        _uvs[n + 1] = (p1.y + offset.y) / range.y;

        _uvs[n + 2] = (p2.x + offset.x) / range.x;
        _uvs[n + 3] = (p2.y + offset.y) / range.y;

        _uvs[n + 4] = (p3.x + offset.x) / range.x;
        _uvs[n + 5] = (p3.y + offset.y) / range.y;
    }

    return _uvs;
}

export default ModelDragon;