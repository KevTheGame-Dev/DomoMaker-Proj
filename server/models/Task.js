const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TaskModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setDesc = (desc) => _.escape(desc).trim();

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  description: {
    type: String,
    required: true,
    default: 'No description',
    trim: true,
    set: setDesc,
  },

  startDate: {
    type: Date,
    default: Date.now,
    require: true,
  },

  endDate: {
    type: Date,
    default: Date.now,
    require: true,
  },

  subTasks: {
    type: Object,
    default: {},
    required: true,
  },

  progress: {// This is a percentage
    type: Number,
    default: 0,
    min: 0,
    max: 100,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

TaskSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  startDate: doc.startDate,
  endDate: doc.endDate,
  progress: doc.progress,
});

TaskSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return TaskModel.find(search)
        .select('name description startDate endDate subTasks progress').exec(callback);
};

TaskModel = mongoose.model('Task', TaskSchema);

module.exports.TaskModel = TaskModel;
module.exports.TaskSchema = TaskSchema;
