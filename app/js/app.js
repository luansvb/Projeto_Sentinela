<script>
const btn = document.getElementById("analisarBtn");
const resultadoBox = document.getElementById("resultado");

btn.addEventListener("click", async () => {
  const texto = document.getElementById("mensagem").value.trim();

  if (!texto) {
    alert("Digite uma mensagem para análise.");
    return;
  }

  resultadoBox.style.display = "block";
  resultadoBox.innerHTML = "🔍 Analisando...";

  try {
    const res = await fetch("URL_DO_SEU_API_GATEWAY_AQUI", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: texto })
    });

    const data = await res.json();

    // 🔥 AQUI ESTAVA O ERRO
    const analise = data.analise;

    const status = analise.status;
    const confianca = analise.confianca_fraude;
    const recomendacao = analise.recomendacao;
    const detalhes = data.detalhes || [];

    // Cor visual
    resultadoBox.className = "";
    if (status.includes("GOLPE")) resultadoBox.classList.add("risco-alto");
    else if (status.includes("SUSPEITA")) resultadoBox.classList.add("risco-medio");
    else resultadoBox.classList.add("risco-baixo");

    resultadoBox.innerHTML = `
      <h3>${status}</h3>
      <p><strong>Confiança:</strong> ${confianca}%</p>
      <p><strong>Recomendação:</strong> ${recomendacao}</p>
      <ul>
        ${detalhes.map(d => `<li>${d}</li>`).join("")}
      </ul>
    `;

  } catch (err) {
    console.error(err);
    resultadoBox.innerHTML = "❌ Erro ao analisar a mensagem.";
  }
});
</script>
