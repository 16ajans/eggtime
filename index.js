import express from 'express';
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send(`<form action="./payload"><input type = "submit" value = "Click me!" /></form >`);
});

app.get('/payload', (req, res) => {
    res.download('payload.json');
});

app.listen(port, () => {
    console.log(`Service listening on ${port}.`);
});