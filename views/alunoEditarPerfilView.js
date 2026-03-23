// views/alunoEditarPerfilView.js

function renderAlunoEditarPerfilView(aluno) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Editar Perfil - OnStude</title>
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
        <nav class="navbar navbar-dark bg-primary shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-white" href="/aluno">OnStude</a>
                <a href="/aluno" class="btn btn-sm btn-outline-light">Voltar ao Painel</a>
            </div>
        </nav>

        <div class="container mt-5 mb-5">
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3">
                            <h5 class="mb-0 fw-bold text-secondary">Meu Perfil</h5>
                        </div>
                        <div class="card-body p-4">
                            <form action="/aluno/perfil" method="POST" enctype="multipart/form-data">
                                
                                <div class="mb-4 text-center">
                                    ${aluno.foto_perfil_url 
                                        ? `<img src="${aluno.foto_perfil_url}" class="rounded-circle mb-3 shadow" style="width: 100px; height: 100px; object-fit: cover;">` 
                                        : `<div class="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold shadow" style="width: 100px; height: 100px; font-size: 40px;">${aluno.nome.charAt(0).toUpperCase()}</div>`
                                    }
                                    <input type="file" class="form-control form-control-sm" name="foto_perfil" accept="image/*">
                                    <div class="form-text">Escolha uma nova imagem para atualizar sua foto.</div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Nome Completo</label>
                                    <input type="text" class="form-control" name="nome" value="${aluno.nome}" required>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold">Nova Senha</label>
                                    <input type="password" class="form-control" name="nova_senha" placeholder="Deixe em branco para não alterar">
                                </div>

                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary fw-bold">Salvar Alterações</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
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

module.exports = renderAlunoEditarPerfilView;