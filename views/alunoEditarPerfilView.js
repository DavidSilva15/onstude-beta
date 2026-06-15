// views/alunoEditarPerfilView.js
const renderAlunoMenuLateral = require('./alunoMenuLateral');

function renderAlunoEditarPerfilView(aluno) {
    // Integração do Menu Lateral Modular
    const menuLateral = renderAlunoMenuLateral(aluno, 'perfil');

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Editar Perfil - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <link rel="icon" type="image/x-icon" href="/img/favicon-onstude.ico">
        <link rel="shortcut icon" type="image/x-icon" href="/img/favicon-onstude.ico">
        <style>
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #212529; background-color: #f8f9fa; margin: 0; overflow-x: hidden; position: relative; }
            
            /* Estrutura Principal Corrigida e Harmonizada */
            .main-wrapper { display: flex; flex-direction: row; width: 100vw; }
            .content-area { flex-grow: 1; height: 100vh; overflow-y: auto; background-color: #f3f4f6; padding-bottom: 50px; }
            
            /* Scrollbar Customizada */
            .content-area::-webkit-scrollbar { width: 6px; }
            .content-area::-webkit-scrollbar-thumb { background-color: #ced4da; border-radius: 10px; }

            /* Inputs Compactos OnStude */
            .input-group-custom {
                background-color: #f8f9fa;
                border-radius: 10px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            .input-group-custom:focus-within {
                border-color: #0d6efd;
                background-color: #ffffff;
                box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1);
            }
            .form-control-custom {
                border: none;
                background: transparent;
                padding: 0.5rem 1rem;
                font-size: 0.9rem;
            }
            .form-control-custom:focus { box-shadow: none; background: transparent; }

            /* Preview da Foto */
            .avatar-upload-container {
                position: relative;
                display: inline-block;
            }
            .avatar-preview {
                width: 140px;
                height: 140px;
                object-fit: cover;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .btn-camera-float {
                position: absolute;
                bottom: 5px;
                right: 5px;
                width: 38px;
                height: 38px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 3px solid white;
            }

            @media (max-width: 991.98px) {
                .main-wrapper { flex-direction: column; }
                .content-area { height: calc(100vh - 60px); padding: 20px; }
            }

            /* ==========================================
               RESPONSIVIDADE EXTREMA (MOBILE)
               ========================================== */
            @media (max-width: 767.98px) {
                .content-area { padding: 15px 0 0 0 !important; background-color: #ffffff; }
                .container-fluid { padding-left: 0 !important; padding-right: 0 !important; }
                
                .header-mobile-wrapper { padding: 0 1.5rem; margin-bottom: 1rem !important; }
                .header-mobile-wrapper h2 { font-size: 1.6rem; }
                .header-mobile-wrapper p { font-size: 0.85rem; margin-bottom: 0; }

                .card { border-radius: 0 !important; box-shadow: none !important; border: none !important; }
                .card-body { padding: 1.5rem 1.5rem !important; }

                .form-label { font-size: 0.8rem !important; margin-bottom: 0.2rem !important; }
                
                .form-control-custom {
                    padding: 0.45rem 0.8rem;
                    font-size: 0.85rem;
                }
                .input-group-text-custom {
                    padding-left: 0.8rem;
                    font-size: 0.85rem;
                }
                .input-group-custom { border-radius: 10px; }

                .row.g-3 { --bs-gutter-y: 1rem; --bs-gutter-x: 1rem; }
                .mb-5 { margin-bottom: 1.5rem !important; }
                
                .avatar-preview { width: 100px; height: 100px; font-size: 40px !important; }
                .btn-camera-float { width: 32px; height: 32px; bottom: 0; right: 0; }
                .btn-camera-float i { font-size: 0.9rem; }
                
                .action-buttons-wrapper { flex-direction: column-reverse; }
                .action-buttons-wrapper .btn { width: 100%; margin-bottom: 0.5rem; }
            }
        </style>
    </head>
    <body>
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div class="main-wrapper">
            ${menuLateral}

            <main class="content-area p-4 p-lg-5">
                <div class="container-fluid" style="max-width: 850px;">
                    
                    <div class="mb-4 d-flex align-items-center justify-content-between header-mobile-wrapper">
                        <div>
                            <h2 class="fw-bold text-dark mb-1">Meu Perfil</h2>
                            <p class="text-secondary">Atualize as suas informações pessoais e foto de exibição.</p>
                        </div>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="card-body p-4 p-md-5 bg-white">
                            <form action="/aluno/perfil" method="POST" enctype="multipart/form-data" id="formEditarPerfil">
                                
                                <div class="text-center mb-4">
                                    <div class="avatar-upload-container">
                                        <div id="imagePreviewWrapper">
                                            ${aluno.foto_perfil_url 
                                                ? `<img src="${aluno.foto_perfil_url}" class="avatar-preview" id="imgPreview">` 
                                                : `<div class="avatar-preview bg-primary text-white d-flex align-items-center justify-content-center fw-bold shadow" style="font-size: 50px;" id="divPreview">${aluno.nome.charAt(0).toUpperCase()}</div>`
                                            }
                                        </div>
                                        <label for="foto_perfil" class="btn btn-primary btn-camera-float rounded-circle shadow-sm" title="Alterar Foto">
                                            <i class="bi bi-camera-fill"></i>
                                            <input type="file" id="foto_perfil" name="foto_perfil" accept="image/*" class="d-none">
                                        </label>
                                    </div>
                                    <p class="text-muted small mt-2 mb-0">Tamanho recomendado: 500x500px (JPG ou PNG).</p>
                                </div>

                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark ms-1 small">Nome Completo</label>
                                        <div class="input-group-custom d-flex align-items-center">
                                            <span class="ps-3 text-muted"><i class="bi bi-person fs-5"></i></span>
                                            <input type="text" class="form-control form-control-custom flex-grow-1" name="nome" value="${aluno.nome}" required placeholder="Seu nome completo">
                                        </div>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-secondary ms-1 small">E-mail (Login)</label>
                                        <div class="input-group-custom d-flex align-items-center bg-light opacity-75">
                                            <span class="ps-3 text-muted"><i class="bi bi-envelope fs-5"></i></span>
                                            <input type="email" class="form-control form-control-custom" value="${aluno.email}" disabled>
                                        </div>
                                        <small class="text-muted ms-1 mt-1 d-block" style="font-size: 0.75rem; line-height: 1;">O e-mail não pode ser alterado.</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark ms-1 small">Nova Senha</label>
                                        <div class="input-group-custom d-flex align-items-center">
                                            <span class="ps-3 text-muted"><i class="bi bi-lock fs-5"></i></span>
                                            <input type="password" class="form-control form-control-custom flex-grow-1" id="nova_senha" name="nova_senha" placeholder="Mínimo 6 caracteres">
                                            <button type="button" class="btn border-0 text-secondary shadow-none px-3 py-0" onclick="togglePassword('nova_senha', this)" title="Mostrar senha">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                        </div>
                                        <small class="text-muted ms-1 mt-1 d-block" style="font-size: 0.75rem; line-height: 1;">Deixe em branco para manter a atual.</small>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label fw-bold text-dark ms-1 small">Confirmar Nova Senha</label>
                                        <div class="input-group-custom d-flex align-items-center">
                                            <span class="ps-3 text-muted"><i class="bi bi-check2-circle fs-5"></i></span>
                                            <input type="password" class="form-control form-control-custom flex-grow-1" id="confirmar_senha" name="confirmar_senha" placeholder="Repita a nova senha">
                                            <button type="button" class="btn border-0 text-secondary shadow-none px-3 py-0" onclick="togglePassword('confirmar_senha', this)" title="Mostrar senha">
                                                <i class="bi bi-eye"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div class="col-12 mt-4 pt-3 border-top border-secondary border-opacity-10">
                                        <div class="d-flex justify-content-end gap-2 action-buttons-wrapper">
                                            <a href="/aluno" class="btn btn-outline-secondary rounded-pill fw-bold px-4 py-2 shadow-sm d-flex align-items-center justify-content-center">
                                                <i class="bi bi-arrow-left me-2"></i> Voltar ao Painel
                                            </a>
                                            <button type="submit" class="btn btn-primary rounded-pill fw-bold px-4 py-2 shadow-sm transition-all d-flex align-items-center justify-content-center">
                                                <i class="bi bi-cloud-arrow-up me-2 fs-5"></i> Guardar Alterações
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script src="/js/toast.js"></script>

        <script>
            window.togglePassword = function(inputId, button) {
                const input = document.getElementById(inputId);
                const icon = button.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('bi-eye', 'bi-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('bi-eye-slash', 'bi-eye');
                }
            };

            window.addEventListener('pageshow', function(event) {
                const loader = document.getElementById('globalLoader');
                if (loader) {
                    if (event.persisted) {
                        loader.style.display = 'none';
                    } else {
                        loader.style.opacity = '0';
                        setTimeout(() => { loader.style.display = 'none'; }, 400);
                    }
                }
            });

            window.addEventListener('beforeunload', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) { loader.style.display = 'flex'; loader.style.opacity = '1'; }
            });

            document.getElementById('foto_perfil').addEventListener('change', function(e) {
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        const wrapper = document.getElementById('imagePreviewWrapper');
                        wrapper.innerHTML = \`<img src="\${event.target.result}" class="avatar-preview">\`;
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });

            document.getElementById('formEditarPerfil').addEventListener('submit', function(e) {
                e.preventDefault(); 
                
                const senha = document.getElementById('nova_senha').value;
                const confSenha = document.getElementById('confirmar_senha').value;
                
                if (senha !== '' && senha !== confSenha) {
                    Toast.error('As senhas não coincidem. Por favor, verifique.');
                    document.getElementById('confirmar_senha').focus();
                    return;
                }

                const btnSubmit = this.querySelector('button[type="submit"]');
                const originalHtml = btnSubmit.innerHTML;
                
                btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Guardando...';
                btnSubmit.disabled = true;

                const formData = new FormData(this);

                fetch(this.action, {
                    method: 'POST',
                    body: formData
                })
                .then(async res => {
                    const contentType = res.headers.get("content-type");
                    
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const data = await res.json();
                        if (data.success) {
                            Toast.success(data.message || 'Perfil atualizado com sucesso!');
                            setTimeout(() => window.location.reload(), 1500);
                        } else {
                            Toast.error(data.message || 'Erro ao atualizar perfil.');
                            btnSubmit.innerHTML = originalHtml;
                            btnSubmit.disabled = false;
                        }
                    } else {
                        if (res.redirected) {
                            Toast.success('Perfil atualizado com sucesso!');
                            setTimeout(() => window.location.href = res.url, 1500);
                        } else {
                            Toast.error('Ocorreu um erro inesperado.');
                            btnSubmit.innerHTML = originalHtml;
                            btnSubmit.disabled = false;
                        }
                    }
                })
                .catch(err => {
                    console.error('Erro de conexão:', err);
                    Toast.error('Erro de conexão ao salvar perfil.');
                    btnSubmit.innerHTML = originalHtml;
                    btnSubmit.disabled = false;
                });
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAlunoEditarPerfilView;