// views/adminCursosView.js
const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminCursosView(admin, cursos, currentPage = 1, totalPages = 1, searchQuery = '') {
    
    const htmlSidebar = renderAdminMenuLateral(admin, 'cursos');

    let htmlCursos = '';
    const searchParam = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';

    const fallbackCapa = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22200%22%20viewBox%3D%220%200%20400%20200%22%3E%3Crect%20fill%3D%22%23e9ecef%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%236c757d%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ECurso%3C%2Ftext%3E%3C%2Fsvg%3E';

    // Função auxiliar para formatar os segundos totais em Horas/Minutos legíveis
    const formatarDuracao = (segundosTotais) => {
        if (!segundosTotais || segundosTotais == 0) return '0h';
        const horas = Math.floor(segundosTotais / 3600);
        const minutos = Math.floor((segundosTotais % 3600) / 60);
        
        if (horas > 0 && minutos > 0) return `${horas}h ${minutos}m`;
        if (horas > 0) return `${horas}h`;
        return `${minutos}m`;
    };

    if (!cursos || cursos.length === 0) {
        htmlCursos = `
            <div class="col-12 text-center text-muted py-5">
                <i class="bi bi-journal-x fs-1 opacity-50 mb-3 d-block"></i>
                Nenhum curso encontrado ${searchQuery ? 'para "' + searchQuery + '"' : 'ainda'}.
            </div>
        `;
    } else {
        cursos.forEach(curso => {
            let badgeClass = 'bg-secondary';
            if (curso.status === 'PUBLICADO') badgeClass = 'bg-success';
            if (curso.status === 'RASCUNHO') badgeClass = 'bg-warning text-dark';
            
            const capa = (curso.capa_url && curso.capa_url.trim() !== '') ? curso.capa_url : fallbackCapa;

            // Duração Automática
            const duracao = curso.duracao_total_segundos !== undefined 
                            ? formatarDuracao(curso.duracao_total_segundos) 
                            : (curso.duracao_horas ? `${curso.duracao_horas}h` : '-');

            // NOVIDADE: Cálculo de Conclusão baseado na duração (2h por dia)
            let conclusao = '-';
            if (curso.duracao_total_segundos > 0) {
                const horasTotais = curso.duracao_total_segundos / 3600;
                const diasCalculados = Math.ceil(horasTotais / 2); // Divide por 2 horas diárias e arredonda pra cima
                const diasFinais = diasCalculados < 1 ? 1 : diasCalculados; // Mínimo de 1 dia
                conclusao = `${diasFinais} dia${diasFinais > 1 ? 's' : ''}`;
            } else if (curso.conclusao_dias) {
                // Fallback para o valor digitado manualmente caso o curso ainda não tenha aulas
                conclusao = `${curso.conclusao_dias} dias`;
            }

            const qtdAlunos = curso.quantidade_alunos || 0;
            const notaMedia = curso.nota_media ? parseFloat(curso.nota_media).toFixed(1) : '-';
            
            let precoFormatado = '<span class="text-muted fs-6">Sem preço</span>';
            if (curso.preco !== null && curso.preco !== undefined) {
                const valor = parseFloat(curso.preco);
                if (valor > 0) {
                    precoFormatado = `R$ ${valor.toFixed(2).replace('.', ',')}`;
                } else {
                    precoFormatado = '<span class="text-success border border-success bg-success bg-opacity-10 px-2 py-1 rounded-pill fs-6">Gratuito</span>';
                }
            }

            htmlCursos += `
                <div class="col-md-6 col-xl-4 col-xxl-3 mb-4">
                    <div class="card shadow-sm rounded-4 h-100 hover-card transition-all overflow-hidden border-0">
                        
                        <div class="position-relative bg-dark">
                            <img src="${capa}" onerror="this.onerror=null;this.src='${fallbackCapa}';" class="card-img-top border-bottom" alt="Capa" style="height: 160px; object-fit: cover; width: 100%;">
                            <span class="badge ${badgeClass} position-absolute top-0 end-0 m-3 shadow-sm px-3 py-2 rounded-pill">${curso.status}</span>
                        </div>
                        
                        <div class="card-body p-4 d-flex flex-column">
                            
                            <div class="mb-3">
                                <span class="badge bg-light text-dark border mb-2"><i class="bi bi-upc-scan me-1"></i>${curso.codigo_unico}</span>
                                <h5 class="fw-bold text-dark mb-2 lh-sm text-truncate" title="${curso.titulo}">${curso.titulo}</h5>
                                <h5 class="text-primary fw-bold mb-0">${precoFormatado}</h5>
                            </div>

                            <div class="row g-2 mb-4 mt-auto p-3 bg-light rounded-4 border">
                                <div class="col-6 mb-2">
                                    <small class="d-block text-muted lh-1" style="font-size: 0.7rem;">Matriculados</small>
                                    <strong class="text-dark"><i class="bi bi-people-fill text-info me-1 small"></i>${qtdAlunos}</strong>
                                </div>
                                <div class="col-6 mb-2">
                                    <small class="d-block text-muted lh-1" style="font-size: 0.7rem;">Nota Média</small>
                                    <strong class="text-dark"><i class="bi bi-star-fill text-warning me-1 small"></i>${notaMedia}</strong>
                                </div>
                                <div class="col-6 border-top pt-2">
                                    <small class="d-block text-muted lh-1" style="font-size: 0.7rem;">Duração</small>
                                    <strong class="text-dark" title="Soma do tempo de todas as aulas"><i class="bi bi-clock-history text-secondary me-1 small"></i>${duracao}</strong>
                                </div>
                                <div class="col-6 border-top pt-2">
                                    <small class="d-block text-muted lh-1" style="font-size: 0.7rem;">Conclusão</small>
                                    <strong class="text-dark" title="Estimativa baseada em 2h de estudo/dia"><i class="bi bi-calendar-check text-success me-1 small"></i>${conclusao}</strong>
                                </div>
                            </div>

                            <div class="d-flex gap-2 mt-auto">
                                <a href="/admin/cursos/${curso.id}" class="btn btn-outline-primary w-50 fw-bold rounded-pill shadow-sm">
                                    <i class="bi bi-list-task me-1"></i> Módulos
                                </a>
                                <a href="/admin/cursos/${curso.id}/editar" class="btn btn-primary w-50 fw-bold rounded-pill shadow-sm">
                                    <i class="bi bi-pencil-square me-1"></i> Editar
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
            `;
        });
    }

    let paginationHtml = '';
    if (totalPages > 1) {
        paginationHtml += `<ul class="pagination justify-content-center mb-0 mt-4 shadow-sm">`;
        if (currentPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link rounded-start-pill px-3" href="?page=${currentPage - 1}${searchParam}">&laquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><span class="page-link rounded-start-pill px-3">&laquo;</span></li>`;
        }

        let startPage = Math.max(1, currentPage - 1);
        let endPage = Math.min(totalPages, currentPage + 1);

        if (currentPage === 1) endPage = Math.min(3, totalPages);
        if (currentPage === totalPages) startPage = Math.max(1, totalPages - 2);

        if (startPage > 1) {
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=1${searchParam}">1</a></li>`;
            if (startPage > 2) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }

        for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
                paginationHtml += `<li class="page-item active"><span class="page-link fw-bold">${i}</span></li>`;
            } else {
                paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${i}${searchParam}">${i}</a></li>`;
            }
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) paginationHtml += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
            paginationHtml += `<li class="page-item"><a class="page-link" href="?page=${totalPages}${searchParam}">${totalPages}</a></li>`;
        }

        if (currentPage < totalPages) {
            paginationHtml += `<li class="page-item"><a class="page-link rounded-end-pill px-3" href="?page=${currentPage + 1}${searchParam}">&raquo;</a></li>`;
        } else {
            paginationHtml += `<li class="page-item disabled"><span class="page-link rounded-end-pill px-3">&raquo;</span></li>`;
        }
        paginationHtml += `</ul>`;
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
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            .transition-all { transition: all 0.3s ease; }
            .hover-card:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
        </style>
    </head>
    <body class="bg-light">

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
                    
                    <div class="row mb-4 align-items-center">
                        <div class="col-md-4 mb-3 mb-md-0">
                            <h3 class="fw-bold text-dark mb-0"><i class="bi bi-collection-play-fill text-primary me-2"></i>Cursos</h3>
                            <p class="text-muted small mt-1 mb-0">Página ${currentPage} de ${totalPages}.</p>
                        </div>
                        
                        <div class="col-md-5 mb-3 mb-md-0">
                            <form action="/admin/cursos" method="GET" class="d-flex shadow-sm rounded-pill overflow-hidden bg-white border">
                                <input type="text" name="search" class="form-control border-0 shadow-none ps-4" placeholder="Buscar por título ou código..." value="${searchQuery}">
                                <button type="submit" class="btn btn-primary fw-bold px-4 rounded-end-pill">Buscar</button>
                                ${searchQuery ? `<a href="/admin/cursos" class="btn btn-light border-start text-secondary px-3"><i class="bi bi-x-lg"></i></a>` : ''}
                            </form>
                        </div>

                        <div class="col-md-3 text-md-end">
                            <a href="/admin/cursos/novo" class="btn btn-success rounded-pill fw-bold shadow-sm px-4">
                                <i class="bi bi-plus-lg me-1"></i> Novo Curso
                            </a>
                        </div>
                    </div>

                    <div class="row">
                        ${htmlCursos}
                    </div>

                    <nav aria-label="Navegação de cursos" class="mb-5 pb-4">
                        ${paginationHtml}
                    </nav>

                </div> 
            </div> 
        </div>
        
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

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

module.exports = renderAdminCursosView;