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
