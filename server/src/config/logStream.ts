import path from "path";
import fs from "fs";

const createAccessLogStream = () => {
  // Directory and name of the log file
  const logDirectory = path.join(__dirname, "..", "logs");
  const logFilePath = path.join(logDirectory, "access.log");
  try {
    // Create the logs directory if it doesn't exist
    if (!fs.existsSync(logDirectory)) {
      fs.mkdirSync(logDirectory);
    }
    // Create a write stream for the log file
    return fs.createWriteStream(logFilePath, {
      flags: "a",
    });
  } catch (err) {
    console.log(err);
  }
};

export default createAccessLogStream;
