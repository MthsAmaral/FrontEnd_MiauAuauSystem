function gerarRelatorio() {
    const dataInicio = document.getElementById("dataInicio").value;
    const dataFim = document.getElementById("dataFim").value;

    if (!dataInicio || !dataFim) {
        Swal.fire("Erro", "Preencha as duas datas!", "warning");
        return;
    }

    fetch(`https://backend-miauauau-7bacd44b7104.herokuapp.com/apis/doacao/relatorio-por-data?dataInicio=${dataInicio}&dataFim=${dataFim}`)
        .then(response => response.json())
        .then(data => {
            const tabela = document.getElementById("resultado");
            tabela.innerHTML = "";

            if (data.length === 0) {
                Swal.fire("Atenção", "Nenhuma doação encontrada no período!", "info");
                return;
            }

            let total = 0;

            data.forEach(item => {
                const linha = `
                    <tr>
                        <td>${item.codDoacao}</td>
                        <td>${item.data}</td>
                        <td>R$ ${parseFloat(item.valor).toFixed(2)}</td>
                        <td>${item.status}</td>
                    </tr>
                `;
                tabela.innerHTML += linha;
                total += parseFloat(item.valor);
            });

            tabela.innerHTML += `
                <tr>
                    <td colspan="2"><strong>Total</strong></td>
                    <td colspan="2"><strong>R$ ${total.toFixed(2)}</strong></td>
                </tr>
            `;
        })
        .catch(error => {
            console.error("Erro:", error);
            Swal.fire("Erro", "Não foi possível gerar o relatório", "error");
        });
}

function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}
