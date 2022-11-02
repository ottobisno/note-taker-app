const note = require('express').Router();
const fs = require('fs');
const { notes } = require('../db/db.json');
// Helper method for generating uniqe ids
const createID = require('../helpers/createID');

// Reading the db.json file and returning all saves notes as JSON
note.get('/', (req, res) => {
    // Log the request to the terminal
    console.info(`${req.method} request method received to get notes`);

    // Sending all notes to the client
    res.status(200).json(notes);
});


// POST request to add new note to the database
note.post('/', (req, res) => {
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

        // Adding a new note to the "notes" array in the db
        notes.push(newNote);

        // Write updated notes back to the db
        fs.writeFile('./db/db.json', JSON.stringify({ notes: notes }, null, 3), (err) => {
            err ? console.error('Error in adding note') : console.log('Note successfully added');
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

// Delete request to remove notes from the database
note.delete('/:id', (req, res) => {
    // Log request to the terminal
    console.info(`${req.method} request received to delete a note`);

    // Searching the database for the note who's ID matches the note clicked on the front-end 
    for (let i = 0; i < notes.length; i++) {
        const currentNote = notes[i];
        // If the ID matches, remove it from the database
        if (currentNote.id === req.params.id) {
            let index = notes.indexOf(currentNote);
            notes.splice(index, 1);

            // Write updated notes back to the db
            fs.writeFile('./db/db.json', JSON.stringify({ notes: notes }, null, 3), (err) => {
            err ? console.error('Error in deleting note') : console.log('Note successfully deleted');
            });
    
            res.status(200).json();
            return;
        } 
    }
    res.status(500).json('Note ID not found');
});

module.exports = note;