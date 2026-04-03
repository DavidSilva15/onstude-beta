// views/novoCursoView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderNovoCursoView(admin) {

    // Marcamos a aba 'cursos' como ativa no menu lateral
    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Curso - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            .file-feedback { transition: all 0.3s ease; }
        </style>
    </head>
    <body class="bg-light">
        
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

                    <a href="/admin" class="btn btn-sm btn-outline-secondary mb-4 rounded-pill fw-bold px-3">
                        <i class="bi bi-arrow-left me-1"></i> Voltar ao Painel
                    </a>

                    <div class="row justify-content-center">
                        <div class="col-xl-9 col-lg-10">
                            <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                                <div class="card-header bg-white py-4 border-bottom-0">
                                    <h4 class="mb-0 fw-bold text-dark"><i class="bi bi-journal-plus text-primary me-2"></i>Criar Novo Curso</h4>
                                    <p class="text-muted small mb-0 mt-1">Configure os detalhes do seu novo produto educacional.</p>
                                </div>
                                <div class="card-body p-4 p-lg-5 pt-0">
                                    
                                    <form id="formNovoCurso" action="/admin/cursos/novo" method="POST" enctype="multipart/form-data">
                                        
                                        <h6 class="text-primary fw-bold mb-3 border-bottom pb-2"><i class="bi bi-info-circle me-2"></i>Informações Básicas</h6>
                                        
                                        <div class="mb-4">
                                            <label class="form-label fw-semibold">Título do Curso <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control bg-light" name="titulo" placeholder="Ex: Formação Completa em JavaScript" required>
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label fw-semibold">Descrição</label>
                                            <textarea class="form-control bg-light" name="descricao" rows="4" placeholder="Descreva os objetivos e os módulos deste curso..."></textarea>
                                        </div>

                                        <div class="row mb-4">
                                            <div class="col-md-12 mb-3">
                                                <label class="form-label fw-semibold">Mercado de Atuação (Tags)</label>
                                                <input type="text" class="form-control bg-light" name="mercado" placeholder="Ex: Tecnologia, Programação, Web Design">
                                                <div class="form-text small">Insira as áreas de atuação separadas por vírgula.</div>
                                            </div>
                                            <div class="col-md-6 mb-3 mb-md-0">
                                                <label class="form-label fw-semibold"><i class="bi bi-clock-history text-secondary me-1"></i>Duração Estimada (Horas)</label>
                                                <input type="number" class="form-control bg-light" name="duracao_horas" min="1" placeholder="Ex: 40">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold"><i class="bi bi-calendar-check text-secondary me-1"></i>Tempo de Conclusão (Dias)</label>
                                                <input type="number" class="form-control bg-light" name="conclusao_dias" min="1" placeholder="Ex: 30">
                                                <div class="form-text small">Prazo médio para o aluno concluir o curso.</div>
                                            </div>
                                        </div>

                                        <div class="p-4 mb-4 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-4 border-start border-4">
                                            <h6 class="fw-bold text-success mb-3"><i class="bi bi-cash-coin me-2"></i>Configurações de Venda (Checkout)</h6>
                                            <div class="row">
                                                <div class="col-md-6 mb-3 mb-md-0">
                                                    <label class="form-label fw-semibold text-dark">Preço Base (R$)</label>
                                                    <div class="input-group">
                                                        <span class="input-group-text bg-white border-end-0">R$</span>
                                                        <input type="number" class="form-control bg-white border-start-0" name="preco" step="0.01" min="0" placeholder="Ex: 197.00">
                                                    </div>
                                                    <div class="form-text small text-dark opacity-75">Deixe vazio ou 0.00 para curso gratuito.</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label fw-semibold text-dark">Desconto Promocional (%)</label>
                                                    <div class="input-group">
                                                        <input type="number" class="form-control bg-white border-end-0" name="desconto_percentual" min="0" max="100" placeholder="Ex: 15">
                                                        <span class="input-group-text bg-white border-start-0">%</span>
                                                    </div>
                                                    <div class="form-text small text-dark opacity-75">Percentagem aplicada no checkout final.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <h6 class="text-primary fw-bold mb-3 border-bottom pb-2 mt-5"><i class="bi bi-image me-2"></i>Arquivos e Design</h6>
                                        
                                        <div class="row g-4 mb-4">
                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100 d-flex flex-column">
                                                    <label class="form-label fw-semibold"><i class="bi bi-images text-primary me-2"></i>Imagem de Capa (Thumb)</label>
                                                    <input type="file" class="form-control" id="capa" name="capa" accept="image/*">
                                                    <div class="form-text small">Usada na vitrine do aluno e na página de vendas.</div>
                                                    
                                                    <div id="localFeedback_capa" class="mt-2 d-none align-items-center file-feedback"></div>
                                                    
                                                    <div id="progressContainer_capa" class="mt-auto pt-3 d-none">
                                                        <div class="progress" style="height: 8px;">
                                                            <div id="progressBar_capa" class="progress-bar bg-primary" role="progressbar" style="width: 0%;"></div>
                                                        </div>
                                                        <small id="progressText_capa" class="text-muted d-block mt-1 fw-bold" style="font-size: 0.7rem;">0% enviado</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100 d-flex flex-column">
                                                    <label class="form-label fw-semibold"><i class="bi bi-award-fill text-warning me-2"></i>Fundo do Certificado</label>
                                                    <input type="file" class="form-control" id="certificado_template" name="certificado_template" accept="image/*">
                                                    <div class="form-text small">Design base. O sistema vai carimbar o nome do aluno por cima.</div>
                                                    
                                                    <div id="localFeedback_certificado_template" class="mt-2 d-none align-items-center file-feedback"></div>
                                                    
                                                    <div id="progressContainer_certificado_template" class="mt-auto pt-3 d-none">
                                                        <div class="progress" style="height: 8px;">
                                                            <div id="progressBar_certificado_template" class="progress-bar bg-warning" role="progressbar" style="width: 0%;"></div>
                                                        </div>
                                                        <small id="progressText_certificado_template" class="text-muted d-block mt-1 fw-bold" style="font-size: 0.7rem;">0% enviado</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="mb-4 mt-4">
                                            <label class="form-label fw-semibold">Status Inicial</label>
                                            <select class="form-select bg-light" name="status">
                                                <option value="RASCUNHO" selected>Rascunho (Invisível para alunos)</option>
                                                <option value="PUBLICADO">Publicado (Disponível para matrículas/vendas)</option>
                                            </select>
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-5">
                                            <a href="/admin" class="btn btn-light fw-bold rounded-pill px-4 shadow-sm text-secondary">Cancelar</a>
                                            <button type="submit" id="btnSubmit" class="btn btn-primary fw-bold rounded-pill px-5 shadow">
                                                <i class="bi bi-floppy me-2"></i> Salvar Novo Curso
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

    ${require('./toastProcessamento')()}

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            // ==========================================
            // LÓGICA 1: FEEDBACK DE CARREGAMENTO LOCAL (NO CLIQUE)
            // ==========================================
            const fileInputs = ['capa', 'certificado_template'];
            
            fileInputs.forEach(id => {
                const inputElement = document.getElementById(id);
                if (inputElement) {
                    inputElement.addEventListener('change', function() {
                        const feedbackDiv = document.getElementById('localFeedback_' + id);
                        const files = this.files;

                        if (files.length > 0) {
                            feedbackDiv.classList.remove('d-none');
                            feedbackDiv.classList.add('d-flex');
                            feedbackDiv.innerHTML = \`
                                <div class="spinner-border spinner-border-sm text-secondary me-2" role="status"></div>
                                <span class="small text-muted fw-semibold">Lendo imagem...</span>
                            \`;

                            setTimeout(() => {
                                const sizeMB = (files[0].size / (1024 * 1024)).toFixed(2);
                                const fileText = files[0].name;

                                feedbackDiv.innerHTML = \`
                                    <i class="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                    <span class="small text-success fw-bold text-truncate" title="\${fileText}">\${fileText} (\${sizeMB} MB)</span>
                                \`;
                            }, 500); 

                        } else {
                            feedbackDiv.classList.add('d-none');
                            feedbackDiv.classList.remove('d-flex');
                        }
                    });
                }
            });

            // ==========================================
            // LÓGICA 2: UPLOAD AJAX COM BARRA DE PROGRESSO REAL
            // ==========================================
            document.getElementById('formNovoCurso').addEventListener('submit', function(e) {
                e.preventDefault(); 
                
                const form = this;
                const formData = new FormData(form);
                const btn = document.getElementById('btnSubmit');
                
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Enviando imagens...';
                
                fileInputs.forEach(id => {
                    const input = document.getElementById(id);
                    const container = document.getElementById('progressContainer_' + id);
                    const status = document.getElementById('progressText_' + id);
                    const bar = document.getElementById('progressBar_' + id);
                    const localFeedback = document.getElementById('localFeedback_' + id);
                    
                    if (input && input.files.length > 0) {
                        localFeedback.classList.add('d-none'); // Esconde o check verde local
                        container.classList.remove('d-none');
                        status.classList.remove('d-none');
                        bar.style.width = '0%';
                        status.innerText = '0% enviado';
                    }
                });

                const xhr = new XMLHttpRequest();
                
                xhr.upload.addEventListener('progress', function(e) {
                    if (e.lengthComputable) {
                        const percentComplete = Math.round((e.loaded / e.total) * 100);
                        
                        fileInputs.forEach(id => {
                            const input = document.getElementById(id);
                            if (input && input.files.length > 0) {
                                const bar = document.getElementById('progressBar_' + id);
                                const status = document.getElementById('progressText_' + id);
                                
                                bar.style.width = percentComplete + '%';
                                
                                if (percentComplete === 100) {
                                    bar.classList.add('progress-bar-striped', 'progress-bar-animated');
                                    status.innerHTML = '<span class="spinner-border spinner-border-sm text-primary me-1" style="width: 0.8rem; height: 0.8rem;"></span> Salvando...';
                                } else {
                                    status.innerText = percentComplete + '% enviado';
                                }
                            }
                        });
                    }
                });

                xhr.addEventListener('load', function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        // O backend envia um redirecionamento, então navegamos para ele.
                        window.location.href = xhr.responseURL;
                    } else {
                        alert('Ocorreu um erro no servidor. Verifique o console ou tente novamente.');
                        btn.disabled = false;
                        btn.innerHTML = '<i class="bi bi-floppy me-2"></i> Salvar Novo Curso';
                    }
                });

                xhr.addEventListener('error', function() {
                    alert('Falha na conexão. O upload foi interrompido.');
                    btn.disabled = false;
                    btn.innerHTML = '<i class="bi bi-floppy me-2"></i> Salvar Novo Curso';
                });

                xhr.open('POST', form.action, true);
                xhr.send(formData);
            });

            // Loader Global
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

module.exports = renderNovoCursoView;