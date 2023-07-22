/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class ModelTrajectory
 */

import THREE from "../external-libs/three-global";
import GPT_Model from "../GPT_Model";
import Common from "./Common";

/**
 * Class that computes the control points, the spline and then creates the line mesh to be rendered
 * 
 * Inherits from GPT_Model so we keep references to geometry, material and mesh
 * @param {THREE.Vector3} start_point3D_ coordinates of starting point to be used to compute the
 *      direction vector and hence the inclination angle of the trajectory
 * @param {THREE.Vector3} end_point3D_ coordinates of the ending point ...
 * @param {Float} trajectory_dist_end_ max distance of trajectory is the "bullet power"
 * @param {[THREE.Vector3]} spline_points3D vector of points forming the spline (TRACJETORY_SPLINE_NUM_SEGMENTS)
 */
function ModelTrajectory(start_point3D_, end_point3D_, trajectory_dist_end_) {

    this.p1 = start_point3D_;
    if (undefined === this.p1) {
        console.error("ModelTrajectory: 'p1' is undefined");
        return;
    }

    this.p2 = end_point3D_;
    if (undefined === this.p2) {
        console.error("ModelTrajectory: 'p2' is undefined");
        return;
    }

    this.dist_end = trajectory_dist_end_;
    if (undefined == this.dist_end) {
        console.error("ModelTrajectory: 'dist_end' is undefined");
        return;
    }

    this.dist_middle = this.dist_end / 2;

    // get control points (vertices p1,p2,p3,peak,end) before calling GPT_Model (where geometry is computeds from vertices)
    this.trajectory_control_points = this.compute_control_points();

    // 1. Call parent object constructor (trigger get_geometry, get_material)
    // whem computing geometry it will save "spline_points3D" to move the bullet along
    this.spline_points3D = [];
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
 * Gets Initial input control points (p1, p2) as direction vector and
 *      computes control points (p3, peak, end) forming a right-angled triangle
 * @return {[THREE.Vector3]} Array of Vector3 ([p1, p2, p3, peak, end]) containing coordinates
 *      of control points (to be vertices of the Mesh)
 */
ModelTrajectory.prototype.compute_control_points = function () {

    // direction v
    const _v = new THREE.Vector3(
        this.p2.x - this.p1.x,
        this.p2.y - this.p1.y,
        this.p2.z - this.p1.z
    );

    const _v_length = Math.sqrt(
        _v.x * _v.x + _v.y * _v.y + _v.z * _v.z
    );

    _v.normalize();

    // p3 = p2 + v * lenght
    const _p3 = this.p2.clone().add(
        new THREE.Vector3(
            _v.x * _v_length,
            _v.y * _v_length,
            _v.z * _v_length
        )
    );

    // normal ground plane = (0,1,0)
    const _plane_normal = new THREE.Vector3(0, 1, 0);
    _plane_normal.normalize();

    // angle = angle_between(v, n) * factor_decay(0.5);
    const _a = _v.clone().angleTo(_plane_normal) * Common.TRAJECTORY_ANGLE_DECAY;
    // console.debug("inclination angle " + (_a * 180 / Math.PI));

    // Since n is perpendicular to ground plane then we have a right-angled triangle
    // perpendicular = opposite = tan(a) * adjacent
    const _perpendicular = Math.tan(_a) * this.dist_middle;

    // projecting on the ground plane
    const _v_plane = new THREE.Vector3(_v.x, 0, _v.z);
    _v_plane.normalize();

    // projecting on the ground plane
    const _p3_plane = new THREE.Vector3(_p3.x, 0, _p3.z);

    // end = p3_plane + v_plane * dist_end
    const _end = _p3_plane.clone().add(
        new THREE.Vector3(
            _v_plane.x * this.dist_end,
            0,
            _v_plane.z * this.dist_end
        )
    );

    // peak = p3_plane + v * dist_middle
    const _peak = _p3_plane.clone().add(
        new THREE.Vector3(
            _v_plane.x * this.dist_middle,
            _p3.y + _perpendicular,
            _v_plane.z * this.dist_middle
        )
    );

    const _points = [];
    _points.push(this.p1);
    _points.push(this.p2);
    _points.push(_p3);
    _points.push(_peak);
    _points.push(_end);
    _points.push(_end);

    return _points;
}

/**
 * Overriding it
 */
ModelTrajectory.prototype.get_geometry = function () {

    const _spline = this.get_spline_points_and_colors();
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

    _geom.verticesNeedUpdate = true;

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
 * Using Common.TRAJECTORY_SPLINE_NUM_SEGMENTS (30)
 * Creates a Spline using the input 'trajectory_control_points'
 * @param {[THREE.Vector3]} this.vertices_trajectory cotaining the control points3D of the trajectory (p1, p2, p3, peak, end)
 *      Control points are used to build the spline curve using TRAJECTORY_SPLINE_NUM_SEGMENTS (30) and catmull-rom technique
 * @returns {{Float32Array, Float32Array}} {positions, colors} Both same size (3 * TRAJECTORY_SPLINE_NUM_SEGMENTS)
 */
ModelTrajectory.prototype.get_spline_points_and_colors = function () {

    if (this.trajectory_control_points === undefined) {
        console.error("ModelTrajectory.get_spline_points_and_colors: 'trajectory_control_points' is undefined");
        return;
    }

    const _spline_curve = new THREE.CatmullRomCurve3(this.trajectory_control_points);

    const _positions = new Float32Array(Common.TRAJECTORY_SPLINE_NUM_SEGMENTS * 3);
    const _colors = new Float32Array(_positions);

    const _tmpColor = new THREE.Color();

    for (let i = 0, v = 0; i < Common.TRAJECTORY_SPLINE_NUM_SEGMENTS; i++, v += 3) {
        const t = i / Common.TRAJECTORY_SPLINE_NUM_SEGMENTS;

        // get spline point (extrapolated coordinates)
        const _p = new THREE.Vector3();
        _spline_curve.getPoint(t, _p);

        _positions[v] = _p.x;
        _positions[v + 1] = _p.y;
        _positions[v + 2] = _p.z;

        // save spline_points3D
        this.spline_points3D.push(_p);

        _tmpColor.setHSL(t, 1, 0.5);
        _colors[v] = _tmpColor.r;
        _colors[v + 1] = _tmpColor.g;
        _colors[v + 2] = _tmpColor.b;
    }

    const resp = {
        // size = 3 floats * TRAJECTORY_SPLINE_NUM_SEGMENTS
        "positions": _positions,
        "colors": _colors
    }

    return resp;
}

/**
 * Extending method (calling parent method and performing pre / post operations)
 */
ModelTrajectory.prototype.dispose_buffers = function () {

    GPT_Model.prototype.dispose_buffers.call(this);

    this.trajectory_control_points = null;
    this.p1 = null;
    this.p2 = null;

    console.log("ModelTrajectory: dispose_buffers()");
}

export default ModelTrajectory