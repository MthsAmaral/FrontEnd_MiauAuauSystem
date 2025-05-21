function limparForm() {
    var formulario = document.querySelector("form"); // seleciona o primeiro formulário da página
    if (formulario) {
        formulario.reset();
    }
}


function validarImagem(imagem) {

    let flag = 0;
    if (imagem.endsWith(".jpeg") || imagem.endsWith(".jpg"))
        flag = 1;
    return flag;
}

function validarData(dataString) {
    const regexData = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexData.test(dataString)) {
        return false;
    }

    const [ano, mes, dia] = dataString.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);

    if (
        data.getFullYear() !== ano ||
        data.getMonth() !== mes - 1 ||
        data.getDate() !== dia
    ) {
        return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);

    /*if (data > hoje) {
        return false;
    }*/
    return true;
}

function validarCampos() {
    const data = document.getElementById("data").value;
    const tipoRegistro = document.getElementById("tipoRegistro").value;
    const arquivoInput = document.getElementById("imagemBase64");
    const arquivo = arquivoInput.files[0];

    if (data === "" || tipoRegistro === "") {
        Swal.fire({
            icon: "warning",
            title: "Preencha todos os campos obrigatórios",
            timer: 1500,
            timerProgressBar: true
        });
    }
    else {
        if (!validarData(data)) {
            Swal.fire({
                icon: "warning",
                title: "Data inválida",
                timer: 1500,
                timerProgressBar: true
            });
        }
        else {
            // Validar tamanho do arquivo (se anexado)
            if (arquivo && arquivo.size > 5 * 1024 * 1024) { // 5 MB
                Swal.fire({
                    icon: "warning",
                    title: "Arquivo muito grande. Máximo 5 MB permitido.",
                    timer: 2000,
                    timerProgressBar: true
                });
            }
            else
                cadRegistroProntuario();
        }
    }
}


function cadRegistroProntuario() {
    const data = document.getElementById("data").value;
    const tipoRegistro = document.getElementById("tipoRegistro").value;
    const observacao = document.getElementById("observacao").value;

    const animalSelecionadoJson = localStorage.getItem("animalSelecionado");

    if (!animalSelecionadoJson) {
        Swal.fire({
            icon: "warning",
            title: "Selecione um animal antes de cadastrar",
            timer: 1500,
            timerProgressBar: true
        });
    } else {
        const animalSelecionado = JSON.parse(animalSelecionadoJson);
        const codAnimal = animalSelecionado.codAnimal;

        const arquivoInput = document.getElementById("pdf");
        const arquivo = arquivoInput.files[0];

        const formData = new FormData();
        formData.append("data", data);
        formData.append("tipoRegistro", tipoRegistro);
        formData.append("observacao", observacao);
        formData.append("animalId", codAnimal);
        if (arquivo) {
            formData.append("pdf", arquivo);
        }

        fetch("http://localhost:8080/registroProntuario", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Registro cadastrado com sucesso!",
                    timer: 2000,
                    timerProgressBar: true
                });
                limparForm();
                //remove do localStorage
                localStorage.removeItem("animalSelecionado");
                document.getElementById("animalSelecionado").classList.add("d-none");
            } else {
                return response.text().then(texto => {
                    throw new Error(texto);
                });
            }
        })
        .catch(error => {
            console.error("Erro ao cadastrar:", error);
            Swal.fire({
                icon: "error",
                title: "Erro ao cadastrar",
                text: error.message
            });
        });
    }
}



function buscarRegistroPeloId(id) {
    const URL = "http://localhost:8080/apis/prontuario/buscar-id/" + id;

    fetch(URL, {
        headers: {
            'Accept': 'application/json'
        },
        method: 'GET'
    })
        .then((response) => {
            if (!response.ok) {

                window.location.href = "../TelasFundamentais/prontuario.html";
                throw new Error("Erro ao buscar o registro do prontuario: " + response.status);
                
            }
            return response.json();
        })
        .then((json) => {
            document.getElementById('cod').value = json.cod;


            //document.getElementById('animalId').value = json.codAnimal;
            selecionarAnimalJSON(json.animal);

            let partes = json.data.split("-");
            let dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            document.getElementById("data").value = dataFormatada;

            document.getElementById('tipoRegistro').value = json.tipoRegistro;
            document.getElementById('observacao').value = json.observacao;


            // Supondo que você já tenha o objeto `json` do lançamento que está sendo editado
            let pdfAtualDiv = document.getElementById("pdfAtual");
            // Limpa qualquer conteúdo anterior antes de adicionar algo novo
            pdfAtualDiv.innerHTML = "";
            // Verifica se há um arquivo existente
            if (json.arquivo) {
                let link = document.createElement('a');
                link.href = `http://localhost:8080/apis/prontuario/arquivo/${json.cod}`;
                link.target = '_blank';
                link.textContent = 'PDF Atual';

                pdfAtualDiv.appendChild(link);
                pdfAtualDiv.hidden = false;
            } else {
                // Se não houver arquivo, mantemos a div escondida
                pdfAtualDiv.hidden = true;
            }
        })
        .catch((error) => {
            console.error("Erro ao buscar o registro do prontuario:", error);
        });
}


