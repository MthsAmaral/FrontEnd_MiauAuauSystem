function selectTpLanc(id) {
  //realizar a consulta do "Tipo Lançamento"
  let URL = "";
  URL = "http://localhost:8080/apis/tipo-lancamento/buscar/%20";
  fetch(URL, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.text();
    })
    .then(function (text) {
      let json = JSON.parse(text);
      let select = "";
      if(id){
        select = "<select class='form-select' name='codTpLanc' id='codTpLanc'>";
      }
      else{
        select = "<select class='form-select' name='codTpLanc' id='codTpLanc'> <option value='0' selected disabled hidden>Selecione uma opção</option>";
      } 

      for (let i = 0; i < json.length; i++) {
        if(id==json[i].cod){
          select += `
            <option value='${json[i].cod}' selected>${json[i].descricao}</option>
          `;
        }
        else{
          select += `
            <option value='${json[i].cod}'>${json[i].descricao}</option>
          `;
        }
      }
      select += "</select>";
      //setar o Tipo Lançamento
      document.getElementById("tipoLancSelect").innerHTML = select;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function selectAnimal(id) {
  //realizar a consulta do "Animal"
  let URL = "";
  URL = "http://localhost:8080/apis/animal/buscar/%20";
  fetch(URL, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.text();
    })
    .then(function (text) {
      let json = JSON.parse(text);
      let select = "";
      if(id){
        select = "<select class='form-select' name='codAnimal' id='codAnimal'>";
      }
      else{
        select = "<select class='form-select' name='codAnimal' id='codAnimal'> <option value='0' selected >Selecione (Opcional)</option>";
      }

      for (let i = 0; i < json.length; i++) {
        if(id==json[i].codAnimal){
          select += `
            <option value='${json[i].codAnimal}' selected>${json[i].nome}</option>
          `;
        }
        else{
          select += `
            <option value='${json[i].codAnimal}'>${json[i].nome}</option>
          `;
        }
      }
      select += "</select>";
      //setar o Tipo Lançamento
      document.getElementById("animalSelect").innerHTML = select;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function selectDebCred(deb, cred) {
  //realizar a consulta do "Crédito" e "Débito"
  let URL = "";
  URL = "http://localhost:8080/apis/tipo-pagamento/buscar/%20";
  fetch(URL, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.text();
    })
    .then(function (text) {
      let json = JSON.parse(text);
      let selectDebito = "";
      let selectCredito = "";
      if(deb){ //se tiver algum código por parâmetro, quer dizer que algo já foi selecionado
        selectDebito = "<select class='form-select' name='debito' id='debito'>";
      }
      else{ //se não á para selecionar pela primeira vez
        selectDebito = "<select class='form-select' name='debito' id='debito'> <option value='0' selected disabled hidden>Selecione uma opção</option>";
      }
      //mesmo esquema do de cima
      if(cred){
        selectCredito = "<select class='form-select' name='credito' id='credito'>";
      }
      else{
        selectCredito = "<select class='form-select' name='credito' id='credito'> <option value='0' selected disabled hidden>Selecione uma opção</option>";
      }

      for (let i = 0; i < json.length; i++) {
        if(deb == json[i].cod){ //se achei o respectivo código recebido, então o deixo como selecionado
          selectDebito += `
            <option value='${json[i].cod}' selected>${json[i].descricao}</option>
          `;
        }
        else{ //se não apenas insiro uma nova option para o meu select
          selectDebito += `
            <option value='${json[i].cod}'>${json[i].descricao}</option>
          `;
        }
        //mesmo esquema do débito
        if(cred == json[i].cod){
          selectCredito += `
            <option value='${json[i].cod}' selected>${json[i].descricao}</option>
          `;
        }
        else{
          selectCredito += `
            <option value='${json[i].cod}'>${json[i].descricao}</option>
          `;
        }
      }
      selectDebito += "</select>";
      selectCredito += "</select>";
      //setando o débito
      document.getElementById("debitoSelect").innerHTML = selectDebito;
      //setando o crédito
      document.getElementById("creditoSelect").innerHTML = selectCredito;
    })
    .catch(function (error) {
      console.error(error);
    });
}

function buscarSelects() {
  selectTpLanc("");
  selectAnimal("");
  selectDebCred("", "");
}

function validarCadastrar() {
  let codTpLanc = document.getElementById("codTpLanc").value;
  let codDebito = document.getElementById("debito").value;
  let codCredito = document.getElementById("credito").value;
  let valor = document.getElementById("valor").value;
  let dataRecebida = new Date(document.getElementById("data").value);
  let dataAtual = new Date();

  let flag = false;
  if (codTpLanc == 0) {
    flag = true;
  }
  if (codDebito == 0) {
    flag = true;
  }
  if (codCredito == 0) {
    flag = true;
  }
  if (valor < 0) {
    flag = true;
  }
  if(dataRecebida > dataAtual){//se data maior que a atual
    flag = true;
  }

  if (!flag) {
    let id = document.getElementById("id").value;
    if(id){
      editarLancamento();
    }
    else{
      cadLancamento();
    }
  }
}

function cadLancamento() {
  // //antes de gravar de fato um lançamento, preciso buscar os devidos códigos de:
  // //Tipo Lançamento
  // //Animal
  // //Tipo Pagamento -> Crédito e Débito
  // setarCodTpLanc();
  // setarCodAnimal();
  // setarCodCredDeb();

  let URL = "http://localhost:8080/apis/lancamento/gravar";
  let formData = new FormData(document.getElementById("formLanc"));
  console.log(formData);

  //tratar a data, excluir e inserir no formato que quero
  formData.delete("data");
  console.log(formData);
  //formData.append("data", document.getElementById("data").value);
  let dataInput = document.getElementById("data").value;
  // Converte de "aaaa-mm-dd" para "dd/mm/aaaa"
  const partes = dataInput.split("-");
  const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
  formData.append("data", dataFormatada);
  console.log(formData);

  fetch(URL, {
    method: 'POST',
    body: formData
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      alert("Resposta do servidor: " + JSON.stringify(json));
      document.getElementById("formLanc").reset();
    })
    .catch((error) => console.error("Erro ao CADASTRAR dados:", error));
}

function buscarLancamentos() {
  let URL = "http://localhost:8080/apis/lancamento/buscar/%20";

  fetch(URL, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.text();
    })
    .then(function (text) {
      var json = JSON.parse(text); // Converte a resposta JSON
      var table = "";

      for (let i = 0; i < json.length; i++) {
        // Inicializa variáveis para acessar as propriedades aninhadas com segurança
        const descricaoTpLanc = json[i].TpLanc ? json[i].TpLanc.descricao : '-';
        const nomeAnimal = json[i].animal ? json[i].animal.nome : '-';
        const descricaoDebito = json[i].debito ? json[i].debito.descricao : '-';
        const descricaoCredito = json[i].credito ? json[i].credito.descricao : '-';

        table += `
          <tr>
            <td>${json[i].cod}</td>
            <td>${json[i].data}</td>
            <td>${json[i].descricao}</td>
            <td>${descricaoTpLanc}</td>
            <td>${nomeAnimal}</td>
            <td>${descricaoDebito}</td>
            <td>${descricaoCredito}</td>
            <td>${json[i].valor}</td>
            <td><a href="http://localhost:8080/apis/lancamento/arquivo/${json[i].cod}" target="_blank">PDF</a></td>
            <td>
              <button type="button" class="btn btn-sm btn-warning" onclick="editarLancamentoID(${json[i].cod})"><i class="bi bi-pencil-square"></i></button>
            </td>
            <td>
              <button type="button" class="btn btn-sm btn-danger" onclick="excluirLancamento(${json[i].cod})"><i class="bi bi-trash"></i></button>
            </td>
          </tr>`;
      }
      document.getElementById("resultado").innerHTML = table; // Exibe a tabela no elemento "resultado"
    })
    .catch(function (error) {
      console.error(error); // Exibe erros, se houver
    });
}

function excluirLancamento(id) {
  let URL = "http://localhost:8080/apis/lancamento/excluir/" + id;

  fetch(URL, { method: 'DELETE' })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      alert("Resposta do servidor: " + JSON.stringify(json));
      window.location.reload();
    })
    .catch((error) => console.error("Erro ao EXCLUIR dados:", error));
}

