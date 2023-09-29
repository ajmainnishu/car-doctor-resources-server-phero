const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ffrq.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        await client.connect();
        const carDoctorsCollection = client.db('carDoctorsDB').collection('carDoctors');
        app.get('/services', async (req, res) => {
            const result = await carDoctorsCollection.find().toArray();
            res.send(result);
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await carDoctorsCollection.findOne(query);
            res.send(result);
        })
        app.post('/services', async (req, res) => {
            const data = req.body;
            const doc = {
                title: data.name,
                img: data.photo,
                service_id: data.serviceID,
                price: data.price,
                description: data.description,
                facility: [
                    {
                        name: data.facilities[0].fName1,
                        details: data.facilities[0].fDetails1
                    },
                    {
                        name: data.facilities[1].fName2,
                        details: data.facilities[1].fDetails2
                    },
                    {
                        name: data.facilities[2].fName3,
                        details: data.facilities[2].fDetails3
                    },
                    {
                        name: data.facilities[3].fName4,
                        details: data.facilities[3].fDetails4
                    }
                ]
            }
            const result = await carDoctorsCollection.insertOne(doc);
            res.send(result);
        })
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Car-Doctor Resources Running')
})

app.listen(port, () => {
    console.log(`Car-Doctor Resources Running ${port}`)
})