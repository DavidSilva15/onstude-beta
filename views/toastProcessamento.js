// views/toastProcessamento.js

function renderToastProcessamento() {
    return `
    <div class="toast-container position-fixed bottom-0 end-0 p-4" style="z-index: 1080;">
        <div id="universalProcessingToast" class="toast align-items-center text-bg-dark border-0 shadow-lg rounded-4" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="false">
            <div class="toast-header bg-dark text-white border-secondary border-opacity-25 rounded-top-4">
                <div class="spinner-border spinner-border-sm text-primary me-2" role="status" id="toastSpinner"></div>
                <i class="bi bi-check-circle-fill text-success me-2 d-none" id="toastCheck"></i>
                <i class="bi bi-x-circle-fill text-danger me-2 d-none" id="toastError"></i>
                <strong class="me-auto" id="toastProcessTitle">Processamento em Segundo Plano</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close" onclick="ocultarToastProcessamento()"></button>
            </div>
            <div class="toast-body p-3">
                <p id="toastProcessMsg" class="mb-3 small text-light">Verificando tarefas ativas...</p>
                <div class="progress mb-2 bg-secondary bg-opacity-25 rounded-pill" style="height: 6px;">
                    <div id="toastProgressBar" class="progress-bar progress-bar-striped progress-bar-animated bg-primary" role="progressbar" style="width: 0%;"></div>
                </div>
                
                <div id="toastStages" class="d-flex justify-content-between mt-3 px-1 d-none">
                    <div id="t_stage_up" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-cloud-arrow-up mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">Upload</span></div>
                    <div id="t_stage_360" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">360p</span></div>
                    <div id="t_stage_480" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">480p</span></div>
                    <div id="t_stage_720" class="text-center text-white-50 toast-stage-item" style="width: 25%;"><i class="bi bi-hourglass mb-1 fs-5 d-block"></i><span style="font-size: 0.65rem; font-weight: bold;">720p</span></div>
                </div>
            </div>
        </div>
    </div>

    <style>
        .toast-stage-item { transition: all 0.3s ease; }
    </style>

    <script>
        window.GerenciadorProcessamento = {
            toastEl: null,
            toast: null,
            pollInterval: null,
            
            init: function() {
                this.toastEl = document.getElementById('universalProcessingToast');
                this.verificarTarefas();
            },

            show: function() {
                if(!this.toast) this.toast = new bootstrap.Toast(this.toastEl);
                this.toast.show();
            },

            hide: function() {
                if(this.toast) this.toast.hide();
            },

            // Chamado pela página de Upload enquanto envia os dados pro Backend
            iniciarUpload: function(hasVideo) {
                this.show();
                document.getElementById('toastProcessTitle').innerText = "Enviando Arquivos...";
                document.getElementById('toastProcessTitle').classList.remove('text-success', 'text-danger');
                document.getElementById('toastProcessMsg').innerHTML = '<strong class="text-white">Aguarde.</strong> Por favor, não feche a página até o upload terminar.';
                if (hasVideo) document.getElementById('toastStages').classList.remove('d-none');
            },

            atualizarProgressoUpload: function(percent) {
                document.getElementById('toastProgressBar').style.width = percent + '%';
                if (percent >= 100) this.atualizarStatusEtapa('up', 'done', 'Upload');
            },

            // Salva o Job ID e começa a perguntar ao servidor pelo status da conversão (Polling)
            registrarTarefaBackend: function(jobId) {
                localStorage.setItem('onstude_active_job', jobId);
                this.iniciarPolling();
            },

            verificarTarefas: function() {
                const activeJob = localStorage.getItem('onstude_active_job');
                if (activeJob) {
                    this.show();
                    this.iniciarPolling();
                }
            },

            iniciarPolling: function() {
                if(this.pollInterval) clearInterval(this.pollInterval);
                
                this.pollInterval = setInterval(() => {
                    const jobId = localStorage.getItem('onstude_active_job');
                    if(!jobId) { clearInterval(this.pollInterval); return; }

                    fetch('/api/processamento/status/' + jobId)
                        .then(res => res.json())
                        .then(data => {
                            if (data.success) {
                                this.renderizarStatusReal(data.job);
                                if (data.job.status === 'completed' || data.job.status === 'error') {
                                    clearInterval(this.pollInterval);
                                    localStorage.removeItem('onstude_active_job');
                                }
                            } else {
                                clearInterval(this.pollInterval);
                                localStorage.removeItem('onstude_active_job');
                                this.hide();
                            }
                        })
                        .catch(err => console.error('Erro no polling:', err));
                }, 1500); // Pergunta ao backend a cada 1.5s
            },

            renderizarStatusReal: function(job) {
                document.getElementById('toastStages').classList.remove('d-none');
                document.getElementById('toastProgressBar').style.width = '100%';
                this.atualizarStatusEtapa('up', 'done', 'Upload');

                if (job.status === 'processing') {
                    document.getElementById('toastProcessTitle').innerText = "Convertendo aula";
                    document.getElementById('toastProcessMsg').innerHTML = '<strong class="text-info"></strong> Convertendo aula.';
                    
                    ['360', '480', '720'].forEach(res => {
                        const step = job.steps[res + 'p'];
                        if (step === 'done') this.atualizarStatusEtapa(res, 'done', res + 'p');
                        else if (step === 'pending') this.atualizarStatusEtapa(res, 'pending', res + 'p');
                        else this.atualizarStatusEtapa(res, step, res + 'p'); // Envia a % em tempo real
                    });
                } else if (job.status === 'completed') {
                    document.getElementById('toastProcessTitle').innerText = "Aula Publicada!";
                    document.getElementById('toastProcessTitle').classList.add('text-success');
                    document.getElementById('toastSpinner').classList.add('d-none');
                    document.getElementById('toastCheck').classList.remove('d-none');
                    document.getElementById('toastProgressBar').classList.replace('bg-primary', 'bg-success');
                    document.getElementById('toastProcessMsg').innerHTML = '<strong class="text-white">Upload concluído!</strong> Aula já está disponível para os alunos.';
                    
                    ['360', '480', '720'].forEach(res => this.atualizarStatusEtapa(res, 'done', res + 'p'));
                    setTimeout(() => this.hide(), 8000);
                } else if (job.status === 'error') {
                    document.getElementById('toastProcessTitle').innerText = "Erro na Conversão";
                    document.getElementById('toastProcessTitle').classList.add('text-danger');
                    document.getElementById('toastSpinner').classList.add('d-none');
                    document.getElementById('toastError').classList.remove('d-none');
                    document.getElementById('toastProcessMsg').innerHTML = '<strong class="text-white">Ocorreu uma falha ao processar o vídeo.</strong> Consulte os logs do servidor.';
                    document.getElementById('toastProgressBar').classList.replace('bg-primary', 'bg-danger');
                }
            },

            atualizarStatusEtapa: function(stageId, status, label) {
                const elToast = document.getElementById('t_stage_' + stageId);
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

        window.ocultarToastProcessamento = function() { window.GerenciadorProcessamento.hide(); };
        document.addEventListener('DOMContentLoaded', () => { window.GerenciadorProcessamento.init(); });
    </script>
    `;
}

module.exports = renderToastProcessamento;