function verificaTpLanc() {
  let tipoLanc = document.getElementById("codTpLanc");
  let msg = document.getElementById("tipoLanc-msg");

  if (parseInt(tipoLanc.value) == 0) {
    tipoLanc.style.border = "2px solid red";
    msg.style.display = "block";
    msg.textContent = "Nenhum Tipo de Lançamento Selecionado";
  } else {
    tipoLanc.style.border = "";
    msg.style.display = "none";
    msg.textContent = "";
  }
}

function verificaDebito() {
  let debito = document.getElementById("debito");
  let msg = document.getElementById("debito-msg");

  if (parseInt(debito.value) == 0) {
    debito.style.border = "2px solid red";
    msg.style.display = "block";
    msg.textContent = "Nenhum Débito Selecionado";
  } else {
    debito.style.border = "";
    msg.style.display = "none";
    msg.textContent = "";
  }
}

function verificaCredito() {
  let credito = document.getElementById("credito");
  let msg = document.getElementById("credito-msg");

  if (parseInt(credito.value) == 0) {
    credito.style.border = "2px solid red";
    msg.style.display = "block";
    msg.textContent = "Nenhum Crédito Selecionado";
  } else {
    credito.style.border = "";
    msg.style.display = "none";
    msg.textContent = "";
  }
}

function verificaAnimal() {
  let animal = document.getElementById("codAnimal");
  let msg = document.getElementById("animal-msg");

  if (parseInt(animal.value) == 0) {
    animal.style.border = "2px solid gold";
    msg.style.display = "block";
    msg.textContent = "Nenhum animal selecionado";
  } else {
    animal.style.border = "";
    msg.style.display = "none";
    msg.textContent = "";
  }
}

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
      if (id) {
        select = "<select class='form-select' name='codTpLanc' id='codTpLanc' onmousedown='verificaTpLanc()'>";
      }
      else {
        select = "<select class='form-select' name='codTpLanc' id='codTpLanc' onmousedown='verificaTpLanc()'> <option value='0' selected disabled hidden>Selecione uma opção</option>";
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
      if (id) {
        select = "<select class='form-select' name='codAnimal' id='codAnimal' onmousedown='verificaAnimal()'>";
      }
      else {
        select = "<select class='form-select' name='codAnimal' id='codAnimal' onmousedown='verificaAnimal()'> <option value='0' selected >Selecione (Opcional)</option>";
      }

      for (let i = 0; i < json.length; i++) {
        if (id == json[i].codAnimal) {
          select += `
            <option value='${json[i].codAnimal}' selected>${json[i].nome}</option>
          `;
        }
        else {
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
      if (deb) { //se tiver algum código por parâmetro, quer dizer que algo já foi selecionado
        selectDebito = "<select class='form-select' name='debito' id='debito' onmousedown='verificaDebito()'>";
      }
      else { //se não á para selecionar pela primeira vez
        selectDebito = "<select class='form-select' name='debito' id='debito' onmousedown='verificaDebito()'> <option value='0' selected disabled hidden>Selecione uma opção</option>";
      }
      //mesmo esquema do de cima
      if (cred) {
        selectCredito = "<select class='form-select' name='credito' id='credito' onmousedown='verificaCredito()'>";
      }
      else {
        selectCredito = "<select class='form-select' name='credito' id='credito' onmousedown='verificaCredito()'> <option value='0' selected disabled hidden>Selecione uma opção</option>";
      }

      for (let i = 0; i < json.length; i++) {
        if (deb == json[i].cod) { //se achei o respectivo código recebido, então o deixo como selecionado
          selectDebito += `
            <option value='${json[i].cod}' selected>${json[i].descricao}</option>
          `;
        }
        else { //se não apenas insiro uma nova option para o meu select
          selectDebito += `
            <option value='${json[i].cod}'>${json[i].descricao}</option>
          `;
        }
        //mesmo esquema do débito
        if (cred == json[i].cod) {
          selectCredito += `
            <option value='${json[i].cod}' selected>${json[i].descricao}</option>
          `;
        }
        else {
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
  document.getElementById("formLanc").reset();
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
  if (valor <= 0) {
    flag = true;
  }
  if (dataRecebida > dataAtual) {//se data maior que a atual
    flag = true;
  }

  if (!flag) {
    let id = document.getElementById("id").value;
    if (id) {
      editarLancamento();
    }
    else {
      cadLancamento();
    }
  }
  else {
    //exibir um alert aqui
    Swal.fire({
      icon: "error",
      title: "Possui campos inválidos",
      timer: 1500,
      timerProgressBar: true
    });
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
      if (response.ok)
        set.local
      return response.json();
    })
    .then((json) => {
      //alert modificado aqui
      Swal.fire({
        icon: "success",
        title: "Lançamento Gravado com Sucesso",
        timer: 1500,
        timerProgressBar: true
      });
      //alert("Resposta do servidor: " + JSON.stringify(json));
      console.log("Resposta do servidor: " + JSON.stringify(json));
      document.getElementById("formLanc").reset();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Erro ao cadastrar!!",
        timer: 1500,
        timerProgressBar: true
      })
      console.error("Erro ao CADASTRAR dados:", error);
    });
}

function buscarLancamentosFiltro(filtro) {
  let URL = "http://localhost:8080/apis/lancamento/buscar/" + filtro;

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

        // Verifica se a chave "arquivo" não é nula para decidir se cria o link ou não
        const linkPDF = json[i].arquivo
          ? `<a href="http://localhost:8080/apis/lancamento/arquivo/${json[i].cod}" target="_blank">PDF</a>`
          : '<span>-</span>'; // Ou qualquer outra marcação de texto ou elemento vazio

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
              <td>${linkPDF}</td>
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

        // Verifica se a chave "arquivo" não é nula para decidir se cria o link ou não
        const linkPDF = json[i].arquivo
          ? `<a href="http://localhost:8080/apis/lancamento/arquivo/${json[i].cod}" target="_blank">PDF</a>`
          : '<span>-</span>'; // Ou qualquer outra marcação de texto ou elemento vazio

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
              <td>${linkPDF}</td>
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
      Swal.fire({
        icon: "success",
        title: JSON.stringify(json),
        timer: 1500,
        timerProgressBar: true
      });
      //alert("Resposta do servidor: " + JSON.stringify(json));
      window.location.reload();
    })
    .catch((error) => {
      Swal.fire({
        icon: "error",
        title: "Erro ao excluir!!",
        timer: 1500,
        timerProgressBar: true
      });
      console.error("Erro ao EXCLUIR dados:", error);
    });
}

async function editarLancamento() {
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

  //tratar PDF
  let pdfAtualDiv = document.getElementById("pdfAtual");
  let pdfInput = document.getElementById("pdf");

  // Verifica se há um PDF novo (upload do usuário)
  if (pdfAtualDiv.hidden === false) {
    if (pdfInput.files.length > 0) {
      // Há um novo arquivo enviado pelo usuário — usa esse
      formData.set("pdf", pdfInput.files[0]);
    } else {
      // Nenhum novo arquivo — busca o atual com fetch e adiciona no formData
      let linkPDF = pdfAtualDiv.querySelector("a");
      if (linkPDF) {
        await fetch(linkPDF.href)
          .then(res => res.blob())
          .then(blob => {
            let nomeArquivo = linkPDF.href.split("/").pop(); // ou um nome padrão
            formData.set("pdf", new File([blob], nomeArquivo, { type: blob.type }));
          });
      }
    }
  } else {
    // pdfAtual está hidden → nada a fazer, não adiciona pdf
  }
  console.log(formData);

  try {
    const response = await fetch(URL, {
      method: 'PUT',
      body: formData,
    });
    const json = await response.json();

    Swal.fire({
      icon: "success",
      title: "Lançamento editado com Sucesso!",
      timer: 1500,
      timerProgressBar: true
    });
    console.log("Resposta do servidor: " + JSON.stringify(json));
    window.location.href = "../TelasGerenciar/gerenLancamentos.html";
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Erro ao editar o Lançamento!!",
      timer: 1500,
      timerProgressBar: true
    });
    console.error("Erro ao ATUALIZAR dados:", error);
  }
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

      // Supondo que você já tenha o objeto `json` do lançamento que está sendo editado
      let pdfAtualDiv = document.getElementById("pdfAtual");

      // Limpa qualquer conteúdo anterior antes de adicionar algo novo
      pdfAtualDiv.innerHTML = "";

      // Verifica se há um arquivo existente
      if (json.arquivo) {
        let link = document.createElement('a');
        link.href = `http://localhost:8080/apis/lancamento/arquivo/${json.cod}`;
        link.target = '_blank';
        link.textContent = 'PDF Atual';

        pdfAtualDiv.appendChild(link);
        pdfAtualDiv.hidden = false;
      } else {
        // Se não houver arquivo, mantemos a div escondida
        pdfAtualDiv.hidden = true;
      }

      selectTpLanc(json.TpLanc.cod);
      if (json.animal && json.animal.codAnimal) {
        selectAnimal(json.animal.codAnimal);
      }
      else {
        selectAnimal("");
      }
      selectDebCred(json.debito.cod, json.credito.cod);
    })
    .catch(function (error) {
      console.error("Erro ao buscar o Tipo de Lançamento" + error); // Exibe erros, se houver
    });
}
