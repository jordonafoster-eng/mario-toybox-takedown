// Level definitions and management
const LEVELS = [
    {
        id: 1,
        name: "Tutorial: Robot Factory",
        description: "Learn the basics and collect your first toy!",
        width: 800,
        height: 600,
        mario: { x: 50, y: 500 },
        goal: { x: 700, y: 500 },
        key: { x: 470, y: 360 },
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 450, y: 400, width: 150, height: 20 }
        ],
        toys: [
            { x: 220, y: 410, type: 'car' },
            { x: 320, y: 520, type: 'robot' }
        ],
        robots: [],
        switches: [],
        movingPlatforms: []
    },
    {
        id: 2,
        name: "The Assembly Line",
        description: "Navigate the automated production floor",
        width: 1000,
        height: 600,
        mario: { x: 50, y: 500 },
        goal: { x: 900, y: 200 },
        key: { x: 620, y: 310 },
        platforms: [
            { x: 0, y: 550, width: 300, height: 50 },
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 400, y: 400, width: 150, height: 20 },
            { x: 600, y: 350, width: 150, height: 20 },
            { x: 800, y: 250, width: 200, height: 20 }
        ],
        toys: [
            { x: 220, y: 410, type: 'car' },
            { x: 420, y: 360, type: 'robot' },
            { x: 850, y: 210, type: 'plane' }
        ],
        robots: [
            { x: 420, y: 360, patrol: { start: 400, end: 500 } }
        ],
        switches: [],
        movingPlatforms: []
    },
    {
        id: 3,
        name: "Conveyor Chaos",
        description: "Time your jumps with the moving platforms",
        width: 1200,
        height: 600,
        mario: { x: 50, y: 500 },
        goal: { x: 1100, y: 500 },
        key: { x: 670, y: 160 },
        platforms: [
            { x: 0, y: 550, width: 200, height: 50 },
            { x: 1000, y: 550, width: 200, height: 50 },
            { x: 400, y: 300, width: 150, height: 20 },
            { x: 650, y: 200, width: 150, height: 20 }
        ],
        toys: [
            { x: 420, y: 260, type: 'car' },
            { x: 750, y: 160, type: 'robot' },
            { x: 420, y: 160, type: 'plane' }
        ],
        robots: [
            { x: 720, y: 160, patrol: { start: 650, end: 750 } }
        ],
        switches: [],
        movingPlatforms: [
            { startX: 250, startY: 550, endX: 350, endY: 350, width: 100, height: 20, speed: 2 },
            { startX: 800, startY: 350, endX: 900, endY: 550, width: 100, height: 20, speed: 2 }
        ]
    },
    {
        id: 4,
        name: "Switch Station",
        description: "Activate switches to open new paths",
        width: 1000,
        height: 700,
        mario: { x: 50, y: 600 },
        goal: { x: 900, y: 100 },
        key: { x: 850, y: 110 },
        platforms: [
            { x: 0, y: 650, width: 300, height: 50 },
            { x: 250, y: 500, width: 150, height: 20 },
            { x: 500, y: 400, width: 200, height: 20 },
            { x: 750, y: 500, width: 250, height: 20 },
            { x: 800, y: 150, width: 200, height: 20, switchId: 1 }
        ],
        toys: [
            { x: 270, y: 460, type: 'car' },
            { x: 550, y: 360, type: 'robot' },
            { x: 920, y: 110, type: 'plane' },
            { x: 820, y: 460, type: 'train' }
        ],
        robots: [
            { x: 550, y: 360, patrol: { start: 500, end: 650 } }
        ],
        switches: [
            { x: 770, y: 460, id: 1 }
        ],
        movingPlatforms: []
    },
    {
        id: 5,
        name: "DK's Tower Challenge",
        description: "Climb to the top and face Donkey Kong!",
        width: 800,
        height: 900,
        mario: { x: 50, y: 800 },
        goal: { x: 700, y: 50 },
        key: { x: 520, y: 210 },
        platforms: [
            { x: 0, y: 850, width: 800, height: 50 },
            { x: 600, y: 750, width: 200, height: 20 },
            { x: 0, y: 650, width: 200, height: 20 },
            { x: 300, y: 550, width: 200, height: 20 },
            { x: 600, y: 450, width: 200, height: 20 },
            { x: 100, y: 350, width: 200, height: 20 },
            { x: 500, y: 250, width: 200, height: 20 },
            { x: 200, y: 150, width: 200, height: 20 },
            { x: 600, y: 100, width: 200, height: 20 }
        ],
        toys: [
            { x: 620, y: 710, type: 'car' },
            { x: 320, y: 510, type: 'robot' },
            { x: 120, y: 310, type: 'plane' },
            { x: 520, y: 210, type: 'train' },
            { x: 720, y: 60, type: 'trophy' }
        ],
        robots: [
            { x: 320, y: 510, patrol: { start: 300, end: 450 } },
            { x: 620, y: 410, patrol: { start: 600, end: 750 } },
            { x: 520, y: 210, patrol: { start: 500, end: 650 } }
        ],
        switches: [],
        movingPlatforms: [
            { startX: 250, startY: 650, endX: 550, endY: 650, width: 100, height: 20, speed: 1.5 },
            { startX: 350, startY: 350, endX: 450, endY: 350, width: 100, height: 20, speed: 1.5 }
        ]
    },
    {
        id: 6,
        name: "Precision Platforms",
        description: "Narrow platforms with multiple robots",
        width: 1200,
        height: 700,
        mario: { x: 50, y: 650 },
        goal: { x: 1100, y: 100 },
        key: { x: 900, y: 300 },
        platforms: [
            { x: 0, y: 680, width: 150, height: 20 },
            { x: 200, y: 600, width: 100, height: 20 },
            { x: 350, y: 520, width: 100, height: 20 },
            { x: 500, y: 440, width: 100, height: 20 },
            { x: 650, y: 360, width: 100, height: 20 },
            { x: 800, y: 280, width: 150, height: 20 },
            { x: 1000, y: 200, width: 200, height: 20 },
            { x: 1050, y: 150, width: 150, height: 20 }
        ],
        toys: [
            { x: 220, y: 560, type: 'car' },
            { x: 370, y: 480, type: 'robot' },
            { x: 670, y: 320, type: 'plane' },
            { x: 1100, y: 160, type: 'train' }
        ],
        robots: [
            { x: 370, y: 480, patrol: { start: 350, end: 430 } },
            { x: 520, y: 400, patrol: { start: 500, end: 580 } },
            { x: 850, y: 240, patrol: { start: 800, end: 930 } }
        ],
        switches: [],
        movingPlatforms: []
    },
    {
        id: 7,
        name: "Danger Zone",
        description: "Avoid the deadly hazards!",
        width: 1000,
        height: 600,
        mario: { x: 50, y: 500 },
        goal: { x: 900, y: 500 },
        key: { x: 500, y: 200 },
        platforms: [
            { x: 0, y: 550, width: 200, height: 50 },
            { x: 250, y: 550, width: 150, height: 50 },
            { x: 450, y: 450, width: 100, height: 20 },
            { x: 500, y: 250, width: 150, height: 20 },
            { x: 600, y: 450, width: 100, height: 20 },
            { x: 750, y: 550, width: 250, height: 50 }
        ],
        toys: [
            { x: 300, y: 510, type: 'car' },
            { x: 470, y: 410, type: 'robot' },
            { x: 620, y: 410, type: 'plane' },
            { x: 850, y: 510, type: 'train' },
            { x: 520, y: 210, type: 'trophy' }
        ],
        robots: [
            { x: 300, y: 510, patrol: { start: 250, end: 380 } },
            { x: 470, y: 410, patrol: { start: 450, end: 530 } },
            { x: 620, y: 410, patrol: { start: 600, end: 680 } },
            { x: 850, y: 510, patrol: { start: 750, end: 950 } }
        ],
        switches: [],
        movingPlatforms: [
            { startX: 200, startY: 350, endX: 350, endY: 350, width: 80, height: 20, speed: 3 }
        ]
    },
    {
        id: 8,
        name: "Switch Maze",
        description: "Master the switch puzzle",
        width: 1200,
        height: 800,
        mario: { x: 50, y: 750 },
        goal: { x: 1100, y: 100 },
        key: { x: 1050, y: 60 },
        platforms: [
            { x: 0, y: 780, width: 250, height: 20 },
            { x: 300, y: 650, width: 150, height: 20 },
            { x: 500, y: 550, width: 200, height: 20 },
            { x: 750, y: 650, width: 150, height: 20 },
            { x: 950, y: 550, width: 150, height: 20 },
            { x: 400, y: 400, width: 150, height: 20, switchId: 1 },
            { x: 700, y: 350, width: 150, height: 20, switchId: 2 },
            { x: 900, y: 250, width: 150, height: 20, switchId: 3 },
            { x: 1000, y: 150, width: 200, height: 20 }
        ],
        toys: [
            { x: 320, y: 610, type: 'car' },
            { x: 550, y: 510, type: 'robot' },
            { x: 770, y: 610, type: 'plane' },
            { x: 970, y: 510, type: 'train' },
            { x: 1100, y: 110, type: 'trophy' }
        ],
        robots: [
            { x: 550, y: 510, patrol: { start: 500, end: 670 } },
            { x: 970, y: 510, patrol: { start: 950, end: 1080 } }
        ],
        switches: [
            { x: 180, y: 740, id: 1 },
            { x: 650, y: 610, id: 2 },
            { x: 850, y: 510, id: 3 }
        ],
        movingPlatforms: []
    },
    {
        id: 9,
        name: "Speed Run Challenge",
        description: "Fast platforms and many enemies!",
        width: 1400,
        height: 700,
        mario: { x: 50, y: 650 },
        goal: { x: 1300, y: 650 },
        key: { x: 700, y: 100 },
        platforms: [
            { x: 0, y: 680, width: 150, height: 20 },
            { x: 600, y: 150, width: 200, height: 20 },
            { x: 1200, y: 680, width: 200, height: 20 }
        ],
        toys: [
            { x: 200, y: 550, type: 'car' },
            { x: 400, y: 450, type: 'robot' },
            { x: 700, y: 110, type: 'plane' },
            { x: 1000, y: 450, type: 'train' },
            { x: 1150, y: 550, type: 'trophy' }
        ],
        robots: [
            { x: 300, y: 550, patrol: { start: 200, end: 400 } },
            { x: 500, y: 450, patrol: { start: 400, end: 600 } },
            { x: 900, y: 450, patrol: { start: 800, end: 1000 } },
            { x: 1100, y: 550, patrol: { start: 1000, end: 1200 } }
        ],
        switches: [],
        movingPlatforms: [
            { startX: 150, startY: 680, endX: 250, endY: 580, width: 100, height: 20, speed: 4 },
            { startX: 300, startY: 580, endX: 400, endY: 480, width: 100, height: 20, speed: 4 },
            { startX: 500, startY: 480, endX: 600, endY: 200, width: 100, height: 20, speed: 4 },
            { startX: 800, startY: 200, endX: 900, endY: 480, width: 100, height: 20, speed: 4 },
            { startX: 950, startY: 480, endX: 1050, endY: 580, width: 100, height: 20, speed: 4 },
            { startX: 1100, startY: 580, endX: 1200, endY: 680, width: 100, height: 20, speed: 4 }
        ]
    },
    {
        id: 10,
        name: "Ultimate Gauntlet",
        description: "The final challenge! All mechanics combined!",
        width: 1600,
        height: 1000,
        mario: { x: 50, y: 950 },
        goal: { x: 1500, y: 50 },
        key: { x: 800, y: 500 },
        platforms: [
            { x: 0, y: 980, width: 200, height: 20 },
            { x: 250, y: 880, width: 150, height: 20 },
            { x: 450, y: 780, width: 150, height: 20 },
            { x: 650, y: 680, width: 150, height: 20 },
            { x: 850, y: 580, width: 150, height: 20 },
            { x: 700, y: 450, width: 200, height: 20, switchId: 1 },
            { x: 950, y: 350, width: 150, height: 20, switchId: 2 },
            { x: 1150, y: 450, width: 150, height: 20 },
            { x: 1350, y: 350, width: 150, height: 20 },
            { x: 1300, y: 200, width: 150, height: 20, switchId: 3 },
            { x: 1450, y: 100, width: 150, height: 20 }
        ],
        toys: [
            { x: 270, y: 840, type: 'car' },
            { x: 470, y: 740, type: 'robot' },
            { x: 670, y: 640, type: 'plane' },
            { x: 870, y: 540, type: 'train' },
            { x: 1170, y: 410, type: 'trophy' },
            { x: 1370, y: 310, type: 'car' },
            { x: 1480, y: 60, type: 'robot' }
        ],
        robots: [
            { x: 270, y: 840, patrol: { start: 250, end: 380 } },
            { x: 470, y: 740, patrol: { start: 450, end: 580 } },
            { x: 670, y: 640, patrol: { start: 650, end: 780 } },
            { x: 870, y: 540, patrol: { start: 850, end: 980 } },
            { x: 1170, y: 410, patrol: { start: 1150, end: 1280 } },
            { x: 1370, y: 310, patrol: { start: 1350, end: 1480 } }
        ],
        switches: [
            { x: 600, y: 640, id: 1 },
            { x: 1050, y: 410, id: 2 },
            { x: 1250, y: 310, id: 3 }
        ],
        movingPlatforms: [
            { startX: 100, startY: 880, endX: 200, endY: 780, width: 100, height: 20, speed: 3 },
            { startX: 350, startY: 680, endX: 450, endY: 580, width: 100, height: 20, speed: 3 },
            { startX: 1000, startY: 250, endX: 1100, endY: 150, width: 100, height: 20, speed: 3 }
        ]
    }
];

