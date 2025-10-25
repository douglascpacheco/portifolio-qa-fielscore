const express = require('express');
const app = express();
const torcedorRoutes = require('./routes/torcedorRoutes');
const jogoRoutes = require('./routes/jogoRoutes');
const frequenciaRoutes = require('./routes/frequenciaRoutes');
const authRoutes = require('./routes/authRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../resources/swagger.json');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/torcedores', torcedorRoutes);
app.use('/jogos', jogoRoutes);
app.use('/frequencias', frequenciaRoutes);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Error handler
app.use((err, req, res, next) => {
  if (err.status) return res.status(err.status).json({ message: err.message });
  res.status(500).json({ message: 'Erro interno.' });
});

module.exports = app;
