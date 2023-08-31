require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')
const { default: mongoose } = require('mongoose')

morgan.token('post-content', (req, res) =>{
  if(req.method==='POST'){
    return JSON.stringify(req.body)
  }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(result => { res.json(result).end()})
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    res.json(person).end()
  })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  const time = Date()
  Person.find({}).then(result=> 
    res.send(`<p>Phonebook has info for ${result.length} people </p> 
        <p>${time}</p>`))
    
})

app.delete('/api/persons/:id', (req, res, next) =>{
  console.log('Deleting id: ', req.params.id)
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    }).catch(error => next(error))

})
app.post('/api/persons', (req, res, next) => {
  const person = req.body
  const newPerson = new Person({
    name: person.name,
    number: person.number
  })
  newPerson.save().then(result => {
    console.log(`${result.name} added to phonebook`)
    res.json(result).end()
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (req, res) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }
  Person.findByIdAndUpdate(req.params.id, person, {new: true
  })
    .then(result => res.json(result))
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.log('Error!')
  if(error.name==='CastError'){
    res.status(400).send({error: 'malformatted id'})
  }
  if(error.name==='ValidationError'){
    res.status(400).json(error)
  }
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
  console.log(`Server running on port ${PORT}`)
})