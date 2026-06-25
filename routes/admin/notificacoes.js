const express = require('express');
const router = express.Router();
const db = require('../../db');

// Middlewares e Configurações de Upload
const { verificarAdmin } = require('../../middlewares/authMiddleware');
const { uploadNotificacao } = require('../../config/uploadConfig');

// Importação das Views
const renderAdminNotificacoesView = require('../../views/adminNotificacoesView');
const renderAdminNovaNotificacaoView = require('../../views/adminNovaNotificacaoView');

//------------------------------------------------------------------------------ROTAS DE NOTIFICAÇÕES------------------------------------------------------------------------------

//GERENCIAMENTO DE NOTIFICAÇÕES DO SISTEMA
router.get('/admin/notificacoes', verificarAdmin, async (req, res) => {
    try {
        const isMentor = req.session.usuario.tipo === 'MENTOR';
        const adminId = req.session.usuario.id;

        const limit = 12;
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * limit;
        const search = req.query.search || '';

        let queryParams = [];
        let conditions = [];

        if (search.trim() !== '') {
            conditions.push('(n.titulo LIKE ? OR n.mensagem LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Mentor só vê notificações disparadas por ele
        if (isMentor) {
            conditions.push('n.criada_por_admin_id = ?');
            queryParams.push(adminId);
        }

        const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

        const countQuery = `SELECT COUNT(id) AS total FROM notificacoes n ${whereClause}`;
        const [totalQuery] = await db.execute(countQuery, queryParams);
        const totalNotificacoes = totalQuery[0].total;
        const totalPages = Math.ceil(totalNotificacoes / limit) || 1;

        const mainQuery = `
            SELECT n.*, 
                   (SELECT COUNT(*) FROM notificacao_entregas WHERE notificacao_id = n.id) AS total_enviados,
                   (SELECT COUNT(*) FROM notificacao_entregas WHERE notificacao_id = n.id AND status = 'LIDA') AS total_lidos,
                   (SELECT GROUP_CONCAT(c.titulo SEPARATOR ', ') 
                    FROM notificacao_cursos nc 
                    JOIN cursos c ON nc.curso_id = c.id 
                    WHERE nc.notificacao_id = n.id) AS cursos_alvo_nomes
            FROM notificacoes n
            ${whereClause}
            ORDER BY n.criado_em DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const [notificacoesRaw] = await db.execute(mainQuery, queryParams);

        const notificacoes = await Promise.all(notificacoesRaw.map(async (notif) => {
            if (notif.tipo_interacao !== 'NENHUM') {
                const [respostas] = await db.execute(`
                    SELECT nr.*, u.nome AS nome_aluno 
                    FROM notificacao_respostas nr
                    JOIN usuarios u ON nr.aluno_id = u.id
                    WHERE nr.notificacao_id = ?
                    ORDER BY nr.respondido_em DESC
                `, [notif.id]);
                return { ...notif, respostas };
            }
            return { ...notif, respostas: [] };
        }));

        res.send(renderAdminNotificacoesView(req.session.usuario, notificacoes, currentPage, totalPages, search));
    } catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

//CRIAR NOVA NOTIFICAÇÃO
router.post('/admin/notificacoes/nova', verificarAdmin, uploadNotificacao.single('imagem'), async (req, res) => {
    const { titulo, mensagem, tipo_interacao, tipo_alvo, cursos_alvo, data_inicio, data_fim } = req.body;
    const adminId = req.session.usuario.id;
    const isMentor = req.session.usuario.tipo === 'MENTOR';
    const imagem_url = req.file ? '/img/notificacoes/' + req.file.filename : null;

    const dInicio = data_inicio && data_inicio.trim() !== '' ? data_inicio : null;
    const dFim = data_fim && data_fim.trim() !== '' ? data_fim : null;

    try {
        const [resultNotificacao] = await db.execute(
            `INSERT INTO notificacoes (titulo, mensagem, imagem_url, tipo_interacao, tipo_alvo, criada_por_admin_id, data_inicio, data_fim) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, mensagem, imagem_url, tipo_interacao, tipo_alvo, adminId, dInicio, dFim]
        );
        const notificacaoId = resultNotificacao.insertId;

        // Distribuição Inteligente das Notificações
        if (tipo_alvo === 'TODOS') {
            if (isMentor) {
                // MENTOR envia "Para Todos", mas restrito à base de alunos dele
                await db.execute(
                    `INSERT IGNORE INTO notificacao_entregas (notificacao_id, aluno_id, status)
                     SELECT DISTINCT ?, m.aluno_id, 'PENDENTE' 
                     FROM matriculas m
                     JOIN cursos c ON m.curso_id = c.id
                     WHERE c.criado_por_admin_id = ? AND m.status = 'ATIVA'`,
                    [notificacaoId, adminId]
                );
            } else {
                // ADMIN envia para toda a base
                await db.execute(
                    `INSERT IGNORE INTO notificacao_entregas (notificacao_id, aluno_id, status)
                     SELECT ?, id, 'PENDENTE' FROM usuarios WHERE tipo = 'ALUNO' AND status = 'ATIVO'`,
                    [notificacaoId]
                );
            }
        } else if (tipo_alvo === 'CURSO_ESPECIFICO' && cursos_alvo) {
            const cursosArray = Array.isArray(cursos_alvo) ? cursos_alvo : [cursos_alvo];
            for (const cId of cursosArray) {
                await db.execute('INSERT INTO notificacao_cursos (notificacao_id, curso_id) VALUES (?, ?)', [notificacaoId, cId]);
            }
            const placeholders = cursosArray.map(() => '?').join(',');
            await db.execute(
                `INSERT IGNORE INTO notificacao_entregas (notificacao_id, aluno_id, status)
                 SELECT DISTINCT ?, aluno_id, 'PENDENTE' FROM matriculas 
                 WHERE curso_id IN (${placeholders}) AND status = 'ATIVA'`,
                [notificacaoId, ...cursosArray]
            );
        }

        res.redirect('/admin');

    } catch (error) {
        console.error('Erro ao disparar notificação:', error);
        res.status(500).send('Erro ao criar notificação.');
    }
});

