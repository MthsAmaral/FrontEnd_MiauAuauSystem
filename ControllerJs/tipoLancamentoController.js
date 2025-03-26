function cadTipoLancamento() {
    const URL = "http://localhost:8080/apis/tipo-lancamento/gravar";
    const ftipolancamento = document.getElementById("ftipolancamento");
    const formData = new FormData(ftipolancamento);

    fetch(URL, {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
            ftipolancamento.reset();
        })
        .catch((error) => console.error("Erro ao CADASTRAR dados:", error));
}

function buscarTipoLancamento(filtro) {
    // deixar um espaço ao final da string para buscar por todos os registros já cadastrados
    const url = "http://localhost:8080/apis/tipo-lancamento/buscar";

    if(filtro.length>0)
        url = url + "/" + filtro; //buscar utilizando o filtro
    else
        url = url + "/ "; //buscar todos os valores

    fetch(url, {
        method: 'GET', redirect: "follow"
    })
        .then((response) => {return response.text()})
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON
            var table = "<table border='1'>"; // Começa a tabela com uma borda simples

            for (let i = 0; i < json.length; i++) {
                table += `
                    <tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].descricao}</td>
                        <td onclick='excluirTipoLancamento(${json[i].id})'>Excluir</td>
                        <td onclick='editarTipoLancamento(${json[i].id})'>Alterar</td>
                    </tr>`;
            }
            table += "</table>";
            document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
}

function excluirTipoLancamento(id){
    const URL = "http://localhost:8080/apis/tipo-lancamento/excluir" + id;

    fetch(URL, { method: 'DELETE' })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
        })
        .catch((error) => console.error("Erro ao EXCLUIR dados:", error));
}

function editarTipoLancamento(){
    const URL = "http://localhost:8080/apis/tipo-lancamento/atualizar";
    const ftipolancamento = document.getElementById("ftipolancamento");
    const formData = new FormData(ftipolancamento);

    fetch(URL, {
        method: 'PUT',
        body: formData,
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
            ftipolancamento.reset();
        })
        .catch((error) => console.error("Erro ao ATUALIZAR dados:", error));
}

function editarTipoLancamento(id){
    //redirecionar para a página de cadastro com os dados do respectivo id
}
