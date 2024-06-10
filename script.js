// Variables
let collectedSpuds = 0;
let fieldWorkers = 0;
let harvestingMachines = 0;
let automatedPlanters = 0;
let waterSprinklers = 0;
let spudsPerSecond = 0; // Spuds per second

let fieldWorkerCost = 50; // Cost for one Field Worker 1/sec
let fieldWorkerUpgradeCost = 10000; // Initial cost for the upgrade
let harvestingMachineCost = 200; // 5/sec
let harvestingMachineUpgradeCost = 50000;
let automatedPlanterCost = 1000; // Cost for one Automated Planter 25/s
let automatedPlanterUpgradeCost = 200000;
let waterSprinklerCost = 5000; // Cost for one Water Sprinkler System 125/s
let waterSprinklerUpgradeCost = 500000;

let availableUpgradesFieldWorker = 0; // Counter for available upgrades
let upgradesPurchasedFieldWorker = 0; // Counter for purchased upgrades
let availableUpgradesHarvestingMachine = 0; // Counter for available upgrades
let upgradesPurchasedHarvestingMachine = 0; // Counter for purchased upgrades
let availableUpgradesAutomatedPlanter = 0; // Counter for available upgrades
let upgradesPurchasedAutomatedPlanter = 0; // Counter for purchased upgrades
let availableUpgradesWaterSprinkler = 0; // Counter for available upgrades
let upgradesPurchasedWaterSprinkler = 0; // Counter for purchased upgrades

let lastUpdateTime = Date.now(); // Variable to store the last update time

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
  const now = Date.now();
  const deltaTime = (now - lastUpdateTime) / 1000; // Convert to seconds
  collectedSpuds += spudsPerSecond * deltaTime; // Calculate spuds collected during the inactive time
  lastUpdateTime = now;
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

// Function to calculate the cost of multiple Automated Planter
function calculateTotalCostAutomatedPlanter(quantity) {
  let totalCostAutomatedPlanter = 0;
  let currentCostAutomatedPlanter = automatedPlanterCost;
  for (let i = 0; i < quantity; i++) {
    totalCostAutomatedPlanter += currentCostAutomatedPlanter;
    currentCostAutomatedPlanter = Math.ceil(currentCostAutomatedPlanter * 1.1);
  }
  return totalCostAutomatedPlanter;
}

/*// Function to calculate the cost of multiple Water Sprinklers
function calculateTotalCostWaterSprinkler(quantity) {
  let totalCostWaterSprinkler = 0;
  let currentCostWaterSprinkler = waterSprinklerCost;
  for (let i = 0; i < quantity; i++) {
    totalCostWaterSprinkler += currentCostWaterSprinkler;
    currentCostWaterSprinkler = Math.ceil(currentCostWaterSprinkler * 1.1);
  }
  return totalCostWaterSprinkler;
}*/

function calculateTotalCostWaterSprinkler(quantity) {
  let totalCostWaterSprinkler = 0;
  let currentCostWaterSprinkler = waterSprinklerCost;
  // /*console.log(`Initial Water Sprinkler Cost: ${currentCostWaterSprinkler}`);
  for (let i = 0; i < quantity; i++) {
    totalCostWaterSprinkler += currentCostWaterSprinkler;
    currentCostWaterSprinkler = Math.ceil(currentCostWaterSprinkler * 1.1);
  }
  // console.log(
  //   `Total Cost for ${quantity} Water Sprinklers: ${totalCostWaterSprinkler}`
  // );
  return totalCostWaterSprinkler;
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
      harvestingMachineCost = Math.ceil(harvestingMachineCost * 1.1); // Increase the cost of Harvesting Machines by 10% for each machine
    }
    checkForUpgradeHarvestingMachine(); // Check if upgrade is available
    updateUI();
    saveGame();
  } else {
    displayErrorMessage("Not enough Spuds!");
  }
}

// Function for buying Automated Planters
function buyAutomatedPlanters(quantity) {
  const totalCostAutomatedPlanter =
    calculateTotalCostAutomatedPlanter(quantity);
  if (collectedSpuds >= totalCostAutomatedPlanter) {
    collectedSpuds -= totalCostAutomatedPlanter;
    automatedPlanters += quantity;
    spudsPerSecond +=
      quantity * 25 * Math.pow(2, upgradesPurchasedAutomatedPlanter); // Each Automated Planter increases yield by 25 Spuds per second, doubled by each upgrade
    for (let i = 0; i < quantity; i++) {
      automatedPlanterCost = Math.ceil(automatedPlanterCost * 1.1); // Increase the cost of Automated Planters by 10% for each machine
    }
    checkForUpgradeAutomatedPlanter(); // Check if upgrade is available
    updateUI();
    saveGame();
  } else {
    displayErrorMessage("Not enough Spuds!");
  }
}

