# event-async-emitter


  install
  npm install event-async-emitter --save

```javascript
let EventAsync = require('event-async-emitter')
EventAsync.on('xxx', (data) => {

})

EventAsync.fire('xxx', data)


or
let eventAsync = new EventAsync()
eventAsync.fire('xxx', data)
eventAsync.on('xxx')
```