// config/uploadConfig.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Função utilitária para criar storages do Multer dinamicamente.
 * @param {string} subPasta - Caminho da pasta a partir da raiz (ex: 'public/img/perfil')
 */
const criarStorage = (subPasta) => multer.diskStorage({
    destination: (req, file, cb) => {
        // O ".." faz o Node sair da pasta /config e voltar para a raiz do projeto
        const dir = path.join(__dirname, '..', subPasta);
        
        // Garante que a pasta existe (cria recursivamente se necessário)
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Padronização: Usa o nome do campo do formulário (ex: capa, foto_perfil) + timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

// ==========================================
// INSTÂNCIAS DE UPLOAD DO SISTEMA
// ==========================================

// 1. Uploads Temporários (Cursos, Capas, Aulas) 
// Eles vão para a pasta Temp e depois o Controller move para a pasta definitiva com ID do curso
const uploadTemp = multer({ storage: criarStorage('public/uploads/temp') });

// 2. Upload de Foto de Perfil
const uploadPerfil = multer({ storage: criarStorage('public/img/perfil') });

// 3. Upload de Materiais Isolados (Apostilas avulsas, etc)
const uploadMaterialAula = multer({ storage: criarStorage('public/uploads/materiais') });

// 4. Upload de Prints e Imagens do Fórum
const uploadForum = multer({ storage: criarStorage('public/img/forum') });

// 5. Upload de Currículos (.docx, capas de CV)
const uploadCV = multer({ storage: criarStorage('public/uploads') });

// 6. Upload de Imagens para Notificações Globais
const uploadNotificacao = multer({ storage: criarStorage('public/img/notificacoes') });

module.exports = {
    uploadTemp,
    uploadPerfil,
    uploadMaterialAula,
    uploadForum,
    uploadCV,
    uploadNotificacao
};