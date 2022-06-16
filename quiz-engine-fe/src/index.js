import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import 'antd/dist/antd.min.css';
import App from "./App";
import {BrowserRouter} from "react-router-dom";
import {UserContextProvider} from "./context/userContext";
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <UserContextProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </UserContextProvider>
  </BrowserRouter>
);
