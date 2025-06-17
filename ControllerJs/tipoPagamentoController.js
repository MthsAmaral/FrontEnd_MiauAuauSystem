//cadastrar
function cadTipoPagamento() {
    const token = localStorage.getItem("token");
    const URL = "http://localhost:8080/apis/plano-contas-gerencial/gravar";
    const ftipopagamento = document.getElementById("ftipopagamento");
    const formData = new FormData(ftipopagamento);
    const id = document.getElementById("cod").value;

    if (id) {
        editarTipoPag();
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
                    title: "Plano De Conta Gerencial Gravado com Sucesso",
                    timer: 1500,
                    timerProgressBar: true
                }).then(() => {
                    console.log("Resposta do servidor: " + JSON.stringify(json));
                    ftipopagamento.reset();
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
function buscarTipoPagamento(filtro) {
    // deixar um espaço ao final da string para buscar por todos os registros já cadastrados
    let url = "http://localhost:8080/apis/plano-contas-gerencial/buscar";
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
                        <td>${json[i].referencial.descricao}</td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarTipoPagamento(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirTipoPagamento(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>`;
            }
            document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
}

function buscarTipoPagFiltro() {
    let filtro = document.getElementById("filtro").value;
    let url = "http://localhost:8080/apis/plano-contas-gerencial/buscar";
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
                        <td>${json[i].referencial.descricao}</td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarTipoPagamento(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirTipoPagamento(${json[i].cod})"><i class="bi bi-trash"></i></button>
                        </td>
                    </tr>`;
            }
            document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
        })
        .catch(function (error) {
            console.error(error); // Exibe erros, se houver
        });
}

function buscarTipoPagID(id) {
    // deixar um espaço ao final da string para buscar por todos os registros já cadastrados
    let url = "http://localhost:8080/apis/plano-contas-gerencial/buscar-id/" + id;
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
            selectReferencial(json.referencial.cod);
        })
        .catch(function (error) {
            console.error("Erro ao buscar o Plano de Conta Gerencial" + error); // Exibe erros, se houver
        });
}

function verificaRef() {
    let referencial = document.getElementById("codRef");
    let msg = document.getElementById("referencial-msg");
  
    if (parseInt(referencial.value) == 0) {
      tipoLanc.style.border = "2px solid red";
      msg.style.display = "block";
      msg.textContent = "Nenhum Plano de Contas Referencial Selecionado";
    } else {
      tipoLanc.style.border = "";
      msg.style.display = "none";
      msg.textContent = "";
    }
  }
//buscar e fazer o select do referencial
function selectReferencial(id) {
    //realizar a consulta do "Plano de contas referencial"
    let URL = "";
    URL = "http://localhost:8080/apis/plano-contas-referencial/buscar/%20";
    const token = localStorage.getItem("token");

    fetch(URL, {
      method: 'GET',
      headers: { 'Authorization': token },
      redirect: "follow"
    })
      .then((response) => {
        return response.text();
      })
      .then(function (text) {
        let json = JSON.parse(text);
        let select = "";
        if (id) {
          select = "<select class='form-select' name='codPcr' id='codPcr' onmousedown='verificaRef()'>";
        }
        else {
          select = "<select class='form-select' name='codPcr' id='codPcr' onmousedown='verificaRef()'> <option value='0' selected disabled hidden>Selecione uma opção</option>";
        }
  
        for (let i = 0; i < json.length; i++) {
          if (id == json[i].cod) {
            select += `
              <option value='${json[i].cod}' selected>${json[i].descricao}</option>
            `;
          }
          else {
            select += `
              <option value='${json[i].cod}'>${json[i].descricao}</option>
            `;
          }
        }
        select += "</select>";
        //setar o Plano Referencial
        document.getElementById("referencial").innerHTML = select;
      })
      .catch(function (error) {
        console.error(error);
      });
}

//exclusão
function excluirTipoPagamento(id) {
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
            const URL = "http://localhost:8080/apis/plano-contas-gerencial/excluir/" + id;
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
                    sessionStorage.setItem("tpPagExcluido", 'true');
                    window.location.reload();
                })
                .catch((error) => {
                    console.error("Erro ao EXCLUIR dados:", error);
                    sessionStorage.setItem("tpPagExcluido", 'false');
                });
        }
    });
}

//edição
function editarTipoPag() {
    const token = localStorage.getItem("token");
    const URL = "http://localhost:8080/apis/plano-contas-gerencial/atualizar";
    document.getElementById("cod").disabled = false;
    const ftipopagamento = document.getElementById("ftipopagamento");
    const formData = new FormData(ftipopagamento);
    document.getElementById("cod").disabled = true;

    fetch(URL, {
        method: 'PUT',
        headers: { 'Authorization': token },
        body: formData,
    })
        .then((response) => {
            return response.json();
        })
        .then((json) => {
            console.log("Resposta do servidor: " + JSON.stringify(json));
            ftipopagamento.reset();
            sessionStorage.setItem("tpPagAlterado", 'true');
            window.location.href = "../TelasGerenciar/gerenTipoPagamento.html";
        })
        .catch((error) => {
            console.error("Erro ao ATUALIZAR dados:", error);
            sessionStorage.setItem("tpPagAlterado", 'false');
            window.location.href = "../TelasGerenciar/gerenTipoPagamento.html";
        });
}

function editarTipoPagamento(id) {
    window.location.href = "../TelasCadastros/cadTipoPagamento.html?cod=" + id;
}
