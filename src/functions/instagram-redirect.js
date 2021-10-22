// Modules imports
const cookie = require('cookie');
const crypto = require('crypto');
const { ClientCredentials, ResourceOwnerPassword, AuthorizationCode } = require('simple-oauth2');


// Instagram scopes requested.
const OAUTH_SCOPES = 'basic';

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
  const state = event.headers.cookies.state || crypto.randomBytes(20).toString('hex');
  console.log('Setting state cookie for verification:', state);
  const secureCookie = event.path.indexOf('localhost:') !== 0;
  console.log('Need a secure cookie (i.e. not on localhost)?', secureCookie);
  
  const serializedCookie = cookie.serialize(
    'state',
    state,
    {
      secure: secureCookie,
      httpOnly: true,
      maxAge: 3600000
    }
  )
  
  const redirectUri = AuthorizationCode.authorizeURL({
    redirect_uri: `https://jakestagram.com/${OAUTH_CALLBACK_PATH}`,
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
  
  // app.get(OAUTH_REDIRECT_PATH, (req, res) => {
  //   const state = req.cookies.state || crypto.randomBytes(20).toString('hex');
  //   console.log('Setting state cookie for verification:', state);
  //   const secureCookie = req.get('host').indexOf('localhost:') !== 0;
  //   console.log('Need a secure cookie (i.e. not on localhost)?', secureCookie);
  //   res.cookie('state', state, { maxAge: 3600000, secure: secureCookie, httpOnly: true });
  //   const redirectUri = oauth2.authorizationCode.authorizeURL({
  //     redirect_uri: `${req.protocol}://${req.get('host')}${OAUTH_CALLBACK_PATH}`,
  //     scope: OAUTH_SCOPES,
  //     state: state
  //   });
  //   console.log('Redirecting to:', redirectUri);
  //   res.redirect(redirectUri);
  // });
}