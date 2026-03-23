const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const db = require('./db'); // Importando a conexão com o banco
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');
// Lembre-se que você já tem o 'fs' e 'path' importados das etapas anteriores.

const renderCadastroView = require('./views/cadastroView');
const renderAdminDashboardView = require('./views/adminDashboardView');
const crypto = require('crypto');
const renderNovoCursoView = require('./views/novoCursoView');
const renderCursoDetalhesView = require('./views/cursoDetalhesView');
const renderEditarCursoView = require('./views/editarCursoView');
const renderNovoModuloView = require('./views/novoModuloView');
const renderNovaAulaView = require('./views/novaAulaView');
const renderEditarModuloView = require('./views/editarModuloView');
const renderEditarAulaView = require('./views/editarAulaView');
const renderAdminUsuariosView = require('./views/adminUsuariosView');
const renderNovoUsuarioView = require('./views/novoUsuarioView');
const renderEditarUsuarioView = require('./views/editarUsuarioView');
const renderAlunoDashboardView = require('./views/alunoDashboardView');
const renderAlunoCertificadosView = require('./views/alunoCertificadosView');
const renderAlunoSalaAulaView = require('./views/alunoSalaAulaView');
const renderValidarCertificadoView = require('./views/validarCertificadoView');
const renderAlunoEditarPerfilView = require('./views/alunoEditarPerfilView');
const renderAdminCursosView = require('./views/adminCursosView');
const renderAdminNovaNotificacaoView = require('./views/adminNovaNotificacaoView');
const renderAdminNotificacoesView = require('./views/adminNotificacoesView');
const renderForumIndexView = require('./views/forumIndexView');
const renderForumNovoTopicoView = require('./views/forumNovoTopicoView');
const renderForumTopicoView = require('./views/forumTopicoView');
const renderAdminIntegracoesView = require('./views/renderAdminIntegracoesView');
const renderHomeView = require('./views/homeView');
const renderCursoPublicoView = require('./views/cursoPublicoView')

const app = express();
const port = 3000;

