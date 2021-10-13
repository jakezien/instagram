const axios = require('axios')
const qs = require('qs')
const cookie = ('cookie')


exports.handler = async function (event, context, callback) {
  // console.log(event, context, callback)
  const body = JSON.parse(event.body)
  if (!body) return;
  
  const base = 'https://api.instagram.com/oauth/access_token'
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'https://jakestagram.com/login';

  const shortTokenRequestData = qs.stringify({
    'client_id': clientId,
    'client_secret': clientSecret,
    'grant_type': 'authorization_code',
    'redirect_uri': redirectUri,
    'code': body.code
  })

  const shortTokenResult = await axios({
    method: 'post',
    url: base,
    data: shortTokenRequestData
  })

  console.log('result', shortTokenResult.status, shortTokenResult.data.access_token)

  // if result.status == '200'

  const longTokenRequestParams = {
    'grant_type': 'ig_exchange_token',
    'client_secret': clientSecret,
    'access_token': shortTokenResult.data.access_token
  }

  const longTokenResult = await axios({
    method: 'get',
    url: 'https://graph.instagram.com/access_token',
    params: longTokenRequestParams
  })

  const longToken = longTokenResult.data.access_token
  const expiration = longTokenResult.data.expires_in

  const longCookie = cookie.serialize('jg_ig_cookie', longToken, {
    secure: true,
    httpOnly: true,
    path: '/',
    maxAge: expiration,
  })

  return {
    'statusCode': 200,
    'headers': {
      'Set-Cookie': longCookie,
      'Cache-Control': 'no-cache',
    },
    'body': 'cookie set!'
  }

  return {
    statuscode: result.status,
    body: JSON.stringify(result.data)
  }
}