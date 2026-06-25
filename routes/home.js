const express = require('express');
const router = express.Router();
const db = require('../db');

// Importação das Views Públicas (Apenas as que sobraram)
const renderHomeView = require('../views/homeView');
const renderCategoriasView = require('../views/categoriasView');
const renderCursoPublicoView = require('../views/cursoPublicoView');

//------------------------------------------------------------------------------ROTAS HOME------------------------------------------------------------------------------
//PÁGINA HOME
router.get('/', async (req, res) => {
    try {
        // Query para listar cursos na home page, com a duração total e avaliações calculadas
        const [cursos] = await db.execute(`
            SELECT 
                c.*,
                (SELECT SUM(a.duracao_segundos) 
                 FROM aulas a 
                 JOIN modulos mo ON a.modulo_id = mo.id 
                 WHERE mo.curso_id = c.id
                ) AS duracao_total_segundos,
                COALESCE(AVG(av.nota), 0) AS nota_media,
                COUNT(av.id) AS total_avaliacoes
            FROM cursos c 
            LEFT JOIN avaliacoes_curso av ON c.id = av.curso_id
            WHERE c.status = 'PUBLICADO' 
            GROUP BY c.id
            ORDER BY c.criado_em DESC 
            LIMIT 10
        `);

        // Renderiza a homeView
        res.send(renderHomeView(req.session.usuario || null, cursos));
    } catch (error) {
        console.error('Erro ao carregar a página inicial:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

//BARRA DE PESQUISA PARA BUSCA DE CURSOS
router.get('/api/cursos/search', async (req, res) => {
    const query = req.query.q;

    if (!query || query.trim() === '') {
        return res.json({ success: true, cursos: [] });
    }

    try {
        const searchTerm = `%${query}%`;

        // Adicionado o 'OR mercado LIKE ?' para buscar também por palavras-chave/categorias
        const [cursos] = await db.execute(`
            SELECT id, titulo, descricao, capa_url, mercado
            FROM cursos 
            WHERE status = 'PUBLICADO' 
            AND (titulo LIKE ? OR descricao LIKE ? OR mercado LIKE ?)
            ORDER BY criado_em DESC 
            LIMIT 5
        `, [searchTerm, searchTerm, searchTerm]); // Passamos o searchTerm 3 vezes agora

        res.json({ success: true, cursos });
    } catch (error) {
        console.error('Erro na busca dinâmica de cursos:', error);
        res.status(500).json({ success: false, error: 'Erro interno.' });
    }
});

//PÁGINA CATEGORIAS
router.get('/categorias', async (req, res) => {
    try {
        // Busca todos os cursos publicados com a média de notas e total de avaliações (AGORA TRAZENDO O DESCONTO)
        const [cursos] = await db.execute(`
            SELECT c.id, c.titulo, c.descricao, c.capa_url, c.preco, c.desconto_percentual, c.duracao_horas, c.mercado,
                   COALESCE(AVG(a.nota), 0) AS nota_media,
                   COUNT(a.id) AS total_avaliacoes
            FROM cursos c
            LEFT JOIN avaliacoes_curso a ON c.id = a.curso_id
            WHERE c.status = 'PUBLICADO'
            GROUP BY c.id
            ORDER BY c.criado_em DESC
        `);

        // Objeto para agrupar os cursos pelo campo "mercado"
        const categoriasMap = {};

        cursos.forEach(curso => {
            // Se o mercado for nulo ou vazio, agrupa em "Geral"
            let chaveMercado = (curso.mercado && curso.mercado.trim() !== '') ? curso.mercado.trim().toLowerCase() : 'default';

            // Tratamento das strings do banco para encaixar nas chaves da view
            if (chaveMercado.includes('tech') || chaveMercado.includes('tecnologia') || chaveMercado.includes('programação')) chaveMercado = 'tecnologia';
            else if (chaveMercado.includes('negócio') || chaveMercado.includes('negocio') || chaveMercado.includes('admin')) chaveMercado = 'negocios';
            else if (chaveMercado.includes('design') || chaveMercado.includes('arte')) chaveMercado = 'design';
            else if (chaveMercado.includes('marketing') || chaveMercado.includes('venda')) chaveMercado = 'marketing';
            else if (chaveMercado.includes('escritorio') || chaveMercado.includes('escritório') || chaveMercado.includes('office')) chaveMercado = 'escritorio';

            if (!categoriasMap[chaveMercado]) {
                categoriasMap[chaveMercado] = {
                    chave: chaveMercado,
                    nome: curso.mercado, // Nome original que veio do banco
                    cursos: []
                };
            }
            categoriasMap[chaveMercado].cursos.push(curso);
        });

        // Transforma o mapa num array para passar para a view
        const categoriasArray = Object.values(categoriasMap);

        const renderCategoriasView = require('../views/categoriasView');
        res.send(renderCategoriasView(req.session.usuario || null, categoriasArray));

    } catch (error) {
        console.error('Erro ao carregar categorias:', error);
        res.status(500).send('Erro interno do servidor.');
    }
});

//PÁGINA PÚBLICA DE DETALHES DO CURSO
router.get('/cursos/:id', async (req, res) => {
    const cursoId = req.params.id;
    const usuarioLogado = req.session.usuario || null;

    try {
        // AQUI ESTÁ A ATUALIZAÇÃO DA QUERY PARA AS ESTRELAS E AVALIAÇÕES
        const [cursos] = await db.execute(`
            SELECT c.*, 
                   COALESCE(AVG(av.nota), 0) AS nota_media, 
                   COUNT(av.id) AS total_avaliacoes 
            FROM cursos c 
            LEFT JOIN avaliacoes_curso av ON c.id = av.curso_id 
            WHERE c.id = ? AND c.status = 'PUBLICADO'
            GROUP BY c.id
        `, [cursoId]);

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

        const renderCursoPublicoView = require('../views/cursoPublicoView');
        res.send(renderCursoPublicoView(usuarioLogado, curso, cronograma, isMatriculado));

    } catch (error) {
        console.error('Erro ao carregar detalhes do curso:', error);
        res.status(500).send('Erro interno ao carregar o curso.');
    }
});

module.exports = router;