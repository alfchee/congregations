import firebase from '@/utils/firebase'

const db = firebase.firestore()

export default {
  async getUnapprovedUsers() {
    let users = []

    await db
      .collection('users')
      .where('isContributor', '==', false)
      .get()
      .then(qSnapshot => {
        qSnapshot.forEach(doc => {
          users.push({ ...doc.data(), id: doc.id })
        })
      })
      .catch(err => {
        throw err
      })

    return users
  },
  async getLastApprovedUsers() {
    let users = []

    await db
      .collection('users')
      .where('isContributor', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get()
      .then(qSnapshot => {
        qSnapshot.forEach(doc => {
          users.push({ ...doc.data(), id: doc.id })
        })
      })
      .catch(err => {
        throw err
      })

    return users
  },
  async updateAdmin({ id, isAdmin }) {
    return db
      .collection('users')
      .doc(id)
      .update({ isAdmin: isAdmin })
  },
  async upVoteUser({ id, approvers }) {
    // counting the approvers to know if is approved as a contributor
    const isContributor = approvers.length >= 3 ? true : false

    return db
      .collection('users')
      .doc(id)
      .update({ approvers, isContributor })
  },
  async approveByAdmin({ id, approvers }) {
    return db
      .collection('users')
      .doc(id)
      .update({ approvers, isContributor: true })
  }
}
