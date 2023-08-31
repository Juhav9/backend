const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)
mongoose.connect(url).then(result => {
  console.log('Connected to MongoDB')
})

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: v => {
        if(/^([0-9]{2}\-)[0-9]{6,}$/.test(v) || /^([0-9]{3}\-)[0-9]{5,}$/.test(v) ){
          return true
        }
        return false
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  }
})
personSchema.set('toJSON', {
  transform: (document, returnObject) =>{
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)