// Configuração do Multer para salvar na pasta public/img/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/'); // Certifique-se de que a pasta public/img existe!
    },
    filename: function (req, file, cb) {
        // Gera um nome único para não sobrescrever imagens com o mesmo nome
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'capa-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Configuração do Multer para os Conteúdos da Aula (salva em public/uploads/)
const storageAula = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Crie esta pasta na raiz do projeto!
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Ex: video-1612345678-123.mp4
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadAula = multer({ storage: storageAula });

// Configuração do Multer para Fotos de Perfil
const storagePerfil = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/perfil/'); // Crie esta pasta!
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'perfil-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadPerfil = multer({ storage: storagePerfil });

// Configuração para receber materiais complementares das aulas
const uploadMaterialAula = multer({ dest: path.join(__dirname, 'public/uploads/materiais/') });

// Configuração do Multer para os Prints do Fórum
const storageForum = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/img/forum/'); // Lembre-se de criar esta pasta!
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'print-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadForum = multer({ storage: storageForum });

// ==========================================
// Configuração do Multer para Modelos de Currículo
// ==========================================
const storageCV = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/'); // Salva no diretório correto
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // O ficheiro ganha o nome exato do campo (Ex: 'capa-1234.png' ou 'arquivo_docx-1234.docx')
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const uploadCV = multer({ storage: storageCV });

// Configurações do Express
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// Configuração de Sessão
app.use(session({
    secret: 'chave_secreta_onstude_super_segura', // Em produção, use variáveis de ambiente (.env)
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // secure: true apenas se estiver usando HTTPS
}));

// Importando as Views
const renderLoginView = require('./views/loginView');

const uploadNotificacao = multer({ dest: path.join(__dirname, 'public/img/notificacoes/') });

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ==========================================
// PÁGINA INICIAL (LANDING PAGE)
// ==========================================
app.get('/', async (req, res) => {
    try {
       // Busca até 10 cursos públicos aleatoriamente para o slider
        const [cursos] = await db.execute(`
            SELECT id, titulo, descricao, capa_url, duracao_horas, conclusao_dias, preco, mercado 
            FROM cursos 
            WHERE status = 'PUBLICADO' 
            ORDER BY RAND() 
            LIMIT 10
        `);

        // Certifique-se de que o require está no topo do seu app.js, ou chame-o aqui:
        const renderHomeView = require('./views/homeView');
        res.send(renderHomeView(req.session.usuario || null, cursos));
    } catch (error) {
        console.error('Erro ao carregar a página inicial:', error);
        res.status(500).send('Erro interno ao carregar a plataforma.');
    }
});

// ==========================================
// PÁGINA: PLANO DE CARREIRA (GERADOR DE CV)
// ==========================================
app.get('/plano-de-carreira', async (req, res) => {
    try {
        // Busca os modelos na tabela que criámos
        const [modelosCV] = await db.execute('SELECT * FROM curriculo_modelos ORDER BY id DESC');
        
        const renderPlanoCarreiraView = require('./views/planoCarreiraView');
        // Passa os modelosCV para a view
        res.send(renderPlanoCarreiraView(req.session.usuario || null, modelosCV));
    } catch (error) {
        console.error('Erro ao carregar Plano de Carreira:', error);
        res.status(500).send('Erro interno.');
    }
});

// ==========================================
// PÁGINA: PLANO DE CARREIRA (GERADOR DE CV)
// ==========================================
// GET: Renderiza a página (AGORA BUSCANDO DO BANCO REAL)
app.get('/plano-de-carreira', async (req, res) => {
    try {
        const [modelosCV] = await db.execute('SELECT * FROM curriculo_modelos ORDER BY id DESC');
        const renderPlanoCarreiraView = require('./views/planoCarreiraView');
        res.send(renderPlanoCarreiraView(req.session.usuario || null, modelosCV));
    } catch (error) {
        console.error('Erro ao carregar Plano de Carreira:', error);
        res.status(500).send('Erro interno.');
    }
});

// POST: Recebe os dados em JSON e devolve o PDF gerado pelo PDFKit
app.post('/plano-de-carreira/gerar-pdf', async (req, res) => {
    try {
        const dados = req.body;
        
        // Inicializa o documento A4 com margens padrão
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        const nomeArquivo = `Curriculo_${dados.nome.replace(/\s+/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);

        doc.pipe(res);

        // =================================
        // TEMA E PALETA DE CORES (Executivo)
        // =================================
        const corPrimaria = '#2C3E50'; // Grafite / Azul muito escuro para títulos e destaques
        const corTexto = '#333333';    // Cinza escuro para o texto principal
        const corSecundaria = '#7F8C8D'; // Cinza médio para datas e informações secundárias
        const corLinha = '#BDC3C7';    // Cinza claro para as linhas divisórias

        // =================================
        // DESENHO DO PDF (DESIGN)
        // =================================

        // 1. Cabeçalho (Nome e Contatos)
        doc.fontSize(22).font('Helvetica-Bold').fillColor(corPrimaria).text(dados.nome.toUpperCase(), { align: 'center' });
        doc.moveDown(0.3);
        
        // Organiza os contatos numa única linha elegante
        let contatos = [];
        if (dados.cidade) {
            let local = dados.bairro ? `${dados.bairro}, ${dados.cidade}` : dados.cidade;
            contatos.push(local);
        }
        if (dados.telefone1) {
            let tel = dados.telefone1;
            if (dados.telefone2) tel += ` / ${dados.telefone2}`;
            contatos.push(tel);
        }
        if (dados.email) contatos.push(dados.email);

        doc.fontSize(10).font('Helvetica').fillColor(corSecundaria).text(contatos.join('   |   '), { align: 'center' });
        doc.moveDown(2.5);

        // Função auxiliar para desenhar o título das seções de forma profissional
        const desenharSessao = (titulo) => {
            doc.fontSize(12).font('Helvetica-Bold').fillColor(corPrimaria).text(titulo.toUpperCase());
            doc.moveDown(0.2);
            // Linha muito fina (0.5) e clara
            doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor(corLinha).lineWidth(0.5).stroke();
            doc.moveDown(0.8);
        };

        // 2. Apresentação
        if (dados.resumo) {
            desenharSessao('Resumo Profissional');
            doc.fontSize(10).font('Helvetica').fillColor(corTexto).text(dados.resumo, { align: 'justify', lineGap: 3 });
            doc.moveDown(1.5);
        }

        // 3. Experiências Profissionais
        if (dados.experiencias && dados.experiencias.length > 0) {
            desenharSessao('Experiência Profissional');
            
            dados.experiencias.forEach(e => {
                // Truque: Cargo à esquerda, Período alinhado à direita na mesma linha
                doc.fontSize(11).font('Helvetica-Bold').fillColor(corPrimaria).text(e.cargo, { continued: true });
                if (e.periodo) {
                    doc.font('Helvetica-Oblique').fillColor(corSecundaria).text(`     ${e.periodo}`, { align: 'right' });
                } else {
                    doc.text('', { align: 'right' }); // Quebra de linha de segurança
                }

                // Empresa
                doc.fontSize(10).font('Helvetica-Bold').fillColor(corTexto).text(e.empresa);
                doc.moveDown(0.3);

                // Descrição das atividades
                if (e.descricao) {
                    doc.fontSize(10).font('Helvetica').fillColor(corTexto).text(e.descricao, { align: 'justify', lineGap: 2 });
                }
                doc.moveDown(1.2); // Espaço entre experiências
            });
        }

        // 4. Formação Acadêmica
        if (dados.formacao && dados.formacao.length > 0) {
            desenharSessao('Formação Acadêmica');
            
            dados.formacao.forEach(f => {
                // Monta o título dinâmico (Ex: "Graduação em ADS" ou só "Ensino Médio")
                let tituloFormacao = f.nivel;
                if (f.curso && f.curso.trim() !== '') {
                    // Se for ensino médio, não precisa do "em", só um hífen. Se for graduação/técnico, usa "em"
                    if (f.nivel === 'Ensino Fundamental' || f.nivel === 'Ensino Médio') {
                        tituloFormacao += ` - ${f.curso}`;
                    } else {
                        tituloFormacao += ` em ${f.curso}`;
                    }
                }

                // Nível e Curso do lado esquerdo, Status/Ano do lado direito
                doc.fontSize(11).font('Helvetica-Bold').fillColor(corPrimaria).text(tituloFormacao, { continued: true });
                
                let compl = [];
                if (f.status) compl.push(f.status);
                if (f.ano) compl.push(f.ano);
                
                if (compl.length > 0) {
                     doc.font('Helvetica-Oblique').fillColor(corSecundaria).text(`     ${compl.join(' - ')}`, { align: 'right' });
                } else {
                    doc.text('', { align: 'right' });
                }

                doc.fontSize(10).font('Helvetica').fillColor(corTexto).text(f.instituicao);
                doc.moveDown(0.8);
            });
            doc.moveDown(0.5);
        }

        // 5. Cursos e Aprimorações
        if (dados.cursos && dados.cursos.length > 0) {
            desenharSessao('Cursos e Qualificações');
            
            dados.cursos.forEach(c => {
                doc.fontSize(10).font('Helvetica-Bold').fillColor(corPrimaria).text(c.nome, { continued: true });
                
                let detalhes = [];
                if (c.instituicao) detalhes.push(c.instituicao);
                if (c.status) detalhes.push(c.status);
                if (c.ano) detalhes.push(c.ano);

                if (detalhes.length > 0) {
                     // Adiciona os detalhes na mesma linha com cor mais suave
                     doc.font('Helvetica').fillColor(corTexto).text(`   |   ${detalhes.join(' - ')}`);
                } else {
                    doc.text('');
                }
                doc.moveDown(0.3);
            });
        }

        // Finaliza o documento (dispara o download para o cliente)
        doc.end();

    } catch (error) {
        console.error('Erro ao gerar PDF do Currículo:', error);
        res.status(500).send('Erro ao gerar o PDF.');
    }
});

// GET: Página dedicada à Gestão de Currículos
app.get('/admin/curriculos', verificarAdmin, async (req, res) => {
    try {
        const [modelosCV] = await db.execute('SELECT * FROM curriculo_modelos ORDER BY id DESC');
        
        const renderAdminCurriculosView = require('./views/adminCurriculosView');
        res.send(renderAdminCurriculosView(req.session.usuario, modelosCV));
    } catch (error) {
        console.error('Erro ao carregar Gestão de Currículos:', error);
        res.status(500).send('Erro interno ao carregar a página.');
    }
});

// ==========================================
// ADMIN: GESTÃO DE MODELOS DE CURRÍCULO
// ==========================================

// POST: Criar novo Modelo de CV
app.post('/admin/curriculos/novo', verificarAdmin, uploadCV.fields([{ name: 'capa' }, { name: 'arquivo_docx' }]), async (req, res) => {
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

// POST: Editar Modelo de CV
app.post('/admin/curriculos/:id/editar', verificarAdmin, uploadCV.fields([{ name: 'capa' }, { name: 'arquivo_docx' }]), async (req, res) => {
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

// POST: Excluir Modelo de CV
app.post('/admin/curriculos/:id/excluir', verificarAdmin, async (req, res) => {
    try {
        await db.execute('DELETE FROM curriculo_modelos WHERE id = ?', [req.params.id]);
        res.redirect('/admin?aba=curriculos');
    } catch (error) {
        console.error('Erro ao excluir modelo CV:', error);
        res.status(500).send('Erro interno.');
    }
});

// ==========================================
// PÁGINA DE DETALHES DO CURSO (PÚBLICA / VITRINE)
// ==========================================
app.get('/cursos/:id', async (req, res) => {
    const cursoId = req.params.id;
    const usuarioLogado = req.session.usuario || null;

    try {
        const [cursos] = await db.execute('SELECT * FROM cursos WHERE id = ? AND status = "PUBLICADO"', [cursoId]);

        if (cursos.length === 0) {
            return res.status(404).send('Curso não encontrado ou indisponível.');
        }

        const curso = cursos[0];

        const [modulos] = await db.execute('SELECT * FROM modulos WHERE curso_id = ? ORDER BY ordem ASC', [cursoId]);
        const [aulas] = await db.execute(`
            SELECT a.* FROM aulas a 
            JOIN modulos m ON a.modulo_id = m.id 
            WHERE m.curso_id = ? ORDER BY a.ordem ASC
        `, [cursoId]);

        const cronograma = modulos.map(mod => {
            return {
                ...mod,
                aulas: aulas.filter(aula => aula.modulo_id === mod.id)
            };
        });

        let isMatriculado = false;
        if (usuarioLogado && usuarioLogado.tipo === 'ALUNO') {
            const [matriculas] = await db.execute('SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ?', [usuarioLogado.id, cursoId]);
            if (matriculas.length > 0) isMatriculado = true;
        }

        // AQUI ESTÁ A CORREÇÃO (NOVO NOME DA VIEW)
        const renderCursoPublicoView = require('./views/cursoPublicoView');
        res.send(renderCursoPublicoView(usuarioLogado, curso, cronograma, isMatriculado));

    } catch (error) {
        console.error('Erro ao carregar detalhes do curso:', error);
        res.status(500).send('Erro interno ao carregar o curso.');
    }
});

// GET: Renderiza a tela de login (Apenas o /login agora!)
app.get('/login', (req, res) => {
    const returnTo = req.query.returnTo || '';

    if (req.session.usuario) {
        if (returnTo && returnTo.startsWith('/')) return res.redirect(returnTo);
        return res.redirect(req.session.usuario.tipo === 'ADMIN' ? '/admin' : '/aluno');
    }

    // O seu renderLoginView já está preparado para receber isto
    const renderLoginView = require('./views/loginView');
    res.send(renderLoginView(null, returnTo));
});

// POST: Processar Login
app.post('/login', async (req, res) => {
    // 3. AQUI ESTÁ O SEGREDO: Extrair o returnTo do body (que veio do input hidden)
    const { email, senha, returnTo } = req.body;

    try {
        const [usuarios] = await db.execute('SELECT * FROM usuarios WHERE email = ?', [email]);

        if (usuarios.length === 0) {
            return res.send(renderLoginView('E-mail ou senha incorreta.', returnTo));
        }

        const usuario = usuarios[0];
        const match = await bcrypt.compare(senha, usuario.senha_hash);

        if (!match) {
            return res.send(renderLoginView('E-mail ou senha incorreta.', returnTo));
        }

        if (usuario.status !== 'ATIVO') {
            return res.send(renderLoginView('Sua conta está inativa ou bloqueada.', returnTo));
        }

        await db.execute('UPDATE usuarios SET ultimo_acesso = NOW() WHERE id = ?', [usuario.id]);

        usuario.ultimo_acesso = new Date();
        req.session.usuario = usuario;

        // ==========================================
        // 4. REDIRECIONAMENTO INTELIGENTE
        // ==========================================
        // Se a variável returnTo existir e for um link interno (começa com /)
        if (returnTo && returnTo.startsWith('/')) {
            res.redirect(returnTo);
        } else if (usuario.tipo === 'ADMIN') {
            res.redirect('/admin');
        } else {
            res.redirect('/aluno');
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.send(renderLoginView('Erro interno ao processar o login. Tente novamente.', returnTo));
    }
});

// GET: Tela dedicada de Gerenciamento de Cursos
app.get('/admin/cursos', verificarAdmin, async (req, res) => {
    try {
        const [cursos] = await db.execute('SELECT * FROM cursos ORDER BY criado_em DESC');
        res.send(renderAdminCursosView(req.session.usuario, cursos));
    } catch (error) {
        console.error('Erro ao listar cursos:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// ==========================================
// ROTAS DE REGISTO (CADASTRO PÚBLICO)
// ==========================================

// GET: Renderiza a página de registo
app.get('/cadastro', (req, res) => {
    res.send(renderCadastroView());
});

// POST: Processa o formulário e insere o novo aluno no banco
app.post('/cadastro', async (req, res) => {
    // Adicionado o campo data_nascimento na extração
    const { nome, email, senha, telefone, cidade, estado, data_nascimento } = req.body;

    try {
        // 1. Verificar se o e-mail já existe na base de dados
        const [usuariosExistentes] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);

        if (usuariosExistentes.length > 0) {
            // E-mail já está em uso, recarrega a view enviando a mensagem de erro
            return res.send(renderCadastroView('Este e-mail já está registado. Por favor, faça login.'));
        }

        // 2. Criar o hash da palavra-passe para segurança
        const senhaHash = await bcrypt.hash(senha, 10);

        // 3. Inserir o novo utilizador garantindo a role 'ALUNO' (Adicionada a data_nascimento)
        await db.execute(
            `INSERT INTO usuarios (tipo, nome, email, senha_hash, telefone, cidade, estado, status, data_nascimento) 
             VALUES ('ALUNO', ?, ?, ?, ?, ?, ?, 'ATIVO', ?)`,
            [nome, email, senhaHash, telefone, cidade, estado, data_nascimento || null]
        );

        // 4. Registo bem-sucedido! Redirecionar para o login
        // (Futuramente podemos redirecionar para o login com uma mensagem de sucesso)
        res.redirect('/');

    } catch (error) {
        console.error('Erro ao registar aluno:', error);
        res.send(renderCadastroView('Ocorreu um erro interno. Tente novamente mais tarde.'));
    }
});

// ==========================================
// ROTAS DO ADMIN
// ==========================================

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

// ==========================================
// WEBHOOK: RECEBER VAGAS DO SITE ECOCAIXAS
// ==========================================

app.post('/api/webhooks/vagas', async (req, res) => {
    // 1. Camada de Segurança: Apenas a Ecocaixas sabe esta chave!
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== 'CHAVE_SECRETA_ONSTUDE_ECOCAIXAS_2024') {
        return res.status(401).json({ error: 'Acesso negado. Chave API inválida.' });
    }

    // 2. Extrai os dados da vaga que a Ecocaixas enviou
    const { titulo, mensagem, link_url, imagem_url } = req.body;

    if (!titulo || !link_url) {
        return res.status(400).json({ error: 'Título e Link da vaga são obrigatórios.' });
    }

    try {
        // 3. Insere a vaga como uma Notificação Global no OnStude
        const [resultNotificacao] = await db.execute(
            `INSERT INTO notificacoes (titulo, mensagem, link_url, imagem_url, tipo_interacao, tipo_alvo, criada_por_admin_id) 
             VALUES (?, ?, ?, ?, 'NENHUM', 'TODOS', NULL)`,
            [
                titulo,
                mensagem || 'Nova oportunidade de emprego disponível! Clique para ver os detalhes.',
                link_url,
                imagem_url || null
            ]
        );

        const notificacaoId = resultNotificacao.insertId;

        // 4. Distribui a vaga para TODOS os alunos ativos instantaneamente
        await db.execute(
            `INSERT IGNORE INTO notificacao_entregas (notificacao_id, aluno_id, status)
             SELECT ?, id, 'PENDENTE' FROM usuarios WHERE tipo = 'ALUNO' AND status = 'ATIVO'`,
            [notificacaoId]
        );

        res.status(200).json({ success: true, message: 'Vaga processada!' });

    } catch (error) {
        console.error('Erro ao processar webhook da Ecocaixas:', error);
        res.status(500).json({ error: 'Erro interno no servidor do OnStude.' });
    }
});

// GET: Tela de Integrações e APIs (Admin)
app.get('/admin/integracoes', verificarAdmin, (req, res) => {
    // No futuro, esta chave pode vir do banco de dados ou ficheiro .env
    const configIntegracao = {
        webhookUrl: 'http://localhost:3000/api/webhooks/vagas', // Mude para o seu domínio em produção
        apiKey: 'CHAVE_SECRETA_ONSTUDE_ECOCAIXAS_2024',
        status: 'ATIVO'
    };

    // Precisará importar a view no topo do app.js: 
    res.send(renderAdminIntegracoesView(req.session.usuario, configIntegracao));
});

// ==========================================
// ROTAS DE GESTÃO DE CURSOS (ADMIN)
// ==========================================

// GET: Renderiza o formulário de criação de curso
app.get('/admin/cursos/novo', verificarAdmin, (req, res) => {
    res.send(renderNovoCursoView(req.session.usuario));
});

// POST: Processa a criação de um novo curso
app.post('/admin/cursos/novo', verificarAdmin, upload.fields([
    { name: 'capa', maxCount: 1 },
    { name: 'certificado_template', maxCount: 1 }
]), async (req, res) => {
    // Agora extraímos preco e desconto_percentual
    const { titulo, descricao, status, mercado, duracao_horas, conclusao_dias, preco, desconto_percentual } = req.body;
    const adminId = req.session.usuario.id;

    const arquivos = req.files || {};
    const capa_url = arquivos['capa'] ? '/img/' + arquivos['capa'][0].filename : null;
    const certificado_template_url = arquivos['certificado_template'] ? '/img/' + arquivos['certificado_template'][0].filename : null;

    const codigoAleatorio = require('crypto').randomBytes(3).toString('hex').toUpperCase();
    const codigoUnico = `ONST-${codigoAleatorio}`;

    // Tratamento dos campos
    const mercadoTratado = mercado && mercado.trim() !== '' ? mercado.trim() : null;
    const duracaoTratada = duracao_horas ? parseInt(duracao_horas) : null;
    const conclusaoTratada = conclusao_dias ? parseInt(conclusao_dias) : null;

    // Tratamento Financeiro
    const precoTratado = preco ? parseFloat(preco.replace(',', '.')) : 0.00;
    const descontoTratado = desconto_percentual ? parseInt(desconto_percentual) : 0;

    try {
        const [resultadoCurso] = await db.execute(
            `INSERT INTO cursos (codigo_unico, titulo, descricao, capa_url, certificado_template_url, status, criado_por_admin_id, mercado, duracao_horas, conclusao_dias, preco, desconto_percentual) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                codigoUnico, titulo, descricao || null, capa_url, certificado_template_url, status, adminId,
                mercadoTratado, duracaoTratada, conclusaoTratada, precoTratado, descontoTratado
            ]
        );

        const detalhesLog = JSON.stringify({
            titulo, codigo_unico: codigoUnico, status, mercado: mercadoTratado, preco: precoTratado
        });

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, detalhes_json, ip) 
             VALUES (?, 'CRIAR_CURSO', 'cursos', ?, ?, ?)`,
            [adminId, resultadoCurso.insertId, detalhesLog, req.ip || req.socket.remoteAddress]
        );

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno ao salvar o curso.');
    }
});

// GET: Painel de Detalhes de um Curso Específico
app.get('/admin/cursos/:id', verificarAdmin, async (req, res) => {
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

// GET: Renderiza o formulário de edição com os dados atuais do curso
app.get('/admin/cursos/:id/editar', verificarAdmin, async (req, res) => {
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

// POST: Processa a atualização do curso
// POST: Processa a atualização do curso
app.post('/admin/cursos/:id/editar', verificarAdmin, upload.fields([
    { name: 'capa', maxCount: 1 },
    { name: 'certificado_template', maxCount: 1 }
]), async (req, res) => {
    const cursoId = req.params.id;
    // Extraímos preco e desconto_percentual
    const { titulo, descricao, status, capa_url_atual, certificado_atual, mercado, duracao_horas, conclusao_dias, preco, desconto_percentual } = req.body;
    const adminId = req.session.usuario.id;

    const arquivos = req.files || {};
    const capa_url = arquivos['capa'] ? '/img/' + arquivos['capa'][0].filename : (capa_url_atual || null);
    const certificado_template_url = arquivos['certificado_template'] ? '/img/' + arquivos['certificado_template'][0].filename : (certificado_atual || null);

    // Tratamento dos campos
    const mercadoTratado = mercado && mercado.trim() !== '' ? mercado.trim() : null;
    const duracaoTratada = duracao_horas ? parseInt(duracao_horas) : null;
    const conclusaoTratada = conclusao_dias ? parseInt(conclusao_dias) : null;

    // Tratamento Financeiro
    const precoTratado = preco ? parseFloat(preco.replace(',', '.')) : 0.00;
    const descontoTratado = desconto_percentual ? parseInt(desconto_percentual) : 0;

    try {
        await db.execute(
            `UPDATE cursos 
             SET titulo = ?, descricao = ?, capa_url = ?, certificado_template_url = ?, status = ?, mercado = ?, duracao_horas = ?, conclusao_dias = ?, preco = ?, desconto_percentual = ? 
             WHERE id = ?`,
            [
                titulo, descricao || null, capa_url, certificado_template_url, status,
                mercadoTratado, duracaoTratada, conclusaoTratada, precoTratado, descontoTratado, cursoId
            ]
        );

        const detalhesLog = JSON.stringify({
            campos_alterados: { titulo, status, preco: precoTratado, desconto: descontoTratado }
        });

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

// ==========================================
// ROTAS DE GESTÃO DE MÓDULOS (ADMIN)
// ==========================================

// GET: Renderiza o formulário para criar um novo módulo
app.get('/admin/cursos/:id/modulos/novo', verificarAdmin, async (req, res) => {
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

// POST: Processa a criação do módulo
app.post('/admin/cursos/:id/modulos/novo', verificarAdmin, async (req, res) => {
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

// ==========================================
// ROTAS DE GESTÃO DE AULAS (ADMIN)
// ==========================================

// GET: Renderiza o formulário de nova aula
app.get('/admin/modulos/:moduloId/aulas/nova', verificarAdmin, async (req, res) => {
    const moduloId = req.params.moduloId;

    try {
        // 1. Busca os dados do módulo e do curso correspondente
        const [modulos] = await db.execute(`
            SELECT m.*, c.codigo_unico, c.id as curso_id 
            FROM modulos m 
            JOIN cursos c ON m.curso_id = c.id 
            WHERE m.id = ?
        `, [moduloId]);

        if (modulos.length === 0) {
            return res.status(404).send('Módulo não encontrado.');
        }

        const modulo = modulos[0];
        const curso = { id: modulo.curso_id, codigo_unico: modulo.codigo_unico };

        // 2. Descobre a próxima ordem da aula neste módulo
        const [resultadoOrdem] = await db.execute('SELECT MAX(ordem) as maxOrdem FROM aulas WHERE modulo_id = ?', [moduloId]);
        const proximaOrdem = (resultadoOrdem[0].maxOrdem || 0) + 1;

        res.send(renderNovaAulaView(req.session.usuario, curso, modulo, proximaOrdem));

    } catch (error) {
        console.error('Erro ao carregar nova aula:', error);
        res.status(500).send('Erro interno.');
    }
});

// POST: Processa a criação da aula e os uploads múltiplos
// Utilizamos .fields() porque os arquivos vêm de inputs diferentes
app.post('/admin/modulos/:moduloId/aulas/nova', verificarAdmin, uploadAula.fields([
    { name: 'video', maxCount: 1 },
    { name: 'avaliacao', maxCount: 1 },
    { name: 'apostila', maxCount: 20 }, // Permite até 20 imagens de uma vez
    { name: 'arquivo_adicional', maxCount: 1 } // <-- ADICIONADO: Campo para o arquivo .zip/.rar
]), async (req, res) => {

    const moduloId = req.params.moduloId;
    const { titulo, ordem, duracao_segundos, descricao } = req.body;
    const adminId = req.session.usuario.id;

    try {
        // 1. Extrair caminhos dos arquivos enviados (se existirem)
        const arquivos = req.files || {};

        // Caminho do material complementar (.zip ou .rar)
        const arquivoAdicionalPath = arquivos['arquivo_adicional'] ? '/uploads/' + arquivos['arquivo_adicional'][0].filename : null;

        // 2. Inserir na tabela 'aulas' (agora com a coluna arquivo_adicional_url)
        const [resultadoAula] = await db.execute(
            `INSERT INTO aulas (modulo_id, titulo, ordem, descricao, duracao_segundos, arquivo_adicional_url) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                moduloId,
                titulo,
                parseInt(ordem),
                descricao || null,
                duracao_segundos ? parseInt(duracao_segundos) : null,
                arquivoAdicionalPath // <-- ADICIONADO
            ]
        );
        const aulaId = resultadoAula.insertId;

        // 3. Extrair os outros caminhos
        const videoPath = arquivos['video'] ? '/uploads/' + arquivos['video'][0].filename : null;
        const avaliacaoPath = arquivos['avaliacao'] ? '/uploads/' + arquivos['avaliacao'][0].filename : null;

        // 4. Inserir na tabela 'aula_conteudos' (Relação 1:1 com a aula)
        await db.execute(
            `INSERT INTO aula_conteudos (aula_id, video_path, avaliacao_json_path) 
             VALUES (?, ?, ?)`,
            [aulaId, videoPath, avaliacaoPath]
        );

        // 5. Inserir na tabela 'apostila_imagens' (Múltiplas imagens)
        if (arquivos['apostila'] && arquivos['apostila'].length > 0) {
            let ordemImagem = 1;
            for (const img of arquivos['apostila']) {
                const imgPath = '/uploads/' + img.filename;
                await db.execute(
                    `INSERT INTO apostila_imagens (aula_id, imagem_path, ordem) VALUES (?, ?, ?)`,
                    [aulaId, imgPath, ordemImagem]
                );
                ordemImagem++;
            }
        }

        // 6. Auditoria
        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'CRIAR_AULA', 'aulas', ?, ?)`,
            [adminId, aulaId, req.ip || req.socket.remoteAddress]
        );

        // 7. Para redirecionar de volta, precisamos descobrir o ID do curso
        const [moduloData] = await db.execute('SELECT curso_id FROM modulos WHERE id = ?', [moduloId]);
        res.redirect(`/admin/cursos/${moduloData[0].curso_id}`);

    } catch (error) {
        console.error('Erro ao criar aula e conteúdos:', error);
        res.status(500).send('Erro ao salvar a aula e os arquivos.');
    }
});

// GET: Renderiza o formulário de edição do módulo
app.get('/admin/modulos/:id/editar', verificarAdmin, async (req, res) => {
    const moduloId = req.params.id;

    try {
        // 1. Busca os dados do módulo
        const [modulos] = await db.execute('SELECT * FROM modulos WHERE id = ?', [moduloId]);
        if (modulos.length === 0) {
            return res.status(404).send('<h1>Módulo não encontrado.</h1><a href="/admin">Voltar</a>');
        }
        const modulo = modulos[0];

        // 2. Busca os dados do curso associado (para o breadcrumb)
        const [cursos] = await db.execute('SELECT id, codigo_unico FROM cursos WHERE id = ?', [modulo.curso_id]);

        res.send(renderEditarModuloView(req.session.usuario, cursos[0], modulo));

    } catch (error) {
        console.error('Erro ao carregar edição do módulo:', error);
        res.status(500).send('<h1>Erro interno do servidor.</h1>');
    }
});

// POST: Processa a atualização do módulo
app.post('/admin/modulos/:id/editar', verificarAdmin, async (req, res) => {
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

// GET: Renderiza o formulário de edição de aula
app.get('/admin/aulas/:id/editar', verificarAdmin, async (req, res) => {
    const aulaId = req.params.id;

    try {
        // 1. Busca a aula e a hierarquia (modulo -> curso)
        const [aulas] = await db.execute(`
            SELECT a.*, m.titulo as modulo_titulo, m.curso_id, c.codigo_unico 
            FROM aulas a
            JOIN modulos m ON a.modulo_id = m.id
            JOIN cursos c ON m.curso_id = c.id
            WHERE a.id = ?
        `, [aulaId]);

        if (aulas.length === 0) return res.status(404).send('Aula não encontrada.');
        const aula = aulas[0];

        const curso = { id: aula.curso_id, codigo_unico: aula.codigo_unico };
        const modulo = { titulo: aula.modulo_titulo };

        // 2. Busca os conteúdos atuais da aula (vídeo e json)
        const [conteudosQuery] = await db.execute('SELECT * FROM aula_conteudos WHERE aula_id = ?', [aulaId]);
        const conteudos = conteudosQuery[0] || {};

        res.send(renderEditarAulaView(req.session.usuario, curso, modulo, aula, conteudos));

    } catch (error) {
        console.error('Erro ao carregar edição de aula:', error);
        res.status(500).send('Erro interno.');
    }
});

// POST: Processa a edição da aula
app.post('/admin/aulas/:id/editar', verificarAdmin, uploadAula.fields([
    { name: 'video', maxCount: 1 },
    { name: 'avaliacao', maxCount: 1 },
    { name: 'apostila', maxCount: 20 },
    { name: 'arquivo_adicional', maxCount: 1 } // Multer permitindo o arquivo
]), async (req, res) => {
    const aulaId = req.params.id;
    // Adicionamos a extração do arquivo_adicional_atual
    const { titulo, ordem, duracao_segundos, descricao, video_atual, avaliacao_atual, arquivo_adicional_atual } = req.body;
    const adminId = req.session.usuario.id;

    try {
        // 1. Precisamos do curso_id para redirecionar depois
        const [aulaQuery] = await db.execute(`
            SELECT m.curso_id FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE a.id = ?
        `, [aulaId]);
        const cursoId = aulaQuery[0].curso_id;

        const arquivos = req.files || {};

        // --- NOVIDADE AQUI: Lógica do arquivo adicional ---
        // Se enviou um novo .zip, pega o caminho novo. Se não, mantém o caminho que já estava salvo.
        const arquivoAdicionalPath = arquivos['arquivo_adicional']
            ? '/uploads/' + arquivos['arquivo_adicional'][0].filename
            : (arquivo_adicional_atual || null);

        // 2. Atualizar dados básicos da tabela 'aulas' (AGORA INCLUINDO O ARQUIVO ADICIONAL)
        await db.execute(
            `UPDATE aulas SET titulo = ?, ordem = ?, descricao = ?, duracao_segundos = ?, arquivo_adicional_url = ? WHERE id = ?`,
            [
                titulo,
                parseInt(ordem),
                descricao || null,
                duracao_segundos ? parseInt(duracao_segundos) : null,
                arquivoAdicionalPath, // Passando a URL do arquivo
                aulaId
            ]
        );

        // 3. Processar vídeos e avaliações
        const videoPath = arquivos['video'] ? '/uploads/' + arquivos['video'][0].filename : (video_atual || null);
        const avaliacaoPath = arquivos['avaliacao'] ? '/uploads/' + arquivos['avaliacao'][0].filename : (avaliacao_atual || null);

        // Atualiza a tabela 'aula_conteudos'
        await db.execute(
            `UPDATE aula_conteudos SET video_path = ?, avaliacao_json_path = ? WHERE aula_id = ?`,
            [videoPath, avaliacaoPath, aulaId]
        );

        // 4. Se enviou novas imagens de apostila, deleta as antigas e insere as novas
        if (arquivos['apostila'] && arquivos['apostila'].length > 0) {
            await db.execute('DELETE FROM apostila_imagens WHERE aula_id = ?', [aulaId]);

            let ordemImagem = 1;
            for (const img of arquivos['apostila']) {
                const imgPath = '/uploads/' + img.filename;
                await db.execute(
                    `INSERT INTO apostila_imagens (aula_id, imagem_path, ordem) VALUES (?, ?, ?)`,
                    [aulaId, imgPath, ordemImagem]
                );
                ordemImagem++;
            }
        }

        // 5. Registar log de auditoria
        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'EDITAR_AULA', 'aulas', ?, ?)`,
            [adminId, aulaId, req.ip || req.socket.remoteAddress]
        );

        res.redirect(`/admin/cursos/${cursoId}`);

    } catch (error) {
        console.error('Erro ao editar aula:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.send('<h2>Erro: Já existe uma aula com esta ordem neste módulo.</h2><a href="javascript:history.back()">Voltar</a>');
        }
        res.status(500).send('Erro ao atualizar a aula.');
    }
});

