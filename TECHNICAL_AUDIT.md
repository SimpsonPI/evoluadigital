# Relatório de Auditoria Técnica

Data da auditoria: 25 de julho de 2026

## Escopo analisado

- `index.html`, `metodo_5d.html`, `style.css` e `script.js`.
- Todos os links internos e os arquivos locais referenciados.
- Ativos de imagem e PDFs presentes no repositório.
- Metadados, estrutura de cabeçalhos, responsividade prevista e acessibilidade estática.

## Problemas encontrados e correções aplicadas

| Problema | Impacto | Correção |
| --- | --- | --- |
| Referências para `assets/` e `documentos/` inexistentes | Imagens, favicon e downloads falhavam. | Referências ativas passaram a usar os arquivos existentes na raiz. Arquivos legados ausentes estão documentados em comentários. |
| Doze links `href="#"` | Navegação sem destino e falha de acessibilidade. | Links comerciais apontam para o formulário; CTAs sem página própria apontam para contato. |
| JavaScript substituía links válidos por URLs-placeholder | Os CTAs podiam direcionar para um formulário inexistente. | A sobrescrita foi removida; o script agora gerencia apenas menu, rolagem e ano. |
| Menu móvel com semântica incompleta | Leitores de tela não recebiam a relação controle/menu e o menu não fechava por Escape. | Foram adicionados `aria-controls`, rótulo dinâmico e suporte à tecla Escape. |
| Abas do Método 5D dependiam de `event` global | Falha potencial em navegadores e baixa acessibilidade por teclado. | Abas agora usam listeners explícitos, roles ARIA, estados selecionados e painéis `hidden`. |
| SEO social e técnico incompleto | Pré-visualizações e descoberta orgânica limitadas. | Foram adicionados robots, author, keywords, theme-color, Open Graph, Twitter Cards, JSON-LD e sitemap. |
| Imagens sem dimensões ou estratégia de carregamento | Possível CLS e renderização menos eficiente. | Foram incluídos `width`, `height`, `decoding="async"` e lazy loading onde apropriado. |
| CSS com baixa previsibilidade de foco e deslocamento por cabeçalho fixo | Navegação por teclado e links internos ficavam menos claros. | Foram adicionados foco visível e `scroll-margin-top`; o CTA do cabeçalho recebeu estilo explícito. |
| Títulos numerados iniciavam em 2 | Inconsistência de conteúdo. | A numeração foi removida sem alterar o conteúdo ou a aparência do bloco. |

## Validações realizadas

- Referências locais ativas: aprovadas.
- Links vazios `href="#"`: nenhum encontrado.
- Estrutura principal: uma única tag `h1` em cada página.
- Codificação: UTF-8.
- Links externos: Google Forms, LinkedIn e WhatsApp foram revisados como URLs HTTPS; a verificação automatizada de disponibilidade foi limitada por políticas de acesso dos próprios serviços.

## Arquivos modificados

- `index.html`
- `metodo_5d.html`
- `style.css`
- `script.js`
- `sitemap.xml` (novo)
- `TECHNICAL_AUDIT.md` (novo)

## Recomendações antes da publicação

1. Substituir os valores relativos de canonical, `og:url` e sitemap pela URL absoluta do domínio de produção.
2. Adicionar os ativos legados documentados ou manter as referências atuais para os equivalentes existentes.
3. Abrir o site em Chrome, Firefox e Safari em 320, 375, 768, 1024 e 1366 px para a inspeção visual final.
4. Executar Lighthouse no domínio publicado para medir métricas reais de Core Web Vitals, contraste e disponibilidade de recursos externos.
