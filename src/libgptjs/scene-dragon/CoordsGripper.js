/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class CoordsGripper
 */

import GPT_Coords from "../GPT_Coords";

/**
 * Contains vertices and edges. Computes normals and UV coordinates
 */
function CoordsGripper() {
    // 1. Call parent object constructor
    GPT_Coords.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
CoordsGripper.prototype = Object.create(GPT_Coords.prototype);

// 3. Repair the inherited constructor
CoordsGripper.prototype.constructor = CoordsGripper;

/**
 * Overriding it
 */
CoordsGripper.prototype.getArrayVertices = function () {
    return new Float32Array([
        0, 0, 0,
        0, 20, 0,
        19, 20, 0,
        19, 0, 0,
        0, 20, 4,
        0, 0, 4,
        19, 20, 4,
        19, 0, 4,
        38, 5, 4,
        38, 15, 4,
        38, 5, 2,
        38, 15, 2
    ]);
}

/**
 * Overriding it
 */
CoordsGripper.prototype.getArrayEdges = function () {
    return new Uint32Array([
        // front face
        2, 0, 1,
        3, 0, 2,
        11, 3, 2,
        10, 3, 11,

        // back face
        6, 4, 5,
        7, 6, 5,
        9, 6, 7,
        8, 9, 7,

        // top face
        2, 1, 4,
        6, 2, 4,
        11, 2, 6,
        9, 11, 6,

        // bottom face
        5, 0, 3,
        7, 5, 3,
        10, 7, 3,
        8, 7, 10,

        // side faces
        4, 1, 5,
        1, 0, 5,
        10, 11, 9,
        8, 10, 9
    ]);
}

export default CoordsGripper