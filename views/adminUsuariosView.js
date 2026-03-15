// views/adminUsuariosView.js

function renderAdminUsuariosView(admin, usuarios, currentPage = 1, totalPages = 1, searchQuery = '') {
    let linhasUsuarios = '';
    
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

    if (usuarios.length === 0) {
        linhasUsuarios = `<tr><td colspan="9" class="text-center text-muted py-4">Nenhum usuário encontrado ${searchQuery ? 'para "'+searchQuery+'"' : ''}.</td></tr>`;
    } else {
        usuarios.forEach(u => {
            let badgeTipo = u.tipo === 'ADMIN' ? 'bg-danger' : 'bg-primary';
            
            // ==========================================
            // LÓGICA DO STATUS INTELIGENTE (CONCLUINTE)
            // ==========================================
            let statusVisual = u.status;
            let badgeStatus = 'bg-secondary'; // Padrão

            if (u.status === 'ATIVO') {
                // Se ele tem pelo menos 1 curso E todos estão concluídos
                if (u.total_cursos > 0 && Number(u.total_cursos) === Number(u.concluidos_count)) {
                    statusVisual = 'CONCLUINTE';
                    badgeStatus = 'bg-info text-dark fw-bold shadow-sm'; // Destaque visual para concluintes
                } else {
                    badgeStatus = 'bg-success'; // Ativo normal
                }
            } else if (u.status === 'BLOQUEADO') {
                badgeStatus = 'bg-warning text-dark';
            }

            const dataCadastro = u.criado_em ? new Date(u.criado_em).toLocaleDateString('pt-BR') : '-';
            const dataNascimento = u.data_nascimento ? new Date(u.data_nascimento).toLocaleDateString('pt-BR') : '-';
            
            const cursosTooltip = u.cursos_lista ? u.cursos_lista : 'Nenhum curso';
            const qtdCursos = u.total_cursos || 0;

            let trClass = '';
            let dataUltimoAcesso = '<span class="text-muted fst-italic">Nunca acessou</span>';

            if (u.ultimo_acesso) {
                const dataAcesso = new Date(u.ultimo_acesso);
                dataUltimoAcesso = dataAcesso.toLocaleDateString('pt-BR') + ' às ' + dataAcesso.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                
                const diffEmDias = (new Date() - dataAcesso) / (1000 * 60 * 60 * 24);
                if (diffEmDias > 3 && u.tipo === 'ALUNO') {
                    trClass = 'table-danger';
                }
            } else if (u.tipo === 'ALUNO') {
                trClass = 'table-danger';
            }

            let ultimaAulaVisual = '-';
            if (u.ultima_aula_info) {
                const [aulaTitulo, cursoTitulo] = u.ultima_aula_info.split('|||');
                ultimaAulaVisual = `
                    <div style="max-width: 180px;">
                        <span class="d-block text-truncate fw-semibold text-dark" title="${aulaTitulo}">${aulaTitulo}</span>
                        <small class="d-block text-truncate text-muted" title="${cursoTitulo}">${cursoTitulo}</small>
                    </div>
                `;
            }

            linhasUsuarios += `
                <tr class="${trClass}">
                    <td>${u.id}</td>
                    <td class="fw-bold">${u.nome}</td>
                    <td>${u.email}</td>
                    <td><span class="badge ${badgeTipo}">${u.tipo}</span></td>
                    <td><span class="badge ${badgeStatus}">${statusVisual}</span></td>
                    <td>${dataUltimoAcesso}</td>
                    <td>${ultimaAulaVisual}</td>
                    <td class="text-center">
                        <span class="badge bg-dark text-white shadow-sm" style="cursor: help;" data-bs-toggle="tooltip" data-bs-placement="top" title="${cursosTooltip}">
                            ${qtdCursos}
                        </span>
                    </td>
                    <td>
                        <a href="/admin/usuarios/${u.id}/editar" class="btn btn-sm btn-outline-primary shadow-sm">Editar</a>
                    </td>
                </tr>
            `;
        });
    }

    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml += `<ul class="pagination justify-content-center mb-0 mt-3 shadow-sm">`;

        if (currentPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${currentPage - 1}${searchParam}">&laquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">&laquo;</span></li>`;
        }

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) endPage = Math.min(3, totalPages);
        if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=1${searchParam}">1</a></li>`;
            if (startPage > 2) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHtml += `<li class="page-item active"><span class="page-link fw-bold">${i}</span></li>`;
            } else {
                paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${i}${searchParam}">${i}</a></li>`;
            }
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            }
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${totalPages}${searchParam}">${totalPages}</a></li>`;
        }

        if (currentPage < totalPages) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${currentPage + 1}${searchParam}">&raquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><span class="page-link">&raquo;</span></li>`;
        }

        paginationHtml += `</ul>`;
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Gestão de Usuários - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-light">
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-primary" href="/admin">OnStude <span class="text-white fw-light">Admin</span></a>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link" href="/admin">Dashboard</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/cursos">Cursos</a></li>
                        <li class="nav-item"><a class="nav-link active" href="/admin/usuarios">Usuários</a></li>
                        <li class="nav-item"><a class="nav-link" href="/admin/notificacoes">Notificações</a></li>
                    </ul>
                    <div class="d-flex align-items-center ms-auto">
                        ${admin.foto_perfil_url 
                            ? `<img src="${admin.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid #fff;">` 
                            : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-secondary text-white fw-bold" style="width: 36px; height: 36px; border: 2px solid #fff; font-size: 14px;">${admin.nome.charAt(0).toUpperCase()}</div>`
                        }
                        <span class="text-light me-3">Olá, <strong>${admin.nome}</strong></span>
                        <a href="/logout" class="btn btn-outline-danger btn-sm shadow-sm">Sair</a>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container-fluid mt-4 px-4">
            <div class="row justify-content-center">
                <div class="col-12 col-lg-10">
                    
                    <div class="row mb-4 align-items-center">
                        <div class="col-md-4 mb-3 mb-md-0">
                            <h4 class="fw-bold text-secondary mb-0">Gestão de Usuários</h4>
                            <p class="small text-muted mb-0">Exibindo a página ${currentPage} de ${totalPages}.</p>
                        </div>
                        
                        <div class="col-md-5 mb-3 mb-md-0">
                            <form action="/admin/usuarios" method="GET" class="d-flex shadow-sm rounded">
                                <input type="text" name="search" class="form-control me-2" placeholder="Buscar por nome ou título do curso..." value="${searchQuery}">
                                <button type="submit" class="btn btn-primary fw-bold">Buscar</button>
                                ${searchQuery ? '<a href="/admin/usuarios" class="btn btn-outline-secondary ms-2">Limpar</a>' : ''}
                            </form>
                        </div>

                        <div class="col-md-3 text-md-end">
                            <a href="/admin/usuarios/novo" class="btn btn-success fw-bold shadow-sm">+ Novo Usuário</a>
                        </div>
                    </div>

                    <div class="card shadow-sm border-0 mb-4 rounded-3 overflow-hidden">
                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover align-middle mb-0">
                                    <thead class="table-light">
                                        <tr>
                                            <th>ID</th>
                                            <th>Nome</th>
                                            <th>E-mail</th>
                                            <th>Tipo</th>
                                            <th>Status</th>
                                            <th>Último Acesso</th>
                                            <th>Última Ação</th>
                                            <th class="text-center">Cursos</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${linhasUsuarios}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <nav aria-label="Navegação de usuários">
                        ${paginationHtml}
                    </nav>
                    <br><br>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            document.addEventListener('DOMContentLoaded', function () {
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            });

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

module.exports = renderAdminUsuariosView;