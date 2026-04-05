// Middleware de proteção de rota (pode ser extraído para uma função separada depois)
function verificarAdmin(req, res, next) {
    if (!req.session.usuario || req.session.usuario.tipo !== 'ADMIN') {
        return res.redirect('/');
    }
    next();
}

// GET: Dashboard do Administrador (Com KPIs Avançados)
app.get('/admin', verificarAdmin, async (req, res) => {
    try {
        // 1. KPIs Gerais de Retenção, Evasão e Conclusão
        const [[kpiGeral]] = await db.execute(`
            SELECT 
                (SELECT COUNT(*) FROM usuarios WHERE tipo = 'ALUNO' AND status = 'ATIVO') AS ativos,
                (SELECT COUNT(*) FROM (
                    SELECT u.id 
                    FROM usuarios u
                    JOIN matriculas m ON u.id = m.aluno_id AND m.status IN ('ATIVA', 'CONCLUIDA')
                    WHERE u.tipo = 'ALUNO' AND u.status = 'ATIVO'
                    GROUP BY u.id
                    HAVING COUNT(m.id) > 0 AND COUNT(m.id) = SUM(CASE WHEN m.status = 'CONCLUIDA' THEN 1 ELSE 0 END)
                ) AS concluintes_sub) AS concluintes,
                (SELECT COUNT(*) FROM usuarios WHERE tipo = 'ALUNO' AND status IN ('INATIVO', 'BLOQUEADO')) AS inativos,
                (SELECT COUNT(*) FROM matriculas WHERE status = 'CANCELADA') AS cancelados
        `);

        // 2. Desempenho e Conclusão por Curso
        const [cursosKpi] = await db.execute(`
            SELECT 
                c.titulo,
                SUM(CASE WHEN m.status = 'ATIVA' THEN 1 ELSE 0 END) AS matriculados,
                SUM(CASE WHEN m.status = 'CONCLUIDA' THEN 1 ELSE 0 END) AS concluidos
            FROM cursos c
            LEFT JOIN matriculas m ON c.id = m.curso_id
            GROUP BY c.id
            ORDER BY matriculados DESC
        `);

        // 3. Resumo Global de Notificações
        const [[notifKpi]] = await db.execute(`
            SELECT 
                SUM(CASE WHEN tipo_interacao = 'PESQUISA_TEXTO' THEN 1 ELSE 0 END) AS pesquisa,
                SUM(CASE WHEN tipo_interacao = 'AVALIACAO_ESTRELAS' THEN 1 ELSE 0 END) AS avaliacao,
                SUM(CASE WHEN tipo_interacao = 'NENHUM' THEN 1 ELSE 0 END) AS informativos
            FROM notificacoes
        `);

        // 4. Volume de Notificações Separadas por Curso
        const [notifCursos] = await db.execute(`
            SELECT c.titulo, COUNT(nc.notificacao_id) AS qtd
            FROM cursos c
            JOIN notificacao_cursos nc ON c.id = nc.curso_id
            GROUP BY c.id
            ORDER BY qtd DESC
        `);

        // Renderiza a view passando APENAS as variáveis pertinentes ao Dashboard
        const renderAdminDashboardView = require('./views/adminDashboardView');
        res.send(renderAdminDashboardView(req.session.usuario, kpiGeral, cursosKpi, notifKpi, notifCursos));

    } catch (error) {
        console.error('Erro ao carregar Dashboard:', error);
        res.status(500).send('Erro interno ao carregar o painel.');
    }
});

