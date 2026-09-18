const imoveis = [
    { id: 1, titulo: "Casa Moderna com Piscina", categoria: "CASA", descricao: "3 suítes, área gourmet completa, garagem para 4 carros e acabamento em alto padrão.", local: "Jardim América", preco: 5500, habitado: false, foto: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" },
    { id: 2, titulo: "Sobrado de Luxo em Condomínio", categoria: "CASA", descricao: "4 suítes, piscina aquecida, quintal amplo e segurança total 24 horas.", local: "Alphaville", preco: 9800, habitado: true, foto: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800" },
    { id: 3, titulo: "Cobertura Vista Panorâmica", categoria: "COBERTURA", descricao: "Vista incrível para toda a cidade, terraço amplo com jacuzzi privativa.", local: "Bela Vista", preco: 7200, habitado: false, foto: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800" },
    { id: 4, titulo: "Casa de Campo Contemporânea", categoria: "CASA", descricao: "Design integrado com a natureza, pomar, área verde e lareira espaçosa.", local: "Quinta da Baroneza", preco: 12000, habitado: false, foto: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800" },
    { id: 5, titulo: "Apartamento Duplex Integrado", categoria: "APARTAMENTO", descricao: "Varanda gourmet, 2 suítes, pé direito duplo na sala e 2 vagas fixas.", local: "Pinheiros", preco: 4800, habitado: true, foto: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800" },
    { id: 6, titulo: "Casa Térrea Minimalista", categoria: "CASA", descricao: "Ambientes integrados, iluminação natural, cozinha planejada e quintal.", local: "Alto de Pinheiros", preco: 6300, habitado: false, foto: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800" },
    { id: 7, titulo: "Residência Familiar com Jardim", categoria: "CASA", descricao: "4 quartos, espaço kids, churrasqueira e vaga para 3 veículos.", local: "Moema", preco: 8500, habitado: false, foto: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800" },
    { id: 8, titulo: "Loft Conceito Aberto", categoria: "APARTAMENTO", descricao: "Totalmente mobiliado, ideal para executivos, localização central e moderna.", local: "Itaim Bibi", preco: 3900, habitado: false, foto: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800" },
    { id: 9, titulo: "Mansão Neoclássica", categoria: "CASA", descricao: "5 suítes master, cinema privativo, academia e jardim de inverno.", local: "Jardim Europa", preco: 18000, habitado: true, foto: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800" }
];

const consultores = [
    "Carlos Eduardo - Consultor SENAI",
    "Mariana Silva - Especialista de Vendas",
    "Fernanda Costa - Corretora Senior",
    "Lucas Mendes - Consultor de Imóveis"
];

const usuarioConvidado = { nome: "Convidado", cep: "", endereco: "", celular: "", senhaHash: "", cadastrado: false, ehConvidado: true };
let indexBanner = 0;
let imovelSelecionado = null;
let usuarioAtual = JSON.parse(localStorage.getItem("usuarioConectado")) || usuarioConvidado;
let favoritos = JSON.parse(localStorage.getItem("favoritosImoveis")) || [];
let agendamentos = JSON.parse(localStorage.getItem("agendamentosVisitas")) || [];

document.addEventListener("DOMContentLoaded", () => {
    verificarEstadoUsuario();
    renderizarVitrine(imoveis);
    iniciarCarrossel();
    configurarFormularios();
    configurarAgendamento();

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            fecharModal();
            fecharModalPerfil();
            fecharModalAgendamento();
            fecharModalMeusAgendamentos();
        }
    });
});

async function hashSenha(senha) {
    const encoder = new TextEncoder();
    const data = encoder.encode(senha);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function sanitizar(texto) {
    const div = document.createElement('div');
    div.innerText = texto;
    return div.innerHTML;
}

function mostrarToast(mensagem, tipo = "info") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = `toast ${tipo}`;
    toast.innerText = mensagem;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function filtrarImoveis() {
    const busca = document.getElementById("inputBusca").value.toLowerCase().trim();
    const categoria = document.getElementById("selectCategoria").value;

    const filtrados = imoveis.filter(item => {
        const bateNomeOuLocal = item.titulo.toLowerCase().includes(busca) || item.local.toLowerCase().includes(busca);
        
        if (categoria === "FAVORITOS") {
            return bateNomeOuLocal && favoritos.includes(item.id);
        }

        const bateCategoria = categoria === "TODOS" || item.categoria === categoria;
        return bateNomeOuLocal && bateCategoria;
    });

    renderizarVitrine(filtrados);
}

function toggleFavorito(id, event) {
    event.stopPropagation();
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id);
        mostrarToast("Imóvel removido dos favoritos!");
    } else {
        favoritos.push(id);
        mostrarToast("Imóvel salvo nos favoritos! ❤️", "sucesso");
    }
    localStorage.setItem("favoritosImoveis", JSON.stringify(favoritos));
    filtrarImoveis();
}

function verificarEstadoUsuario() {
    document.getElementById("headerNome").innerText = usuarioAtual.nome;
    document.getElementById("perfilNome").innerText = usuarioAtual.nome;
    document.getElementById("perfilCep").innerText = usuarioAtual.cep || "Não cadastrado";
    document.getElementById("perfilEndereco").innerText = usuarioAtual.endereco || "Não cadastrado";
    document.getElementById("perfilCelular").innerText = usuarioAtual.celular || "Não cadastrado";

    const cardCadastro = document.getElementById("cardCadastro");
    const heroSection = document.getElementById("heroSection");
    const btnSair = document.getElementById("btnSair");

    if (usuarioAtual.cadastrado && !usuarioAtual.ehConvidado) {
        cardCadastro.classList.add("hidden");
        heroSection.classList.add("cadastrado");
        btnSair.innerText = "Sair";
        btnSair.classList.remove("btn-entrar");
    } else {
        cardCadastro.classList.remove("hidden");
        heroSection.classList.remove("cadastrado");
        btnSair.innerText = "Cadastrar-se";
        btnSair.classList.add("btn-entrar");
    }
}

function iniciarCarrossel() {
    atualizarBanner();
    setInterval(() => {
        indexBanner = (indexBanner + 1) % imoveis.length;
        atualizarBanner();
    }, 4000);

    document.getElementById("bannerImovel").onclick = () => abrirModal(imoveis[indexBanner]);
}

function atualizarBanner() {
    const imovel = imoveis[indexBanner];
    document.getElementById("bannerFoto").src = imovel.foto;
    document.getElementById("bannerTitulo").innerText = imovel.titulo;
    document.getElementById("bannerLocal").innerText = `📍 ${imovel.local}`;
    document.getElementById("bannerPreco").innerText = `R$ ${imovel.preco.toLocaleString('pt-BR')},00 / mês`;
}

function renderizarVitrine(lista) {
    const grid = document.getElementById("gridImoveis");
    grid.innerHTML = "";

    if (lista.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 20px;">Nenhum imóvel encontrado.</p>`;
        return;
    }

    lista.forEach(imovel => {
        const ehFavorito = favoritos.includes(imovel.id);
        const card = document.createElement("div");
        card.className = "card-imovel";
        card.innerHTML = `
            <div class="card-img-wrap">
                <img src="${imovel.foto}" alt="${imovel.titulo}">
                <span class="badge-tipo">${imovel.categoria}</span>
                ${imovel.habitado ? '<span class="badge-status-ocupado">OCUPADO</span>' : ''}
                <button class="btn-favorito ${ehFavorito ? 'ativo' : ''}" onclick="toggleFavorito(${imovel.id}, event)">
                    ${ehFavorito ? '❤️' : '🤍'}
                </button>
            </div>
            <div class="card-content">
                <h4>${imovel.titulo}</h4>
                <p class="card-local">📍 ${imovel.local}</p>
                <div class="card-preco">R$ ${imovel.preco.toLocaleString('pt-BR')},00</div>
                <button class="btn-card" onclick="abrirModalPorId(${imovel.id})">Ver Detalhes</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function abrirModalPorId(id) {
    const imovel = imoveis.find(item => item.id === id);
    if (imovel) abrirModal(imovel);
}

function abrirModal(imovel) {
    imovelSelecionado = imovel;

    document.getElementById("modalFoto").src = imovel.foto;
    document.getElementById("modalCategoria").innerText = imovel.categoria;
    document.getElementById("modalTitulo").innerText = imovel.titulo;
    document.getElementById("modalLocal").innerText = `📍 ${imovel.local}`;
    document.getElementById("modalDescricao").innerText = imovel.descricao;
    document.getElementById("modalPreco").innerText = `R$ ${imovel.preco.toLocaleString('pt-BR')},00 / mês`;

    const valor3x = (imovel.preco / 3).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("modalParcelas").innerText = `💳 Em até 3x de R$ ${valor3x} sem juros no 1º mês`;

    const btnAlugar = document.getElementById("btnAlugar");
    const alertaHabitado = document.getElementById("alertaHabitado");

    if (imovel.habitado) {
        btnAlugar.disabled = true;
        btnAlugar.innerText = "Indisponível para Aluguel";
        alertaHabitado.classList.remove("hidden");
    } else {
        btnAlugar.disabled = false;
        btnAlugar.innerText = "🔑 Alugar Imóvel";
        alertaHabitado.classList.add("hidden");
    }

    document.getElementById("modalImovel").classList.add("active");
}

function fecharModal() { document.getElementById("modalImovel").classList.remove("active"); }

function abrirModalPerfil() {
    if (usuarioAtual.ehConvidado) {
        mostrarToast("🔒 Faça seu cadastro para acessar o perfil!", "erro");
        document.getElementById("cardCadastro").scrollIntoView({ behavior: 'smooth' });
        return;
    }
    document.getElementById("modalPerfil").classList.add("active");
}

function fecharModalPerfil() { document.getElementById("modalPerfil").classList.remove("active"); }

function fecharModalAgendamento() {
    document.getElementById("modalAgendamento").classList.remove("active");
    document.getElementById("formAgendamento").reset();
}

// Abertura e Renderização da Tela de Agendamentos
function abrirModalMeusAgendamentos() {
    if (usuarioAtual.ehConvidado) {
        mostrarToast("🔒 Cadastre-se para acessar seus agendamentos!", "erro");
        document.getElementById("cardCadastro").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    renderizarListaAgendamentos();
    document.getElementById("modalMeusAgendamentos").classList.add("active");
}

function fecharModalMeusAgendamentos() {
    document.getElementById("modalMeusAgendamentos").classList.remove("active");
}

function renderizarListaAgendamentos() {
    const container = document.getElementById("listaAgendamentos");
    container.innerHTML = "";

    const meusAgendamentos = agendamentos.filter(a => a.usuario === usuarioAtual.nome);

    if (meusAgendamentos.length === 0) {
        container.innerHTML = `<p style="text-align: center; color: #64748b; padding: 20px;">Você não possui nenhuma visita agendada no momento.</p>`;
        return;
    }

    meusAgendamentos.forEach(item => {
        const card = document.createElement("div");
        card.className = "card-agendamento-item";
        card.innerHTML = `
            <img src="${item.imovelFoto}" alt="${item.imovelTitulo}" class="img-agendamento">
            <div class="info-agendamento">
                <h4>${item.imovelTitulo}</h4>
                <p>📍 ${item.imovelLocal}</p>
                <p>📅 <strong>Data:</strong> ${item.data} às ${item.hora}</p>
                <span class="badge-consultor">👔 ${item.consultor}</span>
            </div>
            <button class="btn-cancelar-agendamento" onclick="cancelarAgendamento(${item.id})">Cancelar</button>
        `;
        container.appendChild(card);
    });
}

function cancelarAgendamento(id) {
    agendamentos = agendamentos.filter(item => item.id !== id);
    localStorage.setItem("agendamentosVisitas", JSON.stringify(agendamentos));
    mostrarToast("Agendamento cancelado com sucesso.");
    renderizarListaAgendamentos();
}

function toggleAreaSenha() {
    const area = document.getElementById("areaAlterarSenha");
    const btn = document.getElementById("btnToggleSenha");

    if (area.classList.contains("hidden")) {
        area.classList.remove("hidden");
        btn.innerText = "❌ Cancelar Alteração de Senha";
    } else {
        area.classList.add("hidden");
        btn.innerText = "🔑 Deseja alterar sua senha?";
        document.getElementById("formAlterarSenha").reset();
    }
}

function efetuarAluguel() {
    if (usuarioAtual.ehConvidado) {
        mostrarToast("🔒 Cadastre-se para alugar um imóvel!", "erro");
        fecharModal();
        document.getElementById("cardCadastro").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (!imovelSelecionado) return;

    const btn = document.getElementById("btnAlugar");
    btn.disabled = true;
    btn.innerText = "⌛ Processando Proposta...";
    btn.classList.add("btn-loading");

    setTimeout(() => {
        btn.disabled = false;
        btn.innerText = "🔑 Alugar Imóvel";
        btn.classList.remove("btn-loading");
        mostrarToast(`Proposta enviada com sucesso para ${imovelSelecionado.titulo}!`, "sucesso");
        fecharModal();
    }, 1500);
}

function marcarVisita() {
    if (usuarioAtual.ehConvidado) {
        mostrarToast("🔒 Cadastre-se para agendar uma visita!", "erro");
        fecharModal();
        document.getElementById("cardCadastro").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (!imovelSelecionado) return;

    fecharModal();
    document.getElementById("agendamentoTituloImovel").innerText = `Imóvel: ${imovelSelecionado.titulo}`;
    
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    document.getElementById("dataVisita").min = amanha.toISOString().split("T")[0];

    setTimeout(() => {
        document.getElementById("modalAgendamento").classList.add("active");
    }, 300);
}

function configurarAgendamento() {
    document.getElementById("formAgendamento").addEventListener("submit", (e) => {
        e.preventDefault();

        const dataStr = document.getElementById("dataVisita").value;
        const horaStr = document.getElementById("horaVisita").value;

        const dataSelecionada = new Date(dataStr + "T00:00:00");
        const diaSemana = dataSelecionada.getDay();

        if (diaSemana === 0) {
            mostrarToast("Visitas são permitidas apenas de Segunda a Sábado.", "erro");
            return;
        }

        const [hora, minuto] = horaStr.split(":").map(Number);
        if (hora < 7 || hora > 17 || (hora === 17 && minuto > 0)) {
            mostrarToast("Horário de visita permitido apenas entre 07:00 e 17:00.", "erro");
            return;
        }

        const btn = document.getElementById("btnConfirmarAgendamento");
        btn.disabled = true;
        btn.innerText = "⌛ Confirmando Agendamento...";
        btn.classList.add("btn-loading");

        setTimeout(() => {
            btn.disabled = false;
            btn.innerText = "Confirmar Agendamento";
            btn.classList.remove("btn-loading");

            const dataFormatada = dataSelecionada.toLocaleDateString("pt-BR");
            const consultorSorteado = consultores[imovelSelecionado.id % consultores.length];

            const novoAgendamento = {
                id: Date.now(),
                usuario: usuarioAtual.nome,
                imovelTitulo: imovelSelecionado.titulo,
                imovelFoto: imovelSelecionado.foto,
                imovelLocal: imovelSelecionado.local,
                consultor: consultorSorteado,
                data: dataFormatada,
                hora: horaStr
            };

            agendamentos.push(novoAgendamento);
            localStorage.setItem("agendamentosVisitas", JSON.stringify(agendamentos));

            mostrarToast(`Visita agendada para ${dataFormatada} às ${horaStr}! 📅`, "sucesso");
            fecharModalAgendamento();
        }, 1200);
    });
}

function fazerLogout() {
    if (usuarioAtual.ehConvidado) {
        document.getElementById("cardCadastro").scrollIntoView({ behavior: 'smooth' });
        return;
    }

    localStorage.setItem("usuarioConectado", JSON.stringify(usuarioConvidado));
    mostrarToast("Você saiu da conta.");
    setTimeout(() => location.reload(), 1000);
}

function configurarFormularios() {
    document.getElementById("formCadastro").addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = document.getElementById("btnCadastrar");
        btn.disabled = true;
        btn.innerText = "⌛ Criando conta...";

        const senhaPadraoHash = await hashSenha("Senha123@");

        usuarioAtual = {
            nome: sanitizar(document.getElementById("cadNome").value),
            cep: sanitizar(document.getElementById("cadCep").value),
            endereco: sanitizar(document.getElementById("cadEndereco").value),
            celular: `(${sanitizar(document.getElementById("cadDdd").value)}) ${sanitizar(document.getElementById("cadCelular").value)}`,
            senhaHash: senhaPadraoHash,
            cadastrado: true,
            ehConvidado: false
        };

        setTimeout(() => {
            localStorage.setItem("usuarioConectado", JSON.stringify(usuarioAtual));
            mostrarToast(`Bem-vindo(a), ${usuarioAtual.nome}!`, "sucesso");
            setTimeout(() => location.reload(), 800);
        }, 1200);
    });

    document.getElementById("formAlterarSenha").addEventListener("submit", async (e) => {
        e.preventDefault();

        const senhaAtual = document.getElementById("senhaAtual").value;
        const novaSenha = document.getElementById("novaSenha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;

        const senhaAtualHash = await hashSenha(senhaAtual);

        if (senhaAtualHash !== usuarioAtual.senhaHash) {
            mostrarToast("A 'Senha Atual' informada está incorreta.", "erro");
            return;
        }

        if (novaSenha !== confirmaSenha) {
            mostrarToast("A nova senha e a confirmação não coincidem.", "erro");
            return;
        }

        const regexSenha = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!\%*?&]{8,}$/;

        if (!regexSenha.test(novaSenha)) {
            mostrarToast("Senha fraca! Requisitos: 8+ caracteres, maiúscula, minúscula, número e caractere especial.", "erro");
            return;
        }

        const btn = document.getElementById("btnSalvarSenha");
        btn.disabled = true;
        btn.innerText = "⌛ Atualizando senha...";

        setTimeout(async () => {
            usuarioAtual.senhaHash = await hashSenha(novaSenha);
            localStorage.setItem("usuarioConectado", JSON.stringify(usuarioAtual));

            btn.disabled = false;
            btn.innerText = "Salvar Nova Senha";

            mostrarToast("Senha alterada e criptografada com sucesso!", "sucesso");
            e.target.reset();
            toggleAreaSenha();
            fecharModalPerfil();
        }, 1200);
    });
}