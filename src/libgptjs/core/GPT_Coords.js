/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class GPT_Coords
 * @summary
 *      A Coordinates object contains all vertices, edges and methods for
 *      computing triangles, normals, and UV coordinates per face
 */

import THREE from "../external-libs/three-global";

/**
 * Class to manipulate / load vertices coordinates and edges among them
 * It is intended to create geometry from low level triangles and operations for computing normals, etc.
 * 
 * @param {Float32Array} vertices_coordinates contains all needed `vertices_coordinates` that will be referenced to create edges
 * @param {Int32Array} edges_indices contains all the edges by referencing the indices of `vertices_coordinates` array (avoids to save duplicated vertices on disk) 
 * @param {Array} points3d array of Vector3-items containing all 3d-points from `vertices_coordinates`
 * @param {Array} triangles_indices array of Vector3-items containing all triangles-indices from `edges_indices`
 * 
 * It also calculates triangles and normals (check at the end of this file)
 */
function GPT_Coords() {
    // initialization empty values (will be filled when calculateNormals)
    this.points3d = undefined;
    this.triangles_indices = undefined;

    // initial operations
    this.vertices_coordinates = this.getArrayVertices();
    this.edges_indices = this.getArrayEdges();
    this.normals = this.calculateNormals();
}

/**
 * To be overriden in child object
 * @return {Float32Array} undefined
 */
GPT_Coords.prototype.getArrayVertices = function () {
    console.error("GPT_Coords.getArrayVertices: not implemented");
    return undefined;
}

/**
 * To be overriden in child object
 * @return {Uint32Array} undefined
 */
GPT_Coords.prototype.getArrayEdges = function () {
    console.error("GPT_Coords.getArrayEdges: not implemented");
    return undefined;
}

/**
 * Calculates normal vector for each face (triangle). Normals in threejs
 * are clockwise by default
 * 
 * Builds triangles taking 3D points from vertices array and edges array
 * 
 * @param { [THREE.Vector3] } this.points3d array of Vector3 formed from this.vertices_coordinates
 * @param { [myVec3] } this.triangles_indices array of myVec3 formed from this.edges_indices. 3 components form a triangle
 * @returns { [Float32Array] } Array of values of the computed normal vectors packed all together to be set in a BufferArray
 */
GPT_Coords.prototype.calculateNormals = function () {

    // group 3d points
    this.points3d = [];
    for (let i = 0; i < this.vertices_coordinates.length; i += 3) {
        this.points3d.push(
            new THREE.Vector3(
                this.vertices_coordinates[i],
                this.vertices_coordinates[i + 1],
                this.vertices_coordinates[i + 2]
            )
        );
    }

    function myVec3(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    // group triangles indices
    this.triangles_indices = [];
    for (let i = 0; i < this.edges_indices.length; i += 3) {
        this.triangles_indices.push(
            new myVec3(
                this.edges_indices[i],
                this.edges_indices[i + 1],
                this.edges_indices[i + 2],
            )
        );
    }

    // size of this.normals is num_triagles * 3 (since 3 floats per normal)
    const _normals = new Float32Array(3 * this.triangles_indices.length);

    // compute normals: in threejs normals are clockwise by default
    for (let i = 0, n = 0; i < this.triangles_indices.length; i++, n += 3) {
        const p1 = this.points3d[this.triangles_indices[i].a];
        const p2 = this.points3d[this.triangles_indices[i].b];
        const p3 = this.points3d[this.triangles_indices[i].c];

        // v1 = p2 - p1 = destination - origin
        const v1 = new THREE.Vector3(p2.x - p1.x, p2.y - p1.y, p2.z - p1.z);

        // v2 = p3 - p2
        const v2 = new THREE.Vector3(p3.x - p2.x, p3.y - p2.y, p3.z - p2.z);

        // Cross Product of Two Vectors in the Three-Dimensional Cartesian Coordinate System 
        const normal = new THREE.Vector3(
            v1.y * v2.z - v1.z * v2.y,
            v1.x * v2.z - v1.z * v2.x,
            v1.x * v2.y - v1.y * v2.x
        );

        const mod = Math.sqrt(
            normal.x * normal.x + normal.y * normal.y + normal.z * normal.z
        );

        // apply module
        normal.x = normal.x / mod;
        normal.y = normal.y / mod;
        normal.z = normal.z / mod;

        // pack all normals-coordinates adjacently for attributeBuffer
        _normals[n] = normal.x;
        _normals[n + 1] = normal.y;
        _normals[n + 2] = normal.z;
    }

    return _normals;
}

/**
 * Calculates UV for planar surface (x, y, z) where z = 0.
 * Computes the UV values for each face (triangle)
 * Assumes `get_geometry()` is finished so input param `_geom` is used
 * 
 * @param {Array} this.points3d reusing to compute uvs
 * @param {Array} this.triangles_indices reusing to compute uvs
 * @return {Float32Array} Array containing all UVs for all faces to be ready to copy in a THREE.BufferArray
 */
GPT_Coords.prototype.getUVs = function (geom_) {
    if (geom_ === undefined) {
        console.error("GPT_Coords.getUVs: 'geom_' is undefined");
        return;
    }

    geom_.computeBoundingBox();

    const max = geom_.boundingBox.max;
    const min = geom_.boundingBox.min;
    const offset = new THREE.Vector2(0 - min.x, 0 - min.y);
    const range = new THREE.Vector2(max.x - min.x, max.y - min.y);

    // each UV has 2 coordinates, each face (triangle) has 3 vertice, one UV per face
    const _uvs = new Float32Array(6 * this.triangles_indices.length);

    for (let i = 0, n = 0; i < this.triangles_indices.length; i++, n += 6) {
        const p1 = this.points3d[this.triangles_indices[i].a];
        const p2 = this.points3d[this.triangles_indices[i].b];
        const p3 = this.points3d[this.triangles_indices[i].c];

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

export default GPT_Coords