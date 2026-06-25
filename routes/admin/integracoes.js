const express = require('express');
const router = express.Router();
const db = require('../../db');

// Middlewares e Configurações de Upload
const { verificarAdmin } = require('../../middlewares/authMiddleware');
const { uploadNotificacao } = require('../../config/uploadConfig');

// Importação das Views
const renderAdminNotificacoesView = require('../../views/adminNotificacoesView');
const renderAdminNovaNotificacaoView = require('../../views/adminNovaNotificacaoView');
const renderAdminIntegracoesView = require('../../views/renderAdminIntegracoesView');

//------------------------------------------------------------------------------ROTAS DE INTEGRAÇÕES------------------------------------------------------------------------------
//INTEGRAÇÕES
router.get('/admin/integracoes', verificarAdmin, (req, res) => {
    // No futuro, esta chave pode vir do banco de dados ou ficheiro .env
    const configIntegracao = {
        webhookUrl: 'http://localhost:3000/api/webhooks/vagas', // Mude para o seu domínio em produção
        apiKey: process.env.ECOCAIXAS_API_KEY,
        status: 'ATIVO'
    };

    // Precisará importar a view no topo do app.js: 
    res.send(renderAdminIntegracoesView(req.session.usuario, configIntegracao));
});

router.post('/api/webhooks/vagas', async (req, res) => {
    // 1. Camada de Segurança: Apenas a Ecocaixas sabe esta chave!
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== process.env.ECOCAIXAS_API_KEY) {
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

module.exports = router;