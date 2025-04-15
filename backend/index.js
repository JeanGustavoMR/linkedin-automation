import express from 'express';
import bodyParser from 'body-parser';
import cors from './config/cors.js';
import loginAndSendMessages from './controllers/messageController.js';
import dotenv from 'dotenv';

// Configurar as variáveis de ambiente
dotenv.config();

const app = express(); // Inicializa o app aqui, antes de usar qualquer middleware

// Aplica o middleware CORS globalmente
app.use(cors);
app.use(bodyParser.json());

// Verifica se as variáveis de ambiente para a API estão configuradas
if (!process.env.LLAMA_API_URL || !process.env.GROQ_API_KEY) {
  console.error("Configurações de API ausentes: LLAMA_API_URL ou GROQ_API_KEY");
  process.exit(1);
}

// Endpoint para iniciar a automação do LinkedIn - **Somente quando chamado pelo frontend**
app.post('/start', async (req, res) => {
  console.log("Requisição recebida no endpoint /start com parâmetros:", req.body);

  const { username, email, password, instructions, searchUrl } = req.body;

  // Verifica se o nome de usuário está na lista permitida no arquivo .env
  const allowedUsers = process.env.NAMES_USERS.split(',');
  if (!allowedUsers.includes(username)) {
    console.error(`Usuário ${username} não autorizado.`);
    return res.status(403).json({ error: 'Usuário não autorizado' });
  }

  // Verificação dos demais parâmetros recebidos
  if (!email || !password) {
    console.error("Parâmetros obrigatórios ausentes na requisição.");
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  if (!instructions || instructions.trim() === '' || !searchUrl) {
    console.error("Parâmetros de instrução ou Link de Busca ausentes.");
    return res.status(400).json({ error: 'Instruções e Link de Busca são obrigatórios' });
  }

  try {
    // Executa a automação apenas quando chamado pelo frontend
    await loginAndSendMessages(email, password, searchUrl, instructions);
    res.status(200).json({ message: "Automação iniciada com sucesso" });
  } catch (error) {
    console.error('Erro ao iniciar automação:', error.message);
    res.status(500).json({ error: 'Erro ao iniciar automação' });
  }
});

// Porta do servidor - O backend deve **apenas iniciar o servidor** e esperar requisições do frontend
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});