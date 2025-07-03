const sql= require('mssql');   

const config = {
    user: 'sa',
    password: 'r9898r9898', 
    server: '127.0.0.1',
    database: 'teste1',
    options: {
        encrypt: false, 
        trustServerCertificate: true 
    }
};  

async function conectar() {
    try {
        await sql.connect(config);
        console.log("Conexão bem-sucedida!");
    } catch (erro) {
        console.error('Erro ao conectar:', erro);
    } finally {
        await sql.close();
    }
}

module.exports = {sql, connectToDatabase};