// // Initialize Firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyAQDF5RRmqx3hN8v1D91KpOxM12DtQnzyk",
//     authDomain: "ubuntuplug.firebaseapp.com",
//     databaseURL: "https://ubuntuplug-default-rtdb.firebaseio.com",
//     projectId: "ubuntuplug",
//     storageBucket: "ubuntuplug.firebasestorage.app",
//     messagingSenderId: "887406432080",
//     appId: "1:887406432080:web:108e0de9c61d13f418a655",
//     measurementId: "G-2J53SZ2K0N"
// };

// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const firestore = firebase.firestore();

// // Check authentication state
// auth.onAuthStateChanged(handleAuthStateChange);

// function handleAuthStateChange(user) {
//     if (!user) {
//         // Not logged in, redirect to login page
//         window.location.href = 'login.html';
//         return;
//     }
    
//     // Verify admin status
//     verifyAdminStatus(user);
// }

// function verifyAdminStatus(user) {
//     const uid = user.uid;
//     firestore.collection('admin').doc(uid).get()
//         .then((doc) => {
//             if (!doc.exists || doc.data().role !== 'admin') {
//                 showStatus('Access denied. Admin privileges required.', 'error');
//                 setTimeout(() => {
//                     auth.signOut();
//                     window.location.href = 'login.html';
//                 }, 2000);
//                 return;
//             }
            
//             // Admin verified, update UI
//             document.getElementById('userInfo').innerHTML = `
//                 <p>Welcome, Admin ${user.email || user.displayName || 'User'}</p>
//             `;
            
//             // Enable dashboard functionality
//             document.getElementById('downloadBtn').disabled = false;
            
//             // Get mentor applications
//             getMentorApplications();
//         })
//         .catch(error => {
//             showStatus('Error verifying admin status. Please try again.', 'error');
//             console.error('Admin verification error:', error);
//         });
// }

// function getMentorApplications() {
//     // Get all mentor applications
//     firestore.collection("mentorApplications")
//         .get()
//         .then((querySnapshot) => {
//             const dashboardContent = document.getElementById("dashboard-content");
//             const pendingContent = document.getElementById("pending-content");
//             const approvedContent = document.getElementById("approved-content");
//             const rejectedContent = document.getElementById("rejected-content");

//             querySnapshot.forEach((doc) => {
//                 const mentorData = doc.data();
//                 // Create mentor card HTML
//                 const mentorCard = `
//                     <div class="mentor-card">
//                         <h2>${mentorData.fullName}</h2>
//                         <p>Field: ${mentorData.field}</p>
//                         <p>Location: ${mentorData.location}</p>
//                         <p>Status: ${mentorData.status}</p>
//                     </div>
//                 `;

//                 if (mentorData.status === "pending") {
//                     pendingContent.innerHTML += mentorCard;
//                 } else if (mentorData.status === "approved") {
//                     approvedContent.innerHTML += mentorCard;
//                 } else if (mentorData.status === "declined") {
//                     rejectedContent.innerHTML += mentorCard;
//                 }
//             });
//         })
//         .catch((error) => {
//             console.error("Error getting mentor applications:", error);
//         });
// }

// function downloadUserData() {
//     if (!auth.currentUser) return;
    
//     // Show loading indicator
//     document.getElementById('loading').style.display = 'block';
//     document.getElementById('downloadBtn').disabled = true;
    
//     // Get user data from Firestore
//     const jobSeekersRef = firestore.collection('jobSeeker');
//     const recruitersRef = firestore.collection('recruiterDB');
    
//     Promise.all([jobSeekersRef.get(), recruitersRef.get()])
//         .then(([jobSeekersSnapshot, recruitersSnapshot]) => {
//             const jobSeekers = jobSeekersSnapshot.docs.map(doc => ({ UserType: 'Job Seeker', ...doc.data() }));
//             const recruiters = recruitersSnapshot.docs.map(doc => ({ UserType: 'Recruiter', ...doc.data() }));
            
//             const users = [...jobSeekers, ...recruiters];
            
//             if (users.length === 0) {
//                 showStatus('No user data found', 'info');
//                 return;
//             }
            
//             // Convert data to CSV
//             const fields = [...new Set(users.flatMap(Object.keys))];
//             const csvHeader = fields.join(',') + '\n';
//             const csvData = users.map(user => fields.map(field => user[field]).join(',')).join('\n');
//             const csv = csvHeader + csvData;
            
//             // Create download link
//             const blob = new Blob([csv], {type: 'text/csv'});
//             const url = URL.createObjectURL(blob);
//             const link = document.createElement('a');
//             link.href = url;
//             link.download = `user_data_${new Date().toISOString().split('T')[0]}.csv`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);
            
//             showStatus('User data downloaded successfully', 'success');
//         })
//         .catch(error => {
//             showStatus('Error downloading user data: ' + error.message, 'error');
//             console.error('Download error:', error);
//         })
//         .finally(() => {
//             document.getElementById('loading').style.display = 'none';
//             document.getElementById('downloadBtn').disabled = false;
//         });
// }

// function logout() {
//     auth.signOut()
//         .then(() => {
//             window.location.href = 'login.html';
//         })
//         .catch(error => {
//             showStatus('Error signing out: ' + error.message, 'error');
//             console.error('Logout error:', error);
//         });
// }

// function showStatus(message, type) {
//     const statusElement = document.getElementById('status');
//     statusElement.textContent = message;
//     statusElement.className = 'status ' + type;
//     statusElement.style.display = 'block';
    
