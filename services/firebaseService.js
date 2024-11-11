import { db } from '../firebase'; // Firebase config dosyanız
import { collection, getDocs } from "firebase/firestore";


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