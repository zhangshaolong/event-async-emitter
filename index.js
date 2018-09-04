/**
 * @file Communication between modules, asynchronous modules do not lose messages
 * author zhangshaolong   369669902@qq.com
 */

const slice = Array.prototype.slice

const EventAsyncEmitter = function() {
  this.tasks = {}
  this.fired = {}
}

EventAsyncEmitter.tasks = {}
EventAsyncEmitter.fired = {}

EventAsyncEmitter.on = EventAsyncEmitter.prototype.on = function(key, task) {
  if (!key || !task) {
    return false
  }
  let queue = this.tasks[key]
  if (!queue) {
    queue = this.tasks[key] = []
    let args = this.fired[key]
    if (args) {
      task.apply(null, args)
    }
  }
  queue.push(task)
  return function() {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i] === task) {
        queue.splice(i--, 1)
      }
    }
  }
}

EventAsyncEmitter.fire = EventAsyncEmitter.prototype.fire = function(key) {
  let tasks = this.tasks
  let args = slice.call(arguments, 1)
  if (!key) {
    return false
  }
  this.fired[key] = args
  let queue = tasks[key]
  if (!queue) {
    return false
  }
  let len = queue.length
  if (len === 0) {
    return false
  }
  for (let i = 0; i < queue.length; i++) {
    queue[i].apply(null, args)
  }
}

EventAsyncEmitter.un = EventAsyncEmitter.prototype.un = function(key, task) {
  if (!key) {
    this.tasks = {}
    return true
  }
  let queue = this.tasks[key]
  if (!queue) {
    return false
  }
  if (!task) {
    queue.length = 0
    return true
  }
  let has = false
  for (let i = 0; i < queue.length; i++) {
    if (queue[i] === task) {
      queue.splice(i--, 1)
      has = true
    }
  }
  return has
}

EventAsyncEmitter.once = EventAsyncEmitter.prototype.once = function(key, task) {
  let me = this
  let handler = function() {
    task.apply(null, arguments)
    me.un(key, handler)
  }
  this.on(key, handler)
}

EventAsyncEmitter.init = function() {
  return new EventAsyncEmitter()
}

export default EventAsyncEmitter