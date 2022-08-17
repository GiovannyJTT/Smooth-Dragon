import GPT_Coords from "../libgptjs/GPT_Coords";

/**
 * Contains vertices and edges and computes normals
 */
 function CoordsGripper () {
    // 1. Call parent object constructor
    GPT_Coords.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
CoordsGripper.prototype = Object.create(CoordsGripper.prototype);

// 3. Repair the inherited constructor
CoordsGripper.prototype.constructor = CoordsGripper;

/**
 * Overriding it
 */
CoordsGripper.prototype.getArrayVertices = function () {
    return new Float32Array([

    ]);
}

/**
 * Overriding it
 */
CoordsGripper.prototype.getArrayEdges = function () {
    return Uint32Array([

    ]);
}

export default CoordsGripper