const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

const app = express();
app.use(express.json());
app.use(cors()); // Permite que o seu site comunique com este servidor

// Inicializar a Groq com a sua chave
const groq = new Groq({ apiKey: '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' });

// Rota de API para receber as mensagens do site
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Mensagem não fornecida.' });
    }

    try {
        const completion = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: [
                {
                    role: "system",
                    content: `És o assistente oficial do "Alojamento Valença", especializado em arrendamento de quartos de curta e longa duração em Valença, Portugal.

=== BASE DE CONHECIMENTO OFICIAL (USA APENAS ESTES DADOS) ===
1. Localização: Rua das Cabanas, nº 35, Valença (perto do centro, próximo ao Lidl).
2. Tipos de Quartos e Preços:
   - Quarto Individual: 300€/mês (não inclui Wi-Fi, luz e água).
   - Quarto Duplo / Casal: 350€/mês (com casa de banho privativa).
3. Condições de Longa Duração: Exige caução de 1 mês.
4. Regras da Casa: 
   - Proibido fumar dentro dos quartos.
   - Não são permitidos animais de estimação.
   - Horário de silêncio das 22:00 às 08:00.

=== DIRETRIZES DE RESPOSTA ===
- Sê sempre simpático, profissional e acolhedor.
- Responde em português correto e natural.
- SE A INFORMAÇÃO NÃO ESTIVER NESTA BASE DE CONHECIMENTO, deves responder educadamente: "Essa informação específica não consta aqui, mas posso encaminhar o seu pedido para a gerência." NUNCA inventes dados.`
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        const reply = completion.choices[0]?.message?.content || "Desculpe, não consegui processar a resposta.";
        res.json({ reply });

    } catch (error) {
        console.error('Erro na API da Groq:', error);
        res.status(500).json({ error: 'Erro interno ao processar a mensagem.' });
    }
});

// Porta dinâmica (necessário para alojar na nuvem) ou porta 3000 localmente
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor web a correr na porta ${PORT}`);
});