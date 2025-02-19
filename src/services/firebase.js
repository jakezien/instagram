import { firebase, FieldValue } from "../lib/firebase";
import { JAKE_USERID } from "../constants/jake"
import { toast } from "react-toastify";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  return result.docs.length > 0;
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

// get user from the firestore where userId === userId (passed from the auth)
export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

// check all conditions before limit results
export async function getSuggestedProfiles(userId, following) {
  let query = firebase.firestore().collection("users");

  if (following.length > 0) {
    query = query.where("userId", "not-in", [...following, userId]);
  } else {
    query = query.where("userId", "!=", userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));

  return profiles;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, // currently logged in user document id (karl's profile)
  profileId, // the user that karl requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}

export async function updateFollowedUserFollowers(
  profileDocId, // currently logged in user document id (karl's profile)
  loggedInUserDocId, // the user that karl requests to follow
  isFollowingProfile // true/false (am i currently following this person?)
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getJakePhotos(userId) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", JAKE_USERID)
    .get();

  const jakePhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    jakePhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (userId && photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }

      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getPhotos(userId, following) {
  // [5,4,2] => following
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("jgPhotos")
    .where("userId", "==", userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));
  return photos;
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername) // karl (active logged in user)
    .where("following", "array-contains", profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: karl's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );

  // 1st param: karl's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}

export async function updateUsername(uid, username) {
  const user = await getUserByUserId(uid);
  if (user.length) {
    console.log(username, user)
    return firebase
      .firestore()
      .collection("users")
      .doc(user[0].docId)
      .update({
        username: username
      }).then(() => {
        toast(<p>Your username was set to <strong>{username}</strong>.</p>)
      });
  }
}

export async function deletePhoto(photoId) {
  return firebase
    .firestore()
    .collection("photos")
    .doc(photoId)
    .delete();
}

export async function createOrUpdateUser(uid, email) {
  
  const user = await getUserByUserId(uid);
  console.log(user)
  if (user.length) {
    console.log('updating user', uid)
    return firebase.firestore().collection('users').doc(user[0].docId).update({
      emailAddress: email,
      updatedAt: new Date().toISOString()
    });
  } else {
    console.log('creating user', uid)
    const doc = await firebase.firestore().collection('users').add({
      userId: uid,
      emailAddress: email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    if (doc) {
      doc.update({
        docId: doc.id
      }).then(console.log('updated with docId', doc.id))
    }
  }
}

