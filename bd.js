const express = require('express');
const path = require('path');
const {sql, connectToDatabase} = require('./db'); 
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

connectToDatabase();

app.get('/api/consultar', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM dbo.Table1`;
        res.json(result.recordset);
    } catch (err) {
        console.error('Erro ao consultar dados:', err);
        res.status(500).send('Erro ao consultar dados');
    }finally {
        await sql.close();
    }
});

app.post('/api/guardar', async (req, res) => {
    const { nome,nivel } = req.body;
 try {
        await sql.query`INSERT INTO dbo.Table1 (nome,nivel) VALUES (${nome}, ${nivel})`;
        res.status(201).send('Dados guardados com sucesso');
    } catch (err) {
        console.error('Erro ao guardar dados:', err);
        res.status(500).send('Erro ao guardar dados');
    }finally {
        await sql.close();
    }
});

app.post('/api/eliminar', async (req, res) => {
    const { nome,nivel } = req.body;
    try {
        await sql.query`DELETE FROM dbo.Table1 WHERE nome = ${nome} AND nivel = ${nivel}`; ;
        res.status(200).send('Dados eliminados com sucesso');
    } catch (err) {
        console.error('Erro ao eliminar dados:', err);
        res.status(500).send('Erro ao eliminar dados');
    }finally {
        await sql.close();
    }
});

