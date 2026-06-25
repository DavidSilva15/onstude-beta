const express = require('express');
const router = express.Router();
const db = require('../../db');

const { verificarAdmin } = require('../../middlewares/authMiddleware');

const renderNovoModuloView = require('../../views/novoModuloView');
const renderEditarModuloView = require('../../views/editarModuloView');

//------------------------------------------------------------------------------ROTAS PARA GERENCIAMENTO DE MODULOS------------------------------------------------------------------------------
//FORMULÁRIO PARA CRIAR NOVO MÓDULO
router.get('/admin/cursos/:id/modulos/novo', verificarAdmin, async (req, res) => {
    const cursoId = req.params.id;

    try {
        // 1. Validar se o curso existe
        const [cursos] = await db.execute('SELECT id, codigo_unico, titulo FROM cursos WHERE id = ?', [cursoId]);
        if (cursos.length === 0) {
            return res.status(404).send('<h1>Curso não encontrado.</h1><a href="/admin">Voltar</a>');
        }

        // 2. Descobrir qual é a última ordem cadastrada para sugerir a próxima
        const [resultadoOrdem] = await db.execute('SELECT MAX(ordem) as maxOrdem FROM modulos WHERE curso_id = ?', [cursoId]);
        const proximaOrdem = (resultadoOrdem[0].maxOrdem || 0) + 1;

        res.send(renderNovoModuloView(req.session.usuario, cursos[0], proximaOrdem));

    } catch (error) {
        console.error('Erro ao carregar ecrã de novo módulo:', error);
        res.status(500).send('<h1>Erro interno do servidor.</h1>');
    }
});

