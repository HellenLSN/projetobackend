const express = require("express");
const app = express();

app.use(express.json());

const livros = [
  {
    id: "sally-adventure-book",
    titulo: "As Aventuras de Sally",
    autor: "A. Writer",
    descricao: "Uma expedição que muda tudo.",
    preco: 39.9,
  },
  {
    id: "dave-cooking-book",
    titulo: "A Cozinha do Dave",
    autor: "D. Chef",
    descricao: "Receitas para quem queimou a primeira.",
    preco: 29.5,
  },
];

const carrinho = [];
const pedidos = [];

function enriquecerCarrinho() {
  return carrinho.map((c) => {
    const livro = livros.find((l) => l.id === c.livroId);
    return {
      ...c,
      titulo: livro.titulo,
      preco: livro.preco,
      subtotal: Number((livro.preco * c.quantidade).toFixed(2)),
    };
  });
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

  const livroExiste = livros.find((l) => l.id === dados.livroId);
  if (!livroExiste) {
    return res.status(400).json({ erro: `livro inexistente: ${dados.livroId}` });
  }

  if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
    return res.status(400).json({ erro: "quantidade deve ser um numero inteiro positivo" });
  }

  const item = { livroId: dados.livroId, quantidade: dados.quantidade };
  carrinho.push(item);
  return res.status(201).json({ item, carrinho: enriquecerCarrinho() });
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
  carrinho.length = 0;

  return res.json(pedido);
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

