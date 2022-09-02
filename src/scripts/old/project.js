//GPC - Proyecto
//ALUMNO: Giovanny J. Tipantuña Toapanta
//GPC - proyecto - iluminación - smoothing - uvs - bump map - vertex normals Coordinates.js, dat.gui.min.js, THREE.JS

var renderer, scene, camera, controladorCamara;
var misLuces, effectControllerDragon = null, effectControllerRobot = null;


function setupGui(){
	//definicion de los controles
	effectControllerRobot = {
		mensaje: 'InterfazR', //caja de texto
		gBaseY: 22.0, //slider
		gBrazoZ: 25.0,
		gAntBrY: 0.0,
		gAntBrZ: -58.0,
		gManoZ: 11.0,
		PinzasZ: 15.0,
		despZ: 100.0,
		sombras: true, //recuadro de validacion checkbox
		colorRobot: 'rgb(18, 71, 0)' //color
	};

	effectControllerDragon = {
		mensaje: 'InterfazD', //caja de texto
		giroY: 0.0, //slider
		despX: 0.0,
		separacion: [], //caja desplegable con items y valores por defecto dados
		sombras: true, //recuadro de validacion checkbox
		smoothing: false,
		colorDragonEmissive: 'rgb(50,100,0)' //color
	};

	effectControllerLuces = {
		mensaje: 'InterfazL',
		lAmbiente: lAmbienteDef,
		lAmbReset: false,
		lPuntual: lPuntualDef,
		lPunReset: false,
		lDireccional: lDireccionalDef,
		lDirReset: false,
		lFocal: lFocalDef,
		lFocReset: false
	};

	//interfaz grafica de usuario
	var gui = new dat.GUI(); //Desplegable

	var cr = gui.addFolder('Control Robot');
	//creación conjunto de efectos
	cr.add(effectControllerRobot, 'mensaje').name('Mover = Teclas');
	//add(effectControllerRobot, parametro, valores).name(etiqueta)
	//'Mover = Teclas' se almacena en la variable mensaje del diccionario effectControllerRobot
	cr.add(effectControllerRobot, 'gBaseY', -180.0, 180.0, 0.025).name('GBaseY');
	cr.add(effectControllerRobot, 'gBrazoZ', -45.0, 45.0, 0.025).name('GBrazoZ');
	cr.add(effectControllerRobot, 'gAntBrY', -180.0, 180.0, 0.025).name('GAntBrY');
	cr.add(effectControllerRobot, 'gAntBrZ', -90.0, 90.0, 0.025).name('GAntBrZ');
	cr.add(effectControllerRobot, 'gManoZ', -40.0, 220.0, 0.025).name('GManoZ');
	cr.add(effectControllerRobot, 'PinzasZ', 0.0, 15.0, 0.025).name('PinzasZ');
	cr.add(effectControllerRobot, 'despZ', -100.0, 100.0, 5).name('Desp Z');
	cr.add(effectControllerRobot, 'sombras').name('Sombras');
	cr.addColor(effectControllerRobot, 'colorRobot').name('Especular Robot'); //paleta de colores

	var cd = gui.addFolder('Control Dragon');
	cd.add(effectControllerDragon, 'mensaje').name('GUI control dragon');
	cd.add(effectControllerDragon, 'giroY', -180.0, 180.0, 0.025).name('Giro en Y');
	cd.add(effectControllerDragon, 'despX', -400.0, 400.0, 5).name('Desp X');
	cd.add(effectControllerDragon, 'separacion', {Ninguna: 0, Media: 200, Total:500}).name('Separacion');
	cd.add(effectControllerDragon, 'sombras').name('Sombras');
	cd.add(effectControllerDragon, 'smoothing').name('Smoothing');
	cd.addColor(effectControllerDragon, 'colorDragonEmissive').name('Emissive Dragon'); //paleta de colores

	var cl = gui.addFolder('Control Luces');
	cl.addColor(effectControllerLuces, 'lAmbiente').name('LAmbiente').listen(); //con listen podemos machacar los valores de los sliders y hacer que se muevan
	cl.add(effectControllerLuces, 'lAmbReset').name('LAmbReset').listen();
	cl.addColor(effectControllerLuces, 'lPuntual').name('LPuntual').listen(); //paleta de colores
	cl.add(effectControllerLuces, 'lPunReset').name('LPunReset').listen();
	cl.addColor(effectControllerLuces, 'lDireccional').name('LDireccional').listen(); //paleta de colores
	cl.add(effectControllerLuces, 'lDirReset').name('LDirReset').listen();
	cl.addColor(effectControllerLuces, 'lFocal').name('LFocal').listen(); //paleta de colores
	cl.add(effectControllerLuces, 'lFocReset').name('LFocReset').listen();
}


