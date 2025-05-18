function verificarPrivilegio()
{
    const token = localStorage.getItem("token");
    if (token) {
      
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64)); 
       
        const userMenu = document.getElementById("userMenu");
        const dropdownMenu = document.querySelector(".dropdown-menu-auaumiau");
        userMenu.innerHTML = `Olá, ${payload.usuario}`;
        dropdownMenu.innerHTML = `
        <li><a class="dropdown-item-auaumiau" href="#">Minhas Adoções</a></li>
        <li><a class="dropdown-item-auaumiau" href="#">Dados Pessoais</a></li>
        <li><a class="dropdown-item-auaumiau" href="#">Alterar Senha</a></li>
        <li><a class="dropdown-item-auaumiau" href="#" onclick="logout()">Sair</a></li>
    `;
       
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

  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: "follow"
    });
    const text = await response.text();
    const json = JSON.parse(text);

    if (json.email == email)
    {
      return 0; 
    }
    else
    {
      return 1; 
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
  const formcad = document.getElementById("fusuario")
  
  if (formcad != null)
  {
      formcad.addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = event.target;
      let flag = 1;
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
            title: "Dado(s) Incorreto(s)",
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
  var formData = new FormData(fusuario);
  formData.append("privilegio", "C");
  const URL = "http://localhost:8080/apis/usuario/gravar"
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
document.addEventListener("DOMContentLoaded", validarInputCPF);
document.addEventListener("DOMContentLoaded", validarTelefone);
document.addEventListener("DOMContentLoaded", buscarCEP);
document.addEventListener("DOMContentLoaded", validarSubmit);
