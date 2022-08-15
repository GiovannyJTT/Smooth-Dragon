/**
 * Values to be reused in several objects
 */

const FLOOR_WIDTH = 1000; // cm
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

module.exports = {
    FLOOR_WIDTH,
    SKYBOX_WIDTH,
    FLOOR_TEXTURE_PATH,
    SKYBOX_TEXTURE_PATH,
    SKYBOX_TEXTURE_IMAGES_NAMES
}