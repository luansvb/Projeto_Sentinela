const MENSAGENS_PADRAO = {
  verde: {
    titulo: "✅ Mensagem segura",
    texto: "Nenhuma ação necessária. A mensagem não apresenta indícios relevantes de golpe."
  },
  amarelo: {
    titulo: "⚠️ Atenção",
    texto: "A mensagem apresenta alguns sinais suspeitos. Tenha cautela e não forneça dados."
  },
  vermelho: {
    titulo: "🚨 Possível golpe",
    texto: "A mensagem solicita ações sensíveis. Não responda, não clique em links e não forneça informações."
  }
};

// depois do fetch:
const msg = MENSAGENS_PADRAO[data.cor] || {
  titulo: "Resultado",
  texto: data.acao_recomendada || "Análise concluída."
};

const cor = MENSAGENS_PADRAO[data.cor] ? data.cor : "amarelo";

resultado.className = `resultado resultado--${cor}`;
resultado.innerHTML = `
  <h2>${msg.titulo}</h2>
  <p>${msg.texto}</p>
`;
