"use static";

let document;
const fileSystem = require("./fileSystem");
const search = require("./search");
const path = require("path");

// 处理地址,转换成可点击链接
function convertFolderPathIntoLinks(folderPath) {
  const folders = folderPath.split(path.sep);
  const contents = [];
  let pathAtFolder = "";
  folders.forEach(folder => {
    pathAtFolder += folder + path.sep;
    contents.push(
      `<span class="path" data-path="${pathAtFolder.slice(
        0,
        -1
      )}">${folder}</span>`
    );
  });
  return contents.join(path.sep).toString();
}

// 更新文件目录地址
function displayFloderPath(folderPath) {
  const currentFloder = document.getElementById("current-folder");
  currentFloder.innerHTML = convertFolderPathIntoLinks(folderPath);
  bindCurrentFolderPath();
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
  // return function(window) {
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
  // };
}

function displayFile(file) {
  const mainArea = document.getElementById("main-area");
  const template = document.querySelector("#item-template");
  let clone = document.importNode(template.content, true);
  search.addToIndex(file);
  if (file.type === "file") {
    clone.querySelector("img").src = `https://img.icons8.com/color/2x/file.png`;
    clone.querySelector("img").setAttribute("data-filePath", file.path);
    clone.querySelector("img").addEventListener(
      "dblclick",
      () => {
        fileSystem.openFile(file.path);
      },
      false
    );
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
  var validFilePaths = results.map(result => {
    return result.ref;
  });
  const items = document.getElementsByClassName("item");
  for (let i = 0; i < items.length; i++) {
    let item = items[i];
    let filePath = item
      .getElementsByTagName("img")[0]
      .getAttribute("data-filePath");
    if (validFilePaths.indexOf(filePath) != -1) {
      item.style = null;
    } else {
      item.style = "display:none";
    }
  }
}

function resetFilter() {
  const items = document.getElementsByClassName("item");
  for (let i = 0; i < items.length; i++) {
    items[i].style = null;
  }
}

function bindCurrentFolderPath() {
  const load = event => {
    const folderPath = event.target.getAttribute("data-path");
    loadDirectory(folderPath);
  };
  const paths = document.getElementsByClassName("path");
  for (let i = 0; i < paths.length; i++) {
    paths[i].addEventListener("click", load, false);
  }
}

module.exports = {
  bindDocument,
  displayFiles,
  loadDirectory,
  bindSearchField,
  filterResults,
  resetFilter
};
