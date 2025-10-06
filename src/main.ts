import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

declare global {
  var counter_click: () => void;
}

let alien_counter = 0;

function counter_click(): void {
  alien_counter += 1;
  document.querySelector("[label='counter']")!.textContent =
    `Aliens Captured: ${alien_counter}`;
  console.log(alien_counter);
}
globalThis.counter_click = counter_click;

document.body.innerHTML = `
  <p>Example image asset: <img src="${exampleIconUrl}" class="icon" /></p>
  <div label='counter'>Aliens Captured: ${alien_counter}</div>
  <button onclick="counter_click()">👽</button>
`;
