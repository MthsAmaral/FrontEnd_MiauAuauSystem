document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formLancamento");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = document.getElementById("data").value;
    const tipo = document.getElementById("tipo").value;
    const debito = document.getElementById("debito").value;
    const credito = document.getElementById("credito").value;
    const valor = document.getElementById("valor").value;

    if (!data || !tipo || !debito || !credito || !valor) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    if (debito === credito) {
      alert("Débito e crédito não podem ser iguais.");
      return;
    }

    if (valor <= 0) {
      alert("O valor deve ser maior que zero.");
      return;
    }

    alert("Lançamento confirmado!");
    form.reset();
  });
});

function voltar() {
  window.history.back();
}
