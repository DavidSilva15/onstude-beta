const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

const renderCadastroView = require('../views/cadastroView');

//------------------------------------------------------------------------------ROTAS DE CADASTRO------------------------------------------------------------------------------
//PÁGINA DE CADASTRO
router.get('/cadastro', (req, res) => {
    res.send(renderCadastroView());
});

//NOVO CADASTRO
router.post('/cadastro', async (req, res) => {
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

module.exports = router;