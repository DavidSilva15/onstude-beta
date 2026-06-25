// views/adminUsuariosView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminUsuariosView(admin, usuarios, currentPage = 1, totalPages = 1, searchQuery = '', currentFilter = 'todos', filterCounts = {}) {
    
    const htmlSidebar = renderAdminMenuLateral(admin, 'usuarios');

    const counts = {
        todos: filterCounts.todos || 0,
        ativos: filterCounts.ativos || 0,
        concluintes: filterCounts.concluintes || 0,
        faltosos: filterCounts.faltosos || 0,
        inativos: filterCounts.inativos || 0
    };

    let cardsUsuarios = '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
    const filterParam = currentFilter && currentFilter !== 'todos' ? `&filter=${currentFilter}` : '';

    const filterHtml = `
    <div class="d-flex gap-2 overflow-auto pb-2 mb-4 scrollbar-hide" style="white-space: nowrap;">
        <a href="?filter=todos${searchParam}" class="btn ${currentFilter === 'todos' || !currentFilter ? 'btn-primary' : 'btn-outline-secondary bg-white'} rounded-pill shadow-sm fw-bold px-3 d-inline-flex align-items-center transition-all">
            Todos <span class="badge ${currentFilter === 'todos' || !currentFilter ? 'bg-white text-primary' : 'bg-secondary'} ms-2">${counts.todos}</span>
        </a>
        <a href="?filter=ativos${searchParam}" class="btn ${currentFilter === 'ativos' ? 'btn-success' : 'btn-outline-secondary bg-white'} rounded-pill shadow-sm fw-bold px-3 d-inline-flex align-items-center transition-all">
            Ativos (Cursando) <span class="badge ${currentFilter === 'ativos' ? 'bg-white text-success' : 'bg-secondary'} ms-2">${counts.ativos}</span>
        </a>
        <a href="?filter=concluintes${searchParam}" class="btn ${currentFilter === 'concluintes' ? 'btn-info text-dark' : 'btn-outline-secondary bg-white'} rounded-pill shadow-sm fw-bold px-3 d-inline-flex align-items-center transition-all">
            Concluintes <span class="badge ${currentFilter === 'concluintes' ? 'bg-white text-dark' : 'bg-secondary'} ms-2">${counts.concluintes}</span>
        </a>
        <a href="?filter=faltosos${searchParam}" class="btn ${currentFilter === 'faltosos' ? 'btn-danger' : 'btn-outline-secondary bg-white'} rounded-pill shadow-sm fw-bold px-3 d-inline-flex align-items-center transition-all">
            Faltosos <span class="badge ${currentFilter === 'faltosos' ? 'bg-white text-danger' : 'bg-secondary'} ms-2">${counts.faltosos}</span>
        </a>
        <a href="?filter=inativos${searchParam}" class="btn ${currentFilter === 'inativos' ? 'btn-warning text-dark' : 'btn-outline-secondary bg-white'} rounded-pill shadow-sm fw-bold px-3 d-inline-flex align-items-center transition-all">
            Inativos <span class="badge ${currentFilter === 'inativos' ? 'bg-white text-dark' : 'bg-secondary'} ms-2">${counts.inativos}</span>
        </a>
    </div>
    `;

    if (usuarios.length === 0) {
        cardsUsuarios = `<div class="col-12 text-center text-muted py-5"><i class="bi bi-people fs-1 opacity-50 mb-3 d-block"></i>Nenhum usuário encontrado na categoria "${currentFilter}".</div>`;
    } else {
        usuarios.forEach(u => {
            let badgeTipo = u.tipo === 'ADMIN' ? 'bg-danger' : 'bg-primary';
            
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

            let cardCustomClass = 'bg-white border-0'; 
            let htmlWhatsAppBtn = '';

            if (statusVisual === 'CONCLUINTE') {
                cardCustomClass = 'bg-success bg-opacity-10 border border-success border-opacity-25';
            
            // TRAVA APLICADA AQUI: Só entra na lógica de faltoso/WhatsApp se for ALUNO e estiver ATIVO
            } else if (u.tipo === 'ALUNO' && u.status === 'ATIVO') {
                
                let showWhatsBtn = false;
                let msgWhats = '';
                const primeiroNome = u.nome.split(' ')[0];

                if (!u.ultimo_acesso) {
                    cardCustomClass = 'bg-warning bg-opacity-10 border border-warning border-opacity-25';
                    showWhatsBtn = true;
                    msgWhats = `Olá ${primeiroNome}, vimos que você ainda não iniciou os seus estudos na OnStude! Que tal dar o primeiro passo hoje? 🚀`;
                } else {
                    const diffEmDias = (new Date() - new Date(u.ultimo_acesso)) / (1000 * 60 * 60 * 24);
                    if (diffEmDias >= 2) {
                        cardCustomClass = 'bg-danger bg-opacity-10 border border-danger border-opacity-25';
                        showWhatsBtn = true;
                        msgWhats = `Olá ${primeiroNome}, notamos que você não acessa a OnStude há alguns dias. Volte para continuar de onde parou, a sua evolução é importante para nós! 📚🚀`;
                    }
                }

                if (showWhatsBtn && u.telefone) {
                    const numeroWhats = u.telefone.replace(/\D/g, ''); 
                    if (numeroWhats.length >= 10) { 
                        const numeroFormatado = numeroWhats.startsWith('55') ? numeroWhats : `55${numeroWhats}`;
                        const linkWhats = `https://wa.me/${numeroFormatado}?text=${encodeURIComponent(msgWhats)}`;
                        
                        htmlWhatsAppBtn = `
                            <a href="${linkWhats}" target="_blank" class="btn btn-success btn-sm w-100 fw-bold rounded-pill shadow-sm mt-2" style="font-size: 0.75rem;">
                                <i class="bi bi-whatsapp me-1"></i> Lembrar
                            </a>
                        `;
                    }
                }
            }

            const cursosTooltip = u.cursos_lista ? u.cursos_lista : 'Nenhum curso';
            const qtdCursos = u.total_cursos || 0;

            let dataUltimoAcesso = '<span class="text-danger fw-semibold" style="font-size: 0.7rem;">Nunca acessou</span>';
            if (u.ultimo_acesso) {
                const dataAcesso = new Date(u.ultimo_acesso);
                dataUltimoAcesso = `<span class="fw-semibold text-dark" style="font-size: 0.7rem;">${dataAcesso.toLocaleDateString('pt-BR')} <span class="text-muted fw-normal">às ${dataAcesso.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span></span>`;
            }

            let ultimaAulaVisual = '<span class="text-muted" style="font-size: 0.7rem;">Nenhuma atividade</span>';
            if (u.ultima_aula_info) {
                const [aulaTitulo, cursoTitulo] = u.ultima_aula_info.split('|||');
                ultimaAulaVisual = `
                    <div class="text-truncate" style="max-width: 100%;">
                        <strong class="d-block text-truncate text-dark" title="${aulaTitulo}" style="font-size: 0.75rem;">${aulaTitulo}</strong>
                        <small class="d-block text-truncate text-muted" title="${cursoTitulo}" style="font-size: 0.65rem;">${cursoTitulo}</small>
                    </div>
                `;
            }

            const iniciais = u.nome.substring(0, 2).toUpperCase();
            const notaMedia = u.nota_media_geral ? parseFloat(u.nota_media_geral).toFixed(1) : '-';
            const aulasConcluidas = u.aulas_concluidas || 0;
            const melhorCurso = u.melhor_curso || '-';

            // ATUALIZAÇÃO DO GRID: xl-3 = 4 colunas em monitores grandes
            cardsUsuarios += `
                <div class="col-md-6 col-xl-3 mb-4">
                    <div class="card shadow-sm rounded-4 h-100 transition-all position-relative ${cardCustomClass}">
                        <div class="card-body p-3 d-flex flex-column">
                            
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div class="d-flex align-items-center flex-grow-1 overflow-hidden pe-2">
                                    <div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm me-2 flex-shrink-0" style="width: 35px; height: 35px; font-size: 0.9rem;">
                                        ${iniciais}
                                    </div>
                                    <div class="overflow-hidden">
                                        <h6 class="fw-bold text-dark mb-0 text-truncate" title="${u.nome}" style="font-size: 0.85rem;">${u.nome}</h6>
                                        <small class="text-muted text-truncate d-block" title="${u.email}" style="font-size: 0.7rem;">${u.email}</small>
                                    </div>
                                </div>
                                <div class="text-end flex-shrink-0">
                                    <span class="badge ${badgeTipo} d-block mb-1" style="font-size: 0.6rem;">${u.tipo}</span>
                                    <span class="badge ${badgeStatus} d-block" style="font-size: 0.6rem;">${statusVisual}</span>
                                </div>
                            </div>

                            <hr class="opacity-10 my-2">

                            <div class="mb-2 mt-1">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-clock-history me-1"></i>Acesso:</small>
                                    <div class="text-end">${dataUltimoAcesso}</div>
                                </div>
                                <div class="d-flex justify-content-between align-items-start mb-1">
                                    <small class="text-muted flex-shrink-0" style="font-size: 0.7rem;"><i class="bi bi-play-circle me-1"></i>Aula:</small>
                                    <div class="text-end flex-grow-1 ms-2 overflow-hidden">${ultimaAulaVisual}</div>
                                </div>
                                <div class="d-flex justify-content-between align-items-center">
                                    <small class="text-muted" style="font-size: 0.7rem;"><i class="bi bi-journal-bookmark me-1"></i>Cursos:</small>
                                    <span class="badge bg-white border text-dark shadow-sm" style="cursor: help; font-size: 0.65rem;" data-bs-toggle="tooltip" title="${cursosTooltip}">
                                        ${qtdCursos}
                                    </span>
                                </div>
                            </div>

                            <div class="row g-2 mt-auto mb-3 p-2 bg-white bg-opacity-75 rounded-3 border border-light shadow-sm">
                                <div class="col-4 text-center border-end border-light px-1">
                                    <small class="d-block text-muted text-truncate" style="font-size: 0.65rem;">Média</small>
                                    <strong class="text-dark d-block text-truncate" style="font-size: 0.8rem;"><i class="bi bi-star-fill text-warning me-1" style="font-size: 0.7rem;"></i>${notaMedia}</strong>
                                </div>
                                <div class="col-4 text-center border-end border-light px-1">
                                    <small class="d-block text-muted text-truncate" style="font-size: 0.65rem;">Feitas</small>
                                    <strong class="text-dark d-block text-truncate" style="font-size: 0.8rem;"><i class="bi bi-check-circle-fill text-success me-1" style="font-size: 0.7rem;"></i>${aulasConcluidas}</strong>
                                </div>
                                <div class="col-4 text-center px-1">
                                    <small class="d-block text-muted text-truncate" style="font-size: 0.65rem;">Top Curso</small>
                                    <strong class="text-dark text-truncate d-block" title="${melhorCurso}" style="font-size: 0.8rem;">${melhorCurso}</strong>
                                </div>
                            </div>

                            <div class="mt-auto d-flex flex-column gap-2">
                                <a href="/admin/usuarios/${u.id}/editar" class="btn btn-outline-primary bg-white btn-sm w-100 fw-bold rounded-pill shadow-sm" style="font-size: 0.75rem;">
                                    <i class="bi bi-pencil-square me-1"></i> Editar
                                </a>
                                ${htmlWhatsAppBtn}
                            </div>

                        </div>
                    </div>
                </div>
            `;
        });
    }

    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml += `<ul class="pagination justify-content-center mb-0 mt-4 shadow-sm">`;
        
        let urlBasePagination = `?`;
        if(searchQuery) urlBasePagination += `search=${encodeURIComponent(searchQuery)}&`;
        if(currentFilter && currentFilter !== 'todos') urlBasePagination += `filter=${currentFilter}&`;

        if (currentPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link rounded-start-pill px-3" href="${urlBasePagination}page=${currentPage - 1}">&laquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><span class="page-link rounded-start-pill px-3">&laquo;</span></li>`;
        }

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) endPage = Math.min(3, totalPages);
        if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="${urlBasePagination}page=1">1</a></li>`;
            if (startPage > 2) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHtml += `<li class="page-item active"><span class="page-link fw-bold">${i}</span></li>`;
            } else {
                paginationHtml += `<li class="page-item"><a class="page-link" href="${urlBasePagination}page=${i}">${i}</a></li>`;
            }
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            paginationHtml += `<li class="page-item"><a class="page-link" href="${urlBasePagination}page=${totalPages}">${totalPages}</a></li>`;
        }

        if (currentPage < totalPages) {
            paginationHtml += `<li class="page-item"><a class="page-link rounded-end-pill px-3" href="${urlBasePagination}page=${currentPage + 1}">&raquo;</a></li>`;
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
        <link rel="icon" type="image/x-icon" href="/img/favicon-onstude.ico">
        <link rel="shortcut icon" type="image/x-icon" href="/img/favicon-onstude.ico">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            .transition-all { transition: all 0.3s ease; }
            
            /* Oculta scrollbar horizontal dos filtros no Windows/Mac, mas mantém funcionalidade */
            .scrollbar-hide::-webkit-scrollbar { display: none; }
            .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
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
                                <input type="text" name="search" class="form-control border-0 shadow-none ps-4" placeholder="Buscar usuário..." value="${searchQuery}">
                                ${currentFilter !== 'todos' ? `<input type="hidden" name="filter" value="${currentFilter}">` : ''}
                                <button type="submit" class="btn btn-primary fw-bold px-4 rounded-end-pill">Buscar</button>
                                ${searchQuery ? `<a href="/admin/usuarios?filter=${currentFilter}" class="btn btn-light border-start text-secondary px-3"><i class="bi bi-x-lg"></i></a>` : ''}
                            </form>
                        </div>

                        <div class="col-md-3 text-md-end">
                            <a href="/admin/usuarios/novo" class="btn btn-success fw-bold rounded-pill shadow-sm px-4">
                                <i class="bi bi-person-plus-fill me-1"></i> Novo Usuário
                            </a>
                        </div>
                    </div>

                    ${filterHtml}

                    <div class="row">
                        ${cardsUsuarios}
                    </div>
                    
                    <nav aria-label="Navegação de usuários" class="mb-5 pb-4">
                        ${paginationHtml}
                    </nav>

                </div>
            </div>
        </div>

        ${require('./toastProcessamento')()}
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script src="/js/toast.js"></script>

        <script>
            // Lógica para capturar mensagens de sucesso/erro vindas do backend via URL (Redirecionamento)
            document.addEventListener('DOMContentLoaded', function() {
                const urlParams = new URLSearchParams(window.location.search);
                const msgSucesso = urlParams.get('sucesso') || urlParams.get('success');
                const msgErro = urlParams.get('erro') || urlParams.get('error');
                
                if (msgSucesso) {
                    if (typeof Toast !== 'undefined') Toast.success(msgSucesso);
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete('sucesso');
                    newUrl.searchParams.delete('success');
                    window.history.replaceState({}, document.title, newUrl.toString());
                }
                
                if (msgErro) {
                    if (typeof Toast !== 'undefined') Toast.error(msgErro);
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete('erro');
                    newUrl.searchParams.delete('error');
                    window.history.replaceState({}, document.title, newUrl.toString());
                }
            });

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