import alienImage from "./alien_cookie_clicker.png";
import "./style.css";

declare global {
  var counter_update: (increment: number) => void;
  var user_click: number;
  var _upgrade: (type: string) => void;
}

interface Upgrade {
  name: string;
  price: number;
  growth_rate: number;
  counter: number;
}

let alien_counter = 0;
let lastTimestamp = performance.now();
const user_click = 1;

const availableUpgrades: Upgrade[] = [
  { name: "jet", price: 10, growth_rate: 0.1, counter: 0 },
  { name: "tank", price: 100, growth_rate: 2, counter: 0 },
  { name: "nuke", price: 1000, growth_rate: 50, counter: 0 },
];

function _get_growth_rate(): number {
  const growth_rate =
    availableUpgrades[0].growth_rate * availableUpgrades[0].counter +
    availableUpgrades[1].growth_rate * availableUpgrades[1].counter +
    availableUpgrades[2].growth_rate * availableUpgrades[2].counter;
  document.querySelector("[label='growth_rate']")!.textContent =
    `Growth Rate: ${growth_rate.toFixed(1)} Aliens/sec`;
  return growth_rate;
}

//increases the alien counter by the increment value
function counter_update(increment: number): void {
  alien_counter += increment;
}

function _upgrade(type: string): void {
  for (const item of availableUpgrades) {
    if (item.name === type && alien_counter >= item.price) {
      counter_update(-item.price);
      item.price *= 1.15;
      item.counter++;
      document.querySelector(
        `[label='${item.name}_count']`,
      )!.textContent = `${item.name}s: ${item.counter}`;
    }
  }
}

globalThis.counter_update = counter_update;
globalThis.user_click = user_click;
globalThis._upgrade = _upgrade;

function animateCounter(currentTimestamp: number) {
  const elapsed = (currentTimestamp - lastTimestamp) / 1000; // seconds
  lastTimestamp = currentTimestamp;
  counter_update(_get_growth_rate() * elapsed);
  document.querySelector("[label='counter_display']")!.textContent =
    `Aliens Captured: ${alien_counter.toFixed(1)}`;
  document.querySelector("[label='jet_button']")!.textContent = `Buy Jet (${
    availableUpgrades[0].price.toFixed(2)
  } Aliens)`;
  document.querySelector("[label='tank_button']")!.textContent = `Buy Tank (${
    availableUpgrades[1].price.toFixed(2)
  } Aliens)`;
  document.querySelector("[label='nuke_button']")!.textContent = `Buy Nuke (${
    availableUpgrades[2].price.toFixed(2)
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
      <button label='jet_button' onclick="_upgrade('jet')"></button>
      <div label='jet_count'>Jets: 0</div>
      <button label='tank_button' onclick="_upgrade('tank')"></button>
      <div label='tank_count'>Tanks: 0</div>
      <button label='nuke_button' onclick="_upgrade('nuke')"></button>
      <div label='nuke_count'>Nukes: 0</div>
    </div>
  </div>`;
