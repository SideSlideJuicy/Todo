const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dburl = "mongodb://localhost:27017/tododb";
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    Todo.find()
    .then(result => {
        res.render('index', { data: result });
    })
    .catch(error => {
        console.error("Error retrieving tasks:", error);
        res.status(500).send("Internal Server Error");
    });
});

// Add task
app.post("/", (req, res) => {
    const todo = new Todo({
        todo: req.body.taskValue
    });

    todo.save()
    .then(result => {
        res.redirect("/");
    })
    .catch(error => {
        console.error("Error adding task:", error);
        res.status(500).send("Internal Server Error");
    });
});

// Delete task
app.delete("/:id", (req, res) => {
    Todo.findByIdAndDelete(req.params.id)
    .then(result => {
        res.json({ message: 'Task deleted successfully' });
    })
    .catch(error => {
        console.error("Error deleting task:", error);
        res.status(500).json({ message: 'An error occurred' });
    });
});

// Edit task
app.put("/:id", (req, res) => {
    const taskId = req.params.id;
    const updatedTaskValue = req.body.updatedTaskValue;

    Todo.findByIdAndUpdate(taskId, { todo: updatedTaskValue }, { new: true })
    .then(updatedTask => {
        if (updatedTask) {
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    })
    .catch(error => {
        console.error("Error updating task:", error);
        res.status(500).json({ message: 'An error occurred' });
    });
});

// Search
app.get('/search', (req, res) => {
    const searchQuery = req.query.q; // Get the search query from the request

    // Use a regular expression to perform a case-insensitive search
    Todo.find({ todo: { $regex: new RegExp(searchQuery, 'i') } })
        .then(result => {
            res.render('index', { data: result });
        })
        .catch(error => {
            console.error("Error searching tasks:", error);
            res.status(500).send("Internal Server Error");
        });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});