/*
 * @Description:
 * @Author: xg-a06
 * @Date: 2019-06-03 13:22:03
 * @LastEditTime: 2019-06-03 14:24:59
 * @LastEditors: xg-a06
 */
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFilePromise = promisify(fs.writeFile)
const readFilePromise = promisify(fs.readFile)
const renamePromise = promisify(fs.rename)

const dbPath = path.join(__dirname, 'db.json')
module.exports = {
  get() {
    return readFilePromise(dbPath).then(res => JSON.parse(res.toString()))
  },
  set(data) {
    return writeFilePromise(dbPath, JSON.stringify(data))
  },
  save(fileName, data, isNew) {
    if (isNew) {
      fs.writeFileSync(path.join(__dirname, `../uploads/${fileName}`), data)
    } else {
      fs.appendFileSync(path.join(__dirname, `../uploads/${fileName}`), data)
    }
  },
  complete(oldName, newName) {
    return renamePromise(
      path.join(__dirname, `../uploads/${oldName}`),
      path.join(__dirname, `../uploads/${newName}`)
    )
  }
}
