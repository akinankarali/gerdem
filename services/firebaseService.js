import { db, storage } from '../firebase';
import { collection, getDocs, doc, deleteDoc, updateDoc, setDoc,  arrayUnion, addDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export async function fetchAboutData() {
  const querySnapshot = await getDocs(collection(db, 'about'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchBlogs() {
  try {
    const querySnapshot = await getDocs(collection(db, 'blogs'));
    const blogs = querySnapshot.docs.map(doc => {
      const data = doc.data();
      if (data.items) {
        data.items = data.items.map(item => ({
          ...item,
          coverImage: item.image || item.coverImage || '',
          content: Array.isArray(item.content) ? item.content : [{ type: 'text', content: item.content || '' }]
        }));
      }
      return { id: doc.id, ...data };
    });
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
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


export async function addData(collectionName, data) {
  try {
    await addDoc(collection(db, collectionName), data);
    console.log(`${collectionName} collection added successfully.`);
  } catch (error) {
    console.error(`Error adding data: ${error}`);
  }
}

export async function updateData(collectionName, docId, updatedData) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updatedData);
    console.log(`${collectionName} document in collection successfully updated.`);
  } catch (error) {
    console.error(`Error updating data: ${error}`);
  }
}

export async function deleteData(collectionName, docId) {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    console.log(`${collectionName} document in collection successfully deleted.`);
  } catch (error) {
    console.error(`Error deleting data: ${error}`);
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

export async function updateHomepageData(data, collectionName, docId) {
  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, data, { merge: true });
    console.log("Home page data successfully updated.");
  } catch (error) {
    console.error("Error updating home page data:", error);
    throw error;
  }
}

export async function addBlogPost(blogData) {
  try {
    const docRef = doc(db, 'blogs', 'blogPosts');
    await setDoc(docRef, {
      items: arrayUnion({
        id: Date.now().toString(),
        ...blogData
      })
    }, { merge: true });
    console.log("Blog post added successfully");
    return { id: Date.now().toString(), ...blogData };
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw error;
  }
}

export async function deleteBlogPost(postId) {
  try {
    const docRef = doc(db, 'blogs', 'blogPosts');
    const snapshot = await getDocs(collection(db, 'blogs'));
    const blogPosts = snapshot.docs[0].data().items;
    const updatedPosts = blogPosts.filter(post => post.id !== postId);
    await setDoc(docRef, { items: updatedPosts });
    console.log("Blog post deleted successfully");
  } catch (error) {
    console.error("Error deleting blog post:", error);
    throw error;
  }
}


export async function uploadImage(file, folder) {
  try {
    const storageRef = ref(storage, `blog-images/${folder}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function addTravelRoute(routeData) {
  try {
    const docRef = doc(db, 'routes', 'routesList');
    await setDoc(docRef, {
      item: arrayUnion({
        id: Date.now().toString(),
        ...routeData
      })
    }, { merge: true });
    console.log("Travel route added successfully");
    return { id: Date.now().toString(), ...routeData };
  } catch (error) {
    console.error("Error adding travel route:", error);
    throw error;
  }
}

export async function deleteTravelRoute(routeId) {
  try {
    const docRef = doc(db, 'routes', 'routesList');
    const snapshot = await getDocs(collection(db, 'routes'));
    const routes = snapshot.docs[0].data().item;
    const updatedRoutes = routes.filter(route => route.id !== routeId);
    await setDoc(docRef, { item: updatedRoutes });
    console.log("Travel route deleted successfully");
  } catch (error) {
    console.error("Error deleting travel route:", error);
    throw error;
  }
}


export async function uploadTravelImage(file) {
  try {
    const storageRef = ref(storage, `travel-images/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading travel image:", error);
    throw error;
  }
}

export async function updateAboutPage(data) {
  try {
    const docRef = doc(db, 'about', 'iqtxE6vcFcjF8xoq7yJx');
    await setDoc(docRef, data, { merge: true });
    console.log("About page updated successfully");
  } catch (error) {
    console.error("Error updating about page:", error);
    throw error;
  }
}

export async function uploadAboutImage(file) {
  try {
    const storageRef = ref(storage, `about/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update the about document with the new image URL
    await updateAboutPage({ image: downloadURL });
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading about image:", error);
    throw error;
  }
}

export async function addComment(commentData) {
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      ...commentData,
      isApproved: false,
      date: new Date().toLocaleString('tr-TR')
    });
    console.log("Comment added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

export async function fetchCommentsByBlogId(blogId) {
  try {
    const querySnapshot = await getDocs(collection(db, 'comments'));
    return querySnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(comment => blogId === null || comment.blogId === blogId);
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
}

export async function updateCommentApproval(commentId, isApproved) {
  try {
    const commentRef = doc(db, 'comments', commentId);
    await updateDoc(commentRef, {
      isApproved
    });
    console.log("Comment approval updated successfully");
  } catch (error) {
    console.error("Error updating comment approval:", error);
    throw error;
  }
}

export async function deleteComment(commentId) {
  try {
    await deleteDoc(doc(db, 'comments', commentId));
    console.log("Comment deleted successfully");
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
}

export async function addContactMessage(messageData) {
  try {
    const docRef = await addDoc(collection(db, 'contactMessages'), {
      ...messageData,
      createdAt: new Date().toISOString()
    });
    console.log("Message added with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding message: ", error);
    throw error;
  }
}

export async function getContactMessages() {
  try {
    const querySnapshot = await getDocs(collection(db, 'contactMessages'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching contact messages: ", error);
    throw error;
  }
}

export async function fetchPaintings() {
  const querySnapshot = await getDocs(collection(db, 'paintings'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function addPainting(paintingData) {
  try {
    const docRef = await addDoc(collection(db, 'paintings'), paintingData);
    console.log("Painting added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding painting:", error);
    throw error;
  }
}

export async function updatePainting(paintingId, updatedData) {
  try {
    const paintingRef = doc(db, 'paintings', paintingId);
    await setDoc(paintingRef, updatedData, { merge: true });
    console.log("Painting updated successfully");
  } catch (error) {
    console.error("Error updating painting:", error);
    throw error;
  }
}

export async function deletePainting(paintingId) {
  try {
    await deleteDoc(doc(db, 'paintings', paintingId));
    console.log("Painting deleted successfully");
  } catch (error) {
    console.error("Error deleting painting:", error);
    throw error;
  }
}

export async function uploadPaintingImage(file) {
  try {
    const storageRef = ref(storage, `paintings/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading painting image:", error);
    throw error;
  }
}


export async function updateBlogPost(postId, updatedData) {
  try {
    const docRef = doc(db, 'blogs', 'blogPosts');
    const snapshot = await getDoc(docRef);
    const blogPosts = snapshot.data().items;
    const updatedPosts = blogPosts.map(post => 
      post.id === postId ? { ...post, ...updatedData } : post
    );
    await setDoc(docRef, { items: updatedPosts });
    console.log("Blog post updated successfully");
  } catch (error) {
    console.error("Error updating blog post:", error);
    throw error;
  }
}