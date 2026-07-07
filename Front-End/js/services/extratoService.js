const ExtratoService = {
  listar() {
    return API.get("/extrato");
  },

  criar(dados) {
    return API.post("/extrato", dados);
  },

  buscar(id) {
    return API.get(`/extrato/${id}`);
  },

  editar(id, dados) {
    return API.put(`/extrato/${id}`, dados);
  },

  limpar() {
    return API.delete("/extrato");
  },

  remover(id) {
    return API.delete(`/extrato/${id}`);
  },
};
