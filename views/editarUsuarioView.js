// views/editarUsuarioView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderEditarUsuarioView(admin, usuario, cursosDisponiveis) {

    const htmlSidebar = renderAdminMenuLateral(admin, 'admin/usuarios/id/editar');

    // Monta a lista de cursos com as caixas marcadas se o usuário já estiver matriculado e ATIVO
    let htmlCursos = '';
    if (cursosDisponiveis && cursosDisponiveis.length > 0) {
        cursosDisponiveis.forEach(curso => {
            const isChecked = curso.matriculado ? 'checked' : '';
            htmlCursos += `
                <div class="form-check mb-2">
                    <input class="form-check-input border-secondary" type="checkbox" name="cursos" value="${curso.id}" id="curso_${curso.id}" ${isChecked}>
                    <label class="form-check-label text-dark" for="curso_${curso.id}">
                        <strong>${curso.codigo_unico}</strong> - ${curso.titulo}
                    </label>
                </div>
            `;
        });
    } else {
        htmlCursos = '<p class="text-muted small mb-0">Nenhum curso publicado disponível no momento.</p>';
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Editar Usuário - OnStude</title>
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

        <div class="container mt-5 mb-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold text-secondary">Editar Usuário: ${usuario.nome}</h5>
                            <a href="/admin/usuarios" class="btn btn-sm btn-outline-secondary">Cancelar</a>
                        </div>
                        <div class="card-body p-4">
                            <form action="/admin/usuarios/${usuario.id}/editar" method="POST" enctype="multipart/form-data">
                                
                                <h6 class="text-primary mb-3">Informações Principais</h6>
                                <div class="row mb-3">
                                    <div class="col-md-8">
                                        <label class="form-label fw-semibold">Nome Completo</label>
                                        <input type="text" class="form-control" name="nome" value="${usuario.nome}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold">Tipo</label>
                                        <select class="form-select" name="tipo">
                                            <option value="ALUNO" ${usuario.tipo === 'ALUNO' ? 'selected' : ''}>Aluno</option>
                                            <option value="ADMIN" ${usuario.tipo === 'ADMIN' ? 'selected' : ''}>Administrador</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-5">
                                        <label class="form-label fw-semibold">E-mail</label>
                                        <input type="email" class="form-control" name="email" value="${usuario.email}" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold">Nascimento</label>
                                        <input type="date" class="form-control" name="data_nascimento" value="${usuario.data_nascimento ? new Date(usuario.data_nascimento).toISOString().substring(0, 10) : ''}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label fw-semibold">Status</label>
                                        <select class="form-select" name="status">
                                            <option value="ATIVO" ${usuario.status === 'ATIVO' ? 'selected' : ''}>Ativo</option>
                                            <option value="BLOQUEADO" ${usuario.status === 'BLOQUEADO' ? 'selected' : ''}>Bloqueado</option>
                                            <option value="INATIVO" ${usuario.status === 'INATIVO' ? 'selected' : ''}>Inativo</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Nova Senha (opcional)</label>
                                    <input type="password" class="form-control" name="nova_senha" placeholder="Deixe em branco para manter a atual">
                                </div>

                                <hr class="my-4">
                                <h6 class="text-primary mb-3">Contato e Perfil</h6>

                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold">Telefone</label>
                                        <input type="tel" class="form-control" name="telefone" value="${usuario.telefone || ''}">
                                    </div>
                                    <div class="col-md-5">
                                        <label class="form-label fw-semibold">Cidade</label>
                                        <input type="text" class="form-control" name="cidade" value="${usuario.cidade || ''}">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label fw-semibold">Estado</label>
                                        <input type="text" class="form-control" name="estado" maxlength="2" value="${usuario.estado || ''}">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Substituir Foto de Perfil</label>
                                    <input type="hidden" name="foto_atual" value="${usuario.foto_perfil_url || ''}">
                                    ${usuario.foto_perfil_url ? `<p class="small text-success mb-1">Foto atual configurada.</p>` : ''}
                                    <input type="file" class="form-control" name="foto_perfil" accept="image/*">
                                </div>

                                <hr class="my-4">
                                <h6 class="text-primary mb-3">Gerenciamento de Cursos (Matrículas)</h6>
                                <p class="small text-muted mb-2">Marque os cursos para conceder acesso ou desmarque para remover (cancelar) o acesso do usuário.</p>
                                <div class="border p-3 rounded bg-light" style="max-height: 200px; overflow-y: auto;">
                                    ${htmlCursos}
                                </div>

                                <div class="d-flex justify-content-between align-items-center mt-4 border-top pt-3">
                                    <button type="button" class="btn btn-outline-danger" onclick="if(confirm('Tem certeza? Se o usuário tiver histórico, ele será apenas inativado.')) { document.getElementById('form-excluir-usuario').submit(); }">
                                        Excluir Usuário
                                    </button>
                                    
                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button type="submit" class="btn btn-primary px-4">Atualizar Usuário</button>
                                    </div>
                                </div>
                            </form>

                            <form id="form-excluir-usuario" action="/admin/usuarios/${usuario.id}/excluir" method="POST" style="display: none;"></form>
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

module.exports = renderEditarUsuarioView;