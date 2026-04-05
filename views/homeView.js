// views/homeView.js
const renderMainHeader = require('./mainHeader');

function renderHomeView(usuarioLogado, cursos) {
    let htmlCursosSlider = '';

    // Função auxiliar para formatar os segundos totais em Horas/Minutos legíveis
    const formatarDuracao = (segundosTotais) => {
        if (!segundosTotais || segundosTotais == 0) return '0h';
        const horas = Math.floor(segundosTotais / 3600);
        const minutos = Math.floor((segundosTotais % 3600) / 60);
        
        if (horas > 0 && minutos > 0) return `${horas}h ${minutos}m`;
        if (horas > 0) return `${horas}h`;
        return `${minutos}m`;
    };

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
            
            // Lógica da Duração Automática
            const duracao = curso.duracao_total_segundos !== undefined 
                            ? formatarDuracao(curso.duracao_total_segundos) 
                            : (curso.duracao_horas ? `${curso.duracao_horas}h` : '--h');

            // Lógica de Conclusão baseada em 2h de estudo diário
            let conclusao = '-- dias';
            if (curso.duracao_total_segundos > 0) {
                const horasTotais = curso.duracao_total_segundos / 3600;
                const diasCalculados = Math.ceil(horasTotais / 2);
                const diasFinais = diasCalculados < 1 ? 1 : diasCalculados;
                conclusao = `${diasFinais} dia${diasFinais > 1 ? 's' : ''}`;
            } else if (curso.conclusao_dias) {
                conclusao = `${curso.conclusao_dias} dias`;
            }
            
            // Converte as tags do mercado para minúsculas para facilitar o filtro depois
            const tagsDoCurso = (curso.mercado || '').toLowerCase();
            
            // GERAR ESTRELAS DA AVALIAÇÃO
            let estrelasHtml = '';
            const nota = Math.round(parseFloat(curso.nota_media) || 0);
            for (let i = 1; i <= 5; i++) {
                if (i <= nota) {
                    estrelasHtml += '<i class="bi bi-star-fill text-warning"></i>';
                } else {
                    estrelasHtml += '<i class="bi bi-star text-warning opacity-50"></i>';
                }
            }
            
            htmlCursosSlider += `
                <div class="swiper-slide h-auto curso-slide" data-tags="${tagsDoCurso}">
                    <div class="card h-100 border-0 rounded-4 overflow-hidden position-relative hover-shadow transition glass-card">
                        
                        <button class="btn btn-light btn-sm rounded-circle shadow-sm position-absolute top-0 end-0 m-2 z-2 text-danger btn-favoritar" data-curso-id="${curso.id}" title="Adicionar aos favoritos" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);">
                            <i class="bi bi-heart"></i>
                        </button>
                        
                        <a href="/cursos/${curso.id}" class="text-decoration-none d-block h-100">
                            <img src="${capa}" class="card-img-top border-bottom border-light border-opacity-25" alt="${curso.titulo}" style="height: 160px; object-fit: cover;">
                            
                            <div class="card-body d-flex flex-column p-3">
                                <h6 class="fw-bold text-dark text-truncate mb-2" title="${curso.titulo}">${curso.titulo}</h6>
                                <p class="text-muted small mb-2 flex-grow-1" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.85rem; line-height: 1.4;">
                                    ${curso.descricao || 'Aprenda as melhores práticas e destaque-se no mercado com este curso completo.'}
                                </p>
                                
                                <div class="d-flex align-items-center mb-3">
                                    <div class="text-warning me-1" style="font-size: 0.7rem; letter-spacing: 1px;">
                                        ${estrelasHtml}
                                    </div>
                                    <span class="text-muted fw-semibold" style="font-size: 0.65rem;">
                                        (${curso.total_avaliacoes || 0})
                                    </span>
                                    <i class="bi bi-info-circle ms-2 text-secondary opacity-75" style="font-size: 0.7rem;" data-bs-toggle="tooltip" data-bs-placement="top" title="100% das avaliações foram feitas de alunos que concluíram o curso."></i>
                                </div>
                                
                                <div class="d-flex align-items-center mb-3 small text-secondary fw-semibold" style="font-size: 0.8rem;">
                                    <span class="me-3" title="Soma do tempo de todas as aulas"><i class="bi bi-clock text-primary me-1"></i> ${duracao}</span>
                                    <span title="Estimativa baseada em 2h de estudo/dia"><i class="bi bi-calendar-check text-success me-1"></i> ${conclusao}</span>
                                </div>
                                
                                <div class="mt-auto pt-3 border-top border-secondary border-opacity-10 d-flex justify-content-between align-items-center">
                                    <span class="fw-bold text-primary">${preco}</span>
                                    <span class="btn btn-primary btn-sm fw-bold px-3 rounded-pill shadow-sm">Ver Curso</span>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            `;
        });
    }

    const linksCategorias = `
        <a href="#" class="btn btn-dark rounded-pill me-2 fw-bold px-4 btn-filter flex-shrink-0 shadow-sm" data-filter="all">⭐ Em Alta</a>
        <a href="#" class="btn btn-outline-dark bg-white bg-opacity-50 rounded-pill me-2 fw-semibold btn-filter flex-shrink-0 shadow-sm" data-filter="tecnologia">💻 Tecnologia</a>
        <a href="#" class="btn btn-outline-dark bg-white bg-opacity-50 rounded-pill me-2 fw-semibold btn-filter flex-shrink-0 shadow-sm" data-filter="negócio">📊 Negócios</a>
        <a href="#" class="btn btn-outline-dark bg-white bg-opacity-50 rounded-pill me-2 fw-semibold btn-filter flex-shrink-0 shadow-sm" data-filter="escritório">🗂️ Escritório</a>
        <a href="#" class="btn btn-outline-dark bg-white bg-opacity-50 rounded-pill me-2 fw-semibold btn-filter flex-shrink-0 shadow-sm" data-filter="design">🎨 Design</a>
        <a href="#" class="btn btn-outline-dark bg-white bg-opacity-50 rounded-pill me-2 fw-semibold btn-filter flex-shrink-0 shadow-sm" data-filter="marketing">📈 Marketing</a>
        <a href="#" class="btn btn-outline-dark bg-white bg-opacity-50 rounded-pill me-2 fw-semibold btn-filter flex-shrink-0 shadow-sm" data-filter="idioma">🗣️ Idiomas</a>
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
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #212529; overflow-x: hidden; position: relative; }
            .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 1rem 2rem rgba(0,0,0,.15)!important; }
            .transition { transition: all 0.3s ease; }
            
            /* ==========================================
               GRADIENT MESH BACKGROUND (NOVO)
               ========================================== */
            .mesh-bg {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: -1;
                background-color: #f4f7f6;
                overflow: hidden;
            }
            .mesh-blob-1, .mesh-blob-2, .mesh-blob-3 {
                position: absolute;
                border-radius: 50%;
                filter: blur(90px);
                opacity: 0.25;
                animation: floatAnim 20s infinite ease-in-out alternate;
            }
            .mesh-blob-1 {
                top: -10%; left: -10%;
                width: 50vw; height: 50vw;
                background: #0d6efd; /* Primary OnStude */
                animation-delay: 0s;
            }
            .mesh-blob-2 {
                bottom: -20%; right: -10%;
                width: 60vw; height: 60vw;
                background: #0dcaf0; /* Info Cyan */
                animation-delay: -5s;
            }
            .mesh-blob-3 {
                top: 30%; left: 40%;
                width: 45vw; height: 45vw;
                background: #6610f2; /* Indigo/Purple Accent */
                animation-delay: -10s;
            }
            @keyframes floatAnim {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(5%, 15%) scale(1.1); }
                66% { transform: translate(-10%, 5%) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
            }

            /* ==========================================
               GLASSMORPHISM CARDS (HARMONIZAÇÃO)
               ========================================== */
            .glass-card {
                background: rgba(255, 255, 255, 0.65) !important;
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.8) !important;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05);
            }
            .glass-nav {
                background: rgba(255, 255, 255, 0.85) !important;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.5) !important;
            }
            
            .search-bar-header { background-color: rgba(241, 243, 244, 0.8); border: 1px solid rgba(255,255,255,0.5); border-radius: 50px; padding-left: 40px; backdrop-filter: blur(4px); }
            
            .hero-section { padding: 80px 0; } /* Removido o fundo sólido para o mesh aparecer */
            .hero-title { font-size: 3.2rem; font-weight: 800; color: #1a1a1a; line-height: 1.2; letter-spacing: -1px; }
            .hero-subtitle { font-size: 1.25rem; color: #495057; line-height: 1.6; font-weight: 500; }
            .hero-img { border-radius: 24px; object-fit: cover; height: 450px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.15); border: 4px solid rgba(255,255,255,0.5); }
            
            .swiper-button-next, .swiper-button-prev { background-color: rgba(255,255,255,0.9); color: #0d6efd; width: 40px; height: 40px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); backdrop-filter: blur(4px); }
            .swiper-button-next:after, .swiper-button-prev:after { font-size: 1.1rem; font-weight: bold; }

            .hover-white { transition: color 0.3s; }
            .hover-white:hover { color: #ffffff !important; }

            /* Mobile Horizontal Scroll for Filters */
            .hide-scrollbar {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
            }
            .hide-scrollbar::-webkit-scrollbar {
                display: none; /* Chrome, Safari and Opera */
            }

            /* ==========================================
               CLASSES DE ANIMAÇÃO DE SCROLL (REVEAL)
               ========================================== */
            .reveal-up { opacity: 0; transform: translateY(50px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-left { opacity: 0; transform: translateX(-50px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-right { opacity: 0; transform: translateX(50px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-scale { opacity: 0; transform: scale(0.9); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            
            /* Estado Ativo */
            .reveal-visible { opacity: 1; transform: translate(0) scale(1); }
            
            /* Delays para efeito cascata */
            .delay-100 { transition-delay: 100ms; }
            .delay-200 { transition-delay: 200ms; }
            .delay-300 { transition-delay: 300ms; }

            /* Responsive Adjustments */
            @media (max-width: 991.98px) {
                .search-bar-header { margin-top: 15px; width: 100%; }
            }
            
            @media (max-width: 767.98px) {
                .hero-section { padding: 40px 0; }
                .hero-title { font-size: 2.2rem; }
                .hero-subtitle { font-size: 1rem; margin-bottom: 1.5rem !important; }
                .hero-img { height: 280px; }
                .btn-lg { padding: 0.6rem 1.5rem; font-size: 1rem; }
                .career-banner-img { max-height: 200px !important; }
                
                /* Reduz animações agressivas no mobile */
                .reveal-left, .reveal-right { transform: translateY(30px); }
            }
        </style>
    </head>
    <body>

        <div class="mesh-bg">
            <div class="mesh-blob-1"></div>
            <div class="mesh-blob-2"></div>
            <div class="mesh-blob-3"></div>
        </div>

        <div class="header-wrapper glass-nav sticky-top">
            ${renderMainHeader(usuarioLogado)}
        </div>

        <section class="hero-section overflow-hidden">
            <div class="container">
                <div class="row align-items-center">
                    
                    <div class="col-lg-6 mb-4 mb-lg-0 pe-lg-5 text-center text-lg-start reveal-left">
                        <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 shadow-sm mb-3 px-3 py-2 rounded-pill fw-bold">🚀 Plataforma E-learning #1</span>
                        <h1 class="hero-title mb-3">Transforme seu futuro com nossos <span class="text-primary">cursos profissionalizantes</span> online.</h1>
                        <p class="hero-subtitle mb-4">Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho com certificados reconhecidos.</p>
                        
                        <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <a href="#secao-cursos" class="btn btn-primary btn-lg fw-bold px-4 py-2 rounded-pill shadow-sm">Explorar</a>
                        </div>
                    </div>

                    <div class="col-lg-6 position-relative reveal-right delay-200">
                        <div id="heroCarousel" class="carousel slide carousel-fade rounded-4 overflow-hidden position-relative z-1" data-bs-ride="carousel" data-bs-interval="4000">
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

        <section id="secao-cursos" class="pt-5 pb-4 overflow-hidden">
            <div class="container py-3">
                
                <div class="row mb-3 align-items-end reveal-up">
                    <div class="col-lg-8 text-center text-md-start">
                        <h2 class="fw-bold text-dark mb-2">Uma ampla seleção de cursos</h2>
                        <p class="text-muted fs-6 mb-0">Escolha o seu caminho e comece a estudar hoje mesmo.</p>
                    </div>
                </div>

                <div class="d-flex overflow-x-auto hide-scrollbar mb-4 pb-2 reveal-up delay-100" style="-webkit-overflow-scrolling: touch;">
                    ${linksCategorias}
                </div>

                <div class="p-3 p-md-4 rounded-4 glass-card position-relative reveal-up delay-200">
                    <div class="swiper mySwiper">
                        <div class="swiper-wrapper py-2">
                            ${htmlCursosSlider}
                        </div>
                    </div>
                    <div class="swiper-button-next d-none d-md-flex"></div>
                    <div class="swiper-button-prev d-none d-md-flex"></div>
                </div>
                
                <div class="text-center mt-4 reveal-up delay-300">
                    <a href="/categorias" class="btn btn-outline-primary bg-white bg-opacity-50 fw-bold px-4 py-2 rounded-pill shadow-sm" style="backdrop-filter: blur(4px);">Ver Todas as Categorias</a>
                </div>

            </div>
        </section>

        <section class="py-4 py-md-5 overflow-hidden">
            <div class="container">
                <div class="row align-items-center glass-card rounded-4 p-3 p-md-4 mx-0 position-relative overflow-hidden">
                    
                    <div class="col-lg-7 position-relative z-1 mb-4 mb-lg-0 pe-lg-4 text-center text-md-start reveal-left">
                        <h2 class="fw-bold text-dark mb-2 fs-3">O plano de carreira melhora seu currículo</h2>
                        <h6 class="fw-bold text-primary mb-3">Tenha mais visibilidade nos processos seletivos</h6>
                        <p class="small text-muted mb-0 lh-base text-start">
                            É uma ferramenta que auxilia os usuários na construção de currículos e na
                            análise de expectativas profissionais. Com orientações personalizadas e recursos
                            de análise de mercado, a ferramenta ajuda a alinhar habilidades e objetivos com
                            as demandas atuais, potencializando as perspectivas de carreira.
                        </p>
                        <a href="/plano-de-carreira" class="btn btn-primary btn-sm fw-bold px-4 rounded-pill mt-4 shadow-sm">Construir meu currículo</a>
                    </div>
                    
                    <div class="col-lg-5 position-relative z-1 text-center reveal-right delay-200">
                        <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80" alt="Análise de Carreira e Currículo" class="img-fluid rounded-4 shadow career-banner-img border border-white" style="max-height: 280px; object-fit: cover; width: 100%;">
                    </div>

                </div>
            </div>
        </section>

        <footer class="bg-dark text-white pt-5 pb-3 mt-4 overflow-hidden" style="border-top: 1px solid rgba(255,255,255,0.1);">
            <div class="container reveal-up">
                <div class="row mb-4 text-center text-md-start">
                    
                    <div class="col-lg-5 mb-4 mb-lg-0">
                        <h3 class="fw-bold text-primary mb-3">OnStude<span class="text-white">.</span></h3>
                        <p class="text-white-50 small pe-lg-5 mb-0">
                            Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho com certificados reconhecidos.
                        </p>
                    </div>
                    
                    <div class="col-md-6 col-lg-4 mb-4 mb-md-0">
                        <h6 class="fw-bold mb-3 text-light">Acesso Rápido</h6>
                        <ul class="list-unstyled small">
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Quem Somos</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Fale Conosco</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Termos de Uso</a></li>
                        </ul>
                    </div>

                    <div class="col-md-6 col-lg-3">
                        <h6 class="fw-bold mb-3 text-light">Suporte</h6>
                        <p class="text-white-50 small mb-1"><i class="bi bi-envelope me-2"></i> suporte@onstude.com</p>
                    </div>

                </div>

                <hr class="border-secondary mb-3 opacity-25">

                <div class="row align-items-center">
                    <div class="col-md-6 text-center text-md-start mb-2 mb-md-0">
                        <small class="text-white-50" style="font-size: 0.75rem;">&copy; ${new Date().getFullYear()} OnStude. Todos os direitos reservados.</small>
                    </div>
                    
                    <div class="col-md-6 text-center text-md-end d-flex align-items-center justify-content-center justify-content-md-end">
                        <small class="text-white-50 me-2" style="font-size: 0.75rem;">Desenvolvido por <strong class="text-light">71dev</strong></small>
                        <a href="https://www.instagram.com/71dev_/" target="_blank" class="text-white-50 text-decoration-none fs-6 mx-2 hover-white transition" title="Instagram 71dev">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a href="https://wa.me/5571983174920" target="_blank" class="text-white-50 text-decoration-none fs-6 ms-1 hover-white transition" title="WhatsApp 71dev">
                            <i class="bi bi-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

        <script>
            const isUsuarioLogado = ${usuarioLogado ? 'true' : 'false'};

            document.addEventListener('DOMContentLoaded', function () {
                
                // Ativar Tooltips do Bootstrap
                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                // ==========================================
                // LÓGICA DE ANIMAÇÃO DE SCROLL (INTERSECTION OBSERVER)
                // ==========================================
                const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
                
                const revealOptions = {
                    threshold: 0.15,
                    rootMargin: "0px 0px -50px 0px" 
                };

                const revealObserver = new IntersectionObserver(function(entries, observer) {
                    entries.forEach(entry => {
                        if (!entry.isIntersecting) {
                            entry.target.classList.remove('reveal-visible');
                            return;
                        }
                        entry.target.classList.add('reveal-visible');
                    });
                }, revealOptions);

                revealElements.forEach(el => revealObserver.observe(el));


                // ==========================================
                // LÓGICA DO SWIPER E FILTROS
                // ==========================================
                var swiper = new Swiper(".mySwiper", {
                    slidesPerView: 1,
                    spaceBetween: 15,
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
                        992: { slidesPerView: 3, spaceBetween: 20 },
                        1200: { slidesPerView: 4, spaceBetween: 25 },
                    },
                });

                const todosOsSlidesNodes = Array.from(document.querySelectorAll('.curso-slide'));
                const swiperWrapper = document.querySelector('.swiper-wrapper');
                const botoesFiltro = document.querySelectorAll('.btn-filter');

                botoesFiltro.forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.preventDefault();

                        botoesFiltro.forEach(b => {
                            b.classList.remove('btn-dark', 'fw-bold');
                            b.classList.add('btn-outline-dark', 'bg-white', 'bg-opacity-50', 'fw-semibold');
                        });
                        this.classList.remove('btn-outline-dark', 'bg-white', 'bg-opacity-50', 'fw-semibold');
                        this.classList.add('btn-dark', 'fw-bold');

                        const filtro = this.getAttribute('data-filter').toLowerCase();
                        swiper.removeAllSlides();
                        
                        const emptyMsg = swiperWrapper.querySelector('.swiper-no-slides');
                        if (emptyMsg) emptyMsg.remove();

                        const slidesFiltrados = todosOsSlidesNodes.filter(slide => {
                            const tags = slide.getAttribute('data-tags');
                            return filtro === 'all' || tags.includes(filtro);
                        });

                        if (slidesFiltrados.length > 0) {
                            swiper.appendSlide(slidesFiltrados);
                        } else {
                            swiperWrapper.innerHTML = '<div class="w-100 text-center py-5 text-muted swiper-no-slides">Nenhum curso encontrado nesta categoria no momento.</div>';
                        }

                        swiper.update();
                        swiper.slideTo(0);
                    });
                });

                // ==========================================
                // LÓGICA DE FAVORITOS
                // ==========================================
                document.body.addEventListener('click', function(e) {
                    const btn = e.target.closest('.btn-favoritar');
                    if (!btn) return;
                    
                    e.preventDefault();
                    e.stopPropagation(); // Evita que clique no coração abra o curso
                    
                    if (!isUsuarioLogado) {
                        window.location.href = '/login?returnTo=/';
                        return;
                    }

                    const cursoId = btn.getAttribute('data-curso-id');
                    const icon = btn.querySelector('i');
                    
                    const isFavorited = icon.classList.contains('bi-heart-fill');
                    if (isFavorited) {
                        icon.classList.replace('bi-heart-fill', 'bi-heart');
                    } else {
                        icon.classList.replace('bi-heart', 'bi-heart-fill');
                    }

                    fetch('/aluno/api/favoritos/toggle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ curso_id: cursoId })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (!data.success) {
                            alert('Ocorreu um erro ao atualizar os favoritos.');
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