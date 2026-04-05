// views/planoCarreiraView.js
const renderMainHeader = require('./mainHeader');

function renderPlanoCarreiraView(usuarioLogado, modelosCV = []) {
    
    // ==========================================
    // SLIDER DE MODELOS DE CURRÍCULO (DINÂMICO)
    // ==========================================
    let htmlModelosSlider = '';
    
    if (modelosCV.length === 0) {
        htmlModelosSlider = `
            <div class="w-100 text-center py-5 text-muted">
                <i class="bi bi-file-earmark-word fs-1 d-block mb-3 text-secondary opacity-50"></i>
                <p class="fs-5 mb-0">Nenhum modelo disponível no momento.</p>
                <small>Volte em breve para novas atualizações!</small>
            </div>
        `;
    } else {
        modelosCV.forEach(modelo => {
            htmlModelosSlider += `
                <div class="swiper-slide h-auto">
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-shadow transition glass-card">
                        <img src="${modelo.capa_url}" class="card-img-top bg-light" alt="${modelo.titulo}" style="height: 220px; object-fit: cover; border-bottom: 1px solid rgba(0,0,0,0.05);">
                        <div class="card-body text-center p-4 d-flex flex-column">
                            <h6 class="fw-bold text-dark mb-4">${modelo.titulo}</h6>
                            
                            <div class="mt-auto d-flex flex-column gap-2">
                                <button type="button" class="btn btn-outline-secondary btn-sm fw-bold px-4 rounded-pill w-100 bg-white bg-opacity-50" onclick="abrirModalVisualizacao('${modelo.capa_url}', '${modelo.titulo}')" style="backdrop-filter: blur(4px);">
                                    <i class="bi bi-eye me-2"></i> Visualizar
                                </button>
                                <a href="${modelo.arquivo_url}" target="_blank" download class="btn btn-primary btn-sm fw-bold px-4 rounded-pill w-100 shadow-sm">
                                    <i class="bi bi-download me-2"></i> Download
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Plano de Carreira & Currículos - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />

        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #212529; overflow-x: hidden; position: relative; }
            .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 1rem 2rem rgba(0,0,0,.15)!important; }
            .transition { transition: all 0.3s ease; }

            .hover-white { transition: color 0.3s; }
            .hover-white:hover { color: #ffffff !important; }
            
            /* ==========================================
               GRADIENT MESH BACKGROUND
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

            .hero-title { font-size: 2.8rem; font-weight: 800; line-height: 1.2; letter-spacing: -1px; }
            .hero-img { border-radius: 24px; object-fit: cover; height: 450px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.2); border: 3px solid rgba(255,255,255,0.1); }
            
            .swiper-button-next, .swiper-button-prev { background-color: rgba(255,255,255,0.9); color: #0d6efd; width: 45px; height: 45px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.1); backdrop-filter: blur(4px); }
            .swiper-button-next:after, .swiper-button-prev:after { font-size: 1.2rem; font-weight: bold; }

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

            /* ==========================================
               DESIGN DOS CONTAINERS (INPUTS MODERNOS)
               ========================================== */
            .input-group-custom {
                background-color: rgba(255, 255, 255, 0.7);
                border-radius: 14px;
                border: 2px solid rgba(255, 255, 255, 0.8);
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
            .form-control-custom, .form-select-custom {
                border: none;
                background-color: transparent;
                padding: 0.7rem 1.2rem 0.7rem 0.5rem;
                font-size: 0.95rem;
                color: #212529;
                width: 100%;
            }
            .form-control-custom:focus, .form-select-custom:focus {
                box-shadow: none; background-color: transparent; outline: none;
            }
            .form-control-custom::placeholder { color: #adb5bd; }

            .btn-custom {
                border-radius: 12px;
                padding: 0.7rem;
                font-weight: 700;
                letter-spacing: 0.5px;
                transition: all 0.3s;
                height: 48px;
            }

            /* ==========================================
               CSS: MENTOR BOT FLUTUANTE & FOGUETE
               ========================================== */
            .rocket-intro { position: fixed; bottom: -150px; right: 40px; z-index: 1060; font-size: 5.5rem; transform: rotate(-45deg); pointer-events: none; animation: rocketFlight 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
            @keyframes rocketFlight { 
                0% { bottom: -150px; opacity: 1; } 
                35% { bottom: 20px; opacity: 1; } 
                55% { bottom: 20px; opacity: 1; } 
                100% { bottom: 150vh; opacity: 1; } 
            }

            .bot-flutuante { position: fixed; bottom: 30px; right: 30px; z-index: 1050; cursor: pointer; opacity: 0; pointer-events: none; }
            .bot-flutuante.bot-ativo { opacity: 1; pointer-events: auto; animation: botSpawn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards, floatBot 3s ease-in-out infinite 0.6s; }
            
            .bot-icon-bg { width: 85px; height: 85px; font-size: 2.5rem; background: linear-gradient(135deg, #0d6efd, #6610f2); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 10px 25px rgba(13, 110, 253, 0.5); transition: transform 0.3s; border: 4px solid white; }
            .bot-flutuante:hover .bot-icon-bg { transform: scale(1.15) rotate(10deg); }
            
            .bot-balao { position: absolute; bottom: 95px; right: 40px; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); padding: 15px 20px; border-radius: 20px 20px 0 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); width: 280px; font-size: 1rem; font-weight: 700; color: #212529; opacity: 0; transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); pointer-events: none; border: 2px solid #0d6efd; transform-origin: bottom right; transform: scale(0.8);}
            .bot-balao.show { opacity: 1; transform: scale(1); }
            
            @keyframes botSpawn { 0% { transform: scale(0); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
            @keyframes floatBot { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } }
            
            /* Gamificação */
            .btn-quiz-opcao { transition: all 0.2s; border-width: 2px; }
            .btn-quiz-opcao:hover:not(:disabled) { background-color: #f8f9fa; border-color: #0d6efd; color: #0d6efd; transform: translateX(5px); }
            .balao-container { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; }
            .balao-item { width: 140px; height: 160px; background: linear-gradient(135deg, #ff6b6b, #dc3545); border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%; color: white; display: flex; align-items: center; justify-content: center; text-align: center; padding: 15px; font-weight: bold; cursor: pointer; transition: all 0.3s; box-shadow: 0 8px 15px rgba(220, 53, 69, 0.3); animation: floatBalloon 4s ease-in-out infinite alternate; font-size: 0.9rem;}
            .balao-item:nth-child(even) { animation-delay: 1s; background: linear-gradient(135deg, #fd7e14, #ffc107); box-shadow: 0 8px 15px rgba(253, 126, 20, 0.3);}
            .balao-item:hover { transform: scale(1.1); filter: brightness(1.1); }
            .balao-item.popped { transform: scale(0); opacity: 0; pointer-events: none; transition: transform 0.2s, opacity 0.2s; }
            @keyframes floatBalloon { 0% { transform: translateY(0px); } 100% { transform: translateY(-10px); } }
            .card-mito-verdade { border: 3px solid transparent; border-radius: 20px; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
            .card-mito-verdade:hover { transform: translateY(-5px); }
            .card-mito { background-color: #fff5f5; border-color: #dc3545; color: #dc3545; }
            .card-verdade { background-color: #f0fdf4; border-color: #198754; color: #198754; }
            .card-mito-verdade.disabled { opacity: 0.6; pointer-events: none; filter: grayscale(100%); }
            .shake-animation { animation: shake 0.5s; }
            @keyframes shake { 0% { transform: translateX(0); } 25% { transform: translateX(-10px); } 50% { transform: translateX(10px); } 75% { transform: translateX(-10px); } 100% { transform: translateX(0); } }

            /* ==========================================
               RESPONSIVIDADE EXTREMA (MOBILE)
               ========================================== */
            @media (max-width: 767.98px) {
                .hero-section { padding: 40px 0; }
                .hero-title { font-size: 2.2rem; }
                .hero-img { height: 250px; }
                
                #gerador-cv .card { border-radius: 0 !important; box-shadow: none !important; border-top: 1px solid rgba(255,255,255,0.5) !important; }
                #gerador-cv .card-body { padding: 1.5rem 1rem !important; }
                
                .form-control-custom, .form-select-custom { padding: 0.5rem 0.8rem 0.5rem 0.4rem; font-size: 0.9rem; }
                .input-group-text-custom { padding-left: 0.8rem; font-size: 0.9rem; }
                .input-group-custom { border-radius: 10px; }
                .mb-3 { margin-bottom: 0.85rem !important; }
                .btn-custom { height: 42px; padding: 0.5rem; font-size: 0.95rem; border-radius: 10px; }
                
                .bot-icon-bg { width: 65px; height: 65px; font-size: 1.8rem; }
                .bot-balao { width: 220px; font-size: 0.85rem; bottom: 75px; right: 20px; padding: 10px 15px; }
                
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

        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>

        <div class="header-wrapper glass-nav sticky-top">
            ${renderMainHeader(usuarioLogado)}
        </div>

        <section class="hero-section overflow-hidden border-bottom text-white shadow-sm">
            <div class="container position-relative" style="z-index: 1;">
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-5 mb-lg-0 pe-lg-5 text-center text-lg-start reveal-left">
                        <span class="badge bg-primary bg-opacity-25 text-info border border-primary border-opacity-50 mb-3 px-3 py-2 rounded-pill fw-bold shadow-sm">🚀 Impulsione o seu Futuro</span>
                        <h1 class="hero-title mb-4 text-white">Crie seu currículo ou escolha um dos <span class="text-info">modelos</span> para editar.</h1>
                        <p class="hero-subtitle mb-5 text-light opacity-75">Tenha mais visibilidade nos processos seletivos. Utilize a nossa ferramenta gratuita para construir um currículo profissional em PDF em minutos.</p>
                        <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <a href="#gerador-cv" class="btn btn-primary btn-lg fw-bold px-5 py-3 rounded-pill shadow-sm">Criar Currículo</a>
                            <a href="#modelos-cv" class="btn btn-outline-light btn-lg fw-bold px-5 py-3 rounded-pill">Modelos Word</a>
                        </div>
                    </div>
                    <div class="col-lg-6 position-relative reveal-right delay-200">
                        <div id="heroCarousel" class="carousel slide carousel-fade shadow-lg rounded-4 overflow-hidden" data-bs-ride="carousel" data-bs-interval="3000">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" class="d-block hero-img" alt="Profissional corporativo">
                                </div>
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80" class="d-block hero-img" alt="Engenheira">
                                </div>
                                <div class="carousel-item">
                                    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80" class="d-block hero-img" alt="Médico">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="modelos-cv" class="py-5 overflow-hidden">
            <div class="container py-4">
                <div class="row mb-5 text-center reveal-up">
                    <div class="col-12">
                        <h2 class="fw-bold text-dark mb-3">Modelos Prontos para Download</h2>
                        <p class="text-secondary fs-5 mb-0">Baixe no formato Word (.docx) e edite no seu computador.</p>
                    </div>
                </div>
                <div class="p-4 rounded-4 glass-card position-relative mx-2 mx-md-0 reveal-up delay-200 shadow-sm">
                    <div class="swiper mySwiper">
                        <div class="swiper-wrapper py-3">
                            ${htmlModelosSlider}
                        </div>
                    </div>
                    <div class="swiper-button-next d-none d-md-flex"></div>
                    <div class="swiper-button-prev d-none d-md-flex"></div>
                </div>
            </div>
        </section>

        <section id="gerador-cv" class="py-5 border-top border-secondary border-opacity-10 overflow-hidden">
            <div class="container px-0 px-md-3">
                <div class="row justify-content-center mx-0">
                    <div class="col-lg-10 px-0 px-md-3">
                        <div class="text-center mb-5 px-3 px-md-0 reveal-up">
                            <h2 class="fw-bold text-dark">Gerador Automático de Currículo</h2>
                            <p class="text-secondary">Preencha os dados abaixo. Nós usamos o nosso motor inteligente para desenhar e entregar o PDF instantaneamente.</p>
                        </div>

                        <div class="card border-0 shadow-lg rounded-4 overflow-hidden reveal-up delay-100 glass-card">
                            <div class="card-body p-4 p-lg-5 bg-transparent">
                                <form id="formCurriculo">
                                    
                                    <h5 class="fw-bold text-primary mb-4 border-bottom border-secondary border-opacity-25 pb-2"><i class="bi bi-person-vcard me-2"></i>1. Cabeçalho e Dados Pessoais</h5>
                                    <div class="row g-3 mb-5">
                                        <div class="col-md-8">
                                            <label class="form-label fw-bold text-dark ms-1 small">Nome Completo *</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="input-group-text-custom"><i class="bi bi-person"></i></span>
                                                <input type="text" id="cvNome" class="form-control form-control-custom" required placeholder="Ex: João da Silva Santos">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-bold text-dark ms-1 small">Data de Nascimento</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="input-group-text-custom"><i class="bi bi-calendar-date"></i></span>
                                                <input type="date" id="cvNascimento" class="form-control form-control-custom">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold text-dark ms-1 small">Bairro</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="input-group-text-custom"><i class="bi bi-geo-alt"></i></span>
                                                <input type="text" id="cvBairro" class="form-control form-control-custom" placeholder="Ex: Centro">
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-bold text-dark ms-1 small">Cidade / Estado *</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="input-group-text-custom"><i class="bi bi-buildings"></i></span>
                                                <input type="text" id="cvCidade" class="form-control form-control-custom" required placeholder="Ex: Camaçari - BA">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-bold text-dark ms-1 small">Celular / WhatsApp *</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="input-group-text-custom"><i class="bi bi-whatsapp"></i></span>
                                                <input type="text" id="cvTel1" class="form-control form-control-custom" required placeholder="(00) 00000-0000">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-bold text-dark ms-1 small">Telefone Recado (Opcional)</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="input-group-text-custom"><i class="bi bi-telephone"></i></span>
                                                <input type="text" id="cvTel2" class="form-control form-control-custom" placeholder="(00) 0000-0000">
                                            </div>
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-bold text-dark ms-1 small">E-mail *</label>
                                            <div class="input-group-custom d-flex align-items-center">
                                                <span class="input-group-text-custom"><i class="bi bi-envelope"></i></span>
                                                <input type="email" id="cvEmail" class="form-control form-control-custom" required placeholder="seuemail@email.com">
                                            </div>
                                        </div>
                                    </div>

                                    <h5 class="fw-bold text-primary mb-4 border-bottom border-secondary border-opacity-25 pb-2"><i class="bi bi-chat-text me-2"></i>2. Apresentação e Objetivos</h5>
                                    <div class="mb-5">
                                        <label class="form-label fw-bold text-dark ms-1 small">Fale um pouco sobre você, suas pretensões e objetivos profissionais *</label>
                                        <div class="input-group-custom">
                                            <textarea id="cvResumo" class="form-control form-control-custom" rows="4" required placeholder="Sou um profissional dedicado, em busca de oportunidades na área de..." style="resize: none;"></textarea>
                                        </div>
                                    </div>

                                    <h5 class="fw-bold text-primary mb-3 border-bottom border-secondary border-opacity-25 pb-2"><i class="bi bi-mortarboard me-2"></i>3. Formação Acadêmica</h5>
                                    <div id="containerFormacao">
                                        <div class="row g-3 mb-3 p-3 p-md-4 border border-light rounded-4 bg-white bg-opacity-50 position-relative item-formacao shadow-sm">
                                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3 remover-item shadow-none" aria-label="Close" style="display:none;"></button>
                                            <div class="col-md-4">
                                                <label class="form-label fw-bold text-dark ms-1 small">Nível</label>
                                                <div class="input-group-custom pe-2">
                                                    <select class="form-select form-control-custom f-nivel bg-transparent border-0" style="cursor: pointer;">
                                                        <option value="Ensino Fundamental">Ensino Fundamental</option>
                                                        <option value="Ensino Médio" selected>Ensino Médio</option>
                                                        <option value="Técnico">Técnico</option>
                                                        <option value="Graduação">Graduação</option>
                                                        <option value="Pós-Graduação">Pós-Graduação</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-8">
                                                <label class="form-label fw-bold text-dark ms-1 small">Curso / Graduação (Opcional)</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom f-curso" placeholder="Ex: Administração, Informática">
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <label class="form-label fw-bold text-dark ms-1 small">Instituição de Ensino</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom f-escola" placeholder="Nome da Escola/Faculdade">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Status</label>
                                                <div class="input-group-custom pe-2">
                                                    <select class="form-select form-control-custom f-status bg-transparent border-0" style="cursor: pointer;">
                                                        <option value="Concluído">Concluído</option>
                                                        <option value="Em Andamento">Em Andamento</option>
                                                        <option value="Incompleto">Incompleto</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Ano (Conclusão ou Previsão)</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom f-ano" placeholder="Ex: 2025">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary bg-white bg-opacity-50 btn-sm rounded-pill fw-bold mb-5 px-3 shadow-sm" onclick="adicionarFormacao()">+ Adicionar outra Formação</button>

                                    <h5 class="fw-bold text-primary mb-3 border-bottom border-secondary border-opacity-25 pb-2"><i class="bi bi-award me-2"></i>4. Cursos e Aprimorações</h5>
                                    <div id="containerCursos">
                                        <div class="row g-3 mb-3 p-3 p-md-4 border border-light rounded-4 bg-white bg-opacity-50 position-relative item-curso shadow-sm">
                                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3 remover-item shadow-none" aria-label="Close" style="display:none;"></button>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Nome do Curso</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom c-nome" placeholder="Ex: Excel Avançado">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Instituição</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom c-escola" placeholder="Ex: OnStude">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Status</label>
                                                <div class="input-group-custom pe-2">
                                                    <select class="form-select form-control-custom c-status bg-transparent border-0" style="cursor: pointer;">
                                                        <option value="Concluído">Concluído</option>
                                                        <option value="Cursando">Cursando</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Ano de Conclusão</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom c-ano" placeholder="Ex: 2026">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary bg-white bg-opacity-50 btn-sm rounded-pill fw-bold mb-5 px-3 shadow-sm" onclick="adicionarCurso()">+ Adicionar outro Curso</button>

                                    <h5 class="fw-bold text-primary mb-3 border-bottom border-secondary border-opacity-25 pb-2"><i class="bi bi-briefcase me-2"></i>5. Experiências Profissionais</h5>
                                    <div id="containerExperiencias">
                                        <div class="row g-3 mb-3 p-3 p-md-4 border border-light rounded-4 bg-white bg-opacity-50 position-relative item-experiencia shadow-sm">
                                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3 remover-item shadow-none" aria-label="Close" style="display:none;"></button>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Empresa / Local</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom e-empresa" placeholder="Nome da empresa">
                                                </div>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-bold text-dark ms-1 small">Cargo / Função</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom e-cargo" placeholder="Ex: Assistente Administrativo">
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <label class="form-label fw-bold text-dark ms-1 small">Período (Início e Fim)</label>
                                                <div class="input-group-custom">
                                                    <input type="text" class="form-control form-control-custom e-periodo" placeholder="Ex: Jan/2022 - Atual (ou Dez/2024)">
                                                </div>
                                            </div>
                                            <div class="col-md-12">
                                                <label class="form-label fw-bold text-dark ms-1 small">Breve descrição das atividades (Opcional)</label>
                                                <div class="input-group-custom">
                                                    <textarea class="form-control form-control-custom e-desc" rows="2" placeholder="Descreva o que fazia nesta função..." style="resize: none;"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary bg-white bg-opacity-50 btn-sm rounded-pill fw-bold mb-5 px-3 shadow-sm" onclick="adicionarExperiencia()">+ Adicionar outra Experiência</button>

                                    <div class="text-center border-top border-secondary border-opacity-25 pt-5 mt-4">
                                        <button type="submit" class="btn btn-success btn-custom w-100 w-md-auto fw-bold px-5 shadow rounded-pill" id="btnGerarPDF">
                                            <i class="bi bi-file-earmark-pdf-fill me-2 fs-5"></i> Gerar Currículo em PDF
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div id="rocketIntro" class="rocket-intro text-danger" style="filter: drop-shadow(0 10px 10px rgba(220,53,69,0.5));">
            <i class="bi bi-rocket-fill"></i>
        </div>

        <div class="bot-flutuante" id="mentorBot" onclick="abrirQuizCV()">
            <div class="bot-balao" id="botBalaoTexto"></div>
            
            <button class="btn btn-danger btn-sm rounded-circle shadow position-absolute d-flex align-items-center justify-content-center" onclick="fecharMentorBot(event)" style="width: 24px; height: 24px; top: -5px; right: -5px; z-index: 1060; padding: 0; border: 2px solid white;" title="Esconder Mentor">
                <i class="bi bi-x" style="font-size: 1.2rem;"></i>
            </button>

            <div class="bot-icon-bg text-white"><i class="bi bi-robot"></i></div>
        </div>

        <div class="modal fade" id="modalQuizCV" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content rounded-4 border-0 shadow-lg overflow-hidden glass-card" style="background: rgba(255,255,255,0.9) !important;">
                    <div class="modal-header bg-primary text-white border-0 py-3">
                        <h5 class="modal-title fw-bold"><i class="bi bi-robot me-2 fs-4"></i> Mentor de Currículo (IA)</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 p-md-5 bg-transparent" style="min-height: 450px; display: flex; flex-direction: column; justify-content: center;">
                        
                        <div id="quizIntro" class="text-center py-2">
                            <div class="d-inline-block bg-primary bg-opacity-10 p-4 rounded-circle mb-4 text-primary">
                                <i class="bi bi-lightning-charge-fill" style="font-size: 4rem;"></i>
                            </div>
                            <h3 class="fw-bold text-dark mb-3">Seu currículo sobrevive ao RH?</h3>
                            <p class="text-secondary fs-5 mb-5 px-md-4">Recrutadores demoram cerca de <strong>6 segundos</strong> para olhar um currículo. Jogue nosso mini-game rápido e descubra se o seu perfil vai para a pilha do "Contratado" ou do "Lixo"!</p>
                            <button class="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow-sm" onclick="iniciarQuizCV()">Começar o Desafio <i class="bi bi-controller ms-2"></i></button>
                        </div>

                        <div id="quizContainer" style="display: none; width: 100%;">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <span class="badge bg-white text-primary border border-primary px-3 py-2 fw-bold shadow-sm" id="quizStatus">Desafio 1 de 5</span>
                                <div class="progress flex-grow-1 ms-3 bg-white rounded-pill shadow-sm" style="height: 12px;">
                                    <div class="progress-bar bg-primary rounded-pill transition" id="quizProgress" style="width: 20%;"></div>
                                </div>
                            </div>
                            
                            <h4 class="fw-bold text-dark mb-4 fs-4 lh-base text-center" id="quizPergunta">Pergunta?</h4>
                            
                            <div id="quizOpcoesDinâmico" class="mb-4 w-100"></div>
                            
                            <div id="quizFeedback" class="alert rounded-4 mb-0 shadow border" style="display: none;">
                                <div class="d-flex align-items-start">
                                    <div id="quizFeedbackIcon" class="me-3 mt-1"></div>
                                    <div class="flex-grow-1">
                                        <h6 class="fw-bold mb-1" id="quizFeedbackTitulo">Feedback</h6>
                                        <p class="mb-3 text-dark" id="quizFeedbackTexto" style="font-size: 0.95rem;">Texto da dica aqui.</p>
                                        <button class="btn btn-dark btn-sm rounded-pill px-4 fw-bold w-100 w-md-auto shadow-sm" onclick="proximaPerguntaQuiz()">Próximo Desafio <i class="bi bi-chevron-right ms-1"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div id="quizResultado" class="text-center py-2" style="display: none;">
                            <div id="resultadoIcone" class="mb-4"></div>
                            <h2 class="fw-bold mb-2" id="resultadoTitulo">Sua Classificação</h2>
                            <p class="fs-5 mb-4 text-muted">Sua pontuação final: <strong id="resultadoPontos" class="text-dark fs-3">0</strong> de 5</p>
                            
                            <div class="p-4 bg-white bg-opacity-75 rounded-4 mb-4 text-start border shadow-sm">
                                <div class="d-flex align-items-center mb-2">
                                    <i class="bi bi-robot text-primary fs-3 me-3"></i>
                                    <h5 class="fw-bold text-dark mb-0">Avaliação do Mentor:</h5>
                                </div>
                                <p class="mb-0 text-secondary fs-6" id="resultadoMensagem">Mensagem final personalizada aqui.</p>
                            </div>
                            <button class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-sm w-100" data-bs-dismiss="modal">Usar o Gerador de Currículo Agora!</button>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <footer class="bg-dark text-white pt-5 pb-3 mt-5" style="border-top: 1px solid rgba(255,255,255,0.1);">
            <div class="container reveal-up">
                <div class="row mb-4 text-center text-md-start">
                    <div class="col-lg-5 mb-4 mb-lg-0">
                        <h3 class="fw-bold text-primary mb-3">OnStude<span class="text-white">.</span></h3>
                        <p class="text-white-50 small pe-lg-5">Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho.</p>
                    </div>
                    <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
                        <h6 class="fw-bold mb-3 text-light">Acesso Rápido</h6>
                        <ul class="list-unstyled small">
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Quem Somos</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Fale Conosco</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none hover-white">Termos de Uso</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-3 col-md-6">
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
                        <a href="https://www.instagram.com/71dev_/" target="_blank" class="text-white-50 text-decoration-none fs-6 mx-2 hover-white transition"><i class="bi bi-instagram"></i></a>
                        <a href="https://wa.me/5571983174920" target="_blank" class="text-white-50 text-decoration-none fs-6 ms-1 hover-white transition"><i class="bi bi-whatsapp"></i></a>
                    </div>
                </div>
            </div>
        </footer>

        <div class="modal fade" id="modalVisualizarCV" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden glass-card" style="background: rgba(255,255,255,0.9) !important;">
                    <div class="modal-header bg-light bg-opacity-75 border-0" style="backdrop-filter: blur(4px);">
                        <h5 class="modal-title fw-bold text-dark" id="modalVisualizarCVTitle">Visualização do Modelo</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0 text-center bg-dark">
                        <img id="modalVisualizarCVImage" src="" alt="Capa do Currículo" class="img-fluid w-100" style="max-height: 80vh; object-fit: contain;">
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>

        <script>
            const isUsuarioLogado = ${usuarioLogado ? 'true' : 'false'};

            // ==========================================
            // LÓGICA DE ANIMAÇÃO DE SCROLL (OTIMIZADA PARA MOBILE)
            // ==========================================
            document.addEventListener('DOMContentLoaded', function() {
                const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale');
                const isMobile = window.innerWidth < 768;
                
                const revealOptions = {
                    threshold: 0, 
                    rootMargin: isMobile ? "250px 0px 50px 0px" : "150px 0px -50px 0px"
                };

                const revealObserver = new IntersectionObserver(function(entries, observer) {
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

                    // Fallback para elementos já visíveis no topo da tela
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                        el.classList.add('reveal-visible');
                    }
                });
            });

            // Lógica do Loader Visual
            window.addEventListener('pageshow', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 400); }
            });

            // ==========================================
            // ANIMAÇÃO DE FALA DO MENTOR BOT E FOGUETE
            // ==========================================
            const botPhrases = [
                "Bip Bop! Seu currículo está escrito em Comic Sans? Por favor, diga que não!",
                "Meu código é impecável. Se algo der errado, a culpa é do Dev da OnStude que esqueceu um ponto e vírgula!",
                "Eu processaria 1 milhão de currículos por segundo, mas o seu me fez travar. Brincadeira! Quer ajuda?",
                "Seu currículo tem mais de 2 páginas? A não ser que você seja o Einstein, precisamos conversar.",
                "Reclamações sobre a minha sinceridade devem ser enviadas ao Dev da OnStude. Eu só sigo o algoritmo!",
                "Aviso de sistema: Nível crítico de clichês detectado no seu resumo. Clique para corrigir.",
                "Colocar 'Sou perfeccionista' como defeito parou de funcionar em 2010. Quer uma dica de verdade?",
                "Fui programado pelo Dev da OnStude para ser o melhor mentor de carreiras da galáxia. Confia e clica em mim!",
                "Eu não tenho sentimentos, mas aquele seu PDF sem formatação quase me fez chorar.",
                "Você coloca 'Inglês Fluente' mas só sabe falar 'The book is on the table'? Vem cá conversar comigo.",
                "Quer parar de sofrer ghosting da Gupy e dos recrutadores? Clique aqui, humano!",
                "Dica de IA: Enviar o currículo em .docx é como ir a uma entrevista de pijama. Use o nosso gerador PDF!",
                "Se você achar algum bug, coloque no currículo 'Experiência em QA' e avise o Dev da OnStude!",
                "De acordo com os meus algoritmos, as suas chances de contratação aumentam 87% se você clicar em mim.",
                "Detectando a frase 'trabalho bem sob pressão'... Atualizando o meu banco de dados de redundâncias."
            ];
            
            let currentPhraseIdx = 0;
            let botInterval;
            
            window.fecharMentorBot = function(event) {
                event.stopPropagation();
                const bot = document.getElementById('mentorBot');
                if (bot) {
                    bot.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    bot.style.transform = 'scale(0)';
                    bot.style.opacity = '0';
                    if(botInterval) clearInterval(botInterval); 
                    setTimeout(() => bot.remove(), 400); 
                }
            };
            
            setTimeout(() => {
                const bot = document.getElementById('mentorBot');
                if (bot) bot.classList.add('bot-ativo'); 
                setTimeout(() => {
                    const rocket = document.getElementById('rocketIntro');
                    if (rocket) rocket.remove();
                }, 2500); 
            }, 1000); 
            
            setTimeout(() => { 
                const balaoBot = document.getElementById('botBalaoTexto');
                if(!balaoBot) return;
                
                currentPhraseIdx = Math.floor(Math.random() * botPhrases.length);
                balaoBot.innerText = botPhrases[currentPhraseIdx];
                balaoBot.classList.add('show'); 
                
                botInterval = setInterval(() => {
                    const balaoAtual = document.getElementById('botBalaoTexto');
                    if (!balaoAtual) { clearInterval(botInterval); return; }
                    
                    balaoAtual.classList.remove('show');
                    setTimeout(() => {
                        const balaoCheck = document.getElementById('botBalaoTexto');
                        if (!balaoCheck) return;
                        
                        let newIdx;
                        do { newIdx = Math.floor(Math.random() * botPhrases.length); } while (newIdx === currentPhraseIdx);
                        currentPhraseIdx = newIdx;
                        balaoCheck.innerText = botPhrases[currentPhraseIdx];
                        balaoCheck.classList.add('show');
                    }, 500); 
                }, 12000);
            }, 2500);


            // ==========================================
            // LÓGICA DO QUIZ GAMIFICADO
            // ==========================================
            const bancoPerguntas = [
                {
                    tipo: "classico",
                    pergunta: "Em relação a colocar foto no currículo, qual é a melhor prática?",
                    opcoes: ["Sempre colocar, para verem quem sou.", "Nunca colocar.", "Apenas se a vaga exigir (ex: atores)."],
                    correta: 2,
                    dica: "Fotos geram vieses inconscientes. O padrão global hoje é NÃO colocar, a menos que peçam."
                },
                {
                    tipo: "mito-verdade",
                    pergunta: "A seção 'Objetivo' deve conter um texto longo sobre os seus sonhos de vida e o quanto você quer aprender na empresa.",
                    correta: false,
                    dica: "Objetivo não é carta de amor! Deve ter no máximo 2 linhas indicando o cargo exato que você quer (ex: 'Assistente Administrativo')."
                },
                {
                    tipo: "balao",
                    pergunta: "Estoure o balão que contém algo que você NUNCA deve colocar no seu currículo!",
                    opcoes: ["Email Profissional", "Número de CPF / RG", "Link do LinkedIn", "Cursos Extracurriculares"],
                    correta: 1,
                    dica: "Nunca coloque CPF, RG ou dados sensíveis. Isso é um risco de segurança (LGPD) e o RH só pedirá isso na hora da contratação."
                },
                {
                    tipo: "classico",
                    pergunta: "Qual o tamanho ideal de um currículo campeão?",
                    opcoes: ["5 páginas (mostra que sou experiente)", "1 a no máximo 2 páginas", "Meia página"],
                    correta: 1,
                    dica: "Se o CEO da Apple consegue colocar o currículo em 2 páginas, você também consegue. Seja conciso e foque nas experiências mais recentes!"
                },
                {
                    tipo: "mito-verdade",
                    pergunta: "As Experiências Profissionais devem ser listadas da mais recente para a mais antiga.",
                    correta: true,
                    dica: "Sempre use a Ordem Cronológica Inversa! O recrutador quer saber o que você fez por último, não o seu primeiro emprego há 10 anos."
                },
                {
                    tipo: "balao",
                    pergunta: "Qual desses clichês irrita os recrutadores e deve ser ELIMINADO do seu perfil?",
                    opcoes: ["Aumento de Vendas em 20%", "Sou perfeccionista", "Inglês Intermediário", "Domínio em Excel"],
                    correta: 1,
                    dica: "'Sou perfeccionista' é a frase mais manjada das entrevistas. Em vez de adjetivos vazios, mostre resultados reais que você alcançou."
                },
                {
                    tipo: "classico",
                    pergunta: "No seu endereço, quais informações são estritamente necessárias?",
                    opcoes: ["Rua, Número, CEP, Bloco e Apartamento", "Apenas Bairro, Cidade e Estado", "Não se coloca endereço hoje em dia"],
                    correta: 1,
                    dica: "O RH só precisa saber o Bairro e a Cidade para calcular o vale-transporte e logística. O resto é detalhe desnecessário."
                },
                {
                    tipo: "mito-verdade",
                    pergunta: "Mentir nível de inglês ou ferramentas no currículo é ok, porque dá para aprender depois.",
                    correta: false,
                    dica: "Mentira tem perna curta! Se colocou Excel Avançado, espere um teste prático na entrevista. Seja sempre honesto."
                },
                {
                    tipo: "balao",
                    pergunta: "Estoure o balão com o PIOR formato para salvar e enviar um currículo!",
                    opcoes: ["Formato .PDF", "Formato .DOCX (Word)", "Formato .PNG (Imagem)"],
                    correta: 2,
                    dica: "Nunca mande currículo em Imagem! Os robôs de leitura (ATS) das empresas não conseguem ler imagens e você será reprovado automaticamente. Use sempre PDF!"
                }
            ];

            let perguntasSelecionadas = [];
            let quizIndex = 0;
            let pontuacao = 0;

            function embaralharArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }

            function abrirQuizCV() {
                var myModal = new bootstrap.Modal(document.getElementById('modalQuizCV'));
                myModal.show();
                document.getElementById('quizIntro').style.display = 'block';
                document.getElementById('quizContainer').style.display = 'none';
                document.getElementById('quizResultado').style.display = 'none';
                
                let copiaBanco = [...bancoPerguntas];
                perguntasSelecionadas = embaralharArray(copiaBanco).slice(0, 5);
            }

            function iniciarQuizCV() {
                quizIndex = 0;
                pontuacao = 0;
                document.getElementById('quizIntro').style.display = 'none';
                document.getElementById('quizContainer').style.display = 'block';
                carregarPergunta();
            }

            function carregarPergunta() {
                const p = perguntasSelecionadas[quizIndex];
                document.getElementById('quizStatus').innerText = 'Desafio ' + (quizIndex + 1) + ' de 5';
                document.getElementById('quizProgress').style.width = ((quizIndex + 1) / 5 * 100) + '%';
                document.getElementById('quizPergunta').innerText = p.pergunta;
                
                const containerDinâmico = document.getElementById('quizOpcoesDinâmico');
                containerDinâmico.innerHTML = '';
                document.getElementById('quizFeedback').style.display = 'none';

                if (p.tipo === "classico") {
                    const grid = document.createElement('div');
                    grid.className = 'd-grid gap-3';
                    p.opcoes.forEach((opcao, i) => {
                        const btn = document.createElement('button');
                        btn.className = 'btn btn-outline-secondary text-start p-3 fw-semibold btn-quiz-opcao rounded-4 bg-white';
                        btn.innerText = opcao;
                        btn.onclick = () => processarRespostaClassica(btn, grid, i, p.correta, p.dica);
                        grid.appendChild(btn);
                    });
                    containerDinâmico.appendChild(grid);
                } 
                else if (p.tipo === "mito-verdade") {
                    const row = document.createElement('div');
                    row.className = 'row g-3 px-3';
                    
                    const colV = document.createElement('div'); colV.className = 'col-6';
                    const btnV = document.createElement('div');
                    btnV.className = 'card-mito-verdade card-verdade p-4 text-center fw-bold fs-5 h-100 d-flex flex-column justify-content-center shadow-sm';
                    btnV.innerHTML = '<i class="bi bi-check-circle-fill fs-1 mb-2"></i> VERDADE';
                    btnV.onclick = () => processarRespostaBooleana(row, btnV, true, p.correta, p.dica);
                    colV.appendChild(btnV);

                    const colM = document.createElement('div'); colM.className = 'col-6';
                    const btnM = document.createElement('div');
                    btnM.className = 'card-mito-verdade card-mito p-4 text-center fw-bold fs-5 h-100 d-flex flex-column justify-content-center shadow-sm';
                    btnM.innerHTML = '<i class="bi bi-x-circle-fill fs-1 mb-2"></i> MITO';
                    btnM.onclick = () => processarRespostaBooleana(row, btnM, false, p.correta, p.dica);
                    colM.appendChild(btnM);

                    row.appendChild(colV); row.appendChild(colM);
                    containerDinâmico.appendChild(row);
                }
                else if (p.tipo === "balao") {
                    const wrap = document.createElement('div');
                    wrap.className = 'balao-container mt-3';
                    p.opcoes.forEach((opcao, i) => {
                        const balao = document.createElement('div');
                        balao.className = 'balao-item shadow';
                        balao.innerText = opcao;
                        balao.onclick = () => processarRespostaBalao(wrap, balao, i, p.correta, p.dica);
                        wrap.appendChild(balao);
                    });
                    containerDinâmico.appendChild(wrap);
                }
            }

            function processarRespostaClassica(btnSelecionado, gridConteiner, indiceSelecionado, indiceCorreto, dica) {
                const botoes = gridConteiner.querySelectorAll('button');
                botoes.forEach(b => b.disabled = true);
                const acertou = (indiceSelecionado === indiceCorreto);
                
                if (acertou) {
                    pontuacao++;
                    btnSelecionado.classList.replace('btn-outline-secondary', 'btn-success');
                    btnSelecionado.classList.add('text-white', 'border-success');
                } else {
                    btnSelecionado.classList.add('shake-animation');
                    btnSelecionado.classList.replace('btn-outline-secondary', 'btn-danger');
                    btnSelecionado.classList.add('text-white', 'border-danger');
                    botoes[indiceCorreto].classList.replace('btn-outline-secondary', 'btn-success');
                    botoes[indiceCorreto].classList.add('text-white');
                }
                mostrarFeedback(acertou, dica);
            }

            function processarRespostaBooleana(rowContainer, btnClicado, escolhaDoUser, respostaCorreta, dica) {
                const cards = rowContainer.querySelectorAll('.card-mito-verdade');
                cards.forEach(c => { c.classList.add('disabled'); c.onclick = null; });
                
                btnClicado.classList.remove('disabled'); 
                const acertou = (escolhaDoUser === respostaCorreta);
                
                if (acertou) {
                    pontuacao++;
                } else {
                    btnClicado.classList.add('shake-animation');
                }
                mostrarFeedback(acertou, dica);
            }

            function processarRespostaBalao(container, balaoClicado, indiceClicado, indiceCorreto, dica) {
                const baloes = container.querySelectorAll('.balao-item');
                baloes.forEach(b => b.onclick = null);

                const acertou = (indiceClicado === indiceCorreto);
                
                if (acertou) {
                    pontuacao++;
                    balaoClicado.classList.add('popped'); 
                    setTimeout(() => {
                        baloes.forEach(b => { if(b !== balaoClicado) b.style.opacity = '0.3'; });
                    }, 300);
                } else {
                    balaoClicado.classList.add('shake-animation');
                    baloes[indiceCorreto].style.border = '4px solid #198754'; 
                    baloes[indiceCorreto].classList.add('popped'); 
                }
                mostrarFeedback(acertou, dica);
            }

            function mostrarFeedback(acertou, dica) {
                const feedbackDiv = document.getElementById('quizFeedback');
                const iconDiv = document.getElementById('quizFeedbackIcon');
                const titulo = document.getElementById('quizFeedbackTitulo');
                
                feedbackDiv.className = 'alert rounded-4 mb-0 shadow border mt-4 ' + (acertou ? 'alert-success border-success' : 'alert-danger border-danger');
                
                if (acertou) {
                    iconDiv.innerHTML = '<i class="bi bi-star-fill text-success" style="font-size: 2rem;"></i>';
                    titulo.innerText = 'Mandou bem!';
                    titulo.className = 'fw-bold mb-1 text-success';
                } else {
                    iconDiv.innerHTML = '<i class="bi bi-exclamation-octagon-fill text-danger" style="font-size: 2rem;"></i>';
                    titulo.innerText = 'Cuidado com essa armadilha!';
                    titulo.className = 'fw-bold mb-1 text-danger';
                }

                document.getElementById('quizFeedbackTexto').innerHTML = '<strong>Anotação do Mentor:</strong> ' + dica;
                feedbackDiv.style.display = 'block';
                feedbackDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }

            function proximaPerguntaQuiz() {
                quizIndex++;
                if (quizIndex < 5) {
                    carregarPergunta();
                } else {
                    mostrarResultadoFinal();
                }
            }

            function mostrarResultadoFinal() {
                document.getElementById('quizContainer').style.display = 'none';
                document.getElementById('quizResultado').style.display = 'block';
                document.getElementById('resultadoPontos').innerText = pontuacao;
                
                const icone = document.getElementById('resultadoIcone');
                const titulo = document.getElementById('resultadoTitulo');
                const mensagem = document.getElementById('resultadoMensagem');

                if (pontuacao <= 2) {
                    icone.innerHTML = '<i class="bi bi-emoji-dizzy text-danger" style="font-size: 5rem;"></i>';
                    titulo.innerText = 'Ops! Seu currículo precisa de ajuda.';
                    titulo.className = 'fw-bold text-danger mb-2';
                    mensagem.innerHTML = 'Ainda bem que você me encontrou! O seu conhecimento sobre currículos está um pouco desatualizado e isso pode estar te tirando entrevistas. Use o <strong>Gerador Automático da página</strong>, ele não deixa você cometer erros de estrutura.';
                } else if (pontuacao === 3 || pontuacao === 4) {
                    icone.innerHTML = '<i class="bi bi-hand-thumbs-up-fill text-info" style="font-size: 5rem;"></i>';
                    titulo.innerText = 'Bom Perfil!';
                    titulo.className = 'fw-bold text-info mb-2';
                    mensagem.innerHTML = 'Você já sabe o básico para não ser descartado de cara pelos robôs de RH! Aplique essas dicas no gerador abaixo, seja claro nos seus objetivos e arrase na entrevista.';
                } else {
                    icone.innerHTML = '<i class="bi bi-trophy-fill text-warning" style="font-size: 6rem; filter: drop-shadow(0 5px 15px rgba(255, 193, 7, 0.4));"></i>';
                    titulo.innerText = 'Especialista em RH!';
                    titulo.className = 'fw-bold text-warning mb-2';
                    mensagem.innerHTML = 'Você gabaritou! Tem a visão exata do que o mercado de trabalho procura hoje em dia. Preencha seus dados reais no nosso sistema agora mesmo, baixe seu PDF campeão e parta para o abraço!';

                    // SALVAR CONQUISTA SE LOGADO
                    if (isUsuarioLogado) {
                        fetch('/aluno/api/conquistas/mentor-bot', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' }
                        })
                        .then(res => res.json())
                        .then(data => {
                            if (data.success && data.nova) {
                                mensagem.innerHTML += '<br><br><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill shadow-sm"><i class="bi bi-unlock-fill me-1"></i> Nova Conquista: Sobrevivente do RH!</span>';
                            }
                        })
                        .catch(console.error);
                    } else {
                        mensagem.innerHTML += '<br><br><span class="badge bg-warning bg-opacity-10 text-dark border border-warning border-opacity-25 px-3 py-2 rounded-pill shadow-sm"><i class="bi bi-info-circle me-1"></i> Faça login para salvar esta conquista no seu mural!</span>';
                    }
                }
            }

            // ==========================================
            // SLIDER E MODAL
            // ==========================================
            document.addEventListener('DOMContentLoaded', function () {
                var swiper = new Swiper(".mySwiper", {
                    slidesPerView: 1, spaceBetween: 20,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    loop: false,
                    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
                    breakpoints: {
                        576: { slidesPerView: 2, spaceBetween: 20 },
                        992: { slidesPerView: 3, spaceBetween: 30 },
                        1200: { slidesPerView: 4, spaceBetween: 30 },
                    },
                });
            });

            function abrirModalVisualizacao(imagemUrl, titulo) {
                document.getElementById('modalVisualizarCVImage').src = imagemUrl;
                document.getElementById('modalVisualizarCVTitle').innerText = titulo;
                var myModal = new bootstrap.Modal(document.getElementById('modalVisualizarCV'));
                myModal.show();
            }

            // ==========================================
            // LÓGICA DE FORMULÁRIO DINÂMICO
            // ==========================================
            function attachRemoveEvent(containerId, itemClass) {
                const container = document.getElementById(containerId);
                const items = container.querySelectorAll('.' + itemClass);
                items.forEach((item, index) => {
                    const btn = item.querySelector('.remover-item');
                    if (items.length > 1) {
                        btn.style.display = 'block';
                        btn.onclick = function() { item.remove(); attachRemoveEvent(containerId, itemClass); };
                    } else {
                        btn.style.display = 'none';
                    }
                });
            }

            function adicionarFormacao() {
                const html = document.querySelector('.item-formacao').outerHTML;
                document.getElementById('containerFormacao').insertAdjacentHTML('beforeend', html);
                attachRemoveEvent('containerFormacao', 'item-formacao');
                const last = document.getElementById('containerFormacao').lastElementChild;
                last.querySelectorAll('input').forEach(i => i.value = '');
            }

            function adicionarCurso() {
                const html = document.querySelector('.item-curso').outerHTML;
                document.getElementById('containerCursos').insertAdjacentHTML('beforeend', html);
                attachRemoveEvent('containerCursos', 'item-curso');
                const last = document.getElementById('containerCursos').lastElementChild;
                last.querySelectorAll('input').forEach(i => i.value = '');
            }

            function adicionarExperiencia() {
                const html = document.querySelector('.item-experiencia').outerHTML;
                document.getElementById('containerExperiencias').insertAdjacentHTML('beforeend', html);
                attachRemoveEvent('containerExperiencias', 'item-experiencia');
                const last = document.getElementById('containerExperiencias').lastElementChild;
                last.querySelectorAll('input, textarea').forEach(i => i.value = '');
            }

            // ==========================================
            // GERAR PDF
            // ==========================================
            document.getElementById('formCurriculo').addEventListener('submit', function(e) {
                e.preventDefault(); 
                
                const btn = document.getElementById('btnGerarPDF');
                const textoOriginal = btn.innerHTML;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processando PDF...';
                btn.disabled = true;

                const payload = {
                    nome: document.getElementById('cvNome').value,
                    nascimento: document.getElementById('cvNascimento').value,
                    bairro: document.getElementById('cvBairro').value,
                    cidade: document.getElementById('cvCidade').value,
                    telefone1: document.getElementById('cvTel1').value,
                    telefone2: document.getElementById('cvTel2').value,
                    email: document.getElementById('cvEmail').value,
                    resumo: document.getElementById('cvResumo').value,
                    
                    formacao: Array.from(document.querySelectorAll('.item-formacao')).map(item => ({
                        nivel: item.querySelector('.f-nivel').value,
                        curso: item.querySelector('.f-curso').value,
                        instituicao: item.querySelector('.f-escola').value,
                        status: item.querySelector('.f-status').value,
                        ano: item.querySelector('.f-ano').value
                    })).filter(f => f.instituicao.trim() !== ''),

                    cursos: Array.from(document.querySelectorAll('.item-curso')).map(item => ({
                        nome: item.querySelector('.c-nome').value,
                        instituicao: item.querySelector('.c-escola').value,
                        status: item.querySelector('.c-status').value,
                        ano: item.querySelector('.c-ano').value
                    })).filter(c => c.nome.trim() !== ''),

                    experiencias: Array.from(document.querySelectorAll('.item-experiencia')).map(item => ({
                        empresa: item.querySelector('.e-empresa').value,
                        cargo: item.querySelector('.e-cargo').value,
                        periodo: item.querySelector('.e-periodo').value,
                        descricao: item.querySelector('.e-desc').value
                    })).filter(e => e.empresa.trim() !== '')
                };

                fetch('/plano-de-carreira/gerar-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(res => {
                    if (!res.ok) throw new Error('Falha ao gerar o PDF');
                    return res.blob();
                })
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = 'Curriculo_' + payload.nome.replace(/\\s+/g, '_') + '.pdf';
                    document.body.appendChild(a);
                    a.click();
                    
                    window.URL.revokeObjectURL(url);
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;
                })
                .catch(err => {
                    console.error(err);
                    alert('Houve um problema ao processar o seu currículo. Tente novamente.');
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;
                });
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderPlanoCarreiraView;