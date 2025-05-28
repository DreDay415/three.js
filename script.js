import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let camera, scene, renderer;

init();
animate();

function init() {
	const container = document.createElement("div");
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		0.1,
		20
	);
	camera.position.set(-0.75, 0.7, 1.25);

	scene = new THREE.Scene();

	// Load HDR environment map
	new RGBELoader()
		.setPath("assets/")
		.load("watch_4k.jpg", function (texture) {
			texture.mapping = THREE.EquirectangularReflectionMapping;
			scene.background = texture;
			scene.environment = texture;
		});

	// Load watch model
	new GLTFLoader()
		.setPath("assets/")
		.load("watch_v1.glb", function (gltf) {
			const model = gltf.scene;
			scene.add(model);
		});

	// Renderer setup
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	container.appendChild(renderer.domElement);

	// Orbit controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0.1, 0);
	controls.update();

	// Handle window resize
	window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	renderer.setAnimationLoop(animate);
	renderer.render(scene, camera);
}