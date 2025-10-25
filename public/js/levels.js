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
        platforms: [
            { x: 0, y: 550, width: 800, height: 50 },
            { x: 200, y: 450, width: 150, height: 20 },
            { x: 450, y: 400, width: 150, height: 20 }
        ],
        toys: [
            { x: 220, y: 410, type: 'car' },
            { x: 470, y: 360, type: 'robot' }
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
        platforms: [
            { x: 0, y: 550, width: 200, height: 50 },
            { x: 1000, y: 550, width: 200, height: 50 },
            { x: 400, y: 300, width: 150, height: 20 },
            { x: 650, y: 200, width: 150, height: 20 }
        ],
        toys: [
            { x: 420, y: 260, type: 'car' },
            { x: 670, y: 160, type: 'robot' },
            { x: 420, y: 160, type: 'plane' }
        ],
        robots: [
            { x: 670, y: 160, patrol: { start: 650, end: 750 } }
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
            { x: 850, y: 110, type: 'plane' },
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
