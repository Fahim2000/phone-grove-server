const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sdohfmu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const phoneCollection = client.db("phoneDB").collection("phone");

    app.get("/phones/:brand", async (req, res) => {
      const brandName = req.params.brand;
      // console.log(brandName);
      const query = { brand: brandName };
      const results = await phoneCollection.find(query).toArray();
      res.send(results);
    });

    app.get("/singlePhone/:id", async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) };
      const result = await phoneCollection.findOne(query);
      res.send(result);
    });

    app.get("/productdetail/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await phoneCollection.findOne(query);
      res.send(result);
    });

    app.post("/phones", async (req, res) => {
      const newPhone = req.body;
      console.log(newPhone);
      const result = await phoneCollection.insertOne(newPhone);
      res.send(result);
    });
    app.put("/phones/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedPhone = req.body;

      const phone = {
        $set: {
          name: updatedPhone.name,
          brand: updatedPhone.brand,
          price: updatedPhone.price,
          desc: updatedPhone.desc,
          rating: updatedPhone.rating,
          photo: updatedPhone.photo,
        },
      };

      const result = await phoneCollection.updateOne(filter, phone, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("SIMPLE CRUD IS RUNNINGggghgj");
});

app.listen(port, () => {
  console.log(`SIMPLE CRUD is running on port, ${port}`);
});
