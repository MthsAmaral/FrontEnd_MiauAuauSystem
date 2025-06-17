const API_BASE_URL = "http://localhost:8080/apis/plano-contas-referencial";

// Cadastrar ou editar
function cadPlanoContasReferencial() {
  const token = localStorage.getItem("token");
  const form = document.getElementById("fPlanoContasReferencial");
  const formData = new FormData(form);
  const id = document.getElementById("cod").value;

  if (id) {
    editarPlanoContasReferencial();
  } else {
    fetch(`${API_BASE_URL}/gravar`, {
      method: "POST",
      body: new URLSearchParams(formData),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'Authorization': token 
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao cadastrar");
        return response.json();
      })
      .then((json) => {
        Swal.fire({
          icon: "success",
          title: "Plano Contas Referencial Gravado com Sucesso",
          timer: 1500,
          timerProgressBar: true,
        }).then(() => {
          form.reset();
          window.location.href = "../TelasGerenciar/gerenPlanoContasReferencial.html";
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Erro ao cadastrar!!",
          timer: 1500,
          timerProgressBar: true,
        });
        console.error("Erro ao CADASTRAR dados:", error);
      });
  }
}

// Buscar lista (com filtro opcional)
function buscarPlanoContasReferencial(filtro) {
  const token = localStorage.getItem("token");
  let url = `${API_BASE_URL}/buscar`;
  if (filtro && filtro.length > 0) url += `/${encodeURIComponent(filtro)}`;
  else url += "/%20";

  fetch(url, { method: "GET",
              headers: { 'Authorization': token }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar lista");
      return response.json();
    })
    .then((json) => {
      let table = "";
      json.forEach((item) => {
        table += `
          <tr>
            <td>${item.cod}</td>
            <td>${item.descricao}</td>
            <td>${item.natureza}</td>
            <td>${item.classificacao}</td>
            <td>
              <button type="button" class="btn btn-sm btn-warning" onclick="editarPlanoContasReferencialID(${item.cod})">
                <i class="bi bi-pencil-square"></i>
              </button>
            </td>
            <td>
              <button type="button" class="btn btn-sm btn-danger" onclick="excluirPlanoContasReferencial(${item.cod})">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          </tr>`;
      });
      document.getElementById("resultado").innerHTML = table;
    })
    .catch((error) => {
      console.error("Erro ao buscar lista:", error);
    });
}

// Buscar com filtro via input
function buscarPlanoContasReferencialFiltro() {
  const filtro = document.getElementById("filtro").value;
  buscarPlanoContasReferencial(filtro);
}

// Buscar por ID para edição
function buscarPlanoContasReferencialID(id) {
  const token = localStorage.getItem("token");
  fetch(`${API_BASE_URL}/buscar-id/${id}`, { method: "GET",
                                            headers: { 'Authorization': token }
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao buscar por ID");
      return response.json();
    })
    .then((json) => {
      document.getElementById("cod").value = id;
      document.getElementById("descricao").value = json.descricao;
      document.getElementById("natureza").value = json.natureza;
      document.getElementById("classificacao").value = json.classificacao;
    })
    .catch((error) => {
      console.error("Erro ao buscar por ID:", error);
    });
}

// Exclusão com confirmação
function excluirPlanoContasReferencial(id) {
  const token = localStorage.getItem("token");
  Swal.fire({
    title: "Você tem certeza?",
    text: "Você não poderá reverter isso!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Apagar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`${API_BASE_URL}/excluir/${id}`, { method: "DELETE",
                                              headers: { 'Authorization': token }
      })
        .then((response) => {
          if (!response.ok) throw new Error("Erro ao excluir");
          return response.json();
        })
        .then((json) => {
          console.log("Resposta do servidor:", json);
          sessionStorage.setItem("pcrExcluido", "true");
          window.location.reload();
        })
        .catch((error) => {
          sessionStorage.setItem("pcrExcluido", "false");
          console.error("Erro ao excluir:", error);
        });
    }
  });
}

// Editar registro
function editarPlanoContasReferencial() {
  const token = localStorage.getItem("token");
  const form = document.getElementById("fPlanoContasReferencial");
  const formData = new FormData(form);

  fetch(`${API_BASE_URL}/atualizar`, {
    method: "PUT",
    body: new URLSearchParams(formData),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': token
    },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Erro ao atualizar");
      return response.json();
    })
    .then((json) => {
      sessionStorage.setItem("pcrAlterado", "true");
      window.location.href = "../TelasGerenciar/gerenPlanoContasReferencial.html";
    })
    .catch((error) => {
      sessionStorage.setItem("pcrAlterado", "false");
      console.error("Erro ao atualizar:", error);
      window.location.href = "../TelasGerenciar/gerenPlanoContasReferencial.html";
    });
}

// Redirecionar para edição na tela de cadastro
function editarPlanoContasReferencialID(id) {
  window.location.href = `../TelasCadastros/cadPlanoContasReferencial.html?cod=${id}`;
}
