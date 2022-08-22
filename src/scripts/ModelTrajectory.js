
import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_Model from "../libgptjs/GPT_Model";
import Common from "./Common";

/**
 * Class that computes the spline and creates the mesh to be rendered
 * Inherits from GPT_Model so we keep references to geometry, material and mesh
 * @param {[THREE.Vector3]} array of Vector3 containing the vertices of the trajectory
 */
function ModelTrajectory (vertices_trajectory) {
    this.vertices_trajectory = vertices_trajectory;

    if (this.vertices_trajectory == undefined){
        console.error("ModelTrajectory: vertices_trajectory is undefined");
    }

    // 1. Call parent object constructor
    GPT_Model.call(this);

    // overriding default construction of mesh (after constructed GPT_Model)
    this.mesh = new THREE.Line(this.geometry, this.material);
    this.mesh.computeLineDistances();
    this.mesh.visible = true;
}

// 2. Extend from parent object prototype (keep proto clean)
ModelTrajectory.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelTrajectory.prototype.constructor = ModelTrajectory;

/**
 * Overriding its
 */
ModelTrajectory.prototype.get_geometry = function () {    
    
    const _spline = this.get_points_and_colors_spline();    
    const _vertices = _spline["positions"];
    const _colors = _spline["colors"];

    const _geom = new THREE.BufferGeometry();

    _geom.setAttribute(
        "position",
        new THREE.BufferAttribute(_vertices, 3)
    );

    _geom.setAttribute(
        "color",
        new THREE.BufferAttribute(_colors, 3)
    );

    return _geom;
}

/**
 * Overriding it
 */
ModelTrajectory.prototype.get_material = function () {
    const _mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        alphaToCoverage: true,
        linewidth: 5
    });

    return _mat;
}

/**
 * Using Common.SPLINE_NUM_SEGMENTS
 * @param {[THREE.Vector3]} this.vertices_trajectory cotaining the 3 vertices of the tracjtory (origin, middle, destination)
 *      It is used to compute the spline curve using N division and catmullrom technique
 * @returns {{Float32Array, Float32Array}} {positions, colors} these arrays have the same size (3 * NUM DIVISIONS (10))
 */
ModelTrajectory.prototype.get_points_and_colors_spline = function () {
    
    if (this.vertices_trajectory === undefined) {
        console.error("ModelTrajectory.get_points_and_colors_spline: vertices_trajectory is undefined");
        return;
    }

    const _spline = new THREE.CatmullRomCurve3(this.vertices_trajectory);

    const _positions = new Float32Array(Common.TRACJETORY_SPLINE_NUM_SEGMENTS * 3);
    const _colors = new Float32Array(_positions);

    const _tmpColor = new THREE.Color();

    for (let i = 0, v = 0; i < Common.TRACJETORY_SPLINE_NUM_SEGMENTS; i++, v += 3) {
        const t = i / Common.TRACJETORY_SPLINE_NUM_SEGMENTS;

        // get extrapolaed coordinates
        const _p = new THREE.Vector3();
        _spline.getPoint(t, _p);

        _positions[v] = _p.x;
        _positions[v + 1] = _p.y;
        _positions[v + 2] = _p.z;

        _tmpColor.setHSL(t, 1, 0.5);
        _colors[v ] = _tmpColor.r;
        _colors[v + 1] = _tmpColor.g;
        _colors[v + 2] = _tmpColor.b;
    }

    const resp = {
        // size is 3 * NUM DIVISIONS (10)
        "positions": _positions,
        "colors": _colors
    }

    return resp;
}

export default ModelTrajectory