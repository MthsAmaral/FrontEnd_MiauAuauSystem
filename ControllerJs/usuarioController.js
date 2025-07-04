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
    fdados.cidade.value = "";
    fdados.estado.value = "";
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
    const cidade = document.getElementById("cidade").value;
    const estado = document.getElementById("estado").value;

    if (nome != "" && email != "" && senha != "" && telefone != "" && cpf != "" && privilegio != "" && sexo != "" && cep != "" && rua != "" && bairro != "" && numero != "" && cidade != "" && estado != "") {
        cadUsuario();
    }
    else {
        alert("Campo(s) Não Preenchido(s)")
    }
    limparForm();
}

function cadUsuario() {
    const token = localStorage.getItem("token");
    var fusuario = document.getElementById("fusuario");
    var formData = new FormData(fusuario);
    var cod = document.getElementById("cod").value;
    if (cod) // existe, atualiza
    {
        const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/usuario/atualizar"
        fetch(URL, {
            method: 'PUT', body: formData,
            headers: { 'Authorization': token }
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                console.log("Usuario Alterado Com Sucesso! " + JSON.stringify(json));
                fusuario.reset();
                sessionStorage.setItem("usuarioAlterado", 'true');
                window.location.href = "../TelasGerenciar/gerenUsuarios.html";
            })
            .catch((error) => {
                console.error("Erro ao atualizar Usuário!! " + error);
                sessionStorage.setItem("usuarioAlterado", 'false');
                window.location.href = "../TelasGerenciar/gerenUsuarios.html";
            });
    }
    else {
        const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/usuario/gravar"
        fetch(URL, {
            method: 'POST', body: formData,
            headers: { 'Authorization': token }
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                Swal.fire({
                    icon: "success",
                    title: "Usuário Gravado com Sucesso",
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    console.log("Usuário Cadastrado Com Sucesso! " + JSON.stringify(json));
                    fusuario.reset();
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Erro ao cadastrar!!",
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    console.error("Erro ao cadastrar Usuário!! " + error);
                });
            });
    }
}

function buscarUsuario() {
    const token = localStorage.getItem("token");
    let filtro = document.getElementById("filtro").value
    const resultado = document.getElementById("resultado");
    if (filtro.length > 0) // busca com filtro
    {
        const url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/usuario/buscar/" + filtro;
        fetch(url, {
            method: 'GET', redirect: "follow",
            headers: { 'Authorization': token }
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
                        <td>${json[i].cidade}</td>
                        <td>${json[i].estado}</td>
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
        const url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/usuario/buscar/%20";
        fetch(url, {
            method: 'GET', redirect: "follow",
            headers: { 'Authorization': token }
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
                        <td>${json[i].cidade}</td>
                        <td>${json[i].estado}</td>
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
            const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/usuario/excluir/" + id;

            fetch(URL, { method: 'DELETE',
                        headers: { 'Authorization': token }
            })
                .then((response) => {
                    if(!response.ok)
                    {
                        
                        Toast.fire({
                        icon: 'error',
                        title: 'Erro ao Excluir Usuário!',
                        });
                    }
                    else
                    {
                        sessionStorage.setItem("usuarioApagado", 'true');
                        window.location.reload();
                    }
                    return response.json();

                })
                .then((json) => {
                    
                })
                .catch((error) => {
                    
                });
        }
    });
}

function editarUsuario(id) {

    window.location.href = "../TelasCadastros/cadUsuario.html?cod=" + id;
}

function buscarUsuarioPeloId(id) {
    const token = localStorage.getItem("token");
    const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/usuario/buscar-id/" + id;
    var fusuario = document.getElementById("fusuario");

    fetch(URL, {
        headers: {
            'Accept': 'application/json',
            'Authorization': token 
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
            document.getElementById('cidade').value = json.cidade;
            document.getElementById('estado').value = json.estado;
        })
        .catch((error) => {
            console.error("Erro ao buscar o usuario:", error);
            alert("Erro ao buscar o usuario.");
        });
}