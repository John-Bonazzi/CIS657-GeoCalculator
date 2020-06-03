import * as firebase from 'firebase';
import 'firebase/database';
import { firebaseConfig } from './fb-credentials';

export function initCalculatorDB() {
  firebase.initializeApp(firebaseConfig);
}

export function storeEntry(item) {
  const date = Date();
  const timestamp = date//.toString()};//Try to pass the date object instead, and extrapolate the toString method later.
  const entry = {...item, timestamp};
  firebase.database().ref('CalculatorHistory/').push(entry);
}

export function setupCalculatorListener(updateFunc) {
  console.log('setupCalculatorListener called');
  firebase
    .database()
    .ref('CalculatorHistory/')
    .on('value', (snapshot) => {
      console.log('setupCalculatorListener fires up with: ', snapshot);
      if (snapshot?.val()) {//FIXME: didn't change, but should work
        const fbObject = snapshot.val();
        const newArr = [];
        Object.keys(fbObject).map((key, index) => {
          console.log(key, '||', index, '||', fbObject[key]);
          newArr.push({ ...fbObject[key], id: key });
        });
        updateFunc(newArr);
      } else {
        updateFunc([]);
      }
    });
} 