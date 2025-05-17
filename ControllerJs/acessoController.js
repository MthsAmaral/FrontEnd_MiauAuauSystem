function verificarPrivilegio()
{
    const token = localStorage.getItem("token");
    if (token) {
      
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64)); 
       
        const userMenu = document.getElementById("userMenu");
        const dropdownMenu = document.querySelector(".dropdown-menu");
        userMenu.innerHTML = `Olá, ${payload.usuario}`;
        dropdownMenu.innerHTML = `
        <li><a class="dropdown-item" href="#">Minhas Adoções</a></li>
        <li><a class="dropdown-item" href="#">Dados Pessoais</a></li>
        <li><a class="dropdown-item" href="#" onclick="logout()">Sair</a></li>
    `;
       
    }
}
function logout() 
{
    localStorage.removeItem("token"); 
    window.location.reload(); 
}
function validarCPF(cpf)
{
  var flag = 1; // se encontrar, flag = 0
  
  return flag;
}
function validarEmail(email)
{
  var flag = 1; // se encontrar, flag = 0

  return flag;
}
function validarSubmit() {
    const formid = document.getElementById("fid");
    const formcad = document.getElementById("fusuario")
    if (formcad != null)
    {
      formcad.addEventListener("submit", function (event) {
        event.preventDefault();
        const cpf = document.getElementById("cpf").value;
        const email = document.getElementById("email").value;
        if(validarEmail(email))
        {
          if(validarCPF(cpf))
          {
            cadusuario(); 
          }
          else
          {
            Swal.fire({
              icon: "error",
              title: "CPF Já Cadastrado. Faça Login",
              timer: 1500,
              timerProgressBar: true
            })
          }
        }
        else
        {
          Swal.fire({
            icon: "error",
            title: "Email Já Cadastrado. Faça Login",
            timer: 1500,
            timerProgressBar: true
          })
        }
        
    });
    }
    else
    if(formid != null)
    {
      formid.addEventListener("submit", function (event) {
        event.preventDefault(); 
        logar(); 
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
            title: "Email e/ou Senha Incorreto(s)",
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
          return response.json();
      })
      .then((json) => {
          Swal.fire({
              icon: "success",
              title: "Usuário Gravado com Sucesso",
              timer: 1500,
              timerProgressBar: true
          }).then(() => {
              console.log("Usuário Cadastrado Com Sucesso! " + JSON.stringify(json));
              fusuario.reset();
          });
      })
      .catch((error) => {
          Swal.fire({
              icon: "error",
              title: "Erro ao cadastrar!!",
              timer: 1500,
              timerProgressBar: true
          }).then(() => {
              console.error("Erro ao cadastrar Usuário!! " + error);
          });
      });
  

}
document.addEventListener("DOMContentLoaded", validarSubmit);