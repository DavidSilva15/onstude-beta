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
        <style>
            body { background-color: #f8f9fa; overflow: hidden; height: 100vh; font-family: 'Segoe UI', sans-serif; }
            
            /* Estrutura Principal */
            .main-wrapper { display: flex; height: 100vh; width: 100vw; }
            .content-area { flex-grow: 1; overflow-y: auto; background-color: #f3f4f6; padding-bottom: 50px; }
            
            /* Scrollbar Customizada */
            .content-area::-webkit-scrollbar { width: 6px; }
            .content-area::-webkit-scrollbar-thumb { background-color: #ced4da; border-radius: 10px; }

            /* Inputs Padrão OnStude */
            .input-group-custom {
                background-color: #f8f9fa;
                border-radius: 14px;
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
                padding: 0.8rem 1.2rem;
                font-size: 0.95rem;
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
                body { overflow: auto; height: auto; }
                .main-wrapper { flex-direction: column; height: auto; }
                .content-area { height: auto; padding: 20px; }
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
                    
                    <div class="mb-4 d-flex align-items-center justify-content-between">
                        <div>
                            <h2 class="fw-bold text-dark mb-1">Meu Perfil</h2>
                            <p class="text-secondary">Atualize as suas informações pessoais e foto de exibição.</p>
                        </div>
                        <a href="/aluno" class="btn btn-outline-secondary rounded-pill fw-bold px-4 shadow-sm d-none d-md-block">
                            <i class="bi bi-arrow-left me-2"></i> Voltar ao Painel
                        </a>
                    </div>

                    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                        <div class="card-body p-4 p-md-5 bg-white">
                            <form action="/aluno/perfil" method="POST" enctype="multipart/form-data" id="formEditarPerfil">
                                
                                <div class="text-center mb-5">
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
                                    <p class="text-muted small mt-3">Tamanho recomendado: 500x500px (JPG ou PNG).</p>
                                </div>

                                <div class="row g-4">
                                    <div class="col-12">
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
                                        <small class="text-muted ms-1 mt-1 d-block" style="font-size: 0.75rem;">O e-mail não pode ser alterado.</small>
                                    </div>

                                    <div class="row g-4">
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold text-dark ms-1 small">Nova Senha</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="ps-3 text-muted"><i class="bi bi-shield-lock"></i></span>
                                                <input type="password" class="form-control form-control-custom flex-grow-1" id="nova_senha" name="nova_senha" placeholder="Mínimo 6 caracteres">
                                            </div>
                                            <small class="text-muted ms-1 mt-1 d-block" style="font-size: 0.75rem;">Deixe em branco para manter a atual.</small>
                                        </div>

                                        <div class="col-md-6">
                                            <label class="form-label fw-bold text-dark ms-1 small">Confirmar Nova Senha</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="ps-3 text-muted"><i class="bi bi-check2-circle"></i></span>
                                                <input type="password" class="form-control form-control-custom flex-grow-1" id="confirmar_senha" name="confirmar_senha" placeholder="Repita a nova senha">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-12 mt-5">
                                        <button type="submit" class="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm py-3 transition-all">
                                            <i class="bi bi-cloud-arrow-up me-2 fs-5"></i> Guardar Alterações
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            // Lógica do Loader Global
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

            // Preview de Imagem Dinâmico
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

            // Validação de senhas no Submit do Perfil
            document.getElementById('formEditarPerfil').addEventListener('submit', function(e) {
                const senha = document.getElementById('nova_senha').value;
                const confSenha = document.getElementById('confirmar_senha').value;
                
                if (senha !== '' && senha !== confSenha) {
                    e.preventDefault(); // Bloqueia o envio
                    alert('A confirmação de senha não coincide com a nova senha digitada.');
                    document.getElementById('confirmar_senha').focus();
                }
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAlunoEditarPerfilView;