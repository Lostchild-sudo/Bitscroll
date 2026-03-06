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

function uploadPost(){

let fileInput = document.getElementById("postImage");

if(fileInput.files.length === 0){
alert("Select an image first");
return;
}

let file = fileInput.files[0];

let imageURL = URL.createObjectURL(file);

let homePage = document.getElementById("homePage");

homePage.innerHTML += `

<div class="post">

<div class="post-header">
<img src="https://via.placeholder.com/40" class="dp">
<span class="username">you</span>
</div>

<img src="${imageURL}" class="post-img">

<div class="post-actions">
<button onclick="likePost(this)">❤️ Like</button>
</div>

</div>

`;

alert("Post uploaded!");

}
