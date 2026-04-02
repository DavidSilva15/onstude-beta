// views/cadastroView.js

function renderCadastroView(erro = null) {
    return `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OnStude - Registo de Aluno</title>
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
                background-color: #343a40; 
                padding: 15px; /* Reduzido o padding geral da tela */
            }

            /* Card Principal Split Screen */
            .auth-card {
                width: 100%;
                max-width: 1000px; /* Reduzido de 1100px para ficar mais compacto */
                background-color: #ffffff;
                border-radius: 20px; /* Bordas um pouco menores */
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
            }

            /* Coluna da Esquerda (Slider) */
            .left-column {
                background: linear-gradient(135deg, rgba(13, 110, 253, 0.85), rgba(102, 16, 242, 0.9));
                position: relative;
                padding: 2.5rem; /* Reduzido de 3rem */
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
                backdrop-filter: blur(10px);
                min-height: 100%;
            }

            .carousel-indicators { margin-bottom: 0; }
            .carousel-indicators [data-bs-target] { width: 8px; height: 8px; border-radius: 50%; background-color: rgba(255,255,255,0.5); }
            .carousel-indicators .active { background-color: white; }

            /* Coluna da Direita mais compacta */
            .right-column {
                padding: 1.5rem 2.5rem; /* Reduzido de 2rem 3rem */
                display: flex;
                flex-direction: column;
                justify-content: center;
                max-height: 95vh; 
                overflow-y: auto;
            }

            /* Scrollbar customizada para a coluna direita */
            .right-column::-webkit-scrollbar { width: 6px; }
            .right-column::-webkit-scrollbar-track { background: transparent; }
            .right-column::-webkit-scrollbar-thumb { background-color: #dee2e6; border-radius: 10px; }
            .right-column::-webkit-scrollbar-thumb:hover { background-color: #adb5bd; }

            /* ==========================================
               DESIGN DOS CONTAINERS (INPUTS)
               ========================================== */
            .input-group-custom {
                background-color: #f4f6f9;
                border-radius: 10px; /* Reduzido de 14px */
                border: 2px solid #e9ecef;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .input-group-custom:focus-within {
                background-color: #ffffff;
                border-color: #0d6efd;
                box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.15); /* Sombra menor */
            }

            .input-group-text-custom {
                background-color: transparent;
                border: none;
                color: #6c757d;
                padding-left: 0.8rem; /* Espaço interno menor */
                padding-right: 0.4rem;
            }

            /* Inputs com altura reduzida */
            .form-control-custom, .form-select-custom {
                border: none;
                background-color: transparent;
                padding: 0.5rem 0.8rem 0.5rem 0.4rem; /* Bem mais curtos verticalmente */
                font-size: 0.9rem; /* Fonte levemente menor */
                color: #212529;
                width: 100%;
            }
            
            .form-control-custom:focus, .form-select-custom:focus {
                box-shadow: none;
                background-color: transparent;
                outline: none;
            }

            .form-control-custom::placeholder {
                color: #adb5bd;
            }

            /* Botões mais elegantes e menos espessos */
            .btn-custom {
                border-radius: 10px;
                padding: 0.5rem; /* Botões mais finos */
                font-weight: 700;
                letter-spacing: 0.3px;
                transition: all 0.3s;
                height: 42px; /* Reduzido de 48px */
                font-size: 0.95rem;
            }
            .btn-custom:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(25, 135, 84, 0.3); }
            
            .btn-reset {
                border-radius: 10px;
                background-color: #f8f9fa;
                border: 2px solid #e9ecef;
                color: #6c757d;
                transition: all 0.3s;
                height: 42px; /* Reduzido de 48px */
            }
            .btn-reset:hover {
                background-color: #e9ecef;
                color: #dc3545;
                border-color: #dee2e6;
                transform: translateY(-2px);
            }

            .back-link {
                position: absolute;
                top: 15px;
                left: 20px;
                color: rgba(255,255,255,0.8);
                text-decoration: none;
                font-weight: 600;
                transition: color 0.3s;
                z-index: 10;
                font-size: 0.9rem;
            }
            .back-link:hover { color: white; }

            /* ==========================================
               RESPONSIVIDADE EXTREMA (MOBILE)
               ========================================== */
            @media (max-width: 767.98px) {
                #bg-wrapper { 
                    padding: 0; 
                    background-image: none !important; 
                    background-color: #ffffff;
                }
                
                .auth-card { 
                    border-radius: 0; 
                    box-shadow: none; 
                    min-height: 100vh; 
                    max-width: 100%;
                }
                
                .right-column { 
                    padding: 1.5rem 1.2rem; 
                    max-height: none; 
                    overflow-y: visible; 
                    justify-content: flex-start; 
                }

                h3.auth-title { font-size: 1.5rem; }
                p.auth-subtitle { font-size: 0.85rem; margin-bottom: 1rem !important; }
                
                .form-label { font-size: 0.8rem !important; margin-bottom: 0.1rem !important; }
                
                .mobile-back-btn { margin-bottom: 1rem !important; font-size: 0.85rem; }
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
                <i class="bi bi-arrow-left me-1"></i> Voltar ao Início
            </a>

            <div class="auth-card">
                <div class="row g-0 h-100">
                    
                    <div class="col-md-5 col-lg-5 d-none d-md-flex left-column text-white">
                        
                        <div class="mb-4">
                            <i class="bi bi-mortarboard-fill" style="font-size: 3.5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));"></i>
                            <h3 class="fw-bold mt-2 mb-0" style="letter-spacing: -1px;">OnStude<span class="text-info">.</span></h3>
                        </div>

                        <div id="carouselMotivation" class="carousel slide w-100 px-2" data-bs-ride="carousel" data-bs-interval="4000">
                            <div class="carousel-inner text-center" style="min-height: 100px;">
                                <div class="carousel-item active">
                                    <h5 class="fw-bold lh-base mb-2">Comece a sua jornada de sucesso.</h5>
                                    <p class="text-white-50 small mb-0">Crie a sua conta e tenha acesso a conteúdos exclusivos de alto nível.</p>
                                </div>
                                <div class="carousel-item">
                                    <h5 class="fw-bold lh-base mb-2">Qualificação prática e direto ao ponto.</h5>
                                    <p class="text-white-50 small mb-0">Aprenda com quem entende do mercado e destaque-se nas vagas.</p>
                                </div>
                                <div class="carousel-item">
                                    <h5 class="fw-bold lh-base mb-2">Estude onde e quando quiser.</h5>
                                    <p class="text-white-50 small mb-0">Uma plataforma completa pensada no seu desenvolvimento profissional.</p>
                                </div>
                            </div>
                            <div class="carousel-indicators position-relative mt-4 pt-2">
                                <button type="button" data-bs-target="#carouselMotivation" data-bs-slide-to="0" class="active"></button>
                                <button type="button" data-bs-target="#carouselMotivation" data-bs-slide-to="1"></button>
                                <button type="button" data-bs-target="#carouselMotivation" data-bs-slide-to="2"></button>
                            </div>
                        </div>

                    </div>

                    <div class="col-md-7 col-lg-7 right-column relative">
                        
                        <a href="/" class="text-decoration-none text-muted mobile-back-btn d-md-none fw-semibold">
                            <i class="bi bi-arrow-left me-1"></i> Voltar
                        </a>

                        <div class="mb-3">
                            <h3 class="text-dark fw-bold mb-1 auth-title">Crie a sua conta 🚀</h3>
                            <p class="text-muted small auth-subtitle mb-2">Preencha os dados abaixo para se registar como aluno.</p>
                            
                            ${erro ? `
                            <div id="errorBadge" class="alert alert-danger d-flex align-items-center mt-2 py-2 px-3 border-0 rounded-3 shadow-sm transition-all" role="alert" style="transition: opacity 0.5s ease; padding: 0.5rem;">
                                <i class="bi bi-exclamation-triangle-fill me-2" style="font-size: 1.1rem;"></i>
                                <div style="font-size: 0.85rem; font-weight: 600;">${erro}</div>
                            </div>
                            ` : ''}
                        </div>

                        <form action="/cadastro" method="POST" id="formCadastro">
                            
                            <div class="mb-2">
                                <label for="nome" class="form-label fw-bold text-dark small mb-1 ms-1">Nome Completo</label>
                                <div class="d-flex align-items-center input-group-custom">
                                    <span class="input-group-text-custom"><i class="bi bi-person text-secondary"></i></span>
                                    <input type="text" class="form-control form-control-custom" id="nome" name="nome" placeholder="O seu nome completo" required>
                                </div>
                            </div>
                            
                            <div class="mb-2">
                                <label for="email" class="form-label fw-bold text-dark small mb-1 ms-1">E-mail</label>
                                <div class="d-flex align-items-center input-group-custom">
                                    <span class="input-group-text-custom"><i class="bi bi-envelope text-secondary"></i></span>
                                    <input type="email" class="form-control form-control-custom" id="email" name="email" placeholder="nome@email.com" required>
                                </div>
                            </div>

                            <div class="row g-2 mb-2">
                                <div class="col-sm-6">
                                    <label for="senha" class="form-label fw-bold text-dark small mb-1 ms-1">Senha</label>
                                    <div class="d-flex align-items-center input-group-custom">
                                        <span class="input-group-text-custom"><i class="bi bi-lock text-secondary"></i></span>
                                        <input type="password" class="form-control form-control-custom" id="senha" name="senha" placeholder="Senha forte" required minlength="6">
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <label for="confirmar_senha" class="form-label fw-bold text-dark small mb-1 ms-1">Confirmar Senha</label>
                                    <div class="d-flex align-items-center input-group-custom">
                                        <span class="input-group-text-custom"><i class="bi bi-check2-circle text-secondary"></i></span>
                                        <input type="password" class="form-control form-control-custom" id="confirmar_senha" name="confirmar_senha" placeholder="Repita a senha" required minlength="6">
                                    </div>
                                </div>
                            </div>

                            <div class="row g-2 mb-2">
                                <div class="col-sm-6">
                                    <label for="telefone" class="form-label fw-bold text-dark small mb-1 ms-1">Telefone</label>
                                    <div class="d-flex align-items-center input-group-custom">
                                        <span class="input-group-text-custom"><i class="bi bi-telephone text-secondary"></i></span>
                                        <input type="tel" class="form-control form-control-custom" id="telefone" name="telefone" placeholder="(00) 00000-0000" required>
                                    </div>
                                </div>

                                <div class="col-sm-6">
                                    <label for="data_nascimento" class="form-label fw-bold text-dark small mb-1 ms-1">Data de Nasc.</label>
                                    <div class="d-flex align-items-center input-group-custom">
                                        <span class="input-group-text-custom"><i class="bi bi-calendar-date text-secondary"></i></span>
                                        <input type="date" class="form-control form-control-custom" id="data_nascimento" name="data_nascimento" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row g-2 mb-2">
                                <div class="col-sm-8">
                                    <label for="cidade" class="form-label fw-bold text-dark small mb-1 ms-1">Cidade</label>
                                    <div class="d-flex align-items-center input-group-custom">
                                        <span class="input-group-text-custom"><i class="bi bi-buildings text-secondary"></i></span>
                                        <input type="text" class="form-control form-control-custom" id="cidade" name="cidade" placeholder="Ex: Camaçari" required>
                                    </div>
                                </div>

                                <div class="col-sm-4">
                                    <label for="estado" class="form-label fw-bold text-dark small mb-1 ms-1">Estado</label>
                                    <div class="d-flex align-items-center input-group-custom pe-1">
                                        <span class="input-group-text-custom"><i class="bi bi-geo-alt text-secondary"></i></span>
                                        <select class="form-select-custom bg-transparent border-0 px-1" id="estado" name="estado" required style="cursor: pointer;">
                                            <option value="" selected disabled>UF</option>
                                            <option value="AC">AC</option><option value="AL">AL</option><option value="AP">AP</option>
                                            <option value="AM">AM</option><option value="BA">BA</option><option value="CE">CE</option>
                                            <option value="DF">DF</option><option value="ES">ES</option><option value="GO">GO</option>
                                            <option value="MA">MA</option><option value="MT">MT</option><option value="MS">MS</option>
                                            <option value="MG">MG</option><option value="PA">PA</option><option value="PB">PB</option>
                                            <option value="PR">PR</option><option value="PE">PE</option><option value="PI">PI</option>
                                            <option value="RJ">RJ</option><option value="RN">RN</option><option value="RS">RS</option>
                                            <option value="RO">RO</option><option value="RR">RR</option><option value="SC">SC</option>
                                            <option value="SP">SP</option><option value="SE">SE</option><option value="TO">TO</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="form-check mb-2 mt-1 ms-1">
                                <input class="form-check-input border-secondary" type="checkbox" id="aceiteTermos" required>
                                <label class="form-check-label text-muted" for="aceiteTermos" style="font-size: 0.8rem; padding-top: 2px;">
                                    Eu li e concordo com os 
                                    <a href="#" class="text-primary fw-bold text-decoration-none" data-bs-toggle="modal" data-bs-target="#modalTermos">Termos de Uso</a>.
                                </label>
                            </div>
                            
                            <div class="d-flex gap-2 mt-3">
                                <button type="reset" class="btn btn-reset px-3 shadow-sm d-flex align-items-center justify-content-center" title="Limpar formulário">
                                    <i class="bi bi-eraser-fill"></i>
                                </button>
                                <button type="submit" class="btn btn-success btn-custom shadow-sm flex-grow-1 d-flex align-items-center justify-content-center">
                                    Finalizar Registo <i class="bi bi-check2-circle ms-2 fs-6"></i>
                                </button>
                            </div>
                        </form>

                        <div class="text-center mt-3 pt-2 border-top">
                            <p class="text-muted small mb-0 d-inline me-1">Já tem uma conta?</p>
                            <a href="/" class="text-primary fw-bold text-decoration-none hover-shadow transition small">Faça login aqui</a>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalTermos" tabindex="-1" aria-labelledby="modalTermosLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
                <div class="modal-content rounded-4 border-0 shadow-lg">
                    <div class="modal-header bg-light border-bottom-0 pb-0 pt-4 px-4">
                        <h5 class="modal-title fw-bold text-dark" id="modalTermosLabel">
                            <i class="bi bi-file-earmark-text-fill text-primary me-2"></i> Termos de Uso
                        </h5>
                        <button type="button" class="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 p-md-5 text-secondary" style="font-size: 0.9rem; line-height: 1.6;">
                        <h6 class="fw-bold text-dark mb-2">1. Aceitação dos Termos</h6>
                        <p class="mb-4">Ao aceder e utilizar a plataforma OnStude, você concorda em cumprir e ficar vinculado aos seguintes termos e condições de uso. Se não concordar com qualquer parte destes termos, não deverá utilizar os nossos serviços.</p>
                        
                        <h6 class="fw-bold text-dark mb-2">2. Uso da Plataforma e Conta</h6>
                        <p class="mb-4">O utilizador compromete-se a fornecer informações verdadeiras no registo. A sua conta é pessoal e intransmissível, sendo o utilizador o único responsável por manter o sigilo da sua senha de acesso.</p>
                        
                        <h6 class="fw-bold text-dark mb-2">3. Privacidade e Proteção de Dados (LGPD)</h6>
                        <p class="mb-4">A OnStude respeita a sua privacidade. Os seus dados pessoais serão processados de acordo com as leis vigentes e utilizados exclusivamente para fins relacionados com o seu desenvolvimento na plataforma (emissão de certificados, histórico de aulas, etc). Os seus dados não serão vendidos a terceiros.</p>
                        
                        <h6 class="fw-bold text-dark mb-2">4. Direitos Autorais e Propriedade Intelectual</h6>
                        <p class="mb-4">Todo o conteúdo presente na plataforma (vídeos, PDFs, apostilas, quizzes e design) é propriedade exclusiva da OnStude ou dos seus parceiros. É estritamente proibido o download, revenda ou pirataria destes materiais sem autorização prévia por escrito.</p>
                        
                        <h6 class="fw-bold text-dark mb-2">5. Conduta do Aluno</h6>
                        <p class="mb-4">Espera-se que o aluno mantenha uma conduta respeitosa. O uso de automações (bots) para pular vídeos ou fraudar avaliações resultará no bloqueio irreversível da conta sem direito a reembolso.</p>
                    </div>
                    <div class="modal-footer bg-light border-top-0 pt-2 pb-4 px-4 d-flex justify-content-end">
                        <button type="button" class="btn btn-secondary rounded-pill px-4 fw-bold shadow-sm me-2 btn-sm" data-bs-dismiss="modal">Fechar</button>
                        <button type="button" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm btn-sm" onclick="aceitarTermosAutomaticamente()" data-bs-dismiss="modal">Entendi e Aceito</button>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            // ==========================================
            // LÓGICA DE VALIDAÇÃO DE SENHA E TERMOS
            // ==========================================
            
            function aceitarTermosAutomaticamente() {
                document.getElementById('aceiteTermos').checked = true;
            }

            document.getElementById('formCadastro').addEventListener('submit', function(e) {
                const senha = document.getElementById('senha').value;
                const confSenha = document.getElementById('confirmar_senha').value;
                
                if (senha !== confSenha) {
                    e.preventDefault(); 
                    alert('As senhas não coincidem. Por favor, digite senhas idênticas.');
                    document.getElementById('confirmar_senha').focus();
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

            // Só aplica imagem de fundo no desktop para poupar dados e bateria no mobile
            if (window.innerWidth > 767.98) {
                const imagemSorteada = imagensEstudo[Math.floor(Math.random() * imagensEstudo.length)];
                const wrapper = document.getElementById('bg-wrapper');
                wrapper.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(' + imagemSorteada + ')';
                wrapper.style.backgroundSize = 'cover';
                wrapper.style.backgroundPosition = 'center';
                wrapper.style.backgroundRepeat = 'no-repeat';
            }

            // ==========================================
            // LÓGICA DE MENSAGEM DE ERRO
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

            // ==========================================
            // LÓGICA DE LOADING NO CARREGAMENTO
            // ==========================================
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

module.exports = renderCadastroView;