// ==========================================
// ROTAS DE EXCLUSÃO (CASCATA)
// ==========================================

// POST: Excluir Curso
app.post('/admin/cursos/:id/excluir', verificarAdmin, async (req, res) => {
    const cursoId = req.params.id;
    const adminId = req.session.usuario.id;

    try {
        // Registra no log ANTES de excluir (para termos o ID garantido)
        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'EXCLUIR_CURSO', 'cursos', ?, ?)`,
            [adminId, cursoId, req.ip || req.socket.remoteAddress]
        );

        // O MySQL vai apagar Módulos, Aulas e Conteúdos em cascata automaticamente!
        await db.execute('DELETE FROM cursos WHERE id = ?', [cursoId]);

        res.redirect('/admin');
    } catch (error) {
        console.error('Erro ao excluir curso:', error);
        res.status(500).send('Erro interno ao tentar excluir o curso.');
    }
});

// POST: Excluir Módulo
app.post('/admin/modulos/:id/excluir', verificarAdmin, async (req, res) => {
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

// POST: Excluir Aula
app.post('/admin/aulas/:id/excluir', verificarAdmin, async (req, res) => {
    const aulaId = req.params.id;
    const adminId = req.session.usuario.id;

    try {
        // Descobre o curso_id através da relação Aula -> Módulo -> Curso
        const [aulaQuery] = await db.execute(`
            SELECT m.curso_id FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE a.id = ?
        `, [aulaId]);
        if (aulaQuery.length === 0) return res.redirect('/admin');
        const cursoId = aulaQuery[0].curso_id;

        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'EXCLUIR_AULA', 'aulas', ?, ?)`,
            [adminId, aulaId, req.ip || req.socket.remoteAddress]
        );

        // Deleta a aula (aula_conteudos e apostila_imagens caem em cascata)
        await db.execute('DELETE FROM aulas WHERE id = ?', [aulaId]);

        res.redirect(`/admin/cursos/${cursoId}`);
    } catch (error) {
        console.error('Erro ao excluir aula:', error);
        res.status(500).send('Erro interno ao tentar excluir a aula.');
    }
});

