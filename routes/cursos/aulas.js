const express = require('express');
const router = express.Router();
const db = require('../../db');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const { verificarAdmin } = require('../../middlewares/authMiddleware');
const { uploadTemp } = require('../../config/uploadConfig');

const renderNovaAulaView = require('../../views/novaAulaView');
const renderEditarAulaView = require('../../views/editarAulaView');

// Função utilitária necessária para criar a pasta da aula
function sanitizeFolderName(name) {
    return name.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

//------------------------------------------------------------------------------ROTAS PARA GERENCIAMENTO DE AULAS------------------------------------------------------------------------------
//FORMULÁRIO PARA CRIAR NOVA AULA
router.get('/admin/modulos/:moduloId/aulas/nova', verificarAdmin, async (req, res) => {
    const moduloId = req.params.moduloId;

    try {
        // 1. Busca os dados do módulo e do curso correspondente
        const [modulos] = await db.execute(`
            SELECT m.*, c.codigo_unico, c.id as curso_id 
            FROM modulos m 
            JOIN cursos c ON m.curso_id = c.id 
            WHERE m.id = ?
        `, [moduloId]);

        if (modulos.length === 0) {
            return res.status(404).send('Módulo não encontrado.');
        }

        const modulo = modulos[0];
        const curso = { id: modulo.curso_id, codigo_unico: modulo.codigo_unico };

        // 2. Descobre a próxima ordem da aula neste módulo
        const [resultadoOrdem] = await db.execute('SELECT MAX(ordem) as maxOrdem FROM aulas WHERE modulo_id = ?', [moduloId]);
        const proximaOrdem = (resultadoOrdem[0].maxOrdem || 0) + 1;

        res.send(renderNovaAulaView(req.session.usuario, curso, modulo, proximaOrdem));

    } catch (error) {
        console.error('Erro ao carregar nova aula:', error);
        res.status(500).send('Erro interno.');
    }
});

//CRIAR NOVA AULA
router.post('/admin/modulos/:moduloId/aulas/nova', verificarAdmin, uploadTemp.fields([
    { name: 'video', maxCount: 1 },
    { name: 'avaliacao', maxCount: 1 },
    { name: 'apostila', maxCount: 20 },
    { name: 'arquivo_adicional', maxCount: 1 }
]), async (req, res) => {

    const moduloId = req.params.moduloId;
    const { titulo, ordem, duracao_segundos, descricao } = req.body;

    try {
        // Busca qual o curso ID e o Título para criar a pasta da aula
        const [moduloData] = await db.execute(
            'SELECT m.curso_id, c.titulo as curso_titulo FROM modulos m JOIN cursos c ON m.curso_id = c.id WHERE m.id = ?',
            [moduloId]
        );
        const cursoIdParaRedirect = moduloData[0].curso_id;
        const cursoTitulo = moduloData[0].curso_titulo;

        // Montagem dos nomes das pastas (Ex: 15_curso-de-excel / aula1(introducao) )
        const folderCurso = `${cursoIdParaRedirect}_${sanitizeFolderName(cursoTitulo)}`;
        const folderAula = `aula${ordem}(${sanitizeFolderName(titulo)})`;

        const baseTargetDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'cursos', folderCurso, folderAula);
        const basePathPublic = `/uploads/cursos/${folderCurso}/${folderAula}`;

        const dirs = {
            root: baseTargetDir,
            atividade: path.join(baseTargetDir, 'atividade'),
            avaliacao: path.join(baseTargetDir, 'avaliacao'),
            material: path.join(baseTargetDir, 'material')
        };

        // Cria a estrutura de pastas automaticamente
        Object.values(dirs).forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });

        // 1. Gera ID único e inicializa a memória do Job
        const jobId = 'job_' + Date.now();

        if (!global.tarefasProcessamento) global.tarefasProcessamento = {};

        global.tarefasProcessamento[jobId] = {
            status: 'processing',
            steps: { '360p': 'pending', '480p': 'pending', '720p': 'pending' }
        };

        // 2. Libera o Front-End IMEDIATAMENTE e Inserimos a aula ANTES para pegar ID
        const [resultadoAula] = await db.execute(
            `INSERT INTO aulas (modulo_id, titulo, ordem, descricao, duracao_segundos) 
             VALUES (?, ?, ?, ?, ?)`,
            [moduloId, titulo, parseInt(ordem), descricao || null, duracao_segundos ? parseInt(duracao_segundos) : 0]
        );
        const aulaId = resultadoAula.insertId;

        res.json({
            success: true,
            jobId: jobId,
            redirectUrl: `/admin/cursos/${cursoIdParaRedirect}`
        });

        // ==========================================
        // 3. BACKGROUND JOB (Processamento Assíncrono)
        // ==========================================
        (async () => {
            try {
                const arquivos = req.files || {};

                // --- MATERIAL ADICIONAL ---
                let arquivoAdicionalPublicPath = null;
                if (arquivos['arquivo_adicional']) {
                    const file = arquivos['arquivo_adicional'][0];
                    const newPath = path.join(dirs.material, file.filename);
                    fs.renameSync(file.path, newPath);
                    arquivoAdicionalPublicPath = `${basePathPublic}/material/${file.filename}`;
                }

                // --- AVALIAÇÃO JSON ---
                let avaliacaoPublicPath = null;
                if (arquivos['avaliacao']) {
                    const file = arquivos['avaliacao'][0];
                    const newPath = path.join(dirs.avaliacao, 'avaliacao.json');
                    fs.renameSync(file.path, newPath);
                    avaliacaoPublicPath = `${basePathPublic}/avaliacao/avaliacao.json`;
                }

                // --- APOSTILA (ATIVIDADE PRÁTICA 1.png, 2.png...) ---
                let apostilaImagensMovidas = [];
                if (arquivos['apostila']) {
                    arquivos['apostila'].forEach((file, index) => {
                        const ext = path.extname(file.originalname); // Mantém .png ou .jpg
                        const nomeArquivo = `${index + 1}${ext}`;
                        const newPath = path.join(dirs.atividade, nomeArquivo);
                        fs.renameSync(file.path, newPath);
                        apostilaImagensMovidas.push(`${basePathPublic}/atividade/${nomeArquivo}`);
                    });
                }

                // ==========================================
                // LÓGICA DO VÍDEO E FFMPEG
                // ==========================================
                const videoFileOriginal = arquivos['video'] ? arquivos['video'][0] : null;

                let duracaoFinal = duracao_segundos ? parseInt(duracao_segundos) : 0;
                let thumbPathPublic = null;
                let videoPathPublic = null;
                let video_360p_path = null;
                let video_480p_path = null;
                let video_720p_path = null;

                if (videoFileOriginal) {
                    const videoExt = path.extname(videoFileOriginal.originalname);
                    const nomeVideo = `video_aula${ordem}${videoExt}`;
                    const videoPathPhysical = path.join(dirs.root, nomeVideo);

                    fs.renameSync(videoFileOriginal.path, videoPathPhysical);
                    videoPathPublic = `${basePathPublic}/${nomeVideo}`;

                    const thumbFilename = `thumb_aula${ordem}.jpg`;
                    let alturaOriginal = 1080;

                    // A. Extração da duração real e Resolução via ffprobe
                    const metadata = await new Promise((resolve, reject) => {
                        ffmpeg.ffprobe(videoPathPhysical, (err, data) => {
                            if (err) return reject(err);
                            resolve(data);
                        });
                    });

                    if (metadata && metadata.format && metadata.format.duration) {
                        duracaoFinal = Math.round(metadata.format.duration);
                    }

                    if (metadata && metadata.streams) {
                        const videoStream = metadata.streams.find(s => s.codec_type === 'video');
                        if (videoStream && videoStream.height) {
                            alturaOriginal = videoStream.height;
                        }
                    }

                    // B. LÓGICA DA THUMB ALEATÓRIA INTELIGENTE
                    let segundoAleatorio = 2;
                    if (duracaoFinal > 10) {
                        const min = Math.floor(duracaoFinal * 0.10);
                        const max = Math.floor(duracaoFinal * 0.90);
                        segundoAleatorio = Math.floor(Math.random() * (max - min + 1)) + min;
                    } else if (duracaoFinal > 0) {
                        segundoAleatorio = Math.floor(Math.random() * duracaoFinal);
                    }

                    await new Promise((resolve) => {
                        ffmpeg(videoPathPhysical)
                            .on('end', () => {
                                thumbPathPublic = `${basePathPublic}/${thumbFilename}`;
                                resolve();
                            })
                            .on('error', (err) => {
                                console.error(`[Job ${jobId}] Erro ao gerar thumbnail:`, err.message);
                                resolve();
                            })
                            .screenshots({
                                timestamps: [segundoAleatorio],
                                filename: thumbFilename,
                                folder: dirs.root,
                                size: '400x225'
                            });
                    });

                    // C. LÓGICA DE CONVERSÃO FFMPEG
                    const converterVideoComProgresso = (input, resolucao) => {
                        return new Promise((resolve, reject) => {
                            const outputFilename = `video_aula${ordem}_${resolucao}p.mp4`;
                            const outputPhysical = path.join(dirs.root, outputFilename);

                            global.tarefasProcessamento[jobId].steps[`${resolucao}p`] = 0;

                            ffmpeg(input)
                                .output(outputPhysical)
                                .videoCodec('libx264')
                                .audioCodec('aac')
                                .size(`?x${resolucao}`)
                                .on('progress', (progress) => {
                                    if (progress.percent) {
                                        let p = Math.round(progress.percent);
                                        if (p > 100) p = 100;
                                        global.tarefasProcessamento[jobId].steps[`${resolucao}p`] = p;
                                    }
                                })
                                .on('end', () => {
                                    global.tarefasProcessamento[jobId].steps[`${resolucao}p`] = 'done';
                                    resolve(`${basePathPublic}/${outputFilename}`);
                                })
                                .on('error', (err) => {
                                    console.error(`[Job ${jobId}] Erro conversão ${resolucao}p:`, err.message);
                                    reject(err);
                                })
                                .run();
                        });
                    };

                    let promessasConversao = [];

                    if (alturaOriginal > 360) {
                        promessasConversao.push(converterVideoComProgresso(videoPathPhysical, 360).then(url => video_360p_path = url));
                    } else { global.tarefasProcessamento[jobId].steps['360p'] = 'done'; }

                    if (alturaOriginal > 480) {
                        promessasConversao.push(converterVideoComProgresso(videoPathPhysical, 480).then(url => video_480p_path = url));
                    } else { global.tarefasProcessamento[jobId].steps['480p'] = 'done'; }

                    if (alturaOriginal > 720) {
                        promessasConversao.push(converterVideoComProgresso(videoPathPhysical, 720).then(url => video_720p_path = url));
                    } else { global.tarefasProcessamento[jobId].steps['720p'] = 'done'; }

                    await Promise.all(promessasConversao);
                }

                // ==========================================
                // 4. ATUALIZANDO BASE DE DADOS
                // ==========================================
                await db.execute(
                    `UPDATE aulas SET duracao_segundos = ?, video_thumb_path = ?, arquivo_adicional_url = ? WHERE id = ?`,
                    [duracaoFinal, thumbPathPublic, arquivoAdicionalPublicPath, aulaId]
                );

                await db.execute(
                    `INSERT INTO aula_conteudos (aula_id, video_path, video_360p_path, video_480p_path, video_720p_path, avaliacao_json_path) 
                     VALUES (?, ?, ?, ?, ?, ?)`,
                    [aulaId, videoPathPublic, video_360p_path, video_480p_path, video_720p_path, avaliacaoPublicPath]
                );

                // Processa imagens da apostila/atividade
                if (apostilaImagensMovidas.length > 0) {
                    for (let i = 0; i < apostilaImagensMovidas.length; i++) {
                        await db.execute(
                            `INSERT INTO apostila_imagens (aula_id, imagem_path, ordem) VALUES (?, ?, ?)`,
                            [aulaId, apostilaImagensMovidas[i], i + 1]
                        );
                    }
                }

                global.tarefasProcessamento[jobId].status = 'completed';
                console.log(`[Job ${jobId}] Aula salva e publicada com sucesso!`);

            } catch (jobError) {
                console.error(`[Job ${jobId}] FALHA CRÍTICA NO PROCESSAMENTO:`, jobError);
                global.tarefasProcessamento[jobId].status = 'error';
            }
        })();

    } catch (error) {
        console.error('Erro geral ao inicializar o job da aula:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao iniciar o processamento da aula.' });
    }
});

