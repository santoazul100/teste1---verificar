const sql = require('mssql');   

const config = {
    user: 'sa',
    password: 'r9898r9898',
    server: 'localhost',
    database: 'teste1',
    port: 1433,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};  

async function connectToDatabase() {
    try {
        const pool = await sql.connect(config);
        console.log("Conexão bem-sucedida!");
        return pool; 
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
        throw erro;
    }
}

module.exports = { sql, connectToDatabase };