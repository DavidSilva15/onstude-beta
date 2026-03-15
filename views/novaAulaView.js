// views/novaAulaView.js

function renderNovaAulaView(admin, curso, modulo, proximaOrdem) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Aula - ${modulo.titulo}</title>
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
                        ? `<img src="${admin.foto_perfil_url}" alt="Foto de ${admin.nome}" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid #fff;">` 
                        : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold" style="width: 36px; height: 36px; border: 2px solid #fff; font-size: 14px;">${admin.nome.charAt(0).toUpperCase()}</div>`
                    }
                    <span class="text-light me-3">Olá, <strong>${admin.nome}</strong></span>
                    <a href="/logout" class="btn btn-outline-danger btn-sm">Sair</a>
                </div>
            </div>
        </nav>

        <div class="container mt-4">
            
            <nav aria-label="breadcrumb" class="mb-4">
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="/admin" class="text-decoration-none">Dashboard</a></li>
                    <li class="breadcrumb-item"><a href="/admin/cursos/${curso.id}" class="text-decoration-none">${curso.codigo_unico}</a></li>
                    <li class="breadcrumb-item active" aria-current="page">Nova Aula (Módulo ${modulo.ordem})</li>
                </ol>
            </nav>

            <div class="row justify-content-center">
                <div class="col-md-10">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold text-secondary">Adicionar Aula ao Módulo: ${modulo.titulo}</h5>
                            <a href="/admin/cursos/${curso.id}" class="btn btn-sm btn-outline-secondary">Cancelar</a>
                        </div>
                        <div class="card-body p-4">
                            <form action="/admin/modulos/${modulo.id}/aulas/nova" method="POST" enctype="multipart/form-data">
                                
                                <h6 class="text-primary mb-3">Informações Básicas</h6>
                                <div class="row">
                                    <div class="col-md-8 mb-3">
                                        <label for="titulo" class="form-label fw-semibold">Título da Aula <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="titulo" name="titulo" placeholder="Ex: Introdução ao Banco de Dados" required>
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="ordem" class="form-label fw-semibold">Ordem <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" id="ordem" name="ordem" value="${proximaOrdem}" min="1" required>
                                    </div>
                                    <div class="col-md-2 mb-3">
                                        <label for="duracao" class="form-label fw-semibold">Duração (Seg)</label>
                                        <input type="number" class="form-control" id="duracao" name="duracao_segundos" placeholder="Ex: 1200">
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label for="descricao" class="form-label fw-semibold">Descrição</label>
                                    <textarea class="form-control" id="descricao" name="descricao" rows="2"></textarea>
                                </div>

                                <hr>
                                <h6 class="text-primary mb-3">Conteúdos da Aula (Uploads)</h6>
                                
                                <div class="mb-3">
                                    <label for="video" class="form-label fw-semibold">Vídeo da Aula (.mp4)</label>
                                    <input type="file" class="form-control" id="video" name="video" accept="video/mp4,video/x-m4v,video/*">
                                </div>

                                <div class="mb-3">
                                    <label for="apostila" class="form-label fw-semibold">Imagens da Apostila</label>
                                    <input type="file" class="form-control" id="apostila" name="apostila" accept="image/*" multiple>
                                    <div class="form-text">Pode selecionar múltiplas imagens segurando o CTRL (ou CMD no Mac). Elas serão salvas na ordem de seleção.</div>
                                </div>

                                <div class="mb-4">
                                    <label for="avaliacao" class="form-label fw-semibold">Avaliação (.json)</label>
                                    <input type="file" class="form-control" id="avaliacao" name="avaliacao" accept="application/json">
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold text-dark"><i class="bi bi-file-earmark-zip-fill text-primary me-2"></i>Material Complementar (Opcional)</label>
                                    <input type="file" class="form-control" name="arquivo_adicional" accept=".zip,.rar">
                                </div>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <a href="/admin/cursos/${curso.id}" class="btn btn-light me-md-2">Cancelar</a>
                                    <button type="submit" class="btn btn-success px-4">Salvar Aula e Conteúdos</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

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

module.exports = renderNovaAulaView;