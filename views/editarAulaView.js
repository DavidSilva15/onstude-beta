// views/editarAulaView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderEditarAulaView(admin, curso, modulo, aula, conteudos) {

    // 1. CORREÇÃO: Menu lateral focado na aba 'cursos'
    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Editar Aula - ${aula.titulo}</title>
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
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">A carregar...</span>
            </div>
            <h5 class="mt-3 text-secondary fw-bold">A carregar...</h5>
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
                                    <h4 class="mb-0 fw-bold text-dark"><i class="bi bi-play-circle-fill text-primary me-2"></i>Editar Aula ${aula.ordem}</h4>
                                    <p class="text-muted small mb-0 mt-1">Curso: <strong>${curso.codigo_unico}</strong> | Módulo: <strong>${modulo.titulo || modulo.ordem}</strong></p>
                                </div>
                                <div class="card-body p-4 p-lg-5 pt-0">
                                    <form action="/admin/aulas/${aula.id}/editar" method="POST" enctype="multipart/form-data">
                                        
                                        <h6 class="text-primary fw-bold mb-3 border-bottom pb-2"><i class="bi bi-info-circle me-2"></i>Informações Básicas</h6>
                                        <div class="row g-3 mb-4">
                                            <div class="col-md-8">
                                                <label class="form-label fw-semibold">Título da Aula <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control bg-light" name="titulo" value="${aula.titulo}" required>
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label fw-semibold">Ordem <span class="text-danger">*</span></label>
                                                <input type="number" class="form-control bg-light" name="ordem" value="${aula.ordem}" min="1" required>
                                            </div>
                                            <div class="col-md-2">
                                                <label class="form-label fw-semibold">Duração (Seg)</label>
                                                <input type="number" class="form-control bg-light" name="duracao_segundos" value="${aula.duracao_segundos || ''}">
                                            </div>
                                        </div>

                                        <div class="mb-5">
                                            <label class="form-label fw-semibold">Descrição da Aula</label>
                                            <textarea class="form-control bg-light" name="descricao" rows="3">${aula.descricao || ''}</textarea>
                                        </div>

                                        <h6 class="text-primary fw-bold mb-3 border-bottom pb-2 mt-4"><i class="bi bi-cloud-arrow-up me-2"></i>Conteúdos da Aula (Uploads)</h6>
                                        <p class="small text-muted mb-4"><i class="bi bi-exclamation-triangle me-1"></i>Envie um novo arquivo apenas se desejar substituir o atual.</p>
                                        
                                        <div class="row g-4 mb-4">
                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100">
                                                    <label class="form-label fw-semibold"><i class="bi bi-film text-danger me-2"></i>Substituir Vídeo (.mp4)</label>
                                                    <input type="hidden" name="video_atual" value="${conteudos?.video_path || ''}">
                                                    ${conteudos?.video_path ? `<p class="small text-success mb-2"><i class="bi bi-check-circle-fill me-1"></i>Vídeo atual configurado.</p>` : ''}
                                                    <input type="file" class="form-control" name="video" accept="video/mp4,video/x-m4v,video/*">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100">
                                                    <label class="form-label fw-semibold"><i class="bi bi-images text-success me-2"></i>Substituir Apostila</label>
                                                    <input type="file" class="form-control" name="apostila" accept="image/*" multiple>
                                                    <div class="form-text small text-warning mt-2"><i class="bi bi-exclamation-circle me-1"></i>O envio de novas imagens substituirá todas as anteriores.</div>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100">
                                                    <label class="form-label fw-semibold"><i class="bi bi-filetype-json text-warning me-2"></i>Substituir Avaliação (.json)</label>
                                                    <input type="hidden" name="avaliacao_atual" value="${conteudos?.avaliacao_json_path || ''}">
                                                    ${conteudos?.avaliacao_json_path ? `<p class="small text-success mb-2"><i class="bi bi-check-circle-fill me-1"></i>Avaliação atual configurada.</p>` : ''}
                                                    <input type="file" class="form-control" name="avaliacao" accept="application/json">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <div class="p-3 border rounded-4 bg-light h-100">
                                                    <label class="form-label fw-semibold text-dark"><i class="bi bi-file-earmark-zip-fill text-primary me-2"></i>Material Complementar</label>
                                                    <input type="hidden" name="arquivo_adicional_atual" value="${aula.arquivo_adicional_url || ''}">
                                                    ${aula.arquivo_adicional_url ? `<p class="small text-success mb-2"><i class="bi bi-check-circle-fill me-1"></i>Material atual configurado.</p>` : ''}
                                                    <input type="file" class="form-control" name="arquivo_adicional" accept=".zip,.rar">
                                                </div>
                                            </div>
                                        </div>

                                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center pt-4 border-top mt-5">
                                            <button type="button" class="btn btn-outline-danger fw-bold rounded-pill px-4 mb-3 mb-md-0 shadow-sm" onclick="if(confirm('Tem a certeza que deseja excluir esta aula e os seus conteúdos? Esta ação é irreversível.')) { document.getElementById('form-excluir-aula').submit(); }">
                                                <i class="bi bi-trash3 me-1"></i> Excluir Aula
                                            </button>

                                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <button type="submit" class="btn btn-primary fw-bold rounded-pill px-5 shadow">
                                                    <i class="bi bi-floppy me-2"></i> Atualizar Aula
                                                </button>
                                            </div>
                                        </div>
                                    </form>

                                    <form id="form-excluir-aula" action="/admin/aulas/${aula.id}/excluir" method="POST" style="display: none;"></form>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

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

module.exports = renderEditarAulaView;