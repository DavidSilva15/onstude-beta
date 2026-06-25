// views/adminMenuLateral.js

// Lê a versão diretamente do package.json para refletir os bumps do Husky automaticamente
let appVersion = '1.0.0';
try {
    const packageJson = require('../package.json');
    if (packageJson.version) {
        appVersion = packageJson.version;
    }
} catch (error) {
    console.warn('Aviso: Não foi possível ler o package.json para obter a versão.');
}

function renderAdminMenuLateral(admin, activePage = 'dashboard') {
    // Verifica se o usuário é Mentor
    const isMentor = admin.tipo === 'MENTOR';

    // Funções auxiliares para destacar o menu ativo
    const isActive = (page) => activePage === page ? 'active bg-primary text-white shadow-sm' : 'text-dark hover-bg-light';
    const isIconActive = (page) => activePage === page ? 'text-white' : 'text-muted';

    // Lista de Links Centralizada (Fontes e Ícones reduzidos)
    const menuItems = `
        <ul class="nav nav-pills flex-column mb-auto gap-1 px-3">
            <li class="nav-item">
                <a href="/admin" class="nav-link ${isActive('dashboard')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-speedometer2 me-2 fs-6 ${isIconActive('dashboard')}"></i> Dashboard
                </a>
            </li>
            <li>
                <a href="/admin/cursos" class="nav-link ${isActive('cursos')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-play-btn me-2 fs-6 ${isIconActive('cursos')}"></i> Cursos
                </a>
            </li>
            <li>
                <a href="/admin/usuarios" class="nav-link ${isActive('usuarios')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-people me-2 fs-6 ${isIconActive('usuarios')}"></i> Usuários
                </a>
            </li>
            ${!isMentor ? `
            <li>
                <a href="/admin/curriculos" class="nav-link ${isActive('curriculos')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-file-earmark-word me-2 fs-6 ${isIconActive('curriculos')}"></i> Currículos
                </a>
            </li>
            ` : ''}
            <li>
                <a href="/admin/notificacoes" class="nav-link ${isActive('notificacoes')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-bell me-2 fs-6 ${isIconActive('notificacoes')}"></i> Notificações
                </a>
            </li>
            <li>
                <a href="/forum" class="nav-link ${isActive('forum')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-chat-square-text me-2 fs-6 ${isIconActive('forum')}"></i> Fórum
                </a>
            </li>
            ${!isMentor ? `
            <li>
                <a href="/admin/integracoes" class="nav-link ${isActive('integracoes')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-box-arrow-up-right me-2 fs-6 ${isIconActive('integracoes')}"></i> Integrações / API
                </a>
            </li>
            <li>
                <a href="/dev/testes" class="nav-link ${isActive('testes')} fw-semibold py-2 px-3 mb-1" style="font-size: 0.85rem;">
                    <i class="bi bi-cpu me-2 fs-6 ${isIconActive('testes')}"></i> Lab. de Testes
                </a>
            </li>
            ` : ''}
        </ul>
    `;

    // Dropdown de Perfil Centralizado (Elementos Menores)
    const cargoUsuario = isMentor ? 'Mentor' : 'Administrador';

    const userDropdown = `
        <div class="dropdown mt-3 border-top pt-3 px-3 pb-3">
            <a href="#" class="d-flex align-items-center link-dark text-decoration-none dropdown-toggle w-100" data-bs-toggle="dropdown" aria-expanded="false">
                ${admin.foto_perfil_url 
                    ? `<img src="${admin.foto_perfil_url}" alt="Foto" width="35" height="35" class="rounded-circle me-2 border" style="object-fit: cover;">` 
                    : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-primary text-white fw-bold shadow-sm" style="width: 35px; height: 35px; font-size: 14px;">${admin.nome.charAt(0).toUpperCase()}</div>`
                }
                <div class="d-flex flex-column text-truncate">
                    <strong class="text-truncate" style="max-width: 130px; font-size: 0.85rem;">${admin.nome.split(' ')[0]}</strong>
                    <span class="text-muted" style="font-size: 0.7rem;">${cargoUsuario}</span>
                </div>
            </a>
            <ul class="dropdown-menu text-small shadow w-100 rounded-3 border-0" style="font-size: 0.85rem;">
                <li><a class="dropdown-item fw-semibold py-2" href="#"><i class="bi bi-gear me-2"></i> Configurações</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item text-danger fw-bold py-2" href="/logout"><i class="bi bi-box-arrow-right me-2"></i> Sair</a></li>
            </ul>
        </div>
    `;

    return `
    <style>
        .hover-bg-light:hover { background-color: #f1f3f5; }
        .admin-sidebar { width: 250px; height: 100vh; position: sticky; top: 0; z-index: 1000; }
        @media (max-width: 991.98px) {
            .admin-sidebar { display: none !important; }
        }
    </style>

    <div class="d-flex flex-column flex-shrink-0 bg-white border-end shadow-sm admin-sidebar d-none d-lg-flex">
        <div class="mb-4 mt-4 px-4 d-flex flex-column">
            <a href="/admin" class="d-flex align-items-center link-dark text-decoration-none lh-1">
                <span class="fs-3 fw-bold text-primary">OnStude<span class="text-dark fw-light">.</span></span>
            </a>
            <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill mt-2 fw-medium" style="font-size: 0.65rem; width: fit-content; letter-spacing: 0.5px;">v${appVersion}</span>
        </div>
        ${menuItems}
        <div class="mt-auto">
            ${userDropdown}
        </div>
    </div>

    <nav class="navbar navbar-dark bg-dark d-lg-none px-3 py-2 shadow-sm w-100 sticky-top">
        <div class="d-flex flex-column">
            <a class="navbar-brand fw-bold text-primary lh-1 mb-0" href="/admin">OnStude<span class="text-white fw-light">.</span></a>
            <span class="text-white-50 mt-1" style="font-size: 0.6rem; letter-spacing: 0.5px;">v${appVersion}</span>
        </div>
        <button class="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar">
            <span class="navbar-toggler-icon"></span>
        </button>
    </nav>

    <div class="offcanvas offcanvas-start border-0 shadow" tabindex="-1" id="offcanvasSidebar">
        <div class="offcanvas-header border-bottom pb-3 d-flex flex-column align-items-start">
            <div class="d-flex justify-content-between w-100 align-items-center mb-1">
                <h5 class="offcanvas-title fw-bold text-primary fs-3 lh-1">OnStude<span class="text-dark fw-light">.</span></h5>
                <button type="button" class="btn-close shadow-none" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill fw-medium mt-1" style="font-size: 0.65rem; letter-spacing: 0.5px;">v${appVersion}</span>
        </div>
        <div class="offcanvas-body d-flex flex-column p-0 pt-4">
            ${menuItems}
            <div class="mt-auto">
                ${userDropdown}
            </div>
        </div>
    </div>
    `;
}

module.exports = renderAdminMenuLateral;