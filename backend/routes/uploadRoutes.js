import express from "express";
import { uploadPdf } from "../controller/uploadController.js";

const router = express.Router();

router.route("/", uploadPdf);

export default router;
