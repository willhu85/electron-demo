"use static";

let document;
const fileSystem = require("./fileSystem");
const search = require("./search");

// 更新文件目录地址
function displayFloderPath(folderPath) {
  const currentFloder = document.getElementById("current-folder");
  currentFloder.innerText = folderPath;
}

function clearView() {
  const mainArea = document.getElementById("main-area");
  let firstChild = mainArea.firstChild;
  while (firstChild) {
    mainArea.removeChild(firstChild);
    firstChild = mainArea.firstChild;
  }
}
function loadDirectory(folderPath) {
  //   return function(window) {
  if (!document) document = window.document;
  search.resetIndex();
  displayFloderPath(folderPath);
  fileSystem.getFilesInFolder(folderPath, (err, files) => {
    clearView();
    if (err) {
      return alert("打开路径错误");
    }

    fileSystem.inspectAndDescirbeFiles(folderPath, files, displayFiles);
  });
  //   };
}

function displayFile(file) {
  const mainArea = document.getElementById("main-area");
  const template = document.querySelector("#item-template");
  let clone = document.importNode(template.content, true);
  search.addEventListener(file);
  if (file.type === "file") {
    clone.querySelector("img").src = `https://img.icons8.com/color/2x/file.png`;
    clone.querySelector("img").setAttribute("data-filePath", file.path);
  } else {
    clone.querySelector(
      "img"
    ).src = `https://img.icons8.com/color/2x/opened-folder.png`;
    clone.querySelector("img").setAttribute("data-filePath", file.path);
    clone.querySelector("img").addEventListener(
      "dblclick",
      () => {
        loadDirectory(file.path);
      },
      false
    );
  }

  clone.querySelector(".filename").innerText = file.file;
  mainArea.appendChild(clone);
}

// 显示文件
function displayFiles(err, files) {
  if (err) {
    return alert("没有发现文件");
  }
  files.forEach(displayFile);
}

function bindDocument(window) {
  if (!document) {
    document = window.document;
  }
}

function bindSearchField(cb) {
  document.getElementById("search").addEventListener("keyup", cb, false);
}

function filterResults(results) {
  const item = document.getElementById("item");
  for (let i = 0; i < item.length; i++) {
    items[i].style = null;
  }
}

module.exports = {
  bindDocument,
  displayFiles,
  loadDirectory,
  bindSearchField,
  filterResults
};
