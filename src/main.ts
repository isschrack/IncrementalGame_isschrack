import alienImage from "./alien_cookie_clicker.png";
import "./style.css";

declare global {
  var counter_click: (increment: number) => void;
  var user_click: number;
}

let alien_counter = 0;
let lastTimestamp = performance.now();
const user_click = 1;
const baseButtonSize = 32;
let buttonPopped = false;

//Automated Clickers
const jets = 0;
const tanks = 0;
const nukes = 0;
const total_automated_clickers = jets * 1 + tanks * 3 + nukes * 5;

//increases the alien counter by the increment value
function counter_click(increment: number): void {
  alien_counter += increment;
  document.querySelector("[label='counter']")!.textContent =
    `Aliens Captured: ${alien_counter}`;
  buttonPopped = true;
  console.log(alien_counter);
}

globalThis.counter_click = counter_click;
globalThis.user_click = user_click;

function animateCounter(currentTimestamp: number) {
  const elapsed = (currentTimestamp - lastTimestamp) / 1000; // seconds
  lastTimestamp = currentTimestamp;
  counter_click(total_automated_clickers * elapsed);
  document.querySelector("[label='counter']")!.textContent =
    `Aliens Captured: ${alien_counter.toFixed(0)}`;

  const button = document.getElementById("alienButton") as HTMLButtonElement;
  if (button) {
    if (buttonPopped) {
      button.style.fontSize = `${baseButtonSize + 16}px`;
      button.style.width = `${(baseButtonSize + 16) * 2}px`;
      button.style.height = `${(baseButtonSize + 16) * 2}px`;
      buttonPopped = false; // reset for next frame
    } else {
      button.style.fontSize = `${baseButtonSize}px`;
      button.style.width = `${baseButtonSize * 2}px`;
      button.style.height = `${baseButtonSize * 2}px`;
    }
  }

  requestAnimationFrame(animateCounter);
}

// Start the animation
requestAnimationFrame(animateCounter);

document.body.innerHTML = `
  <div label='counter'>Aliens Captured: ${alien_counter}</div>
  <button onclick="counter_click(${user_click})"><img src="${alienImage}" class="icon"/></button>
`;
