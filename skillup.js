
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("course-container");

  db.collection("courses").get().then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const tile = document.createElement("div");
      tile.className = "Computer Literacy";
      tile.className = "Digital Marketing";
      tile.className = "Web Dev";
      tile.className = "Data Analysis";
      tile.className = "Cybersecurity";
      tile.className = "Cloud Computing";
      tile.className = "IT Support";
      tile.className = "Coding(Python, Java)";
      tile.className = "AI, ML";
      tile.className = "Business Management";
      tile.className = "Sales & Customer Service";
      tile.className = "Entrepreneaurial Thinking";
      tile.className = "Business Planning";
      tile.className = "Djying";
      tile.className = "Innovation & Design Thinking";
      tile.className = "Plumbing";
      tile.className = "Hairdressing & Beauty Therapy";
      tile.className = "Tiling & Painting";
      tile.className = "Sewing & Fashion Design";
      tile.className = "Professional Email & ";
      tile.innerHTML = `
        <h3>${data.name}</h3>
        <p><strong>Level:</strong> ${data.level}</p>
        <p><strong>Category:</strong> ${data.category}</p>
        <a href="${data.link}" target="_blank">Go to Course</a>
      `;
      container.appendChild(tile);
    });
  }).catch(error => {
    container.innerHTML = "<p>Error loading courses.</p>";
    console.error(error);
  });
});
