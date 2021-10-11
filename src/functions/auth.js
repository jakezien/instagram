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

  const result = await axios({
    method: 'post',
    url: base,
    data: data
  })

  console.log('result', result.status, result.data)

  return {
    statuscode: result.status,
    body: JSON.stringify(result.data)
  }
}