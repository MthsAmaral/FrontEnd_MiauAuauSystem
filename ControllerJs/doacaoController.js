
function limparForm() {
  const fdados = document.getElementById("fdoacao");
  fdados.cod_usuario.value = "";
  fdados.data.value = "";
  fdados.valor.value = "";
  fdados.status.value = "Pendente";
}

function validarData(dataString) {
  const regexData = /^\d{4}-\d{2}-\d{2}$/;
  if (!regexData.test(dataString)) {
    return false;
  }

  const [ano, mes, dia] = dataString.split("-").map(Number);
  const data = new Date(ano, mes - 1, dia);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);

  // ✅ Só permite se a data for exatamente hoje
  return data.getTime() === hoje.getTime();
}



function validarCampos() {
  const status = document.getElementById("status").value;
  const data = document.getElementById("data").value;
  const valor = document.getElementById("valor").value;

  if (status && data && valor > 0) {
    if (validarData(data)) {
      cadDoacao();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data Inválida",
        timer: 1500,
        timerProgressBar: true
      });
    }
  } else {
    Swal.fire({
      icon: "warning",
      title: "Preencha todos os campos corretamente!",
      timer: 1500,
      timerProgressBar: true
    });
  }
}

function cadDoacao() {
  const token = localStorage.getItem("token");
  if (!token) {
    Swal.fire({
      icon: "error",
      title: "Você precisa estar logado para doar!"
    });
    return;
  }

  const cod = document.getElementById("codDoacao").value;
  const url = cod
    ? "http://localhost:8080/apis/doacao/atualizar"
    : "http://localhost:8080/apis/doacao/gravar";

  const formData = new URLSearchParams();
  formData.append("codDoacao", cod);
  formData.append("cod_usuario", document.getElementById("cod_usuario").value);
  formData.append("status", document.getElementById("status").value);
  formData.append("data", document.getElementById("data").value);
  formData.append("valor", document.getElementById("valor").value);

  fetch(url, {
    method: cod ? "PUT" : "POST",
    headers: {
      'Authorization': token,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  })
    .then(response => {
      if (!response.ok) throw new Error("Erro na operação!");
      return response.json();
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: cod ? "Doação atualizada!" : "Doação cadastrada com sucesso!",
        timer: 1500,
        showConfirmButton: false
      });

      setTimeout(() => {
        window.location.href = "./TelasFundamentais/telaPagamento.html";
      }, 1500); // redireciona após o toast

      limparForm();
      fecharModal();
    })
    .catch(error => {
      console.error("Erro:", error);
      Swal.fire({
        icon: "error",
        title: "Erro na operação!",
        text: error.message
      });
    });
}

function buscarDoacao() {
  const token = localStorage.getItem("token");
  const filtro = document.getElementById("filtro").value.trim();
  const resultado = document.getElementById("resultado");

  const url = filtro.length > 0
    ? "http://localhost:8080/apis/doacao/buscar/" + filtro
    : "http://localhost:8080/apis/doacao/buscar/%20";

  fetch(url, {
    method: 'GET',
    headers: { 'Authorization': token }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao buscar dados");
      }
      return response.json();
    })
    .then(json => {
      let table = "";

      if (json.length === 0) {
        table = `<tr><td colspan="9" style="text-align:center;">Nenhuma doação encontrada.</td></tr>`;
      }

      json.forEach(doacao => {
        const [ano, mes, dia] = doacao.data.split('-');
        const dataFormatada = `${dia}/${mes}/${ano.slice(-2)}`;

        table += `
          <tr>
            <td>${doacao.codDoacao}</td>
            <td>${dataFormatada}</td>
            <td>${doacao.usuario.nome}</td>
            <td>${doacao.usuario.email}</td>
            <td>${doacao.usuario.telefone}</td>
            <td>R$ ${doacao.valor}</td>
            <td>
              <span class="badge ${doacao.status === 'Aprovada' ? 'bg-success' : doacao.status === 'Cancelada' ? 'bg-danger' : 'bg-warning text-dark'} fs-6 p-2">
                ${doacao.status}
              </span>
            </td>
            <td>
              <button type="button" class="btn btn-sm btn-warning" onclick="editarDoacao(${doacao.codDoacao})"
                ${doacao.status === "Aprovada" ? "disabled" : ""}>
                <i class="bi bi-pencil-square"></i>
              </button>
            </td>
            <td>
              <button type="button" class="btn btn-sm btn-danger" onclick="excluirDoacao(${doacao.codDoacao})">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>
        `;
      });

      resultado.innerHTML = table;
    })
    .catch(error => {
      console.error("Erro ao buscar doações:", error);
    });
}


