const axios = require('axios')

exports.handler = async function (event, context, callback) {
  // console.log(event, context, callback)
  const body = JSON.parse(event.body)
  const code = JSON.parse(event.body)?.code
  console.log('body', body, 'code', code)

  
  const base = 'https://api.instagram.com/oauth/access_token'
  const { CLIENT_ID } = process.env;
  const { CLIENT_SECRET } = process.env;
  const redirectUri = 'https://jakestagram.com/login';
  const code = code;

  const result = await axios({
    method: 'post',
    url: base,
    data: {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code: code
    }
  })

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