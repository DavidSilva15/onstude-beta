// views/adminNotificacoesView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminNotificacoesView(admin, notificacoes, currentPage = 1, totalPages = 1, searchQuery = '') {
    
    const htmlSidebar = renderAdminMenuLateral(admin, 'notificacoes');

    let htmlNotificacoes = '';
    let htmlModais = '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

    if (!notificacoes || notificacoes.length === 0) {
        htmlNotificacoes = `
            <div class="col-12 text-center text-muted py-5">
                <i class="bi bi-bell-slash fs-1 opacity-50 mb-3 d-block"></i>
                Nenhuma notificação encontrada ${searchQuery ? 'para "' + searchQuery + '"' : 'ainda'}.
            </div>`;
    } else {
        notificacoes.forEach((n) => {
            const modalDetalhesId = `modalDetalhes_${n.id}`;
            const modalEditId = `modalEdit_${n.id}`;
            
            const dInicio = n.data_inicio ? new Date(n.data_inicio).toLocaleDateString('pt-BR') + ' ' + new Date(n.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Imediato';
            const dFim = n.data_fim ? new Date(n.data_fim).toLocaleDateString('pt-BR') + ' ' + new Date(n.data_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Sem validade';
            
            // ==========================================
            // LÓGICA DOS BADGES DE CURSOS ALVO
            // ==========================================
            let alvoVisual = '';
            if (n.tipo_alvo === 'TODOS') {
                alvoVisual = '<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 shadow-sm" style="font-size: 0.65rem;">Todos os Alunos</span>';
            } else {
                if (n.cursos_alvo_nomes) {
                    const cursosArray = n.cursos_alvo_nomes.split(',');
                    alvoVisual = cursosArray.map(c => `<span class="badge bg-secondary bg-opacity-10 text-dark border border-secondary border-opacity-25 shadow-sm me-1 mb-1" style="font-size: 0.65rem;">${c.trim()}</span>`).join('');
                } else {
                    alvoVisual = '<span class="badge bg-secondary shadow-sm" style="font-size: 0.65rem;">Cursos Específicos</span>';
                }
            }

            const formatForInput = (dataObj) => dataObj ? new Date(dataObj.getTime() - dataObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
            const valInicio = formatForInput(n.data_inicio ? new Date(n.data_inicio) : null);
            const valFim = formatForInput(n.data_fim ? new Date(n.data_fim) : null);

            // Cálculos de Leitura
            const totalEnviados = n.total_enviados || 0;
            const totalLidos = n.total_lidos || 0;
            const faltamLer = Math.max(0, totalEnviados - totalLidos);
            const taxaLeitura = totalEnviados > 0 ? Math.round((totalLidos / totalEnviados) * 100) : 0;

            // ==========================================
            // LÓGICA DO STATUS E CORES DOS CARDS
            // ==========================================
            let statusVisual = 'EM ANDAMENTO';
            let badgeStatus = 'bg-warning text-dark';
            let cardCustomClass = 'bg-white border-0';

            if (totalEnviados > 0 && totalLidos >= totalEnviados) {
                statusVisual = 'ALCANCE MAX';
                badgeStatus = 'bg-success';
                cardCustomClass = 'bg-success bg-opacity-10 border border-success border-opacity-25';
            } else if (totalEnviados === 0) {
                statusVisual = 'SEM ALVOS';
                badgeStatus = 'bg-secondary';
            }

            let imagemUrlTratada = '';
            if (n.imagem_url) {
                const partes = n.imagem_url.split('/uploads/');
                imagemUrlTratada = partes.length > 1 ? '/uploads/' + partes[1] : n.imagem_url;
            }

            // Respostas
            let htmlRespostas = '';
            let btnExportar = ''; 

            if (n.tipo_interacao === 'NENHUM') {
                htmlRespostas = '<div class="alert alert-secondary text-center small mb-0 rounded-3">Esta notificação é apenas informativa. Não há respostas a exibir.</div>';
            } else if (n.respostas && n.respostas.length > 0) {
                btnExportar = `<a href="/admin/notificacoes/${n.id}/exportar" class="btn btn-sm btn-success fw-bold rounded-pill shadow-sm"><i class="bi bi-file-earmark-excel me-1"></i> Exportar Dados</a>`;

                let linhasRespostas = n.respostas.map(r => {
                    const dataResp = new Date(r.respondido_em).toLocaleDateString('pt-BR') + ' ' + new Date(r.respondido_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    let conteudoResposta = '';
                    
                    if (n.tipo_interacao === 'AVALIACAO_ESTRELAS') {
                        let estrelas = '';
                        for(let i=1; i<=5; i++) { estrelas += i <= r.avaliacao_estrelas ? '⭐' : '☆'; }
                        conteudoResposta = `<span class="fs-5">${estrelas}</span>`;
                    } else {
                        conteudoResposta = `"${r.resposta_texto}"`;
                    }

                    return `
                        <tr>
                            <td class="fw-semibold text-dark">${r.nome_aluno}</td>
                            <td class="text-secondary">${conteudoResposta}</td>
                            <td class="text-muted small">${dataResp}</td>
                        </tr>
                    `;
                }).join('');

                htmlRespostas = `
                    <div class="table-responsive border rounded-3 bg-white" style="max-height: 300px; overflow-y: auto;">
                        <table class="table table-sm table-hover align-middle mb-0">
                            <thead class="table-light sticky-top shadow-sm">
                                <tr><th class="ps-3">Aluno</th><th>Resposta / Avaliação</th><th>Data</th></tr>
                            </thead>
                            <tbody>${linhasRespostas}</tbody>
                        </table>
                    </div>
                `;
            } else {
                htmlRespostas = '<div class="alert alert-light text-center border small mb-0 rounded-3">Aguardando as respostas dos alunos...</div>';
            }

            let badgeTipo = 'bg-secondary';
            if(n.tipo_interacao === 'PESQUISA_TEXTO') badgeTipo = 'bg-info text-dark';
            if(n.tipo_interacao === 'AVALIACAO_ESTRELAS') badgeTipo = 'bg-primary';

            // ==========================================
            // CARD DA NOTIFICAÇÃO OTIMIZADO
            // ==========================================
            htmlNotificacoes += `
                <div class="col-md-6 col-xl-4 col-xxl-3 mb-4">
                    <div class="card shadow-sm rounded-4 h-100 hover-card transition-all ${cardCustomClass}">
                        <div class="card-body p-3 d-flex flex-column">
                            
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="fw-bold text-dark mb-0 text-truncate pe-2" title="${n.titulo}">${n.titulo}</h6>
                                <span class="badge ${badgeStatus} rounded-pill shadow-sm flex-shrink-0" style="font-size: 0.65rem;">${statusVisual}</span>
                            </div>
                            
                            <div class="mb-2">
                                <span class="badge ${badgeTipo} mb-1 shadow-sm" style="font-size: 0.65rem;">${n.tipo_interacao.replace('_', ' ')}</span>
                                <small class="d-block text-muted mb-1 lh-1" style="font-size: 0.7rem;">Público Alvo:</small>
                                <div class="d-flex flex-wrap gap-1">
                                    ${alvoVisual}
                                </div>
                            </div>

                            <div class="row g-2 mb-3 mt-auto p-2 bg-white bg-opacity-75 rounded-3 border border-light shadow-sm align-items-center">
                                <div class="col-6 mb-1">
                                    <small class="d-block text-muted lh-1 mb-1" style="font-size: 0.65rem;">Início</small>
                                    <strong class="text-dark d-block text-truncate" style="font-size: 0.8rem;"><i class="bi bi-calendar-check text-success me-1"></i>${dInicio.split(' ')[0]}</strong>
                                </div>
                                <div class="col-6 mb-1">
                                    <small class="d-block text-muted lh-1 mb-1" style="font-size: 0.65rem;">Expira em</small>
                                    <strong class="text-dark d-block text-truncate" style="font-size: 0.8rem;"><i class="bi bi-calendar-x text-danger me-1"></i>${dFim.split(' ')[0]}</strong>
                                </div>
                                <div class="col-6 border-top border-light pt-2">
                                    <small class="d-block text-muted lh-1 mb-1" style="font-size: 0.65rem;">Lidos</small>
                                    <strong class="text-success d-block text-truncate" style="font-size: 0.85rem;"><i class="bi bi-check-all me-1"></i>${totalLidos}</strong>
                                </div>
                                <div class="col-6 border-top border-light pt-2">
                                    <small class="d-block text-muted lh-1 mb-1" style="font-size: 0.65rem;">Faltam Ler</small>
                                    <strong class="text-warning text-dark d-block text-truncate" style="font-size: 0.85rem;"><i class="bi bi-hourglass-split me-1"></i>${faltamLer}</strong>
                                </div>
                            </div>

                            <div class="d-flex flex-wrap gap-2 mt-auto">
                                <button class="btn btn-outline-primary bg-white flex-grow-1 btn-sm fw-bold rounded-pill shadow-sm text-truncate" data-bs-toggle="modal" data-bs-target="#${modalDetalhesId}" title="Detalhes">
                                    <i class="bi bi-eye"></i> Detalhes
                                </button>
                                <button class="btn btn-primary flex-grow-1 btn-sm fw-bold rounded-pill shadow-sm text-truncate" data-bs-toggle="modal" data-bs-target="#${modalEditId}" title="Editar">
                                    <i class="bi bi-pencil-square"></i> Editar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // ==========================================
            // MODAIS MANTIDOS INTACTOS
            // ==========================================
            htmlModais += `
                <div class="modal fade" id="${modalDetalhesId}" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                        <div class="modal-content border-0 rounded-4 shadow-lg">
                            <div class="modal-header bg-light border-0">
                                <h5 class="modal-title text-dark fw-bold"><i class="bi bi-envelope-paper text-primary me-2"></i>Detalhes da Notificação</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body p-4 p-md-5">
                                <div class="row g-4">
                                    <div class="col-lg-5">
                                        <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-card-text me-2"></i>Conteúdo do Aviso</h6>
                                        <div class="p-4 bg-light border rounded-4 mb-3">
                                            <h5 class="fw-bold text-dark mb-3">${n.titulo}</h5>
                                            <p class="mb-3 text-dark lh-lg" style="font-size: 0.95rem;">${n.mensagem.replace(/\\n/g, '<br>')}</p>
                                            ${imagemUrlTratada ? `<img src="${imagemUrlTratada}" class="img-fluid rounded-3 border shadow-sm" style="max-height: 200px; object-fit: cover;">` : ''}
                                        </div>
                                        <form action="/admin/notificacoes/${n.id}/excluir" method="POST" onsubmit="return confirm('Tem certeza? Isso apagará as respostas e removerá o aviso dos alunos.');">
                                            <button type="submit" class="btn btn-outline-danger fw-bold rounded-pill w-100"><i class="bi bi-trash3 me-1"></i> Excluir Notificação</button>
                                        </form>
                                    </div>
                                    <div class="col-lg-7">
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <h6 class="fw-bold text-secondary mb-0"><i class="bi bi-chat-left-dots me-2"></i>Respostas dos Alunos</h6>
                                            ${btnExportar}
                                        </div>
                                        ${htmlRespostas}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="${modalEditId}" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered">
                        <div class="modal-content border-0 rounded-4 shadow-lg">
                            <div class="modal-header bg-primary border-0">
                                <h5 class="modal-title text-white fw-bold"><i class="bi bi-pencil-square me-2"></i>Editar Notificação</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <form action="/admin/notificacoes/${n.id}/editar" method="POST">
                                <div class="modal-body p-4">
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Título</label>
                                        <input type="text" class="form-control bg-light" name="titulo" value="${n.titulo}" required>
                                    </div>
                                    <div class="mb-4">
                                        <label class="form-label fw-semibold">Mensagem</label>
                                        <textarea class="form-control bg-light" name="mensagem" rows="4" required>${n.mensagem}</textarea>
                                    </div>
                                    <hr class="opacity-10 mb-4">
                                    <h6 class="fw-bold mb-3 text-secondary"><i class="bi bi-clock-history me-2"></i>Período de Exibição</h6>
                                    <p class="small text-muted mb-3">Pode prolongar ou encurtar o tempo que este aviso aparece para os alunos.</p>
                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold">Data Início</label>
                                            <input type="datetime-local" class="form-control bg-light" name="data_inicio" value="${valInicio}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold">Data Fim (Expiração)</label>
                                            <input type="datetime-local" class="form-control bg-light" name="data_fim" value="${valFim}">
                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer border-0 bg-light">
                                    <button type="button" class="btn btn-secondary fw-bold rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-success fw-bold rounded-pill px-4 shadow-sm">Salvar Alterações</button>
                                </div>
                            </form>
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
        <title>Gerenciar Notificações - Admin OnStude</title>
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

        <div class="container-fluid mt-0 mb-5">
            <div class="row mb-4 align-items-center">
                <div class="col-md-4 mb-3 mb-md-0">
                    <h3 class="fw-bold text-dark mb-0"><i class="bi bi-broadcast text-primary me-2"></i>Notificações</h3>
                    <p class="text-muted small mt-1 mb-0">Página ${currentPage} de ${totalPages}.</p>
                </div>
                
                <div class="col-md-5 mb-3 mb-md-0">
                    <form action="/admin/notificacoes" method="GET" class="d-flex shadow-sm rounded-pill overflow-hidden bg-white border">
                        <input type="text" name="search" class="form-control border-0 shadow-none ps-4" placeholder="Buscar por título ou mensagem..." value="${searchQuery}">
                        <button type="submit" class="btn btn-primary fw-bold px-4 rounded-end-pill">Buscar</button>
                        ${searchQuery ? `<a href="/admin/notificacoes" class="btn btn-light border-start text-secondary px-3"><i class="bi bi-x-lg"></i></a>` : ''}
                    </form>
                </div>

                <div class="col-md-3 text-md-end">
                    <a href="/admin/notificacoes/nova" class="btn btn-success fw-bold rounded-pill px-4 shadow-sm">
                        <i class="bi bi-send-plus-fill me-1"></i> Nova Notificação
                    </a>
                </div>
            </div>

            <div class="row">
                ${htmlNotificacoes}
            </div>

            <nav aria-label="Navegação de notificações" class="mb-5 pb-4">
                ${paginationHtml}
            </nav>

        </div>

        </div> </div> </div>
        
        ${htmlModais}

        ${require('./toastProcessamento')()}

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
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

module.exports = renderAdminNotificacoesView;