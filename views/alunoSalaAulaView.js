// views/alunoSalaAulaView.js

function renderAlunoSalaAulaView(aluno, curso, modulos, aulaAtual, conteudosAtual, imagensApostila, matricula, progressoPercentual, tentativasUsadas, avaliacaoData) {
    // ==========================================
    // 1. MONTAR O MENU LATERAL (AULAS E PROGRESSO)
    // ==========================================
    let htmlMenuLateral = '<div class="accordion accordion-flush" id="accordionModulos">';
    
    modulos.forEach(modulo => {
        let htmlAulas = '';
        modulo.aulas.forEach(aula => {
            const isConcluida = aula.progresso_status === 'CONCLUIDA';
            const isAtual = aulaAtual && aula.id === aulaAtual.id;
            
            const progressoAula = parseFloat(aula.progresso_percentual) || 0;
            const progressoFormatado = Math.round(progressoAula);
            const corBarra = progressoAula >= 100 ? 'bg-success' : 'bg-primary';
            
            const icone = isConcluida ? '✅' : (aula.isLiberada ? '▶️' : '🔒');
            const corFundo = isAtual ? 'bg-primary-subtle border-start border-primary border-4' : '';
            const corTexto = isAtual ? 'fw-bold text-primary' : (isConcluida ? 'text-success' : (aula.isLiberada ? 'text-dark' : 'text-muted'));
            const estiloClique = aula.isLiberada ? '' : 'pointer-events: none; opacity: 0.7;';

            // NOVIDADE: Lógica para exibir a nota no card lateral
            let badgeNota = '';
            if (isConcluida && aula.nota_avaliacao !== undefined && aula.nota_avaliacao !== null) {
                // Formata a nota para ter sempre 1 casa decimal (ex: 8.5)
                const notaFormatada = parseFloat(aula.nota_avaliacao).toFixed(1);
                badgeNota = `<span class="badge bg-success bg-opacity-25 text-success border border-success border-opacity-50 ms-2" style="font-size: 0.7rem;">Nota: ${notaFormatada}</span>`;
            }

            htmlAulas += `
                <a href="/aluno/cursos/${curso.id}/aula/${aula.id}" class="list-group-item list-group-item-action ${corFundo} d-flex flex-column py-3" style="${estiloClique}">
                    <div class="d-flex align-items-center mb-2">
                        <span class="me-2">${icone}</span>
                        <span class="small ${corTexto} flex-grow-1 text-truncate" title="${aula.titulo}">
                            Aula ${aula.ordem}: ${aula.titulo}
                        </span>
                    </div>
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <span class="small fw-bold text-muted" style="font-size: 0.75rem;">${progressoFormatado}%</span>
                        ${badgeNota}
                    </div>
                    <div class="progress" style="height: 6px; width: 100%;">
                        <div class="progress-bar ${corBarra}" role="progressbar" style="width: ${progressoAula}%;" aria-valuenow="${progressoAula}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                </a>
            `;
        });

        const isModuloAberto = aulaAtual && aulaAtual.modulo_id === modulo.id;
        const collapseClass = isModuloAberto ? 'show' : '';
        const btnCollapsed = isModuloAberto ? '' : 'collapsed';

        htmlMenuLateral += `
            <div class="accordion-item border-bottom">
                <h2 class="accordion-header" id="headingMod${modulo.id}">
                    <button class="accordion-button ${btnCollapsed} fw-bold bg-light text-secondary shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMod${modulo.id}">
                        Módulo ${modulo.ordem}: ${modulo.titulo}
                    </button>
                </h2>
                <div id="collapseMod${modulo.id}" class="accordion-collapse collapse ${collapseClass}" data-bs-parent="#accordionModulos">
                    <div class="list-group list-group-flush">
                        ${htmlAulas.length > 0 ? htmlAulas : '<div class="p-3 small text-muted">Nenhuma aula.</div>'}
                    </div>
                </div>
            </div>
        `;
    });
    htmlMenuLateral += '</div>';

    // ==========================================
    // 2. LÓGICA DAS ETAPAS DA AULA ATUAL
    // ==========================================
    let htmlConteudo = '';
    
    if (!aulaAtual) {
        htmlConteudo = `<div class="text-center py-5 mt-5"><h4 class="text-muted">Nenhuma aula disponível.</h4></div>`;
    } else {
        const percent = parseFloat(progressoPercentual) || 0;
        
        // --- ETAPA 1: VÍDEO (CUSTOM PLAYER) ---
        const temVideo = conteudosAtual && conteudosAtual.video_path;
        let htmlVideo = '';
        if (temVideo) {
            htmlVideo = `
                <div id="customVideoContainer" class="position-relative w-100 rounded shadow-sm bg-dark overflow-hidden d-flex justify-content-center align-items-center" style="height: 500px;">
                    <video id="videoPlayer" class="w-100 h-100" style="object-fit: contain;">
                        <source src="${conteudosAtual.video_path}" type="video/mp4">
                    </video>
                    
                    <div id="centerPlayBtn" class="position-absolute" style="cursor: pointer; opacity: 0.8; transition: opacity 0.2s;">
                        <svg width="80" height="80" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                            <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                        </svg>
                    </div>

                    <div id="videoControls" class="position-absolute bottom-0 w-100 p-3 d-flex align-items-center justify-content-between" style="background: linear-gradient(transparent, rgba(0,0,0,0.9)); transition: opacity 0.3s; opacity: 1;">
                        <button id="btnPlayPause" class="btn btn-link text-white text-decoration-none p-0 me-3" style="font-size: 1.5rem;">▶️</button>
                        <span id="videoCurrentTime" class="text-white small fw-bold" style="min-width: 45px; text-align: right;">0:00</span>
                        
                        <div id="progressContainer" class="progress flex-grow-1 mx-3 bg-secondary rounded-pill" style="height: 8px; cursor: not-allowed; position: relative; overflow: visible;">
                            <div id="progressBar" class="progress-bar bg-primary rounded-pill" role="progressbar" style="width: 0%; transition: width 0.1s linear;"></div>
                            <div id="progressThumb" class="bg-white rounded-circle position-absolute" style="width: 14px; height: 14px; top: -3px; left: 0%; margin-left: -7px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                        </div>

                        <span id="videoDuration" class="text-white small fw-bold me-3" style="min-width: 45px;">0:00</span>
                        <button id="btnFullscreen" class="btn btn-link text-white text-decoration-none p-0" style="font-size: 1.5rem;" title="Tela Cheia">⛶</button>
                    </div>
                </div>

                <div id="video-feedback" class="mt-3">
                    ${percent >= 33.33 ? '<div class="alert alert-success text-center">✅ Vídeo concluído. A Apostila está liberada.</div>' : ''}
                </div>
            `;
        } else {
            htmlVideo = `
                <div class="p-5 text-center bg-light border rounded text-muted mb-3">Esta aula não possui vídeo gravado.</div>
                ${percent < 33.33 ? `
                    <div id="video-feedback" class="text-center">
                        <button id="btnPularVideo" class="btn btn-primary px-4">Avançar para Apostila</button>
                    </div>` : '<div class="alert alert-success text-center">✅ Etapa concluída. A Apostila está liberada.</div>'
                }
            `;
        }

        // --- ETAPA 2: APOSTILA E MATERIAL ADICIONAL ---
        const isApostilaLiberada = percent >= 33.33;
        
        // 2.1 Lógica do Material Adicional
        let htmlMaterialAdicional = '';
        if (aulaAtual.arquivo_adicional_url) {
            htmlMaterialAdicional = `
                <div class="card bg-white border shadow-sm mb-4 rounded-3 border-start border-info border-4">
                    <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-center p-3">
                        <div class="mb-3 mb-md-0 text-center text-md-start">
                            <h6 class="fw-bold mb-1 text-dark">📦 Material Complementar</h6>
                            <p class="text-muted small mb-0">Baixe os arquivos de apoio e exercícios desta aula.</p>
                        </div>
                        <a href="${aulaAtual.arquivo_adicional_url}" target="_blank" download class="btn btn-info text-white fw-bold shadow-sm px-4">
                            📥 Baixar Arquivo
                        </a>
                    </div>
                </div>
            `;
        } else {
            htmlMaterialAdicional = `
                <div class="card bg-light border-0 shadow-sm mb-4 rounded-3 border-start border-secondary border-4">
                    <div class="card-body p-3">
                        <h6 class="fw-bold mb-1 text-secondary">📦 Material Complementar</h6>
                        <p class="text-muted small mb-0">Esta aula não necessita de materiais ou arquivos adicionais para download.</p>
                    </div>
                </div>
            `;
        }

        // 2.2 Lógica dos Slides da Apostila
        let htmlApostilaConteudo = '';
        const totalSlides = imagensApostila ? imagensApostila.length : 0;

        if (totalSlides === 0) {
            htmlApostilaConteudo = `
                <div class="p-5 text-center bg-light border rounded text-muted mb-3">Não há slides de apostila nesta aula.</div>
                <div id="apostila-feedback" class="text-center">
                    <button id="btnPularApostila" class="btn btn-primary px-4" style="${percent >= 66.66 ? 'display:none;' : ''}">Avançar para Avaliação</button>
                    ${percent >= 66.66 ? '<div class="alert alert-success text-center">✅ Etapa concluída. A Avaliação está liberada.</div>' : ''}
                </div>
            `;
        } else if (totalSlides === 1) {
            htmlApostilaConteudo = `
                <div class="position-relative bg-white p-2 border rounded shadow-sm mb-3" id="apostilaContainer">
                    <button class="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 opacity-75" onclick="toggleApostilaFullscreen()" style="z-index: 10;">
                        ⛶ Tela Cheia
                    </button>
                    <div class="text-center" id="apostilaUnica">
                        <img src="${imagensApostila[0].imagem_path}" class="img-fluid rounded" style="max-width: 100%;">
                    </div>
                </div>
                <div id="apostila-feedback" class="text-center">
                    ${percent >= 66.66 ? '<div class="alert alert-success text-center">✅ Etapa concluída. A Avaliação está liberada.</div>' : ''}
                </div>
            `;
        } else {
            let indicators = '';
            let items = '';
            imagensApostila.forEach((img, idx) => {
                const active = idx === 0 ? 'active' : '';
                indicators += `<button type="button" data-bs-target="#carouselApostila" data-bs-slide-to="${idx}" class="${active}" aria-label="Slide ${idx+1}"></button>`;
                items += `
                    <div class="carousel-item ${active}">
                        <img src="${img.imagem_path}" class="d-block w-100 rounded" alt="Página ${idx+1}">
                    </div>
                `;
            });
            htmlApostilaConteudo = `
                <div class="position-relative bg-white p-2 border rounded shadow-sm mb-3" id="apostilaContainer">
                    <button class="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 opacity-75" onclick="toggleApostilaFullscreen()" style="z-index: 10;">
                        ⛶ Tela Cheia
                    </button>
                    <div id="carouselApostila" class="carousel slide" data-bs-ride="false">
                        <div class="carousel-indicators bg-dark rounded p-1 opacity-75">${indicators}</div>
                        <div class="carousel-inner">${items}</div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselApostila" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon bg-dark rounded p-3" aria-hidden="true"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselApostila" data-bs-slide="next">
                            <span class="carousel-control-next-icon bg-dark rounded p-3" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <div id="apostila-feedback" class="text-center mt-3">
                    ${percent >= 66.66 ? '<div class="alert alert-success text-center">✅ Apostila finalizada. A Avaliação está liberada.</div>' : '<p class="text-muted small">Deslize até ao último slide para liberar a Avaliação.</p>'}
                </div>
            `;
        }

        const htmlApostila = `
            <div id="apostila-locked" style="${isApostilaLiberada ? 'display: none;' : 'display: block;'}">
                <div class="p-5 text-center bg-light border rounded text-muted shadow-sm">
                    <h5 class="text-danger">🔒 Atividade prática bloqueada</h5>
                    <p>Assista ao vídeo até ao final para liberar os <strong>arquivos de apoio</strong> e a <strong>atividade prática</strong>.</p>
                </div>
            </div>
            
            <div id="apostila-unlocked" style="${isApostilaLiberada ? 'display: block;' : 'display: none;'}">
                ${htmlMaterialAdicional} ${htmlApostilaConteudo}
            </div>
        `;

        // --- ETAPA 3: AVALIAÇÃO (QUIZ DINÂMICO) ---
        const isAvaliacaoLiberada = percent >= 66.66;
        let htmlAvaliacaoConteudo = '';
        
        if (percent >= 100) {
            htmlAvaliacaoConteudo = `<div class="p-5 text-center bg-success text-white border rounded shadow-sm"><h5>🎉 Parabéns! Você foi aprovado nesta aula.</h5><p>A próxima aula já está liberada no menu lateral.</p></div>`;
        } else if (tentativasUsadas >= 3) {
            htmlAvaliacaoConteudo = `<div class="p-5 text-center bg-danger text-white border rounded shadow-sm"><h5>❌ Limite de Tentativas Excedido</h5><p>Você utilizou as suas 3 tentativas e não atingiu a nota mínima. Entre em contato com o suporte.</p></div>`;
        } else {
            if (avaliacaoData && avaliacaoData.quiz && avaliacaoData.quiz.length > 0) {
                htmlAvaliacaoConteudo = `
                    <div class="p-4 bg-white border rounded shadow-sm">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="text-primary fw-bold mb-0">Avaliação da Aula</h5>
                            <span class="badge bg-secondary">Tentativa ${tentativasUsadas + 1} de 3</span>
                        </div>
                        
                        <div class="progress mb-4" style="height: 10px;">
                            <div id="quizProgressBar" class="progress-bar bg-info" role="progressbar" style="width: 0%; transition: width 0.3s;"></div>
                        </div>

                        <div id="quizQuestionContainer">
                            <h4 id="quizQuestionText" class="text-dark fw-bold mb-4">Carregando pergunta...</h4>
                            <div id="quizOptions" class="d-grid gap-3"></div>
                        </div>

                        <div id="quizFeedbackContainer" class="mt-4" style="display: none;">
                            <div id="quizExplanation" class="alert alert-info"></div>
                            <button id="quizNextBtn" class="btn btn-primary fw-bold px-4">Próxima Pergunta ➡️</button>
                        </div>

                        <div id="quizResultContainer" class="text-center p-4 border rounded mt-4" style="display: none;">
                            <h3 id="quizResultTitle" class="fw-bold mb-3"></h3>
                            <p class="fs-5 mb-4">Você acertou <strong id="quizResultScore"></strong> de <strong id="quizResultTotal"></strong> questões.</p>
                            
                            <form action="/aluno/aulas/${aulaAtual.id}/avaliacao" method="POST">
                                <input type="hidden" name="curso_id" value="${curso.id}">
                                <input type="hidden" id="quizFinalResultInput" name="resultado" value="">
                                <input type="hidden" id="quizScoreInput" name="score" value="0">
                                <input type="hidden" id="quizTotalInput" name="total_questions" value="0">
                                <button type="submit" id="quizSubmitBtn" class="btn btn-lg fw-bold px-5"></button>
                            </form>
                        </div>
                    </div>
                `;
            } else {
                htmlAvaliacaoConteudo = `
                    <div class="p-5 text-center bg-warning border rounded shadow-sm">
                        <h5 class="text-dark">⚠️ Avaliação Indisponível</h5>
                        <p class="text-dark">O arquivo de avaliação não foi encontrado ou está formatado incorretamente. Comunique o administrador.</p>
                        <form action="/aluno/aulas/${aulaAtual.id}/avaliacao" method="POST">
                            <input type="hidden" name="curso_id" value="${curso.id}">
                            <button type="submit" name="resultado" value="aprovado" class="btn btn-dark mt-3">Pular Avaliação (Bypass)</button>
                        </form>
                    </div>
                `;
            }
        }

        const htmlAvaliacao = `
            <div id="avaliacao-locked" style="${isAvaliacaoLiberada ? 'display: none;' : 'display: block;'}">
                <div class="p-5 text-center bg-light border rounded text-muted shadow-sm">
                    <h5 class="text-danger">🔒 Avaliação Bloqueada</h5>
                    <p>Leia todos os slides da apostila para liberar o teste de conhecimento.</p>
                </div>
            </div>
            <div id="avaliacao-unlocked" style="${isAvaliacaoLiberada ? 'display: block;' : 'display: none;'}">
                ${htmlAvaliacaoConteudo}
            </div>
        `;

        htmlConteudo = `
            <div class="mb-4">
                <h3 class="fw-bold text-dark mb-1">${aulaAtual.titulo}</h3>
                ${aulaAtual.descricao ? `<p class="text-secondary">${aulaAtual.descricao}</p>` : ''}
            </div>

            <ul class="nav nav-tabs mb-4 border-bottom-0" id="aulaTabs" role="tablist">
                <li class="nav-item">
                    <button class="nav-link active fw-semibold" id="video-tab" data-bs-toggle="tab" data-bs-target="#video-pane" type="button">🎥 Vídeo</button>
                </li>
                <li class="nav-item">
                    <button class="nav-link fw-semibold ${isApostilaLiberada ? '' : 'text-muted'}" id="apostila-tab" data-bs-toggle="tab" data-bs-target="#apostila-pane" type="button">
                        📚 Atividade prática <span id="cadeado-apostila">${isApostilaLiberada ? '' : '🔒'}</span>
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link fw-semibold ${isAvaliacaoLiberada ? '' : 'text-muted'}" id="avaliacao-tab" data-bs-toggle="tab" data-bs-target="#avaliacao-pane" type="button">
                        📝 Avaliação <span id="cadeado-avaliacao">${isAvaliacaoLiberada ? '' : '🔒'}</span>
                    </button>
                </li>
            </ul>

            <div class="tab-content mb-5" id="aulaTabsContent">
                <div class="tab-pane fade show active" id="video-pane" role="tabpanel">${htmlVideo}</div>
                <div class="tab-pane fade" id="apostila-pane" role="tabpanel">${htmlApostila}</div>
                <div class="tab-pane fade" id="avaliacao-pane" role="tabpanel">${htmlAvaliacao}</div>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const aulaId = ${aulaAtual.id};
                    const cursoId = ${curso.id};
                    let percentualAtual = ${percent};
                    const totalSlides = ${totalSlides};

                    // ==========================================
                    // ALERTAS DE FEEDBACK DA AVALIAÇÃO (RESET E ERRO)
                    // ==========================================
                    const urlParams = new URLSearchParams(window.location.search);
                    if (urlParams.has('resetado')) {
                        const alertDiv = document.createElement('div');
                        alertDiv.className = 'alert alert-danger alert-dismissible fade show shadow-sm mb-4';
                        alertDiv.innerHTML = \`
                            <h5 class="alert-heading fw-bold mb-1">🔄 Progresso Reiniciado!</h5>
                            <p class="mb-0">Você esgotou as suas 3 tentativas e não atingiu a nota mínima. Como resultado, o seu progresso nesta aula foi cancelado. Você precisará <strong>assistir ao vídeo novamente</strong> para liberar as etapas seguintes.</p>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        \`;
                        document.getElementById('aulaTabs').parentNode.insertBefore(alertDiv, document.getElementById('aulaTabs'));
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else if (urlParams.has('erro')) {
                        const alertDiv = document.createElement('div');
                        alertDiv.className = 'alert alert-warning alert-dismissible fade show shadow-sm mb-4';
                        alertDiv.innerHTML = \`
                            <h6 class="fw-bold mb-0">⚠️ Nota insuficiente. Estude a apostila e tente novamente!</h6>
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        \`;
                        document.getElementById('aulaTabs').parentNode.insertBefore(alertDiv, document.getElementById('aulaTabs'));
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }

                    // Sincronização Ajax e Reload
                    function salvarProgressoEReload(etapa) {
                        fetch('/aluno/aulas/' + aulaId + '/etapa', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ curso_id: cursoId, etapa: etapa })
                        })
                        .then(res => res.json())
                        .then(data => { if(data.success) window.location.reload(); })
                        .catch(err => console.error('Erro:', err));
                    }

                    // ==========================================
                    // LÓGICA DO CUSTOM PLAYER DE VÍDEO
                    // ==========================================
                    const video = document.getElementById('videoPlayer');
                    const container = document.getElementById('customVideoContainer');
                    
                    if (video) {
                        const btnPlayPause = document.getElementById('btnPlayPause');
                        const centerPlayBtn = document.getElementById('centerPlayBtn');
                        const progressContainer = document.getElementById('progressContainer');
                        const progressBar = document.getElementById('progressBar');
                        const progressThumb = document.getElementById('progressThumb');
                        const timeDisplay = document.getElementById('videoCurrentTime');
                        const durationDisplay = document.getElementById('videoDuration');
                        const btnFullscreen = document.getElementById('btnFullscreen');
                        const controlsOverlay = document.getElementById('videoControls');
                        
                        let isSeekingAllowed = false; // Bloqueio padrão de avanço
                        let isHovering = false;
                        let hideControlsTimeout;

                        function formatTime(seconds) {
                            if (isNaN(seconds)) return "0:00";
                            const m = Math.floor(seconds / 60);
                            const s = Math.floor(seconds % 60);
                            return m + ":" + (s < 10 ? "0" : "") + s;
                        }

                        function togglePlay() {
                            if (video.paused) {
                                video.play();
                                btnPlayPause.innerText = '⏸️';
                                centerPlayBtn.style.display = 'none';
                            } else {
                                video.pause();
                                btnPlayPause.innerText = '▶️';
                                centerPlayBtn.style.display = 'block';
                            }
                        }

                        btnPlayPause.addEventListener('click', togglePlay);
                        centerPlayBtn.addEventListener('click', togglePlay);
                        video.addEventListener('click', togglePlay);

                        video.addEventListener('loadedmetadata', () => {
                            durationDisplay.innerText = formatTime(video.duration);
                        });

                        video.addEventListener('timeupdate', () => {
                            timeDisplay.innerText = formatTime(video.currentTime);
                            const perc = (video.currentTime / video.duration) * 100;
                            progressBar.style.width = perc + '%';
                            progressThumb.style.left = perc + '%';
                        });

                        progressContainer.addEventListener('click', (e) => {
                            if (!isSeekingAllowed) {
                                progressContainer.classList.add('border', 'border-danger');
                                setTimeout(() => progressContainer.classList.remove('border', 'border-danger'), 300);
                                return;
                            }
                            const rect = progressContainer.getBoundingClientRect();
                            const pos = (e.clientX - rect.left) / rect.width;
                            video.currentTime = pos * video.duration;
                        });

                        container.addEventListener('mouseenter', () => { isHovering = true; showControls(); });
                        container.addEventListener('mouseleave', () => { isHovering = false; hideControlsDelay(); });
                        container.addEventListener('mousemove', () => { showControls(); hideControlsDelay(); });

                        function showControls() {
                            controlsOverlay.style.opacity = '1';
                            document.body.style.cursor = 'default';
                        }
                        function hideControlsDelay() {
                            clearTimeout(hideControlsTimeout);
                            if (!video.paused && !isHovering) {
                                hideControlsTimeout = setTimeout(() => {
                                    controlsOverlay.style.opacity = '0';
                                    if(container.matches(':hover')) document.body.style.cursor = 'none';
                                }, 2500);
                            }
                        }

                        btnFullscreen.addEventListener('click', () => {
                            if (!document.fullscreenElement) {
                                if (container.requestFullscreen) container.requestFullscreen();
                                else if (container.webkitRequestFullscreen) container.webkitRequestFullscreen(); 
                            } else {
                                if (document.exitFullscreen) document.exitFullscreen();
                            }
                        });

                        if (percentualAtual < 33.33) {
                            video.addEventListener('ended', function() {
                                showControls();
                                btnPlayPause.innerText = '▶️';
                                centerPlayBtn.style.display = 'block';
                                salvarProgressoEReload('VIDEO');
                            });
                        }

                        // SHORTCUT PARA LIBERAR AVANÇO (Shift + A)
                        document.addEventListener('keydown', (e) => {
                            if (e.shiftKey && e.key.toLowerCase() === 'a') {
                                isSeekingAllowed = !isSeekingAllowed;
                                if (isSeekingAllowed) {
                                    progressContainer.style.cursor = 'pointer';
                                    progressThumb.style.background = '#ffc107'; 
                                    alert('MODO ADMIN: Avanço do vídeo liberado!');
                                } else {
                                    progressContainer.style.cursor = 'not-allowed';
                                    progressThumb.style.background = '#ffffff';
                                    alert('MODO ADMIN: Avanço do vídeo bloqueado!');
                                }
                            }
                        });
                    }

                    const btnPularVideo = document.getElementById('btnPularVideo');
                    if (btnPularVideo && percentualAtual < 33.33) {
                        btnPularVideo.addEventListener('click', function() {
                            this.disabled = true; this.innerText = 'Atualizando...';
                            salvarProgressoEReload('VIDEO');
                        });
                    }

                    // ==========================================
                    // GATILHOS DA APOSTILA
                    // ==========================================
                    const carousel = document.getElementById('carouselApostila');
                    if (carousel && percentualAtual >= 33.33 && percentualAtual < 66.66) {
                        carousel.addEventListener('slid.bs.carousel', function (event) {
                            if (event.to === totalSlides - 1) salvarProgressoEReload('APOSTILA');
                        });
                    }

                    const apostilaUnica = document.getElementById('apostilaUnica');
                    if (apostilaUnica && percentualAtual >= 33.33 && percentualAtual < 66.66) {
                        document.getElementById('apostila-tab').addEventListener('shown.bs.tab', function () {
                            setTimeout(() => { salvarProgressoEReload('APOSTILA'); }, 2000);
                        });
                    }

                    const btnPularApostila = document.getElementById('btnPularApostila');
                    if (btnPularApostila && percentualAtual >= 33.33 && percentualAtual < 66.66) {
                        btnPularApostila.addEventListener('click', function() {
                            this.disabled = true; this.innerText = 'Atualizando...';
                            salvarProgressoEReload('APOSTILA');
                        });
                    }

                    // ==========================================
                    // LÓGICA DO QUIZ INTERATIVO (AVALIAÇÃO)
                    // ==========================================
                    const quizDataRaw = ${avaliacaoData ? JSON.stringify(avaliacaoData) : 'null'};
                    
                    if (quizDataRaw && quizDataRaw.quiz && quizDataRaw.quiz.length > 0 && percentualAtual >= 66.66 && percentualAtual < 100 && ${tentativasUsadas} < 3) {
                        const quiz = quizDataRaw.quiz;
                        const totalQuestions = quiz.length;
                        let currentQuestionIndex = 0;
                        let score = 0;

                        const progressBarQuiz = document.getElementById('quizProgressBar');
                        const questionText = document.getElementById('quizQuestionText');
                        const optionsContainer = document.getElementById('quizOptions');
                        const feedbackContainer = document.getElementById('quizFeedbackContainer');
                        const explanationText = document.getElementById('quizExplanation');
                        const nextBtn = document.getElementById('quizNextBtn');
                        const questionContainer = document.getElementById('quizQuestionContainer');
                        const resultContainer = document.getElementById('quizResultContainer');

                        function renderQuestion() {
                            feedbackContainer.style.display = 'none';
                            optionsContainer.innerHTML = '';
                            
                            const progresso = (currentQuestionIndex / totalQuestions) * 100;
                            progressBarQuiz.style.width = progresso + '%';

                            const q = quiz[currentQuestionIndex];
                            questionText.innerText = (currentQuestionIndex + 1) + ". " + q.pergunta;

                            q.opcoes.forEach((opcao, index) => {
                                const btn = document.createElement('button');
                                btn.className = 'btn btn-outline-secondary text-start p-3 fw-semibold';
                                btn.innerText = opcao;
                                btn.onclick = () => handleAnswer(btn, index, q.resposta_correta, q.explicacao);
                                optionsContainer.appendChild(btn);
                            });
                        }

                        function handleAnswer(selectedBtn, selectedIndex, correctIndex, explanation) {
                            const botoes = optionsContainer.querySelectorAll('button');
                            botoes.forEach(b => {
                                b.disabled = true;
                                b.classList.remove('btn-outline-secondary');
                                
                                if (b.innerText === quiz[currentQuestionIndex].opcoes[correctIndex]) {
                                    b.classList.add('btn-success', 'text-white');
                                } else {
                                    b.classList.add('btn-light', 'text-muted');
                                }
                            });

                            if (selectedIndex === correctIndex) {
                                score++;
                            } else {
                                selectedBtn.classList.remove('btn-light', 'text-muted');
                                selectedBtn.classList.add('btn-danger', 'text-white');
                            }

                            explanationText.innerHTML = "<strong>Explicação:</strong> " + explanation;
                            feedbackContainer.style.display = 'block';
                        }

                        nextBtn.onclick = () => {
                            currentQuestionIndex++;
                            if (currentQuestionIndex < totalQuestions) {
                                renderQuestion();
                            } else {
                                showResults();
                            }
                        };

                        function showResults() {
                            questionContainer.style.display = 'none';
                            feedbackContainer.style.display = 'none';
                            progressBarQuiz.style.width = '100%';
                            
                            resultContainer.style.display = 'block';
                            document.getElementById('quizResultScore').innerText = score;
                            document.getElementById('quizResultTotal').innerText = totalQuestions;

                            document.getElementById('quizScoreInput').value = score;
                            document.getElementById('quizTotalInput').value = totalQuestions;

                            const notaPercentual = (score / totalQuestions);
                            const foiAprovado = notaPercentual >= 0.7;

                            const title = document.getElementById('quizResultTitle');
                            const inputResult = document.getElementById('quizFinalResultInput');
                            const submitBtn = document.getElementById('quizSubmitBtn');

                            if (foiAprovado) {
                                title.innerText = 'Excelente!';
                                title.classList.add('text-success');
                                resultContainer.classList.add('bg-success-subtle', 'border-success');
                                inputResult.value = 'aprovado';
                                submitBtn.innerText = 'Confirmar Aprovação e Continuar';
                                submitBtn.classList.add('btn-success');
                            } else {
                                title.innerText = 'Você não atingiu a nota mínima (70%).';
                                title.classList.add('text-danger');
                                resultContainer.classList.add('bg-danger-subtle', 'border-danger');
                                inputResult.value = 'reprovado';
                                submitBtn.innerText = 'Registrar Tentativa e Voltar';
                                submitBtn.classList.add('btn-danger');
                            }
                        }

                        renderQuestion();
                    }
                });

                // Função global para ativar o modo ecrã inteiro na Apostila
                window.toggleApostilaFullscreen = function() {
                    const elem = document.getElementById('apostilaContainer');
                    if (!document.fullscreenElement) {
                        if (elem.requestFullscreen) elem.requestFullscreen();
                        else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
                        else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
                    } else {
                        if (document.exitFullscreen) document.exitFullscreen();
                        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
                        else if (document.msExitFullscreen) document.msExitFullscreen();
                    }
                };
            </script>
        `;
    }

    // ==========================================
    // 3. HTML FINAL DA PÁGINA
    // ==========================================
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>${curso.titulo} - Sala de Aula</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f8f9fa; overflow-x: hidden; }
            .sidebar { height: calc(100vh - 56px); overflow-y: auto; background-color: #fff; border-right: 1px solid #dee2e6; }
            .content-area { height: calc(100vh - 56px); overflow-y: auto; padding-bottom: 50px; }
            .sidebar::-webkit-scrollbar { width: 6px; }
            .sidebar::-webkit-scrollbar-thumb { background-color: #ccc; border-radius: 4px; }
            video::-webkit-media-controls { display: none !important; }
            
            /* Ajustes para o ecrã inteiro da apostila */
            #apostilaContainer:-webkit-full-screen { width: 100vw; height: 100vh; background: #222; display: flex; align-items: center; justify-content: center; padding: 20px;}
            #apostilaContainer:fullscreen { width: 100vw; height: 100vh; background: #222; display: flex; align-items: center; justify-content: center; padding: 20px;}
            #apostilaContainer:fullscreen img { max-height: 90vh; width: auto; margin: 0 auto; }
            #apostilaContainer:fullscreen .carousel { width: 100%; }
        </style>
    </head>
    <body>
    <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
    <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
        <span class="visually-hidden">Carregando...</span>
    </div>
    <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
</div>
        <nav class="navbar navbar-dark bg-dark shadow-sm" style="height: 56px;">
            <div class="container-fluid">
                <div class="d-flex align-items-center">
                    <a href="/aluno" class="btn btn-sm btn-outline-light me-3">⬅ Sair da Sala</a>
                    <span class="navbar-brand mb-0 h1 fs-6 d-none d-sm-block">${curso.titulo}</span>
                </div>
            </div>
        </nav>
        <div class="container-fluid p-0">
            <div class="row g-0">
                <div class="col-lg-3 col-md-4 sidebar">
                    ${htmlMenuLateral}
                </div>
                <div class="col-lg-9 col-md-8 content-area p-4 p-md-5">
                    <div class="container" style="max-width: 900px;">
                        ${htmlConteudo}
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
    // 1. Esconde o loader no carregamento normal E quando o usuário clica em "Voltar"
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

    // 2. Mostra o loader quando a página for descarregada (clique em link ou submit)
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

module.exports = renderAlunoSalaAulaView;