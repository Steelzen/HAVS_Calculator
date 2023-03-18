let toolList = [];
let totalPoints = 0;
const firstRow = document.getElementById("initial-message-row");

function calculate() {
  // Get the values from the form
  const tool = document.getElementById("tool-name").value;
  const output = document.getElementById("output").value;
  const minutes = document.getElementById("minutes").value;

  // Validate the input
  if (tool === "") {
    document.getElementById(
      "tool-name-help"
    ).innerHTML = `<p class="input-help validation-check" id="tool-name-help">What tool are you using?</p>`;
    document.getElementById("tool-name-help").style.color = "red";
    document.getElementById("tool-name").style.borderColor = "red";
    return;
  }

  if (toolList.includes(tool)) {
    const toolNameHelp = document.getElementById("tool-name-help");
    toolNameHelp.innerHTML = `<p class="input-help validation-check" id="tool-name-help">Already added this tool!</p>`;
    toolNameHelp.style.color = "red";
    document.getElementById("tool-name").style.borderColor = "red";
    return;
  }

  if (output === "" || output == 0) {
    document.getElementById("output-help").style.color = "red";
    document.getElementById("output").style.borderColor = "red";
    return;
  }

  if (minutes === "" || minutes == 0) {
    document.getElementById("minutes-help").style.color = "red";
    document.getElementById("minutes").style.borderColor = "red";
    return;
  }

  // Reset validation
  refreshValidation();

  toolList.push(tool);

  const MEP = 400; // Maximum Exposure Points
  const AAP = 100; // Allowed Action Points

  const pointsPerHour = output * output * 2;
  const pointsPerMin = pointsPerHour / 60;
  const timeToReachELV = MEP / pointsPerHour;
  const timeToReachEAV = AAP / pointsPerHour;

  const points = Math.floor(pointsPerMin * minutes);

  // Calculate the percentage of daily allowance
  const percentageDA = (points / MEP) * 100;

  // Set the result section based on calculation result
  let percentage = document.getElementById("result-percent");
  let percentageBar = document.querySelector(".percentage-fill");

  if (percentageDA > 0 && percentageDA < 100) {
    percentage.innerHTML = `<span id="result-percent" style="color: green">${percentageDA.toFixed(
      2
    )}%</span>`;
    percentageBar.style.width = percentageDA + "%";
    percentageBar.style.backgroundColor = "green";
  } else if (percentageDA >= 100) {
    percentage.innerHTML = `<span id="result-percent" style="color: red">${percentageDA.toFixed(
      2
    )}%</span>`;
    percentageBar.style.width = percentageDA + "%";
    percentageBar.style.backgroundColor = "red";
  } else {
    `<span id="result-percent">${percentageDA.toFixed(2)}%</span>`;
    percentageBar.style.width = percentageDA + "%";
    percentageBar.style.backgroundColor = "transparent";
  }

  document.getElementById(
    "result-statement"
  ).innerHTML = `<span id="result-statement"> A ${tool} with a vibration output of ${output}m/s² reaches the EAV (Exposure Action Value) in ${Math.floor(
    timeToReachEAV
  )}hrs:${Math.floor(
    (timeToReachEAV - Math.floor(timeToReachEAV)) * 60
  )}mins and the ELV (Exposure Limit Value) in ${Math.floor(
    timeToReachELV
  )}hrs:${Math.floor(
    (timeToReachELV - Math.floor(timeToReachELV)) * 60
  )}mins.</span>`;

  document.getElementById(
    "result-point-and-DA"
  ).innerHTML = `<span id="result-point-and-DA">You have used ${points} points on this tool, which is ${percentageDA.toFixed(
    0
  )}% of the maximum daily allowance.</span>`;

  // Hide initial message of table
  firstRow.style.display = "none";

  // Call the function to make a new row on the table
  createTableRow(tool, output, minutes, points);

  // Add point to total points
  totalPoints += points;

  // Update the total points
  updateTotalPoints();
}

/** Function for creating row on register table according to input from user **/
function createTableRow(tool, output, minutes, points) {
  const row = document.createElement("tr");

  const toolCell = document.createElement("td");
  toolCell.className = "td-toolname";
  toolCell.innerHTML = `${tool} <button type="button" class="delbtn" >X</button>`;

  const outputCell = document.createElement("td");
  outputCell.textContent = output;

  const minutesCell = document.createElement("td");
  minutesCell.textContent = minutes;

  const pointsCell = document.createElement("td");
  pointsCell.textContent = points.toFixed(0);

  // Append the cells to the row
  row.appendChild(toolCell);
  row.appendChild(outputCell);
  row.appendChild(minutesCell);
  row.appendChild(pointsCell);

  // Return the completed row element
  const table = document.getElementById("register-table-body");
  table.appendChild(row);

  // Set functionality for delete button
  let deleteBtn = row.querySelector("button");

  deleteBtn.addEventListener("click", () => {
    row.remove();

    // Decrement totalPoints
    totalPoints -= points;

    // Remove tool name from the list
    let index = toolList.indexOf(tool);
    if (index !== -1) {
      toolList.splice(index, 1);
    }

    // Update total points
    updateTotalPoints();

    // If table is empty initial message will be hide
    if (tableIsEmpty()) {
      firstRow.style.display = "";
    }
  });
}

/** Function for updating total points and the message **/
function updateTotalPoints() {
  // Update total points
  document.getElementById(
    "total-points"
  ).innerHTML = `<span id="total-points">Total Points: ${totalPoints}</span>`;

  // Update the message based on total points
  let judgement = document.getElementById("judgement-message");

  if (totalPoints < 100) {
    judgement.innerHTML = `<span id="judgement-message" style="color: green"><strong>Looking good!</strong> So far, you're under the exposure action value - keep working safely.</span>`;
  } else if (totalPoints >= 100 && totalPoints < 400) {
    judgement.innerHTML = `<span id="judgement-message" style="color: brown"><strong>Be aware!</strong> You're above the exposure action value - look for ways to control vibration to reduce your risk.</span>`;
  } else {
    judgement.innerHTML = `<span id="judgement-message" style="color: red"><strong>Stop work! </strong> You've reached the exposure limit value - no more vibrations for you today.</span>`;
  }
}

/** Function for determining whether register table is empty **/
function tableIsEmpty() {
  return toolList.length <= 0 ? true : false;
}

/** Function for refreshing validation */
function refreshValidation() {
  document.getElementById(
    "tool-name-help"
  ).innerHTML = `<p class="input-help validation-check" id="tool-name-help">What tool are you using?</p>`;
  document.getElementById("tool-name-help").style.color = "";
  document.getElementById("tool-name").style.borderColor = "";
  document.getElementById("output-help").style.color = "";
  document.getElementById("output").style.borderColor = "";
  document.getElementById("minutes-help").style.color = "";
  document.getElementById("minutes").style.borderColor = "";
}
