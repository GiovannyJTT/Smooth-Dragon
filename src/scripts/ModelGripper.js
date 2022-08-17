
import GPT_Model from "../libgptjs/GPT_Model";
import CoordsGripper from "./CoordsGripper";

/**
 * Creates a Robot model by computing its triangles and normals
 * Inherits from GPT_Model and overrides get_geometry and get_material
 */
function ModelGripper () {
    this.coords = new CoordsGripper(); 

    // 1. Call parent object
    GPT_Model.call(this);
}

// 2. Extend from parent object prototype (keep proto clean)
ModelGripper.prototype = Object.create(GPT_Model.prototype);

// 3. Repair the inherited constructor
ModelGripper.prototype.constructor = ModelGripper;

/**
 * Overriding it
 */
ModelGripper.prototype.get_geometry = function () {
        
}

/**
 * Overriding it
 */
ModelGripper.prototype.get_material = function () {

}

export default ModelGripper