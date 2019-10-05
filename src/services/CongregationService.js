import firebase from '@/utils/firebase'
import { Geokit } from 'geokit'
import {
  // GeoCollectionReference,
  GeoFirestore
  // GeoQuery,
  // GeoQuerySnapshot
} from 'geofirestore'

const db = firebase.firestore()

// Create a GeoFirestore reference
const geofirestore = new GeoFirestore(db)
const congregationsRef = db.collection('congregations')
const geoCollectionRef = geofirestore.collection('geocollection')

/**
 *
 * @param {*} hash geohash that will be used as ID
 * @param {*} congregation Congregation object stored in database
 */
const storeGeoData = async (hash, congregation) => {
  // creating the data that will be stored in the geocollection
  const data = {
    congregation: congregation.id,
    coordinates: new firebase.firestore.GeoPoint(
      congregation.coordinates.lat,
      congregation.coordinates.lng
    )
  }
  // storing the geo information
  return geoCollectionRef
    .doc(hash)
    .set(data)
    .then(
      () => {
        console.log('Geo document added in Firestore')
      },
      error => {
        throw error
      }
    )
}

export default {
  /**
   * Gets the last Congregations documents created
   */
  async getLastCreated() {
    const congregations = []
    await congregationsRef
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
  async getCongregationById(id) {
    const doc = await congregationsRef
      .doc(id)
      .get()
      .catch(err => {
        throw err
      })

    return { ...doc.data(), id: doc.id }
  },
  async getCongregationsNear(coordinates) {
    const congregations = []
    // create a geo query and wait for the query snapshot
    const geoQuerySnapshot = await geoCollectionRef
      .near({
        center: new firebase.firestore.GeoPoint(
          coordinates.lat,
          coordinates.lng
        ),
        radius: 100
      })
      .get()

    // loop the result and get the documents
    for (let i = 0; i < geoQuerySnapshot.docs.length; i++) {
      let geoDoc = geoQuerySnapshot.docs[i]

      // query the congregation collection to get the documents
      await congregationsRef
        .doc(geoDoc.data().congregation)
        .get()
        .then(cong => {
          congregations.push({
            ...cong.data(),
            id: cong.id,
            distance: geoDoc.distance
          })
        })
        .catch(err => {
          throw err
        })
    }

    return congregations
  },
  /**
   * Creates a congregation document in database, and also creates the geo information
   * @param {*} congregation Congregation object to be stored in database
   */
  async create(congregation) {
    const hash = Geokit.hash(congregation.coordinates)
    congregation.geohash = hash

    await congregationsRef
      .add(congregation)
      .then(async docRef => {
        // adding the ID of the document to be referenced in the app state
        congregation.id = docRef.id

        await storeGeoData(hash, congregation)
      })
      .catch(err => {
        throw err
      })

    return congregation
  },
  /**
   * Updates a Congregation document on database and if needed updates the geo information
   * @param {*} congregation Congregation Object to be updated in database
   */
  async update(congregation) {
    const hash = Geokit.hash(congregation.coordinates)
    // getting the document to update by ID
    const congRef = congregationsRef.doc(congregation.id)

    // if the geo hash has changed we need to update the geo information
    if (congregation.geohash !== hash) {
      // destroying the last document and wait for it
      await geoCollectionRef.doc(congregation.geohash).delete()
      // creating the new geo document and wait
      await storeGeoData(hash, congregation)
      // changing the reference in the congregation object
      congregation.geohash = hash
    }

    // updating the congregation document
    return congRef.update(congregation)
  },
  /**
   * Deletes a Congregation document from database with the related geo information
   * @param {*} id ID of the Congregation to delete
   */
  delete(id) {
    return congregationsRef
      .doc(id)
      .delete()
      .then(async () => {
        await db
          .collection('geocollection')
          .where('d.congregation', '==', id)
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              geoCollectionRef
                .doc(doc.id)
                .delete()
                .then(() => {
                  console.log('Geo document removed')
                })
                .catch(err => {
                  throw err
                })
            })
          })
      })
  }
}
