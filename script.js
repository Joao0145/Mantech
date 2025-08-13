// Equipamentos
const equipamentoForm = document.getElementById("equipamento-form");
const listaEquipamentos = document.getElementById("lista-equipamentos");

equipamentoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Adicione esta linha no início do seu script, depois de firebase.auth()
const auth = firebase.auth(); 

auth.onAuthStateChanged(user => {
    if (user) {
        // Se o usuário está logado, esconde o formulário de login e mostra o conteúdo do app
        document.getElementById("login-form").style.display = "none";
        document.getElementById("conteudo-app").style.display = "block";
    } else {
        // Se o usuário não está logado, mostra o formulário de login e esconde o conteúdo do app
        document.getElementById("login-form").style.display = "block";
        document.getElementById("conteudo-app").style.display = "none";
    }
});

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    auth.signInWithEmailAndPassword(email, senha)
        .then(() => {
            loginStatus.textContent = "Login bem-sucedido!";
        })
        .catch(error => {
            loginStatus.textContent = "Erro: " + error.message;
        });
});

  const nome = document.getElementById("nome-equipamento").value;
  const local = document.getElementById("localizacao").value;
  const resp = document.getElementById("responsavel").value;

  const equipamento = { nome, local, resp };

  let equipamentos = JSON.parse(localStorage.getItem("equipamentos")) || [];
  equipamentos.push(equipamento);
  localStorage.setItem("equipamentos", JSON.stringify(equipamentos));

  equipamentoForm.reset();
  renderEquipamentos();
});

function renderEquipamentos() {
  const equipamentos = JSON.parse(localStorage.getItem("equipamentos")) || [];
  listaEquipamentos.innerHTML = "";

  equipamentos.forEach((eq, index) => {
    const li = document.createElement("li");
    li.textContent = `${eq.nome} - ${eq.local} (Resp: ${eq.resp})`;
    listaEquipamentos.appendChild(li);
  });
}

const tecnico = document.getElementById("tecnico").value;
const prioridade = document.getElementById("prioridade").value;
const previsao = document.getElementById("previsao").value;

db.ref("chamados").push({
  equipamento,
  tipo,
  descricao,
  tecnico,
  prioridade,
  previsao,
  status: "Aberto",
  data: new Date().toLocaleString()
});


renderEquipamentos();

// Chamados
const chamadoForm = document.getElementById("chamado-form");
const listaChamados = document.getElementById("lista-chamados");

chamadoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const equipamento = document.getElementById("equipamento").value;
  const tipo = document.getElementById("tipo").value;
  const descricao = document.getElementById("descricao").value;

  const chamado = { equipamento, tipo, descricao, data: new Date().toLocaleString() };

  let chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  chamados.push(chamado);
  localStorage.setItem("chamados", JSON.stringify(chamados));

  chamadoForm.reset();
  renderChamados();
});

function renderChamados() {
  const chamados = JSON.parse(localStorage.getItem("chamados")) || [];
  listaChamados.innerHTML = "";

  chamados.forEach((ch) => {
    const li = document.createElement("li");
    li.textContent = `${ch.tipo.toUpperCase()} - ${ch.equipamento}: ${ch.descricao} (${ch.data})`;
    listaChamados.appendChild(li);
  });
  // Abertura Chamado
const chamadoForm = document.getElementById("chamado-form");
chamadoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const equipamento = document.getElementById("equipamento").value;
  const tipo = document.getElementById("tipo").value;
  const descricao = document.getElementById("descricao").value;
  
  // Captura os novos valores de data e hora
  const dataChamado = document.getElementById("data-chamado").value;
  const horaChamado = document.getElementById("hora-chamado").value;

  const editId = e.target.dataset.editId;

  if (editId) {
    db.ref("chamados/" + editId).update({ equipamento, tipo, descricao, dataChamado, horaChamado });
    delete e.target.dataset.editId;
  } else {
    db.ref("chamados").push({
      equipamento,
      tipo,
      descricao,
      data: dataChamado, // Salva a data
      hora: horaChamado, // Salva a hora
      status: "Aberto",
      criadoEm: new Date().toLocaleString() // Mantém o timestamp original
    });
  }

  e.target.reset();
});

// A seguir, você também precisa ajustar a função que exibe os chamados
// para mostrar a nova data e hora.

// Mostrar Chamados
const listaChamados = document.getElementById("lista-chamados");
db.ref("chamados").on("value", snapshot => {
  listaChamados.innerHTML = "";
  snapshot.forEach(child => {
    const ch = child.val();
    const li = document.createElement("li");
    li.innerHTML = `
      ${ch.tipo.toUpperCase()} - ${ch.equipamento}: ${ch.descricao}<br>
      Data: ${ch.data || ch.dataChamado} - Horário: ${ch.hora || ch.horaChamado}<br>
      Status: ${ch.status || "Aberto"}
      ${ch.status !== "Encerrado" ? `<br><button onclick=\"encerrarChamado('${child.key}')\">Encerrar</button>` : ""}
      <button onclick=\"editarChamado('${child.key}', '${ch.equipamento.replace(/'/g, "\\'")}', '${ch.tipo}', \`${ch.descricao.replace(/`/g, "\\`")}\`)\">Editar</button>
      <button onclick=\"removerChamado('${child.key}')\">Remover</button>
      ${ch.status === "Encerrado" ? `<br>Encerrado em: ${ch.dataEncerramento}` : ""}
    `;
    listaChamados.appendChild(li);
  });
});
}

renderChamados();
