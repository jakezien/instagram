exports.handler = function(event, context, callback) {
  console.log(event, context, callback)
  return {
    statuscode:200,
    body: JSON.stringify({message: 'hello yo'})
  }
}