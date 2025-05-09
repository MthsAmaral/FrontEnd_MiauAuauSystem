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
                Swal.fire({
                    icon: "success",
                    title: "Tipo de Lançamento Gravado com Sucesso",
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    console.log("Resposta do servidor: " + JSON.stringify(json));
                    ftipolancamento.reset();
                    window.location.reload(true);
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Erro ao cadastrar!!",
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    console.error("Erro ao CADASTRAR dados:", error);
                });
            });
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
        .then((response) => {
            return response.text();
        })
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON
            var table = ""; // Começa a tabela com uma borda simples

            for (let i = 0; i < json.length; i++) {
                table += `
                    <tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].descricao}</td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarTipoLancamento(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirTipoLancamento(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>`;
            }
            document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
}

function buscarTipoLancFiltro() {
    let filtro = document.getElementById("filtro").value;
    let url = "http://localhost:8080/apis/tipo-lancamento/buscar";

    if (filtro.length > 0)
        url = url + "/" + filtro; //buscar utilizando o filtro
    else
        url = url + "/%20"; //buscar todos os valores

    fetch(url, {
        method: 'GET', redirect: "follow"
    })
        .then((response) => {
            return response.text();
        })
        .then(function (text) {
            var json = JSON.parse(text); // Converte a resposta JSON
            var table = ""; // Começa a tabela com uma borda simples

            for (let i = 0; i < json.length; i++) {
                table += `
                    <tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].descricao}</td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarTipoLancamento(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirTipoLancamento(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>
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
            const URL = "http://localhost:8080/apis/tipo-lancamento/excluir/" + id;

            fetch(URL, { method: 'DELETE' })
                .then((response) => {
                    return response.json();
                })
                .then((json) => {
                    console.log("Resposta do servidor: " + JSON.stringify(json));
                    sessionStorage.setItem("tpLancExcluido", 'true');
                    window.location.reload();
                })
                .catch((error) => {
                    sessionStorage.setItem("tpLancExcluido", 'false');
                    console.error("Erro ao EXCLUIR dados:", error);
                });
        }
    });
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
            console.log("Resposta do servidor: " + JSON.stringify(json));
            ftipolancamento.reset();
            sessionStorage.setItem("tpLancAlterado", 'true');
            window.location.href = "../TelasGerenciar/gerenTipoLancamentos.html";
        })
        .catch((error) => {
            sessionStorage.setItem("tpLancAlterado", 'false');
            console.error("Erro ao ATUALIZAR dados: ", error);
            window.location.href = "../TelasGerenciar/gerenTipoLancamentos.html";
        });
}

function editarTipoLancamento(id) {
    window.location.href = "../TelasCadastros/cadTipoLancamento.html?cod=" + id;
}
