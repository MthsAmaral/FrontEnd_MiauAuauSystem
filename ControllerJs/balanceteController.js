function balancete() {
    //url para realizar o fetch
    let URL = "http://localhost:8080/apis/balancete";

    //para editar a URL eu preciso saber os valores que possuo nos meus inputs
    let ano = document.getElementById("filtroAno").value;
    let mes = document.getElementById("filtroMes").value;

    if(ano === ""){
        ano = new Date().getFullYear();
        URL += "?ano=" + ano;
    }
    else{
        if(mes === ""){ //filtro apenas pelo ano
            URL += "?ano=" + ano;
        }
        else{ //filtrar pelo ano e pelo mes
            URL += "?ano=" + ano + "&mes=" + mes;
        }
    }

    fetch(URL)
        .then(response => {
            if (!response.ok)
                throw new Error("Erro ao recuperar o Balancete!");
            return response.json();
        })
        .then(json => {2
            if (json.length > 0) {

                // 1. Irá ordenar pela classificacao e depois pelo referencial
                json.sort((a, b) => {
                    const c = a.classificacao.localeCompare(b.classificacao);
                    if (c !== 0)
                        return c;
                    else
                        return a.referencial.localeCompare(b.referencial);
                });

                // 2. Deixa zerada as duas tabelas
                const corpoBalancete = document.getElementById("resultadoBalancete");
                corpoBalancete.innerHTML = "";
                const corpoPlano = document.getElementById("resultado");
                corpoPlano.innerHTML = "";

                // ---- variáveis para controlar os indices e as somas ----
                let grupo = 0; // índice do grupo de classificação
                let classeAtual = json[0].classificacao;
                let somaCredGrupo = 0;
                let somaDebGrupo = 0;
                let totalCreditos = 0;
                let totalDebitos = 0;

                // pequena funcao que cria uma nova linha de cada classificacao
                const criaCabecalhoGrupo = (nomeClasse, index) => {
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <td style="font-weight:bold; background:#808080;">${nomeClasse}</td>
                        <td id="saldoAnterior${index}" style="background:#808080;"></td>
                        <td id="debitos${index}" style="background:#808080;"></td>
                        <td id="creditos${index}" style="background:#808080;"></td>
                        <td id="mvtoPeriodo${index}" style="background:#808080;"></td>
                        <td id="saldoAtual${index}" style="background:#808080;"></td>`;
                    corpoBalancete.appendChild(linha);
                };
                criaCabecalhoGrupo(classeAtual, grupo);

                // 3. Percorre o JSON
                for (let i = 0; i < json.length; i++) {
                    const registro = json[i];

                    // Se mudou a classificação, fecha o grupo anterior
                    if (registro.classificacao !== classeAtual) {
                        const mov = somaDebGrupo - somaCredGrupo;

                        document.getElementById(`debitos${grupo}`).textContent = somaDebGrupo.toFixed(2);
                        document.getElementById(`creditos${grupo}`).textContent = somaCredGrupo.toFixed(2);
                        document.getElementById(`mvtoPeriodo${grupo}`).textContent = mov.toFixed(2);
                        document.getElementById(`saldoAtual${grupo}`).textContent = mov.toFixed(2);

                        // inicia um novo grupo
                        grupo++;
                        classeAtual = registro.classificacao;
                        somaCredGrupo = 0;
                        somaDebGrupo = 0;

                        criaCabecalhoGrupo(classeAtual, grupo);
                    }

                    // adiciona linha de detalhe na tabela de balancete
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <td>${registro.referencial}</td>
                        <td>0</td>
                        <td>${(+registro.debito).toFixed(2)}</td>
                        <td>${(+registro.credito).toFixed(2)}</td>
                        <td>${(+registro.debito - +registro.credito).toFixed(2)}</td>
                        <td>${(+registro.debito - +registro.credito).toFixed(2)}</td>
                    `;
                    corpoBalancete.appendChild(linha);

                    // adiciona linha de detalhe na primeira tabela (plano referencial)
                    const linhaPlano = document.createElement("tr");
                    linhaPlano.innerHTML = `
                        <td>${registro.classificacao}</td>
                        <td>${registro.referencial}</td>
                        <td>${(+registro.debito).toFixed(2)}</td>
                        <td>${(+registro.credito).toFixed(2)}</td>
                    `;
                    corpoPlano.appendChild(linhaPlano);
                    //<td style="font-weight:bold;">${(+registro.debito - +registro.credito).toFixed(2)}</td>

                    // acumula somas
                    somaCredGrupo += +registro.credito;
                    somaDebGrupo += +registro.debito;
                    totalCreditos += +registro.credito;
                    totalDebitos += +registro.debito;
                }

                // 4. Fecha o último grupo (fora do loop)
                const movFinal = somaDebGrupo - somaCredGrupo;
                document.getElementById(`debitos${grupo}`).textContent = somaDebGrupo.toFixed(2);
                document.getElementById(`creditos${grupo}`).textContent = somaCredGrupo.toFixed(2);
                document.getElementById(`mvtoPeriodo${grupo}`).textContent = movFinal.toFixed(2);
                document.getElementById(`saldoAtual${grupo}`).textContent = movFinal.toFixed(2);

                // 5. Linha total na 1ª tabela
                const dif = totalDebitos - totalCreditos;
                const cor = Math.abs(dif) < 1e-4 ? "#83e513" : "#d8320d";
                const totalRow = document.createElement("tr");
                totalRow.innerHTML = `
                    <td colspan="2"></td>
                    <td style="font-weight:bold;">${totalDebitos.toFixed(2)}</td>
                    <td style="font-weight:bold;">${totalCreditos.toFixed(2)}</td>
                `;
                //<td style="font-weight:bold; background:${cor};">${dif.toFixed(2)}</td>
                corpoPlano.appendChild(totalRow);
            }
        })
        .catch(error => {
            console.error("Erro ao recuperar Balancete:", error);
        });
}
