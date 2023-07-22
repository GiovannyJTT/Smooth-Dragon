/**
 * @module libgptjs Graphical Programming with ThreeJS (GPT)
 * @class GPT_LikedModel
 * @summary
 *      A LinkedModel is a structure that contains a THREE.Object3D as root
 *      and several children that form a final Model.
 *      It is used for creating a Model formed of several parts,
 *      for example a robot arm
 */

/**
 * Importing object THREE from our costumized global script
 */
import THREE from './external-libs/three-global'

/**
 * Contains a List of the Links (THREE.Object3D objects) to be configure as hierarchy
 * @attribute {Map} links is a `Map JS structure`
 *      It can be iterated in order of insertion and can have any object type as key
 */
function GPT_LinkedModel() {
    this.links = new Map();
}

/**
 * Enqueues a new THREE.Object3D into the children list
 * This new object will be linked with the previously enqueued
 */
GPT_LinkedModel.prototype.pushLink = function (name_, obj_) {
    this.links.set(name_, obj_);
}

/**
 * Creates the hierarchy of THREE.Object3D objects and attaches into the root object
 * From index 0 to N, it will be linking them 2 each time
 * @return {THREE.Object3D} root
 */
GPT_LinkedModel.prototype.createLinksHierarchy = function () {

    let _prevKey = undefined;
    let _prevValue = undefined;
    let i = 0;

    for (let [key, value] of this.links) {
        if (i == 0) {
            if ("root" != key) {
                console.error("GPT_LinkedModel.createLinksHierarchy: first key is not 'root'. Found: " + key);
                return;
            }
            else {
                _prevKey = key;
                _prevValue = value;
                i++;

                // jump to next iteration
                continue;
            }
        }

        // next iterations
        _prevValue.add(value);
        console.debug("GPT_LinkedModel.createLinksHierarchy: linked " + key + " to " + _prevKey);

        // update
        _prevKey = key;
        _prevValue = value;
        i++;
    }

    console.debug("GPT_LinkedModel.createLinksHierarchy: total nodes: " + this.links.size + ", total links: " + (this.links.size - 1));
    return this.links.get("root");
}

export default GPT_LinkedModel