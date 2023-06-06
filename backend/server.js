import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import asyncHandler from "express-async-handler";
import { fileURLToPath } from "url";
import fs from "fs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import path from "path";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

dotenv.config();
const secretKey = process.env.SECRET_KEY;

var userId;

const app = express();
app.use(express.json());
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://pdfman.netlify.app",
    methods: ["GET", "POST"],
  },
});

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//schema

const pdfSchema = new mongoose.Schema(
  {
    name: String,
    path: String,
    contentType: String,
    data: Buffer,
    base64Data: String,
    user: String,
    comments: [String],
  },
  { timestamps: true }
);

const PDF = mongoose.model("PDF", pdfSchema);

//
app.get("/", (req, res) => {
  res.json({ message: "Hye" });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(path.join(__dirname, "../"));

app.post(
  "/api/uploadpdf",
  asyncHandler(async (req, res) => {
    upload(req, res, function (err) {
      const filepath = path.join(__dirname, "../") + req.file.path;

      fs.readFile(filepath, { encoding: "base64" }, (err, data) => {
        if (err) {
          console.error("Failed to read PDF file", err);
          return;
        }
        PDF.create({
          name: req.file.originalname,
          path: filepath,
          contentType: req.file.mimetype,
          base64Data: data,
          user: userId,
        });
      });

      return res.status(200).send(req.file);
    });

    console.log("post req");
  })
);

app.get(
  "/allpdfs",
  asyncHandler(async (req, res) => {
    const fetchedPdfs = await PDF.find({ user: userId });
    res.json(fetchedPdfs);
  })
);

//signup-signin form
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    userId = user._id.toString();
    if (user) {
      await user.save();
      const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });

      res.status(200).json({ token });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  })
);

app.post(
  "/login",
  asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;
      // Find the user in the database
      const user = await User.findOne({ email });
      userId = user._id.toString();
      if (!user) {
        res.status(404);
        throw new Error("User Not Found");
      }
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Authentication failed" });
        return;
      }
      const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });

      res.status(200).json({ token });
    } catch (error) {
      console.error("Login error", error);
      res.status(500).json({ message: "Login failed" });
    }
  })
);

app.get(
  "/logout",
  asyncHandler(async (req, res) => {
    userId = undefined;
  })
);

app.delete(
  "/delete/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;

    const file = await PDF.findByIdAndRemove(pdfId);

    if (!file) {
      console.error("Failed to delete PDF");
      res.status(500).send("Failed to delete PDF");
      return;
    }
    res.status(200).json({ message: "PDF deleted successfully" });
  })
);

app.get(
  "/pdf/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;

    // Find the PDF document by ID
    const file = await PDF.findById(pdfId);
    if (file) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Invalid PDF File" });
    }
  })
);
app.get(
  "/pdf/shared/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;

    // Find the PDF document by ID
    const file = await PDF.findById(pdfId);
    if (file) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Invalid PDF File" });
    }
  })
);

app.get(
  "/pdf/allcomments/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;
    const file = await PDF.findById(pdfId);
    if (file) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Unable to Save" });
    }
  })
);

app.post(
  "/pdf/comments/:id",
  asyncHandler(async (req, res) => {
    const pdfId = req.params.id;
    const { message } = req.body;
    const file = await PDF.findById(pdfId);
    file.comments.push(message);
    const saved = await file.save();
    if (saved) {
      res.json(file);
    } else {
      res.status(500).json({ message: "Unable to Save" });
    }
  })
);

const PORT = process.env.PORT || 5000;

server.listen(PORT, console.log("Server is running on Port", PORT));