let userProgress = {};

async function loadProgress() {
    try {
        const response = await API.getProgress();
        userProgress = {};

        response.progress.forEach(p => {
            userProgress[p.level_id] = p;
        });

        // Update stats display
        document.getElementById('total-toys').textContent = response.stats.total_toys || 0;
        document.getElementById('levels-completed').textContent = response.stats.levels_completed || 0;

        renderLevels();
    } catch (error) {
        console.error('Failed to load progress:', error);
    }
}

function renderLevels() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';

    LEVELS.forEach((level, index) => {
        const progress = userProgress[level.id];
        const previousLevel = LEVELS[index - 1];
        const previousProgress = previousLevel ? userProgress[previousLevel.id] : { completed: true };

        const isUnlocked = index === 0 || previousProgress?.completed;

        const card = document.createElement('div');
        card.className = `level-card ${!isUnlocked ? 'locked' : ''}`;

        if (isUnlocked) {
            card.onclick = () => startLevel(level.id);
        }

        let starsHTML = '';
        if (progress) {
            const stars = progress.stars || 0;
            starsHTML = `<div class="level-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>`;
        }

        card.innerHTML = `
            <h3>Level ${level.id}</h3>
            <p>${level.name}</p>
            <p style="font-size: 0.85em; opacity: 0.8;">${level.description}</p>
            ${progress?.completed ? '<div class="completed-badge">✓ COMPLETED</div>' : ''}
            ${progress ? `
                <div class="level-progress">
                    <span>Toys: ${progress.toys_collected}/${level.toys.length}</span>
                    ${starsHTML}
                </div>
            ` : ''}
            ${!isUnlocked ? '<p style="margin-top: 10px; font-weight: bold;">🔒 LOCKED</p>' : ''}
        `;

        grid.appendChild(card);
    });
}

function showLevelSelect() {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('level-select-screen').style.display = 'flex';
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('username-display').textContent = currentUser.username;
    loadProgress();
}

function startLevel(levelId) {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return;

    document.getElementById('level-select-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('current-level-name').textContent = `Level ${level.id}: ${level.name}`;

    // Start the game
    if (window.gameInstance) {
        window.gameInstance.destroy(true);
    }
    startGame(level);
}

function returnToLevelSelect() {
    if (window.gameInstance) {
        window.gameInstance.destroy(true);
        window.gameInstance = null;
    }
    showLevelSelect();
}
