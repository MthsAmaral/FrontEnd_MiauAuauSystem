//cadastrar
function cadTipoLancamento() {
    const URL = "http://localhost:8080/apis/tipo-lancamento/gravar";
    const ftipolancamento = document.getElementById("ftipolancamento");
    const formData = new FormData(ftipolancamento);
    const id = document.getElementById("cod").value;

    if (id) {
        editarTipoLanc();
    }
    else {
        fetch(URL, {
            method: 'POST',
            body: formData
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
}

//buscar
function buscarTipoLancamento(filtro) {
    // deixar um espaço ao final da string para buscar por todos os registros já cadastrados
    let url = "http://localhost:8080/apis/tipo-lancamento/buscar";

    if (filtro.length > 0)
        url = url + "/" + filtro; //buscar utilizando o filtro
    else
        url = url + "/%20"; //buscar todos os valores

    fetch(url, {
        method: 'GET', redirect: "follow"
    })
        .then((response) => { return response.text() })
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON
            var table = ""; // Começa a tabela com uma borda simples

            for (let i = 0; i < json.length; i++) {
                table += `
                    <tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].descricao}</td>
                        <td><button type="button" onclick="excluirTipoLancamento(${json[i].cod})">Excluir</button></td>
                        <td><button type="button" onclick="editarTipoLancamento(${json[i].cod})">Editar</button></td>
                    </tr>`;
            }
            document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
}

function buscarTipoLancID(id) {
    // deixar um espaço ao final da string para buscar por todos os registros já cadastrados
    let url = "http://localhost:8080/apis/tipo-lancamento/buscar-id/" + id;

    fetch(url, {
        method: 'GET',
        redirect: "follow"
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            document.getElementById("cod").value = id;
            document.getElementById("descricao").value = json.descricao;
        })
        .catch(function (error) {
            console.error("Erro ao buscar o Tipo de Lançamento" + error); // Exibe erros, se houver
        });
}

//exclusão
function excluirTipoLancamento(id) {
    const URL = "http://localhost:8080/apis/tipo-lancamento/excluir/" + id;

    fetch(URL, { method: 'DELETE' })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            alert("Resposta do servidor: " + JSON.stringify(json));
        })
        .catch((error) => console.error("Erro ao EXCLUIR dados:", error));
}

//edição
function editarTipoLanc() {
    const URL = "http://localhost:8080/apis/tipo-lancamento/atualizar";
    document.getElementById("cod").disabled = false;
    const ftipolancamento = document.getElementById("ftipolancamento");
    const formData = new FormData(ftipolancamento);
    document.getElementById("cod").disabled = true;

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

function editarTipoLancamento(id) {
    window.location.href = "../TelasCadastros/cadTipoLancamento.html?cod=" + id;
}
