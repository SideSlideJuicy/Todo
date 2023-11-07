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

// Function to fetch and render the task list view
async function renderTaskListView(res) {
    try {
        const undoneTasksCount = await Todo.countDocuments({ status: "Undone" });
        const doneTasksCount = await Todo.countDocuments({ status: "Done" });
        const upcomingTasks = await Todo.find({ status: "Undone" });
        const doneTasks = await Todo.find({ status: "Done" });

        res.render('index', {
            undoneTasksCount,
            doneTasksCount,
            upcomingTasks,
            doneTasks
        });
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).send("Internal Server Error");
    }
}

// Render list view
app.get('/', async (req, res) => {
    await renderTaskListView(res);
});

// Add task
app.post("/", (req, res) => {
    const { taskValue, dateValue } = req.body;

    const todo = new Todo({
        todo: taskValue,
        date: dateValue ? new Date(dateValue) : new Date(), // Use the provided date or set the current date
        // If 'status' is not explicitly set here, it will default to "Undone" based on the schema.
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
app.get('/search', async (req, res) => {
    const searchQuery = req.query.q.trim(); // Get the search query from the request and trim spaces

    try {
        // Search for tasks that contain the search query
        const tasks = await Todo.find({
            todo: { $regex: new RegExp(searchQuery, 'i') }
        });

        // Separate tasks by status
        const upcomingTasks = tasks.filter(task => task.status === 'Undone');
        const doneTasks = tasks.filter(task => task.status === 'Done');

        res.render('index', { upcomingTasks, doneTasks });
    } catch (error) {
        console.error("Error retrieving tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Done task
app.put('/:id/status', async (req, res) => {
    const taskId = req.params.id;
    const newStatus = req.body.status;

    // Update the task status in the database
    Todo.findByIdAndUpdate(taskId, { status: newStatus }, { new: true })
        .then(updatedTask => {
            if (updatedTask) {
                res.json({ message: 'Status updated successfully' });
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        });
});

// Server port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});