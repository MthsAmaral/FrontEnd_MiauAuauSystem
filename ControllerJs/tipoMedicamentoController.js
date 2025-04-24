function limparForm() {
    var fdados = document.getElementById("ftipomedicamento");
    fdados.nome.value = "";
    fdados.formaFarmaceutica.value = "";
    fdados.descricao.value = "";
}

function validarCampos() {
    const nome = document.getElementById("nome").value;
    const formaFarmaceutica = document.getElementById("formaFarmaceutica").value;
    const descricao = document.getElementById("descricao").value;

    if (nome !== "" && formaFarmaceutica !== "" && descricao !== "") {
        cadMedicamento();
    } else {
        Toast.fire({
            icon: 'error',
            title: 'Campo(s) Não Preenchido(s)!',
          });
    }
    limparForm();
}

function cadMedicamento() {
    const ftipomedicamento = document.getElementById("ftipomedicamento");
    const formData = new FormData(ftipomedicamento);
    console.log(formData);
    const cod = document.getElementById("cod").value;

    if (cod) // existe, atualiza
    {
        const URL = "http://localhost:8080/apis/tipo-medicamento/atualizar"
        fetch(URL, {
            method: 'PUT',
            body: formData
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                Toast.fire({
                    icon: 'success',
                    title: 'Medicamento Alterado Com Sucesso!',
                  });
                ftipomedicamento.reset();
            })
            .catch((error) => console.error(error))
    }
    else {
        const URL = "http://localhost:8080/apis/tipo-medicamento/gravar"
        fetch(URL, {
            method: 'POST', body: formData
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                Toast.fire({
                    icon: 'success',
                    title: 'Medicamento '+json.nome+' cadastrado Com Sucesso!',
                  });
                ftipomedicamento.reset();
            })
            .catch((error) => console.error("Erro ao cadastrar Tipo Medicamento!! " + error))
    }
}

function buscarMedicamento() {
    let filtro = document.getElementById("filtro").value
    
    if (filtro.length > 0) // busca com filtro
    {
        const url = "http://localhost:8080/apis/tipo-medicamento/buscar/" + filtro;
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
                    table += `<tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].formaFarmaceutica}</td>
                        <td>${json[i].descricao}</td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarMedicamento(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirMedicamento(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>
                      </tr>`;
                }
                document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
            })
            .catch(function (error) {
                console.error(error); // Exibe erros, se houver
            });
    }
    else {
        const url = "http://localhost:8080/apis/tipo-medicamento/buscar/%20";
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
                    table += `<tr>
                        <td>${json[i].cod}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].formaFarmaceutica}</td>
                        <td>${json[i].descricao}</td><td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarMedicamento(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirMedicamento(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>

                      </tr>`;
                }
                resultado.innerHTML = table; // Exibe a tabela no elemento "resultado"
            })
            .catch(function (error) {
                console.error(error); // Exibe erros, se houver
            });
    }
}

function excluirMedicamento(id) {
    const confirmacao = confirm("Tem certeza que deseja excluir este medicamento ?");
    if (confirmacao) {
        const URL = "http://localhost:8080/apis/tipo-medicamento/excluir/" + id;

        fetch(URL, {
            method: 'DELETE'
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                Toast.fire({
                    icon: 'success',
                    title: 'Medicamento Excluido Com Sucesso!',
                  });
                window.location.reload();
            })
            .catch((error) => console.error("Erro ao excluir o medicamento:", error));
    }
}

function editarMedicamento(id) {
    window.location.href = "../TelasCadastros/cadTipoMedicamento.html?codMedicamento=" + id;
}

function buscarMedicamentoPeloId(id) {
    const URL = "http://localhost:8080/apis/tipo-medicamento/buscar-id/" + id;

    fetch(URL, {
        headers: {
            'Accept': 'application/json'
        },
        method: 'GET'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar o medicamento: " + response.status);
            }
            return response.json();
        })
        .then((json) => {
            document.getElementById('cod').value = id;
            document.getElementById('nome').value = json.nome;
            document.getElementById('formaFarmaceutica').value = json.formaFarmaceutica;
            document.getElementById('descricao').value = json.descricao;
        })
        .catch((error) => {
            console.error("Erro ao buscar o medicamento:", error);
            Toast.fire({
                icon: 'error',
                title: 'Erro ao buscar o medicamento!',
              });
        })
}
