// views/homeView.js

function renderHomeView(usuarioLogado, cursos) {
    let htmlCursosSlider = '';

    if (cursos.length === 0) {
        htmlCursosSlider = `
            <div class="text-center py-5 text-muted w-100">
                <p>Novos cursos estarão disponíveis em breve. Fique atento!</p>
            </div>
        `;
    } else {
        cursos.forEach(curso => {
            const capa = curso.capa_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
            const preco = parseFloat(curso.preco) > 0 ? `R$ ${parseFloat(curso.preco).toFixed(2).replace('.', ',')}` : 'Gratuito';
            const duracao = curso.duracao_horas ? `${curso.duracao_horas}h` : '--h';
            const conclusao = curso.conclusao_dias ? `${curso.conclusao_dias} dias` : '-- dias';
            
            // Converte as tags do mercado para minúsculas para facilitar o filtro depois
            const tagsDoCurso = (curso.mercado || '').toLowerCase();
            
            htmlCursosSlider += `
                <div class="swiper-slide h-auto curso-slide" data-tags="${tagsDoCurso}">
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-shadow transition">
                        
                        <button class="btn btn-light btn-sm rounded-circle shadow-sm position-absolute top-0 end-0 m-3 z-2 text-danger btn-favoritar" data-curso-id="${curso.id}" title="Adicionar aos favoritos">
                            <i class="bi bi-heart"></i>
                        </button>
                        
                        <img src="${capa}" class="card-img-top" alt="${curso.titulo}" style="height: 180px; object-fit: cover;">
                        
                        <div class="card-body d-flex flex-column p-4">
                            <h5 class="fw-bold text-dark text-truncate" title="${curso.titulo}">${curso.titulo}</h5>
                            <p class="text-muted small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                ${curso.descricao || 'Aprenda as melhores práticas e destaque-se no mercado com este curso completo.'}
                            </p>
                            
                            <div class="d-flex align-items-center mb-3 small text-secondary fw-semibold">
                                <span class="me-3" title="Duração do Curso"><i class="bi bi-clock me-1"></i> ${duracao}</span>
                                <span title="Tempo Médio de Conclusão"><i class="bi bi-calendar-check me-1"></i> ${conclusao}</span>
                            </div>
                            
                            <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                                <span class="fw-bold fs-5 text-primary">${preco}</span>
                                <a href="/cursos/${curso.id}" class="btn btn-primary fw-bold px-4 rounded-pill">Comprar</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    const linksCategorias = `
        <a href="#" class="btn btn-dark rounded-pill me-2 mb-2 fw-bold px-4 btn-filter" data-filter="all">⭐ Em Alta</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 mb-2 fw-semibold btn-filter" data-filter="tecnologia">💻 Tecnologia</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 mb-2 fw-semibold btn-filter" data-filter="negócio">📊 Negócios</a>
        
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 mb-2 fw-semibold btn-filter" data-filter="escritório">🗂️ Escritório</a>
        
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 mb-2 fw-semibold btn-filter" data-filter="design">🎨 Design</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 mb-2 fw-semibold btn-filter" data-filter="marketing">📈 Marketing</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 mb-2 fw-semibold btn-filter" data-filter="idioma">🗣️ Idiomas</a>
    `;

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OnStude - Cursos Profissionalizantes Online</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; }
            .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
            .transition { transition: all 0.3s ease; }
            
            .navbar-custom { background-color: #ffffff; border-bottom: 1px solid #eaeaea; }
            .search-bar-header { background-color: #f1f3f4; border: none; border-radius: 50px; padding-left: 40px; }
            
            .hero-section { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); padding: 80px 0; }
            .hero-title { font-size: 3rem; font-weight: 800; color: #1a1a1a; line-height: 1.2; letter-spacing: -1px; }
            .hero-subtitle { font-size: 1.25rem; color: #6c757d; line-height: 1.6; }
            
            .hero-img { border-radius: 24px; object-fit: cover; height: 450px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
            
            .swiper-button-next, .swiper-button-prev { background-color: white; color: #0d6efd; width: 45px; height: 45px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            .swiper-button-next:after, .swiper-button-prev:after { font-size: 1.2rem; font-weight: bold; }

            .hover-white { transition: color 0.3s; }
            .hover-white:hover { color: #ffffff !important; }
        </style>
    </head>
    <body>

        <nav class="navbar navbar-expand-lg navbar-custom sticky-top py-3">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary fs-3" href="/">OnStude<span class="text-dark">.</span></a>
                
                <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarMain">
                    <ul class="navbar-nav ms-lg-4 me-auto align-items-lg-center">
                        <li class="nav-item me-lg-2">
                            <a class="nav-link fw-semibold text-dark hover-primary" href="/plano-de-carreira">Plano de Carreira</a>
                        </li>
                        <li class="nav-item me-lg-3">
                            <a class="nav-link fw-semibold text-dark hover-primary" href="#">Categorias</a>
                        </li>
                        <li class="nav-item mt-3 mt-lg-0" style="min-width: 300px;">
                            <form class="position-relative">
                                <i class="bi bi-search position-absolute top-50 translate-middle-y ms-3 text-muted"></i>
                                <input type="search" class="form-control search-bar-header py-2" placeholder="O que você quer aprender hoje?">
                            </form>
                        </li>
                    </ul>

                    <div class="d-flex flex-column flex-lg-row align-items-lg-center mt-3 mt-lg-0 gap-3">
                        <a href="#" class="text-dark text-decoration-none position-relative me-lg-2 fs-5">
                            <i class="bi bi-cart3"></i>
                            <span class="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" style="width: 10px; height: 10px;"></span>
                        </a>
                        
                        ${usuarioLogado ? `
                            <div class="d-flex align-items-center ms-lg-2">
                                <div class="d-flex align-items-center me-3 text-dark">
                                    ${usuarioLogado.foto_perfil_url 
                                        ? `<img src="${usuarioLogado.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid #0d6efd;">` 
                                        : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-primary text-white fw-bold" style="width: 36px; height: 36px; border: 2px solid #0d6efd; font-size: 14px;">${usuarioLogado.nome.charAt(0).toUpperCase()}</div>`
                                    }
                                    <span class="d-none d-md-inline">Olá, <strong>${usuarioLogado.nome.split(' ')[0]}</strong></span>
                                </div>
                                <a href="${usuarioLogado.tipo === 'ADMIN' ? '/admin' : '/aluno'}" class="btn btn-primary fw-bold px-4 rounded-pill me-2">Meu Painel</a>
                                <a href="/logout" class="btn btn-outline-danger fw-bold px-4 rounded-pill">Sair</a>
                            </div>
                        ` : `
                            <a href="/login?returnTo=/" class="btn btn-outline-dark fw-bold px-4 rounded-pill">Entrar</a>
                            <a href="/cadastro" class="btn btn-primary fw-bold px-4 rounded-pill">Criar Conta</a>
                        `}
                    </div>
                </div>
            </div>
        </nav>

        <section class="hero-section overflow-hidden">
            <div class="container">
                <div class="row align-items-center">
                    
                    <div class="col-lg-6 mb-5 mb-lg-0 pe-lg-5 text-center text-lg-start">
                        <span class="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold">🚀 Plataforma E-learning #1</span>
                        <h1 class="hero-title mb-4">Transforme seu futuro com nossos <span class="text-primary">cursos profissionalizantes</span> online.</h1>
                        <p class="hero-subtitle mb-5">Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho com certificados reconhecidos.</p>
                        
                        <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <a href="#secao-cursos" class="btn btn-primary btn-lg fw-bold px-5 py-3 rounded-pill shadow-sm">Explorar Cursos</a>
                        </div>
                    </div>

                    <div class="col-lg-6 position-relative">
                        <div class="position-absolute top-0 end-0 bg-warning rounded-circle opacity-50 blur" style="width: 300px; height: 300px; filter: blur(60px); z-index: 0; transform: translate(20%, -20%);"></div>
                        <div class="position-absolute bottom-0 start-0 bg-primary rounded-circle opacity-25 blur" style="width: 250px; height: 250px; filter: blur(60px); z-index: 0; transform: translate(-20%, 20%);"></div>

                        <div id="heroCarousel" class="carousel slide carousel-fade shadow-lg rounded-4 overflow-hidden position-relative z-1" data-bs-ride="carousel" data-bs-interval="4000">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80" class="d-block hero-img" alt="Estudante feliz">
                                </div>
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80" class="d-block hero-img" alt="Grupo estudando">
                                </div>
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80" class="d-block hero-img" alt="Jovem no computador">
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section id="secao-cursos" class="pt-5 pb-4 bg-white">
            <div class="container py-4">
                
                <div class="row mb-4 align-items-end">
                    <div class="col-lg-8">
                        <h2 class="fw-bold text-dark mb-3">Uma ampla seleção de cursos</h2>
                        <p class="text-muted fs-5 mb-0">Escolha o seu caminho e comece a estudar hoje mesmo.</p>
                    </div>
                </div>

                <div class="d-flex flex-wrap mb-5">
                    ${linksCategorias}
                </div>

                <div class="p-4 rounded-4 border bg-light position-relative">
                    <div class="swiper mySwiper">
                        <div class="swiper-wrapper py-3">
                            ${htmlCursosSlider}
                        </div>
                    </div>
                    <div class="swiper-button-next d-none d-md-flex"></div>
                    <div class="swiper-button-prev d-none d-md-flex"></div>
                </div>
                
                <div class="text-center mt-5">
                    <a href="#" class="btn btn-outline-primary fw-bold px-5 py-3 rounded-pill">Ver Todos os Cursos</a>
                </div>

            </div>
        </section>

        <section class="py-5 bg-white">
            <div class="container">
                <div class="row align-items-center bg-light border rounded-4 p-4 p-md-5 mx-0 shadow-sm position-relative overflow-hidden">
                    
                    <div class="position-absolute top-0 end-0 bg-primary opacity-10 rounded-circle" style="width: 250px; height: 250px; transform: translate(30%, -30%);"></div>

                    <div class="col-lg-7 position-relative z-1 mb-4 mb-lg-0 pe-lg-5">
                        <h2 class="fw-bold text-dark mb-3">O plano de carreira melhora seu currículo</h2>
                        <h6 class="fw-bold text-primary mb-3">Tenha mais visibilidade nos processos seletivos</h6>
                        <p class="small text-muted mb-0 lh-lg" style="text-align: justify;">
                            É uma ferramenta que auxilia os usuários na construção de currículos e na
                            análise de expectativas profissionais. Com orientações personalizadas e recursos
                            de análise de mercado, a ferramenta ajuda a alinhar habilidades e objetivos com
                            as demandas atuais, potencializando as perspectivas de carreira.
                        </p>
                        <a href="/plano-de-carreira" class="btn btn-primary fw-bold px-4 rounded-pill mt-4 shadow-sm">Construir meu currículo</a>
                    </div>
                    
                    <div class="col-lg-5 position-relative z-1 text-center">
                        <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80" alt="Análise de Carreira e Currículo" class="img-fluid rounded-4 shadow" style="max-height: 280px; object-fit: cover; width: 100%;">
                    </div>

                </div>
            </div>
        </section>

        <footer class="bg-dark text-white pt-5 pb-3 mt-5">
            <div class="container">
                <div class="row mb-4">
                    
                    <div class="col-lg-5 mb-4 mb-lg-0">
                        <h3 class="fw-bold text-primary mb-3">OnStude<span class="text-white">.</span></h3>
                        <p class="text-white-50 small pe-lg-5">
                            Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho com certificados reconhecidos.
                        </p>
                    </div>
                    
                    <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <h5 class="fw-bold mb-4 text-light">Acesso Rápido</h5>
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Quem Somos</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Fale Conosco</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Termos de Uso</a></li>
                        </ul>
                    </div>

                    <div class="col-lg-3 col-md-6">
                        <h5 class="fw-bold mb-4 text-light">Suporte</h5>
                        <p class="text-white-50 small mb-1"><i class="bi bi-envelope me-2"></i> suporte@onstude.com</p>
                    </div>

                </div>

                <hr class="border-secondary mb-4 opacity-25">

                <div class="row align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        <small class="text-white-50">&copy; 2026 OnStude. Todos os direitos reservados.</small>
                    </div>
                    
                    <div class="col-md-6 text-center text-md-end d-flex align-items-center justify-content-center justify-content-md-end">
                        <small class="text-white-50 me-3">Desenvolvido por <strong class="text-light">71dev</strong></small>
                        <a href="https://www.instagram.com/71dev_/" target="_blank" class="text-white-50 text-decoration-none fs-5 mx-2 hover-white transition" title="Instagram 71dev">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a href="https://wa.me/5571983174920" target="_blank" class="text-white-50 text-decoration-none fs-5 ms-2 hover-white transition" title="WhatsApp 71dev">
                            <i class="bi bi-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

        <script>
            // Passa a informação do backend para o Javascript (se o usuário está logado ou não)
            const isUsuarioLogado = ${usuarioLogado ? 'true' : 'false'};

            document.addEventListener('DOMContentLoaded', function () {
                var swiper = new Swiper(".mySwiper", {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false,
                    },
                    loop: false,
                    navigation: {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                    },
                    breakpoints: {
                        576: { slidesPerView: 2, spaceBetween: 20 },
                        992: { slidesPerView: 3, spaceBetween: 30 },
                        1200: { slidesPerView: 4, spaceBetween: 30 },
                    },
                });

                // ==========================================
                // SISTEMA DE FILTRO DE CATEGORIAS (TAGS)
                // ==========================================
                
                // 1. Guarda na memória TODOS os slides gerados inicialmente
                const todosOsSlidesNodes = Array.from(document.querySelectorAll('.curso-slide'));
                const swiperWrapper = document.querySelector('.swiper-wrapper');
                const botoesFiltro = document.querySelectorAll('.btn-filter');

                botoesFiltro.forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();

                        // Alterna as cores dos botões para mostrar qual está ativo
                        botoesFiltro.forEach(b => {
                            b.classList.remove('btn-dark', 'fw-bold', 'px-4');
                            b.classList.add('btn-outline-secondary', 'fw-semibold');
                        });
                        this.classList.remove('btn-outline-secondary', 'fw-semibold');
                        this.classList.add('btn-dark', 'fw-bold', 'px-4');

                        // Descobre qual categoria foi clicada
                        const filtro = this.getAttribute('data-filter').toLowerCase();
                        
                        // Remove todos os slides atuais da tela usando a API do Swiper
                        swiper.removeAllSlides();
                        
                        // Limpa a mensagem de vazio, se existir de cliques anteriores
                        const emptyMsg = swiperWrapper.querySelector('.swiper-no-slides');
                        if (emptyMsg) emptyMsg.remove();

                        // Filtra os slides guardados
                        const slidesFiltrados = todosOsSlidesNodes.filter(slide => {
                            const tags = slide.getAttribute('data-tags');
                            // Se for "all", passa. Se não, verifica se as tags do curso incluem a palavra filtrada
                            return filtro === 'all' || tags.includes(filtro);
                        });

                        // Se tiver cursos, insere-os de volta. Se não, exibe aviso.
                        if (slidesFiltrados.length > 0) {
                            swiper.appendSlide(slidesFiltrados);
                        } else {
                            swiperWrapper.innerHTML = '<div class="w-100 text-center py-5 text-muted swiper-no-slides">Nenhum curso encontrado nesta categoria no momento.</div>';
                        }

                        // Atualiza o layout do carrossel e recomeça do primeiro card
                        swiper.update();
                        swiper.slideTo(0);
                    });
                });

                // ==========================================
                // BOTÃO FAVORITAR (USANDO EVENT DELEGATION)
                // ==========================================
                // Como os cartões entram e saem da tela com o filtro, 
                // delegamos o clique ao "body" para não perdermos o Event Listener
                document.body.addEventListener('click', function(e) {
                    const btn = e.target.closest('.btn-favoritar');
                    if (!btn) return;
                    
                    e.preventDefault();
                    
                    // 1. Bloqueia e redireciona caso não tenha conta
                    if (!isUsuarioLogado) {
                        window.location.href = '/login?returnTo=/';
                        return;
                    }

                    // 2. Se tiver conta, dispara o request para o servidor
                    const cursoId = btn.getAttribute('data-curso-id');
                    const icon = btn.querySelector('i');
                    
                    // Feedback visual imediato (Optimistic UI)
                    const isFavorited = icon.classList.contains('bi-heart-fill');
                    if (isFavorited) {
                        icon.classList.replace('bi-heart-fill', 'bi-heart');
                    } else {
                        icon.classList.replace('bi-heart', 'bi-heart-fill');
                    }

                    // Chamada real para a API
                    fetch('/aluno/api/favoritos/toggle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ curso_id: cursoId })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.success) {
                            alert('Ocorreu um erro ao atualizar os favoritos.');
                            // Reverte o ícone caso a API falhe
                            if (isFavorited) {
                                icon.classList.replace('bi-heart', 'bi-heart-fill');
                            } else {
                                icon.classList.replace('bi-heart-fill', 'bi-heart');
                            }
                        }
                    })
                    .catch(err => {
                        console.error('Erro de conexão:', err);
                    });
                });

            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderHomeView;