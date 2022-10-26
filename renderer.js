/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

// TODO list

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

// select file

const btn = document.getElementById('btn-file-path');
const filePathElement = document.getElementById('file-path');

btn.addEventListener('click', async () => {
  const filePathAndData = await window.electronAPI.selectFile();
  const {filePath, data} = filePathAndData;
  filePathElement.innerText = filePath;
  document.getElementById('main-content').innerText = data.toString();
});

// set title

const setTitleButton = document.getElementById('btn-set-title');
const titleInput = document.getElementById('title');
setTitleButton.addEventListener('click', () => {
  window.electronAPI.setTitle(titleInput.value);
});

// update counter value displayed in the UI

const counter = document.getElementById('counter');
window.electronAPI.handleCounter((event, value) => {
  const oldValue = Number(counter.innerText);
  const newValue = oldValue + value;
  counter.innerText = newValue;
  event.sender.send('counter-value', newValue);
});

