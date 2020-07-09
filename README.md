# Smooth-Dragon
WebGL project using ThreeJS, HTML5 and OOJS (object oriented javasctipt) for exploring several computer-graphics techniques: mesh creation, texture UVs mapping, lighting and shadows, bump mapping, surface smoothing, and User Interface (widgets).

This WebGL app can be visualized in github pages because is a "front-end" only (all models have been converted to data structures and stored in JS files for loading quickly).

## Geometry Creation

## Texture UVs mapping, 

## Lighting and Shadows

## Bump Mapping

## Surface Smoothing

## User Interface (widgets)

---
## Building Threejs.min

For reducing the transmision of data when loading our webgl app in the client web browser we can build a minified version of ThreeJS. This will compress and unify all the ThreeJS scripts in one.

* Tutorial for building Threejs.min using google closure compiler: [Link](https://github.com/mrdoob/three.js/wiki/Build-instructions)
* Using an online (unofficial) builder: [Link](http://marcinwieprzkowicz.github.io/three.js-builder/)

Summary (building Threejs.min using google closure compiler):

```bash
git clone --depth=30 https://github.com/mrdoob/three.js.git
cd ./three.js
npm install  # This will install google closure compiler dependencies (Youy need to install NodeJS for npm)
npm run build-closure
# "created build/three.module.js in 2.3s"

:"
ls -lh build/
total 3,0M
-rw-r--r-- 1 Gio 197121 1,2M jul.  8 16:01 three.js
-rw-r--r-- 1 Gio 197121 614K jul.  8 16:01 three.min.js
-rw-r--r-- 1 Gio 197121 1,2M jul.  8 16:01 three.module.js
"
```
