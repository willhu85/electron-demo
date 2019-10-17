"use strict";

const fileSystem = require("./fileSystem");
const userInterface = require("./userInterface");
const search = require("./search");

window.addEventListener("DOMContentLoaded", () => {
  userInterface.bindDocument(window);
  const folderPath = fileSystem.getUserHomeFolder();
  const currentFloder = document.getElementById("current-folder");
  currentFloder.innerText = fileSystem.getUserHomeFolder();
  userInterface.loadDirectory(folderPath);
  userInterface.bindSearchField(event => {
    const query = event.target.value;
    if (query === "") {
      userInterface.resetFilter();
    } else {
      search.find(query, userInterface.filterResults);
    }
  });
});