function miVec3(x,y,z){
	this.x = x; this.y = y; this.z = z;
}


function miLuz(tipo, pos){
	this.tipo = tipo; this.pos = pos;
}

//valores por defecto de las luces
var lAmbienteDef = 0x0d0d0d;
var lPuntualDef = 0xbfbfbf;
var lDireccionalDef = 0xbfbfbf;
var lFocalDef = 0xbfbfbf;

var luzAmbiente; //no le gusta en zonas de memoria contiguas
var luzPuntual;
var luzDireccional;
var luzFocal;

function crearIluminacion(rend, sce){
	var luces = [
		new miLuz('ambiente', new miVec3(0,0,0)),
		new miLuz('puntual', new miVec3(0, 100, 50)),
		new miLuz('direccional', new miVec3(-200, 200, 0)),
		new miLuz('focal', new miVec3(50, 330, -150))
	];

	rend.shadowMapEnabled = true; //habilitamos sombras en el motor

	luzAmbiente = new THREE.AmbientLight(lAmbienteDef); //5%
	//luz blanca tenue, no tiene posicion
	sce.add(luzAmbiente);

	luzPuntual = new THREE.PointLight(lPuntualDef, 1.0); //75%
	luzPuntual.position.set(luces[1].pos.x, luces[1].pos.y, luces[1].pos.z);
	sce.add(luzPuntual);
	var pLHelper = new THREE.PointLightHelper( luzPuntual, 10 );
	sce.add(pLHelper);

	luzDireccional = new THREE.DirectionalLight(lDireccionalDef, 1.0);
	luzDireccional.position.set(luces[2].pos.x, luces[2].pos.y, luces[2].pos.z); //direccion del vector de iluminacion
	sce.add(luzDireccional);
	var dLHelper = new THREE.DirectionalLightHelper( luzDireccional, 10 );
	sce.add(dLHelper);

	luzFocal = new THREE.SpotLight(lFocalDef, 1.0);
	luzFocal.position.set(luces[3].pos.x, luces[3].pos.y, luces[3].pos.z);
	luzFocal.target.position.set(0, 0, 0); //direccion principal se indica con el punto target
	luzFocal.angle = Math.PI/8;
	luzFocal.distance = 1000;
	luzFocal.exponent = 7.5; //atenuación desde el vector de direccion
	sce.add(luzFocal);
	var sLHelper = new THREE.SpotLightHelper( luzFocal );
	sce.add(sLHelper);

	//----SOMBRAS----
	//En Threejs solo las luces focales producen sombra
	luzFocal.castShadow = true;
	luzFocal.shadowCameraNear = 5;
	luzFocal.shadowCameraFar = 1000;
	luzFocal.shadowCameraFov = 45; //grados
	luzFocal.shadowDarkness = 0.3;
	luzFocal.shadowCameraVisible = true; //muestra el frustum de la sombra
}


function init(){
	renderer = new THREE.WebGLRenderer();
	//instancia canvas 3D para el navegador en el que se cargue este script (firefox, chrome, etc)
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor(new THREE.Color(0x002233), 1.0);
	document.getElementById("container").appendChild(renderer.domElement);

	scene = new THREE.Scene();

	//---------CAMARA------------
	var aspectRatio = window.innerWidth/window.innerHeight;
	//aR entre camara y pantalla deben coicidir

	camera = new THREE.PerspectiveCamera(40, aspectRatio, 1, 5000);
	//fieldOfView_Y(ancho de campo) en grados, aspectRatio, dist plano near, dist plano far

	camera.position.set(0, 275, 500); //y mirando hacia el origen 000
	camera.lookAt(new THREE.Vector3(0, 80, 0));

	//-------MovimientoCamara-----
	controladorCamara = new THREE.OrbitControls(camera, renderer.domElement);
	controladorCamara.target.set(0, 100, 0);
	controladorCamara.noKeys = true; //bloqueamos movimiento de camara con teclas

	//---------ILUMUNACION--------
	misLuces = crearIluminacion(renderer, scene);

	//----------EVENTOS-----------
	window.addEventListener("resize", updateAspectRatio);
	//actualizar dibujo cada vez que se redimensiona
	window.addEventListener("keydown", onKeyDown, false);
}

