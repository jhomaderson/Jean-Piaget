# Assistente do Piaget

Um "cérebro" de IA embutido no boneco do Jean Piaget: fala com voz, escuta perguntas
e só responde sobre a vida e as teorias dele — como uma Alexa temática para a
apresentação da faculdade.

## Como funciona

- `server.js`: um servidorzinho que guarda sua chave de API em segredo e manda
  cada pergunta para a IA (via Groq, que roda modelos abertos em hardware
  especializado pra responder bem rápido), já instruída a só falar sobre Piaget.
- `public/index.html`: a tela que fica no tablet — um "rosto" animado, botão de
  microfone (fale a pergunta) e um campo de texto (caso o microfone falhe).

## Passo a passo

### 1. Pegue uma chave de API grátis (Groq)

1. Acesse https://console.groq.com/keys com uma conta Google/GitHub/e-mail.
2. Clique em **Create API Key**. Não pede cartão de crédito.
3. Copie a chave gerada (ela só aparece uma vez).

O Groq roda modelos abertos em hardware especializado, então as respostas saem
bem mais rápido (geralmente menos de 1 segundo) que em outros provedores
gratuitos — ótimo para um assistente de voz ao vivo. O plano gratuito tem
limite de uso por minuto/dia, mas é de sobra para uma apresentação de faculdade.
O catálogo de modelos disponíveis muda de vez em quando; se `GROQ_MODEL` parar
de funcionar, veja a lista atual em https://console.groq.com/docs/models.

### 2. Configure o projeto

```bash
cd piaget-assistente
npm install
cp .env.example .env
```

Abra o `.env` e cole sua chave em `GROQ_API_KEY`.

### 3. Rode o servidor

```bash
npm start
```

Isso sobe o assistente em `http://localhost:3000`.

## Onde rodar no dia da apresentação

O microfone do navegador (Web Speech API) só funciona em um "contexto seguro":
`localhost` ou uma página `https://`. Um endereço tipo `http://192.168.0.x:3000`
(notebook acessado pelo tablet via Wi-Fi) **não deixa o microfone funcionar** —
o campo de texto continua funcionando normalmente, mas para ter voz de verdade
escolha uma das opções abaixo.

### Opção A — Rodar direto no tablet (mais simples e recomendada)

1. Instale o app **Termux** no tablet Android (Play Store ou F-Droid).
2. Dentro do Termux:
   ```bash
   pkg install nodejs git
   ```
3. Copie a pasta `piaget-assistente` para o tablet (cabo USB, Google Drive, etc.)
   ou clone do seu repositório.
4. Dentro da pasta do projeto, no Termux: `npm install`, configure o `.env` e
   rode `npm start`.
5. Abra o Chrome **no próprio tablet** em `http://localhost:3000`.

Como é `localhost` no mesmo aparelho, o microfone funciona sem configuração extra.
Deixe o Termux rodando em segundo plano durante a apresentação.

### Opção B — Rodar no notebook e acessar do tablet pelo Wi-Fi

Precisa de HTTPS. Jeito mais rápido: use um túnel como o `ngrok`.

```bash
npm start
# em outro terminal:
npx ngrok http 3000
```

O ngrok te dá um link `https://algumacoisa.ngrok-free.app`. Abra esse link no
Chrome do tablet — o microfone vai funcionar normalmente. Precisa de internet
tanto no notebook quanto no tablet.

## Deixando parecido com um tablet "de verdade" no rosto do boneco

- No Chrome do Android, abra a página e use o menu **⋮ → Adicionar à tela
  inicial**; abrir por esse atalho já entra em modo tela cheia (sem barra de
  endereço).
- Em **Configurações → Tela → Tempo limite**, aumente o tempo antes do tablet
  apagar a tela, para não desligar durante a apresentação.
- Deixe o "Não perturbe" ativado para não receber notificações no meio da fala.

## Ajustando o que ele sabe/responde

O comportamento do assistente (só falar sobre Piaget, responder em 1ª pessoa,
frases curtas para a fala) está todo no `SYSTEM_PROMPT` dentro de `server.js`.
Edite esse texto para mudar o tom, adicionar mais regras, ou focar em tópicos
específicos do seu trabalho (por exemplo, dar mais peso aos estágios do
desenvolvimento cognitivo se for isso que o professor vai cobrar).
