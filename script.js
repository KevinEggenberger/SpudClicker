// Variables
let collectedSpuds = 0;
let fieldWorkers = 0;
let harvestingMachines = 0;
let spudsPerSecond = 0; // Spuds per second

let fieldWorkerCost = 50; // Cost for one Field Worker
let fieldWorkerUpgradeCost = 10000; // Initial cost for the upgrade
let harvestingMachineCost = 200;
let harvestingMachineUpgradeCost = 50000;

let availableUpgradesFieldWorker = 0; // Counter for available upgrades
let upgradesPurchasedFieldWorker = 0; // Counter for purchased upgrades
let availableUpgradesHarvestingMachine = 0; // Counter for available upgrades
let upgradesPurchasedHarvestingMachine = 0; // Counter for purchased upgrades

// Load game state when the page loads
window.onload = () => {
  loadGame();
  updateUI(); // Update the UI after loading the game state
};

// Function to format numbers with apostrophes
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

// Function for clicking the Spud
function clickSpud() {
  collectedSpuds += 1;
  updateUI();
  saveGame();
}

// Function to increase collected spuds based on spudsPerSecond
function increaseSpuds() {
  collectedSpuds += spudsPerSecond / 10; // Update every 100ms, so divide by 10
  updateUI();
}

// Function to calculate the cost of multiple Field Workers
function calculateTotalCostFieldWorker(quantity) {
  let totalCostFieldWorker = 0;
  let currentCostFieldWorker = fieldWorkerCost;
  for (let i = 0; i < quantity; i++) {
    totalCostFieldWorker += currentCostFieldWorker;
    currentCostFieldWorker = Math.ceil(currentCostFieldWorker * 1.1);
  }
  return totalCostFieldWorker;
}

// Function to calculate the cost of multiple Harvesting Machines
function calculateTotalCostHarvestingMachine(quantity) {
  let totalCostHarvestingMachine = 0;
  let currentCostHarvestingMachine = harvestingMachineCost;
  for (let i = 0; i < quantity; i++) {
    totalCostHarvestingMachine += currentCostHarvestingMachine;
    currentCostHarvestingMachine = Math.ceil(
      currentCostHarvestingMachine * 1.1
    );
  }
  return totalCostHarvestingMachine;
}

// Function for buying Field Workers
function buyFieldWorkers(quantity) {
  const totalCostFieldWorker = calculateTotalCostFieldWorker(quantity);
  if (collectedSpuds >= totalCostFieldWorker) {
    collectedSpuds -= totalCostFieldWorker;
    fieldWorkers += quantity;
    spudsPerSecond += quantity * Math.pow(2, upgradesPurchasedFieldWorker); // Each Field Worker increases yield by 1 Spud per second, doubled by each upgrade
    for (let i = 0; i < quantity; i++) {
      fieldWorkerCost = Math.ceil(fieldWorkerCost * 1); // Increase the cost of Field Workers by 10% for each worker
    }
    checkForUpgradeFieldWorker(); // Check if upgrade is available
    updateUI();
    saveGame();
  } else {
    displayErrorMessage("Not enough Spuds!");
  }
}

// Function for buying Harvesting Machines
function buyHarvestingMachines(quantity) {
  const totalCostHarvestingMachine =
    calculateTotalCostHarvestingMachine(quantity);
  if (collectedSpuds >= totalCostHarvestingMachine) {
    collectedSpuds -= totalCostHarvestingMachine;
    harvestingMachines += quantity;
    spudsPerSecond +=
      quantity * 5 * Math.pow(2, upgradesPurchasedHarvestingMachine); // Each Harvesting Machine increases yield by 5 Spuds per second, doubled by each upgrade
    for (let i = 0; i < quantity; i++) {
      harvestingMachineCost = Math.ceil(harvestingMachineCost * 1); // Increase the cost of Harvesting Machines by 10% for each machine
    }
    checkForUpgradeHarvestingMachine(); // Check if upgrade is available
    updateUI();
    saveGame();
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
    spudsPerSecond += fieldWorkers * Math.pow(2, upgradesPurchasedFieldWorker); // Double the yield for each Field Worker for each upgrade
    fieldWorkerUpgradeCost = Math.ceil(fieldWorkerUpgradeCost * 1.5); // Increase the cost of the next upgrade
    availableUpgradesFieldWorker--; // Decrease the count of available upgrades
    upgradesPurchasedFieldWorker++; // Increase the count of purchased upgrades
    if (availableUpgradesFieldWorker === 0) {
      document.getElementById("workerUpgrade").style.display = "none"; // Hide the upgrade button
    }
    updateUI();
    saveGame();
  } else {
    displayErrorMessage("Not enough Spuds for upgrade!");
  }
}

