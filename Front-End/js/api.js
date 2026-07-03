/**
 * ==========================================================
 * API.JS
 * ----------------------------------------------------------
 * Responsável por toda comunicação com o backend.
 * Nenhuma página deve utilizar fetch() diretamente.
 * ==========================================================
 */

const API = {
  // URL base da API
  BASE_URL: "http://127.0.0.1:8000",

  /**
   * Recupera o token salvo no navegador.
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Monta os cabeçalhos da requisição.
   */
  buildHeaders(hasBody = true) {
    const headers = {};

    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }

    const token = this.getToken();

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  },

  /**
   * Método GET
   */
  async get(endpoint) {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "GET",
      headers: this.buildHeaders(false),
    });

    return this.handleResponse(response);
  },

  /**
   * Método POST
   */
  async post(endpoint, body) {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "POST",
      headers: this.buildHeaders(true),
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  },

  /**
   * Método PUT
   */
  async put(endpoint, body) {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: this.buildHeaders(true),
      body: JSON.stringify(body),
    });

    return this.handleResponse(response);
  },

  /**
   * Método DELETE
   */
  async delete(endpoint) {
    const response = await fetch(`${this.BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: this.buildHeaders(false),
    });

    return this.handleResponse(response);
  },

  /**
   * Trata qualquer resposta da API.
   */
  async handleResponse(response) {
    // Caso a API retorne 204 (No Content)
    if (response.status === 204) {
      return null;
    }

    let data = null;

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      let mensagem = "Erro ao comunicar com o servidor.";

      if (data?.detail) {
        if (Array.isArray(data.detail)) {
          mensagem = data.detail.map((item) => item.msg).join("\n");
        } else {
          mensagem = data.detail;
        }
      }

      throw new Error(mensagem);
    }

    return data;
  },
};
