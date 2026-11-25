# Contrato de API — XYZ Bookstore

**Base URL:** `http://localhost:3000`
**Formato:** JSON (`Content-Type: application/json`)

## Estrutura Base do Livro
`{ "id": "string", "titulo": "string", "autor": "string", "descricao": "string", "preco": number }`

## Endpoints

| # | Rota | Método | Body | OK (Sucesso) | Erros | Auditoria |
|---|------|--------|------|--------------|-------|-----------|
| 1 | `/livros` | `GET` | — | `200` `[{livro}]` | — | ✔ |
| 2 | `/livros?autor=X` | `GET` | — | `200` `[{filtrados}]` (pode `[]`) | — | ✔ |
| 3 | `/livros/:id` | `GET` | — | `200` `{livro}` | `404` `{"erro": "livro nao encontrado"}` | ✔ |
| 4 | `/carrinho` | `GET` | — | `200` `[{livroId, quantidade, titulo, preco, subtotal}]` | — | ✔ |
| 5 | `/carrinho` | `POST` | `{"livroId": "string", "quantidade": number}` | `201` `{"item": {enriquecido}, "carrinho": [{enriquecidos}]}` | `400` `{"erro": "..."}` (faltando campo, id inexistente, quantidade inválida ou JSON quebrado) | ✔ |
| 6 | `/checkout` | `POST` | — | `200` `{"numero": number, "itens": [{enriquecidos}], "total": number}` | `400` `{"erro": "carrinho vazio"}` | ✔ |
| 7 | *(qualquer outra)* | `*` | — | — | `404` `{"erro": "rota inexistente"}` | ✔ |
| 8 | `/carrinho/:id` | `DELETE` | — | `200` `[{enriquecidos}]` (carrinho restante) | `404` `{"erro": "item nao encontrado no carrinho: ..."}` | ✔ |
