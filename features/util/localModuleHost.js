const express = require("express");
const fs = require("fs");
const zipdir = require("zip-dir");

const app = express();
const cwd = process.cwd();
const SERVER_PORT = 60118;
const BUILD_ZIP = "_build.zip";

app.get("/module.json", async (req, res) => {
  const manifest = JSON.parse(
    await fs.promises.readFile(`${cwd}/${req.path}`, "utf8")
  );
  manifest.download = `http://localhost:${SERVER_PORT}/${BUILD_ZIP}`;
  res.send(manifest);
});

app.get("/*", (req, res) => {
  fs.readFile(`${cwd}/${req.path}`, (err, data) => {
    if (err) {
      res.sendStatus(404);
    } else {
      res.send(data);
    }
  });
});

let instance;
function start() {
  return new Promise((resolve) => {
    zipdir(
      cwd,
      {
        saveTo: `${cwd}/_build.zip`,
        filter: (path) => !/\.zip$/.test(path),
      },
      () => {
        instance = app.listen(SERVER_PORT, () => {
          resolve(`http://localhost:${SERVER_PORT}/module.json`);
        });
      }
    );
  });
}

function stop() {
  instance.close();
  fs.rm(`${cwd}/${BUILD_ZIP}`, () => {});
}

module.exports = {
  start,
  stop,
};
