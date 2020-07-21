/**
 * Library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 * Content: class GPT_Model
 * A model is an object containing all the meshes that form the "3D object" and share the same coordinates system
 * It can contain several "Mesh" objects. Every Mesh has to have 2 objects: Geometry and Material
 */

 /**
 * Importing object THREE from our costumized global script
 */
 import THREE from '../external-libs/threejs-0.118.3/three-global'

/**
 * Constructs a Model object. Saves the reference to individual geometry and material, and
 * creates the THREE.Mesh
 * @param {THREE.Geometry} geom 
 * @param {THREE.Material} mat 
 */
function GPT_Model(geom, mat)
{
    this.geometry = geom;
    this.material = mat;
    this.mesh = new THREE.Mesh(geom, mat);
}

export default GPT_Model;