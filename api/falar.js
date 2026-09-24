const { sintetizarFala } = require('../lib/voz');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ erro: 'Método não permitido.' });
    return;
  }

  const resultado = await sintetizarFala(req.body && req.body.texto);

  if (resultado.erro) {
    res.status(resultado.status || 500).json({ erro: resultado.erro });
    return;
  }

  res.setHeader('content-type', 'audio/mpeg');
  res.status(200).send(resultado.audio);
};
