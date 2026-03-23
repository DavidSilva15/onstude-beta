// views/adminSidebar.js

function renderAdminMenuLateral(admin, activePage = 'dashboard') {
    // Funções auxiliares para destacar o menu ativo
    const isActive = (page) => activePage === page ? 'active bg-primary text-white shadow-sm' : 'text-dark hover-bg-light';
    const isIconActive = (page) => activePage === page ? 'text-white' : 'text-muted';

    // Lista de Links Centralizada
    const menuItems = `
        <ul class="nav nav-pills flex-column mb-auto gap-1 px-2">
            <li class="nav-item">
                <a href="/admin" class="nav-link ${isActive('dashboard')} fw-semibold py-2">
                    <i class="bi bi-speedometer2 me-3 fs-5 ${isIconActive('dashboard')}"></i> Dashboard
                </a>
            </li>
            <li>
                <a href="/admin/cursos" class="nav-link ${isActive('cursos')} fw-semibold py-2">
                    <i class="bi bi-play-btn me-3 fs-5 ${isIconActive('cursos')}"></i> Cursos
                </a>
            </li>
            <li>
                <a href="/admin/usuarios" class="nav-link ${isActive('usuarios')} fw-semibold py-2">
                    <i class="bi bi-people me-3 fs-5 ${isIconActive('usuarios')}"></i> Usuários
                </a>
            </li>
            <li>
                <a href="/admin/curriculos" class="nav-link ${isActive('curriculos')} fw-semibold py-2">
                    <i class="bi bi-file-earmark-word me-3 fs-5 ${isIconActive('curriculos')}"></i> Currículos
                </a>
            </li>
            <li>
                <a href="/admin/notificacoes" class="nav-link ${isActive('notificacoes')} fw-semibold py-2">
                    <i class="bi bi-bell me-3 fs-5 ${isIconActive('notificacoes')}"></i> Notificações
                </a>
            </li>
            <li>
                <a href="/forum" class="nav-link ${isActive('forum')} fw-semibold py-2">
                    <i class="bi bi-chat-square-text me-3 fs-5 ${isIconActive('forum')}"></i> Fórum
                </a>
            </li>
            <li>
                <a href="/admin/integracoes" class="nav-link ${isActive('integracoes')} fw-semibold py-2">
                    <i class="bi bi-box-arrow-up-right me-3 fs-5 ${isIconActive('integracoes')}"></i> Integrações / API
                </a>
            </li>
        </ul>
    `;

    // Dropdown de Perfil Centralizado
    const userDropdown = `
        <div class="dropdown mt-3 border-top pt-3 px-3 pb-3">
            <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle w-100" data-bs-toggle="dropdown" aria-expanded="false">
                ${admin.foto_perfil_url 
                    ? `<img src="${admin.foto_perfil_url}" alt="Foto" width="40" height="40" class="rounded-circle me-3 border" style="object-fit: cover;">` 
                    : `<div class="rounded-circle me-3 d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm" style="width: 40px; height: 40px; font-size: 16px;">${admin.nome.charAt(0).toUpperCase()}</div>`
                }
                <div class="d-flex flex-column text-truncate">
                    <strong class="text-truncate" style="max-width: 140px;">${admin.nome.split(' ')[0]}</strong>
                    <span class="text-muted small">Administrador</span>
                </div>
            </a>
            <ul class="dropdown-menu text-small shadow w-100 rounded-3 border-0">
                <li><a class="dropdown-item fw-semibold" href="#"><i class="bi bi-gear me-2"></i> Configurações</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger fw-bold" href="/logout"><i class="bi bi-box-arrow-right me-2"></i> Sair do Painel</a></li>
            </ul>
        </div>
    `;

    return `
    <style>
        .hover-bg-light:hover { background-color: #f1f3f5; }
        .admin-sidebar { width: 280px; height: 100vh; position: sticky; top: 0; z-index: 1000; }
        @media (max-width: 991.98px) {
            .admin-sidebar { display: none !important; }
        }
    </style>

    <div class="d-flex flex-column flex-shrink-0 bg-white border-end shadow-sm admin-sidebar d-none d-lg-flex">
        <a href="/admin" class="d-flex align-items-center mb-4 mt-4 px-4 link-dark text-decoration-none">
            <span class="fs-3 fw-bold text-primary">OnStude<span class="text-dark fw-light">.</span></span>
        </a>
        ${menuItems}
        <div class="mt-auto">
            ${userDropdown}
        </div>
    </div>

    <nav class="navbar navbar-dark bg-dark d-lg-none px-3 py-2 shadow-sm w-100 sticky-top">
        <a class="navbar-brand fw-bold text-primary" href="/admin">OnStude<span class="text-white fw-light">.</span></a>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar">
            <span class="navbar-toggler-icon"></span>
        </button>
    </nav>

    <div class="offcanvas offcanvas-start border-0 shadow" tabindex="-1" id="offcanvasSidebar">
        <div class="offcanvas-header border-bottom">
            <h5 class="offcanvas-title fw-bold text-primary fs-3">OnStude<span class="text-dark fw-light">.</span></h5>
            <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column p-0 pt-3">
            ${menuItems}
            <div class="mt-auto">
                ${userDropdown}
            </div>
        </div>
    </div>
    `;
}

module.exports = renderAdminMenuLateral;