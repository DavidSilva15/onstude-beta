const mysql = require('mysql2/promise');

// Configuração mínima utilizando Pool de conexões (recomendado para a plataforma)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',      // Substitua pelo seu usuário do MySQL
    password: '2304',      // Substitua pela sua senha
    database: 'onstude',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste rápido para garantir que a conexão está funcionando
db.getConnection()
    .then(conn => {
        console.log('✅ Conectado ao banco de dados OnStude com sucesso!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Erro ao conectar no banco de dados:', err.message);
    });

module.exports = db;