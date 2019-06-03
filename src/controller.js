/*
 * @Description:
 * @Author: xg-a06
 * @Date: 2019-05-24 12:37:55
 * @LastEditTime: 2019-06-03 14:35:27
 * @LastEditors: xg-a06
 */
const fs = require('fs')
const db = require('./db')

module.exports = {
  async getIndexByHash(hash) {
    const data = await db.get()
    if (data[hash]) {
      return data[hash]
    }
    let ret = {
      index: 0,
      complete: false
    }
    data[hash] = ret
    db.set(data)
    return ret
  },
  async upload(postData) {
    let { hash, index: index, start, name, file } = postData
    db.save(`${name}.tmp`, file, parseInt(start) === 0)
    const data = await db.get()
    if (data[hash]) {
      data[hash].index = parseInt(index) + 1
      db.set(data)
    }
    return {}
  },
  async complete(postData) {
    let { hash, name, ext, size } = postData
    const data = await db.get()
    if (data[hash]) {
      let fileName = `${name + hash}.${ext}`
      delete data[hash].index
      data[hash].name = data[hash].size = size
      data[hash].complete = true
      db.set(data)
      db.complete(`${name + hash}.tmp`, fileName)
    }
    return { hash, complete: true }
  }
}
