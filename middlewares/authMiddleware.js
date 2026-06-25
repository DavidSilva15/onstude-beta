// middlewares/authMiddleware.js

/**
 * Middleware para proteger rotas exclusivas da Administração e Mentores.
 * Redireciona para a home caso o utilizador não tenha permissão.
 */
function verificarAdmin(req, res, next) {
    if (!req.session.usuario || (req.session.usuario.tipo !== 'ADMIN' && req.session.usuario.tipo !== 'MENTOR')) {
        return res.redirect('/');
    }
    next();
}

/**
 * Middleware para proteger rotas exclusivas dos Alunos.
 * Redireciona para a home caso o utilizador não seja um aluno.
 */
function verificarAluno(req, res, next) {
    if (!req.session.usuario || req.session.usuario.tipo !== 'ALUNO') {
        return res.redirect('/');
    }
    next();
}

module.exports = {
    verificarAdmin,
    verificarAluno
};