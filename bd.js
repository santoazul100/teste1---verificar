const express = require("express");
const path = require("path");
const { sql, connectToDatabase } = require("./index");
const app = express();
const PORT = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let pool;

connectToDatabase()
  .then((conn) => {
    pool = conn;
    app.listen(PORT, () => {
      console.log(`Servidor ativo em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Falha ao conectar ao banco:", err);
    process.exit(1);
  });

app.get("/api/consultar", async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM dbo.Table1");
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao consultar dados:", err);
    res.status(500).send("Erro ao consultar dados");
  }
});

app.post("/api/guardar", async (req, res) => {
  const { nome, nivel } = req.body;
  try {
    await pool
      .request()
      .input("nome", sql.NVarChar(100), nome.trim())
      .input("nivel", sql.NVarChar(50), nivel.trim())
      .query("INSERT INTO dbo.Table1 (nome, nivel) VALUES (@nome, @nivel)");

    res.status(201).send("Dados guardados com sucesso");
  } catch (err) {
    console.error("Erro ao guardar dados:", err);
    res.status(500).send("Erro ao guardar dados");
  }
});

app.post("/api/eliminar", async (req, res) => {
  const { nome } = req.body;
  try {
    await pool
      .request()
      .input("nome", sql.NVarChar(100), nome.trim())
      .query("DELETE FROM dbo.Table1 WHERE nome = @nome");

    res.status(200).send("Dados eliminados com sucesso");
  } catch (err) {
    console.error("Erro ao eliminar dados:", err);
    res.status(500).send("Erro ao eliminar dados");
  }
});

app.post("/api/consultar", async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM dbo.Table1");
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao consultar dados:", err);
    res.status(500).send("Erro ao consultar dados");
  }
});

app.post("/api/editar", async (req, res) => {
  const { nome, novoNome } = req.body;
  try {
    await pool
      .request()
      .input("nome", sql.NVarChar(100), nome.trim())
      .input("novoNome", sql.NVarChar(100), novoNome.trim())
      .query("UPDATE dbo.Table1 SET nome = @novoNome WHERE nome = @nome");

    res.status(200).send("Dados atualizados com sucesso");
  } catch (err) {
    console.error("Erro ao atualizar dados:", err);
    res.status(500).send("Erro ao atualizar dados");
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "bonito.html"));
});

app.get("/calculadora", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "calcu.html"));
});

app.get("/pokemon", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pokemon.html"));
});

app.get("/api/pokemon/consultar", async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM dbo.pokeTable");
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao consultar Pokémon:", err);
    res.status(500).send("Erro ao consultar Pokémon");
  }
});

app.post("/api/pokemon/guardar", async (req, res) => {
  const { json } = req.body;
  try {
    await pool
      .request()
      .input("json", sql.NVarChar(sql.MAX), json)
      .query("INSERT INTO dbo.pokeTable (json) VALUES (@json)");

    res.status(201).send("Pokémon guardado com sucesso");
  } catch (err) {
    console.error("Erro ao guardar Pokémon:", err);
    res.status(500).send("Erro ao guardar Pokémon: " + err.message);
  }
});

app.post("/api/pokemon/eliminar", async (req, res) => {
  const { json } = req.body;
  try {
    await pool
      .request()
      .input("json", sql.NVarChar(sql.MAX), json)
      .query("DELETE FROM dbo.pokeTable WHERE json = @json");

    res.status(200).send("Pokémon eliminado com sucesso");
  } catch (err) {
    console.error("Erro ao eliminar Pokémon:", err);
    res.status(500).send("Erro ao eliminar Pokémon");
  }
});

app.post("/api/pokemon/eliminar-todos", async (req, res) => {
  try {
    await pool.request().query("DELETE FROM dbo.pokeTable");
    res.status(200).send("Todos Pokémon eliminados");
  } catch (err) {
    console.error("Erro ao eliminar todos:", err);
    res.status(500).send("Erro ao eliminar todos Pokémon");
  }
});

app.get("/api/pokeget", async (req, res) => {
  try {
    const pokeName = req.query.name;
    if (!pokeName) {
      return res.status(400).send("Nome do Pokémon é necessário");
    }
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName}`);
    if (!response.ok) {
      throw new Error(`Pokémon não encontrado (${response.status})`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Erro ao consultar nomes de Pokémon:", err);
    res.status(500).send("Erro ao consultar nomes de Pokémon");
  }
  
});