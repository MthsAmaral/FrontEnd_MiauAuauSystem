document.addEventListener("DOMContentLoaded", () => {

  carregarAnimais(); // lista pra escolher

});



function visualizarProntuario() {
  const codAnimal = document.getElementById("codAnimal").value;
  if (!codAnimal) {
    Swal.fire({
      icon: 'warning',
      title: 'Selecione um animal antes de visualizar o prontuário.'
    });
  } else {
    // Oculta o botão de "Visualizar Prontuário"
    document.getElementById("btnVisualizarProntuario").classList.add("invisible");


    carregarAnimal();
    carregarAgendamentos();
    carregarLancamentos();
    carregarRegistroProntuario();

    //exibir botao depois de carregado prontuario
    document.getElementById('botaoBaixarProntuario').classList.remove('invisible');

  }

}


function baixarProntuario() {
  const token = localStorage.getItem("token");
  let codAnimal = document.getElementById("codAnimal").value;
  let nomeAnimal = document.getElementById("nomeAnimal").value;

  if (!codAnimal) {
    Swal.fire({
      icon: 'warning',
      title: 'Nenhum animal selecionado!',
      text: 'Por favor, selecione um animal para gerar o PDF.',
    });
  }
  else {
    const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/prontuario/pdf/" + codAnimal;

    Swal.fire({
      title: 'Gerando PDF...',
      text: 'Aguarde enquanto o prontuário é gerado.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    fetch(URL, {
      method: 'GET',
      headers: { 
        Accept: 'application/pdf',
        'Authorization': token 
      }})
      .then(response => {
        if (!response.ok) {
          throw new Error("Erro ao gerar PDF.");
        }
        return response.blob();
      })
      .then(blob => {
        Swal.close();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "Prontuario_" + nomeAnimal + ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        // Exibe toast de sucesso
        Swal.fire({
          icon: 'success',
          title: 'PDF gerado com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });
      })
      .catch(error => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Erro ao gerar o PDF!',
          text: error.message
        });
      });
  }
}


//---------------------------------------------------------------------------------

function carregarAnimal() {
  const token = localStorage.getItem("token");
  let codAnimal = document.getElementById("codAnimal").value;
  const resultado = document.getElementById("resultadoAnimal");

  const url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/animal/buscar-id/" + codAnimal;
  fetch(url, {
    method: 'GET', redirect: "follow", headers: { 'Authorization': token }
  })
    .then((response) => {
      return response.text();
    })
    .then(function (text) {
      const json = JSON.parse(text);

      const dataOriginal = json.dataNascimento;
      const [year, month, day] = dataOriginal.split('-');
      const dataFormatada = `${day}/${month}/${year.slice(-2)}`;

      const form = `
                <main class='container container-box mt-5'>
                  <h4 class="mb-4">Informações do Animal</h4>

                  <div class="row">
                    <!-- Coluna da imagem -->
                    <div class="col-md-3 d-flex justify-content-center">
                      <img src="data:image/jpeg;base64,${json.imagemBase64}" alt="Imagem do animal"
                        class="img-thumbnail" style="width: 180px; height: 180px; object-fit: cover;">
                    </div>

                    <!-- Inputs ao lado da imagem -->
                    <div class="col-md-9">
                      <div class="row">
                        <div class="col-md-4 mb-1">
                          <label>Nome</label>
                          <input type="text" class="form-control" value="${json.nome}" readonly>
                        </div>
                        <div class="col-md-4 mb-1">
                          <label>Raça</label>
                          <input type="text" class="form-control" value="${json.raca}" readonly>
                        </div>
                        <div class="col-md-4 mb-1">
                            <label>Data de Nascimento</label>
                            <input type="text" class="form-control" value="${dataFormatada}" readonly>
                          </div>
                      </div>

                      <div class="row">
                          <div class="col-md-2 mb-1">
                            <label>Sexo</label>
                            <input type="text" class="form-control" value="${json.sexo}" readonly>
                          </div>
                          <div class="col-md-2 mb-1">
                            <label>Peso</label>
                            <input type="text" class="form-control" value="${json.peso} kg" readonly>
                          </div>
                          <div class="col-md-2 mb-1">
                            <label>Cor</label>
                            <input type="text" class="form-control" value="${json.cor}" readonly>
                          </div>
                          <div class="col-md-2 mb-1">
                            <label>Espécie</label>
                            <input type="text" class="form-control" value="${json.especie}" readonly>
                          </div>
                          <div class="col-md-2 mb-1">
                            <label>Castrado</label>
                            <input type="text" class="form-control" value="${json.castrado ? 'Sim' : 'Não'}" readonly>
                          </div>
                          <div class="col-md-2 mb-1">
                            <label>Adotado</label>
                            <input type="text" class="form-control" value="${json.adotado ? 'Sim' : 'Não'}" readonly>
                          </div>
                      </div>
                    </div>

                    <!-- Inputs abaixo da imagem ocupando 100% -->
                    <div class="col-md-12">
                      <div class="row">
                        
                        
                        
                      </div>
                    </div>
                  </div>
                </main>
                `;


      resultado.innerHTML = form;
    })

    .catch(function (error) {
      console.error(error);
    });
}

