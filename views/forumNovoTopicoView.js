// views/forumNovoTopicoView.js

function renderForumNovoTopicoView(usuarioLogado, cursos) {
    const linkPainel = usuarioLogado.tipo === 'ADMIN' ? '/admin' : '/aluno';

    // Monta as opções de cursos de forma dinâmica
    let opcoesCursos = '';
    if (cursos && cursos.length > 0) {
        opcoesCursos = `<optgroup label="Cursos Específicos">`;
        cursos.forEach(c => {
            opcoesCursos += `<option value="Curso: ${c.titulo}">${c.titulo}</option>`;
        });
        opcoesCursos += `</optgroup>`;
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Pergunta - Fórum OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            
            .navbar-custom { background-color: #ffffff; border-bottom: 1px solid #eaeaea; }
            .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important; transform: translateY(-2px); transition: all .3s ease; }
            .transition-all { transition: all .3s ease; }
            .transition-all:active { transform: scale(0.98); }

            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background-color: #ced4da; border-radius: 10px; }

            /* Inputs Padrão OnStude */
            .input-group-custom {
                background-color: #ffffff;
                border-radius: 14px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            .input-group-custom:focus-within {
                border-color: #0d6efd;
                box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
            }
            .form-control-custom {
                border: none;
                background: transparent;
                padding: 0.8rem 1.2rem 0.8rem 0.5rem;
                font-size: 0.95rem;
                color: #212529;
            }
            .form-control-custom:focus { box-shadow: none; background: transparent; outline: none; }
            
            /* ==========================================
               RESPONSIVIDADE EXTREMA (MOBILE)
               ========================================== */
            @media (max-width: 991.98px) {
                .container { max-width: 100%; padding-left: 15px; padding-right: 15px; }
            }

            @media (max-width: 767.98px) {
                .mobile-no-px { padding-left: 0 !important; padding-right: 0 !important; }
                
                .topic-main-card { 
                    border-radius: 0 !important; 
                    margin-bottom: 0 !important; 
                    box-shadow: none !important; 
                    border-left: none !important; 
                    border-right: none !important; 
                    border-bottom: 1px solid #eaeaea !important; 
                    border-top: 1px solid #eaeaea !important;
                }
                
                .card-body { padding: 1.5rem 1.25rem !important; }
                .card-header { padding: 1.5rem 1.25rem 0 1.25rem !important; border-bottom: none !important; }
                
                h2, .offcanvas-title { font-size: 1.4rem; }
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

        <nav class="navbar navbar-expand-lg navbar-custom sticky-top py-3 shadow-sm z-3">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary fs-4 d-flex align-items-center" href="/forum">
                    <i class="bi bi-chat-square-dots-fill me-2"></i> OnStude<span class="text-dark">.</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 ms-2 fs-6 rounded-pill fw-normal d-none d-sm-inline-block">Fórum</span>
                </a>
                <div class="d-flex ms-auto gap-2">
                    <a href="/forum" class="btn btn-outline-secondary btn-sm rounded-pill fw-semibold px-3 d-none d-sm-block">
                        <i class="bi bi-x-lg"></i> Cancelar
                    </a>
                    <a href="${linkPainel}" class="btn btn-primary btn-sm rounded-pill fw-bold px-3">
                        Meu Painel
                    </a>
                </div>
            </div>
        </nav>

        <div class="container mt-4 mt-lg-5 mb-5 mobile-no-px">
            <div class="row justify-content-center px-0 px-md-3">
                <div class="col-lg-8 mobile-no-px">
                    
                    <div class="d-block d-sm-none mb-3 px-3">
                        <a href="/forum" class="text-decoration-none text-muted fw-semibold">
                            <i class="bi bi-arrow-left me-1"></i> Voltar ao Fórum
                        </a>
                    </div>

                    <div class="card shadow-sm border-0 mb-4 overflow-hidden rounded-4 topic-main-card">
                        <div class="card-header bg-white border-bottom-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                            <div>
                                <h3 class="fw-bold text-dark mb-1">Publicar Nova Dúvida</h3>
                                <p class="text-muted small mb-0">Descreva o seu problema detalhadamente para a comunidade ajudar.</p>
                            </div>
                        </div>
                        
                        <div class="card-body p-4">
                            <form action="/forum/novo" method="POST" enctype="multipart/form-data">
                                
                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark ms-1 small">Título da Pergunta <span class="text-danger">*</span></label>
                                    <div class="input-group-custom d-flex align-items-center">
                                        <span class="ps-3 text-muted"><i class="bi bi-type-h1 fs-5"></i></span>
                                        <input type="text" class="form-control form-control-custom flex-grow-1" name="titulo" placeholder="Ex: Como centralizar uma div usando Bootstrap 5?" required>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark ms-1 small">Categoria / Curso Relacionado <span class="text-danger">*</span></label>
                                    <div class="input-group-custom d-flex align-items-center pe-2">
                                        <span class="ps-3 text-muted"><i class="bi bi-tag fs-5"></i></span>
                                        <select class="form-select form-control-custom bg-transparent border-0 flex-grow-1 shadow-none" name="categoria" style="cursor: pointer;" required>
                                            <optgroup label="Tópicos Gerais">
                                                <option value="Geral">Geral / Outros</option>
                                                <option value="Dúvida Técnica">Dúvida Técnica (Código)</option>
                                                <option value="Plataforma">Uso da Plataforma</option>
                                                <option value="Carreira">Mercado e Carreira</option>
                                            </optgroup>
                                            ${opcoesCursos}
                                        </select>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-bold text-dark ms-1 small">Explique sua dúvida com detalhes <span class="text-danger">*</span></label>
                                    <textarea class="form-control bg-light rounded-4 border-light p-3 text-dark shadow-none focus-ring focus-ring-primary" name="conteudo" rows="8" placeholder="Escreva o que está a tentar fazer, o que já tentou e qual erro apareceu..." required style="resize: none; font-size: 0.95rem;"></textarea>
                                </div>

                                <div class="mb-5 p-3 p-md-4 bg-light border border-light rounded-4">
                                    <label class="form-label fw-bold text-secondary mb-3 d-flex align-items-center">
                                        <i class="bi bi-image me-2 fs-5 text-primary"></i> Anexar Print (Opcional)
                                    </label>
                                    <div class="input-group">
                                        <span class="input-group-text bg-white border-0 text-muted rounded-start-pill ps-4 pe-2"><i class="bi bi-upload"></i></span>
                                        <input type="file" class="form-control bg-white border-0 rounded-end-pill py-2 shadow-none" name="print_imagem" accept="image/*">
                                    </div>
                                    <div class="form-text mt-3 ms-2 text-muted" style="font-size: 0.8rem;">
                                        Uma imagem vale mais que mil palavras! Anexe a tela do erro ou o código que está a falhar.
                                    </div>
                                </div>

                                <div class="d-grid mt-2">
                                    <button type="submit" class="btn btn-primary btn-lg rounded-pill fw-bold shadow-sm transition-all py-3 d-flex justify-content-center align-items-center">
                                        Publicar Pergunta <i class="bi bi-send ms-2"></i>
                                    </button>
                                </div>
                                
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            // Lógica do Loader Global
            window.addEventListener('pageshow', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 400); }
            });
            window.addEventListener('beforeunload', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) { loader.style.display = 'flex'; setTimeout(() => loader.style.opacity = '1', 10); }
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderForumNovoTopicoView;