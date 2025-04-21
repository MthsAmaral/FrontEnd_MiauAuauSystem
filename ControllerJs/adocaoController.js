function limparForm() {
  var fdados = document.getElementById("fadocao");
  fdados.cod_usuario.value = "";
  fdados.cod_animal.value = "";
  fdados.data.value = "";
  document.getElementById('botaoSelecionarAnimal').textContent = 'Selecionar Animal';
  document.getElementById('botaoSelecionarUsuario').textContent = 'Selecionar Adotante';
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
  const codAnimal = document.getElementById("cod_animal").value;
  const cod = document.getElementById("cod_usuario").value;
  const data = document.getElementById("data").value;
  const status = document.getElementById("status").value;
  console.log(codAnimal)
  console.log(cod)
  console.log(data)
  console.log(status)
  if (codAnimal > 0 && cod > 0 && data != "" && status != "") 
  {
      if(validarData(data))
      {
        cadAdocao();
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

function buscarAnimalAdocao() {

  const container = document.getElementById("resultado");
  container.innerHTML = "";

  const url = "http://localhost:8080/apis/animal/buscar/%20";
  fetch(url, {
    method: 'GET', redirect: "follow"
  })
    .then((response) => {
      return response.text();
    })
    .then(function (text) {
      var json = JSON.parse(text); // Converte a resposta JSON
      for (let i = 0; i < json.length; i++) {
        if (json[i].adotado == 'Não') {
          const dataNascimento = new Date(json[i].dataNascimento);
          const hoje = new Date();

          let diferencaAno = hoje.getFullYear() - dataNascimento.getFullYear();
          if (hoje.getMonth() < dataNascimento.getMonth() || (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())) 
          {
              diferencaAno--;
          }

          let diferencaMes = 0;
          let diferencaDias = 0;

          if (diferencaAno === 0) 
          {
              diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
              if (hoje.getDate() < dataNascimento.getDate()) 
              {
                  diferencaMes--;
              }
              if (diferencaMes < 0) 
              {
                  diferencaMes += 12;
              }

              const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
              diferencaDias = Math.abs(
                  Math.floor((hoje - dataNascimento) / (1000 * 60 * 60 * 24))
              );
          }

          let idade;
          if (diferencaAno > 0) 
          {
              if (diferencaAno > 1)
                  idade = `${diferencaAno} anos`;
              else
                  idade = `${diferencaAno} ano`;
          } 
          else if (diferencaMes > 0)
          {
              if (diferencaMes > 1)
                  idade = `${diferencaMes} meses`;
              else
                  idade = `${diferencaMes} mes`;
          } 
          else if (diferencaDias > 0) 
          {
              if (diferencaDias > 1)
                  idade = `${diferencaDias} dias`;
              else
                  idade = `${diferencaDias} dia`;
          } else 
          {
              idade = "Recém-nascido";
          }
          container.innerHTML += `
          <div class="card mb-3 shadow-sm" style="border-radius: 15px;">
          <div class="row g-0">
            <div class="col-md-3 d-flex align-items-center justify-content-center p-2">
              <img src="data:image/jpeg;base64,${json[i].imagemBase64}" class="img-fluid rounded"  alt="Foto do Animal">
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <h5 class="card-title"><strong>Nome:</strong> ${json[i].nome}</h5>
                <p class="card-text mb-1"><strong>Sexo:</strong> ${json[i].sexo}</p>
                <p class="card-text mb-1"><strong>Castrado:</strong> ${json[i].castrado}</p>
                <p class="card-text mb-1"><strong>Raça:</strong> ${json[i].raca}</p>
                <p class="card-text mb-1"><strong>Idade:</strong> ${idade}</p>
                <p class="card-text mb-1"><strong>Peso:</strong> ${json[i].peso} kg</p>
                <button class="btn btn-primary mt-5" onclick="selecionarAnimal('${json[i].codAnimal}')">Quero Adotar</button>
              </div>
            </div>
          </div>
          </div>`
        }

      }
      if (container.innerHTML == "") {
        container.innerHTML = `<p class="text-center text-muted">Nenhum animal disponível para adoção.</p>`;
      }
    })
    .catch(function (error) {
      console.error(error); // Exibe erros, se houver
    });

}
function buscarAdocao() {
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
                        <td>${json[i].codAdocao}</td>
                        <td>${dataFormatada}</td>
                        <td>${json[i].animal.nome}</td>
                        <td>${json[i].usuario.nome}</td>
                        <td>${json[i].usuario.cpf}</td>
                        <td>${json[i].usuario.telefone}</td>
                        <td>${json[i].usuario.email}</td>
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].animal.imagemBase64}" alt="Imagem do animal" style="width: 100px; height: 100px; object-fit: cover;">
                        </td>
                        <td>
                        <span class="badge ${json[i].status === 'Aprovado' ? 'bg-success' : 'bg-warning text-dark'} fs-6 p-2">
                          ${json[i].status}
                        </span>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-info text-white"><i class="bi bi-file-earmark-text"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAnimal(${json[i].codAdocao})"><i class="bi bi-trash"></i></button>
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
    const url = "http://localhost:8080/apis/adocao/buscar/%20";
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
                        <td>${json[i].codAdocao}</td>
                        <td>${dataFormatada}</td>
                        <td>${json[i].animal.nome}</td>
                        <td>${json[i].usuario.nome}</td>
                        <td>${json[i].usuario.cpf}</td>
                        <td>${json[i].usuario.telefone}</td>
                        <td>${json[i].usuario.email}</td>
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].animal.imagemBase64}" alt="Imagem do animal" style="width: 100px; height: 100px; object-fit: cover;">
                        </td>
                        <td>
                        <span class="badge ${json[i].status === 'Aprovado' ? 'bg-success' : 'bg-warning text-dark'} fs-6 p-2">
                          ${json[i].status}
                        </span>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-info text-white"><i class="bi bi-file-earmark-text"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAdocao(${json[i].codAdocao})"><i class="bi bi-trash"></i></button>
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