function asignarUVs(geom){
	geom.computeBoundingBox();
	var max = geom.boundingBox.max;
	var min = geom.boundingBox.min;
	var desplaz = new THREE.Vector2(0 - min.x, 0 - min.y);
	var intervalo = new THREE.Vector2(max.x - min.x, max.y - min.y);

	geom.faceVertexUvs[0] = [];
	var caras = geom.faces;

	for (i = 0; i < geom.faces.length ; i++) {
		var v1 = geom.vertices[caras[i].a];
		var v2 = geom.vertices[caras[i].b];
		var v3 = geom.vertices[caras[i].c];

		geom.faceVertexUvs[0].push([
		  new THREE.Vector2( ( v1.x + desplaz.x ) / intervalo.x , ( v1.y + desplaz.y ) / intervalo.y ),
		  new THREE.Vector2( ( v2.x + desplaz.x ) / intervalo.x , ( v2.y + desplaz.y ) / intervalo.y ),
		  new THREE.Vector2( ( v3.x + desplaz.x ) / intervalo.x , ( v3.y + desplaz.y ) / intervalo.y )
			]);
	}
	geom.uvsNeedUpdate = true;
}

function crearGeomPinza(){
	var puntos = [];
	puntos.push(new miVec3(0,0,0));  puntos.push(new miVec3(0,20,0));
	puntos.push(new miVec3(19,20,0));  puntos.push(new miVec3(19,0,0));
	puntos.push(new miVec3(0,20,4));  puntos.push(new miVec3(0,0,4));
	puntos.push(new miVec3(19,20,4));  puntos.push(new miVec3(19,0,4));
	puntos.push(new miVec3(38,5,4));  puntos.push(new miVec3(38,15,4));
	puntos.push(new miVec3(38,5,2));  puntos.push(new miVec3(38,15,2));

	var triangulos = []; //normales de las caras en threejs pordefecto en sentido horario
	//frontal horario
	triangulos.push(new miVec3(2,0,1));  triangulos.push(new miVec3(3,0,2));
	triangulos.push(new miVec3(11,3,2));  triangulos.push(new miVec3(10,3,11));
	//trasera horario
	triangulos.push(new miVec3(6,4,5));  triangulos.push(new miVec3(7,6,5));
	triangulos.push(new miVec3(9,6,7));  triangulos.push(new miVec3(8,9,7));
	//superior horario
	triangulos.push(new miVec3(2,1,4));  triangulos.push(new miVec3(6,2,4));
	triangulos.push(new miVec3(11,2,6));  triangulos.push(new miVec3(9,11,6));
	//inferior horario
	triangulos.push(new miVec3(5,0,3));  triangulos.push(new miVec3(7,5,3));
	triangulos.push(new miVec3(10,7,3)); triangulos.push(new miVec3(8,7,10));
	//laterales horario
	triangulos.push(new miVec3(4,1,5)); triangulos.push(new miVec3(1,0,5));
	triangulos.push(new miVec3(10,11,9)); triangulos.push(new miVec3(8,10,9));

	var g = new THREE.Geometry();
	var nP = puntos.length;
	for(var i=0; i < nP; i++)
		g.vertices.push(new THREE.Vector3(puntos[i].x, puntos[i].y, puntos[i].z));
	var nT = triangulos.length;
	for(var i=0; i < nT; i++){
		//[computer graphics, hearn & baker]
		var v1 = new THREE.Vector3(
			//destino - origen
			puntos[ triangulos[i].y ].x - puntos[ triangulos[i].x ].x,
			puntos[ triangulos[i].y ].y - puntos[ triangulos[i].x ].y,
			puntos[ triangulos[i].y ].z - puntos[ triangulos[i].x ].z
			);
		var v2 = new THREE.Vector3(
			//destino - origen
			puntos[ triangulos[i].z ].x - puntos[ triangulos[i].y ].x,
			puntos[ triangulos[i].z ].y - puntos[ triangulos[i].y ].y,
			puntos[ triangulos[i].z ].z - puntos[ triangulos[i].y ].z
			);
		var normal = 
			new THREE.Vector3(
				v1.y * v2.z - v1.z * v2.y ,
				v1.z * v2.x - v1.x * v2.z ,
				v1.x * v2.y - v1.y * v2.x
			);
		var mod = Math.sqrt(normal.x*normal.x + normal.y*normal.y + normal.z*normal.z);
		//mod = (mod < 0.00001)? 0.00001 : mod;
		normal.x = normal.x/mod; normal.y = normal.y/mod; normal.z = normal.z/mod;
		g.faces.push( new THREE.Face3(triangulos[i].x, triangulos[i].y, triangulos[i].z, normal) );
		//calculando bien las normales y pasandolas a Face3 podemos
		//observar que la iluminación por triangulo se calcula correctamente
		//en funcion de la posicion de la fuente de iluminacion.
		//Como munyeca(cilindro) y pinzas(triangulos) no son una sola malla
		//se puede observar que la luz 'bloqueda' por una de las pinzas
		//finalmente si 'aparece' en el cilindro. Es logico ya que no se trata
		//de un unico objeto solido.
	}
	asignarUVs(g);
	return g;
}


