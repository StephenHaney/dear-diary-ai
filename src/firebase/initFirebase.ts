import firebase from 'firebase/app';
import '@firebase/firestore';

if (!firebase.apps.length) {
  var config = {
    apiKey: process.env.firebase_browser_key,
    authDomain: 'deardiary-aeca1.firebaseapp.com',
    databaseURL: 'https://deardiary-aeca1.firebaseio.com',
    projectId: 'deardiary-aeca1',
    storageBucket: 'deardiary-aeca1.appspot.com',
    messagingSenderId: '614530160945',
    appId: '1:614530160945:web:e89752f6b4158c7a2ef810',
  };
  firebase.initializeApp(config);
}

export const db = firebase.firestore();
