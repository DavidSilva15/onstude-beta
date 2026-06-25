// routes/alunoSalaAula.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const PDFDocument = require('pdfkit');

// Middlewares
const { verificarAluno } = require('../../middlewares/authMiddleware');

// Importação das Views
const renderAlunoSalaAulaView = require('../../views/alunoSalaAulaView');

//------------------------------------------------------------------------------ROTAS DA SALA DE AULA------------------------------------------------------------------------------
//SALA DE AULA
router.get(['/aluno/cursos/:cursoId/aula', '/aluno/cursos/:cursoId/aula/:aulaId'], verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const cursoId = req.params.cursoId;
    let aulaParamId = req.params.aulaId;

    try {
        // 1. Verifica a Matrícula
        const [matriculas] = await db.execute(
            'SELECT id, status FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")',
            [alunoId, cursoId]
        );

        if (matriculas.length === 0) {
            return res.status(403).send('Você não tem acesso a este curso.');
        }
        const matriculaId = matriculas[0].id;

        const [cursos] = await db.execute('SELECT id, titulo, codigo_unico FROM cursos WHERE id = ?', [cursoId]);
        const curso = cursos[0];

        const [modulos] = await db.execute('SELECT * FROM modulos WHERE curso_id = ? ORDER BY ordem ASC', [cursoId]);

        // 2. Busca Aulas, Progresso, Nota Máxima, Thumb Real e Tempo Assistido
        const [aulas] = await db.execute(`
            SELECT 
                a.*, 
                m.ordem as mod_ordem, 
                pa.status as progresso_status, 
                pa.progresso_percentual,
                pa.tempo_assistido,
                (SELECT MAX(nota) FROM avaliacao_tentativas at WHERE at.aula_id = a.id AND at.matricula_id = ?) AS nota_avaliacao
            FROM aulas a 
            JOIN modulos m ON a.modulo_id = m.id 
            LEFT JOIN progresso_aula pa ON pa.aula_id = a.id AND pa.matricula_id = ?
            WHERE m.curso_id = ? 
            ORDER BY m.ordem ASC, a.ordem ASC
        `, [matriculaId, matriculaId, cursoId]);

        // LÓGICA DE BLOQUEIO LINEAR (INTER-AULAS)
        let anteriorConcluida = true;
        aulas.forEach(aula => {
            aula.isLiberada = anteriorConcluida;
            if (aula.progresso_status !== 'CONCLUIDA') {
                anteriorConcluida = false;
            }
        });

        modulos.forEach(modulo => modulo.aulas = aulas.filter(aula => aula.modulo_id === modulo.id));

        // Determinar a Aula Atual
        let aulaAtual = null;
        if (aulas.length > 0) {
            if (aulaParamId) {
                aulaAtual = aulas.find(a => a.id === parseInt(aulaParamId));
                if (aulaAtual && !aulaAtual.isLiberada) {
                    aulaAtual = aulas.find(a => a.isLiberada && a.progresso_status !== 'CONCLUIDA') || aulas[aulas.length - 1];
                }
            } else {
                aulaAtual = aulas.find(a => a.progresso_status !== 'CONCLUIDA') || aulas[aulas.length - 1];
            }
        }

        let conteudosAtual = null;
        let imagensApostila = [];
        let tentativasUsadas = 0;
        let progressoPercentual = aulaAtual ? (aulaAtual.progresso_percentual || 0) : 0;
        let avaliacaoData = null;

        if (aulaAtual) {
            const [cont] = await db.execute('SELECT * FROM aula_conteudos WHERE aula_id = ?', [aulaAtual.id]);
            conteudosAtual = cont[0] || null;

            const [imgs] = await db.execute('SELECT * FROM apostila_imagens WHERE aula_id = ? ORDER BY ordem ASC', [aulaAtual.id]);
            imagensApostila = imgs;

            const [tentativasQuery] = await db.execute('SELECT COUNT(*) as qtd FROM avaliacao_tentativas WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaAtual.id]);
            tentativasUsadas = tentativasQuery[0].qtd || 0;

            // LER O ARQUIVO JSON DA AVALIAÇÃO
            if (conteudosAtual && conteudosAtual.avaliacao_json_path) {
                try {
                    const fs = require('fs');
                    const path = require('path');
                    const filePath = path.join(__dirname, '..', 'public', conteudosAtual.avaliacao_json_path);
                    if (fs.existsSync(filePath)) {
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        avaliacaoData = JSON.parse(fileContent);
                    }
                } catch (err) {
                    console.error("Erro ao ler/processar arquivo JSON da avaliação:", err);
                }
            }
        }

        let notasSalvas = [];
        if (aulaAtual) {
            const [notasQuery] = await db.execute(
                'SELECT id, tempo_segundos, texto FROM aula_notas WHERE matricula_id = ? AND aula_id = ? ORDER BY tempo_segundos ASC',
                [matriculaId, aulaAtual.id]
            );
            notasSalvas = notasQuery;
        }

        // NOVA LÓGICA: AVALIAÇÃO OBRIGATÓRIA NO FINAL DO CURSO
        let isUltimaAula = false;
        let jaAvaliouCurso = false;

        if (aulas.length > 0 && aulaAtual) {
            const ultimaAulaDoCurso = aulas[aulas.length - 1];
            isUltimaAula = (aulaAtual.id === ultimaAulaDoCurso.id);

            // Se o aluno está na última aula, verifica se ele já avaliou o curso
            if (isUltimaAula) {
                const [avalExistente] = await db.execute(
                    'SELECT id FROM avaliacoes_curso WHERE curso_id = ? AND aluno_id = ?',
                    [cursoId, alunoId]
                );
                jaAvaliouCurso = avalExistente.length > 0;
            }
        }

        // Passa as novas variáveis (isUltimaAula e jaAvaliouCurso) para a view
        res.send(renderAlunoSalaAulaView(
            req.session.usuario, curso, modulos, aulaAtual, conteudosAtual,
            imagensApostila, matriculas[0], progressoPercentual, tentativasUsadas,
            avaliacaoData, notasSalvas, isUltimaAula, jaAvaliouCurso
        ));

    } catch (error) {
        console.error('Erro ao carregar sala de aula:', error);
        res.status(500).send('Erro interno ao carregar o curso.');
    }
});