function editarLancamento() {
  const URL = "http://localhost:8080/apis/lancamento/atualizar";
  document.getElementById("id").disabled = false;
  const fLancamento = document.getElementById("formLanc");
  let formData = new FormData(fLancamento);
  document.getElementById("id").disabled = true;
  console.log(formData);

  formData.delete("data");
  console.log(formData); //exibição sem a data
  //formData.append("data", document.getElementById("data").value);
  let dataInput = document.getElementById("data").value;
  // Converte de "aaaa-mm-dd" para "dd/mm/aaaa"
  const partes = dataInput.split("-");
  const dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
  formData.append("data", dataFormatada);
  console.log(formData); //exibição com a data formatada

  fetch(URL, {
    method: 'PUT',
    body: formData,
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      alert("Resposta do servidor: " + JSON.stringify(json));
      window.location.href = "../TelasGerenciar/gerenLancamentos.html";
    })
    .catch((error) => console.error("Erro ao ATUALIZAR dados:", error));
}

function editarLancamentoID(id) {
  window.location.href = "../TelasFundamentais/realizarLancamentos.html?cod=" + id;
}

function buscarLancID(id) {
  let url = "http://localhost:8080/apis/lancamento/buscar-id/" + id;
  document.getElementById("inputId").hidden = false;

  fetch(url, {
    method: 'GET',
    redirect: "follow"
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      document.getElementById("id").value = id;
      document.getElementById("descricao").value = json.descricao;
      document.getElementById("data").value = json.data;
      document.getElementById("valor").value = json.valor;
      //tratar o PDF
      let link = document.createElement('a');
      link.href = `http://localhost:8080/apis/lancamento/arquivo/${json.cod}`;
      link.target = '_blank';
      link.textContent = 'PDF Atual';

      let pdfAtualDiv = document.getElementById("pdfAtual");
      pdfAtualDiv.appendChild(link);
      pdfAtualDiv.hidden = false;

      selectTpLanc(json.TpLanc.cod);
      if (json.animal && json.animal.codAnimal) {
        selectAnimal(json.animal.codAnimal);
      }
      else{
        selectAnimal("");
      }
      selectDebCred(json.debito.cod, json.credito.cod);
    })
    .catch(function (error) {
      console.error("Erro ao buscar o Tipo de Lançamento" + error); // Exibe erros, se houver
    });
}
