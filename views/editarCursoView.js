// views/editarCursoView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderEditarCursoView(admin, curso) {

    // 1. CORREÇÃO: Passar apenas a palavra-chave 'cursos' para o menu ficar azul
    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Editar Curso - ${curso.codigo_unico}</title>
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

                    <a href="/admin/cursos" class="btn btn-sm btn-outline-secondary mb-3 rounded-pill fw-bold px-3">
                        <i class="bi bi-arrow-left me-1"></i> Voltar para Cursos
                    </a>

                    <div class="row justify-content-center">
                        <div class="col-xl-9 col-lg-10">
                            <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                                <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom-0">
                                    <h4 class="mb-0 fw-bold text-dark"><i class="bi bi-pencil-square text-primary me-2"></i>Editar Curso: ${curso.codigo_unico}</h4>
                                </div>
                                <div class="card-body p-4 p-lg-5">
                                    <form action="/admin/cursos/${curso.id}/editar" method="POST" enctype="multipart/form-data">
                                        
                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">Título do Curso <span class="text-danger">*</span></label>
                                            <input type="text" class="form-control bg-light" name="titulo" value="${curso.titulo}" required>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">Descrição</label>
                                            <textarea class="form-control bg-light" name="descricao" rows="4">${curso.descricao || ''}</textarea>
                                        </div>

                                        <div class="mb-3">
                                            <label class="form-label fw-semibold">Mercado de Atuação (Tags)</label>
                                            <input type="text" class="form-control bg-light" name="mercado" value="${curso.mercado || ''}" placeholder="Ex: Tecnologia, Programação, Web Design">
                                            <div class="form-text">Insira as áreas de atuação separadas por vírgula.</div>
                                        </div>

                                        <div class="row mb-4">
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold">Duração Estimada (Horas)</label>
                                                <input type="number" class="form-control bg-light" name="duracao_horas" value="${curso.duracao_horas || ''}" min="1" placeholder="Ex: 40">
                                            </div>
                                            <div class="col-md-6 mt-3 mt-md-0">
                                                <label class="form-label fw-semibold">Tempo de Conclusão (Dias)</label>
                                                <input type="number" class="form-control bg-light" name="conclusao_dias" value="${curso.conclusao_dias || ''}" min="1" placeholder="Ex: 30">
                                                <div class="form-text">Prazo médio para o aluno concluir o curso.</div>
                                            </div>
                                        </div>

                                        <div class="p-4 mb-4 bg-light border rounded-4 border-start border-success border-4 shadow-sm">
                                            <h6 class="fw-bold text-success mb-3"><i class="bi bi-tags-fill me-2"></i>Configurações de Venda (Checkout)</h6>
                                            <div class="row">
                                                <div class="col-md-6 mb-3 mb-md-0">
                                                    <label class="form-label fw-semibold">Preço Base (R$)</label>
                                                    <input type="number" class="form-control" name="preco" value="${curso.preco || ''}" step="0.01" min="0" placeholder="Ex: 197.00">
                                                    <div class="form-text">Deixe vazio ou 0.00 para curso gratuito.</div>
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label fw-semibold">Desconto Promocional (%)</label>
                                                    <input type="number" class="form-control" name="desconto_percentual" value="${curso.desconto_percentual || 0}" min="0" max="100" placeholder="Ex: 15">
                                                    <div class="form-text">Percentagem aplicada no checkout final.</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row mb-4">
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold">Alterar Capa (Thumb)</label>
                                                <input type="hidden" name="capa_url_atual" value="${curso.capa_url || ''}">
                                                ${curso.capa_url ? `<p class="small text-success mb-2"><i class="bi bi-check-circle-fill me-1"></i>Capa atual configurada.</p>` : ''}
                                                <input type="file" class="form-control bg-light" name="capa" accept="image/*">
                                            </div>
                                            <div class="col-md-6 mt-3 mt-md-0">
                                                <label class="form-label fw-semibold">Alterar Fundo do Certificado</label>
                                                <input type="hidden" name="certificado_atual" value="${curso.certificado_template_url || ''}">
                                                ${curso.certificado_template_url ? `<p class="small text-success mb-2"><i class="bi bi-check-circle-fill me-1"></i>Template atual configurado.</p>` : ''}
                                                <input type="file" class="form-control bg-light" name="certificado_template" accept="image/*">
                                            </div>
                                        </div>

                                        <div class="mb-4">
                                            <label class="form-label fw-semibold">Status do Curso</label>
                                            <select class="form-select bg-light" name="status">
                                                <option value="RASCUNHO" ${curso.status === 'RASCUNHO' ? 'selected' : ''}>Rascunho (Invisível para alunos)</option>
                                                <option value="PUBLICADO" ${curso.status === 'PUBLICADO' ? 'selected' : ''}>Publicado (Disponível para matrículas/vendas)</option>
                                                <option value="ARQUIVADO" ${curso.status === 'ARQUIVADO' ? 'selected' : ''}>Arquivado (Apenas consulta)</option>
                                            </select>
                                        </div>

                                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 pt-4 border-top">
                                            <button type="button" class="btn btn-outline-danger fw-bold rounded-pill px-4 mb-3 mb-md-0 shadow-sm" onclick="if(confirm('Tem certeza absoluta? Isso apagará o curso, TODOS os módulos e TODAS as aulas vinculadas a ele. Esta ação não pode ser desfeita.')) { document.getElementById('form-excluir-curso').submit(); }">
                                                <i class="bi bi-trash3 me-1"></i> Excluir Curso
                                            </button>
                                            
                                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                                <button type="submit" class="btn btn-primary btn-lg fw-bold rounded-pill px-5 shadow">
                                                    <i class="bi bi-floppy me-2"></i> Atualizar Curso
                                                </button>
                                            </div>
                                        </div>

                                    </form>

                                    <form id="form-excluir-curso" action="/admin/cursos/${curso.id}/excluir" method="POST" style="display: none;"></form>
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

module.exports = renderEditarCursoView;