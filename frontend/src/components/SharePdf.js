import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import axios from "axios";
import helper from "./helper/helper";

function SharePdf() {
  const { id } = useParams();
  const [pdfFile, setPdfFile] = useState("");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const getPdf = async () => {
      const { data } = await axios.get(`${helper}/pdf/${id}`);
      setPdfFile("data:application/pdf;base64," + data.base64Data);
    };
    getPdf();
  }, [id]);

  return (
    <div className="shared-viewer">
      {pdfFile ? (
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfFile}
            plugins={[defaultLayoutPluginInstance]}
          ></Viewer>
        </Worker>
      ) : (
        <>
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        </>
      )}

      {/* render this if we have pdfFile state null   */}
      {!pdfFile && <>No file is selected yet</>}
    </div>
  );
}

export default SharePdf;
