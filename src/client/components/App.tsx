import { Loading3QuartersOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Flex, Spin } from "antd";
import React, { Suspense } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { HomePage } from "./pages/HomePage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { ManageAccountPage } from "./pages/ManageAccountPage";
import { ProfilePage } from "./pages/ProfilePage";

const queryClient = new QueryClient();

export function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: React.createElement(() => {
        const user = useCurrentUserProfile();
        return user == null ? <LandingPage /> : <HomePage />;
      }),
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
    {
      path: "/profilePage",
      element: <ProfilePage />,
    },
  ]);

  return (
    <ConfigProvider>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId="564916212911-csikdeti37k8tm5uik4kqtc9rgk3a1iv.apps.googleusercontent.com">
          <Suspense fallback={<SuspenseLoadingSpinner />}>
            <RouterProvider router={router} />
          </Suspense>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
}

function SuspenseLoadingSpinner() {
  return (
    <Flex
      style={{ width: "100%", height: "100%" }}
      align="center"
      justify="center"
    >
      <Spin
        indicator={<Loading3QuartersOutlined style={{ fontSize: 32 }} spin />}
      />
    </Flex>
  );
}
