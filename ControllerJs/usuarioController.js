function limparForm() {
    var fdados = document.getElementById("fusuario");
    fdados.nome.value = "";
    fdados.email.value = "";
    fdados.senha.value = "";
    fdados.telefone.value = "";
    fdados.cpf.value = "";
    fdados.privilégio.value = "C";
    fdados.sexo.value = "M";
    fdados.cep.value = "";
    fdados.rua.value = "";
    fdados.bairro.value = "";
    fdados.numero.value = "";
}

function validarCampos() {
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const telefone = document.getElementById("telefone").value;
    const cpf = document.getElementById("cpf").value;
    const privilegio = document.getElementById("privilegio").value;
    const sexo = document.getElementById("sexo").value;
    const cep = document.getElementById("cep").value;
    const rua = document.getElementById("rua").value;
    const bairro = document.getElementById("bairro").value;
    const numero = document.getElementById("numero").value;

    if (nome != "" && email != "" && senha != "" && telefone != "" && cpf != "" && privilegio != "" && sexo != "" && cep != "" && rua != "" && bairro != "" && numero != "") {
        cadUsuario();
        limparForm();
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

function cadUsuario() {

    var fusuario = document.getElementById("fusuario");
    var formData = new FormData(fusuario);
    var cod = document.getElementById("cod").value;
    if (cod) 
    {
        const URL = "http://localhost:8080/apis/usuario/atualizar"
        fetch(URL, {
            method: 'PUT', body: formData
        })
            .then((response) => {
                if(!response.ok)
                {
                    sessionStorage.setItem('usuarioAlterado', 'false');
                }
                else
                {
                    sessionStorage.setItem('usuarioAlterado', 'true');
                }
                fusuario.reset();
                window.location.href = "../TelasGerenciar/gerenUsuarios.html";
                return response.json();
              
            })
            .then((json) => {

            
            })
            .catch((error) => console.error(error))

    }
    else {
        const URL = "http://localhost:8080/apis/usuario/gravar"
        fetch(URL, {
            method: 'POST', body: formData
        })
            .then((response) => {
                
                if(!response.ok)
                {
                    sessionStorage.setItem('usuarioGravado', 'false');
                }
                else
                {
                    sessionStorage.setItem('usuarioGravado', 'true');
                }
                fusuario.reset();
                window.location.href = "../TelasGerenciar/gerenUsuarios.html";
                return response.json();
            })
            .then((json) => {
                
                
            })
            .catch((error) => console.error(error))
    }
}

function buscarUsuario() {
    let filtro = document.getElementById("filtro").value
    const resultado = document.getElementById("resultado");
    if (filtro.length > 0) // busca com filtro
    {
        const url = "http://localhost:8080/apis/usuario/buscar/" + filtro;
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
                        <td>${json[i].cod}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].email}</td>
                        <td>${json[i].senha}</td>
                        <td>${json[i].telefone}</td>
                        <td>${json[i].cpf}</td>
                        <td>${json[i].privilegio}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].cep}</td>
                        <td>${json[i].rua}</td>
                        <td>${json[i].bairro}</td>
                        <td>${json[i].numero}</td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarUsuario(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirUsuario(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>
                      </tr>`;
                }
                table += "</table>";
                resultado.innerHTML = table; // Exibe a tabela no elemento "resultado"
            })
            .catch(function (error) {
                console.error(error); // Exibe erros, se houver
            });
    }
    else {
        const url = "http://localhost:8080/apis/usuario/buscar/%20";
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
                        <td>${json[i].cod}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].email}</td>
                        <td>${json[i].senha}</td>
                        <td>${json[i].telefone}</td>
                        <td>${json[i].cpf}</td>
                        <td>${json[i].privilegio}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].cep}</td>
                        <td>${json[i].rua}</td>
                        <td>${json[i].bairro}</td>
                        <td>${json[i].numero}</td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarUsuario(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirUsuario(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>

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

function excluirUsuario(id) {

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

        const URL = "http://localhost:8080/apis/usuario/excluir/" + id;

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
                        title: 'Erro ao Excluir o Usuario!',
                      });
                else
                {
                    sessionStorage.setItem('usuarioApagado', 'true');
                    window.location.reload();
                }
                    
                return response.json();
            })
            .then((json) => {
                
            })
            .catch((error) => {
                console.error("Erro ao excluir o usuario:", error);
            });

        }
      });
        
}

function editarUsuario(id) {

    window.location.href = "../TelasCadastros/cadUsuario.html?cod=" + id;
}

function buscarUsuarioPeloId(id) {

    const URL = "http://localhost:8080/apis/usuario/buscar-id/" + id;
    var fusuario = document.getElementById("fusuario");

    fetch(URL, {
        headers: {
            'Accept': 'application/json'
        },
        method: 'GET'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar o usuario: " + response.status);
            }
            return response.json();
        })
        .then((json) => {
            document.getElementById('cod').value = id;
            document.getElementById('nome').value = json.nome;
            document.getElementById('email').value = json.email;
            document.getElementById('senha').value = json.senha;
            document.getElementById('telefone').value = json.telefone;
            document.getElementById('cpf').value = json.cpf;
            document.getElementById('privilegio').value = json.privilegio;
            document.getElementById('sexo').value = json.sexo;
            document.getElementById('cep').value = json.cep;
            document.getElementById('rua').value = json.rua;
            document.getElementById('bairro').value = json.bairro;
            document.getElementById('numero').value = json.numero;
        })
        .catch((error) => {
            console.error("Erro ao buscar o usuario:", error);
            alert("Erro ao buscar o usuario.");
        });
}