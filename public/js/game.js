// Phaser 3 Game Engine
let currentLevel = null;
let gameStartTime = 0;

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.levelData = data.level;
        this.toysCollected = 0;
        this.switchesActivated = new Set();
        this.gameTime = 0;
        this.isGameComplete = false;
    }

    create() {
        gameStartTime = Date.now();

        // Set world bounds
        this.physics.world.bounds.width = this.levelData.width;
        this.physics.world.bounds.height = this.levelData.height;

        // Background gradient
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x0f3460, 1);
        gradient.fillRect(0, 0, this.levelData.width, this.levelData.height);

        // Grid pattern for futuristic look
        const grid = this.add.graphics();
        grid.lineStyle(1, 0x00ff88, 0.1);
        for (let x = 0; x < this.levelData.width; x += 50) {
            grid.lineBetween(x, 0, x, this.levelData.height);
        }
        for (let y = 0; y < this.levelData.height; y += 50) {
            grid.lineBetween(0, y, this.levelData.width, y);
        }

        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.levelData.platforms.forEach(platform => {
            const p = this.add.rectangle(
                platform.x + platform.width / 2,
                platform.y + platform.height / 2,
                platform.width,
                platform.height,
                platform.switchId ? 0xff6b6b : 0x00d4ff
            );
            p.setStrokeStyle(3, 0x00ff88);
            this.physics.add.existing(p, true);
            this.platforms.add(p);

            if (platform.switchId) {
                p.switchId = platform.switchId;
                p.setAlpha(0.3);
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

        // Create Mario
        this.mario = this.add.circle(
            this.levelData.mario.x,
            this.levelData.mario.y,
            20,
            0xff0000
        );
        this.mario.setStrokeStyle(3, 0xff6b6b);
        this.physics.add.existing(this.mario);
        this.mario.body.setCollideWorldBounds(true);
        this.mario.body.setBounce(0.1);

        // Add Mario's hat
        this.marioHat = this.add.circle(
            this.levelData.mario.x,
            this.levelData.mario.y - 15,
            8,
            0xff0000
        );
        this.physics.add.existing(this.marioHat, true);

        // Create toys
        this.toys = this.physics.add.group();
        this.levelData.toys.forEach(toy => {
            const t = this.add.star(toy.x, toy.y, 5, 8, 15, 0xffff00);
            t.setStrokeStyle(2, 0xff00ff);
            this.physics.add.existing(t, true);
            t.toyType = toy.type;
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

        // Create goal
        this.goal = this.add.circle(
            this.levelData.goal.x,
            this.levelData.goal.y,
            25,
            0x00ff00
        );
        this.goal.setStrokeStyle(3, 0x00ff88);
        this.physics.add.existing(this.goal, true);

        // Collisions
        this.physics.add.collider(this.mario, this.platforms);
        this.physics.add.collider(this.mario, this.movingPlatforms);
        this.physics.add.overlap(this.mario, this.toys, this.collectToy, null, this);
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

        // Update hat position
        this.marioHat.x = this.mario.x;
        this.marioHat.y = this.mario.y - 15;

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
        toy.destroy();
        this.toysCollected++;
        this.updateUI();

        // Visual feedback
        const text = this.add.text(toy.x, toy.y, '+1 TOY!', {
            fontSize: '20px',
            fill: '#ffff00',
            stroke: '#ff00ff',
            strokeThickness: 3
        });
        this.tweens.add({
            targets: text,
            y: toy.y - 50,
            alpha: 0,
            duration: 1000,
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

        if (!allToysCollected) {
            const text = this.add.text(goal.x, goal.y - 50, 'Collect all toys first!', {
                fontSize: '16px',
                fill: '#ffffff',
                backgroundColor: '#000000',
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
    currentLevel = level;

    const config = {
        type: Phaser.AUTO,
        width: Math.min(level.width, window.innerWidth - 20),
        height: Math.min(level.height, window.innerHeight - 150),
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                debug: false
            }
        },
        scene: GameScene
    };

    window.gameInstance = new Phaser.Game(config);
    window.gameInstance.scene.start('GameScene', { level });
}
