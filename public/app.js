const container = document.getElementById('imoveis-container');
const modal = document.getElementById('modal-agendamento');
const form = document.getElementById('form-agendamento');

async function carregarImoveis() {
    try {
        const res = await fetch('/api/imoveis');
        const imoveis = await res.json();
        
        if (!Array.isArray(imoveis) || imoveis.length === 0) {
            container.innerHTML = '<p>Nenhum imóvel encontrado no banco de dados.</p>';
            return;
        }

        container.innerHTML = imoveis.map(i => `
            <div class="card">
                <img src="${i.imagem_url}" width="100%">
                <h3>${i.titulo}</h3>
                <p>${i.bairro} - R$ ${i.preco}</p>
                <button onclick="abrirModal(${i.id})">Agendar Visita</button>
            </div>
        `).join('');
    } catch (erro) {
        console.error('Erro ao carregar imóveis:', erro);
        container.innerHTML = '<p style="color:red;">Erro ao conectar com o servidor.</p>';
    }
}

function abrirModal(id) {
    document.getElementById('imovel-id').value = id;
    modal.showModal();
}

form.onsubmit = async (e) => {
    e.preventDefault();
    const dados = {
        imovel_id: document.getElementById('imovel-id').value,
        nome_cliente: document.getElementById('nome').value,
        email_cliente: document.getElementById('email').value,
        telefone_cliente: document.getElementById('telefone').value,
        data_hora: document.getElementById('data_hora').value
    };
    await fetch('/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });
    alert('Visita agendada com sucesso!');
    modal.close();
};

carregarImoveis();