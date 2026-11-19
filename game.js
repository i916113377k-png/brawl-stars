/**
 * Brawl Arena 3D - Real WebGL 3D Top-Down Shooter (Three.js Engine)
 * Features:
 * - Real 3D World with Isometric Camera, Dynamic Shadows & Lighting
 * - Original 3D Brawlers (Shelly, Colt, El Primo) with Procedural 3D Meshes & Rigged Animations
 * - 3D Arena Maps (Walls, Foliage Bushes, Center Gem Mine, Floating Gems)
 * - 3v3 Team Match with Smart AI Bots
 * - Touch Dual-Joysticks (Mobile) + WASD & 3D Mouse Aim (PC)
 */

// =============================================================================
// 1. BRAWLER & MAP CONFIGURATIONS (3D World Coordinates)
// =============================================================================
const BRAWLERS_3D = {
  shelly: {
    name: 'SHELLY',
    role: 'Shotgunner',
    maxHp: 3600,
    speed: 7.5,          // ← Slower (was 12.0)
    bulletRange: 14.0,
    bulletSpeed: 32.0,
    bulletDamage: 300,
    pellets: 5,
    spreadAngle: 0.38,
    radius: 0.9,
    hairColor: 0x9333ea,
    skinColor: 0xfed7aa,
    shirtColor: 0x2563eb,
    weaponType: 'shotgun'
  },
  colt: {
    name: 'COLT',
    role: 'Gunslinger',
    maxHp: 2800,
    speed: 8.5,          // ← Slower (was 13.0)
    bulletRange: 18.0,
    bulletSpeed: 38.0,
    bulletDamage: 340,
    pellets: 1,
    burstCount: 4,
    burstDelay: 0.08,
    spreadAngle: 0.04,
    radius: 0.85,
    hairColor: 0xdc2626,
    skinColor: 0xfed7aa,
    shirtColor: 0x1e3a8a,
    weaponType: 'dual_pistols'
  },
  el_primo: {
    name: 'EL PRIMO',
    role: 'Luchador Tank',
    maxHp: 5600,
    speed: 7.0,          // ← Slower (was 12.5)
    bulletRange: 9.0,
    bulletSpeed: 26.0,
    bulletDamage: 420,
    pellets: 4,
    spreadAngle: 0.42,
    radius: 1.1,
    maskColor: 0x2563eb,
    skinColor: 0xe09f67,
    trimsColor: 0xfacc15,
    weaponType: 'flying_fists'
  }
};

const MAPS_3D = {
  crystalCavern: {
    name: 'Crystal Cavern',
    walls: [
      // Border walls (x, z, width, depth)
      { x: 0, z: -25, w: 34, d: 1.5 },
      { x: 0, z: 25, w: 34, d: 1.5 },
      { x: -17, z: 0, w: 1.5, d: 50 },
      { x: 17, z: 0, w: 1.5, d: 50 },
      // Center Mine defense blocks
      { x: -4.5, z: 0, w: 1.4, d: 6.0 },
      { x: 4.5, z: 0, w: 1.4, d: 6.0 },
      { x: 0, z: -4.5, w: 4.0, d: 1.2 },
      { x: 0, z: 4.5, w: 4.0, d: 1.2 },
      // Side lane covers
      { x: -10, z: -10, w: 3.5, d: 2.5 },
      { x: -10, z: 10, w: 3.5, d: 2.5 },
      { x: 10, z: -10, w: 3.5, d: 2.5 },
      { x: 10, z: 10, w: 3.5, d: 2.5 },
    ],
    bushes: [
      { x: -7, z: 0, w: 2.5, d: 7.0 },
      { x: 7, z: 0, w: 2.5, d: 7.0 },
      { x: -13, z: -5, w: 3.0, d: 12.0 },
      { x: 13, z: 5, w: 3.0, d: 12.0 },
      { x: 0, z: -18, w: 6.0, d: 3.0 },
      { x: 0, z: 18, w: 6.0, d: 3.0 },
    ]
  },
  desertDunes: {
    name: 'Desert Dunes',
    walls: [
      { x: 0, z: -25, w: 34, d: 1.5 },
      { x: 0, z: 25, w: 34, d: 1.5 },
      { x: -17, z: 0, w: 1.5, d: 50 },
      { x: 17, z: 0, w: 1.5, d: 50 },
      // Desert Stone Pillars
      { x: -6, z: -6, w: 2.5, d: 2.5 },
      { x: 6, z: -6, w: 2.5, d: 2.5 },
      { x: -6, z: 6, w: 2.5, d: 2.5 },
      { x: 6, z: 6, w: 2.5, d: 2.5 },
      { x: 0, z: 0, w: 2.2, d: 2.2 }
    ],
    bushes: [
      { x: -12, z: 0, w: 3.5, d: 24.0 },
      { x: 12, z: 0, w: 3.5, d: 24.0 },
      { x: 0, z: -12, w: 8.0, d: 2.5 },
      { x: 0, z: 12, w: 8.0, d: 2.5 }
    ]
  },
  snakePrairie: {
    name: 'Snake Prairie',
    walls: [
      { x: 0, z: -25, w: 34, d: 1.5 },
      { x: 0, z: 25, w: 34, d: 1.5 },
      { x: -17, z: 0, w: 1.5, d: 50 },
      { x: 17, z: 0, w: 1.5, d: 50 },
      { x: 0, z: -8, w: 5.0, d: 1.4 },
      { x: 0, z: 8, w: 5.0, d: 1.4 },
      { x: -7, z: 0, w: 3.0, d: 2.0 },
      { x: 7, z: 0, w: 3.0, d: 2.0 }
    ],
    bushes: [
      // Giant grass oceans
      { x: 0, z: -12, w: 26.0, d: 8.0 },
      { x: 0, z: 12, w: 26.0, d: 8.0 },
      { x: 0, z: 0, w: 10.0, d: 6.0 }
    ]
  }
};

const GAME_CONFIG = {
  MAX_AMMO: 3,
  AMMO_RELOAD_TIME: 1.25,
  RESPAWN_TIME: 4.0,
  GEM_SPAWN_INTERVAL: 6.0,
  GEMS_TO_WIN: 10,
  TROPHIES_WIN: 8,    // Cups earned on victory
  TROPHIES_LOSE: -4   // Cups lost on defeat
};

// Trophy / Cup persistent storage (localStorage)
const TROPHY_KEY = 'brawl_arena_trophies';
let playerTrophies = parseInt(localStorage.getItem(TROPHY_KEY) || '1117', 10);

// =============================================================================
// 2. THREE.JS 3D SCENE SETUP
// =============================================================================
const container = document.getElementById('game-container');
let scene, camera, renderer;
let dirLight, ambientLight, mineLight;

let sceneWidth = window.innerWidth;
let sceneHeight = window.innerHeight;

function initThreeScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0f19);
  scene.fog = new THREE.FogExp2(0x0b0f19, 0.015);

  // Isometric Brawl Stars Style Camera (Perspective with ~58deg pitch)
  camera = new THREE.PerspectiveCamera(40, sceneWidth / sceneHeight, 0.1, 200);
  camera.position.set(0, 32, 22);
  camera.lookAt(0, 0, 4);

  // WebGL Renderer with Shadows
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(sceneWidth, sceneHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // Lighting
  ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambientLight);

  dirLight = new THREE.DirectionalLight(0xfffaed, 0.85);
  dirLight.position.set(16, 32, 16);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 70;
  dirLight.shadow.camera.left = -22;
  dirLight.shadow.camera.right = 22;
  dirLight.shadow.camera.top = 30;
  dirLight.shadow.camera.bottom = -30;
  scene.add(dirLight);

  // Purple Point Light at center gem mine
  mineLight = new THREE.PointLight(0xa855f7, 2.0, 10);
  mineLight.position.set(0, 1.2, 0);
  scene.add(mineLight);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(sceneWidth, sceneHeight);
  resizeJoystickCanvas();
}

