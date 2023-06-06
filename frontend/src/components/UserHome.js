import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import FetchedData from "./FetchedData";
import { useNavigate } from "react-router-dom";
import helper from "./helper/helper";

function UserHome({ token, tokenChange }) {
  //   const [token, setToken] = useState("");

  useEffect(() => {}, [token]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploaded, setFileUploaded] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const formRef = useRef();

  // console.log(navigate(-2));
  function getExtension(filename) {
    return filename.split(".").pop();
  }

  const handelPDFChange = (e) => {
    const size = Number(e.target.files[0].size / 1000000);
    console.log(size);
    const ext = getExtension(e.target.files[0].name);
    console.log(ext.toLowerCase());
    if (size > 12.5) {
      setMessage("Please choose a PDF under 12 MB.");
      formRef.current.value = null;
    } else if (ext.toLowerCase() !== "pdf") {
      setMessage("Only PDF files are allowed");
      formRef.current.value = null;
    } else {
      setMessage("");
      setSelectedFile(e.target.files[0]);
    }
  };

  const onClickHandler = () => {
    const data = new FormData();
    data.append("file", selectedFile);
    axios
      .post(`${helper}/api/uploadpdf`, data, {
        // receive two    parameter endpoint url ,form data
      })
      .then((res) => {
        // then print response status

        console.log(res.statusText);
      });
    setFileUploaded(selectedFile.name);
    setSelectedFile(null);
    formRef.current.value = null;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    axios.get(`${helper}/logout`);
  };

  return (
    <div className="user-home">
      {token ? (
        <>
          <div>
            <div className="logout">
              <a href="/" onClick={handleLogout}>
                Log Out
              </a>
            </div>
            <div className="pdf-uploading">
              <label htmlFor="file-upload" className="custom-file-upload">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/568/568717.png"
                  alt=""
                />{" "}
                {selectedFile ? <>{selectedFile.name}</> : <>Custom Upload</>}
              </label>
              <input
                type="file"
                name="file"
                onChange={handelPDFChange}
                accept=".pdf"
                required
                ref={formRef}
                id="file-upload"
              />
              <button
                type="button"
                onClick={onClickHandler}
                disabled={!selectedFile}
              >
                Upload
              </button>
              <div className="pdf-err-msg">{message}</div>
            </div>
            <FetchedData newFile={selectedFile} fileUploaded={fileUploaded} />
          </div>
        </>
      ) : (
        <>
          <div className="user-sign-page">
            <a href={`/signUp`}>SignUp</a>
            <a href={`/signIn`}>Log In</a>
          </div>
        </>
      )}
    </div>
  );
}

export default UserHome;
