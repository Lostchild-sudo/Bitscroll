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
