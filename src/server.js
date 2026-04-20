require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const productsRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.routes');
const customersRoutes = require('./routes/customers.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

// Servindo as pastas de uploads estaticamente
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Prefix de rotas e injeção do roteador
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/customers', customersRoutes);
app.use('/api/v1/orders', ordersRoutes);
app.use((err, req, res, next) => {
  // Imprime o erro completo no terminal do servidor
  console.error("🔥 Erro capturado:", err.stack);

  // Retorna o erro em formato JSON para o Postman
  res.status(500).json({
    mensagem: "Erro Interno do Servidor",
    detalhe: err.message, // Diz o que deu errado
    rota: req.originalUrl // Diz em qual rota deu erro
  });
});

// Rota padrão para quick check
app.get('/', (req, res) => {
    res.json({ message: 'Charme Active API está rodando!' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
