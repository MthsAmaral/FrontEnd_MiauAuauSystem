function limparForm() {
    var fdados = document.getElementById("fanimal");
    fdados.nome.value = "";
    fdados.raca.value = "";
    fdados.idade.value = "";
    fdados.peso.value = "";
    fdados.adotado.value = "";
    fdados.sexo.value = "";
    fdados.castrado.value = "";
    fdados.imagemBase64.value = "";
    document.getElementById('file-name').textContent = 'Selecionar Foto';
}
function validarImagem(imagem) {

    let flag = 0;
    if (imagem.endsWith(".jpeg") || imagem.endsWith(".jpg"))
        flag = 1;
    return flag;
}
function validarCampos() {
    const nome = document.getElementById("nome").value;
    const sexo = document.getElementById("sexo").value;
    const raca = document.getElementById("raca").value;
    const idade = document.getElementById("idade").value;
    const peso = document.getElementById("peso").value;
    const castrado = document.getElementById("castrado").value;
    const adotado = document.getElementById("adotado").value;
    const imagem = document.getElementById("imagemBase64").value;
    
    if (nome != "" && sexo != "" && raca != "" && idade > 0 && peso > 0 && castrado != "" && adotado != "") {
        if (imagem != "") {
            if (validarImagem(imagem))
                cadAnimal();
            else
            {
                alert("Tipo de Arquivo Não Permitido. Apenas .jpeg ou .jpg são permitidos");
                
            }
        }
        else
            cadAnimal();

    }
    else {
        alert("Campo(s) Não Preenchido(s)")
    }
    limparForm();
}

function cadAnimal() {

    var fanimal = document.getElementById("fanimal");
    var formData = new FormData(fanimal);
    var cod = document.getElementById("codAnimal").value;
    if (cod) 
    {
        const URL = "http://localhost:8080/apis/animal/atualizar"
        fetch(URL, {
            method: 'PUT', body: formData
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                //alert("Animal Alterado Com Sucesso");
                fanimal.reset();
                window.location.href = "../TelasGerenciar/gerenAnimais.html";
            })
            .catch((error) => console.error(error))

    }
    else {
        const URL = "http://localhost:8080/apis/animal/gravar"
        fetch(URL, {
            method: 'POST', body: formData
        })
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                //alert("Animal Cadastrado Com Sucesso");
                fanimal.reset();
                window.location.href = "../TelasGerenciar/gerenAnimais.html";
            })
            .catch((error) => console.error(error))
    }
}

function buscarAnimal() {
    let filtro = document.getElementById("filtro").value
    const resultado = document.getElementById("resultado");
    if (filtro.length > 0) // busca com filtro
    {
        const url = "http://localhost:8080/apis/animal/buscar/" + filtro;
        fetch(url, {
            method: 'GET', redirect: "follow"
        })
            .then((response) => {
                return response.text();
            })
            .then(function (text) {
                var json = JSON.parse(text); 

                var table = "<table border='1'>"; 


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
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Imagem do animal" style="width: 100px; height: auto;">
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarAnimal(${json[i].codAnimal})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAnimal(${json[i].codAnimal})"><i class="bi bi-trash"></i></button>
                        </td>
                      </tr>`;
                }
                table += "</table>";
                resultado.innerHTML = table; 
            })
            .catch(function (error) {
                console.error(error); 
            });
    }
    else {
        const url = "http://localhost:8080/apis/animal/buscar/%20";
        fetch(url, {
            method: 'GET', redirect: "follow"
        })
            .then((response) => {
                return response.text();
            })
            .then(function (text) {
                var json = JSON.parse(text); 

                var table = "<table border='1'>"; 
                for (let i = 0; i < json.length; i++) {
                    console.log(`Imagem Base64 do animal ${json[i].codAnimal}:`, json[i].imagemBase64);
                    table += `<tr>
                        <td>${json[i].codAnimal}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].raca}</td>
                        <td>${json[i].idade}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].peso}</td>
                        <td>${json[i].castrado}</td>
                        <td>${json[i].adotado}</td>
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Imagem do animal" style="width: 100px; height: auto;">
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-warning" onclick="editarAnimal(${json[i].codAnimal})"><i class="bi bi-pencil-square"></i></button>
                        </td>
                        <td>
                        <button type="button" class="btn btn-sm btn-danger" onclick="excluirAnimal(${json[i].codAnimal})"><i class="bi bi-trash"></i></button>
                        </td>

                        
                      </tr>`;
                }
                table += "</table>";
                resultado.innerHTML = table; 
            })
            .catch(function (error) {
                console.error(error); 
            });
    }
}

function excluirAnimal(id) {

    const confirmacao = confirm("Tem certeza que deseja excluir este animal ?");
    if (confirmacao) {
        const URL = "http://localhost:8080/apis/animal/excluir/" + id;

        fetch(URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE'
        })
            .then((response) => {
                if(!response.ok)
                    alert("Erro ao excluir o animal");
                else
                    window.location.reload();

                return response.json();
            })
            .then((json) => {
                
            })
            .catch((error) => {
                console.error("Erro ao excluir o animal:", error);
            });
    }

}

function editarAnimal(id) {

    window.location.href = "../TelasCadastros/cadAnimal.html?codAnimal=" + id;
}

function buscarAnimalPeloId(id) {
    const URL = "http://localhost:8080/apis/animal/buscar-id/" + id;

    fetch(URL, {
        headers: {
            'Accept': 'application/json'
        },
        method: 'GET'
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Erro ao buscar o animal: " + response.status);
            }
            return response.json();
        })
        .then((json) => {
            document.getElementById('codAnimal').value = id;
            document.getElementById('nome').value = json.nome;
            document.getElementById('raca').value = json.raca;
            document.getElementById('idade').value = json.idade;
            document.getElementById('peso').value = json.peso;
            document.getElementById('sexo').value = json.sexo;
            document.getElementById('castrado').value = json.castrado;
            document.getElementById('adotado').value = json.adotado;
        })
        .catch((error) => {
            console.error("Erro ao buscar o animal:", error);
            alert("Erro ao buscar o animal.");
        });

}
