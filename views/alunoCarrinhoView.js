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
            <div class="text-center py-5 bg-white rounded-4 shadow-sm border-0">
                <i class="bi bi-cart-x text-muted mb-3 d-block" style="font-size: 4rem;"></i>
                <h4 class="fw-bold text-dark">Seu carrinho está vazio</h4>
                <p class="text-muted">Parece que você ainda não escolheu nenhum curso para impulsionar a sua carreira.</p>
                <a href="/aluno" class="btn btn-primary rounded-pill px-4 fw-bold mt-3">Explorar Cursos</a>
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
                <div class="card border-0 shadow-sm rounded-4 mb-3 position-relative overflow-hidden bg-white">
                    <div class="row g-0 align-items-center p-3">
                        <div class="col-md-2 col-4 text-center">
                            <img src="${curso.capa_url || 'https://via.placeholder.com/150'}" class="img-fluid rounded-3 shadow-sm border" style="max-height: 90px; object-fit: cover;" alt="Capa">
                        </div>
                        <div class="col-md-6 col-8 px-3">
                            <h6 class="fw-bold text-dark mb-1">${curso.titulo}</h6>
                            ${desc > 0 ? `<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill small mb-2 d-inline-block">-${desc}% OFF</span>` : ''}
                        </div>
                        <div class="col-md-3 col-12 text-md-end text-start mt-3 mt-md-0 px-3">
                            ${desc > 0 ? `<small class="text-decoration-line-through text-muted d-block" style="font-size: 0.8rem;">${precoAntigo}</small>` : ''}
                            <h5 class="fw-bolder text-primary mb-0">${precoFormatado}</h5>
                        </div>
                        <div class="col-md-1 col-12 text-end mt-2 mt-md-0">
                            <button class="btn btn-sm btn-light text-danger rounded-circle shadow-sm border" onclick="removerDoCarrinho(${curso.id})" title="Remover curso">
                                <i class="bi bi-trash-fill"></i>
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
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            .resumo-card { position: sticky; top: 20px; }
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
                    
                    <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h3 class="fw-bold text-dark mb-0"><i class="bi bi-cart3 text-primary me-2"></i>Meu Carrinho</h3>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-8 mb-4">
                            ${htmlItens}
                        </div>

                        ${cursos.length > 0 ? `
                        <div class="col-lg-4">
                            <div class="card border-0 shadow-sm rounded-4 resumo-card p-4">
                                <h5 class="fw-bold text-dark border-bottom pb-3 mb-3">Resumo do Pedido</h5>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Subtotal:</span>
                                    <span class="fw-semibold text-dark">${subFormatado}</span>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-3">
                                    <span class="text-muted">Descontos:</span>
                                    <span class="fw-semibold text-success">-${descFormatado}</span>
                                </div>

                                <hr class="opacity-25 my-3">

                                <div class="d-flex justify-content-between align-items-center mb-4">
                                    <span class="fw-bold text-dark fs-5">Total:</span>
                                    <span class="fw-bolder text-primary fs-3">${finalFormatado}</span>
                                </div>

                                <form action="/aluno/checkout" method="POST">
                                    <button type="submit" class="btn btn-success btn-lg w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2">
                                        Finalizar Compra <i class="bi bi-shield-lock-fill"></i>
                                    </button>
                                </form>
                                
                                <p class="text-center text-muted small mt-3 mb-0">
                                    <i class="bi bi-credit-card me-1"></i> Pagamento seguro via <strong>Mercado Pago</strong>
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
                        window.location.reload(); // Recarrega a página para atualizar os valores
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