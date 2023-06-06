import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Import Worker
import { Worker } from "@react-pdf-viewer/core";
// Import the main Viewer component
import { Viewer } from "@react-pdf-viewer/core";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
// default layout plugin
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import styles of default layout plugin
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useParams, useNavigate } from "react-router-dom";
import helper from "./helper/helper";

import axios from "axios";

function ViewPDF() {
  const [pdfFile, setPdfFile] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  //Room State

  // Messages States
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const url = window.location.href;
  const sharedURL = url.split("/").slice(0, -1).join("/");

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/");
  }

  useEffect(() => {}, [allMessages]);

  useEffect(() => {
    const getComments = async () => {
      const { data } = await axios.get(`${helper}/pdf/allcomments/${id}`);
      setAllMessages(data.comments);
    };
    getComments();
  });

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const getPdf = async () => {
      const { data } = await axios.get(`${helper}/pdf/${id}`);
      setPdfFile("data:application/pdf;base64," + data.base64Data);
    };
    getPdf();
  }, [id]);
  useEffect(() => {}, [pdfFile]);
  const sendMessage = async () => {
    if (message) {
      await axios.post(`${helper}/pdf/comments/${id}`, { message });
      setMessage("");
    }
  };

  return (
    <div className="container">
      <div className="viewer">
        {pdfFile ? (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.6.172/build/pdf.worker.min.js">
            <Viewer
              theme="dark"
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
      <div className="rightaside">
        <div className="shared-div">
          <p>Collaborate with your logged-in friends by sharing this PDF. </p>
          <CopyToClipboard text={url}>
            <button>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1827/1827973.png"
                alt="SHARE"
              />
            </button>
          </CopyToClipboard>
        </div>
        <div className="shared-div">
          <p>Share Only</p>
          <CopyToClipboard text={`${sharedURL}/shared/${id}`}>
            <button>
              <img
                src="https://cdn-icons-png.flaticon.com/512/1827/1827973.png"
                alt="SHARE"
              />
            </button>
          </CopyToClipboard>
        </div>
        <div className="message-box">
          <div className="message-heading">
            <h5>Chat</h5>
          </div>
          <div className="messages">
            <div>
              {allMessages &&
                allMessages.map((m, i) => {
                  return (
                    <div className="message-tiles" key={i}>
                      <div>{m}</div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="message-inp-box">
          <input
            placeholder="Add Comment..."
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            value={message}
          />
          <button onClick={sendMessage}>
            {" "}
            <img
              src="https://cdn-icons-png.flaticon.com/512/736/736212.png"
              alt="Send"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewPDF;
