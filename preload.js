const osenv = require("osenv"); // 用于获取系统用户文件夹路劲，兼容mac,win，linux
const fs = require("fs"); // 文件系统
const path = require("path"); // 路径系统
const async = require("async"); // 异步操作库
// 获取用户路径
function getUserHomeFolder() {
  return osenv.home();
}
// // 获取文件夹内文件
function getFilesInFolder(folderPath, callback) {
  fs.readdir(folderPath, callback);
}
// 获取文件详情
function inspectAndDescirbeFile(filePath, callback) {
  let result = {
    file: path.basename(filePath),
    path: filePath,
    type: ""
  };
  fs.stat(filePath, (err, stat) => {
    if (err) {
      callback(err);
    } else {
      if (stat.isFile()) {
        result.type = "file";
      }
      if (stat.isDirectory()) {
        result.type = "directory";
      }
      callback(err, result);
    }
  });
}

// 获取文件列表
function inspectAndDescirbeFiles(folderPath, files, callback) {
  async.map(
    files,
    (file, asyncCallback) => {
      let resolvedFilePath = path.resolve(folderPath, file);
      inspectAndDescirbeFile(resolvedFilePath, asyncCallback);
    },
    callback
  );
}
function displayFile(file) {
  const mainArea = document.getElementById("main-area");
  const template = document.querySelector("#item-template");
  let clone = document.importNode(template.content, true);
  if (file.type === "file") {
    clone.querySelector("img").src = `https://img.icons8.com/color/2x/file.png`;
  } else {
    clone.querySelector(
      "img"
    ).src = `https://img.icons8.com/color/2x/opened-folder.png`;
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

window.addEventListener("DOMContentLoaded", () => {
  const folderPath = getUserHomeFolder();
  const currentFloder = document.getElementById("current-folder");
  currentFloder.innerText = getUserHomeFolder();

  getFilesInFolder(folderPath, (err, files) => {
    if (err) {
      return alert("打开路径错误");
    }
    inspectAndDescirbeFiles(folderPath, files, displayFiles);
  });
});
