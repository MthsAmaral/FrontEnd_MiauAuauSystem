function verificarPrivilegio()
{
    const token = localStorage.getItem("token");
    if (token)
    {  
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64)); 
      const now = Math.floor(Date.now() / 1000); 
      let flag = 1;
      if (payload.exp && payload.exp < now)
      {
        Swal.fire({
          icon: "error",
          title: "Sessão Expirada",
          text: "Por favor, faça login novamente.",
          confirmButtonText: "Ok"
        }).then(() => {
          logout(); 
        });
        flag = 0;
      }
      if (flag == 1)
      {
        const userMenu = document.getElementById("userMenu");
        const dropdownMenu = document.querySelector(".dropdown-menu-auaumiau");
        userMenu.innerHTML = `<i class="fa-solid fa-user"></i> Olá, ${payload.usuario}`;
        dropdownMenu.innerHTML = `
        <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaMinhasAdocoes.html">Minhas Adoções</a></li>
        <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaMinhasDoacoes.html">Minhas Doações</a></li>
        <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaDados.html">Dados Pessoais</a></li>
        <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaAlterarSenha.html">Alterar Senha</a></li>
        <li><a class="dropdown-item-auaumiau" href="#" onclick="logout()">Sair</a></li>`;
        if (payload.privilegio == 'A')
        {
           const menu = document.getElementById('nav');
           if (menu)
           {
              const li = document.createElement('li');
              li.classList.add('acesso-restrito');
              li.innerHTML = `<a href="indexAdm.html"><i class="fa-solid fa-key"></i> Acesso Restrito</a>`;
              menu.appendChild(li);
           }
           
        }
      }
      
    }
}
function verificarPrivilegioIndexAdm()
{
  const token = localStorage.getItem("token");
  if (token)
  {  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64)); 
    const now = Math.floor(Date.now() / 1000); 
    let flag = 1;
    if (payload.exp && payload.exp < now)
    {
      Swal.fire({
        icon: "error",
        title: "Sessão Expirada",
        text: "Por favor, faça login novamente.",
        confirmButtonText: "Ok"
      }).then(() => {
        logout(); 
      });
      flag = 0;
    }
    if (flag == 1)
    {
       const userMenu = document.getElementById("userMenu");
       const dropdownMenu = document.querySelector(".dropdown-menu-auaumiau");
       userMenu.innerHTML = `<i class="fa-solid fa-user"></i> Olá, ${payload.usuario}`;
       dropdownMenu.innerHTML = `
       <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaMinhasAdocoes.html">Minhas Adoções</a></li>
       <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaMinhasDoacoes.html">Minhas Doações</a></li>
       <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaDados.html">Dados Pessoais</a></li>
       <li><a class="dropdown-item-auaumiau" href="./TelasFundamentais/telaAlterarSenha.html">Alterar Senha</a></li>
       <li><a class="dropdown-item-auaumiau" href="#" onclick="logout()">Sair</a></li>`;
       if (payload.privilegio != 'A')
       {
         window.location.href = "./index.html";
         sessionStorage.setItem('acessoNegado', 'true');
       }
       
    }
      
  }
  else
  {
    window.location.href = "./index.html";
    sessionStorage.setItem('usuarioNaoAutenticado', 'true');
  }
}
function verificarPrivilegioTelas()
{
  const token = localStorage.getItem("token");
  if (token)
  {  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64)); 
    const now = Math.floor(Date.now() / 1000); 
    let flag = 1;
    if (payload.exp && payload.exp < now)
    {
      Swal.fire({
        icon: "error",
        title: "Sessão Expirada",
        text: "Por favor, faça login novamente.",
        confirmButtonText: "Ok"
      }).then(() => {
        logout(); 
      });
      flag = 0;
    }
    if (flag == 1)
    {
       const userMenu = document.getElementById("userMenu");
       const dropdownMenu = document.querySelector(".dropdown-menu-auaumiau");
       userMenu.innerHTML = `<i class="fa-solid fa-user"></i> Olá, ${payload.usuario}`;
       dropdownMenu.innerHTML = `
       <li><a class="dropdown-item-auaumiau" href="../TelasFundamentais/telaMinhasAdocoes.html">Minhas Adoções</a></li>
       <li><a class="dropdown-item-auaumiau" href="../TelasFundamentais/telaDados.html">Dados Pessoais</a></li>
       <li><a class="dropdown-item-auaumiau" href="../TelasFundamentais/telaAlterarSenha.html">Alterar Senha</a></li>
       <li><a class="dropdown-item-auaumiau" href="#" onclick="logout()">Sair</a></li>`;
       if (payload.privilegio != 'A')
       {
         window.location.href = "../index.html";
         sessionStorage.setItem('acessoNegado', 'true');
       }
    }
      
  }
  else
  {
    window.location.href = "../index.html";
    sessionStorage.setItem('usuarioNaoAutenticado', 'true');
  }
}
function logout() 
{
    localStorage.removeItem("token"); 
    window.location.reload(); 
}

