require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initializeDocuments } = require('./services/documentService');

const chatRoutes = require('./routes/chatRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const documentRoutes = require('./routes/documentRoutes');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', chatRoutes);
app.use('/api', uploadRoutes);
app.use('/api', documentRoutes);

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  await initializeDocuments();
});