let animaisSelecionadosTemp = []; // Armazena seleção temporária até confirmar
let animaisSelecionados = [];
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

function validarData(dataString) {
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
  ) {
    return false;
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);

  if (data <= hoje) {
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
  else {
    if (validarData(dataAplicacao))
      gravarAgendamento();
    else {
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
  const form = document.getElementById("formAgendamento");
  const codAgendamento = form.dataset.id;
  const dataAplicacao = document.getElementById("dataAplicacao").value;

  if (!medicamentoSelecionado || !medicamentoSelecionado.cod) {
    console.error("Medicamento não selecionado ou inválido.");
  }
  else {
    if (!animaisSelecionados || animaisSelecionados.length === 0) {
      console.error("Nenhum animal selecionado.");
    }
    else {
      if (codAgendamento) {
        // Atualizar (um único agendamento)
        const formData = new FormData();
        formData.append("codAgendarMedicamento", codAgendamento);
        formData.append("animal", animaisSelecionados[0].codAnimal); // apenas o primeiro
        formData.append("medicamento", medicamentoSelecionado.cod);
        formData.append("dataAplicacao", dataAplicacao);

        const statusSelect = document.getElementById("statusSelect");
        formData.append("status", statusSelect.value); // sobrescreve status

        fetch("http://localhost:8080/apis/agendar-medicamento/atualizar", {
          method: "PUT",
          body: formData
        })
          .then(response => {
            if (!response.ok) {
              sessionStorage.setItem('agendamentoAlterado', 'false');
            } else {
              sessionStorage.setItem('agendamentoAlterado', 'true');
              window.location.reload();
            }
            return response.json();
          })
          .catch(error => {
            console.error('Erro ao atualizar agendamento:', error);
          });

      } else {
        // Criar novo (um por animal)
        const promessas = animaisSelecionados.map(animal => {
          const formData = new FormData();
          formData.append("animal", animal.codAnimal);
          formData.append("medicamento", medicamentoSelecionado.cod);
          formData.append("dataAplicacao", dataAplicacao);
          formData.append("status", "false");

          return fetch("http://localhost:8080/apis/agendar-medicamento/gravar", {
            method: "POST",
            body: formData
          });
        });

        Promise.all(promessas)
          .then(responses => {
            const todasOk = responses.every(r => r.ok);
            sessionStorage.setItem('agendamentoGravado', todasOk ? 'true' : 'false');
            window.location.reload();
          })
          .catch(error => {
            console.error('Erro ao gravar agendamentos:', error);
          });
      }
    }
  }
}

function carregarAgendamentos() {
  let filtro = document.getElementById("filtroAgendamento").value.trim();
  const resultado = document.getElementById("resultado");

  const url = "http://localhost:8080/apis/agendar-medicamento/buscar/" +
    (filtro.length > 0 ? encodeURIComponent(filtro) : "%20");

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
        resultado.innerHTML = "<p>Nenhum agendamento encontrado.</p>";
      } else {
        let table = "<table class='table table-bordered'>";

        json.forEach(agendamento => {
          const [year, month, day] = agendamento.dataAplicacao.split("-");
          const dataFormatada = `${day}/${month}/${year.slice(-2)}`;

          table += `
          <tr>
            <td>${agendamento.animal.nome}</td>
            <td>${agendamento.medicamento.nome}</td>
            <td>${dataFormatada}</td>
            <td>${agendamento.status ? "Aplicado" : "Pendente"}</td>
            <td>
              <button type="button" class="btn btn-sm btn-warning" onclick="editarAgendamento(${agendamento.codAgendarMedicamento})">
                <i class="bi bi-pencil-square"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="excluirAgendamento(${agendamento.codAgendarMedicamento})">
                Excluir
              </button>
            </td>
          </tr>
        `;
        });
        table += "</table>";
        resultado.innerHTML = table;
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar agendamentos:", error);
      resultado.innerHTML = "<p class='text-danger'>Erro ao buscar agendamentos.</p>";
    });
}


function editarAgendamento(codAgendarMedicamento) {
  fetch(`http://localhost:8080/apis/agendar-medicamento/buscar-id/${codAgendarMedicamento}`)
    .then(response => {
      if (!response.ok) {
        sessionStorage.setItem('agendamentoAlterado', 'false');
      } else {
        sessionStorage.setItem('agendamentoAlterado', 'true');
      }
      return response.json();
    })
    .then(agendamento => {
      //console.log(agendamento);

      // Preenche o form diretamente na tela
      document.getElementById("formAgendamento").dataset.id = codAgendarMedicamento;
      document.getElementById("dataAplicacao").value = agendamento.dataAplicacao;

      selecionarAnimal(agendamento.animal);
      selecionarMedicamento(agendamento.medicamento);

      // Exibir campo de status
      const statusContainer = document.getElementById("statusContainer");
      const statusSelect = document.getElementById("statusSelect");
      statusContainer.classList.remove("d-none");
      statusSelect.value = agendamento.status.toString();

      // Armazenar status como fallback
      statusAtualAgendamento = agendamento.status;
    })
    .catch(error => {
      console.error(error.message);
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
    if (result.isConfirmed) {
      const URL = "http://localhost:8080/apis/agendar-medicamento/excluir/" + id;

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
              title: 'Erro ao Excluir Agendamento!',
            });
          else {
            sessionStorage.setItem('agendamentoApagado', 'true');
            window.location.reload();
          }
        })
        .then((json) => {

        })
        .catch((error) => {
          console.error("Erro ao excluir o agendamento:", error);
        })
    }
  });

}




