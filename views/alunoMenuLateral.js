// views/alunoMenuLateral.js

function renderAlunoMenuLateral(aluno, activePage) {
    
    // Tratamento da foto de perfil ou iniciais
    const fotoPerfil = aluno.foto_perfil_url 
        ? `<img src="${aluno.foto_perfil_url}" alt="Foto" class="rounded-circle shadow-sm border border-light border-2" style="width: 45px; height: 45px; object-fit: cover;">` 
        : `<div class="rounded-circle d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm border border-light border-2" style="width: 45px; height: 45px; font-size: 1.1rem;">${aluno.nome.charAt(0).toUpperCase()}</div>`;

    return `
    <style>
        /* Correção para o Dropdown de Notificações não cortar no Mobile (Offcanvas) */
        @media (max-width: 991.98px) {
            #listaNotificacoesDropdown {
                position: static !important;
                transform: none !important;
                width: 100% !important;
                max-width: 100% !important;
                box-shadow: inset 0 4px 6px rgba(0,0,0,0.05) !important;
                border: 1px solid #dee2e6 !important;
                margin-top: 10px !important;
                margin-left: 0 !important;
                background-color: #f8f9fa !important;
            }
        }
    </style>

    <div class="d-lg-none d-flex justify-content-between align-items-center bg-primary text-white p-3 shadow-sm w-100 z-3">
        <h5 class="mb-0 fw-bold d-flex align-items-center">
            <i class="bi bi-mortarboard-fill me-2 fs-3"></i> OnStude
        </h5>
        <button class="btn btn-outline-light border-0 px-2 py-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#alunoSidebarMenu">
            <i class="bi bi-list fs-1"></i>
        </button>
    </div>

    <div class="offcanvas-lg offcanvas-start bg-white shadow-sm border-end flex-shrink-0" tabindex="-1" id="alunoSidebarMenu" style="width: 280px; z-index: 1050;">
        
        <div class="offcanvas-header border-bottom d-lg-none bg-light">
            <h5 class="offcanvas-title fw-bold text-primary d-flex align-items-center">
                <i class="bi bi-mortarboard-fill me-2"></i> OnStude
            </h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" data-bs-target="#alunoSidebarMenu"></button>
        </div>
        
        <div class="offcanvas-body d-flex flex-column p-4 h-100">
            
            <a href="/aluno" class="d-none d-lg-flex align-items-center mb-4 text-decoration-none">
                <div class="bg-primary bg-opacity-10 p-2 rounded-3 me-3 text-primary">
                    <i class="bi bi-mortarboard-fill fs-3"></i>
                </div>
                <span class="fs-4 fw-bolder text-dark tracking-tight">OnStude</span>
            </a>
            
            <hr class="d-none d-lg-block text-secondary opacity-10 mt-0 mb-4">
            
            <div class="d-flex align-items-center mb-4 p-2 bg-light rounded-4 border border-white shadow-sm">
                ${fotoPerfil}
                <div class="ms-3 overflow-hidden">
                    <h6 class="mb-0 fw-bold text-dark text-truncate" title="${aluno.nome}">${aluno.nome.split(' ')[0]}</h6>
                    <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25" style="font-size: 0.65rem;">Área do Aluno</span>
                </div>
            </div>

            <ul class="nav nav-pills flex-column mb-auto gap-2 w-100">
                <li class="nav-item">
                    <a href="/" class="nav-link px-3 ${activePage === 'home' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-house-door-fill me-3 ${activePage === 'home' ? '' : 'text-secondary'}"></i> Início
                    </a>
                </li>
                <li class="nav-item">
                    <a href="/aluno" class="nav-link px-3 ${activePage === 'dashboard' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-play-btn-fill me-3 ${activePage === 'dashboard' ? '' : 'text-secondary'}"></i> Meus Cursos
                    </a>
                </li>
                <li>
                    <a href="/plano-de-carreira" class="nav-link px-3 ${activePage === 'planocarreira' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-bullseye me-3 ${activePage === 'planocarreira' ? '' : 'text-secondary'}"></i> Plano de Carreira
                    </a>
                </li>
                <li>
                    <a href="/aluno/conquistas" class="nav-link px-3 ${activePage === 'conquistas' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-trophy-fill me-3 ${activePage === 'conquistas' ? '' : 'text-secondary'}"></i> Conquistas
                    </a>
                </li>
                <li>
                    <a href="/aluno/certificados" class="nav-link px-3 ${activePage === 'certificados' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-award-fill me-3 ${activePage === 'certificados' ? '' : 'text-secondary'}"></i> Certificados
                    </a>
                </li>
                <li>
                    <a href="/forum" class="nav-link px-3 ${activePage === 'forum' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-chat-dots-fill me-3 ${activePage === 'forum' ? '' : 'text-secondary'}"></i> Fórum de Dúvidas
                    </a>
                </li>
                <li>
                    <a href="/aluno/favoritos" class="nav-link px-3 ${activePage === 'favoritos' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-heart-fill me-3 ${activePage === 'favoritos' ? '' : 'text-secondary'}"></i> Favoritos
                    </a>
                </li>
                
                <li>
                    <a href="/aluno/carrinho" class="nav-link px-3 d-flex justify-content-between align-items-center ${activePage === 'carrinho' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <div><i class="bi bi-cart3 me-3 ${activePage === 'carrinho' ? '' : 'text-secondary'}"></i> Carrinho</div>
                        <span class="badge bg-danger rounded-pill cart-badge-count-sidebar d-none" style="font-size: 0.7rem;">0</span>
                    </a>
                </li>
                
                <hr class="text-secondary opacity-25 my-2">
                
                <li class="nav-item dropend">
                    <a href="#" class="nav-link link-dark fw-semibold px-3 d-flex justify-content-between align-items-center" id="dropdownNotif" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                        <div><i class="bi bi-bell-fill me-3 text-secondary"></i> Notificações</div>
                        <span id="badgeNotificacoes" class="badge rounded-pill bg-danger d-none shadow-sm">0</span>
                    </a>
                    <ul class="dropdown-menu shadow-lg border-0 rounded-4 p-0" aria-labelledby="dropdownNotif" style="width: 320px; max-height: 400px; overflow-y: auto; z-index: 1050;" id="listaNotificacoesDropdown">
                        <li class="p-4 text-center text-muted small">
                            <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div><br>
                            Carregando notificações...
                        </li>
                    </ul>
                </li>

                <li>
                    <a href="/aluno/perfil" class="nav-link px-3 ${activePage === 'perfil' ? 'active shadow-sm fw-bold' : 'link-dark fw-semibold'}">
                        <i class="bi bi-person-gear me-3 ${activePage === 'perfil' ? '' : 'text-secondary'}"></i> Editar Perfil
                    </a>
                </li>
            </ul>
            
            <hr class="text-secondary opacity-25 mt-4 mb-3">
            
            <a href="/logout" class="nav-link link-danger fw-bold px-3 py-2 rounded-3 bg-danger bg-opacity-10 border border-danger border-opacity-25 transition text-center" style="transition: all 0.2s;">
                <i class="bi bi-box-arrow-right me-2"></i> Sair
            </a>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            fetch('/api/carrinho/count')
                .then(res => res.json())
                .then(data => {
                    const badges = document.querySelectorAll('.cart-badge-count-sidebar');
                    badges.forEach(badge => {
                        if (data.count > 0) {
                            badge.textContent = data.count;
                            badge.classList.remove('d-none');
                        }
                    });
                })
                .catch(err => console.error('Erro ao buscar quantidade do carrinho:', err));
        });
    </script>
    `;
}

module.exports = renderAlunoMenuLateral;