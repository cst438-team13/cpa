import { Loading3QuartersOutlined } from "@ant-design/icons";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, Flex, Spin } from "antd";
import React, { Suspense, useEffect } from "react";
import {
  RouterProvider,
  createBrowserRouter,
  useNavigate,
} from "react-router-dom";
import { useCurrentUserProfile } from "../hooks/useCurrentUserProfile";
import { CreateAccountPage } from "./pages/CreateAccountPage";
import { CreatePetPage } from "./pages/CreatePetPage";
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
      element: (
        <RequireAuth Component={HomePage} FallbackComponent={LandingPage} />
      ),
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
      element: <RequireAuth Component={ManageAccountPage} />,
    },
    {
      path: "/profile/:id",
      element: <RequireAuth Component={ProfilePage} />,
    },
    {
      path: "/createPet",
      element: <RequireAuth Component={CreatePetPage} />,
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

/**
 * Prevents routes from being accessed if not logged in.
 */
function RequireAuth({
  Component,
  FallbackComponent,
}: {
  Component: React.FC;
  FallbackComponent?: React.FC;
}) {
  const user = useCurrentUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (user == null && !FallbackComponent) {
      navigate("/");
    }
  }, [user, FallbackComponent]);

  if (user == null) {
    return FallbackComponent == null ? null : <FallbackComponent />;
  }

  return <Component />;
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
