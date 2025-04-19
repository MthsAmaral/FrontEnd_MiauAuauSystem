let animalSelecionado = null;
let medicamentoSelecionado = null;

function limparFormAgendamento() {
  document.getElementById("formAgendamento").reset();
  document.getElementById("animalSelecionado").classList.add("d-none");
  document.getElementById("medicamentoSelecionado").classList.add("d-none");
  animalSelecionado = null;
  medicamentoSelecionado = null;
}

function validarCamposAgendamento() {
  const dataAplicacao = document.getElementById("dataAplicacao").value;

  if (!animalSelecionado || !medicamentoSelecionado || !dataAplicacao) {
    alert("Preencha todos os campos!");
  }
  else{
    gravarAgendamento();
  }
}

function gravarAgendamento() {
  const dataAplicacao = document.getElementById("dataAplicacao").value;
  /*console.log("Tentando agendar:", {
    codAnimal: animalSelecionado.codAnimal,
    codTipoMedicamento: medicamentoSelecionado.cod,
    dataAplicacao
  });*/

  const formData = new FormData();
  formData.append("animal", animalSelecionado.codAnimal);
  formData.append("medicamento", medicamentoSelecionado.cod);
  formData.append("dataAplicacao", dataAplicacao);


  fetch("http://localhost:8080/apis/agendar-medicamento/gravar", {
    method: "POST",
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na requisição: " + response.status);
      }
      return response.json();
    })
    .then(json => {
      alert("Agendamento realizado com sucesso!");
      carregarAgendamentos();
      limparFormAgendamento();
    })
    .catch(error => {
      console.error("Erro ao agendar:", error);
      alert("Erro ao tentar gravar agendamento. Verifique o console.");
    });
}


function carregarAgendamentos() {
  const tbody = document.querySelector("#tabelaAgendamentos tbody");
  tbody.innerHTML = "";

  const url = "http://localhost:8080/apis/agendar-medicamento/buscar/%20"; // espaço codificado como %20 para simular "sem filtro"
  
  fetch(url, {
      method: 'GET',
      redirect: "follow"
  })
  .then((response) => {
      return response.text(); // Recebe como texto
  })
  .then((text) => {
      const lista = JSON.parse(text); // Converte para JSON
      lista.forEach(item => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
              <td>${item.animal.nome}</td>
              <td>${item.medicamento.nome}</td>
              <td>${item.dataAplicacao}</td>
              <td>
                  <button class="btn btn-sm btn-danger" onclick="excluirAgendamento(${item.codAgendarMedicamento})">Excluir</button>
              </td>
          `;
          tbody.appendChild(tr);
      });
  })
  .catch((error) => {
      console.error("Erro ao carregar agendamentos:", error);
  });
}

async function excluirAgendamento(id) {
  if (confirm("Deseja realmente excluir este agendamento?"))
  {
    const response = await fetch(`http://localhost:8080/apis/agendar-medicamento/excluir/${id}`, {
      method: "DELETE"
    });
  
    if (response.ok) {
      alert("Agendamento excluído.");
      carregarAgendamentos();
    } else {
      alert("Erro ao excluir agendamento.");
    }
  }
}



//CARREGAR LISTAS
async function carregarAnimais() {
  const container = document.querySelector("#modalAnimais .modal-body");
  container.innerHTML = "";

  const response = await fetch("http://localhost:8080/apis/animal/buscar/%20");
  if (response.ok) {
    const lista = await response.json();
    lista.forEach(animal => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";
      col.innerHTML = `
        <div class="card card-select" data-animal-id="${animal.id}" data-bs-dismiss="modal">
          <img src="data:image/jpeg;base64,${animal.imagemBase64}" class="card-img-top" />
          <div class="card-body">
            <h5 class="card-title">${animal.nome}</h5>
            <p class="card-text">Raça: ${animal.raca}<br>Sexo: ${animal.sexo}</p>
          </div>
        </div>
      `;
      col.querySelector('.card-select').addEventListener('click', () => selecionarAnimal(animal));
      container.appendChild(col);
    });    
  }
}

async function carregarMedicamentos() {
  const container = document.querySelector("#modalMedicamentos .modal-body");
  container.innerHTML = "";

  const response = await fetch("http://localhost:8080/apis/tipo-medicamento/buscar/%20");
  if (response.ok) {
    const lista = await response.json();
    lista.forEach(med => {
      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";
      col.innerHTML = `
        <div class="card card-select" data-med-id="${med.id}" data-bs-dismiss="modal">
          <div class="card-body">
            <h5 class="card-title">${med.nome}</h5>
            <p class="card-text">Forma: ${med.forma}<br>Descrição: ${med.descricao}</p>
          </div>
        </div>
      `;
      col.querySelector('.card-select').addEventListener('click', () => selecionarMedicamento(med));
      container.appendChild(col);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarAgendamentos();
  carregarAnimais();
  carregarMedicamentos();
});



//MOSTRAR MODAL

//medicamento
function selecionarMedicamento(med) {

  //console.log("Medicamento selecionado:", med);

  medicamentoSelecionado = med;
  const div = document.getElementById("medicamentoSelecionado");
  div.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <strong>${med.nome}</strong><br>
        Forma: ${med.forma}<br>
        Descrição: ${med.descricao}
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="removerMedicamento()">Remover</button>
    </div>
  `;
  div.classList.remove("d-none");
}
function removerMedicamento() {
  medicamentoSelecionado = null;
  const div = document.getElementById("medicamentoSelecionado");
  div.classList.add("d-none");
  div.innerHTML = "";
}

//animal
function selecionarAnimal(animal) {

  //console.log("Animal selecionado:", animal); 

  animalSelecionado = animal;
  const div = document.getElementById("animalSelecionado");
  div.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <div>
        <strong>${animal.nome}</strong><br>
        Raça: ${animal.raca}<br>
        Sexo: ${animal.sexo}
      </div>
      <button class="btn btn-sm btn-outline-danger" onclick="removerAnimal()">Remover</button>
    </div>
    <img src="data:image/jpeg;base64,${animal.imagemBase64}" class="img-fluid rounded mt-2" width="100">
  `;
  div.classList.remove("d-none");
}
function removerAnimal() {
  animalSelecionado = null;
  const div = document.getElementById("animalSelecionado");
  div.classList.add("d-none");
  div.innerHTML = "";
}
