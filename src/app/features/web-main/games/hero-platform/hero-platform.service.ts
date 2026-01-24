import { Injectable } from '@angular/core';
import * as Phaser from 'phaser';

export interface LevelData {
  number: number;
  name: string;
  startingEnergy: number;
  energyDecay: number;
  goal: { x: number; y: number };
  platforms: Array<{ x: number; y: number; width: number; height: number; color: number }>;
  hazards: Array<{ type: string; x: number; y: number }>;
  collectibles: Array<{ type: string; x: number; y: number }>;
}

@Injectable({
  providedIn: 'root'
})
export class HeroPlatformService {
  private game: Phaser.Game | null = null;
  private gameScene: Phaser.Scene | null = null;
  private gameInstance: HeroGame | null = null;

  initGame(containerId: string): HeroGame {
    this.gameInstance = new HeroGame(containerId);
    this.gameInstance.init();
    return this.gameInstance;
  }

  destroyGame(): void {
    if (this.gameInstance) {
      this.gameInstance.destroy();
      this.gameInstance = null;
    }
  }
}

export class HeroGame {
  private containerId: string;
  private game: Phaser.Game | null = null;
  public gameScene: Phaser.Scene | null = null;
  private config: Phaser.Types.Core.GameConfig;
  
  private WORLD_WIDTH = 3600;
  private WORLD_HEIGHT = 700;

  // Game state
  public player: Phaser.GameObjects.Container | null = null;
  public platforms: Phaser.Physics.Arcade.StaticGroup | null = null;
  public collectibles: Phaser.Physics.Arcade.Group | null = null;
  public hazards: Phaser.Physics.Arcade.Group | null = null;
  public cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null;
  public score = 0;
  public lives = 3;
  public currentLevel = 1;
  public heroEnergy = 100;
  public energyDecay = 0.05;
  public gameActive = false;
  public groundLevel: number | null = null;
  public clouds: Phaser.GameObjects.Group | null = null;
  public goalPortal: Phaser.GameObjects.Sprite | null = null;

  private MAX_HIGH_SCORES = 10;
  private callbacks: {
    onScoreUpdate?: (score: number) => void;
    onLevelUpdate?: (level: number) => void;
    onLivesUpdate?: (lives: number) => void;
    onEnergyUpdate?: (energy: number) => void;
    onGameOver?: () => void;
    onLevelComplete?: () => void;
    onGameWin?: () => void;
    onGameReady?: () => void;
  } = {};