function carregarAgendamentos() {
  const token = localStorage.getItem("token");
  let codAnimal = document.getElementById("codAnimal").value;
  const resultado = document.getElementById("resultadoAgendamento");


  const url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/agendar-medicamento/buscar_animal/" + codAnimal;

  fetch(url, {
    method: 'GET',
    redirect: "follow",
    headers: { 'Authorization': token }
  })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      var json = JSON.parse(text);

      if (json.length === 0) {
        resultado.innerHTML = "<main class='container container-box mt-5'><p>Nenhum agendamento encontrado.</p></main>";
      } else {
        let linhas = `
          <main class='container container-box mt-5'>
            <h4>Agendamentos</h4>
            <table class='table table-bordered'>
              <thead>
                <tr>
                  <th>Medicamento</th>
                  <th style="width: 20%;">Aplicação</th>
                </tr>
              </thead>
              <tbody>
          `;

        json.forEach(agendamento => {
          const [year, month, day] = agendamento.dataAplicacao.split("-");
          const dataFormatada = `${day}/${month}/${year.slice(-2)}`;

          linhas += `
              <tr>
                <td>${agendamento.medicamento.nome}</td>
                <td style="width: 20%;">${dataFormatada}</td>
              </tr>
            `;
        });

        linhas += "</tbody></table></main>";

        resultado.innerHTML = linhas;
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar agendamentos:", error);
      resultado.innerHTML = "<main class='container container-box mt-5'><p class='text-danger'>Erro ao buscar agendamentos.</p></main>";
    });
}

function carregarLancamentos(){
  const token = localStorage.getItem("token");
  let codAnimal = document.getElementById("codAnimal").value;
  const resultado = document.getElementById("resultadoLancamento");


  const url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/lancamento/buscar_animal/" + codAnimal;

  fetch(url, {
    method: 'GET',
    redirect: "follow",
    headers: { 'Authorization': token }
  })
    .then((response) => {
      return response.text();
    })
    .then((text) => {
      var json = JSON.parse(text);

      if (json.length === 0) {
        resultado.innerHTML = "<main class='container container-box mt-5'><p>Nenhum Lancamento encontrado.</p></main>";
      } else {
        let table = "<main class='container container-box mt-5'>" + "<table class='table table-bordered'>";

        table += "<h4>Lancamentos </h4>";

        table += `<thead>
                  <tr>
                      <th>Data</th>
                      <th>Descrição</th>
                      <th>Valor</th>
                      <th>PDF</th>
                  </tr>
              </thead><tbody>`;

        json.forEach(lanc => {
          let partes = lanc.data.split("-");
          let dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;

          // Verifica se a chave "arquivo" não é nula para decidir se cria o link ou não
          //const linkPDF = lanc.arquivo
           // ? `<a href="#" onclick="abrirPDF('${lanc.cod}')" style="color:blue; cursor:pointer;">PDF</a>`
           // : '<span>-</span>';

          const linkPDF = lanc.arquivo
          ? `<a href="https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/lancamento/arquivo/${lanc.cod}"
                onclick="abrirPDF(event)"
                target="_blank">
                PDF
            </a>`
          : '<span>-</span>';


          table += `
          <tr>
              <td>${dataFormatada}</td>
              <td>${lanc.descricao}</td>
              <td>${lanc.valor ?? '-'}</td>
              <td>${linkPDF}</td>
          </tr>
      `;
        });
        table += "</tbody></table> </main>";
        resultado.innerHTML = table;
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar lancamentos:", error);
      resultado.innerHTML = "<main class='container container-box mt-5'><p class='text-danger'>Erro ao buscar lancamentos.</p></main>";
    });
}

function abrirPDF(event) {
  event.preventDefault(); // Evita que o navegador siga o link

  const token = localStorage.getItem("token");
  const url = event.currentTarget.href;

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  })
  .then(response => {
    if (!response.ok) throw new Error('Erro ao carregar PDF');
    return response.blob();
  })
  .then(blob => {
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank'); // Abre o PDF em nova aba
    // Opcional: você pode deixar o revoke para depois se quiser que o PDF funcione bem em nova aba
  })
  .catch(error => {
    console.error(error);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Não foi possível abrir o PDF.'
    });
  });
}

