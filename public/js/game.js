// Phaser 3 Game Engine
let currentLevel = null;
let gameStartTime = 0;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        // Get level data from registry or passed data
        this.levelData = this.registry.get('currentLevel') || (data && data.level) || currentLevel;
        this.toysCollected = 0;
        this.switchesActivated = new Set();
        this.gameTime = 0;
        this.isGameComplete = false;
        this.hasKey = false;
        console.log('Init called, level data:', this.levelData);
    }

    preload() {
        console.log('Preload called');
    }

    create() {
        console.log('GameScene create() called');
        console.log('Level data:', this.levelData);

        if (!this.levelData) {
            console.error('No level data!');
            return;
        }

        gameStartTime = Date.now();

        // Set world bounds
        this.physics.world.bounds.width = this.levelData.width;
        this.physics.world.bounds.height = this.levelData.height;

        // Create futuristic scenic background
        this.cameras.main.setBackgroundColor('#0a0a1e');

        // Starry space background
        const bgGraphics = this.add.graphics();
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * this.levelData.width;
            const y = Math.random() * this.levelData.height;
            const size = Math.random() * 2;
            bgGraphics.fillStyle(0xffffff, Math.random() * 0.8);
            bgGraphics.fillCircle(x, y, size);
        }

        // Distant planets
        bgGraphics.fillStyle(0x6b4c9a, 0.3);
        bgGraphics.fillCircle(this.levelData.width * 0.2, 80, 40);
        bgGraphics.fillStyle(0x9a4c6b, 0.3);
        bgGraphics.fillCircle(this.levelData.width * 0.8, 120, 30);

        // Futuristic city silhouette in background
        const buildingColors = [0x1a3a5a, 0x2a4a6a, 0x1a2a4a];
        for (let i = 0; i < 10; i++) {
            const x = (this.levelData.width / 10) * i;
            const height = 150 + Math.random() * 200;
            const width = 60 + Math.random() * 40;
            bgGraphics.fillStyle(buildingColors[i % buildingColors.length], 0.6);
            bgGraphics.fillRect(x, this.levelData.height - height, width, height);

            // Building windows
            for (let j = 0; j < 5; j++) {
                for (let k = 0; k < 3; k++) {
                    if (Math.random() > 0.3) {
                        bgGraphics.fillStyle(0xffff00, 0.8);
                        bgGraphics.fillRect(x + 10 + k * 15, this.levelData.height - height + 20 + j * 30, 8, 12);
                    }
                }
            }
        }

        // Glowing grid lines (futuristic tech look)
        bgGraphics.lineStyle(1, 0x00ffff, 0.1);
        for (let x = 0; x < this.levelData.width; x += 100) {
            bgGraphics.lineBetween(x, 0, x, this.levelData.height);
        }
        for (let y = 0; y < this.levelData.height; y += 100) {
            bgGraphics.lineBetween(0, y, this.levelData.width, y);
        }

        // Create platforms using graphics
        this.platforms = this.physics.add.staticGroup();
        this.levelData.platforms.forEach(platform => {
            // Use graphics to draw platforms
            const graphics = this.add.graphics();
            graphics.fillStyle(platform.switchId ? 0xff6b6b : 0x00d4ff, 1);
            graphics.fillRect(platform.x, platform.y, platform.width, platform.height);
            graphics.lineStyle(3, 0x00ff88, 1);
            graphics.strokeRect(platform.x, platform.y, platform.width, platform.height);

            // Create invisible physics body
            const body = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y + platform.height / 2,
                platform.width,
                platform.height
            );
            body.setAlpha(0);
            this.physics.add.existing(body, true);
            this.platforms.add(body);

            if (platform.switchId) {
                body.switchId = platform.switchId;
                graphics.setAlpha(0.3);
            }
        });

        // Create moving platforms
        this.movingPlatforms = this.physics.add.group();
        this.levelData.movingPlatforms?.forEach(mp => {
            const platform = this.add.rectangle(
                mp.startX + mp.width / 2,
                mp.startY + mp.height / 2,
                mp.width,
                mp.height,
                0xff00ff
            );
            platform.setStrokeStyle(3, 0x00ff88);
            this.physics.add.existing(platform);
            platform.body.setAllowGravity(false);
            platform.body.setImmovable(true);

            platform.mpData = mp;
            platform.movingToEnd = true;

            this.movingPlatforms.add(platform);
        });

        // Create Mario - visual (simple Mario character)
        this.marioGraphics = this.add.graphics();

        // Head (skin color)
        this.marioGraphics.fillStyle(0xffcc99, 1);
        this.marioGraphics.fillCircle(0, -10, 10);

        // Hat (red)
        this.marioGraphics.fillStyle(0xff0000, 1);
        this.marioGraphics.fillRect(-12, -22, 24, 6); // Hat brim
        this.marioGraphics.fillRect(-10, -28, 20, 8); // Hat top

        // Eyes (white)
        this.marioGraphics.fillStyle(0xffffff, 1);
        this.marioGraphics.fillCircle(-4, -12, 2);
        this.marioGraphics.fillCircle(4, -12, 2);

        // Pupils (black)
        this.marioGraphics.fillStyle(0x000000, 1);
        this.marioGraphics.fillCircle(-3, -12, 1);
        this.marioGraphics.fillCircle(5, -12, 1);

        // Mustache (black)
        this.marioGraphics.fillStyle(0x000000, 1);
        this.marioGraphics.fillRect(-8, -6, 6, 3);
        this.marioGraphics.fillRect(2, -6, 6, 3);

        // Body (blue overalls)
        this.marioGraphics.fillStyle(0x0066ff, 1);
        this.marioGraphics.fillRect(-8, 0, 16, 12);

        // Shirt (red)
        this.marioGraphics.fillStyle(0xff0000, 1);
        this.marioGraphics.fillRect(-10, 0, 20, 5);

        // Arms (skin)
        this.marioGraphics.fillStyle(0xffcc99, 1);
        this.marioGraphics.fillRect(-12, 2, 4, 8);
        this.marioGraphics.fillRect(8, 2, 4, 8);

        // Legs (blue)
        this.marioGraphics.fillStyle(0x0066ff, 1);
        this.marioGraphics.fillRect(-7, 12, 5, 10);
        this.marioGraphics.fillRect(2, 12, 5, 10);

        // Shoes (brown)
        this.marioGraphics.fillStyle(0x8b4513, 1);
        this.marioGraphics.fillRect(-9, 20, 7, 4);
        this.marioGraphics.fillRect(2, 20, 7, 4);

        this.marioGraphics.setPosition(this.levelData.mario.x, this.levelData.mario.y);

        // Create Mario physics body
        this.mario = this.add.rectangle(
            this.levelData.mario.x,
            this.levelData.mario.y,
            40,
            40
        );
        this.mario.setAlpha(0);
        this.physics.add.existing(this.mario);
        this.mario.body.setCollideWorldBounds(true);
        this.mario.body.setBounce(0.1);

        // Create toys
        this.toys = this.physics.add.staticGroup();
        this.toyGraphics = [];
        this.toyBodies = [];
        this.levelData.toys.forEach(toy => {
            // Draw toy visual
            const g = this.add.graphics();
            g.fillStyle(0xffff00, 1);
            g.fillCircle(toy.x, toy.y, 12);
            g.lineStyle(3, 0xff00ff, 1);
            g.strokeCircle(toy.x, toy.y, 12);

            // Physics body
            const t = this.add.rectangle(toy.x, toy.y, 24, 24);
            t.setAlpha(0);
            this.physics.add.existing(t, true);
            t.toyType = toy.type;
            t.graphicsRef = g; // Link graphics to physics body

            this.toyGraphics.push(g);
            this.toyBodies.push(t);
            this.toys.add(t);
        });

        // Create robots
        this.robots = this.physics.add.group();
        this.levelData.robots?.forEach(robot => {
            const r = this.add.rectangle(robot.x, robot.y, 30, 40, 0xff6b6b);
            r.setStrokeStyle(3, 0xff0000);
            this.physics.add.existing(r);
            r.body.setAllowGravity(false);
            r.body.setImmovable(true);
            r.patrol = robot.patrol;
            r.movingRight = true;
            this.robots.add(r);

            // Robot eyes
            const eye1 = this.add.circle(robot.x - 8, robot.y - 8, 3, 0xff0000);
            const eye2 = this.add.circle(robot.x + 8, robot.y - 8, 3, 0xff0000);
            r.eyes = [eye1, eye2];
        });

        // Create switches
        this.switches = this.physics.add.group();
        this.levelData.switches?.forEach(sw => {
            const s = this.add.circle(sw.x, sw.y, 15, 0xff00ff);
            s.setStrokeStyle(3, 0xff88ff);
            this.physics.add.existing(s, true);
            s.switchId = sw.id;
            this.switches.add(s);
        });

        // Create key
        this.keyGraphics = this.add.graphics();
        const keyX = this.levelData.key ? this.levelData.key.x : this.levelData.goal.x - 100;
        const keyY = this.levelData.key ? this.levelData.key.y : this.levelData.goal.y;

        // Key visual (golden key)
        this.keyGraphics.fillStyle(0xffd700, 1);
        this.keyGraphics.fillCircle(keyX, keyY, 8); // Key head
        this.keyGraphics.fillRect(keyX + 6, keyY - 3, 15, 6); // Key shaft
        this.keyGraphics.fillRect(keyX + 18, keyY - 6, 3, 5); // Key teeth
        this.keyGraphics.fillRect(keyX + 18, keyY + 1, 3, 5);
        this.keyGraphics.lineStyle(2, 0xffaa00, 1);
        this.keyGraphics.strokeCircle(keyX, keyY, 8);

        // Key physics body
        this.key = this.add.rectangle(keyX, keyY, 30, 20);
        this.key.setAlpha(0);
        this.physics.add.existing(this.key, true);

        // Create door (goal)
        this.doorGraphics = this.add.graphics();
        const doorX = this.levelData.goal.x;
        const doorY = this.levelData.goal.y;

        // Door visual
        this.doorGraphics.fillStyle(0x8b4513, 1); // Brown door
        this.doorGraphics.fillRect(doorX - 25, doorY - 40, 50, 80);
        this.doorGraphics.lineStyle(3, 0x654321, 1);
        this.doorGraphics.strokeRect(doorX - 25, doorY - 40, 50, 80);

        // Door panels
        this.doorGraphics.lineStyle(2, 0x654321, 1);
        this.doorGraphics.strokeRect(doorX - 20, doorY - 35, 18, 32);
        this.doorGraphics.strokeRect(doorX + 2, doorY - 35, 18, 32);
        this.doorGraphics.strokeRect(doorX - 20, doorY + 3, 18, 32);
        this.doorGraphics.strokeRect(doorX + 2, doorY + 3, 18, 32);

        // Door knob
        this.doorGraphics.fillStyle(0xffd700, 1);
        this.doorGraphics.fillCircle(doorX + 15, doorY, 4);

        // Door lock indicator (will change color when key is collected)
        this.doorLock = this.add.graphics();
        this.doorLock.fillStyle(0xff0000, 1); // Red = locked
        this.doorLock.fillRect(doorX - 5, doorY - 10, 10, 20);
        this.doorLock.lineStyle(2, 0x000000, 1);
        this.doorLock.strokeRect(doorX - 5, doorY - 10, 10, 20);
        this.doorLock.fillStyle(0x000000, 1);
        this.doorLock.fillCircle(doorX, doorY, 3);

        // Goal physics body
        this.goal = this.add.rectangle(doorX, doorY, 50, 80);
        this.goal.setAlpha(0);
        this.physics.add.existing(this.goal, true);

        // Collisions
        this.physics.add.collider(this.mario, this.platforms);
        this.physics.add.collider(this.mario, this.movingPlatforms);
        this.physics.add.overlap(this.mario, this.toys, this.collectToy, null, this);
        this.physics.add.overlap(this.mario, this.key, this.collectKey, null, this);
        this.physics.add.overlap(this.mario, this.goal, this.reachGoal, null, this);
        this.physics.add.overlap(this.mario, this.robots, this.hitRobot, null, this);
        this.physics.add.overlap(this.mario, this.switches, this.activateSwitch, null, this);

        // Camera
        this.cameras.main.setBounds(0, 0, this.levelData.width, this.levelData.height);
        this.cameras.main.startFollow(this.mario);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Mobile touch controls
        this.input.on('pointerdown', (pointer) => {
            if (!this.touchStartX) {
                this.touchStartX = pointer.x;
                this.touchStartY = pointer.y;
            }
        });

        this.input.on('pointerup', (pointer) => {
            if (this.touchStartX) {
                const dx = pointer.x - this.touchStartX;
                const dy = pointer.y - this.touchStartY;

                if (Math.abs(dy) > Math.abs(dx) && dy < -30) {
                    // Swipe up - jump
                    if (this.mario.body.touching.down) {
                        this.mario.body.setVelocityY(-500);
                    }
                }

                this.touchStartX = null;
                this.touchStartY = null;
            }
        });

        // Update UI
        this.updateUI();
    }

    update() {
        if (this.isGameComplete) return;

        // Sync Mario graphics with physics body
        if (this.marioGraphics && this.mario) {
            this.marioGraphics.setPosition(this.mario.x, this.mario.y);
        }

        // Mario controls
        const left = this.cursors.left.isDown || this.wasd.left.isDown;
        const right = this.cursors.right.isDown || this.wasd.right.isDown;
        const up = this.cursors.up.isDown || this.wasd.up.isDown;

        // Touch controls for mobile
        if (this.input.activePointer.isDown && this.touchStartX) {
            const dx = this.input.activePointer.x - this.touchStartX;
            if (dx < -20) {
                this.mario.body.setVelocityX(-200);
            } else if (dx > 20) {
                this.mario.body.setVelocityX(200);
            }
        } else {
            if (left) {
                this.mario.body.setVelocityX(-200);
            } else if (right) {
                this.mario.body.setVelocityX(200);
            } else {
                this.mario.body.setVelocityX(0);
            }
        }

        if (up && this.mario.body.touching.down) {
            this.mario.body.setVelocityY(-500);
        }

        // Update moving platforms
        this.movingPlatforms.children.entries.forEach(platform => {
            const mp = platform.mpData;
            const targetX = platform.movingToEnd ? mp.endX + mp.width / 2 : mp.startX + mp.width / 2;
            const targetY = platform.movingToEnd ? mp.endY + mp.height / 2 : mp.startY + mp.height / 2;

            const dx = targetX - platform.x;
            const dy = targetY - platform.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 5) {
                platform.movingToEnd = !platform.movingToEnd;
            } else {
                platform.body.setVelocity(
                    (dx / dist) * mp.speed * 60,
                    (dy / dist) * mp.speed * 60
                );
            }
        });

        // Update robots
        this.robots.children.entries.forEach(robot => {
            if (robot.patrol) {
                if (robot.movingRight) {
                    robot.body.setVelocityX(50);
                    if (robot.x >= robot.patrol.end) {
                        robot.movingRight = false;
                    }
                } else {
                    robot.body.setVelocityX(-50);
                    if (robot.x <= robot.patrol.start) {
                        robot.movingRight = true;
                    }
                }

                // Update eyes
                if (robot.eyes) {
                    robot.eyes[0].x = robot.x - 8;
                    robot.eyes[0].y = robot.y - 8;
                    robot.eyes[1].x = robot.x + 8;
                    robot.eyes[1].y = robot.y - 8;
                }
            }
        });

        // Update time
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById('time-display').textContent =
            `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    collectToy(mario, toy) {
        // Remove toy's graphics using the reference
        if (toy.graphicsRef) {
            toy.graphicsRef.destroy();
        }

        const toyX = toy.x;
        const toyY = toy.y;

        toy.destroy();
        this.toysCollected++;
        this.updateUI();

        // Visual feedback
        const text = this.add.text(toyX, toyY, '+1 TOY!', {
            fontSize: '20px',
            fill: '#ffff00'
        });
        this.tweens.add({
            targets: text,
            y: toyY - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    collectKey(mario, key) {
        if (this.hasKey) return;

        this.hasKey = true;
        this.keyGraphics.destroy();
        key.destroy();

        // Update door lock to green (unlocked)
        this.doorLock.clear();
        this.doorLock.fillStyle(0x00ff00, 1); // Green = unlocked
        this.doorLock.fillRect(this.levelData.goal.x - 5, this.levelData.goal.y - 10, 10, 20);
        this.doorLock.lineStyle(2, 0x000000, 1);
        this.doorLock.strokeRect(this.levelData.goal.x - 5, this.levelData.goal.y - 10, 10, 20);
        this.doorLock.fillStyle(0x000000, 1);
        this.doorLock.fillCircle(this.levelData.goal.x, this.levelData.goal.y, 3);

        // Visual feedback
        const text = this.add.text(key.x, key.y, 'KEY COLLECTED!\nDoor Unlocked!', {
            fontSize: '20px',
            fill: '#ffd700',
            align: 'center'
        });
        this.tweens.add({
            targets: text,
            y: key.y - 50,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    activateSwitch(mario, sw) {
        if (!this.switchesActivated.has(sw.switchId)) {
            this.switchesActivated.add(sw.switchId);
            sw.setFillStyle(0x00ff00);

            // Activate platforms with this switch ID
            this.platforms.children.entries.forEach(platform => {
                if (platform.switchId === sw.switchId) {
                    platform.setAlpha(1);
                }
            });

            const text = this.add.text(sw.x, sw.y, 'ACTIVATED!', {
                fontSize: '16px',
                fill: '#00ff00'
            });
            this.tweens.add({
                targets: text,
                y: sw.y - 30,
                alpha: 0,
                duration: 1000,
                onComplete: () => text.destroy()
            });
        }
    }

    hitRobot(mario, robot) {
        // Reset Mario position
        this.mario.setPosition(this.levelData.mario.x, this.levelData.mario.y);
        this.mario.body.setVelocity(0, 0);

        const text = this.add.text(this.mario.x, this.mario.y - 50, 'HIT!', {
            fontSize: '24px',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 3
        });
        this.tweens.add({
            targets: text,
            y: this.mario.y - 100,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    async reachGoal(mario, goal) {
        if (this.isGameComplete) return;

        const allToysCollected = this.toysCollected === this.levelData.toys.length;

        // Check if key is collected
        if (!this.hasKey) {
            const text = this.add.text(goal.x, goal.y - 50, 'Find the KEY first!\nDoor is locked!', {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#ff0000',
                padding: { x: 10, y: 5 },
                align: 'center'
            });
            this.tweens.add({
                targets: text,
                alpha: 0,
                duration: 2000,
                onComplete: () => text.destroy()
            });
            return;
        }

        // Check if all toys are collected
        if (!allToysCollected) {
            const text = this.add.text(goal.x, goal.y - 50, 'Collect all toys first!', {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#ff6b00',
                padding: { x: 10, y: 5 }
            });
            this.tweens.add({
                targets: text,
                alpha: 0,
                duration: 2000,
                onComplete: () => text.destroy()
            });
            return;
        }

        this.isGameComplete = true;

        // Calculate stats
        const timeSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
        const stars = this.calculateStars(timeSeconds);

        // Show completion message
        const completeText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            `LEVEL COMPLETE!\n\nToys: ${this.toysCollected}/${this.levelData.toys.length}\nTime: ${Math.floor(timeSeconds / 60)}:${(timeSeconds % 60).toString().padStart(2, '0')}\nStars: ${'⭐'.repeat(stars)}`,
            {
                fontSize: '32px',
                fill: '#ffff00',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center'
            }
        ).setOrigin(0.5);

        completeText.setScrollFactor(0);

        // Save progress
        try {
            await API.saveProgress(this.levelData.id, {
                completed: true,
                toysCollected: this.toysCollected,
                time: timeSeconds,
                stars: stars
            });
        } catch (error) {
            console.error('Failed to save progress:', error);
        }

        // Return to level select after delay
        setTimeout(() => {
            returnToLevelSelect();
        }, 3000);
    }

    calculateStars(timeSeconds) {
        // Award stars based on time
        // 3 stars: under 30 seconds
        // 2 stars: under 60 seconds
        // 1 star: completed
        if (timeSeconds < 30) return 3;
        if (timeSeconds < 60) return 2;
        return 1;
    }

    updateUI() {
        document.getElementById('toys-display').textContent =
            `Toys: ${this.toysCollected}/${this.levelData.toys.length}`;
    }
}

function startGame(level) {
    console.log('startGame called with level:', level);
    currentLevel = level;

    const gameWidth = Math.min(level.width, window.innerWidth - 40);
    const gameHeight = Math.min(level.height, window.innerHeight - 200);

    const config = {
        type: Phaser.AUTO,
        width: gameWidth,
        height: gameHeight,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                debug: true
            }
        },
        scene: GameScene,
        backgroundColor: 0x2c3e50
    };

    console.log('Creating Phaser game with dimensions:', gameWidth, 'x', gameHeight);

    window.gameInstance = new Phaser.Game(config);

    console.log('Phaser game created');

    // Pass level data through registry and start scene manually
    window.gameInstance.registry.set('currentLevel', level);
    window.gameInstance.scene.start('GameScene');
}