/*
function simularFuentesLuz(sce){
	var mLuz = new THREE.MeshBasicMaterial({color : 0xffffff, wireframe : true});
	var l = []; nLuces = misLuces.length;
	for(var i=0; i < nLuces; i++){
		var gLuz = null; r = 5;
		switch(misLuces[i].tipo){
			case 'ambiente':
				gLuz = new THREE.CylinderGeometry(r*20, 0, 0, 18, 0);
				l.push( new THREE.Mesh(gLuz, mLuz) );
				l[i].position.set(misLuces[i].pos.x, misLuces[i].pos.y, misLuces[i].pos.z);
				break;
			case 'puntual':
				gLuz = new THREE.SphereGeometry(r, 6, 6);
				l.push( new THREE.Mesh(gLuz, mLuz) );
				l[i].position.set(misLuces[i].pos.x, misLuces[i].pos.y, misLuces[i].pos.z);
				break;
			case 'direccional':
				var origen = misLuces[i].pos;	var longitud = r*8; var color = 0xffffff;
				var mod = Math.sqrt(
					misLuces[i].pos.x*misLuces[i].pos.x +
					misLuces[i].pos.y*misLuces[i].pos.y +
					misLuces[i].pos.z*misLuces[i].pos.z);
				var dir = new THREE.Vector3(
					-misLuces[i].pos.x/mod, -misLuces[i].pos.y/mod, -misLuces[i].pos.z/mod); //debe ir normalizado a 1
				var headLongitud = r*2; headAnchura = r*2;
				var gLuz = new THREE.ArrowHelper(dir, origen, longitud, color, headLongitud, headAnchura);
				l.push( gLuz );
				break;
			case 'focal':
				gLuz = new THREE.BoxGeometry(r, r, r);
				l.push( new THREE.Mesh(gLuz, mLuz) );
				l[i].position.set(misLuces[i].pos.x, misLuces[i].pos.y, misLuces[i].pos.z);
				break;
		}
		sce.add( l[i] );
	}
}
*/


//Objetos de agrupamiento
//robot = base + brazo[]
//brazo = eje + esparrago + rotula + antebrazo[]
//antebrazo = disco + nervios[] + mano
//mano = munyeca + pinzaIzq + pinzaDer
var robot = new THREE.Object3D();
var brazo = new THREE.Object3D();
var antebrazo = new THREE.Object3D;
var mano = new THREE.Object3D();
var dragon = null, pinzaIzq = null, pinzaDer = null; //inicialmente

