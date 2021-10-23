const { AuthorizationCode } = require("simple-oauth2");
const cookie = require('cookie');

const credentials = {
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://api.instagram.com',
    tokenPath: '/oauth/access_token'
  }
};

exports.handler = async function (event, context, callback) {

  const oauth2 = new AuthorizationCode(credentials);

  const eventCookies = event.headers.cookie ? cookie.parse(event.headers.cookie) : null
  console.log('eventCookies', eventCookies)


  const cookieState = eventCookies ? eventCookies.state : null
  const queryState = event.queryStringParameters.state
  const authCode = event.queryStringParameters.code
  console.log('Received state cookie:', cookieState);
  console.log('Received state query parameter:', queryState);

  if (!cookieState) {
    return {
      statusCode: 400,
      body: 'State cookie not set or expired. Maybe you took too long to authorize. Please try again.'
    }
  } else if (cookieState !== queryState) {
    return {
      statusCode: 400,
      body: 'State validation failed.'
    }
  }
  console.log('Received auth code:', authCode)
  oauth2.getToken({
    code: authCode,
    redirectUri: `https://localhost:8888/`
  })

  return {
    'statusCode': 302,
    'headers': {
      'Set-Cookie': serializedCookie,
      'Cache-Control': 'no-cache',
      'Location': redirectUri
    },
    'body': 'redirect'
  }



}