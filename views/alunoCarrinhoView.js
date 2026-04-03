// views/alunoCarrinhoView.js
const renderAlunoMenuLateral = require('./alunoMenuLateral');

function renderAlunoCarrinhoView(aluno, cursos) {
    // Renderiza o menu lateral, passando a aba ativa 'carrinho'
    const htmlSidebar = renderAlunoMenuLateral(aluno, 'carrinho');

    let htmlItens = '';
    let subtotal = 0;
    let totalDesconto = 0;
    let totalFinal = 0;

    if (cursos.length === 0) {
        htmlItens = `
            <div class="text-center py-5 glass-card rounded-4 shadow-sm">
                <i class="bi bi-cart-x text-muted mb-3 d-block" style="font-size: 4rem; opacity: 0.5;"></i>
                <h4 class="fw-bold text-dark">Seu carrinho está vazio</h4>
                <p class="text-muted">Parece que você ainda não escolheu nenhum curso para impulsionar a sua carreira.</p>
                <a href="/aluno" class="btn btn-primary rounded-pill px-4 py-2 fw-bold mt-3 shadow-sm">Explorar Cursos</a>
            </div>
        `;
    } else {
        cursos.forEach(curso => {
            const precoReal = parseFloat(curso.preco) || 0;
            const desc = parseInt(curso.desconto_percentual) || 0;
            const precoFinal = precoReal - (precoReal * (desc / 100));
            const valorDesconto = precoReal - precoFinal;

            subtotal += precoReal;
            totalDesconto += valorDesconto;
            totalFinal += precoFinal;

            const precoFormatado = precoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            const precoAntigo = precoReal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            htmlItens += `
                <div class="card border-0 shadow-sm rounded-4 mb-3 position-relative overflow-hidden glass-card transition-all hover-card">
                    <div class="row g-0 align-items-center p-3">
                        <div class="col-md-2 col-4 text-center">
                            <img src="${curso.capa_url || 'https://via.placeholder.com/150'}" class="img-fluid rounded-3 shadow-sm border border-light" style="max-height: 90px; object-fit: cover;" alt="Capa">
                        </div>
                        <div class="col-md-6 col-8 px-3">
                            <h6 class="fw-bold text-dark mb-1">${curso.titulo}</h6>
                            ${desc > 0 ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill small mb-2 d-inline-block shadow-sm">-${desc}% OFF</span>` : ''}
                        </div>
                        <div class="col-md-3 col-12 text-md-end text-start mt-3 mt-md-0 px-3">
                            ${desc > 0 ? `<small class="text-decoration-line-through text-muted d-block opacity-75" style="font-size: 0.8rem;">${precoAntigo}</small>` : ''}
                            <h5 class="fw-bolder text-primary mb-0">${precoFormatado}</h5>
                        </div>
                        <div class="col-md-1 col-12 text-end mt-2 mt-md-0">
                            <button class="btn btn-sm btn-light text-danger rounded-circle shadow-sm border border-light transition-all hover-danger" onclick="removerDoCarrinho(${curso.id})" title="Remover curso" style="width: 36px; height: 36px;">
                                <i class="bi bi-trash3-fill"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    const subFormatado = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const descFormatado = totalDesconto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const finalFormatado = totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meu Carrinho - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <style>
            body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: #212529; overflow-x: hidden; position: relative; margin: 0; background-color: transparent; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            .resumo-card { position: sticky; top: 20px; }
            
            .transition-all { transition: all 0.3s ease; }
            .hover-card:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,.08)!important; }
            .hover-danger:hover { background-color: #dc3545 !important; color: white !important; border-color: #dc3545 !important; }

            /* ==========================================
               GRADIENT MESH BACKGROUND
               ========================================== */
            .mesh-bg {
                position: fixed;
                top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: -1;
                background-color: #f4f7f6;
                overflow: hidden;
            }
            .mesh-blob-1, .mesh-blob-2, .mesh-blob-3 {
                position: absolute;
                border-radius: 50%;
                filter: blur(90px);
                opacity: 0.25;
                animation: floatAnim 20s infinite ease-in-out alternate;
            }
            .mesh-blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #0d6efd; animation-delay: 0s; }
            .mesh-blob-2 { bottom: -20%; right: -10%; width: 60vw; height: 60vw; background: #0dcaf0; animation-delay: -5s; }
            .mesh-blob-3 { top: 30%; left: 40%; width: 45vw; height: 45vw; background: #6610f2; animation-delay: -10s; }
            
            @keyframes floatAnim {
                0% { transform: translate(0, 0) scale(1); }
                33% { transform: translate(5%, 15%) scale(1.1); }
                66% { transform: translate(-10%, 5%) scale(0.9); }
                100% { transform: translate(0, 0) scale(1); }
            }

            /* ==========================================
               GLASSMORPHISM CARDS
               ========================================== */
            .glass-card {
                background: rgba(255, 255, 255, 0.65) !important;
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border: 1px solid rgba(255, 255, 255, 0.8) !important;
                box-shadow: 0 8px 32px rgba(31, 38, 135, 0.05);
            }
        </style>
    </head>
    <body>

        <div class="mesh-bg">
            <div class="mesh-blob-1"></div>
            <div class="mesh-blob-2"></div>
            <div class="mesh-blob-3"></div>
        </div>

        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;"></div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-transparent">
                <div class="container-fluid p-4 p-md-5">
                    
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom border-secondary border-opacity-10 pb-3">
                        <h3 class="fw-bold text-dark mb-0"><i class="bi bi-cart3 text-primary me-2"></i>Meu Carrinho</h3>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            ${htmlItens}
                        </div>

                        ${cursos.length > 0 ? `
                        <div class="col-lg-4">
                            <div class="card border-0 shadow-sm rounded-4 resumo-card p-4 glass-card">
                                <h5 class="fw-bold text-dark border-bottom border-secondary border-opacity-10 pb-3 mb-3">Resumo do Pedido</h5>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted fw-semibold">Subtotal:</span>
                                    <span class="fw-bold text-dark">${subFormatado}</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-muted fw-semibold">Descontos:</span>
                                    <span class="fw-bold text-success border border-success border-opacity-25 bg-success bg-opacity-10 px-2 rounded-pill small">-${descFormatado}</span>
                                </div>

                                <hr class="border-secondary opacity-10 my-3">

                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <span class="fw-bold text-dark fs-5">Total:</span>
                                    <span class="fw-bolder text-primary fs-3">${finalFormatado}</span>
                                </div>

                                <form action="/aluno/checkout" method="POST">
                                    <button type="submit" class="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2 transition-all hover-card">
                                        Finalizar Compra <i class="bi bi-shield-lock-fill"></i>
                                    </button>
                                </form>
                                
                                <p class="text-center text-muted small mt-4 mb-0 opacity-75">
                                    <i class="bi bi-credit-card-2-front-fill me-1"></i> Pagamento seguro via <strong>Mercado Pago</strong>
                                </p>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            function removerDoCarrinho(cursoId) {
                fetch('/aluno/carrinho/remover', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ curso_id: cursoId })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        window.location.reload(); 
                    }
                })
                .catch(err => console.error('Erro:', err));
            }

            // Lógica do Loader Global
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

module.exports = renderAlunoCarrinhoView;