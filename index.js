const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

morgan.token('post-content', (req, res) =>{
    if(req.method==="POST"){
        console.log("debug")
        return JSON.stringify(req.body)
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-content'))
app.use(express.json())
app.use(cors())



let persons = [

    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
  ]

const checkObj = obj => {
    if(Object.keys(obj).length<2){
        return true
    }
    for(value in obj){
        if(obj[value]===''){
            return true
        }
    }
}
const checkUniqueName = obj => {
    return persons.filter(person => {return person.name===obj.name})
}

app.get('/persons', (req, res) => {
    res.json(persons)
})

app.get('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }
    else{
        res.status(404).end()
    }
})

app.get('/info', (req, res) => {
    const time = Date()
    res.send(`<p>Phonebook has info for ${persons.length} people </p> 
    <p>${time}</p>`)
})

app.delete('/deletePerson/:id', (req, res) =>{
    const id = Number(req.params.id)
    const len = persons.length
    persons = persons.filter(person => person.id !== id)
    if(len-1===persons.length){
        res.status(204).end()
    }
    else{
        res.status(404).end()
    }
})

app.post('/post', (req, res) => {
    const person = req.body
    if(checkObj(person)){
        return res.status(400).json({error: 'missing values'})
    }
    if(checkUniqueName(person).length>0){
        return res.status(400).json({error: 'name must be unique'})
    }
    const id = Math.floor(Math.random()*7000)
    const newPerson = {...person, id}
    persons = [...persons, newPerson]
    res.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})