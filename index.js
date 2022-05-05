const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6myik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const bikesCollection = client.db("moto").collection("bikes");
        //get items
        //http://localhost:5000/bikes
        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        //add item
        app.post('/bikes', async(req, res) => {
            const newItem = req.body;
            const result = await bikesCollection.insertOne(newItem);
            res.send(result);
        });
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('got the data form serverrrrr');
});

app.listen(port, () => {
    console.log('Listening to port', port);
});