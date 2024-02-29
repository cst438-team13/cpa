import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

function onLoad() {
  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement!);

  root.render(
    <StrictMode>
      <RouterProvider
        router={createBrowserRouter([
          {
            path: "/",
            element: <LandingPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
        ])}
      />
    </StrictMode>
  );
}

window.addEventListener("load", onLoad);
