function buscarUsuario() {
    let filtro = document.getElementById("filtro").value
    const resultado = document.getElementById("resultado");
    if(filtro.length > 0) // busca com filtro
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
                        <td>${json[i].codUsuario}</td>
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
                        <td><button type="button" onclick='excluirUsuario(${json[i].codUsuario})'>Excluir</button></td>
                        <td><button type="button" onclick='alterarUsuario(${json[i].codUsuario})'>Alterar</button></td>
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
                        <td>${json[i].codUsuario}</td>
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
                        <td><button type="button" onclick='excluirUsuario(${json[i].codUsuario})'>Excluir</button></td>
                        <td><button type="button" onclick='alterarUsuario(${json[i].codUsuario})'>Alterar</button></td>
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

function excluirUsuario(id){
    const URL = "http://localhost:8080/apis/usuario/excluir/" + id;
    
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
            alert(JSON.stringify(json));
        })
        .catch((error) => console.error(error));
}

function editarUsuario(id){
    const URL = "http://localhost:8080/apis/usuario/atualizar";
    var fusuario = document.getElementById("fusuario");
    var jsontext = JSON.stringify(Object.fromEntries(new FormData(fusuario)));

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
            alert(JSON.stringify(json));
            fusuario.reset();
        })
        .catch((error) => console.error(error))
}

function cadUsuario() {
    const URL = "http://localhost:8080/apis/usuario/gravar";
    var fusuario = document.getElementById("fusuario");
    var jsontext = JSON.stringify(Object.fromEntries(new FormData(fusuario)));
    
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
            alert(JSON.stringify(json));
            fusuario.reset();
        })
        .catch((error) => console.error(error))
}
