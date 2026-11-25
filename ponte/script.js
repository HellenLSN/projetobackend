// 1. ACHAR e MUDAR
const titulo = document.querySelector("#titulo");
const statusEl = document.querySelector("#status");
const lista = document.querySelector("#lista-livros");

titulo.textContent = "XYZ Bookstore — Catálogo";
statusEl.textContent = "Nenhum livro clicado ainda.";

// 2. GERAR (catálogo local com 3 livros para ensaio do Step 18)
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
  {
    id: "anne-mystery-book",
    titulo: "O Segredo da Biblioteca",
    autor: "Anne Code",
    descricao: "Pistas escondidas entre páginas antigas.",
    preco: 45.0,
  },
];

function renderizarLivros() {
  lista.innerHTML = livros
    .map(
      (l) =>
        `<li>${l.titulo} — R$ ${l.preco.toFixed(2)} <button class="buy-now" data-id="${l.id}">Buy Now</button></li>`
    )
    .join("");
}

renderizarLivros();

// 3 e 5. OUVIR com delegação de eventos + contador sem duplicar
let totalCliques = 0;

lista.addEventListener("click", (evento) => {
  const btn = evento.target.closest(".buy-now");
  if (!btn) return;

  totalCliques++;
  console.log("clicou:", btn.dataset.id);
  statusEl.textContent = `Último clicado: ${btn.dataset.id} (Total de cliques: ${totalCliques})`;
});
