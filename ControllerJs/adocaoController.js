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
function buscarAdocao() {
  let filtro = document.getElementById("filtro").value
  const resultado = document.getElementById("resultado");
  if (filtro.length > 0) // busca com filtro
  {
    const url = "http://localhost:8080/apis/adocao/buscar/" + filtro;
    fetch(url, {
      method: 'GET', redirect: "follow"
    })
      .then((response) => {
        return response.text();
      })
      .then(function (text) {
        var json = JSON.parse(text);

        var table = "<table border='1'>";


        for (let i = 0; i < json.length; i++) {
          table += `<tr>
                        <td>${json[i].codAdocao}</td>
                        <td>${json[i].data}</td>
                        <td>${json[i].animal.nome}</td>
                        <td>${json[i].usuario.nome}</td>
                        <td>${json[i].usuario.cpf}</td>
                        <td>${json[i].usuario.telefone}</td>
                        <td>${json[i].usuario.email}</td>
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].animal.imagemBase64}" alt="Imagem do animal" style="width: 100px; height: auto;">
                        </td>
                        <td>
                          <span class="badge ${json[i].status === 'Aprovado' ? 'bg-success' : 'bg-warning text-dark'}">
                            ${json[i].status}
                          </span>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAnimal(${json[i].codAdocao})"><i class="bi bi-trash"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-info text-white"><i class="bi bi-file-earmark-text"></i></button>
                        </td>
                      </tr>`;
        }
        table += "</table>";
        resultado.innerHTML = table;
      })
      .catch(function (error) {
        console.error(error);
      });
  }
  else {
    const url = "http://localhost:8080/apis/adocao/buscar/%20";
    fetch(url, {
      method: 'GET', redirect: "follow"
    })
      .then((response) => {
        return response.text();
      })
      .then(function (text) {
        var json = JSON.parse(text);

        var table = "<table border='1'>";
        for (let i = 0; i < json.length; i++) {
          table += `<tr>
                        <td>${json[i].codAdocao}</td>
                        <td>${json[i].data}</td>
                        <td>${json[i].animal.nome}</td>
                        <td>${json[i].usuario.nome}</td>
                        <td>${json[i].usuario.cpf}</td>
                        <td>${json[i].usuario.telefone}</td>
                        <td>${json[i].usuario.email}</td>
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].animal.imagemBase64}" alt="Imagem do animal" style="width: 100px; height: auto;">
                        </td>
                        <td>
                        <span class="badge ${json[i].status === 'Aprovado' ? 'bg-success' : 'bg-warning text-dark'} fs-6 p-2">
                          ${json[i].status}
                        </span>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAnimal(${json[i].codAdocao})"><i class="bi bi-trash"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-info text-white"><i class="bi bi-file-earmark-text"></i></button>
                        </td>
                      </tr>`;
        }
        table += "</table>";
        resultado.innerHTML = table;
      })
      .catch(function (error) {
        console.error(error);
      });
  }
}
