const express = require('express');
const router = express.Router();
const db = require('../../db');

const renderValidarCertificadoView = require('../../views/validarCertificadoView');

//------------------------------------------------------------------------------ROTA PARA VALIDAR CERTIFICADO------------------------------------------------------------------------------
//VALIDAR CERTIFICADO
router.get('/validar', async (req, res) => {
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

module.exports = router;