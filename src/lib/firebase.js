/**
 * Created by axetroy on 17-5-20.
 * help information: https://firebase.google.com/docs/web/setup
 */
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import CONFIG from '../config.json'

const FIREBASE_CONFIG = CONFIG.firebase

const user = FIREBASE_CONFIG.account

const app = firebase.initializeApp(FIREBASE_CONFIG.config)

function main() {
  return app
}

export function init() {
  return firebase.auth().signInWithEmailAndPassword(user.email, user.password)
}

export default main()