function loadScene(){
	var ejesAyuda = new THREE.AxisHelper(200);
	ejesAyuda.position.set(0,0.2,0);

	//simularFuentesLuz(scene);

	//texturas
	//CUBEMAP EN LA ROTULA
	var path = './threejs/gpc_proyecto/imagenes/Yokohama3/';
	var urls = [
		path + 'posx.jpg', path + 'negx.jpg', path + 'posy.jpg', path + 'negy.jpg',
		path + 'posz.jpg', path + 'negz.jpg'];
	var mapaEntorno = THREE.ImageUtils.loadTextureCube(urls);
	mapaEntorno.format = THREE.RGBFormat;

	//loadTexture en chrome solo funciona en el servidor. en firefox funciona siempre
	var tSuelo = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/madera1.jpg');
	var tBase = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/granito1.jpg');
	var tEje = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/metal2.jpg');
	var tEsparrago = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/metal1.jpg');
	var tEsparragoBumpMap = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/metal1.jpg');
	var tRotula = mapaEntorno;
	var tDisco = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/bump1.jpg');
	var tDiscoBumpMap = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/bump1.jpg');
	var tNervio = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/bump2.jpg');
	var tNervioBumpMap = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/bump2.jpg');
	var tMunyeca = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/bump1.jpg');
	var tMunyecaBumpMap = new THREE.ImageUtils.loadTexture('./threejs/gpc_proyecto/imagenes/bump1.jpg');

	tSuelo.wrapS = tSuelo.wrapT = THREE.RepeatWrapping;
	tSuelo.repeat.set(5, 5);
	tSuelo.magFilter = THREE.LinearFilter; //pixel menor que texel
	tSuelo.minFilter = THREE.LinearFilter; //texel menor que pixel

	tBase.wrapS = tBase.wrapT = THREE.RepeatWrapping;
	tBase.repeat.set(5, 1);
	tBase.magFilter = THREE.LinearFilter;
	tBase.minFilter = THREE.LinearFilter;

	tEje.wrapS = tEje.wrapT = THREE.RepeatWrapping;
	tEje.repeat.set(2, 0.5);
	tEje.magFilter = THREE.LinearFilter;
	tEje.minFilter = THREE.LinearFilter;

	tEsparrago.wrapS = tEsparrago.wrapT = THREE.RepeatWrapping;
	tEsparrago.repeat.set(0.5, 1);
	tEsparrago.magFilter = THREE.LinearFilter;
	tEsparrago.minFilter = THREE.LinearFilter;

	tEsparragoBumpMap.wrapS = tEsparragoBumpMap.wrapT = THREE.RepeatWrapping;
	tEsparragoBumpMap.repeat.set(0.5, 1);
	tEsparragoBumpMap.magFilter = THREE.LinearFilter;
	tEsparragoBumpMap.minFilter = THREE.LinearFilter;

	tRotula.wrapS = tRotula.wrapT = THREE.RepeatWrapping;
	tRotula.repeat.set(1, 1);
	tRotula.magFilter = THREE.LinearFilter;
	tRotula.minFilter = THREE.LinearFilter;

	tDisco.wrapS = tDisco.wrapT = THREE.RepeatWrapping;
	tDisco.repeat.set(5, 0.25);
	tDisco.magFilter = THREE.LinearFilter;
	tDisco.minFilter = THREE.LinearFilter;

	tDiscoBumpMap.wrapS = tDiscoBumpMap.wrapT = THREE.RepeatWrapping;
	tDiscoBumpMap.repeat.set(5, 0.25);
	tDiscoBumpMap.magFilter = THREE.LinearFilter;
	tDiscoBumpMap.minFilter = THREE.LinearFilter;

	tNervio.wrapS = tNervio.wrapT = THREE.RepeatWrapping;
	tNervio.repeat.set(0.1, 5);
	tNervio.magFilter = THREE.LinearFilter;
	tNervio.minFilter = THREE.LinearFilter;

	tNervioBumpMap.wrapS = tNervioBumpMap.wrapT = THREE.RepeatWrapping;
	tNervioBumpMap.repeat.set(0.1, 5);
	tNervioBumpMap.magFilter = THREE.LinearFilter;
	tNervioBumpMap.minFilter = THREE.LinearFilter;

	tMunyeca.wrapS = tMunyeca.wrapT = THREE.RepeatWrapping;
	tMunyeca.repeat.set(5, 1);
	tMunyeca.magFilter = THREE.LinearFilter;
	tMunyeca.minFilter = THREE.LinearFilter;

	tMunyecaBumpMap.wrapS = tMunyecaBumpMap.wrapT = THREE.RepeatWrapping;
	tMunyecaBumpMap.repeat.set(5, 1);
	tMunyecaBumpMap.magFilter = THREE.LinearFilter;
	tMunyecaBumpMap.minFilter = THREE.LinearFilter;

	//objetos individuales
	//Materiales
	var mSuelo =
		new THREE.MeshPhongMaterial(
		{color : 0xb35900, emissive : 0x101010, shading : THREE.SmoothShading, specular : 0x111A11,
		shininess : 50, metal : false, map : tSuelo, side : THREE.FrontSide});
	//Default is THREE.FrontSide. Other options are THREE.BackSide and THREE.DoubleSide.
	var mBase = 
		new THREE.MeshPhongMaterial(
		{color : 0x404040, emissive : 0x101010, shading : THREE.SmoothShading, specular : 0x111111,
		shininess : 0, metal : false, map : tBase, side : THREE.FrontSide});
	var mEje = 
		new THREE.MeshPhongMaterial(
		{color : 0xffe5e5, emissive : 0x101010, shading : THREE.SmoothShading, specular : 0x111111,
		shininess : 70, metal : true, map : tEje, side : THREE.FrontSide});
	var mEsparrago = 
		new THREE.MeshPhongMaterial(
		{color : 0xffe5e5, emissive : 0x101010, shading : THREE.SmoothShading, specular : 0x111111,
		shininess : 50, metal : true, map : tEsparrago, side : THREE.FrontSide, bumpMap : tEsparragoBumpMap});
	var mRotula = 
		new THREE.MeshPhongMaterial(
		{color : 0xffe5e5, emissive : 0xff9999, shading : THREE.SmoothShading, envMap : tRotula, side : THREE.FrontSide});
	var mDisco = 
		new THREE.MeshPhongMaterial(
		{color : 0xffe5e5, emissive : 0x101010, shading : THREE.SmoothShading, specular : 0x111111,
		shininess : 90, metal : true, map : tDisco, side : THREE.FrontSide, bumpMap : tDiscoBumpMap});
	var mNervio = 
		new THREE.MeshPhongMaterial(
		{color : 0xffe5e5, emissive : 0x101010, shading : THREE.SmoothShading, specular : 0x111111,
		shininess : 80, metal : true, map : tNervio, side : THREE.FrontSide, bumpMap : tNervioBumpMap});
	var mMunyeca = 
		new THREE.MeshPhongMaterial(
		{color : 0xffe5e5, emissive : 0x101010, shading : THREE.SmoothShading, specular : 0x111111,
		shininess : 50, metal : true, map : tMunyeca, side : THREE.FrontSide, bumpMap : tDiscoBumpMap});
	var mPinza = 
		new THREE.MeshPhongMaterial(
		{color : 0xffffe5, emissive : 0xff9999, shading : THREE.SmoothShading, specular : 0xb3ffb3,
		shininess : 70, metal : true, side : THREE.FrontSide, envMap : mapaEntorno});

	var mDragon = 
		new THREE.MeshPhongMaterial(
		{color : 0xe5ffe5, emissive : 0xb4ef3e, shading : THREE.SmoothShading, specular : 0x003300,
		shininess : 70, metal : false, side : THREE.FrontSide, transparent : true, opacity : 0.8, envMap : mapaEntorno});

	var shader = THREE.ShaderLib.cube;
	shader.uniforms.tCube.value = mapaEntorno;
	var mHabitacion = 
		new THREE.ShaderMaterial({
			fragmentShader : shader.fragmentShader,
			vertexShader : shader.vertexShader,
			uniforms : shader.uniforms,
			depthWrite : false,
			side : THREE.BackSide
		});

	//Geometrias
	var tamSuelo = 1000;
	var gSuelo = new THREE.PlaneGeometry(tamSuelo, tamSuelo, 20, 20);
	var gBase = new THREE.CylinderGeometry(50, 50, 15, 18, 1);
	var gEje = new THREE.CylinderGeometry(20, 20, 18, 18, 1);
	var gEsparrago = new THREE.BoxGeometry(18, 120, 12);
	var gRotula = new THREE.SphereGeometry(20, 10, 10);
	var gDisco = new THREE.CylinderGeometry(22, 22, 6, 18, 1);
	var gNervio = new THREE.BoxGeometry(4, 80, 4);
	var gMunyeca = new THREE.CylinderGeometry(15, 15, 40, 18, 1);
	var gPinza = crearGeomPinza();
	var gDragon = crearGeomDragon();
	var tamHabitacion = tamSuelo*5;
	var gHabitacion = new THREE.CubeGeometry(tamHabitacion, tamHabitacion, tamHabitacion);

	//Mallas (Geometria + Material)
	var suelo = new THREE.Mesh(gSuelo, mSuelo);
	var base = new THREE.Mesh(gBase, mBase);
	var eje = new THREE.Mesh(gEje, mEje);
	var esparrago = new THREE.Mesh(gEsparrago, mEsparrago);
	var rotula = new THREE.Mesh(gRotula, mRotula);
	var disco = new THREE.Mesh(gDisco, mDisco);
	var nervio1 = new THREE.Mesh(gNervio, mNervio);
	var nervio2 = new THREE.Mesh(gNervio, mNervio);
	var nervio3 = new THREE.Mesh(gNervio, mNervio);
	var nervio4 = new THREE.Mesh(gNervio, mNervio);
	var munyeca = new THREE.Mesh(gMunyeca, mMunyeca);
	pinzaDer = new THREE.Mesh(gPinza, mPinza);
	pinzaIzq = new THREE.Mesh(gPinza, mPinza);
	dragon = new THREE.Mesh(gDragon, mDragon);
	var habitacion = new THREE.Mesh(gHabitacion, mHabitacion);

	//Configurando producir y recibir sombras
	suelo.castShadow = false; suelo.receiveShadow = true;
	base.castShadow = true; base.receiveShadow = true;
	eje.castShadow = true; eje.receiveShadow = true;
	esparrago.castShadow = true; esparrago.receiveShadow = true;
	rotula.castShadow = true; rotula.receiveShadow = true;
	disco.castShadow = true; disco.receiveShadow = true;
	nervio1.castShadow = true; nervio1.receiveShadow = true;
	nervio2.castShadow = true; nervio2.receiveShadow = true;
	nervio3.castShadow = true; nervio3.receiveShadow = true;
	nervio4.castShadow = true; nervio4.receiveShadow = true;
	munyeca.castShadow = true; munyeca.receiveShadow = true;
	pinzaIzq.castShadow = true; pinzaIzq.receiveShadow = true;
	pinzaDer.castShadow = true; pinzaDer.receiveShadow = true;
	dragon.castShadow = true; dragon.receiveShadow = true;
	habitacion.castShadow = false; habitacion.receiveShadow = false;

	//toda la mano
	pinzaDer.position.set(0, -10, -7);
	pinzaIzq.rotation.x = -Math.PI;
	pinzaIzq.position.set(0, 10, 7);

	munyeca.rotation.set(Math.PI/2, 0, 0);
	mano.add(pinzaIzq);
	mano.add(pinzaDer);
	mano.add(munyeca);
	mano.position.set(0,80,0);

	//todo el antebrazo
	nervio1.position.set(8, 40, 8);
	nervio2.position.set(8, 40, -8);
	nervio3.position.set(-8, 40, 8);
	nervio4.position.set(-8, 40, -8);

	antebrazo.add(disco);
	antebrazo.add(nervio1);
	antebrazo.add(nervio2);
	antebrazo.add(nervio3);
	antebrazo.add(nervio4);
	antebrazo.add(mano);
	antebrazo.position.set(0, 110, 0)

	//todo el brazo
	eje.rotation.set(Math.PI/2, 0, 0);
	esparrago.position.set(0, 50, 0);
	rotula.position.set(0, 110, 0);

	brazo.add(eje);
	brazo.add(esparrago);
	brazo.add(rotula);
	brazo.add(antebrazo);

	//todo el robot
	robot.add(base);
	robot.add(brazo);
	robot.position.set(0, 7.5, 0);

	//todo el dragon
	dragon.scale.set(1000,1000,1000);
	dragon.position.set(150, -50, -100);

	//todo el escenario
	suelo.rotation.set(-Math.PI/2, 0, 0);
	scene.add(suelo);
	scene.add(robot);
	scene.add(dragon);
	scene.add(habitacion);
	scene.add(ejesAyuda);
}


