let currentChatUser = null;


/* PAGE NAVIGATION */

function showPage(pageId){

let pages = document.querySelectorAll("main section");

pages.forEach(function(page){
page.style.display = "none";
});

document.getElementById(pageId).style.display = "block";

if(pageId === "homePage"){
loadFeed();
}

if(pageId === "profilePage"){
loadMyPosts();
}

}

/* SEARCH USERS */

function searchUsers(){

let text = document.getElementById("userSearch")?.value.toLowerCase() ||
           document.getElementById("searchInput")?.value.toLowerCase();

let results =
document.getElementById("chatUserResults") ||
document.getElementById("searchResults");

if(!text || text.length < 1){
results.innerHTML = "";
return;
}

db.collection("users").get().then((snapshot)=>{

results.innerHTML = "";

snapshot.forEach((doc)=>{

let user = doc.data();

if(user.username && user.username.toLowerCase().includes(text)){

results.innerHTML += `
<div class="search-user" onclick="openChat('${doc.id}','${user.username}')">
${user.username}
</div>
`;

}

});

});

}



/* UPLOAD POST */

function uploadPost(){

let fileInput = document.getElementById("postImage");
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



/* PROFILE EDIT */

function editProfile(){

let modal = document.getElementById("editProfileModal");
modal.style.display = "flex";

let user = firebase.auth().currentUser;
if(!user) return;

db.collection("users").doc(user.uid).get().then((doc)=>{

let data = doc.data() || {};

document.getElementById("editUsername").value = data.username || "";
document.getElementById("editName").value = data.name || "";
document.getElementById("editBio").value = data.bio || "";
document.getElementById("editLink").value = data.link || "";

});

}

function saveProfile(){

let user = firebase.auth().currentUser;
if(!user) return;

let username = document.getElementById("editUsername").value;
let name = document.getElementById("editName").value;
let bio = document.getElementById("editBio").value;
let link = document.getElementById("editLink").value;

db.collection("users").doc(user.uid).update({

username: username,
name: name,
bio: bio,
link: link

}).then(()=>{

document.getElementById("profileUsername").innerText = username;
document.getElementById("profileName").innerText = name;
document.getElementById("profileBio").innerText = bio;

let linkEl = document.getElementById("profileLink");
linkEl.innerText = link;
linkEl.href = link;

closeEditProfile();

alert("Profile updated!");

});

}

function closeEditProfile(){

document.getElementById("editProfileModal").style.display = "none";

}

/* SHARE PROFILE */

function shareProfile(){

navigator.share({
title:"My Bitscroll Profile",
text:"Follow me on Bitscroll",
url:window.location.href
});

}



/* LOAD USER POSTS */

function loadMyPosts(){

let user = firebase.auth().currentUser;
if(!user) return;

db.collection("posts")
.where("uid","==",user.uid)
.orderBy("time","desc")
.onSnapshot((snapshot)=>{

let grid = document.getElementById("profilePosts");

grid.innerHTML = "";

let count = 0;

snapshot.forEach((doc)=>{

let post = doc.data();

grid.innerHTML += `
<img src="${post.image}" class="profilePost">
`;

count++;

});

document.getElementById("postCount").innerText = count;

});

}

/* AUTHENTICATION */

function signup(){

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

if(password.length < 8){
alert("Password must be at least 8 characters");
return;
}

firebase.auth()
.createUserWithEmailAndPassword(email,password)

.then((cred)=>{

db.collection("users").doc(cred.user.uid).set({
username:"user_" + Math.floor(Math.random()*10000),
name:"New User"
});

});

}



function login(){

let email = document.getElementById("email").value;
let password = document.getElementById("password").value;

firebase.auth()
.signInWithEmailAndPassword(email,password)

.catch((error)=>{
alert(error.message);
});

}



function logout(){

firebase.auth().signOut();

}



/* AUTH STATE */

firebase.auth().onAuthStateChanged(function(user){

if(user){

document.getElementById("loginPage").style.display="none";
document.querySelector("main").style.display="block";

showPage("homePage");
           
loadProfile();
loadInbox();
loadMyPosts();

}else{

document.getElementById("loginPage").style.display="flex";
document.querySelector("main").style.display="none";

}

});



/* LOAD PROFILE */

function loadProfile(){

let user = firebase.auth().currentUser;
if(!user) return;

db.collection("users")
.doc(user.uid)
.get()
.then((doc)=>{

if(doc.exists){

let data = doc.data();

document.getElementById("profileUsername").innerText =
data.username || "username";

document.getElementById("profileName").innerText =
data.name || "name";

document.getElementById("profileBio").innerText =
data.bio || "bio";

let linkEl = document.getElementById("profileLink");

linkEl.innerText = data.link || "link";
linkEl.href = data.link || "#";

}

});

}



/* CHAT */

function openChat(userId, username){

currentChatUser = userId;

document.getElementById("chatHeader").innerText =
"Chat with " + username;

document.getElementById("chatMessages").innerHTML = "";

loadPrivateMessages();

}



function sendMessage(){

let text = document.getElementById("chatText").value;
if(!text) return;

let user = firebase.auth().currentUser;
if(!currentChatUser){
alert("Select a user first");
return;
}

let chatId = [user.uid,currentChatUser].sort().join("_");

db.collection("privateMessages").add({

chatId: chatId,
sender: user.uid,
text: text,
time: Date.now()

});

document.getElementById("chatText").value="";

}



function loadPrivateMessages(){

let user = firebase.auth().currentUser;
if(!user || !currentChatUser) return;

let chatId = [user.uid,currentChatUser].sort().join("_");

db.collection("privateMessages")
.where("chatId","==",chatId)
.orderBy("time")
.onSnapshot((snapshot)=>{

let chat = document.getElementById("chatMessages");

chat.innerHTML="";

snapshot.forEach((doc)=>{

let msg = doc.data();

let cls = msg.sender === user.uid ?
"myMessage" : "otherMessage";

let time =
new Date(msg.time)
.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});

chat.innerHTML += `
<div class="${cls}">
${msg.text}
<div class="messageTime">${time}</div>
</div>
`;

});

chat.scrollTop = chat.scrollHeight;

});

}



