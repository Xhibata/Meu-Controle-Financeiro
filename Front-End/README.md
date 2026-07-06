
```
Front-End
├─ assets
│  ├─ rm378-05.jpg
│  └─ vault.ico
├─ cadastro.html
├─ conversor.html
├─ criardespesas.html
├─ css
│  ├─ cadastro.css
│  ├─ global.css
│  ├─ login.css
│  ├─ popup.css
│  └─ sidebar.css
├─ extrato.html
├─ index.html
├─ js
│  ├─ cadastro.js
│  ├─ conversor.js
│  ├─ criardespesas.js
│  ├─ extrato.js
│  ├─ index.js
│  ├─ login.js
│  └─ main.js
└─ login.html

```

```
| Sprint | Entrega                                                                               | Endpoints envolvidos                                                                    |
| ------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| 1      | Cadastro, Login, Logout e autenticação JWT                                            | `POST /auth/registro`, `POST /auth/login`                                               |
| 2      | Dashboard financeiro com resumo e últimas movimentações                               | `GET /dashboard`, `GET /dashboard/extrato`                                              |
| 3      | CRUD completo de despesas                                                             | `POST`, `GET`, `PUT`, `DELETE /despesas`                                                |
| 4      | CRUD completo de extratos financeiros                                                 | `POST`, `GET`, `PUT`, `DELETE /extrato`                                                 |
| 5      | Tela de perfil do usuário autenticado                                                 | `GET /projeto/me`                                                                       |
| 6      | Melhorias de experiência do usuário (validações, filtros, paginação, feedback visual) | Reutiliza endpoints das sprints anteriores                                              |
| 7      | Recursos avançados (gráficos, exportações, filtros avançados e conversor integrado)   | `GET /dashboard`, `GET /dashboard/extrato`, `GET /extrato` e APIs públicas para cotação |

```

```
Ou seja, na próxima resposta eu entrego:

✅ index.html completo
✅ css/app.css
✅ css/dashboard.css
✅ js/dashboard.js
✅ Ajustes no main.js e auth.js (logout e proteção)
```
```
| Etapa | Arquivos                                                   |
| ----- | ---------------------------------------------------------- |
| ✅ 1   | `global.css` + `sidebar.css` + `layout.css` + `index.html` |
| 2     | `login.html` + `login.css`                                 |
| 3     | `cadastro.html` + `cadastro.css`                           |
| 4     | `extrato.html` + `extrato.css`                             |
| 5     | `criardespesas.html` + `criardespesas.css`                 |
| 6     | `conversor.html` + `conversor.css`                         |
| 7     | Responsividade                                             |
| 8     | Animações e refinamentos
```
```
Front-End
├─ assets
│  ├─ rm378-05.jpg
│  └─ vault.ico
├─ cadastro.html
├─ conversor.html
├─ criardespesas.html
├─ css
│  ├─ cadastro.css
│  ├─ global.css
│  ├─ login.css
│  ├─ popup.css
│  └─ sidebar.css
├─ extrato.html
├─ index.html
├─ js
│  ├─ api.js
│  ├─ auth.js
│  ├─ cadastro.js
│  ├─ conversor.js
│  ├─ criardespesas.js
│  ├─ dashboard.js
│  ├─ extrato.js
│  ├─ index.js
│  ├─ login.js
│  ├─ main.js
│  ├─ testes
│  │  ├─ testeAuth.js
│  │  ├─ testeRequest.js
│  │  ├─ testeStorage.js
│  │  └─ testeToken.js
│  └─ utils.js
├─ login.html
├─ pages
└─ README.md

```