// Function for upgrading Harvesting Machines
function upgradeHarvestingMachines() {
  if (
    collectedSpuds >= harvestingMachineUpgradeCost &&
    availableUpgradesHarvestingMachine > 0
  ) {
    collectedSpuds -= harvestingMachineUpgradeCost;
    spudsPerSecond +=
      harvestingMachines * 5 * Math.pow(2, upgradesPurchasedHarvestingMachine); // Double the yield for each Harvesting Machine for each upgrade
    harvestingMachineUpgradeCost = Math.ceil(
      harvestingMachineUpgradeCost * 1.5
    ); // Increase the cost of the next upgrade
    availableUpgradesHarvestingMachine--; // Decrease the count of available upgrades
    upgradesPurchasedHarvestingMachine++; // Increase the count of purchased upgrades
    if (availableUpgradesHarvestingMachine === 0) {
      document.getElementById("harvestingMachinesUpgrade").style.display =
        "none"; // Hide the upgrade button
    }
    updateUI();
    saveGame();
  } else {
    displayErrorMessage("Not enough Spuds for upgrade!");
  }
}

// Function to check if upgrade is available for Field Workers
function checkForUpgradeFieldWorker() {
  const totalUpgradesFieldWorker = Math.floor(fieldWorkers / 50);
  if (totalUpgradesFieldWorker > upgradesPurchasedFieldWorker) {
    availableUpgradesFieldWorker =
      totalUpgradesFieldWorker - upgradesPurchasedFieldWorker; // Set available upgrades
    document.getElementById("workerUpgrade").style.display = "block"; // Show the upgrade button
  }
}

// Function to check if upgrade is available for Harvesting Machines
function checkForUpgradeHarvestingMachine() {
  const totalUpgradesHarvestingMachine = Math.floor(harvestingMachines / 50);
  if (totalUpgradesHarvestingMachine > upgradesPurchasedHarvestingMachine) {
    availableUpgradesHarvestingMachine =
      totalUpgradesHarvestingMachine - upgradesPurchasedHarvestingMachine; // Set available upgrades
    document.getElementById("harvestingMachinesUpgrade").style.display =
      "block"; // Show the upgrade button
  }
}

// Function to display error messages
function displayErrorMessage(message) {
  const errorElement = document.getElementById("error");
  errorElement.textContent = message;
  setTimeout(() => {
    errorElement.textContent = "";
  }, 2000); // Clear the error message after 2 seconds
}

