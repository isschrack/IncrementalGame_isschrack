import alienImage from "./alien_cookie_clicker.png";
import "./style.css";

declare global {
  var counter_update: (increment: number) => void;
  var user_click: number;
  var upgrade: (type: string) => void;
  var jets: number;
  var tanks: number;
  var nukes: number;
}

interface Upgrade {
  name: string,
  price: number,
  growth_rate: number
};

let alien_counter = 0;
let lastTimestamp = performance.now();
const user_click = 1;

const availableUpgrades: Upgrade[] = [
  {name: "Jet", price: 10, growth_rate: 0.1},
  {name: "Tank", price: 100, growth_rate: 2},
  {name: "Nuke", price: 1000, growth_rate: 50},
];

function _get_growth_rate(): number {
  const growth_rate = jets * 0.1 + tanks * 2 + nukes * 50;
  document.querySelector("[label='growth_rate']")!.textContent =
    `Growth Rate: ${growth_rate.toFixed(1)} Aliens/sec`;
  return growth_rate;
}

//increases the alien counter by the increment value
function counter_update(increment: number): void {
  alien_counter += increment;
}

function upgrade(type: string): void {
  switch (type) {
    case "jet":
      if (alien_counter >= availableUpgrades[0].price) {
        counter_update(-availableUpgrades[0].price);
        availableUpgrades[0].price *= 1.15;
        jets++;
        document.querySelector("[label='jet_count']")!.textContent =
          `Jets: ${jets}`;
        console.log(jets);
      }
      break;
    case "tank":
      if (alien_counter >= availableUpgrades[1].price) {
        counter_update(-availableUpgrades[1].price);
        availableUpgrades[1].price *= 1.15;
        tanks++;
        document.querySelector("[label='tank_count']")!.textContent =
          `Tanks: ${tanks}`;
      }
      break;
    case "nuke":
      if (alien_counter >= availableUpgrades[2].price) {
        counter_update(-availableUpgrades[2].price);
        availableUpgrades[2].price *= 1.15;
        nukes++;
        document.querySelector("[label='nuke_count']")!.textContent =
          `Nukes: ${nukes}`;
      }
      break;
  }
}

globalThis.counter_update = counter_update;
globalThis.user_click = user_click;
globalThis.upgrade = upgrade;

function animateCounter(currentTimestamp: number) {
  const elapsed = (currentTimestamp - lastTimestamp) / 1000; // seconds
  lastTimestamp = currentTimestamp;
  counter_update(_get_growth_rate() * elapsed);
  document.querySelector("[label='counter_display']")!.textContent =
    `Aliens Captured: ${alien_counter.toFixed(1)}`;
  document.querySelector("[label='jet_button']")!.textContent = `Buy Jet (${
    jet_price.toFixed(2)
  } Aliens)`;
  document.querySelector("[label='tank_button']")!.textContent = `Buy Tank (${
    tank_price.toFixed(2)
  } Aliens)`;
  document.querySelector("[label='nuke_button']")!.textContent = `Buy Nuke (${
    nuke_price.toFixed(2)
  } Aliens)`;
  //Continue the animation loop
  requestAnimationFrame(animateCounter);
}

// Start the animation
requestAnimationFrame(animateCounter);

document.body.innerHTML = `
  <div class="center-container">
    <div label='counter_display'></div>
    <div label='growth_rate'></div>
    <button class="clicker_button" label='clicker_button' onclick="counter_update(${user_click})"><img src="${alienImage}" class="icon"/></button>
    <br>

    <div class=upgrades>
      <button label='jet_button' onclick="upgrade('jet')"></button>
      <div label='jet_count'>Jets: 0</div>
      <button label='tank_button' onclick="upgrade('tank')"></button>
      <div label='tank_count'>Tanks: 0</div>
      <button label='nuke_button' onclick="upgrade('nuke')"></button>
      <div label='nuke_count'>Nukes: 0</div>
    </div>
  </div>
`;