//FORMULÁRIO PARA EDITAR AULA EXISTENTE
router.get('/admin/aulas/:id/editar', verificarAdmin, async (req, res) => {
    const aulaId = req.params.id;

    try {
        // 1. Busca a aula e a hierarquia (modulo -> curso)
        const [aulas] = await db.execute(`
            SELECT a.*, m.titulo as modulo_titulo, m.curso_id, c.codigo_unico 
            FROM aulas a
            JOIN modulos m ON a.modulo_id = m.id
            JOIN cursos c ON m.curso_id = c.id
            WHERE a.id = ?
        `, [aulaId]);

        if (aulas.length === 0) return res.status(404).send('Aula não encontrada.');
        const aula = aulas[0];

        const curso = { id: aula.curso_id, codigo_unico: aula.codigo_unico };
        const modulo = { titulo: aula.modulo_titulo };

        // 2. Busca os conteúdos atuais da aula (vídeo e json)
        const [conteudosQuery] = await db.execute('SELECT * FROM aula_conteudos WHERE aula_id = ?', [aulaId]);
        const conteudos = conteudosQuery[0] || {};

        res.send(renderEditarAulaView(req.session.usuario, curso, modulo, aula, conteudos));

    } catch (error) {
        console.error('Erro ao carregar edição de aula:', error);
        res.status(500).send('Erro interno.');
    }
});

