
import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_Model from "../libgptjs/GPT_Model";

const TRAJECTORY_DIST_INIT = 100;
const TRAJECTORY_DIST_STEP = 50;
const TRAJECTORY_DIST_END = 1000;
const TRAJECTORY_DIST_MIDDLE = TRAJECTORY_DIST_END / 2;
const ANGLE_DECAY = 0.5;
const TRACJETORY_SPLINE_NUM_SEGMENTS = 30;

/**
 * Class that computes the control points, the spline and then creates the line mesh to be rendered
 * 
 * Inherits from GPT_Model so we keep references to geometry, material and mesh
 * @param {THREE.Vector3} start_point3D_ coordinates of starting point to be used to compute the
 *      direction vector and hence the inclination angle of the trajectory
 * @param {THREE.Vector3} end_point3D_ coordinates of the ending point ...
 */
function ModelTrajectory (start_point3D_, end_point3D_) {

    this.p1 = start_point3D_;
    if (this.p1 === undefined){
        console.error("ModelTrajectory: 'p1' is undefined");
        return;
    }

    this.p2 = end_point3D_;
    if (this.p2 === undefined){
        console.error("ModelTrajectory: 'p2' is undefined");
        return;
    }

    // get control points (vertices p1,p2,p3,peak,end) before calling GPT_Model (where geometry is computeds from vertices)
    this.trajectory_control_points = this.compute_control_points();

    // 1. Call parent object constructor (trigger get_geometry, get_material)
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
 * @return {[THREE.Vector3]} Array of Vector3 containing coordinates of control points (to be vertices of the Mesh)
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

    // decay angle = angle(v, n) / 2;
    const _a = _v.clone().angleTo(_plane_normal) * ANGLE_DECAY;
    // console.debug("inclination angle " + (_a * 180 / Math.PI));

    // Since n is perpendicular to ground plane then we have a right-angled triangle
    // opposite = tan(a) * adjacent
    const _perpendicular = Math.tan(_a) * TRAJECTORY_DIST_MIDDLE;

    // projecting on the ground plane
    const _v_plane = new THREE.Vector3(_v.x, 0, _v.z);
    _v_plane.normalize();

    // projecting on the ground plane
    const _p3_plane = new THREE.Vector3(_p3.x, 0, _p3.z);

    // end = p3_plane + v_plane * dist_end
    const _end = _p3_plane.clone().add(
        new THREE.Vector3(
            _v_plane.x * TRAJECTORY_DIST_END,
            0,
            _v_plane.z * TRAJECTORY_DIST_END
        )
    );

    // peak = p3_plane + v * dist_middle
    const _peak = _p3_plane.clone().add(
        new THREE.Vector3(
            _v_plane.x * TRAJECTORY_DIST_MIDDLE,
            _p3.y + _perpendicular,
            _v_plane.z * TRAJECTORY_DIST_MIDDLE
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
 * Overriding its
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
 * Using Common.SPLINE_NUM_SEGMENTS (30)
 * Creates a Spline using the input 'trajectory_control_points'
 * @param {[THREE.Vector3]} this.vertices_trajectory cotaining the control points2D of the trajectory (p1, p2, p3, peak, end)
 *      Control points are used to build the spline curve using SPLINE_NUM_SEGMENTS (30) and catmullrom technique
 * @returns {{Float32Array, Float32Array}} {positions, colors} Both same size (3 * SPLINE_NUM_SEGMENTS)
 */
ModelTrajectory.prototype.get_spline_points_and_colors = function () {
    
    if (this.trajectory_control_points === undefined) {
        console.error("ModelTrajectory.get_spline_points_and_colors: 'trajectory_control_points' is undefined");
        return;
    }

    const _spline = new THREE.CatmullRomCurve3(this.trajectory_control_points);

    const _positions = new Float32Array(TRACJETORY_SPLINE_NUM_SEGMENTS * 3);
    const _colors = new Float32Array(_positions);

    const _tmpColor = new THREE.Color();

    for (let i = 0, v = 0; i < TRACJETORY_SPLINE_NUM_SEGMENTS; i++, v += 3) {
        const t = i / TRACJETORY_SPLINE_NUM_SEGMENTS;

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

ModelTrajectory.prototype.dispose_buffers = function () {
    this.geometry.dispose();
    this.material.dispose();
    
    this.geometry = null;
    this.material = null;
    this.mesh = null;

    this.trajectory_control_points = null;
    this.p1 = null;
    this.p2 = null;
}

export default ModelTrajectory