// =============================================================================
// 3. ORIGINAL 3D BRAWLER PROCEDURAL MESH FACTORY
// =============================================================================
function create3DBrawlerMesh(brawlerKey, team) {
  const brawlerData = BRAWLERS_3D[brawlerKey];
  const root = new THREE.Group();

  const isAlly = team === 'blue';
  const teamColor = isAlly ? 0x2563eb : 0xdc2626;
  const teamHighlight = isAlly ? 0x60a5fa : 0xf87171;

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: brawlerData.skinColor, roughness: 0.6 });
  const teamMat = new THREE.MeshStandardMaterial({ color: teamColor, roughness: 0.5 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
  const hairMat = new THREE.MeshStandardMaterial({ color: brawlerData.hairColor || 0x1e293b, roughness: 0.7 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.6, roughness: 0.3 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.8, roughness: 0.2 });

  // 1. Soft Ground Shadow
  const shadowGeo = new THREE.CircleGeometry(brawlerData.radius * 0.95, 24);
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
  const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.02;
  root.add(shadowMesh);

  // 2. Torso Group (Pivots with Aiming)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.y = 0.9;
  root.add(torsoGroup);

  // Torso Mesh
  const torsoGeo = new THREE.CylinderGeometry(0.55, 0.45, 0.85, 12);
  const torsoMesh = new THREE.Mesh(torsoGeo, teamMat);
  torsoMesh.castShadow = true;
  torsoGroup.add(torsoMesh);

  // Belt
  const beltGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.16, 12);
  const beltMesh = new THREE.Mesh(beltGeo, brawlerKey === 'el_primo' ? goldMat : darkMat);
  beltMesh.position.y = -0.32;
  torsoGroup.add(beltMesh);

  // Head
  const headGeo = new THREE.SphereGeometry(0.42, 16, 16);
  const headMesh = new THREE.Mesh(headGeo, brawlerKey === 'el_primo' ? new THREE.MeshStandardMaterial({ color: brawlerData.maskColor }) : skinMat);
  headMesh.position.y = 0.72;
  headMesh.castShadow = true;
  torsoGroup.add(headMesh);

  // Eyes / Visor
  const eyeGeo = new THREE.BoxGeometry(0.12, 0.08, 0.08);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.14, 0.74, 0.38);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.14, 0.74, 0.38);
  torsoGroup.add(leftEye, rightEye);

  // 3. Distinct Character Specific Details
  let weaponGroup = new THREE.Group();

  if (brawlerKey === 'shelly') {
    // Purple Hair Puffs & Ponytail
    const hairGeo = new THREE.SphereGeometry(0.46, 12, 12);
    const hairMesh = new THREE.Mesh(hairGeo, hairMat);
    hairMesh.position.set(0, 0.82, -0.06);
    torsoGroup.add(hairMesh);

    // Yellow Neck Bandana
    const bandanaGeo = new THREE.TorusGeometry(0.42, 0.1, 8, 16);
    const bandanaMesh = new THREE.Mesh(bandanaGeo, goldMat);
    bandanaMesh.rotation.x = Math.PI / 2;
    bandanaMesh.position.y = 0.45;
    torsoGroup.add(bandanaMesh);

    // 3D Pump Shotgun
    const stockMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 0.45), new THREE.MeshStandardMaterial({ color: 0x78350f }));
    const barrelMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8), metalMat);
    barrelMesh.rotation.x = Math.PI / 2;
    barrelMesh.position.set(0, 0.04, 0.45);
    weaponGroup.add(stockMesh, barrelMesh);
    weaponGroup.position.set(0.35, 0.1, 0.55);
    torsoGroup.add(weaponGroup);

  } else if (brawlerKey === 'colt') {
    // Red Tall Pompadour Quiff
    const quiffGeo = new THREE.ConeGeometry(0.38, 0.65, 8);
    const quiffMesh = new THREE.Mesh(quiffGeo, hairMat);
    quiffMesh.rotation.x = -0.4;
    quiffMesh.position.set(0, 1.05, 0.1);
    torsoGroup.add(quiffMesh);

    // Sheriff Star on chest
    const starMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.06), goldMat);
    starMesh.position.set(0, 0.1, 0.48);
    torsoGroup.add(starMesh);

    // Dual Revolvers in hands
    const gun1 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.4), metalMat);
    gun1.position.set(-0.45, 0.05, 0.45);
    const gun2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 0.4), metalMat);
    gun2.position.set(0.45, 0.05, 0.45);
    weaponGroup.add(gun1, gun2);
    torsoGroup.add(weaponGroup);

  } else if (brawlerKey === 'el_primo') {
    // Yellow Luchador Star on Mask Forehead
    const maskStar = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.06), goldMat);
    maskStar.position.set(0, 0.88, 0.38);
    torsoGroup.add(maskStar);

    // Big Boxing Gloves / Spiked Fists
    const gloveGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const leftGlove = new THREE.Mesh(gloveGeo, goldMat);
    leftGlove.position.set(-0.55, 0.08, 0.45);
    const rightGlove = new THREE.Mesh(gloveGeo, goldMat);
    rightGlove.position.set(0.55, 0.08, 0.45);
    weaponGroup.add(leftGlove, rightGlove);
    torsoGroup.add(weaponGroup);
  }

  // 4. Rigged Legs for Walk Cycle
  const legGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.65, 8);
  const leftLegPivot = new THREE.Group();
  leftLegPivot.position.set(-0.24, 0.55, 0);
  const leftLegMesh = new THREE.Mesh(legGeo, teamMat);
  leftLegMesh.position.y = -0.32;
  leftLegMesh.castShadow = true;
  leftLegPivot.add(leftLegMesh);

  const rightLegPivot = new THREE.Group();
  rightLegPivot.position.set(0.24, 0.55, 0);
  const rightLegMesh = new THREE.Mesh(legGeo, teamMat);
  rightLegMesh.position.y = -0.32;
  rightLegMesh.castShadow = true;
  rightLegPivot.add(rightLegMesh);

  root.add(leftLegPivot, rightLegPivot);

  // Return root with animated node references
  return {
    root,
    torsoGroup,
    weaponGroup,
    leftLegPivot,
    rightLegPivot,
    materials: [skinMat, teamMat, hairMat, goldMat]
  };
}

// =============================================================================
// 4. BRAWLER & BOT CLASSES (3D Coordinates)
// =============================================================================
class Brawler3D {
  constructor(configKey, team, isPlayer = false, name = 'BRAWLER') {
    this.configKey = configKey;
    this.config = BRAWLERS_3D[configKey];
    this.team = team;
    this.isPlayer = isPlayer;
    this.name = name;

    this.radius = this.config.radius;
    this.maxHp = this.config.maxHp;
    this.hp = this.maxHp;
    this.speed = this.config.speed;
    this.aimAngle = team === 'blue' ? -Math.PI / 2 : Math.PI / 2;

    this.x = 0;
    this.z = team === 'blue' ? 18 : -18;
    this.spawnX = this.x;
    this.spawnZ = this.z;

    this.ammo = GAME_CONFIG.MAX_AMMO;
    this.reloadTimer = 0;
    this.gems = 0;
    this.kills = 0;
    this.inBush = false;
    this.isDead = false;
    this.respawnTimer = 0;

    // 3D Model instantiation
    this.modelRig = create3DBrawlerMesh(configKey, team);
    this.mesh = this.modelRig.root;
    this.mesh.position.set(this.x, 0, this.z);
    scene.add(this.mesh);

    // Walk animation states
    this.walkTime = 0;
    this.isMoving = false;
    this.recoilAnim = 0;
    this.hitFlashTimer = 0;
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 0.12;
    spawnHitSparks3D(this.x, 1.0, this.z, 0xef4444, 8);

    if (this.hp <= 0) this.die();
  }

  die() {
    this.isDead = true;
    this.respawnTimer = GAME_CONFIG.RESPAWN_TIME;
    this.mesh.visible = false;
    spawnHitSparks3D(this.x, 1.0, this.z, 0xef4444, 25);

    // Drop gems
    for (let i = 0; i < this.gems; i++) {
      const ox = (Math.random() - 0.5) * 3;
      const oz = (Math.random() - 0.5) * 3;
      spawnGem3D(this.x + ox, this.z + oz);
    }
    this.gems = 0;
    updateGemScoreHUD();
  }

