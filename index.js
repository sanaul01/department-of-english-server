
const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hcshw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        await client.connect();
        const database = client.db('education');
        const nineteenthCenturyNovelCollection = database.collection('19th_century_novel')

        app.post('/19th_century_novel', async (req, res) => {
            const nineteenNovel = req.body;
            const result = await nineteenthCenturyNovelCollection.insertOne(nineteenNovel)
            console.log(result);
            res.json(result)
        });

        app.get('/19th_century_novel', async (req, res)=>{
            const cursor = nineteenthCenturyNovelCollection.find({});
            const nineteenNovel = await cursor.toArray();
            res.send(nineteenNovel)
        });

        app.get('/19th_century_novel/:id', async (req, res)=>{
          const id = req.params.id;
          console.log(id)
          const quary = { _id: ObjectId(id) };
          const novel = await nineteenthCenturyNovelCollection.findOne(quary);
          res.json(novel);
        })
    }
    finally{
        // await client.close()
    }
}
run().catch(console.dir)


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})