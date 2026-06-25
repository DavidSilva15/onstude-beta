const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(conn => {
        console.log('✅ Conectado ao banco de dados OnStude com sucesso!');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Erro ao conectar no banco de dados:', err.message);
    });

module.exports = db;