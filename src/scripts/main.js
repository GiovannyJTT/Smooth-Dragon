/**
 * Description: WebGL app using ThreeJS, Html5 and OOJS for exploring surface smoothing technique
 * Using library: Graphical Programming with ThreeJS (GPT)
 * Author: Giovanny Javier Tipantuña Toapanta
 * Email: giovanny.jtt@gmail.com
 */


// declared as "const" because: block-scoped, cannot be updated but its properties yes, cannot be redeclared
const sce = configScene();
const ren = new GPT_Renderer(window.innerWidth, window.innerHeight, sce);
const app = new GPT_App(ren);

app.init();
app.run();
