const express = require('express');
const router = express.Router();
const db = require('../../db');
const PDFDocument = require('pdfkit');

const renderPlanoCarreiraView = require('../../views/planoCarreiraView');

//------------------------------------------------------------------------------ROTAS DO PLANO DE CARREIRA------------------------------------------------------------------------------
//PÁGINA PLANO DE CARREIRA
router.get('/plano-de-carreira', async (req, res) => {
    try {
        const [modelosCV] = await db.execute('SELECT * FROM curriculo_modelos ORDER BY id DESC');
        const renderPlanoCarreiraView = require('../../views/planoCarreiraView');
        res.send(renderPlanoCarreiraView(req.session.usuario || null, modelosCV));
    } catch (error) {
        console.error('Erro ao carregar Plano de Carreira:', error);
        res.status(500).send('Erro interno.');
    }
});

//GERAR CURRÍCULO PDF
router.post('/plano-de-carreira/gerar-pdf', async (req, res) => {
    try {
        const dados = req.body;

        // Inicializa o documento A4 com margens padrão
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        const nomeArquivo = `Curriculo_${dados.nome.replace(/\s+/g, '_')}.pdf`;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${nomeArquivo}`);

        doc.pipe(res);

        // TEMA E PALETA DE CORES (Executivo)
        const corPrimaria = '#2C3E50';
        const corTexto = '#333333';
        const corSecundaria = '#7F8C8D';
        const corLinha = '#BDC3C7';

        // DESENHO DO PDF (DESIGN)
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
        doc.end();

    } catch (error) {
        console.error('Erro ao gerar PDF do Currículo:', error);
        res.status(500).send('Erro ao gerar o PDF.');
    }
});

module.exports = router;