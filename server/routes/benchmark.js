const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const { runBenchmark } = require('../benchmarks/runBenchmark');
const { AIBenchmarkService } = require('../services/aiBenchmarkService');

// Serve benchmark visualizer
router.get('/visualizer', (req, res) => {
  const visualizerPath = path.join(__dirname, '../benchmarks/visualizer.html');
  res.sendFile(visualizerPath);
});

// Run benchmark endpoint
router.post('/run', async (req, res) => {
  try {
    const { testType = 'quick' } = req.body;

    console.log(`Starting ${testType} benchmark via API...`);

    const result = await runBenchmark(testType);

    res.json({
      success: true,
      message: `Benchmark completed successfully`,
      data: {
        summary: result.summary,
        totalTests: result.results.length,
        filepath: result.filepath,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Benchmark API error:', error);
    res.status(500).json({
      success: false,
      message: 'Benchmark failed',
      error: error.message
    });
  }
});

// Get available benchmark results
router.get('/results', async (req, res) => {
  try {
    const benchmarksDir = path.join(__dirname, '../benchmarks');
    const files = await fs.readdir(benchmarksDir);

    const jsonFiles = files
      .filter(file => file.endsWith('.json'))
      .map(file => ({
        filename: file,
        path: path.join(benchmarksDir, file)
      }));

    // Get file stats for each
    const filesWithStats = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const stats = await fs.stat(file.path);
          return {
            ...file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        } catch (error) {
          return file;
        }
      })
    );

    // Sort by modification time (newest first)
    filesWithStats.sort((a, b) => new Date(b.modified) - new Date(a.modified));

    res.json({
      success: true,
      files: filesWithStats
    });

  } catch (error) {
    console.error('Error getting benchmark results:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get benchmark results',
      error: error.message
    });
  }
});

// Get specific benchmark result
router.get('/results/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../benchmarks', filename);

    // Validate filename to prevent path traversal
    if (!filename.endsWith('.json') || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    const data = await fs.readFile(filepath, 'utf8');
    const benchmarkData = JSON.parse(data);

    res.json({
      success: true,
      data: benchmarkData
    });

  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        success: false,
        message: 'Benchmark result not found'
      });
    }

    console.error('Error getting benchmark result:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get benchmark result',
      error: error.message
    });
  }
});

// Delete benchmark result
router.delete('/results/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filepath = path.join(__dirname, '../benchmarks', filename);

    // Validate filename to prevent path traversal
    if (!filename.endsWith('.json') || filename.includes('..')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filename'
      });
    }

    await fs.unlink(filepath);

    res.json({
      success: true,
      message: 'Benchmark result deleted successfully'
    });

  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({
        success: false,
        message: 'Benchmark result not found'
      });
    }

    console.error('Error deleting benchmark result:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete benchmark result',
      error: error.message
    });
  }
});

// Get benchmark status/info
router.get('/info', (req, res) => {
  res.json({
    success: true,
    info: {
      availableTestTypes: ['quick', 'full', 'stress'],
      providers: ['groq', 'gemini'],
      metrics: [
        'response_time',
        'token_usage',
        'response_length',
        'success_rate',
        'error_rate'
      ],
      description: 'AI Provider Benchmark Tool - Compare Groq and Gemini performance'
    }
  });
});

module.exports = router;