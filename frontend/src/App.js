import { useEffect, useState } from "react";
import FormSignUp from "./components/FormSignUp";
import FormSignIn from "./components/FormSignIn";
import UserHome from "./components/UserHome";
import ViewPDF from "./components/ViewPDF";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SharePdf from "./components/SharePdf";

function App() {
  const [token, setToken] = useState("");

  // const [file, setFile] = useState(null);

  // const encodeURL = (url) => {
  //   // console.log(url);
  //   setFile(url);
  // };

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const tokenChange = (query) => {
    if (query === "R") {
      setToken("");
      localStorage.removeItem("token");
    } else {
      setToken(localStorage.getItem("token"));
    }
  };

  return (
    <div className="App">
      <Router basename="/">
        <Routes>
          <Route
            path="/"
            element={<UserHome token={token} tokenChange={tokenChange} />}
          />

          <Route
            path="/signUp"
            element={
              token ? (
                <UserHome token={token} tokenChange={tokenChange} />
              ) : (
                <FormSignUp token={token} tokenChange={tokenChange} />
              )
            }
          />
          <Route
            path="/signIn"
            element={
              token ? (
                <UserHome token={token} tokenChange={tokenChange} />
              ) : (
                <FormSignIn token={token} tokenChange={tokenChange} />
              )
            }
          />
          <Route path="/pdf/:id" element={<ViewPDF />} />
          <Route path="/pdf/shared/:id" element={<SharePdf />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
