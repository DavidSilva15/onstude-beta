const express = require('express');
const router = express.Router();
const db = require('../../db');
const { verificarAluno } = require('../../middlewares/authMiddleware');

//------------------------------------------------------------------------------ROTAS PARA NOTIFICAÇÕES(ALUNOS)------------------------------------------------------------------------------
//LISTA NOTIFICAÇÕES
router.get('/aluno/api/notificacoes/pendente', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    try {
        const [pendentes] = await db.execute(`
            SELECT n.id, n.titulo, n.mensagem, n.imagem_url, n.tipo_interacao, 0 AS ja_respondeu
            FROM notificacao_entregas ne
            JOIN notificacoes n ON ne.notificacao_id = n.id
            WHERE ne.aluno_id = ? AND ne.status = 'PENDENTE'
              AND (n.data_inicio IS NULL OR n.data_inicio <= NOW())
              AND (n.data_fim IS NULL OR n.data_fim >= NOW())
            ORDER BY n.criado_em ASC LIMIT 1
        `, [alunoId]);

        if (pendentes.length > 0) {
            await db.execute("UPDATE notificacao_entregas SET status = 'ENVIADA', enviada_em = NOW() WHERE notificacao_id = ? AND aluno_id = ?", [pendentes[0].id, alunoId]);
            res.json({ success: true, notificacao: pendentes[0] });
        } else {
            res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

//LISTA AS ÚLTIMAS NOTIFICAÇÕES
router.get('/aluno/api/notificacoes/lista', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    try {
        const [lista] = await db.execute(`
            SELECT n.id, n.titulo, n.mensagem, n.link_url, n.imagem_url, n.tipo_interacao, ne.status, n.criado_em,
                   (SELECT COUNT(*) FROM notificacao_respostas nr WHERE nr.notificacao_id = n.id AND nr.aluno_id = ?) AS ja_respondeu
            FROM notificacao_entregas ne
            JOIN notificacoes n ON ne.notificacao_id = n.id
            WHERE ne.aluno_id = ?
              AND ne.oculta = FALSE
              AND (n.data_inicio IS NULL OR n.data_inicio <= NOW())
            ORDER BY n.criado_em DESC LIMIT 15
        `, [alunoId, alunoId]);

        // Conta quantas estão com status 'PENDENTE' (não lidas)
        const qtdNaoLidas = lista.filter(n => n.status === 'PENDENTE').length;

        res.json({ success: true, notificacoes: lista, naoLidas: qtdNaoLidas });
    } catch (error) {
        console.error('Erro ao listar notificações dropdown:', error);
        res.status(500).json({ success: false });
    }
});

//LIMPAR NOTIFICAÇÕES
router.post('/aluno/api/notificacoes/limpar', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    try {
        // Marca todas as notificações atuais deste aluno como ocultas
        await db.execute(
            "UPDATE notificacao_entregas SET oculta = TRUE WHERE aluno_id = ?",
            [alunoId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

//MARCAR TODAS AS NOTIFICAÇÕES COMO LIDA
router.post('/aluno/api/notificacoes/marcar-vistas', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    try {
        await db.execute(
            "UPDATE notificacao_entregas SET status = 'LIDA', lida_em = NOW() WHERE aluno_id = ? AND status = 'PENDENTE'",
            [alunoId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

//MARCAR NOTIFICAÇÃO ESPECIFICA COMO LIDA
router.post('/aluno/api/notificacoes/:id/lida', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const notificacaoId = req.params.id;
    try {
        await db.execute(
            "UPDATE notificacao_entregas SET status = 'LIDA', lida_em = NOW() WHERE notificacao_id = ? AND aluno_id = ? AND status = 'PENDENTE'",
            [notificacaoId, alunoId]
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

//RESPOSTA DO ALUNO PARA MENSAGEM DO SISTEMA
router.post('/aluno/api/notificacoes/:id/responder', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const notificacaoId = req.params.id;
    const { resposta_texto, avaliacao_estrelas } = req.body;

    try {
        await db.execute(
            "UPDATE notificacao_entregas SET status = 'LIDA', lida_em = NOW() WHERE notificacao_id = ? AND aluno_id = ?",
            [notificacaoId, alunoId]
        );

        if (resposta_texto || avaliacao_estrelas) {
            await db.execute(
                "INSERT INTO notificacao_respostas (notificacao_id, aluno_id, resposta_texto, avaliacao_estrelas) VALUES (?, ?, ?, ?)",
                [notificacaoId, alunoId, resposta_texto || null, avaliacao_estrelas || null]
            );
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
    }
});

module.exports = router;