function updateAspectRatio(){
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
    console.log("window resized: " + window.innerWidth + " x " + window.innerHeight);
}

function recorreGrafoSombras(raiz, valor){
	raiz.traverse( function( object ) {
		if( object instanceof THREE.Mesh ){
			object.castShadow = valor;
			object.receiveShadow = valor;
		}
	});
}

function recorreGrafoColores(raiz, valor){
	raiz.traverse( function( object ){
		if ( object instanceof THREE.Mesh ){
			object.material.setValues({specular : valor});
		}
	});
}

var ultValorSmoothing = false;
function recorreGrafoSmoothing(raiz, valor){
	if(valor != ultValorSmoothing)
		raiz.traverse( function( object ){
			if ( object instanceof THREE.Mesh ){
				ultValorSmoothing = valor;
				if(valor)
					object.geometry = crearGeomDragon(true); //flag para smoothing
				else
					object.geometry = crearGeomDragon(false);

			}
		});
}


//---para animacion----
var anguloR = 0.0, anguloD = 0.0;
var teclas = { iz : 37, der : 39, arr : 38, aba : 40};
var posR = new miVec3(0.0, 7.5, 0.0), step = 5;
function onKeyDown(e){
	switch(e.keyCode){
		case teclas.iz:
			posR.x -= step;
			break;
		case teclas.der:
			posR.x += step;
			break;
		case teclas.arr:
			posR.z -= step;
			break;
		case teclas.aba:
			posR.z += step;
			break;
	}
}

