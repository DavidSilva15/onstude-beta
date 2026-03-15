// views/alunoCertificadosView.js

function renderAlunoCertificadosView(aluno, certificados) {
    let htmlCertificados = '';

    if (certificados.length === 0) {
        htmlCertificados = `
            <div class="col-12 text-center py-5 mt-4 bg-white border rounded shadow-sm">
                <h4 class="text-secondary fw-bold mb-3">Nenhum registo encontrado</h4>
                <p class="text-muted mb-4">Assim que for matriculado em um curso, os dados do seu certificado aparecerão aqui.</p>
            </div>
        `;
    } else {
        certificados.forEach(cert => {
            // Usa o template do certificado como Thumb (ou um placeholder se o admin esquecer de enviar)
            const thumb = cert.certificado_template_url ? cert.certificado_template_url : 'https://via.placeholder.com/600x400?text=Certificado+OnStude';
            
            const estaConcluido = cert.emitido_em !== null;
            const dataEmissao = estaConcluido ? new Date(cert.emitido_em).toLocaleDateString('pt-BR') : 'Pendente';
            
            // Lógica visual da Thumb (Miniatura)
            const thumbHtml = estaConcluido
                ? `<div class="h-100 w-100 overflow-hidden bg-light"><img src="${thumb}" class="img-fluid w-100 h-100 border-end" style="object-fit: cover;" alt="Certificado Liberado"></div>`
                : `<div class="position-relative h-100 w-100 bg-dark overflow-hidden d-flex align-items-center justify-content-center">
                        <img src="${thumb}" class="img-fluid w-100 h-100" style="object-fit: cover; opacity: 0.4; filter: blur(2px);" alt="Certificado Bloqueado">
                        <div class="position-absolute fs-1" title="Curso não concluído">🔒</div>
                   </div>`;

            const badgeStatus = estaConcluido 
                ? '<span class="badge bg-success mb-2">Concluído</span>' 
                : '<span class="badge bg-warning text-dark mb-2">Em Andamento</span>';
            
            const areaAcao = estaConcluido
                ? `
                    <div class="bg-light p-3 rounded border border-success mt-3">
                        <p class="small text-success fw-bold mb-1">EMITIDO EM: ${dataEmissao}</p>
                        <p class="mb-3">Código de Validação: <strong class="user-select-all fs-6 text-dark">${cert.token}</strong></p>
                        <a href="/aluno/certificados/${cert.certificado_id}/download" class="btn btn-success fw-bold px-4">⬇️ Fazer Download do PDF</a>
                    </div>
                `
                : `
                    <div class="bg-light p-3 rounded border mt-3 text-muted">
                        <p class="small mb-1">Status: <strong class="text-dark">Aguardando conclusão da última aula</strong></p>
                        <p class="mb-0 small">O seu código de validação <strong class="user-select-all">${cert.token}</strong> será ativado em breve.</p>
                    </div>
                `;

            htmlCertificados += `
                <div class="col-12 mb-4">
                    <div class="card shadow-sm border-0 h-100 transition">
                        <div class="row g-0 h-100">
                            <div class="col-md-4 col-lg-3 d-none d-md-block h-100" style="min-height: 200px;">
                                ${thumbHtml}
                            </div>
                            <div class="col-md-8 col-lg-9">
                                <div class="card-body d-flex flex-column h-100 justify-content-center p-4">
                                    <div>
                                        ${badgeStatus}
                                        <h4 class="card-title fw-bold text-dark mb-1">${cert.curso_titulo}</h4>
                                    </div>
                                    ${areaAcao}
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
        <title>Meus Certificados - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
            body { background-color: #f8f9fa; }
            .transition { transition: all .3s ease; }
            .transition:hover { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
        </style>
    </head>
    <body>
    <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
    <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
        <span class="visually-hidden">Carregando...</span>
    </div>
    <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
</div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold text-white" href="/aluno">OnStude</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item"><a class="nav-link fw-semibold" href="/aluno">Meus Cursos</a></li>
                        <li class="nav-item"><a class="nav-link active fw-semibold" href="/aluno/certificados">Meus Certificados</a></li>
                    </ul>
                    <div class="dropdown ms-auto">
                        <a href="#" class="d-flex align-items-center text-white text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
                            ${aluno.foto_perfil_url 
                                ? `<img src="${aluno.foto_perfil_url}" alt="Foto" class="rounded-circle me-2" style="width: 36px; height: 36px; object-fit: cover; border: 2px solid rgba(255,255,255,0.5);">` 
                                : `<div class="rounded-circle me-2 d-flex align-items-center justify-content-center bg-light text-primary fw-bold" style="width: 36px; height: 36px; border: 2px solid rgba(255,255,255,0.5); font-size: 14px;">${aluno.nome.charAt(0).toUpperCase()}</div>`
                            }
                            <span class="d-none d-md-inline me-2">Olá, <strong>${aluno.nome.split(' ')[0]}</strong></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="dropdownUser">
                            <li><a class="dropdown-item fw-semibold text-secondary" href="/aluno/perfil">✏️ Editar Perfil</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item fw-bold text-danger" href="/logout">🚪 Sair</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>

        <div class="container mt-5 mb-5">
            <div class="row mb-4">
                <div class="col-12">
                    <h2 class="fw-bold text-dark">Meus Certificados</h2>
                    <p class="text-muted">Acompanhe as suas validações e faça o download em PDF dos seus certificados concluídos.</p>
                </div>
            </div>
            <div class="row">
                ${htmlCertificados}
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
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

module.exports = renderAlunoCertificadosView;