# Assistente do Piaget

Um "cérebro" de IA embutido no boneco do Jean Piaget: fala com voz, escuta perguntas
e só responde sobre a vida e as teorias dele — como uma Alexa temática para a
apresentação da faculdade.

## Como funciona

- `lib/piaget.js`: o "cérebro" — guarda a instrução que restringe o assistente
  a só falar sobre Piaget e faz a chamada pra IA (via Groq, que roda modelos
  abertos em hardware especializado pra responder bem rápido).
- `server.js`: servidor pra rodar localmente (no seu notebook ou no tablet
  via Termux).
- `api/perguntar.js`: a mesma lógica, empacotada como função gratuita na nuvem
  (Vercel) — pra publicar o assistente na internet sem precisar de notebook.
- `index.html`: a tela — um "rosto" animado que ocupa a tela toda; segura o
  dedo nele pra falar, e um campo de texto escondido atrás do ícone de teclado
  (caso o microfone falhe).

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
`localhost` ou uma página `https://`. Por isso, publicar na internet (Opção A)
é o jeito mais tranquilo: o link já vem em `https://` prontinho, e você não
precisa nem levar o notebook.

### Opção A — Publicar de graça na internet (GitHub + Vercel), sem levar notebook

O Vercel roda a parte da IA como uma função gratuita na nuvem (sua chave do
Groq fica guardada lá em segredo, nunca aparece pro público) e te dá um link
fixo tipo `https://piaget-assistente.vercel.app`, acessível do tablet em
qualquer lugar com internet.

**1. Suba o projeto pro GitHub** (crie uma conta grátis em github.com se ainda
não tiver uma):

```bash
# dentro da pasta piaget-assistente
git remote add origin https://github.com/SEU-USUARIO/piaget-assistente.git
git branch -M main
git push -u origin main
```

(Crie antes o repositório vazio em github.com/new, com o nome
`piaget-assistente` — não marque nenhuma opção de "adicionar README" pra não
dar conflito.)

**2. Publique no Vercel:**

1. Acesse https://vercel.com e crie uma conta grátis (dá pra entrar direto
   com o GitHub, sem cartão de crédito).
2. Clique em **Add New → Project** e importe o repositório `piaget-assistente`.
3. Antes de clicar em Deploy, abra **Environment Variables** e adicione:
   - `GROQ_API_KEY` = sua chave do Groq
   - `GROQ_MODEL` = `openai/gpt-oss-120b` (opcional)
4. Clique em **Deploy**. Em cerca de 1 minuto você recebe um link
   `https://piaget-assistente-xxxx.vercel.app`.

Abra esse link no Chrome do tablet e use normalmente — é o mesmo assistente,
já em HTTPS, então o microfone funciona sem nenhuma configuração extra.

Sempre que você editar o projeto e rodar `git push` de novo, o Vercel
republica automaticamente.

### Opção B — Rodar direto no tablet, sem internet (Termux)

Se preferir não depender de internet no dia, dá pra rodar tudo local no
próprio tablet:

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

Como é `localhost` no mesmo aparelho, o microfone funciona sem configuração
extra. Deixe o Termux rodando em segundo plano durante a apresentação. (Você
ainda vai precisar de internet nesse momento, só pra chamar a IA — só não
depende do notebook.)

## Deixando parecido com um tablet "de verdade" no rosto do boneco

- No Chrome do Android, abra a página e use o menu **⋮ → Adicionar à tela
  inicial**; abrir por esse atalho já entra em modo tela cheia (sem barra de
  endereço).
- Em **Configurações → Tela → Tempo limite**, aumente o tempo antes do tablet
  apagar a tela, para não desligar durante a apresentação.
- Deixe o "Não perturbe" ativado para não receber notificações no meio da fala.

## Ajustando o que ele sabe/responde

O comportamento do assistente (só falar sobre Piaget, responder em 1ª pessoa,
frases curtas para a fala) está todo no `SYSTEM_PROMPT` dentro de `lib/piaget.js`.
Edite esse texto para mudar o tom, adicionar mais regras, ou focar em tópicos
específicos do seu trabalho (por exemplo, dar mais peso aos estágios do
desenvolvimento cognitivo se for isso que o professor vai cobrar).
