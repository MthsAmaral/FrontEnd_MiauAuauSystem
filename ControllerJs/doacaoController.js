function limparForm() {
  var fdados = document.getElementById("fdoacao");
  fdados.cod_usuario.value = "";
  fdados.data.value = "";
  fdados.valor.value = 0;
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
  
    if (data > hoje)
    {
      return false; 
    }
  
    return true; 
}

function validarCampos() {
  const cod = document.getElementById("cod_usuario").value;
  const status = document.getElementById("status").value;
  const data = document.getElementById("data").value;
  const valor = document.getElementById("valor").value;
  console.log(cod)
  console.log(status)
  console.log(data)
  console.log(valor)
  if (cod > 0 && status != "" && data != "" && valor > 0) 
  {
      if(validarData(data))
      {
        cadDoacao();
      }
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
  else
  {
    Swal.fire({
      icon: "warning",
      title: "Campo(s) Não Preenchido(s)",
      timer: 1500,
      timerProgressBar: true
    })
  }
  limparForm();
}

function buscarDoacao() {
  let filtro = document.getElementById("filtro").value
  const resultado = document.getElementById("resultado");

  if (filtro.length > 0) // busca com filtro
  {
    const url = "http://localhost:8080/apis/adocao/buscar/" + filtro;
    fetch(url, {
      method: 'GET', redirect: "follow"
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
      method: 'GET', redirect: "follow"
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


function selecionarUsuario(id, doador)
{
  const codUsuario = document.getElementById("cod_usuario");
  const botaoUsuario = document.getElementById("botaoSelecionarUsuario")
  codUsuario.value = id;
  botaoUsuario.textContent =  `Adotante: ${doador}`;
}

function carregarUsuariosModal() {
  const container = document.getElementById("resultadoUsuario");
  container.innerHTML = "";
  const url = "http://localhost:8080/apis/usuario/buscar/%20";

  fetch(url, {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => response.text())
    .then(function (text) {
      const json = JSON.parse(text);

      for (let i = 0; i < json.length; i++) {
        container.innerHTML += `
          <div class="col-md-4 mb-4">
            <div class="card card-select" style="width: 260px; height: 170px;"
              onclick="selecionarUsuario(${json[i].cod}, '${json[i].nome}')"
              data-bs-dismiss="modal">
              <div class="card-body">
                <h5 class="card-title">${json[i].nome}</h5>
                <p class="card-text">
                  <strong>CPF:</strong> ${json[i].cpf}<br>
                  <strong>Email:</strong> ${json[i].email}<br>
                  <strong>Telefone:</strong> ${json[i].telefone}
                </p>
              </div>
            </div>
          </div>
        `;
      }

      if (container.innerHTML === "") {
        container.innerHTML = `<p class="text-center text-muted">Nenhum usuário disponível no momento.</p>`;
      }
    })
    .catch(function (error) {
      console.error("Erro ao carregar usuários:", error);
      container.innerHTML = `<p class="text-center text-danger">Erro ao carregar usuários. Tente novamente.</p>`;
    });
}

function cadDoacao() {

  var fdoacao = document.getElementById("fdoacao");
  var formData = new FormData(fdoacao);
  var cod = document.getElementById("codDoacao").value;
  if (cod) 
  {
      
      const URL = "http://localhost:8080/apis/doacao/atualizar"
      fetch(URL, {
          method: 'PUT', body: formData
      })
          .then((response) => {
            sessionStorage.setItem('doacaoAlterada', 'true');
            fdoacao.reset();
            window.location.href = "../TelasGerenciar/gerenciarDoacoes.html";
            return response.json();
          })
          .then((json) => {
            console.log(json);
          })
          .catch((error) => {
            sessionStorage.setItem('doacaoAlterada', 'false');
            console.error(error);
          })
      
  }
  else 
  {
      const URL = "http://localhost:8080/apis/doacao/gravar"
      fetch(URL, {
          method: 'POST', body: formData
      })
          .then((response) => {
            return response.json();
          })
          .then((json) => {
            console.log(json);
            sessionStorage.setItem('doacaoGravada', 'true');
            fdoacao.reset();
            window.location.href = "../TelasGerenciar/gerenciarDoacoes.html";
          })
          .catch((error) => {
            sessionStorage.setItem('doacaoGravada', 'false');
            console.error(error);
          })
  }
}
function excluirDoacao(id) {

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
              'Content-Type': 'application/json'
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

function editarDoacao(id) {

  window.location.href = "../TelasCadastros/cadDoacao.html?codDoacao=" + id;
}

function buscarDoacaoPeloId(id) {
  const URL = "http://localhost:8080/apis/doacao/buscar-id/" + id;

  fetch(URL, {
      headers: {
          'Accept': 'application/json'
      },
      method: 'GET'
  })
      .then((response) => {
          if (!response.ok) {

              window.location.href = "../TelasGerenciar/gerenDoacao.html";
              throw new Error("Erro ao buscar a doação: " + response.status);
              
          }
          return response.json();
      })
      .then((json) => {
          document.getElementById('codDoacao').value = id;
          document.getElementById('cod_usuario').value = json.usuario.codUsuario;
          document.getElementById('status').value = json.status;
          document.getElementById('data').value = json.data;
          document.getElementById('valor').value =  json.valor;
          const botaoUsuario = document.getElementById("botaoSelecionarUsuario");

          botaoUsuario.textContent =  `Doador: ${json.usuario.nome}`;
      })
      .catch((error) => {
          console.error("Erro ao buscar a doação:", error);
      });

}