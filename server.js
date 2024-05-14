// const express = require("express");
// const fs = require("fs");
// const cors = require("cors");
// const path = require("path");
// const multer = require("multer");

// const app = express();
// app.use(cors());
// const port = 8080;

// // Simulated file metadata stored in a JSON object
// const filesMetadata = [
//   {
//     id: 1,
//     name: "sample.pdf",
//     date: "2024-05-08",
//     size: 1024, // File size in bytes
//     uri: "http://localhost:8080/download/sample.pdf",
//   },
//   {
//     id: 2,
//     name: "sample.jpg",
//     date: "2024-05-08",
//     size: 2048,
//     uri: "http://localhost:8080/download/sample.jpg",
//   },
//   {
//     id: 3,
//     name: "sample.doc",
//     date: "2024-05-08",
//     size: 3072,
//     uri: "http://localhost:8080/download/sample.doc",
//   },
//   {
//     id: 4,
//     name: "sample.csv",
//     date: "2024-05-08",
//     size: 4096,
//     uri: "http://localhost:8080/download/sample.csv",
//   },
//   {
//     id: 5,
//     name: "file_example_XLS_10.xls",
//     date: "2024-05-08",
//     size: 4096,
//     uri: "http://localhost:8080/download/file_example_XLS_10.xls",
//   },
//   {
//     id: 10,
//     name: "file_example_XLS_10.xls",
//     date: "2024-05-08",
//     size: 4096,
//     uri: "http://localhost:8080/download/file_example_XLS_10.xls",
//   },
//   {
//     id: 7,
//     name: "Kakamega_Urban_Area_Validation_Roll.xlsx",
//     date: "2024-05-08",
//     size: 4096,
//     uri: "http://localhost:8080/download/Kakamega_Urban_Area_Validation_Roll.xlsx",
//   },
// ];

// // Serve static files from the 'files' directory
// app.use(express.static(path.join(__dirname, "files")));
// app.use((req, res, next) => {
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
//   next();
// });

// // Endpoint to get a list of all files with their metadata
// app.get("/files", (req, res) => {
//   res.json(filesMetadata);
// });

// // Endpoint to serve files based on file name
// app.get("/download/:fileName", (req, res) => {
//   const fileName = req.params.fileName;
//   const filePath = path.join(__dirname, "files", fileName);

//   // Check if the file exists
//   if (fs.existsSync(filePath)) {
//     // Set appropriate content type based on file extension
//     let contentType;
//     switch (path.extname(filePath)) {
//       case ".pdf":
//         contentType = "application/pdf";
//         break;
//       case ".jpg":
//         contentType = "image/jpeg";
//         break;
//       case ".doc":
//         contentType = "application/msword";
//         break;
//       case ".csv":
//         contentType = "text/csv";
//         break;
//       case ".xlsx":
//         contentType =
//           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
//         break;
//       case ".xls":
//         contentType = "application/vnd.ms-excel";
//         break;
//       default:
//         contentType = "application/octet-stream";
//     }

//     // Set the appropriate headers for file download
//     res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
//     res.setHeader("Content-Type", contentType);

//     // Stream the file to the client
//     const fileStream = fs.createReadStream(filePath);
//     fileStream.pipe(res);
//   } else {
//     res.status(404).send("File not found");
//   }
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const multer = require("multer");

const app = express();
app.use(cors());
const port = 8080;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});

const upload = multer({ storage: storage });

// File metadata JSON file path
const metadataFilePath = path.join(__dirname, "fileMetadata.json");

// Function to read file metadata from JSON file
const readMetadataFromFile = () => {
  try {
    const metadata = JSON.parse(fs.readFileSync(metadataFilePath, "utf8"));
    return metadata;
  } catch (error) {
    console.error("Error reading file metadata:", error);
    return [];
  }
};

// Function to write file metadata to JSON file
const writeMetadataToFile = (metadata) => {
  try {
    fs.writeFileSync(metadataFilePath, JSON.stringify(metadata, null, 2));
  } catch (error) {
    console.error("Error writing file metadata:", error);
  }
};

// Initialize file metadata from JSON file
let filesMetadata = readMetadataFromFile();

// Serve static files from the 'files' directory
app.use(express.static(path.join(__dirname, "files")));
app.use(express.static(path.join(__dirname, "uploads"))); // Serve uploaded files

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Endpoint to get a list of all files with their metadata
app.get("/files", (req, res) => {
  res.json(filesMetadata);
});

// Endpoint to serve files based on file name
app.get("/download/:fileName", (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "uploads", fileName);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set appropriate content type based on file extension
    let contentType;
    switch (path.extname(filePath)) {
      case ".pdf":
        contentType = "application/pdf";
        break;
      case ".jpg":
        contentType = "image/jpeg";
        break;
      case ".doc":
        contentType = "application/msword";
        break;
      case ".docx":
        contentType =
          "	application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        break;
      case ".csv":
        contentType = "text/csv";
        break;
      case ".xlsx":
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      case ".xls":
        contentType = "application/vnd.ms-excel";
        break;
      default:
        contentType = "application/octet-stream";
    }

    // Set the appropriate headers for file download
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    res.setHeader("Content-Type", contentType);

    // Stream the file to the client
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).send("File not found");
  }
});

// Endpoint to upload files (supports single and multiple files)
app.post("/upload", upload.array("files"), (req, res) => {
  // Retrieve uploaded files
  const uploadedFiles = req.files;

  // Process uploaded files
  const uploadedFileMetadata = uploadedFiles.map((file) => ({
    id: Date.now() + Math.floor(Math.random() * 1000), // Generate a unique ID
    name: file.originalname,
    date: new Date().toISOString().split("T")[0], // Get the current date in YYYY-MM-DD format
    size: file.size,
    uri: `http://localhost:${port}/download/${file.filename}`,
  }));

  // Update filesMetadata with new file metadata
  filesMetadata.push(...uploadedFileMetadata);

  // Write updated metadata to JSON file
  writeMetadataToFile(filesMetadata);

  res.json({
    message: "Files uploaded successfully",
    files: uploadedFileMetadata,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
