require('dotenv').config();
const express = require('express');
const cors = require('cors');
const titlesRouter = require('./routes/titles');

const app = express();
const PORT = process.env.PORT || 5000;

const errorHandler = require('./middleware/errorHandler');


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/titles', titlesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ API SecureChain-Land démarrée sur http://localhost:${PORT}`);
});

app.use(errorHandler);