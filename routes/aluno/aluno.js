// routes/alunoDashboard.js
const express = require('express');
const router = express.Router();
const db = require('../../db'); 
const bcrypt = require('bcrypt');

// Middlewares e Configurações
const { verificarAluno } = require('../../middlewares/authMiddleware');
const { uploadPerfil } = require('../../config/uploadConfig');

// Importação das Views
const renderAlunoDashboardView = require('../../views/alunoDashboardView');
const renderAlunoEditarPerfilView = require('../../views/alunoEditarPerfilView');
const renderAlunoConquistasView = require('../../views/alunoConquistasView');
const renderAlunoFavoritosView = require('../../views/alunoFavoritosView');

//------------------------------------------------------------------------------ROTAS DO ALUNO------------------------------------------------------------------------------
//DASHBOARD DO ALUNO
router.get('/aluno', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;

    try {
        // 1. Query principal: Calcula o TOTAL DE AULAS em tempo real direto da fonte
        const [cursosMatriculados] = await db.execute(`
            SELECT 
                c.id AS curso_id, 
                c.codigo_unico, 
                c.titulo, 
                c.capa_url, 
                COALESCE(p.percentual, 0) AS percentual,
                COALESCE(p.aulas_concluidas, 0) AS aulas_concluidas,
                (SELECT COUNT(a.id) FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE m.curso_id = c.id) AS total_aulas
            FROM matriculas m
            JOIN cursos c ON m.curso_id = c.id
            LEFT JOIN progresso_curso p ON p.matricula_id = m.id
            WHERE m.aluno_id = ? 
              AND m.status IN ('ATIVA', 'CONCLUIDA') 
              AND c.status = 'PUBLICADO'
            ORDER BY m.atualizado_em DESC
        `, [alunoId]);

        // LÓGICA DOS INDICADORES (KPIs) DO ALUNO

        // 2. Aulas Concluídas vs Total Geral
        const [aulasQuery] = await db.execute(`
            SELECT 
                SUM(COALESCE(p.aulas_concluidas, 0)) AS concluidas_geral,
                SUM((SELECT COUNT(a.id) FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE m.curso_id = c.id)) AS total_geral
            FROM matriculas m
            JOIN cursos c ON m.curso_id = c.id
            LEFT JOIN progresso_curso p ON p.matricula_id = m.id
            WHERE m.aluno_id = ? 
              AND m.status IN ('ATIVA', 'CONCLUIDA') 
              AND c.status = 'PUBLICADO'
        `, [alunoId]);

        const concluidasGeral = aulasQuery[0].concluidas_geral || 0;
        const totalGeral = aulasQuery[0].total_geral || 0;
        const stringAulasKpi = `${concluidasGeral} / ${totalGeral}`;

        // 3. Nota Média Geral
        const [notaQuery] = await db.execute(`
            SELECT AVG(max_nota) AS nota_media FROM (
                SELECT MAX(at.nota) AS max_nota 
                FROM avaliacao_tentativas at 
                JOIN matriculas m ON at.matricula_id = m.id 
                WHERE m.aluno_id = ? 
                GROUP BY at.aula_id
            ) AS subquery
        `, [alunoId]);

        const notaMediaRaw = notaQuery[0].nota_media;
        const notaMedia = notaMediaRaw ? parseFloat(notaMediaRaw).toFixed(1) : '0.0';

        // 4. Melhor Desempenho
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

        const melhoresCursos = melhorCursoQuery.length > 0 ? melhorCursoQuery[0].titulo : 'Ainda sem notas';

        // 5. Total de XP
        const [xpQuery] = await db.execute(`
            SELECT SUM(xp) as total_xp
            FROM matriculas
            WHERE aluno_id = ? AND status IN ('ATIVA', 'CONCLUIDA')
        `, [alunoId]);

        const totalXp = xpQuery[0].total_xp || 0;

        // 6. MOTOR DE AVALIAÇÃO DE CONQUISTAS (NOVO)
        let novaConquistaDetectada = null;

        // A) Busca as conquistas que o aluno já tem salvas para não repetir o modal
        const [conquistasSalvas] = await db.execute('SELECT conquista_id FROM aluno_conquistas WHERE aluno_id = ?', [alunoId]);
        const idsSalvos = conquistasSalvas.map(c => c.conquista_id);

        // B) Busca os cursos 100% concluídos para mapear as categorias usando apenas a coluna "mercado"
        const [cursosConcluidos] = await db.execute(`
            SELECT c.titulo, c.mercado FROM progresso_curso p
            JOIN matriculas m ON p.matricula_id = m.id 
            JOIN cursos c ON m.curso_id = c.id
            WHERE m.aluno_id = ? AND p.percentual >= 100
        `, [alunoId]);

        let countDesign = 0, countTech = 0, countNegocios = 0, countEscritorio = 0, countMarketing = 0, countIdiomas = 0;
        let motivoDesign = '', motivoTech = '', motivoNegocios = '', motivoEscritorio = '', motivoMarketing = '', motivoIdiomas = '';

        cursosConcluidos.forEach(curso => {
            const tags = (curso.mercado || '').toLowerCase();

            if (tags.includes('design')) {
                countDesign++;
                if (!motivoDesign) motivoDesign = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
            }
            if (tags.includes('tecnologia') || tags.includes('programação') || tags.includes('software')) {
                countTech++;
                if (!motivoTech) motivoTech = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
            }
            if (tags.includes('negócio') || tags.includes('negocio') || tags.includes('administração')) {
                countNegocios++;
                if (!motivoNegocios) motivoNegocios = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
            }
            if (tags.includes('escritório') || tags.includes('escritorio') || tags.includes('office')) {
                countEscritorio++;
                if (!motivoEscritorio) motivoEscritorio = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
            }
            if (tags.includes('marketing') || tags.includes('vendas')) {
                countMarketing++;
                if (!motivoMarketing) motivoMarketing = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
            }
            if (tags.includes('idioma') || tags.includes('inglês') || tags.includes('espanhol')) {
                countIdiomas++;
                if (!motivoIdiomas) motivoIdiomas = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
            }
        });

        // C) Define as Regras. O sistema cruza os KPIs atuais com as metas
        const regrasConquistas = [
            { id: 'aulas_1', titulo: 'Primeiros Passos', desc: 'Você concluiu a sua primeira aula.', icone: '🏃', atingiu: concluidasGeral >= 1 },
            { id: 'aulas_50', titulo: 'Estudante Focado', desc: 'Você concluiu 50 aulas.', icone: '📚', atingiu: concluidasGeral >= 50 },
            { id: 'aulas_100', titulo: 'Mestre da Maratona', desc: 'Você concluiu 100 aulas.', icone: '🔥', atingiu: concluidasGeral >= 100 },
            { id: 'xp_1000', titulo: 'Nível Bronze', desc: 'Você alcançou 1.000 XP.', icone: '🥉', atingiu: totalXp >= 1000 },
            { id: 'xp_5000', titulo: 'Nível Prata', desc: 'Você alcançou 5.000 XP.', icone: '🥈', atingiu: totalXp >= 5000 },
            { id: 'xp_10000', titulo: 'Nível Ouro', desc: 'Você alcançou 10.000 XP.', icone: '🥇', atingiu: totalXp >= 10000 },
            { id: 'xp_50000', titulo: 'Lenda Viva', desc: 'Você alcançou incríveis 50.000 XP.', icone: '👑', atingiu: totalXp >= 50000 },
            { id: 'cat_design', titulo: 'Artista Digital', desc: motivoDesign, icone: '🎨', atingiu: countDesign >= 1 },
            { id: 'cat_tech', titulo: 'Mago dos Códigos', desc: motivoTech, icone: '💻', atingiu: countTech >= 1 },
            { id: 'cat_negocios', titulo: 'Lobo de Wall Street', desc: motivoNegocios, icone: '📊', atingiu: countNegocios >= 1 },
            { id: 'cat_escritorio', titulo: 'Produtividade Máxima', desc: motivoEscritorio, icone: '🗂️', atingiu: countEscritorio >= 1 },
            { id: 'cat_marketing', titulo: 'Gênio da Persuasão', desc: motivoMarketing, icone: '📈', atingiu: countMarketing >= 1 },
            { id: 'cat_idiomas', titulo: 'Cidadão do Mundo', desc: motivoIdiomas, icone: '🗣️', atingiu: countIdiomas >= 1 }
        ];

        // D) Salva a nova conquista no banco e engatilha para o Front-End mostrar
        for (const regra of regrasConquistas) {
            // Se o aluno atingiu a meta E o ID não estiver nos idsSalvos do banco de dados:
            if (regra.atingiu && !idsSalvos.includes(regra.id)) {
                await db.execute('INSERT INTO aluno_conquistas (aluno_id, conquista_id, data_desbloqueio) VALUES (?, ?, NOW())', [alunoId, regra.id]);

                // Define apenas a primeira conquista detectada nesta requisição para não abrir vários modais ao mesmo tempo
                if (!novaConquistaDetectada) {
                    novaConquistaDetectada = { icone: regra.icone, titulo: regra.titulo, descricao: regra.desc };
                }
            }
        }

        // 7. Objeto final enviado para a View
        const kpiData = {
            notaMedia: notaMedia,
            aulasConcluidas: stringAulasKpi,
            melhoresCursos: melhoresCursos,
            totalXp: totalXp,
            novaConquista: novaConquistaDetectada // O front-end usa isto para disparar o Modal!
        };

        res.send(renderAlunoDashboardView(req.session.usuario, cursosMatriculados, kpiData));

    } catch (error) {
        console.error('Erro ao carregar dashboard do aluno:', error);
        res.status(500).send('<h1>Erro interno ao carregar seus cursos.</h1>');
    }
});

