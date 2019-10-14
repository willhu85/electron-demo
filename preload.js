"use strict";

const fileSystem = require("./fileSystem");
const userInterface = require("./userInterface");

window.addEventListener("DOMContentLoaded", () => {
  userInterface.bindDocument(window);
  const folderPath = fileSystem.getUserHomeFolder();
  const currentFloder = document.getElementById("current-folder");
  currentFloder.innerText = fileSystem.getUserHomeFolder();
  userInterface.loadDirectory(folderPath);
});
