const usuario = {

    id: 1,
    nome: "João",
    email: "joao@email.com"

};

Utils.salvar("usuario", usuario);

const usuarioSalvo = Utils.recuperar("usuario");

console.log(usuarioSalvo);