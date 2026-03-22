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
        <title>Nova Pergunta - Fórum OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <nav class="navbar navbar-dark bg-dark shadow-sm">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary" href="/forum">OnStude <span class="text-white fw-light">Fórum</span></a>
                <a href="${linkPainel}" class="btn btn-outline-light btn-sm">Sair do Fórum</a>
            </div>
        </nav>

        <div class="container mt-5 mb-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 class="mb-0 fw-bold text-dark">Publicar Nova Dúvida</h5>
                            <a href="/forum" class="btn btn-sm btn-outline-secondary">Cancelar</a>
                        </div>
                        <div class="card-body p-4">
                            <form action="/forum/novo" method="POST" enctype="multipart/form-data">
                                
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Título da Pergunta <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="titulo" placeholder="Ex: Como centralizar uma div usando Bootstrap 5?" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Categoria / Curso Relacionado</label>
                                    <select class="form-select" name="categoria">
                                        <optgroup label="Tópicos Gerais">
                                            <option value="Geral">Geral / Outros</option>
                                            <option value="Dúvida Técnica">Dúvida Técnica (Código)</option>
                                            <option value="Plataforma">Uso da Plataforma</option>
                                            <option value="Carreira">Mercado e Carreira</option>
                                        </optgroup>
                                        ${opcoesCursos}
                                    </select>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Explique sua dúvida com detalhes <span class="text-danger">*</span></label>
                                    <textarea class="form-control" name="conteudo" rows="6" placeholder="Escreva o que está tentando fazer, o que já tentou e qual erro apareceu..." required></textarea>
                                </div>

                                <div class="mb-4 p-3 bg-light border rounded">
                                    <label class="form-label fw-semibold text-secondary">Anexar Print (Opcional)</label>
                                    <input type="file" class="form-control" name="print_imagem" accept="image/*">
                                    <div class="form-text">Uma imagem vale mais que mil palavras! Anexe a tela do erro se possível.</div>
                                </div>

                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary btn-lg fw-bold">Publicar Pergunta</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
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