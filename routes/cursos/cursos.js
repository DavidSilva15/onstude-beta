const express = require('express');
const router = express.Router();
const db = require('../../db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { verificarAdmin } = require('../../middlewares/authMiddleware');
const { uploadTemp } = require('../../config/uploadConfig');

const renderAdminCursosView = require('../../views/adminCursosView');
const renderNovoCursoView = require('../../views/novoCursoView');
const renderEditarCursoView = require('../../views/editarCursoView');
const renderCursoDetalhesView = require('../../views/cursoDetalhesView')

// Função utilitária necessária para criar a pasta do curso
function sanitizeFolderName(name) {
    return name.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

//------------------------------------------------------------------------------ROTAS PARA GERENCIAMENTO DE CURSOS------------------------------------------------------------------------------
//PAINEL DE GERENCIAMENTO DE CURSOS
router.get('/admin/cursos', verificarAdmin, async (req, res) => {
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
            conditions.push('(c.titulo LIKE ? OR c.codigo_unico LIKE ?)');
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Restrição para o Mentor ver apenas os seus cursos
        if (isMentor) {
            conditions.push('c.criado_por_admin_id = ?');
            queryParams.push(adminId);
        }

        const whereClause = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

        const countQuery = `SELECT COUNT(id) AS total FROM cursos c ${whereClause}`;
        const [totalQuery] = await db.execute(countQuery, queryParams);
        const totalCursos = totalQuery[0].total;
        const totalPages = Math.ceil(totalCursos / limit) || 1;

        const mainQuery = `
            SELECT 
                c.*,
                (SELECT COUNT(m.id) 
                 FROM matriculas m 
                 WHERE m.curso_id = c.id AND m.status IN ('ATIVA', 'CONCLUIDA')
                ) AS quantidade_alunos,
                
                (SELECT AVG(at.nota) 
                 FROM avaliacao_tentativas at 
                 JOIN matriculas m ON at.matricula_id = m.id 
                 WHERE m.curso_id = c.id
                ) AS nota_media,
                
                (SELECT SUM(a.duracao_segundos) 
                 FROM aulas a 
                 JOIN modulos mo ON a.modulo_id = mo.id 
                 WHERE mo.curso_id = c.id
                ) AS duracao_total_segundos

            FROM cursos c
            ${whereClause}
            ORDER BY c.criado_em DESC
            LIMIT ${limit} OFFSET ${offset}
        `;

        const [cursos] = await db.execute(mainQuery, queryParams);

        res.send(renderAdminCursosView(req.session.usuario, cursos, currentPage, totalPages, search));

    } catch (error) {
        console.error('Erro ao listar cursos:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

//FORMULÁRIO PARA CADASTRAR NOVO CURSO
router.get('/admin/cursos/novo', verificarAdmin, (req, res) => {
    res.send(renderNovoCursoView(req.session.usuario));
});

//DETALHES DO CURSO(ADMIN)
router.get('/admin/cursos/:id', verificarAdmin, async (req, res) => {
    const cursoId = req.params.id;

    try {
        // 1. Busca os dados do curso
        const [cursos] = await db.execute('SELECT * FROM cursos WHERE id = ?', [cursoId]);
        if (cursos.length === 0) {
            return res.status(404).send('<h1>Curso não encontrado.</h1><a href="/admin">Voltar</a>');
        }
        const curso = cursos[0];

        // 2. Busca os módulos vinculados a este curso
        const [modulos] = await db.execute('SELECT * FROM modulos WHERE curso_id = ? ORDER BY ordem ASC', [cursoId]);

        // 3. Busca TODAS as aulas vinculadas a este curso (através dos módulos)
        const [aulas] = await db.execute(`
            SELECT a.* FROM aulas a 
            JOIN modulos m ON a.modulo_id = m.id 
            WHERE m.curso_id = ? 
            ORDER BY a.ordem ASC
        `, [cursoId]);

        // 4. Aninha as aulas dentro dos seus respectivos módulos
        modulos.forEach(modulo => {
            modulo.aulas = aulas.filter(aula => aula.modulo_id === modulo.id);
        });

        // 5. Renderiza a view
        res.send(renderCursoDetalhesView(req.session.usuario, curso, modulos));

    } catch (error) {
        console.error('Erro ao carregar detalhes do curso:', error);
        res.status(500).send('<h1>Erro interno do servidor.</h1>');
    }
});

//CADASTRAR NOVO CURSO
router.post('/admin/cursos/novo', verificarAdmin, uploadTemp.fields([
    { name: 'capa', maxCount: 1 },
    { name: 'certificado_template', maxCount: 1 }
]), async (req, res) => {

    const { titulo, descricao, status, mercado, duracao_horas, conclusao_dias, preco, desconto_percentual } = req.body;
    const adminId = req.session.usuario.id;
    const arquivos = req.files || {};

    const codigoAleatorio = crypto.randomBytes(3).toString('hex').toUpperCase();
    const codigoUnico = `ONST-${codigoAleatorio}`;

    const mercadoTratado = mercado && mercado.trim() !== '' ? mercado.trim() : null;
    const duracaoTratada = duracao_horas ? parseInt(duracao_horas) : null;
    const conclusaoTratada = conclusao_dias ? parseInt(conclusao_dias) : null;
    const precoTratado = preco ? parseFloat(preco.replace(',', '.')) : 0.00;
    const descontoTratado = desconto_percentual ? parseInt(desconto_percentual) : 0;

    try {
        const [resultadoCurso] = await db.execute(
            `INSERT INTO cursos (codigo_unico, titulo, descricao, capa_url, certificado_template_url, status, criado_por_admin_id, mercado, duracao_horas, conclusao_dias, preco, desconto_percentual) 
             VALUES (?, ?, ?, NULL, NULL, ?, ?, ?, ?, ?, ?, ?)`,
            [
                codigoUnico, titulo, descricao || null, status, adminId,
                mercadoTratado, duracaoTratada, conclusaoTratada, precoTratado, descontoTratado
            ]
        );

        const novoCursoId = resultadoCurso.insertId;

        const folderName = `${novoCursoId}_${sanitizeFolderName(titulo)}`;
        const targetDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'cursos', folderName);

        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

        let finalCapaUrl = null;
        let finalCertificadoUrl = null;

        if (arquivos['capa']) {
            const oldPath = arquivos['capa'][0].path;
            const newFilename = arquivos['capa'][0].filename;
            const newPath = path.join(targetDir, newFilename);
            fs.renameSync(oldPath, newPath);
            finalCapaUrl = `/uploads/cursos/${folderName}/${newFilename}`;
        }

        if (arquivos['certificado_template']) {
            const oldPath = arquivos['certificado_template'][0].path;
            const newFilename = arquivos['certificado_template'][0].filename;
            const newPath = path.join(targetDir, newFilename);
            fs.renameSync(oldPath, newPath);
            finalCertificadoUrl = `/uploads/cursos/${folderName}/${newFilename}`;
        }

        if (finalCapaUrl || finalCertificadoUrl) {
            await db.execute(
                `UPDATE cursos SET capa_url = COALESCE(?, capa_url), certificado_template_url = COALESCE(?, certificado_template_url) WHERE id = ?`,
                [finalCapaUrl, finalCertificadoUrl, novoCursoId]
            );
        }

        const detalhesLog = JSON.stringify({ titulo, codigo_unico: codigoUnico, status, mercado: mercadoTratado, preco: precoTratado });

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, detalhes_json, ip) 
             VALUES (?, 'CRIAR_CURSO', 'cursos', ?, ?, ?)`,
            [adminId, novoCursoId, detalhesLog, req.ip || req.socket.remoteAddress]
        );
        res.redirect('/admin/cursos');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno ao salvar o curso.');
    }
});

// FORMULÁRIO PARA EDITAR CURSO EXISTENTE
router.get('/admin/cursos/:id/editar', verificarAdmin, async (req, res) => {
    const cursoId = req.params.id;

    try {
        const [cursos] = await db.execute('SELECT * FROM cursos WHERE id = ?', [cursoId]);

        if (cursos.length === 0) {
            return res.status(404).send('<h1>Curso não encontrado.</h1><a href="/admin">Voltar</a>');
        }

        const curso = cursos[0];
        res.send(renderEditarCursoView(req.session.usuario, curso));

    } catch (error) {
        console.error('Erro ao carregar edição do curso:', error);
        res.status(500).send('<h1>Erro interno do servidor.</h1>');
    }
});

//EDITAR CURSO
router.post('/admin/cursos/:id/editar', verificarAdmin, uploadTemp.fields([
    { name: 'capa', maxCount: 1 },
    { name: 'certificado_template', maxCount: 1 }
]), async (req, res) => {
    const cursoId = req.params.id;
    const { titulo, descricao, status, capa_url_atual, certificado_atual, mercado, duracao_horas, conclusao_dias, preco, desconto_percentual } = req.body;
    const adminId = req.session.usuario.id;

    const mercadoTratado = mercado && mercado.trim() !== '' ? mercado.trim() : null;
    const duracaoTratada = duracao_horas ? parseInt(duracao_horas) : null;
    const conclusaoTratada = conclusao_dias ? parseInt(conclusao_dias) : null;
    const precoTratado = preco ? parseFloat(preco.replace(',', '.')) : 0.00;
    const descontoTratado = desconto_percentual ? parseInt(desconto_percentual) : 0;

    try {
        const folderName = `${cursoId}_${sanitizeFolderName(titulo)}`;
        const targetDir = path.join(__dirname, '..', '..', 'public', 'uploads', 'cursos', folderName);

        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

        const arquivos = req.files || {};

        let capa_url = capa_url_atual || null;
        if (arquivos['capa']) {
            const oldPath = arquivos['capa'][0].path;
            const newFilename = arquivos['capa'][0].filename;
            const newPath = path.join(targetDir, newFilename);
            fs.renameSync(oldPath, newPath);
            capa_url = `/uploads/cursos/${folderName}/${newFilename}`;
        }

        let certificado_template_url = certificado_atual || null;
        if (arquivos['certificado_template']) {
            const oldPath = arquivos['certificado_template'][0].path;
            const newFilename = arquivos['certificado_template'][0].filename;
            const newPath = path.join(targetDir, newFilename);
            fs.renameSync(oldPath, newPath);
            certificado_template_url = `/uploads/cursos/${folderName}/${newFilename}`;
        }

        await db.execute(
            `UPDATE cursos 
             SET titulo = ?, descricao = ?, capa_url = ?, certificado_template_url = ?, status = ?, mercado = ?, duracao_horas = ?, conclusao_dias = ?, preco = ?, desconto_percentual = ? 
             WHERE id = ?`,
            [
                titulo, descricao || null, capa_url, certificado_template_url, status,
                mercadoTratado, duracaoTratada, conclusaoTratada, precoTratado, descontoTratado, cursoId
            ]
        );

        const detalhesLog = JSON.stringify({ campos_alterados: { titulo, status, preco: precoTratado, desconto: descontoTratado } });

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, detalhes_json, ip) 
             VALUES (?, 'EDITAR_CURSO', 'cursos', ?, ?, ?)`,
            [adminId, cursoId, detalhesLog, req.ip || req.socket.remoteAddress]
        );

        res.redirect(`/admin/cursos/${cursoId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno ao atualizar o curso.');
    }
});

//EXCLUIR CURSO
router.post('/admin/cursos/:id/excluir', verificarAdmin, async (req, res) => {
    const cursoId = req.params.id;
    const adminId = req.session.usuario.id;

    try {
        // 1. Registra no log ANTES de excluir (para termos o ID garantido)
        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'EXCLUIR_CURSO', 'cursos', ?, ?)`,
            [adminId, cursoId, req.ip || req.socket.remoteAddress]
        );

        // 2. Limpar os Favoritos (se algum aluno favoritou este curso)
        await db.execute('DELETE FROM cursos_favoritos WHERE curso_id = ?', [cursoId]).catch(() => { });

        // 3. Limpar os dados dos Alunos Matriculados (Progresso, Avaliações, Certificados)
        const [matriculas] = await db.execute('SELECT id FROM matriculas WHERE curso_id = ?', [cursoId]);

        for (let mat of matriculas) {
            // Apaga tudo o que o aluno fez dentro deste curso
            await db.execute('DELETE FROM progresso_aula WHERE matricula_id = ?', [mat.id]).catch(() => { });
            await db.execute('DELETE FROM avaliacao_tentativas WHERE matricula_id = ?', [mat.id]).catch(() => { });
            await db.execute('DELETE FROM certificados WHERE matricula_id = ?', [mat.id]).catch(() => { });

            // ADICIONADO: Apaga o progresso geral do curso amarrado a esta matrícula
            await db.execute('DELETE FROM progresso_curso WHERE matricula_id = ?', [mat.id]).catch(() => { });
        }

        // Agora podemos excluir as matrículas em si, pois não têm mais dependências
        await db.execute('DELETE FROM matriculas WHERE curso_id = ?', [cursoId]);

        // 4. (Segurança extra) Limpar dependências de aulas caso o seu CASCADE falhe
        const [modulos] = await db.execute('SELECT id FROM modulos WHERE curso_id = ?', [cursoId]);
        for (let mod of modulos) {
            const [aulas] = await db.execute('SELECT id FROM aulas WHERE modulo_id = ?', [mod.id]);
            for (let aula of aulas) {
                await db.execute('DELETE FROM aula_conteudos WHERE aula_id = ?', [aula.id]).catch(() => { });
                await db.execute('DELETE FROM apostila_imagens WHERE aula_id = ?', [aula.id]).catch(() => { });
            }
            await db.execute('DELETE FROM aulas WHERE modulo_id = ?', [mod.id]).catch(() => { });
        }
        await db.execute('DELETE FROM modulos WHERE curso_id = ?', [cursoId]).catch(() => { });

        // 5. O Comando Final: Exclui o curso (agora o MySQL vai permitir!)
        await db.execute('DELETE FROM cursos WHERE id = ?', [cursoId]);

        res.redirect('/admin/cursos');
    } catch (error) {
        console.error('Erro ao excluir curso:', error);
        res.status(500).send('Erro interno ao tentar excluir o curso.');
    }
});

module.exports = router;