// views/testesView.js
const renderAdminMenuLateral = require('./adminMenuLateral');

function renderTestesView(usuarioLogado, rotasEncontradas) {
    
    // 1. Motor de Agrupamento Dinâmico Inteligente
    const gruposMapeados = {};

    rotasEncontradas.forEach(r => {
        let nomeGrupo = 'Geral'; 
        
        const stringBase = (r.prefixoAuto && r.prefixoAuto !== '/') ? r.prefixoAuto : r.rota;

        if (stringBase && stringBase !== '/') {
            const partes = stringBase.split('/').filter(p => p.trim() !== '' && !p.includes(':'));
            if (partes.length > 0) {
                nomeGrupo = partes[0].charAt(0).toUpperCase() + partes[0].slice(1).toLowerCase();
            }
        }

        if (!gruposMapeados[nomeGrupo]) {
            gruposMapeados[nomeGrupo] = [];
        }

        gruposMapeados[nomeGrupo].push(r);
    });

    // 2. Função auxiliar geradora de acordeões
    const gerarHtmlListaRotas = (listaRotas, idGrupo) => {
        if (listaRotas.length === 0) return '';

        return listaRotas.map((r, index) => {
            let inputsParamsHTML = '';
            const params = r.rota.match(/:[a-zA-Z0-9_]+/g);
            if (params) {
                params.forEach(p => {
                    inputsParamsHTML += `
                        <div class="col-12 col-md-4 mb-2">
                            <label class="form-label text-muted small fw-semibold mb-1">${p} <span class="text-secondary fw-normal">(Param)</span></label>
                            <input type="text" class="form-control rounded-3 bg-white bg-opacity-75 border-light shadow-sm param-input text-dark" data-param="${p}" placeholder="Ex: 1">
                        </div>
                    `;
                });
            }

            const isAutoDetected = r.payloadDefault !== '{\n  "campo": "valor"\n}' && r.payloadDefault !== "";
            const badgeDetect = isAutoDetected ? '<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill ms-2 shadow-sm" style="font-size:0.65rem;">Auto-Detectado</span>' : '';

            const bodyHTML = ['POST', 'PUT', 'PATCH'].includes(r.metodo) ? `
                <div class="col-12 mb-3 mt-2">
                    <div class="d-flex justify-content-between align-items-center mb-1">
                        <label class="form-label text-muted small fw-semibold mb-0">Payload (JSON Body) ${badgeDetect}</label>
                        <small class="text-secondary fw-medium" style="font-size: 0.75rem;"><i class="bi bi-braces text-primary"></i> Auto-ajustável</small>
                    </div>
                    <textarea class="form-control payload-input rounded-4 p-3 font-monospace text-light shadow-inner" style="background-color: #1e2124; font-size: 0.85rem; border: 1px solid rgba(255,255,255,0.1); height: auto; resize: none;">${r.payloadDefault}</textarea>
                </div>
            ` : '';

            const prefixoInfo = r.prefixoAuto 
                ? `<span class="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 rounded-pill ms-2 shadow-sm" style="font-size:0.65rem;">Prefixo: ${r.prefixoAuto}</span>` 
                : `<span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25 rounded-pill ms-2 shadow-sm" style="font-size:0.65rem;">Raiz '/'</span>`;

            let badgeColorClass = 'bg-secondary bg-opacity-10 text-secondary border-secondary';
            if (r.metodo === 'GET') badgeColorClass = 'bg-primary bg-opacity-10 text-primary border-primary';
            if (r.metodo === 'POST') badgeColorClass = 'bg-success bg-opacity-10 text-success border-success';
            if (['PUT', 'PATCH'].includes(r.metodo)) badgeColorClass = 'bg-warning bg-opacity-10 text-warning border-warning';
            if (r.metodo === 'DELETE') badgeColorClass = 'bg-danger bg-opacity-10 text-danger border-danger';

            return `
            <div class="accordion-item mb-3 border-0 rounded-4 overflow-hidden shadow-sm glass-card transition">
                <h2 class="accordion-header" id="heading${idGrupo}${index}">
                    <button class="accordion-button collapsed py-3 px-3 bg-transparent text-dark fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${idGrupo}${index}">
                        <div class="d-flex w-100 flex-column align-items-start gap-1 pe-2 text-truncate">
                            <div class="d-flex align-items-center gap-2 text-truncate w-100">
                                <span class="badge border border-opacity-25 rounded-pill shadow-sm flex-shrink-0 ${badgeColorClass}" style="width: 65px; font-size: 0.7rem;">${r.metodo}</span>
                                <span class="fw-bold text-dark font-monospace text-truncate small" style="max-width: 85%;">${r.rota}</span>
                            </div>
                            <span class="text-muted opacity-75 d-flex align-items-center mt-1 fw-normal" style="font-size: 0.72rem;">
                                <i class="bi bi-file-earmark-code text-primary me-1"></i> ${r.arquivo}
                            </span>
                        </div>
                    </button>
                </h2>
                <div id="collapse${idGrupo}${index}" class="accordion-collapse collapse" data-bs-parent="#accordion${idGrupo}">
                    <div class="accordion-body border-top border-light border-opacity-50 p-3 bg-white bg-opacity-35">
                        <div class="row test-container" data-rota="${r.rota}" data-metodo="${r.metodo}">
                            
                            <div class="col-12 mb-3">
                                <label class="form-label text-muted small fw-semibold mb-1">Prefixo Base ${prefixoInfo}</label>
                                <input type="text" class="form-control rounded-3 bg-white bg-opacity-75 border-light shadow-sm prefix-input text-primary font-monospace small" value="${r.prefixoAuto || ''}" placeholder="Ex: /cursos">
                            </div>
                            
                            ${inputsParamsHTML}
                            ${bodyHTML}
                            
                            <div class="col-12 mt-2 d-flex flex-column gap-2">
                                <button class="btn btn-primary rounded-pill px-4 py-2 w-100 fw-bold shadow-sm hover-shadow transition d-flex align-items-center justify-content-center gap-2" onclick="executarTesteIndividual(this)">
                                    <i class="bi bi-play-fill fs-5 lh-1"></i> Executar Requisição
                                </button>
                                <span class="status-badge fw-bold small text-center d-flex align-items-center justify-content-center gap-2 mt-1"></span>
                            </div>
                            
                            <div class="col-12 mt-3 response-area" style="display: none;">
                                <label class="text-dark small fw-bold mb-2 d-block"><i class="bi bi-terminal text-primary me-2"></i>Resposta do Servidor:</label>
                                <pre class="m-0 rounded-4 p-3 shadow-inner font-monospace text-light overflow-x-auto" style="background-color: #151718; border: 1px solid rgba(255,255,255,0.1); max-height: 250px;"><code class="response-code" style="font-size: 0.8rem;"></code></pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    };

    // 3. Monta o Grid com os Cards de cada Módulo
    let blocosModulosHTML = '';
    
    const nomesDosGrupos = Object.keys(gruposMapeados).sort((a, b) => {
        if (a === 'Geral') return 1;
        if (b === 'Geral') return -1;
        return a.localeCompare(b);
    });

    nomesDosGrupos.forEach(nomeGrupo => {
        const rotasDoGrupo = gruposMapeados[nomeGrupo];
        const idLimpo = nomeGrupo.replace(/[^a-zA-Z0-9]/g, ''); 
        
        rotasDoGrupo.sort((a, b) => {
            const ordem = { 'GET': 1, 'POST': 2, 'PUT': 3, 'PATCH': 4, 'DELETE': 5 };
            return (ordem[a.metodo] || 99) - (ordem[b.metodo] || 99);
        });

        const htmlRotasAccordion = gerarHtmlListaRotas(rotasDoGrupo, idLimpo);

        blocosModulosHTML += `
        <div class="col-12 col-xl-6 mb-4 reveal-up">
            <div class="p-4 rounded-4 glass-card h-100 position-relative">
                <div class="d-flex align-items-center justify-content-between mb-4 border-bottom border-secondary border-opacity-10 pb-3">
                    <h4 class="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                        <i class="bi bi-folder2-open text-primary fs-4 lh-1"></i> Rotas <span class="text-primary">${nomeGrupo}</span>
                    </h4>
                    <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill border border-primary border-opacity-25 px-3 py-2 shadow-sm">${rotasDoGrupo.length} endpoints</span>
                </div>
                
                <div class="accordion" id="accordion${idLimpo}">
                    ${htmlRotasAccordion}
                </div>
            </div>
        </div>
        `;
    });

    // 4. Estrutura final da View
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Laboratório de Rotas | OnStude Dev</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <link rel="icon" type="image/x-icon" href="/img/favicon-onstude.ico">
        
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #212529; overflow-x: hidden; position: relative; }
            .hover-shadow:hover { transform: translateY(-4px); box-shadow: 0 1rem 2rem rgba(0,0,0,.15)!important; }
            .transition { transition: all 0.3s ease; }
            
            .mesh-bg { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; background-color: #f4f7f6; overflow: hidden; }
            .mesh-blob-1, .mesh-blob-2, .mesh-blob-3 { position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.25; animation: floatAnim 20s infinite ease-in-out alternate; }
            .mesh-blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #0d6efd; }
            .mesh-blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: #0dcaf0; animation-delay: -5s; }
            .mesh-blob-3 { top: 30%; left: 40%; width: 45vw; height: 45vw; background: #6610f2; animation-delay: -10s; }
            @keyframes floatAnim { 0% { transform: translate(0, 0) scale(1); } 33% { transform: translate(5%, 15%) scale(1.1); } 66% { transform: translate(-10%, 5%) scale(0.9); } 100% { transform: translate(0, 0) scale(1); } }

            .glass-card { background: rgba(255, 255, 255, 0.65) !important; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.8) !important; box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05); }

            .accordion-button:not(.collapsed) { background-color: rgba(13, 110, 253, 0.05); color: #0d6efd; box-shadow: none; }
            .accordion-button:focus { box-shadow: none; }
            .shadow-inner { box-shadow: inset 0 2px 4px rgba(0,0,0,0.25); }
            .reveal-up { opacity: 0; transform: translateY(30px); transition: all 0.6s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-left { opacity: 0; transform: translateX(-40px); transition: all 0.6s cubic-bezier(0.5, 0, 0, 1); }
            .reveal-visible { opacity: 1; transform: translate(0) scale(1); }

            pre::-webkit-scrollbar { height: 6px; width: 6px; }
            pre::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
            pre::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }
        </style>
    </head>
    <body>

        <div class="mesh-bg">
            <div class="mesh-blob-1"></div>
            <div class="mesh-blob-2"></div>
            <div class="mesh-blob-3"></div>
        </div>

        <div class="d-flex flex-column flex-lg-row min-vh-100">
            
            ${renderAdminMenuLateral(usuarioLogado, 'testes')}

            <div class="flex-grow-1 w-100 position-relative" style="min-width: 0;">
                <main class="container-fluid px-3 px-md-5 py-4 py-md-5">
                    
                    <div class="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-5 gap-3 reveal-left">
                        <div>
                            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 shadow-sm mb-2 px-3 py-1 rounded-pill fw-bold">⚙️ OnStude Developer</span>
                            <h1 class="fw-bold text-dark mb-1 fs-2"><i class="bi bi-diagram-3 text-primary me-2"></i> Ecossistema de Rotas</h1>
                            <p class="text-muted mb-0 small">Endpoints organizados por módulos de negócio (${rotasEncontradas.length} encontrados)</p>
                        </div>
                        
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 bg-white bg-opacity-50 p-3 rounded-4 border border-white shadow-sm glass-card">
                            
                            <div class="form-check form-switch d-flex align-items-center mb-0" style="padding-left: 0;" title="Evita que o BD seja alterado durante os testes">
                                <input class="form-check-input fs-4 m-0 shadow-sm" type="checkbox" role="switch" id="safeModeSwitch" checked style="cursor: pointer; margin-left: 0;">
                                <label class="form-check-label text-dark mb-0 d-flex flex-column align-items-start ms-3" for="safeModeSwitch" style="cursor: pointer; line-height: 1.3;">
                                    <span class="fw-bold" style="font-size: 0.95rem;">
                                        <i class="bi bi-shield-fill-check text-success me-1" id="safeModeIcon"></i> Modo Seguro Ativo
                                    </span>
                                    <span class="text-muted fw-medium" style="font-size: 0.70rem;">
                                        Requisições (POST/PUT/DEL) bloqueadas no DB.
                                    </span>
                                </label>
                            </div>

                            <button class="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2" data-bs-toggle="modal" data-bs-target="#modalTestAll">
                                <i class="bi bi-fast-forward-fill"></i> Executar testes
                            </button>
                            
                        </div>
                    </div>

                    <div class="row">
                        ${blocosModulosHTML}
                    </div>

                </main>
            </div>

        </div>

        <div class="modal fade" id="modalTestAll" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content glass-card rounded-4 border-0 shadow-lg">
                    <div class="modal-header border-bottom border-secondary border-opacity-10 p-4">
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 p-2 rounded-circle shadow-sm">
                                <i class="bi bi-card-checklist fs-5 lh-1"></i>
                            </span>
                            <h5 class="modal-title fw-bold text-dark mb-0">Execução de Testes em Lote</h5>
                        </div>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                    </div>

                    <div class="modal-body p-0 bg-white bg-opacity-40 position-relative">
                        
                        <div class="position-sticky top-0 z-3 p-4 border-bottom border-secondary border-opacity-10 shadow-sm" style="background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(10px);">
                            <div class="progress mb-3 rounded-pill p-1 bg-white shadow-sm border border-secondary border-opacity-10" style="height: 18px;">
                                <div id="testProgress" class="progress-bar rounded-pill bg-primary progress-bar-striped progress-bar-animated" style="width: 0%; transition: width 0.3s ease;"></div>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center mb-3 px-1">
                                <span id="testStatusText" class="text-muted small fw-medium">Aguardando comando de disparo...</span>
                                <span class="badge bg-dark text-white rounded-pill px-3 py-1 shadow-sm font-monospace" id="testCounterBadge" style="font-size: 0.8rem;">0 / ${rotasEncontradas.length}</span>
                            </div>

                            <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center bg-light p-2 rounded-3 border border-secondary border-opacity-10">
                                <label class="small fw-bold text-dark mb-2 mb-sm-0 ms-1 d-flex align-items-center gap-1">
                                    <i class="bi bi-funnel-fill text-primary"></i> Filtrar Resultados:
                                </label>
                                <select id="filterResultsSelect" class="form-select form-select-sm w-auto rounded-pill border-0 shadow-sm fw-medium text-dark" style="cursor: pointer; font-size: 0.85rem;" onchange="aplicarFiltroResultados()">
                                    <option value="all" selected>Mostrar Todos</option>
                                    <option value="success">✅ Apenas Sucessos (2xx)</option>
                                    <option value="error">❌ Apenas Erros / Crashes</option>
                                </select>
                            </div>
                        </div>

                        <div id="testResultsList" class="d-flex flex-column gap-2 p-4" style="font-size: 0.85rem;">
                            <div id="placeholderLoteMsg" class="text-center py-5 text-muted small border border-secondary border-opacity-25 border-dashed rounded-4 bg-white bg-opacity-60">
                                <i class="bi bi-hdd-network text-secondary opacity-50 d-block mb-2 fs-2"></i>
                                Clique no botão de iniciar para testar o tempo de resposta e os códigos de erro de todas as ${rotasEncontradas.length} rotas.
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer border-top border-secondary border-opacity-10 p-3 bg-light bg-opacity-50 d-flex justify-content-between gap-2 flex-wrap">
                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-outline-secondary rounded-pill px-4 fw-medium" data-bs-dismiss="modal">Fechar</button>
                            <button type="button" class="btn btn-outline-danger rounded-pill px-3 fw-bold d-flex align-items-center gap-1 shadow-sm" onclick="limparResultadosLote()">
                                <i class="bi bi-trash3"></i> Limpar Resultados
                            </button>
                        </div>
                        <button type="button" id="btnStartBatch" class="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm d-flex align-items-center gap-2 transition" onclick="iniciarTestesEmLote()">
                            <i class="bi bi-play-fill fs-5 lh-1"></i> Iniciar teste
                        </button>
                    </div>
                </div>
            </div>
        </div>

        ${require('./toastProcessamento')()}

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="/js/toast.js"></script>
        
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                const revealElements = document.querySelectorAll('.reveal-up, .reveal-left');
                const revealObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
                    });
                }, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });

                revealElements.forEach(el => revealObserver.observe(el));

                document.querySelectorAll('.payload-input').forEach(textarea => {
                    textarea.addEventListener('input', function() { ajustarAlturaTextarea(this); });
                });

                const acordeoes = document.querySelectorAll('.accordion-collapse');
                acordeoes.forEach(collapseEl => {
                    collapseEl.addEventListener('shown.bs.collapse', function () {
                        const textareasInternos = this.querySelectorAll('.payload-input');
                        textareasInternos.forEach(textarea => {
                            ajustarAlturaTextarea(textarea);
                        });
                    });
                });

                // Lógica de alteração visual do Toggle de Segurança
                const safeSwitch = document.getElementById('safeModeSwitch');
                const safeIcon = document.getElementById('safeModeIcon');
                
                safeSwitch.addEventListener('change', function() {
                    if(this.checked) {
                        safeIcon.className = 'bi bi-shield-fill-check text-success me-1';
                        if (typeof Toast !== 'undefined') Toast.success('Modo Seguro Ativado! O DB não será alterado.');
                    } else {
                        safeIcon.className = 'bi bi-shield-fill-exclamation text-danger me-1';
                        if (typeof Toast !== 'undefined') Toast.warning('Modo Seguro Desativado! Cuidado, exclusões e edições serão reais!');
                    }
                });
            });

            function ajustarAlturaTextarea(textarea) {
                textarea.style.height = 'auto'; 
                textarea.style.height = (textarea.scrollHeight + 4) + 'px'; 
            }

            // FUNÇÃO RESPONSÁVEL POR FILTRAR OS CARDS EXISTENTES
            function aplicarFiltroResultados() {
                const filtroSelecionado = document.getElementById('filterResultsSelect').value;
                const todosOsCards = document.querySelectorAll('.result-card-item');

                todosOsCards.forEach(card => {
                    const statusDoCard = card.getAttribute('data-status'); // 'success' ou 'error'
                    
                    if (filtroSelecionado === 'all' || filtroSelecionado === statusDoCard) {
                        card.classList.remove('d-none');
                        card.classList.add('d-flex');
                    } else {
                        card.classList.remove('d-flex');
                        card.classList.add('d-none');
                    }
                });
            }

            function limparResultadosLote() {
                const progress = document.getElementById('testProgress');
                const statusText = document.getElementById('testStatusText');
                const counterBadge = document.getElementById('testCounterBadge');
                const resultsList = document.getElementById('testResultsList');
                const btnStart = document.getElementById('btnStartBatch');
                const filterSelect = document.getElementById('filterResultsSelect');

                progress.style.width = '0%';
                progress.classList.remove('bg-warning', 'bg-success');
                progress.classList.add('bg-primary', 'progress-bar-striped', 'progress-bar-animated');
                
                statusText.innerHTML = 'Aguardando comando de disparo...';
                counterBadge.innerText = '0 / ${rotasEncontradas.length}';
                
                // Reseta o select
                filterSelect.value = 'all';

                resultsList.innerHTML = \`
                    <div id="placeholderLoteMsg" class="text-center py-5 text-muted small border border-secondary border-opacity-25 border-dashed rounded-4 bg-white bg-opacity-60">
                        <i class="bi bi-hdd-network text-secondary opacity-50 d-block mb-2 fs-2"></i>
                        Clique no botão de iniciar para testar o tempo de resposta e os códigos de erro de todas as ${rotasEncontradas.length} rotas.
                    </div>
                \`;
                
                btnStart.disabled = false;
                btnStart.innerHTML = '<i class="bi bi-play-fill fs-5 lh-1"></i> Iniciar teste';
                if (typeof Toast !== 'undefined') Toast.success('Resultados limpos.');
            }

            async function executarTesteIndividual(btn) {
                const container = btn.closest('.test-container');
                let { rotaFinal, options } = prepararDadosRequisicao(container);
                if (!rotaFinal) return; 

                const statusBadge = container.querySelector('.status-badge');
                const responseArea = container.querySelector('.response-area');
                const responseCode = container.querySelector('.response-code');

                statusBadge.innerHTML = \`<span class="text-primary fw-medium d-flex align-items-center gap-2"><div class="spinner-border spinner-border-sm text-primary" role="status"></div> Processando...</span>\`;
                responseArea.style.display = 'block';
                responseCode.innerText = 'Disparando requisição ao servidor...';

                try {
                    const startTime = Date.now();
                    const response = await fetch(rotaFinal, options);
                    const ms = Date.now() - startTime;

                    let responseData;
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        responseData = JSON.stringify(await response.json(), null, 2);
                    } else {
                        const text = await response.text();
                        responseData = text.substring(0, 1500) + (text.length > 1500 ? '\\n\\n...[Conteúdo Truncado]...' : '');
                    }

                    responseCode.style.color = response.ok ? '#198754' : '#dc3545';
                    responseCode.innerText = responseData;
                    
                    if (response.ok) {
                        statusBadge.innerHTML = \`<span class="text-success fw-bold d-flex align-items-center gap-1"><i class="bi bi-check-circle-fill"></i> Sucesso (\${response.status}) • \${ms}ms</span>\`;
                        if (typeof Toast !== 'undefined') Toast.success(\`\${response.status} OK\`);
                    } else {
                        statusBadge.innerHTML = \`<span class="text-danger fw-bold d-flex align-items-center gap-1"><i class="bi bi-x-circle-fill"></i> Falha HTTP (\${response.status}) • \${ms}ms</span>\`;
                        if (typeof Toast !== 'undefined') Toast.error(\`Erro HTTP \${response.status}\`);
                    }
                } catch (error) {
                    responseCode.style.color = '#dc3545';
                    responseCode.innerText = error.toString();
                    statusBadge.innerHTML = \`<span class="text-danger fw-bold d-flex align-items-center gap-1"><i class="bi bi-exclamation-triangle-fill"></i> Erro de Rede</span>\`;
                    if (typeof Toast !== 'undefined') Toast.error('Falha de rede.');
                }
            }

            async function iniciarTestesEmLote() {
                const btnStart = document.getElementById('btnStartBatch');
                const progress = document.getElementById('testProgress');
                const statusText = document.getElementById('testStatusText');
                const counterBadge = document.getElementById('testCounterBadge');
                const resultsList = document.getElementById('testResultsList');

                btnStart.disabled = true;
                const msgPlaceholder = document.getElementById('placeholderLoteMsg');
                if (msgPlaceholder) msgPlaceholder.remove();
                
                const containers = document.querySelectorAll('.test-container');
                const total = containers.length;
                let concluidos = 0;
                let falhas = 0;

                for (let i = 0; i < total; i++) {
                    const container = containers[i];
                    const metodo = container.dataset.metodo;
                    let { rotaFinal, options } = prepararDadosRequisicao(container, true); 
                    if (!rotaFinal) rotaFinal = container.dataset.rota; 

                    statusText.innerHTML = \`Varrendo: <strong class="text-primary font-monospace">\${metodo} \${rotaFinal}</strong>\`;
                    
                    let sucesso = false;
                    let msgErro = '';
                    let statusCode = '';
                    let timeMs = 0;

                    try {
                        const startT = Date.now();
                        const res = await fetch(rotaFinal, options);
                        timeMs = Date.now() - startT;
                        statusCode = res.status;
                        
                        if (res.ok) {
                            sucesso = true;
                        } else {
                            falhas++;
                            const txt = await res.text();
                            if (txt.includes('<title>') || txt.includes('<html')) msgErro = "Documento HTML ou Redirecionamento (Auth)";
                            else msgErro = txt.substring(0, 80).replace(/<[^>]*>?/gm, ''); 
                        }
                    } catch (e) {
                        falhas++;
                        statusCode = 'CRASH';
                        msgErro = e.message;
                    }

                    concluidos++;
                    const perc = ((concluidos/total)*100).toFixed(0);
                    progress.style.width = \`\${perc}%\`;
                    counterBadge.innerText = \`\${concluidos} / \${total}\`;

                    const divResult = document.createElement('div');
                    const corFundo = sucesso ? 'bg-success bg-opacity-10 border-success' : 'bg-danger bg-opacity-10 border-danger';
                    const corTexto = sucesso ? 'text-success' : 'text-danger';
                    
                    // Adicionamos a classe 'result-card-item' e o data-status para que o JS do Select possa filtrar
                    divResult.className = \`result-card-item p-3 rounded-4 border border-opacity-25 \${corFundo} bg-white bg-opacity-60 d-flex flex-column gap-1 shadow-sm transition\`;
                    divResult.setAttribute('data-status', sucesso ? 'success' : 'error');
                    
                    divResult.innerHTML = \`
                        <div class="d-flex align-items-center gap-2 flex-wrap w-100">
                            <span class="badge \${sucesso ? 'bg-success' : 'bg-danger'} text-white rounded-pill px-2 py-1 font-monospace" style="font-size: 0.72rem;">Código: \${statusCode}</span>
                            <span class="badge bg-dark bg-opacity-10 text-dark border border-dark border-opacity-25 rounded-pill font-monospace small" style="font-size: 0.65rem;">\${metodo}</span>
                            <span class="text-dark font-monospace text-truncate fw-bold" style="font-size: 0.85rem;" title="\${rotaFinal}">Rota Testada: \${rotaFinal}</span>
                        </div>
                        \${!sucesso ? \`
                        <div class="text-danger font-monospace mt-1 p-2 bg-danger bg-opacity-10 rounded-3 border border-danger border-opacity-10" style="font-size: 0.78rem;">
                            <i class="bi bi-exclamation-octagon-fill me-1"></i><strong>Erro:</strong> \${statusCode} <br/>
                            <i class="bi bi-bug-fill me-1"></i><strong>Detalhe:</strong> \${msgErro || 'Sem corpo no erro'}
                        </div>
                        \` : ''}
                        <div class="d-flex justify-content-between align-items-center mt-1 text-muted opacity-75" style="font-size: 0.72rem;">
                            <span><i class="bi bi-speedometer2"></i> Tempo: <strong>\${timeMs}ms</strong></span>
                            \${sucesso ? '<span class="text-success"><i class="bi bi-check-lg"></i> Resposta íntegra</span>' : ''}
                        </div>
                    \`;
                    
                    resultsList.appendChild(divResult);
                    
                    // Invoca o filtro imediatamente para que, se o filtro já estiver ativo durante a rodada, 
                    // o item recém inserido já obedeça a regra (não exibir sucesso se estiver filtrando por erro, por exemplo)
                    aplicarFiltroResultados();
                    
                    // Garante que a barra de rolagem desça para mostrar o item que acabou de aparecer
                    divResult.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }
                
                statusText.innerHTML = \`<strong class="text-dark">Teste encerrado!</strong> \${concluidos} rotas testadas.\`;
                
                if (falhas > 0) {
                    statusText.innerHTML += \` <span class="text-danger fw-bold ms-1">(\${falhas} falhas)</span>\`;
                    progress.classList.replace('bg-primary', 'bg-warning'); 
                } else {
                    statusText.innerHTML += \` <span class="text-success fw-bold ms-1">(100% OK)</span>\`;
                    progress.classList.replace('bg-primary', 'bg-success');
                }

                progress.classList.remove('progress-bar-animated');
                btnStart.disabled = false;
                btnStart.innerHTML = '<i class="bi bi-arrow-clockwise me-2"></i> Reprocessar';
            }

            function prepararDadosRequisicao(container, silentMode = false) {
                let rotaBase = container.dataset.rota;
                const metodo = container.dataset.metodo;
                
                let prefixo = container.querySelector('.prefix-input').value.trim();
                if (prefixo) {
                    if (!prefixo.startsWith('/')) prefixo = '/' + prefixo;
                    if (prefixo.endsWith('/')) prefixo = prefixo.slice(0, -1);
                    rotaBase = rotaBase.startsWith('/') ? prefixo + rotaBase : prefixo + '/' + rotaBase;
                }

                container.querySelectorAll('.param-input').forEach(input => {
                    rotaBase = rotaBase.replace(input.dataset.param, input.value || '1');
                });

                const payloadInput = container.querySelector('.payload-input');
                let bodyData = null;
                if (payloadInput && payloadInput.value.trim() !== '') {
                    try {
                        bodyData = JSON.stringify(JSON.parse(payloadInput.value));
                    } catch (e) {
                        if(!silentMode) {
                            if (typeof Toast !== 'undefined') Toast.error('Sintaxe inválida no Payload JSON!');
                            else alert("JSON inválido!");
                        }
                        return { rotaFinal: null };
                    }
                }

                // Configuração base da requisição
                const options = { method: metodo, headers: { 'Accept': 'application/json, text/plain, */*' } };
                
                // INJEÇÃO DA TRAVA DE SEGURANÇA
                const isSafeModeOn = document.getElementById('safeModeSwitch').checked;
                if (isSafeModeOn) {
                    options.headers['X-Test-Mode'] = 'true'; // Aviso pro backend não alterar dados!
                }

                if (bodyData && ['POST', 'PUT', 'PATCH'].includes(metodo)) {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = bodyData;
                }

                return { rotaFinal: rotaBase, options, bodyData };
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = renderTestesView;