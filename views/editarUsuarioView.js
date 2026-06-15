// views/editarUsuarioView.js

const renderAdminMenuLateral = require('./adminMenuLateral');

function renderEditarUsuarioView(admin, usuario, cursosDisponiveis) {

    const htmlSidebar = renderAdminMenuLateral(admin, 'usuarios');

    let htmlDisponiveis = '';
    let htmlMatriculados = '';

    // Imagem de fallback nativa (SVG em Base64). Não precisa de internet e nunca dá erro de rede!
    const fallbackCapa = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2265%22%20height%3D%2245%22%20viewBox%3D%220%200%2065%2045%22%3E%3Crect%20fill%3D%22%23e9ecef%22%20width%3D%22100%25%22%20height%3D%22100%25%22%2F%3E%3Ctext%20fill%3D%22%236c757d%22%20font-family%3D%22sans-serif%22%20font-size%3D%2212%22%20font-weight%3D%22bold%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ECurso%3C%2Ftext%3E%3C%2Fsvg%3E';

    if (cursosDisponiveis && cursosDisponiveis.length > 0) {
        cursosDisponiveis.forEach(curso => {
            
            // Usa exatamente o que vem do banco de dados (ex: /img/capa-123.jpg). Se estiver vazio, usa o SVG Base64.
            const capa = (curso.capa_url && curso.capa_url.trim() !== '') ? curso.capa_url : fallbackCapa;
            
            const cardHTML = `
                <div class="list-group-item d-flex align-items-center mb-2 shadow-sm rounded-3 border-0 cursor-grab curso-card" data-id="${curso.id}">
                    <img src="${capa}" onerror="this.onerror=null;this.src='${fallbackCapa}';" alt="Capa" class="rounded me-3 border border-light shadow-sm" style="width: 65px; height: 45px; object-fit: cover;">
                    <div class="flex-grow-1 lh-sm text-truncate pe-2">
                        <strong class="d-block text-dark text-truncate mb-1" style="font-size: 0.95rem;">${curso.titulo}</strong>
                        <small class="text-muted fw-semibold" style="font-size: 0.75rem;"><i class="bi bi-upc-scan me-1"></i>${curso.codigo_unico}</small>
                    </div>
                    <i class="bi bi-arrows-move text-secondary opacity-50 ms-2" title="Arrastar"></i>
                </div>
            `;

            if (curso.matriculado) {
                htmlMatriculados += cardHTML;
            } else {
                htmlDisponiveis += cardHTML;
            }
        });
    } else {
        htmlDisponiveis = '<div class="text-muted small p-3 text-center w-100">Nenhum curso disponível.</div>';
    }

    if (!htmlMatriculados) {
        htmlMatriculados = '<div class="placeholder-empty text-muted small p-3 text-center w-100 border border-dashed rounded-3">Arraste cursos para cá</div>';
    }

    // Lógica para as opções do Tipo de Usuário baseado em quem está logado
    let htmlTipoOpcoes = '';
    if (admin.tipo === 'ADMIN') {
        htmlTipoOpcoes = `
            <option value="ALUNO" ${usuario.tipo === 'ALUNO' ? 'selected' : ''}>Aluno</option>
            <option value="MENTOR" ${usuario.tipo === 'MENTOR' ? 'selected' : ''}>Mentor</option>
            <option value="ADMIN" ${usuario.tipo === 'ADMIN' ? 'selected' : ''}>Administrador</option>
        `;
    } else {
        // Se for Mentor, esconde as outras opções de cargos e bloqueia visualmente
        htmlTipoOpcoes = `<option value="ALUNO" selected>Aluno</option>`;
    }

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>Editar Usuário - OnStude</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
        <link rel="icon" type="image/x-icon" href="/img/favicon-onstude.ico">
        <link rel="shortcut icon" type="image/x-icon" href="/img/favicon-onstude.ico">
        <style>
            body { background-color: #f8f9fa; margin: 0; overflow-x: hidden; }
            .main-content { height: 100vh; overflow-y: auto; overflow-x: hidden; }
            @media (max-width: 991.98px) {
                .main-content { height: calc(100vh - 60px); }
            }
            
            /* Estilos para o Drag and Drop */
            .cursor-grab { cursor: grab; background-color: white; border: 1px solid #dee2e6 !important; }
            .cursor-grab:active { cursor: grabbing; }
            .sortable-ghost { opacity: 0.4; background-color: #e9ecef; }
            .sortable-drag { box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; cursor: grabbing !important; }
            .container-dnd { min-height: 150px; background-color: #f1f3f5; }
            .border-dashed { border-style: dashed !important; border-width: 2px !important; }
            
            /* Inputs Group - Olho Senha */
            .input-group:focus-within { box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.1); border-radius: 0.375rem; }
            .input-group .form-control:focus { box-shadow: none; border-color: #dee2e6; }
            .input-group .btn:focus { box-shadow: none; border-color: #dee2e6; }
        </style>
    </head>
    <body class="bg-light">
        
        <div id="globalLoader" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: #f8f9fa; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: opacity 0.4s ease;">
            <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem; border-width: 0.3em;">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <h5 class="mt-3 text-secondary fw-bold">Carregando...</h5>
        </div>

        <div class="d-flex flex-column flex-lg-row w-100 h-100">
            
            ${htmlSidebar}

            <div class="flex-grow-1 main-content bg-light">
                <div class="container-fluid p-4 p-md-5">

                    <a href="/admin/usuarios" class="btn btn-sm btn-outline-secondary mb-3 rounded-pill fw-bold px-3">
                        <i class="bi bi-arrow-left me-1"></i> Voltar para Lista
                    </a>

                    <div class="row justify-content-center">
                        <div class="col-xl-10">
                            <div class="card shadow-sm border-0 rounded-4 overflow-hidden">
                                <div class="card-header bg-white py-3 border-bottom-0">
                                    <h5 class="mb-0 fw-bold text-dark"><i class="bi bi-person-gear text-primary me-2"></i>Editar Usuário: ${usuario.nome}</h5>
                                </div>
                                <div class="card-body p-4 p-lg-5">
                                    
                                    <form id="formEditarUsuario" action="/admin/usuarios/${usuario.id}/editar" method="POST" enctype="multipart/form-data">
                                        
                                        <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-info-circle me-2"></i>Informações Principais</h6>
                                        <div class="row g-3 mb-4">
                                            <div class="col-md-8">
                                                <label class="form-label fw-semibold small">Nome Completo</label>
                                                <input type="text" class="form-control bg-light" name="nome" value="${usuario.nome}" required>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small">Tipo de Acesso</label>
                                                <select class="form-select bg-light" name="tipo">
                                                    ${htmlTipoOpcoes}
                                                </select>
                                            </div>
                                            <div class="col-md-5">
                                                <label class="form-label fw-semibold small">E-mail de Login</label>
                                                <input type="email" class="form-control bg-light" name="email" value="${usuario.email}" required>
                                            </div>
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small">Data de Nascimento</label>
                                                <input type="date" class="form-control bg-light" name="data_nascimento" value="${usuario.data_nascimento ? new Date(usuario.data_nascimento).toISOString().substring(0, 10) : ''}">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label fw-semibold small">Status da Conta</label>
                                                <select class="form-select bg-light" name="status">
                                                    <option value="ATIVO" ${usuario.status === 'ATIVO' ? 'selected' : ''}>Ativo</option>
                                                    <option value="BLOQUEADO" ${usuario.status === 'BLOQUEADO' ? 'selected' : ''}>Bloqueado</option>
                                                    <option value="INATIVO" ${usuario.status === 'INATIVO' ? 'selected' : ''}>Inativo</option>
                                                </select>
                                            </div>
                                            
                                            <div class="col-md-6 mt-3">
                                                <label class="form-label fw-semibold small">Nova Senha</label>
                                                <div class="input-group">
                                                    <input type="password" class="form-control bg-light border-end-0" id="nova_senha" name="nova_senha" placeholder="Deixe em branco para manter a atual...">
                                                    <button type="button" class="btn bg-light border border-start-0 text-secondary" onclick="togglePassword('nova_senha', this)" title="Mostrar senha">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            <div class="col-md-6 mt-3">
                                                <label class="form-label fw-semibold small">Confirmar Nova Senha</label>
                                                <div class="input-group">
                                                    <input type="password" class="form-control bg-light border-end-0" id="confirmar_senha" name="confirmar_senha" placeholder="Repita a nova senha...">
                                                    <button type="button" class="btn bg-light border border-start-0 text-secondary" onclick="togglePassword('confirmar_senha', this)" title="Mostrar senha">
                                                        <i class="bi bi-eye"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <hr class="my-5 opacity-25">
                                        
                                        <h6 class="fw-bold text-secondary mb-3"><i class="bi bi-telephone me-2"></i>Contato e Perfil</h6>
                                        <div class="row g-3 mb-4">
                                            <div class="col-md-4">
                                                <label class="form-label fw-semibold small">WhatsApp / Telefone</label>
                                                <input type="tel" class="form-control bg-light" id="telefone" name="telefone" placeholder="(00) 0 0000-0000" value="${usuario.telefone || ''}">
                                            </div>
                                            <div class="col-md-5">
                                                <label class="form-label fw-semibold small">Cidade</label>
                                                <input type="text" class="form-control bg-light" name="cidade" value="${usuario.cidade || ''}">
                                            </div>
                                            <div class="col-md-3">
                                                <label class="form-label fw-semibold small">Estado (UF)</label>
                                                <input type="text" class="form-control bg-light" name="estado" maxlength="2" value="${usuario.estado || ''}">
                                            </div>
                                            <div class="col-md-12 mt-3">
                                                <label class="form-label fw-semibold small">Substituir Foto de Perfil</label>
                                                <input type="hidden" name="foto_atual" value="${usuario.foto_perfil_url || ''}">
                                                ${usuario.foto_perfil_url ? `<p class="small text-success mb-2"><i class="bi bi-check-circle-fill me-1"></i>O usuário já possui uma foto configurada.</p>` : ''}
                                                <input type="file" class="form-control bg-light" name="foto_perfil" accept="image/*">
                                            </div>
                                        </div>

                                        <hr class="my-5 opacity-25">
                                        
                                        <h6 class="fw-bold text-secondary mb-2"><i class="bi bi-play-btn me-2"></i>Gerenciamento de Matrículas</h6>
                                        <p class="small text-muted mb-4">Arraste os cursos da esquerda para a direita para conceder acesso ao aluno. Para cancelar a matrícula, arraste de volta para a esquerda.</p>
                                        
                                        <div class="row g-4 mb-4">
                                            <div class="col-md-6">
                                                <div class="p-3 bg-white border rounded-4 shadow-sm h-100">
                                                    <h6 class="fw-bold text-primary mb-3 d-flex justify-content-between align-items-center">
                                                        Cursos Disponíveis
                                                        <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill"><i class="bi bi-box-arrow-in-right"></i></span>
                                                    </h6>
                                                    <div id="listaDisponiveis" class="list-group container-dnd p-2 rounded-3 border">
                                                        ${htmlDisponiveis}
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-6">
                                                <div class="p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded-4 shadow-sm h-100">
                                                    <h6 class="fw-bold text-dark mb-3 d-flex justify-content-between align-items-center">
                                                        Cursos do Aluno
                                                        <span class="badge bg-success rounded-pill"><i class="bi bi-check-lg"></i> Ativos</span>
                                                    </h6>
                                                    <div id="listaMatriculados" class="list-group container-dnd p-2 rounded-3 border border-white bg-white shadow-sm">
                                                        ${htmlMatriculados}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="hiddenInputsCursos"></div>

                                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-center mt-5 pt-4 border-top">
                                            <button type="button" class="btn btn-outline-danger fw-bold rounded-pill px-4 mb-3 mb-md-0 shadow-sm" onclick="if(confirm('Tem certeza? Se o usuário tiver histórico (certificados ou compras), é mais seguro alterar o Status para INATIVO no topo da página. Confirma a exclusão definitiva?')) { document.getElementById('form-excluir-usuario').submit(); }">
                                                <i class="bi bi-trash3 me-1"></i> Excluir Usuário
                                            </button>
                                            
                                            <button type="submit" class="btn btn-primary btn-lg fw-bold rounded-pill px-5 shadow">
                                                <i class="bi bi-floppy me-2"></i> Salvar Alterações
                                            </button>
                                        </div>
                                    </form>

                                    <form id="form-excluir-usuario" action="/admin/usuarios/${usuario.id}/excluir" method="POST" style="display: none;"></form>
                                
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>

        ${require('./toastProcessamento')()}

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
        
        <script src="/js/toast.js"></script>

        <script>
            // ==========================================
            // LÓGICA DE MOSTRAR/OCULTAR SENHA
            // ==========================================
            window.togglePassword = function(inputId, button) {
                const input = document.getElementById(inputId);
                const icon = button.querySelector('i');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.replace('bi-eye', 'bi-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.replace('bi-eye-slash', 'bi-eye');
                }
            };

            // ==========================================
            // MÁSCARA DE TELEFONE (00) 0 0000-0000
            // ==========================================
            const inputTelefone = document.getElementById('telefone');
            if (inputTelefone) {
                inputTelefone.addEventListener('input', function (e) {
                    let v = e.target.value.replace(/\\D/g, ""); 
                    v = v.substring(0, 11); 
                    if (v.length > 2) { v = '(' + v.substring(0, 2) + ') ' + v.substring(2); }
                    if (v.length > 6) { v = v.substring(0, 6) + ' ' + v.substring(6); }
                    if (v.length > 11) { v = v.substring(0, 11) + '-' + v.substring(11); }
                    e.target.value = v;
                });
                
                // Formata o número automaticamente se ele vier preenchido do banco de dados
                if(inputTelefone.value) {
                    inputTelefone.dispatchEvent(new Event('input'));
                }
            }

            // ==========================================
            // LÓGICA DE ARRASTAR CURSOS E SALVAR (AJAX)
            // ==========================================
            document.addEventListener('DOMContentLoaded', function () {
                const listDisp = document.getElementById('listaDisponiveis');
                const listMatr = document.getElementById('listaMatriculados');

                const sortableOptions = {
                    group: 'sharedCursos', 
                    animation: 150,
                    ghostClass: 'sortable-ghost',
                    dragClass: 'sortable-drag',
                    onAdd: function (evt) {
                        const placeholder = evt.to.querySelector('.placeholder-empty');
                        if (placeholder) { placeholder.remove(); }
                    }
                };

                new Sortable(listDisp, sortableOptions);
                new Sortable(listMatr, sortableOptions);

                // Submissão do Form via AJAX
                document.getElementById('formEditarUsuario').addEventListener('submit', function(e) {
                    e.preventDefault(); // Impede o envio tradicional

                    // Validação de Senha
                    const senha = document.getElementById('nova_senha').value;
                    const confSenha = document.getElementById('confirmar_senha').value;
                    
                    if (senha !== '' && senha !== confSenha) {
                        Toast.error('As senhas não coincidem. Por favor, verifique.');
                        document.getElementById('confirmar_senha').focus();
                        return;
                    }

                    // 1. Gera os inputs ocultos dos cursos arrastados
                    const hiddenContainer = document.getElementById('hiddenInputsCursos');
                    hiddenContainer.innerHTML = '';
                    
                    const cursosAtivos = listMatr.querySelectorAll('.curso-card');
                    cursosAtivos.forEach(card => {
                        const cursoId = card.getAttribute('data-id');
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = 'cursos';
                        input.value = cursoId;
                        hiddenContainer.appendChild(input);
                    });

                    // 2. Animação de Carregamento no Botão
                    const btnSubmit = this.querySelector('button[type="submit"]');
                    const originalHtml = btnSubmit.innerHTML;
                    btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Salvando...';
                    btnSubmit.disabled = true;

                    // 3. Empacota o formulário (incluindo arquivo de imagem e os cursos dinâmicos)
                    const formData = new FormData(this);

                    // 4. Envia via AJAX (Fetch)
                    fetch(this.action, {
                        method: 'POST',
                        body: formData
                    })
                    .then(async res => {
                        const contentType = res.headers.get("content-type");
                        
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            const data = await res.json();
                            if (data.success) {
                                Toast.success(data.message || 'Usuário atualizado com sucesso!');
                                setTimeout(() => window.location.reload(), 1500);
                            } else {
                                Toast.error(data.message || 'Erro ao atualizar usuário.');
                                btnSubmit.innerHTML = originalHtml;
                                btnSubmit.disabled = false;
                            }
                        } else {
                            // Suporte caso a rota backend ainda devolva res.redirect tradicional
                            if (res.redirected) {
                                Toast.success('Usuário atualizado com sucesso!');
                                setTimeout(() => window.location.href = res.url, 1500);
                            } else {
                                Toast.error('Ocorreu um erro inesperado.');
                                btnSubmit.innerHTML = originalHtml;
                                btnSubmit.disabled = false;
                            }
                        }
                    })
                    .catch(err => {
                        console.error('Erro de conexão:', err);
                        Toast.error('Erro de conexão ao salvar alterações.');
                        btnSubmit.innerHTML = originalHtml;
                        btnSubmit.disabled = false;
                    });
                });
            });

            // ==========================================
            // LÓGICA DE LOADING NO CARREGAMENTO
            // ==========================================
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

module.exports = renderEditarUsuarioView;