import { db } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, ref, uploadBytes, getDownloadURL, getStore } from "firebase/firestore";

export async function fetchAboutData() {
  const querySnapshot = await getDocs(collection(db, 'about'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchPaintings() {
  const querySnapshot = await getDocs(collection(db, 'paintings'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchBlogs() {
  const querySnapshot = await getDocs(collection(db, 'blogs'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchHomeData() {
  const querySnapshot = await getDocs(collection(db, 'home'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchTravelRoutes() {
  const querySnapshot = await getDocs(collection(db, 'routes'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchComments() {
  const querySnapshot = await getDocs(collection(db, 'comments'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}


// Veri ekleme
export async function addData(collectionName, data) {
  try {
    await addDoc(collection(db, collectionName), data);
    console.log(`${collectionName} koleksiyonuna başarıyla eklendi.`);
  } catch (error) {
    console.error(`Veri eklenirken hata oluştu: ${error}`);
  }
}

// Veri güncelleme
export async function updateData(collectionName, docId, updatedData) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log(`${collectionName} koleksiyonundaki belge başarıyla güncellendi.`);
  } catch (error) {
    console.error(`Veri güncellenirken hata oluştu: ${error}`);
  }
}

// Veri silme
export async function deleteData(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log(`${collectionName} koleksiyonundaki belge başarıyla silindi.`);
  } catch (error) {
    console.error(`Veri silinirken hata oluştu: ${error}`);
  }
}


export async function uploadImageAndSaveUrl(file, collectionName, docId) {
  try {
    const storageRef = ref(storage, `images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);

    const downloadURL = await getDownloadURL(snapshot.ref);

    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { imageUrl: downloadURL }, { merge: true });

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}