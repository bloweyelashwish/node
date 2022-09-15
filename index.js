require('dotenv').config();
const express = require('express');
const { request, response } = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');

// view static
app.use(express.static('build'))
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
// allow requests from all origins
app.use(cors())

app.get('/', (request, response) => {
	response.send('<h1>Hi</h1>');
})

app.get('/api/persons', (request, response) => {
	Person.find({}).then(persons => {
		response.json(persons);
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Person.findById(request.params.id).then(person => {
		if (person) {
			response.json(person)
		} else {
			response.status(404).end()
		}
	})
		.catch(error => {
			next(error);
		})
})

app.get('/api/info', (request, response) => {
	const message = `Phonebook has info on ${persons.length} people`;
	const date = new Date();

	response.send(`
		<p>${message}</p>
		<p>${date}</p>
	`)
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body;

	if (body.name === undefined) {
		return response.status(400).json({ error: 'Missing name' })
	}

	const person = new Person({
		name: body.name,
		number: body.number,
	})

	person.save().then(savedPerson => {
		response.json(savedPerson) // cb ensures that the response is sent only if the operation succeeded
	})
		.catch(error => next(error))
})

//upd
app.put('/api/persons/:id', (request, response, next) => {
	const { name, number } = request.body

	Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query'})
		.then(updatedPerson => {
			response.json(updatedPerson)
		})
		.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

//
const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);
//
const errorHandler = (error, request, response, next) => {
	console.log(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'Malformed id' })
	}	else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}
app.use(errorHandler)


const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server: ${PORT}`);
})

// helper fns
const generateId = () => {
	return Math.floor(Math.random() * (persons.length ** 5));
}
