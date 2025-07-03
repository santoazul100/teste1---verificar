const express = require('express');
const path = require('path');
const { sql, connectToDatabase } = require('./index'); 
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public'))); 

let pool; 

connectToDatabase().then(conn => {
    pool = conn; 
    app.listen(PORT, () => {
        console.log(`Servidor ativo em http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Falha ao conectar ao banco:", err);
    process.exit(1); 
});

app.get('/api/consultar', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM dbo.Table1');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao consultar dados:', err);
        res.status(500).send('Erro ao consultar dados');
    }
});

app.post('/api/guardar', async (req, res) => {
    const { nome, nivel } = req.body;
    try {
        await pool.request()
            .input('nome', sql.NVarChar(100), nome.trim())
            .input('nivel', sql.NVarChar(50), nivel.trim())
            .query('INSERT INTO dbo.Table1 (nome, nivel) VALUES (@nome, @nivel)');
        
        res.status(201).send('Dados guardados com sucesso');
    } catch (err) {
        console.error('Erro ao guardar dados:', err);
        res.status(500).send('Erro ao guardar dados');
    }
});

app.post('/api/eliminar', async (req, res) => {
    const { nome } = req.body; 
    try {
        
        await pool.request()
            .input('nome', sql.NVarChar(100), nome.trim())
            .query('DELETE FROM dbo.Table1 WHERE nome = @nome');
        
        res.status(200).send('Dados eliminados com sucesso');
    } catch (err) {
        console.error('Erro ao eliminar dados:', err);
        res.status(500).send('Erro ao eliminar dados');
    }
});

app.post('/api/consultar', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM dbo.Table1');
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao consultar dados:', err);
        res.status(500).send('Erro ao consultar dados');
    }
});

const response = await fetch('http://localhost:3000/api/eliminar');

