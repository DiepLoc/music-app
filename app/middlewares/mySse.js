let SSE = require("express-sse");
let sse = new SSE(["array", "containing", "initial", "content"]);

sse.sendSomeThing = (data, eventName) => {
  try {
    sse.send(data, eventName);
  } catch (err) {
    console.log(err);
  }
}

sse.addSomeThing = (data) => {
  sse.sendSomeThing(data, 'add')
};
sse.deleteSomething = (data) => {
  sse.sendSomeThing(data, 'delete')
}

sse.updateSomething = (data) => {
  sse.sendSomeThing(data, 'update')
}

module.exports = sse;
