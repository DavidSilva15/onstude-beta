// views/alunoDashboardView.js

function renderAlunoDashboardView(aluno, cursosMatriculados, kpiData) {
    const kpis = kpiData || { notaMedia: '0.0', aulasConcluidas: '0 / 0', melhoresCursos: 'Ainda sem notas' };

    let htmlCursos = '';

    if (cursosMatriculados.length === 0) {
        htmlCursos = `
            <div class="col-12 text-center py-5 mt-4 bg-white border rounded shadow-sm">
                <h4 class="text-secondary fw-bold mb-3">Ainda não possui cursos</h4>
                <p class="text-muted mb-4">Assim que for matriculado num curso, ele aparecerá aqui.</p>
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
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm border-0 hover-shadow transition">
                        <img src="${capa}" class="card-img-top" alt="Capa de ${curso.titulo}" style="height: 180px; object-fit: cover;">
                        <div class="card-body d-flex flex-column">
                            <span class="badge bg-light text-dark border mb-2 align-self-start">${curso.codigo_unico}</span>
                            <h5 class="card-title fw-bold text-dark mb-3">${curso.titulo}</h5>
                            
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-muted fw-semibold">Progresso <span class="fw-normal">(${concluidas}/${total} aulas)</span></small>
                                    <small class="text-primary fw-bold">${percentual.toFixed(0)}%</small>
                                </div>
                                <div class="progress mb-3" style="height: 8px;">
                                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${percentual}%" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div class="d-grid">
                                    <a href="/aluno/cursos/${curso.curso_id}/aula" class="btn ${corBotao}">${textoBotao}</a>
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
        <style>
            body { background-color: #f8f9fa; }
            .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; transform: translateY(-2px); transition: all .3s ease; }
            .transition { transition: all .3s ease; }
            .kpi-icon { font-size: 1.5rem; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; border-radius: 10px; }
            .notif-item:hover { background-color: #f1f3f5; cursor: pointer; }
        </style>
    </head>
    <body>
    <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
        <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
            <span class="visually-hidden">Carregando...</span>
        </div>
        <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
    </div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-white" href="/aluno">OnStude</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link active fw-semibold" href="/aluno">Meus Cursos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link fw-semibold" href="/aluno/certificados">Meus Certificados</a>
                        </li>
                        <li class="nav-item ms-lg-3 border-start-lg ps-lg-3">
                            <a class="nav-link fw-bold text-warning" href="/forum">💬 Fórum de Dúvidas</a>
                        </li>
                    </ul>
                    
                    <div class="d-flex align-items-center ms-auto mt-3 mt-lg-0">
                        
                        <div class="dropdown me-4">
                            <a href="#" class="text-white text-decoration-none position-relative" id="dropdownNotif" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" style="font-size: 1.4rem;">
                                🔔
                                <span id="badgeNotificacoes" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none border border-light" style="font-size: 0.6rem; margin-left: -5px;">
                                    0
                                </span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow-lg" aria-labelledby="dropdownNotif" style="width: 340px; max-height: 450px; overflow-y: auto; padding: 0;" id="listaNotificacoesDropdown">
                                <li class="p-4 text-center text-muted small">
                                    <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div><br>
                                    Carregando notificações...
                                </li>
                            </ul>
                        </div>

                        <div class="dropdown">
                            <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                                ${aluno.foto_perfil_url 
                                    ? `<img src="${aluno.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid rgba(255,255,255,0.5);">` 
                                    : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-light text-primary fw-bold" style="width: 36px; height: 36px; border: 2px solid rgba(255,255,255,0.5); font-size: 14px;">${aluno.nome.charAt(0).toUpperCase()}</div>`
                                }
                                <span class="d-none d-md-inline me-2">Olá, <strong>${aluno.nome.split(' ')[0]}</strong></span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="dropdownUser">
                                <li><a class="dropdown-item fw-semibold text-secondary" href="/aluno/perfil">✏️ Editar Perfil</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item fw-bold text-danger" href="/logout">🚪 Sair</a></li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </nav>

        <div class="container mt-5 mb-5">
            
            <div class="row mb-5">
                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3 border-start border-warning border-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="text-muted fw-bold mb-0">Nota Média Geral</h6>
                            <div class="bg-warning bg-opacity-10 text-warning kpi-icon fw-bold">★</div>
                        </div>
                        <h3 class="fw-bold text-dark mb-0">${kpis.notaMedia}</h3>
                    </div>
                </div>
                
                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3 border-start border-success border-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="text-muted fw-bold mb-0">Aulas Concluídas</h6>
                            <div class="bg-success bg-opacity-10 text-success kpi-icon fw-bold">✓</div>
                        </div>
                        <h3 class="fw-bold text-dark mb-0">${kpis.aulasConcluidas}</h3>
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="card border-0 shadow-sm rounded-4 h-100 p-3 border-start border-primary border-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h6 class="text-muted fw-bold mb-0">Melhor Desempenho</h6>
                            <div class="bg-primary bg-opacity-10 text-primary kpi-icon fw-bold">🏆</div>
                        </div>
                        <h6 class="fw-bold text-dark mb-0 text-truncate" title="${kpis.melhoresCursos}">${kpis.melhoresCursos}</h6>
                    </div>
                </div>
            </div>

            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="fw-bold text-dark">Meus Cursos</h2>
                    <p class="text-muted">Continue de onde parou e alcance os seus objetivos.</p>
                </div>
            </div>

            <div class="row">
                ${htmlCursos}
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <div class="modal fade" id="modalNotificacao" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg" style="border-radius: 15px; overflow: hidden;">
                    <div class="modal-header bg-primary text-white border-0 py-3">
                        <h5 class="modal-title fw-bold" id="notifTitulo">Aviso Importante</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <img id="notifImagem" src="" class="img-fluid rounded shadow-sm mb-4 d-none" style="max-height: 250px; width: 100%; object-fit: cover;">
                        <p id="notifMensagem" class="fs-5 text-secondary mb-4"></p>

                        <div id="alertaJaRespondido" class="alert alert-success d-none mb-3 text-start">
                            <strong>✅ Você já respondeu!</strong> Obrigado pelo seu feedback e participação.
                        </div>

                        <div id="areaPesquisaTexto" class="d-none text-start mb-3">
                            <label class="form-label fw-bold text-dark">Sua resposta:</label>
                            <textarea id="inputPesquisaTexto" class="form-control bg-light" rows="3" placeholder="Escreva aqui..."></textarea>
                        </div>

                        <div id="areaAvaliacaoEstrelas" class="d-none mb-3">
                            <h6 class="fw-bold text-dark mb-2">Avalie:</h6>
                            <div id="estrelasContainer" class="fs-1 text-secondary" style="cursor: pointer; letter-spacing: 5px;">
                                <span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5">★</span>
                            </div>
                            <input type="hidden" id="inputAvaliacaoEstrelas" value="0">
                        </div>
                    </div>
                    <div class="modal-footer border-0 bg-light justify-content-center py-3">
                        <button type="button" class="btn btn-primary btn-lg fw-bold px-5 shadow-sm" id="btnResponderNotificacao" style="border-radius: 50px;">
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
                                <li class="d-flex justify-content-between align-items-center p-2 border-bottom bg-light sticky-top" style="z-index: 10;">
                                    <span class="fw-bold text-secondary ms-2" style="font-size: 0.85rem;">Notificações</span>
                                    <button class="btn btn-sm btn-link text-decoration-none text-danger py-0" onclick="limparTodasNotificacoes()" style="font-size: 0.8rem;">Limpar Tudo</button>
                                </li>
                            \`;

                            data.notificacoes.forEach(n => {
                                const dataFormatada = new Date(n.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                const isNaoLida = n.status === 'PENDENTE';
                                
                                const classFundo = isNaoLida ? 'bg-white fw-bold' : 'bg-light text-muted opacity-75';
                                const iconeLida = isNaoLida ? '<span class="icone-nao-lida badge bg-primary rounded-circle p-1 me-2 d-inline-block" style="width: 8px; height: 8px;"></span>' : '';
                                
                                const onclickAcao = n.link_url ? \`abrirLinkExterno(\${n.id}, '\${n.link_url}')\` : \`abrirModalNotificacao(\${n.id})\`;

                                htmlLista += \`
                                    <li>
                                        <a href="javascript:void(0)" onclick="\${onclickAcao}" class="dropdown-item border-bottom text-wrap p-3 notif-item \${classFundo}" style="white-space: normal;">
                                            <div class="d-flex justify-content-between align-items-start mb-1">
                                                <span class="text-dark d-flex align-items-center" style="font-size: 0.85rem;">\${iconeLida} \${n.titulo}</span>
                                                <small class="text-secondary ms-2" style="font-size: 0.7rem;">\${dataFormatada}</small>
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

            // NOVA FUNÇÃO: Limpar (Ocultar) todas as notificações e recarregar
            window.limparTodasNotificacoes = function() {
                fetch('/aluno/api/notificacoes/limpar', { method: 'POST' })
                    .then(() => {
                        carregarListaNotificacoesSino();
                    })
                    .catch(console.error);
            };

            // Função que marca como lida e abre link externo
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