// Import the functions you need from the SDKs you need
import { isNoUnitNumericStyleProp } from "@vue/shared";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import {collection, getFirestore, setDoc, doc} from "firebase/firestore"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEA0ooZgLHnpcneAjoSdXkNTME1r830kA",
  authDomain: "grilleproj.firebaseapp.com",
  projectId: "grilleproj",
  storageBucket: "grilleproj.appspot.com",
  messagingSenderId: "550140431780",
  appId: "1:550140431780:web:85f6ff617b989205330531",
  measurementId: "G-2Y07QJTS52"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

const db = getFirestore(firebaseApp)

/*

  The following lines set a document weekly for the purpose of storing
  finances and orders

  String formatting is necessary to organize by dates

*/


const d = new Date();
const week = new Date();

if( !d.getHours() ){
  d.setMinutes( d.getMinutes() - 60 )
  //Prevents Advancement of month,daynum, and dayof week
} else if (d.getHours() == 21 || d.getHours() == 22 || d.getHours() == 23){
  // Allows proper access to database when clock flips over at midnight
  d.setMinutes(d.getMinutes() - 120);
}

let dayOfWeek = d.getDay();
let month = d.getMonth() + 1;
let dayNum = d.getDate();

//Instead of the functions --> go back to Sunday --> set days - dayNum

week.setDate( week.getDate() - week.getDay() )

let weeklyMonth = week.getMonth() + 1
let weeklyDay = week.getDate()

//Need to give 30 min of space --> change over only after 12:30am --> configure month, dayNum, and dayOfWeek based on the time

const colPrefix = month + "-" + dayNum + "-orders"
const weeklyPrefix = "week-of-" + weeklyMonth + "-" + weeklyDay

const ordersCollection = collection(db,"orders",weeklyPrefix,colPrefix)
const weeklyCollection = collection(db, "finances", weeklyPrefix, "daily-totals")
const functionsString = "/orders" + "/" + weeklyPrefix + "/" + colPrefix
let viewCollection = { view: collection(db, "finances", weeklyPrefix, "daily-totals") }
const operationCollection = collection(db,"finances")

export { auth, ordersCollection, db, weeklyCollection, viewCollection, operationCollection, weeklyPrefix, functionsString }
