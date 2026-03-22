// views/forumTopicoView.js

function renderForumTopicoView(usuarioLogado, topico, respostas) {
    const dataTopico = new Date(topico.criado_em).toLocaleString('pt-BR');
    const avatarTopico = topico.foto_perfil_url ? `<img src="${topico.foto_perfil_url}" class="rounded-circle shadow-sm" style="width: 60px; height: 60px; object-fit: cover;">` : `<div class="rounded-circle mx-auto d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm" style="width: 60px; height: 60px; font-size: 24px;">${topico.autor_nome.charAt(0).toUpperCase()}</div>`;
    
    // Badges do Autor da Pergunta
    const tipoBadgeTopico = topico.autor_tipo === 'ADMIN' ? '<span class="badge bg-danger ms-2">Equipa OnStude</span>' : '<span class="badge bg-primary ms-2">Aluno</span>';
    const statsTopico = topico.autor_tipo === 'ALUNO' ? `
        <div class="d-flex flex-wrap gap-2 mt-2" style="font-size: 0.8rem;">
            ${topico.nota_media ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" title="Média de Notas">⭐ ${topico.nota_media}</span>` : ''}
            ${topico.melhor_curso ? `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25" title="Melhor Desempenho">🏆 ${topico.melhor_curso}</span>` : ''}
        </div>
    ` : '';

    const imgTopicoHTML = topico.imagem_url ? `
        <div class="mt-4 text-center">
            <a href="${topico.imagem_url}" target="_blank">
                <img src="${topico.imagem_url}" class="img-fluid rounded border shadow-sm" style="max-height: 400px;" alt="Print do erro">
            </a>
            <p class="small text-muted mt-1">Clique na imagem para ampliar</p>
        </div>
    ` : '';

    let htmlRespostas = '';
    if (respostas.length === 0) {
        htmlRespostas = `<div class="alert alert-light text-center border mt-4 text-muted">Ainda não há respostas. Seja o primeiro a ajudar!</div>`;
    } else {
        respostas.forEach(r => {
            const dataResp = new Date(r.criado_em).toLocaleString('pt-BR');
            const avatarResp = r.foto_perfil_url ? `<img src="${r.foto_perfil_url}" class="rounded-circle shadow-sm" style="width: 50px; height: 50px; object-fit: cover;">` : `<div class="rounded-circle d-flex align-items-center justify-content-center bg-secondary text-white fw-bold shadow-sm" style="width: 50px; height: 50px;">${r.autor_nome.charAt(0).toUpperCase()}</div>`;
            
            // ==========================================
            // BADGES E ESTATÍSTICAS DE QUEM RESPONDEU
            // ==========================================
            const tipoBadgeResp = r.autor_tipo === 'ADMIN' ? '<span class="badge bg-danger ms-2">Equipa OnStude</span>' : '<span class="badge bg-primary ms-2">Aluno</span>';
            const statsResp = r.autor_tipo === 'ALUNO' ? `
                <div class="d-flex align-items-center gap-2 mt-2 mb-2" style="font-size: 0.75rem;">
                    ${r.nota_media ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" title="Média de Notas">⭐ ${r.nota_media}</span>` : ''}
                    ${r.melhor_curso ? `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 text-truncate" style="max-width: 200px;" title="Melhor Desempenho">🏆 ${r.melhor_curso}</span>` : ''}
                </div>
            ` : '';

            const imgRespHTML = r.imagem_url ? `
                <div class="mt-3">
                    <a href="${r.imagem_url}" target="_blank">
                        <img src="${r.imagem_url}" class="img-fluid rounded border" style="max-height: 300px;">
                    </a>
                </div>
            ` : '';
            const isSolucao = r.is_solucao ? `<div class="badge bg-success mb-2 fs-6">✅ Solução Aceite</div>` : '';
            const corBorda = r.is_solucao ? 'border-success border-2' : 'border-0';

            htmlRespostas += `
                <div class="card shadow-sm ${corBorda} mb-4">
                    <div class="card-body p-4 d-flex">
                        <div class="me-4 d-none d-sm-block text-center">
                            ${avatarResp}
                        </div>
                        <div class="flex-grow-1">
                            ${isSolucao}
                            <div class="d-flex justify-content-between align-items-start mb-1">
                                <div>
                                    <h6 class="fw-bold mb-0 text-dark d-flex align-items-center">${r.autor_nome} ${tipoBadgeResp}</h6>
                                    ${statsResp}
                                    <small class="text-muted">${dataResp}</small>
                                </div>
                            </div>
                            <div class="text-dark mt-2" style="white-space: pre-wrap;">${r.conteudo}</div>
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
            <div class="card shadow-sm border-start border-primary border-4 mt-5">
                <div class="card-header bg-white py-3">
                    <h5 class="fw-bold text-dark mb-0">Escrever uma resposta</h5>
                </div>
                <div class="card-body p-4">
                    <form action="/forum/topico/${topico.id}/responder" method="POST" enctype="multipart/form-data">
                        <div class="mb-3">
                            <textarea class="form-control" name="conteudo" rows="5" placeholder="Escreva a sua solução aqui..." required></textarea>
                        </div>
                        <div class="row align-items-center">
                            <div class="col-md-8 mb-3 mb-md-0">
                                <input type="file" class="form-control form-control-sm" name="print_imagem" accept="image/*">
                                <small class="text-muted">Anexar print explicativo (opcional)</small>
                            </div>
                            <div class="col-md-4 text-md-end">
                                <button type="submit" class="btn btn-primary fw-bold px-4 w-100">Enviar Resposta</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        `;
    } else {
        formRespostaHTML = `
            <div class="alert alert-info text-center mt-5 shadow-sm border-0 py-4">
                <h5 class="fw-bold">Quer ajudar a responder ou tem uma dúvida parecida?</h5>
                <p class="mb-3">Você precisa estar logado para interagir no fórum.</p>
                <a href="/login?returnTo=/forum/topico/${topico.id}" class="btn btn-primary fw-bold px-5">Fazer Login</a>
            </div>
        `;
    }

    const linkPainel = usuarioLogado ? (usuarioLogado.tipo === 'ADMIN' ? '/admin' : '/aluno') : '/';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>${topico.titulo} - Fórum OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <nav class="navbar navbar-dark bg-dark shadow-sm">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary" href="/forum">OnStude <span class="text-white fw-light">Fórum</span></a>
                <div class="d-flex">
                    <a href="/forum" class="btn btn-outline-light btn-sm me-2">Lista de Dúvidas</a>
                    ${usuarioLogado ? `<a href="${linkPainel}" class="btn btn-primary btn-sm fw-bold">Meu Painel</a>` : ''}
                </div>
            </div>
        </nav>

        <div class="container mt-4 mb-5">
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    
                    <div class="card shadow-sm border-0 mb-4 overflow-hidden">
                        <div class="card-header bg-white border-bottom p-4">
                            <span class="badge bg-secondary mb-2">${topico.categoria}</span>
                            <h2 class="fw-bold text-dark mb-0">${topico.titulo}</h2>
                        </div>
                        <div class="card-body p-4 d-flex flex-column flex-sm-row">
                            <div class="me-4 mb-3 mb-sm-0 text-center" style="min-width: 80px;">
                                ${avatarTopico}
                                <div class="mt-2 fw-bold text-secondary" style="font-size: 0.85rem;">${topico.autor_nome.split(' ')[0]}</div>
                            </div>
                            <div class="flex-grow-1">
                                <div class="text-muted small mb-3 border-bottom pb-2 d-flex justify-content-between align-items-center">
                                    <span>Publicado a ${dataTopico} • <span class="text-primary">${topico.visualizacoes} views</span></span>
                                    ${tipoBadgeTopico}
                                </div>
                                ${statsTopico}
                                <div class="text-dark fs-5 mt-3" style="white-space: pre-wrap; line-height: 1.6;">${topico.conteudo}</div>
                                ${imgTopicoHTML}
                            </div>
                        </div>
                    </div>

                    <h5 class="fw-bold text-secondary mb-3 mt-5 px-2">${respostas.length} Respostas</h5>
                    
                    ${htmlRespostas}

                    ${formRespostaHTML}

                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
    `;
}

module.exports = renderForumTopicoView;