//MODAL COM LISTA 

//busca animais
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

          const isSelecionado = animaisSelecionados.some(a => a.codAnimal === animal.codAnimal);

          col.innerHTML = `
            <div class="card card-select ${isSelecionado ? 'border-primary' : ''}" data-animal-id="${animal.codAnimal}">
              <img src="data:image/jpeg;base64,${animal.imagemBase64}" class="card-img-top" />
              <div class="card-body">
                <h5 class="card-title">${animal.nome}</h5>
                <p class="card-text">Raça: ${animal.raca}<br>Sexo: ${animal.sexo}</p>
              </div>
            </div>
          `;

          const card = col.querySelector('.card-select');

          card.addEventListener('click', () => {
            const index = animaisSelecionadosTemp.findIndex(a => a.codAnimal === animal.codAnimal);

            if (index === -1) {
              animaisSelecionadosTemp.push(animal);
              card.classList.add("border-primary");
            } else {
              animaisSelecionadosTemp.splice(index, 1);
              card.classList.remove("border-primary");
            }
          });

          container.appendChild(col);
        });
      }
    })
    .catch(error => console.error(error.message));
}

function confirmarSelecaoAnimais() {
  animaisSelecionadosTemp.forEach(animal => {
    if (!animaisSelecionados.some(a => a.codAnimal === animal.codAnimal)) {
      animaisSelecionados.push(animal);
    }
  });
  animaisSelecionadosTemp = [];
  renderizarAnimaisSelecionados();
  const modal = bootstrap.Modal.getInstance(document.getElementById("modalAnimais"));
  modal.hide();
}
function voltarSelecaoAnimais() {
  animaisSelecionadosTemp = [];
  carregarAnimais();  // Recarregar os cards sem seleção
  renderizarAnimaisSelecionados();  // Atualizar a lista de selecionados
}



function carregarMedicamentos() {
  const container = document.querySelector("#modalMedicamentos .modal-body");
  container.innerHTML = "";

  fetch("http://localhost:8080/apis/tipo-medicamento/buscar/%20")
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao carregar medicamentos.");
      }
      return response.json();
    })
    .then(lista => {
      //console.log(lista);
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
    })
    .catch(error => {
      console.error(error.message);
    });
}




//MOSTRAR ELEMENTOS ESCOLHIDOS NO MODAL ACIMA

//medicamento
function selecionarMedicamento(med) {
  // Normaliza campos para garantir consistência
  med.cod = med.cod || med.codTipoMedicamento;
  med.forma = med.forma || med.formaFarmaceutica;

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
  if (!animaisSelecionados.some(a => a.codAnimal === animal.codAnimal)) {
    animaisSelecionados.push(animal);
  }
  renderizarAnimaisSelecionados();
}
function removerAnimal(codAnimal) {
  animaisSelecionados = animaisSelecionados.filter(a => a.codAnimal !== codAnimal);
  renderizarAnimaisSelecionados();
  carregarAnimais();  // Recarregar os animais para atualizar a seleção no modal
}
function renderizarAnimaisSelecionados() {
  const div = document.getElementById("animalSelecionado");


  if (animaisSelecionados.length === 0) {
    div.classList.add("d-none");
    div.innerHTML = "";
  }
  else {
    div.innerHTML = animaisSelecionados.map(a => `
      <div class="d-flex justify-content-between align-items-center p-3 mb-3 rounded shadow-sm bg-white">
        <div class="d-flex align-items-center gap-3">
          <img src="data:image/jpeg;base64,${a.imagemBase64}" width="90" height="90" class="rounded object-fit-cover" style="object-fit: cover;">
          <div style="font-size: 0.95rem;">
            <strong style="font-size: 1.05rem;">${a.nome}</strong><br>
            Raça: ${a.raca}<br>
            Sexo: ${a.sexo}
          </div>
        </div>
        <div class="d-flex flex-column align-items-end">
          <button class="btn btn-sm btn-outline-danger" onclick="removerAnimal(${a.codAnimal})">Remover</button>
        </div>
      </div>
    `).join("");

    div.classList.remove("d-none");
  }
}








//SCRIPT NOTIFICAÇÕES


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
    atualizarStatusAgendamento(id, true);
  } else {
    console.error('IDs inválidos: animalId ou medicamentoId estão indefinidos');
  }
}

function atualizarStatusAgendamento(id, novoStatus) {
  fetch(`http://localhost:8080/apis/agendar-medicamento/buscar-id/${id}`)
    .then(response => response.json())
    .then(agendamento => {
      const formData = new FormData();
      formData.append("codAgendarMedicamento", agendamento.codAgendarMedicamento);
      formData.append("animal", agendamento.animal.codAnimal);
      formData.append("medicamento", agendamento.medicamento.cod || agendamento.medicamento.codTipoMedicamento);
      formData.append("dataAplicacao", agendamento.dataAplicacao);
      formData.append("status", novoStatus);

      // Log para debug
      /*for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }*/

      return fetch("http://localhost:8080/apis/agendar-medicamento/atualizar", {
        method: "PUT",
        body: formData
      });
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao atualizar o agendamento.");
      }
      console.log("Agendamento atualizado com sucesso.");
      window.location.reload();

    })
    .catch(error => {
      console.error("Erro ao marcar como lido:", error);
    });
}


