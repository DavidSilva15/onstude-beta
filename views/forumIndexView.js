// views/forumIndexView.js

function renderForumIndexView(usuarioLogado, topicos, cursos, categoriaAtual, searchAtual) {
    let htmlCategoriasGerais = `
        <a href="/forum" class="list-group-item list-group-item-action ${!categoriaAtual ? 'active fw-bold' : ''}">🌍 Todos os Tópicos</a>
        <a href="/forum?categoria=Geral" class="list-group-item list-group-item-action ${categoriaAtual === 'Geral' ? 'active fw-bold' : ''}">💬 Geral / Outros</a>
        <a href="/forum?categoria=${encodeURIComponent('Dúvida Técnica')}" class="list-group-item list-group-item-action ${categoriaAtual === 'Dúvida Técnica' ? 'active fw-bold' : ''}">💻 Dúvida Técnica</a>
        <a href="/forum?categoria=Plataforma" class="list-group-item list-group-item-action ${categoriaAtual === 'Plataforma' ? 'active fw-bold' : ''}">⚙️ Uso da Plataforma</a>
        <a href="/forum?categoria=Carreira" class="list-group-item list-group-item-action ${categoriaAtual === 'Carreira' ? 'active fw-bold' : ''}">🚀 Mercado e Carreira</a>
    `;

    let htmlCategoriasCursos = '';
    if (cursos && cursos.length > 0) {
        cursos.forEach(c => {
            const nomeCat = `Curso: ${c.titulo}`;
            const isActive = categoriaAtual === nomeCat ? 'active fw-bold' : '';
            htmlCategoriasCursos += `<a href="/forum?categoria=${encodeURIComponent(nomeCat)}" class="list-group-item list-group-item-action text-truncate ${isActive}" title="${c.titulo}">📚 ${c.titulo}</a>`;
        });
    }

    let htmlTopicos = '';

    if (topicos.length === 0) {
        htmlTopicos = `
            <div class="text-center py-5 bg-white border rounded shadow-sm">
                <h4 class="text-secondary fw-bold mb-3">Nenhum tópico encontrado</h4>
                <p class="text-muted">Não encontrámos nada para a sua pesquisa. Que tal tentar outras palavras ou criar uma nova dúvida?</p>
            </div>
        `;
    } else {
        topicos.forEach(t => {
            const dataFormatada = new Date(t.criado_em).toLocaleDateString('pt-BR');
            const statusBadge = t.status === 'RESOLVIDO' ? '<span class="badge bg-success ms-2">Resolvido</span>' : '<span class="badge bg-primary ms-2">Aberto</span>';
            const avatar = t.foto_perfil_url ? `<img src="${t.foto_perfil_url}" class="rounded-circle" style="width: 50px; height: 50px; object-fit: cover;">` : `<div class="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white fw-bold" style="width: 50px; height: 50px; font-size: 1.2rem;">${t.autor_nome.charAt(0).toUpperCase()}</div>`;
            
            // Logica de Badges e Estatísticas
            const tipoBadge = t.autor_tipo === 'ADMIN' ? '<span class="badge bg-danger ms-1" style="font-size: 0.6rem;">Equipa</span>' : '<span class="badge bg-primary ms-1" style="font-size: 0.6rem;">Aluno</span>';
            const statsMembro = t.autor_tipo === 'ALUNO' ? `
                <div class="d-flex align-items-center mt-1 mb-2 gap-2" style="font-size: 0.75rem;">
                    ${t.nota_media ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" title="Média de Notas">⭐ ${t.nota_media}</span>` : ''}
                    ${t.melhor_curso ? `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 text-truncate" style="max-width: 150px;" title="Melhor Desempenho">🏆 ${t.melhor_curso}</span>` : ''}
                </div>
            ` : '';

            htmlTopicos += `
                <div class="card shadow-sm border-0 mb-3 hover-shadow transition">
                    <div class="card-body p-4 d-flex flex-column flex-md-row align-items-md-center">
                        <div class="d-flex align-items-center mb-3 mb-md-0 flex-grow-1">
                            <div class="me-3">
                                ${avatar}
                            </div>
                            <div>
                                <h5 class="mb-1">
                                    <a href="/forum/topico/${t.id}" class="text-decoration-none text-dark fw-bold">${t.titulo}</a>
                                </h5>
                                <div class="text-muted small">
                                    Por <strong>${t.autor_nome}</strong> ${tipoBadge} • ${dataFormatada}
                                </div>
                                ${statsMembro}
                                <div class="d-flex flex-wrap align-items-center mt-1">
                                    <a href="/forum?categoria=${encodeURIComponent(t.categoria)}" class="badge bg-light text-secondary text-decoration-none border text-truncate hover-bg" style="max-width: 200px;">${t.categoria}</a>
                                    ${statusBadge}
                                </div>
                            </div>
                        </div>
                        
                        <div class="d-flex align-items-center justify-content-between mt-3 mt-md-0 ms-md-4 border-start-md ps-md-4">
                            <div class="d-flex text-center me-4">
                                <div class="me-3">
                                    <div class="fs-5 fw-bold text-secondary">${t.total_respostas}</div>
                                    <div class="small text-muted">resps</div>
                                </div>
                                <div>
                                    <div class="fs-5 fw-bold text-secondary">${t.visualizacoes}</div>
                                    <div class="small text-muted">views</div>
                                </div>
                            </div>
                            <div>
                                <a href="/forum/topico/${t.id}" class="btn btn-outline-primary fw-bold text-nowrap">💬 Responder</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    const linkPainel = usuarioLogado ? (usuarioLogado.tipo === 'ADMIN' ? '/admin' : '/aluno') : null;
    const btnAcaoPrincipal = usuarioLogado 
        ? `<a href="/forum/novo" class="btn btn-primary fw-bold shadow-sm">+ Nova Pergunta</a>`
        : `<a href="/login?returnTo=/forum" class="btn btn-outline-primary fw-bold bg-white">Faça Login para Perguntar</a>`;
    
    let tituloExplorando = categoriaAtual ? `Explorando: <span class="text-primary">${categoriaAtual}</span>` : 'Explorando: Todos os Tópicos';
    if (searchAtual) {
        tituloExplorando += ` <span class="text-muted fs-6 fw-normal ms-2">| Buscando por "${searchAtual}"</span>`;
    }

    const linkLimpar = categoriaAtual ? `/forum?categoria=${encodeURIComponent(categoriaAtual)}` : '/forum';
    const btnLimpar = searchAtual ? `<a href="${linkLimpar}" class="btn btn-light border-0 text-muted px-3 d-flex align-items-center transition hover-bg">Limpar</a>` : '';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Comunidade - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f8f9fa; }
            .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; transform: translateY(-2px); transition: all .3s ease; }
            .hover-bg:hover { background-color: #e9ecef !important; }
            .transition { transition: all .3s ease; }
            @media (min-width: 768px) {
                .border-start-md { border-left: 1px solid #dee2e6!important; }
                .ps-md-4 { padding-left: 1.5rem!important; }
            }
            .sidebar-sticky { position: sticky; top: 20px; z-index: 10; }
        </style>
    </head>
    <body>
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary" href="/forum">OnStude <span class="text-white fw-light">Fórum</span></a>
                <div class="d-flex ms-auto">
                    ${usuarioLogado 
                        ? `<a href="${linkPainel}" class="btn btn-outline-light btn-sm me-2">Voltar ao Meu Painel</a>` 
                        : `<a href="/login?returnTo=/forum" class="btn btn-primary btn-sm fw-bold">Entrar na Plataforma</a>`
                    }
                </div>
            </div>
        </nav>

        <div class="container mt-5 mb-5">
            <div class="row mb-4 align-items-center">
                <div class="col-md-8">
                    <h2 class="fw-bold text-dark mb-1">Fórum de Dúvidas</h2>
                    <p class="text-muted mb-0">Ajude e seja ajudado pela comunidade OnStude.</p>
                </div>
                <div class="col-md-4 text-md-end mt-3 mt-md-0 d-none d-md-block">
                    ${btnAcaoPrincipal}
                </div>
            </div>

            <div class="row">
                <div class="col-lg-3 mb-4">
                    <div class="d-block d-md-none mb-4">
                        ${btnAcaoPrincipal.replace('btn ', 'btn w-100 ')}
                    </div>

                    <div class="card shadow-sm border-0 sidebar-sticky">
                        <div class="card-header bg-white py-3 border-bottom-0">
                            <h6 class="fw-bold mb-0 text-secondary">Categorias Gerais</h6>
                        </div>
                        <div class="list-group list-group-flush rounded-bottom">
                            ${htmlCategoriasGerais}
                        </div>

                        ${htmlCategoriasCursos ? `
                        <div class="card-header bg-white py-3 border-top border-bottom-0 mt-2">
                            <h6 class="fw-bold mb-0 text-secondary">Dúvidas por Curso</h6>
                        </div>
                        <div class="list-group list-group-flush rounded-bottom mb-2" style="max-height: 300px; overflow-y: auto;">
                            ${htmlCategoriasCursos}
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="col-lg-9">
                    <form action="/forum" method="GET" class="mb-4">
                        ${categoriaAtual ? `<input type="hidden" name="categoria" value="${categoriaAtual}">` : ''}
                        <div class="input-group shadow-sm bg-white rounded">
                            <span class="input-group-text bg-white border-0 text-muted ps-3">🔍</span>
                            <input type="text" class="form-control form-control-lg border-0 bg-white shadow-none" name="search" placeholder="Buscar por palavra-chave ou dúvida..." value="${searchAtual || ''}">
                            ${btnLimpar}
                            <button class="btn btn-primary px-4 fw-bold" type="submit">Buscar</button>
                        </div>
                    </form>

                    <div class="d-flex align-items-center mb-3 px-1">
                        <h6 class="mb-0 fw-bold text-muted">${tituloExplorando}</h6>
                        <span class="ms-auto text-secondary small">${topicos.length} resultados</span>
                    </div>
                    
                    ${htmlTopicos}
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