/* ============================================================
   3D Animated Developer Portfolio — Three.js scene + UI logic
   ============================================================ */
import * as THREE from 'three';

/* ---------- Renderer / Scene / Camera ---------- */
const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0e17, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 14);
scene.add(camera);

/* ---------- Lights ---------- */
scene.add(new THREE.AmbientLight(0x334466, 0.8));

const keyLight = new THREE.PointLight(0x64ffda, 60, 60);
keyLight.position.set(6, 4, 8);
scene.add(keyLight);

const fillLight = new THREE.PointLight(0x7c6cff, 50, 60);
fillLight.position.set(-6, -3, 6);
scene.add(fillLight);

const rimLight = new THREE.PointLight(0xff5c8a, 30, 50);
rimLight.position.set(0, 6, -6);
scene.add(rimLight);

/* ---------- Star / particle field ---------- */
function createParticles(count, spread, size, color, opacity) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * spread;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    size, color, transparent: true, opacity,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true
  });
  return new THREE.Points(geo, mat);
}

const stars = createParticles(2600, 90, 0.09, 0x88aaff, 0.75);
const dustCyan = createParticles(900, 55, 0.14, 0x64ffda, 0.5);
const dustViolet = createParticles(700, 65, 0.16, 0x7c6cff, 0.4);
scene.add(stars, dustCyan, dustViolet);

/* ---------- Hero centerpiece: wireframe icosahedron + core ---------- */
const heroGroup = new THREE.Group();
heroGroup.position.set(5.2, 0.3, 0);
scene.add(heroGroup);

const icoWire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(3.1, 1),
  new THREE.MeshBasicMaterial({ color: 0x64ffda, wireframe: true, transparent: true, opacity: 0.32 })
);
heroGroup.add(icoWire);

const icoCore = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.35, 0),
  new THREE.MeshStandardMaterial({
    color: 0x101a2e, metalness: 0.85, roughness: 0.18,
    emissive: 0x64ffda, emissiveIntensity: 0.18, flatShading: true
  })
);
heroGroup.add(icoCore);

// Orbiting ring of small tetrahedrons
const orbiters = [];
const orbitGroup = new THREE.Group();
heroGroup.add(orbitGroup);
for (let i = 0; i < 10; i++) {
  const m = new THREE.Mesh(
    new THREE.TetrahedronGeometry(0.16),
    new THREE.MeshStandardMaterial({
      color: i % 2 ? 0x64ffda : 0x7c6cff,
      emissive: i % 2 ? 0x64ffda : 0x7c6cff,
      emissiveIntensity: 0.6, metalness: 0.5, roughness: 0.3
    })
  );
  const angle = (i / 10) * Math.PI * 2;
  m.userData = { angle, radius: 4.1 + Math.random() * 0.5, speed: 0.4 + Math.random() * 0.3, y: (Math.random() - 0.5) * 1.4 };
  orbiters.push(m);
  orbitGroup.add(m);
}

/* ---------- Torus knot (about section) ---------- */
const knot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(2.1, 0.55, 180, 24),
  new THREE.MeshStandardMaterial({
    color: 0x141c2e, metalness: 0.9, roughness: 0.22,
    emissive: 0x7c6cff, emissiveIntensity: 0.22
  })
);
knot.position.set(-6.5, -16, -3);
scene.add(knot);

/* ---------- Floating octahedrons (skills section) ---------- */
const floaters = [];
for (let i = 0; i < 7; i++) {
  const size = 0.35 + Math.random() * 0.6;
  const mesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(size),
    new THREE.MeshStandardMaterial({
      color: 0x101a2e, metalness: 0.7, roughness: 0.3, flatShading: true,
      emissive: [0x64ffda, 0x7c6cff, 0xff5c8a][i % 3], emissiveIntensity: 0.35
    })
  );
  mesh.position.set((Math.random() - 0.5) * 18, -30 - Math.random() * 8, -4 + Math.random() * 3);
  mesh.userData = { speed: 0.3 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2, base: mesh.position.y };
  floaters.push(mesh);
  scene.add(mesh);
}

/* ---------- Wireframe grid tunnel (projects section) ---------- */
const gridHelper = new THREE.GridHelper(70, 46, 0x64ffda, 0x1a2540);
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0.28;
gridHelper.position.set(0, -52, -6);
scene.add(gridHelper);

const knot2 = new THREE.Mesh(
  new THREE.TorusGeometry(2.6, 0.09, 16, 90),
  new THREE.MeshBasicMaterial({ color: 0xff5c8a, transparent: true, opacity: 0.55 })
);
knot2.position.set(6, -46, -4);
scene.add(knot2);

