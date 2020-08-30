import firebase from 'firebase/app';

function getServerTimestamp() {
  // Store the server time in MS number format:
  if (firebase.firestore) {
    return firebase.firestore.Timestamp.now().toMillis();
  }

  // This is really just used to let CI tests pass where firebase doesn't exist
  return Date.now();
}

export default getServerTimestamp;
