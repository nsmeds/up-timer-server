const express = require('express');
const app = express();
const path = require('path');
const marked = require('marked');
const fs = require('fs');
const html = require('choo/html');
const choo = require('choo');
const chooApp = choo();

const readme = fs.readFileSync('./README.md', 'utf-8');
const markeddown = marked(readme);
const markedup = html(markeddown);

chooApp.route('/', function (state, emit) {
    return html`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <title>Uptimer</title>
                <meta name="description" content="">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <div>
                    ${ state.markedup }
                </div>
            </body>
        </html>
        `;
});

const state = { markedup };
const string = chooApp.toString('/', state);

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send(string);
});

module.exports = app;