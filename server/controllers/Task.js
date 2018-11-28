const models = require('../models');
const Task = models.Task;

const makerPage = (req, res) => {
  Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }


    return res.render('app', { csrfToken: req.csrfToken(), tasks: docs });
  });
};

const makeTask = (req, res) => {
  if (!req.body.name || !req.body.startDate || !req.body.endDate) {
    return res.status(400).json({ error: 'Aaah! Name, start, and end are required!' });
  }

  const taskData = {
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    owner: req.session.account._id,
  };

  // Assign non-required's if they're there
  if (req.body.description) {
    taskData.description = req.body.description;
  }

  console.log(taskData);

  const newTask = new Task.TaskModel(taskData);

  const taskPromise = newTask.save();

  taskPromise.then(() => res.json({ redirect: '/maker' }));

  taskPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Task already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return taskPromise;
};

const getTasks = (request, response) => {
  const req = request;
  const res = response;

  return Task.TaskModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured.' });
    }

    return res.json({ tasks: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeTask;
module.exports.getTasks = getTasks;
