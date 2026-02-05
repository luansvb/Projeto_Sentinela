const textarea = document.getElementById("mensagem");
const charCount = document.getElementById("charCount");
const btn = document.getElementById("btn");
const resultado = document.getElementById("resultado");
const imageInput = document.getElementById("imageInput");
const uploadBtn = document.getElementById("uploadBtn");
const imagePreview = document.getElementById("imagePreview");

let imagemBase64 = null;

textarea.addEventListener("input", () => {
  charCount.textContent = textarea.value.length;
});

uploadBtn.onclick = () => imageInput.click();

imageInput.onchange = () => {
  const file = imageInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    imagemBase64 = reader.result.split(",")[1];
    imagePreview.innerHTML = `<img src="${reader.result}"><p>📎 Imagem anexada</p>`;
    imagePreview.classList.remove("hidden");
    textarea.value = "";
    charCount.textContent = 0;
  };
  reader.readAsDataURL(file);
};

btn.onclick = async () => {
  btn.disabled = true;
  btn.textContent = "Analisando...";

  const payload = imagemBase64
    ? { imagem_base64: imagemBase64 }
    : { mensagem: textarea.value.trim() };

  const res = await fetch("https://ly9yvqdsta.execute-api.us-east-1.amazonaws.com/prod/teste", {
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify(payload)
  });

  const data = await res.json();
  renderResultado(data);

  btn.disabled = false;
  btn.textContent = "🔍 Analisar Mensagem";
  imagemBase64 = null;
};

function renderResultado(data) {
  const cor = data.cor;
  resultado.className = "resultado ativo";

  resultado.innerHTML = `
    <div class="status-header">
      <div class="bolinha ${cor}"></div>
      <h3>${data.status}</h3>
    </div>

    <ul class="motivos">
      ${data.motivos.map(m => `<li>${m}</li>`).join("")}
    </ul>

    <div class="acao">AÇÃO RECOMENDADA: ${data.acao_recomendada}</div>

    <div class="confianca-bar">
      <div class="confianca-fill" style="width:${data.confianca}%"></div>
    </div>
    <small>Confiança da análise: ${data.confianca}%</small>
  `;
}
