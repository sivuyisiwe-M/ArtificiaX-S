
// Resume upload functionality
document.getElementById('resume-upload-btn').addEventListener('click', () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const fileInput = document.getElementById('resume-upload');
    const file = fileInput.files[0];

    if (file) {
      const storageRef = firebase.storage().ref(`resumes/${user.uid}/${file.name}`);
      storageRef.put(file)
        .then((snapshot) => {
          return snapshot.ref.getDownloadURL();
        })
        .then((downloadURL) => {
          firebase.firestore().collection('jobSeeker').doc(user.uid).update({ resume: downloadURL })
            .then(() => {
              const resumeContainer = document.getElementById('resume-container');
              resumeContainer.innerHTML = `
                <div class="resume-file">
                  <span>${file.name}</span>
                  <button class="resume-options-btn">•••</button>
                  <div class="resume-options-menu">
                    <ul>
                      <li><a href="${downloadURL}" target="_blank">View</a></li>
                      <li><a href="${downloadURL}" download="${file.name}">Download</a></li>
                      <li><a href="#" class="update-resume-btn">Update</a></li>
                      <li><a href="#" class="delete-resume-btn">Delete</a></li>
                    </ul>
                  </div>
                </div>
              `;
              document.getElementById('resume-status').textContent = 'Resume uploaded successfully!';
            });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      alert('Please select a file to upload.');
    }
  } else {
    console.log('No user is signed in.');
  }
});

// Add event listeners for resume options menu
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('resume-options-btn')) {
    const resumeOptionsMenu = e.target.nextElementSibling;
    resumeOptionsMenu.classList.toggle('show');
  } else if (e.target.classList.contains('update-resume-btn')) {
    // Update resume functionality
  } else if (e.target.classList.contains('delete-resume-btn')) {
    // Delete resume functionality
  }
});

// Save qualifications functionality
document.getElementById('qualifications-save-btn').addEventListener('click', () => {
  const user = firebase.auth().currentUser;
  if (user) {
    const qualificationsInput = document.getElementById('qualifications-input');
    const qualifications = qualificationsInput.value;

    firebase.firestore().collection('jobSeeker').doc(user.uid).update({ qualifications })
      .then(() => {
        document.getElementById('qualifications-status').textContent = 'Qualifications saved successfully!';
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    console.log('No user is signed in.');
  }
});

// Sign out functionality
document.querySelector('.sign-out-btn').addEventListener('click', (e) => {
  e.preventDefault();
  firebase.auth().signOut().then(() => {
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error('Error signing out:', error);
  });
});




// // Resume upload functionality
// document.getElementById('resume-upload-btn').addEventListener('click', () => {
//   document.getElementById('resume-upload').click();
// });

// document.getElementById('resume-upload').addEventListener('change', () => {
//   const user = firebase.auth().currentUser;
//   if (user) {
//     const fileInput = document.getElementById('resume-upload');
//     const file = fileInput.files[0];

//     if (file) {
//       const storageRef = firebase.storage().ref(`resumes/${user.uid}/${file.name}`);
//       storageRef.put(file)
//         .then((snapshot) => {
//           return snapshot.ref.getDownloadURL();
//         })
//         .then((downloadURL) => {
//           firebase.firestore().collection('jobSeeker').doc(user.uid).update({ resume: downloadURL })
//             .then(() => {
//               const resumeContainer = document.getElementById('resume-container');
//               resumeContainer.innerHTML = `
//                 <div class="resume-file">
//                   <span>${file.name}</span>
//                   <button class="resume-options-btn">•••</button>
//                   <div class="resume-options-menu">
//                     <ul>
//                       <li><a href="${downloadURL}" target="_blank">View</a></li>
//                       <li><a href="${downloadURL}" download="${file.name}">Download</a></li>
//                       <li><a href="#" class="update-resume-btn">Update</a></li>
//                       <li><a href="#" class="delete-resume-btn">Delete</a></li>
//                     </ul>
//                   </div>
//                 </div>
//               `;
//               document.getElementById('resume-status').textContent = 'Resume uploaded successfully!';
//             });
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   } else {
//     console.log('No user is signed in.');
//   }
// });

// // Add event listeners for resume options menu
// document.addEventListener('click', (e) => {
//   if (e.target.classList.contains('resume-options-btn')) {
//     const resumeOptionsMenu = e.target.nextElementSibling;
//     resumeOptionsMenu.classList.toggle('show');
//   } else if (e.target.classList.contains('update-resume-btn')) {
//     const user = firebase.auth().currentUser;
//     const fileInput = document.createElement('input');
//     fileInput.type = 'file';
//     fileInput.accept = '.pdf';
//     fileInput.style.display = 'none';
//     document.body.appendChild(fileInput);
//     fileInput.click();
//     fileInput.addEventListener('change', () => {
//       const file = fileInput.files[0];
//       const storageRef = firebase.storage().ref(`resumes/${user.uid}/${file.name}`);
//       storageRef.put(file)
//         .then((snapshot) => {
//           return snapshot.ref.getDownloadURL();
//         })
//         .then((downloadURL) => {
//           firebase.firestore().collection('jobSeeker').doc(user.uid).update({ resume: downloadURL })
//             .then(() => {
//               const resumeContainer = document.getElementById('resume-container');
//               resumeContainer.innerHTML = `
//                 <div class="resume-file">
//                   <span>${file.name}</span>
//                   <button class="resume-options-btn">•••</button>
//                   <div class="resume-options-menu">
//                     <ul>
//                       <li><a href="${downloadURL}" target="_blank">View</a></li>
//                       <li><a href="${downloadURL}" download="${file.name}">Download</a></li>
//                       <li><a href="#" class="update-resume-btn">Update</a></li>
//                       <li><a href="#" class="delete-resume-btn">Delete</a></li>
//                     </ul>
//                   </div>
//                 </div>
//               `;
//               document.getElementById('resume-status').textContent = 'Resume updated successfully!';
//             });
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     });
//   } else if (e.target.classList.contains('delete-resume-btn')) {
//     const user = firebase.auth().currentUser;
//     firebase.firestore().collection('jobSeeker').doc(user.uid).get()
//       .then((doc) => {
//         const resumeURL = doc.data().resume;
//         const storageRef = firebase.storage().refFromURL(resumeURL);
//         storageRef.delete()
//           .then(() => {
//             firebase.firestore().collection('jobSeeker').doc(user.uid).update({ resume: '' })
//               .then(() => {
//                 const resumeContainer = document.getElementById('resume-container');
//                 resumeContainer.innerHTML = '';
//                 document.getElementById('resume-status').textContent = 'Resume deleted successfully!';
//               });
//           })
//           .catch((error) => {
//             console.error(error);
//           });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }
// });

// // Save qualifications functionality
// document.getElementById('qualifications-save-btn').addEventListener('click', () => {
//   const user = firebase.auth().currentUser;
//   if (user) {
//     const qualificationsInput = document.getElementById('qualifications-input');
//     const qualifications = qualificationsInput.value;

//     firebase.firestore().collection('jobSeeker').doc(user.uid).update({ qualifications })
//       .then(() => {
//         document.getElementById('qualifications-status').textContent = 'Qualifications saved successfully!';
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   } else {
//     console.log('No user is signed in.');
//   }
// });

// // Sign out functionality
// document.querySelector('.sign-out-btn').addEventListener('click', (e) => {
//   e.preventDefault();
//   firebase.auth().signOut().then(() => {
//     window.location.href = 'login.html';
//   }).catch((error) => {
//     console.error('Error signing out:', error);
//   });
// });