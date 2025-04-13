let animais = [
    {
      nome: "Thor",
      sexo: "Macho",
      castrado: "Sim",
      raca: "Labrador",
      idade: "2 anos",
      peso: "25 kg",
      imagem: "../img/labrador.jpg"
    },
    {
      nome: "Luna",
      sexo: "Fêmea",
      castrado: "Não",
      raca: "Poodle",
      idade: "4 anos",
      peso: "10 kg",
      imagem: "../img/poddle.jpg"
    }
   
  ];
  
  function listarAnimaisAdocao() {
    const container = document.getElementById("listaAnimais");
    container.innerHTML = "";
  
    animais.forEach(animal => {
      container.innerHTML += `
        <div class="card mb-3 shadow-sm" style="border-radius: 15px;">
          <div class="row g-0">
            <div class="col-md-3 d-flex align-items-center justify-content-center p-2">
              <img src="${animal.imagem}" class="img-fluid rounded" style="max-height: 180px;" alt="Foto do Animal">
            </div>
            <div class="col-md-9">
              <div class="card-body">
                <h5 class="card-title"><strong>Nome:</strong> ${animal.nome}</h5>
                <p class="card-text mb-1"><strong>Sexo:</strong> ${animal.sexo}</p>
                <p class="card-text mb-1"><strong>Castrado:</strong> ${animal.castrado}</p>
                <p class="card-text mb-1"><strong>Raça:</strong> ${animal.raca}</p>
                <p class="card-text mb-1"><strong>Idade:</strong> ${animal.idade}</p>
                <p class="card-text mb-1"><strong>Peso:</strong> ${animal.peso}</p>
                <button class="btn btn-primary mt-2" onclick="selecionarAnimal('${animal.id}')">Selecionar</button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
  }
  
  
  
  