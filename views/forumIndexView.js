// views/forumIndexView.js

function renderForumIndexView(usuarioLogado, topicos, cursos, categoriaAtual, searchAtual) {
    let htmlCategoriasGerais = `
        <a href="/forum" class="category-item ${!categoriaAtual ? 'active' : ''}">
            <i class="bi bi-globe me-2"></i> Todos os Tópicos
        </a>
        <a href="/forum?categoria=Geral" class="category-item ${categoriaAtual === 'Geral' ? 'active' : ''}">
            <i class="bi bi-chat-quote me-2"></i> Geral / Outros
        </a>
        <a href="/forum?categoria=${encodeURIComponent('Dúvida Técnica')}" class="category-item ${categoriaAtual === 'Dúvida Técnica' ? 'active' : ''}">
            <i class="bi bi-laptop me-2"></i> Dúvida Técnica
        </a>
        <a href="/forum?categoria=Plataforma" class="category-item ${categoriaAtual === 'Plataforma' ? 'active' : ''}">
            <i class="bi bi-gear me-2"></i> Uso da Plataforma
        </a>
        <a href="/forum?categoria=Carreira" class="category-item ${categoriaAtual === 'Carreira' ? 'active' : ''}">
            <i class="bi bi-rocket me-2"></i> Mercado e Carreira
        </a>
    `;

    let htmlCategoriasCursos = '';
    if (cursos && cursos.length > 0) {
        cursos.forEach(c => {
            const nomeCat = `Curso: ${c.titulo}`;
            const isActive = categoriaAtual === nomeCat ? 'active' : '';
            htmlCategoriasCursos += `
                <a href="/forum?categoria=${encodeURIComponent(nomeCat)}" class="category-item text-truncate ${isActive}" title="${c.titulo}">
                    <i class="bi bi-journal-bookmark me-2"></i> ${c.titulo}
                </a>`;
        });
    }

    let htmlTopicos = '';

    if (topicos.length === 0) {
        htmlTopicos = `
            <div class="text-center py-5 bg-white border rounded-4 shadow-sm my-3 mx-2 mx-md-0">
                <i class="bi bi-search fs-1 text-muted opacity-50 mb-3 d-block"></i>
                <h4 class="text-dark fw-bold mb-2">Nenhum tópico encontrado</h4>
                <p class="text-muted mb-4">Não encontrámos nada para a sua pesquisa. Que tal tentar outras palavras ou criar uma nova dúvida?</p>
                <a href="/forum/novo" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">Criar Tópico Agora</a>
            </div>
        `;
    } else {
        topicos.forEach(t => {
            const dataFormatada = new Date(t.criado_em).toLocaleDateString('pt-BR');
            const statusBadge = t.status === 'RESOLVIDO' 
                ? '<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1"><i class="bi bi-check-circle-fill me-1"></i>Resolvido</span>' 
                : '<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 rounded-pill px-2 py-1"><i class="bi bi-clock-history me-1"></i>Aberto</span>';
            
            const avatar = t.foto_perfil_url 
                ? `<img src="${t.foto_perfil_url}" class="rounded-circle shadow-sm border border-2 border-white avatar-img" style="width: 55px; height: 55px; object-fit: cover;">` 
                : `<div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm border border-2 border-white avatar-img" style="width: 55px; height: 55px; font-size: 1.2rem;">${t.autor_nome.charAt(0).toUpperCase()}</div>`;
            
            const tipoBadge = t.autor_tipo === 'ADMIN' 
                ? '<span class="badge bg-danger ms-1" style="font-size: 0.65rem; padding: 0.2rem 0.4rem;">Equipa</span>' 
                : '<span class="badge bg-secondary bg-opacity-25 text-dark border ms-1" style="font-size: 0.65rem; padding: 0.2rem 0.4rem;">Aluno</span>';
            
            // Badges de conquistas ajustadas para o formato com emojis e max-width solicitado
            const statsMembro = t.autor_tipo === 'ALUNO' ? `
                <div class="d-flex align-items-center mt-1 mb-2 gap-2" style="font-size: 0.75rem;">
                    ${t.nota_media ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" title="Média de Notas">⭐ ${t.nota_media}</span>` : ''}
                    ${t.melhor_curso ? `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 text-truncate" style="max-width: 200px;" title="Melhor Desempenho">🏆 ${t.melhor_curso}</span>` : ''}
                </div>
            ` : '';

            htmlTopicos += `
                <div class="card shadow-sm border-0 mb-3 rounded-4 hover-shadow transition topic-card">
                    <div class="card-body p-4 d-flex flex-column flex-md-row align-items-md-center">
                        <div class="d-flex align-items-start align-items-md-center mb-3 mb-md-0 flex-grow-1 overflow-hidden">
                            <div class="me-3 mt-1 mt-md-0 flex-shrink-0">
                                ${avatar}
                            </div>
                            <div class="overflow-hidden w-100">
                                <h5 class="mb-1 text-truncate">
                                    <a href="/forum/topico/${t.id}" class="text-decoration-none text-dark fw-bold">${t.titulo}</a>
                                </h5>
                                <div class="text-muted small mb-2 d-flex flex-wrap align-items-center gap-1">
                                    <span>Por <strong>${t.autor_nome}</strong></span> ${tipoBadge} <span class="text-secondary opacity-50 px-1 d-none d-sm-inline">•</span> <span class="d-block d-sm-inline w-100 w-sm-auto mt-1 mt-sm-0">${dataFormatada}</span>
                                </div>
                                ${statsMembro}
                                <div class="d-flex flex-wrap align-items-center mt-2 gap-2">
                                    <a href="/forum?categoria=${encodeURIComponent(t.categoria)}" class="badge bg-light text-secondary text-decoration-none border text-truncate hover-bg rounded-pill px-2 py-1" style="max-width: 200px;"><i class="bi bi-tag me-1"></i>${t.categoria}</a>
                                    ${statusBadge}
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex align-items-center justify-content-between mt-2 mt-md-0 ms-md-4 border-start-md ps-md-4">
                            <div class="d-flex text-center me-3 me-md-4 gap-3 gap-md-4">
                                <div>
                                    <div class="fs-5 fw-bold text-dark lh-1">${t.total_respostas}</div>
                                    <div class="small text-muted" style="font-size: 0.75rem;">respostas</div>
                                </div>
                                <div>
                                    <div class="fs-5 fw-bold text-dark lh-1">${t.visualizacoes}</div>
                                    <div class="small text-muted" style="font-size: 0.75rem;">views</div>
                                </div>
                            </div>
                            <div>
                                <a href="/forum/topico/${t.id}" class="btn btn-outline-primary btn-sm rounded-pill fw-bold text-nowrap px-3 transition-all">
                                    <i class="bi bi-chat-text"></i> <span class="ms-1">Responder</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    const linkPainel = usuarioLogado ? (usuarioLogado.tipo === 'ADMIN' ? '/admin' : '/aluno') : null;
    const btnAcaoPrincipal = usuarioLogado 
        ? `<a href="/forum/novo" class="btn btn-primary fw-bold shadow-sm rounded-pill px-4 py-2"><i class="bi bi-plus-lg me-1"></i> Nova Pergunta</a>`
        : `<a href="/login?returnTo=/forum" class="btn btn-primary fw-bold shadow-sm rounded-pill px-4 py-2"><i class="bi bi-box-arrow-in-right me-1"></i> Entrar para Perguntar</a>`;
    
    let tituloExplorando = categoriaAtual ? `Explorando: <span class="text-primary">${categoriaAtual}</span>` : 'Explorando: Todos os Tópicos';
    if (searchAtual) {
        tituloExplorando += ` <span class="text-muted fs-6 fw-normal ms-2">| Buscando por "${searchAtual}"</span>`;
    }

    const linkLimpar = categoriaAtual ? `/forum?categoria=${encodeURIComponent(categoriaAtual)}` : '/forum';
    const btnLimpar = searchAtual ? `<a href="${linkLimpar}" class="btn btn-light rounded-pill border-0 text-muted px-3 me-2 d-flex align-items-center transition hover-bg" title="Limpar Busca"><i class="bi bi-x-lg"></i></a>` : '';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Comunidade - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            .navbar-custom { background-color: #ffffff; border-bottom: 1px solid #eaeaea; }
            
            .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important; transform: translateY(-3px); transition: all .3s ease; }
            .hover-bg:hover { background-color: #e9ecef !important; }
            .transition { transition: all .3s ease; }
            
            .category-item { display: flex; align-items: center; padding: 0.7rem 1rem; margin-bottom: 0.3rem; border-radius: 12px; color: #495057; font-weight: 600; text-decoration: none; transition: all 0.2s; border: 1px solid transparent; font-size: 0.95rem; }
            .category-item:hover { background-color: #f8f9fa; color: #0d6efd; border-color: #e9ecef; }
            .category-item.active { background-color: #e7f1ff; color: #0d6efd; border-color: #b6d4fe; }

            .input-group-custom { background-color: #ffffff; border-radius: 50px; border: 2px solid #e9ecef; transition: all 0.3s ease; }
            .input-group-custom:focus-within { border-color: #0d6efd; box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15); }
            
            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background-color: #ced4da; border-radius: 10px; }

            @media (min-width: 768px) {
                .border-start-md { border-left: 1px solid #eaeaea!important; }
                .ps-md-4 { padding-left: 1.5rem!important; }
            }
            .sidebar-sticky { position: sticky; top: 100px; z-index: 10; }

            /* ==========================================
               RESPONSIVIDADE EXTREMA (MOBILE)
               ========================================== */
            @media (max-width: 991.98px) {
                .container { max-width: 100%; padding-left: 15px; padding-right: 15px; }
            }

            @media (max-width: 767.98px) {
                .mobile-no-px { padding-left: 0 !important; padding-right: 0 !important; }
                
                .topic-card { 
                    border-radius: 0 !important; 
                    margin-bottom: 0 !important; 
                    box-shadow: none !important; 
                    border-bottom: 1px solid #eaeaea !important; 
                    border-top: none; border-left: none; border-right: none;
                }
                .topic-card:first-child { border-top: 1px solid #eaeaea !important; }
                .topic-card .card-body { padding: 1.25rem 1rem !important; }
                
                .border-start-md { 
                    border-left: none !important; padding-left: 0 !important; margin-left: 0 !important; 
                    margin-top: 1rem !important; padding-top: 1rem; border-top: 1px solid #eaeaea; 
                    width: 100%; justify-content: space-between; 
                }

                .avatar-img { width: 45px !important; height: 45px !important; font-size: 1rem !important; }
                h5.mb-1 { font-size: 1.1rem; }
            }
        </style>
    </head>
    <body>
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <nav class="navbar navbar-expand-lg navbar-custom sticky-top py-3 shadow-sm z-3">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary fs-4 d-flex align-items-center" href="/forum">
                    <i class="bi bi-chat-square-dots-fill me-2"></i> OnStude<span class="text-dark">.</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 ms-2 fs-6 rounded-pill fw-normal d-none d-sm-inline-block">Fórum</span>
                </a>
                <div class="d-flex ms-auto">
                    ${usuarioLogado 
                        ? `<a href="${linkPainel}" class="btn btn-outline-dark btn-sm rounded-pill fw-bold px-3">Meu Painel</a>` 
                        : `<a href="/login?returnTo=/forum" class="btn btn-primary btn-sm rounded-pill fw-bold px-3">Entrar</a>`
                    }
                </div>
            </div>
        </nav>

        <div class="offcanvas d-lg-none offcanvas-start" tabindex="-1" id="offcanvasCategorias">
            <div class="offcanvas-header bg-light border-bottom">
                <h5 class="offcanvas-title fw-bold text-dark"><i class="bi bi-funnel-fill me-2"></i> Filtros</h5>
                <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas"></button>
            </div>
            <div class="offcanvas-body">
                <div class="d-flex flex-column gap-1">
                    <h6 class="fw-bold mb-3 text-secondary text-uppercase" style="font-size: 0.8rem;">Gerais</h6>
                    ${htmlCategoriasGerais}
                    
                    ${htmlCategoriasCursos ? `
                    <h6 class="fw-bold mb-3 mt-4 text-secondary text-uppercase" style="font-size: 0.8rem;">Dúvidas por Curso</h6>
                    ${htmlCategoriasCursos}
                    ` : ''}
                </div>
            </div>
        </div>

        <div class="container mt-4 mt-lg-5 mb-5 mobile-no-px">
            
            <div class="row mb-4 align-items-center px-3 px-md-0">
                <div class="col-md-8 text-center text-md-start mb-3 mb-md-0">
                    <h2 class="fw-bold text-dark mb-1">Fórum da Comunidade</h2>
                    <p class="text-muted mb-0">Ajude e seja ajudado pelos alunos da OnStude.</p>
                </div>
                <div class="col-md-4 text-center text-md-end d-none d-md-block">
                    ${btnAcaoPrincipal}
                </div>
            </div>

            <div class="row g-lg-4">
                
                <div class="col-lg-3 d-none d-lg-block mb-4">
                    <div class="card shadow-sm border-0 rounded-4 sidebar-sticky">
                        <div class="card-body p-4">
                            <h6 class="fw-bold mb-3 text-secondary text-uppercase" style="font-size: 0.8rem;">Categorias Gerais</h6>
                            <div class="d-flex flex-column gap-1">
                                ${htmlCategoriasGerais}
                            </div>

                            ${htmlCategoriasCursos ? `
                            <h6 class="fw-bold mb-3 mt-4 text-secondary text-uppercase" style="font-size: 0.8rem;">Dúvidas por Curso</h6>
                            <div class="d-flex flex-column gap-1 overflow-auto pe-2" style="max-height: 400px;">
                                ${htmlCategoriasCursos}
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>

                <div class="col-lg-9 mobile-no-px">
                    
                    <div class="px-3 px-md-0 mb-4">
                        <div class="d-flex gap-2 d-lg-none mb-3">
                            <button class="btn btn-outline-secondary rounded-pill fw-bold w-50 d-flex align-items-center justify-content-center" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasCategorias">
                                <i class="bi bi-funnel-fill me-2"></i> Filtros
                            </button>
                            <a href="${usuarioLogado ? '/forum/novo' : '/login?returnTo=/forum'}" class="btn btn-primary rounded-pill fw-bold w-50 d-flex align-items-center justify-content-center shadow-sm">
                                <i class="bi ${usuarioLogado ? 'bi-plus-lg' : 'bi-box-arrow-in-right'} me-1"></i> ${usuarioLogado ? 'Nova Pergunta' : 'Entrar'}
                            </a>
                        </div>

                        <form action="/forum" method="GET" class="m-0">
                            ${categoriaAtual ? `<input type="hidden" name="categoria" value="${categoriaAtual}">` : ''}
                            <div class="input-group-custom d-flex align-items-center p-1 shadow-sm border bg-white">
                                <span class="ps-3 text-muted"><i class="bi bi-search fs-5"></i></span>
                                <input type="text" class="form-control border-0 bg-transparent shadow-none px-3" name="search" placeholder="O que você está procurando?" value="${searchAtual || ''}">
                                ${btnLimpar}
                                <button class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-none d-sm-block" type="submit">Buscar</button>
                            </div>
                        </form>
                    </div>

                    <div class="d-flex align-items-center mb-3 px-3 px-md-1">
                        <h6 class="mb-0 fw-bold text-muted">${tituloExplorando}</h6>
                        <span class="ms-auto text-secondary small badge bg-light border text-dark rounded-pill">${topicos.length} resultados</span>
                    </div>
                    
                    <div class="bg-white bg-md-transparent pb-3 pb-md-0">
                        ${htmlTopicos}
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            window.addEventListener('pageshow', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 400); }
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderForumIndexView;