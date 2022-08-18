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

export default {
    FLOOR_WIDTH,
    SKYBOX_WIDTH,
    FLOOR_TEXTURE_PATH,
    SKYBOX_TEXTURE_PATH,
    SKYBOX_TEXTURE_IMAGES_NAMES,
    SKYBOX_CUBE_TEXTURE,
    BASE_TEXTURE_PATH,
    AXIS_TEXTURE_PATH,
    HUMERUS_TEXTURE_PATH,
    DISC_TEXTURE_PATH,
    NERVE_TEXTURE_PATH,
    WRIST_TEXTURE_PATH
}
