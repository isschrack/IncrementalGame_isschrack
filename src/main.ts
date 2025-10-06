import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

declare global {
  var counter_click: (increment: number) => void;
  var user_click: number;
}

let alien_counter = 0;
let user_click = 1;
//set jets back to 0 when you're done testing
let jets = 1;
let tanks = 0;
let nukes = 0;

//increases the alien counter by the increment value
function counter_click(increment: number): void {
  alien_counter += increment;
  document.querySelector("[label='counter']")!.textContent =
    `Aliens Captured: ${alien_counter}`;
  console.log(alien_counter);
}

globalThis.counter_click = counter_click;
globalThis.user_click = user_click;

let clicker_interval = setInterval(counter_click, 1000, jets, tanks, nukes);

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
  <div label='counter'>Aliens Captured: ${alien_counter}</div>
  <button onclick="counter_click(${user_click})">👽</button>
`;
