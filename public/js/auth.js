// Authentication UI logic
let currentUser = null;

function showLogin() {
    document.getElementById('login-form').style.display = 'flex';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

function showRegister() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'flex';
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

async function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    if (!username || !password) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }

    try {
        const response = await API.login(username, password);
        currentUser = response.user;
        showLevelSelect();
    } catch (error) {
        errorEl.textContent = error.message;
    }
}

async function register() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');

    if (!username || !password) {
        errorEl.textContent = 'Please fill in all fields';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters';
        return;
    }

    try {
        const response = await API.register(username, password);
        currentUser = response.user;
        showLevelSelect();
    } catch (error) {
        errorEl.textContent = error.message;
    }
}

async function logout() {
    try {
        await API.logout();
        currentUser = null;
        document.getElementById('auth-screen').style.display = 'flex';
        document.getElementById('level-select-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'none';
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
        document.getElementById('register-username').value = '';
        document.getElementById('register-password').value = '';
        showLogin();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Enter key support
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('login-password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });

    document.getElementById('register-password')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') register();
    });
});

// Check if user is already logged in
async function checkAuth() {
    try {
        const response = await API.getMe();
        currentUser = response.user;
        showLevelSelect();
    } catch (error) {
        // Not logged in, show auth screen
        document.getElementById('auth-screen').style.display = 'flex';
    }
}
