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
            
            htmlCursosSlider += `
                <div class="swiper-slide h-auto curso-slide" data-tags="${tagsDoCurso}">
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-shadow transition">
                        
                        <button class="btn btn-light btn-sm rounded-circle shadow-sm position-absolute top-0 end-0 m-2 z-2 text-danger btn-favoritar" data-curso-id="${curso.id}" title="Adicionar aos favoritos" style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-heart"></i>
                        </button>
                        
                        <img src="${capa}" class="card-img-top" alt="${curso.titulo}" style="height: 160px; object-fit: cover;">
                        
                        <div class="card-body d-flex flex-column p-3">
                            <h6 class="fw-bold text-dark text-truncate mb-2" title="${curso.titulo}">${curso.titulo}</h6>
                            <p class="text-muted small mb-3" style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.85rem; line-height: 1.4;">
                                ${curso.descricao || 'Aprenda as melhores práticas e destaque-se no mercado com este curso completo.'}
                            </p>
                            
                            <div class="d-flex align-items-center mb-3 small text-secondary fw-semibold" style="font-size: 0.8rem;">
                                <span class="me-3" title="Soma do tempo de todas as aulas"><i class="bi bi-clock text-primary me-1"></i> ${duracao}</span>
                                <span title="Estimativa baseada em 2h de estudo/dia"><i class="bi bi-calendar-check text-success me-1"></i> ${conclusao}</span>
                            </div>
                            
                            <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
                                <span class="fw-bold text-primary">${preco}</span>
                                <a href="/cursos/${curso.id}" class="btn btn-primary btn-sm fw-bold px-3 rounded-pill">Comprar</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    const linksCategorias = `
        <a href="#" class="btn btn-dark rounded-pill me-2 fw-bold px-4 btn-filter flex-shrink-0" data-filter="all">⭐ Em Alta</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 fw-semibold btn-filter flex-shrink-0" data-filter="tecnologia">💻 Tecnologia</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 fw-semibold btn-filter flex-shrink-0" data-filter="negócio">📊 Negócios</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 fw-semibold btn-filter flex-shrink-0" data-filter="escritório">🗂️ Escritório</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 fw-semibold btn-filter flex-shrink-0" data-filter="design">🎨 Design</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 fw-semibold btn-filter flex-shrink-0" data-filter="marketing">📈 Marketing</a>
        <a href="#" class="btn btn-outline-secondary rounded-pill me-2 fw-semibold btn-filter flex-shrink-0" data-filter="idioma">🗣️ Idiomas</a>
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
            
            .swiper-button-next, .swiper-button-prev { background-color: white; color: #0d6efd; width: 40px; height: 40px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
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

            /* Responsive Adjustments */
            @media (max-width: 991.98px) {
                .search-bar-header { margin-top: 15px; width: 100%; }
            }
            
            @media (max-width: 767.98px) {
                .hero-section { padding: 40px 0; }
                .hero-title { font-size: 2.2rem; }
                .hero-subtitle { font-size: 1rem; mb-4; }
                .hero-img { height: 280px; }
                .btn-lg { padding: 0.6rem 1.5rem; font-size: 1rem; }
                .career-banner-img { max-height: 200px !important; }
            }
        </style>
    </head>
    <body>

        ${renderMainHeader(usuarioLogado)}

        <section class="hero-section overflow-hidden">
            <div class="container">
                <div class="row align-items-center">
                    
                    <div class="col-lg-6 mb-4 mb-lg-0 pe-lg-5 text-center text-lg-start">
                        <span class="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold">🚀 Plataforma E-learning #1</span>
                        <h1 class="hero-title mb-3">Transforme seu futuro com nossos <span class="text-primary">cursos profissionalizantes</span> online.</h1>
                        <p class="hero-subtitle mb-4">Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho com certificados reconhecidos.</p>
                        
                        <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <a href="#secao-cursos" class="btn btn-primary btn-lg fw-bold px-4 py-2 rounded-pill shadow-sm">Explorar Cursos</a>
                        </div>
                    </div>

                    <div class="col-lg-6 position-relative">
                        <div class="position-absolute top-0 end-0 bg-warning rounded-circle opacity-50 blur d-none d-md-block" style="width: 300px; height: 300px; filter: blur(60px); z-index: 0; transform: translate(20%, -20%);"></div>
                        <div class="position-absolute bottom-0 start-0 bg-primary rounded-circle opacity-25 blur d-none d-md-block" style="width: 250px; height: 250px; filter: blur(60px); z-index: 0; transform: translate(-20%, 20%);"></div>

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
            <div class="container py-3">
                
                <div class="row mb-3 align-items-end">
                    <div class="col-lg-8 text-center text-md-start">
                        <h2 class="fw-bold text-dark mb-2">Uma ampla seleção de cursos</h2>
                        <p class="text-muted fs-6 mb-0">Escolha o seu caminho e comece a estudar hoje mesmo.</p>
                    </div>
                </div>

                <div class="d-flex overflow-x-auto hide-scrollbar mb-4 pb-2" style="-webkit-overflow-scrolling: touch;">
                    ${linksCategorias}
                </div>

                <div class="p-3 p-md-4 rounded-4 border bg-light position-relative">
                    <div class="swiper mySwiper">
                        <div class="swiper-wrapper py-2">
                            ${htmlCursosSlider}
                        </div>
                    </div>
                    <div class="swiper-button-next d-none d-md-flex"></div>
                    <div class="swiper-button-prev d-none d-md-flex"></div>
                </div>
                
                <div class="text-center mt-4">
                    <a href="#" class="btn btn-outline-primary fw-bold px-4 py-2 rounded-pill">Ver Todos os Cursos</a>
                </div>

            </div>
        </section>

        <section class="py-4 py-md-5 bg-white">
            <div class="container">
                <div class="row align-items-center bg-light border rounded-4 p-3 p-md-4 mx-0 shadow-sm position-relative overflow-hidden">
                    
                    <div class="position-absolute top-0 end-0 bg-primary opacity-10 rounded-circle d-none d-md-block" style="width: 250px; height: 250px; transform: translate(30%, -30%);"></div>

                    <div class="col-lg-7 position-relative z-1 mb-4 mb-lg-0 pe-lg-4 text-center text-md-start">
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
                    
                    <div class="col-lg-5 position-relative z-1 text-center">
                        <img src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80" alt="Análise de Carreira e Currículo" class="img-fluid rounded-4 shadow career-banner-img" style="max-height: 280px; object-fit: cover; width: 100%;">
                    </div>

                </div>
            </div>
        </section>

        <footer class="bg-dark text-white pt-5 pb-3 mt-4">
            <div class="container">
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
                        <small class="text-white-50" style="font-size: 0.75rem;">&copy; 2026 OnStude. Todos os direitos reservados.</small>
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
                            b.classList.add('btn-outline-secondary', 'fw-semibold');
                        });
                        this.classList.remove('btn-outline-secondary', 'fw-semibold');
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

                document.body.addEventListener('click', function(e) {
                    const btn = e.target.closest('.btn-favoritar');
                    if (!btn) return;
                    
                    e.preventDefault();
                    
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