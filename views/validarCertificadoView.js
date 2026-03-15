// views/validarCertificadoView.js

function renderValidarCertificadoView(resultado, tokenBuscado) {
    let htmlResultado = '';

    if (resultado) {
        if (resultado.error) {
            htmlResultado = `
                <div class="alert alert-danger text-center mt-5 shadow-sm" role="alert">
                    <h4 class="alert-heading fw-bold mb-2">❌ Certificado Não Encontrado</h4>
                    <p class="mb-0">O código de validação <strong>${tokenBuscado}</strong> não existe em nossa base de dados ou é inválido.</p>
                </div>
            `;
        } else if (resultado.status === 'PENDENTE') {
            htmlResultado = `
                <div class="card border-warning mt-5 shadow-sm">
                    <div class="card-header bg-warning text-dark fw-bold text-center py-3">
                        ⏳ Curso em Andamento
                    </div>
                    <div class="card-body p-4 text-center">
                        <h4 class="text-dark fw-bold">${resultado.aluno_nome}</h4>
                        <p class="text-muted mb-4">Matriculado no curso: <strong>${resultado.curso_titulo}</strong></p>
                        
                        <div class="position-relative mx-auto bg-dark overflow-hidden rounded border" style="max-width: 600px; aspect-ratio: 1.41 / 1;">
                            <img src="${resultado.template_url}" class="w-100 h-100" style="object-fit: cover; opacity: 0.3; filter: blur(3px);" alt="Template Bloqueado">
                            <div class="position-absolute top-50 start-50 translate-middle text-center">
                                <span style="font-size: 4rem;">🔒</span>
                                <p class="text-white fw-bold mt-2">Certificado Bloqueado<br><small class="fw-normal">Aguardando a conclusão do curso</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (resultado.status === 'CONCLUIDO') {
            htmlResultado = `
                <div class="card border-success mt-5 shadow-sm">
                    <div class="card-header bg-success text-white fw-bold text-center py-3">
                        ✅ Certificado Autêntico e Válido
                    </div>
                    <div class="card-body p-4 p-md-5">
                        <div class="row align-items-center">
                            <div class="col-md-5 text-center text-md-start mb-4 mb-md-0">
                                <h2 class="text-dark fw-bold mb-1">${resultado.aluno_nome}</h2>
                                <p class="text-muted mb-4 fs-5">Concluiu o curso <strong>${resultado.curso_titulo}</strong></p>
                                
                                <ul class="list-group list-group-flush border-top border-bottom mb-4">
                                    <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3">
                                        <span class="text-secondary fw-semibold">Data de Conclusão:</span>
                                        <span class="fw-bold text-dark">${resultado.data_conclusao}</span>
                                    </li>
                                    <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3">
                                        <span class="text-secondary fw-semibold">Média Final (Avaliações):</span>
                                        <span class="badge bg-primary fs-6">${resultado.media_notas} / 10.0</span>
                                    </li>
                                    <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center px-0 py-3">
                                        <span class="text-secondary fw-semibold">Código de Verificação:</span>
                                        <span class="fw-bold text-dark font-monospace">${resultado.token}</span>
                                    </li>
                                </ul>
                            </div>
                            
                            <div class="col-md-7">
                                <div class="position-relative mx-auto border rounded shadow" style="max-width: 100%; aspect-ratio: 1.41 / 1; background: #fff; overflow: hidden;">
                                    <img src="${resultado.template_url}" class="w-100 h-100 position-absolute top-0 start-0" style="object-fit: cover;" alt="Certificado">
                                    <div class="position-absolute w-100 text-center" style="top: 40%;">
                                        <h2 class="fw-bold text-dark" style="font-family: serif; text-shadow: 1px 1px 0px #fff;">${resultado.aluno_nome}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validar Certificado - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f0f2f5; min-height: 100vh; display: flex; flex-direction: column; }
            .header-public { background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); color: white; padding: 4rem 0 2rem 0; }
        </style>
    </head>
    <body>
    <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
    <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
        <span class="visually-hidden">Carregando...</span>
    </div>
    <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
</div>

        <nav class="navbar navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary mx-auto mx-md-0" href="/">OnStude</a>
                <a href="/" class="btn btn-sm btn-outline-light d-none d-md-block">Acessar Plataforma</a>
            </div>
        </nav>

        <header class="header-public text-center">
            <div class="container">
                <h1 class="fw-bold mb-3">Validação de Certificados</h1>
                <p class="fs-5 opacity-75 mx-auto" style="max-width: 600px;">Verifique a autenticidade dos certificados emitidos pela nossa plataforma informando o código exclusivo de 8 dígitos.</p>
            </div>
        </header>

        <main class="container flex-grow-1" style="margin-top: -30px;">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow border-0 rounded-4">
                        <div class="card-body p-4 p-md-5">
                            <form action="/validar" method="GET" class="d-flex flex-column flex-md-row gap-3">
                                <div class="flex-grow-1">
                                    <label for="tokenInput" class="visually-hidden">Código do Certificado</label>
                                    <input type="text" class="form-control form-control-lg bg-light text-center text-md-start text-uppercase fw-bold" id="tokenInput" name="token" value="${tokenBuscado || ''}" placeholder="Ex: A1B2C3D4" maxlength="8" required style="letter-spacing: 2px;">
                                </div>
                                <button type="submit" class="btn btn-primary btn-lg px-5 fw-bold shadow-sm">Validar Documento</button>
                            </form>
                        </div>
                    </div>

                    ${htmlResultado}
                </div>
            </div>
        </main>

        <footer class="bg-dark text-white text-center py-4 mt-5">
            <div class="container">
                <p class="mb-0 text-muted small">&copy; ${new Date().getFullYear()} OnStude. Todos os direitos reservados.</p>
            </div>
        </footer>

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

module.exports = renderValidarCertificadoView;