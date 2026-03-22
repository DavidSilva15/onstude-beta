// views/adminCursosView.js

function renderAdminCursosView(admin, cursos) {
    let htmlCursos = '';

    if (cursos.length === 0) {
        htmlCursos = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">Nenhum curso cadastrado ainda.</td>
            </tr>
        `;
    } else {
        cursos.forEach(curso => {
            const badgeClass = curso.status === 'PUBLICADO' ? 'bg-success' : (curso.status === 'RASCUNHO' ? 'bg-secondary' : 'bg-warning text-dark');
            const capa = curso.capa_url ? curso.capa_url : 'https://via.placeholder.com/50';

            // Tratamento visual para os novos campos
            const duracao = curso.duracao_horas ? `${curso.duracao_horas}h` : '<span class="text-muted">-</span>';
            const conclusao = curso.conclusao_dias ? `${curso.conclusao_dias} dias` : '<span class="text-muted">-</span>';
            
            let precoFormatado = '<span class="text-muted">-</span>';
            if (curso.preco !== null && curso.preco !== undefined) {
                const valor = parseFloat(curso.preco);
                if (valor > 0) {
                    precoFormatado = `R$ ${valor.toFixed(2).replace('.', ',')}`;
                } else {
                    precoFormatado = '<span class="text-success fw-bold">Gratuito</span>';
                }
            }

            htmlCursos += `
                <tr class="align-middle">
                    <td class="text-center"><img src="${capa}" alt="Capa" class="rounded" style="width: 50px; height: 35px; object-fit: cover;"></td>
                    <td class="fw-bold text-secondary" style="font-size: 0.9rem;">${curso.codigo_unico}</td>
                    <td class="fw-bold text-dark">${curso.titulo}</td>
                    <td>${duracao}</td>
                    <td>${conclusao}</td>
                    <td class="fw-semibold">${precoFormatado}</td>
                    <td><span class="badge ${badgeClass}">${curso.status}</span></td>
                    <td class="text-end">
                        <a href="/admin/cursos/${curso.id}" class="btn btn-sm btn-outline-primary">Ver / Módulos</a>
                        <a href="/admin/cursos/${curso.id}/editar" class="btn btn-sm btn-outline-secondary">Editar</a>
                    </td>
                </tr>
            `;
        });
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Gerenciar Cursos - Admin OnStude</title>
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
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navAdmin">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navAdmin">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/admin">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link active fw-bold" href="/admin/cursos">Cursos</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/usuarios">Usuários</a></li>
                        <li class="nav-item">
                            <a class="nav-link" href="/admin/notificacoes">Notificações</a>
                        </li>
                    </ul>
                    <div class="d-flex align-items-center">
                        ${admin.foto_perfil_url 
                            ? `<img src="${admin.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid #fff;">` 
                            : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold" style="width: 36px; height: 36px; border: 2px solid #fff; font-size: 14px;">${admin.nome.charAt(0).toUpperCase()}</div>`
                        }
                        <span class="text-light me-3">Olá, <strong>${admin.nome.split(' ')[0]}</strong></span>
                        <a href="/logout" class="btn btn-outline-danger btn-sm">Sair</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mt-5 mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 class="fw-bold text-dark mb-0">Gerenciar Cursos</h2>
                    <p class="text-muted">Crie, edite e organize os cursos da plataforma.</p>
                </div>
                <a href="/admin/cursos/novo" class="btn btn-primary fw-bold shadow-sm">+ Novo Curso</a>
            </div>

            <div class="card shadow-sm border-0">
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th class="text-center" style="width: 80px;">Capa</th>
                                    <th>Código</th>
                                    <th>Título do Curso</th>
                                    <th>Duração</th>
                                    <th>Conclusão</th>
                                    <th>Preço</th>
                                    <th>Status</th>
                                    <th class="text-end">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${htmlCursos}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

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

module.exports = renderAdminCursosView;