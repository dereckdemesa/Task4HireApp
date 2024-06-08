const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    taskName: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    status: { type: String, required: true, default: 'Pending' }, // Default value
    address: { type: String, required: true },
    price: { type: Number, required: true }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;



//const Task = mongoose.model('Task, TaskSchema');
//module.exports = Task