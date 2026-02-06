const textarea = document.getElementById("mensagem");
const charCount = document.getElementById("charCount");
const btn = document.getElementById("btn");
const resultado = document.getElementById("resultado");

const dropZone = document.getElementById("dropZone");
const dropOverlay = document.getElementById("dropOverlay");
const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");
const imageIndicator = document.getElementById("imageIndicator");

let imagemBase64 = null;

/* contador */
textarea.addEventListener("input", () => {
  charCount.textContent = textarea.value.length;
});

/* drag visual */
["dragenter", "dragover"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.add("drag-active");
    dropOverlay.style.display = "flex";
  });
});

["dragleave", "drop"].forEach(evt => {
  dropZone.addEventListener(evt, e => {
    e.preventDefault();
    dropZone.classList.remove("drag-active");
    dropOverlay.style.display = "none";
  });
});

dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];
  if (file) processarImagem(file);
});

uploadBtn.onclick = () => imageInput.click();

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (file) processarImagem(file);
};

function processarImagem(file) {
  if (!file.type.startsWith("image/")) {
    alert("Envie apenas imagens.");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    imagemBase64 = reader.result.split(",")[1];
    textarea.classList.add("image-loaded");
    imageIndicator.style.display = "block";
    textarea.value = "";
    charCount.textContent = 0;
  };
  reader.readAsDataURL(file);
}

btn.addEventListener("click", async () => {
  const texto = textarea.value.trim();

  if (!texto && !imagemBase64) {
    alert("Cole uma mensagem ou envie um print para análise.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Analisando...";
  resultado.innerHTML = "";
  resultado.style.display = "none";

  const payload = imagemBase64
    ? { imagem_base64: imagemBase64 }
    : { mensagem: texto };

  try {
    const response = await fetch(
      "https://ly9yvqdsta.execute-api.us-east-1.amazonaws.com/prod/teste",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    renderResultado(data);

  } catch (err) {
    console.error(err);
    resultado.className = "resultado resultado--amarelo";
    resultado.style.display = "block";
    resultado.innerHTML = "<p>❌ Erro ao analisar a mensagem.</p>";
  } finally {
    btn.disabled = false;
    btn.textContent = "🔍 Analisar Mensagem";
    imagemBase64 = null;
    textarea.classList.remove("image-loaded");
    imageIndicator.style.display = "none";
  }
});

function renderResultado(data) {
  if (!data || !data.cor || !data.status) {
    throw new Error("Resposta inválida do backend");
  }

  const cor = data.cor;
  const motivos = Array.isArray(data.motivos) ? data.motivos : [];

  const classe =
    cor === "vermelho"
      ? "resultado--vermelho"
      : cor === "amarelo"
      ? "resultado--amarelo"
      : "resultado--verde";

  resultado.className = `resultado ${classe}`;
  resultado.style.display = "block";

  resultado.innerHTML = `
    <h3>
      <span class="status-dot ${cor}"></span>
      ${data.status}
    </h3>

    ${
      motivos.length
        ? `<ul>${motivos.map(m => `<li>${m}</li>`).join("")}</ul>`
        : ""
    }

    <p><strong>Ação recomendada:</strong> ${data.acao_recomendada}</p>
    <p><strong>Confiança:</strong> ${data.confianca}%</p>
  `;
}
