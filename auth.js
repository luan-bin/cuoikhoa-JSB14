(function () {
  const KEY_USERS = 'netgame_users';
  const KEY_CURRENT = 'netgame_current';

  function loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(KEY_USERS) || 'null') || [];
    } catch {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem(KEY_USERS, JSON.stringify(users));
  }

  function ensureDefault() {
    const users = loadUsers();
    if (users.length === 0) {
      // default demo account (change in production)
      users.push({ email: 'admin@netgame.test', password: 'password123', name: 'Admin' });
      saveUsers(users);
    }
  }

  function findUser(email) {
    const users = loadUsers();
    return users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || null;
  }

  window.Auth = {
    init() {
      ensureDefault();
    },

    getUsers() {
      return loadUsers();
    },

    register(email, password, name = '') {
      if (!email || !password) return { ok: false, msg: 'Email và mật khẩu là bắt buộc' };
      if (findUser(email)) return { ok: false, msg: 'Tài khoản đã tồn tại' };
      const users = loadUsers();
      users.push({ email, password, name });
      saveUsers(users);
      return { ok: true };
    },

    login(email, password) {
      if (!email || !password) return { ok: false, msg: 'Vui lòng nhập email và mật khẩu' };
      const user = findUser(email);
      if (!user) return { ok: false, msg: 'Tài khoản không tồn tại' };
      if (user.password !== password) return { ok: false, msg: 'Mật khẩu không đúng' };
      localStorage.setItem(KEY_CURRENT, JSON.stringify({ email: user.email, name: user.name || '' }));
      return { ok: true, user: { email: user.email, name: user.name || '' } };
    },

    logout() {
      localStorage.removeItem(KEY_CURRENT);
    },

    currentUser() {
      try {
        return JSON.parse(localStorage.getItem(KEY_CURRENT) || 'null');
      } catch {
        return null;
      }
    }
  };

  // Initialize on load
  window.Auth.init();
})();