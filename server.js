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


// server écoute sur le port 9999
server.listen(9999, (req, res)=>{
    console.log("server ok ! : https://192.168.1.13:9999");
})