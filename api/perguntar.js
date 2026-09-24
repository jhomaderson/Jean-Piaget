const { responderPergunta } = require('../lib/piaget');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Método não permitido.' });
    return;
  }

  const resultado = await responderPergunta(req.body && req.body.pergunta);

  if (resultado.erro) {
    res.status(resultado.status || 500).json({ erro: resultado.erro });
    return;
  }

  res.status(200).json({ resposta: resultado.resposta });
};
