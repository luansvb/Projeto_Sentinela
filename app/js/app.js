// ===============================
// SENTINELA DIGITAL - app.js
// Texto + Imagem (OCR)
// ===============================

// ELEMENTOS
const textarea = document.getElementById("mensagem");
const charCount = document.getElementById("charCount");
const btn = document.getElementById("btn");
const resultado = document.getElementById("resultado");

const dropZone = document.getElementById("dropZone");
const dropOverlay = document.getElementById("dropOverlay");
const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");

// ESTADO
let imagemBase64 = null;

// ===============================
// CONTADOR DE CARACTERES (INALTERADO)
// ===============================
textarea.addEventListener("input", () => {
  charCount.textContent = textarea.value.length;
});

// ===============================
// DRAG & DROP (VISUAL APENAS)
// ===============================
["dragenter", "dragover"].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add("drag-active");
  });
});

["dragleave", "drop"].forEach(eventName => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove("drag-active");
  });
});

// ===============================
// DROP DE IMAGEM
// ===============================
dropZone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) {
    processarImagem(file);
  }
});

// ===============================
// UPLOAD VIA BOTÃO
// ===============================
uploadBtn.addEventListener("click", () => {
  imageInput.click();
});

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) {
    processarImagem(file);
  }
});

// ===============================
// PROCESSAMENTO DA IMAGEM
// ===============================
function processarImagem(file) {
  if (!file.type.startsWith("image/")) {
    alert("Por favor, envie apenas imagens (PNG ou JPG).");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    imagemBase64 = reader.result.split(",")[1];

    // Feedback visual mínimo
    textarea.value = "[Imagem carregada para análise]";
    charCount.textContent = textarea.value.length;
  };

  reader.readAsDataURL(file);
}

// ===============================
// ENVIO PARA API (TEXTO OU IMAGEM)
// ===============================
btn.addEventListener("click", async () => {
  resultado.innerHTML = "";
  btn.disabled = true;
  btn.textContent = "Analisando...";

  const payload = {};

  if (imagemBase64) {
    payload.imagem_base64 = imagemBase64;
  } else {
    payload.mensagem = textarea.value.trim();
  }

  if (!payload.mensagem && !payload.imagem_base64) {
    alert("Cole uma mensagem ou envie um print para análise.");
    btn.disabled = false;
    btn.textContent = "🔍 Analisar Mensagem";
    return;
  }

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
    resultado.innerHTML = "<p>Erro ao analisar. Tente novamente.</p>";
  } finally {
    btn.disabled = false;
    btn.textContent = "🔍 Analisar Mensagem";
  }
});

// ===============================
// RENDERIZA RESULTADO (INALTERADO)
// ===============================
function renderResultado(data) {
  const classe =
    data.cor === "vermelho"
      ? "resultado--vermelho"
      : data.cor === "amarelo"
      ? "resultado--amarelo"
      : "resultado--verde";

  const motivos = data.motivos && data.motivos.length
    ? `<ul>${data.motivos.map(m => `<li>${m}</li>`).join("")}</ul>`
    : "";

  resultado.className = `resultado ${classe}`;
  resultado.innerHTML = `
    <h3>Status: ${data.status}</h3>
    ${motivos}
    <p><strong>O que fazer:</strong> ${data.acao_recomendada}</p>
    <p><strong>Confiança:</strong> ${data.confianca}%</p>
  `;

  // Resetar imagem após análise
  imagemBase64 = null;
  imageInput.value = "";
}
