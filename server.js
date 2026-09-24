require('dotenv').config();
const express = require('express');
const path = require('path');
const { responderPergunta } = require('./lib/piaget');
const { sintetizarFala } = require('./lib/voz');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/perguntar', async (req, res) => {
  const resultado = await responderPergunta(req.body && req.body.pergunta);

  if (resultado.erro) {
    return res.status(resultado.status || 500).json({ erro: resultado.erro });
  }

  res.json({ resposta: resultado.resposta });
});

app.post('/api/falar', async (req, res) => {
  const resultado = await sintetizarFala(req.body && req.body.texto);

  if (resultado.erro) {
    return res.status(resultado.status || 500).json({ erro: resultado.erro });
  }

  res.set('content-type', 'audio/mpeg');
  res.send(resultado.audio);
});

app.listen(PORT, () => {
  console.log(`Assistente do Piaget rodando em http://localhost:${PORT}`);
});