  respawn() {
    this.isDead = false;
    this.hp = this.maxHp;
    this.ammo = GAME_CONFIG.MAX_AMMO;
    this.x = this.spawnX + (Math.random() - 0.5) * 4;
    this.z = this.spawnZ + (Math.random() - 0.5) * 2;
    this.mesh.position.set(this.x, 0, this.z);
    this.mesh.visible = true;
    spawnHitSparks3D(this.x, 1.0, this.z, 0x3b82f6, 16);
  }

  shoot(angle) {
    if (this.isDead || this.ammo < 1) return;
    this.ammo -= 1;
    this.aimAngle = angle;
    this.recoilAnim = 1.0;

    const bulletColor = this.team === 'blue' ? 0x60a5fa : 0xf87171;
    const cfg = this.config;

    if (cfg.pellets > 1) {
      // Spread Shot (Shelly & El Primo)
      const startAngle = angle - cfg.spreadAngle / 2;
      const step = cfg.spreadAngle / (cfg.pellets - 1);
      for (let i = 0; i < cfg.pellets; i++) {
        const pAngle = startAngle + step * i;
        const bx = this.x + Math.cos(pAngle) * (this.radius + 0.4);
        const bz = this.z + Math.sin(pAngle) * (this.radius + 0.4);
        spawnProjectile3D(bx, 0.9, bz, pAngle, cfg.bulletDamage, cfg.bulletRange, cfg.bulletSpeed, this.team, bulletColor);
      }
    } else {
      // Stream (Colt)
      const bx = this.x + Math.cos(angle) * (this.radius + 0.5);
      const bz = this.z + Math.sin(angle) * (this.radius + 0.5);
      spawnProjectile3D(bx, 0.9, bz, angle, cfg.bulletDamage, cfg.bulletRange, cfg.bulletSpeed, this.team, bulletColor);
    }

    spawnHitSparks3D(this.x + Math.cos(angle) * this.radius, 0.9, this.z + Math.sin(angle) * this.radius, 0xfde047, 4);
  }

  updateBase(dt, moveX, moveZ) {
    if (this.isDead) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) this.respawn();
      return;
    }

    // Ammo reload
    if (this.ammo < GAME_CONFIG.MAX_AMMO) {
      this.reloadTimer += dt;
      if (this.reloadTimer >= GAME_CONFIG.AMMO_RELOAD_TIME) {
        this.ammo = Math.min(GAME_CONFIG.MAX_AMMO, this.ammo + 1);
        this.reloadTimer = 0;
      }
    }

    // Movement & Walk animation
    const len = Math.hypot(moveX, moveZ);
    if (len > 0) {
      this.isMoving = true;
      this.walkTime += dt * 12;
      this.x += (moveX / len) * this.speed * dt;
      this.z += (moveZ / len) * this.speed * dt;
    } else {
      this.isMoving = false;
      this.walkTime = 0;
    }

    // Wall collision
    for (const wall of activeMap3D.walls) {
      resolveCircleAABB3D(this, wall);
    }

    // Bush check
    this.inBush = false;
    for (const bush of activeMap3D.bushes) {
      if (isCircleOverlappingRect3D(this, bush)) {
        this.inBush = true;
        break;
      }
    }

    // Gem pickup
    for (let i = gems3D.length - 1; i >= 0; i--) {
      const g = gems3D[i];
      if (Math.hypot(this.x - g.mesh.position.x, this.z - g.mesh.position.z) < this.radius + 0.8) {
        this.gems += 1;
        g.destroy();
        gems3D.splice(i, 1);
        spawnHitSparks3D(this.x, 1.0, this.z, 0xc084fc, 10);
        updateGemScoreHUD();
      }
    }

    // Update 3D Mesh transforms & Bone Animation
    this.mesh.position.set(this.x, 0, this.z);
    this.modelRig.torsoGroup.rotation.y = -this.aimAngle + Math.PI / 2;

    // Walk cycle animation
    if (this.isMoving) {
      this.modelRig.leftLegPivot.rotation.x = Math.sin(this.walkTime) * 0.6;
      this.modelRig.rightLegPivot.rotation.x = -Math.sin(this.walkTime) * 0.6;
      this.mesh.position.y = Math.abs(Math.sin(this.walkTime * 2)) * 0.08;
    } else {
      this.modelRig.leftLegPivot.rotation.x = 0;
      this.modelRig.rightLegPivot.rotation.x = 0;
      this.mesh.position.y = 0;
    }

    // Recoil
    if (this.recoilAnim > 0) {
      this.recoilAnim = Math.max(0, this.recoilAnim - dt * 6);
      this.modelRig.weaponGroup.position.z = 0.55 - this.recoilAnim * 0.25;
    }

    // Stealth visibility check relative to local player
    if (!this.isPlayer && localPlayer3D) {
      if (this.team !== localPlayer3D.team && this.inBush) {
        const dist = Math.hypot(this.x - localPlayer3D.x, this.z - localPlayer3D.z);
        this.mesh.visible = localPlayer3D.inBush || dist < 4.5;
      } else {
        this.mesh.visible = true;
      }
    }
  }

  destroy() {
    scene.remove(this.mesh);
  }
}

class Bot3D extends Brawler3D {
  constructor(configKey, team, name) {
    super(configKey, team, false, name);
    this.decisionTimer = Math.random() * 0.3;
    this.moveVector = { x: 0, z: 0 };
  }

  updateAI(dt, localPlayer) {
    if (this.isDead) {
      this.updateBase(dt, 0, 0);
      return;
    }

    this.decisionTimer -= dt;
    if (this.decisionTimer <= 0) {
      this.decisionTimer = 0.2 + Math.random() * 0.2;

      const enemies = this.team === 'blue' ? redTeam3D : blueTeam3D;
      const visibleEnemies = enemies.filter(e => {
        if (e.isDead) return false;
        if (!e.inBush) return true;
        return this.inBush || Math.hypot(this.x - e.x, this.z - e.z) < 4.5;
      });

      let closest = null;
      let minDist = Infinity;
      for (const e of visibleEnemies) {
        const d = Math.hypot(this.x - e.x, this.z - e.z);
        if (d < minDist) { minDist = d; closest = e; }
      }

      if (this.hp < this.maxHp * 0.35) {
        // RETREAT
        const retZ = this.team === 'blue' ? 18 : -18;
        this.moveVector.x = -this.x * 0.4;
        this.moveVector.z = retZ - this.z;
      } else if (closest && minDist < this.config.bulletRange * 1.1) {
        // COMBAT
        this.aimAngle = Math.atan2(closest.z - this.z, closest.x - this.x);
        this.moveVector.x = closest.x - this.x;
        this.moveVector.z = closest.z - this.z;

        if (this.ammo >= 1 && Math.random() < 0.75) {
          this.shoot(this.aimAngle + (Math.random() - 0.5) * 0.06);
        }
      } else {
        // SEEK GEMS
        let tx = 0, tz = 0;
        if (gems3D.length > 0) {
          tx = gems3D[0].mesh.position.x;
          tz = gems3D[0].mesh.position.z;
        }
        this.moveVector.x = tx - this.x + (Math.random() - 0.5) * 2;
        this.moveVector.z = tz - this.z + (Math.random() - 0.5) * 2;
        this.aimAngle = Math.atan2(this.moveVector.z, this.moveVector.x);
      }
    }

    this.updateBase(dt, this.moveVector.x, this.moveVector.z);
  }
}

// =============================================================================
// 5. 3D PROJECTILES, PARTICLES & GEMS
// =============================================================================
const projectiles3D = [];
const particles3D = [];
const gems3D = [];

class Projectile3D {
  constructor(x, y, z, angle, damage, range, speed, team, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.vx = Math.cos(angle) * speed;
    this.vz = Math.sin(angle) * speed;
    this.damage = damage;
    this.maxDist = range;
    this.traveled = 0;
    this.team = team;
    this.markedForDeletion = false;

    // 3D Glowing Bullet Mesh
    const geo = new THREE.SphereGeometry(0.24, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);
  }

