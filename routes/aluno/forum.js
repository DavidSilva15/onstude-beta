const express = require('express');
const router = express.Router();
const db = require('../../db');

// Configurações de Upload
const { uploadForum } = require('../../config/uploadConfig');

// Importação das Views
const renderForumIndexView = require('../../views/forumIndexView');
const renderForumNovoTopicoView = require('../../views/forumNovoTopicoView');
const renderForumTopicoView = require('../../views/forumTopicoView');

// Middleware específico do Fórum
function usuarioOpcional(req, res, next) {
    req.usuarioLogado = req.session.usuario || null;
    next();
}

//------------------------------------------------------------------------------ROTAS DO FORUM------------------------------------------------------------------------------
//LISTA OS TÓPICOS DO FORUM
router.get('/forum', usuarioOpcional, async (req, res) => {
    try {
        const categoriaFiltro = req.query.categoria || '';
        const searchFiltro = req.query.search || '';

        const [cursos] = await db.execute("SELECT titulo FROM cursos WHERE status = 'PUBLICADO' ORDER BY titulo ASC");

        let queryTopicos = `
            SELECT 
                t.*, 
                u.nome as autor_nome, u.foto_perfil_url, u.tipo as autor_tipo,
                (SELECT COUNT(*) FROM forum_respostas WHERE topico_id = t.id) as total_respostas,
                (SELECT ROUND(AVG(nota), 1) FROM avaliacao_tentativas at JOIN matriculas m ON at.matricula_id = m.id WHERE m.aluno_id = u.id AND at.aprovado = 1) AS nota_media,
                (SELECT c.titulo FROM avaliacao_tentativas at JOIN matriculas m ON at.matricula_id = m.id JOIN cursos c ON m.curso_id = c.id WHERE m.aluno_id = u.id GROUP BY c.id ORDER BY MAX(at.nota) DESC LIMIT 1) AS melhor_curso
            FROM forum_topicos t
            JOIN usuarios u ON t.usuario_id = u.id
            WHERE 1=1
        `;
        let queryParams = [];

        if (categoriaFiltro) {
            queryTopicos += ` AND t.categoria = ?`;
            queryParams.push(categoriaFiltro);
        }

        if (searchFiltro) {
            queryTopicos += ` AND (t.titulo LIKE ? OR t.conteudo LIKE ?)`;
            queryParams.push(`%${searchFiltro}%`, `%${searchFiltro}%`);
        }

        queryTopicos += ` ORDER BY t.criado_em DESC`;

        const [topicos] = await db.execute(queryTopicos, queryParams);

        res.send(renderForumIndexView(req.usuarioLogado, topicos, cursos, categoriaFiltro, searchFiltro));
    } catch (error) {
        console.error('Erro ao carregar fórum:', error);
        res.status(500).send('Erro interno ao carregar o fórum.');
    }
});


//FORMULÁRIO DE NOVA PERGUNTA
router.get('/forum/novo', async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login?returnTo=/forum/novo');
    try {
        const [cursos] = await db.execute("SELECT titulo FROM cursos WHERE status = 'PUBLICADO' ORDER BY titulo ASC");
        res.send(renderForumNovoTopicoView(req.session.usuario, cursos));
    } catch (error) {
        console.error('Erro ao carregar nova pergunta:', error);
        res.status(500).send('Erro interno.');
    }
});

//NOVA PERGUNTA
router.post('/forum/novo', uploadForum.single('print_imagem'), async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login');

    const { titulo, conteudo, categoria } = req.body;
    const usuarioId = req.session.usuario.id;
    const imagem_url = req.file ? '/img/forum/' + req.file.filename : null;

    try {
        await db.execute(
            `INSERT INTO forum_topicos (usuario_id, titulo, conteudo, imagem_url, categoria) 
             VALUES (?, ?, ?, ?, ?)`,
            [usuarioId, titulo, conteudo, imagem_url, categoria || 'Geral']
        );
        res.redirect('/forum');
    } catch (error) {
        console.error('Erro ao criar tópico:', error);
        res.status(500).send('Erro ao publicar sua dúvida.');
    }
});

//VER TÓPICO ESPECÍFICO
router.get('/forum/topico/:id', usuarioOpcional, async (req, res) => {
    const topicoId = req.params.id;

    try {
        await db.execute('UPDATE forum_topicos SET visualizacoes = visualizacoes + 1 WHERE id = ?', [topicoId]);

        // Busca o Tópico (Pergunta) com Estatísticas
        const [topicos] = await db.execute(`
            SELECT t.*, u.nome as autor_nome, u.foto_perfil_url, u.tipo as autor_tipo,
                   (SELECT ROUND(AVG(nota), 1) FROM avaliacao_tentativas at JOIN matriculas m ON at.matricula_id = m.id WHERE m.aluno_id = u.id AND at.aprovado = 1) AS nota_media,
                   (SELECT c.titulo FROM avaliacao_tentativas at JOIN matriculas m ON at.matricula_id = m.id JOIN cursos c ON m.curso_id = c.id WHERE m.aluno_id = u.id GROUP BY c.id ORDER BY MAX(at.nota) DESC LIMIT 1) AS melhor_curso
            FROM forum_topicos t JOIN usuarios u ON t.usuario_id = u.id WHERE t.id = ?
        `, [topicoId]);

        if (topicos.length === 0) return res.status(404).send('Tópico não encontrado.');

        // Busca as Respostas com Estatísticas (AQUI ESTAVA FALTANDO PARA VOCÊ)
        const [respostas] = await db.execute(`
            SELECT r.*, u.nome as autor_nome, u.foto_perfil_url, u.tipo as autor_tipo,
                   (SELECT ROUND(AVG(nota), 1) FROM avaliacao_tentativas at JOIN matriculas m ON at.matricula_id = m.id WHERE m.aluno_id = u.id AND at.aprovado = 1) AS nota_media,
                   (SELECT c.titulo FROM avaliacao_tentativas at JOIN matriculas m ON at.matricula_id = m.id JOIN cursos c ON m.curso_id = c.id WHERE m.aluno_id = u.id GROUP BY c.id ORDER BY MAX(at.nota) DESC LIMIT 1) AS melhor_curso
            FROM forum_respostas r JOIN usuarios u ON r.usuario_id = u.id 
            WHERE r.topico_id = ? ORDER BY r.is_solucao DESC, r.criado_em ASC
        `, [topicoId]);

        res.send(renderForumTopicoView(req.usuarioLogado, topicos[0], respostas));
    } catch (error) {
        console.error('Erro ao carregar tópico:', error);
        res.status(500).send('Erro interno.');
    }
});

//RESPONDER TÓPICO ESPECÍFICO
router.post('/forum/topico/:id/responder', uploadForum.single('print_imagem'), async (req, res) => {
    if (!req.session.usuario) return res.redirect(`/login?returnTo=/forum/topico/${req.params.id}`);

    const topicoId = req.params.id;
    const { conteudo } = req.body;
    const usuarioId = req.session.usuario.id;
    const imagem_url = req.file ? '/img/forum/' + req.file.filename : null;

    try {
        await db.execute(
            `INSERT INTO forum_respostas (topico_id, usuario_id, conteudo, imagem_url) VALUES (?, ?, ?, ?)`,
            [topicoId, usuarioId, conteudo, imagem_url]
        );
        await db.execute('UPDATE forum_topicos SET atualizado_em = NOW() WHERE id = ?', [topicoId]);

        res.redirect(`/forum/topico/${topicoId}`);
    } catch (error) {
        console.error('Erro ao responder:', error);
        res.status(500).send('Erro ao enviar resposta.');
    }
});

module.exports = router;