//modal 

function carregarAnimais() {
    let filtro = document.getElementById("filtro").value.trim();
    const container = document.querySelector("#modalAnimais .modal-body");
    container.innerHTML = "";

    // Limpa seleção temporária ao abrir
    animaisSelecionadosTemp = [];

    // Define URL com base no filtro
    const url = "http://localhost:8080/apis/animal/buscar/" + (filtro.length > 0 ? filtro : "%20");

    fetch(url, {
        method: 'GET',
        redirect: 'follow'
    })
        .then(response => {
            if (!response.ok) throw new Error("Erro ao carregar animais.");
            return response.text();
        })
        .then(text => {
            const lista = JSON.parse(text);

            if (lista.length === 0) {
                const mensagem = document.createElement("div");
                mensagem.className = "alert alert-info";
                mensagem.textContent = "Nenhum animal encontrado com esse filtro.";
                container.appendChild(mensagem);
            } else {
                lista.forEach(animal => {
                    const col = document.createElement("div");
                    col.className = "col-md-4 mb-3";

                    const animalJson = encodeURIComponent(JSON.stringify(animal));

                    col.innerHTML = `
                        <div class="card card-select" style="cursor: pointer;" onclick="selecionarAnimalJSON('${animalJson}')">
                            <img src="data:image/jpeg;base64,${animal.imagemBase64}" width="200" height="210" style="object-fit: cover;" class="card-img-top" />
                            <div class="card-body">
                                <h5 class="card-title">${animal.nome}</h5>
                                <p class="card-text">Raça: ${animal.raca}<br>Sexo: ${animal.sexo}</p>
                            </div>
                        </div>
                    `;

                    container.appendChild(col);
                });
            }
        })
        .catch(error => console.error(error.message));
}

function selecionarAnimalJSON(json) {
    const animal = JSON.parse(decodeURIComponent(json));
    const previewDiv = document.getElementById("animalSelecionado");

    const imagemHtml = `<img src="data:image/jpeg;base64,${animal.imagemBase64}" width="90" height="90" class="rounded object-fit-cover" style="object-fit: cover;">`;

    previewDiv.innerHTML = `
      <div class="d-flex justify-content-between align-items-center p-3 mb-3 rounded shadow-sm bg-white">
        <div class="d-flex align-items-center gap-3">
          ${imagemHtml}
          <div style="font-size: 0.95rem;">
            <strong style="font-size: 1.05rem;">${animal.nome}</strong><br>
            Raça: ${animal.raca || 'Não informada'}<br>
            Sexo: ${animal.sexo || 'Não informado'}
          </div>
        </div>
        <div class="d-flex flex-column align-items-end">
          <button class="btn btn-sm btn-outline-danger" onclick="removerAnimalSelecionado()">Remover</button>
        </div>
      </div>
    `;

    previewDiv.classList.remove("d-none");

    // Atualiza input hidden com o ID
    document.getElementById("animalId").value = animal.codAnimal;

    // Fecha o modal
    const modalAnimaisEl = document.getElementById("modalAnimais");
    const modal = bootstrap.Modal.getInstance(modalAnimaisEl);
    if (modal) {
        modal.hide();
    }

    // (Opcional) Salva no localStorage
    localStorage.setItem("animalSelecionado", JSON.stringify(animal));
}

function removerAnimalSelecionado() {
    const previewDiv = document.getElementById("animalSelecionado");
    previewDiv.innerHTML = "";
    previewDiv.classList.add("d-none");

    document.getElementById("animalId").value = "";

    // Remove do localStorage também
    localStorage.removeItem("animalSelecionado");
}



