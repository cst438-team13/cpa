import { ConfigProvider } from "antd";
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { rpcClient } from "typed-rpc";
import type { APIService } from "../server/server";
import { LoggedInUserProvider } from "./hooks/useLoggedInUser";
import { SessionInfoProvider } from "./hooks/useSessionInfo";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ManageAccountPage } from "./pages/ManageAccountPage";

export const API = rpcClient<APIService>("http://localhost:3000/api/rpc");

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
    {
      path: "/register",
      element: <CreateAccountPage />,
    },
    {
      path: "/manageAccount",
      element: <ManageAccountPage />,
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