function selecionarAnimal(id, animal) {
  const codAnimal = document.getElementById("cod_animal");
  codAnimal.value = id;
  const botaoAnimal = document.getElementById("botaoSelecionarAnimal")
  botaoAnimal.textContent =  `Animal: ${animal}`;
}

function carregarAnimaisModal() 
{

  const container = document.getElementById("resultadoAnimal");
  container.innerHTML = "";
  const url = "http://localhost:8080/apis/animal/buscar/%20";

  fetch(url, {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => response.text())
    .then(function (text) {
      const json = JSON.parse(text); 

      for (let i = 0; i < json.length; i++) {
        
        if (json[i].adotado == "Não") 
        {
          container.innerHTML += `
            <div class="col-md-4 mb-3">
              <div class="card card-select"
                onclick="selecionarAnimal(${json[i].codAnimal}, '${json[i].nome}')"
                data-bs-dismiss="modal">
                <img src="data:image/jpeg;base64,${json[i].imagemBase64}" class="card-img-top" alt="Foto de ${json[i].nome}" />
                <div class="card-body">
                  <h5 class="card-title">${json[i].nome}</h5>
                  <p class="card-text">Raça: ${json[i].raca}<br>Sexo: ${json[i].sexo}</p>
                </div>
              </div>
            </div>
          `;
        }
      }

      if (container.innerHTML == "") {
        container.innerHTML = `<p class="text-center text-muted">Nenhum animal disponível para adoção.</p>`;
      }
    })
    .catch(function (error) {
      console.error("Erro ao carregar animais:", error);
      container.innerHTML = `<p class="text-center text-danger">Erro ao carregar animais. Tente novamente.</p>`;
    });
}

function selecionarUsuario(id, adotante)
{
  const codUsuario = document.getElementById("cod_usuario");
  const botaoUsuario = document.getElementById("botaoSelecionarUsuario")
  codUsuario.value = id;
  botaoUsuario.textContent =  `Adotante: ${adotante}`;
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
          <div class="col-md-4 mb-3">
            <div class="card card-select" style="width: 260px;"
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

function cadAdocao() {

  var fadocao = document.getElementById("fadocao");
  var formData = new FormData(fadocao);
  var cod = document.getElementById("codAdocao").value;
  if (cod) 
  {
      
      const URL = "http://localhost:8080/apis/adocao/atualizar"
      fetch(URL, {
          method: 'PUT', body: formData
      })
          .then((response) => {
              return response.json();
          })
          .then((json) => {
              //alert("Adoção Alterada Com Sucesso");
              fadocao.reset();
              window.location.href = "../TelasGerenciar/gerenAdocao.html";
          })
          .catch((error) => console.error(error))
      
  }
  else 
  {
      const URL = "http://localhost:8080/apis/adocao/gravar"
      fetch(URL, {
          method: 'POST', body: formData
      })
          .then((response) => {
            if(!response.ok)
              {
                  sessionStorage.setItem('adocaoGravada', 'false');
              }
              else
              {
                  sessionStorage.setItem('adocaoGravada', 'true');
              }
              fadocao.reset();
              window.location.href = "../TelasGerenciar/gerenAdocao.html";
              return response.json();
          })
          .then((json) => {
            
          })
          .catch((error) => console.error(error))
  }
}
function excluirAdocao(id) {

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

      const URL = "http://localhost:8080/apis/adocao/excluir/" + id;

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
                    title: 'Erro ao Excluir a Adoção!',
                  });
              else
              {
                  window.location.reload();
              } 

              return response.json();
          })
          .then((json) => {
              
          })
          .catch((error) => {
              console.error("Erro ao excluir a adoção:", error);
          });

    }
  });
  
}