  update(dt) {
    const dx = this.vx * dt;
    const dz = this.vz * dt;
    this.x += dx;
    this.z += dz;
    this.traveled += Math.hypot(dx, dz);
    this.mesh.position.set(this.x, this.y, this.z);

    if (this.traveled >= this.maxDist) {
      this.destroy();
      return;
    }

    // Walls
    for (const w of activeMap3D.walls) {
      if (Math.abs(this.x - w.x) < w.w / 2 && Math.abs(this.z - w.z) < w.d / 2) {
        spawnHitSparks3D(this.x, this.y, this.z, 0xfbbf24, 6);
        this.destroy();
        return;
      }
    }

    // Enemies
    const targets = this.team === 'blue' ? redTeam3D : blueTeam3D;
    for (const b of targets) {
      if (!b.isDead && Math.hypot(this.x - b.x, this.z - b.z) < b.radius + 0.3) {
        const wasAlive = !b.isDead;
        b.takeDamage(this.damage);
        // Award kill credit to the shooter's team leader
        if (wasAlive && b.isDead) {
          const shooterTeam = this.team === 'blue' ? blueTeam3D : redTeam3D;
          if (shooterTeam[0]) shooterTeam[0].kills = (shooterTeam[0].kills || 0) + 1;
        }
        this.destroy();
        return;
      }
    }
  }

  destroy() {
    this.markedForDeletion = true;
    scene.remove(this.mesh);
  }
}

function spawnProjectile3D(x, y, z, angle, damage, range, speed, team, color) {
  projectiles3D.push(new Projectile3D(x, y, z, angle, damage, range, speed, team, color));
}

class SparkParticle3D {
  constructor(x, y, z, color) {
    this.x = x; this.y = y; this.z = z;
    const ang = Math.random() * Math.PI * 2;
    const spd = 4 + Math.random() * 8;
    this.vx = Math.cos(ang) * spd;
    this.vy = 2 + Math.random() * 5;
    this.vz = Math.sin(ang) * spd;
    this.life = 0.25;

    const geo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;
    this.vy -= 14 * dt; // gravity
    this.mesh.position.set(this.x, this.y, this.z);
    this.life -= dt;
    if (this.life <= 0) scene.remove(this.mesh);
  }
}

function spawnHitSparks3D(x, y, z, color, count = 6) {
  for (let i = 0; i < count; i++) particles3D.push(new SparkParticle3D(x, y, z, color));
}

class Gem3D {
  constructor(x, z) {
    const geo = new THREE.OctahedronGeometry(0.45, 0);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.4
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, 0.8, z);
    this.mesh.castShadow = true;
    scene.add(this.mesh);
    this.time = Math.random() * 10;
  }
  update(dt) {
    this.time += dt * 4;
    this.mesh.rotation.y += dt * 2.5;
    this.mesh.position.y = 0.8 + Math.sin(this.time) * 0.18;
  }
  destroy() {
    scene.remove(this.mesh);
  }
}

function spawnGem3D(x, z) {
  gems3D.push(new Gem3D(x, z));
}

// =============================================================================
// 6. 3D ARENA BUILDER
// =============================================================================
let activeMap3D = { walls: [], bushes: [] };
let mapMeshes = [];
let blueTeam3D = [];
let redTeam3D = [];
let localPlayer3D = null;
let gemMineMesh = null;
let gemSpawnTimer = 0;

function build3DArena(mapKey) {
  // Clear old map meshes
  for (const m of mapMeshes) scene.remove(m);
  mapMeshes = [];

  const mapData = MAPS_3D[mapKey] || MAPS_3D.crystalCavern;
  activeMap3D.walls = mapData.walls;
  activeMap3D.bushes = mapData.bushes;

  // 1. 3D Ground Plane with Tiled Texture
  const groundGeo = new THREE.PlaneGeometry(36, 52);
  const canvasTex = document.createElement('canvas');
  canvasTex.width = 128; canvasTex.height = 128;
  const tCtx = canvasTex.getContext('2d');
  tCtx.fillStyle = '#22c55e';
  tCtx.fillRect(0, 0, 128, 128);
  tCtx.fillStyle = 'rgba(21, 128, 61, 0.25)';
  tCtx.fillRect(0, 0, 64, 64);
  tCtx.fillRect(64, 64, 64, 64);

  const texture = new THREE.CanvasTexture(canvasTex);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 26);

  const groundMat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.8 });
  const groundMesh = new THREE.Mesh(groundGeo, groundMat);
  groundMesh.rotation.x = -Math.PI / 2;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
  mapMeshes.push(groundMesh);

  // 2. 3D Walls with Shadows
  const wallMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
  for (const w of activeMap3D.walls) {
    const geo = new THREE.BoxGeometry(w.w, 2.2, w.d);
    const m = new THREE.Mesh(geo, wallMat);
    m.position.set(w.x, 1.1, w.z);
    m.castShadow = true;
    m.receiveShadow = true;
    scene.add(m);
    mapMeshes.push(m);
  }

  // 3. 3D Semi-Transparent Bush Foliage
  const bushMat = new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.6,
    transparent: true,
    opacity: 0.75
  });
  for (const b of activeMap3D.bushes) {
    const geo = new THREE.BoxGeometry(b.w, 1.4, b.d);
    const m = new THREE.Mesh(geo, bushMat);
    m.position.set(b.x, 0.7, b.z);
    scene.add(m);
    mapMeshes.push(m);
  }

  // 4. Central Gem Mine Structure
  const mineGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.6, 20);
  const mineMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
  gemMineMesh = new THREE.Mesh(mineGeo, mineMat);
  gemMineMesh.position.set(0, 0.3, 0);
  gemMineMesh.receiveShadow = true;
  scene.add(gemMineMesh);
  mapMeshes.push(gemMineMesh);
}

// =============================================================================
// 7. 3D GROUND AIM INDICATOR
// =============================================================================
let aimDecalMesh = null;

function init3DAimIndicator() {
  const geo = new THREE.PlaneGeometry(1, 1);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.45,
    side: THREE.DoubleSide
  });
  aimDecalMesh = new THREE.Mesh(geo, mat);
  aimDecalMesh.rotation.x = -Math.PI / 2;
  aimDecalMesh.position.y = 0.05;
  aimDecalMesh.visible = false;
  scene.add(aimDecalMesh);
}

function update3DAimIndicator(player) {
  if (!aimDecalMesh) return;
  if (player.isDead) { aimDecalMesh.visible = false; return; }

  const isAiming = (touchControls.right.active && touchControls.right.hasDragged) || pcInput.isMouseAiming;
  aimDecalMesh.visible = isAiming;
  if (!isAiming) return;

  const range = player.config.bulletRange;
  aimDecalMesh.scale.set(player.config.pellets > 1 ? 4.5 : 1.2, range, 1);
  aimDecalMesh.position.set(
    player.x + Math.cos(player.aimAngle) * (range / 2),
    0.05,
    player.z + Math.sin(player.aimAngle) * (range / 2)
  );
  aimDecalMesh.rotation.z = -player.aimAngle - Math.PI / 2;
}

// =============================================================================
// 8. 2D OVERLAY CANVAS FOR JOYSTICKS (Touch & Mobile Input)
// =============================================================================
const joyCanvas = document.getElementById('joystick-canvas');
const joyCtx = joyCanvas.getContext('2d');

function resizeJoystickCanvas() {
  joyCanvas.width = window.innerWidth;
  joyCanvas.height = window.innerHeight;
}
resizeJoystickCanvas();

const pcInput = {
  keys: {},
  mouseScreen: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  isMouseAiming: false
};

const touchControls = {
  left: { active: false, touchId: null, startX: 0, startY: 0, currX: 0, currY: 0, vector: { x: 0, z: 0 } },
  right: { active: false, touchId: null, startX: 0, startY: 0, currX: 0, currY: 0, angle: 0, hasDragged: false }
};

window.addEventListener('keydown', e => { pcInput.keys[e.code] = true; });
window.addEventListener('keyup', e => { pcInput.keys[e.code] = false; });

window.addEventListener('mousemove', e => {
  pcInput.mouseScreen.x = e.clientX;
  pcInput.mouseScreen.y = e.clientY;
  pcInput.isMouseAiming = true;
});

window.addEventListener('mousedown', e => {
  if (e.button === 0 && isGameRunning && localPlayer3D) {
    localPlayer3D.shoot(localPlayer3D.aimAngle);
  }
});

joyCanvas.addEventListener('touchstart', handleTouchStart, { passive: false });
joyCanvas.addEventListener('touchmove', handleTouchMove, { passive: false });
joyCanvas.addEventListener('touchend', handleTouchEnd, { passive: false });
joyCanvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

