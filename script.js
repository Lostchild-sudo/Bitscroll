function showPage(pageId){

let pages = document.querySelectorAll("main section");

pages.forEach(function(page){
page.style.display = "none";
});

document.getElementById(pageId).style.display = "block";

}

function likePost(button){

if(button.innerText === "❤️ Like"){
button.innerText = "💔 Unlike";
}else{
button.innerText = "❤️ Like";
}

}

let users = [

{username:"user_one", dp:"https://via.placeholder.com/40"},
{username:"cool_guy", dp:"https://via.placeholder.com/40"},
{username:"travel_world", dp:"https://via.placeholder.com/40"},
{username:"tech_master", dp:"https://via.placeholder.com/40"}

];

function searchUsers(){

let input = document.getElementById("searchInput").value.toLowerCase();
let results = document.getElementById("searchResults");

results.innerHTML = "";

users.forEach(function(user){

if(user.username.includes(input)){

results.innerHTML += `
<div class="user-result">
<img src="${user.dp}">
<span>${user.username}</span>
</div>
`;

}

});

}

async function uploadPost() {
  let fileInput = document.getElementById("postImage");

  if (fileInput.files.length === 0) {
    alert("Select an image first");
    return;
  }

  let file = fileInput.files[0];
  let imageURL = URL.createObjectURL(file); // temporary preview

  try {
    // Save post to Firestore
    await window.db.collection("posts").add({
      username: "you",
      image: imageURL,
      time: Date.now()
    });

    alert("Post saved to database!");
    fileInput.value = ""; // clear input

    loadPosts(); // refresh feed
  } catch (error) {
    console.log(error);
    alert("Error saving post");
  }
}

import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function loadPosts() {
  const postsContainer = document.getElementById("homePage");
  postsContainer.innerHTML = "<h2>Home Feed</h2>"; // clear feed and keep header

  try {
    // Get all posts ordered by newest first
    const q = query(collection(window.db, "posts"), orderBy("time", "desc"));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
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

window.onload = () => {
  loadPosts();
};
