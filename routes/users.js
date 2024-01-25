var mongoose=require('mongoose')

mongoose.connect('mongodb+srv://kawarkhetejas9:tejas@cluster0.t8pp5kg.mongodb.net/?retryWrites=true&w=majority')
const userSchema=mongoose.Schema({
    email:String,
    name:String
})

module.exports=mongoose.model('user',userSchema)