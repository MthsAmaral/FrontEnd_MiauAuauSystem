let animalSelecionado = null;
let medicamentoSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
  carregarAgendamentos();
  carregarAnimais();
  carregarMedicamentos();
});

function limparFormAgendamento() {
  document.getElementById("formAgendamento").reset();
  document.getElementById("animalSelecionado").classList.add("d-none");
  document.getElementById("medicamentoSelecionado").classList.add("d-none");
  animalSelecionado = null;
  medicamentoSelecionado = null;
}

function validarData(dataString) 
{
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(dataString)) {
      return false;
    }

    const [ano, mes, dia] = dataString.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (
      data.getFullYear() !== ano ||
      data.getMonth() !== mes - 1 ||
      data.getDate() !== dia
    ) 
    {
      return false; 
    }
  
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);
  
    if (data <= hoje)
    {
      return false; 
    }
  
    return true; 
}

function validarCamposAgendamento() {
  const dataAplicacao = document.getElementById("dataAplicacao").value;

  if (!animalSelecionado || !medicamentoSelecionado || !dataAplicacao) {
    Swal.fire({
      icon: "warning",
      title: "Campo(s) Não Preenchido(s)",
      timer: 1500,
      timerProgressBar: true
    })
  }
  else{
    if(validarData(dataAplicacao))
      gravarAgendamento();
    else
    {
      Swal.fire({
        icon: "warning",
        title: "Data Inválida",
        timer: 1500,
        timerProgressBar: true
      })
    }
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
        sessionStorage.setItem('agendamentoGravado','false');
      }
      else
      {
        window.location.reload();
        sessionStorage.setItem('agendamentoGravado','true');
      }
  
      return response.json();
    })
    .then(json => {
      
    })
    .catch(error => {
      console.error(error);
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

function excluirAgendamento(id) {
  
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
    if (result.isConfirmed) 
    {
      const URL = "http://localhost:8080/apis/agendar-medicamento/excluir/" + id;
    
      fetch(URL, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'DELETE'
      })
        .then((response) =>{
          if(!response.ok)
            Toast.fire({
              icon: 'error',
              title: 'Erro ao Excluir Agendamento!',
            });
          else
          {
            sessionStorage.setItem('agendamentoApagado', 'true');
            window.location.reload();
          }
        })
        .then((json)=>{
  
        })
        .catch((error)=>{
          console.error("Erro ao excluir o agendamento:", error);
        })
    }
  });

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
            <p class="card-text">Forma: ${med.formaFarmaceutica}<br>Descrição: ${med.descricao}</p>
          </div>
        </div>
      `;
      col.querySelector('.card-select').addEventListener('click', () => selecionarMedicamento(med));
      container.appendChild(col);
    });
  }
}




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
        Forma: ${med.formaFarmaceutica}<br>
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