async function validarEmail(email)
{
  const url = "http://localhost:8080/apis/usuario/buscar-email/"+email;
  const cod_usuario = document.getElementById("cod").value;
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: "follow"
    });
    const text = await response.text();
    const json = JSON.parse(text);

    if (cod_usuario) // alteracao
    {
      if (json.email == email && json.cod == cod_usuario) // pertence ao usuario
      {
        return 1; 
      }
      else
      if(json.email == email && json.cod != cod_usuario) // nao pertence ao usuario
      {

        return 0;
      }
      else 
      if(json.email != email)
      {
        return 1;
      }

    }
    else
    {
      if (json.email == email)
      {
        return 0; 
      }
      else
      {
        return 1;
      }
    }
  } 
  catch (error) {
    console.error("Erro ao validar o email:", error);
  }
}
async function validarCPF(cpf)
{
  const url = "http://localhost:8080/apis/usuario/buscar-cpf/"+cpf;

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: "follow"
    });
    const text = await response.text();
    const json = JSON.parse(text);

    if (json.cpf == cpf)
    {
      return 0; 
    }
    else
    {
      return 1; 
    }
  } 
  catch (error) {
    console.error("Erro ao validar o cpf:", error);
  }
}
function validarSubmit()
{
  const formid = document.getElementById("fid");
  const formcad = document.getElementById("fusuario");
  const formsenha = document.getElementById("fsenha");
  if (formcad != null)
  {
      formcad.addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = event.target;
      const cod_usuario = document.getElementById("cod").value;
      let flag = 1;
      if(cod_usuario)
      {
        if (form.querySelector(".is-invalid"))
        {
          flag = 0;
        }
        if (flag == 1)
        {
          if (form.checkValidity())
          {
            const email = document.getElementById("email").value;
            const emailValido = await validarEmail(email);
            if(emailValido) 
            {
              cadusuario();   
            }
            else
            {
              Swal.fire({
                icon: "error",
                title: "Este e-mail já está vinculado a uma conta. Faça Login",
                timer: 1500,
                timerProgressBar: true
              })
              
              document.getElementById("email").value = "";
            }
            
          }
          else
          {
            form.classList.add('was-validated')
          }
        }
      }
      else
      {
        
        if (form.querySelector(".is-invalid"))
        {
          flag = 0;
        }
        if (flag == 1)
        {
          if (form.checkValidity())
          {
            const cpf = document.getElementById("cpf").value;
            const email = document.getElementById("email").value;
            const emailValido = await validarEmail(email);
            if(emailValido) 
            {
              const cpfValido = await validarCPF(cpf);
              if(cpfValido)
              {
                cadusuario(); 
              }
              else
              {
                Swal.fire({
                  icon: "error",
                  title: "Este CPF ja está vinculado a uma conta. Faça Login",
                  timer: 1500,
                  timerProgressBar: true
                })
                document.getElementById("cpf").value = "";
              }
            }
            else
            {
              Swal.fire({
                icon: "error",
                title: "Este e-mail já está vinculado a uma conta. Faça Login",
                timer: 1500,
                timerProgressBar: true
              })
              
              document.getElementById("email").value = "";
            }
            
          }
          else
          {
            form.classList.add('was-validated')
          }
        }
      }
    });  
  }
  else
  if(formid != null)
  {
      formid.addEventListener("submit", function (event) {
      event.preventDefault(); 
      const form = event.target;
      if(form.checkValidity())
      {
        logar();
      }
      else
      {
        form.classList.add('was-validated');
      }
  });
  } 
  else
  if(formsenha != null)
  {
      formsenha.addEventListener("submit", function (event) {
      event.preventDefault(); 
      const form = event.target;
      let flag = 1;
      if (form.querySelector(".is-invalid"))
      {
        flag = 0;
      }
      if (flag == 1)
      {
        if(form.checkValidity())
        {
          const senhaAtual = document.getElementById("senhaAtual").value;
          const senha = document.getElementById("senha").value;
          if(senhaAtual != senha)
          {
            Swal.fire({
                icon: "error",
                title: "Senha Atual é Inválida!",
                timer: 1500,
                timerProgressBar: true
              })  
            document.getElementById("senhaAtual").value = "";
          }
          else
          {
            const novaSenha = document.getElementById("senhaNova").value;
            document.getElementById("senha").value = novaSenha;
            cadusuario();
          }
        }
        else
        {
          form.classList.add('was-validated');
        }
      }
    });
  } 
}

