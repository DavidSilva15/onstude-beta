// views/mainHeader.js

function renderMainHeader(usuarioLogado) {
    // Define a rota do coração (Favoritos) e do Carrinho baseada no status de login
    const linkFavoritos = usuarioLogado ? '/aluno/favoritos' : '/login?returnTo=/';
    const linkCarrinho = usuarioLogado ? '/aluno/carrinho' : '/login?returnTo=/aluno/carrinho';

    return `
        <nav class="navbar navbar-expand-lg navbar-custom sticky-top py-3 bg-white border-bottom position-relative" style="z-index: 1040;">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary fs-3" href="/">OnStude<span class="text-dark">.</span></a>
                
                <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarMain">
                    <ul class="navbar-nav ms-lg-4 me-auto align-items-lg-center">
                        <li class="nav-item me-lg-2">
                            <a class="nav-link fw-semibold text-dark hover-primary" href="/plano-de-carreira">Plano de Carreira</a>
                        </li>
                        <li class="nav-item me-lg-2">
                            <a class="nav-link fw-semibold text-dark hover-primary" href="/categorias">Categorias</a>
                        </li>
                        <li class="nav-item me-lg-3">
                            <a class="nav-link fw-semibold text-dark hover-primary" href="/forum">Fórum</a>
                        </li>
                        <li class="nav-item mt-2 mt-lg-0 position-relative" style="min-width: 280px; z-index: 1050;">
                            <form class="position-relative search-form-header" onsubmit="return false;">
                                <i class="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                <input type="search" id="headerSearchInput" class="form-control search-bar-header py-2 bg-light border-0 rounded-pill ps-5" placeholder="O que deseja aprender?" autocomplete="off">
                                
                                <div id="headerSearchResults" class="dropdown-menu w-100 shadow-lg border border-light rounded-4 mt-2 p-2 position-absolute" style="display: none; max-height: 400px; overflow-y: auto;">
                                    </div>
                            </form>
                        </li>
                    </ul>

                    <div class="d-flex flex-column flex-lg-row align-items-lg-center mt-3 mt-lg-0 gap-3">
                        
                        <div class="d-none d-lg-flex gap-3 align-items-center me-lg-2">
                            <a href="${linkFavoritos}" class="text-dark text-decoration-none fs-5 hover-primary transition" title="Meus Favoritos">
                                <i class="bi bi-heart"></i>
                            </a>
                            <a href="${linkCarrinho}" class="text-dark text-decoration-none position-relative fs-5 hover-primary transition" title="Carrinho">
                                <i class="bi bi-cart3"></i>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger cart-badge-count d-none" style="font-size: 0.55rem; padding: 0.35em 0.5em;">0</span>
                            </a>
                        </div>

                        <div class="d-flex gap-3 align-items-center d-lg-none mt-2">
                            <a href="${linkFavoritos}" class="text-dark text-decoration-none fw-semibold hover-primary"><i class="bi bi-heart me-1"></i> Favoritos</a>
                            <a href="${linkCarrinho}" class="text-dark text-decoration-none fw-semibold hover-primary ms-3 d-flex align-items-center">
                                <i class="bi bi-cart3 me-1"></i> Carrinho
                                <span class="badge bg-danger rounded-pill ms-2 cart-badge-count d-none" style="font-size: 0.7rem;">0</span>
                            </a>
                        </div>
                        
                        ${usuarioLogado ? `
                            <div class="d-flex flex-column flex-lg-row align-items-lg-center ms-lg-2 border-top border-lg-0 pt-3 pt-lg-0 mt-2 mt-lg-0">
                                <div class="d-flex align-items-center mb-3 mb-lg-0 me-lg-3 text-dark">
                                    ${usuarioLogado.foto_perfil_url 
                                        ? `<img src="${usuarioLogado.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 32px; height: 32px; object-fit: cover; border: 2px solid #0d6efd;">` 
                                        : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-primary text-white fw-bold" style="width: 32px; height: 32px; border: 2px solid #0d6efd; font-size: 12px;">${usuarioLogado.nome.charAt(0).toUpperCase()}</div>`
                                    }
                                    <span>Olá, <strong>${usuarioLogado.nome.split(' ')[0]}</strong></span>
                                </div>
                                <div class="d-flex gap-2">
                                    <a href="${usuarioLogado.tipo === 'ADMIN' ? '/admin' : '/aluno'}" class="btn btn-primary btn-sm fw-bold px-3 rounded-pill flex-grow-1">Meu Painel</a>
                                    <a href="/logout" class="btn btn-outline-danger btn-sm fw-bold px-3 rounded-pill">Sair</a>
                                </div>
                            </div>
                        ` : `
                            <div class="d-flex gap-2 w-100 mt-2 mt-lg-0">
                                <a href="/login?returnTo=/" class="btn btn-outline-dark fw-bold px-4 rounded-pill flex-grow-1 flex-lg-grow-0">Entrar</a>
                                <a href="/cadastro" class="btn btn-primary fw-bold px-4 rounded-pill flex-grow-1 flex-lg-grow-0">Criar Conta</a>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </nav>

        <style>
            .hover-result-item:hover { background-color: #f8f9fa; }
            .search-bar-header:focus { box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15) !important; background-color: #ffffff !important;}
        </style>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                // ==========================================
                // LÓGICA DO CARRINHO DE COMPRAS
                // ==========================================
                fetch('/api/carrinho/count')
                    .then(res => res.json())
                    .then(data => {
                        const badges = document.querySelectorAll('.cart-badge-count');
                        badges.forEach(badge => {
                            if (data.count > 0) {
                                badge.textContent = data.count;
                                badge.classList.remove('d-none');
                            }
                        });
                    })
                    .catch(err => console.error('Erro ao buscar quantidade do carrinho:', err));

                // ==========================================
                // LÓGICA DE BUSCA DINÂMICA DE CURSOS
                // ==========================================
                const searchInput = document.getElementById('headerSearchInput');
                const searchResults = document.getElementById('headerSearchResults');
                let debounceTimer;

                if (searchInput && searchResults) {
                    searchInput.addEventListener('input', function() {
                        clearTimeout(debounceTimer);
                        const query = this.value.trim();

                        // Se digitar menos de 2 caracteres, esconde o dropdown
                        if (query.length < 2) {
                            searchResults.style.display = 'none';
                            return;
                        }

                        // Spinner de Carregamento enquanto digita
                        searchResults.style.display = 'block';
                        searchResults.innerHTML = '<div class="p-3 text-center text-primary"><div class="spinner-border spinner-border-sm" role="status"></div></div>';

                        // Aguarda 300ms depois que o utilizador parar de digitar
                        debounceTimer = setTimeout(() => {
                            fetch('/api/cursos/search?q=' + encodeURIComponent(query))
                                .then(res => res.json())
                                .then(data => {
                                    if (!data.success) return;
                                    
                                    searchResults.innerHTML = '';
                                    
                                    if (data.cursos.length === 0) {
                                        searchResults.innerHTML = '<div class="p-3 text-center text-muted small"><i class="bi bi-search me-1"></i> Nenhum curso encontrado.</div>';
                                    } else {
                                        data.cursos.forEach(curso => {
                                            const fallbackCapa = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22100%22%20viewBox%3D%220%200%20150%20100%22%3E%3Crect%20fill%3D%22%23e9ecef%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%236c757d%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ECurso%3C%2Ftext%3E%3C%2Fsvg%3E';
                                            const capa = (curso.capa_url && curso.capa_url.trim() !== '') ? curso.capa_url : fallbackCapa;
                                            const descricao = curso.descricao ? curso.descricao : 'Clique para ver os detalhes deste curso.';
                                            
                                            searchResults.innerHTML += \`
                                                <a href="/cursos/\${curso.id}" class="dropdown-item d-flex align-items-center py-2 px-2 rounded-3 mb-1 text-wrap text-decoration-none hover-result-item transition">
                                                    <img src="\${capa}" onerror="this.onerror=null;this.src='\${fallbackCapa}';" class="rounded-3 me-3 border" style="width: 50px; height: 50px; object-fit: cover;">
                                                    <div style="flex-grow: 1; min-width: 0;">
                                                        <h6 class="fw-bold text-dark mb-0 text-truncate" style="font-size: 0.9rem;">\${curso.titulo}</h6>
                                                        <small class="text-muted d-block" style="font-size: 0.75rem; display: -webkit-box !important; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">\${descricao}</small>
                                                    </div>
                                                </a>
                                            \`;
                                        });
                                    }
                                })
                                .catch(err => {
                                    console.error('Erro na busca:', err);
                                    searchResults.innerHTML = '<div class="p-3 text-center text-danger small">Erro ao buscar cursos.</div>';
                                });
                        }, 300);
                    });

                    // Fecha o dropdown se o utilizador clicar fora da barra de busca
                    document.addEventListener('click', function(e) {
                        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                            searchResults.style.display = 'none';
                        }
                    });
                    
                    // Reabre o dropdown se o utilizador clicar no input e já houver texto
                    searchInput.addEventListener('focus', function() {
                        if (this.value.trim().length >= 2 && searchResults.innerHTML.trim() !== '') {
                            searchResults.style.display = 'block';
                        }
                    });
                }
            });
        </script>
    `;
}

module.exports = renderMainHeader;