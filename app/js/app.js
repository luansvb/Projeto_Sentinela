// =====================================================
// Sentinela Digital - Frontend JS (VERSÃO ESTRUTURADA)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  const textarea = document.getElementById("mensagem");
  const charCount = document.getElementById("charCount");
  const btn = document.getElementById("btn");
  const resultado = document.getElementById("resultado");

  if (!textarea || !charCount || !btn || !resultado) {
    console.error("Elementos do DOM não encontrados.");
    return;
  }

  textarea.addEventListener("input", () => {
    charCount.textContent = textarea.value.length;
  });

  const TITULOS = {
    verde: "🟢 MENSAGEM APARENTA SER SEGURA",
    amarelo: "🟡 ATENÇÃO: MENSAGEM SUSPEITA",
    vermelho: "🔴 POSSÍVEL GOLPE DETECTADO"
  };

  const ACAO_PADRAO = {
    verde: "Nenhuma ação necessária.",
    amarelo: "Tenha cautela e evite fornecer dados.",
    vermelho: "Não responda, não clique em links e não forneça informações."
  };

  btn.addEventListener("click", analisar);

  async function analisar() {
    const texto = textarea.value.trim();
    if (!texto) {
      alert("Digite uma mensagem.");
      return;
    }

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

      const cor = ["verde", "amarelo", "vermelho"].includes(data.cor)
        ? data.cor
        : "amarelo";

      const motivos = Array.isArray(data.motivos) && data.motivos.length > 0
        ? data.motivos
        : ["Mensagem sem indícios claros de ação suspeita"];

      const acao = data.acao_recomendada || ACAO_PADRAO[cor];
      const confianca = data.confianca ?? "—";

      resultado.className = `resultado resultado--${cor}`;

      resultado.innerHTML = `
        <h2>${TITULOS[cor]}</h2>

        <h3>Por que chegamos a essa conclusão?</h3>
        <ul>
          ${motivos.map(m => `<li>${m}</li>`).join("")}
        </ul>

        <div class="bloco-acao">
          <h3>📌 O que você deve fazer:</h3>
          <p>${acao}</p>
        </div>

        <div class="bloco-confianca">
          <strong>📊 Confiança da análise:</strong> ${confianca}%
        </div>
      `;

    } catch (error) {
      console.error(error);

      resultado.className = "resultado resultado--vermelho";
      resultado.innerHTML = `
        <h2>❌ Erro na análise</h2>
        <p>Não foi possível analisar a mensagem no momento. Tente novamente.</p>
      `;
    } finally {
      btn.disabled = false;
      btn.textContent = "🔍 Analisar Mensagem";
    }
  }

});
