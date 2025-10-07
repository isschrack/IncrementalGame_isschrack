import alienImage from "./alien_cookie_clicker.png";
import jetIcon from "./jet_upgrade_icon.jpg";
import "./style.css";

declare global {
  var counter_click: (increment: number) => void;
  var user_click: number;
  var upgrade: (type: string) => void;
  var jets: number;
  var tanks: number;
  var nukes: number;
}

let alien_counter = 150;
let lastTimestamp = performance.now();
const user_click = 1;

//Automated Clickers
let jets = 0;
let tanks = 0;
let nukes = 0;
const total_automated_clickers = jets + tanks * 3 + nukes * 5;

//increases the alien counter by the increment value
function counter_click(increment: number): void {
  alien_counter += increment;
  document.querySelector("[label='counter_display']")!.textContent =
    `Aliens Captured: ${alien_counter}`;
  console.log(alien_counter);
}

function upgrade(type: string): void {
  switch (type) {
    case "jet":
      if (alien_counter >= 100) {
        alien_counter -= 100;
        jets++;
        document.querySelector("[label='jet_count']")!.textContent =
          `Jets: ${jets}`;
        console.log(jets);
      }
      break;
    case "tank":
      if (alien_counter >= 300) {
        alien_counter -= 300;
        tanks++;
        document.querySelector("[label='tank_upgrade']")!.textContent =
          `Tanks: ${tanks}`;
      }
      break;
    case "nuke":
      if (alien_counter >= 500) {
        alien_counter -= 500;
        nukes++;
        document.querySelector("[label='nuke_upgrade']")!.textContent =
          `Nukes: ${nukes}`;
      }
      break;
  }
}

globalThis.counter_click = counter_click;
globalThis.user_click = user_click;
globalThis.upgrade = upgrade;

function animateCounter(currentTimestamp: number) {
  const elapsed = (currentTimestamp - lastTimestamp) / 1000; // seconds
  lastTimestamp = currentTimestamp;
  counter_click(total_automated_clickers * elapsed);
  document.querySelector("[label='counter']")!.textContent =
    `Aliens Captured: ${alien_counter.toFixed(0)}`;

  //Continue the animation loop
  requestAnimationFrame(animateCounter);
}

// Start the animation
requestAnimationFrame(animateCounter);

document.body.innerHTML = `
  <div label='counter_display'></div>
  <button label='counter_button' onclick="counter_click(${user_click})"><img src="${alienImage}" class="icon"/></button>
  <div label='upgrades_display'>Upgrades:</div>
  <button label='jet_upgrade' onclick="upgrade('jet')"><img src="${jetIcon}" class="icon"/></button>
  <div label='jet_count'>Jets: ${jets}</div>`;
/*   <button label='tank_upgrade' onclick="upgrade('tank')"><img src="${tankIcon}" class="icon"/></button>
    <div label='tank_count'>Tanks: ${tanks}</div>
    <button label='nuke_upgrade' onclick="upgrade('nuke')"><img src="${nukeIcon}" class="icon"/></button>
    <div label='nuke_count'>Nukes: ${nukes}</div> */
