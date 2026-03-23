// views/cursoDetalhesView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderCursoDetalhesView(admin, curso, modulos) {

    const htmlSidebar = renderAdminMenuLateral(admin, 'admin/cursos/id');

    let badgeClass = 'bg-secondary';
    if (curso.status === 'PUBLICADO') badgeClass = 'bg-success';
    if (curso.status === 'RASCUNHO') badgeClass = 'bg-warning text-dark';

    let htmlModulos = '';
    if (modulos.length === 0) {
        htmlModulos = `
            <div class="text-center p-4 border rounded bg-light text-muted">
                <p class="mb-0">Nenhum módulo cadastrado neste curso ainda.</p>
            </div>`;
    } else {
        htmlModulos = '<div class="accordion accordion-flush" id="accordionModulos">';
        
        modulos.forEach(modulo => {
            // Monta a lista de aulas deste módulo
            let htmlAulas = '';
            if (modulo.aulas.length === 0) {
                htmlAulas = '<li class="list-group-item text-muted small bg-light">Nenhuma aula cadastrada neste módulo.</li>';
            } else {
                modulo.aulas.forEach(aula => {
                    htmlAulas += `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <span class="badge bg-secondary me-2">Aula ${aula.ordem}</span>
                                ${aula.titulo}
                            </div>
                            <a href="/admin/aulas/${aula.id}/editar" class="btn btn-sm btn-light border">Editar Aula</a>
                        </li>
                    `;
                });
            }

            htmlModulos += `
                <div class="accordion-item border mb-2 rounded">
                    <h2 class="accordion-header" id="heading-${modulo.id}">
                        <button class="accordion-button collapsed fw-bold text-dark bg-white shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${modulo.id}">
                            Módulo ${modulo.ordem}: ${modulo.titulo}
                        </button>
                    </h2>
                    <div id="collapse-${modulo.id}" class="accordion-collapse collapse" data-bs-parent="#accordionModulos">
                        <div class="accordion-body p-0">
                            <div class="bg-light p-2 d-flex justify-content-end border-bottom">
                                <a href="/admin/modulos/${modulo.id}/editar" class="btn btn-sm btn-outline-secondary me-2">Editar Módulo</a>
                                <a href="/admin/modulos/${modulo.id}/aulas/nova" class="btn btn-sm btn-primary">+ Nova Aula</a>
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
        <span class="visually-hidden">Carregando...</span>
    </div>
    <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
</div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

        <div class="container mt-4">
            
            <nav aria-label="breadcrumb" class="mb-3 d-flex justify-content-between">
                <ol class="breadcrumb mb-0">
                    <li class="breadcrumb-item"><a href="/admin" class="text-decoration-none">Dashboard</a></li>
                    <li class="breadcrumb-item active" aria-current="page">${curso.codigo_unico}</li>
                </ol>
                <a href="/admin/cursos" class="btn btn-sm btn-outline-secondary">Voltar aos Cursos</a>
            </nav>

            <div class="row">
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm border-0">
                        ${curso.capa_url ? `<img src="${curso.capa_url}" class="card-img-top" alt="Capa do Curso" style="height: 150px; object-fit: cover;">` : `<div class="bg-secondary text-white d-flex align-items-center justify-content-center" style="height: 150px;">Sem Capa</div>`}
                        <div class="card-body">
                            <h5 class="card-title fw-bold mb-1">${curso.titulo}</h5>
                            <p class="text-muted small mb-3">Código: <strong>${curso.codigo_unico}</strong></p>
                            
                            <p class="card-text text-secondary mb-3" style="font-size: 0.9rem;">
                                ${curso.descricao ? curso.descricao : '<em>Sem descrição fornecida.</em>'}
                            </p>

                            <div class="d-flex justify-content-between align-items-center border-top pt-3 mt-3">
                                <span class="badge ${badgeClass}">${curso.status}</span>
                                <a href="/admin/cursos/${curso.id}/editar" class="btn btn-sm btn-outline-primary">Editar Curso</a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-8">
                    <div class="card shadow-sm border-0 h-100">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold text-secondary">Estrutura Curricular</h5>
                            <a href="/admin/cursos/${curso.id}/modulos/novo" class="btn btn-success btn-sm">+ Novo Módulo</a>
                        </div>
                        <div class="card-body p-0">
                            ${htmlModulos}
                        </div>
                    </div>
                </div>
            </div>

        </div>
</div> </div> </div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
    // 1. Esconde o loader no carregamento normal E quando o usuário clica em "Voltar"
    window.addEventListener('pageshow', function(event) {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            // Se event.persisted for true, significa que a página veio do "cache" do botão voltar
            if (event.persisted) {
                loader.style.display = 'none';
                loader.style.opacity = '0';
            } else {
                // Carregamento normal da página (fade suave)
                loader.style.opacity = '0';
                setTimeout(() => { loader.style.display = 'none'; }, 400);
            }
        }
    });

    // 2. Mostra o loader quando a página for descarregada (clique em link ou submit)
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