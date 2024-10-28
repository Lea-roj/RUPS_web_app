require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 8000;
const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Example API endpoint
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
