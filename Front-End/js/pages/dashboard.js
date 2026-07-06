const DashboardService = {
  getResumo() {
    return API.get("/dashboard");
  },

  getExtrato() {
    return API.get("/dashboard/extrato");
  },
};
