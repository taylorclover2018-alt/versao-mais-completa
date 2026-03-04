// Variável global para o gráfico
let grafico;

// Função para gerar os cards de veículos
function gerarVeiculos(rota, qtd) {
    let container = document.getElementById("veiculos" + rota);
    container.innerHTML = "";
    
    for (let i = 0; i < qtd; i++) {
        let veiculoDiv = document.createElement('div');
        veiculoDiv.className = 'veiculo-card';
        veiculoDiv.style.animation = 'fadeIn 0.3s ease';
        veiculoDiv.style.animationDelay = `${i * 0.1}s`;
        
        veiculoDiv.innerHTML = `
            <h4><i class="fas fa-bus"></i> Veículo ${i + 1}</h4>
            <div class="input-group">
                <label><i class="fas fa-tag"></i> Nome:</label>
                <input type="text" placeholder="Ex: Ônibus A">
            </div>
            <div class="input-group">
                <label><i class="fas fa-dollar-sign"></i> Diária (R$):</label>
                <input type="number" step="0.01" min="0">
            </div>
            <div class="input-group">
                <label><i class="fas fa-calendar-alt"></i> Nº Diárias:</label>
                <input type="number" min="0">
            </div>
        `;
        
        container.appendChild(veiculoDiv);
    }
}

// Função para calcular total da rota
function calcularTotalRota(rota) {
    let container = document.getElementById("veiculos" + rota);
    let veiculos = container.querySelectorAll(".veiculo-card");
    let total = 0;
    
    veiculos.forEach(veiculo => {
        let inputs = veiculo.querySelectorAll("input");
        if (inputs.length >= 3) {
            let diaria = parseFloat(inputs[1].value) || 0;
            let qtd = parseFloat(inputs[2].value) || 0;
            total += diaria * qtd;
        }
    });
    
    return total;
}

