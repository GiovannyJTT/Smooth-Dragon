import THREE from "../external-libs/threejs-0.118.3/three-global";

/**
 * Values to be reused in several objects
 */

/**
 * Floor width in cm
 */
const FLOOR_WIDTH = 1000;

/**
 * Skybox width is 5 times floor width 
 */
const SKYBOX_WIDTH = 5 * FLOOR_WIDTH;

const FLOOR_TEXTURE_PATH = "./assets/images/wood1.jpg";
const SKYBOX_TEXTURE_PATH = "./assets/images/Yokohama3/";
const SKYBOX_TEXTURE_IMAGES_NAMES = [
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg"
];

const BASE_TEXTURE_PATH = "./assets/images/granito1.jpg";
const AXIS_TEXTURE_PATH = "./assets/images/metal2.jpg";
const HUMERUS_TEXTURE_PATH = "./assets/images/metal1.jpg";
const DISC_TEXTURE_PATH = "./assets/images/bump1.jpg";
const NERVE_TEXTURE_PATH = "./assets/images/bump2.jpg";
const WRIST_TEXTURE_PATH = "./assets/images/bump1.jpg";

const _texLoader = new THREE.CubeTextureLoader();
_texLoader.setPath(SKYBOX_TEXTURE_PATH);
const SKYBOX_CUBE_TEXTURE = _texLoader.load(SKYBOX_TEXTURE_IMAGES_NAMES);
SKYBOX_CUBE_TEXTURE.isCubeTexture = true;

const TRAJECTORY_ANGLE_DECAY = 0.5;
const TRAJECTORY_SPLINE_NUM_SEGMENTS = 30;
const TRAJECTORY_DIST_MAX = 1000;
const TRAJECTORY_DIST_MIN = 200;

// used to interpolate bullet position between to points3D
const BULLET_STEP_DURATION_MS = 75;

// robot state machine timeouts
const FSM_DURATION_LOADING_BULLET_MS = 1000;
const FSM_DURATION_BULLET_TRAVELLING_MS = 30 * BULLET_STEP_DURATION_MS;
const FSM_DURATION_RESTART_MS = 1000;

export default {
    FLOOR_WIDTH,
    SKYBOX_WIDTH,
    FLOOR_TEXTURE_PATH,
    BASE_TEXTURE_PATH,
    AXIS_TEXTURE_PATH,
    HUMERUS_TEXTURE_PATH,
    DISC_TEXTURE_PATH,
    NERVE_TEXTURE_PATH,
    WRIST_TEXTURE_PATH,
    SKYBOX_TEXTURE_PATH,
    SKYBOX_TEXTURE_IMAGES_NAMES,
    SKYBOX_CUBE_TEXTURE,

    TRAJECTORY_ANGLE_DECAY,
    TRAJECTORY_SPLINE_NUM_SEGMENTS,
    TRAJECTORY_DIST_MAX,
    TRAJECTORY_DIST_MIN,
    
    BULLET_STEP_DURATION_MS,
    
    FSM_DURATION_LOADING_BULLET_MS,
    FSM_DURATION_BULLET_TRAVELLING_MS,
    FSM_DURATION_RESTART_MS
}
