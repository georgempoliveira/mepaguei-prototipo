# PRD — Protótipo Me Paguei + BlueHub (teste de usabilidade)

> **Leia antes de mexer no produto.** Este arquivo diz **o que** existe e **por quê**.
> O **como** (tokens, componentes, build, IDs do Figma) está em `design.md`.
> Objetivo dos dois: evitar reexplorar código e Figma a cada ajuste.

---

## 1. Contexto

**Me Paguei** é um app mobile para pessoas **economicamente ativas** saírem da inércia
financeira: começar a poupar (mecanismos gamificados) e ganhar previsibilidade (projeções
preditivas), com uma assistente de IA (**MIA**) que recomenda e explica.

**BlueHub** é o app de benefícios corporativos **parceiro**, onde o Me Paguei é distribuído:
o colaborador entra pelo BlueHub e encontra a MIA dentro de "Minhas Finanças".

Este repositório é um **protótipo navegável em HTML/CSS/JS puro** (sem backend) usado em
**teste de usabilidade moderado**. Não é o produto final.

### Regras de produto inegociáveis do protótipo
| Regra | Motivo |
|---|---|
| **Nada fica gravado no aparelho.** Estado em memória (`S`) + `sessionStorage` por CPF, apagado pelo navegador ao fechar a aba; sem localStorage/cookies | Requisito de privacidade do teste. O participante pode sair do Bluehub e entrar de novo (CPF + senha) que reencontra tudo como deixou; fechou a aba, acabou |
| **Sempre em modo light**, mesmo se o aparelho estiver em dark | Fidelidade visual no teste (ver `design.md` §9) |
| Frame **375×812** | Padrão do Figma |
| Textos na **voz da MIA** | Ver §6 |

---

## 2. Arquitetura de produto (mapa mental)

```
BlueHub (app de benefícios)                 Me Paguei (app financeiro)
├─ Cadastro / Login                         ├─ Início       (home, cards de setup)
├─ Home (benefícios)                        ├─ Poupar       (poupanças gamificadas)
│   └─ "Minhas Finanças" → MIA ─────────────┤ Clareza       (estudos preditivos)
├─ Trilhas, Vida+, Carteirinha, Perfil      └─ Controle     (radar, agenda, assinaturas)
└─ Aposentadoria Inteligente (simulador)
```

A **navbar do Me Paguei** tem 4 abas: `Início · Poupar · Clareza · Controle`.
A **navbar do BlueHub** tem 4: `Início · Benefícios · Carteirinha · Perfil`.

---

## 3. Fluxos e telas

> IDs entre `código` = id do `screen()` no código. Para o id do Figma, ver `design.md` §8.

### 3.1 Cadastro Me Paguei — `src/10-cadastro.js`
`splash → onboarding → welcome → cad1 → token → cad3 → proc → cadOk → perf1..perf4 → perfilOk`
- `cad1` nome/CPF/e-mail/aceite · `token` código 6 dígitos · `cad3` senha (regras + confirmação)
- `perf1..4` + `pessoas`/`pessoaForm`: personalização de perfil e pessoas próximas (alimenta a Agenda)
- `login`, `loginOk`, `rec1`, `rec3` (recuperação de senha)

### 3.2 Open Finance / Consentimento — `src/21-openfinance.js`
`of1 → of2 → of3 → ofExt → ofOk` (conectar instituição; `ofExt` = ambiente externo do banco)
- `ofBancos` lista de instituições · `ofOrig` conta **Principal** · `ofDest` **Cofrinho**
- `central` = Central de Consentimento, abas **Definições / Principal / Cofrinho / Instituições**
  (header em gradiente, abas em chips glass, folha branca)

### 3.3 Poupar — `src/30-poupancas.js`
- `poupIntro` → `poupEscolher` → `poupar` (abas **Total / Valor fixo / Placar do bem / Troco inteligente**)
- **Objetivo financeiro**: wizard de 3 etapas (`objetivo`, `objEdit`) — nome (com chips de sugestão), valor, prazo
- **Valor fixo** `vfFreq → vfValor → vfResumo → vfOk` (+`vfCfg`)
- **Placar do Bem** `pbIntro → pbTime → pbValor → pbResumo → pbOk` (+`pbCfg`) — poupa a cada vitória do time
- **Troco inteligente** `trIntro → trModo → trMult → trOk` (+`trCfg`)

### 3.4 Clareza (Fluxo Futuro) — `src/40-saldoseguro.js`
**Ordem obrigatória do fluxo** (section Figma `17790:141237`):

