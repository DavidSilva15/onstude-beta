const express = require('express');
const router = express.Router();
const db = require('../../db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const ffmpeg = require('fluent-ffmpeg');

// Middlewares e Configurações de Upload
const { verificarAdmin } = require('../../middlewares/authMiddleware');

// Importa o multer configurado para os diretórios temporários
const { uploadTemp } = require('../../config/uploadConfig');

// Importação das Views
const renderAdminCursosView = require('../../views/adminCursosView');
const renderNovoCursoView = require('../../views/novoCursoView');
const renderEditarCursoView = require('../../views/editarCursoView');
const renderNovoModuloView = require('../../views/novoModuloView');
const renderEditarModuloView = require('../../views/editarModuloView');
const renderNovaAulaView = require('../../views/novaAulaView');
const renderEditarAulaView = require('../../views/editarAulaView');

// Função Utilitária para Pastas (Movida do app.js)
function sanitizeFolderName(name) {
    return name.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

//------------------------------------------------------------------------------ROTAS ADMIN------------------------------------------------------------------------------
//DASHBOARD DO ADMIN/MENTOR
router.get('/admin', verificarAdmin, async (req, res) => {
    try {
        const usuario = req.session.usuario;
        const isMentor = usuario.tipo === 'MENTOR';
        const adminId = usuario.id;

        // Condicionais de escopo para as Queries
        const mentorCond = isMentor ? ` AND c.criado_por_admin_id = ${adminId} ` : '';
        const mentorCondWhere = isMentor ? ` WHERE c.criado_por_admin_id = ${adminId} ` : '';
        const mentorCondNotif = isMentor ? ` WHERE n.criada_por_admin_id = ${adminId} ` : '';

        // NOVO: Se for Admin, busca os mentores para o select do Gráfico e captura o filtro
        let mentores = [];
        const filtroMentorId = req.query.mentor_id || '';

        if (!isMentor) {
            const [mentoresRaw] = await db.execute("SELECT id, nome FROM usuarios WHERE tipo = 'MENTOR' ORDER BY nome ASC");
            mentores = mentoresRaw;
        }

        // 1. KPIs Gerais de Retenção, Evasão e Conclusão
        let queryKpiGeral = '';
        if (isMentor) {
            queryKpiGeral = `
                SELECT 
                    (SELECT COUNT(DISTINCT u.id) FROM usuarios u JOIN matriculas m ON u.id = m.aluno_id JOIN cursos c ON m.curso_id = c.id WHERE u.tipo = 'ALUNO' AND u.status = 'ATIVO' ${mentorCond}) AS ativos,
                    (SELECT COUNT(*) FROM (
                        SELECT u.id 
                        FROM usuarios u
                        JOIN matriculas m ON u.id = m.aluno_id AND m.status IN ('ATIVA', 'CONCLUIDA')
                        JOIN cursos c ON m.curso_id = c.id
                        WHERE u.tipo = 'ALUNO' AND u.status = 'ATIVO' ${mentorCond}
                        GROUP BY u.id
                        HAVING COUNT(m.id) > 0 AND COUNT(m.id) = SUM(CASE WHEN m.status = 'CONCLUIDA' THEN 1 ELSE 0 END)
                    ) AS concluintes_sub) AS concluintes,
                    (SELECT COUNT(DISTINCT u.id) FROM usuarios u JOIN matriculas m ON u.id = m.aluno_id JOIN cursos c ON m.curso_id = c.id WHERE u.tipo = 'ALUNO' AND u.status IN ('INATIVO', 'BLOQUEADO') ${mentorCond}) AS inativos,
                    (SELECT COUNT(DISTINCT m.id) FROM matriculas m JOIN cursos c ON m.curso_id = c.id WHERE m.status = 'CANCELADA' ${mentorCond}) AS cancelados
            `;
        } else {
            queryKpiGeral = `
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
            `;
        }
        const [[kpiGeral]] = await db.execute(queryKpiGeral);

        // 2. Desempenho e Conclusão por Curso
        const [cursosKpi] = await db.execute(`
            SELECT 
                c.titulo,
                SUM(CASE WHEN m.status = 'ATIVA' THEN 1 ELSE 0 END) AS matriculados,
                SUM(CASE WHEN m.status = 'CONCLUIDA' THEN 1 ELSE 0 END) AS concluidos
            FROM cursos c
            LEFT JOIN matriculas m ON c.id = m.curso_id
            ${mentorCondWhere}
            GROUP BY c.id
            ORDER BY matriculados DESC
        `);

        // 3. Resumo Global de Notificações
        const [[notifKpi]] = await db.execute(`
            SELECT 
                SUM(CASE WHEN tipo_interacao = 'PESQUISA_TEXTO' THEN 1 ELSE 0 END) AS pesquisa,
                SUM(CASE WHEN tipo_interacao = 'AVALIACAO_ESTRELAS' THEN 1 ELSE 0 END) AS avaliacao,
                SUM(CASE WHEN tipo_interacao = 'NENHUM' THEN 1 ELSE 0 END) AS informativos
            FROM notificacoes n
            ${mentorCondNotif}
        `);

        // 4. Volume de Notificações Separadas por Curso
        const [notifCursos] = await db.execute(`
            SELECT c.titulo, COUNT(nc.notificacao_id) AS qtd
            FROM cursos c
            JOIN notificacao_cursos nc ON c.id = nc.curso_id
            ${mentorCondWhere}
            GROUP BY c.id
            ORDER BY qtd DESC
        `);

        // ==========================================
        // 5. Gráfico de Acessos (Com Filtro de Mentor para Admin)
        // ==========================================
        let queryGrafico = '';
        let paramsGrafico = [];

        if (isMentor) {
            // Mentor logado: vê apenas os alunos dele
            queryGrafico = `
                SELECT 
                    DATE_FORMAT(u.ultimo_acesso, '%Y-%m') as mes_ano, 
                    DAY(u.ultimo_acesso) as dia, 
                    COUNT(u.id) as total_acessos
                FROM usuarios u
                WHERE u.tipo = 'ALUNO' AND u.ultimo_acesso IS NOT NULL
                AND (u.criado_por_admin_id = ? OR u.id IN (
                    SELECT m.aluno_id FROM matriculas m JOIN cursos c ON m.curso_id = c.id WHERE c.criado_por_admin_id = ?
                ))
                GROUP BY mes_ano, dia
                ORDER BY mes_ano DESC, dia ASC
            `;
            paramsGrafico.push(adminId, adminId);
        } else {
            // Admin logado
            if (filtroMentorId) {
                // Admin selecionou um Mentor específico no filtro
                queryGrafico = `
                    SELECT 
                        DATE_FORMAT(u.ultimo_acesso, '%Y-%m') as mes_ano, 
                        DAY(u.ultimo_acesso) as dia, 
                        COUNT(u.id) as total_acessos
                    FROM usuarios u
                    WHERE u.tipo = 'ALUNO' AND u.ultimo_acesso IS NOT NULL
                    AND (u.criado_por_admin_id = ? OR u.id IN (
                        SELECT m.aluno_id FROM matriculas m JOIN cursos c ON m.curso_id = c.id WHERE c.criado_por_admin_id = ?
                    ))
                    GROUP BY mes_ano, dia
                    ORDER BY mes_ano DESC, dia ASC
                `;
                paramsGrafico.push(filtroMentorId, filtroMentorId);
            } else {
                // Admin vê o cenário Global
                queryGrafico = `
                    SELECT 
                        DATE_FORMAT(ultimo_acesso, '%Y-%m') as mes_ano, 
                        DAY(ultimo_acesso) as dia, 
                        COUNT(id) as total_acessos
                    FROM usuarios
                    WHERE tipo = 'ALUNO' AND ultimo_acesso IS NOT NULL
                    GROUP BY mes_ano, dia
                    ORDER BY mes_ano DESC, dia ASC
                `;
            }
        }

        const [acessosRaw] = await db.execute(queryGrafico, paramsGrafico);

        // Conversão dos dados SQL para a estrutura do Chart.js
        const mesesNomes = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        const dadosGrafico = {};

        acessosRaw.forEach(row => {
            const [ano, mesStr] = row.mes_ano.split('-');
            const mesIdx = parseInt(mesStr) - 1;
            const nomeMes = `${mesesNomes[mesIdx]} ${ano}`;

            if (!dadosGrafico[nomeMes]) {
                const diasNoMes = new Date(ano, mesIdx + 1, 0).getDate();
                dadosGrafico[nomeMes] = {
                    labels: Array.from({ length: diasNoMes }, (_, i) => `Dia ${i + 1}`),
                    data: Array(diasNoMes).fill(0)
                };
            }
            dadosGrafico[nomeMes].data[row.dia - 1] = row.total_acessos;
        });

        // Fallback: Se não houver dados, envia o mês atual zerado
        if (Object.keys(dadosGrafico).length === 0) {
            const hoje = new Date();
            const nm = `${mesesNomes[hoje.getMonth()]} ${hoje.getFullYear()}`;
            const dInM = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
            dadosGrafico[nm] = {
                labels: Array.from({ length: dInM }, (_, i) => `Dia ${i + 1}`),
                data: Array(dInM).fill(0)
            };
        }

        const renderAdminDashboardView = require('../../views/adminDashboardView');
        // Repassando mentores e o ID do filtro para a view
        res.send(renderAdminDashboardView(req.session.usuario, kpiGeral, cursosKpi, notifKpi, notifCursos, dadosGrafico, mentores, filtroMentorId));

    } catch (error) {
        console.error('Erro ao carregar Dashboard:', error);
        res.status(500).send('Erro interno ao carregar o painel.');
    }
});

module.exports = router;