console.log('Starting index.js: importing modules')

import './styles/index.scss'

// import this before the libgtpjs because it is adding functionality to object THREE
import './external-libs/threejs-0.118.3/OrbitControls'

import GPT_Model from './libgptjs/GPT_Model'
import GPT_Scene from './libgptjs/GPT_Scene'
import GPT_Render from './libgptjs/GPT_Renderer'
import GPT_APP from './libgptjs/GPT_App'

import './scripts/main'