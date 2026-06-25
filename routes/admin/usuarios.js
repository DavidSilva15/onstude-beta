const express = require('express');
const router = express.Router();
const db = require('../../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Middlewares e Configurações de Upload
const { verificarAdmin } = require('../../middlewares/authMiddleware');
const { uploadPerfil } = require('../../config/uploadConfig');

// Importação das Views
const renderAdminUsuariosView = require('../../views/adminUsuariosView');
const renderNovoUsuarioView = require('../../views/novoUsuarioView');
const renderEditarUsuarioView = require('../../views/editarUsuarioView');

//------------------------------------------------------------------------------ROTAS DE GERENCIAMENTO DE USUARIOS(ADMIN)------------------------------------------------------------------------------
//LISTA DE USUÁRIOS
router.get('/admin/usuarios', verificarAdmin, async (req, res) => {
    try {
        const isMentor = req.session.usuario.tipo === 'MENTOR';
        const adminId = req.session.usuario.id;

        const limit = 12;
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * limit;
        const search = req.query.search || '';
        const currentFilter = req.query.filter || 'todos';

        let queryParams = [];
        let conditions = [];

        if (search.trim() !== '') {
            conditions.push(`u.id IN (
                SELECT DISTINCT u2.id FROM usuarios u2 
                LEFT JOIN matriculas m2 ON u2.id = m2.aluno_id 
                LEFT JOIN cursos c2 ON m2.curso_id = c2.id 
                WHERE u2.nome LIKE ? OR c2.titulo LIKE ?
            )`);
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        // Restrição rigorosa: Mentor enxerga os alunos que ELE CRIOU ou que estão matriculados nos cursos dele
        if (isMentor) {
            conditions.push(`(u.criado_por_admin_id = ? OR u.id IN (
                SELECT DISTINCT m_mentor.aluno_id FROM matriculas m_mentor
                JOIN cursos c_mentor ON m_mentor.curso_id = c_mentor.id
                WHERE c_mentor.criado_por_admin_id = ?
            ))`);
            queryParams.push(adminId, adminId);
        }

        const whereClauseMain = conditions.length > 0 ? ' WHERE ' + conditions.join(' AND ') : '';

        // 1. CONTAGEM INTELIGENTE PARA OS FILTROS
        const statsQuery = `
            SELECT
                COUNT(*) as todos,
                SUM(CASE WHEN status_calc = 'ATIVO' THEN 1 ELSE 0 END) as ativos,
                SUM(CASE WHEN status_calc = 'CONCLUINTE' THEN 1 ELSE 0 END) as concluintes,
                SUM(CASE WHEN status_calc = 'INATIVO' THEN 1 ELSE 0 END) as inativos,
                SUM(CASE WHEN is_faltoso = 1 AND status_calc = 'ATIVO' THEN 1 ELSE 0 END) as faltosos
            FROM (
                SELECT 
                    u.id,
                    CASE 
                        WHEN u.status = 'ATIVO' AND COUNT(DISTINCT m.curso_id) > 0 AND COUNT(DISTINCT m.curso_id) = SUM(CASE WHEN m.status = 'CONCLUIDA' THEN 1 ELSE 0 END) THEN 'CONCLUINTE'
                        WHEN u.status = 'ATIVO' THEN 'ATIVO'
                        ELSE u.status
                    END AS status_calc,
                    CASE 
                        WHEN u.tipo = 'ALUNO' AND u.status = 'ATIVO' AND (u.ultimo_acesso IS NULL OR DATEDIFF(NOW(), u.ultimo_acesso) >= 2) THEN 1
                        ELSE 0
                    END AS is_faltoso
                FROM usuarios u
                LEFT JOIN matriculas m ON u.id = m.aluno_id AND m.status IN ('ATIVA', 'CONCLUIDA')
                ${whereClauseMain}
                GROUP BY u.id
            ) AS user_stats
        `;

        const [statsResult] = await db.execute(statsQuery, queryParams);

        const filterCounts = {
            todos: Number(statsResult[0].todos || 0),
            ativos: Number(statsResult[0].ativos || 0),
            concluintes: Number(statsResult[0].concluintes || 0),
            inativos: Number(statsResult[0].inativos || 0),
            faltosos: Number(statsResult[0].faltosos || 0)
        };

        const totalUsuarios = filterCounts[currentFilter] || filterCounts.todos;
        const totalPages = Math.ceil(totalUsuarios / limit) || 1;

        // 2. APLICAÇÃO DO FILTRO ESCOLHIDO (HAVING)
        let havingClause = '';
        if (currentFilter === 'ativos') {
            havingClause = ` HAVING u.status = 'ATIVO' AND (total_cursos = 0 OR total_cursos != concluidos_count)`;
        } else if (currentFilter === 'concluintes') {
            havingClause = ` HAVING u.status = 'ATIVO' AND total_cursos > 0 AND total_cursos = concluidos_count`;
        } else if (currentFilter === 'faltosos') {
            havingClause = ` HAVING u.status = 'ATIVO' AND (total_cursos = 0 OR total_cursos != concluidos_count) AND u.tipo = 'ALUNO' AND (u.ultimo_acesso IS NULL OR DATEDIFF(NOW(), u.ultimo_acesso) >= 2)`;
        } else if (currentFilter === 'inativos') {
            havingClause = ` HAVING u.status = 'INATIVO'`;
        }

        // 3. QUERY PRINCIPAL DE USUÁRIOS
        const mainQuery = `
            SELECT 
                u.id, u.nome, u.email, u.telefone, u.tipo, u.status, u.criado_em, u.data_nascimento, u.ultimo_acesso,
                
                (SELECT CONCAT(a.titulo, '|||', cur.titulo) 
                 FROM progresso_aula pa 
                 JOIN aulas a ON pa.aula_id = a.id 
                 JOIN matriculas mat ON pa.matricula_id = mat.id 
                 JOIN cursos cur ON mat.curso_id = cur.id
                 WHERE mat.aluno_id = u.id 
                 ORDER BY pa.id DESC LIMIT 1
                ) AS ultima_aula_info,

                COUNT(DISTINCT m.curso_id) AS total_cursos,
                SUM(CASE WHEN m.status = 'CONCLUIDA' THEN 1 ELSE 0 END) AS concluidos_count,
                GROUP_CONCAT(DISTINCT c.titulo SEPARATOR ', ') AS cursos_lista
            FROM usuarios u
            LEFT JOIN matriculas m ON u.id = m.aluno_id AND m.status IN ('ATIVA', 'CONCLUIDA')
            LEFT JOIN cursos c ON m.curso_id = c.id
            ${whereClauseMain}
            GROUP BY u.id
            ${havingClause}
            ORDER BY u.id DESC 
            LIMIT ${limit} OFFSET ${offset}
        `;
        const [usuariosRaw] = await db.execute(mainQuery, queryParams);

        // LÓGICA DE KPIs DE ALUNOS
        const usuariosComKPIs = await Promise.all(usuariosRaw.map(async (u) => {

            if (u.tipo === 'ADMIN' || u.tipo === 'MENTOR') {
                return { ...u, aulas_concluidas: '0 / 0', nota_media_geral: '-', melhor_curso: '-' };
            }

            const alunoId = u.id;
            const mentorCondJoin = isMentor ? `AND c.criado_por_admin_id = ${adminId}` : '';

            const [aulasQuery] = await db.execute(`
                SELECT 
                    SUM(COALESCE(p.aulas_concluidas, 0)) AS concluidas_geral,
                    SUM((SELECT COUNT(a.id) FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE m.curso_id = c.id)) AS total_geral
                FROM matriculas m
                JOIN cursos c ON m.curso_id = c.id
                LEFT JOIN progresso_curso p ON p.matricula_id = m.id
                WHERE m.aluno_id = ? AND m.status IN ('ATIVA', 'CONCLUIDA') AND c.status = 'PUBLICADO'
                ${mentorCondJoin}
            `, [alunoId]);

            const concluidasGeral = aulasQuery[0]?.concluidas_geral || 0;
            const totalGeral = aulasQuery[0]?.total_geral || 0;
            const stringAulasKpi = `${concluidasGeral} / ${totalGeral}`;

            const [notaQuery] = await db.execute(`
                SELECT AVG(max_nota) AS nota_media FROM (
                    SELECT MAX(at.nota) AS max_nota 
                    FROM avaliacao_tentativas at 
                    JOIN matriculas m ON at.matricula_id = m.id 
                    ${isMentor ? 'JOIN cursos c ON m.curso_id = c.id' : ''}
                    WHERE m.aluno_id = ? 
                    ${isMentor ? `AND c.criado_por_admin_id = ${adminId}` : ''}
                    GROUP BY at.aula_id
                ) AS subquery
            `, [alunoId]);

            const notaMediaRaw = notaQuery[0]?.nota_media;
            const notaMedia = notaMediaRaw ? parseFloat(notaMediaRaw).toFixed(1) : '-';

            const [melhorCursoQuery] = await db.execute(`
                SELECT c.titulo, AVG(at.nota) AS media_curso 
                FROM avaliacao_tentativas at 
                JOIN matriculas m ON at.matricula_id = m.id 
                JOIN cursos c ON m.curso_id = c.id 
                WHERE m.aluno_id = ? 
                ${mentorCondJoin}
                GROUP BY c.id 
                ORDER BY media_curso DESC 
                LIMIT 1
            `, [alunoId]);

            const melhorCurso = melhorCursoQuery.length > 0 ? melhorCursoQuery[0].titulo : '-';

            return {
                ...u,
                aulas_concluidas: stringAulasKpi,
                nota_media_geral: notaMedia,
                melhor_curso: melhorCurso
            };
        }));

        const renderAdminUsuariosView = require('../../views/adminUsuariosView');

        res.send(renderAdminUsuariosView(
            req.session.usuario,
            usuariosComKPIs,
            currentPage,
            totalPages,
            search,
            currentFilter,
            filterCounts
        ));

    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

//FORMULÁRIO PARA NOVO USUÁRIO
router.get('/admin/usuarios/novo', verificarAdmin, async (req, res) => {
    try {
        const usuarioLogado = req.session.usuario;
        const isMentor = usuarioLogado.tipo === 'MENTOR';
        const adminId = usuarioLogado.id;

        // CORREÇÃO AQUI: Adicionado a coluna "capa_url" na busca do banco
        let query = "SELECT id, codigo_unico, titulo, capa_url FROM cursos WHERE status = 'PUBLICADO'";
        let params = [];

        if (isMentor) {
            query += " AND criado_por_admin_id = ?";
            params.push(adminId);
        }

        query += " ORDER BY titulo ASC";

        const [cursosDisponiveis] = await db.execute(query, params);

        const renderNovoUsuarioView = require('../../views/novoUsuarioView');
        res.send(renderNovoUsuarioView(usuarioLogado, cursosDisponiveis));
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno.');
    }
});

//CRIAR NOVO USUARIO
router.post('/admin/usuarios/novo', verificarAdmin, uploadPerfil.single('foto_perfil'), async (req, res) => {
    const { nome, email, senha, tipo, data_nascimento, telefone, cidade, estado, cursos } = req.body;

    const usuarioLogado = req.session.usuario;
    const adminId = usuarioLogado.id;
    const isMentor = usuarioLogado.tipo === 'MENTOR';

    const foto_perfil_url = req.file ? '/img/perfil/' + req.file.filename : null;

    try {
        let tipoFinal = tipo;
        if (isMentor) {
            tipoFinal = 'ALUNO';
        } else if (!['ADMIN', 'MENTOR', 'ALUNO'].includes(tipo)) {
            tipoFinal = 'ALUNO';
        }

        const [existente] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) return res.send('<h2>E-mail já cadastrado.</h2><a href="javascript:history.back()">Voltar</a>');

        const senhaHash = await bcrypt.hash(senha, 10);

        // INCLUSÃO DO MENTOR AQUI: Associando o criado_por_admin_id
        const [resultadoUsuario] = await db.execute(
            `INSERT INTO usuarios (tipo, nome, email, senha_hash, data_nascimento, telefone, cidade, estado, foto_perfil_url, status, criado_por_admin_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ATIVO', ?)`,
            [tipoFinal, nome, email, senhaHash, data_nascimento || null, telefone || null, cidade || null, estado || null, foto_perfil_url, adminId]
        );

        const novoUsuarioId = resultadoUsuario.insertId;

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'CRIAR_USUARIO', 'usuarios', ?, ?)`,
            [adminId, novoUsuarioId, req.ip || req.socket.remoteAddress]
        );

        if (tipoFinal === 'ALUNO' && cursos) {
            const cursosSelecionados = Array.isArray(cursos) ? cursos : [cursos];

            for (const cursoId of cursosSelecionados) {
                let temPermissaoParaMatricular = true;
                if (isMentor) {
                    const [checkCurso] = await db.execute('SELECT id FROM cursos WHERE id = ? AND criado_por_admin_id = ?', [cursoId, adminId]);
                    if (checkCurso.length === 0) temPermissaoParaMatricular = false;
                }

                if (temPermissaoParaMatricular) {
                    const [resultadoMatricula] = await db.execute(
                        `INSERT INTO matriculas (aluno_id, curso_id, status, origem) 
                         VALUES (?, ?, 'ATIVA', 'LIBERACAO_ADMIN')`,
                        [novoUsuarioId, cursoId]
                    );

                    const matriculaId = resultadoMatricula.insertId;
                    const tokenCertificado = crypto.randomBytes(4).toString('hex').toUpperCase();

                    await db.execute(
                        `INSERT INTO certificados (matricula_id, token) VALUES (?, ?)`,
                        [matriculaId, tokenCertificado]
                    );

                    await db.execute(
                        `INSERT INTO progresso_curso (matricula_id) VALUES (?)`,
                        [matriculaId]
                    );
                }
            }
        }

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar usuário e matrículas.');
    }
});

//FORMULÁRIO PARA EDIÇÃO DE USUÁRIOS
router.get('/admin/usuarios/:id/editar', verificarAdmin, async (req, res) => {
    const usuarioId = req.params.id;
    const usuarioLogado = req.session.usuario;
    const isMentor = usuarioLogado.tipo === 'MENTOR';
    const adminId = usuarioLogado.id;

    try {
        // 1. Busca os dados do usuário
        const [usuarios] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);
        if (usuarios.length === 0) return res.status(404).send('Usuário não encontrado.');
        const usuario = usuarios[0];

        // Regra de Proteção: Um Mentor não pode editar outro Administrador ou Mentor (a menos que seja ele mesmo)
        if (isMentor && usuario.tipo !== 'ALUNO' && usuario.id !== adminId) {
            return res.status(403).send('<h2>Acesso Negado. Mentores só podem editar alunos.</h2><a href="/admin/usuarios">Voltar</a>');
        }

        // 2. Busca todos os cursos publicados disponíveis (Filtrado se for Mentor)
        let queryCursos = "SELECT id, codigo_unico, titulo, capa_url FROM cursos WHERE status = 'PUBLICADO'";
        let paramsCursos = [];
        if (isMentor) {
            queryCursos += " AND criado_por_admin_id = ?";
            paramsCursos.push(adminId);
        }
        queryCursos += " ORDER BY titulo ASC";

        const [cursosDisponiveis] = await db.execute(queryCursos, paramsCursos);

        // 3. Busca os cursos em que o usuário já possui matrícula ATIVA
        let queryMatriculas = "SELECT m.curso_id FROM matriculas m JOIN cursos c ON m.curso_id = c.id WHERE m.aluno_id = ? AND m.status = 'ATIVA'";
        let paramsMat = [usuarioId];
        if (isMentor) {
            queryMatriculas += " AND c.criado_por_admin_id = ?";
            paramsMat.push(adminId);
        }

        const [matriculasAtivas] = await db.execute(queryMatriculas, paramsMat);
        const idsMatriculados = matriculasAtivas.map(m => m.curso_id);

        // 4. Mapeia para avisar a view quais cards devem ir para a coluna de "Ativos"
        cursosDisponiveis.forEach(curso => {
            curso.matriculado = idsMatriculados.includes(curso.id);
        });

        const renderEditarUsuarioView = require('../../views/editarUsuarioView');
        res.send(renderEditarUsuarioView(usuarioLogado, usuario, cursosDisponiveis));
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno.');
    }
});

//EDITAR USUÁRIO
router.post('/admin/usuarios/:id/editar', verificarAdmin, uploadPerfil.single('foto_perfil'), async (req, res) => {
    const usuarioId = req.params.id;
    const { nome, email, tipo, status, nova_senha, data_nascimento, telefone, cidade, estado, foto_atual, cursos } = req.body;

    const usuarioLogado = req.session.usuario;
    const isMentor = usuarioLogado.tipo === 'MENTOR';
    const adminId = usuarioLogado.id;

    const foto_perfil_url = req.file ? '/img/perfil/' + req.file.filename : (foto_atual || null);

    try {
        // Regra de Hierarquia: Mentor só define "ALUNO"
        let tipoFinal = tipo;
        if (isMentor) {
            tipoFinal = 'ALUNO';
        } else if (!['ADMIN', 'MENTOR', 'ALUNO'].includes(tipo)) {
            tipoFinal = 'ALUNO';
        }

        // 1. ATUALIZAÇÃO DOS DADOS DO USUÁRIO
        if (nova_senha && nova_senha.trim() !== '') {
            const senhaHash = await bcrypt.hash(nova_senha, 10);
            await db.execute(
                `UPDATE usuarios SET nome = ?, email = ?, tipo = ?, status = ?, senha_hash = ?, data_nascimento = ?, telefone = ?, cidade = ?, estado = ?, foto_perfil_url = ? WHERE id = ?`,
                [nome, email, tipoFinal, status, senhaHash, data_nascimento || null, telefone || null, cidade || null, estado || null, foto_perfil_url, usuarioId]
            );
        } else {
            await db.execute(
                `UPDATE usuarios SET nome = ?, email = ?, tipo = ?, status = ?, data_nascimento = ?, telefone = ?, cidade = ?, estado = ?, foto_perfil_url = ? WHERE id = ?`,
                [nome, email, tipoFinal, status, data_nascimento || null, telefone || null, cidade || null, estado || null, foto_perfil_url, usuarioId]
            );
        }

        // Atualização de Sessão (caso o admin edite a própria conta)
        if (parseInt(usuarioId) === req.session.usuario.id) {
            req.session.usuario.nome = nome;
            req.session.usuario.foto_perfil_url = foto_perfil_url;
        }

        // 2. GESTÃO INTELIGENTE DE MATRÍCULAS (Com proteção de escopo)
        const cursosSelecionados = cursos ? (Array.isArray(cursos) ? cursos : [cursos]).map(Number) : [];

        // Busca matrículas, mas se for Mentor, só busca as matrículas nos cursos dele
        let queryCursosAlvo = 'SELECT id, curso_id, status FROM matriculas WHERE aluno_id = ?';
        let paramsMatriculas = [usuarioId];

        if (isMentor) {
            queryCursosAlvo = `
                SELECT m.id, m.curso_id, m.status 
                FROM matriculas m 
                JOIN cursos c ON m.curso_id = c.id 
                WHERE m.aluno_id = ? AND c.criado_por_admin_id = ?
            `;
            paramsMatriculas.push(adminId);
        }

        const [matriculasAtuais] = await db.execute(queryCursosAlvo, paramsMatriculas);
        const mapaMatriculas = new Map(matriculasAtuais.map(m => [m.curso_id, m]));

        // 2.1. DESASSOCIAR: Cursos que o usuário tinha (no escopo do Admin/Mentor), mas foi desmarcado
        for (const mat of matriculasAtuais) {
            if (!cursosSelecionados.includes(mat.curso_id) && mat.status === 'ATIVA') {
                await db.execute("UPDATE matriculas SET status = 'CANCELADA', atualizado_em = NOW() WHERE id = ?", [mat.id]);
            }
        }

        // 2.2. ASSOCIAR: Cursos que foram arrastados para a coluna de ativos
        for (const cursoId of cursosSelecionados) {

            // Proteção final: Garantir que o curso pertence ao mentor
            let temPermissao = true;
            if (isMentor) {
                const [checkCurso] = await db.execute('SELECT id FROM cursos WHERE id = ? AND criado_por_admin_id = ?', [cursoId, adminId]);
                if (checkCurso.length === 0) temPermissao = false;
            }

            if (temPermissao) {
                if (mapaMatriculas.has(cursoId)) {
                    const mat = mapaMatriculas.get(cursoId);
                    if (mat.status !== 'ATIVA') {
                        await db.execute("UPDATE matriculas SET status = 'ATIVA', atualizado_em = NOW() WHERE id = ?", [mat.id]);
                    }
                } else {
                    const [resultadoMatricula] = await db.execute(
                        `INSERT INTO matriculas (aluno_id, curso_id, status, origem) VALUES (?, ?, 'ATIVA', 'LIBERACAO_ADMIN')`,
                        [usuarioId, cursoId]
                    );
                    const matriculaId = resultadoMatricula.insertId;

                    const tokenCertificado = require('crypto').randomBytes(4).toString('hex').toUpperCase();
                    await db.execute(`INSERT INTO certificados (matricula_id, token) VALUES (?, ?)`, [matriculaId, tokenCertificado]);
                    await db.execute(`INSERT INTO progresso_curso (matricula_id) VALUES (?)`, [matriculaId]);
                }
            }
        }

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar usuário e gerir matrículas.');
    }
});

//EXCLUIR USUÁRIO
router.post('/admin/usuarios/:id/excluir', verificarAdmin, async (req, res) => {
    const usuarioId = req.params.id;

    // Impede o admin de excluir a própria conta que está usando no momento
    if (parseInt(usuarioId) === req.session.usuario.id) {
        return res.send('<h2>Você não pode excluir a sua própria conta!</h2><a href="javascript:history.back()">Voltar</a>');
    }

    try {
        // Tenta deletar fisicamente do banco
        await db.execute('DELETE FROM usuarios WHERE id = ?', [usuarioId]);
        res.redirect('/admin/usuarios');
    } catch (error) {
        // ER_ROW_IS_REFERENCED_2 significa que há FK apontando para este usuário (ex: admin criou curso, aluno tem matrícula)
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            // Fallback: Exclusão Lógica (Muda status para INATIVO)
            await db.execute(`UPDATE usuarios SET status = 'INATIVO' WHERE id = ?`, [usuarioId]);
            res.redirect('/admin/usuarios');
        } else {
            console.error(error);
            res.status(500).send('Erro interno ao excluir.');
        }
    }
});

module.exports = router;