import firebase from '@/utils/firebase'

const Auth = firebase.auth()
const db = firebase.firestore()

export default {
  /**
   * Calls the signInWithRedirect() Firebase Auth method to start the OAuth Flow
   * @return "{ user, token }" An object with the user and access token
   */
  async signInWithGoogle() {
    // creating the provider
    const provider = new firebase.auth.GoogleAuthProvider()
    let token = null
    let user = null

    // calling the sign in
    await Auth.signInWithRedirect(provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API
        token = result.credential.accessToken
        //The signed-in user info
        user = result.user
      })
      .catch(err => {
        throw err
      })

    return { user, token }
  },
  /**
   * Calls the Sign Out method of Firebase Authh
   * @return Promise<any> Returns the Promise of signOut Firebase method
   */
  signOut() {
    return Auth.signOut()
  },
  /**
   * If the session exists, returns the current user from Firebase
   * @returns Object  The User object from Firebase
   */
  async getCurrentUser() {
    let user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      return user
    }

    return await Auth.currentUser
  },
  async fetchOrCreateUser(fireUser) {
    // getting the user document by the ID
    const userRef = db.collection('users').doc(fireUser.uid)
    let user = null

    await userRef
      .get()
      .then(readDoc => {
        // if the user is found in the DB
        if (readDoc.exists) {
          user = readDoc.data()
        }
      })
      .catch(err => {
        throw err
      })

    if (!user) {
      // if the user doesn't exists then create it
      user = {
        displayName: fireUser.displayName,
        email: fireUser.email,
        phoneNumber: fireUser.phoneNumber,
        isAdmin: false,
        isContributor: false,
        createdAt: firebase.firestore.Timestamp.fromDate(new Date())
      }

      await userRef.set(user).then(() => {
        console.log(`Document sucessfully witten.`)
      })
    }

    return user
  }
}
