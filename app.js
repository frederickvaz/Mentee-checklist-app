const checklistItems = [
    "The Mentee does not attend his mentoring meetings consistently",
    "The mentee is facing a difficult situation for a long time",
    "The mentee has irregular college attendance",
    "The mentee feeling sad/tensed for a long time",
    "The mentee is using alcohol/drugs on a regular basis", // Critical Item
    "The mentee has substance withdrawal signs",
    "The mentee is feeling hopeless", // Critical Item
    "The mentee has a diagnosis of psychiatric illness", // Critical Item
    "The mentee has previous history of suicidal attempt", // Critical Item
    "The mentee currently has suicidal thoughts/ideas or death wishes", // Critical Item
    "The mentee has irregular eating and sleeping pattern for a long time",
    "The mentee has recently not been able to concentrate on whatever he/she is doing",
    "The mentee has recently lost much sleep over worry",
    "The mentee is recently feeling incapable of making decisions",
    "The mentee is recently feeling constantly under strain",
    "The mentee is recently feeling he/she couldn't overcome difficulties",
    "The mentee is recently not been able to enjoy normal day-to-day activities",
    "The mentee has recently been feeling unhappy or depressed",
    "The mentee is recently losing confidence in self"
];

// Critical items for referral
const criticalItems = [5, 7, 8, 9, 10];

// Dynamically create checklist questions
window.onload = function () {
    const questionDiv = document.getElementById("questions");
    checklistItems.forEach((question, index) => {
        const div = document.createElement("div");
        div.className = criticalItems.includes(index + 1) ? "question critical" : "question";
        div.innerHTML = `
            <label>${index + 1}. ${criticalItems.includes(index + 1) ? "(Critical Question) " : ""} ${question}</label>
            <select id="item${index + 1}" onchange="highlightAnswered(${index + 1})">
                <option value="" selected>Select</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
            </select>
        `;
        questionDiv.appendChild(div);
    });
};

// Highlight answered questions and remove red border if selected
function highlightAnswered(questionNumber) {
    const questionDiv = document.getElementById(`item${questionNumber}`).parentElement;
    questionDiv.classList.remove("unanswered");
    questionDiv.classList.add("answered");
}

// Evaluate checklist ensuring all questions are answered
function evaluateChecklist() {
    let criticalYesCount = 0;
    let totalYesCount = 0;
    let criticalReasons = [];
    let nonCriticalReasons = [];
    let allAnswered = true;

    checklistItems.forEach((question, index) => {
        const response = document.getElementById(`item${index + 1}`).value;
        
        if (response === "") {
            allAnswered = false;
            const questionDiv = document.getElementById(`item${index + 1}`).parentElement;
            questionDiv.classList.add("unanswered");
        } else {
            if (response === "yes") {
                if (criticalItems.includes(index + 1)) {
                    criticalYesCount++;
                    criticalReasons.push(question);
                } else {
                    totalYesCount++;
                    nonCriticalReasons.push(question);
                }
            }
        }
    });

    const resultDiv = document.getElementById("result");
    if (!allAnswered) {
        resultDiv.innerHTML = `<p class="red-text"><strong>Please answer all questions before evaluating.</strong></p>`;
        return;
    }

    let message = "";

    if (criticalYesCount > 0) {
        message = `<h2 class="red-text">Evaluation Result</h2>
            <p class="red-text"><strong>One or more critical questions have been answered YES.</strong></p>
            <p><strong>Reasons:</strong></p>
            <ul>${criticalReasons.map(reason => `<li>${reason}</li>`).join("")}</ul>
            <p class="red-text">The mentee should be referred to the College Counsellor or Department of Psychiatry.</p>`;
    } else if (totalYesCount > 3) {
        message = `<h2 class="red-text">Evaluation Result</h2>
            <p class="red-text"><strong>More than 3 non-critical questions have been answered YES.</strong></p>
            <p><strong>Reasons:</strong></p>
            <ul>${nonCriticalReasons.map(reason => `<li>${reason}</li>`).join("")}</ul>
            <p class="red-text">The mentee should be referred to the College Counsellor or Department of Psychiatry.</p>`;
    } else {
        message = `<h2 class="green-text">Evaluation Result</h2>
            <p class="green-text"><strong>No immediate referral is required based on the responses.</strong></p>`;
    }

    resultDiv.innerHTML = message;
}
