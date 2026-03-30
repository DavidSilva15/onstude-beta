// views/forumTopicoView.js

function renderForumTopicoView(usuarioLogado, topico, respostas) {
    const dataTopico = new Date(topico.criado_em).toLocaleString('pt-BR');
    
    const avatarTopico = topico.foto_perfil_url 
        ? `<img src="${topico.foto_perfil_url}" class="rounded-circle shadow-sm border border-2 border-white avatar-main" style="width: 65px; height: 65px; object-fit: cover;">` 
        : `<div class="rounded-circle mx-auto d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm border border-2 border-white avatar-main" style="width: 65px; height: 65px; font-size: 1.5rem;">${topico.autor_nome.charAt(0).toUpperCase()}</div>`;
    
    // Badges do Autor da Pergunta
    const tipoBadgeTopico = topico.autor_tipo === 'ADMIN' 
        ? '<span class="badge bg-danger ms-2 px-2 py-1" style="font-size: 0.7rem;">Equipa OnStude</span>' 
        : '<span class="badge bg-secondary bg-opacity-25 text-dark border ms-2 px-2 py-1" style="font-size: 0.7rem;">Aluno</span>';
    
    const statsTopico = topico.autor_tipo === 'ALUNO' ? `
        <div class="d-flex flex-wrap align-items-center gap-2 mt-2 mb-3" style="font-size: 0.8rem;">
            ${topico.nota_media ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2 py-1" title="Média de Notas">⭐ ${topico.nota_media}</span>` : ''}
            ${topico.melhor_curso ? `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 text-truncate rounded-pill px-2 py-1" style="max-width: 200px;" title="Melhor Desempenho">🏆 ${topico.melhor_curso}</span>` : ''}
        </div>
    ` : '<div class="mb-3"></div>';

    const imgTopicoHTML = topico.imagem_url ? `
        <div class="mt-4 text-center text-sm-start">
            <a href="${topico.imagem_url}" target="_blank" class="d-inline-block position-relative hover-shadow transition rounded overflow-hidden">
                <img src="${topico.imagem_url}" class="img-fluid border shadow-sm" style="max-height: 400px;" alt="Print do erro">
                <div class="position-absolute top-0 end-0 bg-dark bg-opacity-75 text-white p-2 rounded-bottom-start shadow-sm" title="Ampliar Imagem">
                    <i class="bi bi-arrows-fullscreen"></i>
                </div>
            </a>
        </div>
    ` : '';

    let htmlRespostas = '';
    if (respostas.length === 0) {
        htmlRespostas = `
            <div class="text-center py-5 bg-white border border-light rounded-4 shadow-sm mb-4 mx-3 mx-md-0">
                <i class="bi bi-chat-left-dots fs-1 text-muted opacity-25 mb-3 d-block"></i>
                <h5 class="text-dark fw-bold mb-2">Ainda não há respostas</h5>
                <p class="text-muted mb-0">Sabe a solução? Seja o primeiro a ajudar o colega!</p>
            </div>
        `;
    } else {
        respostas.forEach(r => {
            const dataResp = new Date(r.criado_em).toLocaleString('pt-BR');
            const avatarResp = r.foto_perfil_url 
                ? `<img src="${r.foto_perfil_url}" class="rounded-circle shadow-sm border border-2 border-white avatar-resp" style="width: 50px; height: 50px; object-fit: cover;">` 
                : `<div class="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white fw-bold shadow-sm border border-2 border-white avatar-resp" style="width: 50px; height: 50px; font-size: 1.2rem;">${r.autor_nome.charAt(0).toUpperCase()}</div>`;
            
            // Badges de QUEM RESPONDEU
            const tipoBadgeResp = r.autor_tipo === 'ADMIN' 
                ? '<span class="badge bg-danger ms-2 px-2 py-1" style="font-size: 0.65rem;">Equipa</span>' 
                : '<span class="badge bg-secondary bg-opacity-25 text-dark border ms-2 px-2 py-1" style="font-size: 0.65rem;">Aluno</span>';
            
            const statsResp = r.autor_tipo === 'ALUNO' ? `
                <div class="d-flex flex-wrap align-items-center gap-2 mt-1 mb-2" style="font-size: 0.75rem;">
                    ${r.nota_media ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill px-2" title="Média de Notas">⭐ ${r.nota_media}</span>` : ''}
                    ${r.melhor_curso ? `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 text-truncate rounded-pill px-2" style="max-width: 200px;" title="Melhor Desempenho">🏆 ${r.melhor_curso}</span>` : ''}
                </div>
            ` : '';

            const imgRespHTML = r.imagem_url ? `
                <div class="mt-3">
                    <a href="${r.imagem_url}" target="_blank" class="d-inline-block hover-shadow transition rounded overflow-hidden">
                        <img src="${r.imagem_url}" class="img-fluid border shadow-sm" style="max-height: 300px;">
                    </a>
                </div>
            ` : '';
            
            const isSolucao = r.is_solucao ? `<div class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-50 rounded-pill mb-3 px-3 py-2 fs-6 shadow-sm"><i class="bi bi-check-circle-fill me-2"></i>Solução Aceite</div>` : '';
            const corBorda = r.is_solucao ? 'border-success border-3' : 'border-0';

            htmlRespostas += `
                <div class="card shadow-sm ${corBorda} mb-3 rounded-4 response-card hover-shadow transition">
                    <div class="card-body p-4 d-flex flex-column flex-sm-row">
                        <div class="me-3 mb-3 mb-sm-0 text-start text-sm-center flex-shrink-0 d-flex flex-row flex-sm-column align-items-center">
                            ${avatarResp}
                            <div class="d-sm-none ms-3 text-start">
                                <h6 class="fw-bold mb-0 text-dark d-flex align-items-center flex-wrap">${r.autor_nome} ${tipoBadgeResp}</h6>
                                <small class="text-muted" style="font-size: 0.75rem;">${dataResp}</small>
                            </div>
                        </div>
                        <div class="flex-grow-1 overflow-hidden">
                            ${isSolucao}
                            <div class="d-none d-sm-flex justify-content-between align-items-start mb-1">
                                <div>
                                    <h6 class="fw-bold mb-0 text-dark d-flex align-items-center flex-wrap">${r.autor_nome} ${tipoBadgeResp}</h6>
                                    <small class="text-muted" style="font-size: 0.75rem;">${dataResp}</small>
                                </div>
                            </div>
                            ${statsResp}
                            <div class="text-dark mt-2" style="white-space: pre-wrap; font-size: 0.95rem; line-height: 1.6;">${r.conteudo}</div>
                            ${imgRespHTML}
                        </div>
                    </div>
                </div>
            `;
        });
    }

    let formRespostaHTML = '';
    if (usuarioLogado) {
        formRespostaHTML = `
            <div class="card shadow-sm border-0 border-start border-primary border-4 mt-5 rounded-4 reply-card">
                <div class="card-header bg-white border-bottom-0 pt-4 pb-2 px-4 px-md-5">
                    <h5 class="fw-bold text-dark mb-0"><i class="bi bi-reply-fill text-primary me-2"></i> Escrever Resposta</h5>
                </div>
                <div class="card-body p-4 p-md-5 pt-3">
                    <form action="/forum/topico/${topico.id}/responder" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <textarea class="form-control bg-light rounded-4 border-light p-3" name="conteudo" rows="4" placeholder="Escreva a sua solução ou comentário aqui..." required style="resize: none;"></textarea>
                        </div>
                        <div class="row align-items-center g-3">
                            <div class="col-md-7 col-lg-8">
                                <div class="input-group">
                                    <span class="input-group-text bg-light border-light text-muted rounded-start-pill"><i class="bi bi-image"></i></span>
                                    <input type="file" class="form-control bg-light border-light rounded-end-pill" name="print_imagem" accept="image/*">
                                </div>
                                <small class="text-muted ms-2 mt-1 d-block" style="font-size: 0.75rem;">Anexar print explicativo (opcional)</small>
                            </div>
                            <div class="col-md-5 col-lg-4 text-md-end">
                                <button type="submit" class="btn btn-primary fw-bold px-4 rounded-pill w-100 shadow-sm transition-all py-2">
                                    Enviar Resposta <i class="bi bi-send ms-1"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    } else {
        formRespostaHTML = `
            <div class="alert alert-primary bg-primary bg-opacity-10 border-0 text-center mt-5 shadow-sm rounded-4 py-5 px-3">
                <div class="mb-3"><i class="bi bi-lock-fill fs-1 text-primary opacity-50"></i></div>
                <h5 class="fw-bold text-dark">Quer ajudar a responder?</h5>
                <p class="mb-4 text-muted">É necessário estar logado na plataforma para interagir nos tópicos.</p>
                <a href="/login?returnTo=/forum/topico/${topico.id}" class="btn btn-primary fw-bold px-5 rounded-pill shadow-sm">Fazer Login</a>
            </div>
        `;
    }

    const linkPainel = usuarioLogado ? (usuarioLogado.tipo === 'ADMIN' ? '/admin' : '/aluno') : '/';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${topico.titulo} - Fórum OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f4f6f9; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            
            .navbar-custom { background-color: #ffffff; border-bottom: 1px solid #eaeaea; }
            .hover-shadow:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)!important; transform: translateY(-2px); transition: all .3s ease; }
            .transition { transition: all .3s ease; }
            .transition-all:active { transform: scale(0.98); }

            ::-webkit-scrollbar { width: 6px; }
            ::-webkit-scrollbar-thumb { background-color: #ced4da; border-radius: 10px; }

            /* ==========================================
               RESPONSIVIDADE EXTREMA (MOBILE)
               ========================================== */
            @media (max-width: 991.98px) {
                .container { max-width: 100%; padding-left: 15px; padding-right: 15px; }
            }

            @media (max-width: 767.98px) {
                .mobile-no-px { padding-left: 0 !important; padding-right: 0 !important; }
                
                .topic-main-card, .response-card, .reply-card { 
                    border-radius: 0 !important; 
                    margin-bottom: 0 !important; 
                    box-shadow: none !important; 
                    border-left: none !important; 
                    border-right: none !important; 
                    border-bottom: 1px solid #eaeaea !important; 
                }
                
                .topic-main-card { border-top: 1px solid #eaeaea !important; }
                .reply-card { border-top: 5px solid #0d6efd !important; border-bottom: none !important; margin-top: 2rem !important; }
                
                .card-body { padding: 1.25rem 1.25rem !important; }
                .card-header { padding: 1.25rem 1.25rem 0 1.25rem !important; border-bottom: none !important; }
                
                .avatar-main { width: 50px !important; height: 50px !important; font-size: 1.2rem !important; }
                .avatar-resp { width: 42px !important; height: 42px !important; font-size: 1.1rem !important; }
                
                h2 { font-size: 1.4rem; }
            }
        </style>
    </head>
    <body>
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <nav class="navbar navbar-expand-lg navbar-custom sticky-top py-3 shadow-sm z-3">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary fs-4 d-flex align-items-center" href="/forum">
                    <i class="bi bi-chat-square-dots-fill me-2"></i> OnStude<span class="text-dark">.</span>
                    <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 ms-2 fs-6 rounded-pill fw-normal d-none d-sm-inline-block">Fórum</span>
                </a>
                <div class="d-flex ms-auto gap-2">
                    <a href="/forum" class="btn btn-outline-secondary btn-sm rounded-pill fw-semibold px-3 d-none d-sm-block">
                        <i class="bi bi-arrow-left"></i> Voltar aos Tópicos
                    </a>
                    ${usuarioLogado 
                        ? `<a href="${linkPainel}" class="btn btn-primary btn-sm rounded-pill fw-bold px-3">Meu Painel</a>` 
                        : `<a href="/login?returnTo=/forum/topico/${topico.id}" class="btn btn-primary btn-sm rounded-pill fw-bold px-3">Entrar</a>`
                    }
                </div>
            </div>
        </nav>

        <div class="container mt-4 mb-5 mobile-no-px">
            <div class="row justify-content-center px-0 px-md-3">
                <div class="col-lg-9 mobile-no-px">
                    
                    <div class="d-block d-sm-none mb-3 px-3">
                        <a href="/forum" class="text-decoration-none text-muted fw-semibold">
                            <i class="bi bi-arrow-left me-1"></i> Voltar aos Tópicos
                        </a>
                    </div>

                    <div class="card shadow-sm border-0 mb-4 overflow-hidden rounded-4 topic-main-card">
                        <div class="card-header bg-white border-bottom-0 p-4 pb-2">
                            <span class="badge bg-secondary bg-opacity-10 text-secondary border rounded-pill px-3 py-2 mb-3"><i class="bi bi-tag me-1"></i> ${topico.categoria}</span>
                            <h2 class="fw-bold text-dark mb-0 lh-base">${topico.titulo}</h2>
                        </div>
                        <div class="card-body p-4 d-flex flex-column flex-sm-row">
                            <div class="me-4 mb-3 mb-sm-0 text-start text-sm-center flex-shrink-0 d-flex flex-row flex-sm-column align-items-center">
                                ${avatarTopico}
                                <div class="d-sm-none ms-3 text-start">
                                    <h6 class="fw-bold text-secondary mb-0" style="font-size: 0.9rem;">${topico.autor_nome}</h6>
                                    <small class="text-muted" style="font-size: 0.75rem;">${dataTopico}</small>
                                </div>
                                <div class="mt-2 fw-bold text-secondary d-none d-sm-block text-truncate" style="font-size: 0.85rem; max-width: 80px;">${topico.autor_nome.split(' ')[0]}</div>
                            </div>
                            
                            <div class="flex-grow-1 overflow-hidden mt-1 mt-sm-0">
                                <div class="text-muted small mb-0 border-bottom pb-2 d-none d-sm-flex justify-content-between align-items-center">
                                    <span>Publicado a ${dataTopico} <span class="mx-1">•</span> <span class="text-primary fw-semibold"><i class="bi bi-eye"></i> ${topico.visualizacoes} views</span></span>
                                    ${tipoBadgeTopico}
                                </div>
                                
                                <div class="d-flex d-sm-none justify-content-between align-items-center border-bottom pb-2 mb-2">
                                    <span class="text-primary fw-semibold small"><i class="bi bi-eye"></i> ${topico.visualizacoes} views</span>
                                    ${tipoBadgeTopico}
                                </div>

                                ${statsTopico}
                                
                                <div class="text-dark fs-5 mt-2" style="white-space: pre-wrap; line-height: 1.6; font-size: 1.05rem !important;">${topico.conteudo}</div>
                                ${imgTopicoHTML}
                            </div>
                        </div>
                    </div>

                    <div class="d-flex align-items-center justify-content-between mb-3 mt-5 px-3 px-md-1">
                        <h5 class="fw-bold text-secondary mb-0"><i class="bi bi-chat-left-text me-2"></i> ${respostas.length} Respostas</h5>
                    </div>
                    
                    <div class="bg-white bg-md-transparent pb-1 pb-md-0">
                        ${htmlRespostas}
                    </div>

                    ${formRespostaHTML}

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
        </script>
    </body>
    </html>
    `;
}

module.exports = renderForumTopicoView;