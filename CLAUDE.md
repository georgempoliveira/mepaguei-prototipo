# Me Paguei — Protótipo navegável (HTML) para teste de usabilidade

> **Índice. Leia os dois arquivos abaixo antes de qualquer coisa e NÃO reexplore o projeto
> do zero** — eles existem para economizar tokens.

| Arquivo | Para quê |
|---|---|
| **`prd.md`** | **O quê / por quê**: produto, fluxos, mapa de telas, estado `S`, comportamentos que quebram fácil, teste de usabilidade, pendências e improvisos |
| **`design.md`** | **Como**: build e publicação, arquitetura, tokens, componentes, receitas de tela, IDs do Figma, assets, armadilhas mapeadas |

## Resumo em 10 linhas
App clicável do **Me Paguei** (+ app parceiro **BlueHub**) em HTML/CSS/JS puro, sem backend,
usado em **teste de usabilidade moderado**. Frame 375×812, fonte Inter local.
**Nada fica gravado no aparelho** (estado em `S` + `sessionStorage` por CPF, que o navegador
apaga ao fechar a aba) e a interface é **sempre light**.
Fonte da verdade visual: Figma `yU7YFh3p9777jIi0c23vGX`, página "Done" — **somente leitura**.

```bash
cd /home/claude/mepaguei
python3 build.py                                   # dist/
PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers python3 full.py home "seedDemo();reset('home')"
python3 build.py pub                               # dist-pub/ → publicar (ver design.md §2)
```

Link público: **https://georgempoliveira.github.io/mepaguei-prototipo/**
(peça ao cliente abrir em **aba anônima**; o Pages leva ~1 min para propagar)

⚠️ O repositório Git guarda **só o build publicado**. O código-fonte vive apenas em
`/home/claude/mepaguei` — se precisar versionar o `src/`, combine antes com o cliente.

## Regras de ouro
1. Reutilize componentes e tokens do DS — **nunca** recrie na mão nem use hex solto.
2. Texto **idêntico** ao Figma (acentos, maiúsculas, pontuação).
3. **Nunca escreva no Figma.**
4. Você não valida acabamento fino: **sempre peça ao cliente conferir os prints**.
5. **Sinalize todo improviso** ao entregar.