function logar() {
    const URL = "http://localhost:8080/autenticacao"
    const fdados = document.getElementById("fid");
    var formData = new FormData(fdados);
    var flag = 1;
    fetch(URL, { method: 'post', body: formData })
      .then(response => {
        if (!response.ok) {
          Swal.fire({
            icon: "error",
            title: "E-mail e/ou Senha Incorreto(s)",
            timer: 1500,
            timerProgressBar: true
          })
          
          document.getElementById("senha").value = "";
          flag = 0;
        }
  
        return response.text();
      })
      .then(texto => {
        if (flag == 1){
            localStorage.setItem("token", texto)
            fdados.reset();
            window.location.href = "../index.html";
        }
        
      })
      .catch(err => alert(err.message))
}

function cadusuario()
{
  var fusuario = document.getElementById("fusuario");
  var fsenha = document.getElementById("fsenha");
  const cod_usuario = document.getElementById("cod").value;
  if (fusuario != null)
  {
    var formData = new FormData(fusuario);
    if (cod_usuario) // alteracao
    {
      const token = localStorage.getItem("token");
      if (token)
      {  
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64)); 
        const now = Math.floor(Date.now() / 1000); 
        let flag = 1;
        if (payload.exp && payload.exp < now)
        {
          Swal.fire({
            icon: "error",
            title: "Sessão Expirada",
            text: "Por favor, faça login novamente.",
            confirmButtonText: "Ok"
          }).then(() => {
            logout(); 
          });
          flag = 0;
        }
        if (flag == 1)
        {
          const cpf = document.getElementById('cpf').value
          formData.append("cpf", cpf); 
          const URL = "http://localhost:8080/apis/usuario/atualizar"
          fetch(URL, {
              method: 'PUT', body: formData, headers: { 'Authorization': token }
          })
          .then((response) => {
              if(!response.ok)
              {
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Alterar!",
                  timer: 1500,
                  timerProgressBar: true
                })
              }
              else
              {
                Swal.fire({
                icon: "success",
                title: "Dados Alterados Com Sucesso!",
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
              }).then(() => {
                location.reload();
              });

              }
              return response.json();
          })
          .then((json) => {

          })
          .catch((error) => console.error(error))
        }
          
      }
    }
    else
    {
      const URL = "http://localhost:8080/apis/usuario/gravar"
      formData.append("privilegio", "C");
      fetch(URL, {
          method: 'POST', body: formData
      })
      .then((response) => {
          if(!response.ok)
          {
            Swal.fire({
              icon: "error",
              title: "Erro ao Cadastrar!",
              timer: 1500,
              timerProgressBar: true
            })
          }
          else
          {
            sessionStorage.setItem('usuarioCadastrado', 'true');
            fusuario.reset();
            window.location.href = "../TelasFundamentais/telaLogin.html";
          }
          return response.json();
      })
      .then((json) => {

      })
      .catch((error) => console.error(error))
    }
  }
  else
  if(fsenha != null)
  {
    var formData = new FormData(fsenha);
    if (cod_usuario) // alteracao
    {
      const token = localStorage.getItem("token");
      if (token)
      {  
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64)); 
        const now = Math.floor(Date.now() / 1000); 
        let flag = 1;
        if (payload.exp && payload.exp < now)
        {
          Swal.fire({
            icon: "error",
            title: "Sessão Expirada",
            text: "Por favor, faça login novamente.",
            confirmButtonText: "Ok"
          }).then(() => {
            logout(); 
          });
          flag = 0;
        }
        if (flag == 1)
        {
          const URL = "http://localhost:8080/apis/usuario/atualizar"
          fetch(URL, {
              method: 'PUT', body: formData, headers: { 'Authorization': token }
          })
          .then((response) => {
              if(!response.ok)
              {
                Swal.fire({
                  icon: "error",
                  title: "Erro ao Alterar!",
                  timer: 1500,
                  timerProgressBar: true
                })
              }
              else
              {
                Swal.fire({
                icon: "success",
                title: "Dados Alterados Com Sucesso!",
                timer: 1500,
                timerProgressBar: true,
                showConfirmButton: false
              }).then(() => {
                location.reload();
              });

              }
              return response.json();
          })
          .then((json) => {

          })
          .catch((error) => console.error(error))
        }
          
      }
    }
  }
}
function buscarCEP()
{
  const inputCEP = document.getElementById("cep");
  const inputRua = document.getElementById("rua");
  const inputBairro = document.getElementById("bairro");
  const inputCidade = document.getElementById("cidade");
  const selectEstado = document.getElementById("estado");

  inputCEP.addEventListener("blur", () => {
  const cep = inputCEP.value.replace(/\D/g, '');
  const cepFeedback = document.getElementById("cep-feedback")
  if (cep.length == 8)
  { 
    
    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(response => response.json())
      .then(data => {
        if (!data.erro) {
          inputCEP.classList.remove("is-invalid");
          inputRua.value = data.logradouro || "";
          inputBairro.value = data.bairro || "";
          inputCidade.value = data.localidade || "";
          selectEstado.value = data.uf || "";
        }
        else
        {
          inputRua.value = "";
          inputBairro.value = "";
          inputCidade.value = "";
          selectEstado.value = "";
          inputCEP.classList.add("is-invalid");
          cepFeedback.textContent = "CEP não encontrado";
        }
      })
      .catch(() => {
        alert("Erro ao consultar o CEP.");
      });
    } 
    else
    {
      inputCEP.classList.add("is-invalid");
      cepFeedback.textContent = "Por favor, informe um CEP válido"
    }
  });
}

