let upvoteButtons = document.getElementsByClassName("fa-thumbs-up");
let downvoteButtons = document.getElementsByClassName("fa-thumbs-down");
let deleteButtons = document.getElementsByClassName("fa-trash-o");

Array.from(upvoteButtons).forEach(function(element) {
  element.addEventListener('click', function(){
    // console.log(this.parentNode.parentNode)
    const topic = this.parentNode.parentNode.childNodes[3].innerText
    const description = this.parentNode.parentNode.childNodes[7].innerText
    const upvotes = parseFloat(this.parentNode.parentNode.childNodes[15].innerText)
    fetch('addUpvote', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'topic': topic,
        'description': description,
        'upvotes': upvotes
      })
    })
    .then(response => response.ok ? response.json() : null)
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })
  });
});

Array.from(downvoteButtons).forEach(function(element) {
  element.addEventListener('click', function(){
    const topic = this.parentNode.parentNode.childNodes[3].innerText
    const description = this.parentNode.parentNode.childNodes[7].innerText
    const upvotes = parseFloat(this.parentNode.parentNode.childNodes[15].innerText)
    fetch('addDownvote', {
      method: 'put',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'topic': topic,
        'description': description,
        'upvotes': upvotes
      })
    })
    .then(response => response.ok ? response.json() : null)
    .then(data => window.location.reload(true))
  });
});

Array.from(deleteButtons).forEach(function(element) {
  element.addEventListener('click', function(){
    const topic = this.parentNode.parentNode.childNodes[3].innerText
    const description = this.parentNode.parentNode.childNodes[7].innerText
    fetch('topics', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'topic': topic,
        'description': description
      })
    }).then(() => {
      window.location.reload()
    }
  )
  });
});


function showPopup(imageSrc) {
  document.getElementById("popupImage").src = imageSrc;
  document.getElementById("popup").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".overlay").addEventListener("click", closePopup);
  document.querySelectorAll('.thumbnail').forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
      showPopup(thumbnail.src)
    });
  });
});