const { AuthorizationCode } = require("simple-oauth2");
const cookie = require('cookie');
const OAUTH_CALLBACK_PATH = '/instagram-callback';
const axios = require('axios');

// Firebase Setup
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString())

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

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
  console.log('oauth2', oauth2)

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
  
  const redirectUri = `${event.headers['x-forwarded-proto']}://${event.headers.host}/.netlify/functions${OAUTH_CALLBACK_PATH}`
  console.log('Redirect uri:', redirectUri)
  try {
    const delay = await oauth2.getToken({
      code: authCode,
      redirect_uri: redirectUri,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }).then(async (results) => {
      console.log('Auth code exchange result received:', results)
      const accessToken = results.access_token;
      const instagramUserID = results.user_id;

      const userProfile = axios.get('https://graph.instagram.com/me', {
        fields: ['id', 'username'],
        headers: {
          authorization: accessToken
        }
      });
      console.log('userProfile', userProfile)

      const profilePic = results.user.profile_picture;
      const userName = results.user.full_name;

      createFirebaseAccount(instagramUserID, userName, profilePic, accessToken)
        .then(firebaseToken => {
          // Serve an HTML page that signs the user in and updates the user profile.
          return {
            statusCode: 200,
            body: signInFirebaseTemplate(firebaseToken, userName, profilePic, accessToken)
          }
        });
    })
    
  } catch (error) {
    console.error('getToken error', error)
    return {
      statusCode: 400,
      body: error
    }
  }
  return {
    statusCode: 400,
    body: 'errrorrrr :((('
  }
}

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /instagramAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(instagramID, displayName, photoURL, accessToken) {
  // The UID we'll assign to the user.
  const uid = `instagram:${instagramID}`;

  // Save the access token to the Firebase Realtime Database.
  const databaseTask = admin.database().ref(`/instagramAccessToken/${uid}`)
      .set(accessToken);

  // Create or update the user account.
  const userCreationTask = admin.auth().updateUser(uid, {
    displayName: displayName,
    photoURL: photoURL
  }).catch(error => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        uid: uid,
        displayName: displayName,
        photoURL: photoURL
      });
    }
    throw error;
  });

  // Wait for all async task to complete then generate and return a custom auth token.
  return Promise.all([userCreationTask, databaseTask]).then(() => {
    // Create a Firebase custom auth token.
    const token = admin.auth().createCustomToken(uid);
    console.log('Created Custom token for UID "', uid, '" Token:', token);
    return token;
  });
}

/**
 * Generates the HTML template that signs the user in Firebase using the given token and closes the
 * popup.
 */
function signInFirebaseTemplate(token) {
  return `
    <script src="https://www.gstatic.com/firebasejs/3.6.0/firebase.js"></script>
    <script>
      var token = '${token}';
      var config = {
        apiKey: '${config.firebase.apiKey}'
      };
      var app = firebase.initializeApp(config);
      app.auth().signInWithCustomToken(token).then(function() {
        window.close();
      });
    </script>`;
}