function validarTelefone()
{
  const inputTelefone = document.getElementById("telefone");
  inputTelefone.addEventListener("blur", () => {
  const telefone = inputTelefone.value.replace(/\D/g, '');
  if (telefone.length < 11)
  {
    inputTelefone.classList.add("is-invalid");
  } 
  else
  {
    inputTelefone.classList.remove("is-invalid");
  }
  });
}
function validarCPFCompleto(cpf)
{
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) 
    return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) 
    return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
}

function validarInputCPF()
{ 
  const inputCPF = document.getElementById("cpf");
  inputCPF.addEventListener("blur", () => {
  const cpf = inputCPF.value.replace(/\D/g, '');
  if (!validarCPFCompleto(cpf))
  {
    
    inputCPF.classList.add("is-invalid");
  } 
  else
  {
    inputCPF.classList.remove("is-invalid");
  }
  });
}
function validarSenha()
{
  const senhaNovaElem = document.getElementById("senhaNova");
  const confirmarSenhaElem = document.getElementById("senhaNova2");
  const senhaFeedback = document.getElementById("confirmar-feedback");
  const senha1 = senhaNovaElem.value;
  const senha2 = confirmarSenhaElem.value;
  if (senha1 && senha2)
  {
    if(senha1 != senha2)
    {
      confirmarSenhaElem.classList.add("is-invalid");
      senhaFeedback.textContent = "As senhas digitadas não correspondem"
    }
    else
    {
      confirmarSenhaElem.classList.remove("is-invalid");
      senhaNovaElem.classList.remove("is-invalid");
      
    }
  }
  else
  if(senha1 && !senha2)
  {
    confirmarSenhaElem.classList.add("is-invalid");
    senhaFeedback.textContent = "Campo obrigatório"
  }
}
function validarCadSenha()
 {
    const inputSenha = document.getElementById("senha");
    const senhaFeedback = document.getElementById("senha-feedback");

    inputSenha.addEventListener("blur", () => {
    const senha = inputSenha.value;

    if (senha === "")
    {
      inputSenha.classList.add("is-invalid");
      senhaFeedback.style.display = "block";
      senhaFeedback.textContent = "Campo obrigatório";
    } 
    else if (senha.length < 8)
    {
      inputSenha.classList.add("is-invalid");
      senhaFeedback.style.display = "block";
      senhaFeedback.textContent = "A senha deve ter no mínimo 8 caracteres";
    } 
    else
   {
      inputSenha.classList.remove("is-invalid");
      senhaFeedback.style.display = "none";
    }
  });
}
function buscarUsuarioPeloId()
{
    const token = localStorage.getItem("token");
    if (token)
    {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64)); 
      const now = Math.floor(Date.now() / 1000); 
      let flag = 1;
      if (payload.exp && payload.exp < now)
      {
        Swal.fire({
          icon: "error",
          title: "Sessão Expirada",
          text: "Por favor, faça login novamente.",
          confirmButtonText: "Ok"
        }).then(() => {
          logout(); 
        });
        flag = 0;
      }
      if (flag == 1)
      {
        const URL = "http://localhost:8080/apis/usuario/buscar-id/"+payload.cod_usuario;
        fetch(URL, {
            headers: {
                'Accept': 'application/json',
                'Authorization': token
            },
            method: 'GET'
        })
        .then((response) => {
        if (!response.ok) {

            window.location.href = "../index.html";
            throw new Error("Erro ao buscar o usuario: " + response.status);
            
        }
        return response.json();
        })
        .then((json) => {
            document.getElementById('cod').value = json.cod;
            document.getElementById('cpf').value = json.cpf;
            document.getElementById('nome').value = json.nome;
            document.getElementById('sexo').value = json.sexo;
            document.getElementById('email').value = json.email;
            document.getElementById('telefone').value = json.telefone;
            document.getElementById('cep').value = json.cep;
            document.getElementById('rua').value = json.rua;
            document.getElementById('cidade').value = json.cidade;
            document.getElementById('estado').value = json.estado;
            document.getElementById('bairro').value = json.bairro;
            document.getElementById('numero').value = json.numero;
            document.getElementById('senha').value = json.senha;
            document.getElementById('privilegio').value = json.privilegio;
        })
        .catch((error) => {
            console.error("Erro ao buscar o usuario:", error);
        });
      }
    }  
    else
    {
      window.location.href = "../index.html";
      sessionStorage.setItem('usuarioNaoAutenticado', 'true');
    }
    
}
function buscarAdocaoPeloUsuId()
{
  const token = localStorage.getItem("token");
  if (token)
  {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64)); 
    const now = Math.floor(Date.now() / 1000); 
    let flag = 1;
    if (payload.exp && payload.exp < now)
    {
      Swal.fire({
        icon: "error",
        title: "Sessão Expirada",
        text: "Por favor, faça login novamente.",
        confirmButtonText: "Ok"
      }).then(() => {
        logout(); 
      });
      flag = 0;
    }
    if (flag == 1)
    {
    let filtro = document.getElementById("filtro").value;
    const resultado = document.getElementById("resultado");
    if (filtro.length > 0) // busca com filtro
    {
      console.log(filtro)
      const url = `http://localhost:8080/apis/adocao/buscarAdocaoPeloUsuId/${payload.cod_usuario}/`+filtro;
      fetch(url, {
        method: 'GET', redirect: "follow", headers: { 'Authorization': token }
      })
        .then((response) => {
          return response.text();
        })
        .then(function (text) {
          var json = JSON.parse(text);

          var table = "<table border='1'>";


          for (let i = 0; i < json.length; i++) {
            const dataOriginal = json[i].data; // exemplo: "2025-05-20"
            const [ano, mes, dia] = dataOriginal.split("-");
            const dataFormatada = `${dia}/${mes}/${ano.slice(-2)}`;

            const dataNascimento = json[i].animal.dataNascimento;
            const [anoNasc, mesNasc, diaNasc] = dataNascimento.split("-");
            const nascimentoFormatado = `${diaNasc}/${mesNasc}/${anoNasc.slice(-2)}`;
            table += `<tr>
                          <td>${json[i].codAdocao}</td>
                          <td>${dataFormatada}</td>
                          <td>
                          <img src="data:image/jpeg;base64,${json[i].animal.imagemBase64}" alt="Imagem do animal" style="width: 100px; height: 100px; object-fit: cover;">
                          </td>
                          <td>${json[i].animal.nome}</td>
                          <td>${json[i].animal.raca}</td>
                          <td>${nascimentoFormatado}</td>
                          <td>
                          <span class="badge 
                            ${json[i].status === 'Aprovada' ? 'bg-success' : json[i].status === 'Cancelada' ? 'bg-danger' : 'bg-warning text-dark'} fs-6 p-2"> ${json[i].status}
                          </span>
                          </td>
                          <td>
                          ${
                            json[i].status !== 'Aprovada' && json[i].status !== 'Cancelada'
                              ? `<button type="button" class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onclick="cancelarAdocao(${json[i].codAdocao}, '${json[i].status}')">
                                  Cancelar
                                </button>`
                              : ''
                          }
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
      const url = `http://localhost:8080/apis/adocao/buscarAdocaoPeloUsuId/${payload.cod_usuario}/%20`;
      fetch(url, {
        method: 'GET', redirect: "follow", headers: { 'Authorization': token }
      })
        .then((response) => {
          return response.text();
        })
        .then(function (text) {
          var json = JSON.parse(text);

          var table = "<table border='1'>";

          for (let i = 0; i < json.length; i++) {

            const dataOriginal = json[i].data; // exemplo: "2025-05-20"
            const [ano, mes, dia] = dataOriginal.split("-");
            const dataFormatada = `${dia}/${mes}/${ano.slice(-2)}`;

            const dataNascimento = json[i].animal.dataNascimento;
            const [anoNasc, mesNasc, diaNasc] = dataNascimento.split("-");
            const nascimentoFormatado = `${diaNasc}/${mesNasc}/${anoNasc.slice(-2)}`;

            table += `<tr>
                          <td>${json[i].codAdocao}</td>
                          <td>${dataFormatada}</td>
                          <td>
                          <img src="data:image/jpeg;base64,${json[i].animal.imagemBase64}" alt="Imagem do animal" style="width: 100px; height: 100px; object-fit: cover;">
                          </td>
                          <td>${json[i].animal.nome}</td>
                          <td>${json[i].animal.raca}</td>
                          <td>${nascimentoFormatado}</td>
                          <td>
                          <span class="badge 
                            ${json[i].status === 'Aprovada' ? 'bg-success' : json[i].status === 'Cancelada' ? 'bg-danger' : 'bg-warning text-dark'} fs-6 p-2"> ${json[i].status}
                          </span>
                          </td>
                          <td>
                            ${
                              json[i].status !== 'Aprovada' && json[i].status !== 'Cancelada'
                                ? `<button type="button" class="btn btn-outline-danger btn-sm d-flex align-items-center gap-1" onclick="cancelarAdocao(${json[i].codAdocao}, '${json[i].status}')">
                                    Cancelar
                                  </button>`
                                : ''
                            }
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
  }  
  else
  {
    window.location.href = "../index.html";
    sessionStorage.setItem('usuarioNaoAutenticado', 'true');
  }
}

function cancelarAdocao(id)
{
  let URL = "http://localhost:8080/apis/adocao/buscar-id/"+id;
  var formData = new FormData();
  const token = localStorage.getItem("token");

  Swal.fire({
    title: "Deseja cancelar está solicitação de adoção ?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar"
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(URL, {
        headers: {
          Accept: 'application/json',
          'Authorization': token 
        },
        method: 'GET',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erro ao buscar dados da adoção.");
          }
          return response.json();
        })
        .then((json) => {
          formData.append("codAdocao", id);
          formData.append("cod_animal", json.animal.codAnimal);
          formData.append("cod_usuario", json.usuario.codUsuario);
          formData.append("data", json.data);
          formData.append("status", "Cancelada");

          URL = "http://localhost:8080/apis/adocao/atualizar";
          return fetch(URL, {
            method: 'PUT',
            body: formData,
            headers: { 'Authorization': token }
          });
        })
        .then((response) => {
          if (!response.ok) {
            Toast.fire({
              icon: 'error',
              title: 'Erro ao Cancelar Adoção!',
            });
          }
          else
          {
            Swal.fire({
            icon: "success",
            title: "Adoção Cancelada Com Sucesso!",
            timer: 1500,
            timerProgressBar: true,
            showConfirmButton: false
            }).then(() => {
              location.reload();
            });
          }

          return response.json();
        })
        .then(() => {

        })
        .catch((error) => {
          console.error(error);
        });
    }
  });

}

document.addEventListener("DOMContentLoaded", validarSubmit);