//CRIAR NOVO MÓDULO
router.post('/admin/cursos/:id/modulos/novo', verificarAdmin, async (req, res) => {
    const cursoId = req.params.id;
    const { titulo, ordem, descricao } = req.body;
    const adminId = req.session.usuario.id;

    try {
        // 1. Insere o módulo na base de dados
        const [resultadoModulo] = await db.execute(
            `INSERT INTO modulos (curso_id, titulo, ordem, descricao) VALUES (?, ?, ?, ?)`,
            [cursoId, titulo, parseInt(ordem), descricao || null]
        );

        // 2. Regista a ação na tabela de auditoria (admin_logs)
        const ip = req.ip || req.socket.remoteAddress;
        const detalhesLog = JSON.stringify({ curso_id: cursoId, titulo, ordem });

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, detalhes_json, ip, user_agent) 
             VALUES (?, 'CRIAR_MODULO', 'modulos', ?, ?, ?, ?)`,
            [adminId, resultadoModulo.insertId, detalhesLog, ip, req.headers['user-agent']]
        );

        // 3. Redireciona de volta para o painel do curso
        res.redirect(`/admin/cursos/${cursoId}`);

    } catch (error) {
        console.error('Erro ao criar módulo:', error);

        // Tratamento de erro específico para a restrição UNIQUE(curso_id, ordem) do banco de dados
        if (error.code === 'ER_DUP_ENTRY') {
            return res.send(`
                <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Erro de Ordem Duplicada</h2>
                    <p>Já existe um módulo com a ordem <b>${ordem}</b> neste curso.</p>
                    <a href="javascript:history.back()" style="padding: 10px 20px; background: #0d6efd; color: white; text-decoration: none; border-radius: 5px;">Voltar e corrigir</a>
                </div>
            `);
        }

        res.status(500).send('<h1>Erro interno ao guardar o módulo.</h1>');
    }
});

//FORMULÁRIO PARA EDIÇÃO DE MÓDULO
router.get('/admin/modulos/:id/editar', verificarAdmin, async (req, res) => {
    const moduloId = req.params.id;

    try {
        // 1. Busca os dados do módulo
        const [modulos] = await db.execute('SELECT * FROM modulos WHERE id = ?', [moduloId]);
        if (modulos.length === 0) {
            return res.status(404).send('<h1>Módulo não encontrado.</h1><a href="/admin">Voltar</a>');
        }
        const modulo = modulos[0];

        // 2. Busca os dados do curso associado (AGORA TRAZENDO O TÍTULO)
        const [cursos] = await db.execute('SELECT id, codigo_unico, titulo FROM cursos WHERE id = ?', [modulo.curso_id]);

        res.send(renderEditarModuloView(req.session.usuario, cursos[0], modulo));

    } catch (error) {
        console.error('Erro ao carregar edição do módulo:', error);
        res.status(500).send('<h1>Erro interno do servidor.</h1>');
    }
});

//EDITAR MÓDULO EXISTENTE
router.post('/admin/modulos/:id/editar', verificarAdmin, async (req, res) => {
    const moduloId = req.params.id;
    const { titulo, ordem, descricao } = req.body;
    const adminId = req.session.usuario.id;

    try {
        // 1. Precisamos do curso_id para redirecionar no final (e para os logs)
        const [moduloAntigo] = await db.execute('SELECT curso_id, titulo, ordem FROM modulos WHERE id = ?', [moduloId]);
        if (moduloAntigo.length === 0) return res.status(404).send('Módulo não encontrado.');
        const cursoId = moduloAntigo[0].curso_id;

        // 2. Atualiza os dados na tabela 'modulos'
        await db.execute(
            `UPDATE modulos SET titulo = ?, ordem = ?, descricao = ? WHERE id = ?`,
            [titulo, parseInt(ordem), descricao || null, moduloId]
        );

        // 3. Regista a ação na tabela de auditoria
        const ip = req.ip || req.socket.remoteAddress;
        const detalhesLog = JSON.stringify({
            curso_id: cursoId,
            alteracoes: { titulo, ordem }
        });

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, detalhes_json, ip, user_agent) 
             VALUES (?, 'EDITAR_MODULO', 'modulos', ?, ?, ?, ?)`,
            [adminId, moduloId, detalhesLog, ip, req.headers['user-agent']]
        );

        // 4. Redireciona de volta para a gestão do curso
        res.redirect(`/admin/cursos/${cursoId}`);

    } catch (error) {
        console.error('Erro ao editar módulo:', error);

        // Tratamento de erro caso o admin tente colocar uma ordem que já existe noutro módulo do mesmo curso
        if (error.code === 'ER_DUP_ENTRY') {
            return res.send(`
                <div style="font-family: sans-serif; text-align: center; margin-top: 50px;">
                    <h2>Erro de Ordem Duplicada</h2>
                    <p>Já existe outro módulo com a ordem <b>${ordem}</b> neste curso.</p>
                    <a href="javascript:history.back()" style="padding: 10px 20px; background: #0d6efd; color: white; text-decoration: none; border-radius: 5px;">Voltar e corrigir</a>
                </div>
            `);
        }

        res.status(500).send('<h1>Erro interno ao atualizar o módulo.</h1>');
    }
});

//EXCLUIR MÓDULO
router.post('/admin/modulos/:id/excluir', verificarAdmin, async (req, res) => {
    const moduloId = req.params.id;
    const adminId = req.session.usuario.id;

    try {
        // Descobre o curso_id para redirecionar corretamente após excluir
        const [moduloQuery] = await db.execute('SELECT curso_id FROM modulos WHERE id = ?', [moduloId]);
        if (moduloQuery.length === 0) return res.redirect('/admin');
        const cursoId = moduloQuery[0].curso_id;

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'EXCLUIR_MODULO', 'modulos', ?, ?)`,
            [adminId, moduloId, req.ip || req.socket.remoteAddress]
        );

        // Deleta o módulo (e as aulas caem em cascata)
        await db.execute('DELETE FROM modulos WHERE id = ?', [moduloId]);

        res.redirect(`/admin/cursos/${cursoId}`);
    } catch (error) {
        console.error('Erro ao excluir módulo:', error);
        res.status(500).send('Erro interno ao tentar excluir o módulo.');
    }
});

module.exports = router;