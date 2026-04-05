// views/categoriasView.js

// Importando o Header e o Footer consistentes da aplicação
const renderMainHeader = require('./mainHeader');

function renderCategoriasView(usuario, categoriasData = []) {

    // ==========================================
    // CONFIGURAÇÃO PERSUASIVA DAS CATEGORIAS
    // ==========================================
    const configCategorias = {
        'tecnologia': {
            titulo: 'Tecnologia & Programação',
            icone: 'bi-code-slash',
            cor: 'primary',
            imagem: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
            copy: 'O mundo atual fala em código. Desde a criação de aplicativos revolucionários até a inteligência artificial, torne-se o profissional indispensável que constrói o futuro digital.'
        },
        'negocios': {
            titulo: 'Negócios & Administração',
            icone: 'bi-briefcase-fill',
            cor: 'success',
            imagem: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80',
            copy: 'Ideias brilhantes precisam de uma execução impecável. Aprenda a gerenciar grandes equipes, otimizar lucros e transformar visões ambiciosas em impérios sólidos.'
        },
        'design': {
            titulo: 'Design & Criatividade',
            icone: 'bi-palette-fill',
            cor: 'danger',
            imagem: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
            copy: 'A primeira impressão é a que vende. Domine as ferramentas visuais mais exigidas do mercado e aprenda a criar marcas, produtos e interfaces que encantam e convertem.'
        },
        'marketing': {
            titulo: 'Marketing & Vendas',
            icone: 'bi-megaphone-fill',
            cor: 'warning',
            imagem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            copy: 'Não basta ser o melhor, o mundo precisa saber que você existe. Descubra os segredos ocultos da persuasão, do marketing digital e das estratégias de vendas explosivas.'
        },
        'escritorio': {
            titulo: 'Produtividade & Escritório',
            icone: 'bi-file-earmark-spreadsheet-fill',
            cor: 'info',
            imagem: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=80',
            copy: 'A eficiência é a chave para o topo. Domine planilhas complexas, editores de texto avançados e ferramentas corporativas para se tornar a engrenagem principal de qualquer empresa.'
        },
        'default': {
            titulo: 'Novos Horizontes',
            icone: 'bi-rocket-takeoff-fill',
            cor: 'dark',
            imagem: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
            copy: 'Nunca pare de aprender. Explore novas habilidades, descubra paixões ocultas e expanda o seu arsenal de conhecimento para estar sempre um passo à frente.'
        }
    };

    // ==========================================
    // RENDERIZAÇÃO DAS SESSÕES DE CURSOS
    // ==========================================
    let htmlSessoes = '';

    if (!categoriasData || categoriasData.length === 0) {
        htmlSessoes = `
            <div class="container py-5 text-center reveal-up glass-card rounded-4 my-5" style="min-height: 40vh; display: flex; flex-direction: column; justify-content: center;">
                <i class="bi bi-box-seam fs-1 text-muted opacity-50 mb-3 d-block"></i>
                <h3 class="fw-bold text-dark">Nenhuma categoria disponível no momento</h3>
                <p class="text-muted">Estamos a preparar novos cursos incríveis para si. Volte em breve!</p>
            </div>
        `;
    } else {
        categoriasData.forEach((categoriaObj, index) => {
            const chaveChave = (categoriaObj.chave || 'default').toLowerCase();
            const config = configCategorias[chaveChave] || configCategorias['default'];
            const tituloSessao = categoriaObj.nome || config.titulo;

            let htmlCards = '';
            
            if (categoriaObj.cursos && categoriaObj.cursos.length > 0) {
                categoriaObj.cursos.forEach((curso, idxCurso) => {
                    const fallbackCapa = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22200%22%20viewBox%3D%220%200%20400%20200%22%3E%3Crect%20fill%3D%22%23e9ecef%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%236c757d%22%20font-family%3D%22sans-serif%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ECurso%3C%2Ftext%3E%3C%2Fsvg%3E';
                    const capa = (curso.capa_url && curso.capa_url.trim() !== '') ? curso.capa_url : fallbackCapa;
                    
                    let precoBadge = '<span class="badge bg-success shadow-sm rounded-pill px-2 py-1 position-absolute top-0 end-0 m-2" style="font-size: 0.7rem;">Gratuito</span>';
                    if (parseFloat(curso.preco) > 0) {
                        precoBadge = `<span class="badge bg-dark bg-opacity-75 text-white shadow-sm rounded-pill px-2 py-1 position-absolute top-0 end-0 m-2 backdrop-blur" style="font-size: 0.7rem;">R$ ${parseFloat(curso.preco).toFixed(2).replace('.', ',')}</span>`;
                    }

                    const duracao = curso.duracao_horas ? `${curso.duracao_horas}h de conteúdo` : 'Acesso Imediato';
                    const descricaoCurta = curso.descricao || 'Dê o próximo passo na sua carreira com este conteúdo exclusivo.';

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

                    let delayClass = '';
                    let delayTimer = (idxCurso % 4) * 100;
                    if(delayTimer > 0) delayClass = `delay-${delayTimer}`;

                    htmlCards += `
                        <div class="col-md-6 col-lg-4 col-xl-3 mb-4 reveal-up ${delayClass}">
                            <a href="/cursos/${curso.id}" class="text-decoration-none d-block h-100">
                                <div class="card h-100 border-0 rounded-4 hover-card transition-all overflow-hidden glass-card">
                                    <div class="position-relative bg-light">
                                        <img src="${capa}" onerror="this.onerror=null;this.src='${fallbackCapa}';" class="card-img-top border-bottom" alt="${curso.titulo}" style="height: 140px; object-fit: cover;">
                                        ${precoBadge}
                                    </div>
                                    <div class="card-body p-3 d-flex flex-column">
                                        <h6 class="fw-bold text-dark mb-2 lh-sm text-truncate" title="${curso.titulo}">${curso.titulo}</h6>
                                        <p class="text-muted mb-2 flex-grow-1" style="font-size: 0.75rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                                            ${descricaoCurta}
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

                                        <div class="d-flex justify-content-between align-items-center mt-auto border-top border-secondary border-opacity-10 pt-2">
                                            <span class="text-secondary fw-semibold" style="font-size: 0.7rem;"><i class="bi bi-clock-history me-1"></i> ${duracao}</span>
                                            <span class="text-${config.cor} fw-bold" style="font-size: 0.7rem;">Detalhes <i class="bi bi-arrow-right ms-1 transition-icon"></i></span>
                                        </div>
                                    </div>
                                </div>
                            </a>
                        </div>
                    `;
                });
            } else {
                htmlCards = `
                    <div class="col-12 reveal-up">
                        <div class="alert glass-card border rounded-4 text-center py-4 text-muted">
                            Novos cursos desta categoria serão adicionados em breve.
                        </div>
                    </div>
                `;
            }

            const imagemEsquerda = index % 2 === 0;
            const classRevealTexto = imagemEsquerda ? 'reveal-right' : 'reveal-left';
            const classRevealImagem = imagemEsquerda ? 'reveal-left' : 'reveal-right';

            htmlSessoes += `
                <section class="py-5 overflow-hidden" id="cat-${chaveChave}">
                    <div class="container py-4">
                        <div class="row align-items-center mb-5 ${imagemEsquerda ? '' : 'flex-row-reverse'}">
                            <div class="col-lg-6 mb-4 mb-lg-0 ${imagemEsquerda ? 'pe-lg-5' : 'ps-lg-5'} ${classRevealTexto}">
                                <div class="d-inline-flex align-items-center justify-content-center bg-${config.cor} bg-opacity-10 text-${config.cor} border border-${config.cor} border-opacity-25 rounded-4 p-3 mb-3 shadow-sm glass-card">
                                    <i class="bi ${config.icone} fs-3"></i>
                                </div>
                                <h2 class="fw-bold text-dark display-6 mb-3">${tituloSessao}</h2>
                                <p class="text-secondary fs-5 lh-lg mb-4">${config.copy}</p>
                                <a href="#cat-${chaveChave}" class="btn btn-outline-${config.cor} bg-white bg-opacity-50 rounded-pill fw-bold px-4 shadow-sm" style="backdrop-filter: blur(4px);">
                                    Explorar Cursos <i class="bi bi-chevron-down ms-1"></i>
                                </a>
                            </div>
                            <div class="col-lg-6 ${classRevealImagem} delay-200">
                                <div class="position-relative rounded-4 overflow-hidden shadow-lg image-reveal border border-white">
                                    <img src="${config.imagem}" alt="${tituloSessao}" class="img-fluid w-100" style="height: 350px; object-fit: cover;">
                                    <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-10" style="pointer-events: none;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-5 pt-3 border-top border-secondary border-opacity-10">
                            <div class="col-12 mb-4 d-flex justify-content-between align-items-center reveal-up">
                                <h4 class="fw-bold text-dark mb-0"><i class="bi bi-collection-play text-secondary me-2"></i>Trilhas de Aprendizagem</h4>
                            </div>
                            ${htmlCards}
                        </div>
                    </div>
                </section>
            `;
        });
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Categorias de Cursos | OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #212529; overflow-x: hidden; position: relative; }
            .transition-all { transition: all 0.3s ease; }
            
            .hover-card:hover { transform: translateY(-8px); box-shadow: 0 1rem 2rem rgba(0,0,0,.1)!important; }
            .hover-card:hover .transition-icon { transform: translateX(5px); transition: transform 0.3s ease; }
            
            .image-reveal img { transition: transform 0.7s ease; }
            .image-reveal:hover img { transform: scale(1.05); }
            
            .backdrop-blur { backdrop-filter: blur(4px); }
            
            .hover-primary:hover { color: #0d6efd !important; }
            .hover-white { transition: color 0.3s; }
            .hover-white:hover { color: #ffffff !important; }

            /* ==========================================
               EFEITO ORIGINAL DO CONTAINER DO TOPO (RESTAURADO)
               ========================================== */
            .hero-section {
                background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
                position: relative;
                overflow: hidden;
                padding: 80px 0;
            }
            .hero-section::before {
                content: '';
                position: absolute;
                top: -50%; left: -50%; width: 200%; height: 200%;
                background: radial-gradient(circle, rgba(13,110,253,0.15) 0%, transparent 60%);
                animation: rotateBg 20s linear infinite;
            }
            @keyframes rotateBg { 100% { transform: rotate(360deg); } }

            /* ==========================================
               GRADIENT MESH BACKGROUND (Para o resto da página)
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
            .mesh-blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #0d6efd; animation-delay: 0s; }
            .mesh-blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: #0dcaf0; animation-delay: -5s; }
            .mesh-blob-3 { top: 30%; left: 40%; width: 45vw; height: 45vw; background: #6610f2; animation-delay: -10s; }
            
            @keyframes floatAnim {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(5%, 15%) scale(1.1); }
                66% { transform: translate(-10%, 5%) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
            }

            /* ==========================================
               GLASSMORPHISM CARDS
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

            /* ==========================================
               CLASSES DE ANIMAÇÃO DE SCROLL (REVEAL)
               ========================================== */
            .reveal-up { opacity: 0; transform: translateY(50px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-left { opacity: 0; transform: translateX(-50px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-right { opacity: 0; transform: translateX(50px); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-scale { opacity: 0; transform: scale(0.9); transition: all 0.8s cubic-bezier(0.5, 0, 0, 1); }
            
            .reveal-visible { opacity: 1; transform: translate(0) scale(1); }
            
            .delay-100 { transition-delay: 100ms; }
            .delay-200 { transition-delay: 200ms; }
            .delay-300 { transition-delay: 300ms; }

            @media (max-width: 991.98px) {
                .search-bar-header { margin-top: 15px; width: 100%; }
            }

            @media (max-width: 767.98px) {
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
            ${renderMainHeader(usuario)}
        </div>

        <section class="hero-section text-center text-white shadow-sm">
            <div class="container position-relative reveal-up" style="z-index: 1;">
                <span class="badge bg-primary bg-opacity-25 text-info border border-primary border-opacity-50 rounded-pill px-3 py-2 mb-4 fw-semibold text-uppercase tracking-wide shadow-sm">Catálogo Premium</span>
                <h1 class="display-4 fw-bold mb-4 text-white">O que você quer dominar hoje?</h1>
                <p class="lead text-light opacity-75 mb-5 mx-auto" style="max-width: 700px;">
                    Escolha o seu caminho. Preparamos trilhas de conhecimento focadas no mercado de trabalho atual para transformar o seu potencial em resultados reais.
                </p>
            </div>
        </section>

        <div class="categorias-wrapper overflow-hidden mt-3">
            ${htmlSessoes}
        </div>

        <section class="py-5 text-center overflow-hidden mb-5">
            <div class="container py-5 glass-card rounded-4 reveal-scale shadow-sm">
                <h2 class="fw-bold mb-3 text-dark">Ainda não sabe por onde começar?</h2>
                <p class="fs-5 text-secondary mb-4">Crie a sua conta gratuitamente e experimente a nossa plataforma. O primeiro passo para o sucesso está a um clique de distância.</p>
                ${!usuario ? `<a href="/cadastro" class="btn btn-primary btn-lg fw-bold rounded-pill shadow px-5 py-3">Começar Agora <i class="bi bi-arrow-right ms-2"></i></a>` : `<a href="/aluno" class="btn btn-primary btn-lg fw-bold rounded-pill shadow px-5 py-3">Ir para meus estudos <i class="bi bi-arrow-right ms-2"></i></a>`}
            </div>
        </section>

        <footer class="bg-dark text-white pt-5 pb-3 overflow-hidden" style="border-top: 1px solid rgba(255,255,255,0.1);">
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

        <script>
            // ==========================================
            // LÓGICA DE ANIMAÇÃO E TOOLTIPS
            // ==========================================
            document.addEventListener('DOMContentLoaded', function() {
                
                // Ativar Tooltips do Bootstrap
                const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                // Animações de Scroll
                const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
                const isMobile = window.innerWidth < 768;
                
                const revealOptions = {
                    threshold: 0, 
                    rootMargin: isMobile ? "250px 0px 50px 0px" : "150px 0px -50px 0px"
                };

                const revealObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('reveal-visible');
                        } else {
                            if(entry.intersectionRatio === 0) {
                                entry.target.classList.remove('reveal-visible');
                            }
                        }
                    });
                }, revealOptions);

                revealElements.forEach(el => {
                    revealObserver.observe(el);
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                        el.classList.add('reveal-visible');
                    }
                });
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderCategoriasView;