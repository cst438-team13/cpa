import { ConfigProvider } from "antd";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SessionInfoProvider } from "./hooks/useSessionInfo";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";

function onLoad() {
  const rootElement = document.getElementById("root");
  const root = ReactDOM.createRoot(rootElement!);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
  ]);

  root.render(
    <StrictMode>
      <ConfigProvider>
        <SessionInfoProvider>
          <RouterProvider router={router} />
        </SessionInfoProvider>
      </ConfigProvider>
    </StrictMode>
  );
}

window.addEventListener("load", onLoad);
