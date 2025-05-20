document.addEventListener("DOMContentLoaded", () => {
  //carregarAgendamentos();
  carregarAnimais();
  //carregarLancamentos();
});









//modal animal

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

            // Verifica se a lista está vazia
            if (lista.length === 0) {
                const mensagem = document.createElement("div");
                mensagem.className = "alert alert-info";
                mensagem.textContent = "Nenhum animal encontrado com esse filtro.";
                container.appendChild(mensagem);
            } else {
                lista.forEach(animal => {
                    const col = document.createElement("div");
                    col.className = "col-md-4 mb-3";

                    col.innerHTML = `
                        <div class="card card-select" style="cursor: pointer;" onclick="selecionarAnimal(${animal.codAnimal}, '${animal.nome}', '${animal.imagemAnimal}')">
                        <img src="data:image/jpeg;base64,${animal.imagemAnimal}" class="card-img-top" alt="${animal.nome}" style="height: 180px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title text-center">${animal.nome}</h5>
                        </div>
                        </div>
                    `;

                    container.appendChild(col);
                });
            }
        })
        .catch(error => console.error(error.message));
}

function selecionarAnimal(codAnimal, nome, imagemBase64) {
    const previewDiv = document.getElementById("animalSelecionado");
    previewDiv.innerHTML = `
    <div class="card card-select p-0 position-relative" style="width: 180px;">
        <img src="data:image/jpeg;base64,${imagemBase64}" class="card-img-top" alt="${nome}" style="height: 180px; object-fit: cover;">
        <div class="card-body p-2">
        <h5 class="card-title text-center mb-0">${nome}</h5>
        </div>
        <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" title="Remover" onclick="removerAnimalSelecionado()">
        &times;
        </button>
    </div>
    `;

    previewDiv.classList.remove("d-none");

    // Atualiza o input hidden com o ID do animal
    document.getElementById("animalId").value = codAnimal;

    // Fecha o modal automaticamente
    const modalAnimaisEl = document.getElementById("modalAnimais");
    const modal = bootstrap.Modal.getInstance(modalAnimaisEl);
    if (modal) {
        modal.hide();
    }
}

function removerAnimalSelecionado() {
    const previewDiv = document.getElementById("animalSelecionado");
    previewDiv.innerHTML = "";
    previewDiv.classList.add("d-none");

    // Limpa o input hidden
    document.getElementById("animalId").value = "";
}