function excluirDoacao(id) {
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

      const URL = "http://localhost:8080/apis/doacao/excluir/" + id;

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
              title: 'Erro ao Excluir a Doação!',
            });
          else {
            sessionStorage.setItem('doacaoApagada', 'true');
            window.location.reload();
          }

          return response.json();
        })
        .then((json) => {

        })
        .catch((error) => {
          console.error("Erro ao excluir a doação:", error);
        });

    }
  });

}

function confirmarDoacao(id) {
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8080/apis/doacao/buscar-id/${id}`, {
    method: "GET",
    headers: { 'Authorization': token }
  })
    .then(response => response.json())
    .then(doacao => {
      const formData = new URLSearchParams();
      formData.append("codDoacao", doacao.codDoacao);
      formData.append("cod_usuario", doacao.usuario.cod);
      formData.append("status", "Aprovada");
      formData.append("data", doacao.data);
      formData.append("valor", doacao.valor);

      return fetch("http://localhost:8080/apis/doacao/atualizar", {
        method: "PUT",
        headers: {
          'Authorization': token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });
    })
    .then(response => {
      if (!response.ok) throw new Error("Erro ao confirmar doação!");
      Swal.fire({
        icon: "success",
        title: "Doação confirmada com sucesso!",
        timer: 1500,
        showConfirmButton: false
      });
      window.location.reload();
    })
    .catch(error => {
      console.error("Erro:", error);
      Swal.fire("Erro!", error.message, "error");
    });
}

function obterPayloadToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null; // Verifica se existe a parte do payload

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload;
  } catch (e) {
    console.error("Erro ao decodificar o token:", e);
    return null;
  }
}

function buscarDoacoesPeloUsuId() {
  const token = localStorage.getItem("token");
  const payload = obterPayloadToken();

  if (!token || !payload) {
    Swal.fire({
      icon: "warning",
      title: "Você precisa estar logado",
      confirmButtonText: "Ir para login"
    }).then(() => {
      window.location.href = "./telaLogin.html";
    });
    return;
  }

  const cod_usuario = payload.cod_usuario;
  const filtro = document.getElementById("filtro").value.trim().toLowerCase();

  fetch(`http://localhost:8080/apis/doacao/buscarPorUsuario/${cod_usuario}`, {
    method: 'GET',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na busca das doações.");
      }
      return response.json();
    })
    .then(doacoes => {
      const tabela = document.getElementById("resultadoDoacao");
      tabela.innerHTML = "";

      // Se não encontrar nada
      if (!doacoes || doacoes.length === 0) {
        tabela.innerHTML = `
            <tr>
              <td colspan="4" style="text-align:center;">Nenhuma doação encontrada.</td>
            </tr>`;
        return;
      }

      // Aplica o filtro por data ou valor
      const resultadoFiltrado = doacoes.filter(doacao => {
        const data = doacao.data.toLowerCase();
        const valor = doacao.valor.toString();
        return (
          data.includes(filtro) ||
          valor.includes(filtro)
        );
      });

      if (resultadoFiltrado.length === 0) {
        tabela.innerHTML = `
            <tr>
              <td colspan="4" style="text-align:center;">Nenhuma doação encontrada para esse filtro.</td>
            </tr>`;
        return;
      }

      resultadoFiltrado.forEach(doacao => {
        const linha = `
            <tr>
              <td>${doacao.codDoacao}</td>
              <td>${doacao.data}</td>
              <td>R$ ${parseFloat(doacao.valor).toFixed(2)}</td>
              <td>${doacao.status}</td>
            </tr>`;
        tabela.innerHTML += linha;
      });
    })
    .catch(error => {
      //console.error(error);
      //Swal.fire("Erro", "Não foi possível carregar as doações.", "error");
    });
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
