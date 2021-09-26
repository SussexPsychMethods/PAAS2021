function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const checker = (questionid) => {
  console.log(questionid);
  let notcompleted = Array.from(document.getElementsByName(questionid))
    .map((x) => x.checked)
    .every((val) => val == false);
  if (notcompleted === true) {
    return null;
  }
  let correct = Array.from(document.getElementsByName(questionid))
    .map((x) => [x.value, x.checked ? "true" : "false"])
    .map((x) => x[0] === x[1])
    .every((val) => val === true);
  console.log(correct);
  Array.from(document.getElementsByName(questionid)).filter((x) => {
    x.parentNode.childNodes[1].disabled = true;
    x.parentNode.childNodes[3].childNodes[1].style = ""
    // return x.checked;
  });

  let el = document.getElementById(questionid + "main");
  let button = document.getElementById(questionid + "button");
  if (correct === true) {
    button.style.backgroundColor = "#e3f0d8";
    button.style.color = "green";
    button.innerHTML = "Correct!";
  } else {
    el.style.color = "red";
    button.style.backgroundColor = "#ecdddd";
    button.style.color = "red";
    button.innerHTML = "Incorrect";
  }
  button.disabled = true;
  window.el = el;
  document.getElementById(questionid).style = "";
  return correct;
};

// function addquestion(questions, questionEl) {

function multiChoice(questions) {
  let questionid = uuidv4();
  let main = questionid + "main";
  let button = questionid + "button";
  // let checkmarks = questionid + "checks";
  const makeresponse = (ans, checkmark, questionid, typeOfResponse) => {
    let id = uuidv4();
    return `<div>
<input type="${typeOfResponse}" id="${id}" value="${ans[1]}" name="${questionid}" >
<label for="${id}" class="${ans[1]}">${ans[0]}${checkmark}</label>
</div>`;
  };
  let nTrue = questions.answers.filter((x) => x[1] === "true");
  let typeOfResponse = nTrue.length > 1 ? "checkbox" : "radio";
  answers_array = "";
  for (let i = 0; i < questions.answers.length; i++) {
    let current = questions.answers[i];
    let checkmark = current[1] === "true" ? "  &#10003;" : "  &#10007;";
    checkmark = `<span style="visibility:hidden" >${checkmark}</span>`;
    answers_array =
      answers_array +
      makeresponse(current, checkmark, questionid, typeOfResponse);
  }
  const output =
    `
    <div id="${main}" class="question"><strong>${questions.question}</strong>` +
    `${answers_array}` +
    `<button id="${button}" onClick='checker("${questionid}")'>Submit Answer</button></div>`;

  // let el = document.getElementById(questionEl);
  // el.innerHTML = output;
  return output;
}