function carregarRegistroProntuario() {
  const token = localStorage.getItem("token");
  let codAnimal = document.getElementById("codAnimal").value;
  const resultado = document.getElementById("resultadoProntuario");

  const url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/prontuario/buscar_animal/" + codAnimal;

  Swal.fire({
    title: 'Recuperando os dados...',
    text: 'Em instantes iremos retornar os dados!',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  fetch(url, {
      method: 'GET',
      redirect: "follow",
      headers: { 'Authorization': token }
  })
    .then((response) => response.json())
    .then((json) => {
      if (json.length === 0) {
        resultado.innerHTML = "<main class='container container-box mt-5'><p>Nenhum registro encontrado no prontuário.</p></main>";
      } else {
        let table = `
              <main class='container container-box mt-5'>
                  <h4>Registros</h4>
                  <table class='table table-bordered'>
                      <thead>
                          <tr>
                              <th>Data</th>
                              <th style="width: 25%;">Tipo Registro</th>
                              <th style="width: 40%;">Observação</th>
                              <th>Arquivo</th>
                              <th>Ações</th>
                          </tr>
                      </thead>
                      <tbody>
          `;

        json.forEach(reg => {
          const [year, month, day] = reg.data.split("-");
          const dataFormatada = `${day}/${month}/${year.slice(-2)}`;

          const linkPDF = reg.arquivo
            ? `<a href="https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/prontuario/arquivo/${reg.cod}" target="_blank">PDF</a>`
            : '<span>-</span>';

          table += `
                  <tr>
                      <td>${dataFormatada}</td>
                      <td style="width: 25%; word-break: break-word;">${reg.tipoRegistro}</td>
                      <td style="width: 40%; word-break: break-word;">${reg.observacao}</td>
                      <td>${linkPDF}</td>
                      <td>
                          <button type="button" class="btn btn-sm btn-warning" onclick="editarProntuario(${reg.cod})">
                              <i class="bi bi-pencil-square"></i>
                          </button>
                          <button class="btn btn-sm btn-danger" onclick="excluirProntuario(${reg.cod})">
                              Excluir
                          </button>
                      </td>
                  </tr>
              `;
        });

        table += `
                      </tbody>
                  </table>
              </main>
          `;

        resultado.innerHTML = table;
      }

      // Fecha o Swal de carregamento
      Swal.close();

      // Exibe um Swal de sucesso que some automaticamente
      Swal.fire({
        icon: 'success',
        title: 'Dados Recuperados',
        text: 'Dados recuperados com sucesso!',
        showConfirmButton: false, // Remove o botão "OK"
        timer: 1000,              // Duração em milissegundos (ex: 2000 = 2 segundos)
        timerProgressBar: true    // Mostra uma barra de tempo decrescente
      });
    })
    .catch((error) => {
      console.error("Erro ao carregar prontuário:", error);
      resultado.innerHTML = "<main class='container container-box mt-5'><p class='text-danger'>Erro ao buscar prontuário.</p></main>";

      // Fecha o Swal de carregamento
      Swal.close();

      // Exibe erro
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível recuperar os dados.'
      });
    });
}


function editarProntuario(cod) {
  window.location.href = "../TelasFundamentais/cadRegistroProntuario.html?cod=" + cod;
}

function excluirProntuario(cod) {
  const token = localStorage.getItem("token");
  Swal.fire({
    title: "Você tem certeza ?",
    text: "Você não poderá reverter isso!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Apagar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/prontuario/excluir/" + cod;

      fetch(URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token
        },
        method: 'DELETE'
      })
        .then((response) => {
          if (!response.ok)
            Toast.fire({
              icon: 'error',
              title: 'Erro ao Excluir registro do prontuario!',
            });
          else {
            sessionStorage.setItem('registroApagado', 'true');
            window.location.reload();
          }
        })
        .then((json) => {

        })
        .catch((error) => {
          console.error("Erro ao excluir o registro do prontuario:", error);
        })
    }
  });

}

