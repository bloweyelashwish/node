const { request, response } = require('express');
const express = require('express');
const app = express();

const persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hi</h1>');
})

app.get('/api/persons', (request, response) => {
    response.json(persons);
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    response.json(person);
})

app.get('/api/info', (request, response) => {
	const message = `Phonebook has info on ${persons.length} people`;
	const date = new Date();

	response.send(`
		<p>${message}</p>
		<p>${date}</p>
	`)
})

const PORT = 3003;
app.listen(PORT, () => {
    console.log(`Server: ${PORT}`);
})