const DespesaService = {
  listar() {
    return API.get("/despesas");
  },

  buscar(id) {
    return API.get(`/despesas/${id}`);
  },

  criar(dados) {
    return API.post("/despesas", dados);
  },

  editar(id, dados) {
    return API.put(`/despesas/${id}`, dados);
  },

  remover(id) {
    return API.delete(`/despesas/${id}`);
  },
};
