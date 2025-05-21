document.addEventListener("DOMContentLoaded", () => {
  const animalIdSalvo = sessionStorage.getItem("animalSelecionado");
  if (animalIdSalvo) {
    document.getElementById("animalId").value = animalIdSalvo;
    visualizarProntuario(); // Carrega tudo automaticamente
  }else
    carregarAnimais();
});


function visualizarProntuario(){
    const animalId = document.getElementById("animalId").value;
    if (!animalId) {
        Swal.fire({
            icon: 'warning',
            title: 'Selecione um animal antes de visualizar o prontuário.'
        });
    }else{
      carregarAnimal();
      carregarAgendamentos();
      carregarLancamentos();
      carregarRegistroProntuario(); // Certifique-se de que essa função está definida!
    }
    
}


function carregarAnimal(){

  let animalId = document.getElementById("animalId").value;
  const resultado = document.getElementById("resultadoAnimal");

  // Mostra spinner enquanto carrega
  resultado.innerHTML = `
    <div class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>`;

  const url = "http://localhost:8080/apis/animal/buscar-id/"+animalId;
        fetch(url, {
            method: 'GET', redirect: "follow"
        })
            .then((response) => {
                return response.text();
            })
            .then(function (text) {
              const json = JSON.parse(text); 

              const dataOriginal = json.dataNascimento;
              const [year, month, day] = dataOriginal.split('-'); 
              const dataFormatada = `${day}/${month}/${year.slice(-2)}`; 

              const table = `
              <main class='container container-box mt-5'>
                <h4>Informações Animal </h4>
                <table border='1'>
                    <thead>
                      <tr>
                          <th>Foto</th>
                          <th>Nome</th>
                          <th>Raça</th>
                          <th>Nascimento</th>
                          <th>Sexo</th>
                          <th>Peso</th>
                          <th>Cor</th>
                          <th>Especie</th>
                          <th>Castrado</th>
                          <th>Adotado</th>

                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                          <td>
                            <img src="data:image/jpeg;base64,${json.imagemBase64}" alt="Imagem do animal" style="width: 100px; height: 100px; object-fit: cover;">
                          </td>
                          <td>${json.nome}</td>
                          <td>${json.raca}</td>
                          <td>${dataFormatada}</td>
                          <td>${json.sexo}</td>
                          <td>${json.peso} kg</td>
                          <td>${json.cor} kg</td>
                          <td>${json.especie} kg</td>
                          <td>${json.castrado}</td>
                          <td>${json.adotado}</td>
                      </tr>
                    </tbody>  
                </table>
              </main>`;

              resultado.innerHTML = table;
            })

            .catch(function (error) {
                console.error(error); 
            });
}

function carregarAgendamentos(){
    let animalId = document.getElementById("animalId").value;
    const resultado = document.getElementById("resultadoAgendamento");
  
    resultado.innerHTML = `
    <div class="text-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>`;

    const url = "http://localhost:8080/apis/agendar-medicamento/buscar_animal/" + animalId;
  
    fetch(url, {
      method: 'GET',
      redirect: "follow"
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
                  <th>Data Aplicação</th>
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
                <td>${dataFormatada}</td>
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
let animalId = document.getElementById("animalId").value;
const resultado = document.getElementById("resultadoLancamento");

resultado.innerHTML = `
  <div class="text-center my-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>
  </div>`;

const url = "http://localhost:8080/apis/lancamento/buscar_animal/" + animalId;

fetch(url, {
    method: 'GET',
    redirect: "follow"
})
    .then((response) => {
    return response.text();
    })
    .then((text) => {
    var json = JSON.parse(text);

    if (json.length === 0) {
        resultado.innerHTML = "<main class='container container-box mt-5'><p>Nenhum Lancamento encontrado.</p></main>";
    } else {
        let table = "<main class='container container-box mt-5'>"+"<table class='table table-bordered'>";

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
        const linkPDF = lanc.arquivo
        ? `<a href="http://localhost:8080/apis/lancamento/arquivo/${lanc.cod}" target="_blank">PDF</a>`
        : '<span>-</span>'; // Ou qualquer outra marcação de texto ou elemento vazio

        table += `
            <tr>
                <td>${dataFormatada}</td>
                <td>${lanc.descricao}</td>
                <td>${lanc.valor ?? '-'}</td>
                <td>${linkPDF}</td>
            </tr>
        `;
        });
        table+= "</tbody></table> </main>";
        resultado.innerHTML = table;
    }
    })
    .catch((error) => {
    console.error("Erro ao carregar lancamentos:", error);
    resultado.innerHTML = "<main class='container container-box mt-5'><p class='text-danger'>Erro ao buscar lancamentos.</p></main>";
    });
}

