function limparForm()
{
    var fdados = document.getElementById("fanimal");
    fdados.nome.value="";
    fdados.sexo.value="M";
    fdados.raca.value="";
    fdados.idade.value="";
    fdados.peso.value="";
    fdados.castrado.value="Não";
    fdados.adotado.value="Não";
    fdados.fileName.value="";
}

function validarCampos()
{
  const nome = document.getElementById("nome").value;
  const sexo = document.getElementById("sexo").value;
  const raca = document.getElementById("raca").value;
  const idade = document.getElementById("idade").value;
  const peso = document.getElementById("peso").value;
  const castrado = document.getElementById("castrado").value;
  const adotado = document.getElementById("adotado").value;
  const fileName = document.getElementById("fileName").value;
  
  if (nome != "" && sexo != "" && raca != "" && idade > 0 && peso > 0 && castrado != "" && adotado != "" && fileName != "")
  {
    cadAnimal();
  }
  else
  {
    alert("Campo(s) Não Preenchido(s)")
  }
  limparForm();
}
function cadAnimal() {
    
    var fanimal = document.getElementById("fanimal");
    var jsontext = JSON.stringify(Object.fromEntries(new FormData(fanimal)));
    var cod = document.getElementById("codAnimal").value;
    if(cod) // existe, atualiza
    {
        const URL = "http://localhost:8080/apis/animal/atualizar"
        fetch(URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'PUT', body: jsontext
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                alert("Animal Alterado Com Sucesso");
                fanimal.reset();
            })
            .catch((error) => console.error(error))

    }
    else
    {
        const URL = "http://localhost:8080/apis/animal/gravar"
        fetch(URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST', body: jsontext
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                alert("Animal Cadastrado Com Sucesso");
                fanimal.reset();
            })
            .catch((error) => console.error(error))
    }
}

function buscarAnimal() {
    let filtro = document.getElementById("filtro").value
    const resultado = document.getElementById("resultado");
    if(filtro.length > 0) // busca com filtro
    {
        const url = "http://localhost:8080/apis/animal/buscar/" + filtro;
        fetch(url, {
            method: 'GET', redirect: "follow"
        })
        .then((response) => {
            return response.text();
        })
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON

            var table = "<table border='1'>"; // Começa a tabela com uma borda simples
            
        
            for (let i = 0; i < json.length; i++) {
                table += `<tr>
                        <td>${json[i].codAnimal}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].raca}</td>
                        <td>${json[i].idade}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].peso}</td>
                        <td>${json[i].castrado}</td>
                        <td>${json[i].adotado}</td>
                        <td><button type="button" onclick='excluirAnimal(${json[i].codAnimal})'>Excluir</button></td>
                        <td><button type="button" onclick='alterarAnimal(${json[i].codAnimal})'>Alterar</button></td>
                      </tr>`;
            }
            table += "</table>";
            resultado.innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
    }
    else
    {
        const url = "http://localhost:8080/apis/animal/buscar/%20";
        fetch(url, {
            method: 'GET', redirect: "follow"
        })
        .then((response) => {
            return response.text();
        })
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON

            var table = "<table border='1'>"; // Começa a tabela com uma borda simples
            for (let i = 0; i < json.length; i++) {
                table += `<tr>
                        <td>${json[i].codAnimal}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].raca}</td>
                        <td>${json[i].idade}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].peso}</td>
                        <td>${json[i].castrado}</td>
                        <td>${json[i].adotado}</td>
                        <td><button type="button" onclick='excluirAnimal(${json[i].codAnimal})'>Excluir</button></td>
                        <td><button type="button" onclick='editarAnimal(${json[i].codAnimal})'>Alterar</button></td>

                      </tr>`;
            }
            table += "</table>";
            resultado.innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
    }
}

function excluirAnimal(id) 
{

    const confirmacao = confirm("Tem certeza que deseja excluir este animal ?");
    if (confirmacao)
    {
        const URL = "http://localhost:8080/apis/animal/excluir/" + id;

        fetch(URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                alert("Animal Excluido Com Sucesso");
                window.location.reload();
            })
            .catch((error) => console.error("Erro ao excluir o animal:", error));
    } 
    
}

function editarAnimal(id) {
    
    window.location.href = "../TelasCadastros/cadAnimal.html?id="+id;
}

function buscarAnimalPeloId(id) {
    
    const URL = "http://localhost:8080/apis/animal/buscar-id/"+id;
    var fanimal = document.getElementById("fanimal");

    fetch(URL, {
        headers: {
            'Accept': 'application/json'
        },
        method: 'GET'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar o animal: " + response.status);
            }
            return response.json();
        })
        .then((json) => {
            // Preenche o formulário com os dados do animal
            Object.keys(json).forEach(key => {
                let field = fanimal.elements[key];
                if (field) {
                    field.value = json[key];
                }
            });
        })
        .catch((error) => {
            console.error("Erro ao buscar o animal:", error);
            alert("Erro ao buscar o animal.");
        });
}

