// routes/alunoLoja.js
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../../db');

const { verificarAluno } = require('../../middlewares/authMiddleware');

//CONFIGURAÇÕES MERCADO PAGO
const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN });

const renderAlunoCarrinhoView = require('../../views/alunoCarrinhoView');

//------------------------------------------------------------------------------ROTAS DO MARKET------------------------------------------------------------------------------
//FORMULÁRIO DO CARRINHO
router.get('/aluno/carrinho', verificarAluno, async (req, res) => {
    const aluno = req.session.usuario;

    try {
        // Busca os detalhes dos cursos diretamente da nova tabela do carrinho cruzando com a tabela cursos
        const [cursosCarrinho] = await db.execute(`
            SELECT c.id, c.titulo, c.capa_url, c.preco, c.desconto_percentual 
            FROM carrinho_itens ci
            JOIN cursos c ON ci.curso_id = c.id
            WHERE ci.aluno_id = ? AND c.status = 'PUBLICADO'
        `, [aluno.id]);

        const renderAlunoCarrinhoView = require('../../views/alunoCarrinhoView');
        res.send(renderAlunoCarrinhoView(aluno, cursosCarrinho));

    } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
        res.status(500).send('Erro ao carregar o carrinho.');
    }
});

//ADICIONAR CURSO AO CARRINHO
router.post('/aluno/carrinho/adicionar', verificarAluno, async (req, res) => {
    const { curso_id } = req.body;
    const alunoId = req.session.usuario.id;

    try {
        // 1. Verifica se o aluno já tem este curso (Ativo ou Concluído)
        const [matriculas] = await db.execute(
            'SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ? AND status IN ("ATIVA", "CONCLUIDA")',
            [alunoId, curso_id]
        );
        if (matriculas.length > 0) {
            return res.json({ success: false, message: 'Você já possui este curso.' });
        }

        // 2. Tenta inserir no carrinho (A restrição UNIQUE do banco impede duplicados automaticamente)
        try {
            await db.execute('INSERT INTO carrinho_itens (aluno_id, curso_id) VALUES (?, ?)', [alunoId, curso_id]);
        } catch (insertError) {
            if (insertError.code === 'ER_DUP_ENTRY') {
                return res.json({ success: false, message: 'Curso já está no carrinho.' });
            }
            throw insertError;
        }

        res.json({ success: true });

    } catch (error) {
        console.error('Erro ao adicionar ao carrinho:', error);
        res.status(500).json({ success: false, message: 'Erro interno ao adicionar curso.' });
    }
});

//REMOVER CURSO DO CARRINHO
router.post('/aluno/carrinho/remover', verificarAluno, async (req, res) => {
    const { curso_id } = req.body;
    const alunoId = req.session.usuario.id;

    try {
        await db.execute('DELETE FROM carrinho_itens WHERE aluno_id = ? AND curso_id = ?', [alunoId, curso_id]);
        res.json({ success: true });
    } catch (error) {
        console.error('Erro ao remover do carrinho:', error);
        res.status(500).json({ success: false });
    }
});

//FINALIZAR COMPRA(CHECKOUT PARA O MERCADO PAGO)
router.post('/aluno/checkout', verificarAluno, async (req, res) => {
    const aluno = req.session.usuario;

    try {
        const [cursosCarrinho] = await db.execute(`
            SELECT c.id, c.titulo, c.preco, c.desconto_percentual 
            FROM carrinho_itens ci
            JOIN cursos c ON ci.curso_id = c.id
            WHERE ci.aluno_id = ?
        `, [aluno.id]);

        // AJUSTE 1: Retorna JSON avisando que está vazio em vez de redirecionar direto
        if (cursosCarrinho.length === 0) {
            return res.status(400).json({ success: false, message: 'Carrinho vazio', redirectUrl: '/aluno/carrinho' });
        }

        let totalComDesconto = 0;
        let itensParaMercadoPago = [];

        cursosCarrinho.forEach(curso => {
            const precoReal = parseFloat(curso.preco) || 0;
            const desc = parseInt(curso.desconto_percentual) || 0;
            const precoFinal = precoReal - (precoReal * (desc / 100));

            totalComDesconto += precoFinal;

            itensParaMercadoPago.push({
                id: curso.id.toString(),
                title: curso.titulo,
                quantity: 1,
                unit_price: Number(precoFinal.toFixed(2)),
                currency_id: 'BRL'
            });
        });

        // 1. Regista o Pedido (PENDENTE) no Banco de Dados
        const [resultadoPedido] = await db.execute(
            'INSERT INTO pedidos (aluno_id, total) VALUES (?, ?)',
            [aluno.id, totalComDesconto]
        );
        const pedidoId = resultadoPedido.insertId;

        // 2. Associa os itens ao pedido
        for (const curso of cursosCarrinho) {
            const precoReal = parseFloat(curso.preco) || 0;
            const desc = parseInt(curso.desconto_percentual) || 0;
            const precoFinal = precoReal - (precoReal * (desc / 100));

            await db.execute(
                'INSERT INTO pedido_itens (pedido_id, curso_id, preco_pago) VALUES (?, ?, ?)',
                [pedidoId, curso.id, precoFinal]
            );
        }

        // 3. Esvazia o carrinho agora que o pedido foi gerado!
        await db.execute('DELETE FROM carrinho_itens WHERE aluno_id = ?', [aluno.id]);

        // 4. Cria a Preferência (Intenção de Compra) no Mercado Pago
        const preference = new Preference(client);
        const urlRetornoBase = 'https://onstude.com.br';

        const respostaMP = await preference.create({
            body: {
                items: itensParaMercadoPago,
                payer: { name: aluno.nome, email: aluno.email },
                back_urls: {
                    success: `${urlRetornoBase}/aluno/checkout/sucesso?pedido_id=${pedidoId}`,
                    failure: `${urlRetornoBase}/aluno/carrinho`,
                    pending: `${urlRetornoBase}/aluno/checkout/pendente?pedido_id=${pedidoId}`
                },
                auto_return: 'approved',
                external_reference: pedidoId.toString()
            }
        });

        // 5. Atualiza o pedido com o ID do Mercado Pago
        await db.execute('UPDATE pedidos SET mp_preference_id = ? WHERE id = ?', [respostaMP.id, pedidoId]);

        // AJUSTE 2: Devolve a URL em formato JSON para o AJAX capturar e disparar o Modal
        res.json({ url: respostaMP.init_point });

    } catch (error) {
        console.error('Erro ao gerar checkout:', error);
        // AJUSTE 3: Erro genérico retorna JSON com status 500 para não quebrar o fetch do front
        res.status(500).json({ success: false, message: 'Erro ao processar o checkout.' });
    }
});

