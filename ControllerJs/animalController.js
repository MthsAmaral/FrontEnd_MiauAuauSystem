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

    let filtro = document.getElementById("filtro").value
    const resultado = document.getElementById("resultado");
    if(filtro.length > 0) // busca com filtro
    {
        const url = "http://localhost:8080/apis/animal/buscar/"+filtro;
        fetch(url, { method: 'GET', redirect: "follow" })
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
                        <td onclick='apagar(${json[i].codAnimal})'>Excluir</td>
                        <td onclick='alterar(${json[i].codAnimal})'>Alterar</td>
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
        fetch(url, { method: 'GET', redirect: "follow" })
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
                        <td onclick='apagar(${json[i].codAnimal})'>X</td>
                        <td onclick='alterar(${json[i].codAnimal})'>Alterar</td>
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


    