//AVALIAÇÃO DO ALUNO AO FINAL DO CURSO
router.post('/aluno/cursos/:cursoId/avaliar', verificarAluno, async (req, res) => {
    const cursoId = req.params.cursoId;
    const alunoId = req.session.usuario.id;
    const { nota, comentario } = req.body;

    try {
        if (!nota || isNaN(nota) || nota < 1 || nota > 5) {
            return res.status(400).json({ success: false, message: 'Nota inválida. Selecione de 1 a 5 estrelas.' });
        }

        // Verifica se o aluno tem matrícula no curso (segurança)
        const [matriculas] = await db.execute('SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ?', [alunoId, cursoId]);
        if (matriculas.length === 0) {
            return res.status(403).json({ success: false, message: 'Não matriculado.' });
        }

        // Verifica se já não avaliou antes (para evitar duplo clique)
        const [avalExistente] = await db.execute('SELECT id FROM avaliacoes_curso WHERE curso_id = ? AND aluno_id = ?', [cursoId, alunoId]);
        if (avalExistente.length > 0) {
            return res.status(400).json({ success: false, message: 'Você já avaliou este curso.' });
        }

        // Salva na base de dados
        await db.execute(
            'INSERT INTO avaliacoes_curso (curso_id, aluno_id, nota, comentario) VALUES (?, ?, ?, ?)',
            [cursoId, alunoId, nota, comentario || null]
        );

        res.json({ success: true, message: 'Avaliação salva com sucesso!' });

    } catch (error) {
        console.error('Erro ao salvar avaliação do curso:', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
});

//------------------------------------------------------------------------------ROTAS DE PROGRESSO E ANOTAÇÕES------------------------------------------------------------------------------
//SALVAR ANOTAÇÃO
router.post('/aluno/aulas/:aulaId/notas', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const aulaId = req.params.aulaId;
    const { curso_id, tempo_segundos, texto } = req.body;

    try {
        // 1. Verifica se a matrícula é válida
        const [matriculas] = await db.execute(
            'SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")',
            [alunoId, curso_id]
        );

        if (matriculas.length === 0) {
            return res.status(403).json({ success: false, message: 'Acesso negado' });
        }

        const matriculaId = matriculas[0].id;

        // 2. Insere a nota no banco
        const [result] = await db.execute(
            'INSERT INTO aula_notas (matricula_id, aula_id, tempo_segundos, texto) VALUES (?, ?, ?, ?)',
            [matriculaId, aulaId, tempo_segundos, texto]
        );

        // Devolve o ID da nota inserida para o frontend conseguir apagá-la depois se quiser
        res.json({ success: true, id: result.insertId });
    } catch (error) {
        console.error('Erro ao salvar nota da aula:', error);
        res.status(500).json({ success: false });
    }
});

//EXCLUIR ANOTAÇÃO
router.post('/aluno/aulas/notas/:notaId/excluir', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const notaId = req.params.notaId;

    try {
        // 1. Segurança: Verifica se a nota existe e se pertence a uma matrícula deste aluno
        const [nota] = await db.execute(`
            SELECT n.id 
            FROM aula_notas n
            JOIN matriculas m ON n.matricula_id = m.id
            WHERE n.id = ? AND m.aluno_id = ?`,
            [notaId, alunoId]
        );

        if (nota.length === 0) {
            return res.status(403).json({ success: false, message: 'Nota não encontrada ou acesso negado' });
        }

        // 2. Exclui a nota
        await db.execute('DELETE FROM aula_notas WHERE id = ?', [notaId]);

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao excluir nota da aula:', error);
        res.status(500).json({ success: false });
    }
});

