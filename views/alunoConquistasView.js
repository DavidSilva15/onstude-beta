// views/alunoConquistasView.js

const renderAlunoMenuLateral = require('./alunoMenuLateral');

function renderAlunoConquistasView(aluno, progresso) {
    
    // Injeta o menu lateral
    const htmlSidebar = renderAlunoMenuLateral(aluno, 'conquistas');

    // Valores padrão de progresso (Agora suporta o objeto 'detalhes' para os motivos)
    const stats = progresso || {
        totalAulas: 0,
        xpTotal: 0,
        cursosDesign: 0,
        cursosTech: 0,
        cursosNegocios: 0,
        cursosEscritorio: 0,
        cursosMarketing: 0,
        cursosIdiomas: 0,
        notaMaxMentorBot: false,
        detalhes: {} // Ex: { cat_design: "Você concluiu o curso: Bootstrap 5 - Design Responsivo" }
    };

    // ==========================================
    // DEFINIÇÃO DE TODAS AS CONQUISTAS
    // ==========================================
    const listaConquistas = [
        // CATEGORIA: JORNADA DE AULAS
        { id: 'aulas_1', grupo: 'Aulas', titulo: 'Primeiros Passos', desc: 'Conclua a sua primeira aula.', icone: '🏃', meta: 1, atual: stats.totalAulas, cor: 'primary' },
        { id: 'aulas_50', grupo: 'Aulas', titulo: 'Estudante Focado', desc: 'Conclua 50 aulas.', icone: '📚', meta: 50, atual: stats.totalAulas, cor: 'primary' },
        { id: 'aulas_100', grupo: 'Aulas', titulo: 'Mestre da Maratona', desc: 'Conclua 100 aulas na plataforma.', icone: '🔥', meta: 100, atual: stats.totalAulas, cor: 'primary' },

        // CATEGORIA: XP (EXPERIÊNCIA)
        { id: 'xp_1000', grupo: 'Experiência (XP)', titulo: 'Nível Bronze', desc: 'Alcance 1.000 XP.', icone: '🥉', meta: 1000, atual: stats.xpTotal, cor: 'warning' },
        { id: 'xp_5000', grupo: 'Experiência (XP)', titulo: 'Nível Prata', desc: 'Alcance 5.000 XP.', icone: '🥈', meta: 5000, atual: stats.xpTotal, cor: 'secondary' },
        { id: 'xp_10000', grupo: 'Experiência (XP)', titulo: 'Nível Ouro', desc: 'Alcance 10.000 XP.', icone: '🥇', meta: 10000, atual: stats.xpTotal, cor: 'warning' },
        { id: 'xp_50000', grupo: 'Experiência (XP)', titulo: 'Lenda Viva', desc: 'Alcance impressionantes 50.000 XP.', icone: '👑', meta: 50000, atual: stats.xpTotal, cor: 'danger' },

        // CATEGORIA: ESPECIALISTA POR ÁREA
        { id: 'cat_design', grupo: 'Especializações', titulo: 'Artista Digital', desc: 'Conclua um curso da área de Design.', icone: '🎨', meta: 1, atual: stats.cursosDesign, cor: 'info' },
        { id: 'cat_tech', grupo: 'Especializações', titulo: 'Mago dos Códigos', desc: 'Conclua um curso da área de Tecnologia.', icone: '💻', meta: 1, atual: stats.cursosTech, cor: 'dark' },
        { id: 'cat_negocios', grupo: 'Especializações', titulo: 'Lobo de Wall Street', desc: 'Conclua um curso da área de Negócios.', icone: '📊', meta: 1, atual: stats.cursosNegocios, cor: 'success' },
        { id: 'cat_escritorio', grupo: 'Especializações', titulo: 'Produtividade Máxima', desc: 'Conclua um curso da área de Escritório.', icone: '🗂️', meta: 1, atual: stats.cursosEscritorio, cor: 'secondary' },
        { id: 'cat_marketing', grupo: 'Especializações', titulo: 'Gênio da Persuasão', desc: 'Conclua um curso da área de Marketing.', icone: '📈', meta: 1, atual: stats.cursosMarketing, cor: 'danger' },
        { id: 'cat_idiomas', grupo: 'Especializações', titulo: 'Cidadão do Mundo', desc: 'Conclua um curso da área de Idiomas.', icone: '🗣️', meta: 1, atual: stats.cursosIdiomas, cor: 'primary' },

        // CATEGORIA: DESAFIOS ESPECIAIS
        { id: 'desafio_mentor', grupo: 'Desafios Especiais', titulo: 'Sobrevivente do RH', desc: 'Gabarite o Quiz do Mentor Bot no Plano de Carreira.', icone: '🤖', meta: 1, atual: stats.notaMaxMentorBot ? 1 : 0, cor: 'success' }
    ];

    // Função utilitária para escapar strings e evitar quebrar o HTML do onclick
    const escapeHtml = (text) => (text || '').replace(/'/g, "\\'").replace(/"/g, '&quot;');

    // Contadores
    let totalDesbloqueadas = 0;

    // Agrupar as conquistas
    const grupos = {};
    listaConquistas.forEach(c => {
        if (!grupos[c.grupo]) grupos[c.grupo] = [];
        
        // Calcular progresso
        const progressoPerc = Math.min(100, (c.atual / c.meta) * 100);
        const isDesbloqueada = c.atual >= c.meta;
        if (isDesbloqueada) totalDesbloqueadas++;

        grupos[c.grupo].push({ ...c, progressoPerc, isDesbloqueada });
    });

    // Construção do HTML
    let htmlGrupos = '';
    for (const [nomeGrupo, conquistas] of Object.entries(grupos)) {
        let htmlCards = '';
        
        conquistas.forEach(c => {
            const cardClass = c.isDesbloqueada ? `border-${c.cor} shadow unlocked-card` : 'border-light locked-card bg-light';
            const iconStyle = c.isDesbloqueada ? `filter: drop-shadow(0 5px 10px rgba(0,0,0,0.15));` : 'filter: grayscale(100%) opacity(0.5);';
            const bgIcon = c.isDesbloqueada ? `bg-${c.cor} bg-opacity-10` : 'bg-secondary bg-opacity-10';
            const checkBadge = c.isDesbloqueada ? `<div class="position-absolute top-0 end-0 m-2 badge bg-success rounded-circle p-1" title="Desbloqueada!"><i class="bi bi-check fs-6"></i></div>` : '';
            
            const txtProgresso = c.isDesbloqueada ? 'Concluído' : `${c.atual} / ${c.meta}`;
            const barraCor = c.isDesbloqueada ? 'bg-success' : 'bg-primary';

            // Define o motivo exato. Se o backend mandou detalhes, usa eles. Se não, usa um fallback.
            let motivoDesbloqueio = '';
            if (c.isDesbloqueada) {
                motivoDesbloqueio = (stats.detalhes && stats.detalhes[c.id]) 
                    ? stats.detalhes[c.id] 
                    : `Parabéns! Você cumpriu os requisitos e alcançou a marca de ${c.meta} no objetivo: ${c.desc}`;
            } else {
                motivoDesbloqueio = `Esta conquista ainda está bloqueada. Continue estudando para alcançar a meta de ${c.meta} (${c.desc}).`;
            }

            htmlCards += `
                <div class="col-sm-6 col-lg-4 col-xl-3 mb-4">
                    <div class="card h-100 rounded-4 transition-all trophy-card ${cardClass} position-relative cursor-pointer" 
                         onclick="abrirModalDetalheConquista('${c.icone}', '${escapeHtml(c.titulo)}', '${escapeHtml(c.desc)}', ${c.isDesbloqueada}, '${escapeHtml(motivoDesbloqueio)}', '${c.cor}')">
                        ${checkBadge}
                        <div class="card-body text-center p-4 d-flex flex-column pointer-events-none">
                            <div class="trophy-icon-wrapper mx-auto mb-3 ${bgIcon} rounded-circle d-flex align-items-center justify-content-center" style="width: 80px; height: 80px; font-size: 3rem; ${iconStyle}">
                                ${c.icone}
                            </div>
                            <h6 class="fw-bold text-dark mb-2 ${c.isDesbloqueada ? '' : 'text-muted'}">${c.titulo}</h6>
                            <p class="small text-secondary mb-4 flex-grow-1" style="font-size: 0.8rem;">${c.desc}</p>
                            
                            <div class="mt-auto">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <small class="text-muted" style="font-size: 0.7rem; font-weight: bold;">PROGRESSO</small>
                                    <small class="${c.isDesbloqueada ? 'text-success fw-bold' : 'text-primary fw-bold'}" style="font-size: 0.75rem;">${txtProgresso}</small>
                                </div>
                                <div class="progress rounded-pill bg-secondary bg-opacity-10" style="height: 6px;">
                                    <div class="progress-bar ${barraCor} rounded-pill" role="progressbar" style="width: ${c.progressoPerc}%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        htmlGrupos += `
            <div class="mb-5">
                <h5 class="fw-bold text-dark mb-4 border-bottom pb-2"><i class="bi bi-stars text-warning me-2"></i>${nomeGrupo}</h5>
                <div class="row">
                    ${htmlCards}
                </div>
            </div>
        `;
    }

    const progressoGeralPerc = Math.round((totalDesbloqueadas / listaConquistas.length) * 100);

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mural de Conquistas - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } 
            }
            
            .cursor-pointer { cursor: pointer; }
            .pointer-events-none { pointer-events: none; }
            .transition-all { transition: all .3s ease; }
            
            .trophy-card:hover { transform: translateY(-5px); }
            
            /* Efeito para conquistas desbloqueadas */
            .unlocked-card { 
                background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
                border-width: 2px !important;
            }
            .unlocked-card:hover {
                box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
            }

            /* Efeito para conquistas bloqueadas */
            .locked-card { opacity: 0.85; border: 1px dashed #dee2e6 !important; }
            .locked-card:hover { opacity: 1; }

            .hero-conquistas {
                background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%);
                border-radius: 20px;
                color: white;
                position: relative;
                overflow: hidden;
            }
            .hero-conquistas::after {
                content: '🏆';
                position: absolute;
                font-size: 15rem;
                right: -20px;
                top: -40px;
                opacity: 0.1;
                transform: rotate(15deg);
                pointer-events: none;
            }
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

                    <div class="hero-conquistas p-4 p-md-5 mb-5 shadow-sm">
                        <div class="row align-items-center position-relative" style="z-index: 1;">
                            <div class="col-md-8 text-center text-md-start mb-4 mb-md-0">
                                <span class="badge bg-white text-primary rounded-pill px-3 py-2 mb-3 fw-bold shadow-sm"><i class="bi bi-controller me-1"></i> Gamificação</span>
                                <h1 class="fw-bold mb-2">Mural de Conquistas</h1>
                                <p class="fs-5 text-white-50 mb-0">Desbloqueie troféus e prove que é o melhor aluno da OnStude!</p>
                            </div>
                            <div class="col-md-4 text-center">
                                <div class="bg-white bg-opacity-10 rounded-4 p-4 border border-white border-opacity-25 backdrop-blur">
                                    <h6 class="text-white-50 fw-bold mb-1 text-uppercase" style="font-size: 0.8rem;">Seu Progresso Total</h6>
                                    <h2 class="fw-bold text-white mb-2">${totalDesbloqueadas} / ${listaConquistas.length}</h2>
                                    <div class="progress rounded-pill bg-dark bg-opacity-25" style="height: 10px;">
                                        <div class="progress-bar bg-warning rounded-pill progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${progressoGeralPerc}%;"></div>
                                    </div>
                                    <small class="text-white-50 fw-bold mt-2 d-block">${progressoGeralPerc}% Platinado</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${htmlGrupos}

                </div>
            </div>
        </div>

        <div class="modal fade" id="modalDetalheConquista" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
                    <div class="modal-body text-center p-5 position-relative">
                        <button type="button" class="btn-close position-absolute top-0 end-0 m-3 shadow-none" data-bs-dismiss="modal"></button>
                        
                        <div id="mdlConqIconWrapper" class="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle mx-auto shadow-sm" style="width: 110px; height: 110px; font-size: 4rem;">
                            <span id="mdlConqIcon">🏆</span>
                        </div>
                        <br>
                        <span id="mdlConqStatus" class="badge mb-3 px-3 py-2 rounded-pill text-uppercase fw-bold shadow-sm" style="letter-spacing: 0.5px;"></span>
                        
                        <h3 class="fw-bold text-dark mb-2" id="mdlConqTitulo">Título</h3>
                        <p class="text-secondary fs-6 mb-4" id="mdlConqDesc">Descrição rápida...</p>
                        
                        <div class="bg-light p-3 p-md-4 rounded-4 text-start border shadow-sm">
                            <h6 class="fw-bold mb-2 text-dark fs-6 d-flex align-items-center">
                                <i class="bi bi-info-circle-fill text-primary me-2 fs-5"></i> 
                                <span id="mdlConqMotivoTitle">Detalhes do Desbloqueio:</span>
                            </h6>
                            <p class="mb-0 text-muted" style="font-size: 0.95rem; line-height: 1.5;" id="mdlConqMotivo">Motivo</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
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

            // Lógica do Modal de Detalhes
            window.abrirModalDetalheConquista = function(icone, titulo, descricao, isDesbloqueada, motivo, corBase) {
                document.getElementById('mdlConqIcon').innerText = icone;
                document.getElementById('mdlConqTitulo').innerText = titulo;
                document.getElementById('mdlConqDesc').innerText = descricao;
                document.getElementById('mdlConqMotivo').innerText = motivo;
                
                const statusBadge = document.getElementById('mdlConqStatus');
                const iconWrapper = document.getElementById('mdlConqIconWrapper');
                const motivoTitle = document.getElementById('mdlConqMotivoTitle');
                
                // Limpa cores anteriores
                iconWrapper.className = 'mb-3 d-inline-flex align-items-center justify-content-center rounded-circle mx-auto shadow-sm';
                iconWrapper.style.width = '110px';
                iconWrapper.style.height = '110px';
                iconWrapper.style.fontSize = '4rem';

                if (isDesbloqueada) {
                    statusBadge.className = 'badge mb-3 px-3 py-2 rounded-pill text-uppercase fw-bold shadow-sm bg-success';
                    statusBadge.innerHTML = '<i class="bi bi-unlock-fill me-1"></i> Desbloqueada';
                    
                    iconWrapper.classList.add('bg-' + corBase, 'bg-opacity-10');
                    iconWrapper.style.filter = 'drop-shadow(0 8px 15px rgba(0,0,0,0.15))';
                    motivoTitle.innerText = 'Por que você ganhou:';
                } else {
                    statusBadge.className = 'badge mb-3 px-3 py-2 rounded-pill text-uppercase fw-bold shadow-sm bg-secondary';
                    statusBadge.innerHTML = '<i class="bi bi-lock-fill me-1"></i> Bloqueada';
                    
                    iconWrapper.classList.add('bg-secondary', 'bg-opacity-10');
                    iconWrapper.style.filter = 'grayscale(100%) opacity(0.6)';
                    motivoTitle.innerText = 'Como desbloquear:';
                }

                const myModal = new bootstrap.Modal(document.getElementById('modalDetalheConquista'));
                myModal.show();
            };
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAlunoConquistasView;