/*
 * @Description:
 * @Author: xg-a06
 * @Date: 2019-06-03 13:22:03
 * @LastEditTime: 2019-06-04 01:12:40
 * @LastEditors: xg-a06
 */
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const writeFilePromise = promisify(fs.writeFile)
const readFilePromise = promisify(fs.readFile)
const renamePromise = promisify(fs.rename)
const existsPromise = promisify(fs.exists)

function resolve(dir) {
  return path.resolve(__dirname, '../db', dir)
}
module.exports = {
  async get(hash) {
    let dbPath = resolve(`${hash}.json`)
    let exists = await existsPromise(dbPath)
    if (exists) {
      return readFilePromise(dbPath).then(res => JSON.parse(res.toString()))
    }
  },
  set(data, hash) {
    let dbPath = resolve(`${hash}.json`)
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
