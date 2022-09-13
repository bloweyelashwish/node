const express = require('express');
const { request, response } = require('express');
const app = express();

// to parse req body into JSON before route handler is called
app.use(express.json());

let persons = [
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

	if (person) {	
	response.json(person);
	} else {
		response.status(404).end();
	}
})

app.get('/api/info', (request, response) => {
	const message = `Phonebook has info on ${persons.length} people`;
	const date = new Date();

	response.send(`
		<p>${message}</p>
		<p>${date}</p>
	`)
})

app.post('/api/persons', (request, response) => {
	const body = request.body;
	console.log(body);
	
	if (!body.name) {
		return response.status(400).json({
			error: 'Missing name'
		});
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId()
	}

	persons = persons.concat(person);

	response.json(person);
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter(person => person.id !== id);

	response.status(204).end()
})

const PORT = 3003;
app.listen(PORT, () => {
	console.log(`Server: ${PORT}`);
})

// helper fns
const generateId = () => {
	const maxId = persons.length > 0 ? Math.max(...persons.map(p => p.id)) : 0;

	return maxId + 1;
}