//FORMULÁRIO PARA EDITAR PERFIL
router.get('/aluno/perfil', verificarAluno, (req, res) => {
    res.send(renderAlunoEditarPerfilView(req.session.usuario));
});

//EDITAR PERFIL
router.post('/aluno/perfil', verificarAluno, uploadPerfil.single('foto_perfil'), async (req, res) => {
    const alunoId = req.session.usuario.id;
    const { nome, nova_senha } = req.body;

    // Se enviou foto nova usa ela, senão mantém a que já estava na sessão
    const foto_perfil_url = req.file ? '/img/perfil/' + req.file.filename : req.session.usuario.foto_perfil_url;

    try {
        if (nova_senha && nova_senha.trim() !== '') {
            const senhaHash = await bcrypt.hash(nova_senha, 10);
            await db.execute(
                'UPDATE usuarios SET nome = ?, senha_hash = ?, foto_perfil_url = ? WHERE id = ?',
                [nome, senhaHash, foto_perfil_url, alunoId]
            );
        } else {
            await db.execute(
                'UPDATE usuarios SET nome = ?, foto_perfil_url = ? WHERE id = ?',
                [nome, foto_perfil_url, alunoId]
            );
        }

        // ATUALIZA A SESSÃO EM TEMPO REAL
        req.session.usuario.nome = nome;
        req.session.usuario.foto_perfil_url = foto_perfil_url;

        // Redireciona de volta para o Dashboard
        res.redirect('/aluno');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar perfil.');
    }
});

