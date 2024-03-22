import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./components/App";

function onLoad() {
  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement!);

  root.render(<App />);
}

window.addEventListener("load", onLoad);