//SALVAR O PROGRESSO DO VÍDEO
router.post('/aluno/aulas/:aulaId/tempo', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const aulaId = req.params.aulaId;
    const { curso_id, tempo_assistido } = req.body;

    try {
        // 1. Verifica se a matrícula é válida
        const [matriculas] = await db.execute(
            'SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")',
            [alunoId, curso_id]
        );

        if (matriculas.length === 0) {
            return res.status(403).json({ success: false, message: 'Acesso negado' });
        }

        const matriculaId = matriculas[0].id;

        // 2. Verifica se a linha de progresso JÁ EXISTE
        const [progressoExistente] = await db.execute(
            'SELECT id FROM progresso_aula WHERE matricula_id = ? AND aula_id = ?',
            [matriculaId, aulaId]
        );

        if (progressoExistente.length > 0) {
            // Se já existe, apenas atualiza
            await db.execute(
                'UPDATE progresso_aula SET tempo_assistido = ? WHERE matricula_id = ? AND aula_id = ?',
                [tempo_assistido, matriculaId, aulaId]
            );
        } else {
            // Se não existe, cria a linha pela primeira vez
            // AQUI ESTÁ A CORREÇÃO: Trocamos "PENDENTE" por "EM_ANDAMENTO"
            await db.execute(
                'INSERT INTO progresso_aula (matricula_id, aula_id, status, tempo_assistido) VALUES (?, ?, "EM_ANDAMENTO", ?)',
                [matriculaId, aulaId, tempo_assistido]
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao salvar tempo do vídeo:', error);
        res.status(500).json({ success: false });
    }
});

//CONCLUIR ETAPAS DA AULA
router.post('/aluno/aulas/:aulaId/etapa', verificarAluno, async (req, res) => {
    const aulaId = req.params.aulaId;
    const { curso_id, etapa } = req.body;
    const alunoId = req.session.usuario.id;

    try {
        // Substitua a linha do db.execute das matriculas por:
        const [matriculas] = await db.execute(
            'SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")',
            [alunoId, curso_id]
        );
        if (matriculas.length === 0) return res.status(403).json({ error: 'Matrícula inválida' });
        const matriculaId = matriculas[0].id;

        // Define a percentagem baseada na etapa concluída
        const novoPercentual = etapa === 'VIDEO' ? 33.33 : 66.66;

        // Verifica se já existe registo. Atualiza (só se for maior) ou insere.
        const [prog] = await db.execute('SELECT id, progresso_percentual FROM progresso_aula WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

        if (prog.length > 0) {
            if (parseFloat(prog[0].progresso_percentual) < novoPercentual) {
                await db.execute('UPDATE progresso_aula SET progresso_percentual = ?, ultima_interacao_em = NOW() WHERE id = ?', [novoPercentual, prog[0].id]);
            }
        } else {
            await db.execute('INSERT INTO progresso_aula (matricula_id, aula_id, status, progresso_percentual, ultima_interacao_em) VALUES (?, ?, "EM_ANDAMENTO", ?, NOW())', [matriculaId, aulaId, novoPercentual]);
        }

        // Se a requisição veio via Fetch API (JSON), devolve a resposta para atualizar a tela silenciosamente
        if (req.is('application/json')) {
            return res.json({ success: true, percentual: novoPercentual });
        }

        // Fallback caso seja submetido via formulário HTML clássico
        res.redirect(`/aluno/cursos/${curso_id}/aula/${aulaId}`);
    } catch (error) {
        console.error(error);
        if (req.is('application/json')) return res.status(500).json({ error: 'Erro ao atualizar etapa.' });
        res.status(500).send('Erro ao atualizar etapa.');
    }
});

//AVALIAÇÃO: CALCULO DE NOTAS, XP E TENTATIVAS
router.post('/aluno/aulas/:aulaId/avaliacao', verificarAluno, async (req, res) => {
    const aulaId = req.params.aulaId;
    const { curso_id, resultado, score, total_questions } = req.body;
    const alunoId = req.session.usuario.id;

    try {
        const [matriculas] = await db.execute('SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")', [alunoId, curso_id]);
        if (matriculas.length === 0) return res.redirect('/aluno');
        const matriculaId = matriculas[0].id;

        // Conta quantas tentativas o aluno já tem ANTES desta
        const [tentativasQuery] = await db.execute('SELECT COUNT(*) as qtd FROM avaliacao_tentativas WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);
        const tentativasAtuais = tentativasQuery[0].qtd;

        // Se por algum motivo bizarro ele burlar o front-end e chegar aqui com 3
        if (tentativasAtuais >= 3) return res.send('<h2>Limite de 3 tentativas excedido.</h2><a href="javascript:history.back()">Voltar</a>');

        // CÁLCULO DA NOTA REAL (0 a 10)
        let notaReal = 0;
        if (score !== undefined && total_questions !== undefined && parseInt(total_questions) > 0) {
            notaReal = (parseInt(score) / parseInt(total_questions)) * 10;
        } else {
            notaReal = resultado === 'aprovado' ? 10.0 : 0.0;
        }

        const foiAprovado = resultado === 'aprovado' ? 1 : 0;

        // Insere o registo DESTA nova tentativa
        await db.execute(
            'INSERT INTO avaliacao_tentativas (matricula_id, aula_id, nota, aprovado, enviado_em) VALUES (?, ?, ?, ?, NOW())',
            [matriculaId, aulaId, notaReal, foiAprovado]
        );

        let cursoFoiConcluidoNestaEtapa = false; // Flag de controle

        if (foiAprovado) {
            // [NOVO] VERIFICAÇÃO ANTI-FARM DE XP
            // Verifica se a aula JÁ estava concluída antes para não dar XP repetido
            const [aulaProgresso] = await db.execute('SELECT status FROM progresso_aula WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);
            const jaEstavaConcluida = aulaProgresso.length > 0 && aulaProgresso[0].status === 'CONCLUIDA';

            // 1. Marca a aula atual como 100% concluída
            await db.execute('UPDATE progresso_aula SET progresso_percentual = 100.00, status = "CONCLUIDA", concluida_em = NOW() WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

            // [NOVO] GANHO DE XP NA MATRÍCULA
            if (!jaEstavaConcluida) {
                // Cálculo Gamificado: 50 XP fixo + bónus pela nota (Ex: Nota 10 = +50 XP. Total: 100 XP)
                const xpGanho = 50 + Math.round(notaReal * 5);
                await db.execute('UPDATE matriculas SET xp = xp + ? WHERE id = ?', [xpGanho, matriculaId]);
            }

            // 2. Conta Total de Aulas vs Aulas Concluídas
            const [totalQuery] = await db.execute('SELECT COUNT(*) as total FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE m.curso_id = ?', [curso_id]);
            const [concluidasQuery] = await db.execute(`
                SELECT COUNT(*) as concluidas FROM progresso_aula pa 
                JOIN aulas a ON pa.aula_id = a.id JOIN modulos m ON a.modulo_id = m.id 
                WHERE pa.matricula_id = ? AND pa.status = 'CONCLUIDA' AND m.curso_id = ?
            `, [matriculaId, curso_id]);

            const totalAulas = totalQuery[0].total;
            const concluidas = concluidasQuery[0].concluidas;
            const percentualGeral = totalAulas > 0 ? ((concluidas / totalAulas) * 100).toFixed(2) : 0;

            // 3. INSERIR OU ATUALIZAR PROGRESSO
            const [progCurso] = await db.execute('SELECT id FROM progresso_curso WHERE matricula_id = ?', [matriculaId]);

            if (progCurso.length > 0) {
                // Já existe progresso gravado, apenas atualiza
                await db.execute(`UPDATE progresso_curso SET percentual = ?, aulas_concluidas = ?, total_aulas = ?, atualizado_em = NOW() WHERE matricula_id = ?`, [percentualGeral, concluidas, totalAulas, matriculaId]);
            } else {
                // Primeira aula concluída! Inserir a linha de progresso
                await db.execute(`INSERT INTO progresso_curso (matricula_id, percentual, aulas_concluidas, total_aulas) VALUES (?, ?, ?, ?)`, [matriculaId, percentualGeral, concluidas, totalAulas]);
            }

            // 4. LIBERAR CERTIFICADO
            if (parseFloat(percentualGeral) >= 100) {
                // Aluno concluiu 100% do curso!
                await db.execute('UPDATE matriculas SET status = "CONCLUIDA", concluida_em = NOW() WHERE id = ?', [matriculaId]);

                // Verifica como está a situação do certificado
                const [certExiste] = await db.execute('SELECT id FROM certificados WHERE matricula_id = ?', [matriculaId]);

                if (certExiste.length === 0) {
                    // Fallback de segurança com o novo padrão de token
                    const crypto = require('crypto'); // Certifique-se de que o crypto está importado no topo do seu app.js
                    const tokenCertificado = crypto.randomBytes(4).toString('hex').toUpperCase();
                    await db.execute('INSERT INTO certificados (matricula_id, token, emitido_em) VALUES (?, ?, NOW())', [matriculaId, tokenCertificado]);
                } else {
                    // Destranca o certificado existente
                    await db.execute('UPDATE certificados SET emitido_em = NOW() WHERE matricula_id = ? AND emitido_em IS NULL', [matriculaId]);
                }

                cursoFoiConcluidoNestaEtapa = true;
            }

            // REDIRECIONAMENTOS DE SUCESSO
            if (cursoFoiConcluidoNestaEtapa) {
                res.redirect('/aluno'); // Terminou o curso (Vai ver 100% no painel)
            } else {
                res.redirect(`/aluno/cursos/${curso_id}/aula`); // Pula pra próxima aula
            }

        } else {
            // LÓGICA DE REPROVAÇÃO E RESET
            const totalFalhas = tentativasAtuais + 1; // Soma a falha atual

            if (totalFalhas >= 3) {
                // ESTOUROU O LIMITE! Reseta o progresso para 0
                await db.execute('UPDATE progresso_aula SET progresso_percentual = 0.00, status = "EM_ANDAMENTO" WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

                // Zera as tentativas no banco para ele poder tentar mais 3 vezes após reassistir
                await db.execute('DELETE FROM avaliacao_tentativas WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

                // Redireciona com a flag de reset para disparar o alerta vermelho na view
                res.redirect(`/aluno/cursos/${curso_id}/aula/${aulaId}?resetado=true`);
            } else {
                // Ainda tem tentativas (ex: errou a 1ª ou 2ª). Redireciona com o alerta amarelo
                res.redirect(`/aluno/cursos/${curso_id}/aula/${aulaId}?erro=true`);
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar avaliação.');
    }
});

module.exports = router;