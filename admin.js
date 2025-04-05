import { AuthService } from './auth.js';

class AdminService {
  constructor() {
    this.authService = new AuthService();
    this.checkAdminAccess();
    this.initEvents();
    this.loadUsers();
  }

  checkAdminAccess() {
    if (!this.authService.isAuthenticated()) return location.href = 'login.html';
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'admin') return location.href = 'login.html';
  }

  initEvents() {
    document.getElementById('logoutBtn').addEventListener('click', () => {
      this.authService.logout();
      location.href = 'login.html';
    });

    document.getElementById('addUserForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.addUser();
    });
  }

  async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async addUser() {
    const username = document.getElementById('newUsername').value;
    const password = document.getElementById('newPassword').value;
    const role = document.getElementById('newRole').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(u => u.username === username)) {
      this.showMessage('Username sudah digunakan', 'error');
      return;
    }

    const hashed = await this.hashPassword(password);
    users.push({ username, password: hashed, role });
    localStorage.setItem('users', JSON.stringify(users));
    this.showMessage('Akun berhasil ditambahkan', 'success');
    this.loadUsers();
    document.getElementById('addUserForm').reset();
  }

  loadUsers() {
    const list = document.getElementById('userList');
    list.innerHTML = '';
    const users = JSON.parse(localStorage.getItem('users')) || [];
    users.forEach(u => {
      const li = document.createElement('li');
      li.textContent = `${u.username} (${u.role})`;
      list.appendChild(li);
    });
  }

  showMessage(msg, type) {
    const box = document.getElementById('messageBox');
    if (!box) return;
    box.innerText = msg;
    box.className = `message ${type}`;
    setTimeout(() => { box.innerText = ''; box.className = ''; }, 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new AdminService());