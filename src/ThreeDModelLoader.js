// ThreeDModelLoader.js
// import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let fingers = []; // Array to hold finger objects
const loader = new GLTFLoader();

export const place3DObjectAtFingertips = (scene, landmarks) => {
  const fingertipIndices = [4, 8, 12, 16, 20];
  
  fingertipIndices.forEach((index, fingerIndex) => {
    const position = landmarks[index];
    
    if (position) {
      // Create or update 3D object for each fingertip
      if (!fingers[fingerIndex]) {
        loader.load('./nail/ex12.glb', (gltf) => {
          const fingerObject = gltf.scene;
          fingerObject.position.set(position[0], position[1], -100); // Adjust z-position as needed
          scene.add(fingerObject);
          fingers[fingerIndex] = fingerObject;
        });
      } else {
        fingers[fingerIndex].position.set(position[0], position[1], -100); // Update position
      }
    }
  });
};
