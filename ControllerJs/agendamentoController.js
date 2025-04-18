let animalSelecionado = null;
let medicamentoSelecionado = null;
let agendamentos = [];

function selecionarAnimal(animal) {
  animalSelecionado = animal;
  const div = document.getElementById("animalSelecionado");
  div.classList.remove("d-none");
  div.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          <img src="${animal.imagem}" alt="Animal" width="60" height="60" class="rounded"/>
          <div>
            <strong>${animal.nome}</strong><br/>
            Raça: ${animal.raca} | Sexo: ${animal.sexo}
          </div>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removerAnimal()">Remover</button>
      </div>
    `;
}

function removerAnimal() {
  animalSelecionado = null;
  document.getElementById("animalSelecionado").classList.add("d-none");
  document.getElementById("animalSelecionado").innerHTML = "";
}

function selecionarMedicamento(med) {
  medicamentoSelecionado = med;
  const div = document.getElementById("medicamentoSelecionado");
  div.classList.remove("d-none");
  div.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
        <div>
          <strong>${med.nome}</strong><br/>
          Forma: ${med.forma}<br/>
          ${med.descricao}
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removerMedicamento()">Remover</button>
      </div>
    `;
}

function removerMedicamento() {
  medicamentoSelecionado = null;
  document.getElementById("medicamentoSelecionado").classList.add("d-none");
  document.getElementById("medicamentoSelecionado").innerHTML = "";
}

function confirmarAgendamento() {
  const periodo = parseInt(document.getElementById("periodo").value);
  const tipo = document.getElementById("tipoPeriodo").value;

  if (!animalSelecionado || !medicamentoSelecionado || isNaN(periodo) || periodo <= 0) {
    alert("Preencha todos os campos antes de confirmar.");
    return;
  }

  const agora = new Date();
  const proximaAplicacao = new Date(agora);

  if (tipo === "dias") {
    proximaAplicacao.setDate(agora.getDate() + periodo);
  } else {
    proximaAplicacao.setHours(agora.getHours() + periodo);
  }

  const agendamento = {
    animal: animalSelecionado.nome,
    medicamento: medicamentoSelecionado.nome,
    proximaAplicacao: proximaAplicacao.toLocaleString(),
  };

  agendamentos.push(agendamento);
  exibirAgendamentos();
}

function exibirAgendamentos() {
  const tabela = document.getElementById("tabelaAgendamentos").getElementsByTagName("tbody")[0];
  tabela.innerHTML = ""; // Limpar tabela existente

  agendamentos.forEach((agendamento, index) => {
    const row = tabela.insertRow();
    row.innerHTML = `
        <td>${agendamento.animal}</td>
        <td>${agendamento.medicamento}</td>
        <td>${agendamento.proximaAplicacao}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="excluirAgendamento(${index})">Excluir</button></td>
      `;
  });
}

function excluirAgendamento(index) {
  agendamentos.splice(index, 1); // Remove o agendamento
  exibirAgendamentos(); // Atualiza a tabela
}
