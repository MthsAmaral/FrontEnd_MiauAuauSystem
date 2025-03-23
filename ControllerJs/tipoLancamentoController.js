function cadTipoLancamento() {
    const URL = "http://localhost:8080/apis/tipo_lanc/gravar";
    const ftipolancamento = document.getElementById("ftipolancamento");
    const formData = new FormData(ftipolancamento);

    fetch(URL, {
        method: 'POST',
        body: formData,
    })
        .then((response) => response.json())
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
            ftipolancamento.reset();
        })
        .catch((error) => console.error("Erro ao enviar dados:", error));
}

const resultado = document.getElementById("result");
let filtro = document.getElementById("filtro").value;

const requestOptions = {
    method: "GET",
    redirect: "follow"
};
let erro = false;
let autor2 = document.getElementById("nome").value;
fetch("http://localhost:8080/apis/tipo-lanc/buscar-nome/" + autor2, requestOptions)
    .then((response) => {

        if (!response.ok) erro = true;
        return response.json()
    })
    .then((result) => {
        if (erro)
            resultado2.innerHTML = result.mensagem;
        else {
            let html = "";
            result.forEach(element => {
                html = html + element.titulo + "<br>"
            });
            resultado2.innerHTML = html;
        }

    })
    .catch((error) => resultado2.innerHTML = error);


fetch("http://localhost:8080/apis/tipo-lanc/buscar", requestOptions)
    .then((response) => {

        if (!response.ok) erro = true;
        return response.json()
    })
    .then((result) => {
        if (erro)
            resultado2.innerHTML = result.mensagem;
        else {
            let html = "";
            result.forEach(element => {
                html = html + element.titulo + "<br>"
            });
            resultado2.innerHTML = html;
        }

    })
    .catch((error) => resultado2.innerHTML = error);

    function buscarLancamento() {
        const url = "http://localhost:8080/apis/tipo_lanc/buscar";
    
        fetch(url, { method: 'GET', redirect: "follow" })
            .then((response) => {
                return response.text();
            })
            .then(function (text) {
                var json = JSON.parse(text); // Converte a resposta JSON
    
                var table = "<table border='1'>"; // Começa a tabela com uma borda simples
                table += `<tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Excluir</th>
                    <th>Alterar</th></tr>`;
    
                for (let i = 0; i < json.length; i++) {
                    table += `<tr>
                            <td>${json[i].cod}</td>
                            <td>${json[i].descricao}</td>
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