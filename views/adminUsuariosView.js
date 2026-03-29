// views/adminUsuariosView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminUsuariosView(admin, usuarios, currentPage = 1, totalPages = 1, searchQuery = '') {
    
    const htmlSidebar = renderAdminMenuLateral(admin, 'usuarios');

    let cardsUsuarios = '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

    if (usuarios.length === 0) {
        cardsUsuarios = `<div class="col-12 text-center text-muted py-5"><i class="bi bi-people fs-1 opacity-50 mb-3 d-block"></i>Nenhum usuário encontrado ${searchQuery ? 'para "'+searchQuery+'"' : ''}.</div>`;
    } else {
        usuarios.forEach(u => {
            let badgeTipo = u.tipo === 'ADMIN' ? 'bg-danger' : 'bg-primary';
            
            // ==========================================
            // LÓGICA DO STATUS INTELIGENTE (CONCLUINTE)
            // ==========================================
            let statusVisual = u.status;
            let badgeStatus = 'bg-secondary';

            if (u.status === 'ATIVO') {
                if (u.total_cursos > 0 && Number(u.total_cursos) === Number(u.concluidos_count)) {
                    statusVisual = 'CONCLUINTE';
                    badgeStatus = 'bg-info text-dark fw-bold shadow-sm';
                } else {
                    badgeStatus = 'bg-success';
                }
            } else if (u.status === 'BLOQUEADO') {
                badgeStatus = 'bg-warning text-dark';
            }

            // ==========================================
            // LÓGICA DE CORES DOS CARDS (SINAIS VITAIS)
            // ==========================================
            let cardCustomClass = 'bg-white border-0'; // Padrão: Branco

            if (statusVisual === 'CONCLUINTE') {
                // Levemente Verde
                cardCustomClass = 'bg-success bg-opacity-10 border border-success border-opacity-25';
            } else if (u.tipo === 'ALUNO') {
                if (!u.ultimo_acesso) {
                    // Levemente Amarelo (Nunca acessou)
                    cardCustomClass = 'bg-warning bg-opacity-10 border border-warning border-opacity-25';
                } else {
                    const diffEmDias = (new Date() - new Date(u.ultimo_acesso)) / (1000 * 60 * 60 * 24);
                    if (diffEmDias > 2) {
                        // Levemente Vermelho (Ausente há mais de 2 dias)
                        cardCustomClass = 'bg-danger bg-opacity-10 border border-danger border-opacity-25';
                    }
                }
            }

            const cursosTooltip = u.cursos_lista ? u.cursos_lista : 'Nenhum curso';
            const qtdCursos = u.total_cursos || 0;

            let dataUltimoAcesso = '<span class="text-danger fw-semibold small">Nunca acessou</span>';
            if (u.ultimo_acesso) {
                const dataAcesso = new Date(u.ultimo_acesso);
                dataUltimoAcesso = `<span class="small fw-semibold text-dark">${dataAcesso.toLocaleDateString('pt-BR')} <span class="text-muted fw-normal">às ${dataAcesso.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span></span>`;
            }

            let ultimaAulaVisual = '<span class="text-muted small">Nenhuma atividade</span>';
            if (u.ultima_aula_info) {
                const [aulaTitulo, cursoTitulo] = u.ultima_aula_info.split('|||');
                ultimaAulaVisual = `
                    <div class="text-truncate" style="max-width: 100%;">
                        <strong class="d-block text-truncate small text-dark" title="${aulaTitulo}">${aulaTitulo}</strong>
                        <small class="d-block text-truncate text-muted" title="${cursoTitulo}" style="font-size: 0.75rem;">${cursoTitulo}</small>
                    </div>
                `;
            }

            // Iniciais para o Avatar
            const iniciais = u.nome.substring(0, 2).toUpperCase();

            // Métricas (Protegidas)
            const notaMedia = u.nota_media_geral ? parseFloat(u.nota_media_geral).toFixed(1) : '-';
            const aulasConcluidas = u.aulas_concluidas || 0;
            const melhorCurso = u.melhor_curso || '-';

            cardsUsuarios += `
                <div class="col-md-6 col-xl-4 mb-4">
                    <div class="card shadow-sm rounded-4 h-100 hover-card transition-all position-relative ${cardCustomClass}">
                        <div class="card-body p-4 d-flex flex-column">
                            
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="d-flex align-items-center">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm me-3" style="width: 45px; height: 45px; font-size: 1.1rem;">
                                        ${iniciais}
                                    </div>
                                    <div style="max-width: 160px;">
                                        <h6 class="fw-bold text-dark mb-0 text-truncate" title="${u.nome}">${u.nome}</h6>
                                        <small class="text-muted text-truncate d-block" title="${u.email}">${u.email}</small>
                                    </div>
                                </div>
                                <div class="text-end">
                                    <span class="badge ${badgeTipo} d-block mb-1">${u.tipo}</span>
                                    <span class="badge ${badgeStatus} d-block">${statusVisual}</span>
                                </div>
                            </div>

                            <hr class="opacity-10 my-2">

                            <div class="mb-3 mt-2">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="text-muted"><i class="bi bi-clock-history me-1"></i>Último Acesso:</small>
                                    <div class="text-end">${dataUltimoAcesso}</div>
                                </div>
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <small class="text-muted"><i class="bi bi-play-circle me-1"></i>Última Aula:</small>
                                    <div class="text-end flex-grow-1 ms-2">${ultimaAulaVisual}</div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted"><i class="bi bi-journal-bookmark me-1"></i>Matrículas:</small>
                                    <span class="badge bg-white border text-dark shadow-sm" style="cursor: help;" data-bs-toggle="tooltip" title="${cursosTooltip}">
                                        ${qtdCursos} Cursos
                                    </span>
                                </div>
                            </div>

                            <div class="row g-2 mt-auto mb-4 p-2 bg-white bg-opacity-75 rounded-3 border border-light shadow-sm">
                                <div class="col-4 text-center border-end border-light">
                                    <small class="d-block text-muted" style="font-size: 0.7rem;">Nota Média</small>
                                    <strong class="text-dark"><i class="bi bi-star-fill text-warning me-1 small"></i>${notaMedia}</strong>
                                </div>
                                <div class="col-4 text-center border-end border-light">
                                    <small class="d-block text-muted" style="font-size: 0.7rem;">Aulas Feitas</small>
                                    <strong class="text-dark"><i class="bi bi-check-circle-fill text-success me-1 small"></i>${aulasConcluidas}</strong>
                                </div>
                                <div class="col-4 text-center">
                                    <small class="d-block text-muted" style="font-size: 0.7rem;">Destaque</small>
                                    <strong class="text-dark text-truncate d-block px-1" title="${melhorCurso}" style="font-size: 0.85rem;">${melhorCurso}</strong>
                                </div>
                            </div>

                            <a href="/admin/usuarios/${u.id}/editar" class="btn btn-outline-primary bg-white w-100 fw-bold rounded-pill shadow-sm">
                                <i class="bi bi-pencil-square me-1"></i> Editar Usuário
                            </a>

                        </div>
                    </div>
                </div>
            `;
        });
    }

    // ==========================================
    // PAGINAÇÃO
    // ==========================================
    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml += `<ul class="pagination justify-content-center mb-0 mt-4 shadow-sm">`;
        if (currentPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link rounded-start-pill px-3" href="?page=${currentPage - 1}${searchParam}">&laquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><span class="page-link rounded-start-pill px-3">&laquo;</span></li>`;
        }

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) endPage = Math.min(3, totalPages);
        if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=1${searchParam}">1</a></li>`;
            if (startPage > 2) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHtml += `<li class="page-item active"><span class="page-link fw-bold">${i}</span></li>`;
            } else {
                paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${i}${searchParam}">${i}</a></li>`;
            }
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${totalPages}${searchParam}">${totalPages}</a></li>`;
        }

        if (currentPage < totalPages) {
            paginationHtml += `<li class="page-item"><a class="page-link rounded-end-pill px-3" href="?page=${currentPage + 1}${searchParam}">&raquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><span class="page-link rounded-end-pill px-3">&raquo;</span></li>`;
        }
        paginationHtml += `</ul>`;
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Gestão de Usuários - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            .transition-all { transition: all 0.3s ease; }
            .hover-card:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
        </style>
    </head>
    <body class="bg-light">
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">

            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

                    <div class="row mb-4 align-items-center">
                        <div class="col-md-4 mb-3 mb-md-0">
                            <h3 class="fw-bold text-dark mb-0"><i class="bi bi-people-fill text-primary me-2"></i>Gestão de Usuários</h3>
                            <p class="small text-muted mb-0 mt-1">Exibindo a página ${currentPage} de ${totalPages}.</p>
                        </div>
                        
                        <div class="col-md-5 mb-3 mb-md-0">
                            <form action="/admin/usuarios" method="GET" class="d-flex shadow-sm rounded-pill overflow-hidden bg-white border">
                                <input type="text" name="search" class="form-control border-0 shadow-none ps-4" placeholder="Buscar usuário ou curso..." value="${searchQuery}">
                                <button type="submit" class="btn btn-primary fw-bold px-4 rounded-end-pill">Buscar</button>
                                ${searchQuery ? `<a href="/admin/usuarios" class="btn btn-light border-start text-secondary px-3"><i class="bi bi-x-lg"></i></a>` : ''}
                            </form>
                        </div>

                        <div class="col-md-3 text-md-end">
                            <a href="/admin/usuarios/novo" class="btn btn-success fw-bold rounded-pill shadow-sm px-4">
                                <i class="bi bi-person-plus-fill me-1"></i> Novo Usuário
                            </a>
                        </div>
                    </div>

                    <div class="row">
                        ${cardsUsuarios}
                    </div>
                    
                    <nav aria-label="Navegação de usuários" class="mb-5 pb-4">
                        ${paginationHtml}
                    </nav>

                </div>
            </div>
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            document.addEventListener('DOMContentLoaded', function () {
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            });

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

module.exports = renderAdminUsuariosView;