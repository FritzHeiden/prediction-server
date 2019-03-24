const fs = require("fs");

class FileSystem {
  async writeFile(filePath, buffer) {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, buffer, error => {
        if (error) reject(error);
        resolve();
      });
    });
  }
}

const fileSystem = new FileSystem();

module.exports = fileSystem;
