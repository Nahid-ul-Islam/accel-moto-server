const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient, ServerApiVersion } = require('mongodb');
const verify = require('jsonwebtoken/verify');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//jwt
// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized access' });
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ message: 'FORBIDDEN ACCESS' });
//         }
//         console.log('decoded', decoded);
//         req.decoded = decoded;
//         next();
//     })
// }



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6myik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// client.connect(err => {
//     const bikesCollection = client.db("moto").collection("bikes");
//     console.log('db connected');
//     // perform actions on the collection object
//     client.close();
//   });


async function run() {
    try {
        await client.connect();
        const bikesCollection = client.db("moto").collection("bikes");
        console.log('db connected');


        //jwt
        // //AUTH
        // app.post('/gettoken', async (req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        //         expiresIn: '5d'
        //     })
        //     res.send({ accessToken });
        // })

        //get items
        //http://localhost:5000/bikes
        app.get('/bikes', async (req, res) => {
            const query = {};
            const cursor = bikesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });


        //get single item
        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikesCollection.findOne(query);
            res.send(result);
        });


        //update item
        app.put('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            //console.log("id", id);
            const updateItem = req.body;
            //console.log(updateItem)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateItem.quantity
                }
            };
            const result = await bikesCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        });


        //delte an item
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikesCollection.deleteOne(query);
            res.send(result);
        });


        //add a new item
        app.post('/bikes', async (req, res) => {
            const newItem = req.body;
            console.log('adding new item', newItem);
            const result = await bikesCollection.insertOne(newItem);
            res.send(result);
        });


        //search query by email
        app.get('/my-bikes', async (req, res) => {
            //jwt
            //const decodedEmail = req.decoded.email;
            const email = req.query.email;
            const query = { email: email };
            const curosr = bikesCollection.find(query);
            const result = await curosr.toArray();
            res.send(result);
            // if (email === decodedEmail) {
            //     const query = { email: email };
            //     const curosr = bikesCollection.find(query);
            //     const result = await curosr.toArray();
            //     res.send(result);
            // }
            // else{
            //     res.status(403).send({message: 'FORBIDDEN ACCESS'})
            // }

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

app.get('/deployCheck', (req, res) => {
    res.send('heroku is working fine after making any change to the server');
})

app.listen(port, () => {
    console.log('Listening to port', port);
});