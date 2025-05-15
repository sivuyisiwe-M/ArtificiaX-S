// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDt2CXtgnGCBo0CFmrvnAYwgh1iBrmsi-A",
  authDomain: "ubuntu-plug.firebaseapp.com",
  databaseURL: "https://ubuntu-plug-default-rtdb.firebaseio.com",
  projectId: "ubuntu-plug",
  storageBucket: "ubuntu-plug.appspot.com",
  messagingSenderId: "666310061191",
  appId: "1:666310061191:web:89f8c03ba001cc69699c22",
  measurementId: "G-2XNGY72N58"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ✅ References
const messagesRef = db.ref("chatMessages");
const contactRef = db.ref("contactMessages");

// ✅ Chat Form Submit
const chatForm = document.getElementById("chatForm");
const chatBox = document.getElementById("chatBox");

if (chatForm) {
  chatForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("userName").value.trim();
    const message = document.getElementById("userMessage").value.trim();

    if (name && message) {
      messagesRef.push({
        name: name,
        message: message,
        timestamp: Date.now()
      });

      chatForm.reset();
    }
  });

  // ✅ Listen for new chat messages
  messagesRef.on("child_added", function (snapshot) {
    const data = snapshot.val();
    const isMentor = data.name.toLowerCase().includes("mentor");

    const div = document.createElement("div");
    div.classList.add("message");
    if (isMentor) div.classList.add("mentor");

    div.innerHTML = `
      <div class="name">${data.name}</div>
      <div class="text">${data.message}</div>
    `;

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

// ✅ Contact Form Submit
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (name && email && message) {
      contactRef.push({
        name: name,
        email: email,
        message: message,
        timestamp: Date.now()
      });

      alert("Message sent! ✅");
      contactForm.reset();
    }
  });

