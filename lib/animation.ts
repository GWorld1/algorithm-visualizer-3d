// lib/animations.ts
import * as THREE from 'three';
import { gsap } from 'gsap';
export const animateElementRemoval = (
    element: THREE.Object3D, 
    direction: 'left' | 'up'
  ) => {
    gsap.to(element.position, {
      x: direction === 'left' ? -10 : 0,
      y: direction === 'up' ? 10 : 0,
      duration: 1,
      onComplete: () => void element.parent?.remove(element)
    });
  };