function handleTouchStart(e) {
  if (!isGameRunning) return;
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    const isLeftSide = t.clientX < joyCanvas.width * 0.5;
    if (isLeftSide && !touchControls.left.active) {
      touchControls.left.active = true;
      touchControls.left.touchId = t.identifier;
      touchControls.left.startX = touchControls.left.currX = t.clientX;
      touchControls.left.startY = touchControls.left.currY = t.clientY;
      touchControls.left.vector = { x: 0, z: 0 };
    } else if (!isLeftSide && !touchControls.right.active) {
      touchControls.right.active = true;
      touchControls.right.touchId = t.identifier;
      touchControls.right.startX = touchControls.right.currX = t.clientX;
      touchControls.right.startY = touchControls.right.currY = t.clientY;
      touchControls.right.angle = localPlayer3D ? localPlayer3D.aimAngle : 0;
      touchControls.right.hasDragged = false;
      pcInput.isMouseAiming = false;
      aimToast.classList.add('active');
    }
  }
}

function handleTouchMove(e) {
  if (!isGameRunning) return;
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (touchControls.left.active && t.identifier === touchControls.left.touchId) {
      touchControls.left.currX = t.clientX;
      touchControls.left.currY = t.clientY;
      const dx = t.clientX - touchControls.left.startX;
      const dy = t.clientY - touchControls.left.startY;
      const dist = Math.hypot(dx, dy);
      if (dist > 0) {
        const clamp = Math.min(dist, 60);
        touchControls.left.vector.x = (dx / dist) * (clamp / 60);
        touchControls.left.vector.z = (dy / dist) * (clamp / 60);
      }
    }
    if (touchControls.right.active && t.identifier === touchControls.right.touchId) {
      touchControls.right.currX = t.clientX;
      touchControls.right.currY = t.clientY;
      const dx = t.clientX - touchControls.right.startX;
      const dy = t.clientY - touchControls.right.startY;
      if (Math.hypot(dx, dy) >= 16) {
        touchControls.right.hasDragged = true;
        touchControls.right.angle = Math.atan2(dy, dx);
        if (localPlayer3D) localPlayer3D.aimAngle = touchControls.right.angle;
      }
    }
  }
}

function handleTouchEnd(e) {
  if (!isGameRunning) return;
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    if (touchControls.left.active && t.identifier === touchControls.left.touchId) {
      touchControls.left.active = false;
      touchControls.left.vector = { x: 0, z: 0 };
    }
    if (touchControls.right.active && t.identifier === touchControls.right.touchId) {
      aimToast.classList.remove('active');
      if (localPlayer3D) {
        localPlayer3D.shoot(touchControls.right.hasDragged ? touchControls.right.angle : localPlayer3D.aimAngle);
      }
      touchControls.right.active = false;
      touchControls.right.hasDragged = false;
    }
  }
}

function renderJoysticks2D() {
  joyCtx.clearRect(0, 0, joyCanvas.width, joyCanvas.height);

  if (touchControls.left.active) {
    const l = touchControls.left;
    joyCtx.save();
    joyCtx.beginPath();
    joyCtx.arc(l.startX, l.startY, 60, 0, Math.PI * 2);
    joyCtx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    joyCtx.fill();
    joyCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    joyCtx.lineWidth = 3;
    joyCtx.stroke();

    const dist = Math.hypot(l.currX - l.startX, l.currY - l.startY);
    const clamp = Math.min(dist, 60);
    const ang = Math.atan2(l.currY - l.startY, l.currX - l.startX);
    joyCtx.beginPath();
    joyCtx.arc(l.startX + Math.cos(ang) * clamp, l.startY + Math.sin(ang) * clamp, 24, 0, Math.PI * 2);
    joyCtx.fillStyle = 'rgba(59, 130, 246, 0.85)';
    joyCtx.fill();
    joyCtx.strokeStyle = '#ffffff';
    joyCtx.stroke();
    joyCtx.restore();
  }

  if (touchControls.right.active) {
    const r = touchControls.right;
    joyCtx.save();
    joyCtx.beginPath();
    joyCtx.arc(r.startX, r.startY, 60, 0, Math.PI * 2);
    joyCtx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    joyCtx.fill();
    joyCtx.strokeStyle = r.hasDragged ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.3)';
    joyCtx.lineWidth = 3;
    joyCtx.stroke();

    const dist = Math.hypot(r.currX - r.startX, r.currY - r.startY);
    const clamp = Math.min(dist, 60);
    const ang = Math.atan2(r.currY - r.startY, r.currX - r.startX);
    joyCtx.beginPath();
    joyCtx.arc(r.startX + Math.cos(ang) * clamp, r.startY + Math.sin(ang) * clamp, 24, 0, Math.PI * 2);
    joyCtx.fillStyle = r.hasDragged ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.85)';
    joyCtx.fill();
    joyCtx.strokeStyle = '#ffffff';
    joyCtx.stroke();
    joyCtx.restore();
  }
}

// =============================================================================
// 9. COLLISION MATH (3D X/Z Plane)
// =============================================================================
function resolveCircleAABB3D(circle, rect) {
  const halfW = rect.w / 2;
  const halfD = rect.d / 2;
  const closestX = Math.max(rect.x - halfW, Math.min(circle.x, rect.x + halfW));
  const closestZ = Math.max(rect.z - halfD, Math.min(circle.z, rect.z + halfD));
  const dx = circle.x - closestX;
  const dz = circle.z - closestZ;
  const distSq = dx * dx + dz * dz;

  if (distSq < circle.radius * circle.radius) {
    const dist = Math.sqrt(distSq);
    if (dist > 0.0001) {
      const overlap = circle.radius - dist;
      circle.x += (dx / dist) * overlap;
      circle.z += (dz / dist) * overlap;
    }
  }
}

function isCircleOverlappingRect3D(circle, rect) {
  const halfW = rect.w / 2;
  const halfD = rect.d / 2;
  const closestX = Math.max(rect.x - halfW, Math.min(circle.x, rect.x + halfW));
  const closestZ = Math.max(rect.z - halfD, Math.min(circle.z, rect.z + halfD));
  const dx = circle.x - closestX;
  const dz = circle.z - closestZ;
  return (dx * dx + dz * dz) < (circle.radius * circle.radius);
}

// =============================================================================
// 10. LOBBY & MATCH CONTROLLER
// =============================================================================
const lobbyScreen = document.getElementById('lobby-screen');
const uiLayer = document.getElementById('ui-layer');

const blueGemsEl = document.getElementById('blue-gems');
const redGemsEl = document.getElementById('red-gems');
const matchStatusEl = document.getElementById('match-status');
const playerHpFill = document.getElementById('player-hp-fill');
const playerHpText = document.getElementById('player-hp-text');
const hudBrawlerName = document.getElementById('hud-brawler-name');
const aimToast = document.getElementById('aim-toast');

const ammoSlotEls = [
  document.querySelector('#ammo-1 .ammo-fill'),
  document.querySelector('#ammo-2 .ammo-fill'),
  document.querySelector('#ammo-3 .ammo-fill')
];

let selectedBrawlerKey = 'shelly';
let selectedMapKey = 'crystalCavern';
let isGameRunning = false;

document.querySelectorAll('#brawler-select-grid .select-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#brawler-select-grid .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedBrawlerKey = card.dataset.brawler;
  });
});

document.querySelectorAll('#map-select-grid .select-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('#map-select-grid .select-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    selectedMapKey = card.dataset.map;
  });
});

const btnPlay = document.getElementById('btn-play');
const btnReturnMenu = document.getElementById('btn-return-menu');
btnPlay.addEventListener('click', () => { startMatch(); });
btnReturnMenu.addEventListener('click', () => { returnToLobby(); });

function returnToLobby() {
  isGameRunning = false;
  document.getElementById('lobby-screen').style.display = 'flex';
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('joystick-canvas').style.display = 'none';
  document.getElementById('ui-layer').style.display = 'none';
  // Resume preview animation
  if (!previewAnimFrame) animatePreview();
}

