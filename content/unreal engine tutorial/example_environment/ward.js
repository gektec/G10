"use strict";

import * as THREE from 'three';
import { GLTFLoader } from 'three/GLTFLoader.js';
import { OrbitControls } from 'three/OrbitControls.js';

// 获取主容器
const container = document.getElementById('threejs-container-hello');

// 初始化场景
const scene = new THREE.Scene();
const width = 1200;
const height = 800;

// 创建相机
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(-5, 3, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement); // 将 canvas 添加到容器

// 创建一个新的 div 用于放置 dat.GUI 面板，使其显示在画布下方
const guiContainer = document.createElement('div');
guiContainer.style.position = 'relative';
guiContainer.style.marginTop = '10px'; // 根据需要调整间距
container.appendChild(guiContainer);

// 添加平行光
const light = new THREE.DirectionalLight(0xffffff, 4);
light.position.set(-5, 2, 0);
light.castShadow = true;
light.shadow.camera.left = -10;
light.shadow.camera.right = 10;
light.shadow.camera.top = 5;
light.shadow.camera.bottom = -5;
light.shadow.bias = -0.0005;
light.shadow.mapSize.width = 4096;
light.shadow.mapSize.height = 4096;
// 修改平行光目标方向为 (x, y, z)
light.target.position.set(-7, 1, 2);
scene.add(light.target,light); 


// 添加光源辅助对象，便于观察光的方向与范围
const lightHelper = new THREE.DirectionalLightHelper(light, 1);
scene.add(lightHelper);

// 添加环境光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// 加载模型文件
const loader = new GLTFLoader();
loader.load(
  'scene.gltf',
  (gltf) => {
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;    // 模型投射阴影
        child.receiveShadow = true; // 模型接收阴影
      }
    });
    scene.add(gltf.scene); // 将加载的模型加入场景
    controls.update();    // 模型加载后更新控制器
  },
  undefined,
  (error) => {
    console.error('Error loading model:', error);
  }
);

// 添加 OrbitControls 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = true;
controls.minDistance = 1;
controls.maxDistance = 100;
controls.target.set(-10, 0, 0);

// 使用 dat.GUI 快速调整光源位置和参数，并将其挂载到 guiContainer 中
const gui = new dat.GUI({ autoPlace: false });
guiContainer.appendChild(gui.domElement);

const lightFolder = gui.addFolder('Directional Light');
lightFolder.add(light.position, 'x', -10, 10, 0.1)
  .name('x')
  .onChange(() => lightHelper.update());
lightFolder.add(light.position, 'y', -10, 10, 0.1)
  .name('y')
  .onChange(() => lightHelper.update());
lightFolder.add(light.position, 'z', -10, 10, 0.1)
  .name('z')
  .onChange(() => lightHelper.update());
lightFolder.add(light, 'intensity', 0, 10, 0.1)
  .name('Intensity');
lightFolder.open();

// 渲染动画循环
const animate = () => {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
};

animate();