function balancete() {
    let URL = "http://localhost:8080/apis/balancete/ano/" + "2024";
    fetch(URL, { method: "GET", redirect: "follow" })
        .then((response) => {
            if (!response.ok)
                throw new Error("Erro ao recuperar o Balancete!!");
            return response.json();
        })
        .then((json) => {
            console.log("Resposta do servidor: ", json);
            let somaCredito = 0;
            let somaDebito = 0;

            //montar a tabela com o Plano Referencial para o balancete
            let table = "";
            for (let i = 0; i < json.length; i++) {
                somaCredito += parseFloat(json[i].credito);
                somaDebito += parseFloat(json[i].debito);
                table += `
                    <tr>
                        <td>${json[i].classificacao}</td>
                        <td>${json[i].referencial}</td>
                        <td>${parseFloat(json[i].debito).toFixed(2)}</td>
                        <td>${json[i].credito}</td>
                        <td style="font-weight: bolder;">${(parseFloat(json[i].debito) - parseFloat(json[i].credito)).toFixed(2)}</td>
                    </tr>
                `;
            }
            let cor = "";
            const diferenca = somaDebito - somaCredito;
            const epsilon = 0.0001;

            if (Math.abs(diferenca) < epsilon) {
                cor = "#83e513";
            } else {
                cor = "#d8320d";
            }
            table += `
                <tr>
                    <td colspan="2"></td>
                    <td style="font-weight: bolder;">${somaDebito.toFixed(2)}</td>
                    <td style="font-weight: bolder;">${somaCredito.toFixed(2)}</td>
                    <td style="font-weight: bolder; background-color: ${cor};">${parseFloat(somaDebito - somaCredito).toFixed(2)}</td>
                </tr>
            `;
            document.getElementById("resultado").innerHTML = table;
        })
        .catch((error) => {
            console.error("Erro ao recuperar Balancete: ", error);
        });
}