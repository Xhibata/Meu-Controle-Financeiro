async function testarAPI() {
  try {
    const resposta = await API.get("/projeto");

    console.log("API Online");

    // console.log(resposta);
  } catch (erro) {
    console.error(erro.message);
  }

  try {
    const resposta = await API.get("/projeto/db");

    console.log("DB Online");

    // console.log(resposta);
  } catch (erro) {
    console.error(erro.message);
  }

  // try {
  //   const resposta = await API.get("/naoexiste");

  //   console.log("DB Online");

  //   // console.log(resposta);
  // } catch (erro) {
  //   console.error(erro.message);
  // }
}

testarAPI();
