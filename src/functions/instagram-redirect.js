// Modules imports
const cookie = require('cookie');
const crypto = require('crypto');
const { AuthorizationCode } = require('simple-oauth2');

// Instagram scopes requested.
const OAUTH_SCOPES = 'user_profile';

// Path to the OAuth handlers.
const OAUTH_CALLBACK_PATH = '/instagram-callback';

// Instagram OAuth 2 setup
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
  
  console.log(event.headers)
  const eventCookies = event.headers.cookie ? cookie.parse(event.headers.cookie) : null
  console.log(eventCookies)
  const state = eventCookies ? eventCookies.state : crypto.randomBytes(20).toString('hex');
  const isLocalhost = event.headers.host.indexOf('localhost') > -1;
  console.log('Setting state cookie for verification:', state);
  console.log('Is localhost?', isLocalhost);
  
  const serializedCookie = cookie.serialize(
    'state',
    state, 
    {
      secure: !isLocalhost,
      httpOnly: true,
      maxAge: 3600000
    }
  )

  const redirectUri = oauth2.authorizeURL({
    redirect_uri: `${event.headers['x-forwarded-proto']}://${event.headers.host}/.netlify/functions${OAUTH_CALLBACK_PATH}`,
    scope: OAUTH_SCOPES,
    state: state
  })

  console.log('Redirecting to:', redirectUri);

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