function startMatch() {
  init3DMatch(selectedBrawlerKey, selectedMapKey);
  document.getElementById('lobby-screen').style.display = 'none';
  document.getElementById('game-container').style.display = 'block';
  document.getElementById('joystick-canvas').style.display = 'block';
  document.getElementById('ui-layer').style.display = 'flex';
  isGameRunning = true;
  // Stop preview loop (save GPU)
  if (previewAnimFrame) { cancelAnimationFrame(previewAnimFrame); previewAnimFrame = null; }
}

function init3DMatch(brawlerKey, mapKey) {
  // Clear old brawlers, bullets, gems
  for (const b of blueTeam3D) b.destroy();
  for (const b of redTeam3D) b.destroy();
  for (const p of projectiles3D) p.destroy();
  for (const g of gems3D) g.destroy();

  blueTeam3D = [];
  redTeam3D = [];
  projectiles3D.length = 0;
  particles3D.length = 0;
  gems3D.length = 0;
  gemSpawnTimer = 0;

  // Build Map
  build3DArena(mapKey);

  // Spawn Player (Blue Leader)
  localPlayer3D = new Brawler3D(brawlerKey, 'blue', true, 'YOU');
  localPlayer3D.x = 0; localPlayer3D.z = 18;
  localPlayer3D.spawnX = 0; localPlayer3D.spawnZ = 18;

  // Spawn Friendly Bots
  const allyKeys = Object.keys(BRAWLERS_3D).filter(k => k !== brawlerKey);
  const botAlly1 = new Bot3D(allyKeys[0] || 'colt', 'blue', 'ALLY 1');
  botAlly1.x = -4.5; botAlly1.z = 19; botAlly1.spawnX = -4.5; botAlly1.spawnZ = 19;

  const botAlly2 = new Bot3D(allyKeys[1] || 'el_primo', 'blue', 'ALLY 2');
  botAlly2.x = 4.5; botAlly2.z = 19; botAlly2.spawnX = 4.5; botAlly2.spawnZ = 19;

  blueTeam3D = [localPlayer3D, botAlly1, botAlly2];

  // Spawn Enemy Bots (Red Team)
  redTeam3D = [
    new Bot3D('shelly', 'red', 'BOT SHELLY'),
    new Bot3D('colt', 'red', 'BOT COLT'),
    new Bot3D('el_primo', 'red', 'BOT PRIMO')
  ];
  redTeam3D[0].x = 0; redTeam3D[0].z = -18; redTeam3D[0].spawnX = 0; redTeam3D[0].spawnZ = -18;
  redTeam3D[1].x = -4.5; redTeam3D[1].z = -19; redTeam3D[1].spawnX = -4.5; redTeam3D[1].spawnZ = -19;
  redTeam3D[2].x = 4.5; redTeam3D[2].z = -19; redTeam3D[2].spawnX = 4.5; redTeam3D[2].spawnZ = -19;

  hudBrawlerName.textContent = BRAWLERS_3D[brawlerKey].name;
  matchEndTriggered = false;
  updateGemScoreHUD();
}

function updateGemScoreHUD() {
  if (!blueTeam3D.length || !redTeam3D.length) return;
  const blueTotal = blueTeam3D.reduce((s, b) => s + b.gems, 0);
  const redTotal  = redTeam3D.reduce((s, b) => s + b.gems, 0);
  blueGemsEl.textContent = blueTotal;
  redGemsEl.textContent  = redTotal;

  if (blueTotal >= GAME_CONFIG.GEMS_TO_WIN) {
    matchStatusEl.textContent = '🏆 BLUE TEAM WINNING!';
    triggerMatchEnd('win');
  } else if (redTotal >= GAME_CONFIG.GEMS_TO_WIN) {
    matchStatusEl.textContent = '💀 RED TEAM WINNING!';
    triggerMatchEnd('lose');
  } else {
    matchStatusEl.textContent = '3v3 GEM GRAB';
  }
}

// Match-end lock (call only once)
let matchEndTriggered = false;

function triggerMatchEnd(result) {
  if (matchEndTriggered) return;
  matchEndTriggered = true;
  isGameRunning = false;

  // Trophies calculation
  const change = result === 'win' ? GAME_CONFIG.TROPHIES_WIN : GAME_CONFIG.TROPHIES_LOSE;
  playerTrophies = Math.max(0, playerTrophies + change);
  localStorage.setItem(TROPHY_KEY, playerTrophies);

  // Show result screen after 1.5s delay (let last action settle)
  setTimeout(() => showResultScreen(result, change), 1500);
}

// =============================================================================
// 11. MAIN GAME LOOP (60 FPS Three.js Rendering)
// =============================================================================
let lastTime = performance.now();
const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const mouse3D = new THREE.Vector3();