const knot3 = knot2.clone();
knot3.material = new THREE.MeshBasicMaterial({ color: 0x64ffda, transparent: true, opacity: 0.55 });
knot3.scale.setScalar(0.7);
knot3.position.set(-6.5, -48, -5);
scene.add(knot3);

/* ---------- Scroll-driven camera path ---------- */
let scrollY = window.scrollY;
let targetScroll = scrollY;
window.addEventListener('scroll', () => { targetScroll = window.scrollY; }, { passive: true });

/* ---------- Mouse parallax ---------- */
const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('pointermove', (e) => {
  mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* ---------- Resize ---------- */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/* ---------- Animation loop ---------- */
const clock = new THREE.Clock();

function tick() {
  const t = clock.getElapsedTime();

  // Smooth scroll interpolation
  scrollY += (targetScroll - scrollY) * 0.06;
  const pageHeight = document.body.scrollHeight - window.innerHeight;
  const progress = pageHeight > 0 ? scrollY / pageHeight : 0;

  // Camera flies downward along the scene as user scrolls
  camera.position.y = -progress * 58;
  camera.position.z = 14 - Math.sin(progress * Math.PI) * 3;

  // Mouse parallax (eased)
  mouse.x += (mouse.tx - mouse.x) * 0.05;
  mouse.y += (mouse.ty - mouse.y) * 0.05;
  camera.position.x = mouse.x * 1.4;
  camera.rotation.x = -mouse.y * 0.06;
  camera.rotation.y = -mouse.x * 0.08;

  // Hero group
  heroGroup.rotation.y = t * 0.18;
  heroGroup.rotation.x = Math.sin(t * 0.3) * 0.12;
  icoWire.rotation.z = t * 0.1;
  icoCore.rotation.y = -t * 0.4;
  icoCore.rotation.x = t * 0.25;
  icoCore.scale.setScalar(1 + Math.sin(t * 1.6) * 0.06);

  orbiters.forEach((m) => {
    const a = m.userData.angle + t * m.userData.speed;
    m.position.set(
      Math.cos(a) * m.userData.radius,
      m.userData.y + Math.sin(t * 0.8 + m.userData.angle) * 0.4,
      Math.sin(a) * m.userData.radius
    );
    m.rotation.x = t * 1.2;
    m.rotation.y = t * 0.9;
  });

  // Particle drift
  stars.rotation.y = t * 0.012;
  dustCyan.rotation.y = -t * 0.02;
  dustCyan.rotation.x = t * 0.008;
  dustViolet.rotation.y = t * 0.016;

  // Torus knot
  knot.rotation.x = t * 0.25;
  knot.rotation.y = t * 0.18;

  // Floaters bob
  floaters.forEach((m) => {
    m.position.y = m.userData.base + Math.sin(t * m.userData.speed + m.userData.phase) * 0.8;
    m.rotation.x = t * m.userData.speed;
    m.rotation.z = t * m.userData.speed * 0.7;
  });

  // Rings
  knot2.rotation.x = t * 0.4;
  knot2.rotation.y = t * 0.2;
  knot3.rotation.x = -t * 0.3;
  knot3.rotation.z = t * 0.25;

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

/* ============================================================
   UI: loader, typed text, reveal-on-scroll, tilt, burger menu
   ============================================================ */

/* Loader */
const loader = document.getElementById('loader');
const loaderProgress = document.getElementById('loaderProgress');
let fakeProgress = 0;
const loadInterval = setInterval(() => {
  fakeProgress = Math.min(fakeProgress + Math.random() * 22, 100);
  loaderProgress.style.width = fakeProgress + '%';
  if (fakeProgress >= 100) {
    clearInterval(loadInterval);
    setTimeout(() => loader.classList.add('done'), 300);
  }
}, 140);

/* Typed effect */
const phrases = [
  'immersive web experiences.',
  'real-time 3D graphics.',
  'scalable backend systems.',
  'delightful user interfaces.',
  'things for the web.'
];
const typedEl = document.getElementById('typed');
let phraseIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = phrases[phraseIdx];
  typedEl.textContent = current.slice(0, charIdx);
  if (!deleting) {
    charIdx++;
    if (charIdx > current.length) { deleting = true; setTimeout(type, 1800); return; }
    setTimeout(type, 55 + Math.random() * 50);
  } else {
    charIdx--;
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    setTimeout(type, 28);
  }
}
type();

/* Reveal on scroll */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

/* 3D tilt on cards */
document.querySelectorAll('[data-tilt]').forEach((card) => {
  card.addEventListener('pointermove', (e) => {
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${px * 10}deg) rotateX(${-py * 10}deg) translateY(-4px)`;
  });
  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

/* Mobile burger menu */
const burger = document.getElementById('burger');
const navLinks = document.querySelector('.nav__links');
burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
  })
);