//------------------------------------------------------------------------------RETORNO DO CHECKOUT(MERCADO PAGO)------------------------------------------------------------------------------
//PAGAMENTO APROVADO
router.get('/aluno/checkout/sucesso', verificarAluno, (req, res) => {
    res.redirect('/aluno');
});

//ESPERA PARA PIX OU BOLETO
router.get('/aluno/checkout/pendente', verificarAluno, (req, res) => {
    res.redirect('/aluno');
});

//CANCELAMENTO DA COMPRA OU ERRO
router.get('/aluno/checkout/falha', verificarAluno, (req, res) => {
    res.redirect('/aluno/carrinho');
});

//WEBHOOK PARA RECEBER AVISOS DO MERCADO PAGO
router.post('/api/webhooks/mercadopago', async (req, res) => {
    // Respondemos com 200 OK imediatamente para o Mercado Pago não achar que o servidor caiu
    res.status(200).send('OK');

    // Captura o tipo e o ID do pagamento tratando as variações da API deles (IPN vs Webhook)
    const type = req.query.topic || req.query.type || req.body.type || req.body.action;
    const dataId = req.query.id || (req.body.data && req.body.data.id);

    console.log(`🔔 [Webhook MP] Notificação recebida! Tipo: ${type} | ID: ${dataId}`);

    // Se for uma notificação de pagamento válida, vamos processar
    if ((type === 'payment' || type === 'payment.created' || type === 'payment.updated') && dataId) {
        try {
            const { Payment } = require('mercadopago');
            const payment = new Payment(client);
            const infoPagamento = await payment.get({ id: dataId });

            // Se o status no Mercado Pago for aprovado de verdade
            if (infoPagamento.status === 'approved') {
                const pedidoId = infoPagamento.external_reference; // É o ID do pedido que guardamos

                // 1. Atualiza o status do pedido no seu banco
                await db.execute(
                    'UPDATE pedidos SET status = "APROVADO", mp_payment_id = ?, atualizado_em = NOW() WHERE id = ? AND status = "PENDENTE"',
                    [infoPagamento.id, pedidoId]
                );

                // 2. Busca quem é o aluno e quais cursos estão nesse pedido
                const [pedidoItens] = await db.execute(`
                    SELECT pi.curso_id, p.aluno_id 
                    FROM pedido_itens pi 
                    JOIN pedidos p ON pi.pedido_id = p.id 
                    WHERE pi.pedido_id = ?
                `, [pedidoId]);

                // 3. Varre os itens e faz a matrícula automática do aluno
                for (let item of pedidoItens) {
                    const [matriculaExistente] = await db.execute(
                        'SELECT id FROM matriculas WHERE aluno_id = ? AND curso_id = ?',
                        [item.aluno_id, item.curso_id]
                    );

                    if (matriculaExistente.length === 0) {
                        const [novaMatricula] = await db.execute(
                            'INSERT INTO matriculas (aluno_id, curso_id, status, origem) VALUES (?, ?, "ATIVA", "COMPRA_SITE")',
                            [item.aluno_id, item.curso_id]
                        );

                        // Cria os registros de certificado e progresso para essa nova matrícula
                        const tokenCertificado = crypto.randomBytes(4).toString('hex').toUpperCase();
                        await db.execute('INSERT INTO certificados (matricula_id, token) VALUES (?, ?)', [novaMatricula.insertId, tokenCertificado]);
                        await db.execute('INSERT INTO progresso_curso (matricula_id) VALUES (?)', [novaMatricula.insertId]);
                    }
                }
                console.log(`✅ [Mercado Pago] Sucesso absoluto! Pedido ${pedidoId} processado e cursos liberados.`);
            }
        } catch (error) {
            console.error('❌ [Mercado Pago] Erro ao processar dados do Webhook:', error.message);
        }
    }
});

//QUANTIDADE DE ITENS DO CARRINHO
router.get('/api/carrinho/count', async (req, res) => {
    if (!req.session.usuario || req.session.usuario.tipo !== 'ALUNO') {
        return res.json({ count: 0 });
    }

    try {
        const [total] = await db.execute('SELECT COUNT(*) as qtd FROM carrinho_itens WHERE aluno_id = ?', [req.session.usuario.id]);
        res.json({ count: total[0].qtd });
    } catch (error) {
        console.error('Erro ao contar itens do carrinho:', error);
        res.json({ count: 0 });
    }
});

//MATRICULA SEM COBRANÇA PARA CURSOS GRATUITOS
router.post('/aluno/matricula/gratis', verificarAluno, async (req, res) => {
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

module.exports = router;