// views/adminNovaNotificacaoView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminNovaNotificacaoView(admin, cursos) {

    const htmlSidebar = renderAdminMenuLateral(admin, 'admin/notificacoes/nova');

    let checkboxesCursos = cursos.map(c => `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" name="cursos_alvo" value="${c.id}" id="curso_${c.id}">
            <label class="form-check-label" for="curso_${c.id}">${c.titulo}</label>
        </div>
    `).join('');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Nova Notificação - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            /* Ajuste da área de conteúdo principal para rolar independentemente do menu */
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } /* Desconta a navbar mobile */
            }
        </style>
    </head>
    <body class="bg-light">
        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

        <div class="container mt-5 mb-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow border-0">
                        <div class="card-header bg-white py-3">
                            <h4 class="mb-0 fw-bold text-secondary">Disparar Nova Notificação (Modal)</h4>
                        </div>
                        <div class="card-body p-4">
                            <form action="/admin/notificacoes/nova" method="POST" enctype="multipart/form-data">
                                
                                <h6 class="text-primary mb-3">1. Conteúdo Visual</h6>
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Título do Modal <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="titulo" required placeholder="Ex: Bem-vindo à nova plataforma!">
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Mensagem <span class="text-danger">*</span></label>
                                    <textarea class="form-control" name="mensagem" rows="4" required placeholder="Escreva o texto que aparecerá no modal..."></textarea>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold">Imagem de Destaque (Opcional)</label>
                                    <input type="file" class="form-control" name="imagem" accept="image/*">
                                </div>

                                <hr class="my-4">
                                <h6 class="text-primary mb-3">2. Interação do Aluno</h6>
                                <div class="mb-4">
                                    <label class="form-label fw-semibold">O que o aluno deve fazer ao ver o modal?</label>
                                    <select class="form-select" name="tipo_interacao" id="tipoInteracao" onchange="toggleInteracao()">
                                        <option value="NENHUM">Apenas Ler e Fechar (Informativo)</option>
                                        <option value="PESQUISA_TEXTO">Responder a uma Pergunta (Caixa de Texto Livre)</option>
                                        <option value="AVALIACAO_ESTRELAS">Avaliar a Plataforma (1 a 5 Estrelas)</option>
                                    </select>
                                </div>

                                <div id="areaAgendamento" class="mb-4 p-3 bg-light border rounded">
                                    <h6 class="text-secondary mb-3 fw-bold"><i class="bi bi-clock"></i> Validade do Informativo</h6>
                                    <div class="row">
                                        <div class="col-md-6 mb-3 mb-md-0">
                                            <label class="form-label fw-semibold small">Exibir a partir de:</label>
                                            <input type="datetime-local" class="form-control form-control-sm" name="data_inicio">
                                            <div class="form-text" style="font-size: 0.75rem;">Deixe vazio para iniciar agora.</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold small">Expirar em (Fim):</label>
                                            <input type="datetime-local" class="form-control form-control-sm" name="data_fim">
                                            <div class="form-text" style="font-size: 0.75rem;">O aviso some sozinho após esta data.</div>
                                        </div>
                                    </div>
                                </div>

                                <hr class="my-4">
                                <h6 class="text-primary mb-3">3. Público Alvo</h6>
                                <div class="mb-3">
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="tipo_alvo" id="alvoTodos" value="TODOS" checked onchange="toggleCursos()">
                                        <label class="form-check-label fw-bold" for="alvoTodos">Todos os Alunos Ativos</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" name="tipo_alvo" id="alvoEspecifico" value="CURSO_ESPECIFICO" onchange="toggleCursos()">
                                        <label class="form-check-label fw-bold" for="alvoEspecifico">Alunos de Cursos Específicos</label>
                                    </div>
                                </div>

                                <div id="divCursos" class="p-3 bg-light border rounded mb-4" style="display: none; max-height: 200px; overflow-y: auto;">
                                    <label class="form-label fw-semibold text-muted small mb-2">Selecione os cursos:</label>
                                    ${checkboxesCursos}
                                </div>

                                <div class="d-grid mt-4">
                                    <button type="submit" class="btn btn-success btn-lg fw-bold">Disparar Notificação Agora</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        </div> </div> </div>

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
                        // Se for alvo específico e nenhum está marcado, exige apenas o primeiro (para exibir o balão)
                        cb.required = (index === 0);
                    } else {
                        // Se for para TODOS ou se já marcou algum curso, remove a obrigatoriedade
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
                    // Limpa os campos para não enviar datas se for pesquisa/avaliação
                    document.querySelector('input[name="data_inicio"]').value = '';
                    document.querySelector('input[name="data_fim"]').value = '';
                }
            }

            // Inicia o estado correto ao carregar a página
            document.addEventListener('DOMContentLoaded', () => {
                // Adiciona o evento de mudança em todos os checkboxes para remover o "required" em tempo real
                const checkboxes = document.querySelectorAll('input[name="cursos_alvo"]');
                checkboxes.forEach(cb => cb.addEventListener('change', validarCheckboxesCursos));

                toggleCursos();
                toggleInteracao();
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAdminNovaNotificacaoView;