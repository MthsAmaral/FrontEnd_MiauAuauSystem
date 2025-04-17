function buscarAnimalAdocao() {

  const container = document.getElementById("resultado");
  container.innerHTML = "";

  const url = "http://localhost:8080/apis/animal/buscar/%20";
  fetch(url, {
    method: 'GET', redirect: "follow"
  })
    .then((response) => {
      return response.text();
    })
    .then(function (text) {
      var json = JSON.parse(text); // Converte a resposta JSON
      for (let i = 0; i < json.length; i++) {
        if (json[i].adotado == 'Não') {
          container.innerHTML += `
          <div class="card mb-3 shadow-sm" style="border-radius: 15px;">
          <div class="row g-0">
            <div class="col-md-3 d-flex align-items-center justify-content-center p-2">
              <img src="data:image/jpeg;base64,${json[i].imagemBase64}" class="img-fluid rounded" style="max-height: 180px;" alt="Foto do Animal">
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <h5 class="card-title"><strong>Nome:</strong> ${json[i].nome}</h5>
                <p class="card-text mb-1"><strong>Sexo:</strong> ${json[i].sexo}</p>
                <p class="card-text mb-1"><strong>Castrado:</strong> ${json[i].castrado}</p>
                <p class="card-text mb-1"><strong>Raça:</strong> ${json[i].raca}</p>
                <p class="card-text mb-1"><strong>Idade:</strong> ${json[i].idade}</p>
                <p class="card-text mb-1"><strong>Peso:</strong> ${json[i].peso}</p>
                <button class="btn btn-primary mt-2" onclick="selecionarAnimal('${json[i].id}')">Selecionar</button>
              </div>
            </div>
          </div>
          </div>`
        }

      }

    })
    .catch(function (error) {
      console.error(error); // Exibe erros, se houver
    });

}
