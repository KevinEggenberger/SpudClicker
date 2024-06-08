// Variables
let collectedSpuds = 0;
let fieldWorkers = 0;
let harvestingMachine = 0;
let spudsPerSecond = 0; // Spuds per second

let fieldWorkerCost = 50; // Cost for one Field Worker
let fieldWorkerUpgradeCost = 10000; // Initial cost for the upgrade
let harvestingMachineCost = 200;
let harvestingMachineUpgradeCost = 50000;

let availableUpgradesFieldWorker = 0; // Counter for available upgrades
let upgradesPurchasedFieldWorker = 0; // Counter for purchased upgrades
let availableUpgradesHarvestingMachine = 0; // Counter for available upgrades
let upgradesPurchasedHarvestingMachine = 0; // Counter for purchased upgrades

// Function to format numbers with apostrophes
function formatNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

// Function for clicking the Spud -- 10% of collectedSpuds per click??
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
      fieldWorkerCost = Math.ceil(fieldWorkerCost * 1.1); // Increase the cost of Field Workers by 10% for each worker
    }
    checkForUpgradeFieldWorker(); // Check if upgrade is available
    updateUI();
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
    harvestingMachine += quantity;
    spudsPerSecond +=
      quantity * 5 * Math.pow(2, upgradesPurchasedHarvestingMachine); // Each Harvesting Machine increases yield by 5 Spuds per second, doubled by each upgrade
    for (let i = 0; i < quantity; i++) {
      harvestingMachineCost = Math.ceil(harvestingMachineCost * 1.1); // Increase the cost of Harvesting Machines by 10% for each machine
    }
    checkForUpgradeHarvestingMachine(); // Check if upgrade is available
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
    spudsPerSecond += fieldWorkers * Math.pow(2, upgradesPurchasedFieldWorker); // Double the yield for each Field Worker for each upgrade
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

// Function for upgrading Harvesting Machines
function upgradeHarvestingMachines() {
  if (
    collectedSpuds >= harvestingMachineUpgradeCost &&
    availableUpgradesHarvestingMachine > 0
  ) {
    collectedSpuds -= harvestingMachineUpgradeCost;
    spudsPerSecond +=
      harvestingMachine * 5 * Math.pow(2, upgradesPurchasedHarvestingMachine); // Double the yield for each Harvesting Machine for each upgrade
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
  const totalUpgradesHarvestingMachine = Math.floor(harvestingMachine / 50);
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
  )} Spuds)`;
  document.getElementById(
    "workerCost10"
  ).innerHTML = `Buy 10 Field Workers<br>(${formatNumber(
    calculateTotalCostFieldWorker(10)
  )} Spuds)`;
  document.getElementById(
    "workerCost100"
  ).innerHTML = `Buy 100 Field Workers<br>(${formatNumber(
    calculateTotalCostFieldWorker(100)
  )} Spuds)`;
  document.getElementById(
    "harvestingMachineCount"
  ).textContent = `Harvesting Machines: ${formatNumber(harvestingMachine)}`;
  document.getElementById(
    "harvestingMachineCost"
  ).innerHTML = `Buy Harvesting Machine<br>(${formatNumber(
    Math.floor(harvestingMachineCost)
  )} Spuds)`;
  document.getElementById(
    "harvestingMachine10"
  ).innerHTML = `Buy 10 Harvesting Machines<br>(${formatNumber(
    calculateTotalCostHarvestingMachine(10)
  )} Spuds)`;
  document.getElementById(
    "harvestingMachine100"
  ).innerHTML = `Buy 100 Harvesting Machines<br>(${formatNumber(
    calculateTotalCostHarvestingMachine(100)
  )} Spuds)`;
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

// Update spuds every 100 milliseconds (0.1 seconds)
setInterval(increaseSpuds, 100);
