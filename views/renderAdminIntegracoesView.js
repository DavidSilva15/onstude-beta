// views/adminIntegracoesView.js

function renderAdminIntegracoesView(admin, config) {
    const statusBadge = config.status === 'ATIVO' 
        ? '<span class="badge bg-success rounded-pill"><i class="bi bi-check-circle-fill me-1"></i> Escutando (Ativo)</span>' 
        : '<span class="badge bg-danger rounded-pill"><i class="bi bi-x-circle-fill me-1"></i> Inativo</span>';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Integrações e API - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            .kpi-icon-box { width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 12px; }
            .bg-soft-primary { background-color: rgba(13, 110, 253, 0.1); color: #0d6efd; }
            pre { background-color: #212529; color: #f8f9fa; border-radius: 8px; padding: 15px; font-size: 0.85rem; }
        </style>
    </head>
    <body class="bg-light">
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando painel...</h5>
        </div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-primary" href="/admin">OnStude <span class="text-white fw-light">Admin</span></a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/admin">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/cursos">Cursos</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/usuarios">Usuários</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/notificacoes">Notificações</a></li>
                        <li class="nav-item"><a class="nav-link" href="/forum">Fórum</a></li>
                        <li class="nav-item"><a class="nav-link active fw-bold" href="/admin/integracoes">Integrações e API</a></li>
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
            </div>
        </nav>

        <div class="container mt-4 mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 class="fw-bold text-dark mb-0">Integrações & API</h3>
                    <p class="text-muted mb-0">Gira a comunicação do OnStude com plataformas externas.</p>
                </div>
                <span class="text-muted small"><i class="bi bi-hdd-network"></i> Conexões Seguras</span>
            </div>

            <div class="row">
                <div class="col-lg-8 mb-4">
                    <div class="card border-0 shadow-sm rounded-4 h-100 border-start border-primary border-4">
                        <div class="card-header bg-white p-4 border-bottom-0 d-flex justify-content-between align-items-center">
                            <h5 class="fw-bold text-dark mb-0 d-flex align-items-center">
                                <div class="kpi-icon-box bg-soft-primary me-3"><i class="bi bi-briefcase-fill fs-4"></i></div>
                                Receptor de Vagas Externas
                            </h5>
                            ${statusBadge}
                        </div>
                        <div class="card-body p-4 pt-0">
                            <p class="text-secondary mb-4">
                                Utilize as credenciais abaixo na sua futura aplicação Node.js (ex: Sistema de Vagas) para que as oportunidades de emprego sejam enviadas automaticamente para o sino de notificações dos alunos do OnStude.
                            </p>

                            <div class="mb-3">
                                <label class="form-label fw-bold text-dark small">URL do Webhook (POST)</label>
                                <div class="input-group shadow-sm">
                                    <input type="text" class="form-control bg-light" value="${config.webhookUrl}" readonly id="webhookUrl">
                                    <button class="btn btn-outline-secondary bg-white fw-bold text-primary" type="button" onclick="copiarTexto('webhookUrl')">
                                        <i class="bi bi-copy"></i> Copiar
                                    </button>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label class="form-label fw-bold text-dark small">Chave de API (Header: x-api-key)</label>
                                <div class="input-group shadow-sm">
                                    <input type="password" class="form-control bg-light" value="${config.apiKey}" readonly id="apiKey">
                                    <button class="btn btn-outline-secondary bg-white" type="button" onclick="mostrarSenha('apiKey')">
                                        <i class="bi bi-eye-fill"></i>
                                    </button>
                                    <button class="btn btn-outline-secondary bg-white fw-bold text-primary" type="button" onclick="copiarTexto('apiKey')">
                                        <i class="bi bi-copy"></i> Copiar
                                    </button>
                                </div>
                                <div class="form-text text-danger mt-2"><i class="bi bi-exclamation-triangle-fill"></i> Nunca partilhe esta chave publicamente. Ela permite criar notificações em massa na plataforma.</div>
                            </div>

                            <h6 class="fw-bold text-dark mb-2 mt-4"><i class="bi bi-braces text-primary me-2"></i>Formato do Payload (JSON Esperado)</h6>
                            <pre class="shadow-sm"><code>{
  "titulo": "Desenvolvedor Backend Junior (Node.js)",
  "mensagem": "Nova oportunidade remota aberta! Salário: R$ 3.500.",
  "link_url": "https://suafuturaplataforma.com/vaga/123",
  "imagem_url": "https://suafuturaplataforma.com/img/empresa_logo.png"
}</code></pre>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4 mb-4">
                    <div class="card border-0 shadow-sm rounded-4 bg-dark text-white h-100">
                        <div class="card-body p-4">
                            <h5 class="fw-bold mb-3 text-primary"><i class="bi bi-lightning-charge-fill me-2"></i>Como integrar?</h5>
                            <p class="small text-light opacity-75 mb-3">No seu futuro projeto Node.js (Ecocaixas), quando salvar uma vaga no banco de dados, adicione este trecho utilizando <code>axios</code> ou <code>fetch</code>:</p>
                            <pre class="bg-black border-0 p-3 mb-0 text-success shadow" style="font-size: 0.8rem;"><code>await axios.post(
  '${config.webhookUrl}', 
  {
    titulo: vaga.titulo,
    link_url: vaga.url
  },
  {
    headers: {
      'x-api-key': '${config.apiKey}'
    }
  }
);</code></pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            function copiarTexto(id) {
                var copyText = document.getElementById(id);
                // Temporariamente muda para texto se for senha
                const isPassword = copyText.type === 'password';
                if (isPassword) copyText.type = 'text';
                
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                navigator.clipboard.writeText(copyText.value);
                
                if (isPassword) copyText.type = 'password';
                
                // Feedback visual simples
                alert("Copiado para a área de transferência!");
            }

            function mostrarSenha(id) {
                var input = document.getElementById(id);
                var btn = event.currentTarget;
                if (input.type === "password") {
                    input.type = "text";
                    btn.innerHTML = '<i class="bi bi-eye-slash-fill"></i>';
                } else {
                    input.type = "password";
                    btn.innerHTML = '<i class="bi bi-eye-fill"></i>';
                }
            }

            // Loader Otimizado
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

module.exports = renderAdminIntegracoesView;