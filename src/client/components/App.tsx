import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider } from "antd";
import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ManageAccountPage } from "./pages/ManageAccountPage";

const queryClient = new QueryClient();

export function App() {
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

  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="564916212911-csikdeti37k8tm5uik4kqtc9rgk3a1iv.apps.googleusercontent.com">
          <RouterProvider router={router} />
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}
