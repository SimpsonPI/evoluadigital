# Relatório de Auditoria de Segurança

Data da auditoria: 28 de julho de 2026

## Escopo analisado

- `index.html`, `metodo_5d.html`, `style.css`, `script.js` e `sitemap.xml`.
- Histórico do repositório (busca por credenciais versionadas).
- Recursos externos carregados pelas páginas (Google Fonts e cdnjs).

O projeto é um site estático, sem backend, banco de dados, formulário próprio ou
autenticação. Consequentemente, as classes de vulnerabilidade de servidor não se aplicam.

## Resultado por categoria

| Categoria | Situação | Observação |
| --- | --- | --- |
| Chaves de API e segredos versionados | Nenhum encontrado | Apenas dados de contato públicos (e-mail, WhatsApp, LinkedIn). |
| SQL injection | Não aplicável | Não há backend nem consultas a banco de dados. |
| Entrada de usuário não validada | Não aplicável | Não há formulários próprios; o formulário de contato é hospedado pelo Google Forms. |
| Dependências inseguras | Não aplicável / corrigido parcialmente | Não há gerenciador de pacotes. O CSS do Font Awesome vinha de CDN sem verificação de integridade. |
| CORS permissivo | Não aplicável | Não há API própria. |
| Endpoints de debug expostos | Nenhum encontrado | Não há rotas nem código de depuração. |
| Verificações de autenticação ausentes | Não aplicável | Todo o conteúdo é público por definição. |
| XSS / DOM sinks | Nenhum encontrado | O JavaScript não usa `innerHTML`, `eval`, `document.write` nem lê `location.hash`. |
| `target="_blank"` sem `rel` | Nenhum encontrado | Todos os links externos já usam `rel="noopener noreferrer"`. |

## Correções aplicadas

| Problema | Severidade | Correção |
| --- | --- | --- |
| CSS do Font Awesome carregado do cdnjs sem Subresource Integrity | Alta (cadeia de suprimentos: um recurso comprometido no CDN executaria no domínio) | Adicionados `integrity` (SHA-384), `crossorigin="anonymous"` e `referrerpolicy="no-referrer"` nas duas páginas. |
| Ausência de Content Security Policy | Média (sem defesa em profundidade contra injeção de script) | Adicionado `<meta http-equiv="Content-Security-Policy">` restringindo `script-src` a `'self'`, `object-src 'none'`, `base-uri 'self'` e `form-action` limitado ao Google Forms. |
| Script inline em `metodo_5d.html` | Média (impedia uma CSP sem `'unsafe-inline'`) | Movido para `metodo_5d.js`, sem alteração de comportamento. |
| Referrer completo enviado a terceiros | Baixa (vazamento de URL de navegação) | Adicionado `<meta name="referrer" content="strict-origin-when-cross-origin">`. |

O bloco JSON-LD de `index.html` permanece inline (exigência do formato) e é
autorizado por hash SHA-256 na CSP. Se o conteúdo do JSON-LD for editado, o hash
precisa ser recalculado.

## Recomendações restantes (dependem do provedor de hospedagem)

1. Configurar cabeçalhos HTTP de resposta que não podem ser definidos por `<meta>`:
   `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`,
   `X-Frame-Options: DENY` (ou `frame-ancestors 'none'` na CSP via cabeçalho) e
   `Permissions-Policy`.
2. Servir o site exclusivamente por HTTPS com redirecionamento permanente.
3. Ao atualizar a versão do Font Awesome, recalcular o hash de integridade.
4. Considerar hospedar as fontes localmente para eliminar a dependência de terceiros
   em tempo de execução (o CSS do Google Fonts não suporta SRI por ser dinâmico).
