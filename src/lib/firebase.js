/**
 * Created by axetroy on 17-5-20.
 * help information: https://firebase.google.com/docs/web/setup
 */
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import CONFIG from '../config.json'

const FIREBASE_CONFIG = CONFIG.firebase

firebase.initializeApp(FIREBASE_CONFIG.config)

export default firebase

export function init() {}
