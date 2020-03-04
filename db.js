const homedir = require('os').homedir
const home = process.env.HOME || homedir
const fs = require('fs')
const path = require('path')
const dbPath = path.join(home, '.todo')

const db = {
  read(path = dbPath) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, { flag: 'a+' }, (err, data) => {
        if (err) return reject(err)
        let taskList
        try {
          taskList = JSON.parse(data.toString())
        } catch (err) {
          taskList = []
        }
        resolve(taskList)
      })
    })
  },
  write(newTaskList, path = dbPath) {
    return new Promise((resolve, reject) => {
      const string = JSON.stringify(newTaskList)
      fs.writeFile(path, string, (err)=>{
        if(err) return reject(err)
        resolve()
      })
    })
  }
}

module.exports = db