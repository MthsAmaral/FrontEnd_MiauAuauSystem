function limparForm() {
  var fdados = document.getElementById("fadocao");
  fdados.cod_usuario.value = "";
  fdados.cod_animal.value = "";
  fdados.data.value = "";
  document.getElementById('botaoSelecionarAnimal').textContent = 'Selecionar Animal';
  document.getElementById('botaoSelecionarUsuario').textContent = 'Selecionar Adotante';
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

  if (data > hoje) {
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
  if (codAnimal > 0 && cod > 0 && data != "" && status != "") {
    if (validarData(data)) {
      cadAdocao();
    }
    else {
      Swal.fire({
        icon: "warning",
        title: "Data Inválida",
        timer: 1500,
        timerProgressBar: true
      })
    }
  }
  else {
    Swal.fire({
      icon: "warning",
      title: "Campo(s) Não Preenchido(s)",
      timer: 1500,
      timerProgressBar: true
    })
  }

}

function buscarAnimalAdocao() {

  const filtroCor = document.getElementById("filtroCor").value;
  const filtroEspecie = document.getElementById("filtroEspecie").value;
  const filtroSexo = document.getElementById("filtroSexo").value;
  const filtroRaca = document.getElementById("filtroRaca").value;
  
  let filtro = ""; 
  let aux = ""; 
  

  if (filtroCor.length > 0)
  {
    aux = aux + filtroCor;
  } 
  else 
  {
    aux = aux + " "; 
  }
  
  if (filtroEspecie.length > 0)
  {
    if (aux.trim().length > 0) 
    {
      aux = aux + " " + filtroEspecie;
    } 
    else 
    {
      aux = aux + filtroEspecie;
    }
  } 
  else
  {
    aux = aux + " ";
  }
  
  if (filtroSexo.length > 0)
  {
    if (aux.trim().length > 0)
    {
      aux = aux + " " + filtroSexo; 
    } 
    else
    {
      aux = aux + filtroSexo;
    }
  } else {
    aux = aux + " "; 
  }
  
  if (filtroRaca.length > 0) 
  {
    if (aux.trim().length > 0)
    {
      aux = aux + " " + filtroRaca;
    } 
    else 
    {
      aux = aux + filtroRaca;
    }
  } else {
    aux = aux + " "; 
  }
  
  if(aux.trim().length > 0)
  {
    filtro = aux;
  }
  
  const container = document.getElementById("resultado");
  container.innerHTML = "";
  if (filtro.length <= 0) 
  {
    const url = "http://localhost:8080/apis/animal/buscar-filtro/%20";
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
            if (hoje.getMonth() < dataNascimento.getMonth() || (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())) {
              diferencaAno--;
            }

            let diferencaMes = 0;
            let diferencaDias = 0;

            if (diferencaAno === 0) {
              diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
              if (hoje.getDate() < dataNascimento.getDate()) {
                diferencaMes--;
              }
              if (diferencaMes < 0) {
                diferencaMes += 12;
              }

              const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
              diferencaDias = Math.abs(
                Math.floor((hoje - dataNascimento) / (1000 * 60 * 60 * 24))
              );
            }

            let idade;
            if (diferencaAno > 0) {
              if (diferencaAno > 1)
                idade = `${diferencaAno} anos`;
              else
                idade = `${diferencaAno} ano`;
            }
            else if (diferencaMes > 0) {
              if (diferencaMes > 1)
                idade = `${diferencaMes} meses`;
              else
                idade = `${diferencaMes} mes`;
            }
            else if (diferencaDias > 0) {
              if (diferencaDias > 1)
                idade = `${diferencaDias} dias`;
              else
                idade = `${diferencaDias} dia`;
            } else {
              idade = "Recém-nascido";
            }
            container.innerHTML += `
          <div class="card mb-3 shadow-sm" style="border-radius: 15px;">
          <div class="row g-0">
            <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
              <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Foto do Animal">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title"><strong>Nome:</strong> ${json[i].nome}</h5>
                <p class="card-text mb-1"><strong>Sexo:</strong> ${json[i].sexo}</p>
                <p class="card-text mb-1"><strong>Espécie:</strong> ${json[i].especie}</p>
                <p class="card-text mb-1"><strong>Raça:</strong> ${json[i].raca}</p>
                <p class="card-text mb-1"><strong>Cor:</strong> ${json[i].cor}</p>
                <p class="card-text mb-1"><strong>Peso:</strong> ${json[i].peso} kg</p>
                <p class="card-text mb-1"><strong>Idade:</strong> ${idade}</p>
                
                <button class="btn btn-primary mt-5" onclick="exibirForm('${json[i].codAnimal}')">Quero Adotar</button>
              </div>
            </div>
          </div>
          </div>`
          }

        }
        if (container.innerHTML == "") {
          container.innerHTML = `
              <div class="empty-container">
                  <i class="bi bi-emoji-frown" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                  <p>
                      No momento, não encontramos nenhum animal disponível para adoção que atenda aos filtros selecionados.
                  </p>
              </div>
          `;
      }
      
      })
      .catch(function (error) {
        console.error(error); // Exibe erros, se houver
      });
  }
  else {
    const url = "http://localhost:8080/apis/animal/buscar-filtro/"+filtro;
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
            if (hoje.getMonth() < dataNascimento.getMonth() || (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())) {
              diferencaAno--;
            }

            let diferencaMes = 0;
            let diferencaDias = 0;

            if (diferencaAno === 0) {
              diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
              if (hoje.getDate() < dataNascimento.getDate()) {
                diferencaMes--;
              }
              if (diferencaMes < 0) {
                diferencaMes += 12;
              }

              const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
              diferencaDias = Math.abs(
                Math.floor((hoje - dataNascimento) / (1000 * 60 * 60 * 24))
              );
            }

            let idade;
            if (diferencaAno > 0) {
              if (diferencaAno > 1)
                idade = `${diferencaAno} anos`;
              else
                idade = `${diferencaAno} ano`;
            }
            else if (diferencaMes > 0) {
              if (diferencaMes > 1)
                idade = `${diferencaMes} meses`;
              else
                idade = `${diferencaMes} mes`;
            }
            else if (diferencaDias > 0) {
              if (diferencaDias > 1)
                idade = `${diferencaDias} dias`;
              else
                idade = `${diferencaDias} dia`;
            } else {
              idade = "Recém-nascido";
            }
            container.innerHTML += `
            <div class="card mb-3 shadow-sm" style="border-radius: 15px;">
            <div class="row g-0">
              <div class="col-md-4 d-flex align-items-center justify-content-center p-2">
                <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Foto do Animal">
              </div>
              <div class="col-md-8">
                <div class="card-body">
                  <h5 class="card-title"><strong>Nome:</strong> ${json[i].nome}</h5>
                  <p class="card-text mb-1"><strong>Sexo:</strong> ${json[i].sexo}</p>
                  <p class="card-text mb-1"><strong>Espécie:</strong> ${json[i].especie}</p>
                  <p class="card-text mb-1"><strong>Raça:</strong> ${json[i].raca}</p>
                  <p class="card-text mb-1"><strong>Cor:</strong> ${json[i].cor}</p>
                  <p class="card-text mb-1"><strong>Peso:</strong> ${json[i].peso} kg</p>
                  <p class="card-text mb-1"><strong>Idade:</strong> ${idade}</p>
                  
                  <button class="btn btn-primary mt-5" onclick="exibirForm('${json[i].codAnimal}')">Quero Adotar</button>
                </div>
              </div>
            </div>
            </div>`
          }

        }
        if (container.innerHTML == "") {
          container.innerHTML = `
              <div class="empty-container">
                  <i class="bi bi-emoji-frown" style="font-size: 3rem; color: #6c757d; margin-bottom: 1rem;"></i>
                  <p>
                      No momento, não encontramos nenhum animal disponível para adoção que atenda aos filtros selecionados.
                  </p>
              </div>
          `;
      }
      
      
      })
      .catch(function (error) {
        console.error(error); // Exibe erros, se houver
      });
  }

}

