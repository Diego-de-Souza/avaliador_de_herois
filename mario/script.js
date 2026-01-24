// Hero Platform Game - Refactored for Angular 19
// Theme: Super Heroes (Marvel/DC style)

class HeroGame {
  constructor(containerId) {
    this.containerId = containerId;
    this.game = null;
    this.gameScene = null;
    this.config = {
      type: Phaser.AUTO,
      width: 1200,
      height: 700,
      parent: containerId,
      backgroundColor: "#1a1a2e", // Dark hero theme
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 1000 },
          debug: false,
        },
      },
      scene: {
        preload: () => this.preload(),
        create: () => this.create(),
        update: () => this.update(),
      },
    };

    this.WORLD_WIDTH = 3600;
    this.WORLD_HEIGHT = 700;

    // Game state
    this.player = null;
    this.platforms = null;
    this.collectibles = null;
    this.hazards = null;
    this.cursors = null;
    this.score = 0;
    this.lives = 3;
    this.currentLevel = 1;
    this.heroEnergy = 100; // Hero energy (was freshness)
    this.energyDecay = 0.05; // Energy decay rate
    this.gameActive = false;
    this.groundLevel = null;
    this.clouds = null;
    this.goalPortal = null;

    this.MAX_HIGH_SCORES = 10;
  }

  init() {
    if (typeof Phaser === 'undefined') {
      console.error('Phaser library not loaded');
      return;
    }
    this.game = new Phaser.Game(this.config);
  }

  destroy() {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  preload() {
    // No external assets needed - we'll draw everything with graphics!
  }

  createTextures(scene) {
    // Create energy orb collectible texture (blue/cyan)
    const energyOrbGraphics = scene.add.graphics();
    energyOrbGraphics.fillStyle(0x00d9ff);
    energyOrbGraphics.lineStyle(4, 0x000000);
    energyOrbGraphics.fillCircle(16, 16, 15);
    energyOrbGraphics.strokeCircle(16, 16, 15);
    energyOrbGraphics.fillStyle(0xffffff);
    energyOrbGraphics.fillCircle(12, 12, 5);
    energyOrbGraphics.lineStyle(2, 0x00d9ff);
    energyOrbGraphics.beginPath();
    energyOrbGraphics.moveTo(10, 10);
    energyOrbGraphics.lineTo(22, 22);
    energyOrbGraphics.strokePath();
    energyOrbGraphics.beginPath();
    energyOrbGraphics.moveTo(10, 22);
    energyOrbGraphics.lineTo(22, 10);
    energyOrbGraphics.strokePath();
    energyOrbGraphics.generateTexture("energyOrb", 32, 32);
    energyOrbGraphics.destroy();

    // Create power boost collectible texture (gold/yellow)
    const powerBoostGraphics = scene.add.graphics();
    powerBoostGraphics.fillStyle(0xffd700);
    powerBoostGraphics.lineStyle(4, 0x000000);
    powerBoostGraphics.fillEllipse(16, 20, 24, 30);
    powerBoostGraphics.strokeEllipse(16, 20, 24, 30);
    powerBoostGraphics.fillStyle(0xffffff);
    powerBoostGraphics.lineStyle(3, 0x000000);
    powerBoostGraphics.fillRect(8, 2, 16, 10);
    powerBoostGraphics.strokeRect(8, 2, 16, 10);
    powerBoostGraphics.fillStyle(0xffd700);
    powerBoostGraphics.fillCircle(10, 25, 3);
    powerBoostGraphics.fillCircle(22, 15, 3);
    powerBoostGraphics.generateTexture("powerBoost", 32, 40);
    powerBoostGraphics.destroy();

    // Create villain hazard texture (red/dark)
    const villainGraphics = scene.add.graphics();
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      villainGraphics.fillStyle(0x8b0000);
      villainGraphics.lineStyle(2, 0x000000);
      villainGraphics.beginPath();
      villainGraphics.moveTo(40 + Math.cos(angle) * 25, 40 + Math.sin(angle) * 25);
      villainGraphics.lineTo(
        40 + Math.cos(angle - 0.2) * 35,
        40 + Math.sin(angle - 0.2) * 35
      );
      villainGraphics.lineTo(
        40 + Math.cos(angle + 0.2) * 35,
        40 + Math.sin(angle + 0.2) * 35
      );
      villainGraphics.closePath();
      villainGraphics.fillPath();
      villainGraphics.strokePath();
    }
    villainGraphics.fillStyle(0xdc143c);
    villainGraphics.lineStyle(4, 0x000000);
    villainGraphics.fillCircle(40, 40, 22);
    villainGraphics.strokeCircle(40, 40, 22);
    villainGraphics.fillStyle(0x000000);
    villainGraphics.fillEllipse(32, 35, 8, 10);
    villainGraphics.fillEllipse(48, 35, 8, 10);
    villainGraphics.lineStyle(3, 0x000000);
    villainGraphics.beginPath();
    villainGraphics.moveTo(28, 28);
    villainGraphics.lineTo(34, 30);
    villainGraphics.strokePath();
    villainGraphics.beginPath();
    villainGraphics.moveTo(46, 30);
    villainGraphics.lineTo(52, 28);
    villainGraphics.strokePath();
    villainGraphics.lineStyle(3, 0x000000);
    villainGraphics.beginPath();
    villainGraphics.arc(
      40,
      48,
      10,
      Phaser.Math.DegToRad(200),
      Phaser.Math.DegToRad(340),
      false
    );
    villainGraphics.strokePath();
    villainGraphics.generateTexture("villain", 80, 80);
    villainGraphics.destroy();

    // Create dark energy hazard texture
    const darkEnergyGraphics = scene.add.graphics();
    darkEnergyGraphics.fillStyle(0x4b0082);
    darkEnergyGraphics.fillCircle(32, 54, 6);
    darkEnergyGraphics.fillCircle(40, 56, 6);
    darkEnergyGraphics.fillCircle(48, 54, 6);
    darkEnergyGraphics.fillStyle(0x6a0dad);
    darkEnergyGraphics.lineStyle(4, 0x000000);
    darkEnergyGraphics.fillCircle(40, 40, 18);
    darkEnergyGraphics.strokeCircle(40, 40, 18);
    darkEnergyGraphics.fillStyle(0x000000);
    darkEnergyGraphics.fillCircle(34, 37, 4);
    darkEnergyGraphics.fillCircle(46, 37, 4);
    darkEnergyGraphics.fillCircle(40, 45, 6);
    darkEnergyGraphics.generateTexture("darkEnergy", 80, 80);
    darkEnergyGraphics.destroy();
  }

  createGoalPortal(scene, x, y) {
    const portalGraphics = scene.add.graphics();

    // Outer glow - blue (hero portal)
    portalGraphics.fillStyle(0x0066ff, 0.6);
    portalGraphics.fillCircle(40, 40, 38);

    // Middle ring - cyan
    portalGraphics.fillStyle(0x00d9ff, 0.7);
    portalGraphics.fillCircle(40, 40, 30);

    // Inner glow - bright white
    portalGraphics.fillStyle(0xffffff, 0.8);
    portalGraphics.fillCircle(40, 40, 20);

    // Center - gold
    portalGraphics.fillStyle(0xffd700, 0.9);
    portalGraphics.fillCircle(40, 40, 10);

    // Add swirl lines for effect
    portalGraphics.lineStyle(3, 0xffffff, 0.7);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      portalGraphics.beginPath();
      portalGraphics.arc(40, 40, 25, angle, angle + Math.PI / 4);
      portalGraphics.strokePath();
    }

    portalGraphics.generateTexture("portal", 80, 80);
    portalGraphics.destroy();

    const portal = scene.add.sprite(x, y, "portal");
    scene.physics.add.existing(portal);
    portal.body.setAllowGravity(false);
    portal.body.setImmovable(true);
    portal.body.moves = false;
    portal.body.setCircle(35, 5, 5);

    scene.tweens.add({
      targets: portal,
      scale: 1.1,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    return portal;
  }

  create() {
    const scene = this;
    heroGameInstance.gameScene = scene;

    scene.physics.world.setBounds(0, 0, heroGameInstance.WORLD_WIDTH, heroGameInstance.WORLD_HEIGHT);
    scene.cameras.main.setBounds(0, 0, heroGameInstance.WORLD_WIDTH, heroGameInstance.WORLD_HEIGHT);
    scene.cameras.main.setZoom(1);

    heroGameInstance.createTextures(scene);

    heroGameInstance.createSkyGradient(scene);

    heroGameInstance.clouds = scene.add.group();
    for (let i = 0; i < 15; i++) {
      heroGameInstance.createCloud(
        scene,
        Phaser.Math.Between(0, heroGameInstance.WORLD_WIDTH),
        Phaser.Math.Between(50, 200)
      );
    }

    heroGameInstance.platforms = scene.physics.add.staticGroup();
    heroGameInstance.groundLevel = heroGameInstance.config.height - 60;

    // Ground - hero theme colors
    const groundDirt = scene.add.rectangle(
      heroGameInstance.WORLD_WIDTH / 2,
      heroGameInstance.groundLevel + 5,
      heroGameInstance.WORLD_WIDTH,
      50,
      0x2c3e50
    );
    groundDirt.setStrokeStyle(3, 0x1a252f);
    scene.physics.add.existing(groundDirt, true);
    heroGameInstance.platforms.add(groundDirt);

    const groundGrass = scene.add.rectangle(
      heroGameInstance.WORLD_WIDTH / 2,
      heroGameInstance.groundLevel - 25,
      heroGameInstance.WORLD_WIDTH,
      10,
      0x27ae60
    );
    scene.physics.add.existing(groundGrass, true);
    heroGameInstance.platforms.add(groundGrass);

    for (let x = 0; x < heroGameInstance.WORLD_WIDTH; x += 40) {
      const tuft = scene.add.rectangle(x + 20, heroGameInstance.groundLevel - 30, 8, 8, 0x2ecc71);
      tuft.setOrigin(0.5, 1);
    }

    const levelData = LEVELS[heroGameInstance.currentLevel - 1];
    levelData.platforms.forEach((platformData) => {
      heroGameInstance.createPlatform(
        scene,
        platformData.x,
        platformData.y,
        platformData.width,
        platformData.height,
        platformData.color,
        heroGameInstance.platforms
      );
    });

    heroGameInstance.player = heroGameInstance.createHeroPlayer(scene, 100, 500);

    scene.physics.add.existing(heroGameInstance.player);
    heroGameInstance.player.body.setBounce(0.1);
    heroGameInstance.player.body.setCollideWorldBounds(true);
    heroGameInstance.player.body.setSize(45, 45);
    heroGameInstance.player.body.setOffset(-22.5, -22.5);

    scene.physics.add.collider(heroGameInstance.player, heroGameInstance.platforms);

    heroGameInstance.collectibles = scene.physics.add.group();
    heroGameInstance.hazards = scene.physics.add.group();

    scene.physics.add.overlap(heroGameInstance.player, heroGameInstance.collectibles, (p, c) => heroGameInstance.collectItem(p, c), null, scene);
    scene.physics.add.overlap(heroGameInstance.player, heroGameInstance.hazards, (p, h) => heroGameInstance.hitHazard(p, h), null, scene);

    heroGameInstance.cursors = scene.input.keyboard.createCursorKeys();
    const keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const keySpace = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    heroGameInstance.cursors.w = keyW;
    heroGameInstance.cursors.a = keyA;
    heroGameInstance.cursors.s = keyS;
    heroGameInstance.cursors.d = keyD;
    heroGameInstance.cursors.space = keySpace;
  }

  createSkyGradient(scene) {
    // Dark hero theme sky
  }

  createCloud(scene, x, y) {
    const cloud = scene.add.container(x, y);
    const c1 = scene.add.circle(0, 0, 30, 0xffffff, 0.6);
    const c2 = scene.add.circle(-25, 5, 25, 0xffffff, 0.6);
    const c3 = scene.add.circle(25, 5, 25, 0xffffff, 0.6);
    const c4 = scene.add.circle(0, -15, 20, 0xffffff, 0.6);
    cloud.add([c1, c2, c3, c4]);
    this.clouds.add(cloud);

    scene.tweens.add({
      targets: cloud,
      x: x + 200,
      duration: 60000,
      repeat: -1,
      yoyo: true,
    });

    return cloud;
  }

  createPlatform(scene, x, y, width, height, color, group) {
    const platform = scene.add.rectangle(x, y, width, height, color);
    platform.setStrokeStyle(3, 0x1a252f);

    if (group) {
      scene.physics.add.existing(platform, true);
      group.add(platform);
    } else {
      scene.physics.add.existing(platform, true);
      return platform;
    }
  }

  createHeroPlayer(scene, x, y) {
    const hero = scene.add.container(x, y);

    // Hero body (blue/red hero suit)
    const body = scene.add.circle(0, 0, 25, 0x0066ff);
    body.setStrokeStyle(4, 0x000000);
    hero.add(body);

    // Cape
    const cape = scene.add.triangle(0, 15, -20, 25, 0, 35, 20, 25, 0xff0000);
    cape.setStrokeStyle(3, 0x000000);
    hero.add(cape);

    // Mask/helmet
    const mask = scene.add.ellipse(0, -10, 30, 20, 0x0000ff);
    mask.setStrokeStyle(3, 0x000000);
    hero.add(mask);

    // Eyes
    const leftEye = scene.add.circle(-8, -10, 4, 0xffffff);
    const rightEye = scene.add.circle(8, -10, 4, 0xffffff);
    hero.add(leftEye);
    hero.add(rightEye);

    // Eye glow
    const leftGlow = scene.add.circle(-8, -10, 3, 0x00ffff);
    const rightGlow = scene.add.circle(8, -10, 3, 0x00ffff);
    hero.add(leftGlow);
    hero.add(rightGlow);

    // Chest symbol (star/shield)
    const symbol = scene.add.star(0, 5, 5, 8, 16, 0xffd700);
    symbol.setStrokeStyle(2, 0x000000);
    hero.add(symbol);

    hero.energyLevel = 100;
    hero.bodyGraphic = body;

    return hero;
  }

  createCollectible(scene, x, y, type = "energyOrb") {
    const sprite = scene.add.sprite(x, y, type);

    scene.physics.add.existing(sprite);
    sprite.body.setAllowGravity(false);
    sprite.body.setImmovable(true);
    sprite.body.moves = false;

    if (type === "energyOrb") {
      sprite.body.setSize(30, 30);
    } else {
      sprite.body.setSize(24, 35);
    }

    sprite.itemType = type;
    sprite.healAmount = type === "energyOrb" ? 15 : 25;

    scene.tweens.add({
      targets: sprite,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        if (sprite.body) {
          sprite.body.x = sprite.x - sprite.displayWidth / 2;
          sprite.body.y = sprite.y - sprite.displayHeight / 2;
        }
      },
    });

    return sprite;
  }

  createHazard(scene, x, y, type = "villain") {
    const textureName = type === "villain" ? "villain" : "darkEnergy";
    const sprite = scene.add.sprite(x, y, textureName);

    scene.physics.add.existing(sprite);
    sprite.body.setAllowGravity(false);
    sprite.body.setImmovable(true);
    sprite.body.moves = false;
    sprite.body.setSize(40, 40);

    sprite.hazardType = type;
    sprite.damage = type === "villain" ? 20 : 15;

    scene.tweens.add({
      targets: sprite,
      x: x + 50,
      y: y - 20,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
      onUpdate: () => {
        if (sprite.body) {
          sprite.body.x = sprite.x - sprite.displayWidth / 2;
          sprite.body.y = sprite.y - sprite.displayHeight / 2;
        }
      },
    });

    return sprite;
  }

  collectItem(player, collectible) {
    const healAmount = collectible.healAmount;
    heroGameInstance.heroEnergy = Math.min(100, heroGameInstance.heroEnergy + healAmount);
    heroGameInstance.score += healAmount * 10;
    heroGameInstance.updateUI();

    const particleColor = collectible.itemType === "energyOrb" ? 0x00d9ff : 0xffd700;
    const numParticles = collectible.itemType === "energyOrb" ? 10 : 15;

    for (let i = 0; i < numParticles; i++) {
      const particle = heroGameInstance.gameScene.add.circle(
        collectible.x,
        collectible.y,
        Phaser.Math.Between(3, 8),
        particleColor,
        1.0
      );

      const angle = Phaser.Math.Between(0, 360);
      const speed = Phaser.Math.Between(50, 150);

      heroGameInstance.gameScene.tweens.add({
        targets: particle,
        x: particle.x + Math.cos((angle * Math.PI) / 180) * speed,
        y: particle.y + Math.sin((angle * Math.PI) / 180) * speed + 100,
        alpha: 0,
        scale: 0,
        duration: 600,
        onComplete: () => particle.destroy(),
      });
    }

    const healText = heroGameInstance.gameScene.add
      .text(collectible.x, collectible.y - 20, "+" + healAmount + "%", {
        fontSize: "24px",
        fontFamily: "Arial",
        color: collectible.itemType === "energyOrb" ? "#00D9FF" : "#FFD700",
        stroke: "#000000",
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    heroGameInstance.gameScene.tweens.add({
      targets: healText,
      y: healText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => healText.destroy(),
    });

    collectible.destroy();
    heroGameInstance.flashPlayer(collectible.itemType === "energyOrb" ? 0x00d9ff : 0xffd700);
  }

  hitHazard(player, hazard) {
    heroGameInstance.heroEnergy = Math.max(0, heroGameInstance.heroEnergy - hazard.damage);
    heroGameInstance.updateUI();
    hazard.destroy();
    heroGameInstance.flashPlayer(0xff4444);

    if (heroGameInstance.heroEnergy <= 0) {
      heroGameInstance.endGame();
    }
  }

  flashPlayer(color) {
    const originalColor = heroGameInstance.player.bodyGraphic.fillColor;
    heroGameInstance.player.bodyGraphic.setFillStyle(color);

    heroGameInstance.gameScene.time.delayedCall(100, () => {
      heroGameInstance.player.bodyGraphic.setFillStyle(originalColor);
    });
  }

  update() {
    const scene = this;
    if (!heroGameInstance.gameActive) return;

    if (heroGameInstance.cursors.left.isDown || heroGameInstance.cursors.a.isDown) {
      heroGameInstance.player.body.setVelocityX(-250);
      heroGameInstance.player.setScale(1, 1);
      heroGameInstance.player.body.setOffset(-22.5, -22.5);
    } else if (heroGameInstance.cursors.right.isDown || heroGameInstance.cursors.d.isDown) {
      heroGameInstance.player.body.setVelocityX(250);
      heroGameInstance.player.setScale(-1, 1);
      heroGameInstance.player.body.setOffset(22.5, -22.5);
    } else {
      heroGameInstance.player.body.setVelocityX(0);
    }

    if ((heroGameInstance.cursors.up.isDown || heroGameInstance.cursors.w.isDown || heroGameInstance.cursors.space.isDown) && heroGameInstance.player.body.touching.down) {
      heroGameInstance.player.body.setVelocityY(-500);
    }

    heroGameInstance.heroEnergy -= heroGameInstance.energyDecay;
    heroGameInstance.updateHeroVisuals();

    if (scene.time.now % 100 < 16) {
      heroGameInstance.updateUI();
    }

    if (heroGameInstance.heroEnergy <= 0) {
      heroGameInstance.endGame();
    }
  }

  updateHeroVisuals() {
    if (heroGameInstance.heroEnergy > 70) {
      heroGameInstance.player.bodyGraphic.setFillStyle(0x0066ff);
    } else if (heroGameInstance.heroEnergy > 40) {
      heroGameInstance.player.bodyGraphic.setFillStyle(0x0044cc);
    } else if (heroGameInstance.heroEnergy > 20) {
      heroGameInstance.player.bodyGraphic.setFillStyle(0x003399);
    } else {
      heroGameInstance.player.bodyGraphic.setFillStyle(0x001166);
    }
  }

  updateUI() {
    const scoreEl = document.getElementById("scoreValue");
    const levelEl = document.getElementById("levelValue");
    const livesEl = document.getElementById("livesValue");
    const energyBar = document.getElementById("energyBar");

    if (scoreEl) scoreEl.textContent = Math.floor(heroGameInstance.score);
    if (levelEl) levelEl.textContent = heroGameInstance.currentLevel;
    if (livesEl) livesEl.textContent = heroGameInstance.lives;
    if (energyBar) energyBar.style.width = Math.max(0, heroGameInstance.heroEnergy) + "%";
  }

  startGame() {
    const menu = document.getElementById("menu");
    const ui = document.getElementById("ui");
    const energyMeter = document.getElementById("energyMeter");
    const instructions = document.getElementById("instructions");

    if (menu) menu.classList.add("hidden");
    if (ui) ui.classList.remove("hidden");
    if (energyMeter) energyMeter.classList.remove("hidden");
    if (instructions) instructions.classList.remove("hidden");

    heroGameInstance.gameActive = true;
    heroGameInstance.score = 0;
    heroGameInstance.lives = 3;

    heroGameInstance.gameScene.cameras.main.startFollow(heroGameInstance.player, true, 0.1, 0.1);
    heroGameInstance.gameScene.cameras.main.setFollowOffset(0, 0);

    const levelData = LEVELS[heroGameInstance.currentLevel - 1];
    heroGameInstance.heroEnergy = levelData.startingEnergy;
    heroGameInstance.energyDecay = levelData.energyDecay;

    heroGameInstance.updateUI();

    levelData.collectibles.forEach((item) => {
      const collectible = heroGameInstance.createCollectible(heroGameInstance.gameScene, item.x, item.y, item.type);
      heroGameInstance.collectibles.add(collectible);
    });

    levelData.hazards.forEach((hazard) => {
      const hazardSprite = heroGameInstance.createHazard(
        heroGameInstance.gameScene,
        hazard.x,
        hazard.y,
        hazard.type
      );
      heroGameInstance.hazards.add(hazardSprite);
    });

    heroGameInstance.goalPortal = heroGameInstance.createGoalPortal(heroGameInstance.gameScene, levelData.goal.x, levelData.goal.y);
    heroGameInstance.gameScene.physics.add.overlap(heroGameInstance.player, heroGameInstance.goalPortal, () => heroGameInstance.reachGoal(), null, heroGameInstance.gameScene);
  }

  reachGoal() {
    if (!heroGameInstance.gameActive) return;
    heroGameInstance.completeLevel();
  }

  completeLevel() {
    heroGameInstance.gameActive = false;

    const freshnessBonus = Math.floor(heroGameInstance.heroEnergy * 100);
    heroGameInstance.score += freshnessBonus;

    const cam = heroGameInstance.gameScene.cameras.main;
    const centerX = cam.scrollX + heroGameInstance.config.width / 2;
    const centerY = cam.scrollY + heroGameInstance.config.height / 2;

    const levelCompleteText = heroGameInstance.gameScene.add
      .text(centerX, centerY - 80, "LEVEL COMPLETE!", {
        fontSize: "64px",
        fontFamily: "Arial",
        color: "#FFD700",
        stroke: "#000000",
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const bonusText = heroGameInstance.gameScene.add
      .text(centerX, centerY, `Energy Bonus: +${freshnessBonus}`, {
        fontSize: "32px",
        fontFamily: "Arial",
        color: "#00FF00",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    const scoreText = heroGameInstance.gameScene.add
      .text(centerX, centerY + 50, `Total Score: ${Math.floor(heroGameInstance.score)}`, {
        fontSize: "28px",
        fontFamily: "Arial",
        color: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 5,
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    levelCompleteText.setPosition(heroGameInstance.config.width / 2, heroGameInstance.config.height / 2 - 80);
    bonusText.setPosition(heroGameInstance.config.width / 2, heroGameInstance.config.height / 2);
    scoreText.setPosition(heroGameInstance.config.width / 2, heroGameInstance.config.height / 2 + 50);

    heroGameInstance.updateUI();

    heroGameInstance.gameScene.tweens.add({
      targets: levelCompleteText,
      scale: 1.1,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    heroGameInstance.gameScene.time.delayedCall(3000, () => {
      levelCompleteText.destroy();
      bonusText.destroy();
      scoreText.destroy();

      if (heroGameInstance.currentLevel >= 5) {
        heroGameInstance.winGame();
      } else {
        heroGameInstance.nextLevel();
      }
    });
  }

  retryLevel() {
    heroGameInstance.collectibles.clear(true, true);
    heroGameInstance.hazards.clear(true, true);
    if (heroGameInstance.goalPortal) {
      heroGameInstance.goalPortal.destroy();
    }

    const levelData = LEVELS[heroGameInstance.currentLevel - 1];
    heroGameInstance.heroEnergy = levelData.startingEnergy;
    heroGameInstance.energyDecay = levelData.energyDecay;

    heroGameInstance.player.x = 100;
    heroGameInstance.player.y = 500;
    heroGameInstance.player.body.setVelocity(0, 0);

    levelData.collectibles.forEach((item) => {
      const collectible = heroGameInstance.createCollectible(heroGameInstance.gameScene, item.x, item.y, item.type);
      heroGameInstance.collectibles.add(collectible);
    });

    levelData.hazards.forEach((hazard) => {
      const hazardSprite = heroGameInstance.createHazard(
        heroGameInstance.gameScene,
        hazard.x,
        hazard.y,
        hazard.type
      );
      heroGameInstance.hazards.add(hazardSprite);
    });

    heroGameInstance.goalPortal = heroGameInstance.createGoalPortal(heroGameInstance.gameScene, levelData.goal.x, levelData.goal.y);
    heroGameInstance.gameScene.physics.add.overlap(heroGameInstance.player, heroGameInstance.goalPortal, () => heroGameInstance.reachGoal(), null, heroGameInstance.gameScene);

    heroGameInstance.updateUI();
    heroGameInstance.gameActive = true;
  }

  nextLevel() {
    heroGameInstance.collectibles.clear(true, true);
    heroGameInstance.hazards.clear(true, true);
    if (heroGameInstance.goalPortal) {
      heroGameInstance.goalPortal.destroy();
    }

    const platformsArray = heroGameInstance.platforms.getChildren();
    for (let i = 2; i < platformsArray.length; i++) {
      platformsArray[i].destroy();
    }

    heroGameInstance.currentLevel++;

    const levelData = LEVELS[heroGameInstance.currentLevel - 1];
    heroGameInstance.heroEnergy = levelData.startingEnergy;
    heroGameInstance.energyDecay = levelData.energyDecay;

    levelData.platforms.forEach((platformData) => {
      heroGameInstance.createPlatform(
        heroGameInstance.gameScene,
        platformData.x,
        platformData.y,
        platformData.width,
        platformData.height,
        platformData.color,
        heroGameInstance.platforms
      );
    });

    heroGameInstance.player.x = 100;
    heroGameInstance.player.y = 500;
    heroGameInstance.player.body.setVelocity(0, 0);

    levelData.collectibles.forEach((item) => {
      const collectible = heroGameInstance.createCollectible(heroGameInstance.gameScene, item.x, item.y, item.type);
      heroGameInstance.collectibles.add(collectible);
    });

    levelData.hazards.forEach((hazard) => {
      const hazardSprite = heroGameInstance.createHazard(
        heroGameInstance.gameScene,
        hazard.x,
        hazard.y,
        hazard.type
      );
      heroGameInstance.hazards.add(hazardSprite);
    });

    heroGameInstance.goalPortal = heroGameInstance.createGoalPortal(heroGameInstance.gameScene, levelData.goal.x, levelData.goal.y);
    heroGameInstance.gameScene.physics.add.overlap(heroGameInstance.player, heroGameInstance.goalPortal, () => heroGameInstance.reachGoal(), null, heroGameInstance.gameScene);

    heroGameInstance.updateUI();
    heroGameInstance.gameActive = true;
  }

  winGame() {
    heroGameInstance.gameActive = false;
    const rank = heroGameInstance.saveHighScore(Math.floor(heroGameInstance.score), heroGameInstance.currentLevel, heroGameInstance.lives);

    const menu = document.getElementById("menu");
    if (!menu) return;

    let rankText = '';
    if (rank <= 10) {
      rankText = `<strong style="color: #FFD700;">HIGH SCORE! Rank #${rank}</strong><br>`;
    }

    menu.innerHTML = `
        <h1>VICTORY!</h1>
        <p>
            Congratulations! You saved the city!<br>
            ${rankText}
            Final Score: ${Math.floor(heroGameInstance.score)}<br>
            Final Energy: ${Math.floor(heroGameInstance.heroEnergy)}%<br>
            Lives Remaining: ${heroGameInstance.lives}<br>
            <br>
            <em>You are a true hero!</em>
        </p>
        <button id="playAgainBtn">PLAY AGAIN</button>
        <button id="viewScoresBtn">VIEW HIGH SCORES</button>
    `;
    menu.classList.remove("hidden");

    document.getElementById("playAgainBtn")?.addEventListener("click", () => {
      location.reload();
    });

    document.getElementById("viewScoresBtn")?.addEventListener("click", () => {
      heroGameInstance.showHighScores();
    });
  }

  endGame() {
    heroGameInstance.gameActive = false;
    heroGameInstance.lives--;

    const menu = document.getElementById("menu");
    if (!menu) return;

    if (heroGameInstance.lives > 0) {
      menu.innerHTML = `
        <h1>HERO DOWN!</h1>
        <p>
            You have ${heroGameInstance.lives} ${heroGameInstance.lives === 1 ? "life" : "lives"} remaining!<br>
            Score: ${Math.floor(heroGameInstance.score)}<br>
            <br>
            <em>Get back up, hero! The city needs you!</em>
        </p>
        <button id="retryBtn">RETRY LEVEL ${heroGameInstance.currentLevel}</button>
    `;
      menu.classList.remove("hidden");

      document.getElementById("retryBtn")?.addEventListener("click", () => {
        menu.classList.add("hidden");
        heroGameInstance.retryLevel();
      });
    } else {
      const rank = heroGameInstance.saveHighScore(Math.floor(heroGameInstance.score), heroGameInstance.currentLevel, 0);

      let rankText = '';
      if (rank <= 10) {
        rankText = `<strong style="color: #FFD700;">HIGH SCORE! Rank #${rank}</strong><br>`;
      }

      menu.innerHTML = `
        <h1>GAME OVER!</h1>
        <p>
            ${rankText}
            Final Score: ${Math.floor(heroGameInstance.score)}<br>
            You made it to Level ${heroGameInstance.currentLevel}!<br>
            <br>
            <em>Even heroes fall, but they always rise again...</em>
        </p>
        <button id="playAgainBtn">TRY AGAIN</button>
        <button id="viewScoresBtn">VIEW HIGH SCORES</button>
    `;
      menu.classList.remove("hidden");

      document.getElementById("playAgainBtn")?.addEventListener("click", () => {
        location.reload();
      });

      document.getElementById("viewScoresBtn")?.addEventListener("click", () => {
        heroGameInstance.showHighScores();
      });
    }
  }

  showHowToPlay() {
    const menu = document.getElementById("menu");
    if (!menu) return;

    menu.innerHTML = `
        <h1>HOW TO PLAY</h1>
        <p style="text-align: left; max-width: 450px; margin: 0 auto;">
            <strong>Goal:</strong> Complete all 5 levels and save the city!<br><br>

            <strong>Controls:</strong><br>
            Arrow Keys or WASD - Move left/right<br>
            Up Arrow, W, or Space - Jump<br><br>

            <strong>Your Energy:</strong><br>
            Your hero energy constantly depletes<br>
            Watch the energy meter!<br><br>

            <strong>Collect Power-Ups:</strong><br>
            Energy Orbs - Restore 15% energy<br>
            Power Boosts - Restore 25% energy<br><br>

            <strong>Avoid Villains:</strong><br>
            Villains - Drain energy (-20%)<br>
            Dark Energy - Weakens hero (-15%)<br><br>

            <strong>Lives:</strong><br>
            You have 3 lives<br>
            Retry the current level if you fail<br><br>

            <strong>Tips:</strong><br>
            • Keep moving to find power-ups<br>
            • Each level gets harder<br>
            • Don't let energy hit 0%!
        </p>
        <button id="backBtn">BACK</button>
    `;

    document.getElementById("backBtn")?.addEventListener("click", () => {
      this.showMainMenu();
    });
  }

  showHighScores() {
    const menu = document.getElementById("menu");
    if (!menu) return;

    const highScores = this.getHighScores();

    let scoresHTML = '';
    if (highScores.length === 0) {
      scoresHTML = '<p style="color: rgba(255, 255, 255, 0.7); font-style: italic;">No high scores yet! Be the first hero!</p>';
    } else {
      scoresHTML = '<div style="text-align: left; max-width: 500px; margin: 20px auto;">';
      highScores.forEach((entry, index) => {
        scoresHTML += `
        <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; margin: 5px 0; border-radius: 8px; display: flex; justify-content: space-between;">
          <span style="color: #FFD700; font-weight: bold;">#${index + 1}</span>
          <span>${entry.score} pts</span>
          <span>Level ${entry.level}</span>
          <span>${entry.lives} lives</span>
          <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">${entry.date}</span>
        </div>
      `;
      });
      scoresHTML += '</div>';
    }

    menu.innerHTML = `
        <h1>HIGH SCORES</h1>
        ${scoresHTML}
        <button id="backBtn">BACK</button>
    `;

    document.getElementById("backBtn")?.addEventListener("click", () => {
      this.showMainMenu();
    });
  }

  showMainMenu() {
    const menu = document.getElementById("menu");
    if (!menu) return;

    menu.innerHTML = `
        <h1>HERO PLATFORM</h1>
        <p>
            Save the city through 5 challenging levels!<br>
            Collect power-ups, avoid villains, and reach the portal!
        </p>
        <button id="startBtn">START GAME</button>
        <button id="howToPlayBtn">HOW TO PLAY</button>
        <button id="highScoresBtn">HIGH SCORES</button>
    `;
    menu.classList.remove("hidden");

    document.getElementById("startBtn")?.addEventListener("click", () => this.startGame());
    document.getElementById("howToPlayBtn")?.addEventListener("click", () => this.showHowToPlay());
    document.getElementById("highScoresBtn")?.addEventListener("click", () => this.showHighScores());
  }

  getHighScores() {
    const scores = localStorage.getItem('heroHighScores');
    return scores ? JSON.parse(scores) : [];
  }

  saveHighScore(playerScore, playerLevel, playerLives) {
    const highScores = this.getHighScores();
    const newScore = {
      score: playerScore,
      level: playerLevel,
      lives: playerLives,
      date: new Date().toLocaleDateString()
    };

    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(this.MAX_HIGH_SCORES);

    localStorage.setItem('heroHighScores', JSON.stringify(highScores));

    return highScores.findIndex(s => s === newScore) + 1;
  }
}

// Level data - Hero theme
const LEVELS = [
  {
    number: 1,
    name: "First Mission",
    startingEnergy: 100,
    energyDecay: 0.03,
    goal: { x: 3200, y: 500 },
    platforms: [
      { x: 400, y: 550, width: 200, height: 25, color: 0x0066ff },
      { x: 800, y: 520, width: 200, height: 25, color: 0xff0000 },
      { x: 1200, y: 480, width: 200, height: 25, color: 0x0066ff },
      { x: 1600, y: 440, width: 200, height: 25, color: 0xff0000 },
      { x: 2000, y: 480, width: 200, height: 25, color: 0x0066ff },
      { x: 2400, y: 520, width: 200, height: 25, color: 0xff0000 },
      { x: 2800, y: 500, width: 200, height: 25, color: 0x0066ff },
    ],
    hazards: [
      { type: "villain", x: 1000, y: 400 },
      { type: "darkEnergy", x: 2200, y: 450 },
    ],
    collectibles: [
      { type: "energyOrb", x: 400, y: 500 },
      { type: "energyOrb", x: 800, y: 470 },
      { type: "powerBoost", x: 1200, y: 430 },
      { type: "energyOrb", x: 1600, y: 390 },
      { type: "energyOrb", x: 2000, y: 430 },
      { type: "powerBoost", x: 2400, y: 470 },
      { type: "energyOrb", x: 2800, y: 450 },
    ],
  },
  {
    number: 2,
    name: "Rising Challenge",
    startingEnergy: 100,
    energyDecay: 0.04,
    goal: { x: 3300, y: 150 },
    platforms: [
      { x: 400, y: 550, width: 200, height: 25, color: 0x0066ff },
      { x: 800, y: 500, width: 200, height: 25, color: 0xff0000 },
      { x: 1200, y: 450, width: 200, height: 25, color: 0x0066ff },
      { x: 1600, y: 380, width: 200, height: 25, color: 0xff0000 },
      { x: 2000, y: 320, width: 200, height: 25, color: 0x0066ff },
      { x: 2400, y: 250, width: 200, height: 25, color: 0xff0000 },
      { x: 2800, y: 200, width: 200, height: 25, color: 0x0066ff },
      { x: 3200, y: 180, width: 200, height: 25, color: 0xff0000 },
    ],
    hazards: [
      { type: "villain", x: 1000, y: 450 },
      { type: "darkEnergy", x: 1800, y: 350 },
      { type: "villain", x: 2600, y: 220 },
    ],
    collectibles: [
      { type: "energyOrb", x: 400, y: 500 },
      { type: "powerBoost", x: 800, y: 450 },
      { type: "energyOrb", x: 1200, y: 400 },
      { type: "energyOrb", x: 1600, y: 330 },
      { type: "powerBoost", x: 2000, y: 270 },
      { type: "energyOrb", x: 2400, y: 200 },
      { type: "energyOrb", x: 2800, y: 150 },
      { type: "powerBoost", x: 3200, y: 130 },
    ],
  },
  {
    number: 3,
    name: "The Long Journey",
    startingEnergy: 90,
    energyDecay: 0.05,
    goal: { x: 3400, y: 450 },
    platforms: [
      { x: 400, y: 550, width: 200, height: 25, color: 0x0066ff },
      { x: 820, y: 480, width: 200, height: 25, color: 0xff0000 },
      { x: 1250, y: 400, width: 250, height: 25, color: 0x0066ff },
      { x: 1700, y: 480, width: 200, height: 25, color: 0xff0000 },
      { x: 2100, y: 420, width: 200, height: 25, color: 0x0066ff },
      { x: 2550, y: 500, width: 200, height: 25, color: 0xff0000 },
      { x: 2950, y: 450, width: 200, height: 25, color: 0x0066ff },
      { x: 3350, y: 480, width: 200, height: 25, color: 0xff0000 },
    ],
    hazards: [
      { type: "villain", x: 1050, y: 420 },
      { type: "darkEnergy", x: 1900, y: 450 },
      { type: "villain", x: 2750, y: 470 },
    ],
    collectibles: [
      { type: "energyOrb", x: 400, y: 500 },
      { type: "energyOrb", x: 850, y: 430 },
      { type: "powerBoost", x: 1250, y: 350 },
      { type: "energyOrb", x: 1700, y: 430 },
      { type: "powerBoost", x: 2100, y: 370 },
      { type: "energyOrb", x: 2550, y: 450 },
      { type: "energyOrb", x: 2950, y: 400 },
      { type: "powerBoost", x: 3350, y: 430 },
    ],
  },
  {
    number: 4,
    name: "Hazardous Heights",
    startingEnergy: 85,
    energyDecay: 0.06,
    goal: { x: 3300, y: 200 },
    platforms: [
      { x: 400, y: 550, width: 200, height: 25, color: 0x0066ff },
      { x: 800, y: 480, width: 200, height: 25, color: 0xff0000 },
      { x: 1350, y: 400, width: 200, height: 25, color: 0x0066ff },
      { x: 1750, y: 330, width: 200, height: 25, color: 0xff0000 },
      { x: 2300, y: 270, width: 200, height: 25, color: 0x0066ff },
      { x: 2700, y: 230, width: 200, height: 25, color: 0xff0000 },
      { x: 3250, y: 230, width: 200, height: 25, color: 0x0066ff },
    ],
    hazards: [
      { type: "villain", x: 1150, y: 420 },
      { type: "villain", x: 2050, y: 300 },
      { type: "villain", x: 3000, y: 240 },
    ],
    collectibles: [
      { type: "energyOrb", x: 400, y: 500 },
      { type: "powerBoost", x: 900, y: 430 },
      { type: "energyOrb", x: 1350, y: 350 },
      { type: "energyOrb", x: 1850, y: 280 },
      { type: "powerBoost", x: 2300, y: 220 },
      { type: "energyOrb", x: 2800, y: 180 },
      { type: "powerBoost", x: 3250, y: 180 },
    ],
  },
  {
    number: 5,
    name: "The Final Battle",
    startingEnergy: 80,
    energyDecay: 0.08,
    goal: { x: 3400, y: 350 },
    platforms: [
      { x: 400, y: 550, width: 200, height: 25, color: 0x0066ff },
      { x: 850, y: 500, width: 180, height: 25, color: 0xff0000 },
      { x: 1250, y: 440, width: 200, height: 25, color: 0x0066ff },
      { x: 1700, y: 380, width: 180, height: 25, color: 0xff0000 },
      { x: 2100, y: 450, width: 200, height: 25, color: 0x0066ff },
      { x: 2350, y: 390, width: 250, height: 25, color: 0xff0000 },
      { x: 2950, y: 450, width: 200, height: 25, color: 0x0066ff },
      { x: 3350, y: 380, width: 200, height: 25, color: 0xff0000 },
    ],
    hazards: [
      { type: "villain", x: 650, y: 520 },
      { type: "darkEnergy", x: 1050, y: 460 },
      { type: "villain", x: 1450, y: 400 },
      { type: "darkEnergy", x: 1900, y: 420 },
      { type: "villain", x: 2750, y: 360 },
    ],
    collectibles: [
      { type: "energyOrb", x: 400, y: 500 },
      { type: "energyOrb", x: 850, y: 450 },
      { type: "powerBoost", x: 1250, y: 390 },
      { type: "energyOrb", x: 1700, y: 330 },
      { type: "powerBoost", x: 2100, y: 400 },
      { type: "energyOrb", x: 2550, y: 340 },
      { type: "energyOrb", x: 2950, y: 300 },
      { type: "powerBoost", x: 3350, y: 330 },
    ],
  },
];

// Global game instance (for Angular integration)
let heroGameInstance = null;

// Initialize game when DOM is ready
window.addEventListener("DOMContentLoaded", () => {
  heroGameInstance = new HeroGame("gameContainer");
  heroGameInstance.init();

  // Menu buttons
  const startBtn = document.getElementById("startBtn");
  const howToPlayBtn = document.getElementById("howToPlayBtn");
  const highScoresBtn = document.getElementById("highScoresBtn");

  if (startBtn) {
    startBtn.addEventListener("click", () => heroGameInstance.startGame());
  }
  if (howToPlayBtn) {
    howToPlayBtn.addEventListener("click", () => heroGameInstance.showHowToPlay());
  }
  if (highScoresBtn) {
    highScoresBtn.addEventListener("click", () => heroGameInstance.showHighScores());
  }
});

// Export for Angular (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HeroGame, LEVELS };
}
