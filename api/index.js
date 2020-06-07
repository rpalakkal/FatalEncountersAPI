const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const createQuery = require('./queryGenerator');
require('dotenv').config();

const pageSize = 1000;
app.use(express.json());
app.post('/api', (req, res) => {
    console.log(req.body)
    let query
    if(req.body){
        query = createQuery.createQuery(req.body)
    }else{
        query = {}
    }
    
    
    
    MongoClient.connect(process.env.READ_URL, { useUnifiedTopology: true, useNewUrlParser: true}, function(err, client) {
 
        const db = client.db('fatalencounters');
      
        const collection = db.collection('main');

        collection.find(query).limit(pageSize).toArray(function(err, result) {
          if(err){
            res.send(401).json(err)
          }
          console.log(result.length)
          let next;
          if(result.length===pageSize){
            next = result[result.length - 1]._id
          }
          res.status(200).json({result, next})
        });

        
      });
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Example app listening at http://localhost:${PORT}`))

