/**
 * AgendAI - Gráficos do Dashboard Administrativo
 */

// Armazenar referências para os gráficos
let companiesByPlanChartInstance = null;
let companiesMonthlyChartInstance = null;

// Inicialização dos gráficos do dashboard
function initDashboardCharts() {
    console.log('Iniciando gráficos do Dashboard Admin...');
    
    try {
        // Verificar se Chart.js está disponível
        if (typeof Chart === 'undefined') {
            console.error('Chart.js não está disponível!');
            return;
        }
        
        // Destruir gráficos existentes antes de criar novos
        if (companiesByPlanChartInstance) {
            companiesByPlanChartInstance.destroy();
            companiesByPlanChartInstance = null;
        }
        
        if (companiesMonthlyChartInstance) {
            companiesMonthlyChartInstance.destroy();
            companiesMonthlyChartInstance = null;
        }
        
        // Verificar se existem outros gráficos com o mesmo canvas
        const existingPlanChart = Chart.getChart('companiesByPlanChart');
        if (existingPlanChart) {
            existingPlanChart.destroy();
        }
        
        const existingMonthlyChart = Chart.getChart('companiesMonthlyChart');
        if (existingMonthlyChart) {
            existingMonthlyChart.destroy();
        }
        
        // Gráfico de Empresas por Planos
        const planChartEl = document.getElementById('companiesByPlanChart');
        if (planChartEl) {
            companiesByPlanChartInstance = new Chart(planChartEl, {
                type: 'doughnut',
                data: {
                    labels: ['Básico', 'Intermediário', 'Avançado', 'Trial'],
                    datasets: [{
                        data: [18, 15, 9, 0],
                        backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e'],
                        hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf', '#dda20a'],
                        hoverBorderColor: "rgba(234, 236, 244, 1)",
                    }],
                },
                options: {
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            console.log('Gráfico de empresas por planos inicializado');
        }
        
        // Gráfico de Empresas Cadastradas por Mês
        const monthlyChartEl = document.getElementById('companiesMonthlyChart');
        if (monthlyChartEl) {
            companiesMonthlyChartInstance = new Chart(monthlyChartEl, {
                type: 'line',
                data: {
                    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
                    datasets: [{
                        label: "Empresas",
                        lineTension: 0.3,
                        backgroundColor: "rgba(78, 115, 223, 0.05)",
                        borderColor: "rgba(78, 115, 223, 1)",
                        pointRadius: 3,
                        pointBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointBorderColor: "rgba(78, 115, 223, 1)",
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: [2, 3, 5, 4, 8, 6, 4, 3, 5, 2, 3, 5],
                    }],
                },
                options: {
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
                            },
                            ticks: {
                                maxTicksLimit: 12
                            }
                        },
                        y: {
                            ticks: {
                                maxTicksLimit: 5,
                                padding: 10,
                                min: 0,
                                max: 10,
                                stepSize: 2
                            },
                            grid: {
                                color: "rgb(234, 236, 244)",
                                zeroLineColor: "rgb(234, 236, 244)",
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            }
                        },
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
            console.log('Gráfico de empresas por mês inicializado');
        }
        
        console.log('Todos os gráficos inicializados com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar gráficos:', error);
    }
}

// Registrar a função globalmente
if (typeof window !== 'undefined') {
    window.initDashboardCharts = initDashboardCharts;
    
    // Remover a inicialização automática para evitar duplicação,
    // já que o admin-dashboard.html já chama a função
} 