const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Importação da View que acabamos de criar
const renderTestesView = require('../../views/testesView');

// =========================================================================
// FUNÇÃO RECURSIVA: Varre pastas e subpastas atrás de arquivos .js
// =========================================================================
function buscarArquivosDeRota(diretorioBase, listaDeArquivos = []) {
    const itens = fs.readdirSync(diretorioBase);

    itens.forEach(item => {
        const caminhoCompleto = path.join(diretorioBase, item);
        const stat = fs.statSync(caminhoCompleto);

        if (stat.isDirectory()) {
            // Se for uma pasta, a função chama a si mesma para mergulhar nela
            buscarArquivosDeRota(caminhoCompleto, listaDeArquivos);
        } else if (item.endsWith('.js')) {
            // Se for um arquivo JavaScript, adiciona à lista
            listaDeArquivos.push(caminhoCompleto);
        }
    });

    return listaDeArquivos;
}

// PAINEL DE TESTES DE ROTAS (SWAGGER INTERNO BATCH TESTER)
router.get('/dev/testes', (req, res) => {
    // Segurança: Apenas Administradores
    if (!req.session || !req.session.usuario || req.session.usuario.tipo !== 'ADMIN') {
        return res.redirect('/');
    }

    // AJUSTE DE CAMINHOS: 
    // Como testes.js está em /routes/admin, voltamos 1 nível para chegar em /routes
    const routesDir = path.join(__dirname, '..'); 
    
    // Voltamos 2 níveis para chegar na raiz do projeto onde está o app.js
    const appJsPath = path.join(__dirname, '..', '..', 'app.js'); 
    
    const rotasEncontradas = [];
    const prefixMap = {}; 

    // 1. Escaneia o app.js para descobrir os prefixos automaticamente
    if (fs.existsSync(appJsPath)) {
        const appContent = fs.readFileSync(appJsPath, 'utf-8');
        
        const requireRegex = /(?:const|let|var)\s+(\w+)\s*=\s*require\(['"]\.\/routes\/([^'"]+)['"]\)/g;
        let reqMatch;
        const fileToVar = {}; 
        while ((reqMatch = requireRegex.exec(appContent)) !== null) {
            const varName = reqMatch[1];
            // Guarda o caminho relativo (ex: cursos/cursos.js)
            const fileName = reqMatch[2].endsWith('.js') ? reqMatch[2] : reqMatch[2] + '.js';
            fileToVar[varName] = fileName;
        }

        const useRegex = /app\.use\(['"]([^'"]+)['"]\s*,\s*(\w+)\)/g;
        let useMatch;
        while ((useMatch = useRegex.exec(appContent)) !== null) {
            const prefix = useMatch[1];
            const varName = useMatch[2];
            
            if (fileToVar[varName]) {
                const fileName = fileToVar[varName];
                prefixMap[fileName] = prefix === '/' ? '' : prefix; 
            }
        }
    }

    // 2. Coleta os dados das rotas de forma recursiva (usando a nova função)
    if (fs.existsSync(routesDir)) {
        const arquivos = buscarArquivosDeRota(routesDir);
        
        arquivos.forEach(caminhoCompleto => {
            const content = fs.readFileSync(caminhoCompleto, 'utf-8');
            const regex = /router\.(get|post|put|delete|patch)\s*\(\s*["']([^"']+)["']([\s\S]*?)(?=router\.(get|post|put|delete|patch)|module\.exports|$)/g;
            let match;
            
            // Pega o caminho relativo do arquivo em relação à pasta /routes e padroniza as barras
            // Ex: admin\testes.js vira admin/testes.js
            let relativePath = path.relative(routesDir, caminhoCompleto).replace(/\\/g, '/');
            
            const prefixoDetectado = prefixMap[relativePath] !== undefined ? prefixMap[relativePath] : '';

            while ((match = regex.exec(content)) !== null) {
                const metodo = match[1].toUpperCase();
                const rota = match[2];
                const blockCode = match[3]; 

                let payloadJson = "";

                if (['POST', 'PUT', 'PATCH'].includes(metodo)) {
                    const fields = new Set();
                    const destructuringMatch = blockCode.match(/\{\s*([^}]+)\s*\}\s*=\s*req\.body/);
                    if (destructuringMatch) {
                        const vars = destructuringMatch[1].split(',').map(v => v.split('=')[0].trim().replace(/[^a-zA-Z0-9_]/g, ''));
                        vars.forEach(v => { if (v) fields.add(v); });
                    }
                    const dotRegex = /req\.body\.([a-zA-Z0-9_]+)/g;
                    let dotMatch;
                    while ((dotMatch = dotRegex.exec(blockCode)) !== null) {
                        fields.add(dotMatch[1]);
                    }
                    if (fields.size > 0) {
                        const obj = {};
                        fields.forEach(f => obj[f] = ""); 
                        payloadJson = JSON.stringify(obj, null, 2);
                    } else {
                        payloadJson = '{\n  "campo": "valor"\n}';
                    }
                }

                rotasEncontradas.push({
                    arquivo: relativePath, // Mostra a pasta/nome na tela bonitinho (ex: cursos/aulas.js)
                    metodo: metodo,
                    rota: rota,
                    prefixoAuto: prefixoDetectado,
                    payloadDefault: payloadJson
                });
            }
        });
    }

    // 3. Renderiza a view enviando os dados mapeados
    res.send(renderTestesView(req.session.usuario, rotasEncontradas));
});

module.exports = router;