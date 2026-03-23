// views/adminCurriculosView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminCurriculosView(admin, modelosCV = []) {

    const htmlSidebar = renderAdminMenuLateral(admin, 'admin/curriculos');
    
    let htmlModelosCV = '';
    if (!modelosCV || modelosCV.length === 0) {
        // Colspan alterado para 3, pois removemos uma coluna
        htmlModelosCV = '<tr><td colspan="3" class="text-center py-5 text-muted">Nenhum modelo cadastrado. Adicione o primeiro modelo clicando no botão acima.</td></tr>';
    } else {
        modelosCV.forEach(cv => {
            htmlModelosCV += `
                <tr>
                    <td class="ps-4">
                        <img src="${cv.capa_url}" alt="Capa" class="rounded shadow-sm" style="width: 50px; height: 70px; object-fit: cover; border: 1px solid #dee2e6;">
                    </td>
                    <td class="fw-bold text-dark">${cv.titulo}</td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-warning text-white fw-bold me-2 rounded-3 shadow-sm" onclick="abrirModalEdicaoCV(${cv.id}, '${cv.titulo}')" title="Editar">
                            <i class="bi bi-pencil-square"></i> Editar
                        </button>
                        <form action="/admin/curriculos/${cv.id}/excluir" method="POST" class="d-inline" onsubmit="return confirm('Tem certeza que deseja excluir este modelo definitivamente?');">
                            <button type="submit" class="btn btn-sm btn-danger fw-bold rounded-3 shadow-sm" title="Excluir"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
            `;
        });
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Gestão de Currículos - Admin</title>
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
    <body>
        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

        <div class="container mt-4 mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold text-dark mb-0"><i class="bi bi-file-earmark-word me-2 text-primary"></i>Modelos de Currículo</h3>
                <button class="btn btn-primary fw-bold rounded-pill px-4 shadow-sm" data-bs-toggle="modal" data-bs-target="#modalNovoCurriculo">
                    <i class="bi bi-plus-lg me-1"></i> Novo Modelo
                </button>
            </div>
            
            <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">Capa</th>
                                <th>Título do Modelo</th>
                                <th class="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${htmlModelosCV}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalNovoCurriculo" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header bg-light border-0">
                        <h5 class="modal-title fw-bold text-dark">Adicionar Modelo de CV</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form action="/admin/curriculos/novo" method="POST" enctype="multipart/form-data">
                        <div class="modal-body p-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Título do Modelo</label>
                                <input type="text" name="titulo" class="form-control" required placeholder="Ex: Currículo Executivo">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Imagem de Capa (Thumbnail)</label>
                                <input type="file" name="capa" class="form-control" accept="image/*" required>
                                <div class="form-text">Envie uma imagem JPG/PNG.</div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Arquivo Word (.docx)</label>
                                <input type="file" name="arquivo_docx" class="form-control" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required>
                            </div>
                        </div>
                        <div class="modal-footer border-0 bg-light">
                            <button type="button" class="btn btn-secondary fw-bold rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-primary fw-bold rounded-pill px-4">Salvar Modelo</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalEditarCurriculo" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header bg-light border-0">
                        <h5 class="modal-title fw-bold text-dark">Editar Modelo de CV</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <form id="formEditarCV" method="POST" enctype="multipart/form-data">
                        <div class="modal-body p-4">
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Título do Modelo</label>
                                <input type="text" name="titulo" id="editCvTitulo" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Nova Imagem de Capa (Opcional)</label>
                                <input type="file" name="capa" class="form-control" accept="image/*">
                            </div>
                            <div class="mb-3">
                                <label class="form-label fw-semibold">Novo Arquivo Word (Opcional)</label>
                                <input type="file" name="arquivo_docx" class="form-control" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document">
                            </div>
                        </div>
                        <div class="modal-footer border-0 bg-light">
                            <button type="button" class="btn btn-secondary fw-bold rounded-pill px-4" data-bs-dismiss="modal">Cancelar</button>
                            <button type="submit" class="btn btn-warning text-white fw-bold rounded-pill px-4">Atualizar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        </div> </div> </div><script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            function abrirModalEdicaoCV(id, titulo) {
                document.getElementById('editCvTitulo').value = titulo;
                document.getElementById('formEditarCV').action = '/admin/curriculos/' + id + '/editar';
                var myModal = new bootstrap.Modal(document.getElementById('modalEditarCurriculo'));
                myModal.show();
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAdminCurriculosView;