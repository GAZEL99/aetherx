// Simple hashing
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class AuthService {
  constructor() { this.init(); }

  init() {
    if (!localStorage.getItem('users')) this.createDefaultUsers();
  }

  async createDefaultUsers() {
    const defaultUsers = [
      { username: 'admin', password: await hashPassword('admin123'), role: 'admin' },
      { username: 'user', password: await hashPassword('user123'), role: 'user' }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
  }

  async login(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username);
    if (!user) return false;
    const hashed = await hashPassword(password);
    if (user.password === hashed) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.redirectBasedOnRole(user.role);
      return user;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
  }

  isAuthenticated() {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  redirectBasedOnRole(role) {
    if (role === 'admin') window.location.href = 'admin.html';
    else window.location.href = 'injector.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const authService = new AuthService();
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const user = await authService.login(username, password);
      if (!user) document.getElementById('error-message').innerText = 'Username atau password salah';
    });
  }
});