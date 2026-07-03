// this file is for the 3D model
import * as THREE from "three";
import "./style.css";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as lil from "lil-gui";
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3500,
);

let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#webgl"),
});
renderer.setSize(window.innerWidth, window.innerHeight);
// RGBE LOADER AND RESPONSIVENESS
const loader = new RGBELoader();
loader.load(
  "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/ferndale_studio_12_1k.hdr",
  function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
  },
);

// ambient light is looking very cool
// const ambientLight = new THREE.AmbientLight(0xffffff, 2)
// scene.add(ambientLight)

// GLB loader
const modelLoader = new GLTFLoader();

modelLoader.load("./car_model.glb", function (gltf) {
  scene.add(gltf.scene);

  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  console.log(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  camera.position.set(center.x, center.y, center.x + maxDim * 1.5);
  camera.lookAt(center);

  orbitControls.target.copy(center); // also fixes orbiting around the wrong point
  orbitControls.update();
});

// let boxGeometry = new THREE.BoxGeometry(1, 1, 1)
// let material = new THREE.MeshStandardMaterial({
//     color: `red`,
// })
// let cube = new THREE.Mesh(boxGeometry, material)
// scene.add(cube)

camera.position.z = 7;

let orbitControls = new OrbitControls(camera, document.querySelector("#webgl"));
orbitControls.enableDamping = true;
orbitControls.autoRotate = true;
orbitControls.autoRotateSpeed = 7;
orbitControls.minDistance = 600;
orbitControls.maxDistance = 3000;

//lilgui for orbit controls
// let gui = new lil.GUI()
// let orbitControlsFolder = gui.addFolder('Orbit Controls')
// orbitControlsFolder.add(orbitControls, 'autoRotate').name('Auto Rotate')
// orbitControlsFolder.add(orbitControls, 'autoRotateSpeed', 0, 20).name('Auto Rotate Speed')
// orbitControlsFolder.add(orbitControls, 'minDistance', 0, 100).name('Min Distance')
// orbitControlsFolder.add(orbitControls, 'maxDistance', 0, 1000).name('Max Distance')
// orbitControlsFolder.close()

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
function animate() {
  requestAnimationFrame(animate);
  orbitControls.update();
  renderer.render(scene, camera);
}

animate();
