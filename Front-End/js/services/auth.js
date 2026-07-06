/**
 * ==========================================================
 * AUTH.JS
 * ----------------------------------------------------------
 * Responsável por toda autenticação da aplicação.
 * ==========================================================
 */

const Auth = {
  /**
   * Cadastra um novo usuário.
   */
  async registrar(nome, email, senha) {
    const usuario = {
      nome,
      email,
      senha,
    };

    return await API.post("/auth/registro", usuario);
  },

  /**
   * Realiza login.
   */
  async login(email, senha) {
    const credenciais = {
      email,
      senha,
    };

    const resposta = await API.post("/auth/login", credenciais);

    this.salvarToken(resposta.access_token);

    // Busca automaticamente os dados do usuário autenticado
    await this.buscarPerfil();

    return resposta;
  },

  logout() {
    Utils.remover(STORAGE.TOKEN);
    Utils.remover(STORAGE.USUARIO);

    window.location.replace("login.html");
  },

  /**
   * Salva o JWT.
   */
  salvarToken(token) {
    Utils.salvar(STORAGE.TOKEN, token);
  },

  /**
   * Recupera o JWT.
   */
  getToken() {
    return Utils.recuperar(STORAGE.TOKEN);
  },

  /**
   * Verifica se existe um token salvo.
   */
  isAuthenticated() {
    return this.getToken() !== null;
  },

  /**
   * Consulta o usuário autenticado.
   */
  async buscarPerfil() {
    const usuario = await API.get("/projeto/me");

    Utils.salvar(STORAGE.USUARIO, usuario);

    return usuario;
  },

  /**
   * Recupera usuário salvo.
   */
  getUsuario() {
    return Utils.recuperar(STORAGE.USUARIO);
  },

  getNomeUsuario() {
    const usuario = this.getUsuario();

    return usuario ? usuario.nome : "";
  }
};
