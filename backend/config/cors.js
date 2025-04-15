import cors from 'cors';

const allowedOrigins = [
  'http://localhost:3000', // Porta padrão do frontend em desenvolvimento
  // Adicione outras URLs permitidas conforme necessário
];

const corsOptions = {
  origin: (origin, callback) => {
    // Se não houver origem ou a origem está na lista de permitidas
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`Origem não permitida pelo CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};

// Exporta o middleware configurado usando a sintaxe ES6
export default cors(corsOptions);