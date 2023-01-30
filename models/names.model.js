const mongoose = require('mongoose');

let nameSchema = new mongoose.Schema({
   
   
   name: String
   
})

mongoose.model('name', nameSchema);