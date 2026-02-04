const textarea = document.getElementById("mensagem");
const charCount = document.getElementById("charCount");
const btn = document.getElementById("btn");
const resultado = document.getElementById("resultado");

textarea.addEventListener("input", () => {
  charCount.textContent = textarea.value.length;
});

btn.addEventListener("click", analisar);

async function analisar() {
  const texto = textarea.value.trim();
  if (!texto) return alert("Digite uma mensagem.");

  btn.disabled = true;
  btn.textContent = "⏳ Analisando...";

  resultado.style.display = "block";
  resultado.className = "resultado";
  resultado.innerHTML = "<h2>Analisando...</h2>";

  try {
    const response = await fetch(
      "https://ly9yvqdsta.execute-api.us-east-1.amazonaws.com/prod/teste",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: texto })
      }
    );

    const data = await response.json();

    resultado.className = `resultado resultado--${data.cor}`;

    resultado.innerHTML = `
      <h2>${data.cor.toUpperCase()}</h2>
      <p>${data.acao_recomendada}</p>
    `;

  } catch (e) {
    resultado.className = "resultado resultado--vermelho";
    resultado.innerHTML = "<h2>Erro de conexão</h2>";
  } finally {
    btn.disabled = false;
    btn.textContent = "🔍 Analisar Mensagem";
  }
}
