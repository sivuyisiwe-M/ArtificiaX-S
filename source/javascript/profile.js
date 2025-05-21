auth.onAuthStateChanged((user) => {
  if (user) {
    // Upload resume
    document.getElementById('resume-upload-btn').addEventListener('click', () => {
      const fileInput = document.getElementById('resume-upload');
      const file = fileInput.files[0];

      if (file) {
        const storageRef = storage.ref(`resumes/${user.uid}/${file.name}`);
        storageRef.put(file)
          .then((snapshot) => {
            return snapshot.ref.getDownloadURL();
          })
          .then((downloadURL) => {
            db.collection('jobSeeker').doc(user.uid).update({ resume: downloadURL })
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
    });

    // Save qualifications
    document.getElementById('qualifications-save-btn').addEventListener('click', () => {
      const qualificationsInput = document.getElementById('qualifications-input');
      const qualifications = qualificationsInput.value;

      db.collection('jobSeeker').doc(user.uid).update({ qualifications })
        .then(() => {
          document.getElementById('qualifications-status').textContent = 'Qualifications saved successfully!';
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }
});