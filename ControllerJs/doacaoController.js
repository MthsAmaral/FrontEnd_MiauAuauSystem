
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

  return data <= hoje;
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
      'Authorization': token,
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
  let filtro = document.getElementById("filtro").value
  const resultado = document.getElementById("resultado");

  if (filtro.length > 0) // busca com filtro
  {
    const url = "http://localhost:8080/apis/adocao/buscar/" + filtro;
    fetch(url, {
      method: 'GET', redirect: "follow", headers: { 'Authorization': token }
    })
      .then((response) => {
        return response.text();
      })
      .then(function (text) {
        var json = JSON.parse(text);

        var table = "<table border='1'>";


        for (let i = 0; i < json.length; i++) 
          {
            const dataOriginal = json[i].data;
            const [year, month, day] = dataOriginal.split('-'); 
            const dataFormatada = `${day}/${month}/${year.slice(-2)}`;  
          table += `<tr>
                        <td>${json[i].codDoacao}</td>
                        <td>${dataFormatada}</td>
                        <td>${json[i].usuario.nome}</td>
                        <td>${json[i].usuario.email}</td>
                        <td>${json[i].usuario.telefone}</td>
                        <td>${json[i].valor}</td>
                        <td>
                        <span class="badge ${json[i].status === 'Aprovada' ? 'bg-success' : 'bg-warning text-dark'} fs-6 p-2">
                          ${json[i].status}
                        </span>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarDoacao(${json[i].codDoacao})"${json[i].status === "Aprovada" ? "disabled" : ""}><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirDoacao(${json[i].codDoacao})"><i class="bi bi-trash"></i></button>
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
    const url = "http://localhost:8080/apis/doacao/buscar/%20";
    fetch(url, {
      method: 'GET', redirect: "follow", headers: { 'Authorization': token }
    })
      .then((response) => {
        return response.text();
      })
      .then(function (text) {
        var json = JSON.parse(text);

        var table = "<table border='1'>";
       
        for (let i = 0; i < json.length; i++) 
          {
          const dataOriginal = json[i].data;
          const [year, month, day] = dataOriginal.split('-'); 
          const dataFormatada = `${day}/${month}/${year.slice(-2)}`; 
          table += `<tr>
                        <td>${json[i].codDoacao}</td>
                        <td>${dataFormatada}</td>
                        <td>${json[i].usuario.nome}</td>
                        <td>${json[i].usuario.email}</td>
                        <td>${json[i].usuario.telefone}</td>
                        <td>${json[i].valor}</td>
                        <td>
                        <span class="badge ${json[i].status === 'Aprovada' ? 'bg-success' : 'bg-warning text-dark'} fs-6 p-2">
                          ${json[i].status}
                        </span>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarDoacao(${json[i].codDoacao})"${json[i].status === "Aprovada" ? "disabled" : ""}><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirDoacao(${json[i].codDoacao})"><i class="bi bi-trash"></i></button>
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
    if (result.isConfirmed) 
    {

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
              if(!response.ok)
                Toast.fire({
                    icon: 'error',
                    title: 'Erro ao Excluir a Doação!',
                  });
              else
              {
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
    headers: { 'Authorization': token }
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
          'Authorization': token,
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
  if (!token) {
    Swal.fire({
      icon: "warning",
      title: "Você precisa estar logado",
      confirmButtonText: "Ir para login"
    }).then(() => {
      window.location.href = "./telaLogin.html";
    });
    return;
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const cod_usuario = payload.cod_usuario || payload.cod || payload.id;

  fetch(`http://localhost:8080/apis/doacao/buscarPorUsuario/${cod_usuario}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro na busca das doações.");
      }
      return response.json();
    })
    .then(doacoes => {
      const tabela = document.getElementById("resultadoDoacao");
      tabela.innerHTML = "";

      if (!doacoes || doacoes.length === 0) {
        tabela.innerHTML = `
            <tr>
              <td colspan="5" style="text-align:center;">Nenhuma doação encontrada.</td>
            </tr>`;
        return;
      }

      doacoes.forEach(doacao => {
        const linha = `
            <tr>
              <td>${doacao.codDoacao}</td>
              <td>${formatarData(doacao.data)}</td>
              <td>R$ ${parseFloat(doacao.valor).toFixed(2)}</td>
              <td>${doacao.status}</td>
              <td>
                <button class="btn btn-danger btn-sm" onclick="excluirDoacao(${doacao.codDoacao})">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>`;
        tabela.innerHTML += linha;
      });
    })
    .catch(error => {
      console.error(error);
      Swal.fire("Erro", "Não foi possível carregar as doações.", "error");
    });
}

function formatarData(data) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}