// ==========================================
// ROTAS DE GESTÃO DE USUÁRIOS (ADMIN)
// ==========================================

// GET: Renderiza a lista de todos os Usuários (Admin) com Paginação e Busca
app.get('/admin/usuarios', verificarAdmin, async (req, res) => {
    try {
        const limit = 12;
        const currentPage = parseInt(req.query.page) || 1;
        const offset = (currentPage - 1) * limit;
        const search = req.query.search || '';

        let queryParams = [];
        let whereClauseCount = '';
        let whereClauseMain = '';

        // Se o admin digitou algo na busca
        if (search.trim() !== '') {
            const searchTerm = `%${search}%`;
            whereClauseCount = ' WHERE u.nome LIKE ? OR c.titulo LIKE ?';

            // Subquery no WHERE garante que o aluno seja encontrado, mas a query principal
            // continua a trazer a lista completa de TODOS os cursos que esse aluno tem
            whereClauseMain = ` WHERE u.id IN (
                SELECT DISTINCT u2.id FROM usuarios u2 
                LEFT JOIN matriculas m2 ON u2.id = m2.aluno_id 
                LEFT JOIN cursos c2 ON m2.curso_id = c2.id 
                WHERE u2.nome LIKE ? OR c2.titulo LIKE ?
            )`;
            queryParams.push(searchTerm, searchTerm);
        }

        // Conta o total (aplicando o filtro de busca se existir)
        const countQuery = `
            SELECT COUNT(DISTINCT u.id) AS total 
            FROM usuarios u 
            LEFT JOIN matriculas m ON u.id = m.aluno_id 
            LEFT JOIN cursos c ON m.curso_id = c.id
            ${whereClauseCount}
        `;
        const [totalQuery] = await db.execute(countQuery, queryParams);
        const totalUsuarios = totalQuery[0].total;
        const totalPages = Math.ceil(totalUsuarios / limit) || 1;

        // Query principal com Busca e Paginação
        // Query principal com Busca, Paginação e Contagem de Conclusões
        const mainQuery = `
            SELECT 
                u.id, u.nome, u.email, u.tipo, u.status, u.criado_em, u.data_nascimento, u.ultimo_acesso,
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
            ORDER BY u.ultimo_acesso DESC, u.id DESC
            LIMIT ${limit} OFFSET ${offset}
        `;
        const [usuarios] = await db.execute(mainQuery, queryParams);

        // Enviamos o termo de busca (search) para a view manter o input preenchido
        res.send(renderAdminUsuariosView(req.session.usuario, usuarios, currentPage, totalPages, search));
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// GET: Novo Usuário (Busca os cursos para exibir as opções de matrícula)
app.get('/admin/usuarios/novo', verificarAdmin, async (req, res) => {
    try {
        // Busca apenas os cursos publicados para que o admin possa associar ao aluno
        const [cursosDisponiveis] = await db.execute("SELECT id, codigo_unico, titulo FROM cursos WHERE status = 'PUBLICADO' ORDER BY titulo ASC");

        res.send(renderNovoUsuarioView(req.session.usuario, cursosDisponiveis));
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno.');
    }
});

// POST: Processar Novo Usuário (Admin)
app.post('/admin/usuarios/novo', verificarAdmin, uploadPerfil.single('foto_perfil'), async (req, res) => {
    // Adicionamos a data_nascimento aqui:
    const { nome, email, senha, tipo, data_nascimento, telefone, cidade, estado, cursos } = req.body;
    const adminId = req.session.usuario.id;
    const foto_perfil_url = req.file ? '/img/perfil/' + req.file.filename : null;

    try {
        const [existente] = await db.execute('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) return res.send('<h2>E-mail já cadastrado.</h2><a href="javascript:history.back()">Voltar</a>');

        const senhaHash = await bcrypt.hash(senha, 10);

        // Atualizamos o INSERT para incluir a data_nascimento
        const [resultadoUsuario] = await db.execute(
            `INSERT INTO usuarios (tipo, nome, email, senha_hash, data_nascimento, telefone, cidade, estado, foto_perfil_url, status) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'ATIVO')`,
            [tipo, nome, email, senhaHash, data_nascimento || null, telefone || null, cidade || null, estado || null, foto_perfil_url]
        );

        const novoUsuarioId = resultadoUsuario.insertId;

        // 3. Regista a ação de criação de utilizador nos logs
        await db.execute(
            `INSERT INTO admin_logs (admin_id, acao, entidade, entidade_id, ip) VALUES (?, 'CRIAR_USUARIO', 'usuarios', ?, ?)`,
            [adminId, novoUsuarioId, req.ip || req.socket.remoteAddress]
        );

        // 4. Lógica de Matrícula Automática (Apenas se for ALUNO e se algum curso foi selecionado)
        if (tipo === 'ALUNO' && cursos) {
            // Garante que 'cursos' seja sempre um array (mesmo se o admin selecionar apenas 1 curso)
            const cursosSelecionados = Array.isArray(cursos) ? cursos : [cursos];

            for (const cursoId of cursosSelecionados) {
                // Insere a matrícula com origem LIBERACAO_ADMIN
                const [resultadoMatricula] = await db.execute(
                    `INSERT INTO matriculas (aluno_id, curso_id, status, origem) 
                     VALUES (?, ?, 'ATIVA', 'LIBERACAO_ADMIN')`,
                    [novoUsuarioId, cursoId]
                );

                const matriculaId = resultadoMatricula.insertId;

                // Gera o token de 8 caracteres alfanuméricos para o certificado futuro (Requisito da arquitetura)
                const tokenCertificado = crypto.randomBytes(4).toString('hex').toUpperCase();

                // Insere o registo base do certificado amarrado a esta matrícula
                await db.execute(
                    `INSERT INTO certificados (matricula_id, token) VALUES (?, ?)`,
                    [matriculaId, tokenCertificado]
                );

                // Inicia o progresso geral do curso com 0% para esse aluno
                await db.execute(
                    `INSERT INTO progresso_curso (matricula_id) VALUES (?)`,
                    [matriculaId]
                );
            }
        }

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao salvar usuário e matrículas.');
    }
});

// GET: Renderiza a edição do Usuário com as Matrículas
app.get('/admin/usuarios/:id/editar', verificarAdmin, async (req, res) => {
    const usuarioId = req.params.id;

    try {
        // 1. Busca os dados do usuário
        const [usuarios] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [usuarioId]);
        if (usuarios.length === 0) return res.status(404).send('Usuário não encontrado.');
        const usuario = usuarios[0];

        // 2. Busca todos os cursos publicados disponíveis
        const [cursosDisponiveis] = await db.execute("SELECT id, codigo_unico, titulo FROM cursos WHERE status = 'PUBLICADO' ORDER BY titulo ASC");

        // 3. Busca os cursos em que o usuário já possui matrícula ATIVA
        const [matriculasAtivas] = await db.execute("SELECT curso_id FROM matriculas WHERE aluno_id = ? AND status = 'ATIVA'", [usuarioId]);
        const idsMatriculados = matriculasAtivas.map(m => m.curso_id);

        // 4. Mapeia para avisar a view quais checkboxes devem vir "marcados"
        cursosDisponiveis.forEach(curso => {
            curso.matriculado = idsMatriculados.includes(curso.id);
        });

        res.send(renderEditarUsuarioView(req.session.usuario, usuario, cursosDisponiveis));
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro interno.');
    }
});

// POST: Processar Edição de Usuário e Gerenciar Matrículas
app.post('/admin/usuarios/:id/editar', verificarAdmin, uploadPerfil.single('foto_perfil'), async (req, res) => {
    const usuarioId = req.params.id;
    // Adicionado data_nascimento na extração
    const { nome, email, tipo, status, nova_senha, data_nascimento, telefone, cidade, estado, foto_atual, cursos } = req.body;

    const foto_perfil_url = req.file ? '/img/perfil/' + req.file.filename : (foto_atual || null);

    try {
        // ==========================================
        // 1. ATUALIZAÇÃO DOS DADOS DO USUÁRIO
        // ==========================================
        if (nova_senha && nova_senha.trim() !== '') {
            const senhaHash = await bcrypt.hash(nova_senha, 10);
            await db.execute(
                // Incluída a data_nascimento no UPDATE
                `UPDATE usuarios SET nome = ?, email = ?, tipo = ?, status = ?, senha_hash = ?, data_nascimento = ?, telefone = ?, cidade = ?, estado = ?, foto_perfil_url = ? WHERE id = ?`,
                [nome, email, tipo, status, senhaHash, data_nascimento || null, telefone || null, cidade || null, estado || null, foto_perfil_url, usuarioId]
            );
        } else {
            await db.execute(
                // Incluída a data_nascimento no UPDATE
                `UPDATE usuarios SET nome = ?, email = ?, tipo = ?, status = ?, data_nascimento = ?, telefone = ?, cidade = ?, estado = ?, foto_perfil_url = ? WHERE id = ?`,
                [nome, email, tipo, status, data_nascimento || null, telefone || null, cidade || null, estado || null, foto_perfil_url, usuarioId]
            );
        }

        // Atualização de Sessão (caso o admin edite a própria conta)
        if (parseInt(usuarioId) === req.session.usuario.id) {
            req.session.usuario.nome = nome;
            req.session.usuario.foto_perfil_url = foto_perfil_url;
        }

        // ==========================================
        // 2. GESTÃO INTELIGENTE DE MATRÍCULAS
        // ==========================================
        // Transforma o recebido do formulário num array de inteiros (IDs dos cursos)
        const cursosSelecionados = cursos ? (Array.isArray(cursos) ? cursos : [cursos]).map(Number) : [];

        // Busca todas as matrículas existentes (Ativas, Canceladas ou Concluídas)
        const [matriculasAtuais] = await db.execute('SELECT id, curso_id, status FROM matriculas WHERE aluno_id = ?', [usuarioId]);
        const mapaMatriculas = new Map(matriculasAtuais.map(m => [m.curso_id, m]));

        // 2.1. DESASSOCIAR: Cursos que o usuário tinha, mas o admin desmarcou
        for (const mat of matriculasAtuais) {
            if (!cursosSelecionados.includes(mat.curso_id) && mat.status === 'ATIVA') {
                await db.execute("UPDATE matriculas SET status = 'CANCELADA', atualizado_em = NOW() WHERE id = ?", [mat.id]);
            }
        }

        // 2.2. ASSOCIAR: Cursos que o admin marcou
        for (const cursoId of cursosSelecionados) {
            if (mapaMatriculas.has(cursoId)) {
                // Se já tinha matrícula (mesmo cancelada), apenas reativamos para não perder o progresso
                const mat = mapaMatriculas.get(cursoId);
                if (mat.status !== 'ATIVA') {
                    await db.execute("UPDATE matriculas SET status = 'ATIVA', atualizado_em = NOW() WHERE id = ?", [mat.id]);
                }
            } else {
                // Se não existia, criamos toda a estrutura nova
                const [resultadoMatricula] = await db.execute(
                    `INSERT INTO matriculas (aluno_id, curso_id, status, origem) VALUES (?, ?, 'ATIVA', 'LIBERACAO_ADMIN')`,
                    [usuarioId, cursoId]
                );
                const matriculaId = resultadoMatricula.insertId;

                // Geramos as dependências obrigatórias
                const tokenCertificado = require('crypto').randomBytes(4).toString('hex').toUpperCase();
                await db.execute(`INSERT INTO certificados (matricula_id, token) VALUES (?, ?)`, [matriculaId, tokenCertificado]);
                await db.execute(`INSERT INTO progresso_curso (matricula_id) VALUES (?)`, [matriculaId]);
            }
        }

        res.redirect('/admin/usuarios');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar usuário e gerir matrículas.');
    }
});

// POST: Excluir Usuário (com fallback para Soft Delete)
app.post('/admin/usuarios/:id/excluir', verificarAdmin, async (req, res) => {
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

// GET: Sala de Aula (Player do Curso)
// ==========================================
// ROTAS DO PLAYER DA SALA DE AULA (ALUNO)
// ==========================================

// GET: Sala de Aula (Calcula o bloqueio linear entre as aulas e busca as Notas)
app.get(['/aluno/cursos/:cursoId/aula', '/aluno/cursos/:cursoId/aula/:aulaId'], verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const cursoId = req.params.cursoId;
    let aulaParamId = req.params.aulaId;

    try {
        // 1. Verifica a Matrícula (Permite ATIVA ou CONCLUIDA para revisão)
        const [matriculas] = await db.execute(
            'SELECT id, status FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")',
            [alunoId, cursoId]
        );

        if (matriculas.length === 0) {
            return res.status(403).send('Você não tem acesso a este curso.');
        }
        const matriculaId = matriculas[0].id;

        const [cursos] = await db.execute('SELECT id, titulo, codigo_unico FROM cursos WHERE id = ?', [cursoId]);
        const curso = cursos[0];

        const [modulos] = await db.execute('SELECT * FROM modulos WHERE curso_id = ? ORDER BY ordem ASC', [cursoId]);

        // 2. Busca Aulas, Progresso E a Nota Máxima alcançada (Subquery adicionada)
        const [aulas] = await db.execute(`
            SELECT 
                a.*, 
                m.ordem as mod_ordem, 
                pa.status as progresso_status, 
                pa.progresso_percentual,
                (SELECT MAX(nota) FROM avaliacao_tentativas at WHERE at.aula_id = a.id AND at.matricula_id = ?) AS nota_avaliacao
            FROM aulas a 
            JOIN modulos m ON a.modulo_id = m.id 
            LEFT JOIN progresso_aula pa ON pa.aula_id = a.id AND pa.matricula_id = ?
            WHERE m.curso_id = ? 
            ORDER BY m.ordem ASC, a.ordem ASC
        `, [matriculaId, matriculaId, cursoId]); // <-- matriculaId passado duas vezes (uma pra nota, uma pro progresso)

        // LÓGICA DE BLOQUEIO LINEAR (INTER-AULAS)
        let anteriorConcluida = true; // A primeira aula começa sempre liberada
        aulas.forEach(aula => {
            aula.isLiberada = anteriorConcluida;
            if (aula.progresso_status !== 'CONCLUIDA') {
                anteriorConcluida = false; // Bloqueia todas as próximas se esta não estiver concluída
            }
        });

        modulos.forEach(modulo => modulo.aulas = aulas.filter(aula => aula.modulo_id === modulo.id));

        // Determinar a Aula Atual
        let aulaAtual = null;
        if (aulas.length > 0) {
            if (aulaParamId) {
                aulaAtual = aulas.find(a => a.id === parseInt(aulaParamId));
                // Se tentou aceder a uma aula bloqueada pela URL, devolve para a última permitida
                if (aulaAtual && !aulaAtual.isLiberada) {
                    aulaAtual = aulas.find(a => a.isLiberada && a.progresso_status !== 'CONCLUIDA') || aulas[aulas.length - 1];
                }
            } else {
                aulaAtual = aulas.find(a => a.progresso_status !== 'CONCLUIDA') || aulas[aulas.length - 1];
            }
        }

        let conteudosAtual = null;
        let imagensApostila = [];
        let tentativasUsadas = 0;
        let progressoPercentual = aulaAtual ? (aulaAtual.progresso_percentual || 0) : 0;
        let avaliacaoData = null; // Nova variável para guardar o conteúdo do JSON

        if (aulaAtual) {
            const [cont] = await db.execute('SELECT * FROM aula_conteudos WHERE aula_id = ?', [aulaAtual.id]);
            conteudosAtual = cont[0] || null;

            const [imgs] = await db.execute('SELECT * FROM apostila_imagens WHERE aula_id = ? ORDER BY ordem ASC', [aulaAtual.id]);
            imagensApostila = imgs;

            const [tentativasQuery] = await db.execute('SELECT COUNT(*) as qtd FROM avaliacao_tentativas WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaAtual.id]);
            tentativasUsadas = tentativasQuery[0].qtd || 0;

            // ==========================================
            // LER O ARQUIVO JSON DA AVALIAÇÃO
            // ==========================================
            if (conteudosAtual && conteudosAtual.avaliacao_json_path) {
                try {
                    const fs = require('fs');
                    const path = require('path');
                    // O caminho no banco é salvo como '/uploads/arquivo.json'. Precisamos mapear para a pasta public.
                    const filePath = path.join(__dirname, 'public', conteudosAtual.avaliacao_json_path);
                    if (fs.existsSync(filePath)) {
                        const fileContent = fs.readFileSync(filePath, 'utf-8');
                        avaliacaoData = JSON.parse(fileContent);
                    }
                } catch (err) {
                    console.error("Erro ao ler/processar arquivo JSON da avaliação:", err);
                }
            }
        }

        // Passamos o avaliacaoData para a View!
        res.send(renderAlunoSalaAulaView(req.session.usuario, curso, modulos, aulaAtual, conteudosAtual, imagensApostila, matriculas[0], progressoPercentual, tentativasUsadas, avaliacaoData));

    } catch (error) {
        console.error('Erro ao carregar sala de aula:', error);
        res.status(500).send('Erro interno ao carregar o curso.');
    }
});

// POST: Concluir Etapas Internas da Aula (Vídeo -> Apostila)
app.post('/aluno/aulas/:aulaId/etapa', verificarAluno, async (req, res) => {
    const aulaId = req.params.aulaId;
    const { curso_id, etapa } = req.body;
    const alunoId = req.session.usuario.id;

    try {
        // Substitua a linha do db.execute das matriculas por:
        const [matriculas] = await db.execute(
            'SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")',
            [alunoId, curso_id]
        );
        if (matriculas.length === 0) return res.status(403).json({ error: 'Matrícula inválida' });
        const matriculaId = matriculas[0].id;

        // Define a percentagem baseada na etapa concluída
        const novoPercentual = etapa === 'VIDEO' ? 33.33 : 66.66;

        // Verifica se já existe registo. Atualiza (só se for maior) ou insere.
        const [prog] = await db.execute('SELECT id, progresso_percentual FROM progresso_aula WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

        if (prog.length > 0) {
            if (parseFloat(prog[0].progresso_percentual) < novoPercentual) {
                await db.execute('UPDATE progresso_aula SET progresso_percentual = ?, ultima_interacao_em = NOW() WHERE id = ?', [novoPercentual, prog[0].id]);
            }
        } else {
            await db.execute('INSERT INTO progresso_aula (matricula_id, aula_id, status, progresso_percentual, ultima_interacao_em) VALUES (?, ?, "EM_ANDAMENTO", ?, NOW())', [matriculaId, aulaId, novoPercentual]);
        }

        // Se a requisição veio via Fetch API (JSON), devolve a resposta para atualizar a tela silenciosamente
        if (req.is('application/json')) {
            return res.json({ success: true, percentual: novoPercentual });
        }

        // Fallback caso seja submetido via formulário HTML clássico
        res.redirect(`/aluno/cursos/${curso_id}/aula/${aulaId}`);
    } catch (error) {
        console.error(error);
        if (req.is('application/json')) return res.status(500).json({ error: 'Erro ao atualizar etapa.' });
        res.status(500).send('Erro ao atualizar etapa.');
    }
});

// POST: Submeter Avaliação (Agora com cálculo real da nota e RESET nas 3 falhas)
app.post('/aluno/aulas/:aulaId/avaliacao', verificarAluno, async (req, res) => {
    const aulaId = req.params.aulaId;
    const { curso_id, resultado, score, total_questions } = req.body;
    const alunoId = req.session.usuario.id;

    try {
        const [matriculas] = await db.execute('SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")', [alunoId, curso_id]);
        if (matriculas.length === 0) return res.redirect('/aluno');
        const matriculaId = matriculas[0].id;

        // Conta quantas tentativas o aluno já tem ANTES desta
        const [tentativasQuery] = await db.execute('SELECT COUNT(*) as qtd FROM avaliacao_tentativas WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);
        const tentativasAtuais = tentativasQuery[0].qtd;

        // Se por algum motivo bizarro ele burlar o front-end e chegar aqui com 3
        if (tentativasAtuais >= 3) return res.send('<h2>Limite de 3 tentativas excedido.</h2><a href="javascript:history.back()">Voltar</a>');

        // CÁLCULO DA NOTA REAL (0 a 10)
        let notaReal = 0;
        if (score !== undefined && total_questions !== undefined && parseInt(total_questions) > 0) {
            notaReal = (parseInt(score) / parseInt(total_questions)) * 10;
        } else {
            notaReal = resultado === 'aprovado' ? 10.0 : 0.0;
        }

        const foiAprovado = resultado === 'aprovado' ? 1 : 0;

        // Insere o registo DESTA nova tentativa
        await db.execute(
            'INSERT INTO avaliacao_tentativas (matricula_id, aula_id, nota, aprovado, enviado_em) VALUES (?, ?, ?, ?, NOW())',
            [matriculaId, aulaId, notaReal, foiAprovado]
        );

        let cursoFoiConcluidoNestaEtapa = false; // Flag de controle

        if (foiAprovado) {
            // 1. Marca a aula atual como 100% concluída
            await db.execute('UPDATE progresso_aula SET progresso_percentual = 100.00, status = "CONCLUIDA", concluida_em = NOW() WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

            // 2. Conta Total de Aulas vs Aulas Concluídas
            const [totalQuery] = await db.execute('SELECT COUNT(*) as total FROM aulas a JOIN modulos m ON a.modulo_id = m.id WHERE m.curso_id = ?', [curso_id]);
            const [concluidasQuery] = await db.execute(`
                SELECT COUNT(*) as concluidas FROM progresso_aula pa 
                JOIN aulas a ON pa.aula_id = a.id JOIN modulos m ON a.modulo_id = m.id 
                WHERE pa.matricula_id = ? AND pa.status = 'CONCLUIDA' AND m.curso_id = ?
            `, [matriculaId, curso_id]);

            const totalAulas = totalQuery[0].total;
            const concluidas = concluidasQuery[0].concluidas;
            const percentualGeral = totalAulas > 0 ? ((concluidas / totalAulas) * 100).toFixed(2) : 0;

            // ==========================================
            // 3. CORREÇÃO: INSERIR OU ATUALIZAR PROGRESSO
            // ==========================================
            const [progCurso] = await db.execute('SELECT id FROM progresso_curso WHERE matricula_id = ?', [matriculaId]);

            if (progCurso.length > 0) {
                // Já existe progresso gravado, apenas atualiza
                await db.execute(`UPDATE progresso_curso SET percentual = ?, aulas_concluidas = ?, total_aulas = ?, atualizado_em = NOW() WHERE matricula_id = ?`, [percentualGeral, concluidas, totalAulas, matriculaId]);
            } else {
                // Primeira aula concluída! Inserir a linha de progresso
                await db.execute(`INSERT INTO progresso_curso (matricula_id, percentual, aulas_concluidas, total_aulas) VALUES (?, ?, ?, ?)`, [matriculaId, percentualGeral, concluidas, totalAulas]);
            }

            // ==========================================
            // 4. CORREÇÃO: LIBERAR CERTIFICADO
            // ==========================================
            if (parseFloat(percentualGeral) >= 100) {
                // Aluno concluiu 100% do curso!
                await db.execute('UPDATE matriculas SET status = "CONCLUIDA", concluida_em = NOW() WHERE id = ?', [matriculaId]);
                
                // Verifica como está a situação do certificado
                const [certExiste] = await db.execute('SELECT id FROM certificados WHERE matricula_id = ?', [matriculaId]);
                
                if (certExiste.length === 0) {
                    // Fallback de segurança com o novo padrão de token
                    const tokenCertificado = crypto.randomBytes(4).toString('hex').toUpperCase();
                    await db.execute('INSERT INTO certificados (matricula_id, token, emitido_em) VALUES (?, ?, NOW())', [matriculaId, tokenCertificado]);
                } else {
                    // Destranca o certificado existente
                    await db.execute('UPDATE certificados SET emitido_em = NOW() WHERE matricula_id = ? AND emitido_em IS NULL', [matriculaId]);
                }
                
                cursoFoiConcluidoNestaEtapa = true;
            }

            // REDIRECIONAMENTOS DE SUCESSO
            if (cursoFoiConcluidoNestaEtapa) {
                res.redirect('/aluno'); // Terminou o curso (Vai ver 100% no painel)
            } else {
                res.redirect(`/aluno/cursos/${curso_id}/aula`); // Pula pra próxima aula
            }

        } else {
            // ==========================================
            // LÓGICA DE REPROVAÇÃO E RESET
            // ==========================================
            const totalFalhas = tentativasAtuais + 1; // Soma a falha atual
            // ... (mantenha o resto do código do bloco else exatamente igual)

            if (totalFalhas >= 3) {
                // ESTOUROU O LIMITE! Reseta o progresso para 0
                await db.execute('UPDATE progresso_aula SET progresso_percentual = 0.00, status = "EM_ANDAMENTO" WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

                // Zera as tentativas no banco para ele poder tentar mais 3 vezes após reassistir
                await db.execute('DELETE FROM avaliacao_tentativas WHERE matricula_id = ? AND aula_id = ?', [matriculaId, aulaId]);

                // Redireciona com a flag de reset para disparar o alerta vermelho na view
                res.redirect(`/aluno/cursos/${curso_id}/aula/${aulaId}?resetado=true`);
            } else {
                // Ainda tem tentativas (ex: errou a 1ª ou 2ª). Redireciona com o alerta amarelo
                res.redirect(`/aluno/cursos/${curso_id}/aula/${aulaId}?erro=true`);
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao processar avaliação.');
    }
});

// ==========================================
// ROTAS DE CERTIFICADOS (ALUNO)
// ==========================================

// ==========================================
// TELA DE CERTIFICADOS DO ALUNO
// ==========================================
app.get('/aluno/certificados', verificarAluno, async (req, res) => {
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
        const renderAlunoCertificadosView = require('./views/alunoCertificadosView');
        res.send(renderAlunoCertificadosView(req.session.usuario, certificados));

    } catch (error) {
        console.error('Erro ao carregar certificados do aluno:', error);
        res.status(500).send('Erro interno ao carregar a página de certificados.');
    }
});

// GET: Geração Dinâmica do PDF do Certificado
app.get('/aluno/certificados/:id/download', verificarAluno, async (req, res) => {
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
            const imgPath = path.join(__dirname, 'public', cert.certificado_template_url);
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

// ==========================================
// ROTAS DE FAVORITOS (ALUNO)
// ==========================================

// GET: Renderiza a tela de Favoritos do Aluno
app.get('/aluno/favoritos', verificarAluno, async (req, res) => {
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

        const renderAlunoFavoritosView = require('./views/alunoFavoritosView');
        res.send(renderAlunoFavoritosView(aluno, cursosFavoritos));
    } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
        res.status(500).send('Erro interno ao carregar a página de favoritos.');
    }
});

// POST: API para Adicionar/Remover dos Favoritos (Toggle)
app.post('/aluno/api/favoritos/toggle', verificarAluno, async (req, res) => {
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

// ==========================================
// MATRÍCULA EM CURSOS GRATUITOS
// ==========================================
app.post('/aluno/matricula/gratis', verificarAluno, async (req, res) => {
    const alunoId = req.session.usuario.id;
    const { curso_id } = req.body;

    try {
        const [cursos] = await db.execute('SELECT id, preco, titulo FROM cursos WHERE id = ? AND status = "PUBLICADO"', [curso_id]);
        if (cursos.length === 0) return res.status(404).send('Curso não encontrado ou indisponível.');

        const curso = cursos[0];
        if (parseFloat(curso.preco) > 0) return res.status(403).send('Tentativa inválida. Este curso não é gratuito.');

        const [matriculaExistente] = await db.execute('SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ?', [alunoId, curso_id]);
        if (matriculaExistente.length > 0) return res.redirect(`/aluno/cursos/${curso_id}/aula`);

        // 1. Efetua a matrícula
        const [novaMatricula] = await db.execute('INSERT INTO matriculas (aluno_id, curso_id) VALUES (?, ?)', [alunoId, curso_id]);
        const matriculaId = novaMatricula.insertId;

        // 2. GERA O CÓDIGO DO CERTIFICADO (Padrão 8 caracteres Hex)
        const tokenCertificado = crypto.randomBytes(4).toString('hex').toUpperCase();
        await db.execute('INSERT INTO certificados (matricula_id, token, emitido_em) VALUES (?, ?, NULL)', [matriculaId, tokenCertificado]);

        // Remove dos favoritos
        await db.execute('DELETE FROM favoritos WHERE aluno_id = ? AND curso_id = ?', [alunoId, curso_id]);

        console.log(`Sucesso: Aluno ID ${alunoId} matriculado no curso gratuito ID ${curso_id}. Certificado pendente: ${tokenCertificado}`);
        res.redirect('/aluno');

    } catch (error) {
        console.error('Erro ao processar matrícula gratuita:', error);
        res.status(500).send('Erro interno ao processar a matrícula.');
    }
});

// ==========================================
// ROTA PÚBLICA DE VALIDAÇÃO DE CERTIFICADO
// ==========================================

// GET: /validar?token=XYZ
app.get('/validar', async (req, res) => {
    // Pega o token da URL (ex: meudominio.com/validar?token=1A2B3C4D)
    const token = req.query.token;

    // Se a pessoa apenas digitou "/validar", mostramos a tela limpa
    if (!token || token.trim() === '') {
        return res.send(renderValidarCertificadoView(null, ''));
    }

    try {
        const tokenUpper = token.toUpperCase().trim();

        // 1. Busca os dados do Certificado, Aluno e Curso
        const [certificados] = await db.execute(`
            SELECT 
                cert.token, cert.emitido_em,
                u.nome AS aluno_nome,
                c.titulo AS curso_titulo, c.certificado_template_url,
                m.id AS matricula_id
            FROM certificados cert
            JOIN matriculas m ON cert.matricula_id = m.id
            JOIN usuarios u ON m.aluno_id = u.id
            JOIN cursos c ON m.curso_id = c.id
            WHERE cert.token = ?
        `, [tokenUpper]);

        // Se não existir, retorna erro
        if (certificados.length === 0) {
            return res.send(renderValidarCertificadoView({ error: true }, tokenUpper));
        }

        const cert = certificados[0];

        // Objeto de resultado base
        let resultado = {
            token: cert.token,
            aluno_nome: cert.aluno_nome,
            curso_titulo: cert.curso_titulo,
            template_url: cert.certificado_template_url || 'https://via.placeholder.com/800x600?text=Certificado'
        };

        // 2. Se estiver emitido, calcula a média
        if (cert.emitido_em !== null) {
            resultado.status = 'CONCLUIDO';
            resultado.data_conclusao = new Date(cert.emitido_em).toLocaleDateString('pt-BR');

            // Calcula a média usando AVG(). Filtra apenas avaliações onde o aluno foi aprovado
            const [notas] = await db.execute(`
                SELECT AVG(nota) as media_final 
                FROM avaliacao_tentativas 
                WHERE matricula_id = ? AND aprovado = 1
            `, [cert.matricula_id]);

            // Se o curso tiver provas, mostra a nota. Se for um curso sem provas (media nula), mostra 10.0 ou 100% como padrão de conclusão
            resultado.media_notas = notas[0].media_final ? parseFloat(notas[0].media_final).toFixed(1) : '10.0';
        } else {
            // Se emitido_em for nulo, a matrícula ainda está a decorrer
            resultado.status = 'PENDENTE';
        }

        res.send(renderValidarCertificadoView(resultado, tokenUpper));

    } catch (error) {
        console.error('Erro ao validar certificado:', error);
        res.status(500).send('<h1>Erro interno do servidor ao consultar banco de dados.</h1>');
    }
});

// ==========================================
// ROTAS PROTEGIDAS (Exemplos temporários)
// ==========================================

app.get('/admin', (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'ADMIN') {
        return res.redirect('/');
    }
    res.send(`<h1>Bem-vindo ao Painel Admin, ${req.session.usuario.nome}!</h1> <a href="/logout">Sair</a>`);
});

// ==========================================
// MIDDLEWARES DE PROTEÇÃO
// ==========================================

// (O verificarAdmin que você já tem fica aqui...)

// Middleware de proteção exclusivo para alunos
function verificarAluno(req, res, next) {
    if (!req.session.usuario || req.session.usuario.tipo !== 'ALUNO') {
        return res.redirect('/');
    }
    next();
}

// ==========================================
// ROTAS DO ALUNO
// ==========================================

// GET: Dashboard do Aluno (Lista os cursos matriculados e KPIs)
app.get('/aluno', verificarAluno, async (req, res) => {
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

        // ==========================================
        // LÓGICA DOS INDICADORES (KPIs) DO ALUNO
        // ==========================================

        // 2. Aulas Concluídas vs Total Geral (Calculando o total real de todos os cursos que o aluno tem)
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

        // 3. Nota Média Geral (Baseada na nota máxima)
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

        // 5. Objeto final que será enviado para a View
        const kpiData = {
            notaMedia: notaMedia,
            aulasConcluidas: stringAulasKpi,
            melhoresCursos: melhoresCursos
        };

        res.send(renderAlunoDashboardView(req.session.usuario, cursosMatriculados, kpiData));

    } catch (error) {
        console.error('Erro ao carregar dashboard do aluno:', error);
        res.status(500).send('<h1>Erro interno ao carregar seus cursos.</h1>');
    }
});

// ==========================================
// API DE NOTIFICAÇÕES (ALUNO)
// ==========================================

// GET: Verifica se o aluno tem notificações pendentes (Para o Pop-up automático)
app.get('/aluno/api/notificacoes/pendente', verificarAluno, async (req, res) => {
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

// GET: Lista as últimas notificações para o menu dropdown do sino (Ignorando as ocultas)
app.get('/aluno/api/notificacoes/lista', verificarAluno, async (req, res) => {
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

// POST: Limpar (Ocultar) todas as notificações do aluno
app.post('/aluno/api/notificacoes/limpar', verificarAluno, async (req, res) => {
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

// POST: Marca todas as notificações pendentes como lidas (Usado quando o aluno clica no sino)
app.post('/aluno/api/notificacoes/marcar-vistas', verificarAluno, async (req, res) => {
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

// POST: Marca uma notificação específica como lida (usado quando o aluno clica no sino)
app.post('/aluno/api/notificacoes/:id/lida', verificarAluno, async (req, res) => {
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

// POST: Recebe a resposta do aluno no modal
app.post('/aluno/api/notificacoes/:id/responder', verificarAluno, async (req, res) => {
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

// ==========================================
// GERENCIAMENTO DE NOTIFICAÇÕES (ADMIN)
// ==========================================

// GET: Listar Notificações, Estatísticas e Respostas
app.get('/admin/notificacoes', verificarAdmin, async (req, res) => {
    try {
        // 1. Busca todas as notificações + contagens + nomes dos cursos (se houver)
        const [notificacoes] = await db.execute(`
            SELECT n.*, 
                   (SELECT COUNT(*) FROM notificacao_entregas WHERE notificacao_id = n.id) AS total_enviados,
                   (SELECT COUNT(*) FROM notificacao_entregas WHERE notificacao_id = n.id AND status = 'LIDA') AS total_lidos,
                   (SELECT GROUP_CONCAT(c.titulo SEPARATOR ', ') 
                    FROM notificacao_cursos nc 
                    JOIN cursos c ON nc.curso_id = c.id 
                    WHERE nc.notificacao_id = n.id) AS cursos_alvo_nomes
            FROM notificacoes n
            ORDER BY n.criado_em DESC
        `);

        // 2. Para cada notificação que permite interação, busca as respostas
        for (let notif of notificacoes) {
            if (notif.tipo_interacao !== 'NENHUM') {
                const [respostas] = await db.execute(`
                    SELECT nr.*, u.nome AS nome_aluno 
                    FROM notificacao_respostas nr
                    JOIN usuarios u ON nr.aluno_id = u.id
                    WHERE nr.notificacao_id = ?
                    ORDER BY nr.respondido_em DESC
                `, [notif.id]);
                notif.respostas = respostas;
            }
        }

        res.send(renderAdminNotificacoesView(req.session.usuario, notificacoes));
    } catch (error) {
        console.error('Erro ao listar notificações:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

// GET: Exportar Respostas da Notificação para CSV (Excel)
app.get('/admin/notificacoes/:id/exportar', verificarAdmin, async (req, res) => {
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

// POST: Editar Notificação (E Prolongar Datas)
app.post('/admin/notificacoes/:id/editar', verificarAdmin, async (req, res) => {
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

// POST: Excluir Notificação Definitivamente
app.post('/admin/notificacoes/:id/excluir', verificarAdmin, async (req, res) => {
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

// GET: Tela de Edição de Perfil do Aluno
app.get('/aluno/perfil', verificarAluno, (req, res) => {
    res.send(renderAlunoEditarPerfilView(req.session.usuario));
});

// POST: Processar Atualização de Perfil do Aluno
app.post('/aluno/perfil', verificarAluno, uploadPerfil.single('foto_perfil'), async (req, res) => {
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

        // ==========================================
        // ATUALIZA A SESSÃO EM TEMPO REAL
        // ==========================================
        req.session.usuario.nome = nome;
        req.session.usuario.foto_perfil_url = foto_perfil_url;

        // Redireciona de volta para o Dashboard
        res.redirect('/aluno');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao atualizar perfil.');
    }
});

// GET: Tela de Nova Notificação
app.get('/admin/notificacoes/nova', verificarAdmin, async (req, res) => {
    try {
        const [cursos] = await db.execute("SELECT id, titulo FROM cursos WHERE status = 'PUBLICADO' ORDER BY titulo ASC");
        res.send(renderAdminNovaNotificacaoView(req.session.usuario, cursos));
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao carregar tela de notificação.');
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

// ==========================================
// ROTAS DO FÓRUM (COMUNIDADE)
// ==========================================

function usuarioOpcional(req, res, next) {
    req.usuarioLogado = req.session.usuario || null;
    next();
}

// GET: Lista todos os Tópicos (PÚBLICO - COM FILTROS, BUSCA E ESTATÍSTICAS DO ALUNO)
app.get('/forum', usuarioOpcional, async (req, res) => {
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

// GET: Renderiza formulário de Nova Pergunta (PROTEGIDO)
app.get('/forum/novo', async (req, res) => {
    if (!req.session.usuario) return res.redirect('/login?returnTo=/forum/novo');
    try {
        const [cursos] = await db.execute("SELECT titulo FROM cursos WHERE status = 'PUBLICADO' ORDER BY titulo ASC");
        res.send(renderForumNovoTopicoView(req.session.usuario, cursos));
    } catch (error) {
        console.error('Erro ao carregar nova pergunta:', error);
        res.status(500).send('Erro interno.');
    }
});

// POST: Processa a Nova Pergunta (PROTEGIDO)
app.post('/forum/novo', uploadForum.single('print_imagem'), async (req, res) => {
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

// GET: Visualizar um Tópico Específico (PÚBLICO - COM ESTATÍSTICAS)
app.get('/forum/topico/:id', usuarioOpcional, async (req, res) => {
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

// POST: Enviar Resposta (PROTEGIDO)
app.post('/forum/topico/:id/responder', uploadForum.single('print_imagem'), async (req, res) => {
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

// GET: Sair da conta (Logout)
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Inicialização
app.listen(port, () => {
    console.log(`🚀 Servidor OnStude rodando em http://localhost:${port}`);
});