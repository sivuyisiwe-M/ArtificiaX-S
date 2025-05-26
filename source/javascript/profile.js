


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