//     // Auto-hide success messages after 5 seconds
//     if (type === 'success') {
//         setTimeout(() => {
//             statusElement.style.display = 'none';
//         }, 5000);
//     }
// }


// Initialize Firebase
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

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();

// Check authentication state
auth.onAuthStateChanged(handleAuthStateChange);

function handleAuthStateChange(user) {
    if (!user) {
        // Not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }
    
    // Verify admin status
    verifyAdminStatus(user);
}

function verifyAdminStatus(user) {
    const uid = user.uid;
    firestore.collection('admin').doc(uid).get()
        .then((doc) => {
            if (!doc.exists || doc.data().role !== 'admin') {
                showStatus('Access denied. Admin privileges required.', 'error');
                setTimeout(() => {
                    auth.signOut();
                    window.location.href = 'login.html';
                }, 2000);
                return;
            }
            
            // Admin verified, update UI
            document.getElementById('userInfo').innerHTML = `
                <p>Welcome, Admin ${user.email || user.displayName || 'User'}</p>
            `;
            
            // Enable dashboard functionality
            document.getElementById('downloadBtn').disabled = false;
            
            // Get mentor applications
            getMentorApplications();
        })
        .catch(error => {
            showStatus('Error verifying admin status. Please try again.', 'error');
            console.error('Admin verification error:', error);
        });
}

function getMentorApplications() {
    // Get all mentor applications
    firestore.collection("mentorApplications")
        .get()
        .then((querySnapshot) => {
            const pendingContent = document.getElementById("pending-content");
            const approvedContent = document.getElementById("approved-content");
            const rejectedContent = document.getElementById("rejected-content");

            pendingContent.innerHTML = '';
            approvedContent.innerHTML = '';
            rejectedContent.innerHTML = '';

            querySnapshot.forEach((doc) => {
                const mentorData = doc.data();
                // Create mentor card HTML
                const mentorCard = `
                    <div class="mentor-card">
                        <h2>${mentorData.fullName}</h2>
                        <p>Field: ${mentorData.field}</p>
                        <p>Location: ${mentorData.location}</p>
                        <p>Status: ${mentorData.status}</p>
                        ${mentorData.status === "pending" ? 
                            `<button class="approve-btn" onclick="approveMentorApplication('${doc.id}')">Approve</button>
                            <button class="decline-btn" onclick="declineMentorApplication('${doc.id}')">Decline</button>` : ''}
                    </div>
                `;

                if (mentorData.status === "pending") {
                    pendingContent.innerHTML += mentorCard;
                } else if (mentorData.status === "approved") {
                    approvedContent.innerHTML += mentorCard;
                } else if (mentorData.status === "declined") {
                    rejectedContent.innerHTML += mentorCard;
                }
            });
        })
        .catch((error) => {
            console.error("Error getting mentor applications:", error);
        });
}

function approveMentorApplication(docId) {
    firestore.collection("mentorApplications").doc(docId)
        .update({ status: "approved" })
        .then(() => {
            showStatus("Mentor application approved successfully", "success");
            getMentorApplications();
        })
        .catch((error) => {
            console.error("Error approving mentor application:", error);
            showStatus("Error approving mentor application", "error");
        });
}

function declineMentorApplication(docId) {
    firestore.collection("mentorApplications").doc(docId)
        .update({ status: "declined" })
        .then(() => {
            showStatus("Mentor application declined successfully", "success");
            getMentorApplications();
        })
        .catch((error) => {
            console.error("Error declining mentor application:", error);
            showStatus("Error declining mentor application", "error");
        });
}

function downloadUserData() {
    if (!auth.currentUser) return;
    
    // Show loading indicator
    document.getElementById('loading').style.display = 'block';
    document.getElementById('downloadBtn').disabled = true;
    
    // Get user data from Firestore
    const jobSeekersRef = firestore.collection('jobSeeker');
    const recruitersRef = firestore.collection('recruiterDB');
    
    Promise.all([jobSeekersRef.get(), recruitersRef.get()])
        .then(([jobSeekersSnapshot, recruitersSnapshot]) => {
            const jobSeekers = jobSeekersSnapshot.docs.map(doc => ({ UserType: 'Job Seeker', ...doc.data() }));
            const recruiters = recruitersSnapshot.docs.map(doc => ({ UserType: 'Recruiter', ...doc.data() }));
            
            const users = [...jobSeekers, ...recruiters];
            
            if (users.length === 0) {
                showStatus('No user data found', 'info');
                return;
            }
            
            // Convert data to CSV
            const fields = [...new Set(users.flatMap(Object.keys))];
            const csvHeader = fields.join(',') + '\n';
            const csvData = users.map(user => fields.map(field => user[field]).join(',')).join('\n');
            const csv = csvHeader + csvData;
            
            // Create download link
            const blob = new Blob([csv], {type: 'text/csv'});
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `user_data_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showStatus('User data downloaded successfully', 'success');
        })
        .catch(error => {
            showStatus('Error downloading user data: ' + error.message, 'error');
            console.error('Download error:', error);
        })
        .finally(() => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('downloadBtn').disabled = false;
        });
}

function logout() {
    auth.signOut()
        .then(() => {
            window.location.href = 'login.html';
        })
        .catch(error => {
            showStatus('Error signing out: ' + error.message, 'error');
            console.error('Logout error:', error);
        });
}

function showStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = 'status ' + type;
    statusElement.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}