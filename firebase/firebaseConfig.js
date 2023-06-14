import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
    getFirestore,
    collection,
    addDoc,
    ref,
    push,
    onValue,
} from 'firebase/firestore'
// Firebase config
const firebaseConfig = {
    apiKey: 'AIzaSyDM-hhVzozic_1yqvNXSBYIzFUG985EAS4',
    authDomain: 'chat-app-386716.firebaseapp.com',
    projectId: 'chat-app-386716',
    storageBucket: 'chat-app-386716.appspot.com',
    messagingSenderId: '10647217093',
    appId: '1:10647217093:web:5ea5a0eb081008669b21ac',
    measurementId: 'G-37WZFX2MJ5',
}
// initialize firebase

const app = initializeApp(firebaseConfig)
export const auth1 = getAuth()
const database = getFirestore(app)

export { database, getFirestore, collection, addDoc, ref, push, onValue }
