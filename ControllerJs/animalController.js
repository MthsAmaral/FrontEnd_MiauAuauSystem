function limparForm() {
    var fdados = document.getElementById("fanimal");
    fdados.nome.value = "";
    fdados.raca.value = "";
    fdados.dataNascimento.value = "";
    fdados.peso.value = "";
    fdados.adotado.value = "";
    fdados.sexo.value = "";
    fdados.castrado.value = "";
    fdados.imagemBase64.value = "";
    fdados.cor = "";
    fdados.especie = "";
    document.getElementById('file-name').textContent = 'Selecionar Foto';
}
function validarImagem(imagem) {

    let flag = 0;
    if (imagem.endsWith(".jpeg") || imagem.endsWith(".jpg"))
        flag = 1;
    return flag;
}

function validarData(dataString) 
{
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
    ) 
    {
      return false; 
    }
  
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    data.setHours(0, 0, 0, 0);
  
    if (data > hoje)
    {
      return false; 
    }
  
    return true; 
}

function validarCampos() {
    const nome = document.getElementById("nome").value;
    const sexo = document.getElementById("sexo").value;
    const raca = document.getElementById("raca").value;
    const dataNascimento = document.getElementById("dataNascimento").value;
    const peso = document.getElementById("peso").value;
    const castrado = document.getElementById("castrado").value;
    const adotado = document.getElementById("adotado").value;
    const imagem = document.getElementById("imagemBase64").value;
    const cor = document.getElementById("cor").value;
    const especie = document.getElementById("especie").value;
    
    if (nome != "" && sexo != "" && raca != "" && dataNascimento != "" && peso > 0 && castrado != "" && adotado != "" && cor != "" && especie != "") {
        
        if (validarData(dataNascimento))
        {
            if (imagem != "") {
                if (validarImagem(imagem))
                    cadAnimal();
                else
                {
                    Swal.fire({
                        icon: "warning",
                        title: "Tipo de Arquivo Não Permitido. Apenas .jpeg ou .jpg são permitidos",
                        timer: 2500,
                        timerProgressBar: true
                      })
                   
                }
            }
            else
            {
                cadAnimal();
            }
        }
        else
        {
            Swal.fire({
                icon: "warning",
                title: "Data Inválida",
                timer: 1500,
                timerProgressBar: true
              })
        }
    }
    else {
        
        Swal.fire({
          icon: "warning",
          title: "Campo(s) Não Preenchido(s)",
          timer: 1500,
          timerProgressBar: true
        })
    }
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
                if(!response.ok)
                {
                    sessionStorage.setItem('animalAlterado', 'false');
                }
                else
                {
                    sessionStorage.setItem('animalAlterado', 'true');
                }
                fanimal.reset();
                window.location.href = "../TelasGerenciar/gerenAnimais.html";
                return response.json();
              
            })
            .then((json) => {

            
            })
            .catch((error) => console.error(error))

    }
    else {
        const URL = "http://localhost:8080/apis/animal/gravar"
        fetch(URL, {
            method: 'POST', body: formData
        })
            .then((response) => {
                
                if(!response.ok)
                {
                    sessionStorage.setItem('animalGravado', 'false');
                }
                else
                {
                    sessionStorage.setItem('animalGravado', 'true');
                }
                fanimal.reset();
                window.location.href = "../TelasGerenciar/gerenAnimais.html";
                return response.json();
            })
            .then((json) => {
                
                
            })
            .catch((error) => console.error(error))
    }
    limparForm();
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


                for (let i = 0; i < json.length; i++)
                {
                    const dataOriginal = json[i].dataNascimento;
                    const [year, month, day] = dataOriginal.split('-'); 
                    const dataFormatada = `${day}/${month}/${year.slice(-2)}`;  
                    table += `<tr>
                        <td>${json[i].codAnimal}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].raca}</td>
                        <td>${dataFormatada}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].peso} kg</td>
                        <td>${json[i].castrado}</td>
                        <td>${json[i].adotado}</td>
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Imagem do animal" style="width: 100px; height: 100px; object-fit: cover;">
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
                for (let i = 0; i < json.length; i++) 
                {
                    const dataOriginal = json[i].dataNascimento;
                    const [year, month, day] = dataOriginal.split('-'); 
                    const dataFormatada = `${day}/${month}/${year.slice(-2)}`; 
                    table += `<tr>
                        <td>${json[i].codAnimal}</td>
                        <td>${json[i].nome}</td>
                        <td>${json[i].raca}</td>
                        <td>${dataFormatada}</td>
                        <td>${json[i].sexo}</td>
                        <td>${json[i].peso} kg</td>
                        <td>${json[i].castrado}</td>
                        <td>${json[i].adotado}</td>
                        <td>
                        <img src="data:image/jpeg;base64,${json[i].imagemBase64}" alt="Imagem do animal" style="width: 100px; height: 100px; object-fit: cover;">
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
        if (result.isConfirmed) 
        {

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
                    Toast.fire({
                        icon: 'error',
                        title: 'Erro ao Excluir o Animal!',
                      });
                else
                {
                    sessionStorage.setItem('animalApagado', 'true');
                    window.location.reload();
                }
                    
                return response.json();
            })
            .then((json) => {
                
            })
            .catch((error) => {
                console.error("Erro ao excluir o animal:", error);
            });

        }
      });
        
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

                window.location.href = "../TelasGerenciar/gerenAnimais.html";
                throw new Error("Erro ao buscar o animal: " + response.status);
                
            }
            return response.json();
        })
        .then((json) => {
            document.getElementById('codAnimal').value = id;
            document.getElementById('nome').value = json.nome;
            document.getElementById('raca').value = json.raca;
            document.getElementById('dataNascimento').value = json.dataNascimento;
            document.getElementById('peso').value = json.peso;
            document.getElementById('sexo').value = json.sexo;
            document.getElementById('castrado').value = json.castrado;
            document.getElementById('adotado').value = json.adotado;
            document.getElementById('cor').value = json.cor;
            document.getElementById('especie').value = json.especie;
        })
        .catch((error) => {
            console.error("Erro ao buscar o animal:", error);
        });

}
