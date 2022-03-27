const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require ('cors');
const ObjectId =require('mongodb').ObjectId;

const app =express();
const port =process.env.PORT || 5000;


app.use(cors());
app.use(express.json());
//user: nodeMongoPractise
//password: lZMVZlYc9bNYU7EL


const uri = "mongodb+srv://nodeMongoPractise:lZMVZlYc9bNYU7EL@cluster0.5f7tq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {

    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("users");
      //get api
      app.get('/users',async(req,res)=>{
          const cursor = usersCollection.find({});
          const users = await cursor.toArray();
          res.send(users);
      })
      //post api
      app.post('/users',async(req,res)=>{
          const newUser =req.body;
          const result = await usersCollection.insertOne(newUser);
          console.log("got new user",result)
          console.log("hitting the post",req.body);
          res.send(result);
      })
      //delete api
      app.delete('/users/:id',async(req,res)=>{
          const id = req.params.id;
          const query ={_id:ObjectId(id)};
          const result = await usersCollection.deleteOne(query);
          console.log("deleting user with id ",result);
          res.json(result);
          res.send("getting soon");
      })

      //put api
      app.get('/users/:id',async(req,res)=>{
          const id =req.params.id;
          const query={_id: ObjectId(id)};
          const user = await usersCollection.findOne(query);
          console.log('load user with id',id);
          res.send(user);
      })
      //update api

      app.put('/users/:id',async(req,res)=>{
          const id =req.params.id;
          const updatedUser = req.body;
          const filter ={_id:ObjectId(id)};
          const options = {upsert:true};
          const updateDoc ={
              $set: {
                  name:updatedUser.name,
                  email: updatedUser.email
              }
          };
          const result = await usersCollection.updateOne(filter,updateDoc,options)
          console.log('updating user',req);
          res.json(result);
      })



    } finally {
    //   await client.close();
  
    }
  
  }
  
  run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Running my CRUD Server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})