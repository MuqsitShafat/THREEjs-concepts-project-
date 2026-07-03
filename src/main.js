import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import colorImg from './assets/textures/color.jpg'
import normalImg from './assets/textures/normal.png'
import roughnessImg from './assets/textures/roughness.jpg'
import aoImg from './assets/textures/ao.jpg'
import heightImg from './assets/textures/height.png'
import * as lil from 'lil-gui'
let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

//! u can also use different geometry like sphere, torus, plane, etc
// let box = new THREE.BoxGeometry(1, 1, 1)
// let material = new THREE.MeshBasicMaterial({ color: 0x00ff00,wireframe: true })
// let cube = new THREE.Mesh(box, material)
// scene.add(cube)

// const geometry = new THREE.SphereGeometry( 1, 32, 16 );
// const material = new THREE.MeshBasicMaterial( { color: 0xffff00 ,wireframe: true} );
// const sphere = new THREE.Mesh( geometry, material );
// scene.add( sphere );

// const geometry = new THREE.CylinderGeometry( 3, 3, 5, 15, 10, true );
// const material = new THREE.MeshBasicMaterial( { color: 0xffff00 ,side: THREE.DoubleSide} );
// const cylinder = new THREE.Mesh( geometry, material );
// scene.add( cylinder );
camera.position.z = 3

//* adding studio lightning
// directional light with higher intensity
const highIntensityDirectionalLight = new THREE.DirectionalLight(0xffffff, 2)
highIntensityDirectionalLight.position.set(3,3,3)
scene.add(highIntensityDirectionalLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(2,2,1)
scene.add(directionalLight)

// ambient light is used to light up the scene from every side
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

// point light is used to light up the scene from a specific point
const pointLight = new THREE.PointLight(0xffffff, 1, 10,2)
pointLight.position.set(-0.6 ,0.4,.2)
scene.add(pointLight)

//! creating all the light helpers which are ading light in order to show from where the light is coming from
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 1)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, .2)
scene.add(pointLightHelper)

const highIntensityDirectionalLightHelper = new THREE.DirectionalLightHelper(highIntensityDirectionalLight, .5)
scene.add(highIntensityDirectionalLightHelper)

//? studying materials it only shows in lightning so u have to add light to the scene
// let box = new THREE.BoxGeometry(1, 1, 1)
// let material = new THREE.MeshStandardMaterial({ color: `red`, roughness: 0.5, metalness: .5 })
// let cube = new THREE.Mesh(box, material)
// scene.add(cube)

//! Texture loader is used to load the texture from the image
let loader = new THREE.TextureLoader();
let color     = loader.load(colorImg);
let normal    = loader.load(normalImg);
let roughness = loader.load(roughnessImg);
let ao        = loader.load(aoImg);
let height    = loader.load(heightImg);   

let box = new THREE.BoxGeometry(1, 1, 1)
let material = new THREE.MeshStandardMaterial({ map: color, normalMap: normal, roughnessMap: roughness, aoMap: ao}  )
let cube = new THREE.Mesh(box, material)
scene.add(cube)
// making responsive
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

//! lilgui is used to create a gui for the scene it is a pannel which alows to conrol the scene and the objects in it without refreshing the code 
//* all relevant lilgui code for materials and mesh 
let gui = new lil.GUI()

//* MATERIAL folder
const materialFolder = gui.addFolder('Material')
materialFolder.add(material, 'wireframe')
materialFolder.add(material, 'metalness', 0, 1, 0.01)
materialFolder.add(material, 'roughness', 0, 1, 0.01)
materialFolder.add(material, 'displacementScale', 0, 1, 0.01)
materialFolder.add(material, 'aoMapIntensity', 0, 3, 0.1)
materialFolder.add(material, 'normalScale', 0, 2, 0.01) // note: normalScale is a Vector2, see below
materialFolder.addColor(material, 'color')
materialFolder.close()


//* MESH folder (position, rotation, scale)
const meshFolder = gui.addFolder('Mesh')
meshFolder.add(cube.position, 'x', -5, 5, 0.1)
meshFolder.add(cube.position, 'y', -5, 5, 0.1)
meshFolder.add(cube.position, 'z', -5, 5, 0.1)
meshFolder.add(cube.rotation, 'x', 0, Math.PI * 2, 0.01)
meshFolder.add(cube.rotation, 'y', 0, Math.PI * 2, 0.01)
meshFolder.add(cube.rotation, 'z', 0, Math.PI * 2, 0.01)
meshFolder.add(cube.scale, 'x', 0.1, 3, 0.1).name('scale x')
meshFolder.add(cube.scale, 'y', 0.1, 3, 0.1).name('scale y')
meshFolder.add(cube.scale, 'z', 0.1, 3, 0.1).name('scale z')
meshFolder.close()

//* DIRECTIONAL LIGHT folder
const dirLightFolder = gui.addFolder('Directional Light')
dirLightFolder.add(directionalLight, 'intensity', 0, 5, 0.1)
dirLightFolder.add(directionalLight.position, 'x', -20, 20, 0.5)
dirLightFolder.add(directionalLight.position, 'y', -20, 20, 0.5)
dirLightFolder.add(directionalLight.position, 'z', -20, 20, 0.5)
dirLightFolder.close()

//* AMBIENT LIGHT folder
const ambientLightFolder = gui.addFolder('Ambient Light')
ambientLightFolder.add(ambientLight, 'intensity', 0, 2, 0.01)
ambientLightFolder.close()
//* POINT LIGHT folder
const pointLightFolder = gui.addFolder('Point Light')
pointLightFolder.add(pointLight, 'intensity', 0, 5, 0.1)
pointLightFolder.add(pointLight, 'distance', 0, 200, 1)
pointLightFolder.add(pointLight.position, 'x', -10, 10, 0.1)
pointLightFolder.add(pointLight.position, 'y', -10, 10, 0.1)
pointLightFolder.add(pointLight.position, 'z', -10, 10, 0.1)
pointLightFolder.close()

//?Orbit controls make it above animate function
let controls = new OrbitControls(camera, document.querySelector('#webgl'))
controls.enableDamping = true 
controls.dampingFactor = 0.01
// controls.autoRotate = true
// controls.autoRotateSpeed = 5
let renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl')
})
renderer.setSize(window.innerWidth, window.innerHeight)
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  // cube.rotation.x += 0.01
  // cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()