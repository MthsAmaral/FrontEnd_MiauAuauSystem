function buscarDoacoes() {
    const doacoes = [
      {
        nome: "Ana Silva",
        email: "ana.silva@email.com",
        telefone: "(11) 98765-4321",
        valor: "R$ 100,00",
        status: "Pendente"
      },
      {
        nome: "Carlos Mendes",
        email: "carlos.m@email.com",
        telefone: "(21) 99876-5432",
        valor: "R$ 250,00",
        status: "Pendente"
      },
      {
        nome: "Mariana Souza",
        email: "mariana@email.com",
        telefone: "(31) 91234-5678",
        valor: "R$ 80,00",
        status: "Pendente"
      }
    ];
  
    const tbody = document.getElementById("tabela-doacoes");
    tbody.innerHTML = "";
  
    doacoes.forEach((doacao, index) => {
      const row = `
        <tr>
          <td>${doacao.nome}</td>
          <td>${doacao.email}</td>
          <td>${doacao.telefone}</td>
          <td>${doacao.valor}</td>
          <td>${doacao.status}</td>
          <td>
            <button class="btn btn-secondary btn-sm" onclick="confirmarDoacao(${index})">Confirmar</button>
            <button class="btn btn-secondary btn-sm" onclick="excluirDoacao(${index})">Excluir</button>
          </td>
        </tr>
      `;
      tbody.innerHTML += row;
    });
  }
  
  // Funções fictícias para ações
  function confirmarDoacao(index) {
    alert(`Doação ${index + 1} confirmada!`);
  }
  
  function excluirDoacao(index) {
    if (confirm("Tem certeza que deseja excluir essa doação?")) {
      alert(`Doação ${index + 1} excluída.`);
    }
  }
  