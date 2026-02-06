const textarea = document.getElementById("mensagem");
const charCount = document.getElementById("charCount");
const btn = document.getElementById("btn");
const resultado = document.getElementById("resultado");

const dropZone = document.getElementById("dropZone");
const dropOverlay = document.getElementById("dropOverlay");
const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");
const imageFeedback = document.getElementById("imageFeedback");

let imagemBase64 = null;

/* ===============================
   CONTADOR
=============================== */
textarea.addEventListener("input", () => {
  charCount.textContent = textarea.value.length;
});

/* ===============================
   DRAG & DROP — FEEDBACK VISUAL
=============================== */
["dragenter", "dragover"].forEach(eventName => {
  dropZone.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();

    dropZone.classList.add("drag-active");
    dropOverlay.style.display = "flex";
  });
});

["dragleave", "dragend"].forEach(eventName => {
  dropZone.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();

    dropZone.classList.remove("drag-active");
    dropOverlay.style.display = "none";
  });
});

dropZone.addEventListener("drop", e => {
  e.preventDefault();
  e.stopPropagation();

  dropZone.classList.remove("drag-active");
  dropOverlay.style.display = "none";

  const file = e.dataTransfer.files[0];
  if (file) processarImagem(file);
});

/* ===============================
   UPLOAD VIA BOTÃO
=============================== */
uploadBtn.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {
  const file = imageInput.files[0];
  if (file) processarImagem(file);
});

/* ===============================
   PROCESSA IMAGEM
=============================== */
function processarImagem(file) {
  if (!file.type.startsWith("image/")) {
    alert("Por favor, envie apenas imagens (PNG ou JPG).");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    imagemBase64 = reader.result.split(",")[1];
    imageFeedback.style.display = "block";
    textarea.value = "";
    charCount.textContent = 0;
  };
  reader.readAsDataURL(file);
}

/* ===============================
   ENVIO
=============================== */
btn.addEventListener("click", async () => {
  const texto = textarea.value.trim();

  if (!texto && !imagemBase64) {
    alert("Cole uma mensagem ou envie um print para análise.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "Analisando...";
  resultado.innerHTML = "";

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
  } catch {
    resultado.innerHTML = "<p>Erro ao analisar. Tente novamente.</p>";
  } finally {
    btn.disabled = false;
    btn.textContent = "🔍 Analisar Mensagem";
    imagemBase64 = null;
    imageFeedback.style.display = "none";
  }
});

/* ===============================
   RESULTADO
=============================== */
function renderResultado(data) {
  const classe =
    data.cor === "vermelho"
      ? "resultado--vermelho"
      : data.cor === "amarelo"
      ? "resultado--amarelo"
      : "resultado--verde";

  const dot = data.cor;

  const motivos = data.motivos?.length
    ? `<ul>${data.motivos.map(m => `<li>${m}</li>`).join("")}</ul>`
    : "";

  resultado.className = `resultado ${classe}`;
  resultado.innerHTML = `
    <h3><span class="status-dot ${dot}"></span>${data.status}</h3>
    ${motivos}
    <p><strong>AÇÃO recomendada:</strong> ${data.acao_recomendada}</p>
    <p><strong>Confiança:</strong> ${data.confianca}%</p>
  `;
}
