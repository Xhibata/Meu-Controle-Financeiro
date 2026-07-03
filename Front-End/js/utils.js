const STORAGE = {
  TOKEN: "token",

  USUARIO: "usuario",
};

const Utils = {
  salvar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  },

  recuperar(chave) {
    const valor = localStorage.getItem(chave);

    if (!valor) return null;

    return JSON.parse(valor);
  },

  remover(chave) {
    localStorage.removeItem(chave);
  },

  limpar() {
    localStorage.clear();
  },

  mostrarMensagem(mensagem) {
    alert(mensagem);
  },

  mostrarErro(mensagem) {
    alert(mensagem);
  },
};
