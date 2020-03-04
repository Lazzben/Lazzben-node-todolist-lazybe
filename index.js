const db = require('./db.js')
const inquirer = require('inquirer');

module.exports.add = async (task) => {
  let taskList = await db.read()
  taskList.push({ 'title': task, 'done': false })
  db.write(taskList)
}

module.exports.clear = async (task) => {
  db.write([])
}

function markAsDone(taskList, index) {
  taskList[index].done = true;
  db.write(taskList)
}

function markAsUndone(taskList, index) {
  taskList[index].done = false;
  db.write(taskList)
}

function changeTitle(taskList, index) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: 'Input your new title',
    }).then(answer => {
      taskList[index].title = answer.title
      db.write(taskList)
    })
}

function deleteTask(taskList, index) {
  taskList.splice(index, 1)
  db.write(taskList)
}

function askForAction(taskList, index) {
  const actions = { markAsDone, markAsUndone, changeTitle, deleteTask }
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'Choose a action',
      choices: [
        { name: 'quit', value: 'quit' },
        { name: 'done', value: 'markAsDone' },
        { name: 'undone', value: 'markAsUndone' },
        { name: 'changeTitle', value: 'changeTitle' },
        { name: 'delete', value: 'deleteTask' }
      ]
    }).then(answer => {
      const action = actions[answer.action]
      action && action(taskList, index)
    })
}

function askForCreateTask(taskList) {
  inquirer
    .prompt({
      type: 'input',
      name: 'title',
      message: 'Input your title',
    }).then(answer => {
      taskList.push({ 'title': answer.title, 'done': false })
      db.write(taskList)
    })
}

function printTasks(taskList) {
  inquirer
    .prompt({
      type: 'list',
      name: 'index',
      message: 'Choose your task',
      choices: [{ name: 'quit', value: '-1' }, ...taskList.map((task, index) => {
        return { name: `${task.done ? '[x]' : '[_]'} ${index + 1} - ${task.title}`, value: index.toString() }
      }), { name: 'add task', value: '-2' }]
    })
    .then(answer => {
      const index = parseInt(answer.index)
      if (index >= 0) {
        askForAction(taskList, index)
      } else if (index === -2) {
        askForCreateTask(taskList)
      }
    });
}

module.exports.showAll = async (task) => {
  let taskList = await db.read()
  printTasks(taskList)
}