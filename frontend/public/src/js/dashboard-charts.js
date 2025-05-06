/**
 * Dashboard Charts - Inicializador de gráficos para o dashboard
 */

// Função que será chamada diretamente do HTML do dashboard
function initDashboardCharts() {
    console.log('Inicializando gráficos via dashboard-charts.js');
    
    // Garante que o Chart.js está disponível
    if (typeof Chart === 'undefined') {
        console.error('Chart.js não disponível. Carregando diretamente...');
        loadChartJS(function() {
            renderAllCharts();
        });
    } else {
        console.log('Chart.js já carregado. Renderizando gráficos...');
        renderAllCharts();
    }
}

// Carrega a biblioteca Chart.js dinamicamente se necessário
function loadChartJS(callback) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js';
    script.onload = callback;
    script.onerror = function() {
        console.error('Falha ao carregar Chart.js');
        renderFallbackText();
    };
    document.head.appendChild(script);
}

// Renderiza todos os gráficos
function renderAllCharts() {
    try {
        // Gráfico de pizza para Empresas por Planos
        renderDoughnutChart(
            'companiesByPlanChart',
            ["Básico", "Premium", "Enterprise", "Trial"],
            [18, 15, 9, 0],
            ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e']
        );
        
        // Gráfico de linha para Empresas Cadastradas Por Mês
        renderLineChart(
            'companiesGrowthChart',
            ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
            [3, 5, 4, 7, 10, 8, 9, 15, 13, 17, 19, 22]
        );
        
        console.log('Todos os gráficos renderizados com sucesso');
    } catch (error) {
        console.error('Erro ao renderizar gráficos:', error);
        renderFallbackText();
    }
}

// Função para renderizar um gráfico de linha (line chart)
function renderLineChart(elementId, labels, data) {
    const ctx = document.getElementById(elementId);
    if (!ctx) {
        console.error(`Elemento ${elementId} não encontrado`);
        return;
    }
    
    // Limpa qualquer gráfico existente
    clearChart(elementId);
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Empresas",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: data,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10
                    },
                    grid: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Função para renderizar um gráfico de rosca (doughnut chart)
function renderDoughnutChart(elementId, labels, data, colors) {
    const ctx = document.getElementById(elementId);
    if (!ctx) {
        console.error(`Elemento ${elementId} não encontrado`);
        return;
    }
    
    // Limpa qualquer gráfico existente
    clearChart(elementId);
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                hoverBackgroundColor: colors.map(color => {
                    // Torna a cor um pouco mais escura para o hover
                    return color.replace(/rgb\((\d+), (\d+), (\d+)\)/, function(match, r, g, b) {
                        return `rgb(${Math.max(0, r-20)}, ${Math.max(0, g-20)}, ${Math.max(0, b-20)})`;
                    });
                }),
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Função para renderizar um gráfico de barras (bar chart)
function renderBarChart(elementId, labels, data) {
    const ctx = document.getElementById(elementId);
    if (!ctx) {
        console.error(`Elemento ${elementId} não encontrado`);
        return;
    }
    
    // Limpa qualquer gráfico existente
    clearChart(elementId);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Novos Usuários",
                backgroundColor: "#4e73df",
                hoverBackgroundColor: "#2e59d9",
                borderColor: "#4e73df",
                data: data,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10
                    },
                    grid: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Limpa qualquer gráfico existente em um elemento antes de renderizar um novo
function clearChart(elementId) {
    const chartInstance = Chart.getChart(elementId);
    if (chartInstance) {
        chartInstance.destroy();
    }
}

// Fallback - Quando tudo falhar, apenas exibe um texto nos canvas
function renderFallbackText() {
    const canvasIds = ['companiesByPlanChart', 'companiesGrowthChart'];
    
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.font = 'bold 14px Arial';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#333';
                ctx.fillText('Dados indisponíveis', canvas.width / 2, canvas.height / 2);
            }
        }
    });
}

// Auto-inicialização - quando o script é carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('dashboard-charts.js carregado. Aguardando inicialização...');
}); 