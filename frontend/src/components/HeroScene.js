import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js neon particle field + slow rotating wireframe icosahedron.
 * Lightweight – no R3F, no postprocessing, mobile-safe.
 */
export default function HeroScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.06);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Particle field
    const particleCount = 1400;
    const positions = new Float32Array(particleCount * 3);
    const colorsArr = new Float32Array(particleCount * 3);
    const lime = new THREE.Color("#CCFF00");
    const cyan = new THREE.Color("#00F0FF");

    for (let i = 0; i < particleCount; i++) {
      const r = 10 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() > 0.7 ? cyan : lime;
      colorsArr[i * 3] = c.r;
      colorsArr[i * 3 + 1] = c.g;
      colorsArr[i * 3 + 2] = c.b;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute("color", new THREE.BufferAttribute(colorsArr, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // Wireframe icosahedron (data crystal)
    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(3.2, 1),
      new THREE.MeshBasicMaterial({ color: 0xccff00, wireframe: true, transparent: true, opacity: 0.55 })
    );
    scene.add(ico);

    // Inner smaller octahedron
    const oct = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.6, 0),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, wireframe: true, transparent: true, opacity: 0.6 })
    );
    scene.add(oct);

    // Mouse parallax
    let mx = 0, my = 0;
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      points.rotation.y = t * 0.04;
      points.rotation.x = Math.sin(t * 0.05) * 0.2;
      ico.rotation.x = t * 0.2;
      ico.rotation.y = t * 0.15;
      oct.rotation.x = -t * 0.4;
      oct.rotation.z = t * 0.3;
      camera.position.x += (mx * 2.5 - camera.position.x) * 0.03;
      camera.position.y += (-my * 2.5 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      pGeo.dispose();
      pMat.dispose();
      ico.geometry.dispose();
      ico.material.dispose();
      oct.geometry.dispose();
      oct.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" data-testid="hero-scene" />;
}
