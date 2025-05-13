
document.getElementById('courseForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const url = document.getElementById('url').value.trim();
  const org = document.getElementById('org').value.trim();

  if (title && url && org) {
    const newCourse = document.createElement('li');
    newCourse.innerHTML = `<strong>${title}</strong> by ${org} - <a href="${url}" target="_blank">Visit</a>`;
    document.getElementById('courseList').appendChild(newCourse);

    // Clear form
    document.getElementById('courseForm').reset();
  }
});