//MURAL DE CONQUISTAS
router.get('/aluno/conquistas', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;

    try {
        // 1. Buscar total de aulas concluídas
        const [aulas] = await db.execute(`
            SELECT COUNT(*) as concluidas 
            FROM progresso_aula pa
            JOIN matriculas m ON pa.matricula_id = m.id
            WHERE m.aluno_id = ? AND pa.status = 'CONCLUIDA'
        `, [alunoId]);

        // 2. Buscar o total de XP
        const [xp] = await db.execute(`
            SELECT SUM(xp) as total_xp 
            FROM matriculas 
            WHERE aluno_id = ? AND status IN ('ATIVA', 'CONCLUIDA')
        `, [alunoId]);

        // 3. Buscar se ele tem a conquista especial do Mentor Bot
        const [conquistaBot] = await db.execute(`
            SELECT id FROM aluno_conquistas 
            WHERE aluno_id = ? AND conquista_id = 'desafio_mentor'
        `, [alunoId]);

        // 4. Buscar TODOS os cursos concluídos pelo aluno (Removido c.categoria)
        const [cursosConcluidos] = await db.execute(`
            SELECT c.titulo, c.mercado 
            FROM progresso_curso p
            JOIN matriculas m ON p.matricula_id = m.id
            JOIN cursos c ON m.curso_id = c.id
            WHERE m.aluno_id = ? AND p.percentual >= 100
        `, [alunoId]);

        // Estrutura inicial do progresso do aluno para enviar à View
        const progressoAtual = {
            totalAulas: aulas[0].concluidas || 0,
            xpTotal: xp[0].total_xp || 0,
            notaMaxMentorBot: conquistaBot.length > 0,
            cursosDesign: 0,
            cursosTech: 0,
            cursosNegocios: 0,
            cursosEscritorio: 0,
            cursosMarketing: 0,
            cursosIdiomas: 0,
            detalhes: {}
        };

        // 5. Mapeia os cursos concluídos para as categorias baseando-se na tag 'mercado'
        cursosConcluidos.forEach(curso => {
            // Pegamos o mercado e convertemos para minúsculo para facilitar a comparação
            const tagsDoCurso = (curso.mercado || '').toLowerCase();

            // --- TECNOLOGIA ---
            if (tagsDoCurso.includes('tecnologia') || tagsDoCurso.includes('programação') || tagsDoCurso.includes('software')) {
                progressoAtual.cursosTech++;
                if (!progressoAtual.detalhes['cat_tech']) {
                    progressoAtual.detalhes['cat_tech'] = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
                }
            }

            // --- NEGÓCIOS ---
            if (tagsDoCurso.includes('negócio') || tagsDoCurso.includes('negocio') || tagsDoCurso.includes('administração')) {
                progressoAtual.cursosNegocios++;
                if (!progressoAtual.detalhes['cat_negocios']) {
                    progressoAtual.detalhes['cat_negocios'] = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
                }
            }

            // --- ESCRITÓRIO ---
            if (tagsDoCurso.includes('escritório') || tagsDoCurso.includes('escritorio') || tagsDoCurso.includes('office')) {
                progressoAtual.cursosEscritorio++;
                if (!progressoAtual.detalhes['cat_escritorio']) {
                    progressoAtual.detalhes['cat_escritorio'] = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
                }
            }

            // --- DESIGN ---
            if (tagsDoCurso.includes('design')) {
                progressoAtual.cursosDesign++;
                if (!progressoAtual.detalhes['cat_design']) {
                    progressoAtual.detalhes['cat_design'] = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
                }
            }

            // --- MARKETING ---
            if (tagsDoCurso.includes('marketing') || tagsDoCurso.includes('vendas')) {
                progressoAtual.cursosMarketing++;
                if (!progressoAtual.detalhes['cat_marketing']) {
                    progressoAtual.detalhes['cat_marketing'] = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
                }
            }

            // --- IDIOMAS ---
            if (tagsDoCurso.includes('idioma') || tagsDoCurso.includes('inglês') || tagsDoCurso.includes('espanhol')) {
                progressoAtual.cursosIdiomas++;
                if (!progressoAtual.detalhes['cat_idiomas']) {
                    progressoAtual.detalhes['cat_idiomas'] = `Você desbloqueou esta conquista porque concluiu o curso: ${curso.titulo}.`;
                }
            }
        });

        // Envia o objeto montado para a View
        const renderAlunoConquistasView = require('../views/alunoConquistasView');
        res.send(renderAlunoConquistasView(req.session.usuario, progressoAtual));

    } catch (err) {
        console.error('Erro ao carregar conquistas:', err);
        res.status(500).send("Erro interno ao carregar o mural de conquistas.");
    }
});

