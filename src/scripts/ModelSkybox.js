import THREE from "../external-libs/threejs-0.118.3/three-global";
import GPT_Model from "../libgptjs/GPT_Model";
import Common from "./Common"

/**
 * Creates a Model of Skybox with a cube and environment map texture
 * Inherits from GPT_Model
 */
function ModelSkybox() {
    // 1. Call parent object
    GPT_Model.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
ModelSkybox.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelSkybox.prototype.constructor = ModelSkybox

/**
 * Overriding in this child object
 */
ModelSkybox.prototype.get_geometry = function () {
    const _geom = new THREE.BoxGeometry(Common.SKYBOX_WIDTH, Common.SKYBOX_WIDTH, Common.SKYBOX_WIDTH);

    _geom.needsUpdate = true;
    return _geom;
}

/**
 * Overriding in this child object
 * Attaches textures into the Skybox side separately
 * (same images of skybox are being used on the dragon as cubeTexture to simulate reflections)
 */
ModelSkybox.prototype.get_material = function () {
    const _cubeFacesMaterials = [];
    const _loader = new THREE.TextureLoader();
    
    for (let i = 0; i < Common.SKYBOX_TEXTURE_IMAGES_NAMES.length; i++) {
        const _img_path = Common.SKYBOX_TEXTURE_PATH + Common.SKYBOX_TEXTURE_IMAGES_NAMES[i];
        _cubeFacesMaterials.push(
            new THREE.MeshBasicMaterial({
                map: _loader.load(_img_path),
                color: 0xffffff, // white
                side: THREE.BackSide // inside the cube
            })
        );
    }

    return _cubeFacesMaterials;
}

export default ModelSkybox