// Função principal de cálculo
function calcular() {
    // Mostrar loading nos botões
    const btnCalcular = document.querySelector('.btn-primary');
    const originalText = btnCalcular.innerHTML;
    btnCalcular.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculando...';
    
    setTimeout(() => {
        // Cálculos principais
        let bruto0 = calcularTotalRota(0);
        let bruto1 = calcularTotalRota(1);
        let brutoGeral = bruto0 + bruto1;

        let auxTotal = parseFloat(document.getElementById("auxilioTotal").value) || 0;

        let passagens0 = parseFloat(document.getElementById("passagens0").value) || 0;
        let passagens1 = parseFloat(document.getElementById("passagens1").value) || 0;

        // Rateio do auxílio
        let aux0 = brutoGeral > 0 ? (bruto0 / brutoGeral) * auxTotal : 0;
        let aux1 = brutoGeral > 0 ? (bruto1 / brutoGeral) * auxTotal : 0;

        let rateio0 = bruto0 - aux0 - passagens0;
        let rateio1 = bruto1 - aux1 - passagens1;

        let integral0 = parseInt(document.getElementById("integral0").value) || 0;
        let desc0 = parseInt(document.getElementById("desc0").value) || 0;

        let integral1 = parseInt(document.getElementById("integral1").value) || 0;
        let desc1 = parseInt(document.getElementById("desc1").value) || 0;

        let peso0 = integral0 + (desc0 * 0.5);
        let peso1 = integral1 + (desc1 * 0.5);

        let valorInt0 = peso0 > 0 ? rateio0 / peso0 : 0;
        let valorDesc0 = valorInt0 / 2;

        let valorInt1 = peso1 > 0 ? rateio1 / peso1 : 0;
        let valorDesc1 = valorInt1 / 2;

        // Atualizar tabela com animação
        let tbody = document.querySelector("#tabelaResultado tbody");
        tbody.style.opacity = '0';
        
        setTimeout(() => {
            tbody.innerHTML = `
                <tr>
                    <td><i class="fas fa-map-pin" style="color: #4361ee;"></i> 7 Lagoas</td>
                    <td class="valor">R$ ${bruto0.toFixed(2)}</td>
                    <td class="valor">R$ ${aux0.toFixed(2)}</td>
                    <td class="valor">R$ ${passagens0.toFixed(2)}</td>
                    <td class="valor destaque">R$ ${rateio0.toFixed(2)}</td>
                    <td class="valor">R$ ${valorInt0.toFixed(2)}</td>
                    <td class="valor">R$ ${valorDesc0.toFixed(2)}</td>
                </tr>
                <tr>
                    <td><i class="fas fa-map-pin" style="color: #06d6a0;"></i> Curvelo</td>
                    <td class="valor">R$ ${bruto1.toFixed(2)}</td>
                    <td class="valor">R$ ${aux1.toFixed(2)}</td>
                    <td class="valor">R$ ${passagens1.toFixed(2)}</td>
                    <td class="valor destaque">R$ ${rateio1.toFixed(2)}</td>
                    <td class="valor">R$ ${valorInt1.toFixed(2)}</td>
                    <td class="valor">R$ ${valorDesc1.toFixed(2)}</td>
                </tr>
            `;
            tbody.style.opacity = '1';
        }, 300);

        // Atualizar gráfico
        if (grafico) grafico.destroy();

        const ctx = document.getElementById("graficoRateio").getContext("2d");
        grafico = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["7 Lagoas", "Curvelo"],
                datasets: [
                    {
                        label: "Total a Ratear (R$)",
                        data: [rateio0, rateio1],
                        backgroundColor: [
                            "rgba(67, 97, 238, 0.8)",
                            "rgba(6, 214, 160, 0.8)"
                        ],
                        borderColor: [
                            "#4361ee",
                            "#06d6a0"
                        ],
                        borderWidth: 2,
                        borderRadius: 8,
                        barPercentage: 0.6,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                family: "'Inter', sans-serif",
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'white',
                        titleColor: '#2b2d42',
                        bodyColor: '#6c757d',
                        borderColor: '#e9ecef',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `R$ ${context.raw.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return 'R$ ' + value.toFixed(2);
                            }
                        }
                    }
                }
            }
        });

        // Mostrar toast de sucesso
        mostrarToast('Cálculo realizado com sucesso!');

        // Restaurar botão
        btnCalcular.innerHTML = originalText;
    }, 500);
}

// Função para gerar PDF melhorado
async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Configurar cores
    const primaryColor = [67, 97, 238];
    const secondaryColor = [6, 214, 160];
    const darkColor = [43, 45, 66];

    // Cabeçalho do PDF
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 297, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Relatório Oficial - Transporte', 20, 13);

    // Data
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`Gerado em: ${dataAtual}`, 250, 13);

    // Coletar dados da tabela
    let tabela = document.getElementById('tabelaResultado');
    let dados = [];
    let cabecalhos = [];

    // Pegar cabeçalhos
    let thead = tabela.querySelectorAll('thead th');
    thead.forEach(th => cabecalhos.push(th.innerText));

    // Pegar dados do corpo
    let linhas = tabela.querySelectorAll('tbody tr');
    linhas.forEach(linha => {
        let linhaDados = [];
        let colunas = linha.querySelectorAll('td');
        colunas.forEach(td => linhaDados.push(td.innerText));
        dados.push(linhaDados);
    });

    // Adicionar título da seção
    doc.setTextColor(...darkColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhamento do Rateio', 20, 35);

    // Criar tabela estilizada
    doc.autoTable({
        head: [cabecalhos],
        body: dados,
        startY: 40,
        theme: 'grid',
        styles: {
            fontSize: 10,
            cellPadding: 5,
            font: 'helvetica',
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            textColor: darkColor,
        },
        columnStyles: {
            0: { fontStyle: 'bold', fillColor: [245, 245, 245] }
        },
        alternateRowStyles: {
            fillColor: [250, 250, 250]
        }
    });

    // Adicionar gráfico
    const canvas = document.getElementById('graficoRateio');
    const canvasImage = canvas.toDataURL('image/png', 1.0);
    
    doc.addPage();
    
    // Cabeçalho da segunda página
    doc.setFillColor(...secondaryColor);
    doc.rect(0, 0, 297, 20, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('Visualização Gráfica', 20, 13);

    // Adicionar imagem do gráfico
    doc.addImage(canvasImage, 'PNG', 20, 30, 250, 120);

    // Adicionar resumo
    doc.setTextColor(...darkColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumo Executivo', 20, 170);

    // Calcular totais
    let totalRateio = 0;
    dados.forEach(linha => {
        let valorRateio = linha[4]?.replace('R$', '').replace(',', '.').trim();
        totalRateio += parseFloat(valorRateio) || 0;
    });

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total rateado: R$ ${totalRateio.toFixed(2)}`, 20, 180);
    doc.text(`Total de rotas: ${dados.length}`, 20, 187);
    doc.text(`Gerado por: Sistema Premium Transporte`, 20, 194);

    // Rodapé
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Documento gerado automaticamente - Válido como relatório oficial', 20, 280);

    // Salvar PDF
    doc.save('Relatorio_Transporte_Premium.pdf');
    
    mostrarToast('PDF gerado com sucesso!');
}

// Função para resetar tudo
function resetarTudo() {
    if (confirm('Tem certeza que deseja resetar todos os valores?')) {
        document.getElementById('auxilioTotal').value = '4000';
        
        document.getElementById('integral0').value = '12';
        document.getElementById('desc0').value = '2';
        document.getElementById('passagens0').value = '0';
        
        document.getElementById('integral1').value = '12';
        document.getElementById('desc1').value = '2';
        document.getElementById('passagens1').value = '0';
        
        document.querySelectorAll('.veiculo-qtd').forEach(input => {
            input.value = '1';
            let rota = input.closest('.rota-card')?.dataset.rota;
            if (rota !== undefined) {
                gerarVeiculos(parseInt(rota), 1);
            }
        });
        
        calcular();
        mostrarToast('Valores resetados com sucesso!');
    }
}

// Função
