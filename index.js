const express = require('express')
const app = express()
const port = 3000
const mongoose = require('mongoose');

// parse stringify (API) data
app.use(express.json());

mongoose.connect("mongodb://localhost/todos", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("connection successful"))
    .catch((err) => console.log(err));

// schema define the structure of a document
var personSchema = new mongoose.Schema({
    name: { type: String, default: "anonymous" },
    email: { type: String },
    phone: { type: String }
});

// interference between schema and database
var personModel = mongoose.model('Person', personSchema);



// get data
app.get('/get_student', async(req, res) => {
    const data = await personModel.find();
    res.send(data)
})


// add data
app.post('/add_student', (req, res) => {

    // insert document to database
    var comment1 = new personModel({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
    });

    comment1
        .save()
        .then(() => {
            res.send(comment1);
        })
        .catch((err) => {
            res.send("error in insert...", err);
        });

})


// update data
app.put('/update_student/:id', async(req, res) => {
    const _id = req.params.id
    const updated_data = await personModel.updateOne({ _id }, { $set: { "name": req.body.name } });
    res.send(updated_data)

    // get all update data
    // const data = await personModel.find();
    // res.send(data)
})


// ====================== delete student ==================
app.delete('/delete_student/:id', async(req, res) => {

    // Delete data on base of _id
    const _id = req.params.id
    const cursor = await personModel.findByIdAndDelete(_id);
    res.send(cursor);
})


// default link
app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})