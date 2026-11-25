const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const livros = [
  {
    id: "o-senhor-dos-aneis",
    titulo: "O Senhor dos Aneis",
    autor: "J.R.R. Tolkien",
    descricao: "Uma jornada épica pela Terra-média para destruir o Um Anel.",
    preco: 59.9,
  },
  {
    id: "neuromancer",
    titulo: "Neuromancer",
    autor: "William Gibson",
    descricao: "O clássico cyberpunk sobre hackers, inteligência artificial e ciberespaço.",
    preco: 39.9,
  },
  {
    id: "duna",
    titulo: "Duna",
    autor: "Frank Herbert",
    descricao: "Intriga política e sobrevivência no planeta desértico Arrakis.",
    preco: 49.9,
  },
];

const carrinho = [];
const pedidos = [];

function enriquecerItem(c) {
  const livro = livros.find((l) => l.id === c.livroId);
  return {
    ...c,
    titulo: livro.titulo,
    preco: livro.preco,
    subtotal: Number((livro.preco * c.quantidade).toFixed(2)),
  };
}

function enriquecerCarrinho() {
  return carrinho.map(enriquecerItem);
}

app.get("/", (req, res) => {
  res.json({ mensagem: "Bem-vindo a API da XYZ Bookstore" });
});

app.get("/livros", (req, res) => {
  const autor = req.query.autor;
  const resultado = autor
    ? livros.filter((l) => l.autor.toLowerCase().includes(autor.toLowerCase()))
    : livros;
  res.json(resultado);
});

app.get("/livros/:id", (req, res) => {
  const livro = livros.find((l) => l.id === req.params.id);
  if (!livro) {
    return res.status(404).json({ erro: "livro nao encontrado" });
  }
  res.json(livro);
});

app.get("/carrinho", (req, res) => {
  res.json(enriquecerCarrinho());
});

app.post("/carrinho", (req, res) => {
  const dados = req.body || {};

  if (!dados.livroId || dados.quantidade === undefined) {
    return res.status(400).json({ erro: "faltam campos: livroId, quantidade" });
  }

  const livro = livros.find((l) => l.id === dados.livroId);
  if (!livro) {
    return res.status(400).json({ erro: "livro inexistente: " + dados.livroId });
  }

  if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
    return res.status(400).json({ erro: "quantidade deve ser inteiro positivo" });
  }

  const itemCru = { livroId: dados.livroId, quantidade: dados.quantidade };
  carrinho.push(itemCru);

  const item = enriquecerItem(itemCru);
  res.status(201).json({ item, carrinho: enriquecerCarrinho() });
});

app.delete("/carrinho/:id", (req, res) => {
  const indice = carrinho.findIndex((c) => c.livroId === req.params.id);

  if (indice === -1) {
    return res.status(404).json({ erro: `item nao encontrado no carrinho: ${req.params.id}` });
  }

  carrinho.splice(indice, 1);
  res.status(200).json(enriquecerCarrinho());
});

app.post("/checkout", (req, res) => {
  if (carrinho.length === 0) {
    return res.status(400).json({ erro: "carrinho vazio" });
  }

  const itens = enriquecerCarrinho();
  const total = Number(
    itens.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2)
  );

  const pedido = {
    numero: Date.now(),
    itens,
    total,
  };

  pedidos.push(pedido);
  carrinho.splice(0);

  res.status(200).json(pedido);
});

app.get("/pedidos", (req, res) => {
  res.json(pedidos);
});

app.use((req, res) => {
  res.status(404).json({ erro: "rota inexistente" });
});

app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "corpo nao e JSON valido" });
  }
  res.status(500).json({ erro: "falha interna" });
});

app.listen(3000, () => {
  console.log("XYZ Bookstore (Express) no ar em http://localhost:3000");
});
