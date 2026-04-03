// views/alunoCertificadosView.js

const renderAlunoMenuLateral = require('./alunoMenuLateral');

function renderAlunoCertificadosView(aluno, certificados, currentPage = 1, totalPages = 1, searchQuery = '') {
    
    const htmlSidebar = renderAlunoMenuLateral(aluno, 'certificados');

    let htmlCertificados = '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

    if (certificados.length === 0) {
        htmlCertificados = `
            <div class="col-12 text-center py-5 mt-4 border-0 rounded-4 shadow-sm glass-card">
                <i class="bi bi-award fs-1 opacity-25 mb-3 d-block text-secondary"></i>
                <h4 class="text-dark fw-bold mb-2">Nenhum certificado encontrado</h4>
                <p class="text-muted mb-0">Assim que for matriculado em um curso ou concluir suas aulas, eles aparecerão aqui.</p>
            </div>
        `;
    } else {
        certificados.forEach(cert => {
            const thumb = cert.certificado_template_url ? cert.certificado_template_url : 'https://via.placeholder.com/600x400?text=Certificado+OnStude';
            const estaConcluido = cert.emitido_em !== null;
            const dataEmissao = estaConcluido ? new Date(cert.emitido_em).toLocaleDateString('pt-BR') : '-';
            
            const badgeOverlay = estaConcluido 
                ? '<span class="badge bg-success position-absolute top-0 end-0 m-3 shadow-sm px-3 py-2 rounded-pill"><i class="bi bi-check-circle-fill me-1"></i>Concluído</span>' 
                : '<span class="badge bg-warning text-dark position-absolute top-0 end-0 m-3 shadow-sm px-3 py-2 rounded-pill"><i class="bi bi-hourglass-split me-1"></i>Pendente</span>';

            const imgClass = estaConcluido ? "card-img-top border-bottom border-light" : "card-img-top border-bottom border-light opacity-50";
            
            const areaAcao = estaConcluido
                ? `
                    <div class="mt-auto pt-3 border-top border-secondary border-opacity-10">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <small class="text-muted" style="font-size: 0.7rem;">Emitido em</small>
                            <strong class="text-dark small"><i class="bi bi-calendar-check text-success me-1"></i>${dataEmissao}</strong>
                        </div>
                        <div class="bg-white bg-opacity-50 p-2 rounded-3 text-center mb-3 border border-light shadow-sm">
                            <small class="text-muted d-block" style="font-size: 0.7rem;">Cód. Validação</small>
                            <strong class="text-dark user-select-all" style="font-size: 0.85rem;">${cert.token}</strong>
                        </div>
                        <div class="d-grid">
                            <a href="/aluno/certificados/${cert.certificado_id}/download" class="btn btn-success fw-bold rounded-pill shadow-sm"><i class="bi bi-download me-1"></i> Baixar PDF</a>
                        </div>
                    </div>
                `
                : `
                    <div class="mt-auto pt-3 border-top border-secondary border-opacity-10">
                        <div class="alert alert-light bg-white bg-opacity-50 border border-light text-center p-3 mb-0 rounded-4 shadow-sm">
                            <small class="text-muted d-block"><i class="bi bi-info-circle me-1 d-block fs-4 mb-2"></i>Conclua todas as aulas para liberar o seu certificado.</small>
                        </div>
                    </div>
                `;

            htmlCertificados += `
                <div class="col-md-6 col-xl-4 col-xxl-3 mb-4">
                    <div class="card shadow-sm border-0 rounded-4 h-100 hover-card transition-all overflow-hidden glass-card">
                        
                        <div class="position-relative bg-dark">
                            <img src="${thumb}" class="${imgClass}" style="height: 180px; object-fit: cover; width: 100%;" alt="Certificado">
                            ${badgeOverlay}
                            ${!estaConcluido ? '<div class="position-absolute top-50 start-50 translate-middle fs-1" title="Curso não concluído">🔒</div>' : ''}
                        </div>

                        <div class="card-body p-4 d-flex flex-column">
                            <h5 class="card-title fw-bold text-dark mb-3 lh-base text-truncate" title="${cert.curso_titulo}">${cert.curso_titulo}</h5>
                            ${areaAcao}
                        </div>
                    </div>
                </div>
            `;
        });
    }

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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meus Certificados - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; margin: 0; overflow-x: hidden; background-color: transparent; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } 
            }
            .transition-all { transition: all .3s ease; }
            .hover-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,.1)!important; }
            .notif-item:hover { background-color: rgba(255,255,255,0.7); cursor: pointer; }

            /* ==========================================
               GRADIENT MESH BACKGROUND
               ========================================== */
            .mesh-bg {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: -1;
                background-color: #f4f7f6;
                overflow: hidden;
            }
            .mesh-blob-1, .mesh-blob-2, .mesh-blob-3 {
                position: absolute;
                border-radius: 50%;
                filter: blur(90px);
                opacity: 0.25;
                animation: floatAnim 20s infinite ease-in-out alternate;
            }
            .mesh-blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #0d6efd; animation-delay: 0s; }
            .mesh-blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: #0dcaf0; animation-delay: -5s; }
            .mesh-blob-3 { top: 30%; left: 40%; width: 45vw; height: 45vw; background: #6610f2; animation-delay: -10s; }
            
            @keyframes floatAnim {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(5%, 15%) scale(1.1); }
                66% { transform: translate(-10%, 5%) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
            }

            /* ==========================================
               GLASSMORPHISM CARDS
               ========================================== */
            .glass-card {
                background: rgba(255, 255, 255, 0.65) !important;
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.8) !important;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05);
            }
        </style>
    </head>
    <body class="bg-light">
        <div class="mesh-bg">
            <div class="mesh-blob-1"></div>
            <div class="mesh-blob-2"></div>
            <div class="mesh-blob-3"></div>
        </div>

        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>
    
        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-transparent">
                <div class="container-fluid p-4 p-md-5">

                    <div class="row mb-5 align-items-center">
                        <div class="col-md-5 mb-3 mb-md-0">
                            <h2 class="fw-bold text-dark mb-1"><i class="bi bi-award-fill text-primary me-2"></i>Certificados</h2>
                            <p class="text-muted small mt-1 mb-0 fw-medium">Página ${currentPage} de ${totalPages}.</p>
                        </div>
                        
                        <div class="col-md-7 mb-3 mb-md-0">
                            <form action="/aluno/certificados" method="GET" class="d-flex shadow-sm rounded-pill overflow-hidden bg-white bg-opacity-75 border border-secondary border-opacity-10" style="backdrop-filter: blur(4px);">
                                <input type="text" name="search" class="form-control bg-transparent border-0 shadow-none ps-4" placeholder="Buscar por nome do curso..." value="${searchQuery}">
                                <button type="submit" class="btn btn-primary fw-bold px-4 rounded-end-pill">Buscar</button>
                                ${searchQuery ? `<a href="/aluno/certificados" class="btn btn-light border-start text-secondary px-3"><i class="bi bi-x-lg"></i></a>` : ''}
                            </form>
                        </div>
                    </div>
                    
                    <div class="row">
                        ${htmlCertificados}
                    </div>

                    <nav aria-label="Navegação de certificados" class="mb-5 pb-4 mt-2">
                        ${paginationHtml}
                    </nav>

                </div>
            </div>
        </div>

        <div class="modal fade" id="modalNotificacao" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden glass-card" style="background: rgba(255,255,255,0.9) !important;">
                    <div class="modal-header bg-primary text-white border-0 py-3">
                        <h5 class="modal-title fw-bold" id="notifTitulo">Aviso Importante</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <img id="notifImagem" src="" class="img-fluid rounded-4 shadow-sm mb-4 d-none" style="max-height: 250px; width: 100%; object-fit: cover;">
                        <p id="notifMensagem" class="fs-5 text-secondary mb-4"></p>

                        <div id="alertaJaRespondido" class="alert alert-success border-success bg-success bg-opacity-10 d-none mb-3 text-start rounded-4">
                            <strong><i class="bi bi-check-circle-fill me-2"></i>Você já respondeu!</strong> Obrigado pelo seu feedback.
                        </div>

                        <div id="areaPesquisaTexto" class="d-none text-start mb-3 bg-light p-3 rounded-4 border border-light">
                            <label class="form-label fw-bold text-dark">Sua resposta:</label>
                            <textarea id="inputPesquisaTexto" class="form-control" rows="3" placeholder="Escreva aqui..."></textarea>
                        </div>

                        <div id="areaAvaliacaoEstrelas" class="d-none mb-3 bg-light p-3 rounded-4 border border-light">
                            <h6 class="fw-bold text-dark mb-2">Avalie:</h6>
                            <div id="estrelasContainer" class="fs-1 text-secondary" style="cursor: pointer; letter-spacing: 5px;">
                                <span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5">★</span>
                            </div>
                            <input type="hidden" id="inputAvaliacaoEstrelas" value="0">
                        </div>
                    </div>
                    <div class="modal-footer border-0 bg-transparent justify-content-center py-3">
                        <button type="button" class="btn btn-primary btn-lg fw-bold px-5 shadow-sm rounded-pill" id="btnResponderNotificacao">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            let listaNotificacoesGlobal = [];
            let notificacaoAtualId = null;

            document.addEventListener('DOMContentLoaded', function() {
                carregarListaNotificacoesSino();
            });

            // ==========================================
            // LÓGICA DO MENU SUSPENSO DO SINO 
            // ==========================================
            function carregarListaNotificacoesSino() {
                fetch('/aluno/api/notificacoes/lista')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            listaNotificacoesGlobal = data.notificacoes;
                            const badge = document.getElementById('badgeNotificacoes');
                            const listaDropdown = document.getElementById('listaNotificacoesDropdown');
                            
                            if (data.naoLidas > 0) {
                                badge.textContent = data.naoLidas;
                                badge.classList.remove('d-none');
                            } else {
                                badge.classList.add('d-none');
                            }

                            if (data.notificacoes.length === 0) {
                                listaDropdown.innerHTML = '<li class="p-4 text-center text-muted small">Nenhuma notificação no momento.</li>';
                                return;
                            }

                            let htmlLista = \`
                                <li class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light sticky-top rounded-top-4" style="z-index: 10;">
                                    <span class="fw-bold text-secondary" style="font-size: 0.85rem;"><i class="bi bi-envelope-open me-2"></i>Notificações</span>
                                    <button class="btn btn-sm btn-light border text-danger py-1 px-2 rounded-pill fw-bold" onclick="limparTodasNotificacoes()" style="font-size: 0.75rem;"><i class="bi bi-trash3 me-1"></i>Limpar Tudo</button>
                                </li>
                            \`;

                            data.notificacoes.forEach(n => {
                                const dataFormatada = new Date(n.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                const isNaoLida = n.status === 'PENDENTE';
                                
                                const classFundo = isNaoLida ? 'bg-white fw-bold' : 'bg-light text-muted opacity-75';
                                const iconeLida = isNaoLida ? '<span class="icone-nao-lida badge bg-primary rounded-circle p-1 me-2 d-inline-block shadow-sm" style="width: 10px; height: 10px;"></span>' : '';
                                
                                const onclickAcao = n.link_url ? \`abrirLinkExterno(\${n.id}, '\${n.link_url}')\` : \`abrirModalNotificacao(\${n.id})\`;

                                htmlLista += \`
                                    <li>
                                        <a href="javascript:void(0)" onclick="\${onclickAcao}" class="dropdown-item border-bottom text-wrap p-3 notif-item \${classFundo}" style="white-space: normal;">
                                            <div class="d-flex justify-content-between align-items-start mb-1">
                                                <span class="text-dark d-flex align-items-center" style="font-size: 0.85rem;">\${iconeLida} \${n.titulo}</span>
                                                <small class="text-secondary ms-2 bg-light border px-1 rounded text-nowrap" style="font-size: 0.65rem;">\${dataFormatada}</small>
                                            </div>
                                            <div class="small \${isNaoLida ? 'text-secondary' : 'text-muted'}" style="font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                                \${n.mensagem}
                                            </div>
                                        </a>
                                    </li>
                                \`;
                            });
                            listaDropdown.innerHTML = htmlLista;
                        }
                    })
                    .catch(err => console.error('Erro ao listar notificações do sino:', err));
            }

            window.limparTodasNotificacoes = function() {
                fetch('/aluno/api/notificacoes/limpar', { method: 'POST' })
                    .then(() => carregarListaNotificacoesSino())
                    .catch(console.error);
            };

            window.abrirLinkExterno = function(id, url) {
                fetch('/aluno/api/notificacoes/' + id + '/lida', { method: 'POST' }).catch(console.error);
                window.open(url, '_blank');
                setTimeout(carregarListaNotificacoesSino, 1000);
            };

            window.abrirModalNotificacao = function(id) {
                const notif = listaNotificacoesGlobal.find(x => x.id === id);
                if (notif) montarEExibirModal(notif);
            };

            function montarEExibirModal(notificacao) {
                notificacaoAtualId = notificacao.id;
                
                document.getElementById('notifTitulo').textContent = notificacao.titulo;
                document.getElementById('notifMensagem').innerHTML = notificacao.mensagem.replace(/\\n/g, '<br>');

                const imgEl = document.getElementById('notifImagem');
                if (notificacao.imagem_url) {
                    imgEl.src = notificacao.imagem_url;
                    imgEl.classList.remove('d-none');
                } else {
                    imgEl.classList.add('d-none');
                }

                document.getElementById('areaPesquisaTexto').classList.add('d-none');
                document.getElementById('areaAvaliacaoEstrelas').classList.add('d-none');
                document.getElementById('alertaJaRespondido').classList.add('d-none');
                
                document.getElementById('inputPesquisaTexto').value = '';
                document.getElementById('inputAvaliacaoEstrelas').value = '0';
                resetarEstrelas(0);
                
                const btnResponder = document.getElementById('btnResponderNotificacao');

                if (notificacao.ja_respondeu > 0) {
                    document.getElementById('alertaJaRespondido').classList.remove('d-none');
                    btnResponder.textContent = 'Fechar';
                    btnResponder.onclick = function() { 
                        bootstrap.Modal.getInstance(document.getElementById('modalNotificacao')).hide(); 
                        setTimeout(carregarListaNotificacoesSino, 500);
                    };
                } else {
                    btnResponder.onclick = enviarRespostaNotificacao; 
                    
                    if (notificacao.tipo_interacao === 'PESQUISA_TEXTO') {
                        document.getElementById('areaPesquisaTexto').classList.remove('d-none');
                        btnResponder.textContent = 'Enviar Resposta';
                    } else if (notificacao.tipo_interacao === 'AVALIACAO_ESTRELAS') {
                        document.getElementById('areaAvaliacaoEstrelas').classList.remove('d-none');
                        btnResponder.textContent = 'Enviar Avaliação';
                    } else {
                        btnResponder.textContent = 'Entendido';
                    }
                }

                const modal = new bootstrap.Modal(document.getElementById('modalNotificacao'));
                modal.show();
            }

            const estrelas = document.querySelectorAll('#estrelasContainer span');
            estrelas.forEach(estrela => {
                estrela.addEventListener('click', function() {
                    const valor = this.getAttribute('data-val');
                    document.getElementById('inputAvaliacaoEstrelas').value = valor;
                    resetarEstrelas(valor);
                });
                estrela.addEventListener('mouseover', function() {
                    resetarEstrelas(this.getAttribute('data-val'), true);
                });
            });
            document.getElementById('estrelasContainer').addEventListener('mouseleave', function() {
                resetarEstrelas(document.getElementById('inputAvaliacaoEstrelas').value);
            });

            function resetarEstrelas(valor) {
                estrelas.forEach(e => {
                    if (parseInt(e.getAttribute('data-val')) <= parseInt(valor)) {
                        e.classList.remove('text-secondary');
                        e.classList.add('text-warning');
                    } else {
                        e.classList.remove('text-warning');
                        e.classList.add('text-secondary');
                    }
                });
            }

            function enviarRespostaNotificacao() {
                const btn = document.getElementById('btnResponderNotificacao');
                const textoOriginal = btn.textContent;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                btn.disabled = true;

                const payload = {
                    resposta_texto: document.getElementById('inputPesquisaTexto').value,
                    avaliacao_estrelas: document.getElementById('inputAvaliacaoEstrelas').value
                };

                fetch('/aluno/api/notificacoes/' + notificacaoAtualId + '/responder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    bootstrap.Modal.getInstance(document.getElementById('modalNotificacao')).hide();
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;

                    const notifLocal = listaNotificacoesGlobal.find(x => x.id === notificacaoAtualId);
                    if (notifLocal) {
                        notifLocal.ja_respondeu = 1;
                        notifLocal.status = 'LIDA';
                    }

                    setTimeout(() => { carregarListaNotificacoesSino(); }, 500); 
                })
                .catch(err => {
                    console.error(err);
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;
                });
            }

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

module.exports = renderAlunoCertificadosView;