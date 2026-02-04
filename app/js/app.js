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

      const TITULOS = {
        verde: "🟢 MENSAGEM APARENTA SER SEGURA",
        amarelo: "🟡 ATENÇÃO: MENSAGEM SUSPEITA",
        vermelho: "🔴 POSSÍVEL GOLPE DETECTADO"
      };

      const MOTIVOS_PADRAO = {
        verde: [
          "Mensagem sem intenção de ação",
          "Não solicita dados sensíveis",
          "Não contém links suspeitos"
        ],
        amarelo: [
          "Mensagem inesperada",
          "Pode induzir dúvida ou urgência",
          "Recomenda-se cautela"
        ],
        vermelho: [
          "Solicitação de ação sensível",
          "Possível tentativa de engenharia social",
          "Risco de golpe identificado"
        ]
      };

      const ACAO_PADRAO = {
        verde: "Nenhuma ação necessária.",
        amarelo: "Tenha cautela e evite fornecer informações.",
        vermelho: "Não responda, não clique em links e não forneça dados."
      };

      const motivos =
        Array.isArray(data.motivos) && data.motivos.length > 0
          ? data.motivos
          : MOTIVOS_PADRAO[cor];

      const acao = data.acao_recomendada || ACAO_PADRAO[cor];
      const confianca = data.confianca ?? 95;

      resultado.className = `resultado resultado--${cor}`;
      resultado.innerHTML = `
        <h2>${TITULOS[cor]}</h2>

        <div class="resultado-bloco">
          <h3>Por que chegamos a essa conclusão?</h3>
          <ul>
            ${motivos.map(m => `<li>${m}</li>`).join("")}
          </ul>
        </div>

        <div class="resultado-acao">
          <h3>📋 O que você deve fazer</h3>
          <p>${acao}</p>
        </div>

        <div class="resultado-confianca">
          📊 Confiança da análise: <strong>${confianca}%</strong>
        </div>
      `;

    } catch (error) {
      resultado.className = "resultado resultado--vermelho";
      resultado.innerHTML = `
        <h2>❌ Erro na análise</h2>
        <p>Não foi possível analisar a mensagem no momento.</p>
      `;
    } finally {
      btn.disabled = false;
      btn.textContent = "🔍 Analisar Mensagem";
    }
  }

});
