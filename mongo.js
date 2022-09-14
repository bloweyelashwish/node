const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://bloweyelashwish:${password}@cluster0.u2zujg3.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema);

mongoose.connect(url)
    .then((result) => {
        console.log('connected')
        if (process.argv.length < 4) {
            console.log('here')
            console.log('Phonebook: ')
            Person.find({})
                .then((people) => {
                    people.forEach(({name, number}) => {
                        console.log(`${name} ${number}`);
                    });
                    mongoose.connection.close();
                })
                .catch((err) => console.log(err))
        } else {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            });
            return person.save()
                .then(({ name, number }) => {
                    console.log(`added ${name} number ${number} to phonebook`);
                    return mongoose.connection.close();
                })
                .catch((err) => console.log(err))
        }
    })