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

ModelDragon.prototype.getUVs = function(_geom){
    
    // computing reflection UVs for each face (triangle)
    _geom.computeBoundingBox();
    const max = geom.boundingBox.max;
    const min = geom.boundingBox.min;
    const displacement = new THREE.Vector2(0 - min.x, 0 - min.y);
    const interval = new THREE.Vector2(max.x - min.x, max.y - min.y);

    // each UV has 3 coordinates in this case, one UV per face (triangle)
    const uvs = new Float32Array(2 * this.coords.triangles_indices.length);

    for (let i = 0, n = 0; i < this.coords.triangles_indices.length; i++, n += 2){
        const p1 = this.coords.points3d[ this.coords.triangles_indices[i].a ];
        const p2 = this.coords.points3d[ this.coords.triangles_indices[i].b ];
        const p3 = this.coords.points3d[ this.coords.triangles_indices[i].c ];

        // pack all UV together for bufferAtrribute
        uvs[n] = (p1.x + displacement.x) / interval.x;
        uvs[n + 1] = (p1.y + displacement.x) / interval.y;
    }

    _geom.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
}

/**
 * Overriding in child object. It assumes `get_geometry` has been completed
 */
ModelDragon.prototype.get_material = function () {
    const mat = new THREE.MeshPhongMaterial(
        {
            color: 0xe5ffe5, emissive: 0xb4ef3e, flatShading: false,
            specular: 0x003300, shininess: 70,
            side: THREE.FrontSide, transparent: true, opacity: 0.5,
            // envMap: mapaEntorno
        }
    );

    return mat;
}

export default ModelDragon;