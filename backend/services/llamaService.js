// llamaService.js
import axios from 'axios';
import dotenv from 'dotenv';

// Configurar as variáveis de ambiente
dotenv.config();

// Função para truncar o texto de acordo com o limite especificado
function truncateText(text, maxLength) {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

// Função principal para gerar a mensagem
async function generateMessage(firstName, jobTitle, aboutText, userInstructions) {
  let prompt = `${userInstructions}\n\n`;
  prompt += `Nome: ${firstName}\n`;
  prompt += `Cargo: ${jobTitle}\n`;
  prompt += `Sobre: ${aboutText}\n\n`;

  const maxAboutTextLength = 600;
  const truncatedAboutText = truncateText(aboutText, maxAboutTextLength);
  console.log("Texto truncado para bio:", truncatedAboutText);

  const userMessageContent = `
  Você é um assistente especializado em criar mensagens de relacionamento profissional personalizadas.
  Com base nas informações fornecidas, crie uma mensagem breve e direta, de no máximo 150 caracteres para iniciar uma conexão de forma amigável e profissional. 
  A mensagem deve ser personalizada com base no nome, cargo e bio do perfil. Não crie exemplos ou mensagens longas, apenas uma mensagem específica e amigável.
  Não use caracteres especiais na mensagem como [/|+=*&@].
  Sempre use a primeira letra maiúscula no nome da pessoa.
  Não use mais de 1 letra maiúscula na mesma palavra, use apenas a primeira e o resto minúscula.
  Nunca comece uma nova linha com espaço, sempre comece com letra.
  
  Nome: ${firstName}
  Cargo: ${jobTitle}
  Bio: ${truncatedAboutText}
  
  Instruções do usuário: ${userInstructions}
  `;

  console.log("Conteúdo da mensagem do usuário:", userMessageContent);

  const payload = {
    model: 'llama-3.1-70b-versatile',
    messages: [
      {
        role: 'user',
        content: userMessageContent.trim(),
      },
    ],
    max_tokens: process.env.MAX_TOKENS || 150,
    temperature: 0.5,
  };

  try {
    console.log(`Enviando requisição para a API: ${process.env.LLAMA_API_URL}`);
    console.log('Payload sendo enviado:', JSON.stringify(payload, null, 2));

    const response = await axios.post(
      process.env.LLAMA_API_URL,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const messageContent = response.data.choices?.[0]?.message?.content?.trim();
    if (messageContent) {
      console.log("Mensagem gerada com sucesso:", messageContent);
      return messageContent;
    } else {
      console.error('Estrutura de resposta inesperada da API:', response.data);
      throw new Error('A resposta da API não contém a mensagem esperada.');
    }
  } catch (error) {
    console.error('Erro ao gerar mensagem:', error.message);
    throw error;
  }
}

export default generateMessage;