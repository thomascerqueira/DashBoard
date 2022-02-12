import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { getAuth }from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTHDOMAIN,
    databaseURL: process.env.REACT_APP_DATABASEURL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGEBUCKET,
    messagingSenderId: process.env.REACT_APP_MESSASGINGSENDERID,
    appId: process.env.REACT_APP_APPID,
    measurementId: process.env.REACT_APP_MEASUREMENTID
};

const fireapp = initializeApp(firebaseConfig);
const db = getDatabase(fireapp);
var firebaseauth = getAuth(fireapp);


export { firebaseConfig, fireapp, db, firebaseauth };