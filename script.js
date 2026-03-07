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


async function uploadPost(){

let fileInput = document.getElementById("postImage");

if(fileInput.files.length === 0){
alert("Select image first");
return;
}

let file = fileInput.files[0];

let imageURL = URL.createObjectURL(file);

try{

await db.collection("posts").add({

username:"Lostchild-sudo",
image:imageURL,
time:Date.now()

});

alert("Post saved to database");

loadPosts();

}catch(error){

console.log(error);
alert("Error uploading post");

}

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

function loadPosts(){

db.collection("posts").orderBy("time","desc").get().then((snapshot)=>{

let feed = document.getElementById("feedPosts");
let profile = document.getElementById("profilePosts");

feed.innerHTML="";
profile.innerHTML="";

snapshot.forEach((doc)=>{

let post = doc.data();

feed.innerHTML += `
<div>
<img src="${post.image}" style="width:100%">
</div>
`;

profile.innerHTML += `
<img src="${post.image}">
`;

});

});

}

loadPosts();

function signup(){

let email=document.getElementById("email").value;
let password=document.getElementById("password").value;

firebase.auth().createUserWithEmailAndPassword(email,password)

.then(()=>{
alert("Account created");
})

.catch((error)=>{
alert(error.message);
});

}


function login(){

let email=document.getElementById("email").value;
let password=document.getElementById("password").value;

firebase.auth().signInWithEmailAndPassword(email,password)

.then(()=>{
document.getElementById("loginPage").style.display="none";
document.querySelector("main").style.display="block";
})

.catch((error)=>{
alert(error.message);
});

}

function logout(){

firebase.auth().signOut().then(()=>{

alert("Logged out");

});

}

firebase.auth().onAuthStateChanged(function(user){

if(user){

// user already logged in
document.getElementById("loginPage").style.display="none";
document.querySelector("main").style.display="block";

}else{

// user not logged in
document.getElementById("loginPage").style.display="flex";
document.querySelector("main").style.display="none";

}

});