```
navbar "Clareza"
  └─ clarezaIntro   "Dois estudos para você cuidar do seu dinheiro hoje e amanhã"
       └─ ssIntro   Onboarding slide 1/2 · Projeção de Faturas   (logo Me Paguei + ondas + dots)
            └─ ssOb2  Onboarding slide 2/2 · Saldo Seguro        (fecha com X)
                 └─ [bottom sheet] "O que você deseja analisar hoje?"  ← escolhe o estudo
                      ├─ Projeção de faturas → clareza (aba fat)
                      └─ Saldo Seguro → [sheet "Entenda a projeção"] → ssBegin()
```

- `clarezaIntro` só aparece enquanto **não há nenhum estudo** e `S.flags.clarezaIntro` é falso.
- **Estudo do Saldo Seguro**: `ssContas → ssEntr → ssRec → ssEvt → ssPoup → ssResumo → ssOk`
  (saldo atual · entradas · despesas recorrentes · eventuais · poupança automática · revisão)
  `ssSemConta` = bloqueio quando não há conta conectada.
- `clareza` = tela de resultado, abas **Projeção de Faturas** (`fat`) e **Saldo Seguro** (`ss`).
- `ssCfg` = Configurações do estudo (exportar resumo · estudos anteriores · excluir estudo).
- `faturas` é um atalho que cai em `clareza{tab:'fat'}`.

### 3.5 Controle — `src/45-controle.js`
- `controle` com **Agenda** (eventos/aniversários que entram nas despesas eventuais), **Assinaturas**
- **Radar de gastos**: `rdIntro → rdCats → rdCards → rdMetas → rdOk` (+`rdCartao`, `rdRev`)

### 3.6 BlueHub — `src/50-bluehub.js`
- Cadastro: `bhSplash → bhWelcome → bhCad → bhToken → bhSenha → bhProc → bhPlano → bhPre → bhHome`
- `bhHome` seções, nesta ordem: **Minhas Finanças** (card da MIA) → Blue+ · Economia Familiar →
  Minha Saúde → Minhas Proteções → Destaque Vida+ → Pra tudo ficar Blue → Amplie suas proteções → Suporte
- `bhTrilhas` ("Pra tudo ficar Blue", 4 trilhas) · `bhVida` (plano Vida+ / dependentes)
- `bhMP` página do Me Paguei dentro do BlueHub (porta de entrada da MIA)
- `bhBenef`, `bhCart` (carteirinha), `bhPerfil` (inclui **Excluir conta** + alerta), `bhNotif`
- **Aposentadoria Inteligente** `src/55-aposentadoria.js`: `apos1..apos5 → aposRes`

---

## 4. Estado (`S`) — o que o produto "lembra" na sessão

```js
S = {
  user: { nome, cpf, email, termos, senha, senha2, genero, nasc, foto, civil, profissao,
          renda, cep, rua, numero, compl, bairro, cidade, uf, cel, objetivo, pessoas[] },
  perfilCompleto, contas[],            // contas[] = instituições conectadas (Open Finance)
  origem, destino,                     // conta Principal e Cofrinho
  flags: {},                           // ver abaixo
  // criados sob demanda:
  objetivo, poup{vf,placar,troco,total}, radar, faturas, saldoSeguro, ss{...}, agenda
}
```

**Flags de comportamento** (todas em `S.flags`):
| Flag | Efeito |
|---|---|
| `clarezaIntro` | já viu a apresentação da Clareza → vai direto para os estudos |
| `ssEntendi` | marcou "não visualizar novamente" no sheet "Entenda a projeção" |
| `fatVisto` | já abriu a Projeção de Faturas → o card da home vira título+texto+CTA |
| `hide` | olho de ocultar valores |
| `poupIntroSeen`, `objEdit`, `objStep` | estado dos wizards de poupança |

**Dentro de `S.ss`** (estudo do Saldo Seguro): `inicio, contasSel, manual, entradas, renda[],
gastos[], faturas{}, eventos[], ativo, miaE, miaG, miaP, step`.
`miaE`/`miaP` controlam os **insights recolhíveis** da MIA (§5).

`seedDemo()` (em `20-home.js`) popula um usuário "em uso" (contas, objetivo, poupanças, radar,
faturas, saldo seguro) — use sempre que precisar de uma tela com dados.

---

## 5. Comportamentos de produto que são fáceis de quebrar

1. **Insight da MIA recolhe, não some.** Clicar em "Entendi" **encolhe** o card para o avatar
   da MIA (`miaMini`); clicar no avatar **expande de novo**. Vale para `miaP` e `miaE`.
2. **Card de Projeção de Faturas na home** muda depois da primeira visita (`flags.fatVisto`):
   de "Conectar cartões" para a **régua de meses** (`faturasChart()`, frame 17191:36505) —
   título com chevron, "Faturas das contas conectadas" e os tiles Ago/Set/Out… com o mês atual
   destacado.
3. **Senha**: o campo "Confirmar senha" ganha **borda vermelha + mensagem** assim que o que foi
   digitado deixa de bater com a senha (não espera terminar de digitar).
4. **Chips de sugestão preenchem o input na hora** (objetivo). Nunca reabrir a folha para isso —
   `objWizard(1,false)` **zera** `S.tmpObj`.
5. **A apresentação da Clareza e os onboardings só aparecem uma vez** por sessão.
6. **Excluir conta (BlueHub)** abre alerta e, ao confirmar, zera o estado e volta para o início.
7. **Listas "Consulte suas entradas / seus gastos" são SOMENTE LEITURA** — servem de base para
   a pessoa lembrar valores; não existe botão "Usar"/"Adicionar". O cadastro é sempre manual.
8. **Cada categoria de gasto tem cor e ícone próprios** (`CAT_COR` em `40-saldoseguro.js`).
9. **Todo insight da MIA tem "Entendi"** e recolhe no avatar — use o helper `miaBlock(flag,…)`,
   nunca `miaBox` sem `act`.
10. **Botão flutuante de tela cheia é arrastável** (só no build pub, em telas ≤600px).
11. **Bottom sheets fecham arrastando para baixo.** O arraste só começa após 6px e **nunca**
    captura o ponteiro antes disso — capturar no toque rouba o clique dos botões do rodapé.
12. **Fluxo de personalizar perfil não tem mais "pessoas próximas"** — elas vivem na Agenda
    (Controle → Agenda → Adicionar pessoas próximas).
13. **Primeiro acesso à Clareza** (faturas OU saldo seguro, por qualquer porta) passa pela
    apresentação `clarezaIntro`.
14. **Entradas do Saldo Seguro começam zeradas**: a renda do cadastro não entra sozinha.
15. **CEP busca o endereço de verdade** (ViaCEP). Estados: `S.flags.cepSt` = `load` (buscando) ·
   `ok` (preencheu) · `err` (não encontrado — campos liberados para digitar à mão). O contador
   `cepSeq` descarta resposta atrasada de um CEP já reescrito.

---

## 6. Voz da MIA (para qualquer texto de interface)

A MIA é a **Guardiã Estratégica**: clara, parceira, **sempre explica o "porquê"**, respeita a
autonomia do usuário, **nunca é punitiva**. Usa "nós". **Sem emojis** em erro/segurança.
Objetiva e acionável. Em insights, o rótulo é "Insight da MIA" ou "Sua assistente financeira".

---

## 7. O teste de usabilidade

**Objetivos** (3 pilares): **Adesão** (intenção de uso, disposição a conectar contas, barreiras) ·
**Funcionalidades** (compreensão e valor percebido) · **UI/Usabilidade** (clareza, eficiência,
efetividade, SUS).

**Missões** (1 participante por sessão, think aloud):
1. Criar conta no **BlueHub** → chegar à Home
2. **Encontrar a MIA** (card "MIA, sua assistente financeira" em Minhas Finanças)
3. **Conectar contas** no Me Paguei (Open Finance)
4. **Adicionar um evento na Agenda** (Controle → Agenda)
5. **Montar uma Projeção de Saldo Seguro** (do início ao fim)

Roteiro completo: Google Doc "Roteiro de Testes — Teste Final de Usabilidade (Me Paguei)".
Link público do protótipo: **https://georgempoliveira.github.io/mepaguei-prototipo/**

**Painel do moderador**: a build tem um painel lateral com atalhos (`flowEntry(grupo,label,fn)`)
para pular direto a qualquer ponto do fluxo. Ao criar uma tela nova, **adicione um flowEntry**.

---

## 8. Pendências e improvisos conhecidos

| Item | Situação |
|---|---|
| Cards das 4 trilhas (`bht-*.webp`) | Imagem única exportada do Figma (foto + selo + textos juntos) — texto não é "vivo" |
| Foto do card "Amplie suas proteções" | Reaproveita `bhh-vida-foto` (próxima, não idêntica à do Figma) |
| `cl-intro.webp` | Recortada da captura do frame em **1x** (a rede do workspace não alcança figma.com) |
| Logo no header da home do BlueHub | O frame `15413:37574` não renderiza o logo, mas o cliente pediu para manter |
| Ícones do onboarding slide 2 | Escolhidos por aproximação: `wallet, coins, repeat, gift, piggy-bank` |
| Espaçamento da `clarezaIntro` | ~18px mais apertado que o Figma (frame tem 848px; a tela tem 812) |
| Vídeos (Vida+, trilhas) | Placeholders "Vídeo em breve" / toast "abre fora do protótipo" |
| Busca de CEP (`perf3`) | **Real**, via ViaCEP no navegador do participante. Sem internet, cai no endereço de exemplo (Rua Bione/Recife) para não travar o teste. É a única chamada de rede do protótipo |