//EDITAR NOTIFICAÇÕES
router.post('/admin/notificacoes/:id/editar', verificarAdmin, async (req, res) => {
    const { titulo, mensagem, data_inicio, data_fim } = req.body;
    const notificacaoId = req.params.id;

    const dInicio = data_inicio && data_inicio.trim() !== '' ? data_inicio : null;
    const dFim = data_fim && data_fim.trim() !== '' ? data_fim : null;

    try {
        await db.execute(
            'UPDATE notificacoes SET titulo = ?, mensagem = ?, data_inicio = ?, data_fim = ? WHERE id = ?',
            [titulo, mensagem, dInicio, dFim, notificacaoId]
        );
        res.redirect('/admin/notificacoes');
    } catch (error) {
        console.error('Erro ao editar notificação:', error);
        res.status(500).send('Erro ao atualizar notificação.');
    }
});

//FORMULÁRIO PARA NOVA NOTIFICAÇÃO
router.get('/admin/notificacoes/nova', verificarAdmin, async (req, res) => {
    try {
        const [cursos] = await db.execute("SELECT id, titulo FROM cursos WHERE status = 'PUBLICADO' ORDER BY titulo ASC");
        res.send(renderAdminNovaNotificacaoView(req.session.usuario, cursos));
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar tela de notificação.');
    }
});

//EXCLUIR NOTIFICAÇÕES
router.post('/admin/notificacoes/:id/excluir', verificarAdmin, async (req, res) => {
    const notificacaoId = req.params.id;
    try {
        // O banco de dados vai excluir automaticamente as entregas e respostas 
        // associadas a esta notificação por causa do "ON DELETE CASCADE" que configuramos nas tabelas.
        await db.execute('DELETE FROM notificacoes WHERE id = ?', [notificacaoId]);
        res.redirect('/admin/notificacoes');
    } catch (error) {
        console.error('Erro ao excluir notificação:', error);
        res.status(500).send('Erro ao excluir notificação.');
    }
});

