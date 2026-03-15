// views/novoModuloView.js

function renderNovoModuloView(admin, curso, proximaOrdem) {
    return `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Novo Módulo - ${curso.codigo_unico}</title>
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
                    <li class="breadcrumb-item active" aria-current="page">Novo Módulo</li>
                </ol>
            </nav>

            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold text-secondary">Adicionar Módulo ao Curso</h5>
                            <a href="/admin/cursos/${curso.id}" class="btn btn-sm btn-outline-secondary">Cancelar</a>
                        </div>
                        <div class="card-body p-4">
                            <form action="/admin/cursos/${curso.id}/modulos/novo" method="POST">
                                
                                <div class="row">
                                    <div class="col-md-9 mb-3">
                                        <label for="titulo" class="form-label fw-semibold">Título do Módulo <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="titulo" name="titulo" placeholder="Ex: Introdução e Configuração" required>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label for="ordem" class="form-label fw-semibold">Ordem <span class="text-danger">*</span></label>
                                        <input type="number" class="form-control" id="ordem" name="ordem" value="${proximaOrdem}" min="1" required>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label for="descricao" class="form-label fw-semibold">Descrição do Módulo</label>
                                    <textarea class="form-control" id="descricao" name="descricao" rows="3" placeholder="Opcional. Breve resumo do que será abordado neste módulo."></textarea>
                                </div>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <a href="/admin/cursos/${curso.id}" class="btn btn-light me-md-2">Cancelar</a>
                                    <button type="submit" class="btn btn-success px-4">Salvar Módulo</button>
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

module.exports = renderNovoModuloView;