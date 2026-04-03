// views/novaAulaView.js

const renderAdminMenuLateral = require('./adminMenuLateral');
const renderToastProcessamento = require('./toastProcessamento'); // Importação do Toast Universal

function renderNovaAulaView(admin, curso, modulo, proximaOrdem) {

    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Aula - ${modulo.titulo}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            .file-feedback { transition: all 0.3s ease; }

            /* Animações do Toast e Etapas Visuais */
            .toast-stage-item { transition: all 0.4s ease; }
            .spin-anim { animation: spin 2s linear infinite; }
            @keyframes spin { 100% { transform: rotate(360deg); } }
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

                    <a href="/admin/cursos/${curso.id}" class="btn btn-sm btn-outline-secondary mb-4 rounded-pill fw-bold px-3">
                        <i class="bi bi-arrow-left me-1"></i> Voltar ao Curso
                    </a>

                    <div class="row justify-content-center">
                        <div class="col-xl-9 col-lg-10">
                            <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                                <div class="card-header bg-white py-4 border-bottom-0">
                                    <h4 class="mb-0 fw-bold text-dark"><i class="bi bi-play-btn-fill text-primary me-2"></i>Nova Aula</h4>
                                    <p class="text-muted small mb-0 mt-1">Módulo ${modulo.ordem}: <strong>${modulo.titulo}</strong></p>
                                </div>
                                <div class="card-body p-4 p-lg-5 pt-0">
                                    
                                    <form id="formNovaAula" action="/admin/modulos/${modulo.id}/aulas/nova" method="POST" enctype="multipart/form-data">
                                        
                                        <h6 class="text-primary fw-bold mb-3 border-bottom pb-2"><i class="bi bi-info-circle me-2"></i>Informações Básicas</h6>
                                        <div class="row g-3 mb-4">
                                            <div class="col-md-8">
                                                <label for="titulo" class="form-label fw-semibold">Título da Aula <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control bg-light" id="titulo" name="titulo" placeholder="Ex: Introdução ao Banco de Dados" required>
                                            </div>
                                            <div class="col-md-2">
                                                <label for="ordem" class="form-label fw-semibold">Ordem <span class="text-danger">*</span></label>
                                                <input type="number" class="form-control bg-light" id="ordem" name="ordem" value="${proximaOrdem}" min="1" required>
                                            </div>
                                            <div class="col-md-2">
                                                <label for="duracao" class="form-label fw-semibold">Duração (Seg)</label>
                                                <input type="number" class="form-control bg-light" id="duracao" name="duracao_segundos" placeholder="Ex: 1200">
                                            </div>
                                        </div>

                                        <div class="mb-5">
                                            <label for="descricao" class="form-label fw-semibold">Descrição da Aula</label>
                                            <textarea class="form-control bg-light" id="descricao" name="descricao" rows="3"></textarea>
                                        </div>

                                        <h6 class="text-primary fw-bold mb-3 border-bottom pb-2 mt-4"><i class="bi bi-cloud-arrow-up me-2"></i>Conteúdos da Aula (Uploads)</h6>
                                        
                                        <div class="row g-4 mb-4">
                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100 d-flex flex-column">
                                                    <label for="video" class="form-label fw-semibold"><i class="bi bi-film text-danger me-2"></i>Vídeo da Aula (.mp4)</label>
                                                    <input type="file" class="form-control" id="video" name="video" accept="video/mp4,video/x-m4v,video/*">
                                                    
                                                    <div id="localFeedback_video" class="mt-2 d-none align-items-center file-feedback"></div>
                                                    
                                                    <div id="progressContainer_video" class="mt-auto pt-3 d-none">
                                                        <div class="progress rounded-pill shadow-sm" style="height: 10px;">
                                                            <div id="progressBar_video" class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: 0%;"></div>
                                                        </div>
                                                        <small id="progressText_video" class="text-muted d-block mt-2 fw-bold" style="font-size: 0.75rem;">0% enviado</small>
                                                        
                                                        <div id="videoStages" class="d-none justify-content-between mt-3 px-1">
                                                            <div id="st_up" class="text-center text-white-50 toast-stage-item"><i class="bi bi-cloud-arrow-up mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">Upload</span></div>
                                                            <div id="st_360" class="text-center text-white-50 toast-stage-item"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">360p</span></div>
                                                            <div id="st_480" class="text-center text-white-50 toast-stage-item"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">480p</span></div>
                                                            <div id="st_720" class="text-center text-white-50 toast-stage-item"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">720p</span></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100 d-flex flex-column">
                                                    <label for="apostila" class="form-label fw-semibold"><i class="bi bi-images text-success me-2"></i>Imagens da Apostila</label>
                                                    <input type="file" class="form-control" id="apostila" name="apostila" accept="image/*" multiple>
                                                    <div class="form-text small">Pressione CTRL para selecionar múltiplas imagens.</div>
                                                    
                                                    <div id="localFeedback_apostila" class="mt-2 d-none align-items-center file-feedback"></div>
                                                    
                                                    <div id="progressContainer_apostila" class="mt-auto pt-3 d-none">
                                                        <div class="progress rounded-pill shadow-sm" style="height: 10px;">
                                                            <div id="progressBar_apostila" class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: 0%;"></div>
                                                        </div>
                                                        <small id="progressText_apostila" class="text-muted d-block mt-2 fw-bold" style="font-size: 0.75rem;">0% enviado</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100 d-flex flex-column">
                                                    <label for="avaliacao" class="form-label fw-semibold"><i class="bi bi-filetype-json text-warning me-2"></i>Avaliação (.json)</label>
                                                    <input type="file" class="form-control" id="avaliacao" name="avaliacao" accept="application/json">
                                                    
                                                    <div id="localFeedback_avaliacao" class="mt-2 d-none align-items-center file-feedback"></div>
                                                    
                                                    <div id="progressContainer_avaliacao" class="mt-auto pt-3 d-none">
                                                        <div class="progress rounded-pill shadow-sm" style="height: 10px;">
                                                            <div id="progressBar_avaliacao" class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" style="width: 0%;"></div>
                                                        </div>
                                                        <small id="progressText_avaliacao" class="text-muted d-block mt-2 fw-bold" style="font-size: 0.75rem;">0% enviado</small>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100 d-flex flex-column">
                                                    <label class="form-label fw-semibold text-dark"><i class="bi bi-file-earmark-zip-fill text-primary me-2"></i>Material Complementar</label>
                                                    <input type="file" class="form-control" id="arquivo_adicional" name="arquivo_adicional" accept=".zip,.rar">
                                                    <div class="form-text small">Arquivos zipados para download.</div>
                                                    
                                                    <div id="localFeedback_arquivo_adicional" class="mt-2 d-none align-items-center file-feedback"></div>

                                                    <div id="progressContainer_arquivo_adicional" class="mt-auto pt-3 d-none">
                                                        <div class="progress rounded-pill shadow-sm" style="height: 10px;">
                                                            <div id="progressBar_arquivo_adicional" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%;"></div>
                                                        </div>
                                                        <small id="progressText_arquivo_adicional" class="text-muted d-block mt-2 fw-bold" style="font-size: 0.75rem;">0% enviado</small>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center pt-4 border-top mt-5">
                                            <a href="/admin/cursos/${curso.id}" class="btn btn-light fw-bold rounded-pill px-4 shadow-sm text-secondary">Cancelar</a>
                                            <button type="submit" id="btnSubmit" class="btn btn-success fw-bold rounded-pill px-5 shadow">
                                                <i class="bi bi-floppy me-2"></i> Salvar Aula e Conteúdos
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

        ${renderToastProcessamento()}

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            // ==========================================
            // VARIÁVEIS GLOBAIS DE PROTEÇÃO
            // ==========================================
            window.isUploadingFiles = false;
            const fileInputs = ['video', 'apostila', 'avaliacao', 'arquivo_adicional'];

            window.onbeforeunload = function() {
                if (window.isUploadingFiles) {
                    return "O upload ainda está em andamento. Se fechar ou atualizar agora, o envio será cancelado!";
                }
            };

            // ==========================================
            // LÓGICA 1: FEEDBACK DE CARREGAMENTO LOCAL (NO CLIQUE)
            // ==========================================
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
                                <span class="small text-muted fw-semibold">Lendo arquivo local...</span>
                            \`;

                            setTimeout(() => {
                                let totalSize = 0;
                                for (let i = 0; i < files.length; i++) {
                                    totalSize += files[i].size;
                                }
                                const sizeMB = (totalSize / (1024 * 1024)).toFixed(2);
                                const fileText = files.length > 1 ? \`\${files.length} arquivos selecionados\` : files[0].name;

                                feedbackDiv.innerHTML = \`
                                    <i class="bi bi-check-circle-fill text-success me-2 fs-5"></i>
                                    <span class="small text-success fw-bold text-truncate" title="\${fileText}">\${fileText} (\${sizeMB} MB)</span>
                                \`;
                            }, 600);

                        } else {
                            feedbackDiv.classList.add('d-none');
                            feedbackDiv.classList.remove('d-flex');
                        }
                    });
                }
            });

            // ==========================================
            // LÓGICA 2: UPLOAD AJAX ASSÍNCRONO COM TOAST E ETAPAS
            // ==========================================
            document.getElementById('formNovaAula').addEventListener('submit', function(e) {
                e.preventDefault(); 
                
                const form = this;
                const formData = new FormData(form);
                const btn = document.getElementById('btnSubmit');
                const hasVideo = document.getElementById('video').files.length > 0;
                
                window.isUploadingFiles = true;
                btn.disabled = true;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Enviando arquivos...';
                
                // Ativa o módulo de Toast Universal
                if (window.GerenciadorProcessamento) {
                    window.GerenciadorProcessamento.iniciarUpload(hasVideo);
                }

                // Exibe as etapas também dentro do card do vídeo, se for upload de vídeo
                if (hasVideo) {
                    document.getElementById('progressContainer_video').classList.remove('d-none');
                    document.getElementById('videoStages').classList.remove('d-none');
                    document.getElementById('videoStages').classList.add('d-flex');
                }

                // Prepara as barras de progresso visuais de todos os inputs
                fileInputs.forEach(id => {
                    const input = document.getElementById(id);
                    const container = document.getElementById('progressContainer_' + id);
                    const status = document.getElementById('progressText_' + id);
                    const bar = document.getElementById('progressBar_' + id);
                    const localFeedback = document.getElementById('localFeedback_' + id);
                    
                    if (input && input.files.length > 0) {
                        localFeedback.classList.add('d-none');
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
                        
                        if (window.GerenciadorProcessamento) {
                            window.GerenciadorProcessamento.atualizarProgressoUpload(percentComplete);
                        }

                        fileInputs.forEach(id => {
                            const input = document.getElementById(id);
                            if (input && input.files.length > 0) {
                                const bar = document.getElementById('progressBar_' + id);
                                const status = document.getElementById('progressText_' + id);
                                
                                bar.style.width = percentComplete + '%';
                                status.innerText = percentComplete + '% enviado';
                            }
                        });

                        if (percentComplete === 100) {
                            btn.classList.replace('btn-success', 'btn-dark');
                            btn.innerHTML = '<i class="bi bi-gear-wide-connected spin-anim me-2"></i>Servidor Processando...';
                        }
                    }
                });

                xhr.addEventListener('load', function() {
                    window.isUploadingFiles = false;
                    
                    if (xhr.status >= 200 && xhr.status < 300) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            if (response.success) {
                                // O servidor guardou e devolveu o Job ID. 
                                // O módulo continua monitorando em background.
                                if (window.GerenciadorProcessamento) {
                                    window.GerenciadorProcessamento.registrarTarefaBackend(response.jobId);
                                }
                                window.location.href = response.redirectUrl;
                            } else {
                                alert('Erro reportado pelo servidor: ' + response.message);
                                resetUIOnError(btn);
                            }
                        } catch (e) {
                            // Se a resposta não for JSON (rota não convertida para assíncrona ainda)
                            window.location.href = xhr.responseURL;
                        }
                    } else {
                        alert('Ocorreu um erro no servidor durante o processamento.');
                        resetUIOnError(btn);
                    }
                });

                xhr.addEventListener('error', function() {
                    window.isUploadingFiles = false;
                    alert('Falha na conexão. O upload foi interrompido.');
                    resetUIOnError(btn);
                });

                function resetUIOnError(botao) {
                    botao.disabled = false;
                    botao.classList.remove('btn-dark', 'btn-warning');
                    botao.classList.add('btn-success');
                    botao.innerHTML = '<i class="bi bi-floppy me-2"></i> Salvar Aula e Conteúdos';
                    if (window.GerenciadorProcessamento) {
                        window.GerenciadorProcessamento.hide();
                    }
                }

                xhr.open('POST', form.action, true);
                xhr.send(formData);
            });

            // Loader Global normal
            window.addEventListener('pageshow', function(event) {
                const loader = document.getElementById('globalLoader');
                if (loader) {
                    if (event.persisted) { loader.style.display = 'none'; loader.style.opacity = '0'; } 
                    else { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 400); }
                }
            });

            window.addEventListener('beforeunload', function() {
                const loader = document.getElementById('globalLoader');
                if (loader && !window.isUploadingFiles) { 
                    loader.style.display = 'flex'; 
                    setTimeout(() => { loader.style.opacity = '1'; }, 10); 
                }
            });
        </script>

    </body>
    </html>
    `;
}

module.exports = renderNovaAulaView;