function carregarRegistroProntuario() {
  let animalId = document.getElementById("animalId").value;
  const resultado = document.getElementById("resultadoProntuario");

  resultado.innerHTML = `
  <div class="text-center my-4">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Carregando...</span>
    </div>
  </div>`;


  const url = "http://localhost:8080/apis/prontuario/buscar_animal/" + animalId;

  fetch(url, {
      method: 'GET',
      redirect: "follow"
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
                              <th>Tipo Registro</th>
                              <th>Observação</th>
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
                  ? `<a href="http://localhost:8080/apis/lancamento/arquivo/${reg.cod}" target="_blank">PDF</a>`
                  : '<span>-</span>';

              table += `
                  <tr>
                      <td>${dataFormatada}</td>
                      <td>${reg.tipoRegistro}</td>
                      <td>${reg.observacao}</td>
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
  })
  .catch((error) => {
      console.error("Erro ao carregar prontuário:", error);
      resultado.innerHTML = "<main class='container container-box mt-5'><p class='text-danger'>Erro ao buscar prontuário.</p></main>";
  });
}




function editarProntuario(cod) {
  window.location.href = "../TelasFundamentais/cadRegistroProntuario.html?codAnimal=" + cod;
}

function excluirProntuario(cod) {

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
      const URL = "http://localhost:8080/apis/prontuario/excluir/" + cod;

      fetch(URL, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
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


//modal animal

function carregarAnimais() {
    let filtro = document.getElementById("filtro").value.trim();
    const container = document.querySelector("#modalAnimais .modal-body");
    container.innerHTML = "";

    // Limpa seleção temporária ao abrir
    animaisSelecionadosTemp = [];

    // Define URL com base no filtro
    const url = "http://localhost:8080/apis/animal/buscar/" + (filtro.length > 0 ? filtro : "%20");

    fetch(url, {
        method: 'GET',
        redirect: 'follow'
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar animais.");
            return response.text();
        })
        .then(text => {
            const lista = JSON.parse(text);

            // Verifica se a lista está vazia
            if (lista.length === 0) {
                const mensagem = document.createElement("div");
                mensagem.className = "alert alert-info";
                mensagem.textContent = "Nenhum animal encontrado com esse filtro.";
                container.appendChild(mensagem);
            } else {
                lista.forEach(animal => {
                  const col = document.createElement("div");
                  col.className = "col-md-4 mb-3";

                  //se n tiver foto coloca generica
                  const imagemSrc = animal.imagemAnimal 
                      ? `data:image/jpeg;base64,${animal.imagemAnimal}` 
                      : '../img/semFoto.png';

                  col.innerHTML = `
                      <div class="card card-select" style="cursor: pointer;" onclick="selecionarAnimal(${animal.codAnimal}, '${animal.nome}', '${animal.imagemAnimal ?? ""}')">
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

function selecionarAnimal(codAnimal, nome, imagemBase64) {
    const previewDiv = document.getElementById("animalSelecionado");

    const imagemSrc = imagemBase64 
        ? `data:image/jpeg;base64,${imagemBase64}` 
        : '../img/semFoto.png';

    previewDiv.innerHTML = `
        <div class="card card-select p-0 position-relative" style="width: 180px;">
            <img src="${imagemSrc}" class="card-img-top" alt="${nome}" style="height: 180px; object-fit: cover;">
            <div class="card-body p-2">
                <h5 class="card-title text-center mb-0" style="background-color: #d3a96a; padding: 5px; margin: 0;">${nome}</h5>
            </div>
            <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" onclick="removerAnimalSelecionado()">
                <i class="bi bi-x"></i>
            </button>
        </div>
    `;
    
    document.getElementById("animalSelecionado").classList.remove("d-none");
    document.getElementById("animalId").value = codAnimal;

    //guardar seleção, se recarregar a pagina não perde a seleção
    sessionStorage.setItem("animalSelecionado", codAnimal);

    // Fecha o modal automaticamente
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalAnimais'));
    modal.hide();
}

function removerAnimalSelecionado() {
    const previewDiv = document.getElementById("animalSelecionado");
    previewDiv.innerHTML = "";
    previewDiv.classList.add("d-none");

    // Limpa o input hidden
    document.getElementById("animalId").value = "";

    //remove animal selecionado do localStorage
    sessionStorage.removeItem("animalIdSelecionado");
}
