import React, { StrictMode } from "react";
import ReactDOMClient from "react-dom/client";
import nullthrows from "nullthrows";
import { LandingPage } from "./pages/LandingPage";

function main() {
  const domRoot = document.getElementById("root");
  const reactRoot = ReactDOMClient.createRoot(nullthrows(domRoot));

  reactRoot.render(
    <StrictMode>
      <LandingPage />
    </StrictMode>
  );
}

main();
