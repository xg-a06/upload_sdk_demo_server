/*
 * @Description:
 * @Author: xg-a06
 * @Date: 2019-05-23 16:28:58
 * @LastEditTime: 2019-06-02 23:35:28
 * @LastEditors: xg-a06
 */
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const url = require('url')

const serverHandler = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, PUT, DELETE'
  })
  if (req.method === 'OPTIONS') {
    res.end()
    return
  }
  let buf = []
  let string
  req.on('data', data => {
    buf.push(data)
  })
  req.on('end', data => {
    if (buf.length > 0) {
      string = Buffer.concat(buf)
      let boundary = req.headers['content-type'].split('=')[1]
      boundary = '--' + boundary
      copeData(string, boundary)
    }
  })

  res.end(JSON.stringify({ a: 1 }))
}

function splitBuffer(buffer, sep) {
  let arr = []
  let pos = 0
  let sepIndex = -1
  let sepLen = Buffer.from(sep).length
  do {
    sepIndex = buffer.indexOf(sep, pos)
    if (sepIndex == -1) {
      arr.push(buffer.slice(pos))
    } else {
      arr.push(buffer.slice(pos, sepIndex))
    }
    pos = sepIndex + sepLen
  } while (sepIndex !== -1)

  return arr
}

function copeData(buffer, boundary) {
  let lines = splitBuffer(buffer, boundary)
  lines = lines.slice(1, -1)
  let obj = {}
  lines.forEach(line => {
    line = line.slice(2, -2) //去掉多余的/r/n
    let [head, tail] = splitBuffer(line, '\r\n\r\n')
    let headLen = head.length
    head = head.toString()
    let name = head.match(/name="(\w*)"/)[1]
    let value = null
    if (name === 'file') {
      value = line.slice(headLen + 4)
    } else {
      value = tail.toString()
    }
    obj[name] = value
  })

  if (parseInt(obj.start) === 0) {
    fs.writeFileSync(
      path.join(__dirname, `../uploads/${obj.filename}`),
      obj.file
    )
  } else {
    fs.appendFileSync(
      path.join(__dirname, `../uploads/${obj.filename}`),
      obj.file
    )
  }
}

module.exports = serverHandler
