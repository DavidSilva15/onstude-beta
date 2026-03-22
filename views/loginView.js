// views/loginView.js

function renderLoginView(erro = null, returnTo = '') {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OnStude - Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body class="bg-light d-flex align-items-center justify-content-center" style="height: 100vh;">
    <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
        <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
            <span class="visually-hidden">Carregando...</span>
        </div>
        <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
    </div>

        <div class="card shadow p-4" style="width: 100%; max-width: 400px;">
            <div class="text-center mb-4">
                <h2 class="text-primary fw-bold">OnStude</h2>
                ${erro ? `<span id="errorBadge" class="badge bg-danger mb-2 px-3 py-2" style="font-size: 0.85rem; transition: opacity 0.5s ease;">${erro}</span>` : ''}
                <p class="text-muted mb-0">Acesse a sua conta</p>
            </div>

            <form action="/login" method="POST">

                <input type="hidden" name="returnTo" value="${returnTo}">
                
                <div class="mb-3">
                    <label for="email" class="form-label">E-mail</label>
                    <input type="email" class="form-control" id="email" name="email" placeholder="nome@email.com" required>
                </div>
                <div class="mb-3">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" placeholder="Sua senha" required>
                </div>
                
                <div class="d-grid gap-2 mt-4">
                    <button type="submit" class="btn btn-primary btn-lg">Entrar</button>
                </div>
            </form>

            <div class="text-center mt-3">
                <small>Não tem uma conta? <a href="/cadastro" class="text-decoration-none">Cadastre-se aqui</a>.</small>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        ${erro ? `
        <script>
            // Faz o badge sumir suavemente após 3 segundos
            setTimeout(function() {
                const badge = document.getElementById('errorBadge');
                if (badge) {
                    badge.style.opacity = '0'; // Inicia o fade out
                    setTimeout(() => badge.remove(), 500); // Remove do HTML após a transição
                }
            }, 3000);
        </script>
        ` : ''}

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

module.exports = renderLoginView;