function buscarAnimalAdocaoVersaoGabriel() {

  const filtroCor = document.getElementById("filtroCor").value;
  const filtroEspecie = document.getElementById("filtroEspecie").value;
  const filtroSexo = document.getElementById("filtroSexo").value;
  const filtroRaca = document.getElementById("filtroRaca").value;
  
  let filtro = ""; 
  let aux = ""; 
  

  if (filtroCor.length > 0)
  {
    aux = aux + filtroCor;
  } 
  else 
  {
    aux = aux + " "; 
  }
  
  if (filtroEspecie.length > 0)
  {
    if (aux.trim().length > 0) 
    {
      aux = aux + " " + filtroEspecie;
    } 
    else 
    {
      aux = aux + filtroEspecie;
    }
  } 
  else
  {
    aux = aux + " ";
  }
  
  if (filtroSexo.length > 0)
  {
    if (aux.trim().length > 0)
    {
      aux = aux + " " + filtroSexo; 
    } 
    else
    {
      aux = aux + filtroSexo;
    }
  } else {
    aux = aux + " "; 
  }
  
  if (filtroRaca.length > 0) 
  {
    if (aux.trim().length > 0)
    {
      aux = aux + " " + filtroRaca;
    } 
    else 
    {
      aux = aux + filtroRaca;
    }
  } else {
    aux = aux + " "; 
  }
  
  if(aux.trim().length > 0)
  {
    filtro = aux;
  }
  
  const container = document.getElementById("resultado");
  container.innerHTML = "";
  if (filtro.length <= 0) 
  {
    const url = "http://localhost:8080/apis/animal/buscar-filtro/%20";
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
            if (hoje.getMonth() < dataNascimento.getMonth() || (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())) {
              diferencaAno--;
            }

            let diferencaMes = 0;
            let diferencaDias = 0;

            if (diferencaAno === 0) {
              diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
              if (hoje.getDate() < dataNascimento.getDate()) {
                diferencaMes--;
              }
              if (diferencaMes < 0) {
                diferencaMes += 12;
              }

              const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
              diferencaDias = Math.abs(
                Math.floor((hoje - dataNascimento) / (1000 * 60 * 60 * 24))
              );
            }

            let idade;
            if (diferencaAno > 0) {
              if (diferencaAno > 1)
                idade = `${diferencaAno} anos`;
              else
                idade = `${diferencaAno} ano`;
            }
            else if (diferencaMes > 0) {
              if (diferencaMes > 1)
                idade = `${diferencaMes} meses`;
              else
                idade = `${diferencaMes} mes`;
            }
            else if (diferencaDias > 0) {
              if (diferencaDias > 1)
                idade = `${diferencaDias} dias`;
              else
                idade = `${diferencaDias} dia`;
            } else {
              idade = "Recém-nascido";
            }
            container.innerHTML += `
            <div class="animal-card">
            <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Animal" />
            <div class="animal-info">
              <h3>${json[i].nome}</h3>
              <div class="tags">
                <div class="tag"><i class="fas fa-venus-mars"></i> ${json[i].sexo}</div>
                <div class="tag"><i class="fas fa-cut"></i> ${json[i].castrado}</div>
                <div class="tag"><i class="fas fa-birthday-cake"></i> ${idade}</div>
                <div class="tag"><i class="fas fa-weight"></i> ${json[i].peso} kg</div>
              </div>
        
              <div class="details">
                <p><i class="fas fa-paw"></i> <strong>Espécie:</strong> ${json[i].especie}</p>
                <p><i class="fas fa-dna"></i> <strong>Raça:</strong> ${json[i].raca}</p>
                <p><i class="fas fa-palette"></i> <strong>Cor:</strong> ${json[i].cor}</p>
              </div>
        
              <button class="adopt-btn2">Quero Adotar</button>
            </div>
          </div>
            `
          }

        }
        if (container.innerHTML == "") {
          container.innerHTML = `
              <div class="banner_adocao">
          <div class="banner_texto">
    
            <p> No momento, não encontramos nenhum animal disponível para adoção que atenda aos filtros selecionados.</p>
          </div>
          <div class="banner_imagem">
            <img src="../img/animaltriste.jpg" alt="Animal triste" />
          </div>
        </div>
          `;
      }
      
      })
      .catch(function (error) {
        console.error(error); // Exibe erros, se houver
      });
  }
  else {
    const url = "http://localhost:8080/apis/animal/buscar-filtro/"+filtro;
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
            if (hoje.getMonth() < dataNascimento.getMonth() || (hoje.getMonth() === dataNascimento.getMonth() && hoje.getDate() < dataNascimento.getDate())) {
              diferencaAno--;
            }

            let diferencaMes = 0;
            let diferencaDias = 0;

            if (diferencaAno === 0) {
              diferencaMes = hoje.getMonth() - dataNascimento.getMonth();
              if (hoje.getDate() < dataNascimento.getDate()) {
                diferencaMes--;
              }
              if (diferencaMes < 0) {
                diferencaMes += 12;
              }

              const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
              diferencaDias = Math.abs(
                Math.floor((hoje - dataNascimento) / (1000 * 60 * 60 * 24))
              );
            }

            let idade;
            if (diferencaAno > 0) {
              if (diferencaAno > 1)
                idade = `${diferencaAno} anos`;
              else
                idade = `${diferencaAno} ano`;
            }
            else if (diferencaMes > 0) {
              if (diferencaMes > 1)
                idade = `${diferencaMes} meses`;
              else
                idade = `${diferencaMes} mes`;
            }
            else if (diferencaDias > 0) {
              if (diferencaDias > 1)
                idade = `${diferencaDias} dias`;
              else
                idade = `${diferencaDias} dia`;
            } else {
              idade = "Recém-nascido";
            }
            container.innerHTML += `
            <div class="animal-card">
            <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Animal" />
            <div class="animal-info">
              <h3>${json[i].nome}</h3>
              <div class="tags">
                <div class="tag"><i class="fas fa-venus-mars"></i> ${json[i].sexo}</div>
                <div class="tag"><i class="fas fa-cut"></i> ${json[i].castrado}</div>
                <div class="tag"><i class="fas fa-birthday-cake"></i> ${idade}</div>
                <div class="tag"><i class="fas fa-weight"></i> ${json[i].peso} kg</div>
              </div>
        
              <div class="details">
                <p><i class="fas fa-paw"></i> <strong>Espécie:</strong> ${json[i].especie}</p>
                <p><i class="fas fa-dna"></i> <strong>Raça:</strong> ${json[i].raca}</p>
                <p><i class="fas fa-palette"></i> <strong>Cor:</strong> ${json[i].cor}</p>
              </div>
        
              <button class="adopt-btn2">Quero Adotar</button>
            </div>
          </div>`
          }

        }
        if (container.innerHTML == "") {
          container.innerHTML = `
              <div class="banner_adocao">
          <div class="banner_texto">
    
            <p> No momento, não encontramos nenhum animal disponível para adoção que atenda aos filtros selecionados.</p>
          </div>
          <div class="banner_imagem">
            <img src="../img/animaltriste.jpg" alt="Animal triste" />
          </div>
        </div>
          `;
      }
      
      
      })
      .catch(function (error) {
        console.error(error); // Exibe erros, se houver
      });
  }

}
function buscarAdocao() {
  let filtroAno = document.getElementById("filtroAno").value;
  let filtroStatus = document.getElementById("filtroStatus").value;
  let filtro = "";
  if (filtroAno.length > 0 && filtroStatus.length > 0) {
    filtro = filtroAno + " " + filtroStatus;
  }
  else
    if (filtroAno.length > 0) {
      filtro = filtro + filtroAno + " ";
    }
    else
      if (filtroStatus.length > 0) {
        filtro = " " + filtro + filtroStatus;
      }
  console.log(filtroAno)
  console.log(filtroStatus)
  console.log(filtro)
  const resultado = document.getElementById("resultado");
  if (filtro.length > 0) // busca com filtro
  {
    console.log(filtro)
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


        for (let i = 0; i < json.length; i++) {
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
                        <span class="badge 
                          ${json[i].status === 'Aprovada' ? 'bg-success' : json[i].status === 'Cancelada' ? 'bg-danger' : 'bg-warning text-dark'} fs-6 p-2"> ${json[i].status}
                        </span>
                        </td>
                        <td>
                        <button type="button"class="btn btn-sm btn-info text-white"onclick="emitirTermo(${json[i].codAdocao})"${json[i].status === "Aprovada" || json[i].status === "Cancelada" ? "disabled" : ""}> <i class="bi bi-file-earmark-text"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarAdocao(${json[i].codAdocao})"${json[i].status === "Aprovada" || json[i].status === 'Cancelada' ? "disabled" : ""}><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAdocao(${json[i].codAdocao}, '${json[i].status}')"${json[i].status})"><i class="bi bi-trash"></i></button>
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

        for (let i = 0; i < json.length; i++) {
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
                        <span class="badge 
                          ${json[i].status === 'Aprovada' ? 'bg-success' : json[i].status === 'Cancelada' ? 'bg-danger' : 'bg-warning text-dark'} fs-6 p-2"> ${json[i].status}
                        </span>
                        </td>
                        <td>
                        <button type="button"class="btn btn-sm btn-info text-white"onclick="emitirTermo(${json[i].codAdocao})"${json[i].status === "Aprovada" || json[i].status === "Cancelada" ? "disabled" : ""}> <i class="bi bi-file-earmark-text"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarAdocao(${json[i].codAdocao})"${json[i].status === "Aprovada" || json[i].status === "Cancelada" ? "disabled" : ""}><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAdocao(${json[i].codAdocao}, '${json[i].status}')"${json[i].status}><i class="bi bi-trash"></i></button>
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

function buscarAnos() {
  const filtroAno = document.getElementById("filtroAno");
  const url = "http://localhost:8080/apis/adocao/buscarAno";
  fetch(url, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.json();
    })
    .then(function (json) {

      let options = "<option value=''>Todos os anos</option>";
      for (let i = 0; i < json.length; i++) {
        options += `<option value="${json[i]}">${json[i]}</option>`;
      }
      filtroAno.innerHTML = options;
    })
    .catch(function (error) {
      console.error(error);
    });

}

function solicitarAdocao(id) {

  const token = localStorage.getItem("token");
  if (token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64)); // recupera todas as informaçoes no token
    const formData = new FormData();
    const dataAtual = new Date();
    const dataFormatada = dataAtual.toISOString().slice(0, 10);
    formData.append("cod_animal", id);
    formData.append("cod_usuario", payload.cod_usuario);
    formData.append("status", "Pendente");
    formData.append("data", dataFormatada);

    const URL = "http://localhost:8080/apis/adocao/solicitar"
    fetch(URL, {
      method: 'POST', body: formData,
      headers: { 'Authorization': token }
    })
      .then((response) => {
        if (response.ok) {
          sessionStorage.setItem("adocaoSolicitada", 'true');
          window.location.reload();
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Erro ao Enviar Solicitação de Adoção!",
            timer: 1500,
            timerProgressBar: true
          })
        }
        return response.json();
      })
      .then((json) => {

      })
      .catch((error) => console.error(error))
  }
  else {
    Swal.fire({
      icon: "error",
      title: "Acesso Não Autorizado!",
      timer: 1500,
      timerProgressBar: true
    })
  }

}

