const express = require('express');
const router = express.Router();
const db = require('../../db');

const { verificarAdmin } = require('../../middlewares/authMiddleware');
const { uploadCV } = require('../../config/uploadConfig');

const renderAdminCurriculosView = require('../../views/adminCurriculosView');

//------------------------------------------------------------------------------ROTAS DE CURRÍCULOS------------------------------------------------------------------------------
//LISTA CURRÍCULOS
router.get('/admin/curriculos', verificarAdmin, async (req, res) => {
    try {
        const [modelosCV] = await db.execute('SELECT * FROM curriculo_modelos ORDER BY id DESC');

        const renderAdminCurriculosView = require('../../views/adminCurriculosView');
        res.send(renderAdminCurriculosView(req.session.usuario, modelosCV));
    } catch (error) {
        console.error('Erro ao carregar Gestão de Currículos:', error);
        res.status(500).send('Erro interno ao carregar a página.');
    }
});

//ENVIAR NOVO MODELO DE CURRÍCULO
router.post('/admin/curriculos/novo', verificarAdmin, uploadCV.fields([{ name: 'capa' }, { name: 'arquivo_docx' }]), async (req, res) => {
    try {
        const { titulo } = req.body;
        const capa_url = req.files['capa'] ? '/uploads/' + req.files['capa'][0].filename : '';
        const arquivo_url = req.files['arquivo_docx'] ? '/uploads/' + req.files['arquivo_docx'][0].filename : '';

        if (!capa_url || !arquivo_url) {
            return res.status(400).send('A imagem de capa e o ficheiro .docx são obrigatórios.');
        }

        await db.execute(
            'INSERT INTO curriculo_modelos (titulo, capa_url, arquivo_url) VALUES (?, ?, ?)',
            [titulo, capa_url, arquivo_url]
        );
        res.redirect('/admin/curriculos');
    } catch (error) {
        console.error('Erro ao adicionar modelo CV:', error);
        res.status(500).send('Erro interno.');
    }
});

//EDITAR MODELO DE CURRÍCULO
router.post('/admin/curriculos/:id/editar', verificarAdmin, uploadCV.fields([{ name: 'capa' }, { name: 'arquivo_docx' }]), async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo } = req.body;

        let query = 'UPDATE curriculo_modelos SET titulo = ?';
        let params = [titulo];

        if (req.files['capa']) {
            query += ', capa_url = ?';
            params.push('/uploads/' + req.files['capa'][0].filename);
        }
        if (req.files['arquivo_docx']) {
            query += ', arquivo_url = ?';
            params.push('/uploads/' + req.files['arquivo_docx'][0].filename);
        }

        query += ' WHERE id = ?';
        params.push(id);

        await db.execute(query, params);
        res.redirect('/admin/curriculos');
    } catch (error) {
        console.error('Erro ao editar modelo CV:', error);
        res.status(500).send('Erro interno.');
    }
});

//EXCLUIR MODELO DE CURRÍCULO
router.post('/admin/curriculos/:id/excluir', verificarAdmin, async (req, res) => {
    try {
        await db.execute('DELETE FROM curriculo_modelos WHERE id = ?', [req.params.id]);
        res.redirect('/admin?aba=curriculos');
    } catch (error) {
        console.error('Erro ao excluir modelo CV:', error);
        res.status(500).send('Erro interno.');
    }
});

module.exports = router;