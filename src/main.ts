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

function _get_growth_rate(): number {
  let growth_rate = 0;
  for (const item of availableUpgrades) {
    growth_rate += item.growth_rate * item.counter;
  }
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
    }
  }
}

globalThis.counter_update = counter_update;
globalThis.user_click = user_click;
globalThis._upgrade = _upgrade;

function autoUpdate(currentTimestamp: number) {
  const elapsed = (currentTimestamp - lastTimestamp) / 1000; // seconds
  lastTimestamp = currentTimestamp;
  counter_update(_get_growth_rate() * elapsed);
  //Update display
  document.querySelector("[label='counter_display']")!.textContent = `Aliens: ${
    alien_counter.toFixed(1)
  }`;
  //Update upgrade counts
  for (const item of availableUpgrades) {
    if (item.counter > 0) {
      document.querySelector(
        `[label='${item.name}_button']`,
      )!.textContent = `Buy ${item.name} (${item.price.toFixed(2)})`;
      document.querySelector(
        `[label='${item.name}_count']`,
      )!.textContent = `${item.name}s: ${item.counter}`;
    }
  }
  //Continue the animation loop
  requestAnimationFrame(autoUpdate);
}

// Start the animation
requestAnimationFrame(autoUpdate);

document.body.innerHTML = `
  <div class="center-container">
    <div label='counter_display'></div>
    <div label='growth_rate'></div>
    <button class="clicker_button" label='clicker_button' onclick="counter_update(${user_click})"><img src="${alienImage}" class="icon"/></button>
    <br>

    <div class=upgrades>
      <button label='jet_button' onclick="_upgrade('jet')">Buy jet (10)</button>
      <div label='jet_count'>jets: 0</div>
      <div label='jet_description'>${availableUpgrades[0].description}</div>
      
      <button label='tank_button' onclick="_upgrade('tank')">Buy tank (100)</button>
      <div label='tank_count'>tanks: 0</div>
      <div label='tank_description'>${availableUpgrades[1].description}</div>
      
      <button label='nuke_button' onclick="_upgrade('nuke')">Buy nuke (1000)</button>
      <div label='nuke_count'>nukes: 0</div>
      <div label='nuke_description'>${availableUpgrades[2].description}</div>

      <button label='laser_button' onclick="_upgrade('laser')">Buy laser (5000)</button>
      <div label='laser_count'>lasers: 0</div>
      <div label='laser_description'>${availableUpgrades[3].description}</div>

      <button label='blackhole_button' onclick="_upgrade('blackhole')">Buy blackhole (20000)</button>
      <div label='blackhole_count'>blackholes: 0</div>
      <div label='blackhole_description'>${
  availableUpgrades[4].description
}</div>
    </div>
  </div>`;