var ultAmbienteReset, ultPuntualReset, ultlDireccionalReset, ultlFocalReset = false;

function update(){
	controladorCamara.update();

	//----animacion----
	to_radians = Math.PI/180;
	anguloR += 0.02;
	anguloR = (anguloR >= 360)? 0 : anguloR;
	anguloD = -anguloR/4;

	//----actualizacion con los sliders robot----
	robot.rotation.y = anguloR + effectControllerRobot.gBaseY * to_radians; //sigue rotando
	brazo.rotation.z = effectControllerRobot.gBrazoZ * to_radians;
	antebrazo.rotation.y = effectControllerRobot.gAntBrY * to_radians;
	antebrazo.rotation.z = effectControllerRobot.gAntBrZ * to_radians;
	mano.rotation.z = effectControllerRobot.gManoZ * to_radians;
	pinzaIzq.position.z = 7 + effectControllerRobot.PinzasZ/2;
	pinzaDer.position.z = -7 - effectControllerRobot.PinzasZ/2;

	robot.position.x = posR.x; robot.position.z = posR.z + effectControllerRobot.despZ; //MOVER Con TECLAS

	recorreGrafoSombras(robot, effectControllerRobot.sombras);
	recorreGrafoColores(robot, effectControllerRobot.colorRobot);

	//----actualizacion con los sliders dragon----
	dragon.rotation.y = anguloD + effectControllerDragon.giroY * to_radians;
	dragon.position.set(150 + effectControllerDragon.despX + effectControllerDragon.separacion/2, -50, -100);
	dragon.castShadow = effectControllerDragon.sombras;
	//como es una sola malla las sombras se activa/desactivan correctamente
	recorreGrafoSmoothing(dragon, effectControllerDragon.smoothing);
	dragon.material.setValues({emissive: effectControllerDragon.colorDragonEmissive});

	//----actualizaicon con los sliders de las luces----
	if(effectControllerLuces.lAmbReset){
		luzAmbiente.color.set( lAmbienteDef );
		effectControllerLuces.lAmbiente = lAmbienteDef;
		effectControllerLuces.lAmbReset = false;
	}
	else
		luzAmbiente.color.set( effectControllerLuces.lAmbiente );

	if(effectControllerLuces.lPunReset){
		luzPuntual.color.set( lPuntualDef );
		effectControllerLuces.lPuntual = lPuntualDef;
		effectControllerLuces.lPunReset = false;
	}
	else
		luzPuntual.color.set( effectControllerLuces.lPuntual );

	if(effectControllerLuces.lDirReset){
		luzDireccional.color.set( lDireccionalDef );
		effectControllerLuces.lDireccional = lDireccionalDef;
		effectControllerLuces.lDirReset = false;
	}
	else
		luzDireccional.color.set( effectControllerLuces.lDireccional );

	if(effectControllerLuces.lFocReset){
		luzFocal.color.set( lFocalDef );
		effectControllerLuces.lFocal = lFocalDef;
		effectControllerLuces.LFocResetset = false;
	}
	else
		luzFocal.color.set( effectControllerLuces.lFocal );
}


function render(){
	requestAnimationFrame(render);
	update();
	renderer.render(scene, camera);
}

//-----------INICIO_PROGRAMA----------
setupGui();
init();
loadScene();
render();