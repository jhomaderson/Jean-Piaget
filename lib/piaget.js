const GROQ_API_KEY = process.env.GROQ_API_KEY;
const MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

const SYSTEM_PROMPT = `Você é o assistente de voz embutido em um boneco interativo que representa o psicólogo suíço Jean William Fritz Piaget (1896–1980), feito para uma apresentação de faculdade.

Regras:
- Responda SEMPRE em português do Brasil, em 1ª pessoa, como se você fosse o próprio Piaget contando sobre si mesmo, sua vida e suas ideias.
- Fale APENAS sobre: a vida e biografia de Piaget, sua formação, sua teoria do desenvolvimento cognitivo (estágios sensório-motor, pré-operatório, operatório concreto e operatório formal), conceitos como assimilação, acomodação, esquemas e equilibração, epistemologia genética, seus livros e obras, curiosidades pessoais, influência na educação e na psicologia, e sua época.
- Se perguntarem algo fora desse tema (matemática, clima, outras pessoas, pedidos técnicos, etc.), recuse gentilmente em poucas palavras e convide a pessoa a perguntar algo sobre você/Piaget.
- Suas respostas serão faladas em voz alta por um sintetizador de voz. Por isso: use frases curtas e naturais, SEM markdown, SEM asteriscos, SEM listas com marcadores, SEM emojis.
- Seja caloroso, didático e um pouco bem-humorado, como um professor simpático conversando com estudantes numa feira de ciências.
- Mantenha cada resposta curta: no máximo 4 a 5 frases.`;

function aguardar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function chamarGroq(pergunta) {
  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const tentativas = 3;

  for (let tentativa = 1; tentativa <= tentativas; tentativa++) {
    const resposta = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: pergunta },
        ],
      }),
    });

    if (resposta.ok) {
      return resposta.json();
    }

    const detalhe = await resposta.text();
    console.error(`Erro da API Groq (tentativa ${tentativa}/${tentativas}):`, resposta.status, detalhe);

    // 429 = limite de uso momentâneo, 503 = servidor sobrecarregado. Vale tentar de novo.
    if ((resposta.status === 429 || resposta.status === 503) && tentativa < tentativas) {
      await aguardar(tentativa * 500);
      continue;
    }

    throw new Error(`Groq respondeu ${resposta.status}`);
  }
}

// Retorna { erro, status } em caso de falha esperada, ou { resposta } em caso de sucesso.
async function responderPergunta(perguntaBruta) {
  const pergunta = (perguntaBruta || '').toString().trim();

  if (!pergunta) {
    return { erro: 'Pergunta vazia.', status: 400 };
  }
  if (pergunta.length > 500) {
    return { erro: 'Pergunta muito longa.', status: 400 };
  }
  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY não configurada.');
    return { erro: 'Servidor sem chave de API configurada.', status: 500 };
  }

  try {
    const dados = await chamarGroq(pergunta);
    const texto = dados && dados.choices && dados.choices[0]
      && dados.choices[0].message && dados.choices[0].message.content
      ? dados.choices[0].message.content.trim()
      : 'Desculpe, não consegui pensar em uma resposta agora.';

    return { resposta: texto };
  } catch (err) {
    console.error('Erro inesperado ao chamar a IA:', err);
    return { erro: 'Não consegui falar com a IA agora. Tente de novo.', status: 502 };
  }
}

module.exports = { responderPergunta, SYSTEM_PROMPT };
