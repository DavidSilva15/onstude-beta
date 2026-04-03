// views/novoModuloView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderNovoModuloView(admin, curso, proximaOrdem) {

    // 1. CORREÇÃO: Menu lateral focado na aba 'cursos'
    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

    return `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Módulo - ${curso.codigo_unico}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">

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
                        <div class="col-xl-8 col-lg-10">
                            <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                                <div class="card-header bg-white py-4 border-bottom-0">
                                    <h4 class="mb-0 fw-bold text-dark"><i class="bi bi-folder-plus text-success me-2"></i>Adicionar Módulo ao Curso</h4>
                                    <p class="text-muted small mb-0 mt-1">Curso: <strong>${curso.codigo_unico} - ${curso.titulo}</strong></p>
                                </div>
                                <div class="card-body p-4 p-lg-5 pt-0">
                                    <form action="/admin/cursos/${curso.id}/modulos/novo" method="POST">
                                        
                                        <div class="row g-3 mb-4">
                                            <div class="col-md-9">
                                                <label for="titulo" class="form-label fw-semibold">Título do Módulo <span class="text-danger">*</span></label>
                                                <input type="text" class="form-control bg-light" id="titulo" name="titulo" placeholder="Ex: Introdução e Configuração" required>
                                            </div>
                                            <div class="col-md-3">
                                                <label for="ordem" class="form-label fw-semibold">Ordem <span class="text-danger">*</span></label>
                                                <input type="number" class="form-control bg-light" id="ordem" name="ordem" value="${proximaOrdem}" min="1" required>
                                            </div>
                                        </div>

                                        <div class="mb-5">
                                            <label for="descricao" class="form-label fw-semibold">Descrição do Módulo</label>
                                            <textarea class="form-control bg-light" id="descricao" name="descricao" rows="4" placeholder="Opcional. Breve resumo do que será abordado neste módulo."></textarea>
                                        </div>

                                        <div class="d-flex justify-content-between align-items-center pt-4 border-top">
                                            <a href="/admin/cursos/${curso.id}" class="btn btn-light fw-bold rounded-pill px-4 shadow-sm text-secondary">Cancelar</a>
                                            <button type="submit" class="btn btn-success fw-bold rounded-pill px-5 shadow">
                                                <i class="bi bi-floppy me-2"></i> Salvar Módulo
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

module.exports = renderNovoModuloView;