function showPage(pageId){

let pages=document.querySelectorAll("main section");

pages.forEach(function(page){
page.style.display="none";
});

document.getElementById(pageId).style.display="block";

}


let users=[
{username:"user_one"},
{username:"cool_guy"},
{username:"travel_world"},
{username:"tech_master"}
];


function searchUsers(){

let input=document.getElementById("searchInput").value.toLowerCase();

let results=document.getElementById("searchResults");

results.innerHTML="";

users.forEach(function(user){

if(user.username.includes(input)){

results.innerHTML+=`
<div>${user.username}</div>
`;

}

});

}


function uploadPost(){

let fileInput=document.getElementById("postImage");

if(fileInput.files.length===0){
alert("Select image first");
return;
}

let file=fileInput.files[0];

let imageURL=URL.createObjectURL(file);

document.getElementById("feedPosts").innerHTML+=`

<div>
<img src="${imageURL}" style="width:100%">
</div>

`;

document.getElementById("profilePosts").innerHTML+=`

<img src="${imageURL}">

`;

let count=document.getElementById("postCount");

count.innerText=parseInt(count.innerText)+1;

alert("Post uploaded");

}


function editProfile(){
alert("Edit profile feature coming soon");
}


function shareProfile(){

navigator.share({
title:"My Bitscroll Profile",
text:"Follow me on Bitscroll",
url:window.location.href
});

}
