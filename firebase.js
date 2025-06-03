

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAQDF5RRmqx3hN8v1D91KpOxM12DtQnzyk",
//   authDomain: "ubuntuplug.firebaseapp.com",
//   databaseURL: "https://ubuntuplug-default-rtdb.firebaseio.com",
//   projectId: "ubuntuplug",
//   storageBucket: "ubuntuplug.firebasestorage.app",
//   messagingSenderId: "887406432080",
//   appId: "1:887406432080:web:108e0de9c61d13f418a655",
//   measurementId: "G-2J53SZ2K0N"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// export { db, app };




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc, addDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit, onSnapshot, serverTimestamp, increment, getDocs, collectionGroup } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQDF5RRmqx3hN8v1D91KpOxM12DtQnzyk",
  authDomain: "ubuntuplug.firebaseapp.com",
  databaseURL: "https://ubuntuplug-default-rtdb.firebaseio.com",
  projectId: "ubuntuplug",
  storageBucket: "ubuntuplug.firebasestorage.app",
  messagingSenderId: "887406432080",
  appId: "1:887406432080:web:108e0de9c61d13f418a655",
  measurementId: "G-2J53SZ2K0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the main database instance that other files need
export { db, storage };

// Chat functionality (only initialize if needed)
if (typeof window !== 'undefined' && window.location.pathname.includes('chat')) {
  // Global variables for chat
  let currentUser = prompt("Enter your username:") || "Anonymous";
  let currentForum = "general"; // Default forum
  let currentPostType = "message";

  // Create or get forum document
  const initializeForum = async (forumName) => {
      try {
          const forumRef = doc(db, 'forums', forumName);
          const forumDoc = await getDoc(forumRef);
          
          if (!forumDoc.exists()) {
              await setDoc(forumRef, {
                  name: forumName,
                  description: `${forumName} discussion forum`,
                  createdAt: serverTimestamp(),
                  messageCount: 0,
                  isActive: true
              });
          }
      } catch (error) {
          console.error("Error initializing forum:", error);
      }
  };

  // Send message to forum subcollection
  const sendMessageToForum = async (forumId = currentForum) => {
      const input = document.getElementById('message-input');
      const text = input.value.trim();
      
      if (!text) return;

      try {
          // Reference to the messages subcollection within the forum
          const forumMessagesRef = collection(db, 'forums', forumId, 'messages');
          
          const messageData = {
              username: currentUser,
              text: text,
              timestamp: serverTimestamp(),
              type: currentPostType,
              likes: 0
          };

          // Add job-specific fields if it's a job post
          if (currentPostType === 'job') {
              const jobData = parseJobFromText(text);
              Object.assign(messageData, jobData);
          }

          // Add link-specific fields if it's a link post
          if (currentPostType === 'link') {
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              const urls = text.match(urlRegex);
              if (urls && urls.length > 0) {
                  messageData.linkUrl = urls[0];
              }
          }

          const docRef = await addDoc(forumMessagesRef, messageData);
          
          // Update forum message count
          const forumRef = doc(db, 'forums', forumId);
          await updateDoc(forumRef, {
              messageCount: increment(1),
              lastActivity: serverTimestamp()
          });

          input.value = '';
          showNotification('Message sent successfully!');
          
          return docRef.id;
      } catch (error) {
          console.error("Error sending message:", error);
          showNotification('Error sending message', 'error');
      }
  };

  // Load messages from forum subcollection
  const loadForumMessages = (forumId = currentForum) => {
      const messagesRef = collection(db, 'forums', forumId, 'messages');
      const q = query(messagesRef, orderBy("timestamp", "asc"));
      
      return onSnapshot(q, async (querySnapshot) => {
          const messagesContainer = document.getElementById("chat-messages");
          if (!messagesContainer) return;
          
          messagesContainer.innerHTML = '';
          
          for (const docSnapshot of querySnapshot.docs) {
              const message = docSnapshot.data();
              message.id = docSnapshot.id;
              
              // Load replies for each message
              const replies = await loadMessageReplies(forumId, message.id);
              message.replies = replies;
              
              displayMessage(message, forumId);
          }
          
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
      });
  };

  // Load replies from message subcollection
  const loadMessageReplies = async (forumId, messageId) => {
      try {
          const repliesRef = collection(db, 'forums', forumId, 'messages', messageId, 'replies');
          const q = query(repliesRef, orderBy('timestamp', 'asc'));
          
          const querySnapshot = await getDocs(q);
          const replies = [];
          
          querySnapshot.forEach((doc) => {
              replies.push({
                  id: doc.id,
                  ...doc.data()
              });
          });
          
          return replies;
      } catch (error) {
          console.error("Error loading replies:", error);
          return [];
      }
  };

  // Add reply to message subcollection
  const addReplyToMessage = async (forumId, messageId, replyText) => {
      try {
          const repliesRef = collection(db, 'forums', forumId, 'messages', messageId, 'replies');
          
          await addDoc(repliesRef, {
              username: currentUser,
              text: replyText,
              timestamp: serverTimestamp()
          });
          
          // Update message reply count in parent document
          const messageRef = doc(db, 'forums', forumId, 'messages', messageId);
          await updateDoc(messageRef, {
              replyCount: increment(1)
          });
          
          showNotification('Reply added successfully!');
      } catch (error) {
          console.error("Error adding reply:", error);
          showNotification('Error adding reply', 'error');
      }
  };

  // User management with subcollections
  const createUserProfile = async (userId, userData) => {
      try {
          const userRef = doc(db, 'users', userId);
          await setDoc(userRef, {
              username: userData.username,
              email: userData.email,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              isActive: true
          });
          
          // Initialize user subcollections with empty documents (optional)
          const userJobsRef = collection(db, 'users', userId, 'jobs');
          const userFilesRef = collection(db, 'users', userId, 'files');
          const userNotificationsRef = collection(db, 'users', userId, 'notifications');
          
          // Add welcome notification
          await addDoc(userNotificationsRef, {
              message: "Welcome to UbuntuPlug!",
              type: "welcome",
              read: false,
              createdAt: serverTimestamp()
          });
          
      } catch (error) {
          console.error("Error creating user profile:", error);
      }
  };

  // Add job to user's jobs subcollection
  const addJobToUserProfile = async (userId, jobData) => {
      try {
          const userJobsRef = collection(db, 'users', userId, 'jobs');
          
          await addDoc(userJobsRef, {
              title: jobData.title,
              company: jobData.company,
              description: jobData.description,
              salary: jobData.salary,
              location: jobData.location,
              postedAt: serverTimestamp(),
              isActive: true,
              applications: []
          });
          
          showNotification('Job added to your profile!');
      } catch (error) {
          console.error("Error adding job to profile:", error);
      }
  };

  // Get user's posted jobs
  const getUserJobs = async (userId) => {
      try {
          const userJobsRef = collection(db, 'users', userId, 'jobs');
          const q = query(userJobsRef, where('isActive', '==', true), orderBy('postedAt', 'desc'));
          
          const querySnapshot = await getDocs(q);
          const jobs = [];
          
          querySnapshot.forEach((doc) => {
              jobs.push({
                  id: doc.id,
                  ...doc.data()
              });
          });
          
          return jobs;
      } catch (error) {
          console.error("Error getting user jobs:", error);
          return [];
      }
  };

  // Upload file to user's files subcollection
  const uploadFileToUserProfile = async (userId, file, description) => {
      try {
          // Upload to storage first
          const storageRef = ref(storage, `users/${userId}/files/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          // Add to user's files subcollection
          const userFilesRef = collection(db, 'users', userId, 'files');
          await addDoc(userFilesRef, {
              name: file.name,
              url: downloadURL,
              type: file.type,
              size: file.size,
              description: description,
              uploadedAt: serverTimestamp()
          });
          
          // Also post to current forum
          const forumMessagesRef = collection(db, 'forums', currentForum, 'messages');
          await addDoc(forumMessagesRef, {
              username: currentUser,
              timestamp: serverTimestamp(),
              type: 'file',
              fileName: file.name,
              fileUrl: downloadURL,
              fileType: file.type,
              description: description,
              likes: 0
          });
          
          showNotification('File uploaded and shared!');
      } catch (error) {
          console.error("Error uploading file:", error);
          showNotification('Error uploading file', 'error');
      }
  };

  // Get all messages across all forums (Collection Group Query)
  const getAllRecentMessages = async (limit = 20) => {
      try {
          const allMessagesQuery = query(
              collectionGroup(db, 'messages'),
              orderBy('timestamp', 'desc'),
              limit(limit)
          );
          
          const querySnapshot = await getDocs(allMessagesQuery);
          const allMessages = [];
          
          querySnapshot.forEach((doc) => {
              const message = doc.data();
              message.id = doc.id;
              message.forumId = doc.ref.parent.parent.id; // Get parent forum ID
              allMessages.push(message);
          });
          
          return allMessages;
      } catch (error) {
          console.error("Error getting all messages:", error);
          return [];
      }
  };

  // Search across all user jobs (Collection Group Query)
  const searchAllJobs = async (searchTerm) => {
      try {
          const allJobsQuery = query(
              collectionGroup(db, 'jobs'),
              where('isActive', '==', true),
              orderBy('postedAt', 'desc')
          );
          
          const querySnapshot = await getDocs(allJobsQuery);
          const matchingJobs = [];
          
          querySnapshot.forEach((doc) => {
              const job = doc.data();
              const searchString = `${job.title} ${job.company} ${job.description}`.toLowerCase();
              
              if (searchString.includes(searchTerm.toLowerCase())) {
                  matchingJobs.push({
                      id: doc.id,
                      userId: doc.ref.parent.parent.id, // Get user who posted
                      ...job
                  });
              }
          });
          
          return matchingJobs;
      } catch (error) {
          console.error("Error searching jobs:", error);
          return [];
      }
  };

  // Modified event handlers for subcollections
  window.sendMessage = () => sendMessageToForum(currentForum);

  window.replyToMessage = (messageId) => {
      const replyText = prompt("Enter your reply:");
      if (replyText) {
          addReplyToMessage(currentForum, messageId, replyText);
      }
  };

  window.likeMessage = async (messageId) => {
      try {
          const messageRef = doc(db, 'forums', currentForum, 'messages', messageId);
          await updateDoc(messageRef, {
              likes: increment(1)
          });
      } catch (error) {
          console.error("Error liking message:", error);
      }
  };

  // Switch between forums
  const switchForum = async (forumId) => {
      currentForum = forumId;
      await initializeForum(forumId);
      loadForumMessages(forumId);
      
      // Update UI to show current forum
      const headerEl = document.querySelector('.chat-header h2');
      if (headerEl) {
          headerEl.textContent = `🌐 ${forumId} Forum`;
      }
  };

  // Helper functions for chat
  const showNotification = (message, type = 'success') => {
      console.log(`${type.toUpperCase()}: ${message}`);
      // Add actual notification UI here
  };

  const displayMessage = (message, forumId) => {
      // Add actual message display logic here
      console.log('Displaying message:', message);
  };

  const loadOnlineUsers = () => {
      // Add online users logic here
      console.log('Loading online users...');
  };

  const setupEventListeners = () => {
      // Add event listeners setup here
      console.log('Setting up event listeners...');
  };

  // Initialize the chat app
  const initApp = async () => {
      await initializeForum(currentForum);
      loadForumMessages(currentForum);
      loadOnlineUsers();
      setupEventListeners();
      
      // Create user profile if it doesn't exist
      const userId = btoa(currentUser); // Simple user ID generation
      await createUserProfile(userId, {
          username: currentUser,
          email: `${currentUser}@example.com`
      });
  };

  // Helper function to parse job data from text
  const parseJobFromText = (text) => {
      // Simple job parsing - in real app, you'd use the job form
      return {
          jobTitle: "Job Opportunity",
          company: "Company Name",
          description: text,
          salary: "Competitive",
          location: "Remote"
      };
  };

  // Initialize the chat app only if we're on a chat page
  initApp();
}