//EDITAR AULA EXISTENTE
router.post('/admin/aulas/:id/editar', verificarAdmin, uploadTemp.fields([
    { name: 'video', maxCount: 1 },
    { name: 'avaliacao', maxCount: 1 },
    { name: 'apostila', maxCount: 20 },
    { name: 'arquivo_adicional', maxCount: 1 }
]), async (req, res) => {
    const aulaId = req.params.id;
    const { titulo, ordem, duracao_segundos, descricao, video_atual, avaliacao_atual, arquivo_adicional_atual } = req.body;
    const adminId = req.session.usuario.id;

    try {
        const [aulaQuery] = await db.execute(`
            SELECT m.curso_id, c.titulo as curso_titulo 
            FROM aulas a 
            JOIN modulos m ON a.modulo_id = m.id 
            JOIN cursos c ON m.curso_id = c.id 
            WHERE a.id = ?
        `, [aulaId]);

        const cursoId = aulaQuery[0].curso_id;
        const cursoTitulo = aulaQuery[0].curso_titulo;

        // Montagem das Pastas Base
        const folderCurso = `${cursoId}_${sanitizeFolderName(cursoTitulo)}`;
        const folderAula = `aula${ordem}(${sanitizeFolderName(titulo)})`;

        const baseTargetDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'cursos', folderCurso, folderAula);
        const basePathPublic = `/uploads/cursos/${folderCurso}/${folderAula}`;

        const dirs = {
            root: baseTargetDir,
            atividade: path.join(baseTargetDir, 'atividade'),
            avaliacao: path.join(baseTargetDir, 'avaliacao'),
            material: path.join(baseTargetDir, 'material')
        };

        Object.values(dirs).forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });

        const arquivos = req.files || {};

        // --- ARQUIVO ADICIONAL ---
        let arquivoAdicionalPath = arquivo_adicional_atual || null;
        if (arquivos['arquivo_adicional']) {
            const file = arquivos['arquivo_adicional'][0];
            const newPath = path.join(dirs.material, file.filename);
            fs.renameSync(file.path, newPath);
            arquivoAdicionalPath = `${basePathPublic}/material/${file.filename}`;
        }

        // --- AVALIAÇÃO JSON ---
        let avaliacaoPath = avaliacao_atual || null;
        if (arquivos['avaliacao']) {
            const file = arquivos['avaliacao'][0];
            const newPath = path.join(dirs.avaliacao, 'avaliacao.json');
            fs.renameSync(file.path, newPath);
            avaliacaoPath = `${basePathPublic}/avaliacao/avaliacao.json`;
        }

        // --- VÍDEO PRINCIPAL ---
        let videoPath = video_atual || null;
        if (arquivos['video']) {
            const file = arquivos['video'][0];
            const ext = path.extname(file.originalname);
            const nomeVideo = `video_aula${ordem}${ext}`;
            const newPath = path.join(dirs.root, nomeVideo);
            fs.renameSync(file.path, newPath);
            videoPath = `${basePathPublic}/${nomeVideo}`;
        }

        await db.execute(
            `UPDATE aulas SET titulo = ?, ordem = ?, descricao = ?, duracao_segundos = ?, arquivo_adicional_url = ? WHERE id = ?`,
            [titulo, parseInt(ordem), descricao || null, duracao_segundos ? parseInt(duracao_segundos) : null, arquivoAdicionalPath, aulaId]
        );

        await db.execute(
            `UPDATE aula_conteudos SET video_path = ?, avaliacao_json_path = ? WHERE aula_id = ?`,
            [videoPath, avaliacaoPath, aulaId]
        );

        // --- APOSTILA (Atividade) ---
        if (arquivos['apostila'] && arquivos['apostila'].length > 0) {
            await db.execute('DELETE FROM apostila_imagens WHERE aula_id = ?', [aulaId]);

            let ordemImagem = 1;
            for (const img of arquivos['apostila']) {
                const ext = path.extname(img.originalname);
                const nomeArquivo = `${ordemImagem}${ext}`;
                const newPath = path.join(dirs.atividade, nomeArquivo);
                fs.renameSync(img.path, newPath);

                await db.execute(
                    `INSERT INTO apostila_imagens (aula_id, imagem_path, ordem) VALUES (?, ?, ?)`,
                    [aulaId, `${basePathPublic}/atividade/${nomeArquivo}`, ordemImagem]
                );
                ordemImagem++;
            }
        }

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'EDITAR_AULA', 'aulas', ?, ?)`,
            [adminId, aulaId, req.ip || req.socket.remoteAddress]
        );

        res.redirect(`/admin/cursos/${cursoId}`);

    } catch (error) {
        console.error('Erro ao editar aula:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.send('<h2>Erro: Já existe uma aula com esta ordem neste módulo.</h2><a href="javascript:history.back()">Voltar</a>');
        }
        res.status(500).send('Erro ao atualizar a aula.');
    }
});

//EXCLUIR AULA
router.post('/admin/aulas/:id/excluir', verificarAdmin, async (req, res) => {
    const aulaId = req.params.id;
    const adminId = req.session.usuario.id;

    try {
        // Descobre o curso_id através da relação Aula -> Módulo -> Curso
        const [aulaQuery] = await db.execute(`
            SELECT m.curso_id FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE a.id = ?
        `, [aulaId]);
        if (aulaQuery.length === 0) return res.redirect('/admin');
        const cursoId = aulaQuery[0].curso_id;

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'EXCLUIR_AULA', 'aulas', ?, ?)`,
            [adminId, aulaId, req.ip || req.socket.remoteAddress]
        );

        // Deleta a aula (aula_conteudos e apostila_imagens caem em cascata)
        await db.execute('DELETE FROM aulas WHERE id = ?', [aulaId]);

        res.redirect(`/admin/cursos/${cursoId}`);
    } catch (error) {
        console.error('Erro ao excluir aula:', error);
        res.status(500).send('Erro interno ao tentar excluir a aula.');
    }
});

module.exports = router;