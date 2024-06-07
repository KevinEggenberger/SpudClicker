// Variables
let collectedSpuds = 0;
let fieldWorkers = 0;
let spudsPerSecond = 0; // Spuds per second

let fieldWorkerCost = 5; // Cost for one Field Worker
let fieldWorkerUpgradeCost = 100; // Initial cost for the upgrade

let availableUpgradesFieldWorker = 0; // Counter for available upgrades
let upgradesPurchasedFieldWorker = 0; // Counter for purchased upgrades

// Function to format numbers with apostrophes
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

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

// Function to calculate the cost of multiple Field Workers
function calculateTotalCost(quantity) {
  let totalCost = 0;
  let currentCost = fieldWorkerCost;
  for (let i = 0; i < quantity; i++) {
    totalCost += currentCost;
    currentCost = Math.ceil(currentCost * 1.1);
  }
  return totalCost;
}

// Function for buying Field Workers
function buyFieldWorkers(quantity) {
  const totalCost = calculateTotalCost(quantity);
  if (collectedSpuds >= totalCost) {
    collectedSpuds -= totalCost;
    fieldWorkers += quantity;
    spudsPerSecond += quantity; // Each Field Worker increases yield by 1 Spud per second
    for (let i = 0; i < quantity; i++) {
      fieldWorkerCost = Math.ceil(fieldWorkerCost * 1.1); // Increase the cost of Field Workers by 10% for each worker
    }
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
    fieldWorkerUpgradeCost = Math.ceil(fieldWorkerUpgradeCost * 1.5); // Increase the cost of the next upgrade
    availableUpgradesFieldWorker--; // Decrease the count of available upgrades
    upgradesPurchasedFieldWorker++; // Increase the count of purchased upgrades
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
  if (totalUpgrades > upgradesPurchasedFieldWorker) {
    availableUpgradesFieldWorker = totalUpgrades - upgradesPurchasedFieldWorker; // Set available upgrades
    document.getElementById("workerUpgrade").style.display = "block"; // Show the upgrade button
  }
}

// Function to update the UI
function updateUI() {
  document.getElementById(
    "spudCount"
  ).innerText = `Collected Spuds: ${formatNumber(Math.floor(collectedSpuds))}`;
  document.getElementById(
    "spudsPerSecond"
  ).innerText = `Spuds per second: ${formatNumber(spudsPerSecond)}`;
  document.getElementById(
    "workersCount"
  ).innerText = `Field Workers: ${formatNumber(fieldWorkers)}`;
  document.getElementById(
    "workerCost"
  ).innerHTML = `Buy Field Worker <br>(${formatNumber(
    Math.floor(fieldWorkerCost)
  )} Spuds)`;
  document.getElementById(
    "workerCost10"
  ).innerHTML = `Buy 10 Field Workers <br>(${formatNumber(
    calculateTotalCost(10)
  )} Spuds)`;
  document.getElementById(
    "workerCost100"
  ).innerHTML = `Buy 100 Field Workers <br>(${formatNumber(
    calculateTotalCost(100)
  )} Spuds)`;
  if (availableUpgradesFieldWorker > 0) {
    document.getElementById(
      "workerUpgrade"
    ).innerHTML = `Upgrade Field Workers <br>(${formatNumber(
      Math.floor(fieldWorkerUpgradeCost)
    )} Spuds) <br>Available Upgrades: ${availableUpgradesFieldWorker}`;
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