var lista = [];

//modal animal

function carregarAnimais() {
  const token = localStorage.getItem("token");
    let filtro = document.getElementById("filtro").value.trim();
    const container = document.querySelector("#modalAnimais .modal-body");
    container.innerHTML = "";


  // Define URL com base no filtro
  const url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/animal/buscar/" + (filtro.length > 0 ? filtro : "%20");

  fetch(url, {
    method: 'GET',
    redirect: 'follow',
    headers: { 'Authorization': token }
  })
    .then(response => {
      if (!response.ok)
        throw new Error("Erro ao carregar animais.");
      else
        return response.text();
    })
    .then(text => {
      lista = JSON.parse(text);

      // Verifica se a lista está vazia
      if (lista.length === 0) {
        const mensagem = document.createElement("div");
        mensagem.className = "alert alert-info";
        mensagem.textContent = "Nenhum animal encontrado com esse filtro.";
        container.appendChild(mensagem);
      } else {

        /*for(let i =0; lista.length();i++)
        {
          
        }*/
        lista.forEach((animal, indice) => {
          const col = document.createElement("div");
          col.className = "col-md-4 mb-3";

          //se n tiver foto coloca generica
          const imagemSrc = animal.imagemBase64
            ? `data:image/jpeg;base64,${animal.imagemBase64}`
            : '../img/semFoto.png';

          col.innerHTML = `
                      <div class="card card-select" style="cursor: pointer;" onclick="selecionarAnimal(${indice})">
                        <img src="${imagemSrc}" class="card-img-top" alt="${animal.nome}" style="height: 180px; width: 100%; object-fit: contain; background-color: #f8f9fa;">
                        <div class="card-body">
                            <h5 class="card-title text-center" style="background-color: #d3a96a; padding: 5px; margin: 0;">${animal.nome}</h5>
                        </div>
                      </div>
                  `;

          container.appendChild(col);
        });

      }
    })
    .catch(error => console.error(error.message));
}

function selecionarAnimal(indice) {
  const animal = lista[indice];
  const previewDiv = document.getElementById("animalSelecionado");


  const imagemSrc = animal.imagemBase64
    ? `data:image/jpeg;base64,${animal.imagemBase64}`
    : '../img/semFoto.png';

  previewDiv.innerHTML = `
        <div class="row">
            <div class="col-md-8">
                <div class="card card-select p-0 position-relative h-100">
                    <img src="${imagemSrc}" class="card-img-top" alt="${animal.nome}" style="height: 180px; object-fit: contain; background-color: #f8f9fa;">
                    <div class="card-body">
                        <h5 class="card-title text-center" style="background-color: #d3a96a; padding: 5px; margin: 0;">${animal.nome}</h5>
                    </div>
                    <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" onclick="removerAnimalSelecionado()">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

  document.getElementById("animalSelecionado").classList.remove("d-none");

  //guarda cod formulario
  document.getElementById("codAnimal").value = animal.codAnimal;
  document.getElementById("nomeAnimal").value = animal.nome;

  // Fecha o modal automaticamente
  const modal = bootstrap.Modal.getInstance(document.getElementById('modalAnimais'));
  modal.hide();
}


function removerAnimalSelecionado() {
  const previewDiv = document.getElementById("animalSelecionado");
  previewDiv.innerHTML = "";
  previewDiv.classList.add("d-none");

  //oculta botao quando fechar prontuário
  document.getElementById('botaoBaixarProntuario').classList.add('invisible');

  //exibe botao de visualizar 
  document.getElementById("btnVisualizarProntuario").classList.remove("invisible");

  // Limpa o input que salva codAnimal no formulario
  document.getElementById("codAnimal").value = "";

  // "Fecha" o formulário ocultando as seções exibidas
  document.getElementById("resultadoAnimal").innerHTML = "";
  document.getElementById("resultadoAgendamento").innerHTML = "";
  document.getElementById("resultadoLancamento").innerHTML = "";
  document.getElementById("resultadoProntuario").innerHTML = "";
}



function redirecionarTelaCad() {

  window.location.href = "../TelasFundamentais/cadRegistroProntuario.html?";
}