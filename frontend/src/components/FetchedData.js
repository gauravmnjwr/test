import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import helper from "./helper/helper";

function FetchedData({ encodeURL, fileUploaded }) {
  const [files, setFiles] = useState([]);
  const [query, setQuery] = useState("");
  const [searchFiles, setSearchFiles] = useState([]);

  const navigate = useNavigate();

  const fetchFiles = async () => {
    const { data } = await axios.get(`${helper}/allpdfs`);
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  });

  useEffect(() => {
    fetchFiles();
  }, [fileUploaded]);

  const handleClick = (id) => {
    console.log(navigate);
    navigate(`/pdf/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${helper}/delete/${id}`);
      console.log("PDF deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchQuery = () => {
    if (!query) {
      setSearchFiles("");
    }
    const renderedData = files.filter((e, i) => {
      return e.name.toLowerCase().includes(query.toLowerCase());
    });
    setSearchFiles(renderedData);
  };

  return (
    <div>
      <form
        action=""
        onSubmit={(e) => e.preventDefault()}
        className="search-box"
      >
        <input
          type="text"
          name="search"
          id=""
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearchQuery}>Search</button>
      </form>
      <div className="fetched-data">
        {query ? (
          <>
            {searchFiles.map((k, i) => {
              return (
                <div key={i} className="pdf-main">
                  <div className="pdf-image">
                    {" "}
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/136/136522.png"
                      alt="PDF"
                    />
                  </div>
                  <div className="pdf-info">
                    <div className="pdf-name">{k.name}</div>
                    <div className="pdf-links">
                      <div>
                        <div
                          style={{ cursor: "pointer", color: "#3d5af1" }}
                          onClick={() => handleClick(k._id)}
                        >
                          Open
                        </div>{" "}
                      </div>
                      <div>
                        <div
                          style={{ cursor: "pointer", color: "#3d5af1" }}
                          onClick={() => handleDelete(k._id)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <>
            {files.map((k, i) => {
              return (
                <div key={i} className="pdf-main">
                  <div className="pdf-image">
                    {" "}
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/136/136522.png"
                      alt="PDF"
                    />
                  </div>
                  <div className="pdf-info">
                    <div className="pdf-name">{k.name}</div>
                    <div className="pdf-links">
                      <div>
                        <div
                          style={{ cursor: "pointer", color: "#3d5af1" }}
                          onClick={() => handleClick(k._id)}
                        >
                          Open
                        </div>{" "}
                      </div>
                      <div>
                        <div
                          style={{ cursor: "pointer", color: "#3d5af1" }}
                          onClick={() => handleDelete(k._id)}
                        >
                          Delete
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default FetchedData;
