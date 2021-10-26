const { AuthorizationCode } = require("simple-oauth2");
const cookie = require('cookie');
const OAUTH_CALLBACK_PATH = '/instagram-callback';
const axios = require('axios');

// Firebase Setup
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(Buffer.from(process.env.SERVICE_ACCOUNT, 'base64').toString())

// Get a reference to the database service
var database = firebase.database();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  serviceAccount: serviceAccount,
  databaseURL: process.env.RTDB_URL,
  
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

  const eventCookies = event.headers.cookie ? cookie.parse(event.headers.cookie) : null


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
  
  
  const getUserProfile = async (token) => {
    console.log('getUserProfile with token:', token)

    console.log('getting userProfile…')
    const userProfile = await axios.get('https://graph.instagram.com/me', {      
      params: {
        fields: "id,username",
        access_token: token
      },
      headers: {
        authorization: token,
      }
    });
    // console.log('got userProfile:', userProfile)
    return userProfile
  }

  try {

    const tokenResult = await oauth2.getToken({
      code: authCode,
      redirect_uri: redirectUri,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    })

    if (!tokenResult) {
      console.error('no result from getToken. tokenResult:', tokenResult)
      return {
        statusCode: 400,
        body: `no token :(\n${tokenResult}`
      }
    }
      
    const token = tokenResult.token.access_token
    const userProfile = await getUserProfile(token)
    
    // const profilePic = results.user.profile_picture;
    const userName = userProfile.data.username
    const userId = userProfile.data.id

    const firebaseToken = await createFirebaseToken(userId)
    console.log('firebase token:', firebaseToken)

    // const firebaseToken = await createFirebaseAccount(userId, userName, token)
    // // Serve an HTML page that signs the user in and updates the user profile.
    // console.log('firebaseToken', firebaseToken)
    // return {
    //   statusCode: 200,
    //   body: signInFirebaseTemplate(firebaseToken, userName, token)
    // }
      

    // })
    
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

function createFirebaseToken(instagramID) {
  // The uid we'll assign to the user.
  const uid = `instagram:${instagramID}`;

  // Create the custom token.
  return firebase.auth().createCustomToken(uid);
}

/**
 * Creates a Firebase account with the given user profile and returns a custom auth token allowing
 * signing-in this account.
 * Also saves the accessToken to the datastore at /instagramAccessToken/$uid
 *
 * @returns {Promise<string>} The Firebase custom auth token in a promise.
 */
function createFirebaseAccount(instagramID, displayName, accessToken) {
  // The UID we'll assign to the user.
  const uid = `instagram:${instagramID}`;
  console.log('uid', uid)
  
  // console.log('admin.database()', admin.database().ref(`/instagramAccessToken/${uid}`))
  // Save the access token to the Firebase Realtime Database.
  const databaseTask = admin.database().ref(`/instagramAccessToken/${uid}`)
    .set(accessToken);
  console.log('databaseTask', databaseTask)

  // Create or update the user account.
  const userCreationTask = admin.auth().updateUser(uid, {
    displayName: displayName
  }).catch(error => {
    // If user does not exists we create it.
    if (error.code === 'auth/user-not-found') {
      return admin.auth().createUser({
        uid: uid,
        displayName: displayName
      });
    }
    throw error;
  });
  console.log('userCreationTask', userCreationTask)

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