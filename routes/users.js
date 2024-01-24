var mongoose=require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/googleauth')
const userSchema=mongoose.Schema({
    email:String,
    name:String
})

module.exports=mongoose.model('user',userSchema)