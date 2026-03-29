// views/alunoDashboardView.js

const renderAlunoMenuLateral = require('./alunoMenuLateral');

function renderAlunoDashboardView(aluno, cursosMatriculados, kpiData) {
    
    // Injeta o novo menu lateral indicando que a página ativa é o 'dashboard'
    const htmlSidebar = renderAlunoMenuLateral(aluno, 'dashboard');

    const kpis = kpiData || { notaMedia: '0.0', aulasConcluidas: '0 / 0', melhoresCursos: 'Ainda sem notas' };

    let htmlCursos = '';

    if (cursosMatriculados.length === 0) {
        htmlCursos = `
            <div class="col-12 text-center py-5 mt-4 bg-white border-0 rounded-4 shadow-sm">
                <i class="bi bi-journal-x fs-1 opacity-25 mb-3 d-block text-secondary"></i>
                <h4 class="text-dark fw-bold mb-2">Ainda não possui cursos</h4>
                <p class="text-muted mb-0">Assim que for matriculado num curso, ele aparecerá aqui.</p>
            </div>
        `;
    } else {
        cursosMatriculados.forEach(curso => {
            const percentual = parseFloat(curso.percentual) || 0;
            const concluidas = curso.aulas_concluidas || 0;
            const total = curso.total_aulas || 0;
            const capa = curso.capa_url ? curso.capa_url : 'https://via.placeholder.com/600x400?text=Curso+OnStude';
            
            const textoBotao = percentual === 0 ? 'Iniciar Curso' : (percentual >= 100 ? 'Revisar Curso' : 'Continuar Curso');
            const corBotao = percentual >= 100 ? 'btn-success' : 'btn-primary';

            htmlCursos += `
                <div class="col-md-6 col-xl-4 mb-4">
                    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-card transition-all">
                        <img src="${capa}" class="card-img-top border-bottom" alt="Capa de ${curso.titulo}" style="height: 180px; object-fit: cover;">
                        <div class="card-body p-4 d-flex flex-column">
                            <span class="badge bg-light text-dark border mb-3 align-self-start px-2 py-1"><i class="bi bi-upc-scan me-1"></i>${curso.codigo_unico}</span>
                            <h5 class="card-title fw-bold text-dark mb-3 text-truncate" title="${curso.titulo}">${curso.titulo}</h5>
                            
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="text-muted fw-semibold">Progresso <span class="fw-normal">(${concluidas}/${total} aulas)</span></small>
                                    <small class="text-primary fw-bold">${percentual.toFixed(0)}%</small>
                                </div>
                                <div class="progress mb-4 rounded-pill bg-light border" style="height: 8px;">
                                    <div class="progress-bar ${corBotao.replace('btn-', 'bg-')}" role="progressbar" style="width: ${percentual}%" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div class="d-grid">
                                    <a href="/aluno/cursos/${curso.curso_id}/aula" class="btn ${corBotao} fw-bold rounded-pill shadow-sm">${textoBotao}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>O Meu Painel - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } /* Desconta o topo mobile */
            }
            .hover-card:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; transform: translateY(-5px); }
            .transition-all { transition: all .3s ease; }
            .kpi-icon { font-size: 1.5rem; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
            .notif-item:hover { background-color: #f1f3f5; cursor: pointer; }
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

                    <div class="row mb-5 align-items-center">
                        <div class="col-12">
                            <h2 class="fw-bold text-dark mb-1">Olá, ${aluno.nome.split(' ')[0]} 👋</h2>
                            <p class="text-muted">Bem-vindo de volta! Que tal continuarmos a sua jornada de aprendizagem?</p>
                        </div>
                    </div>

                    <div class="row mb-5 g-4">
                        <div class="col-md-4">
                            <div class="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-warning border-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="text-muted fw-bold mb-0">Nota Média Geral</h6>
                                    <div class="bg-warning bg-opacity-10 text-warning kpi-icon fw-bold"><i class="bi bi-star-fill"></i></div>
                                </div>
                                <h2 class="fw-bold text-dark mb-0">${kpis.notaMedia}</h2>
                            </div>
                        </div>
                        
                        <div class="col-md-4">
                            <div class="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-success border-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="text-muted fw-bold mb-0">Aulas Concluídas</h6>
                                    <div class="bg-success bg-opacity-10 text-success kpi-icon fw-bold"><i class="bi bi-check-circle-fill"></i></div>
                                </div>
                                <h2 class="fw-bold text-dark mb-0">${kpis.aulasConcluidas}</h2>
                            </div>
                        </div>

                        <div class="col-md-4">
                            <div class="card border-0 shadow-sm rounded-4 h-100 p-4 border-start border-primary border-4">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h6 class="text-muted fw-bold mb-0">Melhor Desempenho</h6>
                                    <div class="bg-primary bg-opacity-10 text-primary kpi-icon fw-bold"><i class="bi bi-trophy-fill"></i></div>
                                </div>
                                <h6 class="fw-bold text-dark mb-0 lh-base text-truncate" title="${kpis.melhoresCursos}">${kpis.melhoresCursos}</h6>
                            </div>
                        </div>
                    </div>

                    <div class="row mb-4">
                        <div class="col-12 d-flex justify-content-between align-items-center">
                            <h4 class="fw-bold text-dark mb-0"><i class="bi bi-collection-play text-primary me-2"></i>Meus Cursos</h4>
                        </div>
                    </div>

                    <div class="row">
                        ${htmlCursos}
                    </div>

                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <div class="modal fade" id="modalNotificacao" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
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
                    <div class="modal-footer border-0 bg-light justify-content-center py-3">
                        <button type="button" class="btn btn-primary btn-lg fw-bold px-5 shadow-sm rounded-pill" id="btnResponderNotificacao">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <script>
            let listaNotificacoesGlobal = [];
            let notificacaoAtualId = null;

            document.addEventListener('DOMContentLoaded', function() {
                verificarNotificacoesPendentesModal();
                carregarListaNotificacoesSino();
            });

            // ==========================================
            // LÓGICA DO MENU SUSPENSO DO SINO (DROPDOWN)
            // ==========================================

            function carregarListaNotificacoesSino() {
                fetch('/aluno/api/notificacoes/lista')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            listaNotificacoesGlobal = data.notificacoes;
                            const badge = document.getElementById('badgeNotificacoes');
                            const listaDropdown = document.getElementById('listaNotificacoesDropdown');
                            
                            // Atualiza o contador APENAS se tiver pendentes (senão esconde)
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

                            // Cabeçalho fixo com o botão de limpar tudo
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
                    .then(() => {
                        carregarListaNotificacoesSino();
                    })
                    .catch(console.error);
            };

            window.abrirLinkExterno = function(id, url) {
                fetch('/aluno/api/notificacoes/' + id + '/lida', { method: 'POST' }).catch(console.error);
                window.open(url, '_blank');
                setTimeout(carregarListaNotificacoesSino, 1000);
            };

            // ==========================================
            // LÓGICA DO MODAL
            // ==========================================

            function verificarNotificacoesPendentesModal() {
                fetch('/aluno/api/notificacoes/pendente')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.notificacao) {
                            montarEExibirModal(data.notificacao);
                        }
                    }).catch(console.error);
            }

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
            
            // Lógica do Loader Visual
            window.addEventListener('pageshow', function(event) {
                const loader = document.getElementById('globalLoader');
                if (loader) {
                    if (event.persisted) { loader.style.display = 'none'; loader.style.opacity = '0'; } 
                    else { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 400); }
                }
            });
            window.addEventListener('beforeunload', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) { loader.style.display = 'flex'; setTimeout(() => { loader.style.opacity = '1'; }, 10); }
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAlunoDashboardView;