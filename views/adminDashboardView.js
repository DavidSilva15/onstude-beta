// views/adminDashboardView.js
const renderAdminMenuLateral = require('./adminMenuLateral'); 

// NOVO: Adicionado mentores e filtroMentorId como parâmetros
function renderAdminDashboardView(admin, kpiGeral, cursosKpi, notifKpi, notifCursos, dadosGrafico, mentores = [], filtroMentorId = '') {
    
    const htmlSidebar = renderAdminMenuLateral(admin, 'dashboard');
    const jsonDadosGrafico = JSON.stringify(dadosGrafico);
    
    // ==========================================
    // MONTAGEM DOS CARDS DE CURSOS (Layout Compacto)
    // ==========================================
    let htmlCursos = '';
    if (cursosKpi.length === 0) {
        htmlCursos = '<div class="text-muted text-center py-4 bg-white rounded-4 border"><i class="bi bi-journal-x fs-3 d-block mb-2 opacity-50"></i>Nenhum curso cadastrado.</div>';
    } else {
        cursosKpi.forEach(c => {
            const taxaConclusao = c.matriculados > 0 ? Math.round((c.concluidos / (c.matriculados + c.concluidos)) * 100) : 0;
            htmlCursos += `
                <div class="card border-0 shadow-sm rounded-4 border-start border-primary border-4 mb-3">
                    <div class="card-body p-3">
                        <h6 class="fw-bold text-dark text-truncate mb-2" title="${c.titulo}" style="font-size: 0.9rem;">${c.titulo}</h6>
                        <div class="d-flex justify-content-between align-items-end mt-2">
                            <div>
                                <small class="text-muted d-block lh-1 mb-1" style="font-size: 0.65rem;">Matriculados / Concluintes</small>
                                <span class="fw-bold text-dark" style="font-size: 0.9rem;">${c.matriculados || 0} <span class="text-muted mx-1">|</span> <span class="text-success">${c.concluidos || 0}</span></span>
                            </div>
                            <div class="text-end" style="width: 45%;">
                                <small class="text-muted d-block mb-1 fw-bold" style="font-size: 0.65rem;">Conclusão: ${taxaConclusao}%</small>
                                <div class="progress rounded-pill" style="height: 5px;">
                                    <div class="progress-bar bg-success" role="progressbar" style="width: ${taxaConclusao}%;" aria-valuenow="${taxaConclusao}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // ==========================================
    // MONTAGEM DA LISTA DE NOTIFICAÇÕES
    // ==========================================
    let htmlNotifCursos = '';
    if (notifCursos.length === 0) {
        htmlNotifCursos = '<li class="list-group-item text-muted text-center border-0 small py-3">Nenhuma notificação enviada.</li>';
    } else {
        notifCursos.forEach(nc => {
            htmlNotifCursos += `
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom px-0 py-2">
                    <span class="text-secondary fw-semibold text-truncate me-2 small" style="max-width: 70%;">${nc.titulo}</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill small">${nc.qtd} envios</span>
                </li>
            `;
        });
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Dashboard Admin - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <style>
            .kpi-icon-box { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
            .bg-soft-primary { background-color: rgba(13, 110, 253, 0.1); color: #0d6efd; }
            .bg-soft-info { background-color: rgba(13, 202, 240, 0.15); color: #0dcaf0; }
            .bg-soft-danger { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; }
            .bg-soft-warning { background-color: rgba(255, 193, 7, 0.15); color: #b8860b; }
            .bg-soft-success { background-color: rgba(25, 135, 84, 0.1); color: #198754; }
            
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }

            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #adb5bd; }
        </style>
    </head>
    <body>
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando painel...</h5>
        </div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">
                    
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h3 class="fw-bold text-dark mb-0">Visão Geral</h3>
                            <p class="text-muted small mt-1 mb-0">Acompanhe as métricas e o desempenho da plataforma.</p>
                        </div>
                        <span class="badge bg-white text-secondary border shadow-sm px-3 py-2 rounded-pill"><i class="bi bi-clock-history me-1"></i> Atualizado agora</span>
                    </div>

                    <div class="row g-4 mb-4">
                        
                        <div class="col-xl-4 col-lg-6">
                            <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-pie-chart-fill me-2 text-primary"></i>Alunos e Matrículas</h6>
                            <div class="row g-3">
                                <div class="col-6">
                                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                                        <div class="kpi-icon-box bg-soft-success mb-2"><i class="bi bi-person-check-fill fs-5"></i></div>
                                        <h3 class="fw-bold text-dark mb-0">${kpiGeral.ativos || 0}</h3>
                                        <small class="text-muted fw-semibold" style="font-size: 0.7rem;">Ativos na Base</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                                        <div class="kpi-icon-box bg-soft-info mb-2"><i class="bi bi-mortarboard-fill fs-5"></i></div>
                                        <h3 class="fw-bold text-dark mb-0">${kpiGeral.concluintes || 0}</h3>
                                        <small class="text-muted fw-semibold" style="font-size: 0.7rem;">Concluintes</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                                        <div class="kpi-icon-box bg-soft-warning mb-2"><i class="bi bi-person-dash-fill fs-5"></i></div>
                                        <h3 class="fw-bold text-dark mb-0">${kpiGeral.inativos || 0}</h3>
                                        <small class="text-muted fw-semibold" style="font-size: 0.7rem;">Alunos Inativos</small>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                                        <div class="kpi-icon-box bg-soft-danger mb-2"><i class="bi bi-x-circle-fill fs-5"></i></div>
                                        <h3 class="fw-bold text-dark mb-0">${kpiGeral.cancelados || 0}</h3>
                                        <small class="text-muted fw-semibold" style="font-size: 0.7rem;">Mat. Canceladas</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-4 col-lg-6">
                            <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-journal-bookmark-fill me-2 text-info"></i>Desempenho por Curso</h6>
                            <div class="custom-scrollbar pe-2" style="height: 280px; overflow-y: auto;">
                                ${htmlCursos}
                            </div>
                        </div>

                        <div class="col-xl-4 col-lg-12">
                            <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-bell-fill me-2 text-warning"></i>Engajamento e Interações</h6>
                            
                            <div class="row g-3 mb-3">
                                <div class="col-6">
                                    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                                        <div class="d-flex align-items-center mb-1">
                                            <i class="bi bi-chat-text-fill text-primary me-2"></i>
                                            <small class="text-muted fw-bold" style="font-size: 0.7rem;">Pesquisas</small>
                                        </div>
                                        <h4 class="fw-bold text-dark mb-0">${notifKpi.pesquisa || 0}</h4>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card border-0 shadow-sm rounded-4 p-3 bg-white h-100">
                                        <div class="d-flex align-items-center mb-1">
                                            <i class="bi bi-star-fill text-warning me-2"></i>
                                            <small class="text-muted fw-bold" style="font-size: 0.7rem;">Avaliações</small>
                                        </div>
                                        <h4 class="fw-bold text-dark mb-0">${notifKpi.avaliacao || 0}</h4>
                                    </div>
                                </div>
                            </div>

                            <div class="card border-0 shadow-sm rounded-4 p-3 bg-white">
                                <h6 class="text-muted fw-bold mb-2 small"><i class="bi bi-send-fill me-2 text-success"></i>Disparos por Curso</h6>
                                <ul class="list-group list-group-flush custom-scrollbar" style="max-height: 125px; overflow-y: auto;">
                                    ${htmlNotifCursos}
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div id="sessao-grafico" class="row">
                        <div class="col-12">
                            <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5">
                                <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                                    <div>
                                        <h5 class="fw-bold text-dark mb-1"><i class="bi bi-graph-up-arrow text-primary me-2"></i>Acessos Diários de Alunos</h5>
                                        <p class="text-muted small mb-0">Acompanhe a frequência de logins na plataforma por mês.</p>
                                    </div>
                                    
                                    <div class="d-flex flex-column flex-sm-row gap-2">
                                        ${admin.tipo === 'ADMIN' && mentores.length > 0 ? `
                                            <select id="selectMentorGrafico" class="form-select bg-white border fw-semibold shadow-sm w-auto" style="min-width: 180px;" onchange="window.location.href='/admin?mentor_id=' + this.value + '#sessao-grafico'">
                                                <option value="">Todos</option>
                                                ${mentores.map(m => `<option value="${m.id}" ${filtroMentorId == m.id ? 'selected' : ''}>${m.nome}</option>`).join('')}
                                            </select>
                                        ` : ''}

                                        <select id="selectMesGrafico" class="form-select bg-primary text-white border-0 fw-bold shadow-sm w-auto" style="min-width: 160px;">
                                            </select>
                                    </div>
                                </div>
                                <div style="position: relative; height: 350px; width: 100%;">
                                    <canvas id="graficoAcessos"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                </div> 
            </div> 
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        ${require('./toastProcessamento')()}
        
        <script>
            // ==========================================
            // LÓGICA DO GRÁFICO (CHART.JS)
            // ==========================================
            
            const dadosGraficoDB = ${jsonDadosGrafico};
            let chartInstance = null;

            function inicializarGrafico() {
                const select = document.getElementById('selectMesGrafico');
                const ctx = document.getElementById('graficoAcessos').getContext('2d');

                // Preencher o Select com as chaves do objeto de dados reais
                Object.keys(dadosGraficoDB).forEach(mes => {
                    const option = document.createElement('option');
                    option.value = mes;
                    option.textContent = mes;
                    select.appendChild(option);
                });

                // Função para Renderizar/Atualizar o Gráfico
                const atualizarGrafico = (mesSelecionado) => {
                    const dados = dadosGraficoDB[mesSelecionado];

                    if (chartInstance) {
                        chartInstance.destroy();
                    }

                    // Gradiente bonito para preencher a linha do gráfico
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(13, 110, 253, 0.4)'); // Azul Primário
                    gradient.addColorStop(1, 'rgba(13, 110, 253, 0.0)'); // Transparente no fundo

                    chartInstance = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dados.labels,
                            datasets: [{
                                label: 'Logins Únicos',
                                data: dados.data,
                                borderColor: '#0d6efd',
                                backgroundColor: gradient,
                                borderWidth: 3,
                                pointBackgroundColor: '#ffffff',
                                pointBorderColor: '#0d6efd',
                                pointBorderWidth: 2,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                fill: true,
                                tension: 0.4 // Linha suave e curvada
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: { display: false },
                                tooltip: {
                                    backgroundColor: '#212529',
                                    titleFont: { size: 13, family: 'sans-serif' },
                                    bodyFont: { size: 14, weight: 'bold', family: 'sans-serif' },
                                    padding: 12,
                                    cornerRadius: 8,
                                    displayColors: false
                                }
                            },
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
                                    ticks: { font: { size: 11 }, color: '#6c757d', precision: 0 } 
                                },
                                x: {
                                    grid: { display: false, drawBorder: false },
                                    ticks: { 
                                        font: { size: 11 }, 
                                        color: '#6c757d',
                                        maxTicksLimit: 10
                                    }
                                }
                            },
                            interaction: {
                                mode: 'index',
                                intersect: false,
                            }
                        }
                    });
                };

                // Iniciar com o primeiro valor do select (Mês mais recente)
                atualizarGrafico(select.value);

                // Ouvinte para trocar os dados quando selecionar outro mês
                select.addEventListener('change', (e) => {
                    atualizarGrafico(e.target.value);
                });
            }

            // ==========================================
            // LÓGICA DE CARREGAMENTO GLOBAL
            // ==========================================
            window.addEventListener('pageshow', function(event) {
                const loader = document.getElementById('globalLoader');
                if (loader) {
                    if (event.persisted) {
                        loader.style.display = 'none';
                        loader.style.opacity = '0';
                    } else {
                        loader.style.opacity = '0';
                        setTimeout(() => { loader.style.display = 'none'; }, 400);
                    }
                }
            });

            window.addEventListener('beforeunload', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) {
                    loader.style.display = 'flex';
                    setTimeout(() => { loader.style.opacity = '1'; }, 10); 
                }
            });

            // Chama a inicialização do gráfico após o carregamento do DOM
            document.addEventListener('DOMContentLoaded', () => {
                inicializarGrafico();
            });

        </script>
    </body>
    </html>
    `;
}

module.exports = renderAdminDashboardView;