// GET: Tela dedicada de Gerenciamento de Cursos (Com Paginação e Busca)
app.get('/admin/cursos', verificarAdmin, async (req, res) => {
    try {
        const limit = 12; // 12 cards por página fecha um grid perfeito (3 ou 4 colunas)
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * limit;
        const search = req.query.search || '';

        let queryParams = [];
        let whereClause = '';

        if (search.trim() !== '') {
            const searchTerm = `%${search}%`;
            whereClause = ' WHERE c.titulo LIKE ? OR c.codigo_unico LIKE ? ';
            queryParams.push(searchTerm, searchTerm);
        }

        // Conta o total de cursos para a paginação
        const countQuery = `SELECT COUNT(id) AS total FROM cursos c ${whereClause}`;
        const [totalQuery] = await db.execute(countQuery, queryParams);
        const totalCursos = totalQuery[0].total;
        const totalPages = Math.ceil(totalCursos / limit) || 1;

        // Query principal com limites, subconsultas, busca e a DURAÇÃO TOTAL corrigida
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
                
                -- CORREÇÃO: Mudamos o alias 'mod' para 'mo' para evitar conflito com a função matemática MOD() do MySQL
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

// GET: Renderiza a lista de todos os Usuários (Admin) com Paginação, Busca, Filtros e Cards Interativos
app.get('/admin/usuarios', verificarAdmin, async (req, res) => {
    try {
        const limit = 12;
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * limit;
        const search = req.query.search || '';
        const currentFilter = req.query.filter || 'todos';

        let queryParams = [];
        let whereClauseMain = '';

        // Se o admin digitou algo na busca
        if (search.trim() !== '') {
            const searchTerm = `%${search}%`;
            whereClauseMain = ` WHERE u.id IN (
                SELECT DISTINCT u2.id FROM usuarios u2 
                LEFT JOIN matriculas m2 ON u2.id = m2.aluno_id 
                LEFT JOIN cursos c2 ON m2.curso_id = c2.id 
                WHERE u2.nome LIKE ? OR c2.titulo LIKE ?
            )`;
            queryParams.push(searchTerm, searchTerm);
        }

        // ==========================================
        // 1. CONTAGEM INTELIGENTE PARA OS FILTROS
        // ==========================================
        const statsQuery = `
            SELECT
                COUNT(*) as todos,
                SUM(CASE WHEN status_calc = 'ATIVO' THEN 1 ELSE 0 END) as ativos,
                SUM(CASE WHEN status_calc = 'CONCLUINTE' THEN 1 ELSE 0 END) as concluintes,
                SUM(CASE WHEN status_calc = 'INATIVO' THEN 1 ELSE 0 END) as inativos,
                -- Faltoso agora exige que o status calculado seja puramente 'ATIVO' (Exclui concluintes e inativos)
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

        // ==========================================
        // 2. APLICAÇÃO DO FILTRO ESCOLHIDO (HAVING)
        // ==========================================
        let havingClause = '';
        if (currentFilter === 'ativos') {
            havingClause = ` HAVING u.status = 'ATIVO' AND (total_cursos = 0 OR total_cursos != concluidos_count)`;
        } else if (currentFilter === 'concluintes') {
            havingClause = ` HAVING u.status = 'ATIVO' AND total_cursos > 0 AND total_cursos = concluidos_count`;
        } else if (currentFilter === 'faltosos') {
            // Garante que é ATIVO e NÃO é CONCLUINTE (total_cursos != concluidos_count)
            havingClause = ` HAVING u.status = 'ATIVO' AND (total_cursos = 0 OR total_cursos != concluidos_count) AND u.tipo = 'ALUNO' AND (u.ultimo_acesso IS NULL OR DATEDIFF(NOW(), u.ultimo_acesso) >= 2)`;
        } else if (currentFilter === 'inativos') {
            havingClause = ` HAVING u.status = 'INATIVO'`;
        }

        // ==========================================
        // 3. QUERY PRINCIPAL DE USUÁRIOS
        // ==========================================
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
            ORDER BY u.ultimo_acesso DESC, u.id DESC
            LIMIT ${limit} OFFSET ${offset}
        `;
        const [usuariosRaw] = await db.execute(mainQuery, queryParams);

        // ==========================================
        // LÓGICA DE KPIs
        // ==========================================
        const usuariosComKPIs = await Promise.all(usuariosRaw.map(async (u) => {

            if (u.tipo === 'ADMIN') {
                return { ...u, aulas_concluidas: '0 / 0', nota_media_geral: '-', melhor_curso: '-' };
            }

            const alunoId = u.id;

            const [aulasQuery] = await db.execute(`
                SELECT 
                    SUM(COALESCE(p.aulas_concluidas, 0)) AS concluidas_geral,
                    SUM((SELECT COUNT(a.id) FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE m.curso_id = c.id)) AS total_geral
                FROM matriculas m
                JOIN cursos c ON m.curso_id = c.id
                LEFT JOIN progresso_curso p ON p.matricula_id = m.id
                WHERE m.aluno_id = ? AND m.status IN ('ATIVA', 'CONCLUIDA') AND c.status = 'PUBLICADO'
            `, [alunoId]);

            const concluidasGeral = aulasQuery[0]?.concluidas_geral || 0;
            const totalGeral = aulasQuery[0]?.total_geral || 0;
            const stringAulasKpi = `${concluidasGeral} / ${totalGeral}`;

            const [notaQuery] = await db.execute(`
                SELECT AVG(max_nota) AS nota_media FROM (
                    SELECT MAX(at.nota) AS max_nota 
                    FROM avaliacao_tentativas at 
                    JOIN matriculas m ON at.matricula_id = m.id 
                    WHERE m.aluno_id = ? 
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

        const renderAdminUsuariosView = require('./views/adminUsuariosView');

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

// GET: Listar Notificações, Estatísticas e Respostas (Com Paginação e Busca)
app.get('/admin/notificacoes', verificarAdmin, async (req, res) => {
    try {
        const limit = 12; // Exibe até 12 notificações por página (encaixa perfeito no grid)
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * limit;
        const search = req.query.search || '';

        let queryParams = [];
        let whereClause = '';

        // Se o admin usou a barra de busca
        if (search.trim() !== '') {
            const searchTerm = `%${search}%`;
            // Busca tanto pelo título da notificação quanto por alguma palavra dentro da mensagem
            whereClause = ' WHERE n.titulo LIKE ? OR n.mensagem LIKE ? ';
            queryParams.push(searchTerm, searchTerm);
        }

        // Conta o total de notificações para a Paginação
        const countQuery = `SELECT COUNT(id) AS total FROM notificacoes n ${whereClause}`;
        const [totalQuery] = await db.execute(countQuery, queryParams);
        const totalNotificacoes = totalQuery[0].total;
        const totalPages = Math.ceil(totalNotificacoes / limit) || 1;

        // 1. Busca as notificações paginadas + contagens + nomes dos cursos
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

        // 2. Busca as respostas (Usando Promise.all para carregar todas simultaneamente de forma rápida)
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
            // Se for do tipo NENHUM, devolve com array vazio para a view não quebrar
            return { ...notif, respostas: [] };
        }));

        res.send(renderAdminNotificacoesView(req.session.usuario, notificacoes, currentPage, totalPages, search));
    } catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// POST: Processar e Disparar Notificação
app.post('/admin/notificacoes/nova', verificarAdmin, uploadNotificacao.single('imagem'), async (req, res) => {
    // Agora extraímos também as datas
    const { titulo, mensagem, tipo_interacao, tipo_alvo, cursos_alvo, data_inicio, data_fim } = req.body;
    const adminId = req.session.usuario.id;
    const imagem_url = req.file ? '/img/notificacoes/' + req.file.filename : null;

    // Tratamento para enviar nulo caso o admin tenha deixado em branco
    const dInicio = data_inicio && data_inicio.trim() !== '' ? data_inicio : null;
    const dFim = data_fim && data_fim.trim() !== '' ? data_fim : null;

    try {
        const [resultNotificacao] = await db.execute(
            `INSERT INTO notificacoes (titulo, mensagem, imagem_url, tipo_interacao, tipo_alvo, criada_por_admin_id, data_inicio, data_fim) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [titulo, mensagem, imagem_url, tipo_interacao, tipo_alvo, adminId, dInicio, dFim]
        );
        const notificacaoId = resultNotificacao.insertId;

        // ... O resto do código (a distribuição inteligente) CONTINUA IGUAL ...

        if (tipo_alvo === 'TODOS') {
            await db.execute(
                `INSERT IGNORE INTO notificacao_entregas (notificacao_id, aluno_id, status)
                 SELECT ?, id, 'PENDENTE' FROM usuarios WHERE tipo = 'ALUNO' AND status = 'ATIVO'`,
                [notificacaoId]
            );
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