import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import "./style.css";

// base config
const dimensions = {
  x: window.innerWidth,
  y: window.innerHeight,
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
camera.position.set(3, 3, 5);
renderer.setSize(dimensions.x, dimensions.y);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
controls.enableDamping = true;

// objects
const material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
});
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(cube);

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
