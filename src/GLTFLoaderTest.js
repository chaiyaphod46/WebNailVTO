import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const GLTFLoaderTest = () => {
  useEffect(() => {
    // สร้าง scene, camera, renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // กำหนดพื้นหลังเป็นสีขาว
    renderer.setClearColor(0xffffff);
    
    document.body.appendChild(renderer.domElement);

    // ตั้งตำแหน่งกล้อง
    camera.position.z = 5;

    // โหลดโมเดล GLTF
    const loader = new GLTFLoader();
    const models = []; // เก็บโมเดลทั้ง 5 ชิ้น
    const spacing = 1.0; // ระยะห่างระหว่างโมเดล (100 เซนติเมตร)

    for (let i = 0; i < 5; i++) {
      loader.load('/nail/ex12purple.glb', (gltf) => {
        const model = gltf.scene;
        
        // ตั้งค่าตำแหน่งให้แต่ละโมเดลห่างกัน 100 เซนติเมตร
        model.position.set(i * spacing, 0, 0);
        scene.add(model);
        models.push(model);
      }, undefined, (error) => {
        console.error('Error loading the model:', error);
      });
    }

    // เพิ่มแสงเพื่อให้เห็นโมเดลชัดเจน
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 2).normalize();
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    // ล้าง renderer เมื่อ component ถูกทำลาย
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;
};

export default GLTFLoaderTest;
