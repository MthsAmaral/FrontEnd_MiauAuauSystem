//cadastrar
function cadTipoLancamento() {
    const token = localStorage.getItem("token");
    const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/tipo-lancamento/gravar";
    const ftipolancamento = document.getElementById("ftipolancamento");
    const formData = new FormData(ftipolancamento);
    const id = document.getElementById("cod").value;

    if (id) {
        editarTipoLanc();
    }
    else {
        fetch(URL, {
            method: 'POST',
            headers: { 'Authorization': token },
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
    let url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/tipo-lancamento/buscar";
    const token = localStorage.getItem("token");

    if (filtro.length > 0)
        url = url + "/" + filtro; //buscar utilizando o filtro
    else
        url = url + "/%20"; //buscar todos os valores

    fetch(url, {
        method: 'GET', 
        headers: { 'Authorization': token },
        redirect: "follow"
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
    const token = localStorage.getItem("token");
    let filtro = document.getElementById("filtro").value;
    let url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/tipo-lancamento/buscar";

    if (filtro.length > 0)
        url = url + "/" + filtro; //buscar utilizando o filtro
    else
        url = url + "/%20"; //buscar todos os valores

    fetch(url, {
        method: 'GET', 
        headers: { 'Authorization': token },
        redirect: "follow"
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
    let url = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/tipo-lancamento/buscar-id/" + id;
    const token = localStorage.getItem("token");

    fetch(url, {
        method: 'GET',
        headers: { 'Authorization': token },
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
            const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/tipo-lancamento/excluir/" + id;
            const token = localStorage.getItem("token");

            fetch(URL, { 
                method: 'DELETE',
                headers: { 'Authorization': token }
            })
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
    const token = localStorage.getItem("token");
    const URL = "https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/tipo-lancamento/atualizar";
    document.getElementById("cod").disabled = false;
    const ftipolancamento = document.getElementById("ftipolancamento");
    const formData = new FormData(ftipolancamento);
    document.getElementById("cod").disabled = true;

    fetch(URL, {
        method: 'PUT',
        headers: { 'Authorization': token },
        body: formData
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
