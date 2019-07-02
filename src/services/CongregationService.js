import firebase from '@/utils/firebase'

const db = firebase.firestore()

export default {
  async getLastCreated() {
    const congregations = []
    await db
      .collection('congregations')
      .orderBy('name', 'desc')
      // .orderBy('createdAt', 'desc')
      // .limit(5)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          congregations.push({ ...doc.data(), id: doc.id })
        })
      })
      .catch(err => {
        throw err
      })

    return congregations
  }
}
