let currentChatUser = null;

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

let fileInput = document.getElementById("postFile");
let file = fileInput.files[0];

if(!file){
alert("Select an image first");
return;
}

let user = firebase.auth().currentUser;

let username = document.getElementById("profileUsername").innerText;

let reader = new FileReader();

reader.onload = function(e){

let imageUrl = e.target.result;

db.collection("posts").add({

image: imageUrl,
uid: user.uid,
username: username,
time: Date.now()

}).then(()=>{

alert("Post uploaded");

fileInput.value="";

});

};

reader.readAsDataURL(file);

}


async function editProfile(){

let newUsername = prompt("Enter your username:");
let newName = prompt("Enter your name:");

if(!newUsername && !newName){
alert("Nothing changed");
return;
}

let user = firebase.auth().currentUser;

if(!user){
alert("User not logged in");
return;
}

let uid = user.uid;

let data = {
username: newUsername ? newUsername : "username",
name: newName ? newName : "name"
};

try{

await db.collection("users").doc(uid).set(data);

document.getElementById("profileUsername").innerText = data.username;
document.getElementById("profileName").innerText = data.name;

alert("Profile updated!");

}catch(error){

console.log(error);
alert("Error saving profile");

}

}

function shareProfile(){

navigator.share({
title:"My Bitscroll Profile",
text:"Follow me on Bitscroll",
url:window.location.href
});

}

function loadMyPosts(){

let user = firebase.auth().currentUser;

if(!user) return;

db.collection("posts")
.where("uid","==",user.uid)
.orderBy("time","desc")
.onSnapshot((snapshot)=>{

let grid = document.getElementById("profilePosts");

grid.innerHTML="";

snapshot.forEach((doc)=>{

let post = doc.data();

grid.innerHTML += `
<img src="${post.image}" class="profilePost">
`;

});

});

}

loadPosts();

function signup(){

let email = document.getElementById("signupEmail").value;
let password = document.getElementById("signupPassword").value;

if(password.length < 8){
alert("Password must be at least 8 characters");
return;
}

firebase.auth().createUserWithEmailAndPassword(email, password)

.then((userCredential)=>{
console.log("Account created");
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

loadProfile();
loadInbox();
  
}else{

// user not logged in
document.getElementById("loginPage").style.display="flex";
document.querySelector("main").style.display="none";

}

});

function loadProfile(){

let user = firebase.auth().currentUser;

if(!user) return;

let uid = user.uid;

db.collection("users").doc(uid).get().then((doc)=>{

if(doc.exists){

let data = doc.data();

document.getElementById("profileUsername").innerText = data.username || "username";
document.getElementById("profileName").innerText = data.name || "name";

}

});

}

function sendMessage(){

let text = document.getElementById("chatText").value;

if(!text) return;

let user = firebase.auth().currentUser;

let username = document.getElementById("profileUsername").innerText;

if(!currentChatUser){
alert("Select a user to chat with first");
return;
}

let chatId = [user.uid, currentChatUser].sort().join("_");

db.collection("privateMessages").add({

chatId: chatId,
username: username,
text: text,
time: Date.now()

});

document.getElementById("chatText").value="";

}

function loadMessages(){

db.collection("messages")
.orderBy("time")
.onSnapshot((snapshot)=>{

let chat = document.getElementById("chatMessages");
chat.innerHTML="";

snapshot.forEach((doc)=>{

let msg = doc.data();

chat.innerHTML += `
<div class="message">
<b>${msg.username}</b><br>
${msg.text}
</div>
`;

});

chat.scrollTop = chat.scrollHeight;

});

}

function searchUsers(){

let text = document.getElementById("userSearch").value.toLowerCase();

let results = document.getElementById("searchResults");

if(text.length < 1){
results.innerHTML="";
return;
}

db.collection("users").get().then((snapshot)=>{

results.innerHTML="";

snapshot.forEach((doc)=>{

let user = doc.data();

if(user.username.toLowerCase().includes(text)){

results.innerHTML += `
<div class="search-user" onclick="openChat('${doc.id}','${user.username}')">
${user.username}
</div>
`;
}

});

});

}

function openChat(userId, username){

currentChatUser = userId;

document.getElementById("chatHeader").innerText = "Chat with " + username;

document.getElementById("chatMessages").innerHTML = "";

loadPrivateMessages();

}

function loadPrivateMessages(){

let currentUser = firebase.auth().currentUser;

if(!currentUser || !currentChatUser) return;

let chatId = [currentUser.uid, currentChatUser].sort().join("_");

db.collection("privateMessages")
.where("chatId","==",chatId)
.orderBy("time")
.onSnapshot((snapshot)=>{

let chat = document.getElementById("chatMessages");

chat.innerHTML="";

snapshot.forEach((doc)=>{

let msg = doc.data();

let currentUser = firebase.auth().currentUser;

let messageClass = msg.username === document.getElementById("profileUsername").innerText ? "myMessage" : "otherMessage";

let time = new Date(msg.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

chat.innerHTML += `
<div class="${messageClass}">
${msg.text}
<div class="messageTime">${time}</div>
</div>
`;
  
});

chat.scrollTop = chat.scrollHeight;

});

}

function loadInbox(){

let user = firebase.auth().currentUser;

if(!user) return;

db.collection("privateMessages")
.where("chatId","array-contains",user.uid)
.get()
.then((snapshot)=>{

let inbox = document.getElementById("chatInbox");

inbox.innerHTML="";

let chats = {};

snapshot.forEach((doc)=>{

let msg = doc.data();

let ids = msg.chatId.split("_");

let otherUser = ids[0] === user.uid ? ids[1] : ids[0];

chats[otherUser] = true;

});

for(let id in chats){

db.collection("users").doc(id).get().then((doc)=>{

let data = doc.data();

inbox.innerHTML += `
<div class="inboxUser" onclick="openChat('${id}','${data.username}')">
${data.username}
</div>
`;

});

}

});

}
