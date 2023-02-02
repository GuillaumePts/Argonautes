const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require('path');
const  https = require('https');
const fs = require('fs');

// gestion https
const server = https.createServer({ 
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert') 
}, app);

// gestion connection BDD

  //  contient la phrase de connection à la bdd
const mdp = require('./env');


const connectionString = mdp.mongoAtlasUri;

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB Atlas!');
});

//  Chargement du model pour mongodb
require('./models/names.model');
let Name = mongoose.model('name');

// gestion du body-parser et app.use
let bodyParser = require("body-parser");
const { url } = require('inspector');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json()); 
app.use(express.static(path.join(__dirname, 'public')))


// gestions des requetes
app.get('/', (req, res)=>{

    res.sendFile(path.join(__dirname, '/index.html'))

})


// envoi de la liste coté client
app.get('/liste', (req , res) =>{

  //on va chercher dans la BDD la liste des Argonautes
  Name.find((err, rslt) => {

    if(err){

      console.log(err);;
      
    }else if(rslt){

      res.send(rslt)

    }
  })

})


// inscription de l'Argonaute
app.post('/add' , (req,res)=>{

    //via le body-parser on recupère le contenu envoyé coté client  
    let argonaute = req.body.name
    

    // gestion des erreurs
    let tabErr = []
    
    if(argonaute === ''){

        tabErr.push(1);

    }else if(argonaute.lenght > 70){

        tabErr.push(1);

    }else if(argonaute.match('<(|\/|[^\/>][^>]+|\/[^>][^>]+)>')){

        tabErr.push(1);

    }else if(argonaute.match(/^[a-zA-Z]+$/)){

        let verifName = argonaute


        // vérification si l'argonaute est déja inscrit en BDD
        Name.findOne({
          name : verifName
      }, (err,exist)=>{
          if(err){
              // console.log(err)
              res.send(JSON.stringify('une erreur est survenu lors de l\'enregistrement de l\'Argonaute'))
          }else if(exist){
              res.send(JSON.stringify('un Argonaute est déja inscrit à ce nom'))
          }else{
              let data = new Name() ; 
              data.name = verifName ;
              data.save()

              res.send(true)
          }
      })

    }else{

        tabErr.push(1);

    }

})


// server écoute sur le port 9999
// server.listen(9999, (req, res)=>{
//     console.log("server ok ! : https://192.168.1.13:9999");
// })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
server.listen(port, (req, res)=>{
  console.log("server ok ! : https://192.168.1.13:8000");
});