// views/cursoDetalhesView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderCursoDetalhesView(admin, curso, modulos) {

    // 1. CORREÇÃO: Menu lateral focado na aba 'cursos'
    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

    let badgeClass = 'bg-secondary';
    if (curso.status === 'PUBLICADO') badgeClass = 'bg-success';
    if (curso.status === 'RASCUNHO') badgeClass = 'bg-warning text-dark';

    // Imagem de fallback nativa (SVG Base64) adaptada para o tamanho da capa do curso (retangular)
    const fallbackCapa = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22200%22%20viewBox%3D%220%200%20400%20200%22%3E%3Crect%20fill%3D%22%23e9ecef%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%236c757d%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ECurso%3C%2Ftext%3E%3C%2Fsvg%3E';
    const capa = (curso.capa_url && curso.capa_url.trim() !== '') ? curso.capa_url : fallbackCapa;

    let htmlModulos = '';
    if (modulos.length === 0) {
        htmlModulos = `
            <div class="text-center p-5 border-0 rounded bg-light text-muted">
                <i class="bi bi-journal-x fs-1 mb-2 d-block opacity-50"></i>
                <p class="mb-0 fw-semibold">Nenhum módulo cadastrado neste curso ainda.</p>
                <small>Clique em "Novo Módulo" para começar a estruturar o conteúdo.</small>
            </div>`;
    } else {
        htmlModulos = '<div class="accordion accordion-flush" id="accordionModulos">';
        
        modulos.forEach(modulo => {
            let htmlAulas = '';
            if (modulo.aulas.length === 0) {
                htmlAulas = '<li class="list-group-item text-muted small bg-light p-3 text-center border-0 border-bottom">Nenhuma aula cadastrada neste módulo.</li>';
            } else {
                modulo.aulas.forEach(aula => {
                    htmlAulas += `
                        <li class="list-group-item d-flex justify-content-between align-items-center py-3 border-0 border-bottom">
                            <div>
                                <span class="badge bg-secondary me-2 rounded-pill px-3">Aula ${aula.ordem}</span>
                                <i class="bi bi-play-circle-fill text-primary me-2"></i> ${aula.titulo}
                            </div>
                            <a href="/admin/aulas/${aula.id}/editar" class="btn btn-sm btn-outline-secondary rounded-pill px-3"><i class="bi bi-pencil-square me-1"></i> Editar</a>
                        </li>
                    `;
                });
            }

            htmlModulos += `
                <div class="accordion-item border-0 mb-3 shadow-sm rounded-4 overflow-hidden">
                    <h2 class="accordion-header" id="heading-${modulo.id}">
                        <button class="accordion-button collapsed fw-bold text-dark bg-white shadow-none py-3" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${modulo.id}">
                            <i class="bi bi-folder2-open text-warning me-2 fs-5"></i> Módulo ${modulo.ordem}: ${modulo.titulo}
                        </button>
                    </h2>
                    <div id="collapse-${modulo.id}" class="accordion-collapse collapse" data-bs-parent="#accordionModulos">
                        <div class="accordion-body p-0 border-top">
                            <div class="bg-light p-3 d-flex justify-content-end border-bottom">
                                <a href="/admin/modulos/${modulo.id}/editar" class="btn btn-sm btn-outline-secondary me-2 rounded-pill fw-bold"><i class="bi bi-pencil me-1"></i> Editar Módulo</a>
                                <a href="/admin/modulos/${modulo.id}/aulas/nova" class="btn btn-sm btn-primary rounded-pill fw-bold"><i class="bi bi-plus-lg me-1"></i> Nova Aula</a>
                            </div>
                            <ul class="list-group list-group-flush">
                                ${htmlAulas}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        });
        htmlModulos += '</div>';
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestão de Curso - ${curso.titulo}</title>
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
                <span class="visually-hidden">Carregando...</span>
            </div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <a href="/admin/cursos" class="btn btn-sm btn-outline-secondary mb-2 rounded-pill fw-bold px-3">
                                <i class="bi bi-arrow-left me-1"></i> Voltar aos Cursos
                            </a>
                            <h3 class="fw-bold text-dark mb-0">Gestão do Curso</h3>
                        </div>
                    </div>

                    <div class="row g-4">
                        <div class="col-xl-4 col-lg-5 mb-4">
                            <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                                <img src="${capa}" onerror="this.onerror=null;this.src='${fallbackCapa}';" class="card-img-top border-bottom" alt="Capa do Curso" style="height: 200px; object-fit: cover;">
                                
                                <div class="card-body p-4">
                                    <span class="badge bg-light text-dark border mb-2"><i class="bi bi-upc-scan me-1"></i>${curso.codigo_unico}</span>
                                    <h5 class="card-title fw-bold mb-3 text-dark">${curso.titulo}</h5>
                                    
                                    <p class="card-text text-secondary small mb-4 lh-lg">
                                        ${curso.descricao ? curso.descricao : '<em>Nenhuma descrição foi fornecida para este curso.</em>'}
                                    </p>

                                    <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                                        <span class="badge ${badgeClass} fs-6 px-3 py-2 rounded-pill">${curso.status}</span>
                                        <a href="/admin/cursos/${curso.id}/editar" class="btn btn-primary fw-bold rounded-pill px-3 shadow-sm">
                                            <i class="bi bi-gear me-1"></i> Editar Curso
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="col-xl-8 col-lg-7">
                            <div class="card shadow-sm border-0 rounded-4 h-100">
                                <div class="card-header bg-white py-4 px-4 d-flex justify-content-between align-items-center border-bottom-0">
                                    <h5 class="mb-0 fw-bold text-dark"><i class="bi bi-list-task text-primary me-2"></i>Estrutura Curricular</h5>
                                    <a href="/admin/cursos/${curso.id}/modulos/novo" class="btn btn-success fw-bold rounded-pill shadow-sm px-4">
                                        <i class="bi bi-plus-lg me-1"></i> Novo Módulo
                                    </a>
                                </div>
                                <div class="card-body p-4 pt-0">
                                    ${htmlModulos}
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

module.exports = renderCursoDetalhesView;