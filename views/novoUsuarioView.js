// views/novoUsuarioView.js

function renderNovoUsuarioView(admin, cursosDisponiveis) {
    // Monta as opções de cursos (checkboxes)
    let htmlCursos = '';
    if (cursosDisponiveis && cursosDisponiveis.length > 0) {
        cursosDisponiveis.forEach(curso => {
            htmlCursos += `
                <div class="form-check mb-2">
                    <input class="form-check-input border-secondary" type="checkbox" name="cursos" value="${curso.id}" id="curso_${curso.id}">
                    <label class="form-check-label text-dark" for="curso_${curso.id}">
                        <strong>${curso.codigo_unico}</strong> - ${curso.titulo}
                    </label>
                </div>
            `;
        });
    } else {
        htmlCursos = '<p class="text-muted small mb-0">Nenhum curso publicado disponível no momento.</p>';
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Novo Usuário - OnStude</title>
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
                            <h5 class="mb-0 fw-bold text-secondary">Cadastrar Novo Usuário</h5>
                            <a href="/admin/usuarios" class="btn btn-sm btn-outline-secondary">Voltar</a>
                        </div>
                        <div class="card-body p-4">
                            <form action="/admin/usuarios/novo" method="POST" enctype="multipart/form-data">
                                
                                <h6 class="text-primary mb-3">Informações Principais</h6>
                                <div class="row mb-3">
                                    <div class="col-md-8">
                                        <label class="form-label fw-semibold">Nome Completo <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" name="nome" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold">Tipo <span class="text-danger">*</span></label>
                                        <select class="form-select" name="tipo" id="tipoUsuario">
                                            <option value="ALUNO" selected>Aluno</option>
                                            <option value="ADMIN">Administrador</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-5">
                                        <label class="form-label fw-semibold">E-mail <span class="text-danger">*</span></label>
                                        <input type="email" class="form-control" name="email" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label fw-semibold">Nascimento <span class="text-danger">*</span></label>
                                        <input type="date" class="form-control" name="data_nascimento" required>
                                    </div>
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold">Senha <span class="text-danger">*</span></label>
                                        <input type="password" class="form-control" name="senha" required>
                                    </div>
                                </div>

                                <hr class="my-4">
                                <h6 class="text-primary mb-3">Contato e Perfil</h6>

                                <div class="row mb-3">
                                    <div class="col-md-4">
                                        <label class="form-label fw-semibold">Telefone</label>
                                        <input type="tel" class="form-control" name="telefone" placeholder="(00) 00000-0000">
                                    </div>
                                    <div class="col-md-5">
                                        <label class="form-label fw-semibold">Cidade</label>
                                        <input type="text" class="form-control" name="cidade" placeholder="Sua cidade">
                                    </div>
                                    <div class="col-md-3">
                                        <label class="form-label fw-semibold">Estado</label>
                                        <input type="text" class="form-control" name="estado" maxlength="2" placeholder="UF">
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label fw-semibold">Foto de Perfil</label>
                                    <input type="file" class="form-control" name="foto_perfil" accept="image/*">
                                </div>

                                <div id="sessaoMatricula">
                                    <hr class="my-4">
                                    <h6 class="text-primary mb-3">Matrícula Automática</h6>
                                    <p class="small text-muted mb-2">Selecione os cursos que deseja liberar imediatamente para este aluno.</p>
                                    <div class="border p-3 rounded bg-light" style="max-height: 200px; overflow-y: auto;">
                                        ${htmlCursos}
                                    </div>
                                </div>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                                    <a href="/admin/usuarios" class="btn btn-light me-md-2">Cancelar</a>
                                    <button type="submit" class="btn btn-success px-4">Salvar Usuário</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            // Script simples para esconder a secção de matrícula se o tipo for ADMIN
            const selectTipo = document.getElementById('tipoUsuario');
            const sessaoMatricula = document.getElementById('sessaoMatricula');

            selectTipo.addEventListener('change', function() {
                if(this.value === 'ADMIN') {
                    sessaoMatricula.style.display = 'none';
                    // Desmarca as checkboxes para não enviar dados acidentalmente
                    document.querySelectorAll('input[name="cursos"]').forEach(cb => cb.checked = false);
                } else {
                    sessaoMatricula.style.display = 'block';
                }
            });
        </script>
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

module.exports = renderNovoUsuarioView;