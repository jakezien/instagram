const axios = require('axios')
const qs = require('qs')

exports.handler = async function (event, context, callback) {
  // console.log(event, context, callback)
  const body = JSON.parse(event.body)
  if (!body) return;
  
  const base = 'https://api.instagram.com/oauth/access_token'
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'https://jakestagram.com/login';

  let data = qs.stringify({
    'client_id': clientId,
    'client_secret': clientSecret,
    'grant_type': 'authorization_code',
    'redirect_uri': redirectUri,
    'code': body.code
  })

  console.log(data)
  console.log(clientId, clientSecret, redirectUri, body.code)

  const result = await axios({
    method: 'post',
    url: base,
    data: data
  })

  console.log('result', result)

  // -F client_id={app-id} \
  // -F client_secret={app-secret} \
  // -F grant_type=authorization_code \
  // -F redirect_uri={redirect-uri} \
  // -F code={code}


  return {
    statuscode:200,
    body: JSON.stringify({result, event, context, callback})
  }
}