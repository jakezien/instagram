import axios from "axios"


exports.handler = async function (event, context, callback) {
  const base = 'https://api.instagram.com/oauth/access_token'
  const clientId = null;
  const clientSecret = null;
  const redirectUri = null;
  const code = null;

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