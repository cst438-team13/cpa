import { ConfigProvider } from "antd";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LoggedInUserProvider } from "./hooks/useLoggedInUser";
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
          <LoggedInUserProvider>
            <RouterProvider router={router} />
          </LoggedInUserProvider>
        </SessionInfoProvider>
      </ConfigProvider>
    </StrictMode>
  );
}

window.addEventListener("load", onLoad);
