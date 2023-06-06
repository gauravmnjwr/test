import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
  name: String,
  path: String,
});

const Pdf = mongoose.model("Pdf", pdfSchema);

export default Pdf;
