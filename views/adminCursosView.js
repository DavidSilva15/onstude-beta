// views/adminCursosView.js
const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminCursosView(admin, cursos) {
    
    // Injeta o menu passando os dados do admin e marcando 'cursos' como ativo
    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

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
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            /* Ajuste da área de conteúdo principal para rolar independentemente do menu */
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } /* Desconta a navbar mobile */
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

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">
                    
                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 class="fw-bold text-dark mb-0">Gerenciar Cursos</h2>
                            <p class="text-muted">Crie, edite e organize os cursos da plataforma.</p>
                        </div>
                        <a href="/admin/cursos/novo" class="btn btn-primary rounded-pill fw-bold shadow-sm px-4">
                            <i class="bi bi-plus-lg me-1"></i> Novo Curso
                        </a>
                    </div>

                    <div class="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th class="text-center ps-3" style="width: 80px;">Capa</th>
                                            <th>Código</th>
                                            <th>Título do Curso</th>
                                            <th>Duração</th>
                                            <th>Conclusão</th>
                                            <th>Preço</th>
                                            <th>Status</th>
                                            <th class="text-end pe-4">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${htmlCursos}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div> </div> </div>
        
        <script>
            // 1. Esconde o loader no carregamento normal E quando o usuário clica em "Voltar"
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