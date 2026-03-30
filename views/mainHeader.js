// views/mainHeader.js

function renderMainHeader(usuarioLogado) {
    // Define a rota do coração (Favoritos) baseada no status de login
    const linkFavoritos = usuarioLogado ? '/aluno/favoritos' : '/login?returnTo=/';

    return `
        <nav class="navbar navbar-expand-lg navbar-custom sticky-top py-3">
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
                            <a class="nav-link fw-semibold text-dark hover-primary" href="/#secao-cursos">Categorias</a>
                        </li>
                        <li class="nav-item me-lg-3">
                            <a class="nav-link fw-semibold text-dark hover-primary" href="/forum">Fórum</a>
                        </li>
                        <li class="nav-item mt-2 mt-lg-0" style="min-width: 250px;">
                            <form class="position-relative">
                                <i class="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                <input type="search" class="form-control search-bar-header py-2" placeholder="O que deseja aprender?">
                            </form>
                        </li>
                    </ul>

                    <div class="d-flex flex-column flex-lg-row align-items-lg-center mt-3 mt-lg-0 gap-3">
                        
                        <div class="d-none d-lg-flex gap-3 align-items-center me-lg-2">
                            <a href="${linkFavoritos}" class="text-dark text-decoration-none fs-5 hover-primary transition" title="Meus Favoritos">
                                <i class="bi bi-heart"></i>
                            </a>
                            <a href="#" class="text-dark text-decoration-none position-relative fs-5 hover-primary transition" title="Carrinho">
                                <i class="bi bi-cart3"></i>
                                <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style="width: 10px; height: 10px;"></span>
                            </a>
                        </div>

                        <div class="d-flex gap-3 align-items-center d-lg-none mt-2">
                            <a href="${linkFavoritos}" class="text-dark text-decoration-none fw-semibold hover-primary"><i class="bi bi-heart me-1"></i> Favoritos</a>
                            <a href="#" class="text-dark text-decoration-none fw-semibold hover-primary ms-3"><i class="bi bi-cart3 me-1"></i> Carrinho</a>
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
    `;
}

module.exports = renderMainHeader;