function logar(nome, senha, id) {
  const URL = "http://localhost:8080/autenticacao"
  const formData = new FormData();
  formData.append("nome", nome);
  formData.append("senha", senha);
  var flag = 1;
  fetch(URL, { method: 'post', body: formData })
    .then(response => {
      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Nome e/ou Senha Incorreto(s)",
          timer: 1500,
          timerProgressBar: true
        })
        flag = 0;
      }

      return response.text();
    })
    .then(texto => {
      localStorage.setItem("token", texto)
      if (flag == 1)
        solicitarAdocao(id);
    })
    .catch(err => alert(err.message))
}
function exibirForm(id) {
  let usernameInput;
  let passwordInput;

  return Swal.fire({
    title: 'Entrar',
    html: `
      <input type="text" id="nome" name="nome" class="swal2-input" placeholder="Nome" style="width: 350px;">
      <input type="password" id="senha" name="senha"class="swal2-input" placeholder="Senha" style="width: 350px;">
    `,
    confirmButtonText: 'Confirmar',
    focusConfirm: false,
    didOpen: () => {
      const popup = Swal.getPopup();
      usernameInput = popup.querySelector('#nome');
      passwordInput = popup.querySelector('#senha');
      usernameInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm();
      passwordInput.onkeyup = (event) => event.key === 'Enter' && Swal.clickConfirm();
    },
    preConfirm: () => {
      const username = usernameInput.value;
      const password = passwordInput.value;
      if (!username || !password) {
        Swal.showValidationMessage('Informe seu nome e senha');
        return;
      }
      return { username, password };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { username, password } = result.value;
      logar(username, password, id);
    }

  });
}



