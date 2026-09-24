const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// "Adam" — voz masculina grave, disponível na biblioteca padrão da ElevenLabs.
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'pNInz6obpgDQGcFmaJgB';
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';

// Retorna { audio: Buffer } em caso de sucesso, ou { erro, status } em caso de falha.
async function sintetizarFala(textoBruto) {
  const texto = (textoBruto || '').toString().trim().slice(0, 1000);

  if (!texto) {
    return { erro: 'Texto vazio.', status: 400 };
  }
  if (!ELEVENLABS_API_KEY) {
    return { erro: 'ElevenLabs não configurado.', status: 500 };
  }

  try {
    const resposta = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        accept: 'audio/mpeg',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: texto,
        model_id: MODEL_ID,
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    if (!resposta.ok) {
      const detalhe = await resposta.text();
      console.error('Erro da API ElevenLabs:', resposta.status, detalhe);
      return { erro: 'Não consegui gerar o áudio.', status: 502 };
    }

    const buffer = Buffer.from(await resposta.arrayBuffer());
    return { audio: buffer };
  } catch (err) {
    console.error('Erro inesperado ao gerar fala:', err);
    return { erro: 'Erro interno ao gerar áudio.', status: 500 };
  }
}

module.exports = { sintetizarFala };