//GARANTE QUE, SE O ALUNO TIROU UMA BOA NOTA NO MENTOR BOT, A CONQUISTA DELE SEJA COMPUTADA
router.post('/aluno/api/conquistas/mentor-bot', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;

    try {
        // Tenta registar ou verificar se o aluno já tem a conquista
        // O ideal é você ter uma tabela 'aluno_conquistas' (aluno_id, conquista_id, data_desbloqueio)

        const [existente] = await db.execute(
            'SELECT id FROM aluno_conquistas WHERE aluno_id = ? AND conquista_id = ?',
            [alunoId, 'desafio_mentor']
        );

        if (existente.length === 0) {
            // Se não tinha a conquista ainda, salva no banco!
            await db.execute(
                'INSERT INTO aluno_conquistas (aluno_id, conquista_id, data_desbloqueio) VALUES (?, ?, NOW())',
                [alunoId, 'desafio_mentor']
            );
            return res.json({ success: true, nova: true, message: "Conquista desbloqueada!" });
        }

        // Se já tinha, não faz nada mas retorna sucesso
        res.json({ success: true, nova: false, message: "Conquista já estava desbloqueada." });

    } catch (error) {
        console.error('Erro ao salvar conquista:', error);
        res.status(500).json({ success: false, error: 'Erro interno' });
    }
});

