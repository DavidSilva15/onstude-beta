// views/adminDashboardView.js

function renderAdminDashboardView(admin, kpiGeral, cursosKpi, notifKpi, notifCursos) {
    
    // ... (Mantenha o código de montagem do htmlCursos e htmlNotifCursos intacto) ...
    let htmlCursos = '';
    if (cursosKpi.length === 0) {
        htmlCursos = '<p class="text-muted text-center py-3">Nenhum curso cadastrado ainda.</p>';
    } else {
        cursosKpi.forEach(c => {
            const taxaConclusao = c.matriculados > 0 ? Math.round((c.concluidos / (c.matriculados + c.concluidos)) * 100) : 0;
            htmlCursos += `
                <div class="col-md-6 col-lg-4 mb-3">
                    <div class="card border-0 shadow-sm h-100 rounded-4 border-start border-primary border-4">
                        <div class="card-body">
                            <h6 class="fw-bold text-dark text-truncate" title="${c.titulo}">${c.titulo}</h6>
                            <div class="d-flex justify-content-between mt-3">
                                <div>
                                    <small class="text-muted d-block">Cursando</small>
                                    <span class="fs-4 fw-bold text-primary">${c.matriculados || 0}</span>
                                </div>
                                <div>
                                    <small class="text-muted d-block">Concluintes</small>
                                    <span class="fs-4 fw-bold text-success">${c.concluidos || 0}</span>
                                </div>
                            </div>
                            <div class="progress mt-3" style="height: 6px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${taxaConclusao}%;" aria-valuenow="${taxaConclusao}" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    let htmlNotifCursos = '';
    if (notifCursos.length === 0) {
        htmlNotifCursos = '<li class="list-group-item text-muted text-center border-0">Sem envios específicos.</li>';
    } else {
        notifCursos.forEach(nc => {
            htmlNotifCursos += `
                <li class="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom px-0">
                    <span class="text-secondary text-truncate me-2">${nc.titulo}</span>
                    <span class="badge bg-primary rounded-pill">${nc.qtd} envios</span>
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
        <style>
            .kpi-icon-box { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
            .bg-soft-primary { background-color: rgba(13, 110, 253, 0.1); color: #0d6efd; }
            .bg-soft-info { background-color: rgba(13, 202, 240, 0.15); color: #0dcaf0; }
            .bg-soft-danger { background-color: rgba(220, 53, 69, 0.1); color: #dc3545; }
            .bg-soft-warning { background-color: rgba(255, 193, 7, 0.15); color: #b8860b; }
            .bg-soft-success { background-color: rgba(25, 135, 84, 0.1); color: #198754; }
        </style>
    </head>
    <body class="bg-light">
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando painel...</h5>
        </div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-primary" href="/admin">OnStude <span class="text-white fw-light">Admin</span></a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link active" href="/admin">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/cursos">Cursos</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/usuarios">Usuários</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/notificacoes">Notificações</a></li>
                        <li class="nav-item"><a class="nav-link" href="/forum">Forúm</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/integracoes">Integrações e API</a></li>
                    </ul>
                    <div class="d-flex align-items-center ms-auto">
                        ${admin.foto_perfil_url 
                            ? `<img src="${admin.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid #fff;">` 
                            : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold" style="width: 36px; height: 36px; border: 2px solid #fff; font-size: 14px;">${admin.nome.charAt(0).toUpperCase()}</div>`
                        }
                        <span class="text-light me-3">Olá, <strong>${admin.nome}</strong></span>
                        <a href="/logout" class="btn btn-outline-danger btn-sm">Sair</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mt-4 mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold text-dark mb-0">Visão Geral</h3>
                <span class="text-muted small"><i class="bi bi-clock-history"></i> Atualizado agora</span>
            </div>

            <div class="row mb-4">
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="text-muted fw-bold mb-0">Alunos Ativos</h6>
                            <div class="kpi-icon-box bg-soft-success"><i class="bi bi-person-check-fill fs-4"></i></div>
                        </div>
                        <h2 class="fw-bold text-dark mb-1">${kpiGeral.ativos || 0}</h2>
                        <span class="badge bg-soft-success rounded-pill"><i class="bi bi-graph-up-arrow"></i> Base total</span>
                    </div>
                </div>
                
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="text-muted fw-bold mb-0">Concluintes</h6>
                            <div class="kpi-icon-box bg-soft-info"><i class="bi bi-mortarboard-fill fs-4"></i></div>
                        </div>
                        <h2 class="fw-bold text-dark mb-1">${kpiGeral.concluintes || 0}</h2>
                        <span class="badge bg-soft-info rounded-pill text-dark"><i class="bi bi-star-fill text-warning"></i> Meta atingida</span>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="text-muted fw-bold mb-0">Alunos Inativos</h6>
                            <div class="kpi-icon-box bg-soft-warning"><i class="bi bi-person-dash-fill fs-4"></i></div>
                        </div>
                        <h2 class="fw-bold text-dark mb-1">${kpiGeral.inativos || 0}</h2>
                        <span class="badge bg-soft-warning rounded-pill"><i class="bi bi-exclamation-triangle"></i> Risco de evasão</span>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h6 class="text-muted fw-bold mb-0">Cancelados</h6>
                            <div class="kpi-icon-box bg-soft-danger"><i class="bi bi-x-circle-fill fs-4"></i></div>
                        </div>
                        <h2 class="fw-bold text-dark mb-1">${kpiGeral.cancelados || 0}</h2>
                        <span class="badge bg-soft-danger rounded-pill"><i class="bi bi-graph-down-arrow"></i> Evasão confirmada</span>
                    </div>
                </div>
            </div>

            <h5 class="fw-bold text-secondary mb-3 mt-5"><i class="bi bi-journal-bookmark-fill me-2"></i>Desempenho por Curso</h5>
            <div class="row mb-4">
                ${htmlCursos}
            </div>

            <h5 class="fw-bold text-secondary mb-3 mt-5"><i class="bi bi-bell-fill me-2"></i>Engajamento e Comunicação</h5>
            <div class="row">
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="text-muted fw-bold mb-0">Pesquisas (Texto)</h6>
                                    <div class="kpi-icon-box bg-soft-primary"><i class="bi bi-chat-text-fill fs-4"></i></div>
                                </div>
                                <h2 class="fw-bold text-dark mb-1">${notifKpi.pesquisa || 0}</h2>
                                <p class="text-muted small mb-0">Disparadas na plataforma</p>
                            </div>
                        </div>
                        <div class="col-md-6 mb-3">
                            <div class="card border-0 shadow-sm rounded-4 p-3 h-100">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="text-muted fw-bold mb-0">Avaliações (Estrelas)</h6>
                                    <div class="kpi-icon-box bg-soft-warning"><i class="bi bi-star-fill fs-4"></i></div>
                                </div>
                                <h2 class="fw-bold text-dark mb-1">${notifKpi.avaliacao || 0}</h2>
                                <p class="text-muted small mb-0">Disparadas na plataforma</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 p-4 h-100">
                        <h6 class="text-muted fw-bold mb-3"><i class="bi bi-send-fill text-primary me-2"></i>Notificações por Curso</h6>
                        <ul class="list-group list-group-flush" style="max-height: 200px; overflow-y: auto;">
                            ${htmlNotifCursos}
                        </ul>
                    </div>
                </div>
            </div>

        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            // Loader otimizado com evento 'pageshow' para corrigir BFCache
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
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAdminDashboardView;