// views/loginView.js

function renderLoginView(erro = null, returnTo = '') {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OnStude - Login</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            /* Reset e Configurações Base */
            body, html { height: 100%; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
            
            /* Wrapper com Background Dinâmico */
            #bg-wrapper {
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-image 0.5s ease-in-out;
                background-color: #343a40; /* Cor de fallback */
                padding: 20px;
            }

            /* Card Principal Split Screen */
            .login-card {
                width: 100%;
                max-width: 1000px;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            }

            /* Coluna da Esquerda (Slider) */
            .left-column {
                background: linear-gradient(135deg, rgba(13, 110, 253, 0.85), rgba(102, 16, 242, 0.9));
                position: relative;
                padding: 3rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                backdrop-filter: blur(10px);
            }

            .carousel-indicators { margin-bottom: 0; }
            .carousel-indicators [data-bs-target] { width: 10px; height: 10px; border-radius: 50%; background-color: rgba(255,255,255,0.5); }
            .carousel-indicators .active { background-color: white; }

            /* Coluna da Direita (Formulário) */
            .right-column {
                background-color: #ffffff;
                padding: 4rem 3.5rem;
                display: flex;
                flex-direction: column;
                justify-content: center;
            }

            /* ==========================================
               NOVO DESIGN DOS CONTAINERS (INPUTS)
               ========================================== */
            .input-group-custom {
                background-color: #f4f6f9;
                border-radius: 14px;
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .input-group-custom:focus-within {
                background-color: #ffffff;
                border-color: #0d6efd;
                box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.15);
            }

            .input-group-text-custom {
                background-color: transparent;
                border: none;
                color: #6c757d;
                padding-left: 1.2rem;
                padding-right: 0.5rem;
            }

            .form-control-custom {
                border: none;
                background-color: transparent;
                padding: 1rem 1.2rem 1rem 0.5rem;
                font-size: 1rem;
                color: #212529;
            }
            
            .form-control-custom:focus {
                box-shadow: none;
                background-color: transparent;
            }

            .form-control-custom::placeholder {
                color: #adb5bd;
            }

            /* Botões */
            .btn-custom {
                border-radius: 12px;
                padding: 0.9rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                transition: all 0.3s;
            }
            .btn-custom:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(13, 110, 253, 0.3); }
            
            .btn-reset {
                border-radius: 12px;
                background-color: #f8f9fa;
                border: 2px solid #e9ecef;
                color: #6c757d;
                transition: all 0.3s;
            }
            .btn-reset:hover {
                background-color: #e9ecef;
                color: #dc3545;
                border-color: #dee2e6;
                transform: translateY(-2px);
            }

            .back-link {
                position: absolute;
                top: 20px;
                left: 20px;
                color: rgba(255,255,255,0.8);
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s;
                z-index: 10;
            }
            .back-link:hover { color: white; }

            @media (max-width: 767.98px) {
                .right-column { padding: 2.5rem; }
            }
        </style>
    </head>
    <body>
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div id="bg-wrapper">
            
            <a href="/" class="back-link d-none d-md-flex align-items-center">
                <i class="bi bi-arrow-left me-2"></i> Voltar ao Início
            </a>

            <div class="login-card">
                <div class="row g-0 h-100">
                    
                    <div class="col-md-6 d-none d-md-flex left-column text-white">
                        
                        <div class="mb-5">
                            <i class="bi bi-mortarboard-fill" style="font-size: 4rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));"></i>
                            <h2 class="fw-bold mt-3 mb-0" style="letter-spacing: -1px;">OnStude<span class="text-info">.</span></h2>
                        </div>

                        <div id="carouselMotivation" class="carousel slide w-100 px-4" data-bs-ride="carousel" data-bs-interval="4000">
                            <div class="carousel-inner text-center" style="min-height: 120px;">
                                
                                <div class="carousel-item active">
                                    <h4 class="fw-bold lh-base">"A educação é o passaporte para o futuro."</h4>
                                    <p class="text-white-50 mt-3 mb-0">Prepare-se hoje para as oportunidades de amanhã.</p>
                                </div>
                                
                                <div class="carousel-item">
                                    <h4 class="fw-bold lh-base">Qualificação de alto nível ao seu alcance.</h4>
                                    <p class="text-white-50 mt-3 mb-0">Aprenda com especialistas e transforme a sua carreira com a OnStude.</p>
                                </div>

                                <div class="carousel-item">
                                    <h4 class="fw-bold lh-base">Seu próximo grande passo começa aqui.</h4>
                                    <p class="text-white-50 mt-3 mb-0">Cursos práticos e direto ao ponto para o mercado de trabalho.</p>
                                </div>

                            </div>
                            <div class="carousel-indicators position-relative mt-5 pt-3">
                                <button type="button" data-bs-target="#carouselMotivation" data-bs-slide-to="0" class="active"></button>
                                <button type="button" data-bs-target="#carouselMotivation" data-bs-slide-to="1"></button>
                                <button type="button" data-bs-target="#carouselMotivation" data-bs-slide-to="2"></button>
                            </div>
                        </div>

                    </div>

                    <div class="col-md-6 right-column relative">
                        
                        <a href="/" class="text-decoration-none text-muted mb-4 d-md-none fw-semibold">
                            <i class="bi bi-arrow-left me-1"></i> Voltar
                        </a>

                        <div class="mb-4">
                            <h2 id="tituloBoasVindas" class="text-dark fw-bold mb-1">Bem-vindo(a)! 👋</h2>
                            <p class="text-muted">Acesse a sua conta para continuar aprendendo.</p>
                            
                            ${erro ? `
                            <div id="errorBadge" class="alert alert-danger d-flex align-items-center mt-3 py-2 px-3 border-0 rounded-3 shadow-sm transition-all" role="alert" style="transition: opacity 0.5s ease;">
                                <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                                <div style="font-size: 0.9rem; font-weight: 600;">${erro}</div>
                            </div>
                            ` : ''}
                        </div>

                        <form action="/login" method="POST">
                            <input type="hidden" name="returnTo" value="${returnTo}">
                            
                            <div class="mb-3">
                                <label for="email" class="form-label fw-bold text-dark small mb-2 ms-1">E-mail de acesso</label>
                                <div class="d-flex align-items-center input-group-custom">
                                    <span class="input-group-text-custom"><i class="bi bi-envelope fs-5"></i></span>
                                    <input type="email" class="form-control form-control-custom" id="email" name="email" placeholder="Ex: nome@email.com" required>
                                </div>
                            </div>

                            <div class="mb-4">
                                <label for="senha" class="form-label fw-bold text-dark small mb-2 ms-1">Senha</label>
                                <div class="d-flex align-items-center input-group-custom">
                                    <span class="input-group-text-custom"><i class="bi bi-lock fs-5"></i></span>
                                    <input type="password" class="form-control form-control-custom" id="senha" name="senha" placeholder="••••••••" required>
                                </div>
                            </div>
                            
                            <div class="d-flex gap-2 mt-4">
                                <button type="reset" class="btn btn-reset px-3" title="Limpar campos">
                                    <i class="bi bi-eraser-fill fs-5"></i>
                                </button>
                                <button type="submit" class="btn btn-primary btn-custom shadow-sm flex-grow-1">
                                    Entrar na Plataforma <i class="bi bi-arrow-right ms-1"></i>
                                </button>
                            </div>
                        </form>

                        <div class="text-center mt-4 pt-4 border-top">
                            <p class="text-muted small mb-0">Ainda não tem uma conta?</p>
                            <a href="/cadastro" class="text-primary fw-bold text-decoration-none hover-shadow transition" style="font-size: 0.95rem;">Crie sua conta gratuitamente</a>
                        </div>

                    </div>

                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            // ==========================================
            // LÓGICA DE BOAS-VINDAS INTELIGENTE
            // ==========================================
            document.addEventListener('DOMContentLoaded', function() {
                const titulo = document.getElementById('tituloBoasVindas');
                // Verifica no armazenamento do navegador se o usuário já visitou a página de login antes
                if (localStorage.getItem('jaVisitouOnStudeLogin')) {
                    titulo.innerHTML = 'Bem-vindo de volta! 👋';
                } else {
                    titulo.innerHTML = 'Bem-vindo à OnStude! 🚀';
                    localStorage.setItem('jaVisitouOnStudeLogin', 'true');
                }
            });

            // ==========================================
            // LÓGICA DE BACKGROUND DINÂMICO
            // ==========================================
            const imagensEstudo = [
                'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1920&auto=format&fit=crop', 
                'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1920&auto=format&fit=crop', 
                'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1920&auto=format&fit=crop', 
                'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop'  
            ];

            const imagemSorteada = imagensEstudo[Math.floor(Math.random() * imagensEstudo.length)];
            
            const wrapper = document.getElementById('bg-wrapper');
            wrapper.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(' + imagemSorteada + ')';
            wrapper.style.backgroundSize = 'cover';
            wrapper.style.backgroundPosition = 'center';
            wrapper.style.backgroundRepeat = 'no-repeat';

            // ==========================================
            // LÓGICA ORIGINAL MANTIDA INTACTA
            // ==========================================
            
            ${erro ? `
                setTimeout(function() {
                    const badge = document.getElementById('errorBadge');
                    if (badge) {
                        badge.style.opacity = '0';
                        setTimeout(() => badge.remove(), 500); 
                    }
                }, 4000);
            ` : ''}

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

module.exports = renderLoginView;