---

## 9. Checklist ao adicionar/alterar uma tela

1. Ler o frame no Figma (**somente leitura**) e conferir componentes/tokens — ver `design.md`.
2. Reutilizar componentes do DS; **não** desenhar do zero nem usar hex solto.
3. Ligar a navegação (`go/reset/replace`) e, se for ponto de entrada, criar `flowEntry`.
4. `python3 build.py` → renderizar com `full.py` → **comparar lado a lado com o Figma**.
5. Checar que não há erro de JS (`ERR []`) e publicar (ver `design.md` §2).
6. Avisar o cliente sobre qualquer improviso.

## Regras acrescentadas (07/10)
- **Objetivo exige poupança ativa.** Tentar abrir o Objetivo sem nenhuma poupança
  (`anyPoup()` falso) leva à aba Poupanças com uma folha explicando o porquê e um atalho
  para escolher uma. Vale para o card da home e para o card dentro de Poupanças.
- **Placar do Bem: Séries A, B e C.** `TEAMS_A/B/C` + `SERIES`. B e C seguem o Figma
  (20376:41809 e 20376:53643) e trazem só os clubes de Pernambuco: Náutico, Sport Recife
  e Santa Cruz. Os três escudos foram recortados do Figma a 48px e ampliados para 96px —
  trocar por exportação 2x quando houver. `sigla()` continua como rede de segurança para
  um clube sem escudo. O adversário do "Próximo jogo" sai da mesma série.
- **Pessoas próximas (06 · Agenda).** Sequência do Figma: Agenda vazia (19641:3821) →
  formulário (15388:35970) → **lista "Familiares cadastrados (N)"** (15388:36065) →
  edição sem insight da MIA (15388:36014) → sucesso (15388:36214). A lista era a tela que
  faltava: salvar voltava direto para a Agenda. Data do aniversário usa a máscara
  `diames` (dd/mm), não a data completa. `gradScreen({mark:false})` centraliza o rótulo
  do cabeçalho, como nas telas de Agenda.
- **Splash reaproveitada.** `screen('splash')` aceita `{next}`; voltar do Bluehub para o
  Me Paguei passa pela splash em vez de cair direto na home.

- **Configurações e Informações Pessoais (08/10).** Refeitas sobre 8143:23658 e 8369:64638:
  cabeçalho em gradiente azul, card do usuário em vidro sobre o azul, cada item das listas
  virou card próprio, bloco "Nossas redes" em caixa azul-clara. Em Informações Pessoais o
  rótulo fica acima do valor dentro de um card cinza e o título da seção sai do card.
  **Pessoas próximas saiu da tela** e a foto **não é editável** (vem do BlueHub).
  Os valores vêm de `S.user`, sem defaults inventados — campo vazio mostra "—"; `seedDemo()`
  preenche o perfil só onde estiver vazio, para os atalhos do moderador continuarem úteis.
  Os ícones Instagram/LinkedIn/YouTube não existem mais no Lucide: foram recortados do
  Figma para `assets/soc-*.png`.

- **Família 09.xx (08/10).** Notificações (8131:22696), Termos (8419:65786), Ajuda
  (8686:65246) e Sobre (8897:4501) usavam `appHeader` branco; passaram todas para o
  helper novo `gradPage({title, acts, head, body, foot})`, que monta o cabeçalho azul
  sobre o gradiente + folha branca. Ajuda: tópicos rápidos viraram grade 2x2 (antes
  rolagem horizontal que cortava "Segurança"). Notificações: cada aviso virou card, com
  a hora abaixo do título, e os chips foram para dentro do azul. Sobre: badge de versão à
  direita do logo, foto da empresa (`assets/sobre-ed.webp`, recortada do Figma) e
  "Acesso rápido" em cards.

- **Atalho na tela inicial (PWA).** O botão flutuante de tela cheia só aparece no
  navegador: `comoApp()` (display-mode standalone/fullscreen ou `navigator.standalone`)
  o suprime. A faixa do rodapé era a área de gestos sem preenchimento — `.hi` deixou de
  ser `display:none` no mobile e passou a ocupar `env(safe-area-inset-bottom)` herdando a
  cor da tela. A altura agora vem de `--vh` (window.innerHeight, atualizada em resize e
  orientationchange), porque no atalho o iOS não resolve 100%/100dvh para a tela inteira.
