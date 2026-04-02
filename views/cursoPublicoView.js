// views/cursoPublicoView.js
const renderMainHeader = require('./mainHeader');

function renderCursoPublicoView(usuarioLogado, curso, cronograma, isMatriculado) {
    const headerHTML = renderMainHeader(usuarioLogado);
    
    const capa = curso.capa_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';
    const preco = parseFloat(curso.preco);
    const isGratuito = preco === 0;
    const precoFormatado = isGratuito ? 'Gratuito' : `R$ ${preco.toFixed(2).replace('.', ',')}`;
    const duracao = curso.duracao_horas ? `${curso.duracao_horas}h` : '--h';
    const totalAulas = cronograma.reduce((acc, mod) => acc + mod.aulas.length, 0);

    // ==========================================
    // LÓGICA DO BOTÃO PRINCIPAL DE AÇÃO
    // ==========================================
    let btnAcaoHTML = '';
    
    if (isMatriculado) {
        // Já tem o curso
        btnAcaoHTML = `<a href="/aluno/cursos/${curso.id}/aula" class="btn btn-success btn-lg fw-bold px-5 py-3 rounded-pill shadow w-100 mb-3"><i class="bi bi-play-circle-fill me-2"></i> Continuar Estudando</a>`;
    } else if (usuarioLogado && usuarioLogado.tipo === 'ALUNO') {
        // Está logado mas não tem o curso
        if (isGratuito) {
            btnAcaoHTML = `
                <form action="/aluno/matricula/gratis" method="POST">
                    <input type="hidden" name="curso_id" value="${curso.id}">
                    <button type="submit" class="btn btn-primary btn-lg fw-bold px-5 py-3 rounded-pill shadow w-100 mb-3">Matricular-se Gratuitamente</button>
                </form>`;
        } else {
            btnAcaoHTML = `<a href="/carrinho/add/${curso.id}" class="btn btn-primary btn-lg fw-bold px-5 py-3 rounded-pill shadow w-100 mb-3"><i class="bi bi-cart-plus me-2"></i> Comprar por ${precoFormatado}</a>`;
        }
    } else {
        // Não está logado
        btnAcaoHTML = `<a href="/login?returnTo=/cursos/${curso.id}" class="btn btn-primary btn-lg fw-bold px-5 py-3 rounded-pill shadow w-100 mb-3">${isGratuito ? 'Faça Login para Adicionar' : `Comprar por ${precoFormatado}`}</a>`;
    }

    // ==========================================
    // LÓGICA DO BOTÃO SECUNDÁRIO (CARRINHO)
    // ==========================================
    let btnCarrinhoHTML = '';
    if (!isMatriculado && !isGratuito) {
        btnCarrinhoHTML = `
            <button class="btn btn-outline-primary fw-bold px-4 py-3 rounded-pill w-100 d-flex align-items-center justify-content-center mt-3 transition" id="btnAdicionarCarrinhoLateral">
                <i class="bi bi-cart-plus me-2"></i> Adicionar ao Carrinho
            </button>
        `;
    }

    // ==========================================
    // MONTAGEM DO CRONOGRAMA (ACCORDION)
    // ==========================================
    let htmlCronograma = '';
    if (cronograma.length === 0) {
        htmlCronograma = '<div class="alert alert-light border text-center text-muted">A ementa deste curso está sendo preparada.</div>';
    } else {
        cronograma.forEach((modulo, index) => {
            let htmlAulas = '';
            
            if (modulo.aulas.length === 0) {
                htmlAulas = '<div class="text-muted small p-3 bg-light">Aulas sendo preparadas para este módulo.</div>';
            } else {
                modulo.aulas.forEach((aula, iAula) => {
                    htmlAulas += `
                        <div class="d-flex align-items-start p-3 border-bottom hover-bg transition">
                            <div class="text-primary me-3 mt-1"><i class="bi bi-play-circle fs-5"></i></div>
                            <div>
                                <h6 class="fw-bold mb-1 text-dark">${iAula + 1}. ${aula.titulo}</h6>
                                ${aula.descricao ? `<p class="small text-muted mb-0" style="font-size: 0.85rem;">${aula.descricao}</p>` : ''}
                            </div>
                        </div>
                    `;
                });
            }

            htmlCronograma += `
                <div class="accordion-item border-0 mb-3 shadow-sm rounded-4 overflow-hidden">
                    <h2 class="accordion-header" id="headingMod${modulo.id}">
                        <button class="accordion-button ${index === 0 ? '' : 'collapsed'} fw-bold bg-white text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMod${modulo.id}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapseMod${modulo.id}">
                            Módulo ${index + 1}: ${modulo.titulo}
                            <span class="badge bg-light text-secondary border ms-auto me-2">${modulo.aulas.length} aulas</span>
                        </button>
                    </h2>
                    <div id="collapseMod${modulo.id}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="headingMod${modulo.id}">
                        <div class="accordion-body p-0 border-top">
                            ${htmlAulas}
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
        <title>${curso.titulo} - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa; }
            .transition { transition: all 0.3s ease; }
            .hover-bg:hover { background-color: #f1f3f4; }
            .hover-white:hover { color: #ffffff !important; }
            
            /* Navbar estilos trazidos para o MainHeader */
            .navbar-custom { background-color: #ffffff; border-bottom: 1px solid #eaeaea; }
            .search-bar-header { background-color: #f1f3f4; border: none; border-radius: 50px; padding-left: 40px; }
            
            /* HERO - Imagem de fundo com gradiente escurecendo para baixo */
            .curso-hero {
                position: relative;
                width: 100%;
                min-height: 500px;
                background-image: url('${capa}');
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                display: flex;
                align-items: flex-end;
                padding-bottom: 40px;
                padding-top: 100px;
            }
            .curso-hero::before {
                content: '';
                position: absolute;
                top: 0; right: 0; bottom: 0; left: 0;
                background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.85) 100%);
                z-index: 1;
            }
            .hero-content { position: relative; z-index: 2; }
            
            /* Fixando o card lateral em telas grandes */
            @media (min-width: 992px) {
                .card-flutuante { position: sticky; top: 100px; }
            }
        </style>
    </head>
    <body>

        ${headerHTML}

        <section class="curso-hero">
            <div class="container hero-content text-white">
                <div class="row">
                    <div class="col-lg-8">
                        <div class="d-flex align-items-center mb-3">
                            <span class="badge bg-primary px-3 py-2 rounded-pill me-2">Em Alta</span>
                            ${isGratuito ? '<span class="badge bg-success px-3 py-2 rounded-pill">100% Grátis</span>' : ''}
                        </div>
                        <h1 class="fw-bold display-4 mb-3" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">${curso.titulo}</h1>
                        <p class="fs-5 opacity-75 mb-4 pe-lg-5" style="display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; text-shadow: 1px 1px 3px rgba(0,0,0,0.5);">
                            ${curso.descricao || 'Descrição detalhada não disponível no momento.'}
                        </p>
                        
                        <div class="d-flex flex-wrap gap-4 fw-semibold small">
                            <span><i class="bi bi-clock me-2"></i>Carga Horária: ${duracao}</span>
                            <span><i class="bi bi-journal-text me-2"></i>Total de Aulas: ${totalAulas}</span>
                            <span><i class="bi bi-award me-2"></i>Certificado Reconhecido</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="py-5">
            <div class="container">
                <div class="row position-relative">
                    
                    <div class="col-lg-8 pe-lg-5 mb-5 mb-lg-0">
                        <h3 class="fw-bold text-dark mb-4">O que você vai aprender</h3>
                        <div class="bg-white p-4 rounded-4 shadow-sm border mb-5">
                            <p class="text-muted mb-0 lh-lg" style="text-align: justify; white-space: pre-wrap;">${curso.descricao || 'Sem descrição detalhada.'}</p>
                        </div>

                        <h3 class="fw-bold text-dark mb-4">Cronograma Didático</h3>
                        <p class="text-muted mb-4">Confira os módulos e as aulas que compõem este treinamento.</p>
                        
                        <div class="accordion" id="accordionCronograma">
                            ${htmlCronograma}
                        </div>
                    </div>

                    <div class="col-lg-4">
                        <div class="card card-flutuante border-0 shadow-lg rounded-4 p-4 text-center">
                            <h2 class="fw-bold text-dark mb-4">${precoFormatado}</h2>
                            
                            ${btnAcaoHTML}
                            
                            <button class="btn btn-outline-secondary fw-bold px-4 py-3 rounded-pill w-100 d-flex align-items-center justify-content-center" id="btnFavoritarSecundario">
                                <i class="bi bi-heart me-2" id="iconHeart"></i> Adicionar aos Favoritos
                            </button>

                            ${btnCarrinhoHTML}
                            
                            <hr class="my-4 text-muted">
                            
                            <ul class="list-unstyled text-start small text-muted mb-0">
                                <li class="mb-3"><i class="bi bi-check2-circle text-success me-2 fs-5"></i> Acesso imediato a todas as aulas</li>
                                <li class="mb-3"><i class="bi bi-check2-circle text-success me-2 fs-5"></i> Acesso vitalício à plataforma</li>
                                <li class="mb-3"><i class="bi bi-check2-circle text-success me-2 fs-5"></i> Certificado de conclusão válido</li>
                                <li><i class="bi bi-check2-circle text-success me-2 fs-5"></i> Suporte no Fórum de dúvidas</li>
                            </ul>
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
                        <p class="text-white-50 small pe-lg-5">Aprenda com especialistas, no seu ritmo, e conquiste novas oportunidades no mercado de trabalho com certificados reconhecidos.</p>
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

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        
        <script>
            // Passa a informação do backend para o Javascript
            const isUsuarioLogado = ${usuarioLogado ? 'true' : 'false'};
            const cursoAtualId = ${curso.id};

            // Lógica Botão Favoritos
            document.getElementById('btnFavoritarSecundario').addEventListener('click', function(e) {
                e.preventDefault();

                if (!isUsuarioLogado) {
                    window.location.href = '/login?returnTo=/cursos/' + cursoAtualId;
                    return;
                }

                const icon = document.getElementById('iconHeart');
                const isFavorited = icon.classList.contains('bi-heart-fill');

                if (isFavorited) {
                    icon.classList.replace('bi-heart-fill', 'bi-heart');
                    icon.classList.remove('text-danger');
                } else {
                    icon.classList.replace('bi-heart', 'bi-heart-fill');
                    icon.classList.add('text-danger');
                }

                fetch('/aluno/api/favoritos/toggle', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ curso_id: cursoAtualId })
                })
                .then(res => res.json())
                .then(data => {
                    if (!data.success) {
                        alert('Ocorreu um erro ao atualizar os favoritos.');
                        if (isFavorited) {
                            icon.classList.replace('bi-heart', 'bi-heart-fill');
                            icon.classList.add('text-danger');
                        } else {
                            icon.classList.replace('bi-heart-fill', 'bi-heart');
                            icon.classList.remove('text-danger');
                        }
                    }
                })
                .catch(err => {
                    console.error('Erro de conexão:', err);
                });
            });

            // ==========================================
            // LÓGICA DO NOVO BOTÃO: ADICIONAR AO CARRINHO
            // ==========================================
            const btnCarrinho = document.getElementById('btnAdicionarCarrinhoLateral');
            if (btnCarrinho) {
                btnCarrinho.addEventListener('click', function(e) {
                    e.preventDefault();

                    // 1. Verifica login
                    if (!isUsuarioLogado) {
                        window.location.href = '/login?returnTo=/cursos/' + cursoAtualId;
                        return;
                    }

                    // 2. Feedback visual imediato (Loader no botão)
                    const originalText = btnCarrinho.innerHTML;
                    btnCarrinho.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Adicionando...';
                    btnCarrinho.disabled = true;

                    // 3. Chamada à API de Carrinho
                    fetch('/aluno/carrinho/adicionar', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ curso_id: cursoAtualId })
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            // Apenas recarrega a página para atualizar o contador do carrinho no header
                            window.location.reload();
                        } else {
                            // Se houver erro (ex: já possui o curso)
                            alert(data.message || 'Erro ao adicionar ao carrinho.');
                            btnCarrinho.innerHTML = originalText;
                            btnCarrinho.disabled = false;
                        }
                    })
                    .catch(err => {
                        console.error('Erro:', err);
                        alert('Erro de conexão ao adicionar ao carrinho.');
                        btnCarrinho.innerHTML = originalText;
                        btnCarrinho.disabled = false;
                    });
                });
            }
        </script>
    </body>
    </html>
    `;
}

module.exports = renderCursoPublicoView;