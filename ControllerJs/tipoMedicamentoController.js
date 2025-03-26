function cadMedicamento() {
    const URL = "http://localhost:8080/apis/tipo-medicamento/gravar";
    const ftipomedicamento = document.getElementById("ftipomedicamento");
    const formData = new FormData(ftipomedicamento);

    fetch(URL, {
        method: 'POST',
        body: formData,
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
            ftipomedicamento.reset();
        })
        .catch((error) => console.error("Erro ao CADASTRAR dados:", error));
}


function buscarMedicamento(filtro) {
    // deixar um espaço ao final da string para buscar por todos os registros já cadastrados
    const url = "http://localhost:8080/apis/tipo-medicamento/buscar";

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
                        <td onclick='excluirMedicamento(${json[i].id})'>Excluir</td>
                        <td onclick='editarMedicamento(${json[i].id})'>Alterar</td>
                    </tr>`;
            }
            table += "</table>";
            document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
}

function excluirMedicamento(id){
    const URL = "http://localhost:8080/apis/tipo-medicamento/excluir" + id;

    fetch(URL, { method: 'DELETE' })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
        })
        .catch((error) => console.error("Erro ao EXCLUIR dados:", error));
}

function editarMedicamento(){
    const URL = "http://localhost:8080/apis/tipo-medicamento/atualizar";
    const ftipomedicamento = document.getElementById("ftipomedicamento");
    const formData = new FormData(ftipomedicamento);

    fetch(URL, {
        method: 'PUT',
        body: formData,
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
            ftipomedicamento.reset();
        })
        .catch((error) => console.error("Erro ao ATUALIZAR dados:", error));
}

function editarMedicamento(id){
    //redirecionar para a página de cadastro com os dados do respectivo id
}
