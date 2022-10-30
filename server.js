const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
// Helper method for generating uniqe ids
const createID = require('./helpers/createID');
// const { response } = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

// Route for main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

// Route for notes page
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// Reading the db.json file and returning all saves notes as JSON
app.get('/api/notes', (req, res) => {
    // Log the request to the terminal
    console.info(`${req.method} request method received to get notes`);

    // Sending all notes to the client
    return res.status(200).json(notes);
});

// POST request to add new note to the database
app.post('/api/notes', (req, res) => {
    // Log the request to the terminal
    console.info(`${req.method} request method received to add a note`);

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    if (title && text) {
        // Variable for the object we will save for the new note
        const newNote = {
            title,
            text,
            id: createID(),
        };

        // Obtain existing notes
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                // Converts string to JSON object
                const parsedNotes = JSON.parse(data);

                // Add a new note
                parsedNotes.push(newNote);

                // Write updated notes back to the file
                fs.writeFile(
                    './db/db.json', 
                    JSON.stringify(parsedNotes, null, 4), 
                    (writeErr) => {
                    if (writeErr) {
                        console.error(writeErr);
                    } else {
                        console.info("Successfully updates notes!")
                    }                      
                    }
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in adding note');
    }
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);