function selecionarAnimal(id, animal) {
  const codAnimal = document.getElementById("cod_animal");
  codAnimal.value = id;
  const botaoAnimal = document.getElementById("botaoSelecionarAnimal")
  botaoAnimal.textContent = `Animal: ${animal}`;
}

function carregarAnimaisModal() {

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

        if (json[i].adotado == "Não") {
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

function selecionarUsuario(id, adotante) {
  const codUsuario = document.getElementById("cod_usuario");
  const botaoUsuario = document.getElementById("botaoSelecionarUsuario")
  codUsuario.value = id;
  botaoUsuario.textContent = `Adotante: ${adotante}`;
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
            <div class="card card-select" style="width: 245px; height: 200px;"
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
  if (cod) {

    const URL = "http://localhost:8080/apis/adocao/atualizar"
    fetch(URL, {
      method: 'PUT', body: formData
    })
      .then((response) => {
        if (!response.ok) {
          sessionStorage.setItem('adocaoAlterada', 'false');
        }
        else {
          sessionStorage.setItem('adocaoAlterada', 'true');
        }
        fadocao.reset();
        window.location.href = "../TelasGerenciar/gerenAdocao.html";
        return response.json();
      })
      .then((json) => {

      })
      .catch((error) => console.error(error))

  }
  else {
    const URL = "http://localhost:8080/apis/adocao/gravar"
    fetch(URL, {
      method: 'POST', body: formData
    })
      .then((response) => {
        if (!response.ok) {
          sessionStorage.setItem('adocaoGravada', 'false');
        }
        else {
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
  limparForm();
}
function excluirAdocao(id, status) {

  if (status != "Pendente" && status != "Aprovada") {
    Swal.fire({
      title: "Deseja apagar está solicitação de adoção ?",
      text: "Não poderá reverter isso!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Apagar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        const URL = "http://localhost:8080/apis/adocao/excluir/" + id;

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
                title: 'Erro ao Excluir a Adoção!',
              });
            else {
              sessionStorage.setItem('adocaoApagada', 'true');
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
  else {
    let URL = "http://localhost:8080/apis/adocao/buscar-id/" + id;
    var formData = new FormData();

    Swal.fire({
      title: "Deseja cancelar está solicitação de adoção ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(URL, {
          headers: {
            Accept: 'application/json',
          },
          method: 'GET',
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erro ao buscar dados da adoção.");
            }
            return response.json();
          })
          .then((json) => {
            formData.append("codAdocao", id);
            formData.append("cod_animal", json.animal.codAnimal);
            formData.append("cod_usuario", json.usuario.codUsuario);
            formData.append("data", json.data);
            formData.append("status", "Cancelada");

            URL = "http://localhost:8080/apis/adocao/atualizar";
            return fetch(URL, {
              method: 'PUT',
              body: formData,
            });
          })
          .then((response) => {
            if (!response.ok) {
              Toast.fire({
                icon: 'error',
                title: 'Erro ao Cancelar Adoção!',
              });
            }
            else {
              sessionStorage.setItem('adocaoCancelada', 'true');
              window.location.reload();
            }

            return response.json();
          })
          .then(() => {

          })
          .catch((error) => {
            console.error(error);
          });
      }
    });

  }
}

function emitirTermo(id) {

  let URL = "http://localhost:8080/apis/adocao/buscar-id/" + id;
  var formData = new FormData();

  Swal.fire({
    title: "Deseja emitir termo de responsabilidade ?",
    text: "Você não poderá reverter isso!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL, {
        headers: {
          Accept: 'application/json',
        },
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados da adoção.");
          }
          return response.json();
        })
        .then((json) => {
          formData.append("codAdocao", id);
          formData.append("cod_animal", json.animal.codAnimal);
          formData.append("cod_usuario", json.usuario.codUsuario);
          formData.append("data", json.data);
          formData.append("status", "Aprovada");

          URL = "http://localhost:8080/apis/adocao/atualizar";
          return fetch(URL, {
            method: 'PUT',
            body: formData,
          });
        })
        .then((response) => {
          if (!response.ok) {
            Toast.fire({
              icon: 'error',
              title: 'Erro ao Emitir Termo de Responsabilidade!',
            });
          }
          else {
            gerarPdf(id)
          }

          return response.json();
        })
        .then(() => {

        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

}

function gerarPdf(id) {
  const URL = "http://localhost:8080/apis/adocao/download-pdf/" + id;

  Swal.fire({
    title: 'Gerando PDF...',
    text: 'Aguarde Enquanto o Termo é Gerado!',
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });

  fetch(URL, {
    method: 'GET',
    headers: { Accept: 'application/pdf' }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Erro ao gerar PDF.");
      }
      return response.blob();
    })
    .then(blob => {
      setTimeout(() => {
        Swal.close();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "termo_de_adocao_" + id + ".pdf";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        sessionStorage.setItem('adocaoEmitida', 'true');
        window.location.reload();
      }, 2000);

    })
    .catch(error => {
      console.error(error);
    });
}

function editarAdocao(id) {

  window.location.href = "../TelasCadastros/cadAdocao.html?codAdocao=" + id;
}

function buscarAdocaoPeloId(id) {
  const URL = "http://localhost:8080/apis/adocao/buscar-id/" + id;

  fetch(URL, {
    headers: {
      'Accept': 'application/json'
    },
    method: 'GET'
  })
    .then((response) => {
      if (!response.ok) {

        window.location.href = "../TelasGerenciar/gerenAdocao.html";
        throw new Error("Erro ao buscar a adoção: " + response.status);

      }
      return response.json();
    })
    .then((json) => {
      document.getElementById('codAdocao').value = id;
      document.getElementById('cod_animal').value = json.animal.codAnimal;
      document.getElementById('cod_usuario').value = json.usuario.codUsuario;
      document.getElementById('data').value = json.data;
      document.getElementById('status').value = json.status;
      const botaoUsuario = document.getElementById("botaoSelecionarUsuario");
      const botaoAnimal = document.getElementById("botaoSelecionarAnimal");

      botaoUsuario.textContent = `Adotante: ${json.usuario.nome}`;
      botaoAnimal.textContent = `Animal: ${json.animal.nome}`;
    })
    .catch((error) => {
      console.error("Erro ao buscar a adoção:", error);
    });

}
function buscarRaca() {
  const filtroRaca = document.getElementById("filtroRaca");
  const url = "http://localhost:8080/apis/animal/buscar-raca";
  fetch(url, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.json();
    })
    .then(function (json) {

      let options = "<option value=''>Todas</option>";
      for (let i = 0; i < json.length; i++) {
        options += `<option value="${json[i]}">${json[i]}</option>`;
      }
      filtroRaca.innerHTML = options;
    })
    .catch(function (error) {
      console.error(error);
    });

}
function buscarCor() {
  const filtroCor = document.getElementById("filtroCor");
  const url = "http://localhost:8080/apis/animal/buscar-cor";
  fetch(url, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.json();
    })
    .then(function (json) {

      let options = "<option value=''>Todas</option>";
      for (let i = 0; i < json.length; i++) {
        options += `<option value="${json[i]}">${json[i]}</option>`;
      }
      filtroCor.innerHTML = options;
    })
    .catch(function (error) {
      console.error(error);
    });

}

