import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://endorsements-app-e5085-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

const commentInputEl = document.getElementById("main-comment-input-box");
const publishBtn = document.getElementById("publish-btn");
const endorsementsEl = document.getElementById("endorsements");
const toInputEl = document.getElementById("to-input-field");
const fromInputEl = document.getElementById("from-input-field");

publishBtn.addEventListener("click", () => {
  let addToInput = toInputEl.value;
  let addFromInput = fromInputEl.value;
  let addValue = commentInputEl.value;
  if (addValue === "" || addToInput === "" || addFromInput === "") {
    clearInputField();
  } else {
    push(endorsementsInDB, {
      comment: addValue,
      toInput: addToInput,
      fromInput: addFromInput,
    });
    clearInputField();
    clearFromToInputs();
  }
});

onValue(endorsementsInDB, (snapshot) => {
  if (snapshot.exists()) {
    let commentsArray = Object.entries(snapshot.val());
    clearEndorsementsEl();
    for (let i = 0; i < commentsArray.length; i++) {
      let currentEndorsement = commentsArray[i];
      appendEndorsement(currentEndorsement);
    }
  } else {
    endorsementsEl.innerHTML =
      "<p id='no-comments'>No endorsements posted yet</p>";
  }
});
function clearInputField() {
  commentInputEl.value = "";
  toInputEl.value = "";
  fromInputEl.value = "";
}
function clearEndorsementsEl() {
  endorsementsEl.innerHTML = "";
}
function clearFromToInputs() {
  toInputEl.value = "";
  fromInputEl.value = "";
}

function appendEndorsement(endorsementEntry) {
  let endorsementID = endorsementEntry[0];
  let endorsementValue = endorsementEntry[1].comment;
  let endorsementFrom = endorsementEntry[1].fromInput;
  let endorsementTo = endorsementEntry[1].toInput;
  let newComment = document.createElement("p");

  newComment.innerHTML = `
  <span class="bold-text">To: ${endorsementTo}</span>
  <p class="endorsement-text">${endorsementValue}</p>
  <div id="post-footer">
  <span class="bold-text">From: ${endorsementFrom}</span>
  <span class="likes-counter"><span class="likes-count">0</span> ❤️</span>
  </div>
  `;
  endorsementsEl.append(newComment);
  const likesCountEl = document.querySelector(".likes-count");
  let likesCount = 0;
  likesCountEl.addEventListener("click", function () {
    likesCount += 1;
  });
  likesCountEl.textContent = likesCount;
}
