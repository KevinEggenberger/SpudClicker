// Variables
let collectedSpuds = 0;
let fieldWorkers = 0;
let spudsPerSecond = 0; // Spuds per second

let fieldWorkerCost = 5; // Cost for one Field Worker
let fieldWorkerUpgradeCost = 100; // Initial cost for the upgrade

let availableUpgradesFieldWorker = 0; // Counter for available upgrades

// Function for clicking the Spud
function clickSpud() {
  collectedSpuds += 1;
  updateUI();
}

// Function to increase collected spuds based on spudsPerSecond
function increaseSpuds() {
  collectedSpuds += spudsPerSecond / 10; // Update every 100ms, so divide by 10
  updateUI();
}

// Function for buying Field Workers
function buyFieldWorkers() {
  if (collectedSpuds >= fieldWorkerCost) {
    collectedSpuds -= fieldWorkerCost;
    fieldWorkers += 1;
    spudsPerSecond += 1; // Each Field Worker increases yield by 1 Spud per second
    fieldWorkerCost *= 1; // Increase the cost of Field Workers by 10%
    checkForUpgradeFieldWorker(); // Check if upgrade is available
    updateUI();
  } else {
    displayErrorMessage("Not enough Spuds!");
  }
}

// Function for upgrading Field Workers
function upgradeFieldWorkers() {
  if (
    collectedSpuds >= fieldWorkerUpgradeCost &&
    availableUpgradesFieldWorker > 0
  ) {
    collectedSpuds -= fieldWorkerUpgradeCost;
    spudsPerSecond += fieldWorkers * 0.5; // Example upgrade: increase yield by 50%
    fieldWorkerUpgradeCost *= 1.5; // Increase the cost of the next upgrade
    availableUpgradesFieldWorker--; // Decrease the count of available upgrades
    if (availableUpgradesFieldWorker === 0) {
      document.getElementById("workerUpgrade").style.display = "none"; // Hide the upgrade button
    }
    updateUI();
  } else {
    displayErrorMessage("Not enough Spuds for upgrade!");
  }
}

// Function to check if upgrade is available for Field Workers
function checkForUpgradeFieldWorker() {
  const totalUpgrades = Math.floor(fieldWorkers / 50);
  const newUpgradesFieldWorker = totalUpgrades - availableUpgradesFieldWorker;
  if (newUpgradesFieldWorker > 0) {
    availableUpgradesFieldWorker += newUpgradesFieldWorker; // Add new available upgrades
    document.getElementById("workerUpgrade").style.display = "block"; // Show the upgrade button
  }
}

// Function to update the UI
function updateUI() {
  document.getElementById(
    "spudCount"
  ).innerText = `Collected Spuds: ${Math.floor(collectedSpuds)}`;
  document.getElementById(
    "spudsPerSecond"
  ).innerText = `Spuds per second: ${spudsPerSecond}`;
  document.getElementById(
    "workersCount"
  ).innerText = `Field Workers: ${fieldWorkers}`;
  document.getElementById(
    "workerCost"
  ).innerText = `Buy Field Worker (${Math.floor(fieldWorkerCost)} Spuds)`;
  if (availableUpgradesFieldWorker > 0) {
    document.getElementById(
      "workerUpgrade"
    ).innerHTML = `Upgrade Field Workers <br>(${Math.floor(
      fieldWorkerUpgradeCost
    )} Spuds)<br>Available Upgrades: ${availableUpgradesFieldWorker}`;
  }
}

// Function to display error messages
function displayErrorMessage(message) {
  const errorElement = document.getElementById("error");
  errorElement.innerText = message;
  setTimeout(() => {
    errorElement.innerText = "";
  }, 1000);
}

// Set interval to update collected spuds
setInterval(increaseSpuds, 100); // Update every 100ms

// Update UI initially
updateUI();