// Function to update the UI elements
function updateUI() {
  document.getElementById(
    "spudCount"
  ).textContent = `Collected Spuds: ${formatNumber(
    Math.floor(collectedSpuds)
  )}`;
  document.getElementById(
    "spudsPerSecond"
  ).textContent = `Spuds per second: ${formatNumber(
    Math.floor(spudsPerSecond)
  )}`;
  document.getElementById(
    "workersCount"
  ).textContent = `Field Workers: ${formatNumber(fieldWorkers)}`;
  document.getElementById(
    "workerCost"
  ).innerHTML = `Buy Field Worker<br>(${formatNumber(
    Math.floor(fieldWorkerCost)
  )} Spuds)<br>+${formatNumber(
    Math.pow(2, upgradesPurchasedFieldWorker)
  )} Spuds/sec`;
  document.getElementById(
    "workerCost10"
  ).innerHTML = `Buy 10 Field Workers<br>(${formatNumber(
    calculateTotalCostFieldWorker(10)
  )} Spuds)<br>+${formatNumber(
    10 * Math.pow(2, upgradesPurchasedFieldWorker)
  )} Spuds/sec`;
  document.getElementById(
    "workerCost100"
  ).innerHTML = `Buy 100 Field Workers<br>(${formatNumber(
    calculateTotalCostFieldWorker(100)
  )} Spuds)<br>+${formatNumber(
    100 * Math.pow(2, upgradesPurchasedFieldWorker)
  )} Spuds/sec`;
  document.getElementById(
    "harvestingMachineCount"
  ).textContent = `Harvesting Machines: ${formatNumber(harvestingMachines)}`;
  document.getElementById(
    "harvestingMachineCost"
  ).innerHTML = `Buy Harvesting Machine<br>(${formatNumber(
    Math.floor(harvestingMachineCost)
  )} Spuds)<br>+${formatNumber(
    5 * Math.pow(2, upgradesPurchasedHarvestingMachine)
  )} Spuds/sec`;
  document.getElementById(
    "harvestingMachine10"
  ).innerHTML = `Buy 10 Harvesting Machines<br>(${formatNumber(
    calculateTotalCostHarvestingMachine(10)
  )} Spuds)<br>+${formatNumber(
    50 * Math.pow(2, upgradesPurchasedHarvestingMachine)
  )} Spuds/sec`;
  document.getElementById(
    "harvestingMachine100"
  ).innerHTML = `Buy 100 Harvesting Machines<br>(${formatNumber(
    calculateTotalCostHarvestingMachine(100)
  )} Spuds)<br>+${formatNumber(
    500 * Math.pow(2, upgradesPurchasedHarvestingMachine)
  )} Spuds/sec`;
  document.getElementById("availableUpgradesFieldWorker");
  document.getElementById(
    "workerUpgrade"
  ).innerHTML = `Upgrade Field Workers<br>(${formatNumber(
    Math.floor(fieldWorkerUpgradeCost)
  )} Spuds)<br>Available Upgrades: ${availableUpgradesFieldWorker}`;
  document.getElementById(
    "harvestingMachinesUpgrade"
  ).innerHTML = `Upgrade Harvesting Machines<br>(${formatNumber(
    Math.floor(harvestingMachineUpgradeCost)
  )} Spuds)<br>Available Upgrades: ${availableUpgradesHarvestingMachine}`;
}

// Function to save the game state to local storage
function saveGame() {
  const gameState = {
    collectedSpuds,
    fieldWorkers,
    harvestingMachines,
    spudsPerSecond,
    fieldWorkerCost,
    fieldWorkerUpgradeCost,
    harvestingMachineCost,
    harvestingMachineUpgradeCost,
    availableUpgradesFieldWorker,
    upgradesPurchasedFieldWorker,
    availableUpgradesHarvestingMachine,
    upgradesPurchasedHarvestingMachine,
  };
  localStorage.setItem("idleGameState", JSON.stringify(gameState));
}

// Function to load the game state from local storage
function loadGame() {
  const savedState = localStorage.getItem("idleGameState");
  if (savedState) {
    const gameState = JSON.parse(savedState);
    collectedSpuds = gameState.collectedSpuds;
    fieldWorkers = gameState.fieldWorkers;
    harvestingMachines = gameState.harvestingMachines;
    spudsPerSecond = gameState.spudsPerSecond;
    fieldWorkerCost = gameState.fieldWorkerCost;
    fieldWorkerUpgradeCost = gameState.fieldWorkerUpgradeCost;
    harvestingMachineCost = gameState.harvestingMachineCost;
    harvestingMachineUpgradeCost = gameState.harvestingMachineUpgradeCost;
    availableUpgradesFieldWorker = gameState.availableUpgradesFieldWorker;
    upgradesPurchasedFieldWorker = gameState.upgradesPurchasedFieldWorker;
    availableUpgradesHarvestingMachine =
      gameState.availableUpgradesHarvestingMachine;
    upgradesPurchasedHarvestingMachine =
      gameState.upgradesPurchasedHarvestingMachine;
  }
}

// Function to reset the game state
function resetGame() {
  collectedSpuds = 0;
  fieldWorkers = 0;
  harvestingMachines = 0;
  spudsPerSecond = 0;
  fieldWorkerCost = 50;
  fieldWorkerUpgradeCost = 10000;
  harvestingMachineCost = 200;
  harvestingMachineUpgradeCost = 50000;
  availableUpgradesFieldWorker = 0;
  upgradesPurchasedFieldWorker = 0;
  availableUpgradesHarvestingMachine = 0;
  upgradesPurchasedHarvestingMachine = 0;
  saveGame();
  updateUI();
}

// Update spuds every 100ms
setInterval(increaseSpuds, 100);

// Save game state every second
setInterval(saveGame, 1000);
