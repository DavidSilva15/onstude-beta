// views/adminNotificacoesView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderAdminNotificacoesView(admin, notificacoes) {
    
    const htmlSidebar = renderAdminMenuLateral(admin, 'notificacoes');

    let htmlNotificacoes = '';

    if (notificacoes.length === 0) {
        htmlNotificacoes = '<div class="alert alert-light text-center text-muted border py-4">Nenhuma notificação disparada ainda.</div>';
    } else {
        notificacoes.forEach((n, index) => {
            const collapseId = `collapse_${n.id}`;
            const modalEditId = `modalEdit_${n.id}`;
            
            const dataDisparo = new Date(n.criado_em).toLocaleDateString('pt-BR') + ' às ' + new Date(n.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const dInicio = n.data_inicio ? new Date(n.data_inicio).toLocaleDateString('pt-BR') + ' ' + new Date(n.data_inicio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Imediato';
            const dFim = n.data_fim ? new Date(n.data_fim).toLocaleDateString('pt-BR') + ' ' + new Date(n.data_fim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Sem validade';
            
            let alvoVisual = n.tipo_alvo === 'TODOS' 
                ? 'Todos os Alunos' 
                : `<span title="${n.cursos_alvo_nomes}">Cursos: ${n.cursos_alvo_nomes}</span>`;

            const formatForInput = (dataObj) => dataObj ? new Date(dataObj.getTime() - dataObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '';
            const valInicio = formatForInput(n.data_inicio ? new Date(n.data_inicio) : null);
            const valFim = formatForInput(n.data_fim ? new Date(n.data_fim) : null);

            const taxaLeitura = n.total_enviados > 0 ? Math.round((n.total_lidos / n.total_enviados) * 100) : 0;

            let htmlRespostas = '';
            let btnExportar = ''; // Variável para o botão de download

            if (n.tipo_interacao === 'NENHUM') {
                htmlRespostas = '<div class="alert alert-secondary text-center small mb-0">Esta notificação é apenas informativa. Não há respostas a exibir.</div>';
            } else if (n.respostas && n.respostas.length > 0) {
                // Se houver respostas, exibe o botão de exportar
                btnExportar = `<a href="/admin/notificacoes/${n.id}/exportar" class="btn btn-sm btn-success me-1 fw-bold shadow-sm">📥 Exportar Dados (Excel)</a>`;

                let linhasRespostas = n.respostas.map(r => {
                    const dataResp = new Date(r.respondido_em).toLocaleDateString('pt-BR') + ' ' + new Date(r.respondido_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                    let conteudoResposta = '';
                    
                    if (n.tipo_interacao === 'AVALIACAO_ESTRELAS') {
                        let estrelas = '';
                        for(let i=1; i<=5; i++) { estrelas += i <= r.avaliacao_estrelas ? '⭐' : '☆'; }
                        conteudoResposta = `<span class="fs-5">${estrelas}</span>`;
                    } else {
                        conteudoResposta = `"${r.resposta_texto}"`;
                    }

                    return `
                        <tr>
                            <td class="fw-semibold">${r.nome_aluno}</td>
                            <td>${conteudoResposta}</td>
                            <td class="text-muted small">${dataResp}</td>
                        </tr>
                    `;
                }).join('');

                htmlRespostas = `
                    <div class="table-responsive" style="max-height: 250px; overflow-y: auto;">
                        <table class="table table-sm table-hover align-middle mb-0">
                            <thead class="table-light sticky-top">
                                <tr><th>Aluno</th><th>Resposta / Avaliação</th><th>Data</th></tr>
                            </thead>
                            <tbody>${linhasRespostas}</tbody>
                        </table>
                    </div>
                `;
            } else {
                htmlRespostas = '<div class="alert alert-light text-center border small mb-0">Aguardando as respostas dos alunos...</div>';
            }

            let badgeTipo = 'bg-secondary';
            if(n.tipo_interacao === 'PESQUISA_TEXTO') badgeTipo = 'bg-info text-dark';
            if(n.tipo_interacao === 'AVALIACAO_ESTRELAS') badgeTipo = 'bg-warning text-dark';

            htmlNotificacoes += `
                <div class="accordion-item border-0 shadow-sm mb-3 rounded overflow-hidden">
                    <h2 class="accordion-header" id="heading_${n.id}">
                        <button class="accordion-button collapsed py-3" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}">
                            <div class="d-flex flex-column w-100 me-3">
                                <div class="d-flex justify-content-between align-items-center mb-1">
                                    <span class="fw-bold fs-5 text-dark">${n.titulo}</span>
                                    <span class="badge ${badgeTipo}">${n.tipo_interacao.replace('_', ' ')}</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center text-muted small">
                                    <span class="text-truncate d-inline-block" style="max-width: 60%;">
                                        Disparado em: <strong>${dataDisparo}</strong> | Alvo: <strong>${alvoVisual}</strong>
                                    </span>
                                    <span>Lidos: <strong>${n.total_lidos} / ${n.total_enviados}</strong> (${taxaLeitura}%)</span>
                                </div>
                            </div>
                        </button>
                    </h2>
                    <div id="${collapseId}" class="accordion-collapse collapse" data-bs-parent="#accordionNotificacoes">
                        <div class="accordion-body bg-light border-top p-4">
                            <div class="row">
                                <div class="col-md-5 mb-4 mb-md-0">
                                    <h6 class="fw-bold text-secondary mb-3">Conteúdo</h6>
                                    <p class="mb-2 p-3 bg-white border rounded shadow-sm text-dark">${n.mensagem.replace(/\\n/g, '<br>')}</p>
                                    ${n.imagem_url ? `<img src="${n.imagem_url}" class="img-fluid rounded border mb-2" style="max-height: 120px;">` : ''}
                                    
                                    <div class="mt-3 p-2 bg-white border rounded small">
                                        <i class="bi bi-calendar-event text-primary"></i> <strong>Exibição:</strong><br>
                                        Início: ${dInicio}<br>Fim: <span class="${n.data_fim && new Date(n.data_fim) < new Date() ? 'text-danger fw-bold' : ''}">${dFim}</span>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <h6 class="fw-bold text-secondary mb-0">Respostas dos Alunos</h6>
                                        <div>
                                            ${btnExportar}
                                            <button class="btn btn-sm btn-primary me-1" data-bs-toggle="modal" data-bs-target="#${modalEditId}">Editar...</button>
                                            <form action="/admin/notificacoes/${n.id}/excluir" method="POST" class="d-inline" onsubmit="return confirm('Tem certeza? Isso apagará as respostas e removerá o modal dos alunos.');">
                                                <button type="submit" class="btn btn-sm btn-outline-danger">Excluir</button>
                                            </form>
                                        </div>
                                    </div>
                                    ${htmlRespostas}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="${modalEditId}" tabindex="-1" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header bg-primary text-white">
                                <h5 class="modal-title">Editar Notificação</h5>
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                            </div>
                            <form action="/admin/notificacoes/${n.id}/editar" method="POST">
                                <div class="modal-body">
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Título</label>
                                        <input type="text" class="form-control" name="titulo" value="${n.titulo}" required>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label fw-semibold">Mensagem</label>
                                        <textarea class="form-control" name="mensagem" rows="3" required>${n.mensagem}</textarea>
                                    </div>
                                    <hr>
                                    <h6 class="fw-bold mb-3">Período de Exibição (Prolongar/Encurtar)</h6>
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Data Início</label>
                                        <input type="datetime-local" class="form-control" name="data_inicio" value="${valInicio}">
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold">Data Fim (Expiração)</label>
                                        <input type="datetime-local" class="form-control" name="data_fim" value="${valFim}">
                                    </div>
                                </div>
                                <div class="modal-footer bg-light">
                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                                    <button type="submit" class="btn btn-success fw-bold">Salvar Alterações</button>
                                </div>
                            </form>
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
        <title>Gerenciar Notificações - Admin OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); } /* Desconta a navbar mobile */
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

        <div class="container mt-0 mb-5">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 class="fw-bold text-dark mb-0">Gerenciador de Notificações</h3>
                    <p class="text-muted mb-0">Acompanhe estatísticas, leia as respostas e prolongue a validade dos avisos.</p>
                </div>
                <a href="/admin/notificacoes/nova" class="btn btn-success fw-bold shadow-sm">+ Disparar Nova</a>
            </div>

            <div class="accordion" id="accordionNotificacoes">
                ${htmlNotificacoes}
            </div>
        </div>

        </div> </div> </div>
        <script>
    // 1. Esconde o loader no carregamento normal E quando o usuário clica em "Voltar"
    window.addEventListener('pageshow', function(event) {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            // Se event.persisted for true, significa que a página veio do "cache" do botão voltar
            if (event.persisted) {
                loader.style.display = 'none';
                loader.style.opacity = '0';
            } else {
                // Carregamento normal da página (fade suave)
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

module.exports = renderAdminNotificacoesView;