//RANKING DE ALUNOS POR CURSO
router.get('/aluno/api/ranking/:cursoId', verificarAluno, async (req, res) => {
    const cursoId = req.params.cursoId;

    // Pega o ID do aluno logado
    const alunoLogadoId = req.session.usuario.id;

    try {
        // ATENÇÃO: Mudei para JOIN usuarios u (Se a sua tabela for "alunos", mude u para a e usuarios para alunos)
        const [alunos] = await db.execute(`
            SELECT 
                u.id AS aluno_id,
                u.nome,
                COALESCE(m.xp, 0) AS xp
            FROM matriculas m
            JOIN usuarios u ON m.aluno_id = u.id
            WHERE m.curso_id = ? 
              AND m.status IN ('ATIVA', 'CONCLUIDA')
            ORDER BY m.xp DESC, m.atualizado_em ASC
            LIMIT 10
        `, [cursoId]);

        const rankingMapeado = alunos.map((a, index) => {
            // Formata o nome "João da Silva" para "João S."
            const partesNome = a.nome.trim().split(' ');
            let nomeFormatado = partesNome[0];
            if (partesNome.length > 1) {
                nomeFormatado += ' ' + partesNome[partesNome.length - 1].charAt(0) + '.';
            }

            const isCurrentUser = a.aluno_id === alunoLogadoId;

            return {
                pos: index + 1,
                nome: isCurrentUser ? `${nomeFormatado} (Você)` : nomeFormatado,
                xp: a.xp,
                trend: isCurrentUser && a.xp > 0 ? 'up' : 'flat',
                isUser: isCurrentUser
            };
        });

        res.json({ success: true, ranking: rankingMapeado });

    } catch (error) {
        // ISTO VAI MOSTRAR O ERRO REAL NO SEU TERMINAL (VS Code / CMD)
        console.error('=========================================');
        console.error('ERRO NA ROTA DE RANKING:');
        console.error(error.message);
        console.error('=========================================');

        res.status(500).json({ success: false, error: 'Erro interno ao gerar ranking.' });
    }
});

//FAVORITOS
router.get('/aluno/favoritos', verificarAluno, async (req, res) => {
    const aluno = req.session.usuario;
    try {
        // Busca os cursos que o aluno favoritou
        const [cursosFavoritos] = await db.execute(`
            SELECT c.id, c.titulo, c.descricao, c.capa_url, c.duracao_horas, c.conclusao_dias, c.preco
            FROM favoritos f
            JOIN cursos c ON f.curso_id = c.id
            WHERE f.aluno_id = ? AND c.status = 'PUBLICADO'
            ORDER BY f.criado_em DESC
        `, [aluno.id]);

        const renderAlunoFavoritosView = require('../views/alunoFavoritosView');
        res.send(renderAlunoFavoritosView(aluno, cursosFavoritos));
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        res.status(500).send('Erro interno ao carregar a página de favoritos.');
    }
});

//ADICIONAR/REMOVER FAVORITOS DO ALUNO
router.post('/aluno/api/favoritos/toggle', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const { curso_id } = req.body;

    try {
        // Verifica se já existe nos favoritos
        const [existente] = await db.execute('SELECT * FROM favoritos WHERE aluno_id = ? AND curso_id = ?', [alunoId, curso_id]);

        if (existente.length > 0) {
            // Se já tem, REMOVE (Desfavoritar)
            await db.execute('DELETE FROM favoritos WHERE aluno_id = ? AND curso_id = ?', [alunoId, curso_id]);
            res.json({ success: true, acao: 'removido' });
        } else {
            // Se não tem, ADICIONA (Favoritar)
            await db.execute('INSERT INTO favoritos (aluno_id, curso_id) VALUES (?, ?)', [alunoId, curso_id]);
            res.json({ success: true, acao: 'adicionado' });
        }
    } catch (error) {
        console.error('Erro ao favoritar curso:', error);
        res.status(500).json({ success: false, error: 'Erro ao atualizar favoritos.' });
    }
});

