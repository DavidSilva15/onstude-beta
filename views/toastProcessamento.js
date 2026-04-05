// views/toastProcessamento.js

function renderToastProcessamento() {
    return `
    <div id="dynamicToastContainer" class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 1080;">
    </div>

    <style>
        .toast-stage-item { transition: all 0.3s ease; }
        .toast { transition: opacity 0.3s ease; }
    </style>

    <script>
        window.GerenciadorProcessamento = {
            pollInterval: null,
            tempUploadId: null,
            reloadScheduled: false, // Evita múltiplos reloads se 2 vídeos terminarem ao mesmo tempo
            
            init: function() {
                // Migração de segurança caso o administrador tenha um job antigo na memória
                const oldJob = localStorage.getItem('onstude_active_job');
                if (oldJob) {
                    this.addActiveJob(oldJob);
                    localStorage.removeItem('onstude_active_job');
                }
                
                this.verificarTarefas();
            },

            // --- Lógica de Memória Local (Suporta Múltiplos Jobs) ---
            getActiveJobs: function() {
                try { return JSON.parse(localStorage.getItem('onstude_active_jobs')) || []; }
                catch(e) { return []; }
            },
            
            addActiveJob: function(id) {
                let jobs = this.getActiveJobs();
                if (!jobs.includes(id)) jobs.push(id);
                localStorage.setItem('onstude_active_jobs', JSON.stringify(jobs));
            },
            
            removeActiveJob: function(id) {
                let jobs = this.getActiveJobs();
                jobs = jobs.filter(j => j !== id);
                localStorage.setItem('onstude_active_jobs', JSON.stringify(jobs));
            },

            // --- Geração do HTML do Toast ---
            getToastHTML: function(id) {
                return \`
                <div id="toast_\${id}" class="toast align-items-center text-bg-dark border-0 shadow-lg rounded-4 show mb-3" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
                    <div class="toast-header bg-dark text-white border-secondary border-opacity-25 rounded-top-4">
                        <div class="spinner-border spinner-border-sm text-primary me-2" role="status" id="toastSpinner_\${id}"></div>
                        <i class="bi bi-check-circle-fill text-success me-2 d-none" id="toastCheck_\${id}"></i>
                        <i class="bi bi-x-circle-fill text-danger me-2 d-none" id="toastError_\${id}"></i>
                        <strong class="me-auto" id="toastProcessTitle_\${id}">Processamento em Segundo Plano</strong>
                        <button type="button" class="btn-close btn-close-white" aria-label="Close" onclick="window.GerenciadorProcessamento.fecharToast('\${id}')"></button>
                    </div>
                    <div class="toast-body p-3">
                        <p id="toastProcessMsg_\${id}" class="mb-3 small text-light">Verificando tarefas ativas...</p>
                        <div class="progress mb-2 bg-secondary bg-opacity-25 rounded-pill" style="height: 6px;">
                            <div id="toastProgressBar_\${id}" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%;"></div>
                        </div>
                        
                        <div id="toastStages_\${id}" class="d-flex justify-content-between mt-3 px-1 d-none">
                            <div id="t_stage_up_\${id}" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-cloud-arrow-up mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">Upload</span></div>
                            <div id="t_stage_360_\${id}" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">360p</span></div>
                            <div id="t_stage_480_\${id}" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">480p</span></div>
                            <div id="t_stage_720_\${id}" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">720p</span></div>
                        </div>
                    </div>
                </div>\`;
            },

            fecharToast: function(id) {
                const el = document.getElementById('toast_' + id);
                if(el) {
                    el.classList.remove('show');
                    setTimeout(() => el.remove(), 300); // Aguarda animação de opacidade para remover do DOM
                }
            },

            // --- Lógica de Upload e Sincronização ---
            iniciarUpload: function(hasVideo) {
                this.tempUploadId = 'TEMP_UPLOAD_' + Date.now(); // ID temporário enquanto o backend não responde
                document.getElementById('dynamicToastContainer').insertAdjacentHTML('beforeend', this.getToastHTML(this.tempUploadId));
                
                document.getElementById('toastProcessTitle_' + this.tempUploadId).innerText = "Enviando Arquivos...";
                document.getElementById('toastProcessTitle_' + this.tempUploadId).classList.remove('text-success', 'text-danger');
                document.getElementById('toastProcessMsg_' + this.tempUploadId).innerHTML = '<strong class="text-white">Aguarde.</strong> Por favor, não feche a página até o upload terminar.';
                
                if (hasVideo) document.getElementById('toastStages_' + this.tempUploadId).classList.remove('d-none');
            },

            atualizarProgressoUpload: function(percent) {
                if (!this.tempUploadId) return;
                const progressBar = document.getElementById('toastProgressBar_' + this.tempUploadId);
                if (progressBar) progressBar.style.width = percent + '%';
                
                if (percent >= 100) this.atualizarStatusEtapa(this.tempUploadId, 'up', 'done', 'Upload');
            },

            registrarTarefaBackend: function(jobId) {
                // Se existe um toast temporário de upload, substitui o ID dele pelo JobID real que o Backend enviou
                if (this.tempUploadId) {
                    const oldToast = document.getElementById('toast_' + this.tempUploadId);
                    if (oldToast) {
                        oldToast.outerHTML = oldToast.outerHTML.replaceAll(this.tempUploadId, jobId);
                    }
                    this.tempUploadId = null;
                } else {
                    // Se não existia (caso seja acionado externamente), cria um novo
                    if (!document.getElementById('toast_' + jobId)) {
                        document.getElementById('dynamicToastContainer').insertAdjacentHTML('beforeend', this.getToastHTML(jobId));
                    }
                }

                this.addActiveJob(jobId);
                this.iniciarPolling();
            },

            verificarTarefas: function() {
                const jobs = this.getActiveJobs();
                if (jobs.length > 0) {
                    jobs.forEach(jobId => {
                        if (!document.getElementById('toast_' + jobId)) {
                            document.getElementById('dynamicToastContainer').insertAdjacentHTML('beforeend', this.getToastHTML(jobId));
                        }
                    });
                    this.iniciarPolling();
                }
            },

            iniciarPolling: function() {
                if (this.pollInterval) clearInterval(this.pollInterval);
                
                this.pollInterval = setInterval(() => {
                    const jobs = this.getActiveJobs();
                    if (jobs.length === 0) { 
                        clearInterval(this.pollInterval); 
                        return; 
                    }

                    jobs.forEach(jobId => {
                        fetch('/api/processamento/status/' + jobId)
                            .then(res => res.json())
                            .then(data => {
                                if (data.success) {
                                    this.renderizarStatusReal(jobId, data.job);
                                    if (data.job.status === 'completed' || data.job.status === 'error') {
                                        this.removeActiveJob(jobId);
                                    }
                                } else {
                                    // Job não existe mais no servidor
                                    this.removeActiveJob(jobId);
                                    this.fecharToast(jobId);
                                }
                            })
                            .catch(err => console.error('Erro no polling do Job ' + jobId + ':', err));
                    });
                }, 1500); 
            },

            renderizarStatusReal: function(jobId, job) {
                const stagesEl = document.getElementById('toastStages_' + jobId);
                if(!stagesEl) return; // Toast pode ter sido fechado pelo usuário

                stagesEl.classList.remove('d-none');
                document.getElementById('toastProgressBar_' + jobId).style.width = '100%';
                this.atualizarStatusEtapa(jobId, 'up', 'done', 'Upload');

                if (job.status === 'processing') {
                    document.getElementById('toastProcessTitle_' + jobId).innerText = "Convertendo aula";
                    document.getElementById('toastProcessMsg_' + jobId).innerHTML = '<strong class="text-info"></strong> Processando em segundo plano.';
                    
                    ['360', '480', '720'].forEach(res => {
                        const step = job.steps[res + 'p'];
                        if (step === 'done') this.atualizarStatusEtapa(jobId, res, 'done', res + 'p');
                        else if (step === 'pending') this.atualizarStatusEtapa(jobId, res, 'pending', res + 'p');
                        else this.atualizarStatusEtapa(jobId, res, step, res + 'p'); // Envia a % em tempo real
                    });
                    
                } else if (job.status === 'completed') {
                    document.getElementById('toastProcessTitle_' + jobId).innerText = "Aula Publicada!";
                    document.getElementById('toastProcessTitle_' + jobId).classList.add('text-success');
                    document.getElementById('toastSpinner_' + jobId).classList.add('d-none');
                    document.getElementById('toastCheck_' + jobId).classList.remove('d-none');
                    document.getElementById('toastProgressBar_' + jobId).classList.replace('bg-primary', 'bg-success');
                    document.getElementById('toastProcessMsg_' + jobId).innerHTML = '<strong class="text-white">Upload concluído!</strong> A aula já está disponível para os alunos.';
                    
                    ['360', '480', '720'].forEach(res => this.atualizarStatusEtapa(jobId, res, 'done', res + 'p'));
                    
                    setTimeout(() => this.fecharToast(jobId), 8000);

                    // ========================================================
                    // Redirecionamento ou Reload automático
                    // ========================================================
                    if (!this.reloadScheduled) {
                        this.reloadScheduled = true;
                        setTimeout(() => {
                            const urlAtual = window.location.pathname;
                            if (urlAtual.startsWith('/admin/cursos')) {
                                window.location.reload();
                            } else {
                                window.location.href = '/admin/cursos';
                            }
                        }, 2000);
                    }

                } else if (job.status === 'error') {
                    document.getElementById('toastProcessTitle_' + jobId).innerText = "Erro na Conversão";
                    document.getElementById('toastProcessTitle_' + jobId).classList.add('text-danger');
                    document.getElementById('toastSpinner_' + jobId).classList.add('d-none');
                    document.getElementById('toastError_' + jobId).classList.remove('d-none');
                    document.getElementById('toastProcessMsg_' + jobId).innerHTML = '<strong class="text-white">Ocorreu uma falha ao processar o vídeo.</strong> Consulte os logs do servidor.';
                    document.getElementById('toastProgressBar_' + jobId).classList.replace('bg-primary', 'bg-danger');
                }
            },

            atualizarStatusEtapa: function(jobId, stageId, status, label) {
                const elToast = document.getElementById('t_stage_' + stageId + '_' + jobId);
                if (!elToast) return;
                
                let contentHTML = '';
                let colorClass = '';

                if (status === 'done') {
                    contentHTML = '<i class="bi bi-check-circle-fill text-success mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">' + label + '</span>';
                    colorClass = 'text-success';
                } else if (status === 'pending') {
                    contentHTML = '<i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">' + label + '</span>';
                    colorClass = 'text-white-50';
                } else {
                    // É um número (progresso do FFMPEG de 0 a 100)
                    contentHTML = '<div class="d-flex flex-column justify-content-center h-100">' + 
                                  '<span style="font-size: 0.8rem; font-weight: bold; color: #ffc107;" class="mb-0">' + status + '%</span>' +
                                  '<span style="font-size: 0.65rem; font-weight: bold;">' + label + '</span></div>';
                    colorClass = 'text-warning';
                }
                
                elToast.innerHTML = contentHTML;
                elToast.className = 'text-center toast-stage-item ' + colorClass;
            }
        };

        document.addEventListener('DOMContentLoaded', () => { window.GerenciadorProcessamento.init(); });
    </script>
    `;
}

module.exports = renderToastProcessamento;