// =============================================================================
// RESULT SCREEN — Win/Lose overlay with trophy change
// =============================================================================
function showResultScreen(result, trophyChange) {
  const isWin = result === 'win';

  const overlay = document.createElement('div');
  overlay.id = 'result-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 300;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    background: ${isWin
      ? 'radial-gradient(circle at center, rgba(21,128,61,0.97), rgba(5,46,22,0.98))'
      : 'radial-gradient(circle at center, rgba(127,29,29,0.97), rgba(69,10,10,0.98))'};
    animation: fadeInOverlay 0.5s ease;
    font-family: "Segoe UI", Arial, sans-serif;
  `;

  // Animated particles
  const particleCount = 18;
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    const size = 8 + Math.random() * 14;
    const startX = Math.random() * 100;
    const delay = Math.random() * 2.5;
    const dur = 2 + Math.random() * 2;
    p.style.cssText = `
      position: absolute;
      left: ${startX}%; top: 110%;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${isWin ? '#facc15' : '#ef4444'};
      opacity: 0.7;
      animation: floatUp ${dur}s ${delay}s ease-in infinite;
    `;
    overlay.appendChild(p);
  }

  overlay.innerHTML += `
    <style>
      @keyframes fadeInOverlay { from { opacity:0; transform:scale(0.92); } to { opacity:1; transform:scale(1); } }
      @keyframes floatUp { from { transform:translateY(0) scale(1); opacity:0.7; } to { transform:translateY(-130vh) scale(0.5); opacity:0; } }
      @keyframes popIn   { from { transform:scale(0.6); opacity:0; } to { transform:scale(1); opacity:1; } }
      @keyframes trophyPop { 0%{transform:scale(0.5) rotate(-10deg);opacity:0} 60%{transform:scale(1.15) rotate(4deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
      @keyframes counterUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      #result-box { animation: popIn 0.4s cubic-bezier(0.4,0,0.2,1) 0.2s both; }
      .result-btn:active { transform: translateY(3px); }
    </style>

    <div id="result-box" style="
      background: rgba(0,0,0,0.5);
      border: 3px solid ${isWin ? '#22c55e' : '#ef4444'};
      border-radius: 28px;
      padding: 32px 40px 28px;
      display: flex; flex-direction: column; align-items: center; gap: 18px;
      max-width: 360px; width: 90%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15);
    ">
      <!-- Result Title -->
      <div style="font-size: 48px; line-height: 1;">${isWin ? '🏆' : '💀'}</div>
      <div style="
        font-size: 32px; font-weight: 900; letter-spacing: 3px;
        color: ${isWin ? '#4ade80' : '#f87171'};
        text-shadow: 0 2px 10px ${isWin ? 'rgba(74,222,128,0.5)' : 'rgba(248,113,113,0.5)'};
      ">${isWin ? 'VICTORY!' : 'DEFEAT!'}</div>

      <!-- Match Stats -->
      <div style="
        background: rgba(0,0,0,0.3); border-radius: 16px;
        padding: 14px 20px; width: 100%;
        display: flex; flex-direction: column; gap: 8px;
      ">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="color:#94a3b8; font-size:13px; font-weight:700;">💎 GEMS COLLECTED</span>
          <span style="color:#c084fc; font-size:16px; font-weight:900;" id="res-gems">0</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="color:#94a3b8; font-size:13px; font-weight:700;">💥 ELIMINATIONS</span>
          <span style="color:#fb923c; font-size:16px; font-weight:900;" id="res-kills">0</span>
        </div>
      </div>

      <!-- Trophy Change -->
      <div style="
        display: flex; flex-direction: column; align-items: center; gap: 6px;
        animation: trophyPop 0.6s 0.5s cubic-bezier(0.4,0,0.2,1) both;
      ">
        <div style="color:#94a3b8; font-size:12px; font-weight:700; letter-spacing:1px;">TROPHIES</div>
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="color:#fde68a; font-size:28px; font-weight:900;">⭐ ${playerTrophies - trophyChange}</span>
          <span style="
            color: ${trophyChange > 0 ? '#4ade80' : '#f87171'};
            font-size: 22px; font-weight: 900;
            background: rgba(0,0,0,0.3); border-radius:10px; padding: 3px 10px;
            animation: counterUp 0.4s 0.9s both;
          ">${trophyChange > 0 ? '+' : ''}${trophyChange}</span>
          <span style="color:#facc15; font-size:28px; font-weight:900;">⭐ ${playerTrophies}</span>
        </div>
        <!-- Trophy progress bar -->
        <div style="width:200px; height:10px; background:rgba(0,0,0,0.4); border-radius:5px; overflow:hidden; margin-top:4px;">
          <div style="
            height:100%; background: linear-gradient(90deg, #facc15, #f59e0b);
            border-radius:5px;
            width:${Math.min(100, (playerTrophies % 100))}%;
            transition: width 0.8s ease 1s;
          "></div>
        </div>
        <div style="color:#fde68a; font-size:11px; font-weight:700;">${playerTrophies} / ${Math.ceil(playerTrophies / 100) * 100} next league</div>
      </div>

      <!-- Action Buttons -->
      <div style="display:flex; gap:12px; width:100%; margin-top:4px;">
        <button onclick="restartMatch()" class="result-btn" style="
          flex: 1;
          background: linear-gradient(180deg, #facc15, #ca8a04);
          color: #422006; font-size: 15px; font-weight: 900; letter-spacing: 1px;
          border: none; border-radius: 16px; padding: 13px 10px;
          box-shadow: 0 6px 0 #854d0e; cursor: pointer;
          transition: all 0.15s;
        ">🔄 PLAY AGAIN</button>
        <button onclick="exitToMenu()" class="result-btn" style="
          flex: 1;
          background: linear-gradient(180deg, #475569, #1e293b);
          color: #ffffff; font-size: 15px; font-weight: 900; letter-spacing: 1px;
          border: 2px solid #334155; border-radius: 16px; padding: 13px 10px;
          box-shadow: 0 6px 0 #0f172a; cursor: pointer;
          transition: all 0.15s;
        ">🏠 MENU</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Populate stats after mount
  setTimeout(() => {
    const playerGems = blueTeam3D.length ? blueTeam3D[0].gems : 0;
    const resGemsEl = document.getElementById('res-gems');
    if (resGemsEl) resGemsEl.textContent = blueTeam3D.reduce((s, b) => s + b.gems, 0);
    const resKillsEl = document.getElementById('res-kills');
    if (resKillsEl) resKillsEl.textContent = blueTeam3D[0] ? (blueTeam3D[0].kills || 0) : 0;
  }, 100);

  // Update lobby trophies counter
  updateLobbyTrophies();
}

function removeResultScreen() {
  const overlay = document.getElementById('result-overlay');
  if (overlay) overlay.remove();
}

function restartMatch() {
  removeResultScreen();
  startMatch();
}

function exitToMenu() {
  removeResultScreen();
  returnToLobby();
}

function updateLobbyTrophies() {
  const el = document.querySelector('.profile-cups');
  if (el) el.textContent = `⭐ ${playerTrophies}`;
  const coinsVal = document.getElementById('coins-val');
  if (coinsVal) {
    // Award some gold too
    const currentCoins = parseInt(coinsVal.textContent || '231', 10);
    const coinReward = matchEndTriggered ? (blueTeam3D.reduce((s, b) => s + b.gems, 0) * 5) : 0;
    coinsVal.textContent = currentCoins + coinReward;
  }
}

// =============================================================================
// LOBBY MENU LOGIC — 3D Preview Canvas + Brawler/Map Selection
// =============================================================================

const BRAWLER_KEYS = ['shelly', 'colt', 'el_primo'];
let currentBrawlerIdx = 0;

// Lobby stats data for each brawler
const LOBBY_STATS = {
  shelly:   { hp: 70, dmg: 75, spd: 65, rng: 55, role: 'SPREAD SHOTGUNNER', cups: 126, power: 7 },
  colt:     { hp: 55, dmg: 90, spd: 80, rng: 90, role: 'RAPID GUNSLINGER',  cups: 84,  power: 5 },
  el_primo: { hp: 100, dmg: 85, spd: 75, rng: 30, role: 'LUCHADOR TANK',    cups: 203, power: 9 }
};

// --- Lobby 3D Preview Scene ---
let previewScene, previewCamera, previewRenderer, previewBrawlerMesh;
let previewAnimFrame = null;
let previewTime = 0;

function initPreviewScene() {
  const pCanvas = document.getElementById('preview-canvas');
  if (!pCanvas) return;

  previewScene = new THREE.Scene();
  previewScene.background = null; // transparent

  previewCamera = new THREE.PerspectiveCamera(45, pCanvas.clientWidth / pCanvas.clientHeight, 0.1, 50);
  previewCamera.position.set(0, 4.5, 6.5);
  previewCamera.lookAt(0, 1.6, 0);

  previewRenderer = new THREE.WebGLRenderer({ canvas: pCanvas, antialias: true, alpha: true });
  previewRenderer.setPixelRatio(window.devicePixelRatio);
  previewRenderer.shadowMap.enabled = true;

  // Lighting
  const pAmb = new THREE.AmbientLight(0xffffff, 0.7);
  previewScene.add(pAmb);

  const pDir = new THREE.DirectionalLight(0xfffaed, 1.1);
  pDir.position.set(5, 10, 8);
  pDir.castShadow = true;
  previewScene.add(pDir);

  const pRim = new THREE.DirectionalLight(0xf97316, 0.5);
  pRim.position.set(-5, 2, -4);
  previewScene.add(pRim);

  // Platform
  const platGeo = new THREE.CylinderGeometry(2.0, 2.0, 0.22, 32);
  const platMat = new THREE.MeshStandardMaterial({ color: 0xea580c, metalness: 0.3, roughness: 0.5 });
  const platMesh = new THREE.Mesh(platGeo, platMat);
  platMesh.position.y = -0.11;
  platMesh.receiveShadow = true;
  previewScene.add(platMesh);

  // Platform ring glow
  const ringGeo = new THREE.TorusGeometry(2.1, 0.08, 8, 48);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
  const ringMesh = new THREE.Mesh(ringGeo, ringMat);
  ringMesh.rotation.x = Math.PI / 2;
  ringMesh.position.y = 0.0;
  previewScene.add(ringMesh);

  // Load initial brawler
  loadPreviewBrawler(BRAWLER_KEYS[currentBrawlerIdx]);
  animatePreview();
}

function loadPreviewBrawler(key) {
  if (previewBrawlerMesh) previewScene.remove(previewBrawlerMesh);

  const rig = create3DBrawlerMesh(key, 'blue');
  previewBrawlerMesh = rig.root;

  // Scale up 2.5x for showcase
  previewBrawlerMesh.scale.set(2.5, 2.5, 2.5);
  previewBrawlerMesh.position.set(0, 0, 0);

  // Face the camera (front-facing)
  rig.torsoGroup.rotation.y = 0;

  previewScene.add(previewBrawlerMesh);

  // Animate preview walk idle
  previewBrawlerMesh.userData.rig = rig;

  // Update UI stats panel
  updateLobbyStats(key);
}

function animatePreview() {
  previewAnimFrame = requestAnimationFrame(animatePreview);

  previewTime += 0.016;

  if (previewBrawlerMesh) {
    // Slow breathing/idle rotation
    previewBrawlerMesh.rotation.y = Math.sin(previewTime * 0.4) * 0.18;

    // Idle bounce
    previewBrawlerMesh.position.y = Math.sin(previewTime * 1.5) * 0.06;

    // Leg idle sway
    const rig = previewBrawlerMesh.userData.rig;
    if (rig) {
      rig.leftLegPivot.rotation.x  =  Math.sin(previewTime * 1.5) * 0.1;
      rig.rightLegPivot.rotation.x = -Math.sin(previewTime * 1.5) * 0.1;
    }
  }

  // Resize canvas to actual display size
  const pCanvas = document.getElementById('preview-canvas');
  if (pCanvas && previewRenderer) {
    const w = pCanvas.clientWidth;
    const h = pCanvas.clientHeight;
    if (previewRenderer.domElement.width !== w || previewRenderer.domElement.height !== h) {
      previewRenderer.setSize(w, h, false);
      previewCamera.aspect = w / h;
      previewCamera.updateProjectionMatrix();
    }
    previewRenderer.render(previewScene, previewCamera);
  }
}

function updateLobbyStats(key) {
  const s = LOBBY_STATS[key];
  document.getElementById('stat-hp').style.width  = s.hp  + '%';
  document.getElementById('stat-dmg').style.width = s.dmg + '%';
  document.getElementById('stat-spd').style.width = s.spd + '%';
  document.getElementById('stat-rng').style.width = s.rng + '%';
  document.getElementById('role-tag').textContent = s.role;
  document.getElementById('stage-brawler-name').textContent = BRAWLERS_3D[key].name;
  document.getElementById('stage-cups').textContent = '🏆 ' + s.cups;
  document.getElementById('stage-power').textContent = 'POWER ' + s.power;
  document.getElementById('stage-level').textContent = s.power;
}

// Arrow Brawler Swipe
function prevBrawler() {
  currentBrawlerIdx = (currentBrawlerIdx - 1 + BRAWLER_KEYS.length) % BRAWLER_KEYS.length;
  selectedBrawlerKey = BRAWLER_KEYS[currentBrawlerIdx];
  loadPreviewBrawler(selectedBrawlerKey);
  highlightDrawerCard('#brawler-drawer', selectedBrawlerKey, 'brawler');
}

function nextBrawler() {
  currentBrawlerIdx = (currentBrawlerIdx + 1) % BRAWLER_KEYS.length;
  selectedBrawlerKey = BRAWLER_KEYS[currentBrawlerIdx];
  loadPreviewBrawler(selectedBrawlerKey);
  highlightDrawerCard('#brawler-drawer', selectedBrawlerKey, 'brawler');
}

// Drawer open/close
function openBrawlerSelect() {
  document.getElementById('brawler-drawer').classList.remove('hidden');
  document.getElementById('drawer-backdrop').classList.remove('hidden');
}

function closeBrawlerSelect() {
  document.getElementById('brawler-drawer').classList.add('hidden');
  document.getElementById('drawer-backdrop').classList.add('hidden');
}

function openMapSelect() {
  document.getElementById('map-drawer').classList.remove('hidden');
  document.getElementById('drawer-backdrop').classList.remove('hidden');
}

function closeMapSelect() {
  document.getElementById('map-drawer').classList.add('hidden');
  document.getElementById('drawer-backdrop').classList.add('hidden');
}

function closeAll() {
  closeBrawlerSelect();
  closeMapSelect();
}

function pickBrawler(key, el) {
  selectedBrawlerKey = key;
  currentBrawlerIdx = BRAWLER_KEYS.indexOf(key);
  loadPreviewBrawler(key);
  highlightDrawerCard('#brawler-drawer', key, 'brawler');
  setTimeout(closeBrawlerSelect, 300);
}

function pickMap(mapKey, name, label, el) {
  selectedMapKey = mapKey;
  document.getElementById('event-map-name').textContent = label;
  highlightDrawerCard('#map-drawer', mapKey, 'map');
  setTimeout(closeMapSelect, 300);
}

function highlightDrawerCard(drawerId, key, type) {
  const attr = type === 'brawler' ? 'data-brawler' : 'data-map';
  document.querySelectorAll(`${drawerId} .drawer-card`).forEach(c => {
    c.classList.toggle('selected', c.getAttribute(attr) === key);
  });
}

function selectMapDot(idx, mapKey) {
  selectedMapKey = mapKey;
  document.querySelectorAll('.map-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
  const labels = {
    crystalCavern: 'Crystal Cavern · Divisione cellulare',
    desertDunes: 'Desert Dunes · Open Field',
    snakePrairie: 'Snake Prairie · Dense Bush'
  };
  document.getElementById('event-map-name').textContent = labels[mapKey];
}

// Initialize preview after DOM is ready
initThreeScene();
init3DAimIndicator();
initPreviewScene();

function animate(currentTime) {
  requestAnimationFrame(animate);

  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  if (isGameRunning && localPlayer3D) {
    const player = localPlayer3D;

    // 1. Gem Mine Spawner (center 3D crystal)
    gemSpawnTimer += dt;
    if (gemSpawnTimer >= GAME_CONFIG.GEM_SPAWN_INTERVAL && gems3D.length < 12) {
      gemSpawnTimer = 0;
      const ang = Math.random() * Math.PI * 2;
      const dist = 1.8 + Math.random() * 2.2;
      spawnGem3D(Math.cos(ang) * dist, Math.sin(ang) * dist);
    }

    // 2. Player Controls & Aiming
    let moveX = 0;
    let moveZ = 0;
    if (pcInput.keys['KeyW'] || pcInput.keys['ArrowUp']) moveZ -= 1;
    if (pcInput.keys['KeyS'] || pcInput.keys['ArrowDown']) moveZ += 1;
    if (pcInput.keys['KeyA'] || pcInput.keys['ArrowLeft']) moveX -= 1;
    if (pcInput.keys['KeyD'] || pcInput.keys['ArrowRight']) moveX += 1;

    if (touchControls.left.active) {
      moveX = touchControls.left.vector.x;
      moveZ = touchControls.left.vector.z;
    }

    if (touchControls.right.active && touchControls.right.hasDragged) {
      player.aimAngle = touchControls.right.angle;
    } else if (pcInput.isMouseAiming) {
      // 3D Mouse Raycast to Ground Plane
      const ndcX = (pcInput.mouseScreen.x / sceneWidth) * 2 - 1;
      const ndcY = -(pcInput.mouseScreen.y / sceneHeight) * 2 + 1;
      raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
      raycaster.ray.intersectPlane(groundPlane, mouse3D);
      player.aimAngle = Math.atan2(mouse3D.z - player.z, mouse3D.x - player.x);
    }

    player.updateBase(dt, moveX, moveZ);

    // 3. Smooth 3D Camera Follow
    camera.position.x += (player.x - camera.position.x) * 0.12;
    camera.position.z += (player.z + 18 - camera.position.z) * 0.12;
    camera.lookAt(camera.position.x, 0, camera.position.z - 18);

    // 4. Update Bots
    for (let i = 1; i < blueTeam3D.length; i++) blueTeam3D[i].updateAI(dt, player);
    for (const enemy of redTeam3D) enemy.updateAI(dt, player);

    // 5. Update Projectiles, Particles & Gems
    for (let i = projectiles3D.length - 1; i >= 0; i--) {
      projectiles3D[i].update(dt);
      if (projectiles3D[i].markedForDeletion) projectiles3D.splice(i, 1);
    }
    for (let i = particles3D.length - 1; i >= 0; i--) {
      particles3D[i].update(dt);
      if (particles3D[i].life <= 0) particles3D.splice(i, 1);
    }
    for (const g of gems3D) g.update(dt);

    // 6. Update HUD Card
    const hpPercent = Math.max(0, player.hp / player.maxHp) * 100;
    playerHpFill.style.width = `${hpPercent}%`;
    playerHpText.textContent = player.isDead ? `RESPAWNING IN ${Math.ceil(player.respawnTimer)}s` : `${player.hp} / ${player.maxHp}`;

    ammoSlotEls.forEach((el, idx) => {
      if (idx < player.ammo) {
        el.style.width = '100%';
        el.style.backgroundColor = '#f59e0b';
      } else if (idx === player.ammo) {
        el.style.width = `${(player.reloadTimer / GAME_CONFIG.AMMO_RELOAD_TIME) * 100}%`;
        el.style.backgroundColor = '#fbbf24';
      } else {
        el.style.width = '0%';
      }
    });

    update3DAimIndicator(player);
  }

  // Render 3D Scene
  renderer.render(scene, camera);

  // Render 2D Touch Joysticks
  renderJoysticks2D();
}

requestAnimationFrame(animate);
