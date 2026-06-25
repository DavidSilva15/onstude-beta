require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const db = require('./db');

const app = express();
const port = process.env.PORT;

app.use((req, res, next) => {
    if (req.headers['x-test-mode'] === 'true' && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        
        console.log(`🛡️  [MODO SEGURO] Interceptada requisição destrutiva para: ${req.method} ${req.url}`);
        // Simula que a operação foi um sucesso e devolve um 200 OK sem tocar no banco de dados
        return res.status(200).json({
            success: true,
            _warning: "DRY_RUN_ACTIVE",
            message: "Esta foi uma simulação pelo Laboratório de Testes. O banco de dados NÃO foi alterado.",
            payload_recebido: req.body // Retorna o que enviamos só para vermos na resposta da tela
        });
    }
    next();
});

// CONFIGURAÇÕES DO EXPRESS E SESSÃO
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

app.use(session({
    secret: process.env.SESSION_SECRET, // Em produção, use variáveis de ambiente (.env)
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // secure: true apenas se estiver usando HTTPS
}));

// ==========================================
// IMPORTAÇÃO DAS ROTAS
// ==========================================
const publicRoutes = require('./routes/home');
const loginRoutes = require('./routes/login');
const cadastroRoutes = require('./routes/cadastro');
const validarCertificadoRoutes = require('./routes/aluno/validarCertificado');

const alunoDashboardRoutes = require('./routes/aluno/aluno');
const alunoLojaRoutes = require('./routes/market/market');
const alunoSalaAulaRoutes = require('./routes/aluno/salaAula');
const curriculosRoutes = require('./routes/admin/curriculos');

// --- Rotas Administrativas Separadas ---
const adminRoutes = require('./routes/admin/admin');
const cursosRoutes = require('./routes/cursos/cursos');
const modulosRoutes = require('./routes/cursos/modulos');
const aulasRoutes = require('./routes/cursos/aulas');

const adminUsuariosRoutes = require('./routes/admin/usuarios');
const notificacoesRoutes = require('./routes/admin/notificacoes');
const integracoesRoutes = require('./routes/admin/integracoes');

const forumRoutes = require('./routes/aluno/forum');
const planoCarreiraRoutes = require('./routes/aluno/planoCarreira');
const alunoNotificacoesRoutes = require('./routes/aluno/notificacoesAluno');
const testesRoutes = require('./routes/admin/testes');

// ==========================================
// REGISTRO DAS ROTAS (Middlewares)
// ==========================================
app.use('/', publicRoutes);
app.use('/', loginRoutes);
app.use('/', cadastroRoutes);
app.use('/', validarCertificadoRoutes);

app.use('/', alunoDashboardRoutes);
app.use('/', alunoLojaRoutes);
app.use('/', alunoSalaAulaRoutes);
app.use('/', curriculosRoutes);

// --- Registro das Rotas Administrativas ---
app.use('/', adminRoutes);
app.use('/', cursosRoutes);
app.use('/', modulosRoutes);
app.use('/', aulasRoutes);

app.use('/', adminUsuariosRoutes);
app.use('/', notificacoesRoutes);
app.use('/', integracoesRoutes); 
app.use('/', forumRoutes);
app.use('/', planoCarreiraRoutes);
app.use('/', alunoNotificacoesRoutes);
app.use('/', testesRoutes);

// Memória global para acompanhar o progresso das conversões de vídeo
global.tarefasProcessamento = {};

// O Toast do Front-End vai consultar esta rota a cada segundo
app.get('/api/processamento/status/:jobId', (req, res) => {
    const job = global.tarefasProcessamento[req.params.jobId];
    if (job) {
        res.json({ success: true, job });
    } else {
        res.json({ success: false, message: 'Tarefa não encontrada' });
    }
});

//INICIALIZAÇÃO DO SERVIDOR
app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 Servidor OnStude rodando em http://localhost:${port}`);
});