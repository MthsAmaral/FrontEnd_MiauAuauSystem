function buscarUsuario() {
    const resultado = document.getElementById("result");
    const requestOptions = {
        method: "GET",
        redirect: "follow",

    };
    let usuario = document.getElementById("usuario").value;
    let erro = false;
    fetch("http://localhost:8080/apis/buscar-cpf?cpf=" + usuario, requestOptions)
        .then((response) => {
            if (!response.ok) erro = true;
            return response.json();
        })
        .then((result) => {
            if (erro)
                resultado.innerHTML = result.mensagem;
            else {
                let html = "";
                result.forEach(element => {
                    html += element.nome + "<br>"
                });
                resultado.innerHTML = html;
            }
        })
        .catch((error) => sugestao.innerHTML = error);
}

function buscarUsuarios() {
    const url = "http://localhost:8080/apis/usuario/buscar";

    fetch(url, { method: 'GET', redirect: "follow" })
        .then((response) => {
            return response.text();
        })
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON

            var table = "<table border='1'>"; // Começa a tabela com uma borda simples
            table += '<tr><th>Código</th><th>Nome</th><th>Telefone</th><th>CPF</th><th>Privilégio</th><th>Sexo</th><th>Email</th><th>Excluir</th><th>Alterar</th></tr>';

            for (let i = 0; i < json.length; i++) {
                table += `<tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].telefone}</td>
                        <td>${json[i].cpf}</td>
                        <td>${json[i].privilegio}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].email}</td>
                        <td onclick='apagar(${json[i].id})'>X</td>
                        <td onclick='alterar(${json[i].id})'>Alterar</td>
                      </tr>`;
            }
            table += "</table>";
            document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
}

function cadUsuario() {
    const URL = "http://localhost:8080/apis/usuario/gravar";
    var fusuario = document.getElementById("fusuario");
    console.log(fusuario);
    var jsontext = JSON.stringify(Object.fromEntries(
        new FormData(fusuario)));
    fetch(URL, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST', body: jsontext
    })
        .then(response => { return response.json(); })
        .then(json => {
            alert(JSON.stringify(json));
            fusuario.reset();
        })
        .catch(error => { console.error(error); });

}