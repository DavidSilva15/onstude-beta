// views/editarCursoView.js

function renderEditarCursoView(admin, curso) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Editar Curso - ${curso.codigo_unico}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
    <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
    <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
        <span class="visually-hidden">Carregando...</span>
    </div>
    <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
</div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-primary" href="/admin">OnStude <span class="text-white fw-light">Admin</span></a>
                <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/admin">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link active fw-bold" href="/admin/cursos">Cursos</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/usuarios">Usuários</a></li>
                        <li class="nav-item">
                            <a class="nav-link" href="/admin/notificacoes">Notificações</a>
                        </li>
                    </ul>
                <div class="d-flex align-items-center ms-auto">
                    ${admin.foto_perfil_url 
                        ? `<img src="${admin.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid #fff;">` 
                        : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold" style="width: 36px; height: 36px; border: 2px solid #fff; font-size: 14px;">${admin.nome.charAt(0).toUpperCase()}</div>`
                    }
                    <span class="text-light me-3">Olá, <strong>${admin.nome}</strong></span>
                    <a href="/logout" class="btn btn-outline-danger btn-sm">Sair</a>
                </div>
            </div>
        </nav>

        <div class="container mt-5 mb-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h4 class="mb-0 fw-bold text-secondary">Editar Curso: ${curso.codigo_unico}</h4>
                            <a href="/admin/cursos/${curso.id}" class="btn btn-sm btn-outline-secondary">Cancelar</a>
                        </div>
                        <div class="card-body p-4">
                            <form action="/admin/cursos/${curso.id}/editar" method="POST" enctype="multipart/form-data">
                                
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Título do Curso <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="titulo" value="${curso.titulo}" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Descrição</label>
                                    <textarea class="form-control" name="descricao" rows="4">${curso.descricao || ''}</textarea>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Mercado de Atuação (Tags)</label>
                                    <input type="text" class="form-control" name="mercado" value="${curso.mercado || ''}" placeholder="Ex: Tecnologia, Programação, Web Design">
                                    <div class="form-text">Insira as áreas de atuação separadas por vírgula.</div>
                                </div>

                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold">Duração Estimada (Horas)</label>
                                        <input type="number" class="form-control" name="duracao_horas" value="${curso.duracao_horas || ''}" min="1" placeholder="Ex: 40">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold">Tempo de Conclusão (Dias)</label>
                                        <input type="number" class="form-control" name="conclusao_dias" value="${curso.conclusao_dias || ''}" min="1" placeholder="Ex: 30">
                                        <div class="form-text">Prazo médio para o aluno concluir o curso.</div>
                                    </div>
                                </div>

                                <div class="p-3 mb-4 bg-light border rounded border-start border-success border-4">
                                    <h6 class="fw-bold text-success mb-3">💰 Configurações de Venda (Checkout)</h6>
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
                                        ${curso.capa_url ? `<p class="small text-success mb-1">Capa atual configurada.</p>` : ''}
                                        <input type="file" class="form-control" name="capa" accept="image/*">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold">Alterar Fundo do Certificado</label>
                                        <input type="hidden" name="certificado_atual" value="${curso.certificado_template_url || ''}">
                                        ${curso.certificado_template_url ? `<p class="small text-success mb-1">Template atual configurado.</p>` : ''}
                                        <input type="file" class="form-control" name="certificado_template" accept="image/*">
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold">Status</label>
                                    <select class="form-select" name="status">
                                        <option value="RASCUNHO" ${curso.status === 'RASCUNHO' ? 'selected' : ''}>Rascunho (Invisível para alunos)</option>
                                        <option value="PUBLICADO" ${curso.status === 'PUBLICADO' ? 'selected' : ''}>Publicado (Disponível para matrículas/vendas)</option>
                                        <option value="ARQUIVADO" ${curso.status === 'ARQUIVADO' ? 'selected' : ''}>Arquivado (Apenas consulta)</option>
                                    </select>
                                </div>

                                <div class="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
                                    <button type="button" class="btn btn-outline-danger" onclick="if(confirm('Tem certeza absoluta? Isso apagará o curso, TODOS os módulos e TODAS as aulas vinculadas a ele. Esta ação não pode ser desfeita.')) { document.getElementById('form-excluir-curso').submit(); }">
                                        Excluir Curso
                                    </button>
                                    
                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <a href="/admin/cursos/${curso.id}" class="btn btn-light me-md-2">Cancelar</a>
                                        <button type="submit" class="btn btn-primary px-4">Atualizar Curso</button>
                                    </div>
                                </div>

                            </form>

                            <form id="form-excluir-curso" action="/admin/cursos/${curso.id}/excluir" method="POST" style="display: none;"></form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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