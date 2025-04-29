let animalSelecionado = null;
let medicamentoSelecionado = null;

document.addEventListener("DOMContentLoaded", () => {
  carregarAgendamentos();
  carregarAnimais();
  carregarMedicamentos();
  carregarNotificacoes();
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
  formData.append("status","false");


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

function alterarAgendamento(codAgendarMedicamento, animal, medicamento, dataAplicacao, status) {

  console.log('Cod Agendar Medicamento:', codAgendarMedicamento);
  console.log('Animal:', animal);
  console.log('Medicamento:', medicamento);
  console.log('Data Aplicacao:', dataAplicacao);
  console.log('Status:', status);

  // Repassar os dados para a função de alterar do backend
  const url = "http://localhost:8080/apis/agendar-medicamento/atualizar";
  
  const formData = new FormData();
    formData.append("codAgendarMedicamento", codAgendarMedicamento);
    formData.append("animal", animal.codAnimal); // Certifique-se de que animal.codAnimal esteja correto
    formData.append("medicamento", medicamento.cod); // Certifique-se de que medicamento.cod esteja correto
    formData.append("dataAplicacao", dataAplicacao);
    formData.append("status", status);
  
  fetch(url, {
    method: "PUT",
    body: formData
  })
    .then(response => {
      if (!response.ok) {
        sessionStorage.setItem('agendamentoAlterado', 'false');
      } else {
        sessionStorage.setItem('agendamentoAlterado', 'true');
        window.location.reload(); // Recarregar a página após a alteração
      }
      return response.json();
    })
    .then(json => {
      console.log('Notificação marcada como lida:', json);
    })
    .catch(error => {
      console.error('Erro ao alterar agendamento:', error);
    });
}


function carregarAgendamentos() {
  const resultado = document.getElementById("resultado");

  const url = "http://localhost:8080/apis/agendar-medicamento/buscar/%20"; // espaço codificado como %20 para simular "sem filtro"
  
  fetch(url, {
      method: 'GET',
      redirect: "follow"
  })
    .then((response) => {
        return response.text(); // Recebe como texto
    })
    .then(function (text){

        var json = JSON.parse(text); // Converte para JSON

        //console.log(json);

        var table = "<table border='1'>"; 
        for(let i = 0; i < json.length; i++)
        {
          //formatar data
          const dataOriginal = json[i].dataAplicacao;
          const [year, month, day] = dataOriginal.split('-'); 
          const dataFormatada = `${day}/${month}/${year.slice(-2)}`;

          table += `<tr>
                <td>${json[i].animal.nome}</td>
                <td>${json[i].medicamento.nome}</td>
                <td>${dataFormatada}</td>
                <td>${json[i].status}</td>
                <!--
                <td>
                  <button type="button" class="btn btn-sm btn-warning" onclick="editarAgendamento(${json[i].codAgendarMedicamento})"><i class="bi bi-pencil-square"></i></button>
                </td>
                -->

                <td>
                  <button class="btn btn-sm btn-danger" onclick="excluirAgendamento(${json[i].codAgendarMedicamento})">Excluir</button>
                </td>
              </tr>`;
        }
        table+= "</table>";
        resultado.innerHTML = table;
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







//SCRIPT NOTIFICAÇÕES


// Função que será chamada ao clicar no botão de notificações
document.getElementById('notificacoesButton').addEventListener('click', function () {
  carregarNotificacoes(); // Carregar notificações ao abrir o modal
});

// Função que carrega as notificações
function carregarNotificacoes() {
  const listaNotificacoes = document.getElementById("listaNotificacoes");
  const notificacoesCount = document.getElementById("notificacoesCount"); // Contador de notificações no ícone

  const url = "http://localhost:8080/apis/agendar-medicamento/buscar/%20"; // espaço codificado como %20 para simular "sem filtro"

  fetch(url, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.text(); // Recebe como texto
    })
    .then(function (text) {
      var json = JSON.parse(text); // Converte para JSON

      // Obter data atual
      const hoje = new Date();
      let notificacoes = [];

      // Filtrar agendamentos com datas próximas (digamos, até 7 dias de antecedência)
      json.forEach(agendamento => {
        if (!agendamento.status) {
          //console.log('Agendamento carregado:', agendamento);
          const dataAplicacao = new Date(agendamento.dataAplicacao); // Data do agendamento
          const diffTime = dataAplicacao - hoje; // Diferença em milissegundos
          const diffDays = diffTime / (1000 * 3600 * 24); // Convertendo para dias

          // Verificar se a data do agendamento é próxima (dentro de 7 dias)
          if (diffDays >= 0 && diffDays <= 2) {
            // Adicionar a notificação
            const notificacao = {
              animal: agendamento.animal.nome,
              medicamento: agendamento.medicamento.nome,
              diasRestantes: Math.ceil(diffDays),
              id: agendamento.codAgendarMedicamento,
              animalId: agendamento.animal.codAnimal,
              medicamentoId: agendamento.medicamento.codTipoMedicamento, // <--- corrigido
              dataAplicacao: agendamento.dataAplicacao // <--- adicionado
            };


            notificacoes.push(notificacao);
          }
        }
      });

      // Atualizar o contador de notificações
      notificacoesCount.textContent = notificacoes.length;

      // Exibir as notificações no modal
      if (notificacoes.length > 0) {
        let notificacaoHTML = "";
        notificacoes.forEach(notificacao => {
          notificacaoHTML += `<div class="alert alert-info d-flex justify-content-between">
        <div>
           O animal <b class="animal" data-id="${notificacao.animalId}">${notificacao.animal}</b> precisa receber o medicamento 
          <b class="medicamento" data-id="${notificacao.medicamentoId}">${notificacao.medicamento}</b> em <b class="diasRestantes">${notificacao.diasRestantes} dia(s)</b>.
          <span class="data-aplicacao" style="display:none">${notificacao.dataAplicacao}</span>
        </div>
        <button class="btn btn-sm btn-success" onclick="marcarComoLido(${notificacao.id}, this)">Marcar como lido</button>
      </div>`;

        });
        listaNotificacoes.innerHTML = notificacaoHTML;
      } else {
        listaNotificacoes.innerHTML = "<p>Não há agendamentos próximos.</p>";
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar notificações:", error);
    });
}

function marcarComoLido(id, botao) {
  const notification = botao.closest('.alert');
  notification.style.backgroundColor = '#e0e0e0';
  botao.disabled = true;
  botao.innerHTML = 'Lido';

  // Capturar os IDs do animal e medicamento
  const animalId = notification.querySelector('.animal').dataset.id;
  const medicamentoId = notification.querySelector('.medicamento').dataset.id;
  const dataAplicacao = notification.querySelector('.data-aplicacao').textContent;

  // Verifica se os IDs estão definidos corretamente
  if (animalId && medicamentoId) {
    // Chama a função de alteração com os valores corretos
    alterarAgendamento(id, { codAnimal: animalId }, { cod: medicamentoId }, dataAplicacao, true);
  } else {
    console.error('IDs inválidos: animalId ou medicamentoId estão indefinidos');
  }
}