// gerarSenha.js
const bcrypt = require('bcrypt');
const db = require('./db');

async function atualizarSenhas() {
    try {
        // Gera um hash real e válido para a senha "123456"
        const senhaHash = await bcrypt.hash('123456', 10);
        
        // Atualiza todos os usuários de teste no banco com essa nova senha
        await db.execute('UPDATE usuarios SET senha_hash = ?', [senhaHash]);
        
        console.log('✅ Senhas atualizadas com sucesso! Agora a senha de todos é: 123456');
    } catch (error) {
        console.error('❌ Erro ao atualizar:', error);
    } finally {
        process.exit(); // Encerra o script
    }
}

atualizarSenhas();