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
let imagemPreview = null;

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
    imagemPreview = reader.result;
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
  } catch (e) {
    alert("Erro ao comunicar com o servidor.");
  } finally {
    btn.disabled = false;
    btn.textContent = "🔍 Analisar Mensagem";
    imagemBase64 = null;
    imagemPreview = null;
    textarea.classList.remove("image-loaded");
    imageIndicator.style.display = "none";
  }
});

function renderResultado(data) {
  const classe =
    data.cor === "vermelho"
      ? "resultado--vermelho"
      : data.cor === "amarelo"
      ? "resultado--amarelo"
      : "resultado--verde";

  let imagemHTML = "";

  if (imagemPreview) {
    imagemHTML = `
      <div class="resultado-imagem-box">
        <div class="resultado-imagem-badge">
          📷 Análise realizada a partir de um print da conversa
        </div>
        <img src="${imagemPreview}" alt="Print analisado">
      </div>
    `;
  }

  resultado.className = `resultado ${classe}`;
  resultado.innerHTML = `
    ${imagemHTML}
    <h3>
      <span class="status-dot ${data.cor}"></span>
      ${data.status.replace("URGENCIA","URGÊNCIA")}
    </h3>
    <ul>
      ${data.motivos.map(m => `<li>${m.replace("ACAO","AÇÃO")}</li>`).join("")}
    </ul>
    <p><strong>AÇÃO recomendada:</strong> ${data.acao_recomendada.replace("ACAO","AÇÃO")}</p>
    <p><strong>Confiança:</strong> ${data.confianca}%</p>
  `;
}
