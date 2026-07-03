async function testarCadastro() {

    try {

        const resposta = await Auth.registrar(
            "Dado Mockado",
            "dado@email.com",
            "123456"
        );

        console.log(resposta);

    } catch (erro) {

        console.error(erro.message);

    }

}

async function testarLogin() {

    try {

        const resposta = await Auth.login(
            "dado@email.com",
            "123456"
        );

        console.log(resposta);

        console.log(Auth.getToken());

    } catch (erro) {

        console.error(erro.message);

    }

}

// Testar um por vez
// testarCadastro();
testarLogin();

console.log(Auth.isAuthenticated());