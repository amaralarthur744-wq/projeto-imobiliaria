import express from 'express';
import cors from 'cors';
import { db } from './db';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Cadastro de Usuário
app.post('/api/register', async (req, res) => {
    const { nome, email, senha } = req.body;

    // 1. Validação de e-mail existente
    try {
        const [existente]: any = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existente.length > 0) {
            return res.status(400).json({ mensagem: 'Este e-mail já está cadastrado no sistema.' });
        }

        // 2. Validação da Senha: Mais de 7 digitos (mínimo 8), 1 letra maiúscula e 1 caractere especial
        const regexSenha = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
        if (!regexSenha.test(senha)) {
            return res.status(400).json({
                mensagem: 'A senha deve ter mais de 7 caracteres, pelo menos uma letra maiúscula e um caractere especial.'
            });
        }

        const [resultado]: any = await db.query(
            'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
            [nome, email, senha]
        );
        res.status(201).json({ id: resultado.insertId, nome, email });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro interno ao realizar cadastro.' });
    }
});

// Login de Usuário
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [usuarios]: any = await db.query(
            'SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?',
            [email, senha]
        );
        if (usuarios.length === 0) {
            return res.status(401).json({ mensagem: 'E-mail ou senha incorretos.' });
        }
        res.json(usuarios[0]);
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro no servidor.' });
    }
});

// Listar Imóveis
app.get('/api/imoveis', async (req, res) => {
    try {
        const [linhas] = await db.query('SELECT * FROM imoveis');
        res.json(linhas);
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao buscar imóveis' });
    }
});

// Agendar Visita (Valida 7 dias e Impede choque de horário no mesmo imóvel)
app.post('/api/agendamentos', async (req, res) => {
    const { imovel_id, usuario_id, nome_cliente, email_cliente, telefone_cliente, data_hora } = req.body;

    // Validação 1: Mínimo de 7 dias de antecedência
    const dataAgendamento = new Date(data_hora);
    const dataMinima = new Date();
    dataMinima.setDate(dataMinima.getDate() + 7);

    if (dataAgendamento < dataMinima) {
        return res.status(400).json({ mensagem: 'Agendamentos devem ser feitos com no mínimo 1 semana de antecedência.' });
    }

    // Validação 2: Impedir agendamento no mesmo dia e horário para a mesma casa
    try {
        const [conflito]: any = await db.query(
            'SELECT id FROM agendamentos WHERE imovel_id = ? AND data_hora = ?',
            [imovel_id, data_hora]
        );

        if (conflito.length > 0) {
            return res.status(400).json({ 
                mensagem: 'Este imóvel já possui uma visita agendada para este mesmo dia e horário. Por favor, escolha outro horário.' 
            });
        }

        await db.query(
            'INSERT INTO agendamentos (imovel_id, usuario_id, nome_cliente, email_cliente, telefone_cliente, data_hora) VALUES (?, ?, ?, ?, ?, ?)',
            [imovel_id, usuario_id || null, nome_cliente, email_cliente, telefone_cliente, data_hora]
        );
        res.status(201).json({ mensagem: 'Agendamento criado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar agendamento' });
    }
});

// Listar Minhas Visitas com dados do Corretor Fictício
app.get('/api/meus-agendamentos/:usuario_id', async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const [visitas] = await db.query(`
            SELECT 
                a.id,
                a.data_hora,
                i.titulo AS imovel_titulo,
                i.bairro AS localizacao,
                c.nome AS corretor_nome,
                c.telefone AS corretor_telefone
            FROM agendamentos a
            JOIN imoveis i ON a.imovel_id = i.id
            LEFT JOIN corretores c ON i.corretor_id = c.id
            WHERE a.usuario_id = ?
            ORDER BY a.data_hora ASC
        `, [usuario_id]);
        res.json(visitas);
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao buscar agendamentos.' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000 🚀');
});