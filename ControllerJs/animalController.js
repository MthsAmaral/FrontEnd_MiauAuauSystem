function cadAnimal() {
    const URL = "http://localhost:8080/apis/animal/gravar"
    var fanimal = document.getElementById("fanimal");
    var jsontext = JSON.stringify(Object.fromEntries(new FormData(fanimal)));
    fetch(URL, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST', body: jsontext
    })
        .then((response) => { return response.json(); })
        .then((json) => {
            alert(JSON.stringify(json));
            fanimal.reset();
        })
        .catch((error) => console.error(error))

}

function buscarAnimal() {
    const url = "http://localhost:8080/apis/animal/buscar";

    fetch(url, { method: 'GET', redirect: "follow" })
        .then((response) => {
            return response.text();
        })
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON

            var table = "<table border='1'>"; // Começa a tabela com uma borda simples
            table += "<tr><th>Código</th><th>Nome</th><th>Raça</th><th>Idade</th><th>Sexo</th><th>Excluir</th><th>Alterar</th></tr>";

            for (let i = 0; i < json.length; i++) {
                table += `<tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].raca}</td>
                        <td>${json[i].idade}</td>
                        <td>${json[i].sexo}</td>
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