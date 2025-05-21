// Code for handling dropdown menu and sign-out functionality
document.querySelector('.user-icon-btn').addEventListener('click', function(event) {
  event.stopPropagation();
  document.querySelector('.dropdown-menu').classList.toggle('show');
});

document.addEventListener('click', function(event) {
  if (!event.target.closest('.user-menu')) {
    document.querySelector('.dropdown-menu').classList.remove('show');
  }
});

document.querySelector('.sign-out-btn').addEventListener('click', () => {
  firebase.auth().signOut()
    .then(() => {
      window.location.href = 'login.html';
    })
    .catch((error) => {
      console.error(error);
    });
});