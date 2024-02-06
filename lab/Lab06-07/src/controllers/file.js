const fs = require("fs").promises;
const { existsSync } = require("fs");
const mime = require("mime-types");
const path = require("path");
const { formidable } = require("formidable");
const zipper = require("zip-local");
const { Blob } = require("buffer");

let rootFolder = path
  .join(__dirname, "public", "root")
  .replace("controllers", "");

getChildrenOfFolder = async (folderPath) => {
  // extract the path after root and replace all \ to / then remove the first / to get desired result
  let dirPathForClient = rootFolder
    .split("root")[1]
    .replace(/\\/g, "/")
    .replace(/^\//, "");

  const items = [];
  const files = await fs.readdir(rootFolder);
  for (let file of files) {
    const stats = await fs.stat(path.join(rootFolder, file));
    const type = mime.lookup(file) == false ? "folder" : mime.lookup(file);
    let item = {
      name: file,
      path:
        type == "folder"
          ? "/home?dir=" + path.join(dirPathForClient, file).replace(/\\/g, "/")
          : "/root/" + path.join(dirPathForClient, file).replace(/\\/g, "/"),
      type,
      size: type != "folder" ? handleByte(stats.size) : "-",
      icon: handleIcon(type),
      updatedAt: new Date(stats.mtime).toLocaleDateString("en-GB"),
    };
    items.push(item);
  }
  items.sort((item1, item2) => {
    if (item1.type == "folder" && item2.type != "folder") {
      return -1;
    } else if (item1.type != "folder" && item2.type == "folder") {
      return 1;
    }
    return 0;
  });
  return items;
};

exports.renderPage = async (req, res) => {
  // The browser's back history does not send requests to the server in Node.js

  // if req.query.dir is undefined, it means we are in the home folder
  if (req.query.dir != undefined) {
    // replace after root with query dir
    const rootIndex = rootFolder.indexOf("\\root"); // find the index of \root
    // rootIndex is position of \ in \root and plus with length of \root to get all the beginning path
    rootFolder = path.join(
      rootFolder.substring(0, rootIndex + "\\root".length),
      req.query.dir
    );
  } else {
    rootFolder = path
      .join(__dirname, "public", "root")
      .replace("controllers", "");
  }
  try {
    const breadcrumbs = [];
    if (req.query.dir != undefined) {
      let breadcrumb = ""; // accumulator
      const dirComponents = req.query.dir.split("/");
      for (let i = 0; i < dirComponents.length; i++) {
        if (breadcrumb != "") {
          breadcrumb += "/" + dirComponents[i];
        } else {
          breadcrumb += dirComponents[i];
        }
        breadcrumbs.push({
          path: "/home?dir=" + breadcrumb,
          name: dirComponents[i],
        });
      }
    }
    const items = await getChildrenOfFolder(rootFolder);
    res.render("index", { items, breadcrumbs });
  } catch (err) {
    console.log(err);
  }
};

exports.createNewFolder = async (req, res) => {
  const { folderName } = req.body;
  let dirPathForClient = rootFolder
    .split("root")[1]
    .replace(/\\/g, "/")
    .replace(/^\//, "");
  try {
    if (existsSync(path.join(rootFolder, folderName))) {
      res.status(500).json({
        status: "fail",
        message: "Folder already exist",
      });
    } else {
      await fs.mkdir(path.join(rootFolder, folderName));
      res.status(200).json({
        status: "success",
        path:
          "/home?dir=" +
          path.join(dirPathForClient, folderName).replace(/\\/g, "/"),
        createdAt: new Date().toLocaleDateString("en-GB"),
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.addNewFile = async (req, res, next) => {
  let dirPathForClient = rootFolder
    .split("root")[1]
    .replace(/\\/g, "/")
    .replace(/^\//, "");
  let { fileName, fileContent } = req.body;
  const fileExtension = ".txt";
  fileName += fileExtension;
  try {
    await fs.writeFile(path.join(rootFolder, fileName), fileContent);
    const type =
      mime.lookup(fileName) == false ? "folder" : mime.lookup(fileName);
    const fileSize = new Blob([fileContent]).size;
    res.status(201).json({
      status: "success",
      message: "File created successfully",
      data: {
        name: fileName,
        type,
        path:
          "/root/" + path.join(dirPathForClient, fileName).replace(/\\/g, "/"),
        size: type != "folder" ? handleByte(fileSize) : "-",
        icon: handleIcon(type),
        updatedAt: new Date().toLocaleDateString("en-GB"),
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.renameFileOrFolder = async (req, res) => {
  const { oldName, newName } = req.body;
  try {
    await fs.rename(
      path.join(rootFolder, oldName),
      path.join(rootFolder, newName)
    );
    res.status(200).json({
      status: "success",
      message: "File renamed successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteFileOrFolder = async (req, res) => {
  const { fileNameDelete } = req.body;
  try {
    await fs.rm(path.join(rootFolder, fileNameDelete), { recursive: true });
    res.status(200).json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    // need to pass the current path
    const { keyword } = req.body;
    const items = await getChildrenOfFolder(rootFolder);
    const result = items.filter((item) => item.name.includes(keyword));
    res.status(200).json({
      status: "success",
      data: {
        items: result,
      },
    });
  } catch (err) {
    console.log(err);
  }
};

exports.uploadFile = (req, res, next) => {
  let dirPathForClient = rootFolder
    .split("root")[1]
    .replace(/\\/g, "/")
    .replace(/^\//, "");
  const form = formidable({});

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    const { fileUpload } = files;

    const data = [];
    for (const file of fileUpload) {
      await fs.copyFile(
        file.filepath,
        path.join(rootFolder, file.originalFilename)
      );
      const type = mime.lookup(file.originalFilename);
      data.push({
        name: file.originalFilename,
        type,
        path:
          "/root/" +
          path
            .join(dirPathForClient, file.originalFilename)
            .replace(/\\/g, "/"),
        size: handleByte(file.size),
        icon: handleIcon(type),
        updatedAt: new Date().toLocaleDateString("en-GB"),
      });
    }
    res.status(200).json({
      status: "success",
      message: "File uploaded successfully",
      data,
    });
  });
};

exports.downloadFile = async (req, res, next) => {
  const { name, type } = req.query;
  if (type == "folder") {
    const zipFileName = `${name}.zip`;
    zipper.sync.zip(path.join(rootFolder, name)).compress().save(zipFileName);
    res.setHeader("Content-Type", mime.lookup(zipFileName));
    res.download(zipFileName);
    await fs.rm(zipFileName);
  } else {
    res.download(path.join(rootFolder, name));
  }
};

const handleIcon = (fileType) => {
  switch (fileType.split("/")[0]) {
    case "folder":
      return "fa-folder";
    case "image":
      return "fa-file-image";
    case "video":
      return "fa-file-video";
    case "audio":
      return "fa-file-music";
    case "text":
      return "fa-file";
    case "application":
      return "fa-file-archive";
  }
};

const handleByte = (byte) => {
  if (byte > 1024) {
    return `${(byte / 1024).toFixed(1)} KB`;
  } else if (byte > Math.pow(1024, 2)) {
    return `${(byte / Math.pow(1024, 2)).toFixed(1)} MB`;
  } else if (byte > Math.pow(1024, 3)) {
    return `${(byte / Math.pow(1024, 3)).toFixed(1)} GB`;
  }
  return `${byte} B`;
};
