/**
 * Brawl Arena - 2D/3D Top-Down Web Shooter (Pure HTML5 Canvas + Vanilla JS)
 * Features:
 * - 3D Layered Procedural Brawler Models (Shelly, Colt, Bull)
 * - 3v3 Match with AI Bots (Pathing, Combat, Bush Stealth, Dodging, Gem Collection)
 * - Lobby / Selection Menu for Brawlers and Maps
 * - Dual Controls: Mobile Floating Joysticks + PC WASD/Mouse
 */

// =============================================================================
// 1. BRAWLER & MAP CONFIGURATIONS
// =============================================================================
const BRAWLERS = {
  shelly: {
    name: 'SHELLY',
    role: 'Spread Shotgunner',
    maxHp: 3600,
    speed: 310,
    bulletRange: 350,
    bulletSpeed: 950,
    bulletDamage: 300,
    pellets: 5,
    spreadAngle: 0.38, // radians
    hairColor: '#a855f7',
    weaponType: 'shotgun',
    radius: 22
  },
  colt: {
    name: 'COLT',
    role: 'Rapid Gunslinger',
    maxHp: 2800,
    speed: 340,
    bulletRange: 450,
    bulletSpeed: 1100,
    bulletDamage: 340,
    pellets: 1,
    burstCount: 4,
    burstDelay: 0.08,
    spreadAngle: 0.04,
    hairColor: '#ef4444',
    weaponType: 'dual_pistols',
    radius: 20
  },
  bull: {
    name: 'BULL',
    role: 'Heavy Tank',
    maxHp: 5200,
    speed: 320,
    bulletRange: 270,
    bulletSpeed: 900,
    bulletDamage: 400,
    pellets: 5,
    spreadAngle: 0.44,
    hairColor: '#1e293b',
    weaponType: 'heavy_shotgun',
    radius: 26
  }
};

const MAP_CONFIGS = {
  crystalCavern: {
    name: 'Crystal Cavern',
    walls: [
      { x: 40, y: 40, w: 1320, h: 20 },
      { x: 40, y: 1940, w: 1320, h: 20 },
      { x: 40, y: 40, w: 20, h: 1920 },
      { x: 1340, y: 40, w: 20, h: 1920 },
      // Center Mine defense walls
      { x: 540, y: 880, w: 40, h: 240 },
      { x: 820, y: 880, w: 40, h: 240 },
      { x: 620, y: 780, w: 160, h: 36 },
      { x: 620, y: 1184, w: 160, h: 36 },
      // Side lanes
      { x: 220, y: 550, w: 160, h: 80 },
      { x: 220, y: 1370, w: 160, h: 80 },
      { x: 1020, y: 550, w: 160, h: 80 },
      { x: 1020, y: 1370, w: 160, h: 80 },
    ],
    bushes: [
      { x: 450, y: 860, w: 70, h: 280 },
      { x: 880, y: 860, w: 70, h: 280 },
      { x: 130, y: 700, w: 120, h: 600 },
      { x: 1150, y: 700, w: 120, h: 600 },
      { x: 600, y: 220, w: 200, h: 120 },
      { x: 600, y: 1660, w: 200, h: 120 },
    ]
  },
  desertDunes: {
    name: 'Desert Dunes',
    walls: [
      { x: 40, y: 40, w: 1320, h: 20 },
      { x: 40, y: 1940, w: 1320, h: 20 },
      { x: 40, y: 40, w: 20, h: 1920 },
      { x: 1340, y: 40, w: 20, h: 1920 },
      // Open pillars
      { x: 420, y: 750, w: 100, h: 100 },
      { x: 880, y: 750, w: 100, h: 100 },
      { x: 420, y: 1150, w: 100, h: 100 },
      { x: 880, y: 1150, w: 100, h: 100 },
      { x: 650, y: 950, w: 100, h: 100 }
    ],
    bushes: [
      { x: 150, y: 400, w: 160, h: 1200 },
      { x: 1090, y: 400, w: 160, h: 1200 },
      { x: 550, y: 850, w: 300, h: 60 },
      { x: 550, y: 1090, w: 300, h: 60 }
    ]
  },
  snakePrairie: {
    name: 'Snake Prairie',
    walls: [
      { x: 40, y: 40, w: 1320, h: 20 },
      { x: 40, y: 1940, w: 1320, h: 20 },
      { x: 40, y: 40, w: 20, h: 1920 },
      { x: 1340, y: 40, w: 20, h: 1920 },
      // Central cross
      { x: 620, y: 800, w: 160, h: 40 },
      { x: 620, y: 1160, w: 160, h: 40 },
      { x: 350, y: 960, w: 120, h: 80 },
      { x: 930, y: 960, w: 120, h: 80 }
    ],
    bushes: [
      // Giant jungle fields
      { x: 100, y: 400, w: 1200, h: 400 },
      { x: 100, y: 1200, w: 1200, h: 400 },
      { x: 450, y: 850, w: 500, h: 300 }
    ]
  }
};

