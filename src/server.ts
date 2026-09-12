import express from 'express';
import cors from 'cors';
import { db } from './db';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/imoveis', async (req, res) => {
    try {
        const [linhas] = await db.query('SELECT * FROM imoveis');
        res.json(linhas);
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao buscar imóveis' });
    }
});

app.post('/api/agendamentos', async (req, res) => {
    const { imovel_id, nome_cliente, email_cliente, telefone_cliente, data_hora } = req.body;
    try {
        await db.query(
            'INSERT INTO agendamentos (imovel_id, nome_cliente, email_cliente, telefone_cliente, data_hora) VALUES (?, ?, ?, ?, ?)',
            [imovel_id, nome_cliente, email_cliente, telefone_cliente, data_hora]
        );
        res.status(201).json({ mensagem: 'Agendamento criado com sucesso!' });
    } catch (erro) {
        res.status(500).json({ mensagem: 'Erro ao cadastrar agendamento' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000 🚀');
});