/*// Function for buying Water Sprinklers
function buyWaterSprinklers(quantity) {
  const totalCostWaterSprinkler = calculateTotalCostWaterSprinkler(quantity);
  if (collectedSpuds >= totalCostWaterSprinkler) {
    collectedSpuds -= totalCostWaterSprinkler;
    waterSprinklers += quantity;
    spudsPerSecond +=
      quantity * 125 * Math.pow(2, upgradesPurchasedWaterSprinkler); // Each Water Sprinkler increases yield by 125 Spuds per second, doubled by each upgrade
    for (let i = 0; i < quantity; i++) {
      waterSprinklerCost = Math.ceil(waterSprinklerCost * 1.1); // Increase the cost of Water Sprinklers by 10% for each machine
    }
    checkForUpgradeWaterSprinkler(); // Check if upgrade is available
    updateUI();
    saveGame();
  } else {
    displayErrorMessage("Not enough Spuds!");
  }
}*/

function buyWaterSprinklers(quantity) {
  console.log(waterSprinklerCost);
  console.log(`Trying to buy ${quantity} Water Sprinklers`);
  console.log(`Collected Spuds: ${collectedSpuds}`);
  const totalCostWaterSprinkler = calculateTotalCostWaterSprinkler(quantity);
  console.log(
    `Total Cost for ${quantity} Water Sprinklers: ${totalCostWaterSprinkler}`
  );
  if (collectedSpuds >= totalCostWaterSprinkler) {
    collectedSpuds -= totalCostWaterSprinkler;
    waterSprinklers += quantity;
    spudsPerSecond +=
      quantity * 125 * Math.pow(2, upgradesPurchasedWaterSprinkler); // Each Water Sprinkler increases yield by 125 Spuds per second, doubled by each upgrade
    console.log(waterSprinklerCost);
    for (let i = 0; i < quantity; i++) {
      waterSprinklerCost = Math.ceil(waterSprinklerCost * 1.1); // Increase the cost of Water Sprinklers by 10% for each machine
    }
    console.log(waterSprinklerCost);
    checkForUpgradeWaterSprinkler(); // Check if upgrade is available
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
      harvestingMachines * 5 * Math.pow(2, upgradesPurchasedHarvestingMachine); // x5 the yield for each Harvesting Machine for each upgrade
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

// Function for upgrading Automated Planters
function upgradeAutomatedPlanters() {
  if (
    collectedSpuds >= automatedPlanterUpgradeCost &&
    availableUpgradesAutomatedPlanter > 0
  ) {
    collectedSpuds -= automatedPlanterUpgradeCost;
    spudsPerSecond +=
      automatedPlanters * 25 * Math.pow(2, upgradesPurchasedAutomatedPlanter); // x25 the yield for each Automated Planter for each upgrade
    automatedPlanterUpgradeCost = Math.ceil(automatedPlanterUpgradeCost * 1.5); // Increase the cost of the next upgrade
    availableUpgradesAutomatedPlanter--; // Decrease the count of available upgrades
    upgradesPurchasedAutomatedPlanter++; // Increase the count of purchased upgrades
    if (availableUpgradesAutomatedPlanter === 0) {
      document.getElementById("automatedPlantersUpgrade").style.display =
        "none"; // Hide the upgrade button
    }
    updateUI();
    saveGame();
  } else {
    displayErrorMessage("Not enough Spuds for upgrade!");
  }
}

// Function for upgrading Water Sprinklers
function upgradeWaterSprinklers() {
  if (
    collectedSpuds >= waterSprinklerUpgradeCost &&
    availableUpgradesWaterSprinkler > 0
  ) {
    collectedSpuds -= waterSprinklerUpgradeCost;
    spudsPerSecond +=
      waterSprinklers * 125 * Math.pow(2, upgradesPurchasedWaterSprinkler); // x125 the yield for each Water Sprinkler for each upgrade
    waterSprinklerUpgradeCost = Math.ceil(waterSprinklerUpgradeCost * 1.5); // Increase the cost of the next upgrade
    availableUpgradesWaterSprinkler--; // Decrease the count of available upgrades
    upgradesPurchasedWaterSprinkler++; // Increase the count of purchased upgrades
    if (availableUpgradesWaterSprinkler === 0) {
      document.getElementById("waterSprinklersUpgrade").style.display = "none"; // Hide the upgrade button
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

// Function to check if upgrade is available for Automated Planters
function checkForUpgradeAutomatedPlanter() {
  const totalUpgradesAutomatedPlanter = Math.floor(automatedPlanters / 50);
  if (totalUpgradesAutomatedPlanter > upgradesPurchasedAutomatedPlanter) {
    availableUpgradesAutomatedPlanter =
      totalUpgradesAutomatedPlanter - upgradesPurchasedAutomatedPlanter; // Set available upgrades
    document.getElementById("automatedPlantersUpgrade").style.display = "block"; // Show the upgrade button
  }
}

// Function to check if upgrade is available for Water Sprinklers
function checkForUpgradeWaterSprinkler() {
  const totalUpgradesWaterSprinkler = Math.floor(waterSprinklers / 50);
  if (totalUpgradesWaterSprinkler > upgradesPurchasedWaterSprinkler) {
    availableUpgradesWaterSprinkler =
      totalUpgradesWaterSprinkler - upgradesPurchasedWaterSprinkler; // Set available upgrades
    document.getElementById("waterSprinklersUpgrade").style.display = "block"; // Show the upgrade button
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
  // Field Worker
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
  // Harvesting Machine
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
  // Automated Planter
  document.getElementById(
    "automatedPlanterCount"
  ).textContent = `Automated Planters: ${formatNumber(automatedPlanters)}`;
  document.getElementById(
    "automatedPlanterCost"
  ).innerHTML = `Buy Automated Planter<br>(${formatNumber(
    Math.floor(automatedPlanterCost)
  )} Spuds)<br>+${formatNumber(
    25 * Math.pow(2, upgradesPurchasedAutomatedPlanter)
  )} Spuds/sec`;
  document.getElementById(
    "automatedPlanter10"
  ).innerHTML = `Buy 10 Automated Planters<br>(${formatNumber(
    calculateTotalCostAutomatedPlanter(10)
  )} Spuds)<br>+${formatNumber(
    250 * Math.pow(2, upgradesPurchasedAutomatedPlanter)
  )} Spuds/sec`;
  document.getElementById(
    "automatedPlanter100"
  ).innerHTML = `Buy 100 Automated Planters<br>(${formatNumber(
    calculateTotalCostAutomatedPlanter(100)
  )} Spuds)<br>+${formatNumber(
    2500 * Math.pow(2, upgradesPurchasedAutomatedPlanter)
  )} Spuds/sec`;
  // Water Sprinklers
  document.getElementById(
    "waterSprinklerCount"
  ).textContent = `Water Sprinklers: ${formatNumber(waterSprinklers)}`;
  document.getElementById(
    "waterSprinklerCost"
  ).innerHTML = `Buy Water Sprinkler<br>(${formatNumber(
    Math.floor(waterSprinklerCost)
  )} Spuds)<br>+${formatNumber(
    125 * Math.pow(2, upgradesPurchasedWaterSprinkler)
  )} Spuds/sec`;
  document.getElementById(
    "waterSprinkler10"
  ).innerHTML = `Buy 10 Water Sprinklers<br>(${formatNumber(
    calculateTotalCostWaterSprinkler(10)
  )} Spuds)<br>+${formatNumber(
    1250 * Math.pow(2, upgradesPurchasedWaterSprinkler)
  )} Spuds/sec`;
  document.getElementById(
    "waterSprinkler100"
  ).innerHTML = `Buy 100 Water Sprinklers<br>(${formatNumber(
    calculateTotalCostWaterSprinkler(100)
  )} Spuds)<br>+${formatNumber(
    12500 * Math.pow(2, upgradesPurchasedWaterSprinkler)
  )} Spuds/sec`;
  // Upgrades UI
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
  document.getElementById(
    "automatedPlantersUpgrade"
  ).innerHTML = `Upgrade Automated Planters<br>(${formatNumber(
    Math.floor(automatedPlanterUpgradeCost)
  )} Spuds)<br>Available Upgrades: ${availableUpgradesAutomatedPlanter}`;
  document.getElementById(
    "waterSprinklersUpgrade"
  ).innerHTML = `Upgrade Water Sprinklers<br>(${formatNumber(
    Math.floor(waterSprinklerUpgradeCost)
  )} Spuds)<br>Available Upgrades: ${availableUpgradesWaterSprinkler}`;
}

// Function to save the game state to local storage
function saveGame() {
  const gameState = {
    collectedSpuds,
    fieldWorkers,
    harvestingMachines,
    automatedPlanters,
    waterSprinklers,
    spudsPerSecond,
    fieldWorkerCost,
    fieldWorkerUpgradeCost,
    harvestingMachineCost,
    harvestingMachineUpgradeCost,
    automatedPlanterCost,
    automatedPlanterUpgradeCost,
    waterSprinklerCost,
    waterSprinklerUpgradeCost,
    availableUpgradesFieldWorker,
    upgradesPurchasedFieldWorker,
    availableUpgradesHarvestingMachine,
    upgradesPurchasedHarvestingMachine,
    availableUpgradesAutomatedPlanter,
    upgradesPurchasedAutomatedPlanter,
    availableUpgradesWaterSprinkler,
    upgradesPurchasedWaterSprinkler,
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
    automatedPlanters = gameState.automatedPlanters;
    waterSprinklers = gameState.waterSprinklers;
    spudsPerSecond = gameState.spudsPerSecond;
    fieldWorkerCost = gameState.fieldWorkerCost;
    fieldWorkerUpgradeCost = gameState.fieldWorkerUpgradeCost;
    harvestingMachineCost = gameState.harvestingMachineCost;
    harvestingMachineUpgradeCost = gameState.harvestingMachineUpgradeCost;
    automatedPlanterCost = gameState.automatedPlanterCost;
    automatedPlanterUpgradeCost = gameState.automatedPlanterUpgradeCost;
    waterSprinklerCost = gameState.waterSprinklerCost;
    waterSprinklerUpgradeCost = gameState.waterSprinklerUpgradeCost;
    availableUpgradesFieldWorker = gameState.availableUpgradesFieldWorker;
    upgradesPurchasedFieldWorker = gameState.upgradesPurchasedFieldWorker;
    availableUpgradesHarvestingMachine =
      gameState.availableUpgradesHarvestingMachine;
    upgradesPurchasedHarvestingMachine =
      gameState.upgradesPurchasedHarvestingMachine;
    availableUpgradesAutomatedPlanter =
      gameState.availableUpgradesAutomatedPlanter;
    upgradesPurchasedAutomatedPlanter =
      gameState.upgradesPurchasedAutomatedPlanter;
    availableUpgradesWaterSprinkler = gameState.availableUpgradesWaterSprinkler;
    upgradesPurchasedWaterSprinkler = gameState.upgradesPurchasedWaterSprinkler;
    lastUpdateTime = Date.now(); // Reset the last update time
  }
}

// Function to reset the game state
function resetGame() {
  collectedSpuds = 10000000;
  fieldWorkers = 0;
  harvestingMachines = 0;
  automatedPlanters = 0;
  waterSprinklers = 0;
  spudsPerSecond = 0;
  fieldWorkerCost = 50;
  fieldWorkerUpgradeCost = 10000;
  harvestingMachineCost = 200;
  harvestingMachineUpgradeCost = 50000;
  automatedPlanterCost = 1000;
  automatedPlanterUpgradeCost = 200000;
  waterSprinklerCost = 5000;
  waterSprinklerUpgradeCost = 500000;
  availableUpgradesFieldWorker = 0;
  upgradesPurchasedFieldWorker = 0;
  availableUpgradesHarvestingMachine = 0;
  upgradesPurchasedHarvestingMachine = 0;
  availableUpgradesAutomatedPlanter = 0;
  upgradesPurchasedAutomatedPlanter = 0;
  availableUpgradesWaterSprinkler = 0;
  upgradesPurchasedWaterSprinkler = 0;
  saveGame();
  updateUI();
}

// Update spuds every 100ms
setInterval(increaseSpuds, 100);

// Save game state every second
setInterval(saveGame, 1000);

// Handle tab visibility change
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    increaseSpuds();
  } else {
    lastUpdateTime = Date.now(); // Save the time when the tab is hidden
  }
});
