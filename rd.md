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