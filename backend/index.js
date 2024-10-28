const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// API endpoint example (optional)
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the API!' });
});

// Serve React's index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
