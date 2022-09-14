const express = require('express');
const { request, response } = require('express');
const app = express();
const morgan = require('morgan');

// to parse req body into JSON before route handler is called
app.use(express.json());
//morgan log
morgan.token('postData', (request) => {
	if (request.method === 'POST') {
		return ' ' + JSON.stringify(request.body);
	}
	return ' '
})
app.use(
	morgan(':method :url :status :res[content-length] - :response-time ms :postData')
)

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
	const { name, number } = body;
	
	if (!name) {
		return response.status(400).json({
			error: 'Missing name'
		});
	}

	if (!number) {
		return response.status(400).json({
			error: 'Missing number'
		});
	}

	if (persons.some(p => p.name === name)) {
		console.log('here');
		return response.status(400).json({
			error: 'Name must be unique'
		})
	}

	const person = {
		name,
		number,
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

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);


const PORT = 3003;
app.listen(PORT, () => {
	console.log(`Server: ${PORT}`);
})

// helper fns
const generateId = () => {
	return Math.floor(Math.random() * (persons.length ** 5));
}
