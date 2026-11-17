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
    speed: 12.0,
    bulletRange: 14.0,
    bulletSpeed: 38.0,
    bulletDamage: 300,
    pellets: 5,
    spreadAngle: 0.38,
    radius: 0.9,
    hairColor: 0x9333ea, // Signature Purple
    skinColor: 0xfed7aa,
    shirtColor: 0x2563eb,
    weaponType: 'shotgun'
  },
  colt: {
    name: 'COLT',
    role: 'Gunslinger',
    maxHp: 2800,
    speed: 13.0,
    bulletRange: 18.0,
    bulletSpeed: 45.0,
    bulletDamage: 340,
    pellets: 1,
    burstCount: 4,
    burstDelay: 0.08,
    spreadAngle: 0.04,
    radius: 0.85,
    hairColor: 0xdc2626, // Red Pompadour
    skinColor: 0xfed7aa,
    shirtColor: 0x1e3a8a,
    weaponType: 'dual_pistols'
  },
  el_primo: {
    name: 'EL PRIMO',
    role: 'Luchador Tank',
    maxHp: 5600,
    speed: 12.5,
    bulletRange: 9.0,
    bulletSpeed: 32.0,
    bulletDamage: 420,
    pellets: 4,
    spreadAngle: 0.42,
    radius: 1.1,
    maskColor: 0x2563eb, // Blue Luchador Mask
    skinColor: 0xe09f67, // Tan muscular skin
    trimsColor: 0xfacc15, // Gold accents
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
  GEM_SPAWN_INTERVAL: 6.0
};

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
        b.takeDamage(this.damage);
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
const btnPlay = document.getElementById('btn-play');
const btnReturnMenu = document.getElementById('btn-return-menu');

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

btnPlay.addEventListener('click', () => { startMatch(); });
btnReturnMenu.addEventListener('click', () => { returnToLobby(); });

function returnToLobby() {
  isGameRunning = false;
  lobbyScreen.style.display = 'flex';
  uiLayer.style.display = 'none';
}

function startMatch() {
  init3DMatch(selectedBrawlerKey, selectedMapKey);
  lobbyScreen.style.display = 'none';
  uiLayer.style.display = 'flex';
  isGameRunning = true;
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
  updateGemScoreHUD();
}

function updateGemScoreHUD() {
  const blueTotal = blueTeam3D.reduce((s, b) => s + b.gems, 0);
  const redTotal = redTeam3D.reduce((s, b) => s + b.gems, 0);
  blueGemsEl.textContent = blueTotal;
  redGemsEl.textContent = redTotal;

  if (blueTotal >= 10) matchStatusEl.textContent = 'BLUE TEAM WINNING! (10 GEMS)';
  else if (redTotal >= 10) matchStatusEl.textContent = 'RED TEAM WINNING! (10 GEMS)';
  else matchStatusEl.textContent = '3v3 GEM GRAB';
}

// =============================================================================
// 11. MAIN GAME LOOP (60 FPS Three.js Rendering)
// =============================================================================
let lastTime = performance.now();
const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const mouse3D = new THREE.Vector3();

initThreeScene();
init3DAimIndicator();

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
