const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Todo = require('./models/todo')

const PORT = 3000

app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const dburl = "mongodb://localhost:27017/tododb"
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true })

app.get('/', (req, res) => {
    // res.render('index.ejs')
    Todo.find()
    .then(result => {
        res.render('index',  { data: result }) // Render the main page with all tasks stored in database
        console.log(result)
    })
})

// Add task
app.post("/", (req, res) => {
    const todo = new Todo({
        // todo: "test"
        todo: req.body.taskValue // Fetch the user input value by requesting access to the body and the user input
    })
    todo.save()
    .then(result => {
        res.redirect("/")
    })
})

// Delete task
app.delete("/:id", (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
    .then(result => {})
})





  
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});