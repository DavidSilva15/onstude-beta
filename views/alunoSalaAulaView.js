// views/alunoSalaAulaView.js

function renderAlunoSalaAulaView(aluno, curso, modulos, aulaAtual, conteudosAtual, imagensApostila, matricula, progressoPercentual, tentativasUsadas, avaliacaoData, notasSalvas = []) {
    
    // Configuração do Aluno para o Cabeçalho Lateral
    const nomeAluno = aluno ? aluno.nome.split(' ')[0] : 'Aluno';
    const fotoAluno = aluno && aluno.foto_perfil_url 
        ? `<img src="${aluno.foto_perfil_url}" class="rounded-circle shadow-sm border border-2 border-primary" style="width: 48px; height: 48px; object-fit: cover;">` 
        : `<div class="rounded-circle shadow-sm border border-2 border-primary bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-5" style="width: 48px; height: 48px;">${nomeAluno.charAt(0).toUpperCase()}</div>`;

    // ==========================================
    // 1. MONTAR O NOVO CABEÇALHO LATERAL
    // ==========================================
    let htmlMenuLateral = `
        <div class="p-4 bg-white sticky-top border-bottom" style="z-index: 10;">
            <div class="d-none d-lg-flex justify-content-between align-items-center mb-4">
                <h3 class="fw-bold text-primary mb-0">OnStude<span class="text-dark">.</span></h3>
                <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm">Sala de Aula</span>
            </div>
            
            <div class="d-flex align-items-center mb-4 p-3 bg-light rounded-4 border border-secondary border-opacity-10">
                ${fotoAluno}
                <div class="ms-3 overflow-hidden">
                    <small class="text-muted d-block lh-1 mb-1" style="font-size: 0.7rem;">Estudando agora</small>
                    <strong class="text-dark d-block text-truncate" title="${nomeAluno}">${nomeAluno}</strong>
                </div>
            </div>

            <a href="/aluno" class="btn btn-outline-danger w-100 fw-bold rounded-pill shadow-sm d-flex align-items-center justify-content-center">
                <i class="bi bi-box-arrow-left me-2"></i> Sair da Sala
                <i class="bi bi-info-circle ms-2 text-danger opacity-50" data-bs-toggle="tooltip" data-bs-placement="top" title="Seu progresso é salvo automaticamente ao sair."></i>
            </a>
        </div>
        <div class="accordion accordion-flush p-2 pb-5" id="accordionModulos">
    `;

    // ==========================================
    // 2. MONTAR A LISTA DE MÓDULOS E AULAS
    // ==========================================
    const fallbackThumb = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%2284%22%20viewBox%3D%220%200%20150%2084%22%3E%3Crect%20fill%3D%22%23343a40%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%236c757d%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3EAula%3C%2Ftext%3E%3C%2Fsvg%3E';

    modulos.forEach(modulo => {
        let htmlAulas = '';
        modulo.aulas.forEach(aula => {
            const isConcluida = aula.progresso_status === 'CONCLUIDA';
            const isBloqueada = !aula.isLiberada;
            const isAtual = aulaAtual && aula.id === aulaAtual.id;

            const progressoAula = parseFloat(aula.progresso_percentual) || 0;
            const progressoFormatado = Math.round(progressoAula);
            const corBarra = progressoAula >= 100 ? 'bg-success' : 'bg-primary';

            const corFundo = isAtual ? 'bg-primary-subtle border-primary border-2 shadow-sm z-1' : 'bg-white border-transparent';
            const corTexto = isAtual ? 'text-primary' : (isConcluida ? 'text-dark' : (isBloqueada ? 'text-muted' : 'text-dark'));
            const estiloClique = isBloqueada ? 'pointer-events: none; opacity: 0.6;' : '';

            const duracaoTotalSegundos = aula.duracao_segundos || 0;

            const formatSegundos = (s) => {
                const min = Math.floor(s / 60);
                const sec = Math.floor(s % 60);
                return min + ':' + (sec < 10 ? '0' : '') + sec;
            };

            const tempoTotalFormatado = formatSegundos(duracaoTotalSegundos);
            const thumbUrl = aula.video_thumb_path ? aula.video_thumb_path : fallbackThumb;

            let badgeStatusAula = '';
            if (isConcluida) {
                badgeStatusAula = '<span class="badge bg-success border border-success px-2 py-1 shadow-sm" style="font-size: 0.55rem;"><i class="bi bi-check-circle-fill me-1"></i>Concluída</span>';
            } else if (isBloqueada) {
                badgeStatusAula = '<span class="badge bg-secondary border border-secondary px-2 py-1 shadow-sm" style="font-size: 0.55rem;"><i class="bi bi-lock-fill me-1"></i>Bloqueada</span>';
            } else {
                badgeStatusAula = '<span class="badge bg-warning text-dark border border-warning px-2 py-1 shadow-sm" style="font-size: 0.55rem;"><i class="bi bi-play-circle-fill me-1"></i>Em Andamento</span>';
            }

            let badgeNota = '';
            if (isConcluida && aula.nota_avaliacao !== undefined && aula.nota_avaliacao !== null) {
                const notaFormatada = parseFloat(aula.nota_avaliacao).toFixed(1);
                badgeNota = `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm" style="font-size: 0.55rem;">Nota: ${notaFormatada}</span>`;
            }

            htmlAulas += `
                <a href="/aluno/cursos/${curso.id}/aula/${aula.id}" class="list-group-item list-group-item-action ${corFundo} mb-2 rounded-4 transition-all" style="${estiloClique} border-style: solid;">
                    <div class="d-flex gap-3">
                        <div class="position-relative flex-shrink-0 rounded-3 overflow-hidden shadow-sm" style="width: 100px; height: 60px; background-color: #000;">
                            <img src="${thumbUrl}" onerror="this.onerror=null;this.src='${fallbackThumb}';" class="w-100 h-100" style="object-fit: cover; opacity: ${isBloqueada ? '0.4' : '1'};" alt="Thumb">
                            
                            <div class="position-absolute bottom-0 end-0 bg-dark text-white px-1 m-1 rounded" style="font-size: 0.55rem; opacity: 0.9;">
                                ${tempoTotalFormatado}
                            </div>
                            
                            ${isAtual ? '<div class="position-absolute top-0 start-0 w-100 h-100 bg-primary opacity-25"></div>' : ''}
                        </div>
                        
                        <div class="flex-grow-1 d-flex flex-column justify-content-center overflow-hidden">
                            <div class="mb-1">
                                <span class="d-block small ${corTexto} text-truncate fw-bold lh-sm" title="${aula.titulo}">
                                    ${aula.ordem}. ${aula.titulo}
                                </span>
                            </div>
                            
                            <div class="d-flex align-items-center gap-1 mb-2 flex-wrap">
                                ${badgeStatusAula}
                                ${badgeNota}
                            </div>
                            
                            <div class="d-flex align-items-center mt-auto">
                                <div class="progress flex-grow-1 me-2 bg-secondary bg-opacity-15 rounded-pill" style="height: 4px;">
                                    <div class="progress-bar ${corBarra} rounded-pill" role="progressbar" style="width: ${progressoAula}%;" aria-valuenow="${progressoAula}" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                                <span class="small fw-bold ${progressoAula >= 100 ? 'text-success' : 'text-muted'}" style="font-size: 0.65rem;">${progressoFormatado}%</span>
                            </div>
                        </div>
                    </div>
                </a>
            `;
        });

        const isModuloAberto = aulaAtual && aulaAtual.modulo_id === modulo.id;
        const collapseClass = isModuloAberto ? 'show' : '';
        const btnCollapsed = isModuloAberto ? '' : 'collapsed';

        htmlMenuLateral += `
            <div class="accordion-item bg-transparent border-0 mb-3">
                <h2 class="accordion-header" id="headingMod${modulo.id}">
                    <button class="accordion-button ${btnCollapsed} fw-bold bg-white text-dark shadow-sm rounded-4 border-0 mb-2" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMod${modulo.id}">
                        <i class="bi bi-folder2-open text-primary me-2 fs-5"></i>
                        <span class="text-truncate">Módulo ${modulo.ordem}: ${modulo.titulo}</span>
                    </button>
                </h2>
                <div id="collapseMod${modulo.id}" class="accordion-collapse collapse ${collapseClass}" data-bs-parent="#accordionModulos">
                    <div class="list-group list-group-flush p-0 m-0 bg-transparent ps-2">
                        ${htmlAulas.length > 0 ? htmlAulas : '<div class="p-3 small text-muted text-center bg-white rounded-4 shadow-sm">Nenhuma aula neste módulo.</div>'}
                    </div>
                </div>
            </div>
        `;
    });
    htmlMenuLateral += '</div>';

    // ==========================================
    // 3. LÓGICA DAS ETAPAS DA AULA ATUAL E NOTAS
    // ==========================================
    let htmlConteudo = '';

    if (!aulaAtual) {
        htmlConteudo = `<div class="text-center py-5 mt-5"><h4 class="text-muted">Nenhuma aula disponível.</h4></div>`;
    } else {
        const percent = parseFloat(progressoPercentual) || 0;
        const isApostilaLiberada = percent >= 33.33;
        const isAvaliacaoLiberada = percent >= 66.66;

        // --- COMPONENTE DAS NOTAS DA AULA ---
        const htmlNotasCard = `
            <div class="card shadow-sm border-0 rounded-4 bg-white h-100 d-flex flex-column">
                <div class="card-body p-4 d-flex flex-column h-100">
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                        <h6 class="fw-bold text-dark mb-0">
                            <i class="bi bi-journal-bookmark-fill text-warning me-2"></i>Minhas Notas
                            <i class="bi bi-info-circle ms-1 text-muted cursor-pointer" data-bs-toggle="tooltip" title="Clique no tempo de uma nota para pular o vídeo exatamente para aquele instante."></i>
                        </h6>
                        <span class="badge bg-light text-muted border" id="contadorNotas">0 notas</span>
                    </div>
                    
                    <div class="input-group mb-4 shadow-sm rounded-pill overflow-hidden border flex-shrink-0">
                        <span class="input-group-text bg-light text-primary fw-bold border-0 px-3" id="badgeTempoNota" style="min-width: 60px; text-align: center;">0:00</span>
                        <input type="text" id="inputNotaTexto" class="form-control border-0 bg-light shadow-none" placeholder="O que deseja lembrar?">
                        <button class="btn btn-primary fw-bold px-3 border-0" id="btnSalvarNota" type="button">Salvar</button>
                    </div>
                    
                    <div id="listaNotas" class="list-group list-group-flush flex-grow-1" style="max-height: 400px; overflow-y: auto;">
                        </div>
                </div>
            </div>
        `;

        // --- ETAPA 1: VÍDEO (COM NOVOS CONTROLES E VOLUME) ---
        const temVideo = conteudosAtual && conteudosAtual.video_path;
        let htmlVideo = '';
        if (temVideo) {
            htmlVideo = `
                <div class="row g-4">
                    <div class="col-xl-8 col-lg-12">
                        <div id="customVideoContainer" class="position-relative w-100 rounded-4 shadow-sm bg-dark overflow-hidden d-flex justify-content-center align-items-center video-container-h">
                            <video id="videoPlayer" class="w-100 h-100" style="object-fit: contain;" crossorigin="anonymous">
                                <source src="${conteudosAtual.video_path}" type="video/mp4" id="mainVideoSource">
                                
                                ${conteudosAtual.legenda_url ? `<track id="videoTrack" src="${conteudosAtual.legenda_url}" kind="subtitles" srclang="pt" label="Português" default>` : ''}
                            </video>
                            
                            <div id="centerPlayBtn" class="position-absolute" style="cursor: pointer; opacity: 0.8; transition: opacity 0.2s;">
                                <svg width="80" height="80" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z"/>
                                </svg>
                            </div>

                            <div id="videoControls" class="position-absolute bottom-0 w-100 p-3 d-flex align-items-center justify-content-between" style="background: linear-gradient(transparent, rgba(0,0,0,0.9)); transition: opacity 0.3s; opacity: 1; z-index: 10;">
                                
                                <div class="d-flex align-items-center">
                                    <button id="btnPlayPause" class="btn btn-link text-white text-decoration-none p-0 me-3" style="font-size: 1.5rem;">▶️</button>
                                    
                                    <div class="d-flex align-items-center me-3 position-relative">
                                        <button id="btnVolume" class="btn btn-link text-white text-decoration-none p-0 transition-all" style="font-size: 1.4rem;" title="Volume/Mudo">
                                            <i class="bi bi-volume-up-fill" id="iconVolume"></i>
                                        </button>
                                        <input type="range" id="volumeSlider" class="form-range ms-2 d-none d-md-block" min="0" max="1" step="0.05" value="1" style="width: 70px; height: 5px;">
                                    </div>

                                    <span id="videoCurrentTime" class="text-white small fw-bold" style="min-width: 45px; text-align: right;">0:00</span>
                                </div>
                                
                                <div id="progressContainer" class="progress flex-grow-1 mx-3 bg-secondary rounded-pill" style="height: 8px; cursor: ${percent >= 33.33 ? 'pointer' : 'not-allowed'}; position: relative; overflow: visible;">
                                    <div id="progressBar" class="progress-bar bg-primary rounded-pill" role="progressbar" style="width: 0%; transition: width 0.1s linear;"></div>
                                    <div id="progressThumb" class="bg-white rounded-circle position-absolute" style="width: 14px; height: 14px; top: -3px; left: 0%; margin-left: -7px; box-shadow: 0 0 4px rgba(0,0,0,0.5);"></div>
                                </div>

                                <span id="videoDuration" class="text-white small fw-bold me-3" style="min-width: 45px;">0:00</span>

                                <div class="d-flex align-items-center gap-3 me-3">
                                    <button id="btnSubtitles" class="btn btn-link text-white text-decoration-none p-0 transition-all" title="Legendas Automáticas (CC)">
                                        <i class="bi bi-badge-cc-fill" style="font-size: 1.4rem;"></i>
                                    </button>

                                    <div class="dropup">
                                        <button class="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center transition-all" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Velocidade">
                                            <span id="speedIndicator" class="fw-bold small" style="font-size: 0.95rem;">1x</span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg mb-2 border-0 rounded-3" style="min-width: auto; font-size: 0.9rem;">
                                            <li><a class="dropdown-item speed-btn active" href="#" data-speed="1">Normal (1x)</a></li>
                                            <li><a class="dropdown-item speed-btn" href="#" data-speed="1.25">1.25x</a></li>
                                            <li><a class="dropdown-item speed-btn" href="#" data-speed="1.5">1.5x</a></li>
                                            <li><a class="dropdown-item speed-btn" href="#" data-speed="1.7">1.7x</a></li>
                                            <li><a class="dropdown-item speed-btn" href="#" data-speed="2">2x</a></li>
                                        </ul>
                                    </div>

                                    <div class="dropup">
                                        <button class="btn btn-link text-white text-decoration-none p-0 d-flex align-items-center transition-all" type="button" data-bs-toggle="dropdown" aria-expanded="false" title="Qualidade do Vídeo">
                                            <i class="bi bi-gear-fill" style="font-size: 1.1rem;"></i>
                                        </button>
                                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow-lg mb-2 border-0 rounded-3" style="min-width: auto; font-size: 0.9rem;">
                                            <li><h6 class="dropdown-header text-center text-white-50">Qualidade</h6></li>
                                            <li><a class="dropdown-item quality-btn active" href="#" data-quality="Auto">Auto</a></li>
                                            <li><a class="dropdown-item quality-btn" href="#" data-quality="720p">720p (HD)</a></li>
                                            <li><a class="dropdown-item quality-btn" href="#" data-quality="480p">480p</a></li>
                                            <li><a class="dropdown-item quality-btn" href="#" data-quality="360p">360p</a></li>
                                        </ul>
                                    </div>
                                </div>

                                <button id="btnFullscreen" class="btn btn-link text-white text-decoration-none p-0 transition-all" style="font-size: 1.3rem;" title="Tela Cheia"><i class="bi bi-arrows-fullscreen"></i></button>
                            </div>
                        </div>

                        <div id="video-feedback" class="mt-4 text-center">
                            ${percent >= 33.33 ? `
                                <button class="btn btn-success rounded-pill px-4 py-2 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalVideoConcluido">
                                    <i class="bi bi-check-circle-fill me-1"></i> Vídeo Concluído (Ver Status)
                                </button>
                            ` : ''}
                        </div>
                    </div>

                    <div class="col-xl-4 col-lg-12">
                        ${htmlNotasCard}
                    </div>
                </div>
            `;
        } else {
            htmlVideo = `
                <div class="p-4 p-md-5 text-center bg-light border rounded-4 text-muted mb-3 shadow-sm">
                    <i class="bi bi-camera-video-off fs-1 d-block mb-3 opacity-50"></i>
                    Esta aula não possui vídeo gravado.
                </div>
                ${percent < 33.33 ? `
                    <div id="video-feedback" class="text-center">
                        <button id="btnPularVideo" class="btn btn-primary px-4 px-md-5 py-2 rounded-pill fw-bold shadow-sm">Avançar para Atividade Prática</button>
                    </div>` : `
                    <div class="text-center">
                        <button class="btn btn-success rounded-pill px-4 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalVideoConcluido">
                            <i class="bi bi-check-circle-fill me-1"></i> Etapa Concluída (Ver Status)
                        </button>
                    </div>`
                }
            `;
        }

        // --- ETAPA 2: APOSTILA E MATERIAL ADICIONAL ---
        let htmlMaterialAdicional = '';
        if (aulaAtual.arquivo_adicional_url) {
            htmlMaterialAdicional = `
                <div class="card bg-white border shadow-sm mb-4 rounded-4 border-start border-info border-4">
                    <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-center p-4">
                        <div class="mb-3 mb-md-0 text-center text-md-start">
                            <h6 class="fw-bold mb-1 text-dark">📦 Material Complementar</h6>
                            <p class="text-muted small mb-0">Baixe os arquivos de apoio e exercícios desta aula.</p>
                        </div>
                        <a href="${aulaAtual.arquivo_adicional_url}" target="_blank" download class="btn btn-info text-white fw-bold shadow-sm px-4 rounded-pill">
                            📥 Baixar Arquivo
                        </a>
                    </div>
                </div>
            `;
        } else {
            htmlMaterialAdicional = `
                <div class="card bg-light border-0 shadow-sm mb-4 rounded-4 border-start border-secondary border-4">
                    <div class="card-body p-4">
                        <h6 class="fw-bold mb-1 text-secondary">📦 Material Complementar</h6>
                        <p class="text-muted small mb-0">Esta aula não necessita de materiais ou arquivos adicionais para download.</p>
                    </div>
                </div>
            `;
        }

        let htmlApostilaConteudo = '';
        const totalSlides = imagensApostila ? imagensApostila.length : 0;

        if (totalSlides === 0) {
            htmlApostilaConteudo = `
                <div class="p-4 p-md-5 text-center bg-light border rounded-4 text-muted mb-3 shadow-sm">Não há slides de atividade prática nesta aula.</div>
                <div id="apostila-feedback" class="text-center mt-4">
                    <button id="btnPularApostila" class="btn btn-primary rounded-pill px-4 px-md-5 fw-bold shadow-sm" style="${percent >= 66.66 ? 'display:none;' : ''}">Avançar para Avaliação</button>
                    ${percent >= 66.66 ? `
                        <button class="btn btn-success rounded-pill px-4 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalApostilaConcluida">
                            <i class="bi bi-check-circle-fill me-1"></i> Atividade Prática Concluída (Ver Status)
                        </button>
                    ` : ''}
                </div>
            `;
        } else if (totalSlides === 1) {
            htmlApostilaConteudo = `
                <div class="position-relative bg-white p-2 border rounded-4 shadow-sm mb-3" id="apostilaContainer">
                    <button class="btn btn-dark btn-sm rounded-pill px-3 position-absolute top-0 end-0 m-3 shadow-sm opacity-75 hover-opacity-100" onclick="toggleApostilaFullscreen()" style="z-index: 10;">
                        <i class="bi bi-arrows-fullscreen me-1"></i> Tela Cheia
                    </button>
                    <div class="text-center p-2" id="apostilaUnica">
                        <img src="${imagensApostila[0].imagem_path}" class="img-fluid rounded-3" style="max-width: 100%;">
                    </div>
                </div>
                <div id="apostila-feedback" class="text-center mt-4">
                    ${percent >= 66.66 ? `
                        <button class="btn btn-success rounded-pill px-4 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalApostilaConcluida">
                            <i class="bi bi-check-circle-fill me-1"></i> Atividade Prática Concluída (Ver Status)
                        </button>
                    ` : ''}
                </div>
            `;
        } else {
            let indicators = '';
            let items = '';
            imagensApostila.forEach((img, idx) => {
                const active = idx === 0 ? 'active' : '';
                indicators += `<button type="button" data-bs-target="#carouselApostila" data-bs-slide-to="${idx}" class="${active}" aria-label="Slide ${idx + 1}"></button>`;
                items += `
                    <div class="carousel-item ${active} p-2">
                        <img src="${img.imagem_path}" class="d-block w-100 rounded-3 shadow-sm" alt="Página ${idx + 1}">
                    </div>
                `;
            });
            htmlApostilaConteudo = `
                <div class="position-relative bg-white p-2 border rounded-4 shadow-sm mb-3" id="apostilaContainer">
                    <button class="btn btn-dark btn-sm rounded-pill px-3 position-absolute top-0 end-0 m-3 shadow-sm opacity-75 hover-opacity-100" onclick="toggleApostilaFullscreen()" style="z-index: 10;">
                        <i class="bi bi-arrows-fullscreen me-1"></i> Tela Cheia
                    </button>
                    <div id="carouselApostila" class="carousel slide" data-bs-ride="false">
                        <div class="carousel-indicators bg-dark rounded-pill p-1 opacity-75 mb-2">${indicators}</div>
                        <div class="carousel-inner">${items}</div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselApostila" data-bs-slide="prev">
                            <span class="carousel-control-prev-icon bg-dark rounded-circle p-3 shadow" aria-hidden="true"></span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselApostila" data-bs-slide="next">
                            <span class="carousel-control-next-icon bg-dark rounded-circle p-3 shadow" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
                <div id="apostila-feedback" class="text-center mt-4">
                    ${percent >= 66.66 ? `
                        <button class="btn btn-success rounded-pill px-4 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalApostilaConcluida">
                            <i class="bi bi-check-circle-fill me-1"></i> Atividade Prática Concluída (Ver Status)
                        </button>
                    ` : '<p class="text-muted small border rounded-pill d-inline-block px-4 py-2 bg-light"><i class="bi bi-info-circle text-primary me-2"></i>Deslize até ao último slide para liberar a Avaliação.</p>'}
                </div>
            `;
        }

        const htmlApostila = `
            <div id="apostila-locked" style="${isApostilaLiberada ? 'display: none;' : 'display: block;'}">
                <div class="p-4 p-md-5 text-center bg-light border rounded-4 text-muted shadow-sm">
                    <i class="bi bi-lock-fill text-danger fs-1 d-block mb-3"></i>
                    <h5 class="text-danger fw-bold">Atividade prática bloqueada</h5>
                    <p class="mb-0">Assista ao vídeo até ao final para liberar os <strong>arquivos de apoio</strong> e a <strong>atividade prática</strong>.</p>
                </div>
            </div>
            
            <div id="apostila-unlocked" style="${isApostilaLiberada ? 'display: block;' : 'display: none;'}">
                ${htmlMaterialAdicional} ${htmlApostilaConteudo}
            </div>
        `;

        // --- ETAPA 3: AVALIAÇÃO (QUIZ DINÂMICO MODIFICADO) ---
        let htmlAvaliacaoConteudo = '';

        if (percent >= 100) {
            htmlAvaliacaoConteudo = `
                <div class="p-4 p-md-5 text-center bg-white border rounded-4 shadow-sm">
                    <i class="bi bi-trophy-fill text-warning mb-3 d-block" style="font-size: 4rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));"></i>
                    <h4 class="fw-bold text-dark mb-2">Aula Concluída com Sucesso!</h4>
                    <p class="text-muted mb-4">Você completou todas as etapas desta aula.</p>
                    <button class="btn btn-success rounded-pill px-4 shadow-sm fw-bold" data-bs-toggle="modal" data-bs-target="#modalAulaConcluida">
                        <i class="bi bi-star-fill me-1"></i> Visualizar Conquista
                    </button>
                </div>
            `;
        } else if (tentativasUsadas >= 3) {
            htmlAvaliacaoConteudo = `<div class="p-4 p-md-5 text-center bg-danger text-white border rounded-4 shadow-sm"><i class="bi bi-x-circle-fill fs-1 d-block mb-3"></i><h5 class="fw-bold">Limite de Tentativas Excedido</h5><p class="mb-0">Você utilizou as suas 3 tentativas e não atingiu a nota mínima. Entre em contato com o suporte.</p></div>`;
        } else {
            if (avaliacaoData && avaliacaoData.quiz && avaliacaoData.quiz.length > 0) {
                htmlAvaliacaoConteudo = `
                    <div class="p-4 p-md-5 bg-white border rounded-4 shadow-sm">
                        <div class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-2">
                            <h5 class="text-primary fw-bold mb-0"><i class="bi bi-ui-checks me-2"></i>Avaliação da Aula</h5>
                            <span class="badge bg-secondary rounded-pill px-3 py-2">Tentativa ${tentativasUsadas + 1} de 3</span>
                        </div>
                        
                        <div class="progress mb-4 rounded-pill" style="height: 12px;">
                            <div id="quizProgressBar" class="progress-bar bg-info" role="progressbar" style="width: 0%; transition: width 0.3s;"></div>
                        </div>

                        <div id="quizQuestionContainer">
                            <h4 id="quizQuestionText" class="text-dark fw-bold mb-4 fs-5 fs-md-4">Carregando pergunta...</h4>
                            <div id="quizOptions" class="d-grid gap-3"></div>
                        </div>

                        <div id="quizFeedbackContainer" class="mt-4" style="display: none;">
                            <div id="quizExplanation"></div>
                            <button id="quizNextBtn" class="btn btn-primary rounded-pill fw-bold px-4 px-md-5 mt-3 w-100 w-md-auto">Próxima Pergunta <i class="bi bi-arrow-right ms-2"></i></button>
                        </div>

                        <div id="quizResultContainer" class="text-center p-4 p-md-5 border rounded-4 mt-4 bg-light shadow-sm" style="display: none;">
                            <h3 id="quizResultTitle" class="fw-bold mb-3 fs-4 fs-md-3"></h3>
                            <p class="fs-6 fs-md-5 mb-4">Você acertou <strong id="quizResultScore"></strong> de <strong id="quizResultTotal"></strong> questões.</p>
                            
                            <form id="formQuizAvaliacao" action="/aluno/aulas/${aulaAtual.id}/avaliacao" method="POST">
                                <input type="hidden" name="curso_id" value="${curso.id}">
                                <input type="hidden" id="quizFinalResultInput" name="resultado" value="">
                                <input type="hidden" id="quizScoreInput" name="score" value="0">
                                <input type="hidden" id="quizTotalInput" name="total_questions" value="0">
                                <button type="submit" id="quizSubmitBtn" class="btn btn-lg rounded-pill fw-bold px-4 px-md-5 shadow-sm w-100 w-md-auto"></button>
                            </form>
                        </div>
                    </div>
                `;
            } else {
                htmlAvaliacaoConteudo = `
                    <div class="p-4 p-md-5 text-center bg-warning border rounded-4 shadow-sm">
                        <i class="bi bi-exclamation-triangle-fill text-dark fs-1 d-block mb-3 opacity-75"></i>
                        <h5 class="text-dark fw-bold">Avaliação Indisponível</h5>
                        <p class="text-dark">O arquivo de avaliação não foi encontrado ou está formatado incorretamente. Comunique o administrador.</p>
                        <form action="/aluno/aulas/${aulaAtual.id}/avaliacao" method="POST">
                            <input type="hidden" name="curso_id" value="${curso.id}">
                            <button type="submit" name="resultado" value="aprovado" class="btn btn-dark rounded-pill fw-bold px-4 mt-3 shadow-sm">Pular Avaliação (Bypass)</button>
                        </form>
                    </div>
                `;
            }
        }

        const htmlAvaliacao = `
            <div id="avaliacao-locked" style="${isAvaliacaoLiberada ? 'display: none;' : 'display: block;'}">
                <div class="p-4 p-md-5 text-center bg-light border rounded-4 text-muted shadow-sm">
                    <i class="bi bi-lock-fill text-danger fs-1 d-block mb-3"></i>
                    <h5 class="text-danger fw-bold">Avaliação Bloqueada</h5>
                    <p class="mb-0">Leia todos os slides da atividade prática para liberar o teste de conhecimento.</p>
                </div>
            </div>
            <div id="avaliacao-unlocked" style="${isAvaliacaoLiberada ? 'display: block;' : 'display: none;'}">
                ${htmlAvaliacaoConteudo}
            </div>
        `;

        htmlConteudo = `
            <div class="mb-4 bg-white p-3 p-md-4 rounded-4 border shadow-sm">
                <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-1 rounded-pill mb-2">Aula ${aulaAtual.ordem}</span>
                <h2 class="fw-bold text-dark mb-2 fs-4 fs-md-2">${aulaAtual.titulo}</h2>
                ${aulaAtual.descricao ? `<p class="text-secondary mb-0 fs-6">${aulaAtual.descricao}</p>` : ''}
            </div>

            <ul class="nav nav-tabs mb-4 border-bottom-0 gap-2" id="aulaTabs" role="tablist">
                <li class="nav-item">
                    <button class="nav-link active fw-bold rounded-pill px-3 px-md-4 shadow-sm border" id="video-tab" data-bs-toggle="tab" data-bs-target="#video-pane" type="button">
                        <i class="bi bi-play-circle-fill me-1"></i> Vídeo 
                        <i class="bi bi-info-circle text-muted ms-1 d-none d-md-inline-block" data-bs-toggle="tooltip" title="Assista o vídeo até o fim para desbloquear a próxima etapa."></i>
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link fw-bold rounded-pill px-3 px-md-4 shadow-sm border ${isApostilaLiberada ? '' : 'text-muted bg-light'}" id="apostila-tab" data-bs-toggle="tab" data-bs-target="#apostila-pane" type="button">
                        <i class="bi bi-book-fill me-1"></i> Atividade prática <span id="cadeado-apostila">${isApostilaLiberada ? '' : '<i class="bi bi-lock-fill ms-1"></i>'}</span>
                    </button>
                </li>
                <li class="nav-item">
                    <button class="nav-link fw-bold rounded-pill px-3 px-md-4 shadow-sm border ${isAvaliacaoLiberada ? '' : 'text-muted bg-light'}" id="avaliacao-tab" data-bs-toggle="tab" data-bs-target="#avaliacao-pane" type="button">
                        <i class="bi bi-ui-checks me-1"></i> Avaliação <span id="cadeado-avaliacao">${isAvaliacaoLiberada ? '' : '<i class="bi bi-lock-fill ms-1"></i>'}</span>
                    </button>
                </li>
            </ul>

            <div class="tab-content mb-5" id="aulaTabsContent">
                <div class="tab-pane fade show active" id="video-pane" role="tabpanel">${htmlVideo}</div>
                <div class="tab-pane fade" id="apostila-pane" role="tabpanel">${htmlApostila}</div>
                <div class="tab-pane fade" id="avaliacao-pane" role="tabpanel">${htmlAvaliacao}</div>
            </div>

            <div class="modal fade" id="modalVideoConcluido" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg rounded-4">
                        <div class="modal-header border-0 pb-0">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center p-4 p-md-5 pt-0">
                            <i class="bi bi-play-circle-fill text-primary mb-3 d-block" style="font-size: 4rem;"></i>
                            <h4 class="fw-bold mb-3 text-dark">Vídeo Concluído!</h4>
                            <p class="text-muted mb-4 fs-6">Você finalizou a etapa de vídeo com sucesso. A Atividade Prática já está liberada para você acessar.</p>
                            <button type="button" class="btn btn-primary rounded-pill px-4 px-md-5 py-2 fw-bold shadow-sm w-100 w-md-auto" data-bs-dismiss="modal" onclick="document.getElementById('apostila-tab').click()">Acessar Atividade Prática</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalApostilaConcluida" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg rounded-4">
                        <div class="modal-header border-0 pb-0">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center p-4 p-md-5 pt-0">
                            <i class="bi bi-file-earmark-check-fill text-info mb-3 d-block" style="font-size: 4rem;"></i>
                            <h4 class="fw-bold mb-3 text-dark">Atividade Prática Concluída!</h4>
                            <p class="text-muted mb-4 fs-6">Você revisou o material complementar com sucesso. A Avaliação desta aula já está liberada.</p>
                            <button type="button" class="btn btn-info text-white rounded-pill px-4 px-md-5 py-2 fw-bold shadow-sm w-100 w-md-auto" data-bs-dismiss="modal" onclick="document.getElementById('avaliacao-tab').click()">Ir para Avaliação</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalAulaConcluida" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg rounded-4">
                        <div class="modal-header border-0 pb-0">
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center p-4 p-md-5 pt-0">
                            <i class="bi bi-trophy-fill text-warning mb-3 d-block" style="font-size: 5rem; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));"></i>
                            <h3 class="fw-bold mb-3 text-dark">Parabéns! Aula Concluída!</h3>
                            <p class="text-muted mb-4 fs-6">Você foi aprovado nesta aula com sucesso. A próxima aula já está liberada no seu menu lateral para você continuar a sua jornada.</p>
                            <button type="button" class="btn btn-success rounded-pill px-4 px-md-5 py-2 fw-bold shadow-sm w-100 w-md-auto" data-bs-dismiss="modal">Continuar Jornada</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="modal fade" id="modalXPGanho" tabindex="-1" aria-hidden="true" data-bs-backdrop="static">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden" style="background: linear-gradient(135deg, #ffffff, #f4f6f9);">
                        <div class="modal-body text-center p-5 position-relative" id="xpExplosionContainer">
                            <div id="xpStarIcon" class="mb-3 d-inline-block" style="font-size: 6rem; filter: drop-shadow(0 10px 15px rgba(255, 193, 7, 0.4)); transform: scale(0); transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
                                ⭐
                            </div>
                            <h2 class="fw-bold text-dark mb-2">Incrível!</h2>
                            <p class="text-muted fs-5 mb-4">Você concluiu a aula e ganhou:</p>
                            <h1 class="display-3 fw-bold text-primary mb-4" id="xpCounterValue">+0 XP</h1>
                            <p class="text-secondary small mb-0">Salvando o seu progresso...</p>
                            <div class="spinner-border spinner-border-sm text-primary mt-3" role="status"></div>
                        </div>
                    </div>
                </div>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    // Inicializar Tooltips do Bootstrap
                    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
                    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

                    const aulaId = ${aulaAtual.id};
                    const cursoId = ${curso.id};
                    let percentualAtual = ${percent};
                    const totalSlides = ${totalSlides};

                    // ==========================================
                    // ALERTAS E MODAIS APÓS RELOAD
                    // ==========================================
                    const urlParams = new URLSearchParams(window.location.search);
                    const isResetado = urlParams.has('resetado');
                    const concluidoEtapa = urlParams.get('concluido');

                    // 1. Lógica para abrir modal automaticamente após o recarregamento
                    if (concluidoEtapa === 'VIDEO') {
                        setTimeout(() => {
                            const modalEl = document.getElementById('modalVideoConcluido');
                            if (modalEl) new bootstrap.Modal(modalEl).show();
                            window.history.replaceState({}, document.title, window.location.pathname);
                        }, 500);
                    } else if (concluidoEtapa === 'APOSTILA') {
                        setTimeout(() => {
                            const modalEl = document.getElementById('modalApostilaConcluida');
                            if (modalEl) new bootstrap.Modal(modalEl).show();
                            window.history.replaceState({}, document.title, window.location.pathname);
                        }, 500);
                    }

                    // 2. Lógica de Feedback da Avaliação
                    if (isResetado) {
                        const alertDiv = document.createElement('div');
                        alertDiv.className = 'alert alert-danger alert-dismissible fade show shadow-sm mb-4 rounded-4';
                        alertDiv.innerHTML = \`
                            <h5 class="alert-heading fw-bold mb-1"><i class="bi bi-arrow-counterclockwise me-2"></i>Progresso Reiniciado!</h5>
                            <p class="mb-0">Você esgotou as suas 3 tentativas e não atingiu a nota mínima. Como resultado, o seu progresso nesta aula foi cancelado. Você precisará <strong>assistir ao vídeo novamente</strong> para liberar as etapas seguintes.</p>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        \`;
                        document.getElementById('aulaTabs').parentNode.insertBefore(alertDiv, document.getElementById('aulaTabs'));
                        window.history.replaceState({}, document.title, window.location.pathname);
                    } else if (urlParams.has('erro')) {
                        const alertDiv = document.createElement('div');
                        alertDiv.className = 'alert alert-warning alert-dismissible fade show shadow-sm mb-4 rounded-4';
                        alertDiv.innerHTML = \`
                            <h6 class="fw-bold mb-0"><i class="bi bi-exclamation-circle me-2"></i>Nota insuficiente. Estude a apostila e tente novamente!</h6>
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        \`;
                        document.getElementById('aulaTabs').parentNode.insertBefore(alertDiv, document.getElementById('aulaTabs'));
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }

                    // ==========================================
                    // ABAS (TABS) DESIGN LOGIC
                    // ==========================================
                    const tabs = document.querySelectorAll('#aulaTabs .nav-link');
                    tabs.forEach(tab => {
                        tab.addEventListener('show.bs.tab', function() {
                            tabs.forEach(t => { t.classList.remove('active', 'border-primary', 'text-primary'); t.classList.add('border'); });
                            this.classList.add('active', 'border-primary', 'text-primary');
                        });
                    });
                    const activeTab = document.querySelector('#aulaTabs .nav-link.active');
                    if(activeTab) activeTab.classList.add('border-primary', 'text-primary');

                    function salvarProgressoEReload(etapa) {
                        fetch('/aluno/aulas/' + aulaId + '/etapa', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ curso_id: cursoId, etapa: etapa })
                        })
                        .then(res => res.json())
                        .then(data => { 
                            if(data.success) {
                                // Redireciona com o parâmetro na URL para ativar o Modal na volta
                                window.location.href = window.location.pathname + '?concluido=' + etapa; 
                            }
                        })
                        .catch(err => console.error('Erro:', err));
                    }

                    // ==========================================
                    // LÓGICA DO CUSTOM PLAYER E NOTAS E CONTROLES AVANÇADOS
                    // ==========================================
                    const video = document.getElementById('videoPlayer');
                    const container = document.getElementById('customVideoContainer');
                    
                    if (video) {
                        window.notasArray = ${JSON.stringify(notasSalvas)};

                        const btnPlayPause = document.getElementById('btnPlayPause');
                        const centerPlayBtn = document.getElementById('centerPlayBtn');
                        const progressContainer = document.getElementById('progressContainer');
                        const progressBar = document.getElementById('progressBar');
                        const progressThumb = document.getElementById('progressThumb');
                        const timeDisplay = document.getElementById('videoCurrentTime');
                        const durationDisplay = document.getElementById('videoDuration');
                        const btnFullscreen = document.getElementById('btnFullscreen');
                        const controlsOverlay = document.getElementById('videoControls');
                        
                        // Controles de Volume
                        const btnVolume = document.getElementById('btnVolume');
                        const volumeSlider = document.getElementById('volumeSlider');
                        const iconVolume = document.getElementById('iconVolume');

                        let isSeekingAllowed = percentualAtual >= 33.33; 
                        let isHoveringControls = false;
                        let hideControlsTimeout;

                        // Função Utilitária para exibir Toasts na tela do vídeo
                        function showVideoToast(msg) {
                            const toast = document.createElement('div');
                            toast.className = 'position-absolute top-0 start-50 translate-middle-x mt-4 badge bg-dark bg-opacity-75 p-2 px-3 text-white shadow-sm';
                            toast.style.zIndex = '1070';
                            toast.style.fontSize = '0.9rem';
                            toast.innerText = msg;
                            container.appendChild(toast);
                            setTimeout(() => {
                                toast.style.opacity = '0';
                                toast.style.transition = 'opacity 0.3s';
                                setTimeout(() => toast.remove(), 300);
                            }, 2000);
                        }

                        let tempoSalvo = ${aulaAtual.tempo_assistido || 0};
                        if (isResetado) tempoSalvo = 0; // Força recomeçar o vídeo caso tenha sido resetado

                        const iniciarTempoVideo = () => {
                            durationDisplay.innerText = formatTime(video.duration);
                            if (tempoSalvo > 0 && percentualAtual < 33.33) {
                                video.currentTime = tempoSalvo;
                            } else if (isResetado) {
                                video.currentTime = 0;
                            }
                            renderizarListaNotas();
                            renderizarMarcadoresNotas();
                            
                            // Se foi resetado e não concluiu o vídeo (segurança), já salva 0 no banco logo
                            if (isResetado && percentualAtual < 33.33) {
                                salvarTempoAtualNoBanco();
                            }
                        };

                        if (video.readyState >= 1) iniciarTempoVideo();
                        else video.addEventListener('loadedmetadata', iniciarTempoVideo);

                        function formatTime(seconds) {
                            if (isNaN(seconds)) return "0:00";
                            const m = Math.floor(seconds / 60);
                            const s = Math.floor(seconds % 60);
                            return m + ":" + (s < 10 ? "0" : "") + s;
                        }

                        function togglePlay() {
                            if (video.paused) {
                                video.play();
                                btnPlayPause.innerHTML = '<i class="bi bi-pause-fill"></i>';
                                centerPlayBtn.style.display = 'none';
                                hideControlsDelay();
                            } else {
                                video.pause();
                                btnPlayPause.innerHTML = '<i class="bi bi-play-fill"></i>';
                                centerPlayBtn.style.display = 'block';
                                showControls();
                            }
                        }

                        btnPlayPause.addEventListener('click', togglePlay);
                        centerPlayBtn.addEventListener('click', togglePlay);
                        video.addEventListener('click', togglePlay);
                        btnPlayPause.innerHTML = '<i class="bi bi-play-fill"></i>';

                        video.addEventListener('timeupdate', () => {
                            timeDisplay.innerText = formatTime(video.currentTime);
                            const perc = (video.currentTime / video.duration) * 100;
                            progressBar.style.width = perc + '%';
                            progressThumb.style.left = perc + '%';
                        });

                        function salvarTempoAtualNoBanco() {
                            if (percentualAtual < 33.33) {
                                fetch('/aluno/aulas/' + aulaId + '/tempo', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    keepalive: true, 
                                    body: JSON.stringify({ curso_id: cursoId, tempo_assistido: Math.floor(video.currentTime) })
                                }).catch(console.error);
                            }
                        }

                        setInterval(() => { if (!video.paused) salvarTempoAtualNoBanco(); }, 5000);
                        video.addEventListener('pause', salvarTempoAtualNoBanco);
                        window.addEventListener('beforeunload', salvarTempoAtualNoBanco);

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

                        // Lógica de visualização dos controles (Desktop + Mobile)
                        controlsOverlay.addEventListener('mouseenter', () => { isHoveringControls = true; });
                        controlsOverlay.addEventListener('mouseleave', () => { isHoveringControls = false; hideControlsDelay(); });
                        controlsOverlay.addEventListener('touchstart', () => { isHoveringControls = true; }, {passive: true});
                        controlsOverlay.addEventListener('touchend', () => { isHoveringControls = false; hideControlsDelay(); }, {passive: true});

                        container.addEventListener('touchstart', () => { showControls(); hideControlsDelay(); }, {passive: true});
                        container.addEventListener('mousemove', () => { showControls(); hideControlsDelay(); });
                        container.addEventListener('mouseleave', () => { hideControlsDelay(); });

                        function showControls() {
                            controlsOverlay.style.opacity = '1';
                            container.style.cursor = 'default';
                        }
                        
                        function hideControlsDelay() {
                            clearTimeout(hideControlsTimeout);
                            if (!video.paused && !isHoveringControls) {
                                hideControlsTimeout = setTimeout(() => {
                                    controlsOverlay.style.opacity = '0';
                                    container.style.cursor = 'none';
                                }, 2500);
                            }
                        }
                        
                        // Garante que os controles voltem ao pausar
                        video.addEventListener('pause', showControls);
                        video.addEventListener('play', hideControlsDelay);

                        // Lógica do Volume
                        if(btnVolume && volumeSlider) {
                            let lastVolume = 1;

                            btnVolume.addEventListener('click', (e) => {
                                e.stopPropagation();
                                if (video.volume > 0) {
                                    lastVolume = video.volume;
                                    video.volume = 0;
                                    volumeSlider.value = 0;
                                    iconVolume.className = 'bi bi-volume-mute-fill';
                                } else {
                                    video.volume = lastVolume || 1;
                                    volumeSlider.value = video.volume;
                                    iconVolume.className = video.volume > 0.5 ? 'bi bi-volume-up-fill' : 'bi bi-volume-down-fill';
                                }
                            });

                            volumeSlider.addEventListener('input', (e) => {
                                e.stopPropagation();
                                video.volume = e.target.value;
                                if (video.volume == 0) {
                                    iconVolume.className = 'bi bi-volume-mute-fill';
                                } else if (video.volume < 0.5) {
                                    iconVolume.className = 'bi bi-volume-down-fill';
                                } else {
                                    iconVolume.className = 'bi bi-volume-up-fill';
                                }
                            });
                            
                            volumeSlider.addEventListener('click', (e) => e.stopPropagation());
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
                                btnPlayPause.innerHTML = '<i class="bi bi-play-fill"></i>';
                                centerPlayBtn.style.display = 'block';
                                salvarProgressoEReload('VIDEO');
                            });
                        }

                        document.addEventListener('keydown', (e) => {
                            if (e.shiftKey && e.key.toLowerCase() === 'a') {
                                isSeekingAllowed = !isSeekingAllowed;
                                if (isSeekingAllowed) {
                                    progressContainer.style.cursor = 'pointer';
                                    progressContainer.classList.remove('not-allowed');
                                    progressThumb.style.background = '#ffc107'; 
                                    showVideoToast('MODO ADMIN: Avanço liberado!');
                                } else {
                                    progressContainer.style.cursor = 'not-allowed';
                                    progressThumb.style.background = '#ffffff';
                                    showVideoToast('MODO ADMIN: Avanço bloqueado!');
                                }
                            }
                        });

                        // ------------------------------------------
                        // NOVOS CONTROLES: LEGENDA, VELOCIDADE E QUALIDADE
                        // ------------------------------------------
                        
                        // Lógica de Velocidade (Playback Rate)
                        const speedBtns = document.querySelectorAll('.speed-btn');
                        const speedIndicator = document.getElementById('speedIndicator');
                        speedBtns.forEach(btn => {
                            btn.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                const speed = parseFloat(this.getAttribute('data-speed'));
                                video.playbackRate = speed;
                                speedIndicator.innerText = speed === 1 ? '1x' : speed + 'x';
                                
                                speedBtns.forEach(b => b.classList.remove('active'));
                                this.classList.add('active');
                                showVideoToast('Velocidade: ' + (speed === 1 ? 'Normal' : speed + 'x'));
                            });
                        });

                        // Lógica REAL de Qualidade de Vídeo (Troca de Source)
                        const qualityBtns = document.querySelectorAll('.quality-btn');

                        // Mapeamento das URLs do backend
                        const videoSources = {
                            'Auto': '${conteudosAtual.video_path}', // O vídeo padrão
                            '720p': '${conteudosAtual.video_720p_path || conteudosAtual.video_path}',
                            '480p': '${conteudosAtual.video_480p_path || conteudosAtual.video_path}',
                            '360p': '${conteudosAtual.video_360p_path || conteudosAtual.video_path}'
                        };

                        qualityBtns.forEach(btn => {
                            btn.addEventListener('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                
                                const quality = this.getAttribute('data-quality');
                                const novaUrl = videoSources[quality];

                                if (video.src.includes(novaUrl)) return;
                                
                                qualityBtns.forEach(b => b.classList.remove('active'));
                                this.classList.add('active');
                                
                                const tempoAtual = video.currentTime;
                                const estavaPausado = video.paused;
                                const currentSpeed = video.playbackRate; 
                                
                                showVideoToast('Ajustando qualidade para ' + quality + '...');

                                video.src = novaUrl;
                                video.load(); 
                                
                                video.onloadeddata = function() {
                                    video.currentTime = tempoAtual;
                                    video.playbackRate = currentSpeed;
                                    if (!estavaPausado) {
                                        video.play();
                                        document.getElementById('centerPlayBtn').style.display = 'none';
                                        document.getElementById('btnPlayPause').innerHTML = '<i class="bi bi-pause-fill"></i>';
                                    }
                                    showVideoToast('Qualidade: ' + quality);
                                    video.onloadeddata = null; 
                                };
                            });
                        });

                        // Lógica de Legendas (CC)
                        const btnSubtitles = document.getElementById('btnSubtitles');
                        let subtitlesEnabled = false;
                        btnSubtitles.addEventListener('click', function(e) {
                            e.stopPropagation();
                            subtitlesEnabled = !subtitlesEnabled;
                            if(subtitlesEnabled) {
                                this.classList.add('text-primary');
                                this.classList.remove('text-white');
                                
                                if(video.textTracks.length > 0) {
                                    video.textTracks[0].mode = 'showing';
                                    showVideoToast('Legendas ativadas');
                                } else {
                                     showVideoToast('Legendas indisponíveis neste vídeo');
                                }
                            } else {
                                this.classList.remove('text-primary');
                                this.classList.add('text-white');
                                if(video.textTracks.length > 0) {
                                    video.textTracks[0].mode = 'hidden';
                                }
                                showVideoToast('Legendas desativadas');
                            }
                        });


                        // ------------------------------------------
                        // NOTAS 
                        // ------------------------------------------
                        const inputNotaTexto = document.getElementById('inputNotaTexto');
                        const badgeTempoNota = document.getElementById('badgeTempoNota');
                        const btnSalvarNota = document.getElementById('btnSalvarNota');
                        const listaNotas = document.getElementById('listaNotas');
                        const contadorNotas = document.getElementById('contadorNotas');
                        let tempoPrestesASalvar = 0;

                        inputNotaTexto.addEventListener('focus', () => {
                            if (!video.paused) togglePlay();
                            tempoPrestesASalvar = Math.floor(video.currentTime);
                            badgeTempoNota.innerText = formatTime(tempoPrestesASalvar);
                        });

                        btnSalvarNota.addEventListener('click', () => {
                            const textoNota = inputNotaTexto.value.trim();
                            if (textoNota === '') return;
                            
                            btnSalvarNota.disabled = true;
                            btnSalvarNota.innerText = '...';

                            fetch('/aluno/aulas/' + aulaId + '/notas', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ curso_id: cursoId, tempo_segundos: tempoPrestesASalvar, texto: textoNota })
                            })
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    window.notasArray.push({ id: data.id, tempo_segundos: tempoPrestesASalvar, texto: textoNota });
                                    window.notasArray.sort((a, b) => a.tempo_segundos - b.tempo_segundos);
                                    inputNotaTexto.value = '';
                                    renderizarListaNotas();
                                    renderizarMarcadoresNotas();
                                } else {
                                    alert('Erro ao salvar nota.');
                                }
                            })
                            .catch(console.error)
                            .finally(() => {
                                btnSalvarNota.disabled = false;
                                btnSalvarNota.innerText = 'Salvar';
                            });
                        });

                        window.irParaTempo = function(segundos) {
                            const originalSeeking = isSeekingAllowed;
                            isSeekingAllowed = true;
                            video.currentTime = segundos;
                            isSeekingAllowed = originalSeeking;

                            if(video.paused) togglePlay();
                            document.getElementById('customVideoContainer').scrollIntoView({ behavior: 'smooth', block: 'center' });
                        };

                        window.excluirNota = function(event, notaId) {
                            event.stopPropagation();
                            if (!confirm('Deseja excluir esta nota?')) return;

                            fetch('/aluno/aulas/notas/' + notaId + '/excluir', { method: 'POST' })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) {
                                        window.notasArray = window.notasArray.filter(n => n.id !== notaId);
                                        renderizarListaNotas();
                                        renderizarMarcadoresNotas();
                                    } else {
                                        alert('Não autorizado ou erro ao excluir.');
                                    }
                                })
                                .catch(console.error);
                        };

                        function renderizarListaNotas() {
                            contadorNotas.innerText = window.notasArray.length + (window.notasArray.length === 1 ? ' nota' : ' notas');
                            
                            if (window.notasArray.length === 0) {
                                listaNotas.innerHTML = '<div class="text-center text-muted p-4 small">Nenhuma anotação feita. Suas notas aparecerão aqui e marcarão a barra de progresso.</div>';
                                return;
                            }
                            
                            let htmlList = '';
                            window.notasArray.forEach(nota => {
                                const textoSeguro = nota.texto.replace(/"/g, '&quot;');
                                htmlList += '<div class="list-group-item list-group-item-action d-flex align-items-center p-3 border-0 border-bottom rounded-3 mb-1">' +
                                                '<button class="btn btn-sm btn-warning text-dark me-3 rounded-pill fw-bold shadow-sm" onclick="irParaTempo(' + nota.tempo_segundos + ')">' +
                                                    formatTime(nota.tempo_segundos) +
                                                '</button>' +
                                                '<span class="text-secondary fw-semibold text-truncate flex-grow-1" onclick="irParaTempo(' + nota.tempo_segundos + ')" style="cursor:pointer;" title="' + textoSeguro + '">' +
                                                    nota.texto +
                                                '</span>' +
                                                '<button class="btn btn-sm btn-outline-danger border-0 ms-2 rounded-circle" onclick="excluirNota(event, ' + nota.id + ')" title="Excluir nota">' +
                                                    '<i class="bi bi-trash3"></i>' +
                                                '</button>' +
                                            '</div>';
                            });
                            listaNotas.innerHTML = htmlList;
                        }

                        function renderizarMarcadoresNotas() {
                            document.querySelectorAll('.video-marker').forEach(m => m.remove());
                            if (!video.duration || isNaN(video.duration)) return;

                            window.notasArray.forEach(nota => {
                                const perc = (nota.tempo_segundos / video.duration) * 100;
                                const marker = document.createElement('div');
                                marker.className = 'video-marker position-absolute rounded-circle shadow-sm d-none d-md-block';
                                marker.style.width = '14px';
                                marker.style.height = '14px';
                                marker.style.top = '-3px';
                                marker.style.left = 'calc(' + perc + '% - 7px)';
                                marker.style.backgroundColor = '#ffc107'; 
                                marker.style.border = '2px solid white';
                                marker.style.zIndex = '5';
                                marker.style.cursor = 'pointer';
                                marker.title = nota.texto + ' (' + formatTime(nota.tempo_segundos) + ')';
                                
                                marker.setAttribute('data-bs-toggle', 'tooltip');
                                marker.setAttribute('data-bs-placement', 'top');
                                if (window.innerWidth >= 768) {
                                    new bootstrap.Tooltip(marker);
                                }
                                
                                marker.onclick = (e) => {
                                    e.stopPropagation(); 
                                    irParaTempo(nota.tempo_segundos);
                                };
                                
                                progressContainer.appendChild(marker);
                            });
                        }
                    }

                    const btnPularVideo = document.getElementById('btnPularVideo');
                    if (btnPularVideo && percentualAtual < 33.33) {
                        btnPularVideo.addEventListener('click', function() {
                            this.disabled = true; this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Atualizando...';
                            salvarProgressoEReload('VIDEO');
                        });
                    }

                    // ==========================================
                    // GATILHOS DA APOSTILA E AVALIAÇÃO
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
                            this.disabled = true; this.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Atualizando...';
                            salvarProgressoEReload('APOSTILA');
                        });
                    }

                    // ==========================================
                    // FUNÇÕES PARA O EFEITO DE XP GAMIFICADO
                    // ==========================================
                    function tocarAudioLevelUp() {
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
                            
                            // Arpejo de vitória (C - E - G - C)
                            playTone(523.25, 'sine', 0, 0.1, 0.5);
                            playTone(659.25, 'sine', 0.1, 0.1, 0.5);
                            playTone(783.99, 'sine', 0.2, 0.1, 0.5);
                            playTone(1046.50, 'sine', 0.3, 0.4, 0.5);
                        } catch(e) { console.log("Áudio não suportado"); }
                    }

                    function criarExplosaoEstrelas() {
                        const container = document.getElementById('xpExplosionContainer');
                        for(let i=0; i<25; i++) {
                            const star = document.createElement('i');
                            star.className = 'bi bi-star-fill text-warning position-absolute';
                            star.style.fontSize = (Math.random() * 20 + 10) + 'px';
                            star.style.left = '50%';
                            star.style.top = '20%';
                            star.style.transition = 'all 1s cubic-bezier(0.25, 1, 0.5, 1)';
                            star.style.transform = 'translate(-50%, -50%)';
                            star.style.zIndex = '1060';
                            container.appendChild(star);
                            
                            setTimeout(() => {
                                const angle = Math.random() * Math.PI * 2;
                                const distance = Math.random() * 200 + 50;
                                const tx = Math.cos(angle) * distance;
                                const ty = Math.sin(angle) * distance;
                                star.style.transform = \`translate(calc(-50% + \${tx}px), calc(-50% + \${ty}px)) rotate(\${Math.random()*360}deg)\`;
                                star.style.opacity = '0';
                            }, 50);
                            
                            setTimeout(() => star.remove(), 1050);
                        }
                    }

                    // ==========================================
                    // QUIZ E LÓGICA DE INTERCEPTAÇÃO
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
                                btn.className = 'btn btn-outline-secondary rounded-4 text-start p-3 p-md-4 fw-semibold border-2 shadow-sm';
                                btn.innerText = opcao;
                                btn.onclick = () => handleAnswer(btn, index, q.resposta_correta, q.explicacao);
                                optionsContainer.appendChild(btn);
                            });
                        }

                        function handleAnswer(selectedBtn, selectedIndex, correctIndex, explanation) {
                            const botoes = optionsContainer.querySelectorAll('button');
                            botoes.forEach(b => {
                                b.disabled = true;
                                // Apenas remove a cor de outline, sem marcar verde ou vermelho
                                b.classList.remove('btn-outline-secondary');
                                
                                if (b === selectedBtn) {
                                    b.classList.add('btn-primary', 'text-white'); // Destaca a opção escolhida neutramente
                                } else {
                                    b.classList.add('btn-light', 'text-muted', 'opacity-50'); // Esmaece as outras
                                }
                            });

                            const acertou = selectedIndex === correctIndex;

                            if (acertou) {
                                score++;
                                explanationText.className = "alert alert-success rounded-3 shadow-sm";
                                explanationText.innerHTML = "<strong class='text-success'><i class='bi bi-check-circle-fill me-1'></i> Você acertou!</strong><br><br><strong><i class='bi bi-info-circle me-1'></i> Explicação:</strong> " + explanation;
                            } else {
                                explanationText.className = "alert alert-danger rounded-3 shadow-sm";
                                explanationText.innerHTML = "<strong class='text-danger'><i class='bi bi-x-circle-fill me-1'></i> Você errou!</strong><br><br><strong><i class='bi bi-info-circle me-1'></i> Explicação:</strong> " + explanation;
                            }

                            feedbackContainer.style.display = 'block';
                        }

                        nextBtn.onclick = () => {
                            currentQuestionIndex++;
                            if (currentQuestionIndex < totalQuestions) renderQuestion();
                            else showResults();
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
                                title.innerText = 'Excelente! Você atingiu a nota.';
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

                        // ==========================================
                        // INTERCEPTADOR DE SUBMIT (A ANIMAÇÃO)
                        // ==========================================
                        const formQuiz = document.getElementById('formQuizAvaliacao');
                        if (formQuiz) {
                            formQuiz.addEventListener('submit', function(e) {
                                const resultValue = document.getElementById('quizFinalResultInput').value;
                                
                                // Se passou no quiz, para o envio e mostra a animação
                                if (resultValue === 'aprovado') {
                                    e.preventDefault(); 
                                    
                                    const xpModalEl = document.getElementById('modalXPGanho');
                                    const xpModal = new bootstrap.Modal(xpModalEl);
                                    xpModal.show();
                                    
                                    // Calcula quanto o backend vai dar de XP
                                    const finalScore = parseInt(document.getElementById('quizScoreInput').value);
                                    const finalTotal = parseInt(document.getElementById('quizTotalInput').value);
                                    const notaPercent = finalScore / finalTotal;
                                    const totalXpGanho = 50 + Math.round(notaPercent * 10 * 5); // Exato cálculo do Node.js
                                    
                                    xpModalEl.addEventListener('shown.bs.modal', function () {
                                        tocarAudioLevelUp();
                                        criarExplosaoEstrelas();
                                        
                                        const starIcon = document.getElementById('xpStarIcon');
                                        starIcon.style.transform = 'scale(1) rotate(360deg)';
                                        
                                        // Animação de contagem de números
                                        let currentXp = 0;
                                        const xpCounter = document.getElementById('xpCounterValue');
                                        const pass = Math.ceil(totalXpGanho / 20);
                                        
                                        const interval = setInterval(() => {
                                            currentXp += pass;
                                            if (currentXp >= totalXpGanho) {
                                                currentXp = totalXpGanho;
                                                clearInterval(interval);
                                                
                                                // Envia o form de verdade 2 segundos depois da explosão
                                                setTimeout(() => { formQuiz.submit(); }, 2000);
                                            }
                                            xpCounter.innerText = '+' + currentXp + ' XP';
                                        }, 40);
                                    }, { once: true });
                                }
                                // Se for reprovado, o form segue naturalmente (sem animação de ganho)
                            });
                        }

                        renderQuestion();
                    }
                });

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
    // 4. HTML FINAL DA PÁGINA (Com Offcanvas Menu)
    // ==========================================
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${curso.titulo} - Sala de Aula</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            /* CSS Desktop Padrão */
            body { background-color: #f8f9fa; overflow: hidden; height: 100vh; }
            .sidebar { height: 100vh; overflow-y: auto; background-color: #f8f9fa; border-right: 1px solid #dee2e6; }
            .content-area { height: 100vh; overflow-y: auto; padding-bottom: 50px; background-color: #f3f4f6; }
            .video-container-h { height: 500px; }
            
            /* Custom Scrollbars */
            ::-webkit-scrollbar { width: 8px; height: 6px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background-color: #ced4da; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background-color: #adb5bd; }
            
            video::-webkit-media-controls { display: none !important; }
            
            #apostilaContainer:-webkit-full-screen { width: 100vw; height: 100vh; background: #222; display: flex; align-items: center; justify-content: center; padding: 20px;}
            #apostilaContainer:fullscreen { width: 100vw; height: 100vh; background: #222; display: flex; align-items: center; justify-content: center; padding: 20px;}
            #apostilaContainer:fullscreen img { max-height: 90vh; width: auto; margin: 0 auto; }
            #apostilaContainer:fullscreen .carousel { width: 100%; }

            .cursor-pointer { cursor: pointer; }
            .hover-opacity-100:hover { opacity: 1 !important; }
            .transition-all { transition: all 0.2s ease-in-out; }
            .transition-all:hover { transform: translateX(4px); }
            
            .nav-tabs .nav-link { background-color: #fff; color: #495057; white-space: nowrap;}
            .nav-tabs .nav-link:hover { background-color: #e9ecef; }

            /* =======================================
               CSS RESPONSIVO (MOBILE/TABLET)
               ======================================= */
            @media (max-width: 991.98px) {
                body { overflow: auto; height: auto; }
                .sidebar { height: auto; border-right: none; }
                .content-area { height: auto; overflow: visible; padding-bottom: 20px; }
                .video-container-h { height: 350px; }
            }
            
            @media (max-width: 575.98px) {
                .video-container-h { height: 230px; }
                
                /* Menu de abas deslizável (horizontal scroll) em telas muito pequenas */
                #aulaTabs { flex-wrap: nowrap; overflow-x: auto; overflow-y: hidden; padding-bottom: 5px; }
                #aulaTabs .nav-item { display: inline-block; }
            }
        </style>
    </head>
    <body>
        
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="text-center" style="width: 80%; max-width: 400px;">
                <div class="mb-4">
                    <i class="bi bi-mortarboard-fill text-primary" style="font-size: 3.5rem; filter: drop-shadow(0 4px 6px rgba(13,110,253,0.3));"></i>
                </div>
                <h4 class="fw-bold text-dark mb-4">Preparando a sala de aula...</h4>
                <div class="progress bg-secondary bg-opacity-15 rounded-pill shadow-sm" style="height: 12px; overflow: hidden;">
                    <div id="loaderProgressBar" class="progress-bar bg-primary rounded-pill progress-bar-striped progress-bar-animated" role="progressbar" style="width: 0%; transition: width 0.1s linear;"></div>
                </div>
                <div class="mt-3 fw-bold text-primary fs-5" id="loaderProgressText">0%</div>
            </div>
        </div>

        <script>
            // Lógica isolada para fazer a barra crescer fluidamente durante o carregamento inicial da página
            (function() {
                let progressoLoader = 0;
                const barraLoader = document.getElementById('loaderProgressBar');
                const textoLoader = document.getElementById('loaderProgressText');
                
                const intervaloLoader = setInterval(() => {
                    // Incrementos aleatórios para simular processamento real
                    progressoLoader += Math.random() * 15; 
                    
                    if (progressoLoader > 90) {
                        progressoLoader = 90; // Trava no 90% até que a página (vídeos/imagens) carregue completamente
                        clearInterval(intervaloLoader);
                    }
                    
                    if (barraLoader && textoLoader) {
                        barraLoader.style.width = progressoLoader + '%';
                        textoLoader.innerText = Math.floor(progressoLoader) + '%';
                    }
                }, 150);
                
                // Guarda o ID do intervalo para limpar quando o carregamento terminar
                window.loaderIntervalId = intervaloLoader;
            })();
        </script>

        <div class="d-lg-none bg-white border-bottom p-3 d-flex justify-content-between align-items-center sticky-top" style="z-index: 1040;">
            <div class="d-flex align-items-center">
                <button class="btn btn-light border shadow-sm me-3" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu">
                    <i class="bi bi-list fs-4"></i>
                </button>
                <h4 class="fw-bold text-primary mb-0">OnStude<span class="text-dark">.</span></h4>
            </div>
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1 shadow-sm">Sala de Aula</span>
        </div>

        <div class="container-fluid p-0">
            <div class="row g-0 h-100">
                
                <div class="col-xl-3 col-lg-4 offcanvas-lg offcanvas-start sidebar shadow-sm p-0" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel">
                    <div class="offcanvas-header d-lg-none border-bottom bg-light">
                        <h5 class="offcanvas-title fw-bold text-primary" id="sidebarMenuLabel">OnStude<span class="text-dark">.</span></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebarMenu" aria-label="Close"></button>
                    </div>
                    <div class="offcanvas-body p-0 d-block h-100">
                        ${htmlMenuLateral}
                    </div>
                </div>

                <div class="col-xl-9 col-lg-8 content-area p-3 p-md-4 p-lg-5">
                    <div class="container-fluid px-0" style="max-width: 1400px;">
                        ${htmlConteudo}
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            // Lógica de finalização do Loader da Sala de Aula
            window.addEventListener('pageshow', function(event) {
                const loader = document.getElementById('globalLoader');
                const barraLoader = document.getElementById('loaderProgressBar');
                const textoLoader = document.getElementById('loaderProgressText');

                if (loader) {
                    if (event.persisted) {
                        loader.style.display = 'none';
                        loader.style.opacity = '0';
                    } else {
                        // Limpa o loop inicial
                        if (window.loaderIntervalId) clearInterval(window.loaderIntervalId);
                        
                        // Força a barra para 100% como conclusão
                        if (barraLoader && textoLoader) {
                            barraLoader.style.width = '100%';
                            textoLoader.innerText = '100%';
                        }
                        
                        // Dá um pequeno atraso (0.5s) para o usuário ver o 100% e então some com o loader
                        setTimeout(() => {
                            loader.style.opacity = '0';
                            setTimeout(() => { loader.style.display = 'none'; }, 400);
                        }, 500);
                    }
                }
            });

            // Lógica para quando o usuário sai da sala de aula (clicou num link)
            window.addEventListener('beforeunload', function() {
                const loader = document.getElementById('globalLoader');
                const barraLoader = document.getElementById('loaderProgressBar');
                const textoLoader = document.getElementById('loaderProgressText');
                
                if (loader) {
                    // Reseta para 0 e exibe
                    if(barraLoader) barraLoader.style.width = '0%';
                    if(textoLoader) textoLoader.innerText = '0%';
                    
                    loader.style.display = 'flex';
                    setTimeout(() => { loader.style.opacity = '1'; }, 10); 
                    
                    // Anima rapidamente enquanto o navegador carrega a outra página
                    let progLoaderUnload = 0;
                    const unloadInterval = setInterval(() => {
                        progLoaderUnload += 20;
                        if(progLoaderUnload > 95) progLoaderUnload = 95;
                        if (barraLoader && textoLoader) {
                            barraLoader.style.width = progLoaderUnload + '%';
                            textoLoader.innerText = Math.floor(progLoaderUnload) + '%';
                        }
                    }, 50);
                }
            });
        </script>
    </body>
    </html>
    `;
}

module.exports = renderAlunoSalaAulaView;