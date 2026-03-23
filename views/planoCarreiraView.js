// views/planoCarreiraView.js

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
                    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative hover-shadow transition">
                        <img src="${modelo.capa_url}" class="card-img-top bg-light" alt="${modelo.titulo}" style="height: 220px; object-fit: cover; border-bottom: 1px solid #eaeaea;">
                        <div class="card-body text-center p-4 d-flex flex-column">
                            <h6 class="fw-bold text-dark mb-4">${modelo.titulo}</h6>
                            
                            <div class="mt-auto d-flex flex-column gap-2">
                                <button type="button" class="btn btn-outline-secondary btn-sm fw-bold px-4 rounded-pill w-100" onclick="abrirModalVisualizacao('${modelo.capa_url}', '${modelo.titulo}')">
                                    <i class="bi bi-eye me-2"></i> Visualizar
                                </button>
                                <a href="${modelo.arquivo_url}" target="_blank" download class="btn btn-primary btn-sm fw-bold px-4 rounded-pill w-100">
                                    <i class="bi bi-download me-2"></i> Baixar Word
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
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; }
            .hover-shadow:hover { transform: translateY(-5px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
            .transition { transition: all 0.3s ease; }
            
            .navbar-custom { background-color: #ffffff; border-bottom: 1px solid #eaeaea; }
            .search-bar-header { background-color: #f1f3f4; border: none; border-radius: 50px; padding-left: 40px; }
            
            .hero-section { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); padding: 80px 0; }
            .hero-title { font-size: 2.8rem; font-weight: 800; color: #1a1a1a; line-height: 1.2; letter-spacing: -1px; }
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
                        <li class="nav-item me-lg-2"><a class="nav-link fw-semibold text-primary hover-primary" href="/plano-de-carreira">Plano de Carreira</a></li>
                        <li class="nav-item me-lg-3"><a class="nav-link fw-semibold text-dark hover-primary" href="/#secao-cursos">Categorias</a></li>
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
                            <a href="/login?returnTo=/plano-de-carreira" class="btn btn-outline-dark fw-bold px-4 rounded-pill">Entrar</a>
                            <a href="/cadastro" class="btn btn-primary fw-bold px-4 rounded-pill">Criar Conta</a>
                        `}
                    </div>
                </div>
            </div>
        </nav>

        <section class="hero-section overflow-hidden border-bottom">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-6 mb-5 mb-lg-0 pe-lg-5 text-center text-lg-start">
                        <span class="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fw-bold">🚀 Impulsione o seu Futuro</span>
                        <h1 class="hero-title mb-4">Crie seu currículo ou escolha um dos <span class="text-primary">modelos</span> para editar conforme sua necessidade.</h1>
                        <p class="hero-subtitle mb-5">Tenha mais visibilidade nos processos seletivos. Utilize a nossa ferramenta gratuita para construir um currículo profissional em PDF em minutos.</p>
                        <div class="d-flex flex-column flex-sm-row justify-content-center justify-content-lg-start gap-3">
                            <a href="#gerador-cv" class="btn btn-primary btn-lg fw-bold px-5 py-3 rounded-pill shadow-sm">Criar Currículo PDF Agora</a>
                            <a href="#modelos-cv" class="btn btn-outline-dark btn-lg fw-bold px-5 py-3 rounded-pill">Ver Modelos Word</a>
                        </div>
                    </div>
                    <div class="col-lg-6 position-relative">
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

        <section id="modelos-cv" class="py-5 bg-white">
            <div class="container py-4">
                <div class="row mb-5 text-center">
                    <div class="col-12">
                        <h2 class="fw-bold text-dark mb-3">Modelos Prontos para Download</h2>
                        <p class="text-muted fs-5 mb-0">Baixe no formato Word (.docx) e edite no seu computador.</p>
                    </div>
                </div>
                <div class="p-4 rounded-4 border bg-light position-relative">
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

        <section id="gerador-cv" class="py-5 bg-light border-top">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-10">
                        <div class="text-center mb-5">
                            <h2 class="fw-bold text-dark">Gerador Automático de Currículo</h2>
                            <p class="text-muted">Preencha os dados abaixo. Nós usamos o nosso motor inteligente para desenhar e entregar o PDF instantaneamente.</p>
                        </div>

                        <div class="card border-0 shadow-lg rounded-4 overflow-hidden">
                            <div class="card-body p-4 p-lg-5 bg-white">
                                <form id="formCurriculo">
                                    
                                    <h5 class="fw-bold text-primary mb-4 border-bottom pb-2"><i class="bi bi-person-vcard me-2"></i>1. Cabeçalho e Dados Pessoais</h5>
                                    <div class="row g-3 mb-5">
                                        <div class="col-md-8">
                                            <label class="form-label fw-semibold">Nome Completo *</label>
                                            <input type="text" id="cvNome" class="form-control bg-light" required placeholder="Ex: João da Silva Santos">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold">Data de Nascimento</label>
                                            <input type="date" id="cvNascimento" class="form-control bg-light">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold">Bairro</label>
                                            <input type="text" id="cvBairro" class="form-control bg-light" placeholder="Ex: Centro">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label fw-semibold">Cidade / Estado *</label>
                                            <input type="text" id="cvCidade" class="form-control bg-light" required placeholder="Ex: Camaçari - BA">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold">Celular / WhatsApp *</label>
                                            <input type="text" id="cvTel1" class="form-control bg-light" required placeholder="(00) 00000-0000">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold">Telefone Recado (Opcional)</label>
                                            <input type="text" id="cvTel2" class="form-control bg-light" placeholder="(00) 0000-0000">
                                        </div>
                                        <div class="col-md-4">
                                            <label class="form-label fw-semibold">E-mail *</label>
                                            <input type="email" id="cvEmail" class="form-control bg-light" required placeholder="seuemail@email.com">
                                        </div>
                                    </div>

                                    <h5 class="fw-bold text-primary mb-4 border-bottom pb-2"><i class="bi bi-chat-text me-2"></i>2. Apresentação e Objetivos</h5>
                                    <div class="mb-5">
                                        <label class="form-label fw-semibold">Fale um pouco sobre você, suas pretensões e objetivos profissionais *</label>
                                        <textarea id="cvResumo" class="form-control bg-light" rows="4" required placeholder="Sou um profissional dedicado, em busca de oportunidades na área de..."></textarea>
                                    </div>

                                    <h5 class="fw-bold text-primary mb-3 border-bottom pb-2"><i class="bi bi-mortarboard me-2"></i>3. Formação Acadêmica</h5>
                                    <div id="containerFormacao">
                                        <div class="row g-3 mb-3 p-3 border rounded bg-light position-relative item-formacao">
                                            <button type="button" class="btn-close position-absolute top-0 end-0 m-2 remover-item" aria-label="Close" style="display:none;"></button>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small">Nível</label>
                                                <select class="form-select f-nivel">
                                                    <option value="Ensino Fundamental">Ensino Fundamental</option>
                                                    <option value="Ensino Médio" selected>Ensino Médio</option>
                                                    <option value="Técnico">Técnico</option>
                                                    <option value="Graduação">Graduação</option>
                                                    <option value="Pós-Graduação">Pós-Graduação</option>
                                                </select>
                                            </div>
                                            <div class="col-md-8">
                                                <label class="form-label fw-semibold small">Curso / Graduação (Opcional)</label>
                                                <input type="text" class="form-control f-curso" placeholder="Ex: Administração, ADS, Informática">
                                            </div>
                                            <div class="col-md-12">
                                                <label class="form-label fw-semibold small">Instituição de Ensino</label>
                                                <input type="text" class="form-control f-escola" placeholder="Nome da Escola/Faculdade">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Status</label>
                                                <select class="form-select f-status">
                                                    <option value="Concluído">Concluído</option>
                                                    <option value="Em Andamento">Em Andamento</option>
                                                    <option value="Incompleto">Incompleto</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Ano (Conclusão ou Previsão)</label>
                                                <input type="text" class="form-control f-ano" placeholder="Ex: 2025">
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary btn-sm fw-bold mb-5" onclick="adicionarFormacao()">+ Adicionar outra Formação</button>

                                    <h5 class="fw-bold text-primary mb-3 border-bottom pb-2"><i class="bi bi-award me-2"></i>4. Cursos e Aprimorações</h5>
                                    <div id="containerCursos">
                                        <div class="row g-3 mb-3 p-3 border rounded bg-light position-relative item-curso">
                                            <button type="button" class="btn-close position-absolute top-0 end-0 m-2 remover-item" aria-label="Close" style="display:none;"></button>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Nome do Curso</label>
                                                <input type="text" class="form-control c-nome" placeholder="Ex: Excel Avançado">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Instituição</label>
                                                <input type="text" class="form-control c-escola" placeholder="Ex: OnStude">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Status</label>
                                                <select class="form-select c-status">
                                                    <option value="Concluído">Concluído</option>
                                                    <option value="Cursando">Cursando</option>
                                                </select>
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Ano de Conclusão</label>
                                                <input type="text" class="form-control c-ano" placeholder="Ex: 2026">
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary btn-sm fw-bold mb-5" onclick="adicionarCurso()">+ Adicionar outro Curso</button>

                                    <h5 class="fw-bold text-primary mb-3 border-bottom pb-2"><i class="bi bi-briefcase me-2"></i>5. Experiências Profissionais</h5>
                                    <div id="containerExperiencias">
                                        <div class="row g-3 mb-3 p-3 border rounded bg-light position-relative item-experiencia">
                                            <button type="button" class="btn-close position-absolute top-0 end-0 m-2 remover-item" aria-label="Close" style="display:none;"></button>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Empresa / Local</label>
                                                <input type="text" class="form-control e-empresa" placeholder="Nome da empresa">
                                            </div>
                                            <div class="col-md-6">
                                                <label class="form-label fw-semibold small">Cargo / Função</label>
                                                <input type="text" class="form-control e-cargo" placeholder="Ex: Assistente Administrativo">
                                            </div>
                                            <div class="col-md-12">
                                                <label class="form-label fw-semibold small">Período (Início e Fim)</label>
                                                <input type="text" class="form-control e-periodo" placeholder="Ex: Jan/2022 - Atual (ou Dez/2024)">
                                            </div>
                                            <div class="col-md-12">
                                                <label class="form-label fw-semibold small">Breve descrição das atividades (Opcional)</label>
                                                <textarea class="form-control e-desc" rows="2" placeholder="Descreva o que fazia nesta função..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary btn-sm fw-bold mb-5" onclick="adicionarExperiencia()">+ Adicionar outra Experiência</button>

                                    <div class="text-center border-top pt-5 mt-4">
                                        <button type="submit" class="btn btn-success btn-lg fw-bold px-5 py-3 rounded-pill shadow" id="btnGerarPDF">
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

        <footer class="bg-dark text-white pt-5 pb-3 mt-5">
            <div class="container">
                <div class="row mb-4">
                    <div class="col-lg-5 mb-4 mb-lg-0">
                        <h3 class="fw-bold text-primary mb-3">OnStude<span class="text-white">.</span></h3>
                        <p class="text-white-50 small pe-lg-5">Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho.</p>
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
                        <a href="https://www.instagram.com/71dev_/" target="_blank" class="text-white-50 text-decoration-none fs-5 mx-2 hover-white transition"><i class="bi bi-instagram"></i></a>
                        <a href="https://wa.me/5571983174920" target="_blank" class="text-white-50 text-decoration-none fs-5 ms-2 hover-white transition"><i class="bi bi-whatsapp"></i></a>
                    </div>
                </div>
            </div>
        </footer>

        <div class="modal fade" id="modalVisualizarCV" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-header bg-light border-0">
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
            // INICIALIZAR O SLIDER DE MODELOS
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

            // FUNÇÃO PARA ABRIR O MODAL DE VISUALIZAÇÃO
            function abrirModalVisualizacao(imagemUrl, titulo) {
                document.getElementById('modalVisualizarCVImage').src = imagemUrl;
                document.getElementById('modalVisualizarCVTitle').innerText = titulo;
                var myModal = new bootstrap.Modal(document.getElementById('modalVisualizarCV'));
                myModal.show();
            }

            // ==========================================
            // LÓGICA DE ADICIONAR/REMOVER CAMPOS DINÂMICOS
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
            // LÓGICA DE ENVIO PARA O BACKEND (PDFKIT)
            // ==========================================
            document.getElementById('formCurriculo').addEventListener('submit', function(e) {
                e.preventDefault(); 
                
                const btn = document.getElementById('btnGerarPDF');
                const textoOriginal = btn.innerHTML;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Processando PDF...';
                btn.disabled = true;

                // 1. Pacote de dados (JSON)
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
                        curso: item.querySelector('.f-curso').value, // <-- O novo campo de Graduação
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

                // 2. Dispara requisição POST via Fetch
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