/* CHAT INBOX */

function loadInbox(){

let user = firebase.auth().currentUser;
if(!user) return;

db.collection("privateMessages")
.get()
.then((snapshot)=>{

let inbox = document.getElementById("chatInbox");

inbox.innerHTML="";

let chats = {};

snapshot.forEach((doc)=>{

let msg = doc.data();

if(msg.chatId.includes(user.uid)){

let ids = msg.chatId.split("_");

let other = ids[0] === user.uid ? ids[1] : ids[0];

chats[other] = true;

}

});

for(let id in chats){

db.collection("users")
.doc(id)
.get()
.then((doc)=>{

let data = doc.data();

inbox.innerHTML += `
<div class="inboxUser"
onclick="openChat('${id}','${data.username}')">
${data.username}
</div>
`;

});

}

});

}

function loadFeed(){

const feed = document.getElementById("feedPosts");

feed.innerHTML = "Loading posts...";

db.collection("posts")
.orderBy("time","desc")
.onSnapshot(snapshot => {

feed.innerHTML = "";

snapshot.forEach(doc => {

const post = doc.data();

const postDiv = document.createElement("div");

postDiv.className = "feedPost";

postDiv.innerHTML = `
<div class="postUser">${post.username}</div>
<img src="${post.image}">
<div class="postActions">
❤️ 💬 🔗
</div>
`;

feed.appendChild(postDiv);

});

});

}

function toggleMenu(){

let menu = document.getElementById("profileMenu");

if(menu.style.display === "block"){
menu.style.display = "none";
}else{
menu.style.display = "block";
}

}

function openAccountCenter(){
alert("Account center coming soon");
}

function openBlocked(){
alert("Blocked users coming soon");
}

let viewedUserId = null;

async function toggleFollow(){

let currentUser = firebase.auth().currentUser;

if(!currentUser || !viewedUserId) return;

let followRef = db.collection("follows")
.doc(currentUser.uid + "_" + viewedUserId);

let doc = await followRef.get();

if(doc.exists){

await followRef.delete();

}else{

await followRef.set({
follower: currentUser.uid,
following: viewedUserId
});

}

updateFollowCounts();

}

function updateFollowCounts(){

if(!viewedUserId) return;

db.collection("follows")
.where("following","==",viewedUserId)
.get()
.then(snapshot=>{

document.getElementById("followersCount").innerText = snapshot.size;

});

db.collection("follows")
.where("follower","==",viewedUserId)
.get()
.then(snapshot=>{

document.getElementById("followingCount").innerText = snapshot.size;

});

}
