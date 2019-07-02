import firebase from '@/utils/firebase'

const db = firebase.firestore()

export default {
  async getLastCreated() {
    const congregations = []
    await db
      .collection('congregations')
      .orderBy('createdAt', 'desc')
      // .orderBy('name', 'asc')
      .limit(5)
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
  },
  async create(congregation) {
    await db
      .collection('congregations')
      .add(congregation)
      .then(docRef => {
        congregation.id = docRef.id
      })
      .catch(err => {
        throw err
      })

    return congregation
  },
  update(congregation) {
    // getting the document to update by ID
    const congRef = db.collection('congregations').doc(congregation.id)

    return congRef.update(congregation)
  },
  delete(id) {
    return db
      .collection('congregations')
      .doc(id)
      .delete()
  }
}
