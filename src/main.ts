import alienImage from "./alien_cookie_clicker.png";
import bgImage from "./aliens_attacking.png";
import "./style.css";

/*
  Sections:
  - Data (types, state, upgrades)
  - Core Logic (growth calculation, state mutation)
  - UI Construction (buildUI)
  - Initialization (wire globals, start loop)
*/

declare global {
  var counter_update: (increment: number) => void;
  var user_click: number;
  var _upgrade: (type: string) => void;
}

// ------------------ Data ------------------
interface Upgrade {
  name: string;
  price: number;
  growth_rate: number;
  counter: number;
  description: string;
}

let alien_counter = 0;
let lastTimestamp = performance.now();
const user_click = 1;

const availableUpgrades: Upgrade[] = [
  {
    name: "jet",
    price: 10,
    growth_rate: 0.1,
    counter: 0,
    description: "We need backup! Increases alien production by 0.1/sec",
  },
  {
    name: "tank",
    price: 100,
    growth_rate: 2,
    counter: 0,
    description:
      "Things are getting serious! Increases alien production by 2/sec",
  },
  {
    name: "nuke",
    price: 1000,
    growth_rate: 50,
    counter: 0,
    description: "Bring in the big guns! Increases alien production by 50/sec",
  },
  {
    name: "laser",
    price: 5000,
    growth_rate: 150,
    counter: 0,
    description: "Precision strikes! Increases alien production by 150/sec",
  },
  {
    name: "blackhole",
    price: 20000,
    growth_rate: 500,
    counter: 0,
    description: "Unleash cosmic power! Increases alien production by 500/sec",
  },
];

// UI references populated by buildUI()
type UIRefs = {
  counterDisplay: HTMLElement | null;
  growthRateDisplay: HTMLElement | null;
  upgradeButtons: Map<string, HTMLButtonElement>;
  upgradeCountEls: Map<string, HTMLElement>;
};

const ui: UIRefs = {
  counterDisplay: null,
  growthRateDisplay: null,
  upgradeButtons: new Map(),
  upgradeCountEls: new Map(),
};

// ------------------ Core Logic ------------------
function _get_growth_rate(): number {
  let growth_rate = 0;
  for (const item of availableUpgrades) {
    growth_rate += item.growth_rate * item.counter;
  }
  if (ui.growthRateDisplay) {
    ui.growthRateDisplay.textContent = `Growth Rate: ${
      growth_rate.toFixed(1)
    } Aliens/sec`;
  }
  return growth_rate;
}

// increases the alien counter by the increment value
function counter_update(increment: number): void {
  alien_counter += increment;
}

function _upgrade(type: string): void {
  for (const item of availableUpgrades) {
    if (item.name === type && alien_counter >= item.price) {
      counter_update(-item.price);
      item.price *= 1.15;
      item.counter++;
      // update UI immediately for the purchased upgrade
      const btn = ui.upgradeButtons.get(item.name);
      if (btn) btn.textContent = `Buy ${item.name} (${item.price.toFixed(2)})`;
      const countEl = ui.upgradeCountEls.get(item.name);
      if (countEl) countEl.textContent = `${item.name}s: ${item.counter}`;
    }
  }
}

function autoUpdate(currentTimestamp: number) {
  const elapsed = (currentTimestamp - lastTimestamp) / 1000; // seconds
  lastTimestamp = currentTimestamp;
  counter_update(_get_growth_rate() * elapsed);

  // Update display
  if (ui.counterDisplay) {
    ui.counterDisplay.textContent = `Aliens: ${alien_counter.toFixed(1)}`;
  }

  // Update upgrade counts and prices for visible upgrades
  for (const item of availableUpgrades) {
    if (item.counter > 0) {
      const btn = ui.upgradeButtons.get(item.name);
      if (btn) btn.textContent = `Buy ${item.name} (${item.price.toFixed(2)})`;
      const countEl = ui.upgradeCountEls.get(item.name);
      if (countEl) countEl.textContent = `${item.name}s: ${item.counter}`;
    }
  }

  // Continue the animation loop
  requestAnimationFrame(autoUpdate);
}

// expose some helpers to window for debugging or external wiring
globalThis.counter_update = counter_update;
globalThis.user_click = user_click;
globalThis._upgrade = _upgrade;

// ------------------ UI Construction ------------------
function buildUI() {
  // create a non-interactive full-viewport background div using the imported image
  const bgDiv = document.createElement("div");
  bgDiv.className = "app-bg";
  bgDiv.style.position = "fixed";
  bgDiv.style.top = "0";
  bgDiv.style.right = "0";
  bgDiv.style.bottom = "0";
  bgDiv.style.left = "0";
  bgDiv.style.backgroundImage = `url(${bgImage})`;
  bgDiv.style.backgroundSize = "cover";
  bgDiv.style.backgroundPosition = "center";
  bgDiv.style.backgroundRepeat = "no-repeat";
  bgDiv.style.zIndex = "-1"; // keep behind app UI
  bgDiv.style.pointerEvents = "none"; // don't intercept clicks
  document.body.appendChild(bgDiv);

  const centerContainer = document.createElement("div");
  centerContainer.className = "center-container";

  const counterDisplay = document.createElement("div");
  counterDisplay.setAttribute("label", "counter_display");
  centerContainer.appendChild(counterDisplay);
  ui.counterDisplay = counterDisplay;

  const growthRateDisplay = document.createElement("div");
  growthRateDisplay.setAttribute("label", "growth_rate");
  centerContainer.appendChild(growthRateDisplay);
  ui.growthRateDisplay = growthRateDisplay;

  const clickerButton = document.createElement("button");
  clickerButton.className = "clicker_button";
  clickerButton.setAttribute("label", "clicker_button");
  clickerButton.addEventListener("click", () => counter_update(user_click));
  const iconImg = document.createElement("img");
  iconImg.src = alienImage;
  iconImg.className = "icon";
  clickerButton.appendChild(iconImg);
  centerContainer.appendChild(clickerButton);

  centerContainer.appendChild(document.createElement("br"));

  const upgradesDiv = document.createElement("div");
  upgradesDiv.className = "upgrades";

  for (const item of availableUpgrades) {
    const btn = document.createElement("button");
    btn.setAttribute("label", `${item.name}_button`);
    btn.textContent = `Buy ${item.name} (${item.price})`;
    btn.addEventListener("click", () => _upgrade(item.name));
    upgradesDiv.appendChild(btn);
    ui.upgradeButtons.set(item.name, btn);

    const countDiv = document.createElement("div");
    countDiv.setAttribute("label", `${item.name}_count`);
    countDiv.textContent = `${item.name}s: ${item.counter}`;
    upgradesDiv.appendChild(countDiv);
    ui.upgradeCountEls.set(item.name, countDiv);

    const descDiv = document.createElement("div");
    descDiv.setAttribute("label", `${item.name}_description`);
    descDiv.textContent = item.description;
    upgradesDiv.appendChild(descDiv);
  }

  centerContainer.appendChild(upgradesDiv);
  document.body.appendChild(centerContainer);
}

// ------------------ Initialization ------------------
buildUI();
// start the update loop
requestAnimationFrame(autoUpdate);
