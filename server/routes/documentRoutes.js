const express = require('express');
const { getDocuments } = require('../services/documentService');

const router = express.Router();

router.get('/documents', (req, res) => {
  const documents = getDocuments();
  res.json(documents);
});

module.exports = router;