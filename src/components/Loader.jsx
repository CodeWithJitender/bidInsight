import React, { useEffect, useRef } from "react";
import * as THREE from "three";
// import "./index.css"; // Create this file for the CSS below

const Loader = () => {
  const loaderRef = useRef(null);
  const rendererRef = useRef();

  useEffect(() => {
    const loading = loaderRef.current.querySelector(".loading");
    const text = loading.innerText;
    loading.innerHTML = "<div></div>";

    const min = 10,
      max = 30,
      minMove = 2,
      maxMove = 8;

    function setCSSVars(elem) {
      for (let i = 1; i < text.length; i++) {
        const num = Math.floor(Math.random() * (max - min + 1)) + min;
        const numMove = Math.floor(Math.random() * (maxMove - minMove + 1)) + minMove;
        const dir = i % 2 === 0 ? 1 : -1;
        const span = document.createElement("span");
        span.style.setProperty("--x", `${i - 1}px`);
        span.style.setProperty("--move-y", `${num * dir}px`);
        span.style.setProperty(
          "--move-y-s",
          `${i % 2 === 0 ? num * dir - numMove : num * dir + numMove}px`
        );
        span.style.setProperty("--delay", `${i}ms`);
        span.textContent = text;
        elem.appendChild(span);
      }
    }

    function startAnimation(elem) {
      elem.classList.remove("start");
      elem.innerHTML = "<div></div>";
      setCSSVars(elem);
      void elem.offsetWidth;
      elem.classList.add("start");
    }

    startAnimation(loading);
    loading.addEventListener("animationend", () => startAnimation(loading));
  }, []);

  // === THREE.js ===
  useEffect(() => {
    let scene, camera, renderer, particles;
    const particleCount = 20000;
    const basePositions = [],
      targetShapes = [],
      forceOffsets = [];
    let currentShape = 0,
      rotationDirection = 1,
      mouseForce = 0,
      mouse = new THREE.Vector2();

    function randomSphere() {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 100;
      return {
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
      };
    }

    function randomCube() {
      return {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        z: (Math.random() - 0.5) * 200,
      };
    }

    function randomTorus() {
      const r1 = 60;
      const r2 = 20;
      const u = Math.random() * 2 * Math.PI;
      const v = Math.random() * 2 * Math.PI;
      return {
        x: (r1 + r2 * Math.cos(v)) * Math.cos(u),
        y: (r1 + r2 * Math.cos(v)) * Math.sin(u),
        z: r2 * Math.sin(v),
      };
    }

    function switchShape() {
      currentShape = (currentShape + 1) % 3;
      for (let i = 0; i < particleCount; i++) {
        let shapePos;
        if (currentShape === 0) shapePos = randomSphere();
        else if (currentShape === 1) shapePos = randomCube();
        else shapePos = randomTorus();
        targetShapes[i] = shapePos;
      }
    }

    function initThree() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      camera.position.z = 160;

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 9);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const { x, y, z } = randomSphere();
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        basePositions.push({ x, y, z });
        forceOffsets.push({ x: 0, y: 0, z: 0 });
        targetShapes.push({ x, y, z });
        colors[i3] = Math.random();
        colors[i3 + 1] = Math.random();
        colors[i3 + 2] = Math.random();
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const sprite = new THREE.TextureLoader().load("https://threejs.org/examples/textures/sprites/circle.png");

      const material = new THREE.PointsMaterial({
        size: 1.1,
        map: sprite,
        alphaTest: 0.5,
        transparent: true,
        vertexColors: true,
        opacity: 0.85,
        depthWrite: false,
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      document.addEventListener("mousemove", (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      document.addEventListener("click", (e) => {
        rotationDirection = e.clientX < window.innerWidth / 2 ? -1 : 1;
        mouseForce = 1.2;
      });

      window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      });

      function animate() {
        requestAnimationFrame(animate);
        const time = Date.now() * 0.001;
        const positions = particles.geometry.attributes.position.array;
        const colors = particles.geometry.attributes.color.array;

        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          const base = basePositions[i];
          const target = targetShapes[i];
          const force = forceOffsets[i];

          base.x += (target.x - base.x) * 0.02;
          base.y += (target.y - base.y) * 0.02;
          base.z += (target.z - base.z) * 0.02;

          const floatX = Math.sin(time + i) * 1;
          const floatY = Math.cos(time + i * 0.3) * 1;
          const floatZ = Math.sin(time + i * 0.5) * 1;

          if (mouseForce > 0.01) {
            const dx = base.x - mouse.x * 100;
            const dy = base.y - mouse.y * 100;
            const dz = base.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.1;
            force.x += (dx / dist) * mouseForce;
            force.y += (dy / dist) * mouseForce;
            force.z += (dz / dist) * mouseForce;
          }

          force.x *= 0.94;
          force.y *= 0.94;
          force.z *= 0.94;

          let px = base.x + floatX + force.x;
          let py = base.y + floatY + force.y;
          let pz = base.z + floatZ + force.z;

          const angle = 0.003 * rotationDirection;
          const cosA = Math.cos(angle);
          const sinA = Math.sin(angle);
          const rx = px * cosA - pz * sinA;
          const rz = px * sinA + pz * cosA;

          positions[i3] = rx;
          positions[i3 + 1] = py;
          positions[i3 + 2] = rz;

          colors[i3] = (Math.sin(time + i * 0.2) + 1) / 2;
          colors[i3 + 1] = (Math.cos(time + i * 0.3) + 1) / 2;
          colors[i3 + 2] = (Math.sin(time + i * 0.5) + 1) / 2;
        }

        if (mouseForce > 0.01) mouseForce *= 0.9;

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.color.needsUpdate = true;

        renderer.render(scene, camera);
      }

      animate();
      setInterval(switchShape, 2000);
    }

    initThree();

    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement.remove();
      }
    };
  }, []);

  return (
    <div id="loader" ref={loaderRef}>
      <div className="wrap">
        <div className="loading">Loading..</div>
      </div>
    </div>
  );
};

export default Loader;
