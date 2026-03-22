// views/novoCursoView.js

function renderNovoCursoView(admin) {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Novo Curso - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
    <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
        <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
            <span class="visually-hidden">Carregando...</span>
        </div>
        <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
    </div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-primary" href="/admin">OnStude <span class="text-white fw-light">Admin</span></a>
                <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/admin">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link active fw-bold" href="/admin/cursos">Cursos</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/usuarios">Usuários</a></li>
                        <li class="nav-item">
                            <a class="nav-link" href="/admin/notificacoes">Notificações</a>
                        </li>
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
        </nav>

        <div class="container mt-5 mb-5">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card shadow-sm border-0">
                        <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h4 class="mb-0 fw-bold text-secondary">Criar Novo Curso</h4>
                            <a href="/admin" class="btn btn-sm btn-outline-secondary">Voltar</a>
                        </div>
                        <div class="card-body p-4">
                            <form action="/admin/cursos/novo" method="POST" enctype="multipart/form-data">
                                
                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Título do Curso <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" name="titulo" required>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Descrição</label>
                                    <textarea class="form-control" name="descricao" rows="4"></textarea>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Mercado de Atuação (Tags)</label>
                                    <input type="text" class="form-control" name="mercado" placeholder="Ex: Tecnologia, Programação, Web Design">
                                    <div class="form-text">Insira as áreas de atuação separadas por vírgula.</div>
                                </div>

                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold">Duração Estimada (Horas)</label>
                                        <input type="number" class="form-control" name="duracao_horas" min="1" placeholder="Ex: 40">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold">Tempo de Conclusão (Dias)</label>
                                        <input type="number" class="form-control" name="conclusao_dias" min="1" placeholder="Ex: 30">
                                        <div class="form-text">Prazo médio para o aluno concluir o curso.</div>
                                    </div>
                                </div>

                                <div class="p-3 mb-4 bg-light border rounded border-start border-success border-4">
                                    <h6 class="fw-bold text-success mb-3">💰 Configurações de Venda (Checkout)</h6>
                                    <div class="row">
                                        <div class="col-md-6 mb-3 mb-md-0">
                                            <label class="form-label fw-semibold">Preço Base (R$)</label>
                                            <input type="number" class="form-control" name="preco" step="0.01" min="0" placeholder="Ex: 197.00">
                                            <div class="form-text">Deixe vazio ou 0.00 para curso gratuito.</div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold">Desconto Promocional (%)</label>
                                            <input type="number" class="form-control" name="desconto_percentual" min="0" max="100" placeholder="Ex: 15">
                                            <div class="form-text">Percentagem aplicada no checkout final.</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold">Imagem de Capa (Thumb)</label>
                                        <input type="file" class="form-control" name="capa" accept="image/*">
                                        <div class="form-text">Usada na vitrine do aluno e na página de vendas.</div>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label fw-semibold">Fundo do Certificado</label>
                                        <input type="file" class="form-control" name="certificado_template" accept="image/*">
                                        <div class="form-text">Design base. O sistema vai carimbar o nome do aluno por cima depois.</div>
                                    </div>
                                </div>

                                <div class="mb-4">
                                    <label class="form-label fw-semibold">Status Inicial</label>
                                    <select class="form-select" name="status">
                                        <option value="RASCUNHO" selected>Rascunho (Invisível para alunos)</option>
                                        <option value="PUBLICADO">Publicado (Disponível para matrículas/vendas)</option>
                                    </select>
                                </div>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <a href="/admin" class="btn btn-light me-md-2">Cancelar</a>
                                    <button type="submit" class="btn btn-primary px-4">Salvar Curso</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script>
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

module.exports = renderNovoCursoView;