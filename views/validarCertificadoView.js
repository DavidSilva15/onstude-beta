// views/validarCertificadoView.js

function renderValidarCertificadoView(resultado, tokenBuscado) {
    
    // Converte o objeto resultado para ser injetado e lido pelo JavaScript do lado do cliente
    const resultadoJson = resultado ? JSON.stringify(resultado) : 'null';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Validar Certificado - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { 
                background-color: #f8f9fa; 
                min-height: 100vh; 
                display: flex; 
                flex-direction: column; 
                font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }
            .header-public { 
                background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%); 
                color: white; 
                padding: 5rem 0 4rem 0; 
                position: relative;
                overflow: hidden;
            }
            /* Elementos decorativos no fundo do header */
            .header-public::before {
                content: '🎓';
                position: absolute;
                font-size: 15rem;
                opacity: 0.05;
                top: -20%;
                right: -5%;
                transform: rotate(15deg);
            }
            .header-public::after {
                content: '🏆';
                position: absolute;
                font-size: 10rem;
                opacity: 0.05;
                bottom: -10%;
                left: 5%;
                transform: rotate(-20deg);
            }

            .search-card {
                margin-top: -50px;
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                border: 4px solid #ffffff;
            }

            /* Efeitos e Animações Gamificadas */
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .anim-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }

            @keyframes bounceIn {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }
            .anim-bounce-in { animation: bounceIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

            @keyframes pulseWarning {
                0% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.7); }
                70% { box-shadow: 0 0 0 20px rgba(255, 193, 7, 0); }
                100% { box-shadow: 0 0 0 0 rgba(255, 193, 7, 0); }
            }
            .anim-pulse { animation: pulseWarning 2s infinite; }

            .cert-preview {
                position: relative;
                width: 100%;
                aspect-ratio: 1.41 / 1;
                background-color: #fff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                border: 1px solid #dee2e6;
            }
            .cert-preview img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: absolute;
                top: 0;
                left: 0;
            }
        </style>
    </head>
    <body>
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <nav class="navbar navbar-dark bg-dark shadow-sm">
            <div class="container">
                <a class="navbar-brand fw-bold text-primary mx-auto mx-md-0 d-flex align-items-center" href="/">
                    <i class="bi bi-mortarboard-fill me-2"></i> OnStude
                </a>
                <a href="/" class="btn btn-sm btn-outline-light d-none d-md-block rounded-pill px-3 fw-bold">Acessar Plataforma</a>
            </div>
        </nav>

        <header class="header-public text-center">
            <div class="container position-relative z-1">
                <span class="badge bg-white text-primary mb-3 px-3 py-2 rounded-pill shadow-sm"><i class="bi bi-shield-check me-1"></i> Verificação Oficial</span>
                <h1 class="fw-bold mb-3 display-5">Validar Certificado</h1>
                <p class="fs-5 opacity-75 mx-auto" style="max-width: 600px;">Verifique a autenticidade dos certificados emitidos pela plataforma informando o código exclusivo de 8 dígitos impresso no documento.</p>
            </div>
        </header>

        <main class="container flex-grow-1">
            <div class="row justify-content-center">
                <div class="col-lg-8 col-xl-7">
                    <div class="card bg-white search-card p-4 p-md-5">
                        <form action="/validar" method="GET" id="formValidacao">
                            <label class="form-label fw-bold text-dark mb-3 fs-5"><i class="bi bi-upc-scan text-primary me-2"></i>Código de Verificação</label>
                            <div class="input-group input-group-lg shadow-sm rounded-pill overflow-hidden border border-2 border-light bg-light">
                                <input type="text" class="form-control border-0 bg-transparent text-center text-uppercase fw-bolder text-primary" id="tokenInput" name="token" value="${tokenBuscado || ''}" placeholder="Ex: A1B2C3D4" maxlength="8" required style="letter-spacing: 5px; font-size: 1.5rem;">
                                <button type="submit" class="btn btn-primary px-4 px-md-5 fw-bold" id="btnValidar">Verificar</button>
                            </div>
                            <div class="text-center mt-3">
                                <small class="text-muted"><i class="bi bi-info-circle me-1"></i> O código pode ser encontrado no rodapé do seu certificado.</small>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>

        <footer class="bg-dark text-white text-center py-4 mt-5">
            <div class="container">
                <p class="mb-0 text-muted small">&copy; ${new Date().getFullYear()} OnStude. Todos os direitos reservados.</p>
            </div>
        </footer>

        <div class="modal fade" id="modalResultado" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content rounded-4 border-0 shadow-lg overflow-hidden" id="modalContent">
                    </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            // Recebe o objeto do backend
            const resultadoBack = ${resultadoJson};
            const tokenPesquisado = "${tokenBuscado || ''}";

            document.addEventListener('DOMContentLoaded', function() {
                
                // Se existe um resultado vindo do servidor, monta e abre o modal
                if (resultadoBack) {
                    montarExibirModal(resultadoBack);
                }

                // Efeito no form
                document.getElementById('formValidacao').addEventListener('submit', function() {
                    const btn = document.getElementById('btnValidar');
                    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Buscando...';
                    btn.classList.add('disabled');
                });
            });

            // ==========================================
            // LÓGICA DE ÁUDIOS (Opcional, falha graciosamente se o browser bloquear)
            // ==========================================
            function tocarAudio(tipo) {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    function playTone(freq, type, time, duration, vol) {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = type;
                        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
                        gain.gain.setValueAtTime(vol, ctx.currentTime + time);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + duration);
                        osc.connect(gain); gain.connect(ctx.destination);
                        osc.start(ctx.currentTime + time); osc.stop(ctx.currentTime + time + duration);
                    }

                    if (tipo === 'sucesso') {
                        playTone(523.25, 'sine', 0, 0.1, 0.3); // C5
                        playTone(659.25, 'sine', 0.1, 0.1, 0.3); // E5
                        playTone(783.99, 'sine', 0.2, 0.3, 0.3); // G5
                    } else if (tipo === 'erro') {
                        playTone(300, 'sawtooth', 0, 0.2, 0.3);
                        playTone(250, 'sawtooth', 0.2, 0.3, 0.3);
                    }
                } catch(e) { /* Ignora se não houver suporte a áudio */ }
            }

            // ==========================================
            // LÓGICA DE EXPLOSÃO DE PARTICULAS (SUCESSO)
            // ==========================================
            function dispararConfetes(containerId) {
                const container = document.getElementById(containerId);
                if(!container) return;
                
                const cores = ['#ffd700', '#ffffff', '#198754', '#4dd496'];
                const icones = ['bi-star-fill', 'bi-circle-fill', 'bi-square-fill'];
                
                for(let i=0; i<40; i++) {
                    const particle = document.createElement('i');
                    const cor = cores[Math.floor(Math.random() * cores.length)];
                    const icone = icones[Math.floor(Math.random() * icones.length)];
                    
                    particle.className = \`bi \${icone} position-absolute\`;
                    particle.style.color = cor;
                    particle.style.fontSize = (Math.random() * 12 + 8) + 'px';
                    particle.style.left = '50%';
                    particle.style.top = '50%';
                    particle.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
                    particle.style.transform = 'translate(-50%, -50%)';
                    particle.style.zIndex = '10';
                    container.appendChild(particle);
                    
                    setTimeout(() => {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * 300 + 50;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        particle.style.transform = \`translate(calc(-50% + \${tx}px), calc(-50% + \${ty}px)) rotate(\${Math.random()*360}deg)\`;
                        particle.style.opacity = '0';
                    }, 50);
                    
                    setTimeout(() => particle.remove(), 1100);
                }
            }

            // ==========================================
            // MONTAGEM DO MODAL COM BASE NO RESULTADO
            // ==========================================
            function montarExibirModal(res) {
                const content = document.getElementById('modalContent');
                let html = '';
                let eventoAnimacao = null;

                // 1. ERRO / NÃO ENCONTRADO
                if (res.error) {
                    html = \`
                        <div class="modal-body text-center p-5 position-relative">
                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>
                            <div class="bg-danger bg-opacity-10 text-danger rounded-circle d-inline-flex align-items-center justify-content-center mb-4" style="width: 100px; height: 100px;">
                                <i class="bi bi-x-octagon-fill anim-bounce-in" style="font-size: 3.5rem;"></i>
                            </div>
                            <h2 class="fw-bold text-dark mb-2">Certificado Inválido</h2>
                            <p class="text-muted fs-5 mb-4">O código <strong class="text-dark bg-light px-2 py-1 rounded border border-secondary">\${tokenPesquisado}</strong> não existe ou está incorreto.</p>
                            <button type="button" class="btn btn-outline-danger rounded-pill px-4 fw-bold" data-bs-dismiss="modal">Tentar Novamente</button>
                        </div>
                    \`;
                    eventoAnimacao = () => { 
                        tocarAudio('erro'); 
                        content.classList.add('anim-shake'); 
                    };
                } 
                // 2. CURSO PENDENTE
                else if (res.status === 'PENDENTE') {
                    html = \`
                        <div class="modal-body text-center p-5 position-relative">
                            <button type="button" class="btn-close position-absolute top-0 end-0 m-3" data-bs-dismiss="modal"></button>
                            <div class="bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-4 anim-pulse" style="width: 90px; height: 90px;">
                                <i class="bi bi-hourglass-split anim-bounce-in" style="font-size: 3rem;"></i>
                            </div>
                            <h2 class="fw-bold text-dark mb-1">\${res.aluno_nome}</h2>
                            <p class="text-muted fs-5 mb-4">Matriculado no curso: <strong class="text-dark">\${res.curso_titulo}</strong></p>
                            
                            <div class="cert-preview mx-auto mb-4 bg-dark">
                                <img src="\${res.template_url || 'https://via.placeholder.com/800x600'}" style="opacity: 0.3; filter: blur(4px);" alt="Template Bloqueado">
                                <div class="position-absolute top-50 start-50 translate-middle text-center w-100">
                                    <i class="bi bi-lock-fill text-white opacity-75" style="font-size: 3.5rem;"></i>
                                    <h4 class="text-white fw-bold mt-2">Certificado Bloqueado</h4>
                                    <p class="text-light opacity-75 mb-0">Aguardando a conclusão total do curso</p>
                                </div>
                            </div>
                            <button type="button" class="btn btn-warning fw-bold text-dark rounded-pill px-5 shadow-sm" data-bs-dismiss="modal">Entendi</button>
                        </div>
                    \`;
                    eventoAnimacao = () => { tocarAudio('erro'); };
                } 
                // 3. SUCESSO / CONCLUÍDO
                else if (res.status === 'CONCLUIDO') {
                    html = \`
                        <div class="modal-body p-0">
                            <div class="bg-success text-white text-center p-5 position-relative overflow-hidden" id="headerSucesso">
                                <button type="button" class="btn-close btn-close-white position-absolute top-0 end-0 m-3 z-3" data-bs-dismiss="modal"></button>
                                <div class="bg-white text-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style="width: 80px; height: 80px; position: relative; z-index: 2;">
                                    <i class="bi bi-patch-check-fill anim-bounce-in" style="font-size: 3rem;"></i>
                                </div>
                                <h2 class="fw-bolder position-relative z-2" style="letter-spacing: 1px;">Certificado Válido e Autêntico!</h2>
                            </div>
                            
                            <div class="p-4 p-md-5 bg-white">
                                <div class="row align-items-center">
                                    <div class="col-md-6 mb-4 mb-md-0 text-center text-md-start">
                                        <p class="text-uppercase text-success fw-bold small mb-1"><i class="bi bi-award-fill me-1"></i> Titular do Certificado</p>
                                        <h3 class="fw-bold text-dark mb-1">\${res.aluno_nome}</h3>
                                        <p class="text-muted fs-6 mb-4">Concluiu: <strong class="text-dark">\${res.curso_titulo}</strong></p>
                                        
                                        <div class="d-flex flex-column gap-3 mb-4">
                                            <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <span class="text-secondary small fw-semibold">Data de Emissão:</span>
                                                <span class="fw-bold text-dark">\${res.data_conclusao}</span>
                                            </div>
                                            <div class="d-flex justify-content-between align-items-center border-bottom pb-2">
                                                <span class="text-secondary small fw-semibold">Nota Média Final:</span>
                                                <span class="badge bg-primary rounded-pill px-3 py-2">\${res.media_notas} / 10.0</span>
                                            </div>
                                            <div class="d-flex justify-content-between align-items-center pb-1">
                                                <span class="text-secondary small fw-semibold">Código Validador:</span>
                                                <span class="fw-bold text-success font-monospace bg-success bg-opacity-10 px-2 py-1 rounded">\${res.token}</span>
                                            </div>
                                        </div>
                                        <div class="d-grid">
                                            <button class="btn btn-outline-secondary rounded-pill fw-bold" data-bs-dismiss="modal">Nova Consulta</button>
                                        </div>
                                    </div>
                                    
                                    <div class="col-md-6">
                                        <div class="cert-preview">
                                            <img src="\${res.template_url || 'https://via.placeholder.com/800x600'}" alt="Certificado">
                                            <div class="position-absolute w-100 text-center" style="top: 40%;">
                                                <h3 class="fw-bold text-dark" style="font-family: Georgia, serif; text-shadow: 2px 2px 4px rgba(255,255,255,0.8);">\${res.aluno_nome}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;
                    eventoAnimacao = () => { 
                        tocarAudio('sucesso');
                        setTimeout(() => dispararConfetes('headerSucesso'), 200); 
                    };
                }

                content.innerHTML = html;
                const modal = new bootstrap.Modal(document.getElementById('modalResultado'));
                
                // Ativa a animação assim que o modal fica completamente visível
                document.getElementById('modalResultado').addEventListener('shown.bs.modal', function handler() {
                    if(eventoAnimacao) eventoAnimacao();
                    // Remove o listener para não disparar duas vezes se fechar e abrir
                    document.getElementById('modalResultado').removeEventListener('shown.bs.modal', handler);
                });

                modal.show();

                // Limpa a URL (remove o ?token=...) para se o usuário atualizar a página não reabrir o modal sem querer
                window.history.replaceState({}, document.title, window.location.pathname);
            }

            // ==========================================
            // LÓGICA DO LOADER GLOBAL
            // ==========================================
            window.addEventListener('pageshow', function(event) {
                const loader = document.getElementById('globalLoader');
                if (loader) {
                    if (event.persisted) { loader.style.display = 'none'; loader.style.opacity = '0'; } 
                    else { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; }, 400); }
                }
            });
            window.addEventListener('beforeunload', function() {
                const loader = document.getElementById('globalLoader');
                if (loader) { loader.style.display = 'flex'; setTimeout(() => { loader.style.opacity = '1'; }, 10); }
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderValidarCertificadoView;