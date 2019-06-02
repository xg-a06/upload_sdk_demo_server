function noop() {}

class Router {
  constructor() {
    this.routes = {}
  }
  add(type, path, fn) {
    if (this.routes[type] === undefined) {
      this.routes[type] = {}
    }
    if (this.routes[type][path] === undefined) {
      this.routes[type][path] = []
    }
    this.routes[type][path] = fn
  }
  get(path, fn) {
    this.add('get', path, fn)
  }
  post(path, fn) {
    this.add('post', path, fn)
  }
  match(method, url) {
    if (url === '/favicon.ico') {
      return noop
    }
    return this.routes[method][url] || noop
  }
  handler(req, res) {
  
    res.json = data => {
      res.setHeader('Content-type', 'application/json')
      res.end(JSON.stringify(data))
    }
    const url = req.url
    const method = req.method.toLowerCase()

    const fn = this.match(method, url)
    fn(req, res)
  }
}
