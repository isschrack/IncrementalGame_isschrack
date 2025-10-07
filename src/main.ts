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

let alien_counter = 0;
let lastTimestamp = performance.now();
const user_click = 1;

//Automated Clickers
let jets = 0;
let tanks = 0;
let nukes = 0;

function _get_growth_rate(): number {
  const growth_rate = jets * 0.1 + tanks * 2 + nukes * 50;
  document.querySelector("[label='growth_rate']")!.textContent =
    `Growth Rate: ${growth_rate.toFixed(1)} Aliens/sec`;
  return growth_rate;  
}

//increases the alien counter by the increment value
function counter_update(increment: number): void {
  alien_counter += increment;
  document.querySelector("[label='counter_display']")!.textContent =
    `Aliens Captured: ${alien_counter}`;
}

function upgrade(type: string): void {
  switch (type) {
    case "jet":
      if (alien_counter >= 10) {
        counter_update(-10);
        jets++;
        document.querySelector("[label='jet_count']")!.textContent =
          `Jets: ${jets}`;
        console.log(jets);
      }
      break;
    case "tank":
      if (alien_counter >= 100) {
        counter_update(-100);
        tanks++;
        document.querySelector("[label='tank_count']")!.textContent =
          `Tanks: ${tanks}`;
      }
      break;
    case "nuke":
      if (alien_counter >= 1000) {
        counter_update(-1000);
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
    `Aliens Captured: ${alien_counter.toFixed(0)}`;
  //Continue the animation loop
  requestAnimationFrame(animateCounter);
}

// Start the animation
requestAnimationFrame(animateCounter);

document.body.innerHTML = `
  <div label='counter_display'></div>
  <div label='growth_rate'></div>
  <button label='clicker_button' onclick="counter_update(${user_click})"><img src="${alienImage}" class="icon"/></button>

  <button label='jet_button' onclick="upgrade('jet')">Buy Jet (10 Aliens)</button>
  <div label='jet_count'>${jets}</div>
  
  <button label='tank_button' onclick="upgrade('tank')">Buy Tank (100 Aliens)</button>
  <div label='tank_count'>${tanks}</div>

  <button label='nuke_button' onclick="upgrade('nuke')">Buy Nuke (1000 Aliens)</button>
  <div label='nuke_count'>${nukes}</div>
`;