  constructor(containerId: string) {
    this.containerId = containerId;
    this.config = {
      type: Phaser.AUTO,
      width: 1200,
      height: 700,
      parent: containerId,
      backgroundColor: '#1a1a2e',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 1000 },
          debug: false,
        },
      },
      scene: {
        preload: () => this.preload(),
        create: () => this.create(),
        update: () => this.update(),
      },
    };
  }

  setCallbacks(callbacks: typeof this.callbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  init(): void {
    if (typeof Phaser === 'undefined') {
      console.error('Phaser library not loaded');
      return;
    }
    this.game = new Phaser.Game(this.config);
  }

  destroy(): void {
    if (this.game) {
      this.game.destroy(true);
      this.game = null;
    }
  }

  preload(): void {
    // No external assets needed - we'll draw everything with graphics!
  }

  createTextures(scene: Phaser.Scene): void {
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
    energyOrbGraphics.generateTexture('energyOrb', 32, 32);
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
    powerBoostGraphics.generateTexture('powerBoost', 32, 40);
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
    villainGraphics.generateTexture('villain', 80, 80);
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
    darkEnergyGraphics.generateTexture('darkEnergy', 80, 80);
    darkEnergyGraphics.destroy();
  }

  createGoalPortal(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Sprite {
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

    portalGraphics.generateTexture('portal', 80, 80);
    portalGraphics.destroy();

    const portal = scene.add.sprite(x, y, 'portal');
    scene.physics.add.existing(portal);
    (portal.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    (portal.body as Phaser.Physics.Arcade.Body).setImmovable(true);
    (portal.body as Phaser.Physics.Arcade.Body).moves = false;
    (portal.body as Phaser.Physics.Arcade.Body).setCircle(35, 5, 5);

    scene.tweens.add({
      targets: portal,
      scale: 1.1,
      alpha: 0.8,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    console.log(`✅ Portal criado em (${x}, ${y})`);
    return portal;
  }

  create(): void {
    const scene = this.game?.scene.scenes[0] as Phaser.Scene;
    if (!scene) return;

    this.gameScene = scene;
    const heroGameInstance = this;

    scene.physics.world.setBounds(0, 0, heroGameInstance.WORLD_WIDTH, heroGameInstance.WORLD_HEIGHT);
    scene.cameras.main.setBounds(0, 0, heroGameInstance.WORLD_WIDTH, heroGameInstance.WORLD_HEIGHT);
    scene.cameras.main.setZoom(1);

    heroGameInstance.createTextures(scene);

    heroGameInstance.clouds = scene.add.group();
    for (let i = 0; i < 15; i++) {
      heroGameInstance.createCloud(
        scene,
        Phaser.Math.Between(0, heroGameInstance.WORLD_WIDTH),
        Phaser.Math.Between(50, 200)
      );
    }

    heroGameInstance.platforms = scene.physics.add.staticGroup();
    heroGameInstance.groundLevel = (this.config.height as number) - 60;

    // Ground - hero theme colors
    const groundDirt = scene.add.rectangle(
      heroGameInstance.WORLD_WIDTH / 2,
      heroGameInstance.groundLevel! + 5,
      heroGameInstance.WORLD_WIDTH,
      50,
      0x2c3e50
    );
    groundDirt.setStrokeStyle(3, 0x1a252f);
    scene.physics.add.existing(groundDirt, true);
    heroGameInstance.platforms.add(groundDirt);

    const groundGrass = scene.add.rectangle(
      heroGameInstance.WORLD_WIDTH / 2,
      heroGameInstance.groundLevel! - 25,
      heroGameInstance.WORLD_WIDTH,
      10,
      0x27ae60
    );
    scene.physics.add.existing(groundGrass, true);
    heroGameInstance.platforms.add(groundGrass);

    for (let x = 0; x < heroGameInstance.WORLD_WIDTH; x += 40) {
      const tuft = scene.add.rectangle(x + 20, heroGameInstance.groundLevel! - 30, 8, 8, 0x2ecc71);
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
        heroGameInstance.platforms!
      );
    });

    heroGameInstance.player = heroGameInstance.createHeroPlayer(scene, 100, 500);

    scene.physics.add.existing(heroGameInstance.player);
    const playerBody = heroGameInstance.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setBounce(0.1);
    playerBody.setCollideWorldBounds(true);
    playerBody.setSize(45, 45);
    playerBody.setOffset(-22.5, -22.5);

    scene.physics.add.collider(heroGameInstance.player, heroGameInstance.platforms);

    heroGameInstance.collectibles = scene.physics.add.group();
    heroGameInstance.hazards = scene.physics.add.group();

    scene.physics.add.overlap(heroGameInstance.player, heroGameInstance.collectibles, (p: any, c: any) => heroGameInstance.collectItem(p, c), undefined, scene);
    scene.physics.add.overlap(heroGameInstance.player, heroGameInstance.hazards, (p: any, h: any) => heroGameInstance.hitHazard(p, h), undefined, scene);

    heroGameInstance.cursors = scene.input.keyboard!.createCursorKeys();
    const keyW = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    const keyA = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    const keyS = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    const keyD = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    const keySpace = scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    (heroGameInstance.cursors as any).w = keyW;
    (heroGameInstance.cursors as any).a = keyA;
    (heroGameInstance.cursors as any).s = keyS;
    (heroGameInstance.cursors as any).d = keyD;
    (heroGameInstance.cursors as any).space = keySpace;

    // Inicializar câmera para seguir o player desde o início
    scene.cameras.main.startFollow(heroGameInstance.player, true, 0.05, 0.05);
    scene.cameras.main.setLerp(0.1, 0.1);
    scene.cameras.main.setBounds(0, 0, heroGameInstance.WORLD_WIDTH, heroGameInstance.WORLD_HEIGHT);

    // Notificar que o jogo está pronto
    console.log('✅ create() concluído! Jogo pronto para iniciar.');
    if (heroGameInstance.callbacks.onGameReady) {
      heroGameInstance.callbacks.onGameReady();
    }
  }

  createCloud(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
    const cloud = scene.add.container(x, y);
    const c1 = scene.add.circle(0, 0, 30, 0xffffff, 0.6);
    const c2 = scene.add.circle(-25, 5, 25, 0xffffff, 0.6);
    const c3 = scene.add.circle(25, 5, 25, 0xffffff, 0.6);
    const c4 = scene.add.circle(0, -15, 20, 0xffffff, 0.6);
    cloud.add([c1, c2, c3, c4]);
    this.clouds!.add(cloud);

    scene.tweens.add({
      targets: cloud,
      x: x + 200,
      duration: 60000,
      repeat: -1,
      yoyo: true,
    });

    return cloud;
  }

  createPlatform(scene: Phaser.Scene, x: number, y: number, width: number, height: number, color: number, group: Phaser.Physics.Arcade.StaticGroup): void {
    const platform = scene.add.rectangle(x, y, width, height, color);
    platform.setStrokeStyle(3, 0x1a252f);

    scene.physics.add.existing(platform, true);
    group.add(platform);
  }

  createHeroPlayer(scene: Phaser.Scene, x: number, y: number): Phaser.GameObjects.Container {
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

    (hero as any).energyLevel = 100;
    (hero as any).bodyGraphic = body;

    return hero;
  }

  createCollectible(scene: Phaser.Scene, x: number, y: number, type: string = 'energyOrb'): Phaser.GameObjects.Sprite {
    const sprite = scene.add.sprite(x, y, type);
    
    // Definir escala baseada no tipo
    if (type === 'energyOrb') {
      sprite.setScale(1.5);
    } else if (type === 'powerBoost') {
      sprite.setScale(1.2);
    }

    scene.physics.add.existing(sprite);
    const body = sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.moves = false;

    if (type === 'energyOrb') {
      body.setSize(30, 30);
    } else {
      body.setSize(24, 35);
    }

    (sprite as any).itemType = type;
    (sprite as any).healAmount = type === 'energyOrb' ? 15 : 25;

    scene.tweens.add({
      targets: sprite,
      y: y - 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        if (body) {
          body.x = sprite.x - sprite.displayWidth / 2;
          body.y = sprite.y - sprite.displayHeight / 2;
        }
      },
    });

    console.log(`✅ Collectible criado: ${type} em (${x}, ${y})`);
    return sprite;
  }

  createHazard(scene: Phaser.Scene, x: number, y: number, type: string = 'villain'): Phaser.GameObjects.Sprite {
    const textureName = type === 'villain' ? 'villain' : 'darkEnergy';
    const sprite = scene.add.sprite(x, y, textureName);
    
    // Definir escala baseada no tipo
    if (type === 'villain') {
      sprite.setScale(0.8);
    } else if (type === 'darkEnergy') {
      sprite.setScale(0.9);
    }

    scene.physics.add.existing(sprite);
    const body = sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.moves = false;
    body.setSize(40, 40);

    (sprite as any).hazardType = type;
    (sprite as any).damage = type === 'villain' ? 20 : 15;

    scene.tweens.add({
      targets: sprite,
      x: x + 50,
      y: y - 20,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      onUpdate: () => {
        if (body) {
          body.x = sprite.x - sprite.displayWidth / 2;
          body.y = sprite.y - sprite.displayHeight / 2;
        }
      },
    });

    console.log(`✅ Hazard criado: ${type} em (${x}, ${y})`);
    return sprite;
  }

  collectItem(player: any, collectible: any): void {
    const healAmount = collectible.healAmount;
    this.heroEnergy = Math.min(100, this.heroEnergy + healAmount);
    this.score += healAmount * 10;
    this.updateUI();

    const particleColor = collectible.itemType === 'energyOrb' ? 0x00d9ff : 0xffd700;
    const numParticles = collectible.itemType === 'energyOrb' ? 10 : 15;

    for (let i = 0; i < numParticles; i++) {
      const particle = this.gameScene!.add.circle(
        collectible.x,
        collectible.y,
        Phaser.Math.Between(3, 8),
        particleColor,
        1.0
      );

      const angle = Phaser.Math.Between(0, 360);
      const speed = Phaser.Math.Between(50, 150);

      this.gameScene!.tweens.add({
        targets: particle,
        x: particle.x + Math.cos((angle * Math.PI) / 180) * speed,
        y: particle.y + Math.sin((angle * Math.PI) / 180) * speed + 100,
        alpha: 0,
        scale: 0,
        duration: 600,
        onComplete: () => particle.destroy(),
      });
    }

    const healText = this.gameScene!.add
      .text(collectible.x, collectible.y - 20, '+' + healAmount + '%', {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: collectible.itemType === 'energyOrb' ? '#00D9FF' : '#FFD700',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    this.gameScene!.tweens.add({
      targets: healText,
      y: healText.y - 40,
      alpha: 0,
      duration: 1000,
      onComplete: () => healText.destroy(),
    });

    collectible.destroy();
    this.flashPlayer(collectible.itemType === 'energyOrb' ? 0x00d9ff : 0xffd700);
  }

  hitHazard(player: any, hazard: any): void {
    this.heroEnergy = Math.max(0, this.heroEnergy - hazard.damage);
    this.updateUI();
    hazard.destroy();
    this.flashPlayer(0xff4444);

    if (this.heroEnergy <= 0) {
      this.endGame();
    }
  }

  flashPlayer(color: number): void {
    if (!this.player) return;
    const originalColor = (this.player as any).bodyGraphic.fillColor;
    (this.player as any).bodyGraphic.setFillStyle(color);

    this.gameScene!.time.delayedCall(100, () => {
      (this.player as any).bodyGraphic.setFillStyle(originalColor);
    });
  }

  update(): void {
    if (!this.gameActive || !this.player || !this.cursors) return;

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    if (this.cursors.left?.isDown || (this.cursors as any).a?.isDown) {
      playerBody.setVelocityX(-250);
      this.player.setScale(1, 1);
      playerBody.setOffset(-22.5, -22.5);
    } else if (this.cursors.right?.isDown || (this.cursors as any).d?.isDown) {
      playerBody.setVelocityX(250);
      this.player.setScale(-1, 1);
      playerBody.setOffset(22.5, -22.5);
    } else {
      playerBody.setVelocityX(0);
    }

    if ((this.cursors.up?.isDown || (this.cursors as any).w?.isDown || (this.cursors as any).space?.isDown) && playerBody.touching.down) {
      playerBody.setVelocityY(-500);
    }

    this.heroEnergy -= this.energyDecay;
    this.updateHeroVisuals();

    if (this.gameScene && this.gameScene.time.now % 100 < 16) {
      this.updateUI();
    }

    if (this.heroEnergy <= 0) {
      this.endGame();
    }
  }

  updateHeroVisuals(): void {
    if (!this.player) return;
    const bodyGraphic = (this.player as any).bodyGraphic;
    if (!bodyGraphic) return;

    if (this.heroEnergy > 70) {
      bodyGraphic.setFillStyle(0x0066ff);
    } else if (this.heroEnergy > 40) {
      bodyGraphic.setFillStyle(0x0044cc);
    } else if (this.heroEnergy > 20) {
      bodyGraphic.setFillStyle(0x003399);
    } else {
      bodyGraphic.setFillStyle(0x001166);
    }
  }

  updateUI(): void {
    if (this.callbacks.onScoreUpdate) {
      this.callbacks.onScoreUpdate(Math.floor(this.score));
    }
    if (this.callbacks.onLevelUpdate) {
      this.callbacks.onLevelUpdate(this.currentLevel);
    }
    if (this.callbacks.onLivesUpdate) {
      this.callbacks.onLivesUpdate(this.lives);
    }
    if (this.callbacks.onEnergyUpdate) {
      this.callbacks.onEnergyUpdate(Math.max(0, this.heroEnergy));
    }
  }

  startGame(): void {
    console.log('🎮 startGame() chamado - iniciando jogo...');
    this.gameActive = true;
    this.score = 0;
    this.lives = 3;

    const levelData = LEVELS[this.currentLevel - 1];
    console.log(`📍 Level data carregado: ${levelData.name}, ${levelData.collectibles.length} collectibles, ${levelData.hazards.length} hazards`);
    
    this.heroEnergy = levelData.startingEnergy;
    this.energyDecay = levelData.energyDecay;

    this.updateUI();

    if (this.gameScene && this.collectibles) {
      console.log(`🎁 Adicionando ${levelData.collectibles.length} collectibles...`);
      levelData.collectibles.forEach((item) => {
        const collectible = this.createCollectible(this.gameScene!, item.x, item.y, item.type);
        this.collectibles!.add(collectible);
      });
    } else {
      console.error('❌ gameScene ou collectibles não existem!', { gameScene: !!this.gameScene, collectibles: !!this.collectibles });
    }

    if (this.gameScene && this.hazards) {
      console.log(`👾 Adicionando ${levelData.hazards.length} hazards...`);
      levelData.hazards.forEach((hazard) => {
        const hazardSprite = this.createHazard(
          this.gameScene!,
          hazard.x,
          hazard.y,
          hazard.type
        );
        this.hazards!.add(hazardSprite);
      });
    } else {
      console.error('❌ gameScene ou hazards não existem!', { gameScene: !!this.gameScene, hazards: !!this.hazards });
    }

    if (this.gameScene && this.player) {
      console.log(`🚪 Criando portal em (${levelData.goal.x}, ${levelData.goal.y})...`);
      this.goalPortal = this.createGoalPortal(this.gameScene, levelData.goal.x, levelData.goal.y);
      this.gameScene.physics.add.overlap(this.player, this.goalPortal, () => this.reachGoal(), undefined, this.gameScene);
    }
    
    console.log('✅ startGame() concluído!');
  }

  reachGoal(): void {
    if (!this.gameActive) return;
    this.completeLevel();
  }

  completeLevel(): void {
    this.gameActive = false;

    const freshnessBonus = Math.floor(this.heroEnergy * 100);
    this.score += freshnessBonus;

    this.updateUI();

    if (this.callbacks.onLevelComplete) {
      this.callbacks.onLevelComplete();
    }

    if (this.currentLevel >= 5) {
      setTimeout(() => {
        this.winGame();
      }, 3000);
    } else {
      setTimeout(() => {
        this.nextLevel();
      }, 3000);
    }
  }

  retryLevel(): void {
    if (this.collectibles) this.collectibles.clear(true, true);
    if (this.hazards) this.hazards.clear(true, true);
    if (this.goalPortal) {
      this.goalPortal.destroy();
    }

    const levelData = LEVELS[this.currentLevel - 1];
    this.heroEnergy = levelData.startingEnergy;
    this.energyDecay = levelData.energyDecay;

    if (this.player) {
      this.player.x = 100;
      this.player.y = 500;
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      playerBody.setVelocity(0, 0);
    }

    if (this.gameScene && this.collectibles) {
      levelData.collectibles.forEach((item) => {
        const collectible = this.createCollectible(this.gameScene!, item.x, item.y, item.type);
        this.collectibles!.add(collectible);
      });
    }

    if (this.gameScene && this.hazards) {
      levelData.hazards.forEach((hazard) => {
        const hazardSprite = this.createHazard(
          this.gameScene!,
          hazard.x,
          hazard.y,
          hazard.type
        );
        this.hazards!.add(hazardSprite);
      });
    }

    if (this.gameScene && this.player) {
      this.goalPortal = this.createGoalPortal(this.gameScene, levelData.goal.x, levelData.goal.y);
      this.gameScene.physics.add.overlap(this.player, this.goalPortal, () => this.reachGoal(), undefined, this.gameScene);
      
      // Resetar câmera para retry
      this.gameScene.cameras.main.stopFollow();
      this.gameScene.cameras.main.startFollow(this.player, true, 0.05, 0.05);
      this.gameScene.cameras.main.setLerp(0.1, 0.1);
      this.gameScene.cameras.main.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
    }

    this.updateUI();
    this.gameActive = true;
  }

  nextLevel(): void {
    if (this.collectibles) this.collectibles.clear(true, true);
    if (this.hazards) this.hazards.clear(true, true);
    if (this.goalPortal) {
      this.goalPortal.destroy();
    }

    if (this.platforms) {
      const platformsArray = this.platforms.getChildren();
      for (let i = 2; i < platformsArray.length; i++) {
        platformsArray[i].destroy();
      }
    }

    this.currentLevel++;

    const levelData = LEVELS[this.currentLevel - 1];
    this.heroEnergy = levelData.startingEnergy;
    this.energyDecay = levelData.energyDecay;

    if (this.gameScene && this.platforms) {
      levelData.platforms.forEach((platformData) => {
        this.createPlatform(
          this.gameScene!,
          platformData.x,
          platformData.y,
          platformData.width,
          platformData.height,
          platformData.color,
          this.platforms!
        );
      });
    }

    if (this.player) {
      this.player.x = 100;
      this.player.y = 500;
      const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
      playerBody.setVelocity(0, 0);
    }

    if (this.gameScene && this.collectibles) {
      levelData.collectibles.forEach((item) => {
        const collectible = this.createCollectible(this.gameScene!, item.x, item.y, item.type);
        this.collectibles!.add(collectible);
      });
    }

    if (this.gameScene && this.hazards) {
      levelData.hazards.forEach((hazard) => {
        const hazardSprite = this.createHazard(
          this.gameScene!,
          hazard.x,
          hazard.y,
          hazard.type
        );
        this.hazards!.add(hazardSprite);
      });
    }

    if (this.gameScene && this.player) {
      this.goalPortal = this.createGoalPortal(this.gameScene, levelData.goal.x, levelData.goal.y);
      this.gameScene.physics.add.overlap(this.player, this.goalPortal, () => this.reachGoal(), undefined, this.gameScene);
      
      // Resetar câmera para novo nível
      this.gameScene.cameras.main.stopFollow();
      this.gameScene.cameras.main.startFollow(this.player, true, 0.05, 0.05);
      this.gameScene.cameras.main.setLerp(0.1, 0.1);
      this.gameScene.cameras.main.setBounds(0, 0, this.WORLD_WIDTH, this.WORLD_HEIGHT);
    }

    this.updateUI();
    this.gameActive = true;
  }

  winGame(): void {
    this.gameActive = false;
    const rank = this.saveHighScore(Math.floor(this.score), this.currentLevel, this.lives);

    if (this.callbacks.onGameWin) {
      this.callbacks.onGameWin();
    }
  }

  endGame(): void {
    this.gameActive = false;
    this.lives--;

    if (this.lives > 0) {
      if (this.callbacks.onGameOver) {
        this.callbacks.onGameOver();
      }
    } else {
      const rank = this.saveHighScore(Math.floor(this.score), this.currentLevel, 0);
      if (this.callbacks.onGameOver) {
        this.callbacks.onGameOver();
      }
    }
  }

  getHighScores(): Array<{ score: number; level: number; lives: number; date: string }> {
    const scores = localStorage.getItem('heroHighScores');
    return scores ? JSON.parse(scores) : [];
  }

  saveHighScore(playerScore: number, playerLevel: number, playerLives: number): number {
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
export const LEVELS: LevelData[] = [
  {
    number: 1,
    name: 'First Mission',
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
      { type: 'villain', x: 1000, y: 400 },
      { type: 'darkEnergy', x: 2200, y: 450 },
    ],
    collectibles: [
      { type: 'energyOrb', x: 400, y: 500 },
      { type: 'energyOrb', x: 800, y: 470 },
      { type: 'powerBoost', x: 1200, y: 430 },
      { type: 'energyOrb', x: 1600, y: 390 },
      { type: 'energyOrb', x: 2000, y: 430 },
      { type: 'powerBoost', x: 2400, y: 470 },
      { type: 'energyOrb', x: 2800, y: 450 },
    ],
  },
  {
    number: 2,
    name: 'Rising Challenge',
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
      { type: 'villain', x: 1000, y: 450 },
      { type: 'darkEnergy', x: 1800, y: 350 },
      { type: 'villain', x: 2600, y: 220 },
    ],
    collectibles: [
      { type: 'energyOrb', x: 400, y: 500 },
      { type: 'powerBoost', x: 800, y: 450 },
      { type: 'energyOrb', x: 1200, y: 400 },
      { type: 'energyOrb', x: 1600, y: 330 },
      { type: 'powerBoost', x: 2000, y: 270 },
      { type: 'energyOrb', x: 2400, y: 200 },
      { type: 'energyOrb', x: 2800, y: 150 },
      { type: 'powerBoost', x: 3200, y: 130 },
    ],
  },
  {
    number: 3,
    name: 'The Long Journey',
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
      { type: 'villain', x: 1050, y: 420 },
      { type: 'darkEnergy', x: 1900, y: 450 },
      { type: 'villain', x: 2750, y: 470 },
    ],
    collectibles: [
      { type: 'energyOrb', x: 400, y: 500 },
      { type: 'energyOrb', x: 850, y: 430 },
      { type: 'powerBoost', x: 1250, y: 350 },
      { type: 'energyOrb', x: 1700, y: 430 },
      { type: 'powerBoost', x: 2100, y: 370 },
      { type: 'energyOrb', x: 2550, y: 450 },
      { type: 'energyOrb', x: 2950, y: 400 },
      { type: 'powerBoost', x: 3350, y: 430 },
    ],
  },
  {
    number: 4,
    name: 'Hazardous Heights',
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
      { type: 'villain', x: 1150, y: 420 },
      { type: 'villain', x: 2050, y: 300 },
      { type: 'villain', x: 3000, y: 240 },
    ],
    collectibles: [
      { type: 'energyOrb', x: 400, y: 500 },
      { type: 'powerBoost', x: 900, y: 430 },
      { type: 'energyOrb', x: 1350, y: 350 },
      { type: 'energyOrb', x: 1850, y: 280 },
      { type: 'powerBoost', x: 2300, y: 220 },
      { type: 'energyOrb', x: 2800, y: 180 },
      { type: 'powerBoost', x: 3250, y: 180 },
    ],
  },
  {
    number: 5,
    name: 'The Final Battle',
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
      { type: 'villain', x: 650, y: 520 },
      { type: 'darkEnergy', x: 1050, y: 460 },
      { type: 'villain', x: 1450, y: 400 },
      { type: 'darkEnergy', x: 1900, y: 420 },
      { type: 'villain', x: 2750, y: 360 },
    ],
    collectibles: [
      { type: 'energyOrb', x: 400, y: 500 },
      { type: 'energyOrb', x: 850, y: 450 },
      { type: 'powerBoost', x: 1250, y: 390 },
      { type: 'energyOrb', x: 1700, y: 330 },
      { type: 'powerBoost', x: 2100, y: 400 },
      { type: 'energyOrb', x: 2550, y: 340 },
      { type: 'energyOrb', x: 2950, y: 300 },
      { type: 'powerBoost', x: 3350, y: 330 },
    ],
  },
];
