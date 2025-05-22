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

            //irá ordenar a lista json...
            //  utilizando o campo 'Classificacao' e depois o 'Referencial'
            json.sort((a, b) => {
                const cmpClass = a.classificacao.localeCompare(b.classificacao);
                if (cmpClass !== 0) return cmpClass;
                return a.referencial.localeCompare(b.referencial);
            });

            let somaCredito = 0;
            let somaDebito = 0;

            let classif = json[0].classificacao;
            //montar a tabela com o Plano Referencial para o balancete
            let table = "";
            let tableBalancete = "";
            for (let i = 0; i < json.length; i++) {
                if (classif != json[i].classificacao) {
                    tableBalancete += `
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    `
                }
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

            //colocar as tabelas geradas dinamicamente no
            document.getElementById("resultado").innerHTML = table;
            document.getElementById("resultadoBalancete").innerHTML = tableBalancete;
        })
        .catch((error) => {
            console.error("Erro ao recuperar Balancete: ", error);
        });
}