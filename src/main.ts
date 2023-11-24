import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import data from "./planets.json";
import "./style.css";

// base config
const dimensions = {
  x: window.innerWidth,
  y: window.innerHeight,
  sunR: 0.00465, // astronomical units
};

const canvas: HTMLCanvasElement = document.createElement("canvas");
canvas.setAttribute("id", "webgl");
document.body.appendChild(canvas);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  dimensions.x / dimensions.y,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({ canvas });
const controls = new OrbitControls(camera, renderer.domElement);

scene.add(camera);
scene.add(new THREE.AxesHelper());
camera.position.set(2, 1, 1);
renderer.setSize(dimensions.x, dimensions.y);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
controls.enableDamping = true;

// objects
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
});
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(dimensions.sunR * 100),
  material
);
scene.add(sun);
let orbit: THREE.Mesh<
  THREE.RingGeometry,
  THREE.MeshBasicMaterial,
  THREE.Object3DEventMap
>;
let orbitMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
data.forEach((planet) => {
  orbit = new THREE.Mesh(
    new THREE.RingGeometry(
      dimensions.sunR * 100 + planet.proximityS,
      dimensions.sunR * 100 + planet.proximityS + 0.005
    ),
    orbitMaterial
  );
  orbit.rotation.x = -(Math.PI / 2);
  scene.add(orbit);
});

// 1. create the sun... use Math.PI to calculate the distance of lights to sit on the sphere's body
// 2. create all planets orbit parts with the appropriate distance ratios ✅
// 3. create a sphere Mesh to represent all planets on their orbits
// 4. make planets rotate
// 5. make planets orbit
// 6. add accurate materials to planets
// 7. add some random stars all over the place
// 8. add some random clouds and rain animations on earth

// tick fn
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// events
window.addEventListener("resize", () => {
  dimensions.x = window.innerWidth;
  dimensions.y = window.innerHeight;
  camera.aspect = dimensions.x / dimensions.y;
  camera.updateProjectionMatrix();

  renderer.setSize(dimensions.x, dimensions.y);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

window.addEventListener("dblclick", async () => {
  if (!document.fullscreenElement) {
    await canvas.requestFullscreen();
  } else {
    await document.exitFullscreen();
  }
});
