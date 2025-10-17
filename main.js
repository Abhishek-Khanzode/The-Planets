import "./style.css";

import * as THREE from 'three';
import { gsap } from 'gsap';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

const hdrLoader = new HDRLoader();
hdrLoader.load(
  'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/moonlit_golf_2k.hdr',
  function (texture) {

    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.environment = texture;
    // scene.background = texture;

    renderer.render(scene, camera);
  }
);
// const rgbeLoader = new RGBELoader();
// rgbeLoader.load(
//   'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/moonlit_golf_4k.hdr', 
//   function (texture) {
//     texture.mapping = THREE.EquirectangularReflectionMapping;
//     scene.environment = texture;
//     // scene.background = texture;
//   }
// );



const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const canvas = document.querySelector('.world');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });


renderer.setPixelRatio(window.devicePixelRatio);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const colors = [0xff5733, 0x33ff57, 0x3357ff, 0xff33a1, 0xa133ff];
const segments = 30;
const radius = 1.5;
const orbitRadius = 5;
const textures = ["./csilla/color.png", "./earth/map.jpg", "./venus/map.jpg", "./volcanic/color.png"];
const spheres = new THREE.Group();


const starTextureLoader = new THREE.TextureLoader();
const starTexture = starTextureLoader.load("./stars.jpg");
starTexture.colorSpace = THREE.SRGBColorSpace;
const bigSphereGeometry = new THREE.SphereGeometry(50, 65, 65);
const bigSphereMaterial = new THREE.MeshStandardMaterial({ map: starTexture, side: THREE.BackSide });
const bigSphere = new THREE.Mesh(bigSphereGeometry, bigSphereMaterial);

bigSphere.position.set(0, 0, 0);
scene.add(bigSphere);

const sphereMesh = [];

for (let i = 0; i < 4; i++) {
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(textures[i]);
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: texture });
  const sphere = new THREE.Mesh(geometry, material);

  sphereMesh.push(sphere);
  texture.colorSpace = THREE.SRGBColorSpace;

  const angle = (i / 4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle);
  sphere.position.z = orbitRadius * Math.sin(angle);

  spheres.rotation.x = 0.1;
  spheres.position.y = -0.8;

  spheres.add(sphere);

}

scene.add(spheres);


// // 5. Lighting
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
// directionalLight.position.set(5, 5, 5);
// scene.add(directionalLight);



window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

  renderer.render(scene, camera);
}


camera.position.z = 9;


let lastWheelCount = 0;
const throttleDelay = 2000;
let scrollCount = 0;

function throttleWheelHandler(event) {
  const currentTime = Date.now();
  if (currentTime - lastWheelCount >= throttleDelay) {

    lastWheelCount = currentTime;
    const direction = event.deltaY > 0 ? "down" : "up";
    scrollCount = (scrollCount + 1) % 4;
    console.log(scrollCount);

    const headings = document.querySelectorAll(".header .text .box .heading");
    gsap.to(headings, {
      y: `-=${100}%`,
      duration: 2,
      ease: "power4.inOut"
    });

    gsap.to(spheres.rotation, {
      y: `-=${Math.PI / 2}`,
      duration: 2,
      ease: "expo.inOut"
    });

    if (scrollCount === 0) {
      gsap.to(headings, {
        y: `0`,
        duration: 2,
        ease: "power4.inOut"
      })
    }
  }

}

window.addEventListener("wheel", throttleWheelHandler);


// setInterval(() => {
//   gsap.to(spheres.rotation, {
//     y: `+=${Math.PI / 2}`,
//     duration: 2,
//     ease: "expo.easeInOut"
//   });
// }, 2000);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  for (let i = 0; i < sphereMesh.length; i++) {
    const sphere = sphereMesh[i];
    sphere.rotation.y += clock.getElapsedTime() * 0.00001;
  }
  renderer.render(scene, camera);
}


animate();