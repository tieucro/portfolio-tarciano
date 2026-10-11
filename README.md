# Portfólio — Tarciano Silva

Portfólio profissional responsivo construído com **React + TypeScript**, utilizando HTML, CSS, JavaScript, Bootstrap e jQuery.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse o endereço local informado pelo Vite. Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Projetos do GitHub

A seção de projetos consulta a API pública do GitHub para listar os repositórios públicos próprios de `tieucro`, com linguagem, estrelas, forks e links. Não usa token nem solicita permissões; se a API estiver indisponível ou atingir o limite de requisições, o site mostra um link para o perfil. A CSP permite conexão apenas com a API pública do GitHub além da própria origem.

## Segurança adicionada

- Cabeçalhos HTTP de segurança para **Netlify** (`public/_headers`) e **Vercel** (`vercel.json`).
- Content Security Policy (CSP) que limita scripts, conexões e recursos à própria origem, bloqueia objetos/plugins e impede que o site seja incorporado em frames.
- Proteções contra MIME sniffing, clickjacking e envio desnecessário de referrer.
- Política de permissões que desativa câmera, microfone, geolocalização e pagamentos.
- `.gitignore` para evitar publicar `.env`, logs, dependências e builds.
- GitHub Actions para executar auditoria de dependências em pushes, pull requests e semanalmente.

## Importante: publique com segurança

1. Use HTTPS e mantenha o domínio/DNS e a conta de hospedagem protegidos com senha única e autenticação em dois fatores.
2. Não coloque senhas, tokens, chaves privadas, credenciais de banco ou segredos em arquivos `VITE_*`: variáveis Vite são incorporadas ao código público.
3. Este projeto é um portfólio estático; não tem autenticação nem banco de dados no servidor. Não adicione login, formulários que armazenem dados ou APIs privadas sem um backend seguro.
4. Mantenha dependências atualizadas e revise os alertas gerados pela auditoria. A auditoria precisa ser executada no GitHub/ambiente com acesso ao registro npm; não foi certificada nesta edição.
5. Os cabeçalhos só estarão ativos quando o site for publicado numa hospedagem que respeite o arquivo de configuração correspondente. Confirme-os depois do deploy.
6. A CSP permite estilos inline porque a interface atual usa estilos dinâmicos do React. Se adicionar fontes, analytics, vídeos ou serviços externos, ajuste a política deliberadamente em vez de liberar tudo com `*`.

## Personalização

- Troque `public/profile.png` pela sua foto, mantendo o nome.
- Edite links sociais e e-mail em `src/App.tsx`.
- Substitua os projetos demonstrativos por projetos reais.

## Limitações

Essas medidas reduzem riscos comuns, mas não garantem proteção absoluta contra invasões ou roubo de dados. A segurança final também depende da hospedagem, da conta, do domínio e de futuras alterações no código.