//LISTA OS CERTIFICADOS DO ALUNO
router.get('/aluno/certificados', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;

    try {
        // O segredo está no LEFT JOIN certificados: 
        // Mostra o curso mesmo que o certificado ainda não exista (Em Andamento)
        const [certificados] = await db.execute(`
            SELECT 
                c.titulo AS curso_titulo,
                c.certificado_template_url,
                cert.id AS certificado_id,
                cert.emitido_em,
                COALESCE(cert.token, 'AGUARDANDO CONCLUSÃO') AS token
            FROM matriculas m
            JOIN cursos c ON m.curso_id = c.id
            LEFT JOIN certificados cert ON cert.matricula_id = m.id
            WHERE m.aluno_id = ? 
              AND m.status IN ('ATIVA', 'CONCLUIDA')
              AND c.status = 'PUBLICADO'
            ORDER BY m.atualizado_em DESC
        `, [alunoId]);

        // Certifique-se de importar a view (pode estar no topo do ficheiro)
        const renderAlunoCertificadosView = require('../views/alunoCertificadosView');
        res.send(renderAlunoCertificadosView(req.session.usuario, certificados));

    } catch (error) {
        console.error('Erro ao carregar certificados do aluno:', error);
        res.status(500).send('Erro interno ao carregar a página de certificados.');
    }
});

//GERAR PDF DO CERTIFICADO DO ALUNO
router.get('/aluno/certificados/:id/download', verificarAluno, async (req, res) => {
    const certId = req.params.id;
    const alunoId = req.session.usuario.id;
    const nomeAluno = req.session.usuario.nome;

    try {
        // 1. Validar se o certificado existe, pertence ao aluno logado e se o curso foi concluído
        const [dadosCertificado] = await db.execute(`
            SELECT cert.token, cert.emitido_em, c.titulo, c.certificado_template_url
            FROM certificados cert
            JOIN matriculas m ON cert.matricula_id = m.id
            JOIN cursos c ON m.curso_id = c.id
            WHERE cert.id = ? AND m.aluno_id = ? AND cert.emitido_em IS NOT NULL
        `, [certId, alunoId]);

        if (dadosCertificado.length === 0) {
            return res.status(403).send('<h2>Certificado não disponível ou acesso negado.</h2>');
        }

        const cert = dadosCertificado[0];
        const dataFormatada = new Date(cert.emitido_em).toLocaleDateString('pt-BR');

        // 2. Configurar o Motor de PDF (Formato Paisagem / A4)
        const doc = new PDFDocument({
            size: 'A4',
            layout: 'landscape',
            margin: 0
        });

        // Configura o navegador para fazer o download automático do PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Certificado_${cert.titulo.replace(/\s+/g, '_')}.pdf"`);
        doc.pipe(res);

        // 3. Desenhar o Fundo (Template salvo pelo Admin)
        if (cert.certificado_template_url) {
            const imgPath = path.join(__dirname, '..', 'public', cert.certificado_template_url);
            if (fs.existsSync(imgPath)) {
                // Dimensões exatas de um papel A4 em modo paisagem (pontos PDF)
                doc.image(imgPath, 0, 0, { width: 841.89, height: 595.28 });
            }
        }

        // 4. Carimbar os Dados (Nome, Data e Token)
        // Posicionamentos Y (vertical) são estimativas genéricas para um certificado centralizado.
        doc.fillColor('#333333')
            .font('Helvetica-Bold')
            .fontSize(40)
            .text(nomeAluno, 0, 260, { align: 'center', width: 841.89 });

        doc.fillColor('#555555')
            .font('Helvetica')
            .fontSize(16)
            .text(`Concluiu o curso de ${cert.titulo} no dia ${dataFormatada}`, 0, 320, { align: 'center', width: 841.89 });

        doc.fillColor('#777777')
            .fontSize(12)
            .text(`Código de Verificação de Autenticidade: ${cert.token}`, 0, 520, { align: 'center', width: 841.89 });

        // 5. Finalizar e fechar o ficheiro
        doc.end();

    } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        res.status(500).send('<h1>Erro interno ao gerar o documento.</h1>');
    }
});

module.exports = router;