// Show page
function showPage(pageId) {
  const pages = document.querySelectorAll("main section");
  pages.forEach((page) => page.style.display = "none");
  document.getElementById(pageId).style.display = "block";
}

// Like / Unlike post
function likePost(button) {
  button.innerText = button.innerText === "❤️ Like" ? "💔 Unlike" : "❤️ Like";
}

// Users for search
let users = [
  { username: "user_one", dp: "https://via.placeholder.com/40" },
  { username: "cool_guy", dp: "https://via.placeholder.com/40" },
  { username: "travel_world", dp: "https://via.placeholder.com/40" },
  { username: "tech_master", dp: "https://via.placeholder.com/40" }
];

function searchUsers() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const results = document.getElementById("searchResults");
  results.innerHTML = "";
  users.forEach((user) => {
    if (user.username.includes(input)) {
      results.innerHTML += `
        <div class="user-result">
          <img src="${user.dp}">
          <span>${user.username}</span>
        </div>
      `;
    }
  });
}

// Upload post
async function uploadPost() {
  const fileInput = document.getElementById("postImage");
  if (fileInput.files.length === 0) {
    alert("Select an image first");
    return;
  }

  const file = fileInput.files[0];
  const imageURL = URL.createObjectURL(file);

  try {
    await db.collection("posts").add({
      username: "you",
      image: imageURL,
      time: Date.now()
    });
    alert("Post saved to database!");
    fileInput.value = "";
    loadPosts();
  } catch (error) {
    console.log(error);
    alert("Error saving post");
  }
}

// Load posts from Firestore
async function loadPosts() {
  const postsContainer = document.getElementById("homePage");
  postsContainer.innerHTML = "<h2>Home Feed</h2>";

  try {
    const snapshot = await db.collection("posts").orderBy("time", "desc").get();
    snapshot.forEach((doc) => {
      const post = doc.data();
      postsContainer.innerHTML += `
        <div class="post">
          <div class="post-header">
            <img src="https://via.placeholder.com/40" class="dp">
            <span class="username">${post.username}</span>
          </div>
          <img src="${post.image}" class="post-img">
          <div class="post-actions">
            <button onclick="likePost(this)">❤️ Like</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.log(error);
  }
}

// Load posts on page load
window.onload = () => {
  loadPosts();
};
