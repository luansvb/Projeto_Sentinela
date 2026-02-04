// ================================
// Sentinela Digital - Frontend JS
// ================================

// Elementos da interface
const textarea = document.getElementById("mensagem");
const charCount = document.getElementById("charCount");
const btn = document.getElementById("btn");
const resultado = document.getElementById("resultado");

// Contador de caracteres
textarea.addEventListener("input", () => {
  charCount.textContent = textarea.value.length;
});

// Mensagens padrão alinhadas ao projeto original
const MENSAGENS_PADRAO = {
  verde: {
    titulo: "✅ Mensagem segura",
    texto:
      "Nenhuma ação necessária. A mensagem não apresenta indícios relevantes de golpe."
  },
  amarelo: {
    titulo: "⚠️ Atenção",
    texto:
      "A mensagem apresenta alguns sinais suspeitos. Tenha cautela e não forneça dados."
  },
  vermelho: {
    titulo: "🚨 Possível golpe",
    texto:
      "A mensagem solicita ações sensíveis. Não responda, não clique em links e não forneça informações."
  }
};

// Botão principal
btn.addEventListener("click", analisar);

// Função principal
async function analisar() {
  const texto = textarea.value.trim();
  if (!texto) {
    alert("Digite uma mensagem.");
    return;
  }

  // Estado de carregamento
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mensagem: texto })
      }
    );

    const data = await response.json();

    // Fallback seguro caso algo venha diferente da Lambda
    const cor = MENSAGENS_PADRAO[data.cor] ? data.cor : "amarelo";
    const msg = MENSAGENS_PADRAO[cor];

    // Renderização final
    resultado.className = `resultado resultado--${cor}`;
    resultado.innerHTML = `
      <h2>${msg.titulo}</h2>
      <p>${msg.texto}</p>
    `;

  } catch (error) {
    // Erro de rede / backend
    resultado.className = "resultado resultado--vermelho";
    resultado.innerHTML = `
      <h2>❌ Erro de conexão</h2>
      <p>Não foi possível analisar a mensagem no momento. Tente novamente.</p>
    `;
  } finally {
    // Restaura botão
    btn.disabled = false;
    btn.textContent = "🔍 Analisar Mensagem";
  }
}
