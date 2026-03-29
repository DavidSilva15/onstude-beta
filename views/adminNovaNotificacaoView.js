// views/adminNovaNotificacaoView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminNovaNotificacaoView(admin, cursos) {

    // 1. CORREÇÃO: Menu lateral focado na aba 'notificacoes'
    const htmlSidebar = renderAdminMenuLateral(admin, 'notificacoes');

    let checkboxesCursos = cursos.map(c => `
        <div class="form-check mb-2">
            <input class="form-check-input border-secondary shadow-sm" type="checkbox" name="cursos_alvo" value="${c.id}" id="curso_${c.id}">
            <label class="form-check-label text-dark" for="curso_${c.id}">${c.titulo}</label>
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Nova Notificação - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } 
            }
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

                    <a href="/admin/notificacoes" class="btn btn-sm btn-outline-secondary mb-4 rounded-pill fw-bold px-3 shadow-sm">
                        <i class="bi bi-arrow-left me-1"></i> Voltar às Notificações
                    </a>

                    <div class="row justify-content-center">
                        <div class="col-xl-8 col-lg-10">
                            <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
                                <div class="card-header bg-white py-4 border-bottom-0">
                                    <h4 class="mb-0 fw-bold text-dark"><i class="bi bi-send-plus-fill text-success me-2"></i>Disparar Nova Notificação</h4>
                                    <p class="text-muted small mb-0 mt-1">Crie avisos, pop-ups ou pesquisas que aparecerão para os alunos na plataforma.</p>
                                </div>
                                <div class="card-body p-4 p-lg-5 pt-0">
                                    <form action="/admin/notificacoes/nova" method="POST" enctype="multipart/form-data">
                                        
                                        <h6 class="fw-bold text-secondary mb-3 border-bottom pb-2"><i class="bi bi-palette text-primary me-2"></i>1. Conteúdo Visual</h6>
                                        
                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">Título do Modal <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control bg-light" name="titulo" required placeholder="Ex: Bem-vindo à nova plataforma!">
                                        </div>
                                        
                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">Mensagem <span class="text-danger">*</span></label>
                                            <textarea class="form-control bg-light" name="mensagem" rows="4" required placeholder="Escreva o texto que aparecerá no modal..."></textarea>
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label fw-semibold">Imagem de Destaque (Opcional)</label>
                                            <input type="file" class="form-control bg-light" name="imagem" accept="image/*">
                                        </div>

                                        <h6 class="fw-bold text-secondary mt-5 mb-3 border-bottom pb-2"><i class="bi bi-hand-index-thumb text-warning me-2"></i>2. Interação e Validade</h6>
                                        
                                        <div class="mb-4">
                                            <label class="form-label fw-semibold">O que o aluno deve fazer ao ver o modal?</label>
                                            <select class="form-select bg-light" name="tipo_interacao" id="tipoInteracao" onchange="toggleInteracao()">
                                                <option value="NENHUM">Apenas Ler e Fechar (Informativo)</option>
                                                <option value="PESQUISA_TEXTO">Responder a uma Pergunta (Caixa de Texto Livre)</option>
                                                <option value="AVALIACAO_ESTRELAS">Avaliar a Plataforma (1 a 5 Estrelas)</option>
                                            </select>
                                        </div>

                                        <div id="areaAgendamento" class="mb-4 p-4 bg-white border border-light shadow-sm rounded-4">
                                            <h6 class="text-dark mb-3 fw-bold"><i class="bi bi-clock-history text-secondary me-2"></i>Agendamento do Informativo</h6>
                                            <div class="row g-3">
                                                <div class="col-md-6">
                                                    <label class="form-label fw-semibold small">Exibir a partir de:</label>
                                                    <input type="datetime-local" class="form-control bg-light" name="data_inicio">
                                                    <div class="form-text small"><i class="bi bi-info-circle me-1"></i>Deixe vazio para iniciar agora.</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label fw-semibold small">Expirar em (Fim):</label>
                                                    <input type="datetime-local" class="form-control bg-light" name="data_fim">
                                                    <div class="form-text small"><i class="bi bi-info-circle me-1"></i>O aviso some sozinho após esta data.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <h6 class="fw-bold text-secondary mt-5 mb-3 border-bottom pb-2"><i class="bi bi-people text-info me-2"></i>3. Público Alvo</h6>
                                        
                                        <div class="mb-4 bg-white p-3 rounded-4 border border-light shadow-sm">
                                            <div class="form-check form-check-inline me-4">
                                                <input class="form-check-input border-secondary" type="radio" name="tipo_alvo" id="alvoTodos" value="TODOS" checked onchange="toggleCursos()">
                                                <label class="form-check-label fw-bold text-dark" for="alvoTodos">Todos os Alunos Ativos</label>
                                            </div>
                                            <div class="form-check form-check-inline">
                                                <input class="form-check-input border-secondary" type="radio" name="tipo_alvo" id="alvoEspecifico" value="CURSO_ESPECIFICO" onchange="toggleCursos()">
                                                <label class="form-check-label fw-bold text-dark" for="alvoEspecifico">Alunos de Cursos Específicos</label>
                                            </div>
                                        </div>

                                        <div id="divCursos" class="p-4 bg-light border rounded-4 mb-4" style="display: none; max-height: 250px; overflow-y: auto;">
                                            <label class="form-label fw-semibold text-secondary mb-3"><i class="bi bi-check2-square me-2"></i>Selecione os cursos alvo:</label>
                                            ${checkboxesCursos}
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                                            <a href="/admin/notificacoes" class="btn btn-light fw-bold rounded-pill px-4 shadow-sm text-secondary">Cancelar</a>
                                            <button type="submit" class="btn btn-success btn-lg fw-bold rounded-pill px-5 shadow">
                                                <i class="bi bi-send-fill me-2"></i> Disparar Notificação
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> 
        </div> 

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            // Alterna a exibição dos Cursos
            function toggleCursos() {
                const alvoEspecifico = document.getElementById('alvoEspecifico').checked;
                document.getElementById('divCursos').style.display = alvoEspecifico ? 'block' : 'none';
                
                validarCheckboxesCursos();
            }

            // Garante que o HTML5 só exija a checkbox se nenhuma estiver marcada
            function validarCheckboxesCursos() {
                const alvoEspecifico = document.getElementById('alvoEspecifico').checked;
                const checkboxes = document.querySelectorAll('input[name="cursos_alvo"]');
                const peloMenosUmMarcado = Array.from(checkboxes).some(cb => cb.checked);

                checkboxes.forEach((cb, index) => {
                    if (alvoEspecifico && !peloMenosUmMarcado) {
                        cb.required = (index === 0);
                    } else {
                        cb.required = false;
                    }
                });
            }

            // Alterna a exibição do Agendamento (Validade)
            function toggleInteracao() {
                const tipo = document.getElementById('tipoInteracao').value;
                const areaAgendamento = document.getElementById('areaAgendamento');
                
                if (tipo === 'NENHUM') {
                    areaAgendamento.style.display = 'block';
                } else {
                    areaAgendamento.style.display = 'none';
                    document.querySelector('input[name="data_inicio"]').value = '';
                    document.querySelector('input[name="data_fim"]').value = '';
                }
            }

            // Inicia o estado correto ao carregar a página
            document.addEventListener('DOMContentLoaded', () => {
                const checkboxes = document.querySelectorAll('input[name="cursos_alvo"]');
                checkboxes.forEach(cb => cb.addEventListener('change', validarCheckboxesCursos));

                toggleCursos();
                toggleInteracao();
            });

            // Lógica do Loader
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

module.exports = renderAdminNovaNotificacaoView;