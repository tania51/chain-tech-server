const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors')
const port = process.env.PORT || 3009

// middleware
app.use(cors())
app.use(express.json())


const uri = process.env.DB_USER;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const createTaskCollection = client.db('chainTech').collection('create-task')

    // create task api
    app.post('/create-task', async(req, res) => {
        const query = req.body;
        const result = await createTaskCollection.insertOne(query);
        res.send(result);
    })

    // get all task api
    app.get('/all-task', async(req, res) => {
      const result = await createTaskCollection.find().toArray();
      res.send(result)
    })

    // delete task
    app.delete('/single-task/:id', async(req, res) => {
      const query = req.params.id;
      const id = { _id: new ObjectId(query) }
      const result = await createTaskCollection.deleteOne(id);
      res.send(result)

    })

    // incomplete to complete api
    app.patch('/completed-task/:id', async(req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }

      const updateDoc = {
        $set: {
          incomplete: 'Completed'
        }
      }
      const result = await createTaskCollection.updateOne(filter, updateDoc)
      res.send(result)
    })

    // edit task api
    app.patch('/edit-task/:id', async(req, res) => {
      const query = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          title: query.title,
          description: query.description,
          date: query.date,
          select: query.select
        }
      }
      const result = await createTaskCollection.updateOne(filter, updateDoc)
      res.send(result) 
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('Hello Chain Tech!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})