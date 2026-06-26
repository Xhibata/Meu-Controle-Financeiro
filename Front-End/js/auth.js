const AUTH_USER_KEY = "cofrinho_currentUser";
const AUTH_REMEMBER_KEY = "cofrinho_rememberMe";
const AUTH_USERS_KEY = "cofrinho_users";

function getStoredUsers() {
  return JSON.parse(localStorage.getItem(AUTH_USERS_KEY) || "{}");
}

function setStoredUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function hashPassword(password) {
  return btoa(password || "");
}

function getCurrentUser() {
  return sessionStorage.getItem(AUTH_USER_KEY) || localStorage.getItem(AUTH_USER_KEY) || null;
}

function setCurrentUser(username, remember) {
  if (remember) {
    localStorage.setItem(AUTH_USER_KEY, username);
    localStorage.setItem(AUTH_REMEMBER_KEY, "true");
    sessionStorage.removeItem(AUTH_USER_KEY);
  } else {
    sessionStorage.setItem(AUTH_USER_KEY, username);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_REMEMBER_KEY);
  }
}

function clearCurrentUser() {
  sessionStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_REMEMBER_KEY);
}

function getUserStorageKey(username, key) {
  return `cofrinho_${username}_${key}`;
}

function getUserSaldo(username) {
  return parseFloat(localStorage.getItem(getUserStorageKey(username, "saldoAdicionado"))) || 0;
}

function setUserSaldo(username, value) {
  localStorage.setItem(getUserStorageKey(username, "saldoAdicionado"), value);
}

function getUserDespesas(username) {
  return JSON.parse(localStorage.getItem(getUserStorageKey(username, "despesas")) || "[]");
}

function setUserDespesas(username, despesas) {
  localStorage.setItem(getUserStorageKey(username, "despesas"), JSON.stringify(despesas));
}

function addUserDespesa(username, despesa) {
  const despesas = getUserDespesas(username);
  despesas.unshift(despesa);
  setUserDespesas(username, despesas);
}

function createAuthMessage(text, type = "danger") {
  const element = document.getElementById("authMessage");
  if (!element) return;
  element.className = `alert alert-${type}`;
  element.textContent = text;
  element.style.display = "block";
}

function clearAuthMessage() {
  const element = document.getElementById("authMessage");
  if (!element) return;
  element.style.display = "none";
  element.textContent = "";
}

function registerUser(username, password) {
  const users = getStoredUsers();

  if (!username || !password) {
    return { success: false, message: "Preencha usuário e senha." };
  }

  if (users[username]) {
    return { success: false, message: "Este usuário já existe." };
  }

  users[username] = {
    username: username,
    password: hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  setStoredUsers(users);
  return { success: true };
}

function authenticateUser(username, password) {
  const users = getStoredUsers();

  if (!username || !password) {
    return { success: false, message: "Preencha usuário e senha." };
  }

  const user = users[username];

  if (!user || user.password !== hashPassword(password)) {
    return { success: false, message: "Usuário ou senha inválidos." };
  }

  return { success: true };
}

function logout() {
  clearCurrentUser();
  window.location.href = "login.html";
}

function redirectIfAuthenticated() {
  const currentUser = getCurrentUser();
  if (window.location.href.includes("login.html") && currentUser) {
    window.location.href = "index.html";
  }
}

function redirectToLoginIfNeeded() {
  if (!window.location.href.includes("login.html") && !getCurrentUser()) {
    window.location.href = "login.html";
  }
}

function showLoggedUser() {
  const currentUser = getCurrentUser();
  const element = document.getElementById("userName");
  if (!element) return;
  if (currentUser) {
    element.textContent = `Olá, ${currentUser}`;
  } else {
    element.textContent = "";
  }
}

function initializeLoginPage() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearAuthMessage();

      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value;
      const remember = document.getElementById("loginRemember").checked;

      const result = authenticateUser(username, password);
      if (!result.success) {
        createAuthMessage(result.message, "danger");
        return;
      }

      setCurrentUser(username, remember);
      window.location.href = "index.html";
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearAuthMessage();

      const username = document.getElementById("registerUsername").value.trim();
      const password = document.getElementById("registerPassword").value;
      const confirmPassword = document.getElementById("registerConfirmPassword").value;
      const remember = document.getElementById("registerRemember").checked;

      if (password !== confirmPassword) {
        createAuthMessage("As senhas não coincidem.", "danger");
        return;
      }

      const result = registerUser(username, password);
      if (!result.success) {
        createAuthMessage(result.message, "danger");
        return;
      }

      setCurrentUser(username, remember);
      window.location.href = "index.html";
    });
  }
}

window.addEventListener("DOMContentLoaded", function () {
  redirectToLoginIfNeeded();
  redirectIfAuthenticated();
  showLoggedUser();

  if (window.location.href.includes("login.html")) {
    initializeLoginPage();
  }
});
