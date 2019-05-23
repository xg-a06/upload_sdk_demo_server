const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const serverHandler = (req, res) => {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': 'http://localhost:2333'
  })

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

  res.end(JSON.stringify({ data: [{ a: 1, b: 2 }] }))
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
    if (head.includes('filename')) {
      obj['file'] = line.slice(headLen + 4)
    } else {
      let value = tail.toString()
      obj[name] = value
    }
  })
  // let fileOriName = crypto
  //   .createHash('md5')
  //   .update(obj.fileOriName)
  //   .digest('hex')
  // console.log(obj.fileOriName)

  // let fileSuffix = obj.fileOriName.substring(
  //   obj.fileOriName.lastIndexOf('.') + 1
  // )
  fs.writeFileSync(path.resolve(__dirname, `../upload/xxx.png`), obj.file)
}

module.exports = serverHandler
