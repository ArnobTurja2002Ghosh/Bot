import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Character } from './Character.js';
import { Bot } from './Bot.js';
import { GameMap } from './GameMap.js';

// Create Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const orbitControls = new OrbitControls(camera, renderer.domElement);

// Create GameMap
const gameMap = new GameMap();

// Create clock
const clock = new THREE.Clock();

// Create NPC
const bot = new Bot(new THREE.Color(0x0000ff), gameMap);

// Setup our scene
function setup() {

	scene.background = new THREE.Color(0xffffff);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera.position.y = 80;
	camera.lookAt(0,0,0);

	//Create Light
	let directionalLight = new THREE.DirectionalLight(0xffffff, 2);
	directionalLight.position.set(0, 25, 0);
	scene.add(directionalLight);

	// initialize our gameMap
	gameMap.init(scene);


	// set character locations 
	bot.location = gameMap.localize(gameMap.graph.nodes[20]);
	console.log(bot.location);
	console.log(gameMap.quantize(bot.location));

	// add our characters to the scene
	scene.add(bot.gameObject);

	//First call to animate
	animate();
}


// animate
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);


	let deltaTime = clock.getDelta();

	bot.update(deltaTime, gameMap);
	
	orbitControls.update();
}


setup();