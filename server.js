const express = require('express');
const path = require('path');
const api = require('./routes/index.js');

// Defining the ports for the server
const PORT = process.env.PORT || 3001;

// Assigning an instance of express to the app variable
const app = express();

// Enabling the use of json and url-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use('/api', api);

app.use(express.static('public'));

// Route for main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Activating the server on the specified ports
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);




