const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

const renderLoginView = require('../views/loginView');

//------------------------------------------------------------------------------ROTAS DE LOGIN------------------------------------------------------------------------------
//PÁGINA DE LOGIN
router.get('/login', (req, res) => {
    const returnTo = req.query.returnTo || '';

    if (req.session.usuario) {
        if (returnTo && returnTo.startsWith('/')) return res.redirect(returnTo);

        // Atualizado: ADMIN e MENTOR vão para o painel /admin
        return res.redirect((req.session.usuario.tipo === 'ADMIN' || req.session.usuario.tipo === 'MENTOR') ? '/admin' : '/aluno');
    }

    // O seu renderLoginView já está preparado para receber isto
    const renderLoginView = require('../views/loginView');
    res.send(renderLoginView(null, returnTo));
});

//PROCESSA O LOGIN
router.post('/login', async (req, res) => {
    const { email, senha, returnTo } = req.body;
    const renderLoginView = require('../views/loginView');

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

        // 4. REDIRECIONAMENTO INTELIGENTE
        if (returnTo && returnTo.startsWith('/')) {
            res.redirect(returnTo);
        } else if (usuario.tipo === 'ADMIN' || usuario.tipo === 'MENTOR') {
            // Atualizado: MENTOR também vai para o painel de gestão
            res.redirect('/admin');
        } else {
            res.redirect('/aluno');
        }

    } catch (error) {
        console.error('Erro no login:', error);
        res.send(renderLoginView('Erro interno ao processar o login. Tente novamente.', returnTo));
    }
});

//SAIR
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;