const CONFIG = {
  WORLD_WIDTH: 1400,
  WORLD_HEIGHT: 2000,
  CAMERA_LERP: 0.12,
  MAX_AMMO: 3,
  AMMO_RELOAD_TIME: 1.25,
  JOYSTICK_MAX_RADIUS: 65,
  JOYSTICK_DEADZONE: 16,
  RESPAWN_TIME: 4.0
};

// =============================================================================
// 2. CANVAS & RESIZING
// =============================================================================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
let dpr = window.devicePixelRatio || 1;

function resizeCanvas() {
  viewportWidth = window.innerWidth;
  viewportHeight = window.innerHeight;
  dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(viewportWidth * dpr);
  canvas.height = Math.floor(viewportHeight * dpr);
  canvas.style.width = `${viewportWidth}px`;
  canvas.style.height = `${viewportHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// =============================================================================
// 3. UI REFERENCES & MENU STATE
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

// Selection cards interaction
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

btnPlay.addEventListener('click', () => {
  startMatch();
});

btnReturnMenu.addEventListener('click', () => {
  returnToLobby();
});

function returnToLobby() {
  isGameRunning = false;
  lobbyScreen.style.display = 'flex';
  uiLayer.style.display = 'none';
}

function startMatch() {
  initMatch(selectedBrawlerKey, selectedMapKey);
  lobbyScreen.style.display = 'none';
  uiLayer.style.display = 'flex';
  isGameRunning = true;
}

// =============================================================================
// 4. MAP & ACTIVE GAME STATE
// =============================================================================
let activeMap = {
  gemMine: { x: 700, y: 1000, radius: 46 },
  walls: [],
  bushes: []
};

const gems = [];
const projectiles = [];
const particles = [];
let blueTeam = [];
let redTeam = [];
let gemSpawnTimer = 0;

// Camera
const camera = {
  x: 0,
  y: 0,
  update(targetX, targetY) {
    const desiredX = targetX - viewportWidth / 2;
    const desiredY = targetY - viewportHeight / 2;
    this.x += (desiredX - this.x) * CONFIG.CAMERA_LERP;
    this.y += (desiredY - this.y) * CONFIG.CAMERA_LERP;

    const maxX = Math.max(0, CONFIG.WORLD_WIDTH - viewportWidth);
    const maxY = Math.max(0, CONFIG.WORLD_HEIGHT - viewportHeight);
    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }
};

// =============================================================================
// 5. PROJECTILES & PARTICLES
// =============================================================================
class Projectile {
  constructor(x, y, angle, damage, range, speed, team, color) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = 6;
    this.damage = damage;
    this.distanceTraveled = 0;
    this.maxDistance = range;
    this.team = team;
    this.color = color;
    this.markedForDeletion = false;
  }

  update(dt) {
    const stepX = this.vx * dt;
    const stepY = this.vy * dt;
    this.x += stepX;
    this.y += stepY;
    this.distanceTraveled += Math.hypot(stepX, stepY);

    if (this.distanceTraveled >= this.maxDistance) {
      this.markedForDeletion = true;
      spawnHitSparks(this.x, this.y, this.color, 3);
      return;
    }

    // Wall collision
    for (const wall of activeMap.walls) {
      if (isCircleOverlappingRect(this, wall)) {
        this.markedForDeletion = true;
        spawnHitSparks(this.x, this.y, '#fbbf24', 6);
        return;
      }
    }

    // Entity collision (Opposing team only)
    const targetTeam = this.team === 'blue' ? redTeam : blueTeam;
    for (const brawler of targetTeam) {
      if (!brawler.isDead && Math.hypot(this.x - brawler.x, this.y - brawler.y) < this.radius + brawler.radius) {
        brawler.takeDamage(this.damage);
        this.markedForDeletion = true;
        spawnHitSparks(this.x, this.y, '#ef4444', 8);
        return;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

class SparkParticle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 70 + Math.random() * 140;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.radius = 2 + Math.random() * 2;
    this.life = 0.2 + Math.random() * 0.2;
    this.maxLife = this.life;
    this.color = color;
  }
  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt;
  }
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function spawnHitSparks(x, y, color, count = 6) {
  for (let i = 0; i < count; i++) particles.push(new SparkParticle(x, y, color));
}

// =============================================================================
// 6. GEM LOGIC
// =============================================================================
class Gem {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 12;
    this.markedForDeletion = false;
    this.bobOffset = Math.random() * Math.PI * 2;
  }

  update(dt) {
    this.bobOffset += dt * 4;
  }

  draw(ctx) {
    const bobY = this.y + Math.sin(this.bobOffset) * 4;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(this.x, this.y + 10, this.radius * 0.8, this.radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();

    // Purple Gem crystal shape
    ctx.translate(this.x, bobY);
    ctx.beginPath();
    ctx.moveTo(0, -this.radius);
    ctx.lineTo(this.radius * 0.8, -this.radius * 0.3);
    ctx.lineTo(this.radius * 0.6, this.radius * 0.8);
    ctx.lineTo(0, this.radius);
    ctx.lineTo(-this.radius * 0.6, this.radius * 0.8);
    ctx.lineTo(-this.radius * 0.8, -this.radius * 0.3);
    ctx.closePath();

    ctx.fillStyle = '#a855f7';
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#f3e8ff';
    ctx.stroke();

    ctx.restore();
  }
}

// =============================================================================
// 7. 3D BRAWLER BASE CLASS
// =============================================================================
class Brawler {
  constructor(configKey, team, isPlayer = false, name = 'BRAWLER') {
    this.configKey = configKey;
    this.config = BRAWLERS[configKey];
    this.team = team;
    this.isPlayer = isPlayer;
    this.name = name;

    this.radius = this.config.radius;
    this.maxHp = this.config.maxHp;
    this.hp = this.maxHp;
    this.speed = this.config.speed;
    this.aimAngle = team === 'blue' ? -Math.PI / 2 : Math.PI / 2;

    this.x = 700;
    this.y = team === 'blue' ? 1800 : 200;
    this.spawnX = this.x;
    this.spawnY = this.y;

    this.ammo = CONFIG.MAX_AMMO;
    this.reloadTimer = 0;
    this.gems = 0;
    this.inBush = false;
    this.isDead = false;
    this.respawnTimer = 0;

    // 3D visual animation states
    this.walkCycle = 0;
    this.isMoving = false;
    this.recoilAnim = 0;
    this.hitFlashTimer = 0;
  }

  takeDamage(amount) {
    if (this.isDead) return;
    this.hp = Math.max(0, this.hp - amount);
    this.hitFlashTimer = 0.12;

    if (this.hp <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.respawnTimer = CONFIG.RESPAWN_TIME;
    spawnHitSparks(this.x, this.y, '#ef4444', 20);

    // Drop gems at death position
    for (let i = 0; i < this.gems; i++) {
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      gems.push(new Gem(this.x + offsetX, this.y + offsetY));
    }
    this.gems = 0;
    updateGemScoreHUD();
  }

  respawn() {
    this.isDead = false;
    this.hp = this.maxHp;
    this.ammo = CONFIG.MAX_AMMO;
    this.x = this.spawnX + (Math.random() - 0.5) * 100;
    this.y = this.spawnY + (Math.random() - 0.5) * 40;
    spawnHitSparks(this.x, this.y, '#3b82f6', 15);
  }

  shoot(angle) {
    if (this.isDead || this.ammo < 1) return;
    this.ammo -= 1;
    this.aimAngle = angle;
    this.recoilAnim = 1.0;

    const bulletColor = this.team === 'blue' ? '#60a5fa' : '#f87171';
    const cfg = this.config;

    // Weapon firing modes
    if (cfg.pellets > 1) {
      // Spread Shot (Shelly & Bull)
      const startAngle = angle - cfg.spreadAngle / 2;
      const step = cfg.spreadAngle / (cfg.pellets - 1);
      for (let i = 0; i < cfg.pellets; i++) {
        const pAngle = startAngle + step * i;
        const bx = this.x + Math.cos(pAngle) * (this.radius + 12);
        const by = this.y + Math.sin(pAngle) * (this.radius + 12);
        projectiles.push(new Projectile(bx, by, pAngle, cfg.bulletDamage, cfg.bulletRange, cfg.bulletSpeed, this.team, bulletColor));
      }
    } else {
      // Single / Burst Stream (Colt)
      const bx = this.x + Math.cos(angle) * (this.radius + 14);
      const by = this.y + Math.sin(angle) * (this.radius + 14);
      projectiles.push(new Projectile(bx, by, angle, cfg.bulletDamage, cfg.bulletRange, cfg.bulletSpeed, this.team, bulletColor));
    }

    spawnHitSparks(this.x + Math.cos(angle) * this.radius, this.y + Math.sin(angle) * this.radius, '#fde047', 4);
  }

  updateBase(dt, moveX, moveY) {
    if (this.isDead) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) this.respawn();
      return;
    }

    // Ammo reload
    if (this.ammo < CONFIG.MAX_AMMO) {
      this.reloadTimer += dt;
      if (this.reloadTimer >= CONFIG.AMMO_RELOAD_TIME) {
        this.ammo = Math.min(CONFIG.MAX_AMMO, this.ammo + 1);
        this.reloadTimer = 0;
      }
    }

    // Animation recoil & hit flash
    if (this.recoilAnim > 0) this.recoilAnim = Math.max(0, this.recoilAnim - dt * 6);
    if (this.hitFlashTimer > 0) this.hitFlashTimer = Math.max(0, this.hitFlashTimer - dt);

    // Movement
    const len = Math.hypot(moveX, moveY);
    if (len > 0) {
      this.isMoving = true;
      this.walkCycle += dt * 14;
      this.x += (moveX / len) * this.speed * dt;
      this.y += (moveY / len) * this.speed * dt;
    } else {
      this.isMoving = false;
    }

    // Solid Wall Collision
    for (const wall of activeMap.walls) {
      resolveCircleAABB(this, wall);
    }
    this.x = Math.max(this.radius + 60, Math.min(this.x, CONFIG.WORLD_WIDTH - this.radius - 60));
    this.y = Math.max(this.radius + 60, Math.min(this.y, CONFIG.WORLD_HEIGHT - this.radius - 60));

    // Bush Check
    this.inBush = false;
    for (const bush of activeMap.bushes) {
      if (isCircleOverlappingRect(this, bush)) {
        this.inBush = true;
        break;
      }
    }

    // Gem Collection
    for (let i = gems.length - 1; i >= 0; i--) {
      const g = gems[i];
      if (Math.hypot(this.x - g.x, this.y - g.y) < this.radius + g.radius) {
        this.gems += 1;
        gems.splice(i, 1);
        spawnHitSparks(this.x, this.y, '#c084fc', 8);
        updateGemScoreHUD();
      }
    }
  }

  // 3D Procedural Brawler Model Drawing
  draw(ctx, localPlayer) {
    if (this.isDead) return;

    // Brawl Stars Bush Stealth Rule:
    // If enemy is in bush, they are hidden from local player unless local player is inside the same bush OR within 110px!
    if (!this.isPlayer && this.team !== localPlayer.team && this.inBush) {
      const distToPlayer = Math.hypot(this.x - localPlayer.x, this.y - localPlayer.y);
      if (!localPlayer.inBush && distToPlayer > 115) {
        return; // Completely invisible in stealth!
      }
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    // Stealth alpha
    let alpha = 1.0;
    if (this.inBush) {
      alpha = (this.isPlayer || this.team === localPlayer.team) ? 0.45 : 0.75;
    }
    ctx.globalAlpha = alpha;

    // 1. Soft 3D Ground Shadow
    ctx.beginPath();
    ctx.ellipse(0, this.radius * 0.7, this.radius * 0.95, this.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.fill();

    // 2. Animated 3D Walking Boots
    const footOffset = this.isMoving ? Math.sin(this.walkCycle) * 6 : 0;
    ctx.save();
    ctx.rotate(this.aimAngle);
    // Left Foot
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-this.radius * 0.5 + footOffset, -this.radius * 0.8, 10, 6);
    // Right Foot
    ctx.fillRect(-this.radius * 0.5 - footOffset, this.radius * 0.8 - 6, 10, 6);
    ctx.restore();

    // 3. 3D Body & Torso (Layered with Z-Height)
    const isAlly = this.team === 'blue';
    const primaryColor = isAlly ? '#2563eb' : '#dc2626';
    const highlightColor = isAlly ? '#60a5fa' : '#f87171';
    const recoilShift = this.recoilAnim * -5;

    ctx.save();
    ctx.rotate(this.aimAngle);
    ctx.translate(recoilShift, 0);

    // Torso Extrusion (Height)
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    const bodyGradient = ctx.createRadialGradient(-3, -4, 2, 0, 0, this.radius);
    if (this.hitFlashTimer > 0) {
      bodyGradient.addColorStop(0, '#ffffff');
      bodyGradient.addColorStop(1, '#ffffff');
    } else {
      bodyGradient.addColorStop(0, highlightColor);
      bodyGradient.addColorStop(1, primaryColor);
    }
    ctx.fillStyle = bodyGradient;
    ctx.fill();

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = this.inBush ? '#4ade80' : (isAlly ? '#1d4ed8' : '#991b1b');
    ctx.stroke();

    // 4. Distinctive 3D Weapon
    this.drawWeapon(ctx);

    // 5. 3D Raised Head & Hair
    ctx.beginPath();
    ctx.arc(-2, 0, this.radius * 0.55, 0, Math.PI * 2);
    ctx.fillStyle = this.config.hairColor;
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Face / Visor
    ctx.beginPath();
    ctx.arc(this.radius * 0.25, 0, this.radius * 0.28, 0, Math.PI * 2);
    ctx.fillStyle = '#fed7aa'; // Skin tone
    ctx.fill();

    ctx.restore(); // Exit rotated body

    // 6. Overhead Health Bar & Gem Counter
    this.drawOverheadHUD(ctx);

    ctx.restore();
  }

  drawWeapon(ctx) {
    const cfg = this.config;
    if (cfg.weaponType === 'shotgun') {
      // Shelly's Pump Shotgun
      ctx.fillStyle = '#334155';
      ctx.fillRect(this.radius * 0.2, -5, this.radius * 1.1, 10);
      ctx.fillStyle = '#92400e'; // Wooden grip
      ctx.fillRect(this.radius * 0.3, -4, 8, 8);
    } else if (cfg.weaponType === 'dual_pistols') {
      // Colt's Dual Revolvers
      ctx.fillStyle = '#475569';
      ctx.fillRect(this.radius * 0.2, -11, this.radius * 0.9, 5);
      ctx.fillRect(this.radius * 0.2, 6, this.radius * 0.9, 5);
    } else {
      // Bull's Heavy Double Shotgun
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(this.radius * 0.2, -7, this.radius * 1.0, 14);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(this.radius * 0.3, -5, 10, 10);
    }
  }

  drawOverheadHUD(ctx) {
    const barW = 46;
    const barH = 6;
    const barY = -this.radius - 14;

    // Background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(-barW / 2 - 1, barY - 1, barW + 2, barH + 2);

    // HP Fill
    const hpPercent = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = this.team === 'blue' ? '#22c55e' : '#ef4444';
    ctx.fillRect(-barW / 2, barY, barW * hpPercent, barH);

    // Name & Gem Badge
    ctx.font = 'bold 10px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 3;
    const gemText = this.gems > 0 ? ` 💎${this.gems}` : '';
    ctx.fillText(`${this.name}${gemText}`, 0, barY - 4);
    ctx.shadowBlur = 0;
  }
}

// =============================================================================
// 8. BOT AI CONTROLLER
// =============================================================================
class Bot extends Brawler {
  constructor(configKey, team, name) {
    super(configKey, team, false, name);
    this.decisionTimer = Math.random() * 0.3;
    this.moveVector = { x: 0, y: 0 };
    this.target = null;
  }

  updateAI(dt, localPlayer) {
    if (this.isDead) {
      this.updateBase(dt, 0, 0);
      return;
    }

    this.decisionTimer -= dt;
    if (this.decisionTimer <= 0) {
      this.decisionTimer = 0.2 + Math.random() * 0.2; // AI tick every 200-400ms

      const enemies = this.team === 'blue' ? redTeam : blueTeam;
      // Filter visible enemies (Stealth check)
      const visibleEnemies = enemies.filter(e => {
        if (e.isDead) return false;
        if (!e.inBush) return true;
        // In bush: bot must be in bush or close
        return this.inBush || Math.hypot(this.x - e.x, this.y - e.y) < 110;
      });

      // Find closest enemy
      let closestEnemy = null;
      let minDist = Infinity;
      for (const e of visibleEnemies) {
        const d = Math.hypot(this.x - e.x, this.y - e.y);
        if (d < minDist) {
          minDist = d;
          closestEnemy = e;
        }
      }
      this.target = closestEnemy;

      // Behavior Tree
      if (this.hp < this.maxHp * 0.35) {
        // RETREAT: Run back to base
        const retreatY = this.team === 'blue' ? 1800 : 200;
        this.moveVector.x = (700 - this.x) * 0.3;
        this.moveVector.y = retreatY - this.y;
      } else if (closestEnemy && minDist < this.config.bulletRange * 1.1) {
        // COMBAT: Aim and shoot
        this.aimAngle = Math.atan2(closestEnemy.y - this.y, closestEnemy.x - this.x);

        // Maintain optimal combat distance (strafe or push)
        if (minDist < this.config.bulletRange * 0.45 && this.config.weaponType !== 'heavy_shotgun') {
          // Back up slightly if sniper/spread
          this.moveVector.x = -(closestEnemy.x - this.x);
          this.moveVector.y = -(closestEnemy.y - this.y);
        } else {
          // Strafe towards enemy
          this.moveVector.x = closestEnemy.x - this.x;
          this.moveVector.y = closestEnemy.y - this.y;
        }

        // Shoot with slight reaction delay
        if (this.ammo >= 1 && Math.random() < 0.75) {
          this.shoot(this.aimAngle + (Math.random() - 0.5) * 0.08);
        }
      } else {
        // SEEK GEMS / OBJECTIVE: Move towards center Gem Mine or nearest dropped gem
        let targetX = activeMap.gemMine.x;
        let targetY = activeMap.gemMine.y;

        if (gems.length > 0) {
          targetX = gems[0].x;
          targetY = gems[0].y;
        }
        this.moveVector.x = targetX - this.x + (Math.random() - 0.5) * 80;
        this.moveVector.y = targetY - this.y + (Math.random() - 0.5) * 80;
        this.aimAngle = Math.atan2(this.moveVector.y, this.moveVector.x);
      }
    }

    this.updateBase(dt, this.moveVector.x, this.moveVector.y);
  }
}

// =============================================================================
// 9. INPUT & TOUCH CONTROLS
// =============================================================================
const pcInput = {
  keys: {},
  mouseScreen: { x: viewportWidth / 2, y: viewportHeight / 2 },
  mouseWorld: { x: 700, y: 1000 },
  isMouseAiming: false
};

const touchControls = {
  left: { active: false, touchId: null, startX: 0, startY: 0, currX: 0, currY: 0, vector: { x: 0, y: 0 } },
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
  if (e.button === 0 && isGameRunning && blueTeam[0]) {
    blueTeam[0].shoot(blueTeam[0].aimAngle);
  }
});

canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', handleTouchEnd, { passive: false });

function handleTouchStart(e) {
  if (!isGameRunning) return;
  e.preventDefault();
  for (let i = 0; i < e.changedTouches.length; i++) {
    const t = e.changedTouches[i];
    const isLeftSide = t.clientX < viewportWidth * 0.5;
    if (isLeftSide && !touchControls.left.active) {
      touchControls.left.active = true;
      touchControls.left.touchId = t.identifier;
      touchControls.left.startX = touchControls.left.currX = t.clientX;
      touchControls.left.startY = touchControls.left.currY = t.clientY;
      touchControls.left.vector = { x: 0, y: 0 };
    } else if (!isLeftSide && !touchControls.right.active) {
      touchControls.right.active = true;
      touchControls.right.touchId = t.identifier;
      touchControls.right.startX = touchControls.right.currX = t.clientX;
      touchControls.right.startY = touchControls.right.currY = t.clientY;
      touchControls.right.angle = blueTeam[0] ? blueTeam[0].aimAngle : 0;
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
        const clamp = Math.min(dist, CONFIG.JOYSTICK_MAX_RADIUS);
        touchControls.left.vector.x = (dx / dist) * (clamp / CONFIG.JOYSTICK_MAX_RADIUS);
        touchControls.left.vector.y = (dy / dist) * (clamp / CONFIG.JOYSTICK_MAX_RADIUS);
      }
    }
    if (touchControls.right.active && t.identifier === touchControls.right.touchId) {
      touchControls.right.currX = t.clientX;
      touchControls.right.currY = t.clientY;
      const dx = t.clientX - touchControls.right.startX;
      const dy = t.clientY - touchControls.right.startY;
      if (Math.hypot(dx, dy) >= CONFIG.JOYSTICK_DEADZONE) {
        touchControls.right.hasDragged = true;
        touchControls.right.angle = Math.atan2(dy, dx);
        if (blueTeam[0]) blueTeam[0].aimAngle = touchControls.right.angle;
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
      touchControls.left.vector = { x: 0, y: 0 };
    }
    if (touchControls.right.active && t.identifier === touchControls.right.touchId) {
      aimToast.classList.remove('active');
      if (blueTeam[0]) {
        blueTeam[0].shoot(touchControls.right.hasDragged ? touchControls.right.angle : blueTeam[0].aimAngle);
      }
      touchControls.right.active = false;
      touchControls.right.hasDragged = false;
    }
  }
}

// =============================================================================
// 10. MATCH INITIALIZATION (3v3 Setup)
// =============================================================================
function initMatch(brawlerKey, mapKey) {
  // Load map
  const mapData = MAP_CONFIGS[mapKey] || MAP_CONFIGS.crystalCavern;
  activeMap.walls = mapData.walls;
  activeMap.bushes = mapData.bushes;

  // Clear entities
  projectiles.length = 0;
  particles.length = 0;
  gems.length = 0;
  gemSpawnTimer = 0;

  // Spawn Player (Blue Team Leader)
  const player = new Brawler(brawlerKey, 'blue', true, 'YOU');
  player.x = 700;
  player.y = 1800;
  player.spawnX = 700;
  player.spawnY = 1800;

  // Friendly Bots
  const allyKeys = Object.keys(BRAWLERS).filter(k => k !== brawlerKey);
  const botAlly1 = new Bot(allyKeys[0] || 'colt', 'blue', 'ALLY 1');
  botAlly1.x = 550; botAlly1.y = 1820; botAlly1.spawnX = 550; botAlly1.spawnY = 1820;

  const botAlly2 = new Bot(allyKeys[1] || 'bull', 'blue', 'ALLY 2');
  botAlly2.x = 850; botAlly2.y = 1820; botAlly2.spawnX = 850; botAlly2.spawnY = 1820;

  blueTeam = [player, botAlly1, botAlly2];

  // Enemy Bots (Red Team)
  const enemyKeys = ['shelly', 'colt', 'bull'];
  redTeam = [
    new Bot(enemyKeys[0], 'red', 'BOT SHELLY'),
    new Bot(enemyKeys[1], 'red', 'BOT COLT'),
    new Bot(enemyKeys[2], 'red', 'BOT BULL')
  ];
  redTeam[0].x = 700; redTeam[0].y = 200; redTeam[0].spawnX = 700; redTeam[0].spawnY = 200;
  redTeam[1].x = 520; redTeam[1].y = 180; redTeam[1].spawnX = 520; redTeam[1].spawnY = 180;
  redTeam[2].x = 880; redTeam[2].y = 180; redTeam[2].spawnX = 880; redTeam[2].spawnY = 180;

  hudBrawlerName.textContent = BRAWLERS[brawlerKey].name;
  updateGemScoreHUD();
}

function updateGemScoreHUD() {
  const blueTotal = blueTeam.reduce((sum, b) => sum + b.gems, 0);
  const redTotal = redTeam.reduce((sum, b) => sum + b.gems, 0);
  blueGemsEl.textContent = blueTotal;
  redGemsEl.textContent = redTotal;

  if (blueTotal >= 10) {
    matchStatusEl.textContent = 'BLUE TEAM WINNING! (10 GEMS)';
  } else if (redTotal >= 10) {
    matchStatusEl.textContent = 'RED TEAM WINNING! (10 GEMS)';
  } else {
    matchStatusEl.textContent = '3v3 GEM GRAB';
  }
}

// =============================================================================
// 11. GROUND AIM INDICATOR
// =============================================================================
function drawGroundAimIndicator(ctx, player) {
  if (player.isDead) return;
  const isAiming = (touchControls.right.active && touchControls.right.hasDragged) || pcInput.isMouseAiming;
  if (!isAiming) return;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.aimAngle);

  const range = player.config.bulletRange;
  const cfg = player.config;

  if (cfg.pellets > 1) {
    // Cone Aim for Shotguns (Shelly / Bull)
    const halfAngle = cfg.spreadAngle / 2;
    ctx.beginPath();
    ctx.moveTo(player.radius, 0);
    ctx.arc(0, 0, range, -halfAngle, halfAngle);
    ctx.closePath();

    const coneGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, range);
    coneGrad.addColorStop(0, 'rgba(59, 130, 246, 0.45)');
    coneGrad.addColorStop(1, 'rgba(96, 165, 250, 0.05)');
    ctx.fillStyle = coneGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();
  } else {
    // Straight Beam for Snipers (Colt)
    const beamW = 28;
    ctx.beginPath();
    ctx.moveTo(player.radius, -beamW / 2);
    ctx.lineTo(range - 16, -beamW / 2);
    ctx.lineTo(range, 0);
    ctx.lineTo(range - 16, beamW / 2);
    ctx.lineTo(player.radius, beamW / 2);
    ctx.closePath();

    ctx.fillStyle = 'rgba(59, 130, 246, 0.35)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.7)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(player.radius, 0);
    ctx.lineTo(range - 6, 0);
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  ctx.restore();
}

// =============================================================================
// 12. COLLISION MATH
// =============================================================================
function resolveCircleAABB(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  const distSq = dx * dx + dy * dy;

  if (distSq < circle.radius * circle.radius) {
    const dist = Math.sqrt(distSq);
    if (dist > 0.0001) {
      const overlap = circle.radius - dist;
      circle.x += (dx / dist) * overlap;
      circle.y += (dy / dist) * overlap;
    }
  }
}

function isCircleOverlappingRect(circle, rect) {
  const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.w));
  const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.h));
  const dx = circle.x - closestX;
  const dy = circle.y - closestY;
  return (dx * dx + dy * dy) < (circle.radius * circle.radius);
}

// =============================================================================
// 13. SCREEN SPACE JOYSTICKS
// =============================================================================
function drawJoysticks(ctx) {
  if (touchControls.left.active) {
    const l = touchControls.left;
    ctx.save();
    ctx.beginPath();
    ctx.arc(l.startX, l.startY, CONFIG.JOYSTICK_MAX_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();

    const dist = Math.hypot(l.currX - l.startX, l.currY - l.startY);
    const clamp = Math.min(dist, CONFIG.JOYSTICK_MAX_RADIUS);
    const ang = Math.atan2(l.currY - l.startY, l.currX - l.startX);
    ctx.beginPath();
    ctx.arc(l.startX + Math.cos(ang) * clamp, l.startY + Math.sin(ang) * clamp, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(59, 130, 246, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  }

  if (touchControls.right.active) {
    const r = touchControls.right;
    ctx.save();
    ctx.beginPath();
    ctx.arc(r.startX, r.startY, CONFIG.JOYSTICK_MAX_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fill();
    ctx.strokeStyle = r.hasDragged ? 'rgba(239, 68, 68, 0.7)' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.stroke();

    const dist = Math.hypot(r.currX - r.startX, r.currY - r.startY);
    const clamp = Math.min(dist, CONFIG.JOYSTICK_MAX_RADIUS);
    const ang = Math.atan2(r.currY - r.startY, r.currX - r.startX);
    ctx.beginPath();
    ctx.arc(r.startX + Math.cos(ang) * clamp, r.startY + Math.sin(ang) * clamp, 26, 0, Math.PI * 2);
    ctx.fillStyle = r.hasDragged ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.85)';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();
  }
}

// =============================================================================
// 14. MAP RENDERING
// =============================================================================
function drawMap(ctx) {
  // Background
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-camera.x, -camera.y, viewportWidth, viewportHeight);

  // Ground
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(0, 0, CONFIG.WORLD_WIDTH, CONFIG.WORLD_HEIGHT);

  // Checkers
  ctx.fillStyle = 'rgba(21, 128, 61, 0.18)';
  for (let x = 0; x < CONFIG.WORLD_WIDTH; x += 100) {
    for (let y = 0; y < CONFIG.WORLD_HEIGHT; y += 100) {
      ctx.fillRect(x, y, 50, 50);
      ctx.fillRect(x + 50, y + 50, 50, 50);
    }
  }

  // Gem Mine
  const mine = activeMap.gemMine;
  ctx.beginPath();
  ctx.arc(mine.x, mine.y + 4, mine.radius + 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(mine.x, mine.y, mine.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#475569';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1e293b';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(mine.x, mine.y, mine.radius * 0.65, 0, Math.PI * 2);
  ctx.fillStyle = '#090d16';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(mine.x, mine.y, mine.radius * 0.3, 0, Math.PI * 2);
  ctx.fillStyle = '#a855f7';
  ctx.fill();

  // Walls
  for (const w of activeMap.walls) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(w.x + 6, w.y + 8, w.w, w.h);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(w.x, w.y, w.w, w.h - 6);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.strokeRect(w.x + 1, w.y + 1, w.w - 2, w.h - 8);
  }

  // Bushes
  for (const b of activeMap.bushes) {
    ctx.fillStyle = 'rgba(34, 197, 94, 0.72)';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.fillStyle = 'rgba(22, 163, 74, 0.85)';
    for (let bx = b.x + 12; bx < b.x + b.w - 10; bx += 24) {
      for (let by = b.y + 12; by < b.y + b.h - 10; by += 24) {
        ctx.beginPath();
        ctx.arc(bx, by, 10, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// =============================================================================
// 15. MAIN GAME LOOP
// =============================================================================
let lastTime = performance.now();

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
  lastTime = currentTime;

  if (isGameRunning && blueTeam[0]) {
    const player = blueTeam[0];

    // 1. Spawning Gems from center mine (every 6 seconds, up to 12 max)
    gemSpawnTimer += dt;
    if (gemSpawnTimer >= 6.0 && gems.length < 12) {
      gemSpawnTimer = 0;
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 45;
      gems.push(new Gem(activeMap.gemMine.x + Math.cos(angle) * dist, activeMap.gemMine.y + Math.sin(angle) * dist));
    }

    // 2. Update Player
    let moveX = 0;
    let moveY = 0;
    if (pcInput.keys['KeyW'] || pcInput.keys['ArrowUp']) moveY -= 1;
    if (pcInput.keys['KeyS'] || pcInput.keys['ArrowDown']) moveY += 1;
    if (pcInput.keys['KeyA'] || pcInput.keys['ArrowLeft']) moveX -= 1;
    if (pcInput.keys['KeyD'] || pcInput.keys['ArrowRight']) moveX += 1;

    if (touchControls.left.active) {
      moveX = touchControls.left.vector.x;
      moveY = touchControls.left.vector.y;
    }

    if (touchControls.right.active && touchControls.right.hasDragged) {
      player.aimAngle = touchControls.right.angle;
    } else if (pcInput.isMouseAiming) {
      pcInput.mouseWorld.x = pcInput.mouseScreen.x + camera.x;
      pcInput.mouseWorld.y = pcInput.mouseScreen.y + camera.y;
      player.aimAngle = Math.atan2(pcInput.mouseWorld.y - player.y, pcInput.mouseWorld.x - player.x);
    }

    player.updateBase(dt, moveX, moveY);
    camera.update(player.x, player.y);

    // Update Player HUD Card
    const hpPercent = Math.max(0, player.hp / player.maxHp) * 100;
    playerHpFill.style.width = `${hpPercent}%`;
    playerHpText.textContent = player.isDead ? `RESPAWNING IN ${Math.ceil(player.respawnTimer)}s` : `${player.hp} / ${player.maxHp}`;

    // Update Ammo HUD
    ammoSlotEls.forEach((el, idx) => {
      if (idx < player.ammo) {
        el.style.width = '100%';
        el.style.backgroundColor = '#f59e0b';
      } else if (idx === player.ammo) {
        el.style.width = `${(player.reloadTimer / CONFIG.AMMO_RELOAD_TIME) * 100}%`;
        el.style.backgroundColor = '#fbbf24';
      } else {
        el.style.width = '0%';
      }
    });

    // 3. Update Bots
    for (let i = 1; i < blueTeam.length; i++) blueTeam[i].updateAI(dt, player);
    for (const enemy of redTeam) enemy.updateAI(dt, player);

    // 4. Update Projectiles, Particles, Gems
    for (let i = projectiles.length - 1; i >= 0; i--) {
      projectiles[i].update(dt);
      if (projectiles[i].markedForDeletion) projectiles.splice(i, 1);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update(dt);
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    for (const g of gems) g.update(dt);
  }

  // --- RENDER ---
  ctx.save();
  ctx.clearRect(0, 0, viewportWidth, viewportHeight);

  if (isGameRunning && blueTeam[0]) {
    const player = blueTeam[0];

    // World Space
    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    drawMap(ctx);
    for (const g of gems) g.draw(ctx);

    // Ground aim indicator under player
    drawGroundAimIndicator(ctx, player);

    // Projectiles & Particles
    for (const p of projectiles) p.draw(ctx);
    for (const pt of particles) pt.draw(ctx);

    // Brawlers (Y-sorted for proper 3D depth layering!)
    const allBrawlers = [...blueTeam, ...redTeam].sort((a, b) => a.y - b.y);
    for (const b of allBrawlers) {
      b.draw(ctx, player);
    }

    ctx.restore();

    // Screen Space
    drawJoysticks(ctx);
  }

  ctx.restore();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
