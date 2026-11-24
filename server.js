const http = require("node:http");

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

function enviar(res, status, corpo) {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(corpo));
}

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

const servidor = http.createServer((req, res) => {
  const [caminho, query] = req.url.split("?");
  const params = new URLSearchParams(query || "");
  const partes = caminho.split("/");

  if (caminho === "/" && req.method === "GET") {
    return enviar(res, 200, { mensagem: "Bem-vindo a API da XYZ Bookstore" });
  }

  if (caminho === "/livros" && req.method === "GET") {
    const autor = params.get("autor");
    const resultado = autor
      ? livros.filter((l) => l.autor.toLowerCase().includes(autor.toLowerCase()))
      : livros;
    return enviar(res, 200, resultado);
  }

  if (partes === "livros" && partes && req.method === "GET") {
    const livro = livros.find((l) => l.id === partes);
    if (livro) {
      return enviar(res, 200, livro);
    }
    return enviar(res, 404, { erro: "livro nao encontrado" });
  }

  if (caminho === "/carrinho" && req.method === "GET") {
    return enviar(res, 200, enriquecerCarrinho());
  }

  if (caminho === "/carrinho" && req.method === "POST") {
    let bruto = "";
    req.on("data", (pedaco) => {
      bruto += pedaco;
    });
    req.on("end", () => {
      let dados;
      try {
        dados = JSON.parse(bruto);
      } catch {
        return enviar(res, 400, { erro: "corpo nao e JSON valido" });
      }

      if (!dados.livroId || dados.quantidade === undefined) {
        return enviar(res, 400, { erro: "faltam campos: livroId, quantidade" });
      }

      const livroExiste = livros.find((l) => l.id === dados.livroId);
      if (!livroExiste) {
        return enviar(res, 400, { erro: `livro inexistente: ${dados.livroId}` });
      }

      if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
        return enviar(res, 400, { erro: "quantidade deve ser um numero inteiro positivo" });
      }

      const item = { livroId: dados.livroId, quantidade: dados.quantidade };
      carrinho.push(item);
      return enviar(res, 201, { item, carrinho: enriquecerCarrinho() });
    });
    return;
  }

  if (caminho === "/checkout" && req.method === "POST") {
    if (carrinho.length === 0) {
      return enviar(res, 400, { erro: "carrinho vazio" });
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

    return enviar(res, 200, pedido);
  }

  if (caminho === "/pedidos" && req.method === "GET") {
    return enviar(res, 200, pedidos);
  }

  return enviar(res, 404, { erro: "rota inexistente" });
});

servidor.listen(3000);
console.log("XYZ Bookstore no ar em http://localhost:3000");