//EXPORTAR RESPOSTAS DAS NOTIFICAÇÕES
router.get('/admin/notificacoes/:id/exportar', verificarAdmin, async (req, res) => {
    const notificacaoId = req.params.id;

    try {
        // 1. Busca os dados da notificação para o nome do arquivo
        const [notifQuery] = await db.execute('SELECT titulo, tipo_interacao FROM notificacoes WHERE id = ?', [notificacaoId]);
        if (notifQuery.length === 0) return res.status(404).send('Notificação não encontrada.');
        const notificacao = notifQuery[0];

        if (notificacao.tipo_interacao === 'NENHUM') {
            return res.status(400).send('Esta notificação não possui respostas para exportar.');
        }

        // 2. Super Query para cruzar as respostas com os dados do aluno e a última aula
        const [respostas] = await db.execute(`
            SELECT 
                u.nome,
                u.telefone,
                u.data_nascimento,
                u.ultimo_acesso,
                nr.resposta_texto,
                nr.avaliacao_estrelas,
                nr.respondido_em,
                (SELECT CONCAT(cur.titulo, ' ||| ', a.titulo) 
                 FROM progresso_aula pa 
                 JOIN aulas a ON pa.aula_id = a.id 
                 JOIN matriculas mat ON pa.matricula_id = mat.id 
                 JOIN cursos cur ON mat.curso_id = cur.id
                 WHERE mat.aluno_id = u.id 
                 ORDER BY pa.id DESC LIMIT 1
                ) AS ultima_atividade
            FROM notificacao_respostas nr
            JOIN usuarios u ON nr.aluno_id = u.id
            WHERE nr.notificacao_id = ?
            ORDER BY nr.respondido_em DESC
        `, [notificacaoId]);

        // 3. Monta o cabeçalho do CSV
        // O \uFEFF é um BOM (Byte Order Mark) que força o Excel a ler os acentos (UTF-8) corretamente.
        let csvContent = '\uFEFFNome do Aluno;Telefone;Idade;Ultimo Acesso;Ultimo Curso;Ultima Aula;Data da Resposta;Resposta/Avaliacao\n';

        // 4. Preenche as linhas do CSV
        respostas.forEach(r => {
            // Calcula a Idade
            let idade = '-';
            if (r.data_nascimento) {
                const diff = new Date() - new Date(r.data_nascimento);
                idade = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            }

            // Trata as datas
            const ultimoAcesso = r.ultimo_acesso ? new Date(r.ultimo_acesso).toLocaleString('pt-BR') : 'Nunca';
            const dataResposta = r.respondido_em ? new Date(r.respondido_em).toLocaleString('pt-BR') : '-';

            // Trata a última atividade (Curso e Aula)
            let ultimoCurso = '-';
            let ultimaAula = '-';
            if (r.ultima_atividade) {
                [ultimoCurso, ultimaAula] = r.ultima_atividade.split(' ||| ');
            }

            // Trata a resposta (remove quebras de linha e pontos e vírgulas para não quebrar o CSV)
            let feedback = '';
            if (notificacao.tipo_interacao === 'AVALIACAO_ESTRELAS') {
                feedback = `${r.avaliacao_estrelas} Estrelas`;
            } else {
                feedback = r.resposta_texto ? `"${r.resposta_texto.replace(/(\r\n|\n|\r)/gm, " ").replace(/;/g, ",")}"` : 'Sem texto';
            }

            // Tratamento do Telefone
            const telefone = r.telefone || 'Não informado';

            // Monta a linha separada por ponto e vírgula (padrão do Excel em português)
            csvContent += `${r.nome};${telefone};${idade};${ultimoAcesso};${ultimoCurso};${ultimaAula};${dataResposta};${feedback}\n`;
        });

        // 5. Configura os Headers para forçar o Download do arquivo
        const nomeArquivo = `Relatorio_Notificacao_${notificacaoId}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${nomeArquivo}"`);

        // Envia o arquivo finalizado
        res.send(csvContent);

    } catch (error) {
        console.error('Erro ao exportar CSV:', error);
        res.status(500).send('Erro interno ao gerar arquivo.');
    }
});

module.exports = router;