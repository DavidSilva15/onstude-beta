// views/alunoDashboardView.js

const renderAlunoMenuLateral = require('./alunoMenuLateral');

function renderAlunoDashboardView(aluno, cursosMatriculados, kpiData) {
    
    const htmlSidebar = renderAlunoMenuLateral(aluno, 'dashboard');
    // Adicionado novamente o fallback do melhoresCursos
    const kpis = kpiData || { notaMedia: '0.0', aulasConcluidas: '0', melhoresCursos: 'Ainda sem notas', totalXp: '0' };

    // ==========================================
    // LÓGICA DO SELETOR DE RANKING
    // ==========================================
    let opcoesRankingCursos = '';
    if (cursosMatriculados.length === 0) {
        opcoesRankingCursos = '<option disabled selected>Nenhum curso matriculado</option>';
    } else {
        cursosMatriculados.forEach((curso, index) => {
            opcoesRankingCursos += `<option value="${curso.curso_id}" ${index === 0 ? 'selected' : ''}>${curso.titulo}</option>`;
        });
    }

    // ==========================================
    // LÓGICA DE CURSOS (MENORES E GRID 4x)
    // ==========================================
    let htmlCursos = '';
    if (cursosMatriculados.length === 0) {
        htmlCursos = `
            <div class="col-12 text-center py-5 mt-4 bg-white border-0 rounded-4 shadow-sm">
                <i class="bi bi-journal-x fs-1 opacity-25 mb-3 d-block text-secondary"></i>
                <h4 class="text-dark fw-bold mb-2">Ainda não possui cursos</h4>
                <p class="text-muted mb-0">Assim que for matriculado num curso, ele aparecerá aqui.</p>
            </div>
        `;
    } else {
        cursosMatriculados.forEach(curso => {
            const percentual = parseFloat(curso.percentual) || 0;
            const concluidas = curso.aulas_concluidas || 0;
            const total = curso.total_aulas || 0;
            const capa = curso.capa_url ? curso.capa_url : 'https://via.placeholder.com/600x400?text=Curso+OnStude';
            
            const textoBotao = percentual === 0 ? 'Iniciar Curso' : (percentual >= 100 ? 'Revisar Curso' : 'Continuar Curso');
            const corBotao = percentual >= 100 ? 'btn-success' : 'btn-primary';

            htmlCursos += `
                <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
                    <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden hover-card transition-all">
                        <img src="${capa}" class="card-img-top border-bottom" alt="Capa de ${curso.titulo}" style="height: 140px; object-fit: cover;">
                        <div class="card-body p-3 d-flex flex-column">
                            <span class="badge bg-light text-dark border mb-2 align-self-start px-2 py-1" style="font-size: 0.65rem;"><i class="bi bi-upc-scan me-1"></i>${curso.codigo_unico}</span>
                            <h6 class="card-title fw-bold text-dark mb-3 text-truncate" title="${curso.titulo}">${curso.titulo}</h6>
                            
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-muted fw-semibold" style="font-size: 0.7rem;">Progresso <span class="fw-normal">(${concluidas}/${total})</span></small>
                                    <small class="text-primary fw-bold" style="font-size: 0.75rem;"><span class="counter-anim" data-target="${percentual.toFixed(0)}">0</span>%</small>
                                </div>
                                <div class="progress mb-3 rounded-pill bg-light border" style="height: 6px;">
                                    <div class="progress-bar ${corBotao.replace('btn-', 'bg-')} progress-bar-anim" role="progressbar" style="width: 0%; transition: width 1.5s ease-out;" data-progress="${percentual}" aria-valuenow="${percentual}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <div class="d-grid">
                                    <a href="/aluno/cursos/${curso.curso_id}/aula" class="btn ${corBotao} btn-sm fw-bold rounded-pill shadow-sm">${textoBotao}</a>
                                </div>
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
        <title>Área do aluno - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } 
            }
            .hover-card:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; transform: translateY(-5px); }
            .transition-all { transition: all .3s ease; }
            
            /* Gamificação & Ranking CSS */
            .leaderboard-card { background: linear-gradient(180deg, #ffffff 0%, #fcfcfc 100%); }
            .rank-item { transition: all 0.3s ease; border-left: 4px solid transparent; }
            .rank-item:hover { transform: translateX(5px); background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            
            .rank-1 { border-left-color: #ffd700; background-color: rgba(255, 215, 0, 0.05); }
            .rank-2 { border-left-color: #c0c0c0; background-color: rgba(192, 192, 192, 0.05); }
            .rank-3 { border-left-color: #cd7f32; background-color: rgba(205, 127, 50, 0.05); }
            .rank-user { border-left-color: #0d6efd; background-color: rgba(13, 110, 253, 0.05); }
            
            /* Animações de Ranking */
            @keyframes rankUpEffect {
                0% { background-color: rgba(25, 135, 84, 0.3); transform: translateY(15px); opacity: 0; box-shadow: 0 0 20px rgba(25, 135, 84, 0.5); }
                100% { background-color: rgba(13, 110, 253, 0.05); transform: translateY(0); opacity: 1; box-shadow: none; }
            }
            .anim-rank-up { animation: rankUpEffect 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
            
            @keyframes pulseLive { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
            .anim-pulse { animation: pulseLive 2s infinite; }
            
            @keyframes blinkUp { 0% { transform: translateY(0); } 50% { transform: translateY(-3px); color: #198754 !important; } 100% { transform: translateY(0); } }
            .blink-up { animation: blinkUp 1s ease infinite; }

            .notif-item:hover { background-color: #f1f3f5; cursor: pointer; }

            /* Scroll customizado para o ranking */
            .custom-scroll::-webkit-scrollbar { width: 5px; }
            .custom-scroll::-webkit-scrollbar-track { background: transparent; }
            .custom-scroll::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
            .custom-scroll:hover::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.25); }
        </style>
    </head>
    <body class="bg-light">
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

                    <div class="row mb-4 align-items-center">
                        <div class="col-12">
                            <h2 class="fw-bold text-dark mb-1">Olá, ${aluno.nome.split(' ')[0]} 👋</h2>
                            <p class="text-muted">Bem-vindo de volta! Que tal continuarmos a sua jornada de aprendizagem?</p>
                        </div>
                    </div>

                    <div class="row mb-5 g-4 align-items-stretch">
                        
                        <div class="col-lg-4 col-xl-3 d-flex flex-column gap-3">
                            <h6 class="fw-bold text-secondary text-uppercase mb-1" style="font-size: 0.8rem;"><i class="bi bi-lightning-charge-fill text-warning me-1"></i> Minhas Conquistas</h6>
                            
                            <div class="card border-0 shadow-sm rounded-4 hover-card px-4 py-3 d-flex flex-row align-items-center justify-content-between transition-all">
                                <div class="w-100 overflow-hidden">
                                    <h6 class="text-muted fw-bold mb-1" style="font-size: 0.75rem;">Total de XP (Experiência)</h6>
                                    <h5 class="fw-bold text-dark mb-0 text-truncate">🏆 <span class="counter-anim" data-target="${kpis.totalXp}">0</span> XP</h5>
                                </div>
                            </div>

                            <div class="card border-0 shadow-sm rounded-4 hover-card px-4 py-3 d-flex flex-row align-items-center justify-content-between transition-all">
                                <div class="w-100 overflow-hidden">
                                    <h6 class="text-muted fw-bold mb-1" style="font-size: 0.75rem;">Melhor Desempenho</h6>
                                    <h5 class="fw-bold text-dark mb-0 text-truncate" title="${kpis.melhoresCursos}">🏅 ${kpis.melhoresCursos}</h5>
                                </div>
                            </div>

                            <div class="card border-0 shadow-sm rounded-4 hover-card px-4 py-3 d-flex flex-row align-items-center justify-content-between transition-all">
                                <div class="w-100 overflow-hidden">
                                    <h6 class="text-muted fw-bold mb-1" style="font-size: 0.75rem;">Aulas Concluídas</h6>
                                    <h5 class="fw-bold text-dark mb-0 text-truncate">📚 ${kpis.aulasConcluidas}</h5>
                                </div>
                            </div>

                            <div class="card border-0 shadow-sm rounded-4 hover-card px-4 py-3 d-flex flex-row align-items-center justify-content-between transition-all">
                                <div class="w-100 overflow-hidden">
                                    <h6 class="text-muted fw-bold mb-1" style="font-size: 0.75rem;">Nota Média Geral</h6>
                                    <h5 class="fw-bold text-dark mb-0 text-truncate">⭐ <span class="counter-anim-float" data-target="${kpis.notaMedia}">0.0</span></h5>
                                </div>
                            </div>
                        </div>

                        <div class="col-lg-8 col-xl-9 d-flex flex-column">
                            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 mt-4 mt-lg-0 gap-2">
                                <h6 class="fw-bold text-secondary text-uppercase mb-0 d-flex align-items-center" style="font-size: 0.8rem;">
                                    <i class="bi bi-trophy-fill text-primary me-2"></i> Top Alunos
                                    <span class="badge bg-danger rounded-pill ms-2 px-2 py-1 anim-pulse" style="font-size: 0.65rem;">AO VIVO</span>
                                </h6>
                                <select class="form-select form-select-sm shadow-sm border-0 fw-bold text-primary rounded-pill px-3" id="seletorRankingCurso" style="width: auto; min-width: 200px; max-width: 100%;">
                                    ${opcoesRankingCursos}
                                </select>
                            </div>
                            
                            <div class="card border-0 shadow-sm rounded-4 overflow-hidden leaderboard-card flex-grow-1 d-flex flex-column">
                                <div class="card-header bg-white border-bottom py-3 d-flex justify-content-between small text-muted fw-bold text-uppercase" style="font-size: 0.7rem;">
                                    <span>Posição</span>
                                    <span>Aluno / XP</span>
                                </div>
                                <div class="d-flex flex-column custom-scroll" id="containerListaRanking" style="min-height: 150px; max-height: 240px; overflow-y: auto; position: relative;">
                                    <div class="d-flex justify-content-center align-items-center h-100 w-100 position-absolute" id="rankingLoader">
                                        <div class="spinner-border text-primary" role="status"></div>
                                    </div>
                                </div>
                                <div class="card-footer bg-light border-0 text-center py-2 mt-auto">
                                    <small class="text-muted fw-semibold" style="font-size: 0.75rem;"><i class="bi bi-info-circle me-1"></i> Ganhe XP ao concluir aulas e avaliações!</small>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="row mb-4 mt-3">
                        <div class="col-12 d-flex justify-content-between align-items-center border-bottom pb-3">
                            <h4 class="fw-bold text-dark mb-0"><i class="bi bi-collection-play text-primary me-2"></i>Meus Cursos</h4>
                        </div>
                    </div>

                    <div class="row">
                        ${htmlCursos}
                    </div>

                </div>
            </div>
        </div>

        <div class="modal fade" id="modalNotificacao" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-header bg-primary text-white border-0 py-3">
                        <h5 class="modal-title fw-bold" id="notifTitulo">Aviso Importante</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-4 text-center">
                        <img id="notifImagem" src="" class="img-fluid rounded-4 shadow-sm mb-4 d-none" style="max-height: 250px; width: 100%; object-fit: cover;">
                        <p id="notifMensagem" class="fs-5 text-secondary mb-4"></p>

                        <div id="alertaJaRespondido" class="alert alert-success border-success bg-success bg-opacity-10 d-none mb-3 text-start rounded-4">
                            <strong><i class="bi bi-check-circle-fill me-2"></i>Você já respondeu!</strong> Obrigado pelo seu feedback.
                        </div>

                        <div id="areaPesquisaTexto" class="d-none text-start mb-3 bg-light p-3 rounded-4 border border-light">
                            <label class="form-label fw-bold text-dark">Sua resposta:</label>
                            <textarea id="inputPesquisaTexto" class="form-control" rows="3" placeholder="Escreva aqui..."></textarea>
                        </div>

                        <div id="areaAvaliacaoEstrelas" class="d-none mb-3 bg-light p-3 rounded-4 border border-light">
                            <h6 class="fw-bold text-dark mb-2">Avalie:</h6>
                            <div id="estrelasContainer" class="fs-1 text-secondary" style="cursor: pointer; letter-spacing: 5px;">
                                <span data-val="1">★</span><span data-val="2">★</span><span data-val="3">★</span><span data-val="4">★</span><span data-val="5">★</span>
                            </div>
                            <input type="hidden" id="inputAvaliacaoEstrelas" value="0">
                        </div>
                    </div>
                    <div class="modal-footer border-0 bg-light justify-content-center py-3">
                        <button type="button" class="btn btn-primary btn-lg fw-bold px-5 shadow-sm rounded-pill" id="btnResponderNotificacao">
                            Entendido
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="modalConquistaDesbloqueada" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden" style="background: linear-gradient(135deg, #ffffff, #fcfcfc);">
                    <div class="modal-body text-center p-5 position-relative" id="conquistaExplosionContainer">
                        <div id="conquistaIcon" class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-warning bg-opacity-10 mx-auto shadow-sm" style="width: 120px; height: 120px; font-size: 5rem; filter: drop-shadow(0 10px 15px rgba(255, 193, 7, 0.4)); transform: scale(0); transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                            🏆
                        </div>
                        <br>
                        <span class="badge bg-success mb-3 px-3 py-2 rounded-pill text-uppercase" style="letter-spacing: 1px;"><i class="bi bi-unlock-fill me-1"></i> Nova Conquista!</span>
                        <h2 class="fw-bold text-dark mb-2" id="conquistaTitulo">Título da Conquista</h2>
                        <p class="text-secondary fs-6 mb-4" id="conquistaDescricao">Descrição detalhada...</p>
                        
                        <div class="d-grid gap-2">
                            <button type="button" class="btn btn-warning text-dark rounded-pill py-2 fw-bold shadow-sm" data-bs-dismiss="modal">Incrível!</button>
                            <a href="/aluno/conquistas" class="btn btn-light border rounded-pill py-2 fw-semibold text-secondary">Ver Mural Completo</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

        <script>
            const NOME_ALUNO = "${aluno.nome.split(' ')[0]}";
            let listaNotificacoesGlobal = [];
            let notificacaoAtualId = null;

            // ==========================================
            // FUNÇÃO UNIVERSAL DE ANIMAÇÃO DE NÚMEROS
            // ==========================================
            function animateCounters(root = document) {
                const speed = 1500; // Tempo total da animação em milisegundos

                // Anima Números Inteiros (Ex: XP)
                const counters = root.querySelectorAll('.counter-anim:not(.animated)');
                counters.forEach(counter => {
                    counter.classList.add('animated');
                    const target = +counter.getAttribute('data-target');
                    if (isNaN(target) || target === 0) {
                        counter.innerText = target;
                        return;
                    }
                    
                    let current = 0;
                    const inc = target / (speed / 16); 
                    
                    const updateCount = () => {
                        current += inc;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCount();
                });

                // Anima Números Decimais (Ex: Nota 9.5)
                const floatCounters = root.querySelectorAll('.counter-anim-float:not(.animated)');
                floatCounters.forEach(counter => {
                    counter.classList.add('animated');
                    const target = parseFloat(counter.getAttribute('data-target'));
                    if (isNaN(target) || target === 0) {
                        counter.innerText = target.toFixed(1);
                        return;
                    }
                    let current = 0;
                    const inc = target / (speed / 16);
                    const updateCount = () => {
                        current += inc;
                        if (current < target) {
                            counter.innerText = current.toFixed(1);
                            requestAnimationFrame(updateCount);
                        } else {
                            counter.innerText = target.toFixed(1);
                        }
                    };
                    updateCount();
                });

                // Anima Barras de Progresso (Cursos)
                const progressBars = root.querySelectorAll('.progress-bar-anim:not(.animated)');
                progressBars.forEach(bar => {
                    bar.classList.add('animated');
                    const targetWidth = bar.getAttribute('data-progress');
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 150); // Um pequeno atraso garante que a transição CSS dispare
                });
            }

            document.addEventListener('DOMContentLoaded', function() {
                verificarNotificacoesPendentesModal();
                carregarListaNotificacoesSino();
                
                // Dispara as animações dos contadores na carga da página
                animateCounters();

                // Inicializa o ranking do primeiro curso selecionado
                const seletorRanking = document.getElementById('seletorRankingCurso');
                if(seletorRanking && seletorRanking.value) {
                    carregarRanking(seletorRanking.value);
                }

                // Evento para quando o aluno troca de curso no dropdown
                if(seletorRanking) {
                    seletorRanking.addEventListener('change', function() {
                        carregarRanking(this.value);
                    });
                }

                // ==========================================
                // LÓGICA DE DISPARO DA NOVA CONQUISTA
                // ==========================================
                const novaConquistaBackend = ${kpiData && kpiData.novaConquista ? JSON.stringify(kpiData.novaConquista) : 'null'};
                if (novaConquistaBackend) {
                    setTimeout(() => {
                        window.exibirModalConquista(novaConquistaBackend.icone, novaConquistaBackend.titulo, novaConquistaBackend.descricao);
                    }, 800);
                }
            });

            // ==========================================
            // FUNÇÕES DE ÁUDIO E ANIMAÇÃO DA CONQUISTA
            // ==========================================
            function tocarAudioConquista() {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if(!AudioContext) return;
                    const ctx = new AudioContext();
                    
                    function playTone(freq, type, time, duration, vol) {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = type;
                        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);
                        gain.gain.setValueAtTime(vol, ctx.currentTime + time);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + duration);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(ctx.currentTime + time);
                        osc.stop(ctx.currentTime + time + duration);
                    }
                    
                    playTone(587.33, 'triangle', 0, 0.15, 0.5); 
                    playTone(739.99, 'triangle', 0.15, 0.15, 0.5); 
                    playTone(880.00, 'triangle', 0.3, 0.15, 0.5); 
                    playTone(1174.66, 'triangle', 0.45, 0.6, 0.5);
                } catch(e) { console.log("Áudio não suportado"); }
            }

            function criarExplosaoConquista() {
                const container = document.getElementById('conquistaExplosionContainer');
                const cores = ['text-warning', 'text-primary', 'text-success', 'text-danger', 'text-info'];
                const icones = ['bi-star-fill', 'bi-circle-fill', 'bi-suit-diamond-fill'];
                
                for(let i=0; i<35; i++) {
                    const star = document.createElement('i');
                    const cor = cores[Math.floor(Math.random() * cores.length)];
                    const icone = icones[Math.floor(Math.random() * icones.length)];
                    
                    star.className = \`bi \${icone} \${cor} position-absolute\`;
                    star.style.fontSize = (Math.random() * 15 + 10) + 'px';
                    star.style.left = '50%';
                    star.style.top = '35%';
                    star.style.transition = 'all 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
                    star.style.transform = 'translate(-50%, -50%)';
                    star.style.zIndex = '1060';
                    container.appendChild(star);
                    
                    setTimeout(() => {
                        const angle = Math.random() * Math.PI * 2;
                        const distance = Math.random() * 200 + 80;
                        const tx = Math.cos(angle) * distance;
                        const ty = Math.sin(angle) * distance;
                        star.style.transform = \`translate(calc(-50% + \${tx}px), calc(-50% + \${ty}px)) rotate(\${Math.random()*360}deg)\`;
                        star.style.opacity = '0';
                    }, 50);
                    
                    setTimeout(() => star.remove(), 1250);
                }
            }

            window.exibirModalConquista = function(icone, titulo, descricao) {
                document.getElementById('conquistaIcon').innerText = icone;
                document.getElementById('conquistaTitulo').innerText = titulo;
                document.getElementById('conquistaDescricao').innerText = descricao;
                
                const modalEl = document.getElementById('modalConquistaDesbloqueada');
                const modal = new bootstrap.Modal(modalEl);
                
                modalEl.addEventListener('shown.bs.modal', function handler() {
                    tocarAudioConquista();
                    criarExplosaoConquista();
                    document.getElementById('conquistaIcon').style.transform = 'scale(1) rotate(360deg)';
                    modalEl.removeEventListener('shown.bs.modal', handler);
                });
                
                modalEl.addEventListener('hidden.bs.modal', function handler() {
                    document.getElementById('conquistaIcon').style.transform = 'scale(0)';
                    modalEl.removeEventListener('hidden.bs.modal', handler);
                });

                modal.show();
            };

            // ==========================================
            // LÓGICA DINÂMICA DO RANKING (CLIENT-SIDE)
            // ==========================================
            function carregarRanking(cursoId) {
                const container = document.getElementById('containerListaRanking');
                const loader = document.getElementById('rankingLoader');
                
                Array.from(container.children).forEach(child => { if(child.id !== 'rankingLoader') child.remove(); });
                loader.classList.remove('d-none');

                fetch('/aluno/api/ranking/' + cursoId)
                    .then(response => {
                        if(!response.ok) throw new Error('Rota falhou');
                        return response.json();
                    })
                    .then(data => {
                        renderizarHTMLRanking(container, loader, data.ranking);
                    })
                    .catch(err => {
                        loader.classList.add('d-none');
                        container.innerHTML += '<div class="text-center text-muted p-4">Não foi possível carregar o ranking.</div>';
                    });
            }

            function renderizarHTMLRanking(container, loader, rankingArray) {
                loader.classList.add('d-none');
                
                if(!rankingArray || rankingArray.length === 0) {
                    container.innerHTML += '<div class="text-center text-muted p-4">Nenhum aluno pontuou neste curso ainda.</div>';
                    return;
                }

                // Filtra para exibir apenas até a 5ª posição, e o aluno logado se estiver além dela
                let arrayExibicao = [];
                let usuarioEncontrado = false;

                for(let i = 0; i < rankingArray.length; i++) {
                    if(i < 5) {
                        arrayExibicao.push(rankingArray[i]);
                        if(rankingArray[i].isUser) usuarioEncontrado = true;
                    } else if(rankingArray[i].isUser && !usuarioEncontrado) {
                        arrayExibicao.push(rankingArray[i]);
                        usuarioEncontrado = true;
                    }
                }

                // DIMINUIÇÃO DO PADDING (py-2 px-3) PARA OS CARDS DO RANKING
                arrayExibicao.forEach(r => {
                    let medalha = r.pos;
                    if(r.pos === 1) medalha = '🥇';
                    if(r.pos === 2) medalha = '🥈';
                    if(r.pos === 3) medalha = '🥉';

                    let iconTrend = '<i class="bi bi-dash text-muted"></i>';
                    if(r.trend === 'up') iconTrend = '<i class="bi bi-caret-up-fill text-success fs-6 blink-up"></i>';
                    if(r.trend === 'down') iconTrend = '<i class="bi bi-caret-down-fill text-danger fs-6"></i>';

                    let classRank = '';
                    if(r.pos <= 3) classRank = 'rank-' + r.pos;
                    if(r.isUser) classRank += ' rank-user anim-rank-up';

                    // Se a posição for > 5 e o cara não tiver no top 5 natural, adiciona margem visual
                    let marginExtra = (r.pos > 5 && !usuarioEncontrado && r.isUser) ? 'border-top border-2 border-primary mt-2' : 'border-bottom';

                    const itemHTML = \`
                        <div class="d-flex align-items-center py-2 px-3 \${marginExtra} rank-item \${classRank}">
                            <div class="fw-bold fs-5 text-center" style="width: 40px; color: #6c757d;">\${medalha}</div>
                            <div class="ms-2 flex-grow-1">
                                <div class="text-dark mb-0 \${r.isUser ? 'fw-bolder text-primary' : 'fw-semibold'}" style="font-size: 0.85rem;">\${r.nome}</div>
                                <div class="text-muted small" style="font-size: 0.75rem;"><span class="counter-anim" data-target="\${r.xp}">0</span> XP</div>
                            </div>
                            <div class="ms-3 text-end d-flex align-items-center gap-2">
                                \${r.isUser ? '<span class="badge bg-success rounded-pill d-none d-sm-inline-block" style="font-size: 0.6rem;">Você subiu!</span>' : ''}
                                \${iconTrend}
                            </div>
                        </div>
                    \`;
                    container.insertAdjacentHTML('beforeend', itemHTML);
                });

                // Inicia a animação de contagem especificamente para os novos números do ranking que acabaram de aparecer
                animateCounters(container);
            }

            // ==========================================
            // LÓGICA DO MENU SUSPENSO DO SINO (DROPDOWN)
            // ==========================================
            function carregarListaNotificacoesSino() {
                fetch('/aluno/api/notificacoes/lista')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            listaNotificacoesGlobal = data.notificacoes;
                            const badge = document.getElementById('badgeNotificacoes');
                            const listaDropdown = document.getElementById('listaNotificacoesDropdown');
                            
                            if (data.naoLidas > 0) {
                                badge.textContent = data.naoLidas;
                                badge.classList.remove('d-none');
                            } else {
                                badge.classList.add('d-none');
                            }

                            if (data.notificacoes.length === 0) {
                                listaDropdown.innerHTML = '<li class="p-4 text-center text-muted small">Nenhuma notificação no momento.</li>';
                                return;
                            }

                            let htmlLista = \`
                                <li class="d-flex justify-content-between align-items-center p-3 border-bottom bg-light sticky-top rounded-top-4" style="z-index: 10;">
                                    <span class="fw-bold text-secondary" style="font-size: 0.85rem;"><i class="bi bi-envelope-open me-2"></i>Notificações</span>
                                    <button class="btn btn-sm btn-light border text-danger py-1 px-2 rounded-pill fw-bold" onclick="limparTodasNotificacoes()" style="font-size: 0.75rem;"><i class="bi bi-trash3 me-1"></i>Limpar Tudo</button>
                                </li>
                            \`;

                            data.notificacoes.forEach(n => {
                                const dataFormatada = new Date(n.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                                const isNaoLida = n.status === 'PENDENTE';
                                
                                const classFundo = isNaoLida ? 'bg-white fw-bold' : 'bg-light text-muted opacity-75';
                                const iconeLida = isNaoLida ? '<span class="icone-nao-lida badge bg-primary rounded-circle p-1 me-2 d-inline-block shadow-sm" style="width: 10px; height: 10px;"></span>' : '';
                                
                                const onclickAcao = n.link_url ? \`abrirLinkExterno(\${n.id}, '\${n.link_url}')\` : \`abrirModalNotificacao(\${n.id})\`;

                                htmlLista += \`
                                    <li>
                                        <a href="javascript:void(0)" onclick="\${onclickAcao}" class="dropdown-item border-bottom text-wrap p-3 notif-item \${classFundo}" style="white-space: normal;">
                                            <div class="d-flex justify-content-between align-items-start mb-1">
                                                <span class="text-dark d-flex align-items-center" style="font-size: 0.85rem;">\${iconeLida} \${n.titulo}</span>
                                                <small class="text-secondary ms-2 bg-light border px-1 rounded text-nowrap" style="font-size: 0.65rem;">\${dataFormatada}</small>
                                            </div>
                                            <div class="small \${isNaoLida ? 'text-secondary' : 'text-muted'}" style="font-size: 0.8rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                                \${n.mensagem}
                                            </div>
                                        </a>
                                    </li>
                                \`;
                            });
                            listaDropdown.innerHTML = htmlLista;
                        }
                    })
                    .catch(err => console.error('Erro ao listar notificações do sino:', err));
            }

            window.limparTodasNotificacoes = function() {
                fetch('/aluno/api/notificacoes/limpar', { method: 'POST' })
                    .then(() => { carregarListaNotificacoesSino(); })
                    .catch(console.error);
            };

            window.abrirLinkExterno = function(id, url) {
                fetch('/aluno/api/notificacoes/' + id + '/lida', { method: 'POST' }).catch(console.error);
                window.open(url, '_blank');
                setTimeout(carregarListaNotificacoesSino, 1000);
            };

            // ==========================================
            // LÓGICA DO MODAL
            // ==========================================
            function verificarNotificacoesPendentesModal() {
                fetch('/aluno/api/notificacoes/pendente')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success && data.notificacao) {
                            montarEExibirModal(data.notificacao);
                        }
                    }).catch(console.error);
            }

            window.abrirModalNotificacao = function(id) {
                const notif = listaNotificacoesGlobal.find(x => x.id === id);
                if (notif) montarEExibirModal(notif);
            };

            function montarEExibirModal(notificacao) {
                notificacaoAtualId = notificacao.id;
                
                document.getElementById('notifTitulo').textContent = notificacao.titulo;
                document.getElementById('notifMensagem').innerHTML = notificacao.mensagem.replace(/\\n/g, '<br>');

                const imgEl = document.getElementById('notifImagem');
                if (notificacao.imagem_url) {
                    imgEl.src = notificacao.imagem_url;
                    imgEl.classList.remove('d-none');
                } else {
                    imgEl.classList.add('d-none');
                }

                document.getElementById('areaPesquisaTexto').classList.add('d-none');
                document.getElementById('areaAvaliacaoEstrelas').classList.add('d-none');
                document.getElementById('alertaJaRespondido').classList.add('d-none');
                
                document.getElementById('inputPesquisaTexto').value = '';
                document.getElementById('inputAvaliacaoEstrelas').value = '0';
                resetarEstrelas(0);
                
                const btnResponder = document.getElementById('btnResponderNotificacao');

                if (notificacao.ja_respondeu > 0) {
                    document.getElementById('alertaJaRespondido').classList.remove('d-none');
                    btnResponder.textContent = 'Fechar';
                    btnResponder.onclick = function() { 
                        bootstrap.Modal.getInstance(document.getElementById('modalNotificacao')).hide(); 
                        setTimeout(carregarListaNotificacoesSino, 500);
                    };
                } else {
                    btnResponder.onclick = enviarRespostaNotificacao; 
                    
                    if (notificacao.tipo_interacao === 'PESQUISA_TEXTO') {
                        document.getElementById('areaPesquisaTexto').classList.remove('d-none');
                        btnResponder.textContent = 'Enviar Resposta';
                    } else if (notificacao.tipo_interacao === 'AVALIACAO_ESTRELAS') {
                        document.getElementById('areaAvaliacaoEstrelas').classList.remove('d-none');
                        btnResponder.textContent = 'Enviar Avaliação';
                    } else {
                        btnResponder.textContent = 'Entendido';
                    }
                }

                const modal = new bootstrap.Modal(document.getElementById('modalNotificacao'));
                modal.show();
            }

            const estrelas = document.querySelectorAll('#estrelasContainer span');
            estrelas.forEach(estrela => {
                estrela.addEventListener('click', function() {
                    const valor = this.getAttribute('data-val');
                    document.getElementById('inputAvaliacaoEstrelas').value = valor;
                    resetarEstrelas(valor);
                });
                estrela.addEventListener('mouseover', function() { resetarEstrelas(this.getAttribute('data-val'), true); });
            });
            document.getElementById('estrelasContainer').addEventListener('mouseleave', function() {
                resetarEstrelas(document.getElementById('inputAvaliacaoEstrelas').value);
            });

            function resetarEstrelas(valor) {
                estrelas.forEach(e => {
                    if (parseInt(e.getAttribute('data-val')) <= parseInt(valor)) {
                        e.classList.remove('text-secondary');
                        e.classList.add('text-warning');
                    } else {
                        e.classList.remove('text-warning');
                        e.classList.add('text-secondary');
                    }
                });
            }

            function enviarRespostaNotificacao() {
                const btn = document.getElementById('btnResponderNotificacao');
                const textoOriginal = btn.textContent;
                btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                btn.disabled = true;

                const payload = {
                    resposta_texto: document.getElementById('inputPesquisaTexto').value,
                    avaliacao_estrelas: document.getElementById('inputAvaliacaoEstrelas').value
                };

                fetch('/aluno/api/notificacoes/' + notificacaoAtualId + '/responder', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    bootstrap.Modal.getInstance(document.getElementById('modalNotificacao')).hide();
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;

                    const notifLocal = listaNotificacoesGlobal.find(x => x.id === notificacaoAtualId);
                    if (notifLocal) {
                        notifLocal.ja_respondeu = 1;
                        notifLocal.status = 'LIDA';
                    }

                    setTimeout(() => { carregarListaNotificacoesSino(); }, 500); 
                })
                .catch(err => {
                    console.error(err);
                    btn.innerHTML = textoOriginal;
                    btn.disabled = false;
                });
            }
            
            // Lógica do Loader Visual
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

module.exports = renderAlunoDashboardView;