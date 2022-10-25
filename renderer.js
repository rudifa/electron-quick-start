/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

let list = document.getElementById('list');
let newTask = document.getElementById('newTask');
let addTask = document.getElementById('addTask');

addTask.addEventListener('click', () => {
  list.insertAdjacentHTML(
    'beforeend',
    `<li class="list-group-item">${newTask.value}</li>`
  );
  newTask.value = '';
});

const btn = document.getElementById('btn-file-path');
const filePathElement = document.getElementById('filePath');

btn.addEventListener('click', async () => {
  const filePath = await window.electronAPI.selectFile();
  filePathElement.innerText = filePath;
});

const setTitleButton = document.getElementById('btn-set-title');
const titleInput = document.getElementById('title');
setTitleButton.addEventListener('click', () => {
  window.electronAPI.setTitle(titleInput.value);
});

const counter = document.getElementById('counter');
window.electronAPI.handleCounter((event, value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue;
  event.sender.send('counter-value', newValue);
});
